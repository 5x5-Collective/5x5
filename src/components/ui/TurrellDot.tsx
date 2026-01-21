"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import { turrellAndersonPalette, cardGradients } from "./TurrellAndersonCard";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Turrell-style color zones for rows
// Each row flows through a different part of the spectrum
const rowColorZones = [
  // Row 0: Cyan → Violet (cool, ethereal)
  { primary: turrellAndersonPalette.skyfall, secondary: turrellAndersonPalette.violetHour },
  // Row 1: Violet → Rose (twilight)
  { primary: turrellAndersonPalette.violetHour, secondary: turrellAndersonPalette.dustyRose },
  // Row 2: Rose → Peach (dawn)
  { primary: turrellAndersonPalette.dustyRose, secondary: turrellAndersonPalette.dawnGlow },
  // Row 3: Peach → Amber (warm light)
  { primary: turrellAndersonPalette.dawnGlow, secondary: turrellAndersonPalette.mustardPress },
  // Row 4: Amber → Seafoam (earth to water)
  { primary: turrellAndersonPalette.mustardPress, secondary: turrellAndersonPalette.seaFoam },
];

// Interpolate between two hex colors
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

// Calculate color based on position in grid
const getPositionColor = (row: number, col: number, totalCols: number = 5): string => {
  const safeRow = Math.min(row, rowColorZones.length - 1);
  const zone = rowColorZones[safeRow];
  const colFactor = col / (totalCols - 1); // 0 to 1 across columns
  return interpolateColor(zone.primary, zone.secondary, colFactor);
};

// Calculate glow intensity based on distance from mouse
const getGlowIntensity = (
  dotRow: number,
  dotCol: number,
  mouseRow: number,
  mouseCol: number,
  maxDistance: number = 3
): number => {
  const distance = Math.sqrt(
    Math.pow(dotRow - mouseRow, 2) + Math.pow(dotCol - mouseCol, 2)
  );
  return Math.max(0, 1 - distance / maxDistance);
};

interface TurrellDotProps {
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
  // New props for Turrell effect
  gridMousePosition?: { row: number; col: number } | null;
}

export const TurrellDot: React.FC<TurrellDotProps> = ({
  content,
  position,
  isHovered,
  isRippling,
  isRandomlySelected,
  isSelected,
  isClickedDot,
  shouldHide,
  onMouseEnter,
  onMouseLeave,
  onClick,
  selectedPosition,
  currentPosition,
  gridMousePosition,
}) => {
  const { row, col } = currentPosition;
  const selectedRow = selectedPosition?.row ?? 0;
  const selectedCol = selectedPosition?.col ?? 0;

  // Calculate position-based color
  const baseColor = useMemo(() => getPositionColor(row, col), [row, col]);

  // Calculate glow intensity from mouse proximity
  const glowIntensity = useMemo(() => {
    if (!gridMousePosition) return 0;
    return getGlowIntensity(row, col, gridMousePosition.row, gridMousePosition.col);
  }, [row, col, gridMousePosition]);

  // Get complementary glow color (shifted hue)
  const glowColor = useMemo(() => {
    const nextRow = Math.min(row + 1, rowColorZones.length - 1);
    return rowColorZones[nextRow].primary;
  }, [row]);

  // Active state color (when hovered or selected)
  const activeColor = isHovered || (isSelected && isClickedDot)
    ? turrellAndersonPalette.warmIvory
    : baseColor;

  return (
    <motion.div
      initial={{ scale: 1, x: 0, y: 0 }}
      animate={{
        scale: isHovered
          ? 1.5
          : isRippling
          ? 2
          : isRandomlySelected
          ? 2
          : isSelected
          ? isClickedDot
            ? 1.2
            : 0
          : 1,
        x:
          isSelected && !isClickedDot
            ? `calc(${selectedCol - col} * (100% + clamp(0.5rem, 3vmin, 2rem)))`
            : 0,
        y:
          isSelected && !isClickedDot
            ? `calc(${selectedRow - row} * (100% + clamp(0.5rem, 3vmin, 2rem)))`
            : 0,
        opacity: shouldHide ? 0 : isSelected ? (isClickedDot ? 1 : 0) : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.3,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`flex items-center justify-center aspect-square text-[clamp(1rem,5vmin,2.5rem)] select-none relative
        ${!isSelected && content ? "cursor-pointer" : "cursor-default"}`}
      whileHover={!isSelected ? { scale: 1.5 } : {}}
    >
      {/* Turrell-style glow layer - responds to mouse proximity */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}${Math.round(glowIntensity * 50).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${2 + glowIntensity * 4}px)`,
        }}
        animate={{
          scale: 1 + glowIntensity * 0.3,
          opacity: 0.3 + glowIntensity * 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Hover glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${baseColor}60 0%, ${glowColor}30 50%, transparent 80%)`,
            filter: "blur(4px)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.8 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* The dot itself - SVG for gradient fill */}
      <motion.div
        animate={{ scale: [0.6, 1.3] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="w-full h-full flex items-center justify-center relative z-10"
      >
        {isHovered && !isSelected ? (
          <span
            className={`${bricolage.className} text-[0.4em] font-medium text-center`}
            style={{ color: turrellAndersonPalette.warmIvory }}
          >
            {content}
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-[1em] h-[1em]"
            style={{ filter: `drop-shadow(0 0 ${2 + glowIntensity * 3}px ${baseColor})` }}
          >
            {/* Simple white dot with colored glow from drop-shadow */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={turrellAndersonPalette.warmIvory}
            />
          </svg>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TurrellDot;
