"use client";

import { motion, type Variants } from "framer-motion";
import { GradientText } from "./Typography";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  /** Words (exact match) that should be rendered with GradientText */
  highlightWords?: string[];
  /** Delay before the whole block starts (seconds). Default 0. */
  delay?: number;
  /** Per-word stagger (seconds). Default 0.06. */
  stagger?: number;
  /** Animation duration per word (seconds). Default 0.65. */
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
  visible: (custom: { delay: number; duration: number }) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: EXPO_OUT,
    },
  }),
};

export function SplitTextReveal({
  text,
  className,
  highlightWords = [],
  delay = 0,
  stagger = 0.06,
  duration = 0.65,
  as: Tag = "h1",
}: SplitTextRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        const inner = isHighlighted ? (
          <GradientText>{word}</GradientText>
        ) : (
          <>{word}</>
        );

        return (
          // overflow-hidden clips the word as it slides up — the key to the effect
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              custom={{ delay: delay + i * stagger, duration }}
            >
              {inner}
              {/* non-breaking space preserves word gap */}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
