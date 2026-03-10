import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: "center" | "left";
  theme?: "dark" | "light";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  align = "center",
  theme = "dark",
  className,
}: SectionHeaderProps) {
  const isDark = theme === "dark";

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
      <h2 className={cn(
        "font-display text-heading md:text-heading-lg",
        isDark ? "text-white" : "text-dark-base"
      )}>
        {title}
        {titleHighlight && (
          <span className="text-gradient-brand"> {titleHighlight}</span>
        )}
      </h2>
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
