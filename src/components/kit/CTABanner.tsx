"use client";

import { cn } from "@/lib/utils";
import { AmbientGlow } from "./BackgroundEffects";
import { Button } from "./Button";
import { AnimatedH2 } from "./AnimatedH1";

interface CTABannerProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
  /** When provided, the primary CTA renders as a button instead of a link. */
  onPrimaryClick?: () => void;
  /** When "light", wraps the banner in a dark rounded container so it's visible on white backgrounds. */
  theme?: "dark" | "light";
}

export function CTABanner({
  title,
  description,
  primaryLabel = "Get Started",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
  className,
  onPrimaryClick,
  theme = "dark",
}: CTABannerProps) {
  const isOnLight = theme === "light";

  return (
    <div className={cn(
      "relative py-24 text-center overflow-hidden",
      isOnLight && "bg-dark-base rounded-3xl px-6",
      className
    )}>
      <AmbientGlow />
      <div className="relative z-10 space-y-6">
        <AnimatedH2 className="font-display text-[clamp(2.5rem,6vw,2.75rem)] leading-[1.15] text-white">
          {title}
        </AnimatedH2>
        <p className="text-body-lg text-white/60 max-w-md mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {onPrimaryClick ? (
            <Button variant="primary" icon="arrow" onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>
          ) : (
            <Button variant="primary" icon="arrow" href={primaryHref}>
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel && secondaryHref && (
            <Button variant="secondary" icon="none" href={secondaryHref}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
