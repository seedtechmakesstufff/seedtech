import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Lock,
  Eye,
  KeyRound,
  Database,
  HardDrive,
  FileCheck,
  FolderLock,
  PhoneCall,
  Scale,
  CloudOff,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  CardTitle,
  Body,
  AnimatedH1,
} from "@/components/kit";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Data Security for Law Firms NJ | SeedTech — Protect Client Files & Privilege",
  description:
    "SeedTech provides data security services for NJ law firms — encryption, access controls, backup verification, retention policies, and secure collaboration for privileged documents. Call (914) 362-8889.",
  alternates: { canonical: "/data-security-law-firms-nj" },
  openGraph: {
    title: "Data Security for Law Firms in New Jersey — SeedTech",
    description:
      "Protect privileged client data with encryption, access controls, verified backup, and retention policies designed for NJ law firms.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Data Security for Law Firms NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const risks = [
  {
    icon: FolderLock,
    title: "Case files without access controls",
    body: "When every employee can access every client&apos;s files on a shared drive, you don&apos;t have data security — you have a privilege violation waiting to happen. One disgruntled employee or one compromised account exposes everything.",
  },
  {
    icon: CloudOff,
    title: "Unverified or missing backups",
    body: "Your IT provider says backups are running, but has anyone verified a restore? If a ransomware attack encrypts your case files tomorrow, can you prove your backup works? Most firms can&apos;t.",
  },
  {
    icon: Trash2,
    title: "No data retention or disposal policy",
    body: "Closed matters sitting on shared drives indefinitely create unnecessary liability. Without retention schedules and secure disposal, you&apos;re storing data you&apos;re obligated to protect but no longer need.",
  },
  {
    icon: KeyRound,
    title: "Privileged documents sent unencrypted",
    body: "Emailing privileged documents without encryption means any intermediary server can read the contents. Opposing counsel, regulators, and ethics boards take this seriously — especially after a breach.",
  },
];

const protections = [
  {
    icon: Lock,
    title: "Encryption at rest and in transit",
    body: "AES-256 encryption on all stored data — local drives, cloud storage, and backup repositories. TLS encryption on all data in transit. Privileged documents are protected whether they&apos;re sitting on a server or moving between offices.",
  },
  {
    icon: Eye,
    title: "Role-based access controls",
    body: "Granular permissions on your document management system, shared drives, and cloud storage. Attorneys see their matters. Paralegals see their assignments. Administrative staff see what they need — nothing more.",
  },
  {
    icon: Database,
    title: "Verified backup with tested restores",
    body: "Cloud backup of all firm data with automated verification. We don&apos;t just check that backups ran — we test restores quarterly to confirm your data is actually recoverable. You get documentation proving it.",
  },
  {
    icon: FileCheck,
    title: "Data retention & secure disposal",
    body: "We help implement retention schedules aligned with your firm&apos;s policies and bar requirements. When data reaches end-of-life, we perform certified secure disposal — with documentation for your records.",
  },
  {
    icon: UserCheck,
    title: "Access logging & audit trails",
    body: "Every file access, modification, and download is logged. Who opened what client file, from which device, at what time. If you ever face a bar inquiry or client dispute about data handling, the records exist.",
  },
  {
    icon: HardDrive,
    title: "Secure offboarding & device wipe",
    body: "When an attorney or staff member leaves, their access is revoked immediately and their devices are securely wiped. No orphaned accounts, no data walking out the door on a personal laptop.",
  },
];

const dataTypes = [
  { name: "Privileged communications", desc: "Attorney-client emails, work product, and legal strategy documents protected by encryption and access controls at the system level." },
  { name: "Discovery & litigation files", desc: "ESI, deposition transcripts, and evidence files stored with matter-level permissions and full audit trails for chain of custody documentation." },
  { name: "Financial & trust account records", desc: "Billing records, retainer agreements, and IOLTA trust account data protected with restricted access and tamper-evident logging." },
  { name: "Client PII & sensitive data", desc: "Social Security numbers, medical records, financial statements, and other personally identifiable information encrypted and access-restricted per bar requirements." },
];

const comparisonRows = [
  { feature: "File encryption at rest", generic: "Sometimes — depends on platform", seedtech: "AES-256 on all stored data" },
  { feature: "Access controls by matter", generic: "Basic folder permissions", seedtech: "Role-based, matter-level controls" },
  { feature: "Backup verification", generic: "Checks backup job ran", seedtech: "Quarterly tested restores with documentation" },
  { feature: "Data retention policies", generic: "Not typically managed", seedtech: "Configured to firm policy & bar rules" },
  { feature: "Secure disposal", generic: "Delete files from recycle bin", seedtech: "Certified wipe with destruction records" },
  { feature: "Access audit trail", generic: "Limited or no logging", seedtech: "Full file access logging per user/device" },
];

const faqs = [
  {
    q: "What does data security mean for a law firm?",
    a: "Data security for law firms means protecting client files, privileged communications, and financial records from unauthorized access, loss, and theft. It includes encryption, access controls, backup, retention policies, and secure disposal — configured to meet ethical obligations under ABA Model Rules 1.1 and 1.6.",
  },
  {
    q: "How do you protect privileged documents?",
    a: "We encrypt privileged documents at rest and in transit, enforce role-based access controls on your document management system, configure email encryption for sensitive communications, and maintain audit trails that document who accessed what and when.",
  },
  {
    q: "Do you provide backup for law firm data?",
    a: "Yes. We provide cloud backup with automated daily backups and quarterly tested restores. We verify that your data is actually recoverable — not just that a backup job completed. You receive documentation proving your backup integrity.",
  },
  {
    q: "How do access controls work for case files?",
    a: "We configure your document management system and file storage with matter-level permissions. Each attorney sees their assigned matters. Support staff see only what they need for their role. We also implement ethical walls when required for conflict situations.",
  },
  {
    q: "What happens to data when an employee leaves?",
    a: "We immediately revoke all system access — email, DMS, VPN, cloud applications, and admin portals. Firm devices are securely wiped. Any data on personal devices is removed via MDM. The entire process is documented for your records.",
  },
  {
    q: "Can you help with data retention policies?",
    a: "We help implement technical retention schedules aligned with your firm&apos;s policies and bar requirements. When closed matters reach their retention deadline, we perform secure disposal with certified destruction records.",
  },
  {
    q: "Is data security included in your managed IT plans?",
    a: "Yes. Encryption, access controls, backup, and audit logging are included in every SeedCare plan. Data security is foundational to our approach — not an add-on or upsell.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Data Security for Law Firms NJ",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Data Security Services for Law Firms",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Data security services for law firms in New Jersey — encryption, access controls, verified backup, retention policies, and secure disposal for privileged client data.",
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
    { "@type": "ListItem", position: 3, name: "Data Security for Law Firms", item: "https://seedtechllc.com/data-security-law-firms-nj" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function DataSecurityLawFirmsNJPage() {
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
            <span className="text-light-base/60">Data Security</span>
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
            <Database className="w-3.5 h-3.5 mr-1.5" /> Legal Data Security — NJ
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Data Security for Law Firms in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your firm&apos;s data isn&apos;t just files — it&apos;s privileged communications,
              litigation strategy, financial records, and client PII. A single unauthorized
              access event can waive privilege, trigger bar complaints, and destroy client trust.
            </p>
            <p>
              SeedTech provides data security services for NJ law firms — encryption, access
              controls, verified backup, retention policies, and secure disposal. Every protection
              configured for the ethical and regulatory obligations law firms actually face.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Data Security Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Data Risks */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Risk"
          title="Where Law Firm Data Is Most Exposed"
          description="Most data breaches at law firms aren&apos;t sophisticated hacks — they&apos;re the result of poor access controls, unverified backups, and unencrypted communications."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {risks.map((card) => (
            <div key={card.title} className="rounded-2xl border border-red-100 bg-red-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <card.icon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* What We Protect */}
      <Section>
        <SectionHeader
          eyebrow="What We Protect"
          title="Data Types Law Firms Must Secure"
          description="Every category of data your firm handles carries ethical and regulatory obligations. Here&apos;s what we protect and how."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataTypes.map((item) => (
            <LiquidGlassCard key={item.name} className="p-7">
              <CardTitle className="mb-2">{item.name}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{item.desc}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Data Protection Stack */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Our Approach"
          title="Data Security Controls for Legal Practices"
          description="Six layers of data protection — from encryption and access controls to backup verification and secure disposal. Each one addresses a specific obligation law firms face."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {protections.map((card) => (
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

      {/* Comparison Table */}
      <Section>
        <SectionHeader
          eyebrow="The Difference"
          title="Generic IT vs. SeedTech Data Security"
          description="Most MSPs treat data security as an afterthought. We treat it as a core obligation for every law firm we support."
        />
        <div className="mx-auto max-w-3xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-6 font-display text-card-title text-white">Capability</th>
                <th className="py-3 pr-6 font-display text-card-title text-white/40">Generic MSP</th>
                <th className="py-3 font-display text-card-title text-seed-400">SeedTech</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <td className="py-3 pr-6 text-white/70">{row.feature}</td>
                  <td className="py-3 pr-6 text-white/30">{row.generic}</td>
                  <td className="py-3 text-seed-300">{row.seedtech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Ethical Obligation */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-seed-100 bg-seed-50/30 p-8 md:p-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-100">
              <Scale className="h-5 w-5 text-seed-600" />
            </div>
            <h2 className="mb-4 font-display text-heading text-dark-base md:text-heading-lg">
              Your Ethical Obligation to Protect Client Data
            </h2>
            <div className="space-y-4 text-body leading-relaxed text-dark-base/60">
              <p>
                <strong className="text-dark-base">ABA Model Rule 1.6(c)</strong> requires lawyers
                to &quot;make reasonable efforts to prevent the inadvertent or unauthorized disclosure of,
                or unauthorized access to, information relating to the representation of a client.&quot;
              </p>
              <p>
                <strong className="text-dark-base">Comment [18] to Rule 1.6</strong> clarifies that
                &quot;reasonable efforts&quot; depends on the sensitivity of the information, the likelihood
                of disclosure, the cost of safeguards, and the difficulty of implementation.
              </p>
              <p>
                Translation: you need encryption, access controls, backup, and documented security policies.
                The bar doesn&apos;t expect perfection — but it expects demonstrable, reasonable effort.
                That&apos;s exactly what we provide.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* NJ Geo */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Protecting Law Firm Data Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            From Morristown&apos;s legal district to Morris County, Somerset County, and
            Essex County — we secure privileged data for law firms throughout the state.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge", "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph", "Morris County", "Somerset County", "Essex County", "Union County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-light-base/60">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Law Firm Data Security — FAQ" align="left" theme="light" />
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
            <Link href="/it-support-law-firms-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">IT Support for Law Firms NJ →</h3>
              <p className="text-body-sm text-light-base/50">Full managed IT overview for legal.</p>
            </Link>
            <Link href="/cybersecurity-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cybersecurity for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">Layered security for legal practices.</p>
            </Link>
            <Link href="/it-compliance-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">IT Compliance for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">ABA rules, ethical obligations, audit readiness.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free Data Security Assessment →</h3>
              <p className="text-body-sm text-light-base/50">Find out where your firm&apos;s data is exposed.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Protect Your Firm&apos;s Client Data"
          description="Get a free data security assessment. We&apos;ll evaluate your encryption, access controls, backup integrity, and retention policies — and show you exactly where privileged data is at risk."
          primaryLabel="Free Data Security Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
