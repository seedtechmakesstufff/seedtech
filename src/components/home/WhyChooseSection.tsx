import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard, IconBox } from "@/components/kit";
import { Zap, Shield, Building2 } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    number: "01",
    title: "Expert Website Development",
    body: "Our development pipeline and reusable systems launch high-performance websites efficiently and on budget.",
  },
  {
    icon: Shield,
    number: "02",
    title: "Technology + IT in One Partner",
    body: "Unlike traditional agencies, we manage both your website and your IT infrastructure — ensuring your entire technology stack works together securely and efficiently.",
  },
  {
    icon: Building2,
    number: "03",
    title: "Built for Real Businesses",
    body: "We specialize in industries where reliability matters most: construction, trucking, law, rigging, and private practices.",
  },
];

export function WhyChooseSection() {
  return (
    <Section theme="dark">
      <SectionHeader
        eyebrow="Why SeedTech"
        title="Why Businesses Choose"
        titleHighlight="SeedTech"
        description="Three things that make us different from every other agency or IT vendor you've worked with."
        align="center"
        theme="dark"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((r) => (
          <GlassCard key={r.number} theme="dark" className="flex flex-col gap-5 p-8">
            <div className="flex items-start justify-between gap-4">
              <IconBox icon={r.icon} variant="gradient" size="lg" />
              <span className="font-display text-display text-white/[0.06] leading-none select-none">
                {r.number}
              </span>
            </div>
            <h3 className="font-display text-card-title text-white leading-snug">
              {r.title}
            </h3>
            <p className="text-body text-light-base/55 leading-relaxed">
              {r.body}
            </p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
