import { cn } from "@/lib/utils";

type BadgeVariant = "glass-dark" | "glass-light" | "solid" | "status" | "outline" | "dot";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  "glass-dark":
    "bg-white/[0.06] text-white/70 border border-white/[0.06] backdrop-blur-sm",
  "glass-light":
    "bg-black/[0.04] text-dark-base/70 border border-black/[0.06] backdrop-blur-sm",
  solid:
    "bg-seed-600/20 text-seed-400",
  status:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  outline:
    "border border-white/[0.12] text-white/60",
  dot:
    "bg-white/[0.06] text-white/70 border border-white/[0.06]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export function Badge({ children, variant = "glass-dark", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {variant === "dot" && (
        <span className="w-2 h-2 rounded-full bg-seed-500" />
      )}
      {children}
    </span>
  );
}

/* ── TechPill ── */
interface TechPillProps {
  children: React.ReactNode;
  className?: string;
}

export function TechPill({ children, className }: TechPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "bg-white/[0.06] border border-white/[0.08] text-white/60",
        className
      )}
    >
      {children}
    </span>
  );
}
