import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Cloud,
  Mail,
  HardDrive,
  PhoneCall,
  Users,
  Monitor,
  ShieldCheck,
  Settings,
  BarChart3,
  DollarSign,
  Briefcase,
  Truck,
  Stethoscope,
  Wrench,
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
  title: "Cloud Services New Jersey | SeedTech — Microsoft 365 & Cloud Management for NJ Businesses",
  description:
    "SeedTech provides cloud services for New Jersey businesses — Microsoft 365 management, cloud migration, license optimization, and hybrid cloud support. Practical cloud for SMBs.",
  alternates: { canonical: "/cloud-services-new-jersey" },
  openGraph: {
    title: "Cloud Services New Jersey — SeedTech",
    description:
      "Microsoft 365 management, cloud migration, and license optimization for NJ businesses. Practical cloud support — not enterprise complexity.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cloud Services New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const problems = [
  {
    icon: DollarSign,
    title: "Paying for licenses nobody uses",
    body: "Half the team is on Business Premium. The other half doesn't need it. No one has audited licenses in 18 months and you're bleeding money.",
  },
  {
    icon: Users,
    title: "No standard onboarding or offboarding",
    body: "New hires wait days for email. Former employees still have active accounts. SharePoint permissions are a mess because nobody owns the process.",
  },
  {
    icon: Settings,
    title: "Cloud tools configured by whoever set them up",
    body: "OneDrive, SharePoint, Teams — all deployed piecemeal by different people at different times. Nothing is standardized, nothing is documented.",
  },
  {
    icon: ShieldCheck,
    title: "No MFA, no conditional access",
    body: "Microsoft 365 accounts are protected by passwords alone. One compromised credential gives an attacker access to email, files, and everything connected to it.",
  },
];

const services = [
  {
    icon: Mail,
    title: "Microsoft 365 management",
    body: "Full lifecycle M365 administration — user provisioning, group management, Exchange Online configuration, Teams setup, SharePoint permissions, and ongoing tenant hygiene.",
  },
  {
    icon: BarChart3,
    title: "License optimization",
    body: "We audit your Microsoft licensing, identify unused or over-provisioned licenses, and right-size your tenant. Most clients save 15-30% on license costs after an audit.",
  },
  {
    icon: Cloud,
    title: "Cloud migration",
    body: "Moving from on-prem Exchange or file servers to Microsoft 365? We handle the migration — mailbox cutover, data migration, DNS changes, and user training.",
  },
  {
    icon: HardDrive,
    title: "Hybrid cloud support",
    body: "Not everything belongs in the cloud. We support hybrid environments — on-prem servers synced with Azure AD, local file shares alongside SharePoint, and VPNs for remote access.",
  },
  {
    icon: ShieldCheck,
    title: "Cloud security configuration",
    body: "MFA enforcement, conditional access policies, email filtering, anti-phishing rules, and data loss prevention (DLP) policies configured correctly from day one.",
  },
  {
    icon: Monitor,
    title: "Endpoint + cloud integration",
    body: "Your cloud environment and your endpoints should work together. We ensure devices are enrolled, policies are applied, and updates flow through a managed pipeline.",
  },
];

const industries = [
  { icon: Briefcase, title: "Law firms", body: "Secure email, document management, ethical walls, and compliance-ready M365 configuration." },
  { icon: Stethoscope, title: "Medical practices", body: "HIPAA-aligned M365 setup, encrypted email, and controlled access to patient-related files." },
  { icon: Truck, title: "Trucking & logistics", body: "Teams for dispatch communication, SharePoint for driver docs, mobile-friendly cloud access." },
  { icon: Wrench, title: "Contractors", body: "OneDrive for field access to plans and docs, shared mailboxes for project coordination." },
];

const faqs = [
  {
    q: "Do you only work with Microsoft 365?",
    a: "M365 is our primary cloud platform for SMBs — it covers email, file storage, collaboration, and identity. If you use Google Workspace or other platforms, we can discuss your needs during an assessment, but our expertise is deepest with the Microsoft ecosystem.",
  },
  {
    q: "Can you help us migrate from on-prem Exchange?",
    a: "Yes. We handle full Exchange-to-Exchange-Online migrations including mailbox cutover, public folder migration, DNS updates, and client reconfiguration. We'll also ensure MFA and security policies are configured before go-live.",
  },
  {
    q: "How much can we save on Microsoft licenses?",
    a: "It depends on your current licensing. Most businesses we audit have at least 15-30% in wasted spend — unused licenses, over-provisioned plans, or duplicate subscriptions. We right-size during onboarding and review quarterly.",
  },
  {
    q: "Is cloud management included in SeedCare plans?",
    a: "M365 administration is included in all SeedCare tiers. This covers user management, license assignment, security configuration, and ongoing support. Major migrations or tenant restructuring may be scoped separately.",
  },
  {
    q: "What about security? Is M365 secure out of the box?",
    a: "Not really. The default configuration leaves significant gaps — no MFA, no conditional access, weak anti-phishing rules, and overly permissive sharing settings. We harden every tenant we manage with a security baseline that covers all of these.",
  },
  {
    q: "Can employees access files from home or in the field?",
    a: "Yes — that's one of the biggest benefits of cloud migration. With OneDrive, SharePoint, and Teams, your team can access files from any device, anywhere. We configure it securely so access is convenient without being risky.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cloud Services New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Cloud Services",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Microsoft 365 management, cloud migration, license optimization, and hybrid cloud support for New Jersey businesses.",
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
    { "@type": "ListItem", position: 2, name: "Cloud Services New Jersey", item: "https://seedtechllc.com/cloud-services-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CloudServicesNJPage() {
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
            <span className="text-light-base/60">Cloud Services New Jersey</span>
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
            <Cloud className="w-3.5 h-3.5 mr-1.5" /> Cloud Services — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Cloud Services for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your business already uses the cloud — Microsoft 365, OneDrive, Teams. But
              it&apos;s probably not configured correctly, not secured properly, and costing
              more than it should.
            </p>
            <p>
              SeedTech manages your cloud environment so it actually works the way it&apos;s
              supposed to — secure, organized, and right-sized for your team.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Cloud Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — Cloud problems */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="The Cloud Problems We Fix for NJ Businesses"
          description="You don't need more cloud tools. You need the ones you have to actually be managed."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {problems.map((card) => (
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

      {/* Section 2 — Cloud services */}
      <Section>
        <SectionHeader
          eyebrow="What We Manage"
          title="Cloud Services Built for How SMBs Actually Work"
          description="SeedTech focuses on practical cloud management for small and mid-size businesses — not enterprise complexity. Microsoft 365 is the backbone. We make sure it runs right."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — License savings callout */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <DollarSign className="w-3.5 h-3.5 mr-1.5" /> License Optimization
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Most NJ Businesses Are Overpaying for Microsoft 365
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60">
            <p>
              Not every employee needs Business Premium. Some need Basic. Some need E3.
              Some don&apos;t need a license at all — they left the company six months ago.
            </p>
            <p>
              We audit your Microsoft licensing during onboarding, right-size every seat, and
              review quarterly. Most clients see <strong className="text-dark-base">15–30%
              savings</strong> on licensing costs alone.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 4 — NJ industries */}
      <Section>
        <SectionHeader
          eyebrow="Industry Fit"
          title="Cloud Services for NJ Industries"
          description="Every industry has different cloud needs. Here's how we tailor M365 environments for the industries we serve."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
            <div key={card.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                <card.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Cloud Services Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech manages cloud environments for businesses throughout New Jersey — from
            law offices in Morristown to logistics companies in Parsippany.
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
        <SectionHeader title="Cloud Services — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Full IT management with cloud included.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Secure your cloud accounts and endpoints.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & DR NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Protect your cloud and on-prem data.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free Cloud Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Audit your M365 tenant and licensing.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Is Your Cloud Working for You — or Against You?"
          description="Most NJ businesses are overpaying for cloud tools that aren't configured correctly. Start with a free assessment and find out where you stand."
          primaryLabel="Free Cloud Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
