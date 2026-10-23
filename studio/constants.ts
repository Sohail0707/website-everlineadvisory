/**
 * Fixed lists the Studio and the website must agree on.
 * If you change one of these, change the matching code in the website too
 * (see the comment next to each list).
 */

/** Site languages. The first one is the default and is served at `/`. */
export const LANGUAGES = [
  {id: 'en', title: 'English'},
  {id: 'de', title: 'Deutsch'},
]

/** Must match the components in src/components/illustrations/ (ServiceSection.astro). */
export const ILLUSTRATIONS = [
  {title: 'Data room (fundraising)', value: 'data-room'},
  {title: 'Monthly close (reporting)', value: 'monthly-close'},
  {title: 'Board deck', value: 'board-deck'},
]

/** Must match the icon names in src/components/Icon.astro. */
export const ICONS = [
  {title: 'Award', value: 'award'},
  {title: 'Briefcase', value: 'briefcase'},
  {title: 'Document with tick', value: 'file-check'},
  {title: 'Map pin', value: 'map-pin'},
]

/** Gallery layouts. Must match GalleryBlock.astro. */
export const GALLERY_LAYOUTS = [
  {title: 'Auto (based on the number and shape of images)', value: 'auto'},
  {title: 'Grid (equal tiles)', value: 'grid'},
  {title: 'Featured (first image large)', value: 'featured'},
]

/** Section ids are lowercase words joined by dashes, so they work in a URL (#about). */
export const ANCHOR_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
