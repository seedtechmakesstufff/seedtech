import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Ban,
  Lock,
  Eye,
  Server,
  ShieldCheck,
  FileWarning,
  Siren,
  WifiOff,
  ShieldPlus,
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
  title: "Ransomware Response New Jersey | SeedTech — Ransomware Recovery & Prevention for NJ Businesses",
  description:
    "Hit by ransomware in New Jersey? Don't pay the ransom. SeedTech provides ransomware response, recovery from backup, and prevention with SentinelOne endpoint security. Call (914) 362-8889.",
  alternates: { canonical: "/ransomware-response-new-jersey" },
  openGraph: {
    title: "Ransomware Response New Jersey — SeedTech",
    description:
      "Emergency ransomware response for NJ businesses. Containment, recovery from backup, and SentinelOne-powered prevention. Don't pay — call (914) 362-8889.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ransomware Response New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const immediateSteps = [
  { step: "1", icon: WifiOff, title: "Disconnect the infected machine from the network", body: "Pull the Ethernet cable. Turn off Wi-Fi. Don't shut the machine down — just isolate it. Ransomware spreads laterally, and every second it's connected it can encrypt more machines." },
  { step: "2", icon: Ban, title: "Do NOT pay the ransom", body: "Paying doesn't guarantee you'll get your files back. It funds the next attack. It marks you as a willing payer. And in some cases, it may violate federal sanctions. There are better options." },
  { step: "3", icon: Eye, title: "Document everything you see", body: "Take photos of ransom notes, file extensions, error messages. Note what time people first noticed the issue. This information is critical for response and potential law enforcement reporting." },
  { step: "4", icon: PhoneCall, title: "Call your IT provider immediately", body: "If you have a managed IT provider, call them now. If you don't — or they're not responding — call SeedTech at (914) 362-8889. We handle ransomware emergencies for non-clients." },
];

const recoveryPath = [
  {
    icon: Siren,
    title: "Containment",
    body: "Isolate affected machines, identify the ransomware variant, and determine the blast radius. Which systems are encrypted? Which are clean? Are backups intact?",
  },
  {
    icon: Server,
    title: "Backup assessment",
    body: "Check backup integrity. If you have monitored, cloud-based backups (like those in SeedCare plans), we can identify the last clean restore point and begin recovery.",
  },
  {
    icon: ShieldCheck,
    title: "Clean recovery",
    body: "Wipe infected machines, restore from clean backup, verify file integrity, and bring systems back online in a controlled sequence. No ransom payment necessary.",
  },
  {
    icon: ShieldPlus,
    title: "Hardening",
    body: "After recovery, we close the vector that allowed the attack — whether it was a phishing email, unpatched vulnerability, or compromised credential. Then we deploy SentinelOne and proper monitoring.",
  },
];

const preventionStack = [
  { icon: ShieldAlert, title: "SentinelOne endpoint security", body: "AI-powered endpoint detection and response (EDR) that catches ransomware before it executes. Not signature-based antivirus — behavioral detection that stops zero-day attacks." },
  { icon: Lock, title: "MFA on everything", body: "Multi-factor authentication on email, VPN, admin accounts, and cloud services. Most ransomware attacks start with a compromised password. MFA stops that chain." },
  { icon: FileWarning, title: "Email filtering & anti-phishing", body: "Advanced email filtering catches malicious attachments and links before they reach inboxes. Combined with security awareness, this blocks the most common ransomware delivery method." },
  { icon: Eye, title: "24/7 monitoring", body: "Real-time monitoring through NinjaOne catches suspicious activity — unusual file modifications, unexpected encryption processes, lateral movement — and alerts us immediately." },
  { icon: Server, title: "Isolated cloud backups", body: "Cloud backups are air-gapped from your production environment. Ransomware can't encrypt what it can't reach. We monitor backup health daily to ensure recovery is always possible." },
  { icon: ShieldCheck, title: "Patch management", body: "Automated patching closes the vulnerabilities that ransomware exploits. Unpatched systems are the second most common entry point after phishing." },
];

const faqs = [
  {
    q: "Should I pay the ransom?",
    a: "No. Paying doesn't guarantee recovery — some groups take payment and never provide decryption keys. It funds criminal operations and can violate OFAC sanctions. If you have clean backups, recovery is possible without paying. If you don't, contact us immediately to assess options.",
  },
  {
    q: "Can you recover our files without paying?",
    a: "In most cases, yes — if you have monitored backups. SeedCare plans include cloud backup that's isolated from your production environment, so ransomware can't encrypt it. We restore from the last clean backup point. Without backups, options are more limited but we can still assess the situation.",
  },
  {
    q: "How did we get infected?",
    a: "The most common vectors are phishing emails (a malicious attachment or link), compromised credentials (weak or reused passwords without MFA), and unpatched vulnerabilities. We determine the specific vector during response so we can close it.",
  },
  {
    q: "Do we need to report this to law enforcement?",
    a: "It depends on your industry and the data involved. Healthcare organizations (HIPAA), financial services, and businesses that handle personal data may have mandatory reporting requirements. We can advise on reporting obligations during the response.",
  },
  {
    q: "How long does recovery take?",
    a: "A single machine can often be restored in hours. A full environment recovery depends on the scope — number of machines, data volume, and whether infrastructure needs rebuilding. We define recovery timelines during the containment phase.",
  },
  {
    q: "How do we prevent this from happening again?",
    a: "SentinelOne endpoint security, MFA on all accounts, email filtering, automated patching, and monitored backups. All of this is included in SeedCare plans. The goal is to make ransomware unable to execute, and if it somehow does, to recover without paying.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ransomware Response New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Ransomware Response and Recovery",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Emergency ransomware response and recovery for New Jersey businesses — containment, backup-based recovery, and SentinelOne-powered prevention.",
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
    { "@type": "ListItem", position: 2, name: "Ransomware Response New Jersey", item: "https://seedtechllc.com/ransomware-response-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function RansomwareResponseNJPage() {
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
            <span className="text-light-base/60">Ransomware Response New Jersey</span>
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
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Ransomware Emergency
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Ransomware Hit Your New Jersey Business? Don&apos;t Pay.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your files are encrypted. There&apos;s a ransom note on every desktop. Your team
              is panicking. Take a breath — there&apos;s a path forward that doesn&apos;t
              involve paying criminals.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              <PhoneCall className="h-4 w-4" /> Call Now: (914) 362-8889
            </a>
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Free Security Assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 — What to do right now */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Right Now"
          title="What to Do If You've Been Hit by Ransomware"
          description="These four steps should happen in the first 15 minutes. The order matters."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {immediateSteps.map((step) => (
            <div key={step.step} className="flex gap-5 rounded-2xl border border-red-100 bg-red-50/30 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-display font-bold text-lg">
                {step.step}
              </div>
              <div>
                <h3 className="font-display text-card-title text-dark-base mb-1">{step.title}</h3>
                <p className="text-body-sm leading-relaxed text-dark-base/60">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Recovery path */}
      <Section>
        <SectionHeader
          eyebrow="Recovery"
          title="How SeedTech Handles Ransomware Recovery"
          description="Containment → Assessment → Recovery → Hardening. We follow a structured process to get you back online without paying."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recoveryPath.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Should you pay? */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <Ban className="w-3.5 h-3.5 mr-1.5" /> Don&apos;t Pay
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Should You Pay the Ransom?
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60 text-left">
            <p>
              <strong className="text-dark-base">No.</strong> Here&apos;s why:
            </p>
            <ul className="space-y-3 pl-1">
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-dark-base">No guarantee of recovery.</strong> Some groups take payment and never deliver decryption keys. Others deliver keys that only partially work.</span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-dark-base">You become a repeat target.</strong> Paying marks your business as willing to pay. Many victims are attacked again within 12 months.</span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-dark-base">It may be illegal.</strong> OFAC sanctions prohibit payments to certain threat actors. You could face legal penalties for paying.</span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-dark-base">It funds the next attack.</strong> Ransom payments directly fund criminal infrastructure and future attacks on other businesses.</span>
              </li>
            </ul>
            <p>
              The real answer is clean backups. If your data is backed up, monitored, and
              recoverable — you don&apos;t need to negotiate with criminals.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 4 — Prevention */}
      <Section>
        <SectionHeader
          eyebrow="Prevention"
          title="How to Prevent Ransomware Attacks"
          description="The best ransomware response is making sure it never executes. Here's what SeedCare clients have in place."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preventionStack.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Ransomware Response Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech responds to ransomware incidents across New Jersey. Remote response begins
            immediately. On-site support available for critical situations throughout northern
            and central NJ.
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
        <SectionHeader title="Ransomware — Frequently Asked Questions" align="left" />
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
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Immediate response for any IT emergency.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full security stack to prevent attacks.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & DR NJ →</h3>
              <p className="text-body-sm text-dark-base/50">The backup that makes paying unnecessary.</p>
            </Link>
            <Link href="/server-down-help" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Server Down Help →</h3>
              <p className="text-body-sm text-dark-base/50">Step-by-step when your server is down.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ransomware Emergency? Call Now."
          description="Don't pay the ransom. Don't restart the server. Call SeedTech — we'll help you contain the attack and begin recovery."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Free Security Assessment"
          secondaryHref="/services/managed-it/assessment"
        />
      </Section>
    </div>
  );
}
