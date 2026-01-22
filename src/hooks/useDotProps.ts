/**
 * useDotProps Hook
 *
 * Bridges DotEntity to the props expected by TurrellDot and Dot components.
 * This allows gradual migration from inline state to entity-based state.
 *
 * Usage:
 * ```tsx
 * const dotProps = useDotProps(dotEntity, {
 *   hoveredDot,
 *   selectedDot,
 *   rippleDot,
 *   randomDot,
 *   gridMousePosition,
 *   onHover: setHoveredDot,
 *   onSelect: handleDotClick,
 * });
 *
 * return <TurrellDot {...dotProps} />;
 * ```
 */

import { useCallback, useMemo } from 'react';
import type { DotEntity, DotState } from '@/entities/Dot';
import type { GridPosition } from '@/entities/types';

/**
 * Grid context passed from the parent grid component
 */
interface DotGridContext {
  /** Currently hovered dot ID */
  hoveredDot: string | null;
  /** Currently selected dot ID */
  selectedDot: string | null;
  /** Dot currently in ripple animation */
  rippleDot: string | null;
  /** Randomly highlighted dot */
  randomDot: string | null;
  /** Mouse position in grid coordinates */
  gridMousePosition: GridPosition | null;
  /** Whether we're on mobile/tablet (for hiding unselected dots) */
  isMobile?: boolean;
}

/**
 * Callbacks for dot interactions
 */
interface DotCallbacks {
  onHover: (dotId: string | null) => void;
  onSelect: (dotId: string, contentKey: string) => void;
}

/**
 * Props returned by the hook (matches TurrellDot/Dot component props)
 */
interface DotComponentProps {
  content: string;
  position: string;
  isHovered: boolean;
  isRippling: boolean;
  isRandomlySelected: boolean;
  isSelected: boolean;
  isClickedDot: boolean;
  shouldHide: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  selectedPosition?: { row: number; col: number };
  currentPosition: { row: number; col: number };
  gridMousePosition?: { row: number; col: number } | null;
}

/**
 * Derive the current display state from grid context
 */
const getDotDisplayState = (
  entity: DotEntity,
  context: DotGridContext
): {
  isHovered: boolean;
  isRippling: boolean;
  isRandomlySelected: boolean;
  isSelected: boolean;
  isClickedDot: boolean;
  shouldHide: boolean;
} => {
  const { id } = entity;
  const { hoveredDot, selectedDot, rippleDot, randomDot, isMobile } = context;

  const isHovered = hoveredDot === id;
  const isRippling = rippleDot === id;
  const isRandomlySelected = randomDot === id;
  const isSelected = selectedDot !== null;
  const isClickedDot = selectedDot === id;
  const shouldHide = !!isMobile && isSelected && !isClickedDot;

  return {
    isHovered,
    isRippling,
    isRandomlySelected,
    isSelected,
    isClickedDot,
    shouldHide,
  };
};

/**
 * Hook to convert DotEntity + context to component props
 */
export const useDotProps = (
  entity: DotEntity,
  context: DotGridContext,
  callbacks: DotCallbacks
): DotComponentProps => {
  const { id, gridPosition, content } = entity;
  const { selectedDot, gridMousePosition } = context;
  const { onHover, onSelect } = callbacks;

  // Derive display state from context
  const displayState = useMemo(
    () => getDotDisplayState(entity, context),
    [entity, context]
  );

  // Memoized callbacks
  const handleMouseEnter = useCallback(() => {
    if (!selectedDot) {
      onHover(id);
    }
  }, [id, selectedDot, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (!selectedDot) {
      onHover(null);
    }
  }, [selectedDot, onHover]);

  const handleClick = useCallback(() => {
    if (!selectedDot && content) {
      onSelect(id, content.key);
    }
  }, [id, selectedDot, content, onSelect]);

  // Calculate selected position for animation
  const selectedPosition = useMemo(() => {
    if (!selectedDot) return undefined;
    const parts = selectedDot.split('-');
    if (parts.length >= 2) {
      // Handle both "row-col" and "prefix-row-col" formats
      const row = parseInt(parts[parts.length - 2]);
      const col = parseInt(parts[parts.length - 1]);
      if (!isNaN(row) && !isNaN(col)) {
        return { row, col };
      }
    }
    return undefined;
  }, [selectedDot]);

  return {
    content: content?.label ?? '',
    position: id,
    ...displayState,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    selectedPosition,
    currentPosition: { row: gridPosition.row, col: gridPosition.col },
    gridMousePosition: gridMousePosition ?? undefined,
  };
};

export default useDotProps;
