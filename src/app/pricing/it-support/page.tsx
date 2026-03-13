"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Check,
  Headphones,
  Clock,
  Users,
  BarChart3,
  Zap,
  Lock,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  Badge,
  GradientOrb,
  GridPattern,
  GradientText,
  CTABanner,
  LiquidGlassPill,
  LiquidGlassButton,
} from "@/components/kit";
import { QuotePriceCalculator } from "@/components/quote-generator";
import { useQuoteFlow } from "@/components/quote-flow";

// ─── Data ─────────────────────────────────────────────────────────────────────
const highlights = [
  {
    icon: Headphones,
    title: "Unlimited Help Desk",
    body: "Every plan includes unlimited remote support — no ticket limits, no hourly charges.",
  },
  {
    icon: Clock,
    title: "Fast Response Times",
    body: "Critical issues are triaged in under 15 minutes. Most requests resolved same-day.",
  },
  {
    icon: Users,
    title: "Per-User Pricing",
    body: "Simple, predictable cost per team member. One user, one seat — no device-counting headaches.",
  },
  {
    icon: Lock,
    title: "Security Included",
    body: "Antivirus management, patch management, and endpoint monitoring are built into every tier.",
  },
  {
    icon: BarChart3,
    title: "Transparent Reporting",
    body: "Monthly reports on tickets, resolution times, and system health — no black boxes.",
  },
  {
    icon: Zap,
    title: "No Long-Term Contracts",
    body: "Month-to-month plans. We earn your business every billing cycle, not through lock-in.",
  },
];

const tiers = [
  {
    name: "SeedCare Essentials",
    price: "$110",
    unit: "/user/mo",
    icon: Shield,
    description: "Remote support and monitoring for small teams.",
    features: [
      "Unlimited remote help desk",
      "Endpoint monitoring",
      "Patch management",
      "Antivirus management",
      "Email support",
    ],
  },
  {
    name: "SeedCare Plus",
    price: "$130",
    unit: "/user/mo",
    icon: ShieldCheck,
    description: "Proactive monitoring with on-site support.",
    highlight: true,
    features: [
      "Everything in Essentials",
      "Up to 4 hrs/mo on-site support",
      "Network monitoring",
      "50 GB cloud backup",
    ],
  },
  {
    name: "SeedCare Pro",
    price: "$160",
    unit: "/user/mo",
    icon: ShieldPlus,
    description: "Full-service IT for growing organizations.",
    features: [
      "Everything in Plus",
      "Unlimited on-site support",
      "Unlimited cloud backup",
      "Quarterly vCIO strategy sessions",
      "Priority response",
    ],
  },
];

const faqs = [
  {
    q: "What counts as a 'seat' or 'user'?",
    a: "One seat = one person on your team who needs IT support. It covers all their devices — laptop, phone, monitors, etc.",
  },
  {
    q: "Is there a minimum number of seats?",
    a: "Our plans start at 1 seat. There's no minimum commitment. Most of our clients have between 5 and 150 users.",
  },
  {
    q: "What's the MDM add-on?",
    a: "Mobile Device Management lets you secure, deploy apps to, and remotely manage iOS and iPadOS devices across your organization. It's $12/device/month.",
  },
  {
    q: "Can I mix plans for different team members?",
    a: "Yes — some companies put executives on Pro and the rest of the team on Essentials or Plus. We'll help you figure out the right mix.",
  },
  {
    q: "How quickly can we get started?",
    a: "Most teams are fully onboarded within 5–10 business days depending on size and complexity.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ITSupportPricingPage() {
  const [calcStep, setCalcStep] = useState(0);
  const { openQuoteFlow } = useQuoteFlow();

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-dark-base py-28">
        <GradientOrb
          color="seed"
          size="xl"
          className="-top-40 -right-40 opacity-20"
        />
        <GradientOrb
          color="blue"
          size="lg"
          className="top-1/2 -left-32 opacity-10"
        />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <LiquidGlassPill variant="seed">IT Support Pricing</LiquidGlassPill>
              <LiquidGlassPill variant="default">Per-User</LiquidGlassPill>
              <LiquidGlassPill variant="default">No Contracts</LiquidGlassPill>
            </div>
            <h1 className="font-display text-title md:text-display text-white leading-[1.05] mb-6">
              Predictable IT Costs.{" "}
              <GradientText as="span">Zero Surprises.</GradientText>
            </h1>
            <p className="text-body-lg text-light-base/60 max-w-2xl mb-10 leading-relaxed">
              Transparent per-user pricing with unlimited remote support on
              every plan. Get an instant quote in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover relative overflow-hidden text-white text-sm font-medium transition-all duration-200"
              >
                Get Instant Quote
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200"
              >
                Talk to a Human
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick plan overview ── */}
      <Section>
        <SectionHeader
          eyebrow="Plans"
          title="Three Tiers, One Mission"
          description="Every plan includes unlimited remote support. Pick the level of coverage that fits your team."
          align="center"
          theme="dark"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`liquid-glass rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? "liquid-glass-tinted-seed"
                  : ""
              }`}
            >
              {tier.highlight && (
                <span className="inline-flex self-start mb-4 px-2.5 py-0.5 rounded-full text-xs bg-gradient-brand text-white">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-seed-600/15 flex items-center justify-center">
                  <tier.icon className="w-5 h-5 text-seed-400" />
                </div>
                <h3 className="font-display text-card-title text-white">
                  {tier.name}
                </h3>
              </div>
              <p className="text-body-sm text-light-base/50 mb-4">
                {tier.description}
              </p>
              <div className="mb-6">
                <span className="font-display text-heading text-seed-400">
                  {tier.price}
                </span>
                <span className="text-body-sm text-light-base/40">
                  {tier.unit}
                </span>
              </div>
              <ul className="space-y-2 mb-6 flex-grow">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-body-sm text-light-base/60"
                  >
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-seed-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#calculator"
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  tier.highlight
                    ? "liquid-glass-tinted-seed liquid-glass-hover text-white"
                    : "liquid-glass text-white"
                }`}
              >
                Get Quote
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Why SeedCare ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Why SeedCare"
          title="IT Support, Done Right"
          description="No ticket limits. No surprise invoices. No long-term lock-in."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-seed-600/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-seed-600" />
              </div>
              <div>
                <h3 className="font-display text-card-title text-dark-base mb-1">
                  {item.title}
                </h3>
                <p className="text-body-sm text-dark-base/55 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Interactive Calculator ── */}
      <Section id="calculator">
        <SectionHeader
          eyebrow="Pricing Calculator"
          title="Get Your Instant Quote"
          description="Use the calculator below to see real-time pricing for your team size. Select a plan, enter your details, and get a quote in under 60 seconds."
          align="center"
          theme="dark"
        />
        <div className="liquid-glass rounded-2xl overflow-hidden">
          {/* Step indicator */}
          <div className="border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              {["Choose Plan", "Add-Ons", "Your Details", "Review"].map(
                (label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    {i > 0 && (
                      <div className="w-8 h-px bg-white/[0.10]" />
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        i === calcStep
                          ? "liquid-glass-tinted-seed text-white"
                          : i < calcStep
                            ? "liquid-glass text-white/50"
                            : "text-white/25"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <QuotePriceCalculator
            view="customer"
            currentStep={calcStep}
            setCurrentStep={setCalcStep}
            config={{
              companyEmail: "hello@seedtech.com",
              companyName: "SeedTech",
            }}
          />
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="FAQ"
          title="Common Questions"
          description="Everything you need to know before getting started."
          align="left"
          theme="light"
        />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6"
            >
              <h3 className="font-display text-card-title text-dark-base mb-3">
                {faq.q}
              </h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <CTABanner
          title="Ready to Simplify Your IT?"
          description="Get a custom quote in under 60 seconds, or schedule a free consultation with our team."
          primaryLabel="Get Instant Quote"
          onPrimaryClick={() => openQuoteFlow("it-support")}
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
