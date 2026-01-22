/**
 * Dot Animations
 *
 * Animation functions specifically for dots.
 * These return Framer Motion-compatible animation objects.
 */

import type { SpringConfig, AnimationTarget } from './types';
import { SPRING_PRESETS } from './types';
import type { GridPosition } from '@/entities/types';

/**
 * Scale values for different dot states
 */
export const DOT_SCALES = {
  idle: 1,
  hovered: 1.5,
  rippling: 2,
  highlighted: 2,
  selected: 1.2,
  hidden: 0,
} as const;

/**
 * Calculate the scale for a dot based on its state
 */
export function getDotScale(state: {
  isHovered: boolean;
  isRippling: boolean;
  isRandomlySelected: boolean;
  isSelected: boolean;
  isClickedDot: boolean;
}): number {
  if (state.isHovered) return DOT_SCALES.hovered;
  if (state.isRippling) return DOT_SCALES.rippling;
  if (state.isRandomlySelected) return DOT_SCALES.highlighted;
  if (state.isSelected) {
    return state.isClickedDot ? DOT_SCALES.selected : DOT_SCALES.hidden;
  }
  return DOT_SCALES.idle;
}

/**
 * Calculate the opacity for a dot based on its state
 */
export function getDotOpacity(state: {
  shouldHide: boolean;
  isSelected: boolean;
  isClickedDot: boolean;
}): number {
  if (state.shouldHide) return 0;
  if (state.isSelected) {
    return state.isClickedDot ? 1 : 0;
  }
  return 1;
}

/**
 * Calculate the position offset for a dot moving toward the selected position
 * Returns CSS calc() strings for x and y
 */
export function getDotPositionOffset(
  currentPosition: GridPosition,
  selectedPosition: GridPosition | undefined,
  isSelected: boolean,
  isClickedDot: boolean
): { x: string | number; y: string | number } {
  if (!isSelected || isClickedDot || !selectedPosition) {
    return { x: 0, y: 0 };
  }

  const { row: currentRow, col: currentCol } = currentPosition;
  const { row: selectedRow, col: selectedCol } = selectedPosition;

  return {
    x: `calc(${selectedCol - currentCol} * (100% + clamp(0.5rem, 3vmin, 2rem)))`,
    y: `calc(${selectedRow - currentRow} * (100% + clamp(0.5rem, 3vmin, 2rem)))`,
  };
}

/**
 * Get the complete animation state for a dot
 * Returns an object compatible with Framer Motion's animate prop
 */
export function getDotAnimateState(
  currentPosition: GridPosition,
  selectedPosition: GridPosition | undefined,
  state: {
    isHovered: boolean;
    isRippling: boolean;
    isRandomlySelected: boolean;
    isSelected: boolean;
    isClickedDot: boolean;
    shouldHide: boolean;
  }
): {
  scale: number;
  x: string | number;
  y: string | number;
  opacity: number;
} {
  const scale = getDotScale(state);
  const opacity = getDotOpacity(state);
  const { x, y } = getDotPositionOffset(
    currentPosition,
    selectedPosition,
    state.isSelected,
    state.isClickedDot
  );

  return { scale, x, y, opacity };
}

/**
 * Get the transition configuration for dot animations
 */
export function getDotTransition(spring: SpringConfig = SPRING_PRESETS.snappy) {
  return {
    type: 'spring' as const,
    stiffness: spring.stiffness,
    damping: spring.damping,
    duration: 0.3,
  };
}

/**
 * Pulsing animation for idle dots
 * Returns keyframes for scale animation
 */
export function getPulseAnimation(
  minScale: number = 0.6,
  maxScale: number = 1.3,
  duration: number = 2.5
) {
  return {
    animate: { scale: [minScale, maxScale] },
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
    },
  };
}

/**
 * Calculate glow intensity based on mouse proximity
 * Uses Euclidean distance in grid space
 */
export function getGlowIntensity(
  dotPosition: GridPosition,
  mousePosition: GridPosition | null,
  maxDistance: number = 3
): number {
  if (!mousePosition) return 0;

  const dx = dotPosition.col - mousePosition.col;
  const dy = dotPosition.row - mousePosition.row;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return Math.max(0, 1 - distance / maxDistance);
}

/**
 * Ripple pattern generator
 * Yields dot positions in ripple order (row by row, left to right)
 */
export function* ripplePattern(
  rows: number,
  cols: number
): Generator<GridPosition, void, unknown> {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      yield { row, col };
    }
  }
}

/**
 * Random pattern generator
 * Yields dot positions in random order without repeats
 */
export function* randomPattern(
  rows: number,
  cols: number,
  count?: number
): Generator<GridPosition, void, unknown> {
  const positions: GridPosition[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({ row, col });
    }
  }

  // Shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const limit = count ?? positions.length;
  for (let i = 0; i < limit && i < positions.length; i++) {
    yield positions[i];
  }
}

/**
 * Converge pattern generator
 * Yields dot positions converging toward a center point
 */
export function* convergePattern(
  rows: number,
  cols: number,
  center: GridPosition
): Generator<GridPosition, void, unknown> {
  const positions: Array<{ pos: GridPosition; distance: number }> = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dx = col - center.col;
      const dy = row - center.row;
      const distance = Math.sqrt(dx * dx + dy * dy);
      positions.push({ pos: { row, col }, distance });
    }
  }

  // Sort by distance (furthest first)
  positions.sort((a, b) => b.distance - a.distance);

  for (const { pos } of positions) {
    yield pos;
  }
}
