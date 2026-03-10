import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Avatar } from "./Avatar";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initials?: string;
  rating?: number;
  theme?: "dark" | "light";
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  role,
  initials,
  rating = 5,
  theme = "dark",
  className,
}: TestimonialCardProps) {
  const isDark = theme === "dark";
  const derivedInitials = initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={cn("space-y-5", className)}>
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <p className={cn(
        "text-body leading-relaxed",
        isDark ? "text-white/70" : "text-dark-base/70"
      )}>
        {quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar initials={derivedInitials} size="md" />
        <div>
          <p className={cn(
            "text-sm font-medium",
            isDark ? "text-white" : "text-dark-base"
          )}>
            {name}
          </p>
          <p className={cn(
            "text-xs",
            isDark ? "text-white/40" : "text-dark-base/40"
          )}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
