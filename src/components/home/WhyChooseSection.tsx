import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard } from "@/components/kit";
import { MessageSquare, ShieldCheck, Wrench, Users, Layers } from "lucide-react";

const reasons = [
  {
    icon: MessageSquare,
    title: "Clear communication",
    body: "You should know what is happening, what was done, and what comes next.",
  },
  {
    icon: ShieldCheck,
    title: "Proactive where it counts",
    body: "We do our best to catch issues early and reduce avoidable disruptions.",
  },
  {
    icon: Wrench,
    title: "We focus on fixing it right",
    body: "When something goes wrong, we do not just patch it and move on.",
  },
  {
    icon: Users,
    title: "Support that feels personal",
    body: "We learn your environment so support feels smoother and more informed.",
  },
  {
    icon: Layers,
    title: "Websites and IT under one roof",
    body: "For businesses that need both, it is easier when the same team understands the full picture.",
  },
];

export function WhyChooseSection() {
  return (
    <Section theme="dark">
      <SectionHeader
        eyebrow="Why Businesses Choose SeedTech"
        title="Clear, Practical, and"
        titleHighlight="Easy to Work With"
        description="We believe technology support should help your business run more smoothly — not make things more confusing."
        align="center"
        theme="dark"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {reasons.map((r) => {
          const Icon = r.icon;
          return (
            <GlassCard key={r.title} theme="dark" className="flex flex-col gap-4 p-7">
              <div className="w-10 h-10 rounded-xl bg-seed-500/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-seed-400" />
              </div>
              <h3 className="font-display text-card-title text-white leading-snug">
                {r.title}
              </h3>
              <p className="text-body text-white/55 leading-relaxed">
                {r.body}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}
