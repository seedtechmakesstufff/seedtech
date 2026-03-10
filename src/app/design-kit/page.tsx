import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { DesignKitHero } from "@/components/design-kit/DesignKitHero";
import { ColorPalette } from "@/components/design-kit/ColorPalette";
import { GradientShowcase } from "@/components/design-kit/GradientShowcase";
import { ShadowShowcase } from "@/components/design-kit/ShadowShowcase";
import { TypographyShowcase } from "@/components/design-kit/TypographyShowcase";
import { ButtonShowcase } from "@/components/design-kit/ButtonShowcase";
import { BadgeShowcase } from "@/components/design-kit/BadgeShowcase";
import { IconBoxShowcase } from "@/components/design-kit/IconBoxShowcase";
import { CardShowcase } from "@/components/design-kit/CardShowcase";
import { ListShowcase } from "@/components/design-kit/ListShowcase";
import { FormShowcase } from "@/components/design-kit/FormShowcase";
import { EffectsShowcase } from "@/components/design-kit/EffectsShowcase";
import { CTAShowcase } from "@/components/design-kit/CTAShowcase";

export default function DesignKitPage() {
  return (
    <div className="pt-20">
      <DesignKitHero />

      {/* Design Tokens */}
      <Section>
        <SectionHeader eyebrow="Component" title="Design Tokens" description="Centralized brand values — palette, gradients, shadows, and type scale." />
        <ColorPalette />
        <GradientShowcase />
        <ShadowShowcase />
      </Section>

      {/* Typography */}
      <Section>
        <SectionHeader eyebrow="Component" title="Typography" description="All text components use Space Grotesk for headings and Inter for body." />
        <TypographyShowcase />
      </Section>

      {/* Buttons & Links */}
      <Section>
        <SectionHeader eyebrow="Component" title="Buttons & Links" description="Six button variants (primary, secondary, ghost, outline, glow-blue, glow-cyan) with 3 sizes." />
        <ButtonShowcase />
      </Section>

      {/* Badges */}
      <Section>
        <SectionHeader eyebrow="Component" title="Badges & Pills" description="Badge variants for status indicators, labels, and technology tags." />
        <BadgeShowcase />
      </Section>

      {/* Icon Boxes */}
      <Section>
        <SectionHeader eyebrow="Component" title="Icon Boxes" description="Four variants (gradient, soft-dark, soft-light, outline) with 4 sizes." />
        <IconBoxShowcase />
      </Section>

      {/* Cards */}
      <Section>
        <SectionHeader eyebrow="Component" title="Cards & Testimonials" description="GlassCard, ElevatedCard, TeamMemberCard, and TestimonialCard." />
        <CardShowcase />
      </Section>

      {/* Lists */}
      <Section>
        <SectionHeader eyebrow="Component" title="Checklists & Result Lists" description="CheckList with green check icons, ResultList with branded dot indicators." />
        <ListShowcase />
      </Section>

      {/* Form Fields */}
      <Section>
        <SectionHeader eyebrow="Component" title="Form Fields" description="Input, Textarea, and Select components with dark/light variants." />
        <FormShowcase />
      </Section>

      {/* Background Effects */}
      <Section>
        <SectionHeader eyebrow="Component" title="Background Effects" description="Decorative elements — gradient orbs, grid patterns, and ambient glows." />
        <EffectsShowcase />
      </Section>

      {/* CTA Banner */}
      <Section>
        <SectionHeader eyebrow="Component" title="CTA Banner" description="Full-width call-to-action section with ambient glow effects." />
        <CTAShowcase />
      </Section>
    </div>
  );
}
