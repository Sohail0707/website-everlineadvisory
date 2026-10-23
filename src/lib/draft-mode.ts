/**
 * Draft mode = "show unpublished changes with click-to-edit".
 *
 * Only possible in the server-rendered preview build. In the static production build there is no
 * request to read a cookie from, so it is always off (and the cookie is never even looked at).
 *
 * The cookie is signed: its value is "<expiry>.<signature>". Without the signature anyone could
 * set "draft-mode=1" by hand and read unpublished content through our read token.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies, AstroCookieSetOptions } from 'astro';
import { SANITY_VISUAL_EDITING, getSecret } from 'astro:env/server';

export const DRAFT_MODE_COOKIE = 'everline-draft-mode';
const MAX_AGE_SECONDS = 60 * 60 * 8; // one working day

/**
 * Cookie settings. The Studio shows the site inside an iframe on a different site
 * (*.sanity.studio), which makes our cookie a "third-party" cookie there:
 * - SameSite=None: otherwise the browser doesn't send it inside the iframe at all.
 * - Secure: required by browsers for SameSite=None.
 * - Partitioned (CHIPS): Safari and Chrome block plain third-party cookies; a partitioned cookie
 *   is allowed because it is stored separately for "our site inside the Studio".
 * - HttpOnly: page scripts never need to read it.
 */
export const DRAFT_MODE_COOKIE_OPTIONS: AstroCookieSetOptions = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  partitioned: true,
};

function sign(value: string) {
  const secret = getSecret('SANITY_PREVIEW_SECRET');
  if (!secret) throw new Error('SANITY_PREVIEW_SECRET is required in the preview build.');
  return createHmac('sha256', secret).update(value).digest('hex');
}

/** Turns draft mode on for this browser. */
export function enableDraftMode(cookies: AstroCookies) {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  cookies.set(DRAFT_MODE_COOKIE, `${expires}.${sign(expires)}`, {
    ...DRAFT_MODE_COOKIE_OPTIONS,
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Turns draft mode off. The options must match the ones it was set with, or the browser keeps it. */
export function disableDraftMode(cookies: AstroCookies) {
  cookies.delete(DRAFT_MODE_COOKIE, DRAFT_MODE_COOKIE_OPTIONS);
}

export function isDraftMode(cookies: AstroCookies) {
  // Static production build: decided at build time, the cookie is never read.
  if (!SANITY_VISUAL_EDITING) return false;

  const value = cookies.get(DRAFT_MODE_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;

  // Compare in constant time so the signature can't be guessed byte by byte.
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Only allow redirects to a path on this site (never to another domain). */
export function safeRedirectPath(path: string | null | undefined) {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}
