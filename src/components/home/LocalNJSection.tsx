import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export function LocalNJSection() {
  return (
    <Section theme="dark">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeader
          eyebrow="Serving Northern New Jersey"
          title="Local Support for Businesses That Want"
          titleHighlight="Clear, Practical Help"
          align="center"
          theme="dark"
        />

        <p className="text-body text-white/60 leading-relaxed mt-6">
          SeedTech works with businesses across Northern New Jersey that want technology support they can actually rely on.
        </p>
        <p className="text-body text-white/60 leading-relaxed mt-4">
          Whether the need is proactive IT support, website help, or SEO guidance, our focus is the same: keep things clear, keep things moving, and make technology easier to manage over time.
        </p>
      </div>
    </Section>
  );
}
