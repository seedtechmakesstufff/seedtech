import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { ArrowRight, Shield, Globe } from "lucide-react";
import { Section } from "@/components/layout/Section";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CheckList,
  AnimatedH1,
  AnimatedH2,
} from "@/components/kit";

export const generateMetadata = buildMetadata("/services");

const services = [
  {
    icon: Shield,
    label: "Managed IT",
    variant: "seed" as const,
    href: "/services/managed-it",
    title: "Managed IT Support",
    headline: "Your IT. Fully Covered.",
    description:
      "Proactive monitoring, unlimited remote support, and rapid on-site response — all for one flat monthly rate per user.",
    features: [
      "24/7 endpoint monitoring",
      "Unlimited remote help desk",
      "Patch & antivirus management",
      "Cloud backup included",
      "No long-term contracts",
    ],
  },
  {
    icon: Globe,
    label: "Web Development",
    variant: "blue" as const,
    href: "/services/web-development",
    title: "Web Development",
    headline: "Websites That Work.",
    description:
      "Custom-coded websites, ecommerce platforms, and web applications built for performance, SEO, and conversion.",
    features: [
      "100% custom design — no templates",
      "Mobile-responsive & lightning fast",
      "SEO-ready architecture",
      "Ecommerce & web application builds",
      "Post-launch support available",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 text-center">
        <GradientOrb color="seed" size="xl" className="-top-40 left-1/2 -translate-x-1/2 opacity-20" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">What We Do</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Technology"]} className="mb-6">
            Two Pillars of Technology
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl mx-auto leading-relaxed">
            IT support and web development — built to keep your business running, visible, and growing.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <Section>
        <div className="space-y-8">
          {services.map((svc) => (
            <LiquidGlassCard key={svc.href} className="p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <IconBox icon={svc.icon} variant="gradient" />
                    <LiquidGlassPill variant={svc.variant}>{svc.label}</LiquidGlassPill>
                  </div>
                  <AnimatedH2 className="font-display text-heading text-white mb-2">{svc.headline}</AnimatedH2>
                  <p className="text-body text-light-base/60 leading-relaxed mb-6">{svc.description}</p>
                  <Link
                    href={svc.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-seed-400 hover:text-seed-300 transition-colors"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <CheckList theme="dark" items={svc.features} />
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Not Sure Where to Start?"
          description="We'll help you figure out exactly what your business needs. Free consultation, no pressure."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="See Pricing"
          secondaryHref="/pricing/it-support"
        />
      </Section>
    </div>
  );
}
