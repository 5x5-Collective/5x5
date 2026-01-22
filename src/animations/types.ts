/**
 * Animation Types
 *
 * Core types for the animation system.
 * These are designed to be compatible with:
 * - Framer Motion (current)
 * - Future physics engines (matter.js, etc.)
 */

import type { Vector2D } from '@/entities/types';

/**
 * Spring configuration for physics-based animations
 */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

/**
 * Easing function type
 */
export type EasingFn = (t: number) => number;

/**
 * Animation target values
 */
export interface AnimationTarget {
  position?: Vector2D;
  scale?: number;
  opacity?: number;
  rotation?: number;
  color?: string;
}

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
  duration: number;
  delay?: number;
  easing?: EasingFn | string;
}

/**
 * Complete animation definition
 */
export interface AnimationDef {
  target: AnimationTarget;
  timing: AnimationTiming;
  spring?: SpringConfig;
}

/**
 * Animation sequence (multiple animations in order)
 */
export interface AnimationSequence {
  id: string;
  steps: AnimationDef[];
  loop?: boolean;
  onComplete?: () => void;
}

/**
 * Orchestrated animation across multiple entities
 */
export interface OrchestratedAnimation<T = string> {
  id: string;
  /** Entity IDs to animate */
  entities: T[];
  /** Animation to apply to each entity */
  animation: AnimationDef;
  /** Stagger delay between entities */
  stagger?: number;
  /** Pattern for determining animation order */
  pattern?: 'sequential' | 'random' | 'ripple' | 'converge';
}

/**
 * Default spring configurations
 */
export const SPRING_PRESETS = {
  /** Snappy, responsive feel */
  snappy: { stiffness: 400, damping: 30 } as SpringConfig,
  /** Gentle, smooth feel */
  gentle: { stiffness: 200, damping: 20 } as SpringConfig,
  /** Bouncy, playful feel */
  bouncy: { stiffness: 300, damping: 10 } as SpringConfig,
  /** Stiff, minimal overshoot */
  stiff: { stiffness: 500, damping: 40 } as SpringConfig,
} as const;

/**
 * Default timing configurations
 */
export const TIMING_PRESETS = {
  fast: { duration: 0.2 } as AnimationTiming,
  normal: { duration: 0.3 } as AnimationTiming,
  slow: { duration: 0.5 } as AnimationTiming,
  verySlow: { duration: 1.0 } as AnimationTiming,
} as const;
