import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ShieldCheck,
  Scale,
  ClipboardCheck,
  BookOpen,
  PhoneCall,
  ScrollText,
  Landmark,
  Gavel,
  BadgeCheck,
  FolderSearch,
  ListChecks,
  UserCheck,
  AlertTriangle,
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
  title: "IT Compliance for Law Firms NJ | SeedTech — ABA, Ethics & Regulatory Compliance",
  description:
    "SeedTech helps NJ law firms meet IT compliance obligations — ABA Model Rules, NJ ethics requirements, HIPAA overlap, and audit-ready documentation. Call (914) 362-8889.",
  alternates: { canonical: "/it-compliance-law-firms-nj" },
  openGraph: {
    title: "IT Compliance for Law Firms in New Jersey — SeedTech",
    description:
      "Meet your ethical and regulatory IT obligations. ABA tech competence, NJ bar requirements, and audit-ready documentation for law firms.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "IT Compliance for Law Firms NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const obligations = [
  {
    icon: BookOpen,
    title: "ABA Model Rule 1.1 — Tech competence",
    body: "Comment [8] to Rule 1.1 requires lawyers to &quot;keep abreast of changes in the law and its practice, including the benefits and risks associated with relevant technology.&quot; You don&apos;t need to be a technologist — but you need an IT provider who understands what this requires.",
  },
  {
    icon: Scale,
    title: "ABA Model Rule 1.6 — Confidentiality",
    body: "Rule 1.6(c) requires &quot;reasonable efforts to prevent the inadvertent or unauthorized disclosure of, or unauthorized access to, information relating to the representation of a client.&quot; This means encryption, access controls, and documented security policies — not just antivirus.",
  },
  {
    icon: ScrollText,
    title: "NJ RPC 1.6 — State-level requirements",
    body: "New Jersey adopted its own version of the duty of technological competence. NJ attorneys must take reasonable steps to safeguard client information stored electronically. The state bar has disciplined attorneys who failed to implement adequate IT safeguards.",
  },
  {
    icon: Landmark,
    title: "HIPAA — Personal injury & med-mal firms",
    body: "If your firm handles personal injury, medical malpractice, or workers&apos; comp cases, you may receive protected health information from medical providers. HIPAA Business Associate requirements can apply — and they carry their own set of technical safeguards.",
  },
];

const complianceServices = [
  {
    icon: ClipboardCheck,
    title: "Security policy documentation",
    body: "We create and maintain written information security policies tailored to your firm — acceptable use, access control, incident response, backup procedures, and data retention. Documentation the bar expects to see if they ever ask.",
  },
  {
    icon: ShieldCheck,
    title: "Technical controls implementation",
    body: "Encryption, MFA, access controls, endpoint protection, patch management, and backup — all configured and maintained to satisfy &quot;reasonable efforts&quot; under ABA and NJ RPC requirements. We don&apos;t just recommend controls — we implement them.",
  },
  {
    icon: FolderSearch,
    title: "Compliance gap assessment",
    body: "We audit your current IT environment against ABA tech competence requirements, NJ ethics rules, and applicable regulations. You get a written report showing what&apos;s compliant, what&apos;s not, and what needs to change — with a prioritized remediation plan.",
  },
  {
    icon: BadgeCheck,
    title: "Audit-ready documentation",
    body: "Backup verification logs, access control records, incident response history, patch compliance reports, and security event documentation — all maintained and available if you face a bar inquiry, client audit, or regulatory review.",
  },
  {
    icon: UserCheck,
    title: "Staff security awareness",
    body: "We coordinate security awareness training for your attorneys and staff — phishing recognition, password hygiene, secure document handling, and social engineering defense. Training records maintained for compliance documentation.",
  },
  {
    icon: ListChecks,
    title: "Ongoing compliance monitoring",
    body: "Compliance isn&apos;t a one-time project. We continuously monitor your environment for drift — expired certificates, disabled MFA, unpatched systems, changed permissions. Quarterly compliance reviews ensure you stay in good standing.",
  },
];

const auditReadiness = [
  { item: "Written information security policy", status: "Documented" },
  { item: "Encryption at rest and in transit", status: "Verified" },
  { item: "MFA on all critical systems", status: "Enforced" },
  { item: "Access controls by role/matter", status: "Configured" },
  { item: "Backup verification with tested restores", status: "Quarterly" },
  { item: "Endpoint protection on all devices", status: "Active" },
  { item: "Patch management compliance", status: "Automated" },
  { item: "Incident response procedure", status: "Documented" },
  { item: "Employee offboarding procedure", status: "Documented" },
  { item: "Security awareness training records", status: "Current" },
];

const faqs = [
  {
    q: "What IT compliance obligations do NJ law firms have?",
    a: "NJ law firms must comply with ABA Model Rules 1.1 (tech competence) and 1.6 (confidentiality safeguards), NJ RPC 1.6, and potentially HIPAA if handling medical records. These rules require reasonable technical safeguards, documented security policies, and demonstrable competence in the technology used to handle client information.",
  },
  {
    q: "What does ABA tech competence actually require?",
    a: "Comment [8] to ABA Model Rule 1.1 requires attorneys to understand the benefits and risks of the technology they use. In practice, this means having an IT provider who implements appropriate security controls, maintains documentation, and can demonstrate that your systems meet reasonable standards for client data protection.",
  },
  {
    q: "Do we need HIPAA compliance as a law firm?",
    a: "If your firm handles protected health information — common in personal injury, medical malpractice, and workers&apos; compensation cases — you may be considered a Business Associate under HIPAA. This triggers additional technical requirements including encryption, access controls, audit logging, and a BAA with medical providers.",
  },
  {
    q: "What documentation do we need for a bar audit?",
    a: "At minimum: a written information security policy, evidence of encryption, MFA enforcement records, backup verification logs, access control documentation, incident response procedures, and employee training records. We maintain all of this as part of our standard managed IT service.",
  },
  {
    q: "How often should compliance be reviewed?",
    a: "We recommend quarterly compliance reviews to catch drift — disabled MFA accounts, changed permissions, expired policies, or new regulatory requirements. Annual comprehensive assessments evaluate your full security posture against current ABA and NJ RPC requirements.",
  },
  {
    q: "Is compliance documentation included in your managed IT plans?",
    a: "Yes. Every SeedCare plan includes security policy documentation, backup verification records, compliance monitoring, and audit-ready reporting. We treat compliance as a core service obligation, not an add-on.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Compliance for Law Firms NJ",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "IT Compliance Services for Law Firms",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "IT compliance services for law firms in New Jersey — ABA tech competence, NJ ethics requirements, HIPAA overlap, security policy documentation, and audit-ready reporting.",
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
    { "@type": "ListItem", position: 3, name: "IT Compliance for Law Firms", item: "https://seedtechllc.com/it-compliance-law-firms-nj" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ITComplianceLawFirmsNJPage() {
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
            <Link href="/it-support-law-firms-new-jersey" className="hover:text-light-base/50 transition-colors">Law Firm IT</Link>
            <span>/</span>
            <span className="text-light-base/60">IT Compliance</span>
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
            <Gavel className="w-3.5 h-3.5 mr-1.5" /> Legal IT Compliance — NJ
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Compliance for Law Firms in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              The ABA, New Jersey bar, and federal regulators expect law firms to implement
              reasonable technical safeguards for client data. &quot;We have antivirus&quot; doesn&apos;t
              satisfy that standard anymore — and hasn&apos;t for years.
            </p>
            <p>
              SeedTech helps NJ law firms meet their IT compliance obligations — from ABA tech
              competence and NJ RPC 1.6 to HIPAA overlap for PI and med-mal practices. We
              implement the controls, maintain the documentation, and keep you audit-ready.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Compliance Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Compliance Obligations */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Your Obligations"
          title="What the Bar Expects from Your IT"
          description="These aren&apos;t suggestions — they&apos;re enforceable rules. Attorneys have been disciplined for inadequate IT safeguards. Here&apos;s what applies to your firm."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {obligations.map((card) => (
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

      {/* What We Do */}
      <Section>
        <SectionHeader
          eyebrow="How We Help"
          title="IT Compliance Services for Legal Practices"
          description="We don&apos;t just tell you what to fix — we implement the controls, document the policies, and maintain the records that prove compliance."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceServices.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Audit Readiness Checklist */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Audit Ready"
          title="Your Firm&apos;s Compliance Checklist"
          description="If the bar, a client, or a regulator asks about your data security — can you produce documentation for each of these items? With SeedTech, the answer is yes."
          theme="light"
        />
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight overflow-hidden">
            {auditReadiness.map((row, i) => (
              <div key={row.item} className={`flex items-center justify-between px-6 py-4 ${i < auditReadiness.length - 1 ? "border-b border-black/[0.05]" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-seed-50">
                    <ShieldCheck className="h-3.5 w-3.5 text-seed-600" />
                  </div>
                  <span className="text-body-sm text-dark-base">{row.item}</span>
                </div>
                <span className="text-xs font-medium text-seed-600 bg-seed-50 px-2.5 py-1 rounded-full">{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* HIPAA Section */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <LiquidGlassCard className="p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <IconBox icon={AlertTriangle} variant="gradient" />
              <div>
                <h2 className="font-display text-heading text-white md:text-heading-lg">
                  HIPAA Compliance for PI &amp; Med-Mal Firms
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-body leading-relaxed text-light-base/55">
              <p>
                If your firm handles personal injury, medical malpractice, or workers&apos;
                compensation cases, you likely receive protected health information (PHI) from
                medical providers — records, imaging, treatment histories, and billing data.
              </p>
              <p>
                Under HIPAA, law firms that receive PHI may qualify as <strong className="text-white">Business
                Associates</strong>, triggering specific technical requirements: encryption of PHI
                at rest and in transit, access controls, audit logging, breach notification
                procedures, and a Business Associate Agreement with each covered entity.
              </p>
              <p>
                SeedTech implements the technical controls required for HIPAA compliance and
                maintains the documentation that demonstrates your firm&apos;s compliance posture.
                We don&apos;t provide legal advice on HIPAA — but we implement the IT controls
                your compliance counsel recommends.
              </p>
            </div>
          </LiquidGlassCard>
        </div>
      </Section>

      {/* NJ Geo */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            IT Compliance for Law Firms Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            From Morris County&apos;s legal community to Somerset County, Essex County, and
            Union County — we help NJ law firms meet their IT compliance obligations.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge", "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph", "Morris County", "Somerset County", "Essex County", "Union County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.06] bg-white/60 px-4 py-1.5 text-xs font-medium text-dark-base/50">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Law Firm IT Compliance — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <CardTitle className="mb-3">{faq.q}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{faq.a}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Internal Links */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/it-support-law-firms-new-jersey" className="group rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">IT Support for Law Firms NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full managed IT overview for legal.</p>
            </Link>
            <Link href="/cybersecurity-law-firms-nj" className="group rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity for Law Firms →</h3>
              <p className="text-body-sm text-dark-base/50">Layered security for legal practices.</p>
            </Link>
            <Link href="/data-security-law-firms-nj" className="group rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Data Security for Law Firms →</h3>
              <p className="text-body-sm text-dark-base/50">Protecting privileged client data.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free Compliance Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Find out where your firm stands.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="IT Compliance for Your Law Firm"
          description="Get a free compliance assessment. We&apos;ll evaluate your firm against ABA tech competence, NJ RPC 1.6, and applicable regulations — and show you exactly what needs to change."
          primaryLabel="Free Compliance Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
