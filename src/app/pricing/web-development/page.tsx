import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { GradientOrb, GridPattern, CTABanner, GradientText, GlassCard } from "@/components/kit";

export const metadata = {
  title: "Web Development Pricing — SeedTech",
  description:
    "Transparent pricing for professional website development. Starter, Growth, Ecommerce, and Custom Web Application packages.",
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface PricingTier {
  name: string;
  starting: string;
  description: string;
  includes: string[];
  bestFor: string[];
  highlighted?: boolean;
  includesLabel?: string;
  bestForLabel?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const tiers: PricingTier[] = [
  {
    name: "Starter Website",
    starting: "$2,500",
    description:
      "Perfect for small businesses that need a clean, professional online presence.",
    includesLabel: "Includes",
    includes: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Fast, modern website build",
      "Basic SEO setup",
      "Contact form",
      "Launch and deployment",
    ],
    bestForLabel: "Best for",
    bestFor: ["Local businesses", "Startups", "Service providers"],
  },
  {
    name: "Growth Website",
    starting: "$7,800",
    description:
      "For businesses that need a more robust website with custom layouts and deeper content.",
    highlighted: true,
    includesLabel: "Includes",
    includes: [
      "8–15 pages",
      "Custom design and layout",
      "Advanced UI components",
      "SEO-friendly structure",
      "Content strategy support",
      "Scalable architecture",
    ],
    bestForLabel: "Best for",
    bestFor: [
      "Growing businesses",
      "Professional services",
      "Organizations with multiple offerings",
    ],
  },
  {
    name: "Ecommerce Website",
    starting: "$15,000",
    description:
      "Full-featured ecommerce platforms designed to convert visitors into customers.",
    includesLabel: "Includes",
    includes: [
      "Custom storefront design",
      "Product catalog setup",
      "Secure checkout integration",
      "Payment gateway configuration",
      "Inventory management",
      "Scalable ecommerce architecture",
    ],
    bestForLabel: "Best for",
    bestFor: ["Product brands", "Retail businesses", "Subscription products"],
  },
  {
    name: "Custom Web Application",
    starting: "$10,000+",
    description:
      "For businesses that require custom platforms, portals, or specialized functionality.",
    includesLabel: "Examples",
    includes: [
      "Dashboards",
      "Internal business tools",
      "Booking systems",
      "Membership platforms",
      "Custom SaaS products",
    ],
    bestForLabel: "Built with",
    bestFor: ["Modern technologies designed for performance and scalability."],
  },
];

const addOns = [
  "Website care plans",
  "SEO optimization",
  "Analytics setup",
  "Ongoing support and improvements",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WebDevelopmentPricingPage() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-dark-base py-24 text-center">
        <GradientOrb color="blue" size="xl" className="-top-40 left-1/2 -translate-x-1/2 opacity-20" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-4">Pricing</p>
          <h1 className="font-display text-title md:text-display text-white mb-6">
            Web Development{" "}
            <GradientText as="span">Pricing</GradientText>
          </h1>
          <p className="text-body-lg text-light-base/60 max-w-2xl mx-auto">
            Professional websites built to grow with your business. Every project is tailored to your goals, but most fall within the ranges below.
          </p>
        </div>
      </section>

      {/* ── Pricing tiers ── */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-all duration-300 ${
                tier.highlighted
                  ? "bg-dark-elevated border-seed-600/40 shadow-pricingHighlight"
                  : "bg-dark-elevated border-white/[0.06]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-brand text-white shadow-glowSeed">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Name + price */}
              <div>
                <h2 className="font-display text-subheading text-white mb-2">{tier.name}</h2>
                <p className="font-display text-heading text-seed-400">
                  Starting at {tier.starting}
                </p>
              </div>

              {/* Description */}
              <p className="text-body text-light-base/60 leading-relaxed">{tier.description}</p>

              <div className="h-px bg-white/[0.06]" />

              {/* Includes */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-4">
                  {tier.includesLabel}
                </p>
                <ul className="space-y-2.5">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-seed-500 shrink-0 mt-0.5" />
                      <span className="text-body-sm text-light-base/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Best for */}
              <div>
                <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-3">
                  {tier.bestForLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tier.bestFor.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-2">
                <Link
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-gradient-brand text-white hover:shadow-glowSeed"
                      : "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.10]"
                  }`}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Add-ons ── */}
      <Section theme="light">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow uppercase tracking-widest text-seed-600 mb-3">Optional Add-Ons</p>
          <h2 className="font-display text-heading text-dark-base mb-10">
            Extend Your Website
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {addOns.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-black/[0.06] text-dark-base/70 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-seed-600 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Not sure ── */}
      <Section>
        <GlassCard theme="dark" className="max-w-3xl mx-auto text-center p-12" hover={false}>
          <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">Not Sure What You Need?</p>
          <h2 className="font-display text-heading text-white mb-4">
            Every project is different.
          </h2>
          <p className="text-body-lg text-light-base/60 mb-8 max-w-xl mx-auto">
            We'll help determine the best solution for your business and budget. Schedule a consultation to discuss your project.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
          >
            Schedule a Consultation
          </Link>
        </GlassCard>
      </Section>

      {/* ── CTA Banner ── */}
      <Section>
        <CTABanner
          title="Ready to Build Something Great?"
          description="Tell us about your project and we'll put together a tailored proposal within 48 hours."
          primaryLabel="Start Your Project"
          primaryHref="/contact"
          secondaryLabel="See Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
