import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  Bug,
  Fingerprint,
  AlertTriangle,
  UserX,
  ServerCrash,
  FileWarning,
  WifiOff,
  Scale,
  Truck,
  Wrench,
  Stethoscope,
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
  IconBox,
  CardTitle,
  Body,
  AnimatedH1,
} from "@/components/kit";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Cybersecurity Services New Jersey | SeedTech — Business Cybersecurity for NJ",
  description:
    "SeedTech provides cybersecurity services for New Jersey businesses — SentinelOne endpoint protection, patch management, MFA, and security audits. Included in every SeedCare plan.",
  alternates: { canonical: "/cybersecurity-services-new-jersey" },
  openGraph: {
    title: "Cybersecurity Services New Jersey — SeedTech",
    description:
      "Layered cybersecurity for NJ businesses. AI-driven endpoint security, automated patching, MFA enforcement, and access controls — not just antivirus.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cybersecurity Services New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const threats = [
  {
    icon: Bug,
    title: "Ransomware is targeting SMBs",
    body: "82% of ransomware attacks target businesses with fewer than 1,000 employees. Attackers know small businesses have weaker defenses and are more likely to pay.",
  },
  {
    icon: KeyRound,
    title: "Credential theft is the #1 entry point",
    body: "Stolen or weak passwords account for over 80% of breaches. Without MFA and access controls, a single compromised password can expose your entire environment.",
  },
  {
    icon: FileWarning,
    title: "Phishing attacks are getting smarter",
    body: "AI-generated phishing emails are nearly indistinguishable from real communication. Your team is the last line of defense — and they need better tools backing them up.",
  },
  {
    icon: WifiOff,
    title: "Unpatched systems are open doors",
    body: "Most successful attacks exploit known vulnerabilities that already have patches available. If your systems aren't patched within days of release, you're exposed.",
  },
];

const stack = [
  {
    icon: ShieldCheck,
    title: "SentinelOne endpoint protection",
    body: "AI-driven threat detection on every device. SentinelOne doesn't rely on virus signatures — it uses behavioral analysis to identify and stop threats in real time, including zero-day attacks.",
  },
  {
    icon: Lock,
    title: "Automated patch management",
    body: "OS and third-party application patches deployed automatically through NinjaOne. No more waiting for someone to manually update — critical patches roll out within days of release.",
  },
  {
    icon: Fingerprint,
    title: "MFA enforcement",
    body: "Multi-factor authentication on email, VPN, cloud apps, and admin consoles. We configure and enforce MFA across your environment so a stolen password alone can't get anyone in.",
  },
  {
    icon: Eye,
    title: "Access control & permission audits",
    body: "Least-privilege access policies. We audit who has access to what, remove stale accounts, and ensure no one has more access than their role requires.",
  },
  {
    icon: UserX,
    title: "Employee offboarding security",
    body: "When someone leaves, their access is revoked immediately — email, cloud apps, VPN, shared drives, admin consoles. No orphaned accounts sitting open for months.",
  },
  {
    icon: ServerCrash,
    title: "24/7 monitoring & alerting",
    body: "NinjaOne monitors your endpoints around the clock. Suspicious activity, failed logins, disabled security tools — we get alerted immediately and respond before damage spreads.",
  },
];

const vulnerabilities = [
  "Systems running without endpoint protection (or using outdated antivirus)",
  "No MFA on email, VPN, or cloud applications",
  "Shared admin passwords across multiple staff members",
  "Former employees with active accounts and access",
  "Months of uninstalled Windows and application patches",
  "No visibility into who accessed what, when",
  "Backup systems that haven't been tested or monitored",
  "Default firewall configurations never reviewed since install",
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Attorney-client privilege demands airtight data security. Email encryption, document access controls, and compliance-ready logging.",
  },
  {
    icon: Stethoscope,
    title: "Medical & dental practices",
    body: "HIPAA requires documented security controls. Patient data, EHR systems, and connected medical devices all need protection.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Dispatch systems, fleet management, and driver data. Multi-location operations with field workers who need secure mobile access.",
  },
  {
    icon: Wrench,
    title: "Contractors & trades",
    body: "Estimating software, project management, and financial systems. Often running on a mix of office and personal devices that need unified security.",
  },
];

const antivirusComparison = [
  { antivirus: "Signature-based detection (known threats only)", seedtech: "AI behavioral analysis (detects unknown + zero-day threats)" },
  { antivirus: "Scans files on demand or on a schedule", seedtech: "Monitors processes in real time, 24/7" },
  { antivirus: "No visibility into attack chain", seedtech: "Full attack storyline — how it got in, what it touched, how it was stopped" },
  { antivirus: "Manual updates required", seedtech: "Autonomous updates, no user interaction" },
  { antivirus: "No rollback capability", seedtech: "Automated rollback to pre-attack state" },
  { antivirus: "No centralized management", seedtech: "Full fleet visibility across all devices" },
];

const faqs = [
  {
    q: "Is cybersecurity included in SeedCare plans?",
    a: "Yes. Every SeedCare tier — Essentials, Plus, and Pro — includes SentinelOne endpoint protection, automated patch management, and basic access controls. Higher tiers add network monitoring, advanced reporting, and strategic security reviews.",
  },
  {
    q: "What is SentinelOne and why do you use it?",
    a: "SentinelOne is an AI-driven endpoint detection and response (EDR) platform. Unlike traditional antivirus that relies on known virus signatures, SentinelOne uses behavioral analysis to detect and stop threats — including ransomware and zero-day attacks — in real time.",
  },
  {
    q: "Do you provide security awareness training?",
    a: "We recommend and can coordinate security awareness training through third-party platforms. Phishing simulations and training modules help your team recognize social engineering attacks before they click.",
  },
  {
    q: "How do you handle a security incident?",
    a: "We isolate the affected systems, assess the scope of the breach, contain the threat, and begin recovery. Post-incident, we perform a root cause analysis and harden the environment to prevent recurrence.",
  },
  {
    q: "Can you help us meet compliance requirements?",
    a: "We implement the technical controls required by HIPAA, legal data protection standards, and industry best practices — MFA, encryption, access logging, backup verification, and documented security policies.",
  },
  {
    q: "What if we already have antivirus software?",
    a: "Most antivirus software is signature-based and insufficient against modern threats. During our assessment, we evaluate your current tools and recommend replacements only where the gap is meaningful. SentinelOne typically replaces traditional AV entirely.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity Services New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Cybersecurity Services",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Layered cybersecurity services for New Jersey businesses including AI-driven endpoint protection, patch management, MFA enforcement, access controls, and security audits.",
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
    { "@type": "ListItem", position: 2, name: "Cybersecurity Services New Jersey", item: "https://seedtechllc.com/cybersecurity-services-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CybersecurityServicesNJPage() {
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
            <span className="text-light-base/60">Cybersecurity Services New Jersey</span>
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
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Cybersecurity — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Cybersecurity Services for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Antivirus isn&apos;t enough anymore. Modern threats — ransomware, credential theft,
              phishing, zero-day exploits — require layered defenses that detect, prevent, and
              respond in real time.
            </p>
            <p>
              SeedTech provides cybersecurity services for businesses across New Jersey. Every
              SeedCare plan includes AI-driven endpoint protection, automated patching, MFA
              enforcement, and access controls — because security shouldn&apos;t be an add-on.
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

      {/* Section 1 — Threat landscape */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Threat Landscape"
          title="Why New Jersey Businesses Are Being Targeted"
          description="Cyberattacks don't just hit Fortune 500 companies. Small and mid-sized businesses are the primary target — and most don't realize it until it's too late."
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

      {/* Section 2 — What's in the stack */}
      <Section>
        <SectionHeader
          eyebrow="Our Cybersecurity Stack"
          title="Layered Protection — Not Just a Single Product"
          description="Effective cybersecurity requires multiple layers working together. Here's what SeedTech deploys and manages for every client."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Common vulnerabilities */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Find"
          title="Vulnerabilities We Discover During Assessments"
          description="Most businesses don't know how exposed they are until someone looks. Here's what we commonly find when we assess a new client's environment."
          theme="light"
        />
        <div className="mx-auto max-w-3xl">
          <div className="space-y-3">
            {vulnerabilities.map((v) => (
              <div key={v} className="flex items-start gap-3 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-body-sm text-dark-base/70 leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Cybersecurity vs Antivirus */}
      <Section>
        <SectionHeader
          eyebrow="Know the Difference"
          title="Cybersecurity Is Not Antivirus"
          description="Traditional antivirus was built for a different era. Here's how SeedTech's security stack compares to the antivirus software most businesses are still running."
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl liquid-glass overflow-hidden">
            <div className="grid grid-cols-2 border-b border-white/[0.06] px-6 py-3">
              <p className="text-xs font-semibold text-light-base/40 uppercase tracking-wider">Traditional Antivirus</p>
              <p className="text-xs font-semibold text-seed-400 uppercase tracking-wider">SeedTech + SentinelOne</p>
            </div>
            {antivirusComparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < antivirusComparison.length - 1 ? "border-b border-white/[0.03]" : ""}`}>
                <p className="text-body-sm text-light-base/40 pr-4">{row.antivirus}</p>
                <p className="text-body-sm text-light-base/80 font-medium pr-4">{row.seedtech}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 5 — Industries */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Industries We Protect"
          title="Cybersecurity for New Jersey's Key Industries"
          description="Different industries face different compliance requirements and threat profiles. We tailor security posture to your specific regulatory and operational reality."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
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

      {/* Pricing note */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Included in Every Plan</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Cybersecurity Isn&apos;t an Add-On. It&apos;s Built In.
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            Every SeedCare plan — Essentials ($110/user/mo), Plus ($130/user/mo), and Pro ($160/user/mo) —
            includes SentinelOne endpoint protection, automated patching, and access controls.
            Security is the foundation, not a premium tier feature.
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
              Free Security Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Cybersecurity Services Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides cybersecurity services to businesses across New Jersey — from
            law offices in Morristown to logistics companies in Hopatcong. We protect your
            endpoints, your data, and your team regardless of location.
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
        <SectionHeader title="Cybersecurity — Frequently Asked Questions" align="left" />
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
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & Disaster Recovery →</h3>
              <p className="text-body-sm text-dark-base/50">Recovery readiness when the worst happens.</p>
            </Link>
            <Link href="/ransomware-response-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Ransomware Response NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Hit by ransomware? Immediate incident response.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free Security Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Find out where your environment is exposed.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Cybersecurity for New Jersey Businesses"
          description="Layered protection, not just antivirus. Start with a free security assessment and find out where your environment stands."
          primaryLabel="Free Security Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
