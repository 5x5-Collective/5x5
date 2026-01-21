import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TurrellAndersonCard,
  LightLineDivider,
  SectionLabel,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardButton,
  getGradientFromString,
  turrellAndersonPalette,
} from "./TurrellAndersonCard";

interface GalleryContentCardProps {
  artistName: string;
  workName: string;
  bio: string;
  images: {
    artwork: string[];
    headshots: string[];
  };
  onClose?: () => void;
  isExpanded?: boolean;
  projectDescription?: string;
  price?: string;
  website?: string;
  instagram?: string;
}

const accent = turrellAndersonPalette.velvetNavy;

export const GalleryContentCard: React.FC<GalleryContentCardProps> = ({
  artistName,
  workName,
  bio,
  images,
  onClose,
  isExpanded = true,
  projectDescription,
  price,
  website,
  instagram,
}) => {
  const gradient = getGradientFromString(artistName);

  return (
    <TurrellAndersonCard
      gradient={gradient}
      onClose={onClose}
      isExpanded={isExpanded}
      maxWidth="1100px"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header section - Anderson-style centered typography */}
        <motion.div
          className="text-center mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SectionLabel accent={accent} delay={0.2}>
            Ancient Technology
          </SectionLabel>

          <CardTitle accent={accent} delay={0.3} className="mt-4 mb-2">
            {workName}
          </CardTitle>

          <motion.div
            className="w-16 h-px mx-auto my-5"
            style={{ backgroundColor: `${accent}30` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          <CardSubtitle accent={accent} delay={0.5}>
            by {artistName}
          </CardSubtitle>
        </motion.div>

        {/* Artwork Section - Anderson-style symmetrical framing */}
        {images.artwork && images.artwork.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className={`grid gap-4 ${images.artwork.length === 1 ? 'grid-cols-1' : images.artwork.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
              {images.artwork.map((imageSrc, i) => (
                <motion.div
                  key={i}
                  className={`overflow-hidden relative group ${images.artwork.length === 1 ? 'max-w-2xl mx-auto' : ''}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Anderson-style frame border */}
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none z-10"
                    style={{
                      boxShadow: `inset 0 0 0 3px ${turrellAndersonPalette.warmIvory}`,
                    }}
                  />

                  {/* Turrell glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 40px ${gradient.from}60, inset 0 0 30px ${gradient.via}30`,
                    }}
                  />

                  <img
                    src={imageSrc}
                    alt={`${workName} artwork ${i + 1}`}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* About the Work - Anderson typography style */}
        {projectDescription && (
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <SectionLabel accent={accent}>About the Work</SectionLabel>
            </motion.div>

            <CardBody accent={accent} delay={0.7} className="max-w-2xl mx-auto">
              {projectDescription.split("\n\n").map((para, idx) => (
                <p
                  key={idx}
                  className="text-base lg:text-lg leading-relaxed mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </CardBody>

            {price && (
              <motion.div
                className="mt-8 inline-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span
                  className="text-sm tracking-wide px-6 py-3 rounded-full"
                  style={{
                    color: turrellAndersonPalette.warmIvory,
                    backgroundColor: accent,
                    fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
                  }}
                >
                  {price === "On request" ? "Price on Request" : `$${price}`}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Divider - Turrell light line */}
        <LightLineDivider gradient={gradient} className="my-12 max-w-md mx-auto" delay={0.85} />

        {/* Artist Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div className="mb-8">
            <SectionLabel accent={accent}>The Artist</SectionLabel>
          </motion.div>

          {/* Artist headshots - circular Anderson style */}
          {images.headshots && images.headshots.length > 0 && (
            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              {images.headshots.map((imageSrc, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      filter: "blur(8px)",
                    }}
                  />

                  {/* Frame */}
                  <div
                    className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden"
                    style={{
                      padding: "3px",
                      background: turrellAndersonPalette.warmIvory,
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={`${artistName} headshot`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.h2
            className="text-2xl lg:text-3xl font-light mb-6"
            style={{
              color: accent,
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {artistName}
          </motion.h2>

          <CardBody accent={`${accent}cc`} delay={1.2} className="max-w-2xl mx-auto mb-10">
            {bio.split("\n\n").map((para, idx) => (
              <p
                key={idx}
                className="text-base leading-relaxed mb-4 last:mb-0"
              >
                {para}
              </p>
            ))}
          </CardBody>

          {/* Links - Anderson style buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            {website && (
              <CardButton
                href={website.startsWith('http') ? website : `https://${website}`}
                variant="primary"
                accent={accent}
                external
              >
                <span>Visit Website</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </CardButton>
            )}

            {instagram && (
              <CardButton
                href={`https://instagram.com/${instagram}`}
                variant="secondary"
                accent={accent}
                external
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="18" cy="6" r="1" fill="currentColor"/>
                </svg>
                <span>@{instagram}</span>
              </CardButton>
            )}
          </motion.div>
        </motion.div>
      </div>
    </TurrellAndersonCard>
  );
};

export default GalleryContentCard;
