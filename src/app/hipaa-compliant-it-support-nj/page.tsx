import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Stethoscope,
  Lock,
  PhoneCall,
  FileText,
  Eye,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Fingerprint,
  HardDrive,
  ClipboardCheck,
  ShieldCheck,
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
  title: "HIPAA Compliant IT Support NJ | SeedTech — Healthcare IT for NJ Medical Practices",
  description:
    "SeedTech provides HIPAA compliant IT support for medical practices in New Jersey — endpoint protection, encrypted communications, access controls, backup verification, and audit-ready documentation. Call (914) 362-8889.",
  alternates: { canonical: "/hipaa-compliant-it-support-nj" },
  openGraph: {
    title: "HIPAA Compliant IT Support NJ — SeedTech",
    description:
      "Healthcare IT for NJ medical practices. HIPAA-ready security controls, patient data protection, EHR support, and audit-ready documentation.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "HIPAA Compliant IT Support NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const hipaaRisks = [
  {
    icon: AlertTriangle,
    title: "HIPAA fines start at $100 per violation",
    body: "The penalty tiers range from $100 to $50,000 per violation, up to $1.5 million per year per category. A single unencrypted laptop loss or a misconfigured email server can trigger an investigation that costs more than the fine itself.",
  },
  {
    icon: UserX,
    title: "Most breaches start with a human error",
    body: "A misdirected email, a lost device, or a phishing click. HIPAA doesn't just require firewalls — it requires access controls, training, and documented procedures that prove you took reasonable precautions.",
  },
  {
    icon: FileText,
    title: "You need proof, not just policies",
    body: "During an audit or breach investigation, regulators want to see documentation — who has access to what, when were backups tested, what endpoint protection is deployed, and how access is revoked when employees leave. If you can't show it, it didn't happen.",
  },
  {
    icon: Eye,
    title: "Your current IT may not understand HIPAA requirements",
    body: "Generic IT providers install antivirus and call it compliant. HIPAA requires specific technical safeguards — encryption at rest and in transit, audit logging, access controls, automatic session timeouts, and backup verification. Most MSPs don't implement the full scope.",
  },
];

const safeguards = [
  {
    icon: ShieldCheck,
    title: "Endpoint protection on every device",
    body: "SentinelOne deployed on every workstation, laptop, and server that touches patient data. AI-driven detection, automated response, and the audit trail HIPAA requires for every endpoint.",
  },
  {
    icon: Lock,
    title: "Encryption at rest and in transit",
    body: "Full-disk encryption on devices, TLS encryption on email, and encrypted cloud storage. Patient data is protected whether it's sitting on a hard drive or moving between systems.",
  },
  {
    icon: Fingerprint,
    title: "MFA and access controls",
    body: "Multi-factor authentication on email, EHR systems, cloud applications, and VPN. Role-based access ensures staff can only reach the data their job requires. Least-privilege by default.",
  },
  {
    icon: HardDrive,
    title: "Verified backup and recovery",
    body: "Automated backup with regular test restores — not just scheduled but verified. If patient records need to be recovered, we can prove the backup works before a disaster forces the question.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit logging and documentation",
    body: "Who accessed what, when, and from where. Login attempts, file access, permission changes, and security events — all logged and available for audit response. This is the documentation HIPAA investigators request first.",
  },
  {
    icon: UserX,
    title: "Employee offboarding and access revocation",
    body: "When a staff member leaves your practice, all access is revoked immediately — email, EHR, cloud apps, VPN, and physical system access. Documented, timestamped, and audit-ready.",
  },
];

const hipaaChecklistItems = [
  "Endpoint protection deployed on all devices accessing PHI",
  "Full-disk encryption enabled on laptops and workstations",
  "MFA enforced on email, EHR, and cloud applications",
  "Role-based access controls with least-privilege policies",
  "Automated backup with documented test restore procedures",
  "Audit logging for access, logins, and permission changes",
  "Employee offboarding with immediate access revocation",
  "Automatic session timeouts on workstations and applications",
  "Encrypted email for communications containing PHI",
  "Documented incident response procedures",
];

const faqs = [
  {
    q: "Is SeedTech a HIPAA-certified IT provider?",
    a: "There is no official HIPAA certification for IT providers. What matters is whether your IT provider implements the specific technical safeguards HIPAA requires — encryption, access controls, audit logging, backup verification, and endpoint protection. SeedTech implements all of these as part of our standard healthcare IT engagement.",
  },
  {
    q: "What HIPAA technical safeguards does SeedTech implement?",
    a: "Endpoint protection (SentinelOne), full-disk encryption, MFA enforcement, role-based access controls, automated and verified backup, audit logging, encrypted email, automatic session timeouts, and documented employee offboarding procedures. These address the core Technical Safeguard requirements under HIPAA's Security Rule.",
  },
  {
    q: "Do you support EHR and practice management software?",
    a: "Yes. We support common healthcare practice platforms and work with your EHR vendor to ensure updates, integrations, and access policies are maintained. We handle the IT infrastructure that EHR systems run on — endpoints, network, security, and backup.",
  },
  {
    q: "What happens if we have a data breach?",
    a: "We follow documented incident response procedures — isolate the affected systems, assess the scope, contain the threat, and begin recovery. We then support the breach notification process and help you document everything required for regulatory reporting under HIPAA's Breach Notification Rule.",
  },
  {
    q: "How much does HIPAA-compliant IT support cost?",
    a: "SeedCare plans start at $110/user/month for Essentials, $130 for Plus, and $160 for Pro. The security controls HIPAA requires — endpoint protection, encryption, access controls, and backup — are included in every tier. Healthcare practices don't need a special HIPAA plan; our standard security posture meets the requirement.",
  },
  {
    q: "Can you help us prepare for a HIPAA audit?",
    a: "Yes. We maintain documentation of all technical safeguards — endpoint protection deployment, encryption status, access control policies, backup verification logs, and offboarding records. When auditors request evidence of your security posture, we have it ready.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "HIPAA Compliant IT Support NJ",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "HIPAA Compliant IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "HIPAA compliant IT support for medical practices in New Jersey — endpoint protection, encryption, access controls, backup verification, audit logging, and documented security procedures.",
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
    { "@type": "ListItem", position: 2, name: "HIPAA Compliant IT Support NJ", item: "https://seedtechllc.com/hipaa-compliant-it-support-nj" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function HIPAACompliantITSupportNJPage() {
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
            <span className="text-light-base/60">HIPAA Compliant IT Support NJ</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="cyan" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="blue" className="mb-6">
            <Stethoscope className="w-3.5 h-3.5 mr-1.5" /> Healthcare IT — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            HIPAA Compliant IT Support for NJ Medical Practices
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              HIPAA doesn&apos;t just say &ldquo;protect patient data.&rdquo; It specifies
              how — encryption, access controls, audit logging, backup verification, and
              documented procedures. Most IT providers install antivirus and call it
              compliant. That&apos;s not compliance — that&apos;s a liability.
            </p>
            <p>
              SeedTech provides HIPAA-ready IT support for medical and dental practices
              across New Jersey. Every technical safeguard implemented, documented, and
              audit-ready — included in every SeedCare plan.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free HIPAA IT Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — HIPAA risk context */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The HIPAA Reality"
          title="Why Medical Practices Can&apos;t Ignore IT Security"
          description="HIPAA enforcement is real, and the consequences of non-compliance go beyond fines. Here's what's at stake for your practice."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {hipaaRisks.map((card) => (
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

      {/* Section 2 — Technical safeguards */}
      <Section>
        <SectionHeader
          eyebrow="What We Implement"
          title="HIPAA Technical Safeguards — Deployed and Documented"
          description="SeedTech implements every technical control HIPAA's Security Rule requires. Not just installed — actively managed, monitored, and documented for audit readiness."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeguards.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — HIPAA checklist */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Compliance Checklist"
          title="HIPAA IT Compliance — Are You Covered?"
          description="Here's what a HIPAA-compliant IT environment should include. If your current IT provider isn't delivering all of these, there are gaps in your compliance posture."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {hipaaChecklistItems.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-600" />
              <p className="text-body-sm text-dark-base/70 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">HIPAA Security Included</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            HIPAA Compliance Isn&apos;t an Add-On Tier
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            Every SeedCare plan — Essentials ($110/user/mo), Plus ($130/user/mo), and Pro ($160/user/mo) —
            includes the security controls HIPAA requires. Endpoint protection, encryption,
            access controls, backup verification, and audit logging come standard.
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
              Free HIPAA IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            HIPAA Compliant IT Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides HIPAA-compliant IT support to medical practices, dental
            offices, behavioral health providers, and specialty clinics across New Jersey.
            Patient data protected. Compliance documented.
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
        <SectionHeader title="HIPAA IT Support — Frequently Asked Questions" align="left" />
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
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full cybersecurity stack for NJ businesses.</p>
            </Link>
            <Link href="/endpoint-security-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Endpoint Security NJ →</h3>
              <p className="text-body-sm text-dark-base/50">SentinelOne on every device — the HIPAA endpoint requirement.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & Disaster Recovery →</h3>
              <p className="text-body-sm text-dark-base/50">Verified backup — a core HIPAA requirement.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free HIPAA IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Find compliance gaps before regulators do.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="HIPAA Compliant IT for NJ Medical Practices"
          description="Every technical safeguard implemented, documented, and audit-ready. Start with a free HIPAA IT assessment."
          primaryLabel="Free HIPAA IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
