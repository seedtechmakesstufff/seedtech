import Link from "next/link";
import { ArrowRight, Shield, ShieldCheck, ShieldPlus, Headphones, Clock, Lock, Users, BarChart3, Zap } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  GradientText,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CardTitle,
  Body,
  CheckList,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

const features = [
  { icon: Headphones, title: "Unlimited Help Desk", body: "Remote support for every user on your team — no ticket caps, no hourly billing." },
  { icon: Clock, title: "Fast Response Times", body: "Critical issues triaged in under 15 minutes. Most resolved same day." },
  { icon: Lock, title: "Security Built In", body: "Antivirus, patch management, and endpoint monitoring on every plan, always." },
  { icon: Users, title: "Per-User Pricing", body: "One flat rate per person on your team. Simple, predictable, no surprises." },
  { icon: BarChart3, title: "Transparent Reporting", body: "Monthly health reports covering tickets, response times, and system status." },
  { icon: Zap, title: "No Long-Term Contracts", body: "Month-to-month. We earn your business every billing cycle." },
];

const tiers = [
  {
    icon: Shield,
    name: "SeedCare Essentials",
    price: "$110",
    unit: "/user/mo",
    description: "Remote support and monitoring for small teams.",
    features: ["Unlimited remote help desk", "Endpoint monitoring", "Patch management", "Antivirus management"],
  },
  {
    icon: ShieldCheck,
    name: "SeedCare Plus",
    price: "$130",
    unit: "/user/mo",
    description: "Proactive monitoring with on-site support.",
    highlight: true,
    features: ["Everything in Essentials", "Up to 4 hrs/mo on-site", "Network monitoring", "50 GB cloud backup"],
  },
  {
    icon: ShieldPlus,
    name: "SeedCare Pro",
    price: "$160",
    unit: "/user/mo",
    description: "Full-service IT for growing organizations.",
    features: ["Everything in Plus", "Unlimited on-site support", "Unlimited cloud backup", "Quarterly vCIO sessions", "Priority response"],
  },
];

export default function ManagedITPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Managed IT Support</LiquidGlassPill>
          <h1 className="font-display text-title md:text-display text-white leading-[1.05] mb-6 max-w-3xl">
            Proactive IT{" "}
            <GradientText as="span">Support</GradientText>
          </h1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            24/7 monitoring, unlimited help desk, and rapid on-site response so you never worry about
            downtime again — all for one flat monthly rate per user.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton
              service="it-support"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden"
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link
              href="/pricing/it-support"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section>
        <SectionHeader
          eyebrow="What's Included"
          title="Everything You Need, Nothing You Don't"
          description="Every SeedCare plan ships with the core protections your business needs — no nickel-and-diming."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <LiquidGlassCard key={f.title} className="p-7">
              <IconBox icon={f.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{f.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{f.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section theme="dark">
        <SectionHeader
          eyebrow="Plans"
          title="Choose Your Coverage"
          description="Three tiers to match your team size and support needs. All include unlimited remote help desk."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <LiquidGlassCard
              key={tier.name}
              className={`p-6 flex flex-col ${tier.highlight ? "liquid-glass-tinted-seed" : ""}`}
            >
              {tier.highlight && (
                <LiquidGlassPill variant="seed" size="sm" className="self-start mb-4">Most Popular</LiquidGlassPill>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center">
                  <tier.icon className="w-5 h-5 text-seed-400" />
                </div>
                <h3 className="font-display text-card-title text-white">{tier.name}</h3>
              </div>
              <p className="text-body-sm text-light-base/50 mb-4">{tier.description}</p>
              <div className="mb-5">
                <span className="font-display text-heading text-seed-400">{tier.price}</span>
                <span className="text-body-sm text-light-base/40">{tier.unit}</span>
              </div>
              <CheckList theme="dark" items={tier.features} className="mb-6 flex-1" />
              <Link
                href="/pricing/it-support#calculator"
                className={`w-full text-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  tier.highlight ? "liquid-glass-tinted-seed liquid-glass-hover text-white" : "liquid-glass text-white"
                }`}
              >
                Get Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </LiquidGlassCard>
          ))}
        </div>
        <p className="text-center text-body-sm text-light-base/30 mt-8">
          Need a custom plan?{" "}
          <Link href="/contact" className="text-seed-400 hover:text-seed-300 transition-colors">
            Let&apos;s talk →
          </Link>
        </p>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Simplify Your IT?"
          description="Get a custom quote in under 60 seconds. No commitment, no jargon."
          primaryLabel="Get Instant Quote"
          primaryHref="/pricing/it-support"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
