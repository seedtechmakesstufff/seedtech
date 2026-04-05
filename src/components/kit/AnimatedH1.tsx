"use client";

import { SplitTextReveal } from "./SplitTextReveal";
import { cn } from "@/lib/utils";

interface AnimatedH1Props {
  children: string;
  className?: string;
  /** Words to render with GradientText */
  highlightWords?: string[];
  /** Start delay in seconds. Default 0.15. */
  delay?: number;
}

/**
 * Drop-in replacement for bare <h1> on public page heroes.
 * Animates on mount (not scroll) — the page load entrance.
 * Uses the same SplitTextReveal word-by-word blur+slide effect.
 */
export function AnimatedH1({ children, className, highlightWords, delay = 0.15 }: AnimatedH1Props) {
  return (
    <SplitTextReveal
      text={children}
      as="h1"
      mode="mount"
      delay={delay}
      stagger={0.07}
      duration={0.7}
      highlightWords={highlightWords}
      className={cn(
        "font-display text-white leading-[1.05] text-[clamp(2.75rem,8vw,4.5rem)]",
        className,
      )}
    />
  );
}

interface AnimatedH2Props {
  children: string;
  className?: string;
  /** Words to render with GradientText */
  highlightWords?: string[];
  /** Start delay in seconds. Default 0. */
  delay?: number;
}

/**
 * Drop-in replacement for bare section-level <h2> headings on public pages.
 * Animates on scroll (inView mode) — fires once when the element enters the viewport.
 * Uses the same SplitTextReveal word-by-word blur+slide effect.
 */
export function AnimatedH2({ children, className, highlightWords, delay = 0 }: AnimatedH2Props) {
  return (
    <SplitTextReveal
      text={children}
      as="h2"
      mode="inView"
      delay={delay}
      stagger={0.055}
      duration={0.65}
      highlightWords={highlightWords}
      className={className}
    />
  );
}
