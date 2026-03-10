import { cn } from "@/lib/utils";

/* ── Gradient Orb ── */
export interface GradientOrbProps {
  className?: string;
  color?: "seed" | "blue" | "cyan";
  size?: "sm" | "md" | "lg" | "xl";
}

const orbColors = {
  seed: "from-seed-600/20 to-emerald-600/20",
  blue: "from-brand-blue/20 to-brand-cyan/20",
  cyan: "from-brand-cyan/20 to-emerald-600/20",
};

const orbSizes = {
  sm: "w-[200px] h-[200px] blur-[60px]",
  md: "w-[300px] h-[300px] blur-[90px]",
  lg: "w-[400px] h-[400px] blur-[120px]",
  xl: "w-[600px] h-[600px] blur-[180px]",
};

export function GradientOrb({ className, color = "seed", size = "lg" }: GradientOrbProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-to-br opacity-40",
        orbSizes[size],
        orbColors[color],
        className
      )}
    />
  );
}

/* ── Floating Orb (animated) ── */
interface FloatingOrbProps extends GradientOrbProps {
  delay?: number;
}

export function FloatingOrb({ className, color = "seed", size = "lg", delay = 0 }: FloatingOrbProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-to-br opacity-30 animate-float",
        orbSizes[size],
        orbColors[color],
        className
      )}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    />
  );
}

/* ── Grid Pattern ── */
export function GridPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 opacity-[0.03]", className)}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/* ── Dot Pattern ── */
export function DotPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 opacity-[0.04]", className)}
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

/* ── Ambient Glow ── */
const ambientColors = {
  seed: "bg-gradient-glow",
  blue: "bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10",
  cyan: "bg-gradient-to-r from-brand-cyan/10 to-emerald-600/10",
};

export function AmbientGlow({ className, color = "seed" }: { className?: string; color?: "seed" | "blue" | "cyan" }) {
  return (
    <div
      className={cn(
        "absolute inset-0 animate-pulse-glow pointer-events-none",
        ambientColors[color],
        className
      )}
    />
  );
}

/* ── Gradient Overlay ── */
export function GradientOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-b from-dark-base via-transparent to-dark-base pointer-events-none",
        className
      )}
    />
  );
}
