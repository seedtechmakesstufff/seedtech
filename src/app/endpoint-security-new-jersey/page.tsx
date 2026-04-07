import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Laptop,
  Smartphone,
  Server,
  Eye,
  Lock,
  Undo2,
  Activity,
  Bug,
  Cpu,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Stethoscope,
  Truck,
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
  title: "Endpoint Security New Jersey | SeedTech — Endpoint Protection for NJ Businesses",
  description:
    "SeedTech delivers endpoint security for New Jersey businesses — SentinelOne AI-driven endpoint protection on every device, automated response, and 24/7 monitoring. Included in every plan.",
  alternates: { canonical: "/endpoint-security-new-jersey" },
  openGraph: {
    title: "Endpoint Security New Jersey — SeedTech",
    description:
      "AI-powered endpoint protection for NJ businesses. SentinelOne on every device — laptops, desktops, servers. Real-time detection, automated rollback, zero-day defense.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Endpoint Security New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const endpointRisks = [
  {
    icon: Laptop,
    title: "Every laptop is an attack surface",
    body: "A single unprotected laptop connected to your network is all an attacker needs. Endpoint security ensures every device is monitored, hardened, and capable of stopping threats autonomously.",
  },
  {
    icon: Smartphone,
    title: "Remote and hybrid workers multiply your risk",
    body: "Employees working from home, coffee shops, and client sites are outside your firewall. Endpoint protection follows the device — not the network perimeter.",
  },
  {
    icon: Bug,
    title: "Ransomware targets endpoints first",
    body: "Over 80% of ransomware enters through a compromised endpoint — a phishing click, a malicious download, an unpatched application. If the endpoint isn't protected, nothing else matters.",
  },
  {
    icon: Cpu,
    title: "Traditional antivirus misses modern threats",
    body: "Signature-based antivirus only detects known malware. Zero-day exploits, fileless attacks, and AI-generated threats pass right through. Endpoint detection and response (EDR) uses behavioral analysis to catch what signatures miss.",
  },
];

const capabilities = [
  {
    icon: ShieldCheck,
    title: "SentinelOne on every device",
    body: "AI-driven endpoint detection and response deployed across your entire fleet — laptops, desktops, and servers. SentinelOne monitors processes in real time and stops threats autonomously, including zero-day attacks.",
  },
  {
    icon: Eye,
    title: "Real-time behavioral monitoring",
    body: "Instead of scanning for known virus signatures, SentinelOne watches how programs behave. Suspicious process chains, lateral movement attempts, and privilege escalation trigger immediate containment.",
  },
  {
    icon: Undo2,
    title: "Automated rollback and remediation",
    body: "If a threat does execute, SentinelOne can automatically roll back the affected device to its pre-attack state. Files restored, changes reversed, no manual rebuild required.",
  },
  {
    icon: Activity,
    title: "Full attack storyline visibility",
    body: "Every detected threat includes a complete timeline — how it entered, what processes it spawned, what files it touched, and how it was stopped. Full forensic context, not just an alert.",
  },
  {
    icon: Lock,
    title: "Device isolation and containment",
    body: "When a compromised endpoint is detected, it's immediately isolated from your network while remaining manageable. The threat is contained before it can spread to other devices.",
  },
  {
    icon: Server,
    title: "Centralized fleet management",
    body: "Every endpoint visible in a single dashboard. Patch status, protection status, threat history, and device health — across every machine in your environment, regardless of location.",
  },
];

const comparison = [
  { legacy: "Scans files for known virus signatures", edr: "Monitors process behavior in real time" },
  { legacy: "Detects known malware only", edr: "Detects unknown, zero-day, and fileless threats" },
  { legacy: "No response capability — alerts only", edr: "Autonomous containment and kill" },
  { legacy: "No rollback if files are encrypted", edr: "Automated rollback to pre-attack state" },
  { legacy: "Manual updates and scans required", edr: "Continuously updated, always active" },
  { legacy: "No visibility into attack chain", edr: "Full attack storyline with forensic detail" },
  { legacy: "Per-device management", edr: "Centralized fleet-wide management" },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Client privilege demands that every device accessing case files is monitored and protected. One compromised laptop can mean a reportable breach.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare practices",
    body: "HIPAA requires documented endpoint protection on every device that touches patient data. SentinelOne provides the audit trail regulators expect.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Dispatch workstations, driver tablets, and warehouse terminals all need protection. Multi-site operations need centralized visibility across every endpoint.",
  },
  {
    icon: Wrench,
    title: "Contractors & trades",
    body: "Field workers using personal devices, job-site laptops, and shared workstations. Endpoint security protects the business even when the hardware moves.",
  },
];

const faqs = [
  {
    q: "What is endpoint security and why do I need it?",
    a: "Endpoint security protects every device (laptop, desktop, server, tablet) that connects to your network. Modern threats target endpoints directly — through phishing, malicious downloads, and exploits. Without endpoint protection, a single compromised device can give attackers access to your entire environment.",
  },
  {
    q: "How is endpoint security different from antivirus?",
    a: "Traditional antivirus relies on signature databases of known malware. Endpoint detection and response (EDR) like SentinelOne uses AI-driven behavioral analysis to detect unknown threats, fileless attacks, and zero-day exploits. EDR also provides automated response, rollback, and forensic visibility that antivirus can't match.",
  },
  {
    q: "Is SentinelOne included in SeedCare plans?",
    a: "Yes. Every SeedCare tier — Essentials ($110/user/mo), Plus ($130/user/mo), and Pro ($160/user/mo) — includes SentinelOne endpoint protection on every device. It's not an add-on or premium feature.",
  },
  {
    q: "What happens if ransomware gets past the endpoint protection?",
    a: "SentinelOne includes automated rollback capability. If ransomware executes and encrypts files, the agent can reverse the changes and restore the device to its pre-attack state — without needing to restore from backup.",
  },
  {
    q: "Do you protect servers as well as workstations?",
    a: "Yes. SentinelOne is deployed on servers, workstations, and laptops. Server endpoints often hold the most critical data and are common targets for lateral movement once an attacker gains initial access through a workstation.",
  },
  {
    q: "How do you manage endpoint security for remote employees?",
    a: "SentinelOne protects the device regardless of network location. Whether your employee is in the office, at home, or at a client site, the endpoint agent is active and reporting to our centralized console. No VPN dependency required.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Endpoint Security New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Endpoint Security",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "AI-driven endpoint security for New Jersey businesses — SentinelOne endpoint protection, real-time behavioral monitoring, automated rollback, and centralized device management.",
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
    { "@type": "ListItem", position: 2, name: "Endpoint Security New Jersey", item: "https://seedtechllc.com/endpoint-security-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function EndpointSecurityNJPage() {
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
            <span className="text-light-base/60">Endpoint Security New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="blue" className="mb-6">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> Endpoint Security — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Endpoint Security for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your firewall protects the perimeter. But the perimeter doesn&apos;t exist
              anymore — your employees work from everywhere, on every kind of device.
              Endpoint security is the layer that actually follows your data.
            </p>
            <p>
              SeedTech deploys SentinelOne AI-driven endpoint protection on every device in
              your environment — laptops, desktops, and servers. Real-time behavioral
              detection, automated response, and full forensic visibility. Included in every
              SeedCare plan.
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

      {/* Section 1 — Why endpoints matter */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Endpoint Problem"
          title="Your Devices Are the Frontline"
          description="Firewalls protect your office. Endpoint security protects every device your team actually uses — wherever they use it."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {endpointRisks.map((card) => (
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

      {/* Section 2 — What SeedTech deploys */}
      <Section>
        <SectionHeader
          eyebrow="Our Endpoint Security Stack"
          title="SentinelOne — Deployed and Managed by SeedTech"
          description="We don't just install an agent and walk away. SeedTech deploys, configures, monitors, and responds — so every endpoint in your environment is actively defended."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — EDR vs Legacy AV comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Know the Difference"
          title="Legacy Antivirus vs. Endpoint Detection & Response"
          description="If your business is still running traditional antivirus, here's what you're missing. EDR isn't just better detection — it's a completely different approach to endpoint security."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Legacy Antivirus</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech + SentinelOne EDR</p>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < comparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.legacy}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.edr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Protect"
          title="Endpoint Security for Every NJ Industry"
          description="Different industries have different devices, compliance requirements, and threat profiles. We tailor endpoint policy to your operational reality."
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

      {/* Pricing note */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Included in Every Plan</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Endpoint Protection Isn&apos;t a Premium Add-On
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            Every SeedCare plan — Essentials ($110/user/mo), Plus ($130/user/mo), and Pro ($160/user/mo) —
            includes SentinelOne endpoint protection on every device. Real security starts at the endpoint,
            so we include it from day one.
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
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white px-8 py-3.5 text-sm font-medium text-dark-base hover:bg-gray-50 transition-all duration-200"
            >
              Free Security Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Endpoint Security Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedTech provides endpoint security to businesses across New Jersey — from
            law offices in Morristown to logistics companies in Parsippany. Every device
            protected, every location covered.
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
        <SectionHeader title="Endpoint Security — Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Full-stack cybersecurity for NJ businesses.</p>
            </Link>
            <Link href="/ransomware-response-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Ransomware Response NJ →</h3>
              <p className="text-body-sm text-light-base/50">Immediate incident response for ransomware attacks.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Proactive IT management with flat-rate pricing.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free Security Assessment →</h3>
              <p className="text-body-sm text-light-base/50">Find out if your endpoints are actually protected.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Endpoint Security for New Jersey Businesses"
          description="SentinelOne on every device. Real-time detection, automated response, full visibility. Start with a free assessment."
          primaryLabel="Free Security Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
