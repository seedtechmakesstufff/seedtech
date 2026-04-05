import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Server,
  Shield,
  Headphones,
  Wrench,
  PhoneCall,
  Eye,
  Clock,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  Scale,
  Stethoscope,
  Truck,
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
  title: "Managed Service Provider New Jersey | SeedTech — NJ MSP for Business IT",
  description:
    "SeedTech is a managed service provider in New Jersey offering help desk, cybersecurity, monitoring, cloud management, and on-site support. Flat-rate MSP plans starting at $110/user/mo.",
  alternates: { canonical: "/managed-service-provider-new-jersey" },
  openGraph: {
    title: "Managed Service Provider New Jersey — SeedTech MSP",
    description:
      "SeedTech is a New Jersey MSP delivering complete managed IT services — help desk, cybersecurity, monitoring, and on-site support. No contracts, per-user pricing.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Managed Service Provider New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const whatMSPDoes = [
  {
    icon: Headphones,
    title: "Unlimited help desk support",
    body: "Your team contacts us directly — phone or email — and reaches a real technician. Password resets, email issues, software problems, and network outages resolved same-day. No ticket limits.",
  },
  {
    icon: Eye,
    title: "24/7 proactive monitoring",
    body: "NinjaOne monitors every endpoint, server, and network device in your environment. CPU spikes, disk failures, security alerts, and service outages trigger immediate response — often before your team notices.",
  },
  {
    icon: Shield,
    title: "Cybersecurity and endpoint protection",
    body: "SentinelOne AI-driven endpoint detection and response on every device. Automated patching, MFA enforcement, access controls, and offboarding security. Not antivirus — actual security posture.",
  },
  {
    icon: Server,
    title: "Cloud and infrastructure management",
    body: "Microsoft 365 administration, cloud backup configuration, server management, and network infrastructure. We manage the platforms your business runs on.",
  },
  {
    icon: Settings,
    title: "Employee onboarding and offboarding",
    body: "New hires get a configured laptop, email, security enrollment, and application access on day one. Departing employees have access revoked, data transferred, and accounts disabled immediately.",
  },
  {
    icon: BarChart3,
    title: "Vendor management and procurement",
    body: "ISPs, phone systems, software licenses, hardware vendors. We handle the relationships, the negotiations, and the follow-ups so you deal with one provider — us.",
  },
];

const redFlags = [
  "You're paying hourly for IT and the bills keep growing",
  "Your MSP takes days to respond to routine requests",
  "You don't know if your backups are actually working",
  "Security is an add-on tier you haven't purchased",
  "You can't get a clear answer on what's being monitored",
  "New employee setup takes a week instead of a day",
  "Your MSP doesn't know your business or your people",
  "You're locked into a multi-year contract with termination fees",
];

const seedtechDiff = [
  {
    icon: Users,
    title: "Real people who know your environment",
    body: "No rotating technicians who ask you to explain your setup every time. SeedTech assigns dedicated team members who learn your environment, your people, and your workflows.",
  },
  {
    icon: Clock,
    title: "No contracts — month to month",
    body: "We don't lock you in. SeedTech operates on month-to-month agreements because we believe the only way to keep clients is to earn their business every month.",
  },
  {
    icon: TrendingUp,
    title: "Per-user pricing that scales",
    body: "No per-device confusion. No server surcharges. $110, $130, or $160 per user per month depending on your plan tier. Add or remove users as your business changes.",
  },
  {
    icon: Shield,
    title: "Security included in every plan",
    body: "SentinelOne endpoint protection, automated patching, MFA, and access controls are included in every SeedCare tier — not reserved for a premium plan you haven't upgraded to yet.",
  },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Compliance-aware IT, secure document management, and encrypted communications. We understand attorney-client privilege and its IT implications.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare practices",
    body: "HIPAA-compliant infrastructure, patient data security, and EHR support. The technical controls regulators expect, documented and maintained.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Fleet management integration, dispatch system support, and multi-site operations. IT that works across offices, warehouses, and the road.",
  },
  {
    icon: Wrench,
    title: "Contractors & trades",
    body: "Project management software, estimating tools, and field-worker device management. IT for businesses where not everyone sits at a desk.",
  },
];

const faqs = [
  {
    q: "What is a managed service provider (MSP)?",
    a: "A managed service provider handles all or part of your business IT operations for a flat monthly fee. Instead of hiring in-house IT staff or paying hourly for break-fix support, an MSP provides help desk, cybersecurity, monitoring, and infrastructure management as a bundled service.",
  },
  {
    q: "How much does a managed service provider cost in New Jersey?",
    a: "MSP pricing in NJ typically ranges from $100–$200+ per user per month depending on the scope of services. SeedTech's SeedCare plans are $110 (Essentials), $130 (Plus), and $160 (Pro) per user per month — all-inclusive with no setup fees or contracts.",
  },
  {
    q: "How do I know if my business needs an MSP?",
    a: "If your business has 10+ employees, relies on technology for daily operations, and doesn't have a full internal IT team, an MSP is usually the most cost-effective and comprehensive option. If you're currently using break-fix support and tired of reactive, unpredictable costs, it's time for an MSP.",
  },
  {
    q: "What makes SeedTech different from other NJ MSPs?",
    a: "No contracts. Security included in every plan (not an add-on). Per-user pricing that's transparent and scalable. A team that learns your business and doesn't rotate you through a call center. We're small enough to care and capable enough to deliver.",
  },
  {
    q: "Can SeedTech replace our current MSP?",
    a: "Yes. We handle MSP-to-MSP transitions regularly. Our onboarding process includes full environment documentation, tool migration, and parallel support during the transition. Your team has access to our help desk from day one.",
  },
  {
    q: "What tools does SeedTech use as an MSP?",
    a: "NinjaOne for remote monitoring and management (RMM), SentinelOne for endpoint detection and response (EDR), and enterprise-grade backup, patching, and documentation platforms. These are the same tools used by large MSPs — we just include them in the base price.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed Service Provider New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Managed Service Provider",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "SeedTech is a managed service provider (MSP) in New Jersey offering help desk, cybersecurity, monitoring, cloud management, and on-site support for businesses.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Managed Service Provider New Jersey", item: "https://seedtechllc.com/managed-service-provider-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ManagedServiceProviderNJPage() {
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
            <span className="text-light-base/60">Managed Service Provider New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Server className="w-3.5 h-3.5 mr-1.5" /> Managed Service Provider — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Managed Service Provider for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              SeedTech is a managed service provider based in New Jersey. We handle your
              IT so you can focus on running your business — help desk, cybersecurity,
              monitoring, cloud management, and on-site support, all under one flat monthly rate.
            </p>
            <p>
              No contracts. No per-ticket fees. No hidden charges. Just a team of real
              technicians who learn your environment and keep it running.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free IT Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — What an MSP does */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Do"
          title="What a Managed Service Provider Actually Delivers"
          description="An MSP isn't just a help desk. It's a full IT operation — proactive monitoring, security, infrastructure management, and user support — all bundled into a predictable monthly cost."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatMSPDoes.map((card) => (
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

      {/* Section 2 — Red flags with current MSP */}
      <Section>
        <SectionHeader
          eyebrow="Time to Switch?"
          title="Red Flags That Your Current MSP Isn&apos;t Cutting It"
          description="If any of these sound familiar, your managed service provider isn't managing much. Here's what we hear from businesses before they switch to SeedTech."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {redFlags.map((flag) => (
            <div key={flag} className="flex items-start gap-3 rounded-2xl liquid-glass p-5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-body-sm text-light-base/70 leading-relaxed">{flag}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3 — What makes SeedTech different */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The SeedTech Difference"
          title="Why NJ Businesses Choose SeedTech as Their MSP"
          description="We're not the biggest MSP in New Jersey. We're the one that actually picks up the phone, knows your name, and includes security in the base price."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {seedtechDiff.map((card) => (
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

      {/* Section 4 — Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Managed IT Services for NJ&apos;s Key Industries"
          description="Different industries have different compliance, security, and operational demands. We tailor MSP services to your industry's reality."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Transparent MSP Pricing</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Flat-Rate MSP Plans — No Contracts, No Surprises
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedCare Essentials: $110/user/mo. Plus: $130/user/mo. Pro: $160/user/mo.
            Help desk, cybersecurity, monitoring, and management included in every tier.
            Month-to-month. No setup fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl bg-seed-600 hover:bg-seed-700 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              See Plans & Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white px-8 py-3.5 text-sm font-medium text-dark-base hover:bg-gray-50 transition-all duration-200"
            >
              Free IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Your Managed Service Provider Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedTech provides MSP services to businesses across New Jersey — from
            professional firms in Morris County to growing companies in Essex and Union
            Counties. Remote support everywhere, on-site when it matters.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge",
              "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph",
              "Morris County", "Somerset County", "Essex County", "Union County",
            ].map((loc) => (
              <span key={loc} className="inline-block rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-light-base/60">
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="MSP — Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Proactive IT management for NJ businesses.</p>
            </Link>
            <Link href="/outsourced-it-support-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Outsourced IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Why NJ businesses outsource IT to SeedTech.</p>
            </Link>
            <Link href="/insights/what-does-an-msp-do" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">What Does an MSP Do? →</h3>
              <p className="text-body-sm text-light-base/50">Deep dive into MSP services explained.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-light-base/50">See if SeedTech is the right MSP for you.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Managed Service Provider for New Jersey Businesses"
          description="Help desk, cybersecurity, monitoring, and management — all under one roof. Start with a free IT assessment."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
