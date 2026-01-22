/**
 * Entities Module
 *
 * This module exports all entity types and factory functions.
 * Entities are the data models that represent the core objects in the application.
 *
 * Current entities:
 * - Dot: Interactive grid elements that can be collected
 * - Card: Detail views shown when dots are selected (stub)
 *
 * Usage:
 * ```typescript
 * import { DotEntity, createDot, createDotGrid } from '@/entities';
 *
 * // Create a single dot
 * const dot = createDot({
 *   id: '2-3',
 *   gridPosition: { row: 2, col: 3 },
 *   content: { key: 'About', label: 'About', type: 'navigation' }
 * });
 *
 * // Create a grid of dots
 * const grid = createDotGrid(gridContent, { rowOffset: 2 });
 * ```
 */

// Types
export * from './types';

// Dot entity
export * from './Dot';
export * from './DotFactory';

// Card entity (stub for Phase 2)
export * from './Card';
