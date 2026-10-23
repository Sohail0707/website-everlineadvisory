/**
 * Loads everything one page needs (page + site settings) for one language,
 * and works out the page's address in every language.
 * Shared by src/pages/[...slug].astro (English) and src/pages/de/[...slug].astro (German).
 */
import { stegaClean } from '@sanity/client/stega';
import { loadQuery } from './load-query';
import { PAGE_QUERY, PAGE_SLUGS_QUERY, SETTINGS_QUERY } from './queries';
import type { PAGE_QUERY_RESULT, PAGE_SLUGS_QUERY_RESULT, SETTINGS_QUERY_RESULT } from './sanity.types';
import { LANGUAGES, pagePath, type Lang, type LanguageLink } from '../i18n';

export async function loadPage(lang: Lang, slug: string, draftMode: boolean) {
  const params = { lang, slug };
  // Both requests run at the same time.
  const [page, settings] = await Promise.all([
    loadQuery<PAGE_QUERY_RESULT>({ query: PAGE_QUERY, params, draftMode }),
    loadQuery<SETTINGS_QUERY_RESULT>({ query: SETTINGS_QUERY, params, draftMode }),
  ]);
  if (!page.data || !settings.data) return null;

  // The same page in every language. If a translation doesn't exist yet,
  // link to that language's home page instead.
  const translations = page.data.translations ?? [];
  const languages: LanguageLink[] = LANGUAGES.map((l) => {
    const translation = translations.find((t) => stegaClean(t.lang) === l.id);
    return {
      lang: l.id,
      label: l.label,
      name: l.name,
      href: pagePath(translation ? stegaClean(translation.slug) : 'home', l.id),
      current: l.id === lang,
    };
  });

  return { page: page.data, settings: settings.data, languages };
}

/**
 * Pages to pre-render for one language in the static build, except the home page
 * (which has its own route, index.astro).
 */
export async function staticPaths(lang: Lang) {
  const { data } = await loadQuery<PAGE_SLUGS_QUERY_RESULT>({ query: PAGE_SLUGS_QUERY, params: { lang } });
  return data
    .filter((page) => page.slug && page.slug !== 'home')
    .map((page) => ({ params: { slug: page.slug! } }));
}
