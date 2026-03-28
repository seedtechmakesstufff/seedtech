import { cn } from "@/lib/utils";

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  theme?: "dark" | "light";
  className?: string;
}

export function ProcessStep({ step, title, description, theme = "light", className }: ProcessStepProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl p-8",
        isDark
          ? "bg-dark-elevated border border-white/[0.06]"
          : "bg-white border border-black/[0.04] shadow-cardLight",
        className
      )}
    >
      <span className={cn(
        "font-display text-[4rem] md:text-[5rem] leading-none block mb-5",
        isDark ? "text-white/[0.18]" : "text-dark-base/[0.18]"
      )}>
        {step}
      </span>
      <h3 className={cn(
        "font-display text-xl md:text-2xl mb-3",
        isDark ? "text-white" : "text-dark-base"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-body-sm leading-relaxed",
        isDark ? "text-white/50" : "text-dark-base/50"
      )}>
        {description}
      </p>
    </div>
  );
}
