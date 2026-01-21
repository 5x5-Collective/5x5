"use client";

import React, { useState, useRef, useCallback, ReactNode } from "react";
import { motion } from "framer-motion";

// ============================================
// TURRELL + ANDERSON DESIGN SYSTEM
// ============================================
// James Turrell: luminous, atmospheric gradients that glow from within
// Wes Anderson: precise, intentional color blocking with vintage warmth

export const turrellAndersonPalette = {
  // Turrell-inspired luminous colors
  skyfall: "#A8D5E5",      // soft cyan glow
  dawnGlow: "#FFB7A5",     // warm peach light
  violetHour: "#C9A7EB",   // ethereal purple
  horizon: "#FF9E7D",      // sunset orange

  // Anderson-inspired precise colors
  mustardPress: "#E8B84A", // Grand Budapest mustard
  powderBlue: "#7FCDCD",   // Royal Tenenbaums pool
  dustyRose: "#D4A5A5",    // Moonrise Kingdom pink
  seaFoam: "#98D4BB",      // Life Aquatic teal
  paleYellow: "#F5E6A3",   // Darjeeling Limited cream

  // Deep neutrals
  velvetNavy: "#1A1F3D",   // deep atmospheric blue
  warmIvory: "#FBF7F0",    // paper white
  charcoal: "#2D2D2D",
};

// Pre-defined gradient combinations
export const cardGradients = [
  { from: turrellAndersonPalette.skyfall, via: turrellAndersonPalette.violetHour, to: turrellAndersonPalette.dawnGlow },
  { from: turrellAndersonPalette.dawnGlow, via: turrellAndersonPalette.horizon, to: turrellAndersonPalette.mustardPress },
  { from: turrellAndersonPalette.violetHour, via: turrellAndersonPalette.dustyRose, to: turrellAndersonPalette.skyfall },
  { from: turrellAndersonPalette.seaFoam, via: turrellAndersonPalette.powderBlue, to: turrellAndersonPalette.violetHour },
  { from: turrellAndersonPalette.mustardPress, via: turrellAndersonPalette.dawnGlow, to: turrellAndersonPalette.dustyRose },
  { from: turrellAndersonPalette.powderBlue, via: turrellAndersonPalette.seaFoam, to: turrellAndersonPalette.paleYellow },
  { from: turrellAndersonPalette.dustyRose, via: turrellAndersonPalette.violetHour, to: turrellAndersonPalette.skyfall },
  { from: turrellAndersonPalette.horizon, via: turrellAndersonPalette.mustardPress, to: turrellAndersonPalette.seaFoam },
];

export interface CardGradient {
  from: string;
  via: string;
  to: string;
}

// Hash function to get consistent gradient from any string
export const getGradientFromString = (str: string): CardGradient => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return cardGradients[Math.abs(hash) % cardGradients.length];
};

// SVG noise texture as data URI (hoisted for performance)
const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

// ============================================
// LIGHT LINE DIVIDER COMPONENT
// ============================================
interface LightLineDividerProps {
  gradient: CardGradient;
  className?: string;
  delay?: number;
}

export const LightLineDivider: React.FC<LightLineDividerProps> = ({
  gradient,
  className = "",
  delay = 0.7,
}) => (
  <motion.div
    className={`relative h-px overflow-hidden ${className}`}
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay, duration: 0.8 }}
  >
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(90deg, transparent, ${gradient.from}, ${gradient.via}, ${gradient.to}, transparent)`,
      }}
    />
    <motion.div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)`,
        width: "30%",
      }}
      animate={{
        x: ["-30%", "400%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

// ============================================
// SECTION LABEL COMPONENT
// ============================================
interface SectionLabelProps {
  children: ReactNode;
  accent?: string;
  delay?: number;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  accent = turrellAndersonPalette.velvetNavy,
  delay = 0.2,
}) => (
  <motion.span
    className="inline-block text-xs lg:text-sm tracking-[0.3em] uppercase px-4 py-1.5 rounded-full"
    style={{
      color: accent,
      backgroundColor: `${accent}10`,
      fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    {children}
  </motion.span>
);

// ============================================
// CARD TITLE COMPONENT
// ============================================
interface CardTitleProps {
  children: ReactNode;
  accent?: string;
  delay?: number;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  accent = turrellAndersonPalette.velvetNavy,
  delay = 0.3,
  className = "",
}) => (
  <motion.h1
    className={`text-4xl lg:text-5xl font-light tracking-tight ${className}`}
    style={{
      color: accent,
      fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
    }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    {children}
  </motion.h1>
);

// ============================================
// CARD SUBTITLE COMPONENT
// ============================================
interface CardSubtitleProps {
  children: ReactNode;
  accent?: string;
  delay?: number;
}

export const CardSubtitle: React.FC<CardSubtitleProps> = ({
  children,
  accent = turrellAndersonPalette.velvetNavy,
  delay = 0.5,
}) => (
  <motion.p
    className="text-sm lg:text-base tracking-wide"
    style={{
      color: `${accent}90`,
      fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    {children}
  </motion.p>
);

// ============================================
// CARD BODY TEXT COMPONENT
// ============================================
interface CardBodyProps {
  children: ReactNode;
  accent?: string;
  delay?: number;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  accent = turrellAndersonPalette.velvetNavy,
  delay = 0.6,
  className = "",
}) => (
  <motion.div
    className={className}
    style={{
      color: accent,
      fontFamily: "'Georgia', serif",
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

// ============================================
// CARD BUTTON COMPONENT
// ============================================
interface CardButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  accent?: string;
  external?: boolean;
}

export const CardButton: React.FC<CardButtonProps> = ({
  href,
  children,
  variant = "primary",
  accent = turrellAndersonPalette.velvetNavy,
  external = false,
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-300"
      style={{
        color: isPrimary ? turrellAndersonPalette.warmIvory : accent,
        backgroundColor: isPrimary ? accent : `${accent}10`,
        border: isPrimary ? "none" : `1px solid ${accent}30`,
        fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
};

// ============================================
// MAIN CARD WRAPPER COMPONENT
// ============================================
interface TurrellAndersonCardProps {
  children: ReactNode;
  gradient: CardGradient;
  onClose?: () => void;
  isExpanded?: boolean;
  maxWidth?: string;
  className?: string;
}

export const TurrellAndersonCard: React.FC<TurrellAndersonCardProps> = ({
  children,
  gradient,
  onClose,
  isExpanded = true,
  maxWidth = "1100px",
  className = "",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  const handleDragEnd = useCallback((_: any, info: { offset: { y: number } }) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      if (info.offset.y > 60) {
        onClose?.();
      }
    }
  }, [onClose]);

  return (
    <motion.div
      ref={containerRef}
      className={`w-full lg:w-[min(90vw,${maxWidth})] lg:h-auto lg:m-8 pointer-events-auto ${className}`}
      initial={{ y: "100%", opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        height: isExpanded ? "90vh" : "70vh",
      }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onMouseMove={handleMouseMove}
    >
      {/* Outer frame - Anderson-style precise border */}
      <div
        className="w-full h-full rounded-t-[2rem] lg:rounded-[2rem] overflow-hidden relative"
        style={{
          background: turrellAndersonPalette.warmIvory,
          padding: "3px",
        }}
      >
        {/* Inner card with Turrell gradient */}
        <div
          className="w-full h-full rounded-t-[1.8rem] lg:rounded-[1.8rem] overflow-hidden relative"
          style={{
            background: `
              radial-gradient(
                ellipse 80% 60% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                ${gradient.from}40 0%,
                transparent 50%
              ),
              linear-gradient(
                135deg,
                ${gradient.from} 0%,
                ${gradient.via} 50%,
                ${gradient.to} 100%
              )
            `,
          }}
        >
          {/* Turrell-style atmospheric glow overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255,255,255,0.25) 0%,
                  transparent 40%
                )
              `,
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: NOISE_TEXTURE }}
          />

          {/* Drag handle - mobile */}
          <motion.div
            className="w-16 h-1.5 mx-auto mt-4 mb-3 rounded-full lg:hidden cursor-grab active:cursor-grabbing"
            style={{ backgroundColor: `${turrellAndersonPalette.velvetNavy}40` }}
            whileHover={{ scale: 1.1 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
          />

          {/* Content */}
          <div
            className="px-6 pt-2 pb-10 lg:p-12 h-full overflow-y-auto overscroll-y-contain"
            style={{
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// CONVENIENCE EXPORTS
// ============================================
export const palette = turrellAndersonPalette;
export const gradients = cardGradients;

export default TurrellAndersonCard;
