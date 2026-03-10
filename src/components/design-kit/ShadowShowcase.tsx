export function ShadowShowcase() {
  const shadows = [
    { name: "Card (Dark)", class: "shadow-cardDark" },
    { name: "Card (Light)", class: "shadow-cardLight" },
    { name: "Nav", class: "shadow-nav" },
    { name: "Dropdown", class: "shadow-dropdown" },
    { name: "Elevated", class: "shadow-elevated" },
    { name: "Glow Seed", class: "shadow-glowSeed" },
    { name: "Glow Seed Lg", class: "shadow-glowSeedLg" },
    { name: "Glow Blue", class: "shadow-glowBlue" },
    { name: "Glow Cyan", class: "shadow-glowCyan" },
    { name: "Pricing Highlight", class: "shadow-pricingHighlight" },
  ];

  return (
    <div className="mt-10">
      <h3 className="text-card-title font-display font-semibold text-light-base/80 mb-4">
        Shadows &amp; Glows
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {shadows.map((s) => (
          <div key={s.name} className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-xl bg-dark-elevated border border-white/5 ${s.class}`} />
            <span className="mt-3 text-body-sm font-medium text-light-base/70 text-center">{s.name}</span>
            <span className="text-[10px] font-mono text-light-base/40">{s.class}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
