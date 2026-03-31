"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { GradientText } from "./Typography";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  /** Words (exact match) that should be rendered with GradientText */
  highlightWords?: string[];
  /** Optional Tailwind classes to apply to highlighted words instead of GradientText */
  highlightClass?: string;
  /** Delay before the whole block starts (seconds). Default 0. */
  delay?: number;
  /** Per-word stagger (seconds). Default 0.06. */
  stagger?: number;
  /** Animation duration per word (seconds). Default 0.65. */
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /**
   * "mount"  — animates once on component mount (hero use-case)
   * "inView" — animates when element enters viewport (section use-case)
   */
  mode?: "mount" | "inView";
}

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(28px)" },
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
  highlightClass,
  delay = 0,
  stagger = 0.06,
  duration = 0.65,
  as: Tag = "h1",
  mode = "mount",
}: SplitTextRevealProps) {
  const words = text.split(" ");

  // useInView is more reliable than whileInView — it fires even when the element
  // is already in the viewport on mount, which whileInView sometimes misses.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  // For mount mode, always animate. For inView mode, only animate once visible.
  const shouldAnimate = mode === "mount" ? true : inView;

  return (
    <Tag ref={ref as React.RefObject<never>} className={className} aria-label={text}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        const inner = isHighlighted ? (
          highlightClass
            ? <span className={highlightClass}>{word}</span>
            : <GradientText>{word}</GradientText>
        ) : (
          <>{word}</>
        );

        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              custom={{ delay: delay + i * stagger, duration }}
            >
              {inner}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
