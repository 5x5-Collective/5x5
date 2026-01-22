/**
 * Vector2D - Core type for 2D spatial operations
 * Physics-ready: can be used with matter.js, cannon.js, or custom physics
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Vector2D utility functions
 * These are pure functions that can be used in animation calculations
 */
export const Vector2D = {
  /** Create a new vector */
  create: (x: number = 0, y: number = 0): Vector2D => ({ x, y }),

  /** Add two vectors */
  add: (a: Vector2D, b: Vector2D): Vector2D => ({
    x: a.x + b.x,
    y: a.y + b.y,
  }),

  /** Subtract vector b from vector a */
  subtract: (a: Vector2D, b: Vector2D): Vector2D => ({
    x: a.x - b.x,
    y: a.y - b.y,
  }),

  /** Multiply vector by scalar */
  scale: (v: Vector2D, scalar: number): Vector2D => ({
    x: v.x * scalar,
    y: v.y * scalar,
  }),

  /** Calculate magnitude (length) of vector */
  magnitude: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),

  /** Normalize vector to unit length */
  normalize: (v: Vector2D): Vector2D => {
    const mag = Vector2D.magnitude(v);
    if (mag === 0) return { x: 0, y: 0 };
    return { x: v.x / mag, y: v.y / mag };
  },

  /** Calculate distance between two points */
  distance: (a: Vector2D, b: Vector2D): number =>
    Vector2D.magnitude(Vector2D.subtract(b, a)),

  /** Linear interpolation between two vectors */
  lerp: (a: Vector2D, b: Vector2D, t: number): Vector2D => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),

  /** Calculate dot product */
  dot: (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y,

  /** Check if two vectors are equal (within epsilon) */
  equals: (a: Vector2D, b: Vector2D, epsilon: number = 0.0001): boolean =>
    Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon,

  /** Clone a vector */
  clone: (v: Vector2D): Vector2D => ({ x: v.x, y: v.y }),

  /** Zero vector constant */
  zero: (): Vector2D => ({ x: 0, y: 0 }),
};

/**
 * GridPosition - Position in grid coordinates (row, col)
 * Used for grid-based calculations before converting to world coordinates
 */
export interface GridPosition {
  row: number;
  col: number;
}

/**
 * Convert grid position to Vector2D (world coordinates)
 * @param gridPos - Position in grid coordinates
 * @param cellSize - Size of each cell (default 1 for normalized coordinates)
 * @param gap - Gap between cells (default 0)
 */
export const gridToWorld = (
  gridPos: GridPosition,
  cellSize: number = 1,
  gap: number = 0
): Vector2D => ({
  x: gridPos.col * (cellSize + gap),
  y: gridPos.row * (cellSize + gap),
});

/**
 * Convert world coordinates to grid position
 * @param worldPos - Position in world coordinates
 * @param cellSize - Size of each cell
 * @param gap - Gap between cells
 */
export const worldToGrid = (
  worldPos: Vector2D,
  cellSize: number = 1,
  gap: number = 0
): GridPosition => ({
  col: Math.floor(worldPos.x / (cellSize + gap)),
  row: Math.floor(worldPos.y / (cellSize + gap)),
});
