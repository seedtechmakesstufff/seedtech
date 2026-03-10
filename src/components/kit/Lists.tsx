import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/* ── CheckList ── */
interface CheckListProps {
  items: string[];
  columns?: 1 | 2;
  theme?: "dark" | "light";
  className?: string;
}

export function CheckList({ items, columns = 1, theme = "dark", className }: CheckListProps) {
  const isDark = theme === "dark";
  return (
    <ul
      className={cn(
        "space-y-3",
        columns === 2 && "grid grid-cols-2 gap-x-8 gap-y-3 space-y-0",
        className
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <Check className={cn("w-4 h-4 shrink-0", isDark ? "text-seed-500" : "text-seed-600")} />
          <span className={cn("text-sm", isDark ? "text-white/70" : "text-dark-base/70")}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── ResultList ── */
interface ResultListProps {
  items: string[];
  className?: string;
}

export function ResultList({ items, className }: ResultListProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-seed-500 shrink-0" />
          <span className="text-sm text-white/70">{item}</span>
        </li>
      ))}
    </ul>
  );
}
