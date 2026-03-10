import { IconBox } from "@/components/kit";
import { Shield, Globe, BarChart3, Cloud, Code, Zap } from "lucide-react";

export function IconBoxShowcase() {
  const variants = ["gradient", "soft-dark", "soft-light", "outline"] as const;
  const sizes = ["sm", "md", "lg", "xl"] as const;

  return (
    <div className="space-y-8 mt-4">
      {/* Variant matrix */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Variants
        </span>
        <div className="flex flex-wrap items-end gap-6">
          <IconBox variant="gradient" icon={Shield} />
          <IconBox variant="soft-dark" icon={Globe} />
          <IconBox variant="soft-light" icon={BarChart3} />
          <IconBox variant="outline" icon={Cloud} />
        </div>
      </div>

      {/* Size matrix */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Sizes (gradient variant)
        </span>
        <div className="flex flex-wrap items-end gap-4">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <IconBox variant="gradient" icon={Code} size={size} />
              <span className="text-[10px] font-mono text-light-base/40">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All icons row */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Sample Icons
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {[Shield, Globe, BarChart3, Cloud, Code, Zap].map((Icon, i) => (
            <IconBox key={i} variant="gradient" icon={Icon} size="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
