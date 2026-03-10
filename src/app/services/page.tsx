import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="What We Do"
          title="Our"
          titleHighlight="Services"
          description="Three pillars of technology — IT support, web development, and digital marketing — designed to keep your business running, visible, and growing."
        />
      </Section>
    </div>
  );
}
