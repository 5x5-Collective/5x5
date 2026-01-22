/**
 * useDotGrid Hook
 *
 * Comprehensive state management for the dot grid.
 * Extracts all state and animation logic from AnimatedGrid.tsx.
 *
 * Manages:
 * - Dot entities (created from factories)
 * - Hover/selection state
 * - Idle animations (ripple, random)
 * - Mouse tracking for Turrell effect
 * - Content expansion
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DotEntity,
  createDotGrid,
  createArtistGrid,
  createArtistDot,
  updateDotState,
} from '@/entities';
import type { GridPosition } from '@/entities/types';

/**
 * Configuration for the grid
 */
interface GridConfig {
  /** Number of columns in the grid */
  cols: number;
  /** Inactivity timeout before auto-animations (ms) */
  inactivityTimeout: number;
  /** Interval between ripple steps (ms) */
  rippleInterval: number;
  /** Interval between random dot highlights (ms) */
  randomInterval: number;
  /** Number of random dots to highlight */
  randomCount: number;
  /** Enable Turrell-style mouse tracking */
  enableMouseTracking: boolean;
}

const DEFAULT_CONFIG: GridConfig = {
  cols: 5,
  inactivityTimeout: 5000,
  rippleInterval: 200,
  randomInterval: 200,
  randomCount: 25,
  enableMouseTracking: false,
};

/**
 * Artist data shape (from ancient-technology.json)
 */
interface ArtistData {
  artistName: string;
  slug: string;
  isSpecialLink?: boolean;
  linkType?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Grid content data
 */
interface GridData {
  /** Artist data for top rows */
  artists: ArtistData[];
  /** Main grid content keys */
  mainContent: string[][];
  /** Overflow grid content keys */
  overflowContent: string[][];
}

/**
 * Return type for useDotGrid hook
 */
interface UseDotGridReturn {
  // Entities
  artistDots: DotEntity[][];
  mainDots: DotEntity[][];
  overflowDots: DotEntity[][];

  // State
  hoveredDot: string | null;
  selectedDot: string | null;
  selectedContent: string | null;
  rippleDot: string | null;
  randomDot: string | null;
  gridMousePosition: GridPosition | null;
  isContentExpanded: boolean;
  isAnimating: boolean;

  // Actions
  setHoveredDot: (id: string | null) => void;
  handleDotClick: (dotId: string, contentKey: string) => void;
  handleArtistDotClick: (dotId: string, artist: ArtistData) => void;
  handleBackgroundClick: () => void;
  handleClose: () => void;
  handleGridMouseMove: (
    e: React.MouseEvent<HTMLDivElement>,
    gridRect: DOMRect,
    rows: number,
    rowOffset: number
  ) => void;
  handleGridMouseLeave: () => void;

  // Utilities
  getDotDisplayState: (dotId: string) => {
    isHovered: boolean;
    isRippling: boolean;
    isRandomlySelected: boolean;
    isSelected: boolean;
    isClickedDot: boolean;
    shouldHide: boolean;
  };
  getSelectedPosition: () => GridPosition | undefined;
}

/**
 * Main hook for dot grid state management
 */
export function useDotGrid(
  data: GridData,
  initialSlug: string | null = null,
  config: Partial<GridConfig> = {}
): UseDotGridReturn {
  const router = useRouter();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { cols, inactivityTimeout, enableMouseTracking } = mergedConfig;

  // === Create Dot Entities ===
  const artistDots = useMemo(() => {
    const specialDots: ArtistData[] = [
      {
        artistName: 'Subscribe',
        slug: 'Subscribe',
        isSpecialLink: true,
        linkType: 'subscribe',
        url: '/subscribe',
      },
    ];
    const allArtists = [...data.artists.slice(0, 9), ...specialDots];
    return createArtistGrid(allArtists, cols);
  }, [data.artists, cols]);

  const mainDots = useMemo(
    () => createDotGrid(data.mainContent, { rowOffset: 2, contentType: 'project' }),
    [data.mainContent]
  );

  const overflowDots = useMemo(
    () => createDotGrid(data.overflowContent, { rowOffset: 5, prefix: 'overflow', contentType: 'project' }),
    [data.overflowContent]
  );

  // === Core State ===
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [selectedDot, setSelectedDot] = useState<string | null>(initialSlug);
  const [selectedContent, setSelectedContent] = useState<string | null>(() => {
    if (!initialSlug) return null;
    // Check if it's an artist slug
    const artist = data.artists.find(
      (a) => a.slug === `events-ancient-technology-${initialSlug}`
    );
    return artist ? initialSlug : null;
  });
  const [rippleDot, setRippleDot] = useState<string | null>(null);
  const [randomDot, setRandomDot] = useState<string | null>(null);
  const [gridMousePosition, setGridMousePosition] = useState<GridPosition | null>(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  // === Refs for Animation Control ===
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const rippleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const randomIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);
  const usedDotsRef = useRef<Set<string>>(new Set());
  const animationCountRef = useRef(0);

  // === Animation Functions ===

  const getNextRipplePosition = useCallback((current: string | null): string | null => {
    if (!current) return '0-0';
    const parts = current.split('-');
    const row = parseInt(parts[parts.length - 2] || parts[0]);
    const col = parseInt(parts[parts.length - 1]);
    if (col === cols - 1) {
      return row === 4 ? null : `${row + 1}-0`;
    }
    return `${row}-${col + 1}`;
  }, [cols]);

  const getRandomUnusedDot = useCallback((): string => {
    const allDotIds: string[] = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < cols; j++) {
        const id = `${i}-${j}`;
        if (!usedDotsRef.current.has(id)) {
          allDotIds.push(id);
        }
      }
    }

    if (allDotIds.length === 0) {
      usedDotsRef.current.clear();
      return getRandomUnusedDot();
    }

    const randomIndex = Math.floor(Math.random() * allDotIds.length);
    const selected = allDotIds[randomIndex];
    usedDotsRef.current.add(selected);
    return selected;
  }, [cols]);

  const clearAllAnimations = useCallback(() => {
    if (rippleIntervalRef.current) {
      clearInterval(rippleIntervalRef.current);
      rippleIntervalRef.current = null;
    }
    if (randomIntervalRef.current) {
      clearInterval(randomIntervalRef.current);
      randomIntervalRef.current = null;
    }
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
    setRippleDot(null);
    setRandomDot(null);
    isAnimatingRef.current = false;
  }, []);

  const runRippleAnimation = useCallback(() => {
    if (isAnimatingRef.current || selectedDot) return;
    isAnimatingRef.current = true;
    setRippleDot('0-0');

    rippleIntervalRef.current = setInterval(() => {
      setRippleDot((prev) => {
        const next = getNextRipplePosition(prev);
        if (!next) {
          if (rippleIntervalRef.current) {
            clearInterval(rippleIntervalRef.current);
            rippleIntervalRef.current = null;
          }
          setRippleDot(null);
          isAnimatingRef.current = false;
        }
        return next;
      });
    }, mergedConfig.rippleInterval);
  }, [selectedDot, getNextRipplePosition, mergedConfig.rippleInterval]);

  const runRandomDotAnimation = useCallback(() => {
    if (isAnimatingRef.current || selectedDot) return;
    isAnimatingRef.current = true;
    animationCountRef.current = 0;

    const nextDot = getRandomUnusedDot();
    setRandomDot(nextDot);
    animationCountRef.current++;

    randomIntervalRef.current = setInterval(() => {
      if (animationCountRef.current >= mergedConfig.randomCount) {
        if (randomIntervalRef.current) {
          clearInterval(randomIntervalRef.current);
          randomIntervalRef.current = null;
        }
        setRandomDot(null);
        isAnimatingRef.current = false;
        usedDotsRef.current.clear();
        return;
      }

      setRandomDot(null);
      setTimeout(() => {
        const next = getRandomUnusedDot();
        setRandomDot(next);
        animationCountRef.current++;
      }, 100);
    }, mergedConfig.randomInterval);
  }, [selectedDot, getRandomUnusedDot, mergedConfig.randomCount, mergedConfig.randomInterval]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (!isAnimatingRef.current && !selectedDot) {
      inactivityTimer.current = setTimeout(() => {
        Math.random() < 0.5 ? runRippleAnimation() : runRandomDotAnimation();
      }, inactivityTimeout);
    }
  }, [selectedDot, inactivityTimeout, runRippleAnimation, runRandomDotAnimation]);

  // === Event Handlers ===

  const handleDotClick = useCallback((dotId: string, contentKey: string) => {
    clearAllAnimations();
    setSelectedDot(dotId);
    setSelectedContent(contentKey);
  }, [clearAllAnimations]);

  const handleArtistDotClick = useCallback((dotId: string, artist: ArtistData) => {
    clearAllAnimations();

    // Handle special link dots
    if (artist.isSpecialLink) {
      if (artist.linkType === 'subscribe') {
        router.push('/subscribe');
      } else if (artist.linkType === 'instagram' && artist.url) {
        window.open(artist.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Create URL-friendly slug
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    router.push(`/events/ancient-technology/${artistSlug}`);
    setSelectedDot(dotId);
    setSelectedContent(artistSlug);
  }, [clearAllAnimations, router]);

  const handleBackgroundClick = useCallback(() => {
    if (selectedContent) {
      setSelectedDot(null);
      setSelectedContent(null);
      setIsContentExpanded(false);
      router.push('/');
      resetInactivityTimer();
    }
  }, [selectedContent, router, resetInactivityTimer]);

  const handleClose = useCallback(() => {
    setSelectedDot(null);
    setSelectedContent(null);
    setIsContentExpanded(false);
    router.push('/');
    resetInactivityTimer();
  }, [router, resetInactivityTimer]);

  const handleGridMouseMove = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    gridRect: DOMRect,
    rows: number,
    rowOffset: number
  ) => {
    if (!enableMouseTracking) return;

    const x = e.clientX - gridRect.left;
    const y = e.clientY - gridRect.top;
    const cellWidth = gridRect.width / cols;
    const cellHeight = gridRect.height / rows;
    const col = Math.min(Math.max(0, Math.floor(x / cellWidth)), cols - 1);
    const row = Math.min(Math.max(0, Math.floor(y / cellHeight)), rows - 1) + rowOffset;
    setGridMousePosition({ row, col });
  }, [enableMouseTracking, cols]);

  const handleGridMouseLeave = useCallback(() => {
    setGridMousePosition(null);
  }, []);

  // === Utility Functions ===

  const getDotDisplayState = useCallback((dotId: string) => {
    const isHovered = hoveredDot === dotId;
    const isRippling = rippleDot === dotId;
    const isRandomlySelected = randomDot === dotId;
    const isSelected = selectedDot !== null;
    const isClickedDot = selectedDot === dotId;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const shouldHide = isMobile && isSelected && !isClickedDot;

    return {
      isHovered,
      isRippling,
      isRandomlySelected,
      isSelected,
      isClickedDot,
      shouldHide,
    };
  }, [hoveredDot, rippleDot, randomDot, selectedDot]);

  const getSelectedPosition = useCallback((): GridPosition | undefined => {
    if (!selectedDot) return undefined;
    const parts = selectedDot.split('-');
    if (parts.length >= 2) {
      const row = parseInt(parts[parts.length - 2] || parts[0]);
      const col = parseInt(parts[parts.length - 1]);
      if (!isNaN(row) && !isNaN(col)) {
        return { row, col };
      }
    }
    return undefined;
  }, [selectedDot]);

  // === Effects ===

  // Start inactivity timer on mount
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      clearAllAnimations();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle navbar dropdown events
  useEffect(() => {
    const handler = (e: CustomEvent<{ key: string }>) => {
      const key = e.detail?.key;
      if (!key) return;

      if (key === 'Subscribe') {
        setSelectedDot('subscribe');
        setSelectedContent('Subscribe');
        return;
      }

      // Find position in grid content
      for (let row = 0; row < data.mainContent.length; row++) {
        for (let col = 0; col < data.mainContent[row].length; col++) {
          if (data.mainContent[row][col] === key) {
            setSelectedDot(`${row}-${col}`);
            setSelectedContent(key);
            return;
          }
        }
      }
    };

    window.addEventListener('open-grid-card', handler as EventListener);
    return () => window.removeEventListener('open-grid-card', handler as EventListener);
  }, [data.mainContent]);

  // Handle subscribe slug
  useEffect(() => {
    if (initialSlug === 'subscribe') {
      setSelectedDot('subscribe');
      setSelectedContent('subscribe');
      setIsContentExpanded(true);
    }
  }, [initialSlug]);

  return {
    // Entities
    artistDots,
    mainDots,
    overflowDots,

    // State
    hoveredDot,
    selectedDot,
    selectedContent,
    rippleDot,
    randomDot,
    gridMousePosition,
    isContentExpanded,
    isAnimating: isAnimatingRef.current,

    // Actions
    setHoveredDot,
    handleDotClick,
    handleArtistDotClick,
    handleBackgroundClick,
    handleClose,
    handleGridMouseMove,
    handleGridMouseLeave,

    // Utilities
    getDotDisplayState,
    getSelectedPosition,
  };
}

export default useDotGrid;
