/**
 * DotFactory
 *
 * Factory functions for creating DotEntity instances from various data sources.
 * These bridge the current implementation to the new entity-based architecture.
 */

import {
  DotEntity,
  DotEntityInput,
  DotContent,
  DotColorState,
  DotState,
  DOT_DEFAULTS,
} from './Dot';
import { Vector2D, GridPosition, gridToWorld } from './types';

/**
 * Interpolate between two hex colors
 */
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Turrell-Anderson color palette (imported from TurrellAndersonCard in production)
 * Duplicated here to avoid circular dependencies
 */
const PALETTE = {
  skyfall: "#A8D5E5",
  dawnGlow: "#FFB7A5",
  violetHour: "#C9A7EB",
  dustyRose: "#D4A5A5",
  mustardPress: "#E8B84A",
  seaFoam: "#98D4BB",
  warmIvory: "#FBF7F0",
} as const;

/**
 * Row color zones for Turrell-style position-based coloring
 */
const ROW_COLOR_ZONES = [
  { primary: PALETTE.skyfall, secondary: PALETTE.violetHour },
  { primary: PALETTE.violetHour, secondary: PALETTE.dustyRose },
  { primary: PALETTE.dustyRose, secondary: PALETTE.dawnGlow },
  { primary: PALETTE.dawnGlow, secondary: PALETTE.mustardPress },
  { primary: PALETTE.mustardPress, secondary: PALETTE.seaFoam },
];

/**
 * Calculate color based on grid position (Turrell-style)
 */
export const getPositionColor = (row: number, col: number, totalCols: number = 5): string => {
  const safeRow = Math.min(row, ROW_COLOR_ZONES.length - 1);
  const zone = ROW_COLOR_ZONES[safeRow];
  const colFactor = col / (totalCols - 1);
  return interpolateColor(zone.primary, zone.secondary, colFactor);
};

/**
 * Get glow color for a position (shifted to next row's primary)
 */
export const getGlowColor = (row: number): string => {
  const nextRow = Math.min(row + 1, ROW_COLOR_ZONES.length - 1);
  return ROW_COLOR_ZONES[nextRow].primary;
};

/**
 * Create a DotEntity ID from grid position
 */
export const createDotId = (row: number, col: number, prefix?: string): string => {
  return prefix ? `${prefix}-${row}-${col}` : `${row}-${col}`;
};

/**
 * Parse a dot ID back to grid position
 */
export const parseDotId = (id: string): { row: number; col: number; prefix?: string } => {
  const parts = id.split('-');
  if (parts.length === 2) {
    return { row: parseInt(parts[0]), col: parseInt(parts[1]) };
  }
  // Has prefix (e.g., "overflow-3-2")
  return {
    prefix: parts[0],
    row: parseInt(parts[1]),
    col: parseInt(parts[2]),
  };
};

/**
 * Create a DotEntity with minimal input
 */
export const createDot = (input: DotEntityInput): DotEntity => {
  const { id, gridPosition, content = null, color, value = 1 } = input;
  const { row, col } = gridPosition;

  // Calculate position-based colors
  const baseColor = getPositionColor(row, col);
  const glowColor = getGlowColor(row);

  const colorState: DotColorState = {
    base: color?.base ?? baseColor,
    hover: color?.hover ?? PALETTE.warmIvory,
    glow: color?.glow ?? glowColor,
    current: color?.current ?? baseColor,
  };

  const worldPosition = gridToWorld(gridPosition);

  return {
    id,
    gridPosition,
    worldPosition,
    targetPosition: { ...worldPosition },

    color: colorState,
    visual: { ...DOT_DEFAULTS.visual },
    physics: { ...DOT_DEFAULTS.physics },

    state: 'idle',
    previousState: 'idle',

    content,
    collection: {
      ...DOT_DEFAULTS.collection,
      value,
      collectible: content !== null, // Only dots with content are collectible
    },

    createdAt: new Date(),
    lastInteraction: null,
  };
};

/**
 * Create a dot for grid content (About, Companies, etc.)
 */
export const createGridDot = (
  row: number,
  col: number,
  contentKey: string,
  options?: {
    prefix?: string;
    type?: DotContent['type'];
    url?: string;
  }
): DotEntity => {
  const { prefix, type = 'navigation', url } = options ?? {};
  const id = createDotId(row, col, prefix);

  const content: DotContent = {
    key: contentKey,
    label: contentKey,
    type,
    url,
  };

  return createDot({
    id,
    gridPosition: { row, col },
    content,
  });
};

/**
 * Create a dot for an artist (Ancient Technology show)
 */
export const createArtistDot = (
  row: number,
  col: number,
  artist: {
    artistName: string;
    slug: string;
    isSpecialLink?: boolean;
    linkType?: string;
    url?: string;
  }
): DotEntity => {
  const id = artist.slug;

  // Handle special link dots (Subscribe, Instagram)
  if (artist.isSpecialLink) {
    const content: DotContent = {
      key: artist.slug,
      label: artist.artistName,
      type: 'special',
      url: artist.url,
    };

    return createDot({
      id,
      gridPosition: { row, col },
      content,
      value: 2, // Special dots worth more
    });
  }

  // Regular artist dot
  const artistSlug = artist.artistName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const content: DotContent = {
    key: artist.slug,
    label: artist.artistName,
    type: 'artist',
    url: `/events/ancient-technology/${artistSlug}`,
  };

  return createDot({
    id,
    gridPosition: { row, col },
    content,
    value: 5, // Artist dots worth more
  });
};

/**
 * Create an empty dot (no content, not collectible)
 */
export const createEmptyDot = (row: number, col: number, prefix?: string): DotEntity => {
  const id = createDotId(row, col, prefix);

  return createDot({
    id,
    gridPosition: { row, col },
    content: null,
    value: 0,
  });
};

/**
 * Create a full grid of dots from content arrays
 */
export const createDotGrid = (
  gridContent: string[][],
  options?: {
    rowOffset?: number;
    prefix?: string;
    contentType?: DotContent['type'];
  }
): DotEntity[][] => {
  const { rowOffset = 0, prefix, contentType = 'navigation' } = options ?? {};

  return gridContent.map((row, rowIndex) =>
    row.map((content, colIndex) => {
      if (!content) {
        return createEmptyDot(rowIndex + rowOffset, colIndex, prefix);
      }
      return createGridDot(rowIndex + rowOffset, colIndex, content, {
        prefix,
        type: contentType,
      });
    })
  );
};

/**
 * Create artist grid from ancient technology data
 */
export const createArtistGrid = (
  artists: Array<{
    artistName: string;
    slug: string;
    isSpecialLink?: boolean;
    linkType?: string;
    url?: string;
  }>,
  cols: number = 5
): DotEntity[][] => {
  const rows: DotEntity[][] = [];
  let currentRow: DotEntity[] = [];

  artists.forEach((artist, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (col === 0 && index !== 0) {
      rows.push(currentRow);
      currentRow = [];
    }

    currentRow.push(createArtistDot(row, col, artist));
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

/**
 * Update dot state (returns new instance)
 */
export const updateDotState = (dot: DotEntity, newState: DotState): DotEntity => ({
  ...dot,
  previousState: dot.state,
  state: newState,
  lastInteraction: new Date(),
});

/**
 * Update dot visual properties (returns new instance)
 */
export const updateDotVisual = (
  dot: DotEntity,
  visual: Partial<DotEntity['visual']>
): DotEntity => ({
  ...dot,
  visual: { ...dot.visual, ...visual },
});

/**
 * Mark a dot as collected (returns new instance)
 */
export const collectDot = (
  dot: DotEntity,
  sessionId: string,
  source: DotEntity['collection']['source']
): DotEntity => ({
  ...dot,
  state: 'collected',
  previousState: dot.state,
  collection: {
    ...dot.collection,
    collectedBy: sessionId,
    collectedAt: new Date(),
    source,
  },
});

/**
 * Find a dot by ID in a grid
 */
export const findDotById = (grid: DotEntity[][], id: string): DotEntity | null => {
  for (const row of grid) {
    for (const dot of row) {
      if (dot.id === id) return dot;
    }
  }
  return null;
};

/**
 * Flatten a dot grid to a single array
 */
export const flattenDotGrid = (grid: DotEntity[][]): DotEntity[] =>
  grid.flat();
