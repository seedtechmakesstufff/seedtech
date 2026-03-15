import Link from "next/link";
import { ArrowRight, Globe, Shield, Check } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { LiquidGlassPill } from "@/components/kit";

const solutions = [
  {
    icon: Globe,
    pill: "Web Development",
    pillVariant: "seed" as const,
    title: "Websites That Drive Business",
    description:
      "Custom-built websites engineered for performance, SEO, and conversion — launched faster with our AI-accelerated development pipeline.",
    features: [
      "Custom websites & web applications",
      "Conversion optimization",
      "SEO foundation built in",
      "Fast launch timelines",
      "Industry-specific designs",
    ],
    cta: "Launch Your Website",
    href: "/services/web-development",
  },
  {
    icon: Shield,
    pill: "Managed IT",
    pillVariant: "default" as const,
    title: "Managed IT & Cybersecurity",
    description:
      "Proactive IT management that keeps your infrastructure secure, compliant, and running — so you never have to think about it.",
    features: [
      "24/7 monitoring & help desk",
      "Data protection & backups",
      "Cloud infrastructure management",
      "Email security & filtering",
      "Compliance support",
    ],
    cta: "Protect Your Business",
    href: "/services/managed-it",
  },
];

export function ServicesSection() {
  return (
    <Section theme="light">
      <SectionHeader
        eyebrow="Services"
        title="Two Services. One Partner."
        titleHighlight="One Partner."
        description="Most businesses juggle separate vendors for their website and IT. We handle both — so your technology actually works together."
        align="center"
        theme="light"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {solutions.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-3xl border border-black/[0.07] bg-white shadow-cardLight p-8 md:p-10 flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-seed-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-seed-600" />
                </div>
                <LiquidGlassPill variant={s.pillVariant} size="sm" dot onLight>
                  {s.pill}
                </LiquidGlassPill>
              </div>

              <h3 className="font-display text-heading text-dark-base leading-tight">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-body text-dark-base/60 leading-relaxed">{s.description}</p>

              {/* Features */}
              <ul className="space-y-3">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-body-sm text-dark-base/70">
                    <Check className="w-4 h-4 text-seed-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto pt-2">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-seed-600 to-seed-500 text-white hover:shadow-glowSeed transition-all duration-200"
                >
                  {s.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
