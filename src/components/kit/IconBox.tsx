import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type IconBoxVariant = "gradient" | "soft-light" | "soft-dark" | "outline";
type IconBoxSize = "sm" | "md" | "lg" | "xl";

interface IconBoxProps {
  icon: LucideIcon;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const variantClasses: Record<IconBoxVariant, string> = {
  gradient: "bg-gradient-brand text-white",
  "soft-light": "bg-white/[0.06] text-seed-400",
  "soft-dark": "bg-dark-elevated text-seed-400 border border-white/[0.06]",
  outline: "border border-white/[0.12] text-white/60",
};

const sizeMap: Record<IconBoxSize, { box: string; icon: number }> = {
  sm: { box: "w-10 h-10 rounded-lg", icon: 16 },
  md: { box: "w-12 h-12 rounded-xl", icon: 20 },
  lg: { box: "w-14 h-14 rounded-xl", icon: 24 },
  xl: { box: "w-16 h-16 rounded-2xl", icon: 28 },
};

export function IconBox({
  icon: Icon,
  variant = "gradient",
  size = "lg",
  className,
}: IconBoxProps) {
  const { box, icon: iconSize } = sizeMap[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        box,
        variantClasses[variant],
        className
      )}
    >
      <Icon size={iconSize} />
    </div>
  );
}
