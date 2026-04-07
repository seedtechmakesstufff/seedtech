import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Scale,
  Shield,
  Lock,
  Headphones,
  Monitor,
  Server,
  PhoneCall,
  Workflow,
  Clock,
  FileText,
  UserX,
  AlertTriangle,
  Gavel,
  Fingerprint,
  Eye,
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
  title: "IT Support for Law Firms in NJ | SeedTech — Managed IT for Legal Practices",
  description:
    "SeedTech provides managed IT support for law firms across New Jersey — secure document management, encrypted communications, ethical compliance, and responsive help desk. Call (914) 362-8889.",
  alternates: { canonical: "/it-support-law-firms-new-jersey" },
  openGraph: {
    title: "IT Support for Law Firms in New Jersey — SeedTech",
    description:
      "Managed IT services built for NJ law firms. Secure infrastructure, compliance-ready systems, and a help desk that answers the phone.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "IT Support for Law Firms NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const painPoints = [
  {
    icon: Clock,
    title: "Your IT provider doesn't understand legal",
    body: "Generic MSPs treat law firms like any other office. They don't understand privilege, court deadlines, or the consequences of a discovery failure. Your IT should know what's at stake.",
  },
  {
    icon: UserX,
    title: "Departed staff still have system access",
    body: "When an associate or paralegal leaves, their email, document access, and VPN credentials should be revoked immediately — not whenever your IT guy gets around to it.",
  },
  {
    icon: AlertTriangle,
    title: "You're not sure your data is actually protected",
    body: "Can your IT provider show you a current backup log? Prove your endpoint protection is active on every device? Document that your systems meet ethical obligations? If not, you're exposed.",
  },
  {
    icon: FileText,
    title: "Client files are stored without access controls",
    body: "Matters stored on shared drives with no permission structure means any employee can access any client file. That's a privilege violation waiting to happen.",
  },
];

const whatYouGet = [
  {
    icon: Headphones,
    title: "Direct help desk access",
    body: "Your attorneys and staff call us directly and reach a technician — not a ticket queue. Password resets, email issues, document access problems, and application errors handled the same day.",
  },
  {
    icon: Monitor,
    title: "24/7 monitoring",
    body: "NinjaOne agents on every workstation, laptop, and server. We track hardware health, patch compliance, disk space, and security events — and respond before they become outages.",
  },
  {
    icon: Shield,
    title: "Law-firm cybersecurity",
    body: "SentinelOne endpoint detection, email filtering, MFA enforcement, and automated patching. Configured for the threat environment legal practices actually face — ransomware, credential theft, and targeted phishing.",
  },
  {
    icon: Lock,
    title: "Encrypted communications",
    body: "Email encryption for privileged communications, secure file sharing for discovery documents, and encrypted backup for client data. Built to satisfy ABA Model Rule 1.6 competence requirements.",
  },
  {
    icon: Server,
    title: "Backup & disaster recovery",
    body: "Cloud backup with verified restores. If your document management system goes down, if a ransomware attack encrypts client files, or if hardware fails — we restore to a known-good state.",
  },
  {
    icon: Workflow,
    title: "IT strategy for growth",
    body: "Opening a second office? Adding practice areas? Hiring laterals who need immediate system access? We handle the technology side of firm growth so it doesn't slow you down.",
  },
];

const legalSpecific = [
  {
    icon: Gavel,
    title: "Document management security",
    body: "We configure role-based access controls on your DMS — NetDocuments, iManage, Worldox, or SharePoint-based systems. Partners see partner matters. Associates see their assignments. Staff see what they need. No one sees everything.",
  },
  {
    icon: Fingerprint,
    title: "Ethical wall implementation",
    body: "When your firm has conflicts — lateral hires, opposing parties, or screened matters — we implement technical ethical walls that restrict access at the system level, not just the honor system.",
  },
  {
    icon: Eye,
    title: "Audit trails & access logging",
    body: "Who accessed what client file, when, and from where. We configure logging that satisfies both internal governance and external audit requirements — critical for firms handling sensitive litigation.",
  },
  {
    icon: Scale,
    title: "ABA competence compliance",
    body: "ABA Model Rules 1.1 and 1.6 require lawyers to understand the technology they use to protect client information. We provide the infrastructure and documentation so your firm can demonstrate competence.",
  },
];

const firmTypes = [
  { name: "Solo practitioners", desc: "One-person shops that need enterprise-grade security without enterprise complexity. We manage your tech so you can manage your caseload." },
  { name: "Small firms (2-10 attorneys)", desc: "Growing practices that need structured IT — shared calendaring, document management, email security, and a support line that doesn't require a 3-day wait." },
  { name: "Mid-size firms (10-50 attorneys)", desc: "Multi-practice firms with compliance obligations, ethical wall requirements, and enough staff to need real access controls and offboarding procedures." },
  { name: "Satellite & branch offices", desc: "NJ firms with offices in multiple locations that need unified IT — same security policies, same monitoring, same support regardless of which office calls." },
];

const faqs = [
  {
    q: "Do you specialize in IT for law firms?",
    a: "Yes. We work with law firms across New Jersey — from solo practitioners to mid-size firms with 50+ attorneys. We understand privilege, ethical walls, document management, and the regulatory requirements that generic IT providers miss.",
  },
  {
    q: "Can you support our document management system?",
    a: "We support NetDocuments, iManage, Worldox, and SharePoint-based document management. We handle installation, access controls, backup, and user support — and configure permissions by matter, practice group, or attorney.",
  },
  {
    q: "How do you handle ethical walls technically?",
    a: "We implement ethical walls at the system level — restricting document access, email visibility, and shared drive permissions for screened attorneys and staff. This goes beyond a memo; it's a technical control.",
  },
  {
    q: "What does IT support cost for a law firm?",
    a: "Our SeedCare plans start at $110/user/month for Essentials and go up to $160/user/month for Pro. A 10-attorney firm with 5 support staff would typically fall in the $130/user range — about $1,950/month for the entire firm.",
  },
  {
    q: "Can you help us prepare for an audit or bar inquiry?",
    a: "We maintain documentation of your security controls, backup verification logs, access policies, and incident response procedures. If you face an audit or bar inquiry about data security, the documentation is ready.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "No. SeedTech operates month-to-month. We earn your business every billing cycle. If you're not satisfied, you can leave with 30 days notice — no penalties, no lock-in.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support for Law Firms in New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Managed IT Services for Law Firms",
  areaServed: { "@type": "State", name: "New Jersey" },
  description:
    "Managed IT support for law firms across New Jersey — secure document management, encrypted communications, ethical compliance, and responsive help desk.",
  audience: { "@type": "Audience", audienceType: "Law Firms" },
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
    { "@type": "ListItem", position: 2, name: "IT Support for Law Firms NJ", item: "https://seedtechllc.com/it-support-law-firms-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ITSupportLawFirmsNJPage() {
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
            <span className="text-light-base/60">IT Support for Law Firms NJ</span>
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
            <Scale className="w-3.5 h-3.5 mr-1.5" /> Law Firm IT — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Support for Law Firms in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Law firms handle some of the most sensitive data in any industry — privileged communications,
              litigation strategy, financial records, and personally identifiable information. Your IT
              infrastructure either protects that data or puts it at risk.
            </p>
            <p>
              SeedTech provides managed IT support for law firms across New Jersey. Secure document
              management, encrypted communications, ethical wall enforcement, and a help desk your
              attorneys can actually reach. Month-to-month, no contracts.
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

      {/* Pain Points */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Why Law Firms Switch IT Providers"
          description="Generic MSPs treat your firm like a dentist's office. The stakes are higher, the regulations are stricter, and the consequences of a breach are career-ending."
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

      {/* What You Get */}
      <Section>
        <SectionHeader
          eyebrow="What You Get"
          title="Managed IT Built for Legal Practices"
          description="Everything your firm needs from an IT provider — configured for the way law firms actually work."
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

      {/* Legal-Specific IT */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Legal-Specific"
          title="IT Capabilities Your Firm Actually Needs"
          description="These aren't generic IT features. They're the technical controls that matter for attorney-client privilege, ethical compliance, and bar readiness."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {legalSpecific.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                <card.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Firm Types */}
      <Section>
        <SectionHeader
          eyebrow="Who We Work With"
          title="Law Firms of Every Size"
          description="From solo practitioners to mid-size firms with multiple offices — our per-user model scales with your headcount."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {firmTypes.map((firm) => (
            <LiquidGlassCard key={firm.name} className="p-7">
              <CardTitle className="mb-2">{firm.name}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{firm.desc}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Pricing Note */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Flat-Rate IT for Law Firms — No Surprises
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-4">
            SeedCare plans start at <strong className="text-dark-base">$110/user/month</strong> and include
            monitoring, help desk, cybersecurity, and backup. A typical 15-person firm runs about
            $1,950/month on our Plus plan — less than a part-time IT hire.
          </p>
          <p className="text-body leading-relaxed text-dark-base/50 mb-8">
            Month-to-month. No contracts. No setup fees. Per-user pricing that covers all devices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl bg-seed-600 hover:bg-seed-700 px-8 py-3.5 text-sm font-medium text-white transition-colors"
            >
              See Plans & Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/insights/what-does-managed-it-cost-nj"
              className="inline-flex items-center gap-2 text-sm font-medium text-seed-600 hover:text-seed-700 transition-colors"
            >
              Read: What Does Managed IT Cost in NJ? →
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ Geo Signals */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Serving Law Firms Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            From the courthouse corridor in Morristown to the professional offices in
            Bernardsville, Basking Ridge, and Summit — we provide IT support to law
            firms throughout northern and central New Jersey.
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
        <SectionHeader title="Law Firm IT Support — FAQ" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal Links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/cybersecurity-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cybersecurity for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">Layered security for legal practices.</p>
            </Link>
            <Link href="/data-security-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Data Security for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">Protecting privileged client data.</p>
            </Link>
            <Link href="/it-compliance-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">IT Compliance for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">ABA rules, ethical obligations, audit readiness.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-light-base/50">Find out where your firm&apos;s IT stands.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="IT Support Built for Law Firms"
          description="Get a free IT assessment for your firm. We'll review your security posture, document management, and compliance readiness — and give you an honest recommendation."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
