/**
 * GET /api/draft-mode/disable?redirect=/de/ (preview build only).
 * Removes the draft-mode cookie and goes back to the page, now showing published content.
 */
import type { APIRoute } from 'astro';
import { disableDraftMode, safeRedirectPath } from '../../lib/draft-mode';

export const GET: APIRoute = ({ url, cookies, redirect }) => {
  disableDraftMode(cookies);
  return redirect(safeRedirectPath(url.searchParams.get('redirect')), 307);
};
