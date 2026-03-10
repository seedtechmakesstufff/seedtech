/* ── Gradient Divider ── */
export function GradientDivider({ className }: { className?: string }) {
  return <div className={`gradient-divider ${className || ""}`} />;
}

/* ── Solid Divider ── */
export function SolidDivider({ className }: { className?: string }) {
  return <div className={`solid-divider ${className || ""}`} />;
}

/* ── Timeline Line ── */
export function TimelineLine({ className }: { className?: string }) {
  return (
    <div className={`w-px bg-gradient-to-b from-seed-600/40 via-seed-500/20 to-transparent ${className || ""}`} />
  );
}

/* ── Timeline Dot ── */
export function TimelineDot({ active = true, className }: { active?: boolean; className?: string }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 shrink-0 ${
        active
          ? "border-seed-500 bg-seed-500/30 shadow-glowSeed"
          : "border-white/20 bg-dark-elevated"
      } ${className || ""}`}
    />
  );
}
