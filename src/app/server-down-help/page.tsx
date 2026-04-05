import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ServerCrash,
  PhoneCall,
  Wifi,
  HardDrive,
  ShieldAlert,
  Clock,
  Zap,
  Eye,
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
  title: "Server Down? Here's What to Do | SeedTech — Emergency Server Support",
  description:
    "Server down? Don't panic. Here's what to check, what not to do, and how to get help fast. SeedTech provides emergency server support for businesses. Call (914) 362-8889.",
  alternates: { canonical: "/server-down-help" },
  openGraph: {
    title: "Server Down? Here's What to Do — SeedTech",
    description:
      "Step-by-step guidance when your server goes down. What to check first, common causes, and how to get emergency server support. Call (914) 362-8889.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Server Down Help — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const immediateSteps = [
  { step: "1", title: "Don't restart the server yet", body: "If the issue is data corruption or ransomware, a reboot can make it worse. Don't touch it until you understand what's happening." },
  { step: "2", title: "Check if it's the server or the network", body: "Can other devices reach the internet? Can you ping the server from another machine? If nothing has connectivity, the problem may be your firewall, switch, or ISP — not the server." },
  { step: "3", title: "Check physical connections", body: "Is the server powered on? Are the network cables seated? Is the power strip on? These sound basic — they're also the cause of outages more often than anyone admits." },
  { step: "4", title: "Check for error messages", body: "If you can see the server console (or remote in), note any error messages, blue screens, or beep codes. This information helps whoever responds diagnose faster." },
  { step: "5", title: "Call your IT provider", body: "If you have one, call them now. If you don't — or they're not responding — call SeedTech at (914) 362-8889. We handle emergency calls from non-clients." },
];

const commonCauses = [
  { icon: HardDrive, title: "Hardware failure", body: "Drives, RAID controllers, power supplies, and memory modules all fail. Servers older than 5 years are especially at risk." },
  { icon: ShieldAlert, title: "Ransomware attack", body: "If files are encrypted or you see ransom notes, don't restart or try to recover on your own. Isolate the server from the network immediately." },
  { icon: Wifi, title: "Network or firewall issue", body: "The server may be running fine but unreachable. A misconfigured firewall, failed switch, or ISP outage can look like a server crash." },
  { icon: Zap, title: "Power surge or outage", body: "If there was a power event, the server may have shut down uncleanly. Check the UPS (if you have one) — it may need a battery replacement." },
  { icon: Wrench, title: "Bad update or configuration change", body: "Did someone install an update, change a setting, or run a script right before the issue? That's usually where we start looking." },
  { icon: Clock, title: "Resource exhaustion", body: "Full disks, maxed-out RAM, or runaway processes can make a server unresponsive without actually crashing. It may just need cleanup." },
];

const faqs = [
  {
    q: "How fast can you respond to a server emergency?",
    a: "SeedCare clients get priority emergency response. For non-clients, we triage calls immediately and can typically begin remote diagnostics within 30 minutes. On-site response in New Jersey is same-day for critical situations.",
  },
  {
    q: "Do you help businesses that aren't SeedTech clients?",
    a: "Yes. We take emergency calls from non-clients. If your server is down and your IT provider isn't responding, call us at (914) 362-8889. We'll help you stabilize the situation.",
  },
  {
    q: "Should I try to restart the server myself?",
    a: "Not until you understand what caused the issue. If it's ransomware, a restart can trigger further encryption. If it's a disk failure, a restart can cause additional data loss. When in doubt, leave it off and call for help.",
  },
  {
    q: "What if our data is lost?",
    a: "If you have monitored backups (like those included in SeedCare plans), we can restore from a clean backup point. If you don't have backups, recovery options depend on the failure type — but the sooner you call, the better the chances.",
  },
  {
    q: "How do I prevent this from happening again?",
    a: "Proactive monitoring catches most issues before they cause outages. SeedCare plans include 24/7 endpoint monitoring, automated patching, backup monitoring, and hardware health alerts — all designed to prevent exactly this scenario.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Emergency Server Support",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Emergency Server Support",
  description: "Emergency server down support — remote diagnostics, on-site response, and recovery for businesses experiencing critical server outages.",
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
    { "@type": "ListItem", position: 2, name: "Server Down Help", item: "https://seedtechllc.com/server-down-help" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ServerDownHelpPage() {
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
            <span className="text-light-base/60">Server Down Help</span>
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
            <ServerCrash className="w-3.5 h-3.5 mr-1.5" /> Server Emergency
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Server Down? Here&apos;s What to Do Right Now.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your team can&apos;t work. Email is down. Files are unreachable. Don&apos;t
              panic — and don&apos;t restart the server until you&apos;ve read this.
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
              href="/emergency-it-support-new-jersey"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Emergency IT Support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 — What to do right now (featured snippet opportunity) */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Step by Step"
          title="What to Do When Your Server Goes Down"
          description="Follow these steps before calling anyone. They'll save time and prevent making the problem worse."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {immediateSteps.map((step) => (
            <div key={step.step} className="flex gap-5 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-seed-50 text-seed-600 font-display font-bold text-lg">
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

      {/* Section 2 — Common causes */}
      <Section>
        <SectionHeader
          eyebrow="Diagnosis"
          title="Common Reasons Your Server Went Down"
          description="Not all outages are the same. Understanding the cause changes how you respond."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonCauses.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Prevention pitch */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Prevention
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            This Shouldn&apos;t Have Been a Surprise
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60">
            <p>
              Most server outages have warning signs — failing drives, resource exhaustion,
              missed patches, backup jobs that stopped running weeks ago. With proactive
              monitoring, these issues get caught and resolved before they become emergencies.
            </p>
            <p>
              SeedCare plans include 24/7 monitoring through NinjaOne, automated patching,
              backup verification, and hardware health alerts. Starting at <strong className="text-dark-base">$110/user/month</strong>.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/managed-it-services-new-jersey"
              className="inline-flex items-center gap-2 text-seed-600 hover:text-seed-700 text-sm font-medium transition-colors"
            >
              Learn about SeedCare plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Server Down — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Immediate response for critical outages.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & DR NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Recover your data after an outage.</p>
            </Link>
            <Link href="/ransomware-response-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Ransomware Response NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Server encrypted? Don&apos;t pay the ransom.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Prevent outages with proactive IT.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Server Down? Call Now."
          description="Don't wait for your IT provider to call you back. SeedTech responds to emergency server calls immediately — even for non-clients."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Emergency IT Support"
          secondaryHref="/emergency-it-support-new-jersey"
        />
      </Section>
    </div>
  );
}
