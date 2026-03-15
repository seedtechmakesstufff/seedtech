import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard, IconBox, CardTitle, Body, GradientText, CheckList } from "@/components/kit";
import { GradientOrb } from "@/components/kit";
import { Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Proactive, Not Reactive",
    highlight: "Not Reactive",
    body: "We monitor your systems around the clock so issues get fixed before your team even notices them.",
    items: ["24/7 monitoring & alerting", "Same-day on-site response", "Zero-surprise flat-rate billing"],
  },
  {
    icon: Zap,
    title: "Built to Convert",
    highlight: "Convert",
    body: "Websites engineered for performance, SEO, and revenue — not just aesthetics.",
    items: ["Next.js & custom React builds", "Core Web Vitals optimized", "E-commerce & client portals"],
  },
];

export function WhySeedTechSection() {
  return (
    <Section theme="dark">
      {/* Background accent */}
      <GradientOrb
        color="seed"
        size="md"
        className="bottom-0 right-1/4 translate-y-1/2 opacity-15"
      />

      <SectionHeader
        eyebrow="Why SeedTech"
        title="Your All-in-One"
        titleHighlight="Technology Partner"
        description="From keeping the lights on to building your online presence — we cover every layer of your technology stack so you can focus on running the business."
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {features.map((f) => (
          <GlassCard key={f.title} theme="dark" className="flex flex-col gap-5">
            <IconBox icon={f.icon} variant="gradient" size="lg" />
            <CardTitle className="text-white">
              <GradientText>{f.highlight}</GradientText>
              {f.title.replace(f.highlight, "")}
            </CardTitle>
            <Body>{f.body}</Body>
            <CheckList items={f.items} theme="dark" className="mt-auto" />
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
