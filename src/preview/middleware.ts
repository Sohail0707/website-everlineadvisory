/**
 * Server mode only (added by src/preview/integration.mjs). Decides, per response:
 * - public page  → cached on Netlify's CDN until the next Sanity publish
 * - draft mode   → never cached
 * - API routes   → never cached
 * Every response may be framed by the Studio only (see framingHeaders).
 * Netlify doesn't apply _headers / netlify.toml headers to server-rendered responses,
 * which is why this happens here.
 */
import { defineMiddleware } from 'astro:middleware';
import { PUBLIC_SANITY_STUDIO_URL } from 'astro:env/client';
import { COMMON_HEADERS, framingHeaders, publicCacheHeaders } from './headers.mjs';
import { DRAFT_MODE_COOKIE, isDraftMode } from '../lib/draft-mode';

const studioOrigin = new URL(PUBLIC_SANITY_STUDIO_URL).origin;

export const onRequest = defineMiddleware(async (context, next) => {
  // Pre-rendered pages (404, thanks) are plain files: their headers come from dist/_headers,
  // and there is no real request (or cookie) to look at during the build.
  if (context.isPrerendered) return next();

  const response = await next();
  // Some responses (e.g. redirects) have read-only headers: copy them into a new response first.
  const result = new Response(response.body, response);
  const set = (headers: Record<string, string>) => {
    for (const [name, value] of Object.entries(headers)) result.headers.set(name, value);
  };
  set(COMMON_HEADERS);
  set(framingHeaders(studioOrigin));

  const draftMode = isDraftMode(context.cookies);
  const isApi = context.url.pathname.startsWith('/api/');
  const isCacheablePage =
    !draftMode && !isApi && context.request.method === 'GET' && response.status === 200;

  if (isCacheablePage) {
    set(publicCacheHeaders(DRAFT_MODE_COOKIE));
  } else {
    // Drafts, redirects, errors and API calls must never be stored by the CDN.
    result.headers.set('Cache-Control', 'private, no-store');
  }
  return result;
});
