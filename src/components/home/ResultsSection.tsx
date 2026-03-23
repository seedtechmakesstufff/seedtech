import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard, StatNumber, Eyebrow, CardTitle, Body, TextLink } from "@/components/kit";
import { GradientOrb, DotPattern } from "@/components/kit";

const stats = [
  { number: "50+", label: "Businesses Supported" },
  { number: "98.9%", label: "Average Uptime" },
  { number: "16-28hr", label: "Avg. Response Time" },
  { number: "3×", label: "Avg. Traffic Growth" },
];

const featured = [
  {
    client: "PaddlersCove",
    category: "Web Development",
    title: "Custom BigCommerce Storefront & Inventory Platform",
    result: "Real-time Square + BigCommerce inventory sync across all channels.",
    href: "/our-work/paddlers-cove",
  },
  {
    client: "SeedTech Client",
    category: "Managed IT",
    title: "Full-Stack IT Takeover for 40-Seat Dental Practice",
    result: "Zero downtime migrations, 60% reduction in support tickets year-over-year.",
    href: "/our-work",
  },
];

export function ResultsSection() {
  return (
    <Section theme="dark">
      <GradientOrb
        color="blue"
        size="md"
        className="top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-15"
      />
      <DotPattern />

      <SectionHeader
        eyebrow="Our Work"
        title="Results That"
        titleHighlight="Speak for Themselves"
        description="Real businesses, real outcomes. Here's what we've built and the numbers behind it."
        align="center"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <GlassCard key={s.label} theme="dark" hover={false} className="text-center py-8">
            <StatNumber>{s.number}</StatNumber>
            <p className="text-body-sm text-white/50 mt-2">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Featured work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featured.map((p) => (
          <GlassCard key={p.title} theme="dark" className="flex flex-col gap-4">
            <Eyebrow>{p.category} · {p.client}</Eyebrow>
            <CardTitle className="text-white">{p.title}</CardTitle>
            <Body>{p.result}</Body>
            <div className="mt-auto pt-2">
              <TextLink href={p.href} color="seed">View Case Study</TextLink>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* View all work link */}
      <div className="text-center">
        <TextLink href="/our-work" color="white">
          See all our work
        </TextLink>
      </div>
    </Section>
  );
}
