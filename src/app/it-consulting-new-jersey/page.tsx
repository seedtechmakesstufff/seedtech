import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
  PhoneCall,
  BarChart3,
  Map,
  ClipboardCheck,
  Layers,
  Building2,
  Scale,
  Stethoscope,
  Truck,
  Server,
  Cloud,
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
import { TrustedBySection } from "@/components/home/TrustedBySection";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "IT Consulting New Jersey | SeedTech — Strategic IT Advisory for NJ Businesses",
  description:
    "SeedTech provides IT consulting for New Jersey businesses — technology assessments, IT roadmaps, cloud migration planning, infrastructure strategy, and vendor evaluation. Practical advice, not slide decks.",
  alternates: { canonical: "/it-consulting-new-jersey" },
  openGraph: {
    title: "IT Consulting New Jersey — SeedTech",
    description:
      "Strategic IT consulting for NJ businesses. Technology assessments, IT roadmaps, cloud planning, and security reviews — from a team that also does the implementation.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "IT Consulting New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const consultingServices = [
  {
    icon: ClipboardCheck,
    title: "IT assessments",
    body: "A comprehensive review of your current environment — infrastructure, security posture, backup status, licensing, and operational gaps. You get a documented report with prioritized recommendations, not a sales pitch.",
  },
  {
    icon: Map,
    title: "IT roadmaps & strategic planning",
    body: "Where should your technology be in 12, 24, and 36 months? We build IT roadmaps aligned with your business goals — budgeted, phased, and practical. Not aspirational slide decks you'll never look at again.",
  },
  {
    icon: Cloud,
    title: "Cloud migration planning",
    body: "Evaluating whether to move to Microsoft 365, Google Workspace, Azure, or AWS? We assess your workloads, estimate costs, plan the migration path, and manage the transition — or advise against it if on-prem makes more sense.",
  },
  {
    icon: Shield,
    title: "Security & compliance reviews",
    body: "Gap analysis against industry frameworks and compliance requirements — HIPAA, legal data protection standards, and cybersecurity best practices. We identify what's missing and build a remediation plan.",
  },
  {
    icon: Server,
    title: "Infrastructure planning",
    body: "Server lifecycle planning, network design, disaster recovery strategy, and hardware refresh budgeting. We help you plan before you spend — so every dollar goes where it matters.",
  },
  {
    icon: Layers,
    title: "Vendor evaluation & selection",
    body: "Choosing between ISPs, phone systems, SaaS platforms, or security tools? We evaluate vendors based on your actual requirements — not their marketing. Unbiased recommendations from people who've deployed them all.",
  },
];

const whyConsulting = [
  {
    icon: Target,
    title: "You're making a big technology decision",
    body: "Cloud migration, office relocation, new software platform, or a complete IT overhaul. The wrong choice costs years and thousands. An hour of strategic planning saves both.",
  },
  {
    icon: BarChart3,
    title: "Your IT spending feels reactive and unplanned",
    body: "Every month brings a new surprise expense. Without a roadmap, you're constantly reacting instead of investing strategically. IT consulting turns chaos into a planned budget.",
  },
  {
    icon: Shield,
    title: "You need to meet compliance requirements",
    body: "HIPAA, legal data protection, insurance audits — they all require documented security controls. A consulting engagement identifies gaps and creates the remediation plan your auditor is asking for.",
  },
  {
    icon: TrendingUp,
    title: "Your business is growing and IT can't keep up",
    body: "You've outgrown your current setup but don't know what the next step looks like. Strategic IT consulting gives you a scaled plan — what to do now, what to do next quarter, and what to budget for next year.",
  },
];

const difference = [
  { typical: "Delivers a PDF you'll never read", seedtech: "Delivers actionable recommendations with budgets and timelines" },
  { typical: "Consulting team never touches the technology", seedtech: "Same team that consults also implements and manages" },
  { typical: "Recommends enterprise solutions for SMB budgets", seedtech: "Right-sized recommendations for businesses with 10–200 employees" },
  { typical: "Charges $200–$300/hr for generic advice", seedtech: "Fixed-scope consulting engagements with clear deliverables" },
  { typical: "No accountability for whether advice works", seedtech: "We implement what we recommend — accountability is built in" },
  { typical: "Cookie-cutter frameworks applied to every client", seedtech: "Recommendations based on your actual environment and goals" },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Technology strategy for legal practices — document management, client data security, compliance documentation, and cloud migration planning.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare practices",
    body: "HIPAA gap analysis, EHR system evaluation, and infrastructure planning for medical and dental practices navigating compliance requirements.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Multi-location IT strategy, fleet management system evaluation, and connectivity planning for distributed operations.",
  },
  {
    icon: Building2,
    title: "Growing businesses",
    body: "IT roadmaps for companies scaling past 20, 50, or 100 employees. Plan the infrastructure and tools that support your next phase of growth.",
  },
];

const faqs = [
  {
    q: "What does an IT consulting engagement look like?",
    a: "It depends on the scope. A security assessment might be a 1-2 week engagement with a documented report. An IT roadmap might involve 3-4 weeks of discovery and planning. Every engagement starts with a free initial consultation to define scope and deliverables.",
  },
  {
    q: "How is this different from a managed IT assessment?",
    a: "Our free IT assessment is a high-level review to identify immediate risks and determine fit. IT consulting is a deeper, structured engagement with formal deliverables — detailed documentation, budgeted roadmaps, and strategic recommendations.",
  },
  {
    q: "Do you implement the recommendations or just advise?",
    a: "Both. Unlike traditional consulting firms that hand off a report and walk away, SeedTech can implement everything we recommend — from security remediations to cloud migrations to infrastructure buildouts. Same team, no handoff gap.",
  },
  {
    q: "How much does IT consulting cost?",
    a: "We quote fixed-scope engagements based on the work involved. A security gap analysis might be a flat project fee. A full IT roadmap engagement is priced based on environment complexity. No hourly billing surprises.",
  },
  {
    q: "Can we engage for consulting without signing up for managed IT?",
    a: "Absolutely. Many clients engage us for a consulting project first — an assessment, a roadmap, or a vendor evaluation. Some then transition to managed IT. Others just needed the strategic guidance. No pressure either way.",
  },
  {
    q: "What size businesses do you consult for?",
    a: "We focus on small and mid-sized businesses — typically 10 to 200 employees. Our recommendations are right-sized for SMB budgets and operational realities, not enterprise frameworks crammed into a smaller box.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Consulting New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "IT Consulting",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "IT consulting for New Jersey businesses — technology assessments, IT roadmaps, cloud migration planning, security reviews, and vendor evaluation.",
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
    { "@type": "ListItem", position: 2, name: "IT Consulting New Jersey", item: "https://seedtechllc.com/it-consulting-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ITConsultingNJPage() {
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
            <span className="text-light-base/60">IT Consulting New Jersey</span>
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
            <Lightbulb className="w-3.5 h-3.5 mr-1.5" /> IT Consulting — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Consulting for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Most IT decisions are made reactively — something breaks, a vendor pitches
              you, or an employee asks for something they saw on LinkedIn. That&apos;s not
              strategy. That&apos;s chaos with a budget.
            </p>
            <p>
              SeedTech provides IT consulting for businesses across New Jersey. Technology
              assessments, strategic roadmaps, cloud migration planning, and security
              reviews — from a team that also does the implementation. Practical advice,
              not slide decks.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Initial Consultation <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — When you need consulting */}
      <Section theme="light">
        <SectionHeader
          eyebrow="When to Call"
          title="When Your Business Needs IT Consulting"
          description="Strategic IT decisions shouldn't be made on gut feeling. Here's when a consulting engagement pays for itself."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyConsulting.map((card) => (
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

      {/* Section 2 — Consulting services */}
      <Section>
        <SectionHeader
          eyebrow="What We Deliver"
          title="IT Consulting Services — Actionable, Not Theoretical"
          description="Every consulting engagement produces clear deliverables — documented findings, prioritized recommendations, budgets, and timelines. Not a binder that collects dust."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultingServices.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — SeedTech vs typical consulting */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Difference"
          title="SeedTech Consulting vs. Typical IT Consultants"
          description="Most IT consultants deliver advice they'll never have to stand behind. We deliver advice we implement ourselves."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Typical IT Consultant</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech IT Consulting</p>
            </div>
            {difference.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < difference.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <p className="text-body-sm text-dark-base/50 pr-4">{row.typical}</p>
                <p className="text-body-sm text-dark-base/80 font-medium pr-4">{row.seedtech}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Advise"
          title="IT Consulting for New Jersey's Key Industries"
          description="Different industries face different technology challenges. Our consulting accounts for your specific regulatory, operational, and growth requirements."
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

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            IT Consulting Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides IT consulting to businesses across New Jersey — from law firms
            in Morristown to growing companies in Morris, Somerset, and Essex Counties.
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
        <SectionHeader title="IT Consulting — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Ongoing IT management after your roadmap is built.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Security implementations from our consulting.</p>
            </Link>
            <Link href="/co-managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Co-Managed IT Services →</h3>
              <p className="text-body-sm text-dark-base/50">Augment your existing IT team.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Start with a high-level review of your environment.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Strategic IT Consulting — Not Just Advice"
          description="Technology assessments, IT roadmaps, and security reviews — from a team that implements what they recommend. Start with a free consultation."
          primaryLabel="Free Consultation"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
