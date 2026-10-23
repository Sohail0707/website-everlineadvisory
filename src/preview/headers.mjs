// @ts-check
/**
 * Response headers, shared by the build (dist/_headers, see integration.mjs)
 * and the server (middleware.ts), so static files and server-rendered pages match.
 */

/** Security headers every response gets (were in netlify.toml before). */
export const COMMON_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Who may show the page in an iframe.
 * Public pages: nobody (clickjacking protection).
 * Draft-mode pages: only the Studio, because the Presentation tool shows the site in an iframe.
 * `frame-ancestors` is the modern replacement for X-Frame-Options, which can't name an origin,
 * so draft pages send only the CSP.
 *
 * @param {boolean} allowStudio
 * @param {string} studioOrigin
 * @returns {Record<string, string>}
 */
export function framingHeaders(allowStudio, studioOrigin) {
  if (!allowStudio) {
    return { 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'" };
  }
  return { 'Content-Security-Policy': `frame-ancestors 'self' ${studioOrigin}` };
}

/** Every cached page carries this tag; a Sanity publish purges it (routes/revalidate.ts). */
export const CACHE_TAG = 'sanity-content';

/**
 * Caching for public (published-content) pages, server mode only.
 * - Browsers: always ask the CDN again (max-age=0), so a purge reaches visitors immediately.
 * - Netlify CDN: keep the page for up to a year, until a Sanity publish purges the tag.
 *   `durable` shares one cached copy across all Netlify edge locations, so the function runs
 *   once per publish instead of once per location.
 * - Netlify-Vary: requests with a draft-mode cookie get their own cache key, so an editor's
 *   request can never be answered with (or overwrite) the visitors' cached page.
 *
 * @param {string} draftCookieName
 * @returns {Record<string, string>}
 */
export function publicCacheHeaders(draftCookieName) {
  return {
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000, stale-while-revalidate=86400',
    'Netlify-Cache-Tag': CACHE_TAG,
    'Netlify-Vary': `cookie=${draftCookieName}`,
  };
}
