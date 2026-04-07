import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Wifi,
  WifiOff,
  PhoneCall,
  Router,
  Globe,
  Monitor,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Settings,
  Search,
  Zap,
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
  AnimatedH1,
} from "@/components/kit";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Network Down at Your Business? Troubleshoot & Fix Fast | SeedTech",
  description:
    "Business network down? Diagnose network connectivity issues, troubleshoot problems, and get expert help fast. SeedTech resolves network outages. Call (914) 362-8889.",
  alternates: { canonical: "/network-down-business" },
  openGraph: {
    title: "Network Down at Your Business? — SeedTech",
    description:
      "Network issues affecting your business? Troubleshoot connectivity problems, identify root causes, and get expert IT support to restore your network.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Network Down Business — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const networkProblems = [
  {
    icon: WifiOff,
    title: "Complete network outage",
    body: "No one in the office can connect to anything — no internet, no shared drives, no internal applications. Every device is offline.",
  },
  {
    icon: Wifi,
    title: "Intermittent connectivity drops",
    body: "The network keeps cutting in and out. Employees lose connection mid-call, files fail to save, and video meetings keep freezing.",
  },
  {
    icon: Monitor,
    title: "Some devices can connect, others can't",
    body: "Half the office is online, half isn't. Different floors, different departments, or specific machines — the pattern doesn't make sense.",
  },
  {
    icon: Globe,
    title: "Internet works but internal resources don't",
    body: "Employees can browse the web but can't reach the file server, printer, or line-of-business application. The LAN is partially broken.",
  },
  {
    icon: Clock,
    title: "Network is painfully slow",
    body: "Everything loads, but at a crawl. File transfers take forever, cloud apps time out, and VoIP calls are dropping packets.",
  },
  {
    icon: ShieldAlert,
    title: "You suspect a security issue",
    body: "Unusual traffic patterns, devices connecting that shouldn't be, or network behavior that doesn't match normal operations. This needs immediate investigation.",
  },
];

const troubleshootingSteps = [
  {
    step: "01",
    title: "Check the basics first",
    body: "Is the modem online? Are the router and switch powered on and showing normal indicator lights? A surprising number of network outages trace back to a tripped power strip or an unplugged cable.",
  },
  {
    step: "02",
    title: "Isolate the problem",
    body: "Is it one device, one department, or the entire office? Can wireless devices connect but wired can't (or vice versa)? Narrowing the scope tells you where the failure point is.",
  },
  {
    step: "03",
    title: "Test your internet connection",
    body: "Connect a laptop directly to the modem. If that works, the problem is your internal network — not the ISP. If it doesn't, call your internet provider first.",
  },
  {
    step: "04",
    title: "Check the firewall and router",
    body: "A misconfigured firewall can silently block all traffic. If someone recently made changes to network rules, VLANs, or DHCP settings, that's likely your culprit.",
  },
  {
    step: "05",
    title: "Restart network hardware in order",
    body: "If the basics check out, power cycle in this order: modem first (wait 2 minutes), then router/firewall, then switches. Don't touch the server until everything else is ruled out.",
  },
  {
    step: "06",
    title: "Call for expert help",
    body: "If the problem persists after basic troubleshooting, it's time to call a professional. SeedTech diagnoses network connectivity issues remotely in minutes. Call (914) 362-8889.",
  },
];

const commonCauses = [
  { icon: Router, title: "Failed switch or router", body: "Network hardware fails — especially unmanaged consumer-grade equipment that many small businesses still rely on. Enterprise-grade managed switches are more reliable and provide better diagnostics." },
  { icon: ShieldAlert, title: "Firewall misconfiguration", body: "One wrong firewall rule can block all traffic without any error message. This commonly happens after firmware updates, security policy changes, or when someone tries to 'fix' something." },
  { icon: Zap, title: "ISP outage or DNS failure", body: "Your internal network is fine but your ISP is having problems — or their DNS servers are down. Testing with a direct connection to the modem confirms this quickly." },
  { icon: Settings, title: "DHCP or IP conflicts", body: "If your DHCP server stops issuing addresses — or two devices get the same IP — parts of your network will fail unpredictably. This is especially common when a server doubles as the DHCP server." },
  { icon: Search, title: "Cable or port failure", body: "Ethernet cables degrade, patch panel ports go bad, and wall jacks get damaged. Physical layer issues are unglamorous but extremely common — especially in older buildings." },
  { icon: Clock, title: "Bandwidth saturation", body: "If your connection is maxed out — from backups running during business hours, large cloud syncs, or unauthorized streaming — legitimate traffic gets choked. QoS policies and traffic shaping solve this." },
];

const faqs = [
  {
    q: "How do I troubleshoot basic network connectivity issues?",
    a: "Start by checking physical connections — power, cables, and indicator lights on your modem, router, and switches. Then isolate the problem: is it one device, one department, or the whole office? Test by connecting a laptop directly to the modem. If that works, the issue is internal. If not, contact your ISP.",
  },
  {
    q: "What's the difference between a network problem and an internet problem?",
    a: "An internet problem means your ISP connection is down — no one can reach external websites. A network problem means your internal infrastructure (switches, router, firewall, cabling) is failing — devices can't reach each other or the server, even if internet works. The troubleshooting approach is different for each.",
  },
  {
    q: "Why does my network keep dropping connection?",
    a: "Intermittent drops are usually caused by failing hardware (a dying switch or access point), cable issues, Wi-Fi interference, bandwidth saturation, or overheating network equipment. Managed network monitoring can identify the pattern and pinpoint the failing component before it causes a complete outage.",
  },
  {
    q: "How long does it take to fix a business network outage?",
    a: "Simple issues (ISP outage, tripped power) can be resolved in minutes. Configuration problems typically take 1-2 hours. Hardware failures may require same-day replacement. SeedTech begins remote diagnostics within minutes of your call and can resolve most network issues remotely.",
  },
  {
    q: "Should I replace my network equipment?",
    a: "If your switches, router, or firewall are consumer-grade or more than 5 years old, upgrading to enterprise-managed equipment is one of the highest-ROI investments you can make. Managed switches provide visibility into network health and allow remote troubleshooting — unmanaged ones don't.",
  },
  {
    q: "Can SeedTech monitor my network proactively?",
    a: "Yes. SeedCare plans include network device monitoring through NinjaOne. We monitor switch health, bandwidth utilization, and connectivity status 24/7. When something starts failing, we know before your team notices. Plans start at $110/user/month with no contracts.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Business Network Troubleshooting & Support",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Network Support",
  areaServed: [
    { "@type": "State", name: "New Jersey" },
    { "@type": "City", name: "New York City" },
  ],
  description:
    "Network troubleshooting and emergency support for businesses experiencing connectivity issues, network outages, and infrastructure failures.",
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
    { "@type": "ListItem", position: 2, name: "Network Down Business", item: "https://seedtechllc.com/network-down-business" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function NetworkDownBusinessPage() {
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
            <span className="text-light-base/60">Network Down — Business</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="blue" size="xl" className="-top-40 right-0 opacity-25" />
        <GradientOrb color="seed" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="blue" className="mb-6">
            <WifiOff className="w-3.5 h-3.5 mr-1.5" />
            Network Emergency
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Business Network Down? Troubleshoot and Fix It Fast.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your office network is down and no one can work. Phones are dead, cloud apps
              won&apos;t load, and your team is asking you what&apos;s happening. You need
              answers — and you need them now.
            </p>
            <p>
              SeedTech diagnoses network connectivity issues remotely in minutes. Whether it&apos;s
              a failed switch, firewall misconfiguration, or ISP outage — we find it and fix it.
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

      {/* Section 1 — What are you seeing? */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What Are You Seeing?"
          title="Common Network Problems That Stop Your Business"
          description="Network issues range from total outages to frustrating intermittent problems. Here's what each scenario looks like and what it usually means."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkProblems.map((card) => (
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

      {/* Section 2 — Troubleshooting steps (featured snippet target) */}
      <Section>
        <SectionHeader
          eyebrow="Network Troubleshooting Steps"
          title="How to Troubleshoot Network Connectivity Issues"
          description="Follow these steps in order to diagnose the problem and determine whether you can fix it yourself or need professional help."
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {troubleshootingSteps.map((s) => (
            <LiquidGlassCard key={s.step} className="flex gap-5 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-seed-600/20 text-seed-400 font-display font-bold text-lg">
                {s.step}
              </div>
              <div>
                <h3 className="font-display text-card-title text-white mb-1">{s.title}</h3>
                <p className="text-body-sm leading-relaxed text-light-base/55">{s.body}</p>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Common causes */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Root Causes"
          title="Why Your Business Network Went Down"
          description="Understanding the cause changes how you respond. Here are the most common reasons business networks fail."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonCauses.map((card) => (
            <div key={card.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <card.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4 — Prevention */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Prevention
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Most Network Outages Are Preventable
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-light-base/55">
            <p>
              Consumer-grade networking equipment, unmonitored switches, and zero visibility
              into bandwidth usage — these are the real reasons business networks fail.
              With managed network monitoring, most outages get prevented before anyone notices.
            </p>
            <p>
              SeedCare plans include network device monitoring, proactive firmware updates,
              and bandwidth visibility. Starting at <strong className="text-white">$110/user/month</strong> with
              no contracts.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/managed-it-services-new-jersey"
              className="inline-flex items-center gap-2 text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors"
            >
              Learn about SeedCare plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Network Problems — Frequently Asked Questions" align="left" theme="light" />
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
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down? →</h3>
              <p className="text-body-sm text-light-base/50">Business server outage diagnosis and support.</p>
            </Link>
            <Link href="/company-server-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Company Server Down →</h3>
              <p className="text-body-sm text-light-base/50">Emergency response when your company server fails.</p>
            </Link>
            <Link href="/business-email-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Business Email Down →</h3>
              <p className="text-body-sm text-light-base/50">Fix email outages affecting your company.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Immediate emergency IT response across NJ.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Protect your network from threats.</p>
            </Link>
            <Link href="/server-down-help" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down Help →</h3>
              <p className="text-body-sm text-light-base/50">Step-by-step guide when your server goes down.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Network Down? Get Help Now."
          description="SeedTech diagnoses and resolves business network issues fast — remotely or on-site across New Jersey and NYC. Call now for immediate help."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Emergency IT Support"
          secondaryHref="/emergency-it-support-new-jersey"
        />
      </Section>
    </div>
  );
}
