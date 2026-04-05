import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Server,
  Wifi,
  Mail,
  Clock,
  CheckCircle2,
  Zap,
  Users,
  ShieldCheck,
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

/* ─── Static Metadata (bypasses DB — SEO page needs hardcoded control) ───── */
export const metadata: Metadata = {
  title: "Emergency IT Support New Jersey | SeedTech — Fast Response When Systems Go Down",
  description:
    "Server down? Network offline? Ransomware attack? SeedTech provides emergency IT support across New Jersey with rapid response. Call (914) 362-8889 for immediate help.",
  alternates: { canonical: "/emergency-it-support-new-jersey" },
  openGraph: {
    title: "Emergency IT Support New Jersey — SeedTech",
    description:
      "When your business systems are down, every minute counts. SeedTech provides rapid-response emergency IT support across New Jersey.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Emergency IT Support New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const emergencySigns = [
  {
    icon: Server,
    title: "Server is down",
    body: "Your team can't access files, applications, or shared resources. Operations are at a standstill.",
  },
  {
    icon: Wifi,
    title: "Network is offline",
    body: "Internet is down, phones aren't working, employees can't connect to anything — and your ISP isn't giving you a timeline.",
  },
  {
    icon: ShieldAlert,
    title: "Ransomware or security breach",
    body: "You're seeing ransom messages, files are encrypted, or you suspect unauthorized access to your systems.",
  },
  {
    icon: Mail,
    title: "Email is down company-wide",
    body: "No one can send or receive email. Customers, vendors, and your team are all in the dark.",
  },
  {
    icon: AlertTriangle,
    title: "Systems are crashing repeatedly",
    body: "Workstations are blue-screening, applications are failing, and the same problems keep coming back.",
  },
  {
    icon: Users,
    title: "Employees can't work",
    body: "Whatever the cause — your team is stuck. Productivity is zero and you need help now, not next week.",
  },
];

const responseProcess = [
  {
    step: "01",
    title: "You contact us",
    body: "Call or submit an emergency request. We prioritize these immediately — no queue, no ticket rotation.",
  },
  {
    step: "02",
    title: "We assess the issue",
    body: "A real technician begins triage within minutes. We identify the scope — is it one device, one location, or the entire environment?",
  },
  {
    step: "03",
    title: "We begin resolution",
    body: "Remote or on-site — we start fixing the problem immediately. No waiting for approvals, no escalation tiers.",
  },
  {
    step: "04",
    title: "We stabilize your systems",
    body: "Once the immediate threat is resolved, we ensure your environment is stable and your team can get back to work.",
  },
];

const afterEmergencyItems = [
  {
    icon: CheckCircle2,
    title: "Root cause analysis",
    body: "We identify what caused the incident so it doesn't happen again — not just patch the surface symptoms.",
  },
  {
    icon: ShieldCheck,
    title: "Security hardening",
    body: "If the incident exposed vulnerabilities, we close them — SentinelOne endpoint protection, MFA enforcement, access controls, and patching gaps identified by our NinjaOne monitoring platform.",
  },
  {
    icon: Zap,
    title: "Transition to managed support",
    body: "Most emergency calls reveal a bigger problem: no proactive IT management. We can fix that with a structured SeedCare plan.",
  },
];

const faqs = [
  {
    q: "How fast do you respond to emergency IT requests?",
    a: "Emergency requests are prioritized immediately. We begin triage within minutes of contact — not hours, not the next business day.",
  },
  {
    q: "Do you provide on-site emergency support in New Jersey?",
    a: "Yes. We serve businesses across New Jersey and can dispatch on-site when the issue requires physical intervention. Many emergencies can also be resolved remotely.",
  },
  {
    q: "What if we're not a current SeedTech client?",
    a: "We help businesses in crisis regardless of whether they're existing clients. If your systems are down and you need help now, call us.",
  },
  {
    q: "Can you help with ransomware?",
    a: "Yes. We handle ransomware response including containment, assessment, recovery from backup where possible, and post-incident security hardening.",
  },
  {
    q: "What does emergency IT support cost?",
    a: "Emergency engagements are scoped based on the situation. We'll be transparent about costs upfront — the priority is getting your business back online.",
  },
  {
    q: "What happens after the emergency is resolved?",
    a: "We perform a root cause analysis, recommend preventive measures, and can transition you to ongoing managed IT support so the same situation doesn't happen again.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Emergency IT Support New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hopatcong",
      addressRegion: "NJ",
      addressCountry: "US",
    },
  },
  serviceType: "Emergency IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description:
    "Rapid-response emergency IT support for New Jersey businesses experiencing server failures, network outages, ransomware attacks, and critical system downtime.",
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
    {
      "@type": "ListItem",
      position: 2,
      name: "Emergency IT Support New Jersey",
      item: "https://seedtechllc.com/emergency-it-support-new-jersey",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function EmergencyITSupportNJPage() {
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
            <span className="text-light-base/60">Emergency IT Support New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero — Urgent, high-contrast, action-first */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-25" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Emergency IT Support
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Your Systems Are Down. New Jersey&apos;s Fastest IT Response.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              If your business is experiencing a server failure, network outage, ransomware
              attack, or any critical system emergency — don&apos;t wait for a callback from
              a helpdesk queue.
            </p>
            <p>
              SeedTech provides rapid-response emergency IT support for businesses across
              New Jersey. We triage immediately, diagnose fast, and get your team back
              to work.
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
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Submit Emergency Request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 — Signs you need emergency support */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Are You Dealing With This Right Now?"
          title="If Any of These Sound Familiar, You Need Help Now"
          description="These aren't minor inconveniences — they're business-stopping events that cost you money every minute they go unresolved."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencySigns.map((card) => (
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

      {/* Section 2 — How we respond */}
      <Section>
        <SectionHeader
          eyebrow="What Happens When You Call"
          title="Our Emergency Response Process"
          description="No escalation tiers. No waiting for availability. When your business is down, we treat it like ours is too."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {responseProcess.map((s) => (
            <div key={s.step} className="relative">
              <span className="font-display text-[4rem] leading-none text-seed-600/15 absolute -top-2 -left-1">
                {s.step}
              </span>
              <div className="pt-14">
                <h3 className="font-display text-card-title text-white mb-3">{s.title}</h3>
                <p className="text-body-sm text-light-base/55 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3 — Why response time matters */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Every Minute Counts
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            The Average Cost of IT Downtime Is $5,600 Per Minute
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60">
            <p>
              For small and mid-sized businesses in New Jersey, even a few hours of downtime
              can mean missed orders, stalled operations, frustrated customers, and lost
              revenue that never comes back.
            </p>
            <p>
              Most IT providers will tell you they&apos;ll &quot;get to it.&quot; We start working
              the moment you call. No queue. No ticket number. No waiting until Monday.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Triage begins within minutes of first contact",
              "Real technicians — not automated phone trees",
              "Remote access for immediate diagnosis",
              "On-site dispatch available across New Jersey",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-black/[0.05] bg-white p-5 text-body-sm text-dark-base/70 shadow-cardLight"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Section 4 — After the emergency */}
      <Section>
        <SectionHeader
          eyebrow="After the Dust Settles"
          title="We Don't Just Fix It — We Make Sure It Doesn't Happen Again"
          description="Most emergency IT calls reveal a deeper problem: no proactive monitoring, no backups, no real IT partner. We fix the crisis, then fix the root cause."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {afterEmergencyItems.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 5 — NJ-specific trust signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Emergency IT Support Across New Jersey
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60">
            <p>
              SeedTech is based in Northern New Jersey and provides emergency IT support
              to businesses across Morris County, Somerset County, Essex County, Union County,
              and the surrounding areas.
            </p>
            <p>
              We work with trucking companies, law firms, medical practices, contractors,
              restaurants, and small businesses of all kinds — any organization that depends
              on technology to operate and can&apos;t afford to be down.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              "Morristown",
              "Mendham",
              "Chester",
              "Bernardsville",
              "Basking Ridge",
              "Hopatcong",
              "Parsippany",
              "Netcong",
              "Stanhope",
              "Dover",
              "Randolph",
              "Morris County",
              "Somerset County",
              "Essex County",
              "Union County",
            ].map((loc) => (
              <span
                key={loc}
                className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Emergency IT Support — Frequently Asked Questions" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Internal linking block */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/managed-it-services-new-jersey"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Managed IT Services NJ →
              </h3>
              <p className="text-body-sm text-dark-base/50">Proactive IT support so emergencies don&apos;t happen in the first place.</p>
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Free IT Assessment →
              </h3>
              <p className="text-body-sm text-dark-base/50">Find out where your environment is vulnerable before the next incident.</p>
            </Link>
            <Link
              href="/services/managed-it/plans"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                SeedCare Plans →
              </h3>
              <p className="text-body-sm text-dark-base/50">Flat-rate managed IT starting at $110/user/month. No contracts.</p>
            </Link>
            <Link
              href="/it-support-new-jersey"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                IT Support New Jersey →
              </h3>
              <p className="text-body-sm text-dark-base/50">Ongoing business IT support for companies across New Jersey.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Systems Down? Don't Wait."
          description="SeedTech provides emergency IT support for businesses across New Jersey. Call now or submit a request — we respond immediately."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Submit Emergency Request"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
