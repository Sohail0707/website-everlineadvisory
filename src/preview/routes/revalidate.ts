/**
 * POST /api/revalidate (server mode only; injected by src/preview/integration.mjs).
 *
 * Called by a Sanity webhook whenever a page or the site settings are published, changed or
 * deleted. It checks the webhook's signature, then tells Netlify to drop every cached page.
 * The next visitor gets a freshly rendered page, which is cached again. No build needed.
 *
 * One tag for the whole site is deliberate: the site has a handful of pages that all share the
 * site settings, so "purge everything" is both correct and simplest.
 */
import type { APIRoute } from 'astro';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { purgeCache } from '@netlify/functions';
import { getSecret } from 'astro:env/server';
import { CACHE_TAG } from '../headers.mjs';

export const POST: APIRoute = async ({ request }) => {
  const secret = getSecret('SANITY_REVALIDATE_SECRET');
  if (!secret) return Response.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 });

  // Verify against the raw body text, exactly as Sanity signed it (not re-encoded JSON).
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? '';
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json({ message: 'Invalid signature' }, { status: 401 });
  }

  try {
    // Inside a Netlify Function the site is detected automatically; no token needed.
    await purgeCache({ tags: [CACHE_TAG] });
  } catch (error) {
    // e.g. running locally with `astro dev`, where there is no Netlify cache to purge.
    return Response.json({ message: 'Signature OK, but the purge failed', error: String(error) }, { status: 502 });
  }
  return Response.json({ message: `Purged "${CACHE_TAG}"` });
};
