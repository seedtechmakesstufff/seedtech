import { Button, TextLink } from "@/components/kit";

export function ButtonShowcase() {
  const variants = ["primary", "secondary", "ghost", "outline", "glow-blue", "glow-cyan"] as const;
  const sizes = ["sm", "md", "lg"] as const;
  const icons = ["arrow", "arrow-up", "send", "none"] as const;

  return (
    <div className="space-y-10 mt-4">
      {/* Variant matrix */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Variants × Sizes
        </span>
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="w-28 text-body-sm font-mono text-light-base/50">{variant}</span>
              {sizes.map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {variant} {size}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Icon variations */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Icon Variants
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {icons.map((icon) => (
            <Button key={icon} variant="primary" icon={icon}>
              Icon: {icon}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Links */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Text Links
        </span>
        <div className="flex flex-wrap items-center gap-6">
          <TextLink href="#" color="seed">Seed Link</TextLink>
          <TextLink href="#" color="blue">Blue Link</TextLink>
          <TextLink href="#" color="cyan">Cyan Link</TextLink>
          <TextLink href="#" color="white">White Link</TextLink>
        </div>
      </div>
    </div>
  );
}
