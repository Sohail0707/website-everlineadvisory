/**
 * Preview build only (added by src/preview/integration.mjs).
 * Netlify doesn't apply _headers / netlify.toml headers to server-rendered responses,
 * so the server sets them itself, using the same values as dist/_headers.
 */
import { defineMiddleware } from 'astro:middleware';
import { PUBLIC_SANITY_STUDIO_URL } from 'astro:env/client';
import { COMMON_HEADERS, framingHeaders } from './headers.mjs';
import { isDraftMode } from '../lib/draft-mode';

const headers: Record<string, string> = {
  ...COMMON_HEADERS,
  // Allow framing by the Studio only (Presentation tool). Production keeps X-Frame-Options: DENY.
  ...framingHeaders(true, new URL(PUBLIC_SANITY_STUDIO_URL).origin),
};

export const onRequest = defineMiddleware(async (context, next) => {
  // Pre-rendered pages (404, thanks) are plain files: their headers come from dist/_headers,
  // and there is no real request (or cookie) to look at during the build.
  if (context.isPrerendered) return next();

  const response = await next();
  // Some responses (e.g. redirects) have read-only headers: copy them into a new response first.
  const result = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers)) result.headers.set(name, value);
  // Draft content must never be stored by a CDN or shared cache.
  if (isDraftMode(context.cookies)) result.headers.set('Cache-Control', 'private, no-store');
  return result;
});
