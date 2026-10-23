// @ts-check
/**
 * Security headers, shared by the build (dist/_headers, see integration.mjs)
 * and the preview server (middleware.ts), so static and server-rendered pages match.
 */

/** Headers both modes share (were in netlify.toml before). */
export const COMMON_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * The framing rule.
 * Production: nobody may put the site in an iframe (clickjacking protection).
 * Preview: only the Studio may, because the Presentation tool shows the site in an iframe.
 * (`frame-ancestors` is the modern replacement for X-Frame-Options, which can't list an origin.)
 *
 * @param {boolean} visualEditing
 * @param {string} studioOrigin
 * @returns {Record<string, string>}
 */
export function framingHeaders(visualEditing, studioOrigin) {
  if (!visualEditing) {
    return { 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'" };
  }
  return { 'Content-Security-Policy': `frame-ancestors 'self' ${studioOrigin}` };
}
