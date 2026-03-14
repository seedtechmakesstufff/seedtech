import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GlassCard, IconBox, CardTitle, BodyLg, CheckList, TextLink } from "@/components/kit";
import { LiquidGlassPill } from "@/components/kit";
import { Shield, Globe, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Shield,
    label: "IT Support",
    pillVariant: "default" as const,
    title: "Managed IT Support",
    description: "Flat-rate, all-inclusive IT management that keeps your business running at peak performance — without the overhead of an in-house team.",
    features: [
      "24/7 help desk & monitoring",
      "Proactive patch management",
      "Same-day on-site support",
      "Vendor & license management",
      "Cybersecurity & compliance",
    ],
    href: "/services/managed-it",
    linkLabel: "View IT Services",
    iconBg: "bg-gradient-it",
  },
  {
    icon: Globe,
    label: "Web Dev",
    pillVariant: "seed" as const,
    title: "Web Development",
    description: "Custom-built websites and web applications that load fast, rank well, and convert visitors into customers.",
    features: [
      "Custom Next.js & React builds",
      "E-commerce & client portals",
      "CMS integrations",
      "Core Web Vitals optimized",
      "Ongoing maintenance & support",
    ],
    href: "/services/web-development",
    linkLabel: "View Web Services",
    iconBg: "bg-gradient-web",
  },
  {
    icon: BarChart3,
    label: "Marketing",
    pillVariant: "cyan" as const,
    title: "Digital Marketing",
    description: "Data-backed marketing strategy that puts your brand in front of the right audience and turns clicks into revenue.",
    features: [
      "SEO & local search strategy",
      "Paid media (Google & Meta)",
      "Email marketing & automation",
      "Content creation & strategy",
      "Monthly performance reporting",
    ],
    href: "/services/marketing",
    linkLabel: "View Marketing Services",
    iconBg: "bg-gradient-marketing",
  },
];

export function ServicesSection() {
  return (
    <Section theme="light">
      <SectionHeader
        eyebrow="Services"
        title="Everything Your Business Needs"
        titleHighlight="Needs"
        description="Three pillars of service, one team, one relationship. No finger-pointing between vendors."
        align="center"
        theme="light"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <GlassCard key={s.title} theme="light" className="flex flex-col gap-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <IconBox icon={s.icon} variant="gradient" size="lg" />
              <LiquidGlassPill variant={s.pillVariant} size="sm" dot onLight>
                {s.label}
              </LiquidGlassPill>
            </div>

            <CardTitle className="text-dark-base">{s.title}</CardTitle>
            <BodyLg className="text-dark-base/60 text-body">{s.description}</BodyLg>

            <CheckList items={s.features} theme="light" className="mt-1" />

            <div className="mt-auto pt-2">
              <TextLink href={s.href} color="seed">
                {s.linkLabel}
              </TextLink>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
