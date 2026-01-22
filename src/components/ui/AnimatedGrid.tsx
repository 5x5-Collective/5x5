"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Bricolage_Grotesque, Content } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import GalleryContentCard from "./GalleryContentCard";
import SubscribeCard from "./SubscribeCard";
import { TurrellDot } from "./TurrellDot";
import {
  TurrellAndersonCard,
  LightLineDivider,
  SectionLabel,
  CardTitle,
  CardBody,
  CardButton,
  getGradientFromString,
  turrellAndersonPalette,
  cardGradients,
  CardGradient,
} from "./TurrellAndersonCard";
import { useRouter, usePathname } from "next/navigation";
// Import data modules
import {
  type ContentKey,
  gridContent,
  placeholderContent,
  contributorsList,
} from "@/data/gridContent";
import {
  colorPalette,
  complementaryColors,
  contentColorMap,
  isDarkColor,
} from "@/data/colorPalette";
// Import hooks for state management
import { useDotGrid } from "@/hooks/useDotGrid";
// Import ancient technology data
const ancientTechData = require("../../../data/ancient-technology.json");

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Dot Component
interface DotProps {
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
}

const Dot: React.FC<DotProps> = ({
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
}) => {
  const { row, col } = currentPosition;
  const selectedRow = selectedPosition?.row ?? 0;
  const selectedCol = selectedPosition?.col ?? 0;

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
        color: content
          ? isHovered || (isSelected && isClickedDot)
            ? colorPalette[
                complementaryColors[contentColorMap[content as ContentKey]]
              ]
            : colorPalette.atmosphericWhite
          : colorPalette.atmosphericWhite,
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
      className={`flex items-center justify-center aspect-square text-[clamp(1rem,5vmin,2.5rem)] select-none
        ${!isSelected && content ? "cursor-pointer" : "cursor-default"}`}
      whileHover={!isSelected ? { scale: 1.5 } : {}}
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
        {isHovered && !isSelected ? (
          <span
            className={`${bricolage.className} text-[0.4em] font-medium text-center`}
          >
            {content}
          </span>
        ) : (
          "●"
        )}
      </motion.div>
    </motion.div>
  );
};

// Gradient mappings for each content color
const contentGradientMap: Record<keyof typeof colorPalette, CardGradient> = {
  perceptualViolet: { from: turrellAndersonPalette.violetHour, via: turrellAndersonPalette.dustyRose, to: turrellAndersonPalette.skyfall },
  celestialBlue: { from: turrellAndersonPalette.skyfall, via: turrellAndersonPalette.powderBlue, to: turrellAndersonPalette.seaFoam },
  infraPink: { from: turrellAndersonPalette.dustyRose, via: turrellAndersonPalette.dawnGlow, to: turrellAndersonPalette.horizon },
  midnightIndigo: { from: turrellAndersonPalette.velvetNavy, via: turrellAndersonPalette.violetHour, to: turrellAndersonPalette.skyfall },
  horizonPeach: { from: turrellAndersonPalette.dawnGlow, via: turrellAndersonPalette.horizon, to: turrellAndersonPalette.mustardPress },
  atmosphericWhite: { from: turrellAndersonPalette.warmIvory, via: turrellAndersonPalette.paleYellow, to: turrellAndersonPalette.skyfall },
  luminalAmber: { from: turrellAndersonPalette.mustardPress, via: turrellAndersonPalette.horizon, to: turrellAndersonPalette.dawnGlow },
  pastelGreen: { from: turrellAndersonPalette.seaFoam, via: turrellAndersonPalette.powderBlue, to: turrellAndersonPalette.paleYellow },
};

// Content Card Component - uses shared TurrellAndersonCard base
interface ContentCardProps {
  content: ContentKey;
  isExpanded: boolean;
  onClose: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  isExpanded,
  onClose,
}) => {
  const colorKey = contentColorMap[content];
  const gradient = contentGradientMap[colorKey];
  const accent = turrellAndersonPalette.velvetNavy;

  return (
    <TurrellAndersonCard
      gradient={gradient}
      onClose={onClose}
      isExpanded={isExpanded}
      maxWidth="1100px"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <motion.div
          className="text-center mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SectionLabel accent={accent} delay={0.2}>
            5x5 Collective
          </SectionLabel>

          <CardTitle accent={accent} delay={0.3} className="mt-4 mb-2">
            {content}
          </CardTitle>

          <motion.div
            className="w-16 h-px mx-auto my-5"
            style={{ backgroundColor: `${accent}30` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Images (if any) */}
        {placeholderContent[content].images && placeholderContent[content].images!.length > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className={`grid gap-4 ${
              placeholderContent[content].images!.length === 1
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : placeholderContent[content].images!.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2 lg:grid-cols-3'
            }`}>
              {placeholderContent[content].images!.map((imageSrc, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-lg relative group"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none z-10"
                    style={{
                      boxShadow: `inset 0 0 0 3px ${turrellAndersonPalette.warmIvory}`,
                    }}
                  />
                  <img
                    src={imageSrc}
                    alt={`${content} image ${i + 1}`}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <CardBody accent={accent} delay={0.5} className="text-center mb-10">
          {content === "Contributors" ? (
            <>
              {placeholderContent[content].text
                .split("\n\n")
                .map((para, idx) => (
                  <p key={idx} className="text-base lg:text-lg leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              <motion.ul
                className="mt-8 flex flex-wrap justify-center items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {contributorsList.map((contributor, idx) => (
                  <motion.li
                    key={contributor.url}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                  >
                    <CardButton href={contributor.url} variant="secondary" accent={accent} external>
                      {contributor.name}
                    </CardButton>
                  </motion.li>
                ))}
              </motion.ul>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              {placeholderContent[content].text
                .split("\n\n")
                .map((para, idx) => (
                  <p key={idx} className="text-base lg:text-lg leading-relaxed mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
            </div>
          )}
        </CardBody>

        {/* Created by */}
        {placeholderContent[content].createdBy && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span
              className="text-sm tracking-wide"
              style={{
                color: `${accent}90`,
                fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
              }}
            >
              Created by{" "}
              <a
                href={placeholderContent[content].createdBy!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                style={{ color: accent }}
              >
                {placeholderContent[content].createdBy!.name}
              </a>
            </span>
          </motion.div>
        )}

        {/* Divider */}
        <LightLineDivider gradient={gradient} className="my-10 max-w-sm mx-auto" delay={0.65} />

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CardButton
            href={placeholderContent[content].link}
            variant="primary"
            accent={accent}
            external={placeholderContent[content].link.startsWith("http") || placeholderContent[content].link.startsWith("mailto")}
          >
            <span>
              {["About", "Companies", "Residency", "Grants", "Contributors"].includes(content)
                ? "Get In Touch"
                : "Learn More"}
            </span>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="opacity-70">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CardButton>
        </motion.div>
      </div>
    </TurrellAndersonCard>
  );
};

// Main Grid Component
import ancientTechnology from "../../../data/ancient-technology.json";
import { div } from "framer-motion/client";
interface AnimatedGridProps {
  /**
   * slug: For top two rows (artists), pass the artist slug (e.g. 'nikhil-kumar'). Null for no highlight or non-artist dots.
   */
  slug?: string | null;
  /**
   * useTurrellDots: Enable Turrell-style gradient dots with light field effect.
   * Set to false (default) for original dot style.
   */
  useTurrellDots?: boolean;
}

export default function AnimatedGrid({ slug = null, useTurrellDots = false }: AnimatedGridProps) {
  // === Grid Refs ===
  const artistGridRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);
  const overflowGridRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // === Split grid data ===
  // Top: 2 rows from ancient-technology.json (5x2)
  const realArtists = ancientTechnology.slice(0, 9);
  const specialDots = [
    {
      artistName: "Subscribe",
      slug: "Subscribe",
      isSpecialLink: true,
      linkType: "subscribe",
      url: "/subscribe",
    },
  ];
  const allDots = [...realArtists, ...specialDots];
  const artistRows = [allDots.slice(0, 5), allDots.slice(5, 10)];
  // Middle: next 3 rows from gridContent (rows 0-2)
  const mainRows = gridContent.slice(0, 3);
  // Overflow/beneath-the-fold: last 2 rows from gridContent
  const overflowRows = gridContent.slice(3, 5);

  // === Use centralized state management hook ===
  const {
    hoveredDot,
    selectedDot,
    selectedContent: selectedContentFromHook,
    rippleDot,
    randomDot,
    gridMousePosition,
    isContentExpanded,
    setHoveredDot,
    handleDotClick: hookHandleDotClick,
    handleArtistDotClick: hookHandleArtistDotClick,
    handleBackgroundClick: hookHandleBackgroundClick,
    handleClose: hookHandleClose,
    handleGridMouseMove: hookHandleGridMouseMove,
    handleGridMouseLeave,
    getDotDisplayState,
    getSelectedPosition,
  } = useDotGrid(
    {
      artists: realArtists,
      mainContent: mainRows as string[][],
      overflowContent: overflowRows as string[][],
    },
    slug,
    { enableMouseTracking: useTurrellDots }
  );

  // Cast selectedContent to ContentKey for type compatibility
  const selectedContent = selectedContentFromHook as ContentKey | null;

  // === Wrapper for grid mouse move (adapts to ref-based API) ===
  const handleGridMouseMove = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    gridRefParam: React.RefObject<HTMLDivElement>,
    rowOffset: number = 0
  ) => {
    if (!gridRefParam.current || !useTurrellDots) return;
    const rect = gridRefParam.current.getBoundingClientRect();
    const rows = gridRefParam === artistGridRef ? 2 : gridRefParam === mainGridRef ? 3 : 2;
    hookHandleGridMouseMove(e, rect, rows, rowOffset);
  }, [useTurrellDots, hookHandleGridMouseMove]);

  // === Legacy router for direct navigation ===
  const router = useRouter();

  // === Legacy refs for backward compatibility ===
  // These are maintained for any code that still references them directly
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const rippleInterval = useRef<NodeJS.Timeout | null>(null);
  const randomInterval = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);
  const usedDots = useRef<Set<string>>(new Set());
  const animationCount = useRef(0);

  // === Event Handlers (delegated to hook) ===

  // Handle background click - uses hook's handler
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (selectedContent) {
      hookHandleBackgroundClick();
    }
  }, [selectedContent, hookHandleBackgroundClick]);

  // Handle dot click - uses hook's handler
  const handleDotClick = useCallback((dotKey: string, content: string) => {
    hookHandleDotClick(dotKey, content);
  }, [hookHandleDotClick]);

  // Handle artist dot click - uses hook's handler
  const handleArtistDotClick = useCallback((dotKey: string, artist: any) => {
    hookHandleArtistDotClick(dotKey, artist);
  }, [hookHandleArtistDotClick]);

  // Handle close - uses hook's handler
  const handleClose = useCallback(() => {
    hookHandleClose();
  }, [hookHandleClose]);

  // Add event listener for navbar dropdown
  useEffect(() => {
    const handler = (e: any) => {
      const key = e.detail?.key;
      if (!key) return;
      if (key === "Subscribe") {
        handleDotClick("subscribe", "Subscribe");
        return;
      }
      // Find the position of the card in the grid
      for (let row = 0; row < gridContent.length; row++) {
        for (let col = 0; col < gridContent[row].length; col++) {
          if (gridContent[row][col] === key) {
            const dotKey = `${row}-${col}`;
            handleDotClick(dotKey, key);
            return;
          }
        }
      }
    };
    window.addEventListener("open-grid-card", handler);
    return () => window.removeEventListener("open-grid-card", handler);
  }, [handleDotClick]);

  // Handle subscribe slug - automatically show subscribe card
  useEffect(() => {
    if (slug === "subscribe") {
      handleDotClick("subscribe", "Subscribe");
    }
  }, [slug]);

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-black overflow-hidden relative">
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          width: "100%",
          height: "100%",
          transform: "scale(1.2)",
        }}
      />

      {/* Grid Container */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
        {/* Top grid: 2 rows from ancient-technology.json */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg">
          <div className="text-xs text-gray-600 mb-3 font-mono text-center -mt-2">
            <span className="bg-black md:inline">
              ancient://technology
              <br className="md:hidden" />
              <span className="hidden md:inline"> - </span>
              48 Hester St, NYC 8/7-8/28 W-Sa 12-6pm
            </span>
          </div>
          <div
            ref={artistGridRef}
            className="grid grid-rows-2 grid-cols-5 gap-2 aspect-[5/2] select-none w-[90vw] max-w-[500px]"
            onMouseMove={(e) => handleGridMouseMove(e, artistGridRef, 0)}
            onMouseLeave={handleGridMouseLeave}
          >
            {artistRows.map((row, rowIndex) =>
              row.map((artist, colIndex) => {
                const dotKey = artist.slug;
                const isSelected = selectedDot === dotKey;
                const DotComponent = useTurrellDots ? TurrellDot : Dot;
                return (
                  <DotComponent
                    key={dotKey}
                    content={artist.artistName}
                    position={dotKey}
                    isHovered={hoveredDot === dotKey}
                    isRippling={rippleDot === dotKey}
                    isRandomlySelected={randomDot === dotKey}
                    isSelected={isSelected}
                    isClickedDot={isSelected}
                    shouldHide={false}
                    onMouseEnter={() => setHoveredDot(dotKey)}
                    onMouseLeave={() => setHoveredDot(null)}
                    onClick={() =>
                      !selectedDot && handleArtistDotClick(dotKey, artist)
                    }
                    selectedPosition={
                      selectedDot === dotKey
                        ? { row: rowIndex, col: colIndex }
                        : undefined
                    }
                    currentPosition={{ row: rowIndex, col: colIndex }}
                    {...(useTurrellDots && { gridMousePosition })}
                  />
                );
              })
            )}
          </div>
        </div>
        {/* Middle grid: next 3 rows from gridContent */}
        <div
          ref={mainGridRef}
          className="grid grid-rows-3 grid-cols-5 gap-2 aspect-[5/3] select-none w-[90vw] max-w-[500px]"
          onMouseMove={(e) => handleGridMouseMove(e, mainGridRef, 2)}
          onMouseLeave={handleGridMouseLeave}
        >
          {mainRows.map((row, rowIndex) =>
            row.map((content, colIndex) => {
              const dotKey = `${rowIndex + 2}-${colIndex}`;
              const isRippling = rippleDot === dotKey;
              const isRandomlySelected = randomDot === dotKey;
              const isHovered = hoveredDot === dotKey;
              const isSelected = selectedDot !== null;
              const isClickedDot = dotKey === selectedDot;
              const isMobileOrTablet =
                typeof window !== "undefined" && window.innerWidth < 1024;
              const shouldHide =
                isMobileOrTablet && isSelected && !isClickedDot;
              const DotComponent = useTurrellDots ? TurrellDot : Dot;

              return (
                <DotComponent
                  key={dotKey}
                  content={content}
                  position={dotKey}
                  isHovered={isHovered}
                  isRippling={isRippling}
                  isRandomlySelected={isRandomlySelected}
                  isSelected={isSelected}
                  isClickedDot={isClickedDot}
                  shouldHide={shouldHide}
                  onMouseEnter={() => !selectedDot && setHoveredDot(dotKey)}
                  onMouseLeave={() => !selectedDot && setHoveredDot(null)}
                  onClick={() =>
                    !selectedDot && content && handleDotClick(dotKey, content)
                  }
                  selectedPosition={
                    selectedDot
                      ? {
                          row: parseInt(selectedDot.split("-")[0]),
                          col: parseInt(selectedDot.split("-")[1]),
                        }
                      : undefined
                  }
                  currentPosition={{
                    row: rowIndex + 2,
                    col: colIndex,
                  }}
                  {...(useTurrellDots && { gridMousePosition })}
                />
              );
            })
          )}
        </div>

        {/* Divider between main grid and overflow grid */}
        <motion.div
          className={`${bricolage.className} w-full flex items-center justify-center text-[0.65rem] text-white/30 tracking-widest uppercase gap-2 py-6 whitespace-nowrap`}
          animate={{ opacity: selectedContent ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            whiteSpace: "nowrap",
            width: "max-content",
            maxWidth: "90vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0 auto",
          }}
        >
          <span className="font-light">5x5 Collective //</span>
          <span className="font-medium">est 5.5.25</span>
        </motion.div>
      </div>
      {/* Overflow grid section (beneath-the-fold, scroll to reveal) */}
      <div className="top-full w-full mt-12 flex justify-center">
        <div
          ref={overflowGridRef}
          className="grid grid-rows-2 grid-cols-5 gap-2 aspect-[5/2] select-none overflow-x-auto w-[90vw] max-w-[500px]"
          onMouseMove={(e) => handleGridMouseMove(e, overflowGridRef, 5)}
          onMouseLeave={handleGridMouseLeave}
        >
          {overflowRows.map((row, rowIndex) =>
            row.map((content, colIndex) => {
              const dotKey = `overflow-${rowIndex + 3}-${colIndex}`;
              const isRippling = rippleDot === dotKey;
              const isRandomlySelected = randomDot === dotKey;
              const isHovered = hoveredDot === dotKey;
              const isSelected = selectedDot !== null;
              const isClickedDot = dotKey === selectedDot;
              const isMobileOrTablet =
                typeof window !== "undefined" && window.innerWidth < 1024;
              const shouldHide =
                isMobileOrTablet && isSelected && !isClickedDot;
              const DotComponent = useTurrellDots ? TurrellDot : Dot;

              return (
                <DotComponent
                  key={dotKey}
                  content={content}
                  position={dotKey}
                  isHovered={isHovered}
                  isRippling={isRippling}
                  isRandomlySelected={isRandomlySelected}
                  isSelected={isSelected}
                  isClickedDot={isClickedDot}
                  shouldHide={shouldHide}
                  onMouseEnter={() => !selectedDot && setHoveredDot(dotKey)}
                  onMouseLeave={() => !selectedDot && setHoveredDot(null)}
                  onClick={() =>
                    !selectedDot && content && handleDotClick(dotKey, content)
                  }
                  selectedPosition={
                    selectedDot
                      ? {
                          row: parseInt(selectedDot.split("-")[0]),
                          col: parseInt(selectedDot.split("-")[1]),
                        }
                      : undefined
                  }
                  currentPosition={{
                    row: rowIndex + 5,
                    col: colIndex,
                  }}
                  {...(useTurrellDots && { gridMousePosition })}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Content Card Layer */}
      <AnimatePresence>
        {selectedContent && (
          <>
            {/* Background overlay - lower z-index */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={handleBackgroundClick}
              onClick={(e) => e.preventDefault()}
            />

            {/* Content Card - higher z-index */}
            <div
              className="fixed inset-0 z-40 h-full flex items-end lg:items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                // Handle subscribe slug
                if (slug === "subscribe") {
                  return (
                    <SubscribeCard
                      isExpanded={isContentExpanded}
                      onClose={() => {
                        router.push("/");
                        handleClose();
                      }}
                    />
                  );
                }

                // Find matching artist data from ancient technology JSON
                const artistData = ancientTechData.find((artist: any) => {
                  return (
                    artist.slug ===
                      `events-ancient-technology-${selectedContent}` ||
                    artist.slug === slug
                  );
                });

                if (artistData) {
                  return (
                    <GalleryContentCard
                      artistName={artistData.artistName}
                      workName={artistData.workName}
                      bio={artistData.bio}
                      images={artistData.images}
                      projectDescription={artistData.projectDescription}
                      price={artistData.price}
                      website={artistData.website}
                      instagram={artistData.instagram}
                      isExpanded={isContentExpanded}
                      onClose={() => {
                        router.push("/");
                        handleClose();
                      }}
                    />
                  );
                }

                // Fallback for non-gallery content
                return (
                  <ContentCard
                    content={selectedContent}
                    isExpanded={isContentExpanded}
                    onClose={handleClose}
                  />
                );
              })()}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
