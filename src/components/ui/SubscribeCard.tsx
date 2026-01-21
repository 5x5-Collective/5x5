import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TurrellAndersonCard,
  LightLineDivider,
  SectionLabel,
  CardTitle,
  CardButton,
  turrellAndersonPalette,
  cardGradients,
} from "./TurrellAndersonCard";

interface SubscribeCardProps {
  onClose?: () => void;
  isExpanded?: boolean;
}

// Use a specific gradient for the Subscribe card
const gradient = cardGradients[2]; // violetHour -> dustyRose -> skyfall
const accent = turrellAndersonPalette.velvetNavy;

export const SubscribeCard: React.FC<SubscribeCardProps> = ({
  onClose,
  isExpanded = true,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  }, [error]);

  return (
    <TurrellAndersonCard
      gradient={gradient}
      onClose={onClose}
      isExpanded={isExpanded}
      maxWidth="900px"
    >
      <div className="max-w-md w-full mx-auto text-center flex flex-col justify-center min-h-full">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SectionLabel accent={accent} delay={0.2}>
            Newsletter
          </SectionLabel>

          <CardTitle accent={accent} delay={0.3} className="mt-4 mb-4">
            Stay Connected
          </CardTitle>

          <motion.div
            className="w-16 h-px mx-auto my-5"
            style={{ backgroundColor: `${accent}30` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          <motion.p
            className="text-base lg:text-lg leading-relaxed"
            style={{
              color: `${accent}cc`,
              fontFamily: "'Georgia', serif",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Join our community to get updates on exhibitions, residencies,
            and new projects from the 5x5 collective.
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full px-5 py-4 rounded-full text-base focus:outline-none focus:ring-2 disabled:opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: turrellAndersonPalette.warmIvory,
                    color: accent,
                    fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
                    border: `2px solid ${accent}20`,
                  }}
                />
              </div>

              {error && (
                <motion.div
                  className="text-sm px-4 py-3 rounded-full"
                  style={{
                    color: turrellAndersonPalette.warmIvory,
                    backgroundColor: turrellAndersonPalette.dustyRose,
                    border: `1px solid ${turrellAndersonPalette.horizon}`,
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || !email || !email.includes("@")}
                className="w-full px-6 py-4 rounded-full text-base tracking-wide transition-all duration-300 disabled:opacity-50"
                style={{
                  backgroundColor: accent,
                  color: turrellAndersonPalette.warmIvory,
                  fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </form>
          ) : (
            <motion.div
              className="text-center space-y-4 py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accent}10` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: accent }}>
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <h2
                className="text-2xl font-light"
                style={{
                  color: accent,
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                }}
              >
                Thank you for subscribing!
              </h2>
              <p
                className="text-sm"
                style={{
                  color: `${accent}90`,
                  fontFamily: "'Georgia', serif",
                }}
              >
                We'll keep you updated on our latest projects and exhibitions.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Divider */}
        <LightLineDivider gradient={gradient} className="my-8" delay={0.7} />

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span
            className="inline-block text-xs tracking-[0.2em] uppercase mb-6"
            style={{
              color: `${accent}70`,
              fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
            }}
          >
            Follow Us
          </span>

          <div className="flex justify-center gap-4">
            <CardButton
              href="https://instagram.com/5x5_collective"
              variant="secondary"
              accent={accent}
              external
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-80">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
              Instagram
            </CardButton>

            <CardButton
              href="https://5x5collective.substack.com"
              variant="primary"
              accent={accent}
              external
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
              </svg>
              Substack
            </CardButton>
          </div>
        </motion.div>
      </div>
    </TurrellAndersonCard>
  );
};

export default SubscribeCard;
