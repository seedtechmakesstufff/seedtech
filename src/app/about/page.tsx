import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function AboutPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="About Us"
          title="The Team Behind"
          titleHighlight="SeedTech"
          description="We're a tight-knit crew of engineers, designers, and strategists passionate about helping businesses thrive through technology."
        />
      </Section>
    </div>
  );
}
