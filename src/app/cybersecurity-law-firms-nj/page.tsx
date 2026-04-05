import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  KeyRound,
  Bug,
  Fingerprint,
  UserX,
  ServerCrash,
  FileWarning,
  PhoneCall,
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
  title: "Cybersecurity for Law Firms NJ | SeedTech — Legal Cybersecurity Services",
  description:
    "SeedTech provides cybersecurity services for NJ law firms — SentinelOne endpoint protection, email encryption, MFA, phishing defense, and incident response. Call (914) 362-8889.",
  alternates: { canonical: "/cybersecurity-law-firms-nj" },
  openGraph: {
    title: "Cybersecurity for Law Firms in New Jersey — SeedTech",
    description:
      "Layered cybersecurity for NJ law firms. Endpoint protection, email security, access controls, and incident response built for attorney-client privilege.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cybersecurity for Law Firms NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const threats = [
  {
    icon: Bug,
    title: "Ransomware targets law firms",
    body: "Law firms are high-value ransomware targets because they hold time-sensitive, irreplaceable data. Attackers know that a firm facing a trial deadline will pay faster than anyone else.",
  },
  {
    icon: FileWarning,
    title: "Legal-targeted phishing is sophisticated",
    body: "Phishing emails impersonating courts, opposing counsel, and title companies are designed specifically for legal professionals. A single click can expose an entire matter's privileged documents.",
  },
  {
    icon: KeyRound,
    title: "Credential theft compromises privilege",
    body: "If an attorney's email password is stolen and no MFA is in place, the attacker has access to every privileged communication in that inbox — potentially waiving privilege entirely.",
  },
  {
    icon: ServerCrash,
    title: "Business email compromise hits trust accounts",
    body: "BEC attacks targeting real estate closings, settlement disbursements, and retainer payments have cost law firms millions. Wire fraud prevention requires technical controls, not just awareness.",
  },
];

const stack = [
  {
    icon: ShieldCheck,
    title: "SentinelOne endpoint protection",
    body: "AI-driven endpoint detection and response on every device in your firm. SentinelOne doesn't rely on virus signatures — it uses behavioral analysis to detect ransomware, zero-day attacks, and fileless malware in real time.",
  },
  {
    icon: Lock,
    title: "Email encryption & security",
    body: "Encrypted email for privileged communications, advanced spam filtering, attachment sandboxing, and link protection. Configured so attorneys can send sensitive documents without creating a privilege risk.",
  },
  {
    icon: Fingerprint,
    title: "Multi-factor authentication",
    body: "MFA on email, VPN, cloud applications, document management, and admin consoles. A stolen password alone can't access your firm's data — every login requires a second verification.",
  },
  {
    icon: Eye,
    title: "Access controls & monitoring",
    body: "Least-privilege access policies enforced across your firm. Who has access to which matters, which shared drives, and which applications — all documented and auditable.",
  },
  {
    icon: UserX,
    title: "Secure employee offboarding",
    body: "When someone leaves your firm, their access is revoked immediately — email, DMS, VPN, cloud apps, admin portals. No orphaned accounts. No lingering access to client files.",
  },
  {
    icon: ServerCrash,
    title: "Incident response",
    body: "If a security event occurs, we isolate the threat, assess the scope, contain the damage, and begin recovery. Post-incident, we perform root cause analysis and harden the environment to prevent recurrence.",
  },
];

const attackChain = [
  { step: "1", title: "Reconnaissance", desc: "Attackers research your firm — attorney names, practice areas, active cases, court filings. They craft targeted phishing emails using this information." },
  { step: "2", title: "Initial access", desc: "A phishing email or stolen credential gives the attacker access to one account. Without MFA, a compromised password is all they need." },
  { step: "3", title: "Lateral movement", desc: "From one account, the attacker moves through your network — accessing shared drives, email accounts, and document management systems." },
  { step: "4", title: "Data exfiltration or encryption", desc: "Client files are stolen for leverage, or the entire system is encrypted with ransomware. The firm faces a ransom demand and potential privilege waiver." },
];

const faqs = [
  {
    q: "Why are law firms targeted by cyberattacks?",
    a: "Law firms hold high-value, time-sensitive data — privileged communications, financial records, intellectual property, and PII. Attackers know firms will pay to recover this data quickly, especially near court deadlines.",
  },
  {
    q: "What is the biggest cybersecurity risk for a law firm?",
    a: "Email compromise. A stolen email password without MFA gives an attacker access to every privileged communication in that inbox. Business email compromise (BEC) is also used to redirect wire transfers from trust accounts.",
  },
  {
    q: "Is SentinelOne better than traditional antivirus for law firms?",
    a: "Yes. Traditional antivirus relies on known virus signatures. SentinelOne uses AI behavioral analysis to detect unknown threats, ransomware, and zero-day attacks — the types of threats that specifically target professional services firms.",
  },
  {
    q: "Do you provide security awareness training for attorneys and staff?",
    a: "We recommend and coordinate security awareness training through specialized platforms. This includes phishing simulations, social engineering education, and best practices for handling sensitive documents.",
  },
  {
    q: "What happens if our firm has a security incident?",
    a: "We immediately isolate affected systems, assess the scope, contain the threat, and begin recovery from backup. We then perform a root cause analysis, document the incident for any reporting requirements, and harden the environment.",
  },
  {
    q: "Is cybersecurity included in your managed IT plans?",
    a: "Yes. Every SeedCare plan includes SentinelOne endpoint protection, automated patching, MFA enforcement, and access controls. Cybersecurity is not an add-on — it's foundational to everything we do.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity for Law Firms NJ",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Cybersecurity Services for Law Firms",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Cybersecurity services for law firms in New Jersey — endpoint protection, email encryption, MFA, access controls, and incident response.",
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
    { "@type": "ListItem", position: 3, name: "Cybersecurity for Law Firms", item: "https://seedtechllc.com/cybersecurity-law-firms-nj" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CybersecurityLawFirmsNJPage() {
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
            <span className="text-light-base/60">Cybersecurity</span>
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
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Legal Cybersecurity — NJ
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Cybersecurity for Law Firms in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Law firms are the #1 professional services target for cyberattacks. You hold
              privileged communications, financial records, and litigation strategy that
              attackers can monetize through ransomware, extortion, or wire fraud.
            </p>
            <p>
              SeedTech provides cybersecurity services specifically configured for NJ law firms —
              endpoint protection, email encryption, MFA enforcement, and access controls that
              protect attorney-client privilege at the system level.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Security Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Threats */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Threat Landscape"
          title="Why Law Firms Are Prime Cyber Targets"
          description="The data you hold, the urgency of your deadlines, and the trust accounts you manage make law firms uniquely attractive to attackers."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {threats.map((card) => (
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

      {/* Attack Chain */}
      <Section>
        <SectionHeader
          eyebrow="How It Happens"
          title="Anatomy of a Law Firm Cyberattack"
          description="Understanding how attacks unfold is the first step to preventing them. Here's the typical chain."
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {attackChain.map((item) => (
            <LiquidGlassCard key={item.step} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-seed-500/20 text-seed-400 font-medium text-sm shrink-0">{item.step}</div>
                <div>
                  <CardTitle className="mb-1">{item.title}</CardTitle>
                  <Body className="text-light-base/55 leading-relaxed">{item.desc}</Body>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Security Stack */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Our Security Stack"
          title="Cybersecurity Layers for Legal Practices"
          description="Each layer addresses a different attack vector. Together, they create a defense-in-depth posture designed for the threat environment law firms face."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((card) => (
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

      {/* NJ Geo */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Protecting Law Firms Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            From Morristown&apos;s legal corridor to the professional offices in Essex County
            and Somerset County — we secure law firm infrastructure throughout the state.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge", "Hopatcong", "Parsippany", "Morris County", "Somerset County", "Essex County", "Union County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-light-base/60">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Law Firm Cybersecurity — FAQ" align="left" theme="light" />
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
            <Link href="/data-security-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Data Security for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">Protecting privileged client data.</p>
            </Link>
            <Link href="/it-compliance-law-firms-nj" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">IT Compliance for Law Firms →</h3>
              <p className="text-body-sm text-light-base/50">ABA rules and ethical obligations.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.06] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free Security Assessment →</h3>
              <p className="text-body-sm text-light-base/50">Find out where your firm is exposed.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Cybersecurity for Your Law Firm"
          description="Get a free security assessment. We'll evaluate your firm's threat exposure, review your security controls, and identify the gaps that put privileged data at risk."
          primaryLabel="Free Security Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
