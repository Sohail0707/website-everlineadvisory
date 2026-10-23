/**
 * Every GROQ query the website runs. Sanity TypeGen reads this file and generates
 * a result type for each `defineQuery` (see sanity.types.ts, run `npm run typegen`).
 */
import { defineQuery } from 'groq';

/** Name, menu, footer and default SEO for one language. */
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && language == $lang][0]{
    name,
    tagline,
    email,
    copyright,
    nav[]{ _key, label, anchor },
    bookCta{ label, anchor },
    seoTitle,
    seoDescription
  }
`);

/** Slugs of every page in one language (used to pre-render the static site). */
export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && language == $lang && defined(slug.current)]{
    "slug": slug.current
  }
`);

/**
 * One page with all its blocks.
 * `...` keeps every field of a block; images additionally get their asset's size
 * (needed for width/height attributes and the gallery's auto layout).
 * `translations` lists the same page in the other languages, for hreflang and the language switcher.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && language == $lang && slug.current == $slug][0]{
    _id,
    title,
    language,
    "slug": slug.current,
    seo{
      title,
      description,
      ogImage{ asset->{ url } }
    },
    "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
      "lang": language,
      "slug": value->slug.current
    },
    pageBuilder[]{
      ...,
      _type == "heroBlock" => {
        image{ ..., asset->{ _id, url, metadata{ dimensions{ width, height, aspectRatio }, lqip } } }
      },
      _type == "galleryBlock" => {
        images[]{ ..., asset->{ _id, url, metadata{ dimensions{ width, height, aspectRatio }, lqip } } }
      }
    }
  }
`);
