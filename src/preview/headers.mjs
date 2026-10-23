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
 * Who may show the site in an iframe: only the site itself and the Sanity Studio
 * (the Presentation tool shows the site in an iframe). Every other site is blocked, which is
 * the clickjacking protection X-Frame-Options: DENY used to give.
 *
 * Why on every page and not only in draft mode: the Studio's first request has no draft cookie
 * yet. If that response forbids framing, the browser shows "refused to connect" before draft
 * mode can even start. X-Frame-Options can't name an allowed origin, so only the CSP is sent.
 *
 * www.sanity.io is listed too: a deployed Studio is usually opened inside Sanity's dashboard
 * (www.sanity.io/@org/studio/…), and the browser checks *every* parent frame, not just the Studio.
 *
 * @param {string} studioOrigin
 * @returns {Record<string, string>}
 */
export function framingHeaders(studioOrigin) {
  return { 'Content-Security-Policy': `frame-ancestors 'self' ${studioOrigin} https://www.sanity.io` };
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
