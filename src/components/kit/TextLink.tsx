import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type LinkColor = "seed" | "blue" | "cyan" | "white";

interface TextLinkProps {
  href: string;
  color?: LinkColor;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<LinkColor, string> = {
  seed: "text-seed-400 hover:text-seed-300",
  blue: "text-brand-blue hover:text-blue-400",
  cyan: "text-brand-cyan hover:text-cyan-300",
  white: "text-white hover:text-white/80",
};

export function TextLink({ href, color = "seed", children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium transition-colors group",
        colorClasses[color],
        className
      )}
    >
      {children}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
