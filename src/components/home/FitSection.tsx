import { Check } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

const bullets = [
  "A team that helps keep things running",
  "Fewer repeat issues over time",
  "Clear communication and follow-through",
  "Support for both operations and digital presence when needed",
];

export function FitSection() {
  return (
    <Section theme="light">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeader
          eyebrow="A Good Fit for"
          title="Businesses That Want a"
          titleHighlight="Real Technology Partner"
          description="We work best with businesses that want dependable support, fewer recurring technology problems, and a clearer path forward."
          align="center"
          theme="light"
        />

        <ul className="mt-8 space-y-4 text-left max-w-md mx-auto">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-body text-dark-base/70">
              <Check className="w-5 h-5 text-seed-600 shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
