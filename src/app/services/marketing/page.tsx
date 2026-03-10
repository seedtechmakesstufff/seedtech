import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function MarketingPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Digital Marketing"
          title="Data-Driven"
          titleHighlight="Marketing"
          description="SEO, content strategy, and performance marketing that drives measurable growth."
        />
      </Section>
    </div>
  );
}
