import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function ManagedITPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Managed IT"
          title="Proactive IT"
          titleHighlight="Support"
          description="24/7 monitoring, rapid response, and strategic IT planning so you never worry about downtime again."
        />
      </Section>
    </div>
  );
}
