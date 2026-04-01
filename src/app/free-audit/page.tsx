import { CheckCircle2, Globe, Shield, Zap, TrendingUp } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, LiquidGlassCard } from "@/components/kit";
import { AuditForm } from "@/components/forms/AuditForm";
import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/free-audit");

const auditItems = [
  {
    icon: Globe,
    title: "Website Performance Review",
    body: "We analyze your current site speed, Core Web Vitals, mobile responsiveness, and overall user experience.",
  },
  {
    icon: Shield,
    title: "Security Risk Scan",
    body: "We identify exposed vulnerabilities, outdated software, weak configurations, and cybersecurity gaps.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Recommendations",
    body: "We review your calls-to-action, lead capture flows, and conversion paths — and tell you exactly what to fix.",
  },
  {
    icon: Zap,
    title: "Technology Improvements",
    body: "We assess your current IT setup and identify quick wins and long-term improvements to reduce risk and cost.",
  },
];

export default function FreeAuditPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">Free — No Commitment</LiquidGlassPill>
          <AnimatedH1 highlightWords={["Free"]} delay={0.15}>
            Free Website & Technology Audit
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            In 48 hours or less, we&apos;ll deliver a clear, actionable report covering your website performance,
            security risks, and technology gaps — completely free, no strings attached.
          </p>
        </div>
      </section>

      {/* What you get */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What's Included"
          title="What You Get in Your Audit"
          description="A real review by real people — not an automated report."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {auditItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-7 flex gap-5"
              >
                <div className="w-11 h-11 rounded-xl bg-seed-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-seed-600" />
                </div>
                <div>
                  <h3 className="font-display text-card-title text-dark-base mb-2">{item.title}</h3>
                  <p className="text-body-sm text-dark-base/55 leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bullets */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            "Delivered within 48 hours",
            "No sales pitch attached",
            "Real actionable recommendations",
            "Covers website + IT infrastructure",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-body-sm text-dark-base/60">
              <CheckCircle2 className="w-4 h-4 text-seed-600 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </Section>

      {/* Form */}
      <Section>
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            eyebrow="Request Your Audit"
            title="Get Your Free Audit"
            description="Fill out the form below and we'll be in touch within 24 hours to schedule your review."
            align="center"
          />
          <LiquidGlassCard className="p-8 md:p-10">
            <AuditForm />
          </LiquidGlassCard>
        </div>
      </Section>
    </div>
  );
}
