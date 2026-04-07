import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ServerCrash,
  PhoneCall,
  DollarSign,
  Clock,
  ShieldAlert,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Users,
  Wrench,
  Eye,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TrustedBySection } from "@/components/home/TrustedBySection";
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
  title: "Server Down at Your Business? Get Help Now | SeedTech",
  description:
    "Business server down? Check server status, diagnose the problem, and get emergency support. SeedTech resolves server outages fast. Call (914) 362-8889.",
  alternates: { canonical: "/server-down-business" },
  openGraph: {
    title: "Server Down at Your Business? — SeedTech",
    description:
      "Your company server is down and your team can't work. Here's how to check server status, common causes, and how to get immediate help.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Server Down Business — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const serverDownSigns = [
  {
    icon: Users,
    title: "Employees can't access files or apps",
    body: "Shared drives are unreachable, line-of-business applications won't load, and your team is sitting idle waiting for someone to fix it.",
  },
  {
    icon: DollarSign,
    title: "Revenue is stalling by the hour",
    body: "Orders can't be processed, invoices can't be sent, and customers are getting voicemail. Every hour of downtime costs real money.",
  },
  {
    icon: ShieldAlert,
    title: "You're not sure if it's a breach",
    body: "The server went down without warning. You don't know if it's hardware, software, or something malicious — and neither does anyone on your team.",
  },
  {
    icon: Clock,
    title: "Your IT provider isn't responding",
    body: "You've called, emailed, and submitted a ticket. Still no response. Meanwhile, your entire business is at a standstill.",
  },
  {
    icon: HardDrive,
    title: "The server keeps crashing repeatedly",
    body: "It comes back for a few minutes, then goes down again. Rebooting isn't fixing it — something deeper is wrong.",
  },
  {
    icon: AlertTriangle,
    title: "Backups haven't been verified",
    body: "You think you have backups — but you're not sure when they last ran, or if they'd actually restore. The uncertainty is worse than the outage.",
  },
];

const downtimeCosts = [
  { stat: "$5,600", label: "Average cost per minute of IT downtime", source: "Gartner" },
  { stat: "98 min", label: "Average server outage duration for SMBs", source: "ITIC" },
  { stat: "40%", label: "Of businesses never reopen after major data loss", source: "FEMA" },
  { stat: "$137K", label: "Average cost of a single server outage for SMBs", source: "Aberdeen" },
];

const diagnosticSteps = [
  { step: "01", title: "Check if it's isolated", body: "Can other devices reach the internet? If your workstations are online but the server isn't, the problem is likely the server itself — not your network or ISP." },
  { step: "02", title: "Look at the physical server", body: "Is it powered on? Are there blinking error lights? Is the screen showing a blue screen, error message, or completely blank? Note what you see." },
  { step: "03", title: "Don't reboot until you know the cause", body: "If the issue is ransomware or disk failure, a reboot can make things significantly worse. Leave the server in its current state until a technician assesses it." },
  { step: "04", title: "Call for professional help", body: "If you have a managed IT provider, call them immediately. If they're not responding — or you don't have one — call SeedTech at (914) 362-8889. We take emergency calls from non-clients." },
];

const preventionItems = [
  {
    icon: Eye,
    title: "24/7 server monitoring",
    body: "NinjaOne monitors CPU, memory, disk health, and services around the clock. Issues get flagged before they cause outages — not after.",
  },
  {
    icon: HardDrive,
    title: "Verified backup monitoring",
    body: "Backups are worthless if they're failing silently. SeedCare plans include daily backup verification so recovery is always an option.",
  },
  {
    icon: Wrench,
    title: "Automated patching & maintenance",
    body: "Unpatched servers are the #1 cause of preventable outages. We handle OS updates, firmware patches, and reboots on a managed schedule.",
  },
];

const faqs = [
  {
    q: "How do I check if my business server is down?",
    a: "Try to access shared files, internal applications, or Remote Desktop. If multiple employees can't connect but the internet works on their individual machines, the server is likely down. Check physical indicators — power lights, error messages on the console, and network cable connections.",
  },
  {
    q: "What causes a business server to go down?",
    a: "The most common causes are hardware failure (failed drives, power supplies, or memory), ransomware or malware attacks, unclean shutdowns from power events, resource exhaustion (full disk or maxed RAM), and bad updates or configuration changes. Servers older than 5 years are at significantly higher risk.",
  },
  {
    q: "How much does server downtime cost a business?",
    a: "According to Gartner, the average cost of IT downtime is $5,600 per minute. For small and mid-sized businesses, a single server outage can cost $10,000 to $50,000+ depending on duration, data loss, and recovery complexity. The indirect costs — lost customers, damaged reputation, missed deadlines — are often higher.",
  },
  {
    q: "Should I restart my server if it's down?",
    a: "Not immediately. If the cause is ransomware, a reboot can trigger further encryption. If a disk is failing, restarting can cause additional data loss. The safest approach is to leave the server in its current state, document any error messages you see, and contact a qualified IT provider before taking action.",
  },
  {
    q: "Can SeedTech help if we're not a current client?",
    a: "Yes. We accept emergency calls from non-clients. If your business server is down and your current IT provider isn't responding, call (914) 362-8889. We'll triage the situation immediately and begin remote diagnostics or dispatch on-site support.",
  },
  {
    q: "How do I prevent my business server from going down?",
    a: "Proactive monitoring is the single most effective prevention measure. SeedCare plans include 24/7 server monitoring, automated patching, backup verification, and hardware health alerts — all designed to catch and resolve issues before they cause outages. Plans start at $110/user/month with no contracts.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Business Server Down Support",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Emergency Server Support",
  areaServed: [
    { "@type": "State", name: "New Jersey" },
    { "@type": "City", name: "New York City" },
  ],
  description:
    "Emergency support for businesses experiencing server outages. Remote diagnostics, on-site response, server status monitoring, and recovery services.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Server Down Business", item: "https://seedtechllc.com/server-down-business" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ServerDownBusinessPage() {
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
            <span className="text-light-base/60">Server Down — Business</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-25" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <ServerCrash className="w-3.5 h-3.5 mr-1.5" />
            Server Down
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Business Server Down? Here&apos;s How to Get Back Online.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your company server is down and your entire team is stuck. No files, no applications,
              no email. Revenue is bleeding by the minute — and you need someone who can
              actually fix it, not put you in a ticket queue.
            </p>
            <p>
              SeedTech provides emergency server support for businesses across New Jersey
              and New York City. We diagnose fast, fix the root cause, and get your
              operations running again.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              <PhoneCall className="h-4 w-4" />
              Call Now: (914) 362-8889
            </a>
            <Link
              href="/emergency-it-support-new-jersey"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Emergency IT Support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted by Brands */}
      <TrustedBySection />

      {/* Section 1 — What this looks like */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="When Your Business Server Goes Down, Everything Stops"
          description="These aren't minor IT issues — they're operational emergencies that cost you money, customers, and credibility every minute they continue."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serverDownSigns.map((card) => (
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

      {/* Section 2 — Downtime cost stats */}
      <Section>
        <SectionHeader
          eyebrow="The Real Cost"
          title="Server Downtime Costs More Than You Think"
          description="Most business owners underestimate how much a server outage actually costs. Here's what the data says."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {downtimeCosts.map((item) => (
            <LiquidGlassCard key={item.label} className="p-6 text-center">
              <TrendingDown className="h-5 w-5 text-red-400 mx-auto mb-3" />
              <div className="font-display text-heading text-white mb-2">{item.stat}</div>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{item.label}</p>
              <p className="text-[0.65rem] text-light-base/25 mt-2">Source: {item.source}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Diagnostic steps */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Check Server Status"
          title="How to Diagnose a Business Server Outage"
          description="Before calling anyone, these steps will help you understand the scope of the problem — and avoid making it worse."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {diagnosticSteps.map((s) => (
            <div key={s.step} className="flex gap-5 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-seed-50 text-seed-600 font-display font-bold text-lg">
                {s.step}
              </div>
              <div>
                <h3 className="font-display text-card-title text-dark-base mb-1">{s.title}</h3>
                <p className="text-body-sm leading-relaxed text-dark-base/60">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4 — Prevention */}
      <Section>
        <SectionHeader
          eyebrow="Stop It Before It Starts"
          title="How to Prevent Your Business Server From Going Down"
          description="Most server outages are preventable with proper monitoring and maintenance. Here's what proactive IT looks like."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {preventionItems.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/services/managed-it"
            className="inline-flex items-center gap-2 text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors"
          >
            Learn about SeedCare plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Server Down — Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/server-down-help" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down Help →</h3>
              <p className="text-body-sm text-light-base/50">Step-by-step guide for when your server goes down.</p>
            </Link>
            <Link href="/network-down-business" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Network Down? →</h3>
              <p className="text-body-sm text-light-base/50">Troubleshoot network connectivity problems.</p>
            </Link>
            <Link href="/company-server-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Company Server Down →</h3>
              <p className="text-body-sm text-light-base/50">Emergency response when your company server fails.</p>
            </Link>
            <Link href="/business-email-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Business Email Down →</h3>
              <p className="text-body-sm text-light-base/50">Fix email outages affecting your entire company.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Immediate emergency IT response across NJ.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Backup & DR NJ →</h3>
              <p className="text-body-sm text-light-base/50">Recover data after a server outage.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Server Down? Don't Wait for a Callback."
          description="SeedTech provides emergency server support for businesses. We triage immediately and get your team back to work — even if you're not a client."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Emergency IT Support"
          secondaryHref="/emergency-it-support-new-jersey"
        />
      </Section>
    </div>
  );
}
