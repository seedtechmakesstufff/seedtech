import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Headphones,
  Radar,
  Repeat,
  Monitor,
  Server,
  PhoneCall,
  Workflow,
  Users,
  Building2,
  Wrench,
  Clock,
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

/* ─── Static Metadata ──────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Managed IT Services New Jersey | SeedTech — Proactive IT Support for NJ Businesses",
  description:
    "SeedTech provides managed IT services across New Jersey — proactive monitoring, help desk, cybersecurity, and flat-rate support starting at $110/user/month. No contracts.",
  alternates: { canonical: "/managed-it-services-new-jersey" },
  openGraph: {
    title: "Managed IT Services New Jersey — SeedTech",
    description:
      "Proactive managed IT support for New Jersey businesses. 24/7 monitoring, unlimited help desk, cybersecurity, and backup — flat-rate, no contracts.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Managed IT Services New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const painPoints = [
  {
    icon: Clock,
    title: "Your current IT provider is slow",
    body: "You submit a ticket and wait hours — sometimes days. By the time someone responds, your team has already lost half a workday. New Jersey businesses can't afford that pace.",
  },
  {
    icon: Repeat,
    title: "The same issues keep coming back",
    body: "Recurring problems usually mean no one is fixing the root cause. They're patching and moving on. That's break-fix, not managed IT.",
  },
  {
    icon: Users,
    title: "You get a different technician every time",
    body: "Large MSPs rotate staff constantly. No one knows your environment. You spend half the call re-explaining your setup.",
  },
  {
    icon: Shield,
    title: "You're not sure if you're actually protected",
    body: "No one can tell you if your backups work, if your endpoints are patched, or when your last security audit was. That's a liability, not a service.",
  },
];

const whatYouGet = [
  {
    icon: Headphones,
    title: "Unlimited help desk support",
    body: "Your team gets a real person to call — not a phone tree. Every SeedCare plan includes unlimited remote support during business hours.",
  },
  {
    icon: Radar,
    title: "24/7 proactive monitoring",
    body: "We monitor your endpoints, servers, and network around the clock. Issues are caught and addressed before your team notices them.",
  },
  {
    icon: Shield,
    title: "Cybersecurity protection",
    body: "SentinelOne AI-driven endpoint security on every device. Patching, access controls, and threat response — not just antivirus.",
  },
  {
    icon: Server,
    title: "Backup and disaster recovery",
    body: "Cloud backup with 30-day retention (Essentials) up to full image backup (Pro). If something breaks, we can restore it.",
  },
  {
    icon: PhoneCall,
    title: "Vendor coordination",
    body: "We handle your ISPs, phone providers, software vendors, and carriers. No more three-way calls or playing middleman.",
  },
  {
    icon: Workflow,
    title: "Strategic guidance",
    body: "Practical recommendations to improve your environment over time — hardware refresh planning, process improvements, technology roadmap.",
  },
];

const njIndustries = [
  {
    icon: Building2,
    title: "Law firms & professional services",
    body: "Compliance-sensitive environments that need airtight security, reliable document management, and fast support when court deadlines are on the line.",
  },
  {
    icon: Wrench,
    title: "Contractors & trades",
    body: "Field-heavy operations with office staff running estimates, scheduling, and billing. Both need IT support that works in the real world, not just the server room.",
  },
  {
    icon: Monitor,
    title: "Medical & dental practices",
    body: "Patient data, EHR systems, and HIPAA considerations. Your IT partner needs to understand the stakes — not just the technology.",
  },
  {
    icon: Server,
    title: "Trucking & logistics",
    body: "Multi-location operations running dispatch, fleet management, and back-office systems that can't go down during a delivery window.",
  },
];

const tiers = [
  {
    icon: Shield,
    name: "SeedCare Essentials",
    price: "$110",
    unit: "/user/mo",
    description: "Baseline protection for small teams.",
    features: [
      "Unlimited remote help desk",
      "Endpoint monitoring",
      "Patch management",
      "Antivirus (SentinelOne)",
      "30-day cloud backup",
    ],
  },
  {
    icon: ShieldCheck,
    name: "SeedCare Plus",
    price: "$130",
    unit: "/user/mo",
    description: "Ops-ready coverage with proactive monitoring.",
    highlight: true,
    features: [
      "Everything in Essentials",
      "Up to 4 hrs/mo on-site",
      "Network monitoring",
      "50 GB cloud backup",
      "Vendor coordination",
      "Monthly health reports",
    ],
  },
  {
    icon: ShieldPlus,
    name: "SeedCare Pro",
    price: "$160",
    unit: "/user/mo",
    description: "Full-service IT for growing organizations.",
    features: [
      "Everything in Plus",
      "Unlimited on-site support",
      "Unlimited cloud backup",
      "Quarterly vCIO sessions",
      "Hardware refresh planning",
      "Priority response",
    ],
  },
];

const comparison = [
  { them: "Annual contracts with lock-in", us: "Month-to-month — earn the business every cycle" },
  { them: "Per-device pricing", us: "Per-user pricing — all devices included" },
  { them: "Ticket limits or hourly billing", us: "Unlimited remote help desk" },
  { them: "L1 → L2 → L3 escalation tiers", us: "One team, direct authority to resolve" },
  { them: "Revolving-door technicians", us: "Same people who know your environment" },
  { them: "Hidden costs for on-site and after-hours", us: "Flat-rate, everything included" },
];

const faqs = [
  {
    q: "What does managed IT services include?",
    a: "Managed IT includes help desk support, 24/7 monitoring, cybersecurity protection, backup and recovery, patch management, vendor coordination, and ongoing strategic guidance — all for a flat monthly per-user fee.",
  },
  {
    q: "How much do managed IT services cost in New Jersey?",
    a: "SeedTech's managed IT plans start at $110/user/month (SeedCare Essentials) and go up to $160/user/month (SeedCare Pro). One seat covers all of a user's devices — laptop, phone, monitors, peripherals.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "No. Every SeedCare plan is month-to-month. We earn your business every billing cycle instead of locking you in with annual commitments.",
  },
  {
    q: "What areas of New Jersey do you serve?",
    a: "We serve businesses across New Jersey with a concentration in Morris County, Somerset County, Essex County, and Union County. We also provide remote support nationwide.",
  },
  {
    q: "Can you support both office and field workers?",
    a: "Yes. Our plans are designed for mixed environments — office staff, field crews, remote workers. Plans can be mixed and matched by role, location, or device type.",
  },
  {
    q: "How fast can we get started?",
    a: "Most businesses are fully onboarded within 5–10 business days. We start with an assessment, then deploy monitoring, security, and support tools in a phased rollout designed to avoid disruption.",
  },
  {
    q: "What if we already have an IT provider?",
    a: "Many of our clients come from other providers. We handle the transition cleanly — no gap in coverage, no disruption to your team, no awkward handoff.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed IT Services New Jersey",
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
  serviceType: "Managed IT Services",
  areaServed: { "@type": "State", name: "New Jersey" },
  description:
    "Proactive managed IT services for New Jersey businesses including 24/7 monitoring, unlimited help desk, cybersecurity, backup, and vendor coordination — flat-rate, no contracts.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "110",
    highPrice: "160",
    priceCurrency: "USD",
    offerCount: "3",
  },
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
      name: "Managed IT Services New Jersey",
      item: "https://seedtechllc.com/managed-it-services-new-jersey",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ManagedITServicesNJPage() {
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
            <span className="text-light-base/60">Managed IT Services New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Managed IT Services — New Jersey</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Reliable, Proactive IT Support for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your business depends on technology that works. When it doesn&apos;t — slow systems,
              security gaps, unresponsive support — the cost isn&apos;t just frustration. It&apos;s
              lost productivity, missed revenue, and risk that compounds every day it goes
              unaddressed.
            </p>
            <p>
              SeedTech provides managed IT services to businesses across New Jersey with a
              focus on proactive monitoring, fast response, and the kind of accountability
              that large MSPs stopped delivering years ago.
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
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              See Plans & Pricing
            </Link>
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              <PhoneCall className="h-4 w-4" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      {/* Section 1 — Pain points (why businesses in NJ switch) */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Why New Jersey Businesses Switch IT Providers"
          description="If your current IT situation looks anything like this, you're not getting managed IT — you're getting managed neglect."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((card) => (
            <div key={card.title} className="rounded-2xl border border-amber-100 bg-amber-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <card.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — What's included */}
      <Section>
        <SectionHeader
          eyebrow="What You Get"
          title="Managed IT Services That Actually Cover Your Business"
          description="Every SeedCare plan is built around the core services New Jersey businesses need to stay productive, secure, and supported."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGet.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — SeedTech vs Large MSPs */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The SeedTech Difference"
          title="Why Growing NJ Businesses Choose SeedTech Over Large MSPs"
          description="The biggest IT providers in New Jersey aren't always the best. Here's how SeedTech's structure is built differently."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.05] bg-gray-50 px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Large MSPs</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech</p>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < comparison.length - 1 ? "border-b border-black/[0.03]" : ""}`}>
                <p className="text-body-sm text-dark-base/50 pr-4">{row.them}</p>
                <p className="text-body-sm text-dark-base font-medium pr-4">{row.us}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Industries in NJ */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Support"
          title="Managed IT for Every Type of New Jersey Business"
          description="From law offices in Morristown to trucking operations in Hopatcong — we support the industries that power New Jersey."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {njIndustries.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/industries" className="text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors">
            See all industries we serve →
          </Link>
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Flat-Rate Pricing"
          title="Managed IT Plans for New Jersey Businesses"
          description="Per-user pricing. No contracts. No hidden fees. One seat covers all of a user's devices."
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? "bg-dark-base border-2 border-seed-500/30 shadow-xl"
                  : "bg-white border border-black/[0.05] shadow-cardLight"
              }`}
            >
              {tier.highlight && (
                <span className="self-start mb-4 inline-block rounded-full bg-seed-500/15 px-3 py-1 text-xs font-semibold text-seed-600">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tier.highlight ? "bg-seed-500/15" : "bg-emerald-50"
                  }`}
                >
                  <tier.icon className={`w-5 h-5 ${tier.highlight ? "text-seed-400" : "text-seed-600"}`} />
                </div>
                <h3 className={`font-display text-card-title ${tier.highlight ? "text-white" : "text-dark-base"}`}>
                  {tier.name}
                </h3>
              </div>
              <p className={`text-body-sm mb-4 ${tier.highlight ? "text-light-base/50" : "text-dark-base/50"}`}>
                {tier.description}
              </p>
              <div className="mb-5">
                <span className={`font-display text-heading ${tier.highlight ? "text-seed-400" : "text-seed-600"}`}>
                  {tier.price}
                </span>
                <span className={`text-body-sm ${tier.highlight ? "text-light-base/40" : "text-dark-base/40"}`}>
                  {tier.unit}
                </span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-body-sm ${tier.highlight ? "text-light-base/60" : "text-dark-base/60"}`}>
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-seed-400" : "text-seed-500"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/services/managed-it/plans"
                className={`w-full text-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tier.highlight
                    ? "bg-seed-500 hover:bg-seed-400 text-white"
                    : "border border-black/[0.1] text-dark-base hover:border-seed-500/30 hover:text-seed-600"
                }`}
              >
                Compare Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <Link href="/services/managed-it/plans" className="text-seed-600 hover:text-seed-500 text-sm font-medium transition-colors">
            Full plan comparison & pricing calculator →
          </Link>
          <Link href="/services/managed-it/mobile-device-management" className="text-dark-base/40 hover:text-dark-base/60 text-sm transition-colors">
            MDM add-on from $12/device/mo →
          </Link>
        </div>
      </Section>

      {/* NJ service area */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Managed IT Services Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedTech is based in Northern New Jersey and provides managed IT services to
            businesses across the state — with a concentration in Morris County, Somerset County,
            Essex County, and Union County. We serve businesses both locally and remotely.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
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
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Managed IT Services — Frequently Asked Questions" align="left" theme="light" />
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
              href="/it-support-new-jersey"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                IT Support New Jersey →
              </h3>
              <p className="text-body-sm text-light-base/40">Fast, reliable IT support for NJ businesses.</p>
            </Link>
            <Link
              href="/emergency-it-support-new-jersey"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Emergency IT Support →
              </h3>
              <p className="text-body-sm text-light-base/40">Systems down? We respond immediately.</p>
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Free IT Assessment →
              </h3>
              <p className="text-body-sm text-light-base/40">Find out where your environment stands.</p>
            </Link>
            <Link
              href="/services/managed-it/why-seedtech"
              className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors"
            >
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">
                Why SeedTech →
              </h3>
              <p className="text-body-sm text-light-base/40">Built for accountability, not volume.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Managed IT Services for New Jersey Businesses"
          description="Proactive support, flat-rate pricing, no contracts. Start with a free IT assessment and see what better IT support looks like."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="See Plans & Pricing"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
