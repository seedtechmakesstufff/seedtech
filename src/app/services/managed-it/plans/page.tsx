import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Check,
  X,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  AnimatedH1,
  AnimatedH2,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { newPlans, mdmAddon } from "@/lib/plans";

export const metadata: Metadata = {
  title: "SeedCare Plans & Pricing | Managed IT Services — SeedTech",
  description:
    "Transparent per-user managed IT pricing. SeedCare Essentials ($110), Plus ($130), and Pro ($160) per user/month. No hidden fees, no long-term contracts.",
  openGraph: {
    title: "SeedCare Plans & Pricing | Managed IT Services",
    description:
      "Transparent per-user managed IT pricing starting at $110/user/month. No hidden fees, no long-term contracts.",
    url: "https://seedtechllc.com/services/managed-it/plans",
    type: "website",
  },
  alternates: { canonical: "https://seedtechllc.com/services/managed-it/plans" },
};

const featureKeys = [
  "Remote Help Desk",
  "Endpoint Monitoring",
  "Patch Management",
  "Antivirus Management",
  "Email Support",
  "On-Site Support",
  "Network Monitoring",
  "Cloud Backup",
  "vCIO Strategy Sessions",
  "Priority Response",
];

const faqs = [
  { q: "What does per-user pricing include?", a: "Every user gets unlimited remote help desk, endpoint monitoring, patch management, and antivirus. Higher tiers add on-site support, cloud backup, and strategic vCIO sessions." },
  { q: "Are there any setup fees or contracts?", a: "No setup fees. No long-term contracts. SeedCare plans are month-to-month. We earn your business every month." },
  { q: "Can I mix plans for different users?", a: "Yes. You can assign different SeedCare tiers to different users based on their role and needs. Contact us to build a custom quote." },
  { q: "How does the MDM add-on work?", a: "Mobile Device Management is $12 per device per month. It covers iOS, iPadOS, and Android with remote lock/wipe, app deployment, compliance policies, and reporting." },
  { q: "What if I need more on-site hours?", a: "SeedCare Pro includes unlimited on-site support. For Essentials and Plus, additional on-site hours can be purchased or you can upgrade your plan." },
  { q: "Do you offer a free assessment before I commit?", a: "Absolutely. We offer a free 45-60 minute IT assessment to evaluate your current setup, identify gaps, and recommend the right plan. No obligations." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
    { "@type": "ListItem", position: 3, name: "Plans & Pricing", item: "https://seedtechllc.com/services/managed-it/plans" },
  ],
};

const tierIcons = [Shield, ShieldCheck, ShieldPlus];
const tierColors = ["text-blue-400", "text-seed-400", "text-purple-400"];
const tierBorders = ["border-blue-500/20", "border-seed-500/30", "border-purple-500/20"];
const tierBgs = ["", "liquid-glass-tinted-seed", ""];

export default function PlansPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services/managed-it" className="hover:text-light-base/50 transition-colors">Managed IT</Link>
            <span>/</span>
            <span className="text-light-base/60">Plans &amp; Pricing</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 left-1/2 -translate-x-1/2 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">Transparent Per-User Pricing</LiquidGlassPill>
          <AnimatedH1 highlightWords={["SeedCare"]} className="mb-6 max-w-4xl mx-auto text-center">
            SeedCare Plans &amp; Pricing
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl mx-auto leading-relaxed mb-10">
            Simple per-user pricing. No hidden fees, no long-term contracts. Every plan includes
            unlimited remote help desk and 15-minute triage SLA.
          </p>
          <div className="flex justify-center gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Build Your Custom Quote <ArrowRight className="w-4 h-4" />
            </QuoteButton>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newPlans.map((plan, i) => {
            const TierIcon = tierIcons[i];
            const isPopular = i === 1;
            return (
              <LiquidGlassCard key={plan.name} className={`p-8 flex flex-col relative ${tierBorders[i]} ${tierBgs[i]}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <LiquidGlassPill variant="seed">Most Popular</LiquidGlassPill>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <IconBox icon={TierIcon} className={tierColors[i]} />
                  <div>
                    <h3 className="font-display text-card-title text-white">{plan.name}</h3>
                    <p className="text-body-sm text-light-base/40">{plan.description}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <span className="text-display font-display text-white">${plan.price}</span>
                  <span className="text-body-sm text-light-base/40 ml-2">/user/month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {featureKeys.map((key) => {
                    const val = plan.features[key];
                    const enabled = val !== false;
                    return (
                      <li key={key} className={`flex items-center gap-3 text-body-sm ${enabled ? "text-light-base/70" : "text-light-base/25"}`}>
                        {enabled ? (
                          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 shrink-0 text-light-base/20" />
                        )}
                        <span>{key}</span>
                        {typeof val === "string" && (
                          <span className="ml-auto text-light-base/40 text-xs">{val}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <QuoteButton service="it-support" className={`w-full text-center py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isPopular ? "liquid-glass-tinted-seed liquid-glass-hover text-white" : "liquid-glass text-white"}`}>
                  Get Started
                </QuoteButton>
              </LiquidGlassCard>
            );
          })}
        </div>
      </Section>

      {/* Feature Comparison Table */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Feature Comparison"
          title="Every Feature, Side by Side"
          description="See exactly what each plan includes so you can choose with confidence."
          theme="light"
        />
        <div className="overflow-x-auto rounded-2xl border border-black/[0.06] shadow-cardLight">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-gray-50/50">
                <th className="text-left py-4 px-6 font-medium text-dark-base/60">Feature</th>
                {newPlans.map((p) => (
                  <th key={p.name} className="text-center py-4 px-4 font-display text-dark-base">
                    {p.name.replace("SeedCare ", "")}
                    <div className="text-xs font-normal text-dark-base/40 mt-0.5">${p.price}/user/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key, idx) => (
                <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                  <td className="py-3 px-6 text-dark-base/70 font-medium">{key}</td>
                  {newPlans.map((p) => (
                    <td key={p.name} className="py-3 px-4 text-center">
                      {p.features[key] === true ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : p.features[key] === false ? (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-dark-base/60">{p.features[key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* MDM Add-On */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <LiquidGlassCard className="p-8 md:p-10">
            <div className="flex items-start gap-5 mb-6">
              <IconBox icon={Smartphone} className="text-seed-400" />
              <div>
                <AnimatedH2 className="font-display text-heading text-white mb-2">{`${mdmAddon.name} Add-On`}</AnimatedH2>
                <p className="text-body text-light-base/50">{mdmAddon.description}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-title font-display text-white">${mdmAddon.pricePerDevice}</span>
              <span className="text-body-sm text-light-base/40">/device/month</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {mdmAddon.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-body-sm text-light-base/70">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/services/managed-it/mobile-device-management" className="inline-flex items-center gap-2 text-seed-400 text-body-sm font-medium hover:text-seed-300 transition-colors">
              Learn more about MDM <ArrowRight className="w-4 h-4" />
            </Link>
          </LiquidGlassCard>
        </div>
      </Section>

      {/* ROI Section */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Math"
          title="How SeedCare Compares to In-House IT"
          description="A single full-time IT hire costs roughly $65,000/year before benefits and tools. SeedCare gives you an entire team and enterprise-grade tooling for a fraction."
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-8 text-center">
            <p className="text-eyebrow uppercase tracking-widest mb-2 text-red-500">In-House IT Hire</p>
            <p className="text-display font-display text-dark-base">$65K+</p>
            <p className="text-body-sm text-dark-base/50 mt-2">per year, one person, no backup, no 24/7</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8 text-center">
            <p className="text-eyebrow uppercase tracking-widest mb-2 text-emerald-600">SeedCare for 20 Users</p>
            <p className="text-display font-display text-dark-base">$26.4K</p>
            <p className="text-body-sm text-dark-base/50 mt-2">per year, full team, monitoring, backups, security</p>
          </div>
        </div>
        <p className="text-center text-body-sm text-dark-base/40 mt-6">Based on SeedCare Essentials at $110/user/mo × 20 users</p>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Pricing Questions, Answered" />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 mt-0.5 shrink-0 text-seed-400" />
                {faq.q}
              </h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed pl-8">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          theme="light"
          title="Not Sure Which Plan?"
          description="Get a free IT assessment. We will evaluate your environment and recommend the right SeedCare plan for your team."
          primaryLabel="Schedule Free Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Why SeedTech?"
          secondaryHref="/services/managed-it/why-seedtech"
        />
      </Section>
    </div>
  );
}
