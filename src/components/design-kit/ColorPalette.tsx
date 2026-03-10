export function ColorPalette() {
  const palettes = [
    {
      name: "Seed (Primary)",
      colors: [
        { label: "50", value: "#f0fdf4", dark: false },
        { label: "100", value: "#dcfce7", dark: false },
        { label: "200", value: "#bbf7d0", dark: false },
        { label: "300", value: "#86efac", dark: false },
        { label: "400", value: "#4ade80", dark: false },
        { label: "500", value: "#40A660", dark: false },
        { label: "600", value: "#2d8a4a", dark: true },
        { label: "700", value: "#1a6d34", dark: true },
        { label: "800", value: "#14532d", dark: true },
        { label: "900", value: "#0f4024", dark: true },
        { label: "950", value: "#052e16", dark: true },
      ],
    },
    {
      name: "Dark Surfaces",
      colors: [
        { label: "base", value: "#0a0a0f", dark: true },
        { label: "raised", value: "#0c0c14", dark: true },
        { label: "elevated", value: "#14141f", dark: true },
        { label: "overlay", value: "#1a1a28", dark: true },
      ],
    },
    {
      name: "Light Surfaces",
      colors: [
        { label: "base", value: "#f8f8fa", dark: false },
        { label: "raised", value: "#ffffff", dark: false },
        { label: "muted", value: "#f0f0f5", dark: false },
        { label: "border", value: "#e2e2ea", dark: false },
      ],
    },
    {
      name: "Brand Accents",
      colors: [
        { label: "blue", value: "#3b82f6", dark: false },
        { label: "cyan", value: "#06b6d4", dark: false },
        { label: "emerald", value: "#10b981", dark: false },
        { label: "error", value: "#ef4444", dark: false },
      ],
    },
  ];

  return (
    <div className="space-y-10 mt-10">
      {palettes.map((palette) => (
        <div key={palette.name}>
          <h3 className="text-card-title font-display font-semibold text-light-base/80 mb-4">
            {palette.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {palette.colors.map((c) => (
              <div key={c.label} className="flex flex-col">
                <div
                  className="h-16 rounded-lg border border-white/5"
                  style={{ backgroundColor: c.value }}
                />
                <span className={`mt-1.5 text-body-sm font-medium ${c.dark ? "text-light-base/60" : "text-dark-base/60"} text-light-base/60`}>
                  {c.label}
                </span>
                <span className="text-[10px] font-mono text-light-base/40">
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
