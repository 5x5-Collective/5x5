/**
 * Animations Module
 *
 * Animation functions and types for the 5x5 application.
 *
 * Usage:
 * ```typescript
 * import { getDotAnimateState, getDotTransition, SPRING_PRESETS } from '@/animations';
 *
 * // Get animation state for a dot
 * const animateState = getDotAnimateState(currentPosition, selectedPosition, {
 *   isHovered, isRippling, isRandomlySelected, isSelected, isClickedDot, shouldHide
 * });
 *
 * // Use with Framer Motion
 * <motion.div
 *   animate={animateState}
 *   transition={getDotTransition()}
 * />
 * ```
 */

export * from './types';
export * from './dotAnimations';
