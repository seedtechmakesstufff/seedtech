import Link from "next/link";
import { cn } from "@/lib/utils";
import { AmbientGlow } from "./BackgroundEffects";
import { Button } from "./Button";

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
}: CTABannerProps) {
  return (
    <div className={cn("relative py-24 text-center overflow-hidden", className)}>
      <AmbientGlow />
      <div className="relative z-10 space-y-6">
        <h2 className="font-display text-heading md:text-heading-lg text-white">
          {title}
        </h2>
        <p className="text-body-lg text-white/60 max-w-md mx-auto">
          {description}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          {onPrimaryClick ? (
            <button onClick={onPrimaryClick}>
              <Button variant="primary" icon="arrow">
                {primaryLabel}
              </Button>
            </button>
          ) : (
            <Link href={primaryHref}>
              <Button variant="primary" icon="arrow">
                {primaryLabel}
              </Button>
            </Link>
          )}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref}>
              <Button variant="secondary" icon="none">
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
