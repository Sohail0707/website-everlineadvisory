// @ts-check
import { defineConfig, envField } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import { loadEnv } from 'vite';
import previewMode from './src/preview/integration.mjs';

// astro.config runs before Astro loads .env, so read it ourselves (Netlify env vars win).
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is missing. Copy .env.example to .env.');

/**
 * One codebase, two build modes (README → "Two build modes"):
 * - SANITY_VISUAL_EDITING=true → server mode (what Netlify runs). Pages are rendered by a Netlify
 *   Function, then cached on Netlify's CDN, so visitors get cached HTML just like a static site.
 *   A Sanity publish purges that cache through a webhook: no rebuild per content change.
 *   The same deployment serves draft mode + Visual Editing to the Studio's Presentation tool.
 * - false → static mode: plain static HTML, published content only, no adapter, no React.
 *   For hosts without functions; content changes then need a rebuild.
 */
const visualEditing = env.SANITY_VISUAL_EDITING === 'true';

export default defineConfig({
  site: 'https://everlineadvisory.com',
  output: visualEditing ? 'server' : 'static',
  adapter: visualEditing ? netlify() : undefined,
  // No Astro sessions: draft mode uses its own signed cookie. (Otherwise the Netlify adapter
  // switches sessions on with a Netlify Blobs store we'd never use.)
  session: false,
  trailingSlash: 'ignore',
  build: {
    // Single-page site: inlining the (small) stylesheet removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  image: {
    // Keep generated images in the static build output (Netlify serves them from its CDN).
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  devToolbar: { enabled: false },
  env: {
    schema: {
      // Build mode flag, readable in code as `import { SANITY_VISUAL_EDITING } from 'astro:env/server'`.
      // "public" server variables are fixed at build time, which is what we want for a mode switch.
      SANITY_VISUAL_EDITING: envField.boolean({ context: 'server', access: 'public', default: false }),
      // Viewer token for draft content. `secret` = read at runtime on the server, never bundled.
      SANITY_API_READ_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Signs the draft-mode cookie (src/lib/draft-mode.ts).
      SANITY_PREVIEW_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Shared with the Sanity webhook that purges the CDN cache (src/preview/routes/revalidate.ts).
      SANITY_REVALIDATE_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Where stega links in Visual Editing point to (the deployed Studio).
      PUBLIC_SANITY_STUDIO_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost:3333',
      }),
    },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2025-02-19',
      // The published content is served from Sanity's CDN. loadQuery turns this off for drafts.
      useCdn: true,
    }),
    // React is only needed for the Visual Editing overlay, so static mode doesn't even load the integration.
    ...(visualEditing ? [react()] : []),
    previewMode({ visualEditing }),
  ],
});
