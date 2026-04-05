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
  /** Override the heading tag. Default is "h2". Use "h1" for page-level headers. */
  titleAs?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  align = "center",
  theme = "dark",
  titleAs = "h2",
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
        as={titleAs}
        mode="inView"
        delay={0}
        stagger={0.055}
        duration={0.65}
        highlightWords={highlightWords}
        className={cn(
          "font-display",
          titleAs === "h1"
            ? "text-[clamp(2.75rem,8vw,4.5rem)] leading-[1.05]"
            : "text-heading md:text-heading-lg",
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
