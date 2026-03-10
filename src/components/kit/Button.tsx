import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Send } from "lucide-react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "glow-blue" | "glow-cyan";
type ButtonSize = "sm" | "md" | "lg";
type IconType = "arrow" | "arrow-up" | "send" | "none";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  children: React.ReactNode;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-brand text-white hover:shadow-glowSeed",
  secondary:
    "bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1]",
  ghost:
    "text-white/70 hover:text-white hover:bg-white/[0.04]",
  outline:
    "border border-white/[0.12] text-white hover:bg-white/[0.04]",
  "glow-blue":
    "bg-brand-blue text-white hover:shadow-glowBlue",
  "glow-cyan":
    "bg-brand-cyan text-white hover:shadow-glowCyan",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-2",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-3",
};

function ButtonIcon({ icon }: { icon: IconType }) {
  if (icon === "none") return null;
  const iconClass = "w-4 h-4";
  switch (icon) {
    case "arrow":
      return <ArrowRight className={iconClass} />;
    case "arrow-up":
      return <ArrowUpRight className={iconClass} />;
    case "send":
      return <Send className={iconClass} />;
    default:
      return <ArrowRight className={iconClass} />;
  }
}

export function Button({
  variant = "primary",
  size = "lg",
  icon = "arrow",
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-300",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {children}
      <ButtonIcon icon={icon} />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
