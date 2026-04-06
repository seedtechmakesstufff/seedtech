import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  TrendingUp,
  Shield,
  Headphones,
  Monitor,
  PhoneCall,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Wrench,
  BarChart3,
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
  title: "Outsourced IT Support New Jersey | SeedTech — IT Outsourcing for NJ Businesses",
  description:
    "SeedTech provides outsourced IT support for New Jersey businesses — help desk, cybersecurity, monitoring, and on-site support at a flat monthly rate. No contracts. Call (914) 362-8889.",
  alternates: { canonical: "/outsourced-it-support-new-jersey" },
  openGraph: {
    title: "Outsourced IT Support New Jersey — SeedTech",
    description:
      "Outsource your IT to SeedTech. Full help desk, cybersecurity, monitoring, and vendor management — flat-rate pricing, no contracts, real technicians.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Outsourced IT Support New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const whyOutsource = [
  {
    icon: DollarSign,
    title: "An in-house IT hire costs $80K–$120K+",
    body: "Salary, benefits, training, tools, and time off. One person can't cover every specialization — security, networking, cloud, compliance. You end up with gaps or a generalist who's overwhelmed.",
  },
  {
    icon: Clock,
    title: "You can't afford downtime waiting for one person",
    body: "When your sole IT person is on vacation, sick, or stuck on a complex project, your team has no support. Outsourced IT means a full bench of technicians, not a single point of failure.",
  },
  {
    icon: TrendingUp,
    title: "Your business needs scale — your IT should too",
    body: "Hiring another IT person for every 30-50 employees doesn't scale. Outsourced IT grows with you — add users, add devices, expand offices — without a new hire each time.",
  },
  {
    icon: Shield,
    title: "Security requires specialization you don't have",
    body: "Endpoint protection, patch management, MFA, compliance — these aren't side projects. They require dedicated expertise and enterprise-grade tools that most small businesses can't justify purchasing alone.",
  },
];

const whatYouGet = [
  {
    icon: Headphones,
    title: "Unlimited help desk",
    body: "Your team calls and reaches a real technician. Password resets, email problems, software issues, and network outages — handled same-day, no ticket limits, no per-incident charges.",
    href: "/help-desk-services-new-jersey",
  },
  {
    icon: Monitor,
    title: "24/7 monitoring and alerting",
    body: "NinjaOne monitors every endpoint, server, and network device in your environment around the clock. We're alerted to issues before your team notices them.",
    href: "/managed-it-services-new-jersey",
  },
  {
    icon: Shield,
    title: "Full cybersecurity stack",
    body: "SentinelOne endpoint protection, automated patching, MFA enforcement, access controls, and employee offboarding security. Layered protection, not just antivirus.",
    href: "/cybersecurity-services-new-jersey",
  },
  {
    icon: Wrench,
    title: "On-site support",
    body: "Hardware swaps, network work, office moves, and hands-on troubleshooting. SeedCare Plus and Pro plans include monthly on-site hours for issues that need a physical presence.",
    href: "/it-support-new-jersey",
  },
  {
    icon: Laptop,
    title: "Employee onboarding and offboarding",
    body: "New hire laptop configured, accounts created, security enrolled. Departing employee accounts disabled, access revoked, data transferred. Same-day, every time.",
    href: "/services/managed-it/onboarding",
  },
  {
    icon: BarChart3,
    title: "Vendor management",
    body: "ISPs, phone systems, software vendors, hardware warranties. We handle the calls, the holds, and the follow-ups so your team can focus on the work that actually matters.",
    href: "/services/managed-it",
  },
];

const inHouseComparison = [
  { inHouse: "One person covering everything", outsourced: "Full team of specialists" },
  { inHouse: "No coverage during time off or illness", outsourced: "Continuous support — no single point of failure" },
  { inHouse: "$80K–$120K+ salary plus benefits and tools", outsourced: "Flat monthly rate starting at $110/user" },
  { inHouse: "Limited to one person's expertise", outsourced: "Security, networking, cloud, and compliance specialists" },
  { inHouse: "Enterprise tools too expensive to justify", outsourced: "SentinelOne, NinjaOne, and enterprise platforms included" },
  { inHouse: "Reactive — problems addressed after they occur", outsourced: "Proactive — monitoring prevents issues before they happen" },
];

const faqs = [
  {
    q: "What does outsourced IT support include?",
    a: "Full IT management — unlimited help desk, 24/7 monitoring, cybersecurity (SentinelOne), patch management, employee onboarding/offboarding, vendor management, and on-site support. Everything you'd expect from an internal IT department, without the overhead.",
  },
  {
    q: "How much does outsourced IT support cost?",
    a: "SeedCare plans start at $110/user/month for Essentials, $130 for Plus, and $160 for Pro. Per-user pricing means you pay for what you use, and everything scales naturally as you grow. No setup fees, no contracts.",
  },
  {
    q: "Can we keep some IT in-house and outsource the rest?",
    a: "Absolutely. Many clients keep a part-time IT coordinator or office manager handling day-to-day requests while we handle security, monitoring, infrastructure, and escalations. We call this a co-managed arrangement and it works well for businesses that want both.",
  },
  {
    q: "What's the transition process like?",
    a: "We start with a free IT assessment to understand your environment. Then a structured onboarding — typically 2-4 weeks — where we document your systems, deploy our tools, and transition support. Your team has a live help desk from day one of the transition.",
  },
  {
    q: "Are there long-term contracts?",
    a: "No. SeedTech operates on month-to-month agreements. We earn your business every month. If it's not working, you can leave. We believe that's the only way to stay accountable.",
  },
  {
    q: "How is this different from a break-fix IT company?",
    a: "Break-fix companies charge hourly and only show up when something breaks. They have a financial incentive for things to go wrong. Outsourced managed IT is the opposite — flat-rate, proactive, and incentivized to prevent problems. We make more money when your systems run smoothly.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Outsourced IT Support New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Outsourced IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Outsourced IT support for New Jersey businesses — unlimited help desk, cybersecurity, monitoring, vendor management, and on-site support at flat monthly rates.",
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
    { "@type": "ListItem", position: 2, name: "Outsourced IT Support New Jersey", item: "https://seedtechllc.com/outsourced-it-support-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function OutsourcedITSupportNJPage() {
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
            <span className="text-light-base/60">Outsourced IT Support New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="emerald" className="mb-6">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> IT Outsourcing — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Outsourced IT Support for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Hiring a full-time IT person costs $80K–$120K+ before tools and training.
              And one person still can&apos;t cover security, networking, cloud, and
              help desk all at once. Outsourcing your IT gets you a full team of
              specialists for a fraction of the cost.
            </p>
            <p>
              SeedTech provides outsourced IT support for businesses across New Jersey —
              help desk, cybersecurity, monitoring, vendor management, and on-site support.
              Flat monthly rate. No contracts. No surprises.
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

      {/* Section 1 — Why outsource */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Business Case"
          title="Why New Jersey Businesses Outsource IT"
          description="It's not about cutting corners — it's about getting better coverage, better tools, and better expertise than one hire can provide."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyOutsource.map((card) => (
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

      {/* Section 2 — What's included */}
      <Section>
        <SectionHeader
          eyebrow="What's Included"
          title="Everything You Need from an IT Department"
          description="Outsourced IT from SeedTech isn't just help desk. It's a complete IT operation — monitoring, security, support, and strategy — managed by a team that knows your environment."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGet.map((card) => (
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

      {/* Section 3 — In-house vs. Outsourced comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="In-House IT vs. Outsourced IT Support"
          description="Here's what the math looks like when you compare a single in-house hire to a full outsourced IT team."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">In-House IT Hire</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech Outsourced IT</p>
            </div>
            {inHouseComparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < inHouseComparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.inHouse}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.outsourced}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Transparent Pricing</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Flat-Rate IT Outsourcing — No Surprises
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedCare Essentials starts at $110/user/mo. Plus at $130. Pro at $160.
            Everything included — help desk, cybersecurity, monitoring, and vendor management.
            No contracts, no setup fees, no hidden charges.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              See Plans & Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Free IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Outsourced IT Support Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides outsourced IT support to businesses across New Jersey — from
            professional services firms in Morris County to growing companies in Somerset
            and Essex Counties. Remote support for every employee, on-site when you need it.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge",
              "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph",
              "Morris County", "Somerset County", "Essex County", "Union County",
            ].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="IT Outsourcing — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Proactive IT with flat-rate pricing.</p>
            </Link>
            <Link href="/help-desk-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">IT Help Desk Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Unlimited support, real technicians.</p>
            </Link>
            <Link href="/insights/what-does-managed-it-cost-nj" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">What Does Managed IT Cost? →</h3>
              <p className="text-body-sm text-dark-base/50">Real pricing breakdown for NJ businesses.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See what your current IT is costing you.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Outsourced IT Support for New Jersey Businesses"
          description="A full IT department for less than one hire. Help desk, security, monitoring, and strategy — all included."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
