"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  theme?: "dark" | "light";
  className?: string;
}

export function Marquee({ items, theme = "dark", className }: MarqueeProps) {
  const isDark = theme === "dark";
  const doubled = [...items, ...items];

  return (
    <div className={cn("overflow-hidden relative", className)}>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center mx-4">
            <span
              className={cn(
                "text-sm font-medium",
                isDark ? "text-white/40" : "text-dark-base/40"
              )}
            >
              {item}
            </span>
            {i < doubled.length - 1 && (
              <span
                className={cn(
                  "w-1 h-1 rounded-full mx-4",
                  isDark ? "bg-white/20" : "bg-dark-base/20"
                )}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── TechStackBar ── */
interface TechStackBarProps {
  items: string[];
  theme?: "dark" | "light";
  className?: string;
}

export function TechStackBar({ items, theme = "dark", className }: TechStackBarProps) {
  const isDark = theme === "dark";
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "px-5 py-3 rounded-full text-sm font-medium",
            isDark
              ? "bg-white/[0.04] border border-white/[0.06] text-white/70"
              : "bg-dark-base/[0.04] border border-dark-base/[0.06] text-dark-base/70"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
