// @ts-check
import { defineConfig, envField } from 'astro/config';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

// astro.config runs before Astro loads .env, so read it ourselves (Netlify env vars win).
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is missing. Copy .env.example to .env.');

export default defineConfig({
  site: 'https://everlineadvisory.com',
  output: 'static',
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
      // Viewer token for draft content. `secret` = read at runtime on the server, never bundled.
      SANITY_API_READ_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
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
  ],
});
