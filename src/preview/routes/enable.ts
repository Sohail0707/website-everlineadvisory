/**
 * GET /api/draft-mode/enable (preview build only; injected by src/preview/integration.mjs).
 *
 * The Studio's Presentation tool opens this URL in its iframe with a one-time secret.
 * We ask Sanity whether that secret is real (@sanity/preview-url-secret), then set the signed
 * draft-mode cookie and redirect to the page the editor wanted to see.
 */
import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { sanityClient } from 'sanity:client';
import { getSecret } from 'astro:env/server';
import { enableDraftMode, safeRedirectPath } from '../../lib/draft-mode';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const token = getSecret('SANITY_API_READ_TOKEN');
  if (!token) return new Response('SANITY_API_READ_TOKEN is not set', { status: 500 });

  // The secret is stored in the dataset as a draft document, so reading it needs the token.
  const client = sanityClient.withConfig({ token, useCdn: false });
  const { isValid, redirectTo } = await validatePreviewUrl(client, request.url);
  if (!isValid) return new Response('Invalid preview secret', { status: 401 });

  enableDraftMode(cookies);
  return redirect(safeRedirectPath(redirectTo), 307);
};
