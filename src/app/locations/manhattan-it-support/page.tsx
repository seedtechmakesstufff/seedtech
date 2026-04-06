import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PhoneCall,
  Building2,
  Scale,
  Stethoscope,
  Briefcase,
  Shield,
  Monitor,
  Headphones,
  Server,
  Landmark,
  Film,
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

export const metadata: Metadata = {
  title: "Manhattan IT Support | SeedTech — Managed IT Services in Manhattan, NYC",
  description:
    "SeedTech provides IT support for Manhattan businesses — proactive monitoring, help desk, cybersecurity, and cloud management. Call (914) 362-8889.",
  alternates: { canonical: "/locations/manhattan-it-support" },
  openGraph: {
    title: "Manhattan IT Support — SeedTech",
    description:
      "Managed IT services for Manhattan businesses. Proactive support, cybersecurity, and cloud management from SeedTech.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Manhattan IT Support — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const services = [
  {
    icon: Monitor,
    title: "24/7 monitoring",
    body: "Every workstation, server, and network device in your Manhattan office is monitored around the clock. We catch issues before they become outages — critical for businesses that can not afford downtime.",
  },
  {
    icon: Headphones,
    title: "Help desk support",
    body: "Your team gets direct access to real technicians — no phone trees, no impersonal ticket systems. Remote support starts in minutes via screen share and remote tools.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    body: "SentinelOne endpoint protection, MFA enforcement, email filtering, and automated patching. Layered security built for the compliance demands of Manhattan's professional services firms.",
  },
  {
    icon: Server,
    title: "Cloud & backup",
    body: "Microsoft 365 management, automated cloud backup with NinjaOne, and disaster recovery planning. Your data stays protected and recoverable — even in a city that never stops.",
  },
];

const localBusiness = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Manhattan is the legal capital of the world — from Midtown towers to boutique firms in the Flatiron District. We handle ethical wall configuration, encrypted document management, secure email, and compliance-ready IT infrastructure.",
  },
  {
    icon: Landmark,
    title: "Financial services",
    body: "Investment firms, hedge funds, and financial advisors in the Financial District and Midtown need fast, reliable, secure systems with zero tolerance for downtime. We deliver proactive monitoring and hardened endpoints to match.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare & dental",
    body: "Medical and dental practices throughout Manhattan need HIPAA-aligned IT — encrypted communications, access controls, audit logging, and protected backup for patient data. We configure and maintain it all.",
  },
  {
    icon: Film,
    title: "Media & creative agencies",
    body: "Manhattan's creative industry — agencies, production companies, and studios — relies on high-bandwidth workflows and collaborative tools. We keep your creative infrastructure running without bottlenecks.",
  },
  {
    icon: Briefcase,
    title: "Professional services",
    body: "Accounting firms, consultancies, and advisory firms across Manhattan depend on secure, responsive systems. We handle the technology so your team stays focused on billable work.",
  },
  {
    icon: Building2,
    title: "Startups & growing companies",
    body: "Manhattan startups need IT that scales without complexity. Per-user pricing, month-to-month terms, and cloud-first infrastructure mean you get enterprise-grade IT without enterprise-grade overhead.",
  },
];

const faqs = [
  {
    q: "Do you provide on-site IT support in Manhattan?",
    a: "Yes. While the majority of support is handled remotely for speed, we provide on-site support throughout Manhattan for hardware issues, network setup, office moves, and any work that requires hands-on attention. Our field technicians serve all of Manhattan — Midtown, Downtown, and everything in between.",
  },
  {
    q: "How fast can you respond to an issue at our Manhattan office?",
    a: "Remote support begins within minutes — most issues are resolved the same session. For on-site needs in Manhattan, we typically provide same-day response for critical issues and next-business-day for non-urgent requests.",
  },
  {
    q: "Do you support law firms in Manhattan?",
    a: "Yes — law firms are one of our core verticals. We handle ethical wall configuration, encrypted email and document management, compliance-ready backup, and secure client portals for firms of all sizes.",
  },
  {
    q: "What does IT support cost for a Manhattan business?",
    a: "SeedCare plans start at $110/user/month for Essentials, $130 for Plus, and $160 for Pro. Pricing is per-user, month-to-month, no long-term contracts. A 15-person Manhattan office would be approximately $1,650-$2,400/month depending on the tier.",
  },
  {
    q: "Are you based in Manhattan?",
    a: "Our headquarters are in Hopatcong, New Jersey. Manhattan is within our direct service area for both remote and on-site support. Most day-to-day IT work is handled remotely via our management tools, and we dispatch on-site technicians to Manhattan as needed.",
  },
  {
    q: "Can you help with an office move within Manhattan?",
    a: "Absolutely. We handle IT for office relocations — network infrastructure, workstation deployment, phone system setup, ISP coordination, and access control configuration. We plan it so your team is productive from day one at the new location.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support Manhattan NYC",
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
  serviceType: "Managed IT Support",
  areaServed: {
    "@type": "City",
    name: "Manhattan",
    containedInPlace: { "@type": "State", name: "New York" },
  },
  description:
    "Managed IT support for businesses in Manhattan, NYC — proactive monitoring, help desk, cybersecurity, and cloud management.",
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
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Manhattan IT Support",
      item: "https://seedtechllc.com/locations/manhattan-it-support",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ManhattanITSupportPage() {
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
            <Link href="/managed-it-services-new-jersey" className="hover:text-light-base/50 transition-colors">IT Services</Link>
            <span>/</span>
            <span className="text-light-base/60">Manhattan</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> Manhattan, NYC
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Support for Manhattan Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Manhattan businesses move fast — your IT support needs to move faster. From
              law firms in Midtown to fintech startups in the Flatiron District, SeedTech
              delivers proactive managed IT that keeps your team productive and your
              systems secure.
            </p>
            <p>
              We provide the same monitoring, cybersecurity, and help desk support that our
              New Jersey clients rely on — extended into Manhattan with remote-first tooling
              and on-site dispatch when you need it. No contracts, no impersonal call centers.
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

      {/* Services */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What You Get"
          title="IT Services Available in Manhattan"
          description="Everything a Manhattan business needs from an IT provider — without the overhead or complexity of an internal team."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                <s.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{s.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Local industries */}
      <Section>
        <SectionHeader
          eyebrow="Manhattan Industries"
          title="IT Built for Manhattan's Business Community"
          description="We understand the compliance, performance, and uptime requirements specific to Manhattan's professional landscape."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {localBusiness.map((b) => (
            <LiquidGlassCard key={b.title} className="p-7">
              <IconBox icon={b.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{b.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{b.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Nearby communities */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Also Serving Nearby Areas
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides IT support throughout Manhattan and the greater New York City area.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Midtown",
              "Financial District",
              "SoHo",
              "Tribeca",
              "Chelsea",
              "Flatiron",
              "East Village",
              "Upper East Side",
              "Upper West Side",
              "Brooklyn",
              "Jersey City",
              "Hoboken",
            ].map((loc) => (
              <span
                key={loc}
                className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="IT Support in Manhattan — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p>
            </Link>
            <Link href="/nationwide-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Nationwide IT Support →</h3>
              <p className="text-body-sm text-dark-base/50">Remote and on-site IT across the U.S.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services →</h3>
              <p className="text-body-sm text-dark-base/50">Protect your Manhattan office from threats.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See where your IT stands today.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Need IT Support in Manhattan?"
          description="Get a free IT assessment for your Manhattan business. We'll evaluate your systems, identify gaps, and show you exactly what proactive IT support looks like."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
