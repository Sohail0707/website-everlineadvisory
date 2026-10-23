/**
 * Draft mode = "show unpublished changes with click-to-edit".
 * Only possible on the server-rendered preview deployment. The static production build has no
 * request to read a cookie from, so it is always off there.
 */
import type { AstroCookies } from 'astro';

export function isDraftMode(_cookies: AstroCookies) {
  return false;
}
