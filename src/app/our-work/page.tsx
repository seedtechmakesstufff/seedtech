import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function OurWorkPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Portfolio"
          title="Our"
          titleHighlight="Work"
          description="Real results for real businesses — browse our case studies and see the impact we've made."
        />
      </Section>
    </div>
  );
}
