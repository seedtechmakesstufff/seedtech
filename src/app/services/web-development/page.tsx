import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function WebDevelopmentPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Web Development"
          title="Websites That"
          titleHighlight="Convert"
          description="Custom-built, high-performance websites designed to turn visitors into customers."
        />
      </Section>
    </div>
  );
}
