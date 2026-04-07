import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ServerCrash,
  PhoneCall,
  AlertTriangle,
  Clock,
  HardDrive,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Users,
  Eye,
  Wrench,
  Activity,
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
  title: "Company Server Down? Emergency Response & Recovery | SeedTech",
  description:
    "Company server down? Get immediate emergency response. SeedTech diagnoses server outages, restores operations, and prevents repeat failures. Call (914) 362-8889.",
  alternates: { canonical: "/company-server-down" },
  openGraph: {
    title: "Company Server Down? Emergency Response — SeedTech",
    description:
      "Your company server is down and your entire organization is affected. Get emergency support, fast diagnosis, and a plan to prevent it from happening again.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Company Server Down — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const impactAreas = [
  {
    icon: Users,
    title: "Entire workforce is idle",
    body: "When the company server goes down, it's not one person's problem — it's everyone's. Every department that depends on shared resources is stuck.",
  },
  {
    icon: AlertTriangle,
    title: "Customer commitments are at risk",
    body: "Orders can't ship, projects can't advance, and clients are getting silence. The longer the outage, the harder it is to recover trust.",
  },
  {
    icon: HardDrive,
    title: "Data integrity is uncertain",
    body: "Was the shutdown clean or sudden? Are files corrupted? Is the database intact? Until the server is properly assessed, you don't know what you've lost.",
  },
  {
    icon: ShieldAlert,
    title: "Security exposure is unknown",
    body: "If the server went down unexpectedly, there may be a security incident involved — ransomware, unauthorized access, or a compromised service. This needs investigation.",
  },
];

const responseTimeline = [
  { time: "0–5 min", title: "You contact SeedTech", body: "Call (914) 362-8889 or submit an emergency request. We treat server-down calls as top priority — no queue, no ticket rotation." },
  { time: "5–15 min", title: "Initial triage and remote access", body: "A technician begins remote assessment. We determine whether the server is reachable, what error state it's in, and whether the issue is isolated or environment-wide." },
  { time: "15–60 min", title: "Diagnosis and stabilization", body: "We identify the root cause — hardware failure, software crash, security incident, or configuration problem — and begin resolution. If on-site support is needed, we dispatch immediately." },
  { time: "1–4 hrs", title: "Full restoration", body: "Services are restored, data integrity is verified, and your team gets back to work. We document the root cause and provide a post-incident report with prevention recommendations." },
];

const whyCompanyServersFail = [
  {
    icon: Clock,
    title: "Aging hardware",
    body: "Servers older than 5 years have exponentially higher failure rates. RAID controllers, power supplies, and drives wear out — often without warning if no monitoring is in place.",
  },
  {
    icon: Zap,
    title: "Power events",
    body: "Surges, brownouts, and hard shutdowns corrupt data and damage components. Without a properly maintained UPS and graceful shutdown procedures, a power blip can take your server offline for days.",
  },
  {
    icon: Wrench,
    title: "Unmanaged updates",
    body: "A Windows update that reboots the server at 2 AM, a firmware update that changes BIOS settings, or a vendor patch that breaks a dependency — unmanaged updates are one of the top causes of unexpected downtime.",
  },
  {
    icon: ShieldAlert,
    title: "No proactive monitoring",
    body: "Disk space fills up, services stop silently, backup jobs fail for weeks — and nobody notices until the server crashes. Proactive monitoring catches 90% of these issues before they cause outages.",
  },
  {
    icon: Activity,
    title: "Resource exhaustion",
    body: "CPU pinned at 100%, memory maxed out, disk queue lengths through the roof. The server technically hasn't crashed — it's just so overloaded that nothing can connect. This often looks identical to a full outage.",
  },
  {
    icon: Eye,
    title: "No IT partner watching it",
    body: "The most common factor in company server failures is the simplest: no one was monitoring it. No alerts, no health checks, no one reviewing logs. The server was running until it wasn't.",
  },
];

const faqs = [
  {
    q: "Our company server is down — what should we do first?",
    a: "Don't restart it until you understand the cause. Check if it's powered on, note any error messages on the screen, and determine whether the network is also down or just the server. Then call your IT provider — or SeedTech at (914) 362-8889 if you don't have one or they're not responding.",
  },
  {
    q: "How quickly can SeedTech respond to a company server outage?",
    a: "We begin remote triage within minutes of your call. Most server issues can be diagnosed and stabilized within 1-2 hours remotely. If on-site support is required, we dispatch same-day for businesses in New Jersey and the NYC metro area.",
  },
  {
    q: "What if we lost data when the server went down?",
    a: "If you have monitored backups, we can restore from the most recent clean backup point. SeedCare clients have daily backup verification, so recovery is reliable. If you don't have backups, recovery depends on the failure type — but the sooner you call, the better the outcome.",
  },
  {
    q: "Is the server outage a sign of a security breach?",
    a: "Possibly. Unexpected server crashes can indicate ransomware, unauthorized access, or a compromised service. We always investigate the security angle during server outage response — checking for unusual processes, unauthorized changes, and signs of data exfiltration.",
  },
  {
    q: "How do we prevent the company server from going down again?",
    a: "Three things: proactive monitoring (24/7 health checks and alerts), managed maintenance (patching, firmware updates on a controlled schedule), and proper hardware lifecycle management (replacing aging components before they fail). SeedCare plans include all three.",
  },
  {
    q: "Should we move our server to the cloud?",
    a: "It depends on your workload, compliance requirements, and budget. For many businesses, a hybrid approach — cloud-hosted core services with on-premise resources for specific needs — offers the best balance of reliability, performance, and cost. We can assess your environment and recommend the right approach.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Company Server Down — Emergency Response",
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
    "Emergency response and recovery for company server outages. Rapid diagnosis, restoration, root cause analysis, and prevention planning.",
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
    { "@type": "ListItem", position: 2, name: "Company Server Down", item: "https://seedtechllc.com/company-server-down" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function CompanyServerDownPage() {
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
            <span className="text-light-base/60">Company Server Down</span>
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
            Server Emergency
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Company Server Down? Get Emergency Support Now.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your company server is down and the entire organization is affected. Employees
              are idle, customers can&apos;t be served, and you have no visibility into
              what went wrong or how long it will take to fix.
            </p>
            <p>
              SeedTech provides emergency server response for companies across New Jersey
              and New York City. We triage within minutes, diagnose the root cause, and
              restore your operations as fast as possible.
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

      {/* Section 1 — Impact */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Impact Is Company-Wide"
          title="When the Company Server Goes Down, Everything Stops"
          description="A server outage doesn't just affect IT — it affects every person, every process, and every customer interaction that depends on your technology."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {impactAreas.map((card) => (
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

      {/* Section 2 — Response timeline */}
      <Section>
        <SectionHeader
          eyebrow="Our Response"
          title="What Happens When You Call SeedTech"
          description="From first contact to full restoration — here's exactly how our emergency server response works."
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {responseTimeline.map((item) => (
            <LiquidGlassCard key={item.time} className="flex gap-5 p-6">
              <div className="shrink-0 w-20 text-center">
                <span className="font-display text-lg text-seed-400">{item.time}</span>
              </div>
              <div>
                <h3 className="font-display text-card-title text-white mb-1">{item.title}</h3>
                <p className="text-body-sm leading-relaxed text-light-base/55">{item.body}</p>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Why company servers fail */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Root Causes"
          title="Why Company Servers Go Down"
          description="Server outages don't happen randomly. Here are the most common causes — and what you can do about each one."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyCompanyServersFail.map((card) => (
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

      {/* Section 4 — Prevention pitch */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Prevention
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            The Best Server Outage Is the One That Never Happens
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-light-base/55">
            <p>
              Every server outage we respond to has the same theme: no one was watching.
              No monitoring, no alerts, no maintenance schedule. The server ran until it
              broke — and then everyone scrambled.
            </p>
            <p>
              SeedCare plans include 24/7 server monitoring through NinjaOne, automated
              patching, backup verification, and hardware health alerts. We catch problems
              while they&apos;re still small. Starting at <strong className="text-white">$110/user/month</strong>.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/services/managed-it"
              className="inline-flex items-center gap-2 text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors"
            >
              Learn about SeedCare plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Company Server Down — Frequently Asked Questions" align="left" theme="light" />
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
            <Link href="/server-down-business" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down Business →</h3>
              <p className="text-body-sm text-light-base/50">Diagnose and fix a business server outage.</p>
            </Link>
            <Link href="/server-down-help" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down Help →</h3>
              <p className="text-body-sm text-light-base/50">Step-by-step guide when your server goes down.</p>
            </Link>
            <Link href="/network-down-business" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Network Down? →</h3>
              <p className="text-body-sm text-light-base/50">Troubleshoot network connectivity problems.</p>
            </Link>
            <Link href="/business-email-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Business Email Down →</h3>
              <p className="text-body-sm text-light-base/50">Fix email outages affecting your company.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Immediate emergency IT response across NJ.</p>
            </Link>
            <Link href="/ransomware-response-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Ransomware Response NJ →</h3>
              <p className="text-body-sm text-light-base/50">Server encrypted? Don&apos;t pay the ransom.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Company Server Down? We Respond Immediately."
          description="SeedTech provides emergency server support for companies across New Jersey and NYC. Call now — we triage within minutes, not hours."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Emergency IT Support"
          secondaryHref="/emergency-it-support-new-jersey"
        />
      </Section>
    </div>
  );
}
