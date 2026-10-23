import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/** Where a page lives on the website. Must match the routes in src/pages/. */
export function pagePath(slug: string | undefined, language: string | undefined) {
  const prefix = language && language !== 'en' ? `/${language}` : ''
  if (!slug || slug === 'home') return `${prefix}/`
  return `${prefix}/${slug}/`
}

/**
 * Tells the Presentation tool which URL(s) show a document,
 * so "Used on" links in the editor open the right page (English or German).
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current', language: 'language'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Untitled', href: pagePath(doc?.slug, doc?.language)}],
      }),
    }),
    // Site settings show up on every page; point editors at both home pages.
    siteSettings: defineLocations({
      select: {language: 'language'},
      resolve: (doc) => ({
        message: 'Used on every page in this language',
        locations: [{title: 'Home', href: pagePath('home', doc?.language)}],
      }),
    }),
  },
}
