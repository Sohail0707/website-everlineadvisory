/**
 * Gallery layout rules, kept separate from the markup so they are easy to read and test.
 *
 * Input: the chosen layout ("auto" | "grid" | "featured") and each photo's aspect ratio
 * (width / height, read from Sanity's asset metadata).
 * Output: a "plan": which arrangement to use, and the shape of every tile.
 *
 * Auto rules (from the brief):
 *   1 photo  -> full width
 *   2 photos -> side by side
 *   3 photos -> one large + two stacked. The large slot goes to the only landscape photo
 *               if there is exactly one, otherwise to the first photo.
 *   4 photos -> 2 × 2 grid
 * Portrait photos get a taller tile instead of being cropped to a landscape shape.
 */

export type GalleryLayout = 'auto' | 'grid' | 'featured';

/** Standard tile shapes (width / height). */
const LANDSCAPE = 3 / 2;
const PORTRAIT = 4 / 5;
const WIDE = 16 / 9;
const GRID = 4 / 3;

export function isPortrait(ratio: number) {
  return ratio < 0.9;
}
export function isLandscape(ratio: number) {
  return ratio > 1.1;
}

/** Keeps a ratio between "tall portrait" and "wide banner" so no tile gets extreme. */
function clampRatio(ratio: number) {
  return Math.min(Math.max(ratio, PORTRAIT), 21 / 9);
}

/** The shape a single photo gets when it stands on its own (also used on phones). */
function naturalTile(ratio: number) {
  if (isPortrait(ratio)) return PORTRAIT;
  if (isLandscape(ratio)) return LANDSCAPE;
  return 1;
}

export interface GalleryTile {
  /** Position of the photo in the editor's list (DOM order never changes). */
  index: number;
  /** Tile shape on tablet/desktop. `null` = the tile fills whatever space the grid gives it. */
  ratio: number | null;
  /** Tile shape on phones, where every gallery is one photo per row. */
  mobileRatio: number;
  /** Extra CSS class for placement, e.g. "is-large". */
  className?: string;
  /** Rough share of the content width this tile covers on desktop (for the `sizes` attribute). */
  widthShare: number;
}

export interface GalleryPlan {
  /** CSS modifier for the gallery container: gallery--one, --pair, --trio, --quad, --grid, --featured */
  variant: 'one' | 'pair' | 'trio' | 'quad' | 'grid' | 'featured';
  /** Value for `grid-template-columns`. */
  columns: string;
  tiles: GalleryTile[];
}

export function planGallery(layout: GalleryLayout, ratios: number[]): GalleryPlan {
  const count = ratios.length;
  const mobile = ratios.map(naturalTile);

  // One photo looks the same whatever the layout setting: full width, its own shape.
  if (count === 1) {
    const ratio = clampRatio(ratios[0]);
    return {
      variant: 'one',
      columns: '1fr',
      // A portrait photo at full width would be taller than the screen: the CSS narrows it.
      tiles: [{ index: 0, ratio, mobileRatio: mobile[0], className: isPortrait(ratio) ? 'is-narrow' : undefined, widthShare: isPortrait(ratio) ? 0.5 : 1 }],
    };
  }

  if (layout === 'grid') {
    // Equal tiles. Four photos make a 2 × 2 grid, otherwise one row.
    const perRow = count === 4 ? 2 : count;
    return {
      variant: 'grid',
      columns: `repeat(${perRow}, 1fr)`,
      tiles: ratios.map((_, index) => ({ index, ratio: GRID, mobileRatio: GRID, widthShare: 1 / perRow })),
    };
  }

  if (layout === 'featured') {
    // First photo as a wide banner, the others in one row underneath.
    const rest = count - 1;
    return {
      variant: 'featured',
      columns: `repeat(${rest}, 1fr)`,
      tiles: ratios.map((_, index) =>
        index === 0
          ? { index, ratio: WIDE, mobileRatio: LANDSCAPE, className: 'is-banner', widthShare: 1 }
          : { index, ratio: GRID, mobileRatio: GRID, widthShare: 1 / rest },
      ),
    };
  }

  // ----- auto -----

  if (count === 2) {
    // Column widths follow the photos' shapes, so both tiles end up the same height
    // and nothing needs cropping: a portrait photo simply gets a narrower, taller tile.
    const [a, b] = ratios.map(clampRatio);
    return {
      variant: 'pair',
      columns: `${a.toFixed(3)}fr ${b.toFixed(3)}fr`,
      tiles: [
        { index: 0, ratio: a, mobileRatio: mobile[0], widthShare: a / (a + b) },
        { index: 1, ratio: b, mobileRatio: mobile[1], widthShare: b / (a + b) },
      ],
    };
  }

  if (count === 3) {
    const landscapes = ratios.filter(isLandscape).length;
    const large = landscapes === 1 ? ratios.findIndex(isLandscape) : 0;
    const largeIsPortrait = isPortrait(ratios[large]);
    return {
      variant: 'trio',
      // A landscape large photo takes two thirds of the width, a portrait one half.
      columns: largeIsPortrait ? '1fr 1fr' : '2fr 1fr',
      tiles: ratios.map((_, index) =>
        index === large
          ? { index, ratio: largeIsPortrait ? PORTRAIT : 4 / 3, mobileRatio: mobile[index], className: 'is-large', widthShare: largeIsPortrait ? 0.5 : 0.67 }
          : // The two small tiles share the height of the large one (the grid sizes them).
            { index, ratio: null, mobileRatio: mobile[index], widthShare: largeIsPortrait ? 0.5 : 0.33 },
      ),
    };
  }

  // Four photos: 2 × 2. A row containing a portrait photo becomes a taller row.
  return {
    variant: 'quad',
    columns: '1fr 1fr',
    tiles: ratios.map((_, index) => {
      const rowStart = index < 2 ? 0 : 2;
      const rowHasPortrait = isPortrait(ratios[rowStart]) || isPortrait(ratios[rowStart + 1]);
      return { index, ratio: rowHasPortrait ? PORTRAIT : LANDSCAPE, mobileRatio: mobile[index], widthShare: 0.5 };
    }),
  };
}
