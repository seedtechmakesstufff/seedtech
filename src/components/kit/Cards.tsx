import { cn } from "@/lib/utils";

/* ── GlassCard ── */
interface GlassCardProps {
  children: React.ReactNode;
  theme?: "dark" | "light";
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, theme = "dark", className, hover = true }: GlassCardProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        isDark ? "glass-dark shadow-cardDark" : "glass-light shadow-cardLight",
        hover && "hover:-translate-y-1 hover:shadow-glowSeed",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── ElevatedCard ── */
interface ElevatedCardProps {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export function ElevatedCard({ children, highlight = false, className }: ElevatedCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8 bg-dark-elevated border border-white/[0.06] shadow-elevated transition-all duration-300",
        highlight && "border-seed-600/30 shadow-pricingHighlight",
        "hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
