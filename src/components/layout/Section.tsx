import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  theme?: "dark" | "light";
  id?: string;
}

export function Section({ children, className, theme = "dark", id }: SectionProps) {
  return (
    <section
      id={id}
      data-section-theme={theme}
      className={cn(
        "relative py-24 md:py-32 overflow-hidden",
        theme === "dark" ? "bg-dark-base text-white" : "bg-light-base text-dark-base",
        className
      )}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}
