import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  Laptop,
  LifeBuoy,
  LockKeyhole,
  Monitor,
  Phone,
  Repeat,
  Server,
  Shield,
  Wrench,
  Users,
  Zap,
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
  CardTitle,
  Body,
  AnimatedH1,
} from "@/components/kit";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "IT Support New Jersey | SeedTech — Fast, Reliable IT Help for NJ Businesses",
  description:
    "SeedTech provides IT support for businesses across New Jersey — unlimited help desk, proactive monitoring, cybersecurity, and on-site support. No contracts, no ticket limits.",
  alternates: { canonical: "/it-support-new-jersey" },
  openGraph: {
    title: "IT Support New Jersey — SeedTech",
    description:
      "Fast, reliable IT support for New Jersey businesses. Unlimited help desk, proactive monitoring, on-site support — flat-rate pricing with no contracts.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IT Support New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const supportTypes = [
  {
    icon: Headphones,
    title: "Remote help desk",
    body: "Your team calls or emails, and a real person picks up. We resolve the majority of issues remotely within the first session — no ticket queues, no phone trees.",
    href: "/help-desk-services-new-jersey",
  },
  {
    icon: Wrench,
    title: "On-site support",
    body: "Some issues need hands on the hardware. SeedCare Plus and Pro include monthly on-site hours for network work, hardware swaps, and office moves.",
    href: "/services/managed-it/plans",
  },
  {
    icon: Monitor,
    title: "New employee setup",
    body: "Laptop configured, accounts created, security enrolled, access provisioned — ready on day one. We handle the full onboarding workflow so your team doesn't have to.",
    href: "/services/managed-it/onboarding",
  },
  {
    icon: Shield,
    title: "Security & compliance",
    body: "SentinelOne on every endpoint, automated patching, enforced MFA, and access controls. Not just antivirus — actual security posture management.",
    href: "/cybersecurity-services-new-jersey",
  },
  {
    icon: Server,
    title: "Hardware lifecycle management",
    body: "We track warranty dates, performance degradation, and end-of-life schedules. When it's time to replace something, we handle sourcing, configuration, and deployment.",
    href: "/managed-it-services-new-jersey",
  },
  {
    icon: Phone,
    title: "Vendor management",
    body: "ISPs, phone systems, software licenses, hardware warranties. We handle the calls, the holds, and the follow-ups so you don't have to.",
    href: "/outsourced-it-support-new-jersey",
  },
];

const signals = [
  { icon: Clock, text: "New employee onboarding takes days instead of hours" },
  { icon: Repeat, text: "You're rebooting the same equipment every week" },
  { icon: Users, text: "Your team has stopped reporting issues because nothing ever gets fixed" },
  { icon: LockKeyhole, text: "You have no idea when your last backup ran — or if it worked" },
  { icon: LifeBuoy, text: "Someone on your team has become the unofficial 'IT person'" },
  { icon: Laptop, text: "You're still running hardware or software that's past end-of-life" },
];

const approach = [
  {
    step: "01",
    title: "Free IT assessment",
    body: "We evaluate your current environment — devices, network, security, backup, and vendor relationships. No cost, no obligation. You get a written report either way.",
  },
  {
    step: "02",
    title: "Tailored plan recommendation",
    body: "Based on the assessment, we recommend a SeedCare tier — Essentials, Plus, or Pro — that matches your team size, complexity, and budget. Plans can be mixed by role.",
  },
  {
    step: "03",
    title: "Phased onboarding",
    body: "We deploy monitoring, security, and support tools in a structured rollout — typically 5-10 business days. No disruption to your team, no coverage gaps.",
  },
  {
    step: "04",
    title: "Ongoing support & optimization",
    body: "Once you're live, your team gets unlimited remote support, proactive monitoring, and regular recommendations to improve your environment over time.",
  },
];

const whySeedTech = [
  {
    icon: Zap,
    title: "Fast, direct support",
    body: "No phone trees. No L1 → L2 escalation. Your team talks to someone who can actually fix the problem.",
  },
  {
    icon: Users,
    title: "Consistent team",
    body: "Same people who set up your environment are the ones supporting it. No revolving-door technicians.",
  },
  {
    icon: CheckCircle2,
    title: "No contracts",
    body: "Every SeedCare plan is month-to-month. If we're not delivering, you leave. That's how it should work.",
  },
  {
    icon: Laptop,
    title: "Per-user pricing",
    body: "One seat covers all of a user's devices — laptop, phone, monitors, peripherals. Simple, predictable.",
  },
];

const faqs = [
  {
    q: "What's the difference between IT support and managed IT?",
    a: "IT support typically means reactive help — you call when something breaks. Managed IT adds proactive monitoring, security, backup, and strategic planning on top of that support. All SeedCare plans include both.",
  },
  {
    q: "How fast do you respond to support requests?",
    a: "Most remote issues are addressed within the first session. For emergencies, we prioritize immediately. SeedCare Pro clients get guaranteed priority response times.",
  },
  {
    q: "Do you support small businesses?",
    a: "Yes. SeedCare Essentials starts at $110/user/month and is designed for teams as small as 5 users. We also work with companies up to 200+ users.",
  },
  {
    q: "What areas of New Jersey do you cover?",
    a: "We're based in Northern New Jersey and serve businesses across the state — with a concentration in Morris County, Somerset County, Essex County, and Union County. Remote support is available nationwide.",
  },
  {
    q: "Can you replace our current IT provider?",
    a: "Yes. We handle the transition cleanly — no gap in coverage, no disruption to your team. Many of our clients came from other providers who weren't meeting expectations.",
  },
  {
    q: "Do you handle hardware and software procurement?",
    a: "Yes. We source, configure, and deploy hardware and software for your team. Everything arrives ready to use, enrolled in monitoring and security from day one.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hopatcong",
      addressRegion: "NJ",
      addressCountry: "US",
    },
  },
  serviceType: "IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description:
    "Fast, reliable IT support for businesses across New Jersey — unlimited help desk, proactive monitoring, cybersecurity, on-site support, and vendor coordination.",
};

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
    {
      "@type": "ListItem",
      position: 2,
      name: "IT Support New Jersey",
      item: "https://seedtechllc.com/it-support-new-jersey",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ITSupportNJPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-base/60">IT Support New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 -right-20 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 left-0 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">IT Support — New Jersey</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Support That New Jersey Businesses Actually Rely On
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              When your internet goes down, a laptop won&apos;t boot, or your team can&apos;t
              access a critical system — you need someone who picks up the phone and fixes it.
              Not someone who sends you a ticket number and disappears.
            </p>
            <p>
              SeedTech provides IT support for businesses across New Jersey. Unlimited help
              desk, proactive monitoring, cybersecurity, and real accountability — all for a
              flat monthly rate with no contracts.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free IT Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              <Phone className="h-4 w-4" /> (914) 362-8889
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 — What IT support covers */}
      <Section>
        <SectionHeader
          eyebrow="What's Included"
          title="IT Support That Covers the Full Stack"
          description="Every SeedCare plan includes unlimited remote support plus the proactive services that prevent most issues from happening in the first place."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportTypes.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <LiquidGlassCard className="p-7 h-full transition-all duration-200 group-hover:ring-1 group-hover:ring-white/20">
                <IconBox icon={card.icon} variant="gradient" className="mb-4" />
                <CardTitle className="mb-2 group-hover:text-seed-300 transition-colors">{card.title}</CardTitle>
                <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
              </LiquidGlassCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* Section 2 — Signals you need better IT support */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Warning Signs"
          title="6 Signs Your Current IT Support Isn't Working"
          description="If any of these sound familiar, you're not getting the support your business needs to operate reliably."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {signals.map((signal) => (
            <div
              key={signal.text}
              className="flex items-start gap-4 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-5"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <signal.icon className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-body-sm text-dark-base/70 leading-relaxed pt-2">{signal.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3 — How it works */}
      <Section>
        <SectionHeader
          eyebrow="Getting Started"
          title="What Switching to SeedTech Looks Like"
          description="No long sales process. No complicated onboarding. Here's how NJ businesses get started with real IT support."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approach.map((step) => (
            <LiquidGlassCard key={step.step} className="p-7">
              <span className="mb-3 block font-mono text-xs text-seed-400">{step.step}</span>
              <CardTitle className="mb-2">{step.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{step.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 4 — Why SeedTech */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Why SeedTech"
          title="IT Support Built for Accountability, Not Volume"
          description="Large MSPs optimize for contract count. SeedTech is built to serve businesses that expect their IT partner to actually know their environment."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whySeedTech.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <card.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* NJ service area */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            IT Support Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedTech is based in Northern New Jersey and provides IT support to businesses
            across the state. Whether you&apos;re in a downtown office in Morristown or a warehouse
            in Hopatcong, we support your team — remotely and on-site.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              "Morristown",
              "Mendham",
              "Chester",
              "Bernardsville",
              "Basking Ridge",
              "Hopatcong",
              "Parsippany",
              "Netcong",
              "Stanhope",
              "Dover",
              "Randolph",
              "Morris County",
              "Somerset County",
              "Essex County",
              "Union County",
            ].map((loc) => (
              <span
                key={loc}
                className="inline-block rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-light-base/50"
              >
                {loc}
              </span>
            ))}
          </div>
          <Link
            href="/services/managed-it/assessment"
            className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
          >
            Get a Free IT Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="IT Support — Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/managed-it-services-new-jersey"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Managed IT Services NJ →
              </h3>
              <p className="text-body-sm text-light-base/40">Proactive IT with flat-rate pricing.</p>
            </Link>
            <Link
              href="/emergency-it-support-new-jersey"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Emergency IT Support →
              </h3>
              <p className="text-body-sm text-light-base/40">Systems down? Immediate response.</p>
            </Link>
            <Link
              href="/services/managed-it/plans"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Plans & Pricing →
              </h3>
              <p className="text-body-sm text-light-base/40">Compare SeedCare tiers side-by-side.</p>
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Free IT Assessment →
              </h3>
              <p className="text-body-sm text-light-base/40">See where your environment stands.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Better IT Support Starts Here"
          description="Unlimited help desk, proactive monitoring, cybersecurity, and real accountability — all for a flat monthly rate. Start with a free assessment."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
