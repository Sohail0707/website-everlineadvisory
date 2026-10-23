/**
 * Friendly names for the generated Sanity types (sanity.types.ts is generated: don't edit it).
 *
 * Every field from Sanity is typed as optional (`heading?: string`), because the Studio
 * can't guarantee a field is filled until a document passes validation. Components therefore
 * fall back to '' or [] where a value is missing.
 */
import type { PAGE_QUERY_RESULT, SETTINGS_QUERY_RESULT } from './sanity.types';

export type PageData = NonNullable<PAGE_QUERY_RESULT>;
export type SettingsData = NonNullable<SETTINGS_QUERY_RESULT>;

/** One item of the page builder: any of the block types. */
export type Block = NonNullable<PageData['pageBuilder']>[number];

// `Extract` picks the one block type whose `_type` matches.
export type HeroBlockData = Extract<Block, { _type: 'heroBlock' }>;
export type AboutBlockData = Extract<Block, { _type: 'aboutBlock' }>;
export type ServiceBlockData = Extract<Block, { _type: 'serviceBlock' }>;
export type GalleryBlockData = Extract<Block, { _type: 'galleryBlock' }>;
export type BookingBlockData = Extract<Block, { _type: 'bookingBlock' }>;
export type FaqBlockData = Extract<Block, { _type: 'faqBlock' }>;
export type ContactBlockData = Extract<Block, { _type: 'contactBlock' }>;
