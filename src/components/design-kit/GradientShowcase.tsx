export function GradientShowcase() {
  const gradients = [
    { name: "Brand", classes: "bg-gradient-to-r from-seed-400 to-seed-600" },
    { name: "IT Services", classes: "bg-gradient-to-r from-brand-blue to-brand-cyan" },
    { name: "Web Dev", classes: "bg-gradient-to-r from-seed-400 to-brand-emerald" },
    { name: "Marketing", classes: "bg-gradient-to-r from-brand-cyan to-seed-400" },
    { name: "Glow", classes: "bg-gradient-to-r from-seed-400/20 via-brand-blue/20 to-brand-cyan/20" },
    { name: "Brand Text", classes: "bg-gradient-to-r from-seed-300 via-seed-400 to-brand-emerald" },
  ];

  return (
    <div className="mt-10">
      <h3 className="text-card-title font-display font-semibold text-light-base/80 mb-4">
        Gradients
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gradients.map((g) => (
          <div key={g.name} className="flex flex-col">
            <div className={`h-20 rounded-xl ${g.classes}`} />
            <span className="mt-2 text-body-sm font-medium text-light-base/70">{g.name}</span>
            <span className="text-[10px] font-mono text-light-base/40 break-all">{g.classes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
