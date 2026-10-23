/**
 * Image helpers for Sanity's image CDN (cdn.sanity.io).
 * The CDN resizes, crops and converts on the fly, so we only build URLs here.
 */
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { stegaClean } from '@sanity/client/stega';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

/**
 * URL builder for one image. `auto('format')` makes the CDN send AVIF or WebP
 * to browsers that support them (and JPEG/PNG to the rest).
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format');
}

/**
 * A `srcset` string like "…?w=640 640w, …?w=960 960w".
 * Pass `aspectRatio` (width / height) to crop every size to the same shape:
 * the CDN then uses the editor's hotspot to decide what stays in frame.
 */
export function buildSrcset(source: SanityImageSource, widths: number[], aspectRatio?: number) {
  return widths
    .map((width) => {
      let url = urlFor(source).width(width);
      if (aspectRatio) url = url.height(Math.round(width / aspectRatio)).fit('crop');
      return `${url.url()} ${width}w`;
    })
    .join(', ');
}

/**
 * CSS object-position from the editor's hotspot, e.g. "30% 20%".
 * Used when the browser crops the image with `object-fit: cover` (the hero),
 * so the important part of the photo stays visible at every screen size.
 */
export function hotspotPosition(hotspot: { x?: number; y?: number } | null | undefined) {
  if (!hotspot || hotspot.x === undefined || hotspot.y === undefined) return 'center';
  // Hotspot values can carry stega in draft mode: clean them before maths.
  const x = stegaClean(hotspot.x);
  const y = stegaClean(hotspot.y);
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}

/**
 * Hero image sizes (same as the old astro:assets <Picture>). Shared by Hero.astro and the
 * <link rel="preload"> in the page head, so the browser preloads exactly the file it will use.
 */
export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000];
export const HERO_SIZES = '(min-width: 840px) 64vw, 185vw';
