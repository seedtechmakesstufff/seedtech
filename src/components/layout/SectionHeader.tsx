"use client";

import { cn } from "@/lib/utils";
import { SplitTextReveal } from "@/components/kit";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: "center" | "left";
  theme?: "dark" | "light";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  align = "center",
  theme = "dark",
  className,
}: SectionHeaderProps) {
  const isDark = theme === "dark";
  // Combine title + titleHighlight into one string for SplitTextReveal,
  // marking the highlight word(s) so they get GradientText treatment.
  const fullTitle = titleHighlight ? `${title} ${titleHighlight}` : title;
  const highlightWords = titleHighlight ? titleHighlight.trim().split(" ") : [];

  return (
    <div
      className={cn(
        "max-w-2xl mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className={cn(
          "text-eyebrow uppercase tracking-widest mb-4",
          isDark ? "text-seed-500" : "text-seed-600"
        )}>
          {eyebrow}
        </p>
      )}
      <SplitTextReveal
        text={fullTitle}
        as="h2"
        mode="inView"
        delay={0}
        stagger={0.055}
        duration={0.65}
        highlightWords={highlightWords}
        className={cn(
          "font-display text-heading md:text-heading-lg",
          isDark ? "text-white" : "text-dark-base"
        )}
      />
      {description && (
        <p className={cn(
          "mt-5 text-body-lg leading-relaxed",
          isDark ? "text-white/60" : "text-dark-base/60"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
