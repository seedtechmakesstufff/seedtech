import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/*
 * ══════════════════════════════════════════════════════════════════════════════
 *  LIQUID GLASS COMPONENT KIT
 *  Based on Apple Human Interface Guidelines — Liquid Glass (2025)
 *  Reference: developer.apple.com/design/human-interface-guidelines/materials
 *
 *  Apple usage rules (enforced by these components):
 *   • Use ONLY for interactive controls / navigation — never in the content layer
 *   • Regular variant  → blurs + adjusts luminosity for legibility (most controls)
 *   • Clear variant    → highly translucent, only over media/photo backgrounds
 *   • Tinted variants  → apply to ONE primary action per group maximum
 *   • Never color multiple controls in the same toolbar/group
 * ══════════════════════════════════════════════════════════════════════════════
 */

/* ── LiquidGlassCard — Regular variant ──────────────────────────────────────
   Use for feature cards, service cards, interactive panels.
   Blurs and adjusts luminosity so text remains legible over any background.  */
interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function LiquidGlassCard({
  children,
  className,
  hover = true,
}: LiquidGlassCardProps) {
  return (
    <div
      className={cn(
        "liquid-glass rounded-2xl p-6 relative overflow-hidden",
        hover && "liquid-glass-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── LiquidGlassClearCard — Clear variant ────────────────────────────────────
   Highly translucent. Only use over visually rich / media backgrounds
   (photos, video, colorful gradients). Preserves background visibility.
   Per Apple HIG: add dimming={true} when background content is bright.        */
interface LiquidGlassClearCardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Apple HIG: If the underlying content is bright, set dimming to true
   * to add a 35% dark overlay for legibility.
   */
  dimming?: boolean;
}

export function LiquidGlassClearCard({
  children,
  className,
  dimming = false,
}: LiquidGlassClearCardProps) {
  return (
    <div
      className={cn(
        "liquid-glass-clear rounded-2xl p-6 relative overflow-hidden",
        className
      )}
    >
      {dimming && (
        <div className="absolute inset-0 bg-black/35 rounded-[inherit] pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ── LiquidGlassPill — iOS/macOS pill badge ─────────────────────────────────
   Capsule-shaped status badge / label / tag.
   Mirrors iOS tab bar selection pills, status pills, and toolbar badges.
   Tinted variants: use only to signal one primary status per group.           */
type PillVariant = "default" | "seed" | "blue" | "cyan" | "emerald";
type PillSize = "sm" | "md" | "lg";

interface LiquidGlassPillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  /** Adds a small colored dot before the label (status indicator) */
  dot?: boolean;
  /** Use light-background-optimized glass style with dark text */
  onLight?: boolean;
  className?: string;
}

const pillVariantClass: Record<PillVariant, string> = {
  default: "liquid-glass text-white/80",
  seed: "liquid-glass-tinted-seed text-white",
  blue: "liquid-glass-tinted-blue text-white",
  cyan: "liquid-glass-tinted-cyan text-white",
  emerald: "liquid-glass-tinted-emerald text-white",
};

const pillVariantLightClass: Record<PillVariant, string> = {
  default: "liquid-glass-on-light text-dark-base/70",
  seed: "liquid-glass-on-light-seed text-seed-700",
  blue: "liquid-glass-on-light-blue text-blue-700",
  cyan: "liquid-glass-on-light-cyan text-cyan-700",
  emerald: "liquid-glass-on-light-emerald text-emerald-700",
};

const pillSizeClass: Record<PillSize, string> = {
  sm: "px-3 py-1 text-xs gap-1.5",
  md: "px-4 py-1.5 text-sm gap-2",
  lg: "px-5 py-2 text-sm gap-2",
};

export function LiquidGlassPill({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  onLight = false,
  className,
}: LiquidGlassPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium relative overflow-hidden",
        onLight ? pillVariantLightClass[variant] : pillVariantClass[variant],
        pillSizeClass[size],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      )}
      {children}
    </span>
  );
}

/* ── LiquidGlassButton — Tinted primary CTA ─────────────────────────────────
   Per Apple HIG: apply tint to ONE primary action per group maximum.
   The tint draws attention like the system's Done / primary action buttons.
   Use variant="default" for secondary actions alongside a tinted primary.     */
type LiquidGlassButtonVariant = "seed" | "blue" | "cyan" | "default";
type LiquidGlassButtonSize = "sm" | "md" | "lg";

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  variant?: LiquidGlassButtonVariant;
  size?: LiquidGlassButtonSize;
  /** Show trailing arrow icon */
  icon?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const lgButtonVariantClass: Record<LiquidGlassButtonVariant, string> = {
  seed: "liquid-glass-tinted-seed text-white",
  blue: "liquid-glass-tinted-blue text-white",
  cyan: "liquid-glass-tinted-cyan text-white",
  default: "liquid-glass text-white/90",
};

const lgButtonSizeClass: Record<LiquidGlassButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-2 rounded-xl",
  md: "px-6 py-2.5 text-sm gap-2.5 rounded-xl",
  lg: "px-8 py-4 text-base gap-3 rounded-2xl",
};

export function LiquidGlassButton({
  children,
  variant = "seed",
  size = "lg",
  icon = true,
  href,
  className,
  onClick,
  type = "button",
}: LiquidGlassButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium relative overflow-hidden liquid-glass-hover transition-colors duration-300",
    lgButtonVariantClass[variant],
    lgButtonSizeClass[size],
    className
  );

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="w-4 h-4 shrink-0" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}

/* ── LiquidGlassBar — Floating toolbar / grouped control bar ─────────────────
   Mirrors iOS/macOS toolbars, tab bars, and floating control groups.
   Use rounded="pill" for compact floating bars (like iOS tab bars).
   Use rounded="card" for wider panels with more content.                       */
interface LiquidGlassBarProps {
  children: React.ReactNode;
  className?: string;
  rounded?: "pill" | "card";
}

export function LiquidGlassBar({
  children,
  className,
  rounded = "card",
}: LiquidGlassBarProps) {
  return (
    <div
      className={cn(
        "liquid-glass inline-flex items-center gap-2 px-3 py-2 relative overflow-hidden",
        rounded === "pill" ? "rounded-full" : "rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── LiquidGlassDivider — Frosted separator line ─────────────────────────────
   Subtle separator that lets underlying content show through, consistent with
   the Apple liquid glass layering system.                                       */
export function LiquidGlassDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent",
        className
      )}
    />
  );
}
