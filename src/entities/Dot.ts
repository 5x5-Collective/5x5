/**
 * Dot Entity
 *
 * A dot is the fundamental interactive element in the 5x5 grid.
 * This entity type is designed to be:
 * - Serializable (can be persisted to storage)
 * - Physics-ready (has velocity, mass for future physics engine)
 * - Collectible (can be earned/owned by users)
 */

import { Vector2D, GridPosition } from './types';

/**
 * Possible states a dot can be in
 */
export type DotState =
  | 'idle'           // Default resting state
  | 'hovered'        // Mouse is over the dot
  | 'selected'       // Dot has been clicked/selected
  | 'rippling'       // Part of ripple animation
  | 'highlighted'    // Randomly highlighted during idle animation
  | 'animating'      // Currently in a transition animation
  | 'collected'      // Has been collected by a user
  | 'hidden';        // Not visible

/**
 * Color state for a dot
 * Supports multiple color values for different interaction states
 */
export interface DotColorState {
  /** Base color (derived from grid position in Turrell mode) */
  base: string;
  /** Color when hovered */
  hover: string;
  /** Glow color for proximity effects */
  glow: string;
  /** Currently rendered color (may be interpolated) */
  current: string;
}

/**
 * Visual properties that can be animated
 */
export interface DotVisualProps {
  /** Scale factor (1 = normal, 0 = invisible, 2 = double size) */
  scale: number;
  /** Opacity (0 = transparent, 1 = opaque) */
  opacity: number;
  /** Rotation in degrees (for future use) */
  rotation: number;
  /** Glow intensity (0 = none, 1 = full glow) */
  glowIntensity: number;
}

/**
 * Physics properties for simulation
 * These are initialized but not actively used until physics is enabled
 */
export interface DotPhysicsProps {
  /** Velocity vector */
  velocity: Vector2D;
  /** Acceleration vector */
  acceleration: Vector2D;
  /** Mass (affects force calculations) */
  mass: number;
  /** Friction coefficient (0 = no friction, 1 = full stop) */
  friction: number;
  /** Restitution/bounciness (0 = no bounce, 1 = perfect bounce) */
  restitution: number;
  /** Whether this dot is affected by physics simulation */
  isStatic: boolean;
}

/**
 * How a dot was collected
 */
export type CollectionSource =
  | 'content_viewed'    // User viewed the associated content
  | 'interaction'       // User interacted (clicked, hovered long enough)
  | 'discovery'         // Found through exploration/easter egg
  | 'daily_visit'       // Bonus for returning user
  | 'gifted';           // Given by another user or system

/**
 * Collection metadata when a dot has been collected
 */
export interface DotCollectionData {
  /** Whether this dot can be collected */
  collectible: boolean;
  /** ID of session/user who collected this dot (null if not collected) */
  collectedBy: string | null;
  /** When the dot was collected */
  collectedAt: Date | null;
  /** How the dot was collected */
  source: CollectionSource | null;
  /** Point value of this dot */
  value: number;
  /** Additional metadata about the collection */
  metadata?: {
    /** Content that was viewed to earn this dot */
    contentViewed?: string;
    /** Time spent engaging with content (ms) */
    timeSpent?: number;
    /** Specific interaction that triggered collection */
    interactionType?: string;
  };
}

/**
 * Content association for a dot
 */
export interface DotContent {
  /** Content key (e.g., "About", "Companies", artist slug) */
  key: string;
  /** Display label (what shows on hover) */
  label: string;
  /** Content type for categorization */
  type: 'navigation' | 'project' | 'artist' | 'special';
  /** URL to navigate to when clicked (optional) */
  url?: string;
}

/**
 * The main Dot entity interface
 */
export interface DotEntity {
  /** Unique identifier (e.g., "2-3" for row 2, col 3) */
  id: string;

  // === Position & Grid ===
  /** Position in grid coordinates */
  gridPosition: GridPosition;
  /** Position in world/screen coordinates */
  worldPosition: Vector2D;
  /** Target position for animations */
  targetPosition: Vector2D;

  // === Visual Properties ===
  /** Color state */
  color: DotColorState;
  /** Visual properties (scale, opacity, etc.) */
  visual: DotVisualProps;

  // === Physics Properties ===
  /** Physics simulation properties */
  physics: DotPhysicsProps;

  // === State ===
  /** Current interaction state */
  state: DotState;
  /** Previous state (for transition animations) */
  previousState: DotState;

  // === Content Association ===
  /** Associated content (null for empty dots) */
  content: DotContent | null;

  // === Collection ===
  /** Collection data for gamification */
  collection: DotCollectionData;

  // === Metadata ===
  /** When this dot entity was created */
  createdAt: Date;
  /** Last time user interacted with this dot */
  lastInteraction: Date | null;
  /** Custom data for extensions */
  meta?: Record<string, unknown>;
}

/**
 * Subset of DotEntity for creating new dots
 * Only requires the essential properties
 */
export type DotEntityInput = {
  id: string;
  gridPosition: GridPosition;
  content?: DotContent | null;
  color?: Partial<DotColorState>;
  value?: number;
};

/**
 * Props needed to render a dot (derived from DotEntity)
 * This bridges the entity to the React component
 */
export interface DotRenderProps {
  entity: DotEntity;

  // Interaction callbacks
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;

  // Context from grid
  selectedPosition?: GridPosition;
  gridMousePosition?: GridPosition | null;

  // Render hints
  isClickedDot: boolean;
  shouldHide: boolean;
}

/**
 * Default values for dot properties
 */
export const DOT_DEFAULTS = {
  visual: {
    scale: 1,
    opacity: 1,
    rotation: 0,
    glowIntensity: 0,
  } as DotVisualProps,

  physics: {
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass: 1,
    friction: 0.1,
    restitution: 0.5,
    isStatic: true,
  } as DotPhysicsProps,

  collection: {
    collectible: true,
    collectedBy: null,
    collectedAt: null,
    source: null,
    value: 1,
  } as DotCollectionData,
} as const;
