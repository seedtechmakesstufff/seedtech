import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Users,
  Handshake,
  Shield,
  Headphones,
  Monitor,
  PhoneCall,
  Clock,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Wrench,
  TrendingUp,
  Scale,
  Stethoscope,
  Truck,
  Building2,
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
  title: "Co-Managed IT Services New Jersey | SeedTech — Augment Your Internal IT Team",
  description:
    "SeedTech provides co-managed IT services for New Jersey businesses — augment your internal IT staff with 24/7 monitoring, cybersecurity, help desk overflow, and strategic support. No contracts.",
  alternates: { canonical: "/co-managed-it-services-new-jersey" },
  openGraph: {
    title: "Co-Managed IT Services New Jersey — SeedTech",
    description:
      "Keep your internal IT team and add SeedTech for security, monitoring, help desk overflow, and escalation support. Co-managed IT for NJ businesses.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Co-Managed IT Services New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const whyCoManaged = [
  {
    icon: Users,
    title: "Your IT person can't do everything",
    body: "One internal IT hire can't be a security expert, network engineer, cloud admin, and help desk all at once. Co-managed IT fills the gaps without replacing anyone.",
  },
  {
    icon: Clock,
    title: "You need coverage when they're out",
    body: "Vacations, sick days, and after-hours emergencies don't pause because your IT person is unavailable. Co-managed IT gives you a bench — your team is never uncovered.",
  },
  {
    icon: Shield,
    title: "Security requires dedicated specialization",
    body: "Endpoint protection, patch management, MFA, compliance — these aren't side projects for your IT coordinator. They require enterprise-grade tools and dedicated expertise.",
  },
  {
    icon: TrendingUp,
    title: "You're growing faster than your IT team",
    body: "Adding employees, offices, or applications shouldn't require another full-time IT hire. Co-managed IT scales with you while your internal team stays focused on what they do best.",
  },
];

const whatWeHandle = [
  {
    icon: Monitor,
    title: "24/7 monitoring & alerting",
    body: "NinjaOne monitors every endpoint, server, and network device around the clock. We catch issues before your team or employees notice them — and escalate to your IT lead when needed.",
  },
  {
    icon: Shield,
    title: "Full cybersecurity stack",
    body: "SentinelOne endpoint protection, automated patching, MFA enforcement, and access controls. Your internal IT stays focused on operations while we handle the security layer.",
    href: "/cybersecurity-services-new-jersey",
  },
  {
    icon: Headphones,
    title: "Help desk overflow",
    body: "When your internal IT is in a meeting, on-site at another office, or handling a major project — we pick up the help desk tickets. Your employees never wait without support.",
  },
  {
    icon: Wrench,
    title: "Escalation support",
    body: "Complex network issues, firewall configurations, server migrations — when your IT person hits the limit of their expertise, our team steps in as the escalation path.",
  },
  {
    icon: Laptop,
    title: "Employee onboarding & offboarding",
    body: "Laptop setup, account creation, security enrollment, and access provisioning for new hires. Full access revocation and data transfer for departures. Consistent every time.",
  },
  {
    icon: BarChart3,
    title: "Vendor management",
    body: "ISP issues, phone system outages, software vendor support — we handle the hold times and follow-ups with your vendors so your IT lead can focus on internal priorities.",
  },
];

const coManagedComparison = [
  { solo: "One person covering all specializations", coManaged: "Your IT lead + a full team of specialists" },
  { solo: "No coverage during PTO, sick days, or evenings", coManaged: "24/7 monitoring and help desk — always covered" },
  { solo: "Enterprise security tools too expensive to justify", coManaged: "SentinelOne, NinjaOne, and enterprise platforms included" },
  { solo: "Reactive — problems discovered by employees", coManaged: "Proactive — issues caught before they cause downtime" },
  { solo: "Escalations go to Google or vendor support holds", coManaged: "Direct escalation path to experienced engineers" },
  { solo: "No documentation or IT roadmap", coManaged: "Documented environment, quarterly strategic reviews" },
];

const idealFor = [
  {
    icon: Building2,
    title: "Growing businesses (20–100 employees)",
    body: "You have an IT person but they're stretched thin. Co-managed IT gives them the support they need without adding headcount.",
  },
  {
    icon: Scale,
    title: "Professional services firms",
    body: "Law firms, accounting firms, and consultancies with an internal IT coordinator who needs cybersecurity and compliance support.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare practices",
    body: "Medical and dental offices with IT staff who need HIPAA-compliant security, backup monitoring, and vendor management support.",
  },
  {
    icon: Truck,
    title: "Multi-location companies",
    body: "Businesses with multiple offices or remote workers where one IT person can't physically cover every site. We provide remote and on-site support across all locations.",
  },
];

const faqs = [
  {
    q: "What's the difference between co-managed and fully outsourced IT?",
    a: "With co-managed IT, you keep your internal IT person or team. SeedTech fills in the gaps — security, monitoring, help desk overflow, and escalation support. Fully outsourced IT means SeedTech handles everything. Co-managed is ideal when you have IT staff but need more coverage.",
  },
  {
    q: "Does our internal IT person work with your team?",
    a: "Yes. We establish a shared communication channel, clear escalation paths, and role definitions during onboarding. Your IT lead retains control of internal priorities while we handle monitoring, security, and overflow support.",
  },
  {
    q: "How much does co-managed IT cost?",
    a: "Co-managed IT uses the same SeedCare pricing — Essentials ($110/user/mo), Plus ($130), and Pro ($160). The scope of what we handle vs. your internal team is customized during onboarding.",
  },
  {
    q: "Can we transition from co-managed to fully outsourced later?",
    a: "Absolutely. Many clients start co-managed and transition to fully outsourced when their internal IT person moves on. Since we already know your environment, the transition is seamless.",
  },
  {
    q: "Will your team take over decisions from our IT person?",
    a: "No. Your internal IT lead retains authority over the environment. We operate in a support role — executing on monitoring, security, and help desk while keeping your team informed and in control.",
  },
  {
    q: "What tools do you deploy alongside our existing setup?",
    a: "We deploy NinjaOne for monitoring and management, and SentinelOne for endpoint protection. These integrate with your existing infrastructure — we don't rip and replace what's already working.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Co-Managed IT Services New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Co-Managed IT Services",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Co-managed IT services for New Jersey businesses — augment your internal IT team with 24/7 monitoring, cybersecurity, help desk overflow, and strategic support.",
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
    { "@type": "ListItem", position: 2, name: "Co-Managed IT Services New Jersey", item: "https://seedtechllc.com/co-managed-it-services-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CoManagedITServicesNJPage() {
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
            <span className="text-light-base/60">Co-Managed IT Services New Jersey</span>
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
            <Handshake className="w-3.5 h-3.5 mr-1.5" /> Co-Managed IT — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Co-Managed IT Services for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              You have an IT person. They&apos;re good. But they can&apos;t be a security
              specialist, network engineer, cloud admin, and help desk all at once — and they
              shouldn&apos;t have to be.
            </p>
            <p>
              SeedTech&apos;s co-managed IT augments your internal team with 24/7 monitoring,
              enterprise-grade cybersecurity, help desk overflow, and escalation support.
              Your IT lead stays in control. We fill the gaps.
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

      {/* Section 1 — Why Co-Managed */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Reality"
          title="Why Your IT Person Needs a Team Behind Them"
          description="A single IT hire — no matter how talented — can't cover every specialization, be available 24/7, and keep up with the security threat landscape alone."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyCoManaged.map((card) => (
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

      {/* Section 2 — What SeedTech handles */}
      <Section>
        <SectionHeader
          eyebrow="What We Handle"
          title="SeedTech Augments — Your IT Lead Stays in Control"
          description="We take on the work that requires 24/7 coverage, specialized tools, and deep expertise — so your internal IT can focus on the projects that move your business forward."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeHandle.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Solo IT vs Co-Managed comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="Solo IT Person vs. Co-Managed with SeedTech"
          description="Here's what changes when your internal IT has a team behind them."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Solo IT Person</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">Co-Managed with SeedTech</p>
            </div>
            {coManagedComparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < coManagedComparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.solo}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.coManaged}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Ideal for */}
      <Section>
        <SectionHeader
          eyebrow="Best Fit"
          title="Co-Managed IT Is Ideal For"
          description="Co-managed IT works best for businesses that want to keep their internal IT expertise while adding enterprise-grade coverage."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {idealFor.map((card) => (
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
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Transparent Pricing</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Same SeedCare Plans — Customized Scope
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            Co-managed IT uses the same SeedCare pricing — Essentials ($110/user/mo), Plus ($130),
            and Pro ($160). During onboarding, we define exactly what SeedTech handles vs. your
            internal team. No overlap, no gaps.
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
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white hover:bg-gray-50 px-8 py-3.5 text-sm font-medium text-dark-base transition-all duration-200"
            >
              Free IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Co-Managed IT Support Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides co-managed IT services to businesses across New Jersey — augmenting
            internal IT teams from Morristown to Basking Ridge to Hopatcong. Your IT lead gets
            the support they need, wherever your offices are.
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
        <SectionHeader title="Co-Managed IT — Frequently Asked Questions" align="left" />
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
            <Link href="/outsourced-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Outsourced IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Fully outsourced IT management.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Proactive IT with flat-rate pricing.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Enterprise-grade security for your team.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See where your IT team needs support.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Give Your IT Team the Backup They Need"
          description="Co-managed IT from SeedTech — 24/7 monitoring, cybersecurity, and help desk overflow. Your IT lead stays in control."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
