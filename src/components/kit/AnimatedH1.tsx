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
      className={cn("font-display text-title md:text-display text-white leading-[1.05]", className)}
    />
  );
}
