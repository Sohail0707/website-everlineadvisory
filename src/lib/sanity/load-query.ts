/**
 * The one place the website fetches content from Sanity.
 *
 * - Normal visitors (and the whole static production build): published content only,
 *   from Sanity's CDN, no token, no stega.
 * - Draft mode (only possible on the preview deployment, after the Studio's Presentation tool
 *   has enabled it): draft content, fetched with the read token, with stega turned on so
 *   Visual Editing can map each text back to its field in the Studio.
 */
import type { QueryParams } from '@sanity/client';
import { sanityClient } from 'sanity:client';
import { getSecret } from 'astro:env/server';
import { PUBLIC_SANITY_STUDIO_URL } from 'astro:env/client';

interface LoadQueryOptions {
  query: string;
  params?: QueryParams;
  /** True only when the draft-mode cookie is set (see src/lib/draft-mode.ts). */
  draftMode?: boolean;
}

export async function loadQuery<QueryResult>({ query, params = {}, draftMode = false }: LoadQueryOptions) {
  if (!draftMode) {
    // Production path: plain published content, nothing hidden in the strings.
    const data = await sanityClient.fetch<QueryResult>(query, params, {
      perspective: 'published',
      useCdn: true,
      stega: false,
    });
    return { data };
  }

  // getSecret reads the token at request time, so it never ends up in the built files.
  const token = getSecret('SANITY_API_READ_TOKEN');
  if (!token) throw new Error('SANITY_API_READ_TOKEN is required to show drafts.');

  const data = await sanityClient.fetch<QueryResult>(query, params, {
    perspective: 'drafts',
    useCdn: false, // drafts are never cached on the CDN
    token,
    // Stega hides invisible "where did this text come from" markers inside each string.
    // Visual Editing reads them to make every text on the page clickable.
    stega: { enabled: true, studioUrl: PUBLIC_SANITY_STUDIO_URL },
  });
  return { data };
}
