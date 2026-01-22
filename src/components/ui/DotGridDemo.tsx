/**
 * DotGridDemo.tsx
 *
 * Demonstration component showing how to use the new entity-based hooks
 * with the existing Dot/TurrellDot components.
 *
 * This is a reference implementation for gradual migration of AnimatedGrid.
 *
 * Usage:
 * ```tsx
 * <DotGridDemo
 *   content={[["About", "Companies"], ["Projects", "Contact"]]}
 *   useTurrellDots={true}
 * />
 * ```
 */

"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import { TurrellDot } from "./TurrellDot";
import { useDotGrid } from "@/hooks";
import { getDotAnimateState, getDotTransition } from "@/animations";
import type { GridPosition } from "@/entities/types";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

interface DotGridDemoProps {
  /** 2D array of content labels */
  content: string[][];
  /** Enable Turrell-style dots */
  useTurrellDots?: boolean;
  /** Called when a dot is clicked */
  onDotClick?: (contentKey: string) => void;
}

/**
 * Simple Dot component for demo
 * Shows content label on hover, dot otherwise
 */
const SimpleDot: React.FC<{
  content: string;
  position: GridPosition;
  displayState: ReturnType<ReturnType<typeof useDotGrid>["getDotDisplayState"]>;
  selectedPosition?: GridPosition;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}> = ({
  content,
  position,
  displayState,
  selectedPosition,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  // Use the animation module to compute animate values
  const animateState = getDotAnimateState(position, selectedPosition, displayState);

  return (
    <motion.div
      initial={{ scale: 1, x: 0, y: 0 }}
      animate={animateState}
      transition={getDotTransition()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`flex items-center justify-center aspect-square text-white
        text-[clamp(1rem,5vmin,2.5rem)] select-none cursor-pointer`}
      whileHover={!displayState.isSelected ? { scale: 1.5 } : {}}
    >
      <motion.div
        animate={{ scale: [0.6, 1.3] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {displayState.isHovered && !displayState.isSelected ? (
          <span className={`${bricolage.className} text-[0.4em] font-medium text-center`}>
            {content}
          </span>
        ) : (
          "●"
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * Demo grid component using the new hooks
 */
export function DotGridDemo({
  content,
  useTurrellDots = false,
  onDotClick,
}: DotGridDemoProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Use the new useDotGrid hook for state management
  const grid = useDotGrid(
    {
      artists: [], // No artists in demo
      mainContent: content,
      overflowContent: [],
    },
    null, // No initial slug
    { enableMouseTracking: useTurrellDots }
  );

  // Wrapper for mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      grid.handleGridMouseMove(e, rect, content.length, 0);
    },
    [grid, content.length]
  );

  // Handle dot click with optional callback
  const handleClick = useCallback(
    (dotId: string, contentKey: string) => {
      grid.handleDotClick(dotId, contentKey);
      onDotClick?.(contentKey);
    },
    [grid, onDotClick]
  );

  const rows = content.length;
  const cols = content[0]?.length || 0;

  return (
    <div className="relative">
      {/* Debug info */}
      <div className="absolute -top-8 left-0 text-xs text-gray-500 font-mono">
        Hovered: {grid.hoveredDot || "none"} | Selected: {grid.selectedDot || "none"}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid gap-2 bg-black/50 p-4 rounded-lg"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={grid.handleGridMouseLeave}
      >
        {content.map((row, rowIndex) =>
          row.map((cellContent, colIndex) => {
            const dotId = `${rowIndex}-${colIndex}`;
            const displayState = grid.getDotDisplayState(dotId);
            const position: GridPosition = { row: rowIndex, col: colIndex };

            if (useTurrellDots) {
              return (
                <TurrellDot
                  key={dotId}
                  content={cellContent}
                  position={dotId}
                  isHovered={displayState.isHovered}
                  isRippling={displayState.isRippling}
                  isRandomlySelected={displayState.isRandomlySelected}
                  isSelected={displayState.isSelected}
                  isClickedDot={displayState.isClickedDot}
                  shouldHide={displayState.shouldHide}
                  onMouseEnter={() => grid.setHoveredDot(dotId)}
                  onMouseLeave={() => grid.setHoveredDot(null)}
                  onClick={() => handleClick(dotId, cellContent)}
                  selectedPosition={grid.getSelectedPosition()}
                  currentPosition={position}
                  gridMousePosition={grid.gridMousePosition}
                />
              );
            }

            return (
              <SimpleDot
                key={dotId}
                content={cellContent}
                position={position}
                displayState={displayState}
                selectedPosition={grid.getSelectedPosition()}
                onMouseEnter={() => grid.setHoveredDot(dotId)}
                onMouseLeave={() => grid.setHoveredDot(null)}
                onClick={() => handleClick(dotId, cellContent)}
              />
            );
          })
        )}
      </div>

      {/* Selected content display */}
      {grid.selectedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white/10 rounded-lg text-white text-center"
        >
          <p className="text-sm text-gray-400">Selected:</p>
          <p className="text-lg font-medium">{grid.selectedContent}</p>
          <button
            onClick={grid.handleClose}
            className="mt-2 px-4 py-1 bg-white/20 rounded hover:bg-white/30 transition"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default DotGridDemo;
