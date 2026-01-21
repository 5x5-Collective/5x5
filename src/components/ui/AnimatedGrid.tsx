"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Bricolage_Grotesque, Content } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import GalleryContentCard from "./GalleryContentCard";
import SubscribeCard from "./SubscribeCard";
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
// Import ancient technology data
const ancientTechData = require("../../../data/ancient-technology.json");

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Define the grid content
type ContentKey =
  | "About"
  | "Companies"
  | "Residency"
  | "Grants"
  | "Contributors"
  | "Subscribe"
  | "Quarantine Dreams"
  | "Dancing Monkey"
  | "Power to the People"
  | "Experiments in Reincarnation"
  | "Made You Think"
  | "BGM"
  | "Awaken"
  | "Ikenga Wines"
  | "Kira"
  | "Mount Lawrence"
  | "Fullstack Human"
  | "Black Brick Project"
  | "Double Zero"
  | "Telepath"
  | "Ship By Friday"
  | "Etched"
  | "Bot or Not"
  | "Onwards And Beyond"
  | "Original music"
  | "Two Take Flight"
  | "Lance Weiler";

const gridContent: ContentKey[][] = [
  ["About", "Companies", "Residency", "Grants", "Contributors"],
  [
    "Quarantine Dreams",
    "Dancing Monkey",
    "Power to the People",
    "Experiments in Reincarnation",
    "Made You Think",
  ],
  ["BGM", "Awaken", "Ikenga Wines", "Kira", "Double Zero"],
  [
    "Fullstack Human",
    "Black Brick Project",
    "Mount Lawrence",
    "Telepath",
    "Bot or Not",
  ],
  [
    "Ship By Friday",
    "Etched",
    "Onwards And Beyond",
    "Original music",
    "Two Take Flight",
  ],
];

const placeholderContent: Record<
  ContentKey,
  { text: string; link: string; createdBy?: { name: string; url: string } }
> = {
  // Row 1 - Navigation
  About: {
    text: "5x5 is a collective of artists, engineers, chefs, tinkerers, and adventurers exploring new and ancient technologies to understand the world we inhabit and the futures we can create.\n\nThe term 5x5 is a reference to the rarest major basketball statline, in which a player must get 5 counting stats in the 5 major categories in the game: points, rebounds, assists, steals, and blocks. Like the 14 NBA players who have ever accomplished this, the 5x5 collective aims to find skilled generalists who can impact the game in every dimension. Get in touch to find out more.",
    link: "mailto:nikhil@5x5.studio",
  },
  Companies: {
    text: "We occasionally invest in founders who are taking swings to create the kind of future they want to live in. We are less concerned with finding unicorns and more concerned with finding the kind of weirdness that needs to exist but often has no home. Tell us about your project and why we should be inspired by it.",
    link: "mailto:nikhil@5x5.studio",
  },
  Residency: {
    text: "In the Fall of 2025, we will begin piloting an art and science residency program in the Catskills. More info to come soon, but if you cannot wait to hear more, please reach out.",
    link: "mailto:nikhil@5x5.studio",
  },
  Grants: {
    text: "Alongside our residency program, we will soon begin to offer small grants to artists and citizen scientists to fund cutting edge non-commercial projects. Reach out to find out more.",
    link: "mailto:nikhil@5x5.studio",
  },
  Contributors: {
    text: "The current contributors to 5x5 are listed below. If you would like to contribute, please reach out and share a sampling of your work.",
    link: "contributing",
  },
  Subscribe: {
    text: "Subscribe to our newsletter to stay up to date on our latest news and events.",
    link: "subscribe",
  },

  // Row 2 - Team
  "Quarantine Dreams": {
    text: "A Pandemic-era fever dream music video with both music and visuals created by Nikhil Kumar using a variety of technologies, instruments, and recording techniques to present a disorienting glimpse into the mundanity of lockdown",
    link: "https://www.youtube.com/watch?v=I5AjdG9m8bk",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Dancing Monkey": {
    text: "The Dancing Monkey is a new film adapted from Eugene O'Neill's classic groundbreaking play, 'The Hairy Ape.' Set in the present, the film follows Wayne, a factory worker with an important decision to make. After being compared to a dancing monkey by one of the factory owners, Wayne sets out to find an answer to a question that will decide his fate and those around him.",
    link: "https://www.thedancingmonkeyfilm.com/",
    createdBy: { name: "Chandler Wild", url: "https://chandlerwild.com" },
  },
  "Power to the People": {
    text: "There's a systems design term and web-era phrase — graceful degradation — that suddenly feels like an important core ethic for civilization. In Europe and USA, we're being presented with two divergent visions of how society navigates technology… Read more.",
    link: "https://x.com/hv23/status/1918141243395019036",
    createdBy: { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  },
  "Experiments in Reincarnation": {
    text: "Experiments in Reincarnation is a sculptural exploration of transformation -- of bodies, of attachments, of scale. It began with a fascination: how do we define who we are over time?… See more.",
    link: "https://vimeo.com/558070075",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Made You Think": {
    text: "Join Nat, Neil, and Adil as they examine ideas that – as the name suggests – make you think. Episodes will explore books, essays, podcasts, and anything else that warrants further discussion, teaches something useful, or at the very least, exercises our brain muscles.",
    link: "https://www.madeyouthinkpodcast.com/",
    createdBy: { name: "Adil Majid", url: "https://adilmajid.com" },
  },

  // Row 3 - Projects
  BGM: {
    text: "The first flour mill to open in Brooklyn since the 1800s, featuring a new American-made stone mill and all locally sourced grains from Northeastern farmers",
    link: "https://brooklyngranaryandmill.com/",
  },
  Awaken: {
    text: "The best crypto tax software for the Solana ecosystem and beyond",
    link: "https://awaken.tax/",
  },
  "Ikenga Wines": {
    text: "The first biodesigned palm wine, made in America without any palm. Ikenga is bringing the varied flavors of Nigerian palm wine to the US using sophisticated fermentation techniques that produce the familiar flavors of palm wine in environmentally sustainable ways… Learn more.",
    link: "https://ikengawines.com/",
  },
  Kira: {
    text: "Kira is helping real estate agents do more for their customers with the power of AI in their palms.",
    link: "https://withkira.com/",
  },

  // Row 4 - Portfolio
  "Mount Lawrence": {
    text: "Mount Lawrence follows filmmaker Chandler Wild's 6,700 mile bicycle ride from New York City to the end of the road in Alaska to reconnect with his adventure loving father, a victim of suicide.",
    link: "https://www.amazon.com/Mount-Lawrence-Chandler-Wild/dp/B09RFT4JP9",
    createdBy: { name: "Chandler Wild", url: "https://chandlerwild.com" },
  },
  "Fullstack Human": {
    text: "Follow Nikhil on his quest to learn how to make everything he likes to consume.",
    link: "https://www.instagram.com/fullstack_human/",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Black Brick Project": {
    text: "Art gallery in Brooklyn supporting experimental and emerging artists through residencies, exhibitions, and performance series.",
    link: "https://www.blackbrickproject.com/",
  },
  "Double Zero": {
    text: "DoubleZero is a global fiber network for high performance distributed systems and blockchains, bringing high-performance networking and hardware acceleration to crypto. It is not a new L1 or L2, it is the first N1 in the world. Base layer network infrastructure for distributed systems.",
    link: "https://doublezero.xyz/",
  },
  Telepath: {
    text: "A better Telegram client for professionals in business development, client enablement, forward deployed engineering, and other similarly client-facing roles.",
    link: "Coming soon",
    createdBy: { name: "Jon Wong", url: "https://x.com/jnwng" },
  },

  // Row 5 - Recommendations
  "Ship By Friday": {
    text: "If I was to boil down the most important rule learned over eleven years of shipping software, it would be: velocity above all else.Velocity trumps everything. It trumps prioritization, code quality, design polish, feature completion, and whatever else you consider sacred.Velocity is the cure to the sluggishness that so many software teams fall into. I think of this rule as Ship by Friday.",
    link: "https://www.adilmajid.com/post/ship-by-friday",
    createdBy: { name: "Adil Majid", url: "https://adilmajid.com" },
  },
  Etched: {
    text: "Etched is a proof of concept platform that allows writers to own their works by minting them as NFTs with the essay text written in markdown in the description of the NFT.",
    link: "https://etched.id",
    createdBy: { name: "Jon Wong", url: "https://x.com/jnwng" },
  },
  "Bot or Not": {
    text: "A mini-game meant to test whether you can tell the difference between a human and an AI.",
    link: "https://botornot.is/",
    createdBy: { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  },
  "Onwards And Beyond": {
    text: "Nikhil blogged his backpacking trip in 2012 and sporadically updated it until 2015. Take a trip in the Time Machine here.",
    link: "https://onwardsandbeyond-blog.tumblr.com/",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Original music": {
    text: "Some music made by Nikhil over the years, usually using Logic or Ableton, often using analog sounds. His live performances are very different from this.",
    link: "https://soundcloud.com/nkumar23",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Two Take Flight": {
    text: "Two Take Flight is a travel blog documenting the journey of Neal Modi and Anushka Chayya as they traveled around the world for a year",
    link: "https://www.twotakeflight.com/",
  },
  "Lance Weiler": {
    text: `
    In 17th-century Japan, Sashiko emerged as a method of visible mending, a way to prolong the life of cloth through patterned stitches. Each thread was a gesture of survival, repetition, and care. These works extend that logic into the digital realm.

Starting with a glitch, a rupture in the smooth surface of code, I printed the error onto fabric, sewing it into a wearable object. Then, I photographed the shirt and glitched it again. The result is a layered act of digital and material repair, a recursive performance of breakage and reassembly.

Like Sashiko, these glitches don’t hide the wound. They illuminate it. They ask: what happens when we tend to the error instead of erasing it? What ancient methods might we apply to broken systems of the future? 
     `,
    link: "mailto:nikhil@5x5.studio",
  },
};

// Add this array after placeholderContent
const contributorsList = [
  { name: "Chandler Wild", url: "https://chandlerwild.com" },
  { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  { name: "Jon Wong", url: "https://x.com/jnwng" },
  { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  { name: "Adil Majid", url: "https://adilmajid.com" },
];

// Define color palette
export const colorPalette = {
  perceptualViolet: "#7B5EEA",
  celestialBlue: "#7CD7FF",
  infraPink: "#FF69B4",
  midnightIndigo: "#1A1B4B",
  horizonPeach: "#FFDAB9",
  atmosphericWhite: "#FFFFFF",
  luminalAmber: "#FFA500",
  pastelGreen: "#B6F5C9",
};

// Define complementary colors for buttons
const complementaryColors: Record<
  keyof typeof colorPalette,
  keyof typeof colorPalette
> = {
  perceptualViolet: "luminalAmber",
  celestialBlue: "perceptualViolet",
  infraPink: "midnightIndigo",
  midnightIndigo: "celestialBlue",
  horizonPeach: "infraPink",
  atmosphericWhite: "perceptualViolet",
  luminalAmber: "midnightIndigo",
  pastelGreen: "infraPink",
};

// Function to determine if a background color is dark
const isDarkColor = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// Map content to colors
export const contentColorMap: Record<ContentKey, keyof typeof colorPalette> = {
  About: "perceptualViolet",
  Companies: "celestialBlue",
  Residency: "infraPink",
  Grants: "pastelGreen",
  Contributors: "horizonPeach",
  Subscribe: "luminalAmber",
  "Quarantine Dreams": "luminalAmber",
  "Dancing Monkey": "perceptualViolet",
  "Power to the People": "celestialBlue",
  "Experiments in Reincarnation": "infraPink",
  "Made You Think": "pastelGreen",
  BGM: "horizonPeach",
  Awaken: "luminalAmber",
  "Ikenga Wines": "perceptualViolet",
  Kira: "celestialBlue",
  "Mount Lawrence": "infraPink",
  "Fullstack Human": "pastelGreen",
  "Black Brick Project": "horizonPeach",
  "Double Zero": "luminalAmber",
  Telepath: "perceptualViolet",
  "Ship By Friday": "celestialBlue",
  Etched: "infraPink",
  "Bot or Not": "pastelGreen",
  "Onwards And Beyond": "horizonPeach",
  "Original music": "luminalAmber",
  "Two Take Flight": "celestialBlue",
  "Lance Weiler": "celestialBlue",
};

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
                className="mt-8 space-y-3 flex flex-wrap justify-center gap-3"
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
}

export default function AnimatedGrid({ slug = null }: AnimatedGridProps) {
  // Split grid logic
  // Top: 2 rows from ancient-technology.json (5x2)
  // Only use first 8 artists, then add Subscribe and Instagram as special dots
  const realArtists = ancientTechnology.slice(0, 9);

  // Create special dots for Subscribe and Instagram
  const specialDots = [
    {
      artistName: "Subscribe",
      slug: "Subscribe",
      isSpecialLink: true,
      linkType: "subscribe",
      url: "/subscribe",
    },
  ];

  // Combine real artists with special dots to fill 10 spots
  const allDots = [...realArtists, ...specialDots];

  const artistRows = [allDots.slice(0, 5), allDots.slice(5, 10)];
  // Middle: next 3 rows from gridContent (rows 0-2)
  const mainRows = gridContent.slice(0, 3);
  // Overflow/beneath-the-fold: last 2 rows from gridContent
  const overflowRows = gridContent.slice(3, 5);

  const router = useRouter();
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [rippleDot, setRippleDot] = useState<string | null>(null);
  // Initialize selectedDot and selectedContent based on slug (for top two rows/artists)
  // If slug is provided, use it as the selected dot (assuming slug === dot key, e.g. '0-2'). Otherwise, default to null.
  const [selectedDot, setSelectedDot] = useState<string | null>(
    () => slug || null
  );
  // For selectedContent, if slug matches an artist, use artist data; otherwise, use default logic (null).
  const [selectedContent, setSelectedContent] = useState<ContentKey | null>(
    () => {
      if (!slug) return null;
      // Try to find matching artist in ancientTechnology by slug
      const artistData = (ancientTechData as any[]).find(
        (a) => a.slug === `events-ancient-technology-${slug}`
      );
      if (artistData) {
        return slug as ContentKey;
      }
      return null;
    }
  );
  const [randomDot, setRandomDot] = useState<string | null>(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const rippleInterval = useRef<NodeJS.Timeout | null>(null);
  const randomInterval = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);
  const usedDots = useRef<Set<string>>(new Set());
  const animationCount = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Function to get the next dot position for ripple
  const getNextDotPosition = (current: string | null) => {
    if (!current) return "0-0";
    const [row, col] = current.split("-").map(Number);
    if (col === 4) {
      return row === 4 ? null : `${row + 1}-0`;
    }
    return `${row}-${col + 1}`;
  };

  // Function to get a random unused dot
  const getRandomUnusedDot = () => {
    const allDots = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const dot = `${i}-${j}`;
        if (!usedDots.current.has(dot)) {
          allDots.push(dot);
        }
      }
    }

    if (allDots.length === 0) {
      // All dots have been used, reset the set
      usedDots.current.clear();
      return getRandomUnusedDot();
    }

    const randomIndex = Math.floor(Math.random() * allDots.length);
    const selectedDot = allDots[randomIndex];
    usedDots.current.add(selectedDot);
    return selectedDot;
  };

  // Function to run ripple animation
  const runRippleAnimation = () => {
    if (isAnimating.current || selectedDot) return;
    isAnimating.current = true;
    setRippleDot("0-0");

    rippleInterval.current = setInterval(() => {
      setRippleDot((prev) => {
        const next = getNextDotPosition(prev);
        if (!next) {
          if (rippleInterval.current) {
            clearInterval(rippleInterval.current);
            rippleInterval.current = null;
          }
          setRippleDot(null);
          isAnimating.current = false;
          resetInactivityTimer();
        }
        return next;
      });
    }, 200);
  };

  // Function to run random dot animation
  const runRandomDotAnimation = () => {
    if (isAnimating.current || selectedDot) return;
    isAnimating.current = true;
    animationCount.current = 0;

    const nextDot = getRandomUnusedDot();
    setRandomDot(nextDot);
    animationCount.current++;

    randomInterval.current = setInterval(() => {
      if (animationCount.current >= 25) {
        if (randomInterval.current) {
          clearInterval(randomInterval.current);
          randomInterval.current = null;
        }
        setRandomDot(null);
        isAnimating.current = false;
        usedDots.current.clear();
        resetInactivityTimer();
        return;
      }

      setRandomDot(null);
      setTimeout(() => {
        const nextDot = getRandomUnusedDot();
        setRandomDot(nextDot);
        animationCount.current++;
      }, 100);
    }, 200);
  };

  // Reset inactivity timer when user interacts
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (!isAnimating.current && !selectedDot) {
      inactivityTimer.current = setTimeout(() => {
        // Randomly choose between animations
        Math.random() < 0.5 ? runRippleAnimation() : runRandomDotAnimation();
      }, 5000);
    }
  };

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (selectedContent) {
      setSelectedDot(null);
      setSelectedContent(null);
      setIsContentExpanded(false);
      router.push("/");
      resetInactivityTimer();
    }
  };

  // Handle dot click
  const handleDotClick = (dotKey: string, content: string) => {
    // Clear any ongoing animation
    if (rippleInterval.current) {
      clearInterval(rippleInterval.current);
      rippleInterval.current = null;
    }
    if (randomInterval.current) {
      clearInterval(randomInterval.current);
      randomInterval.current = null;
    }
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
    setRippleDot(null);
    setRandomDot(null);
    isAnimating.current = false;

    // Animate to selected state using the clicked dot position
    setSelectedDot(dotKey);
    setSelectedContent(content as ContentKey);
  };

  // Handle artist dot click with routing
  const handleArtistDotClick = (dotKey: string, artist: any) => {
    // Clear any ongoing animation
    if (rippleInterval.current) {
      clearInterval(rippleInterval.current);
      rippleInterval.current = null;
    }
    if (randomInterval.current) {
      clearInterval(randomInterval.current);
      randomInterval.current = null;
    }
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
    setRippleDot(null);
    setRandomDot(null);
    isAnimating.current = false;

    // Handle special link dots
    if (artist.isSpecialLink) {
      if (artist.linkType === "subscribe") {
        router.push("/subscribe");
      } else if (artist.linkType === "instagram") {
        window.open(artist.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // Create URL-friendly artist name from artistName
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Push to the artist-specific URL
    router.push(`/events/ancient-technology/${artistSlug}`);

    // Also set local state for immediate UI feedback
    setSelectedDot(dotKey);
    setSelectedContent(artistSlug as ContentKey);
  };

  // Start inactivity timer on mount
  useEffect(() => {
    resetInactivityTimer();

    // Cleanup function
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (rippleInterval.current) clearInterval(rippleInterval.current);
      if (randomInterval.current) clearInterval(randomInterval.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add event listener for navbar dropdown
  useEffect(() => {
    const handler = (e: any) => {
      const key = e.detail?.key;
      if (!key) return;
      if (key === "Subscribe") {
        setSelectedDot("subscribe");
        setSelectedContent("Subscribe" as ContentKey);
        return;
      }
      // Find the position of the card in the grid
      for (let row = 0; row < gridContent.length; row++) {
        for (let col = 0; col < gridContent[row].length; col++) {
          if (gridContent[row][col] === key) {
            const dotKey = `${row}-${col}`;
            setSelectedDot(dotKey);
            setSelectedContent(key);
            return;
          }
        }
      }
    };
    window.addEventListener("open-grid-card", handler);
    return () => window.removeEventListener("open-grid-card", handler);
  }, []);

  // Handle subscribe slug - automatically show subscribe card
  useEffect(() => {
    if (slug === "subscribe") {
      setSelectedDot("subscribe");
      setSelectedContent("subscribe" as ContentKey);
      setIsContentExpanded(true);
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
          <div className="grid grid-rows-2 grid-cols-5 gap-2 aspect-[5/2] select-none w-[90vw] max-w-[500px]">
            {artistRows.map((row, rowIndex) =>
              row.map((artist, colIndex) => {
                const dotKey = artist.slug;
                const isSelected = selectedDot === dotKey;
                return (
                  <Dot
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
                  />
                );
              })
            )}
          </div>
        </div>
        {/* Middle grid: next 3 rows from gridContent */}
        <div className="grid grid-rows-3 grid-cols-5 gap-2 aspect-[5/3] select-none w-[90vw] max-w-[500px]">
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

              return (
                <Dot
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
        <div className="grid grid-rows-2 grid-cols-5 gap-2 aspect-[5/2] select-none overflow-x-auto w-[90vw] max-w-[500px]">
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

              return (
                <Dot
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
                    row: rowIndex + 3,
                    col: colIndex,
                  }}
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
                        setSelectedDot(null);
                        setSelectedContent(null);
                        setIsContentExpanded(false);
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
                        setSelectedDot(null);
                        setSelectedContent(null);
                        setIsContentExpanded(false);
                        // Reset URL to root when closing
                      }}
                    />
                  );
                }

                // Fallback for non-gallery content
                return (
                  <ContentCard
                    content={selectedContent}
                    isExpanded={isContentExpanded}
                    onClose={() => {
                      setSelectedDot(null);
                      setSelectedContent(null);
                      setIsContentExpanded(false);
                    }}
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
