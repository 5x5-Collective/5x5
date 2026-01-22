/**
 * Card Entity (Stub)
 *
 * Cards are the detail views that appear when a dot is selected.
 * This is a placeholder for Phase 2 implementation.
 *
 * Future features:
 * - Different card layouts (gallery, article, profile, collection)
 * - Content unlocking based on collected dots
 * - Dynamic content based on user history
 */

import { DotEntity } from './Dot';

/**
 * Card types map to different layouts
 */
export type CardType =
  | 'gallery'      // Artist/artwork display (GalleryContentCard)
  | 'article'      // Text-heavy content (ContentCard)
  | 'profile'      // Person/contributor profile
  | 'collection'   // User's collected dots display
  | 'subscribe';   // Newsletter subscription (SubscribeCard)

/**
 * Media item for cards
 */
export interface CardMedia {
  type: 'image' | 'video' | 'embed';
  url: string;
  alt?: string;
  caption?: string;
  aspectRatio?: number;
}

/**
 * Card gradient (from existing TurrellAndersonCard)
 */
export interface CardGradient {
  from: string;
  via: string;
  to: string;
}

/**
 * The main Card entity interface
 */
export interface CardEntity {
  /** Unique identifier */
  id: string;

  /** Card type determines layout */
  type: CardType;

  // === Content ===
  /** Main title */
  title: string;
  /** Subtitle or tagline */
  subtitle?: string;
  /** Body text (supports markdown in future) */
  body?: string;
  /** Media items (images, videos) */
  media: CardMedia[];

  // === Visual ===
  /** Gradient for card background */
  gradient: CardGradient;
  /** Accent color for text and elements */
  accentColor: string;

  // === Associations ===
  /** Dot IDs that link to this card */
  linkedDots: string[];
  /** Creator/author information */
  createdBy?: {
    name: string;
    url: string;
  };

  // === Access Control (future) ===
  /** Dot IDs required to view this card (null = public) */
  unlockedBy?: string[] | null;

  // === Actions ===
  /** Primary CTA */
  primaryAction?: {
    label: string;
    url: string;
    external?: boolean;
  };
  /** Secondary actions */
  secondaryActions?: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;

  // === Metadata ===
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props for rendering a card component
 */
export interface CardRenderProps {
  entity: CardEntity;
  isExpanded: boolean;
  onClose: () => void;
}

/**
 * Create a CardEntity from existing content data
 * This will be implemented in Phase 2
 */
export const createCard = (/* params */): CardEntity => {
  throw new Error('CardEntity.createCard not yet implemented - Phase 2');
};

/**
 * Check if a card is accessible based on collected dots
 */
export const isCardUnlocked = (
  card: CardEntity,
  collectedDotIds: string[]
): boolean => {
  if (!card.unlockedBy || card.unlockedBy.length === 0) {
    return true; // Public card
  }
  return card.unlockedBy.every((dotId) => collectedDotIds.includes(dotId));
};
