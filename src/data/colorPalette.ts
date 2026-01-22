/**
 * Color Palette Data
 *
 * Turrell-Anderson inspired color definitions and mappings.
 * Extracted from AnimatedGrid.tsx for reusability.
 */

import type { ContentKey } from './gridContent';

/**
 * Core color palette - Turrell-Anderson inspired
 */
export const colorPalette = {
  perceptualViolet: "#7B5EEA",
  celestialBlue: "#7CD7FF",
  infraPink: "#FF69B4",
  midnightIndigo: "#1A1B4B",
  horizonPeach: "#FFDAB9",
  atmosphericWhite: "#FFFFFF",
  luminalAmber: "#FFA500",
  pastelGreen: "#B6F5C9",
} as const;

export type ColorKey = keyof typeof colorPalette;

/**
 * Complementary color mappings for UI elements (buttons, hover states)
 */
export const complementaryColors: Record<ColorKey, ColorKey> = {
  perceptualViolet: "luminalAmber",
  celestialBlue: "perceptualViolet",
  infraPink: "midnightIndigo",
  midnightIndigo: "celestialBlue",
  horizonPeach: "infraPink",
  atmosphericWhite: "perceptualViolet",
  luminalAmber: "midnightIndigo",
  pastelGreen: "infraPink",
};

/**
 * Map content items to their associated colors
 */
export const contentColorMap: Record<ContentKey, ColorKey> = {
  // Row 0 - Navigation
  About: "perceptualViolet",
  Companies: "celestialBlue",
  Residency: "infraPink",
  Grants: "pastelGreen",
  Contributors: "horizonPeach",
  Subscribe: "luminalAmber",

  // Row 1 - Content
  "Quarantine Dreams": "luminalAmber",
  "Dancing Monkey": "perceptualViolet",
  "Power to the People": "celestialBlue",
  "Experiments in Reincarnation": "infraPink",
  "Made You Think": "pastelGreen",

  // Row 2 - Projects
  BGM: "horizonPeach",
  Awaken: "luminalAmber",
  "Ikenga Wines": "perceptualViolet",
  Darkgrade: "celestialBlue",
  "Double Zero": "luminalAmber",

  // Row 3 - Portfolio
  "Mount Lawrence": "infraPink",
  "Fullstack Human": "pastelGreen",
  "Black Brick Project": "horizonPeach",
  Telepath: "perceptualViolet",
  "Bot or Not": "pastelGreen",

  // Row 4 - More
  "Ship By Friday": "celestialBlue",
  Etched: "infraPink",
  "Onwards And Beyond": "horizonPeach",
  "Original music": "luminalAmber",
  "Two Take Flight": "celestialBlue",
  "Lance Weiler": "celestialBlue",
};

/**
 * Utility: Determine if a hex color is dark (for contrast calculations)
 */
export const isDarkColor = (color: string): boolean => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

/**
 * Get the color value for a content key
 */
export const getContentColor = (contentKey: ContentKey): string => {
  const colorKey = contentColorMap[contentKey];
  return colorPalette[colorKey];
};

/**
 * Get the complementary color value for a content key
 */
export const getComplementaryColor = (contentKey: ContentKey): string => {
  const colorKey = contentColorMap[contentKey];
  const complementaryKey = complementaryColors[colorKey];
  return colorPalette[complementaryKey];
};
