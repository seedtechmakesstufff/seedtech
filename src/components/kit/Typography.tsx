import { cn } from "@/lib/utils";

/* ── Typography Components ── */

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Display({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("font-display text-display", className)}>
      {children}
    </h1>
  );
}

export function Title({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("font-display text-title", className)}>
      {children}
    </h2>
  );
}

export function Heading({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("font-display text-heading", className)}>
      {children}
    </h2>
  );
}

export function HeadingLg({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("font-display text-heading-lg", className)}>
      {children}
    </h2>
  );
}

export function Subheading({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("font-display text-subheading", className)}>
      {children}
    </h3>
  );
}

export function CardTitle({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("font-display text-card-title", className)}>
      {children}
    </h4>
  );
}

export function Eyebrow({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-eyebrow uppercase tracking-widest text-seed-500", className)}>
      {children}
    </p>
  );
}

export function BodyLg({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body-lg text-white/60", className)}>
      {children}
    </p>
  );
}

export function Body({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body text-white/50", className)}>
      {children}
    </p>
  );
}

export function BodySm({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body-sm text-white/40", className)}>
      {children}
    </p>
  );
}

export function GradientText({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-gradient-brand", className)}>
      {children}
    </span>
  );
}

export function StatNumber({ children, className }: TypographyProps) {
  return (
    <span className={cn("font-display text-stat-number text-gradient-brand", className)}>
      {children}
    </span>
  );
}

export function StepNumber({ children, className }: TypographyProps) {
  return (
    <span className={cn("font-display text-step-number text-white/10", className)}>
      {children}
    </span>
  );
}
