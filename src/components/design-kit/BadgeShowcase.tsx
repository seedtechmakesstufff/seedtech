import { Badge, TechPill } from "@/components/kit";

export function BadgeShowcase() {
  const badgeVariants = ["glass-dark", "glass-light", "solid", "status", "outline", "dot"] as const;

  return (
    <div className="space-y-8 mt-4">
      {/* Badge variants */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Badge Variants
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </div>

      {/* Badge sizes */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Badge Sizes
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="glass-dark" size="sm">Small</Badge>
          <Badge variant="glass-dark" size="md">Medium</Badge>
        </div>
      </div>

      {/* Tech Pills */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Tech Pills
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {["Next.js", "React", "TypeScript", "TailwindCSS", "Node.js", "AWS", "Azure"].map((t) => (
            <TechPill key={t}>{t}</TechPill>
          ))}
        </div>
      </div>
    </div>
  );
}
