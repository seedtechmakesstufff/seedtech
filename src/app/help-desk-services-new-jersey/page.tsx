import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Headphones,
  Monitor,
  Clock,
  Zap,
  Users,
  Wrench,
  PhoneCall,
  Laptop,
  LifeBuoy,
  Settings,
  CheckCircle2,
  AlertTriangle,
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
  title: "IT Help Desk Services New Jersey | SeedTech — IT Service Desk for NJ Businesses",
  description:
    "SeedTech provides IT help desk services for New Jersey businesses — unlimited support requests, real technicians, same-day resolution. No ticket limits, no contracts. Call (914) 362-8889.",
  alternates: { canonical: "/help-desk-services-new-jersey" },
  openGraph: {
    title: "IT Help Desk Services New Jersey — SeedTech",
    description:
      "Unlimited IT help desk for NJ businesses. Call and reach a real technician — password resets, email issues, software problems, network outages. Same-day resolution.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IT Help Desk Services New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const painPoints = [
  {
    icon: Clock,
    title: "Your help desk takes hours to respond",
    body: "You submit a ticket and wait. Your employee sits idle. The issue that would have taken 5 minutes to fix remotely costs you half a day of productivity. Help desk response time is the single biggest driver of employee frustration with IT.",
  },
  {
    icon: Users,
    title: "You can't get a real person on the phone",
    body: "Automated phone trees, chatbot loops, and ticket portals that never get checked. Your team needs a human who can fix their problem — not a system that acknowledges their complaint.",
  },
  {
    icon: AlertTriangle,
    title: "The same issues keep coming back",
    body: "A real help desk doesn't just fix the symptom — it investigates the root cause. If the same printer, VPN, or Outlook error keeps recurring, something in the environment needs to change.",
  },
  {
    icon: Laptop,
    title: "New employees wait days for a working setup",
    body: "Your new hire starts Monday, but their laptop isn't configured, their email isn't created, and their software isn't installed. Onboarding should be same-day, not a week-long process.",
  },
];

const serviceDesk = [
  {
    icon: Headphones,
    title: "Direct phone and email support",
    body: "Your team calls or emails and reaches a real SeedTech technician — not a call center, not a chatbot. We pick up the phone and start working the issue immediately.",
  },
  {
    icon: Zap,
    title: "Same-day resolution",
    body: "The majority of help desk requests are resolved within the first session — remotely. Password resets, email configuration, printer issues, VPN problems, application errors. We don't schedule a callback for next week.",
  },
  {
    icon: Monitor,
    title: "Remote desktop troubleshooting",
    body: "With NinjaOne remote access, we can see your employee's screen, diagnose the problem, and resolve it in real time. No waiting for an on-site visit for software-level issues.",
  },
  {
    icon: Settings,
    title: "New employee onboarding",
    body: "Laptop configured, email and Microsoft 365 accounts created, security tools enrolled, applications installed, access permissions set. Ready on day one — not day five.",
  },
  {
    icon: LifeBuoy,
    title: "Employee offboarding",
    body: "When someone leaves, we disable accounts, revoke access, transfer data, and document everything. No orphaned accounts, no lingering permissions, no security gaps.",
  },
  {
    icon: Wrench,
    title: "On-site support when needed",
    body: "Hardware swaps, network cabling, office moves, and hands-on troubleshooting. SeedCare Plus and Pro plans include monthly on-site hours for issues that can't be fixed remotely.",
  },
];

const requestTypes = [
  "Password resets and account lockouts",
  "Email configuration and Outlook issues",
  "Printer and scanner setup and troubleshooting",
  "VPN connectivity and remote access problems",
  "Microsoft 365 and cloud application support",
  "New software installation and licensing",
  "Hardware issues — display, keyboard, docking station",
  "Network connectivity — Wi-Fi, Ethernet, slow speeds",
  "File access and permissions issues",
  "New employee setup and departing employee offboarding",
  "Multi-factor authentication setup and recovery",
  "Video conferencing and meeting room tech support",
];

const metrics = [
  { label: "Average response time", value: "< 15 min", note: "Phone and email" },
  { label: "First-session resolution", value: "85%+", note: "Most issues resolved live" },
  { label: "Ticket limit", value: "Unlimited", note: "No per-ticket fees" },
  { label: "Contract required", value: "None", note: "Month-to-month" },
];

const faqs = [
  {
    q: "Is the IT help desk included in SeedCare plans?",
    a: "Yes. Every SeedCare plan — Essentials, Plus, and Pro — includes unlimited help desk support via phone and email. There are no per-ticket fees, no hourly charges, and no caps on how many requests your team can submit.",
  },
  {
    q: "How quickly do you respond to help desk requests?",
    a: "Most requests receive an initial response within 15 minutes during business hours. Critical issues — like a server down or security incident — are triaged immediately. We don't use phone trees or require you to submit a form before speaking to someone.",
  },
  {
    q: "Do your technicians handle both Mac and Windows?",
    a: "Yes. Our help desk supports Windows, macOS, iOS, and Android devices. We also support Microsoft 365, Google Workspace, and a wide range of business applications.",
  },
  {
    q: "What if we need someone on-site?",
    a: "SeedCare Plus and Pro plans include monthly on-site hours for hardware work, network troubleshooting, office moves, and hands-on support. Essentials clients can add on-site visits as needed at an hourly rate.",
  },
  {
    q: "Can you handle new employee setup and offboarding?",
    a: "Absolutely. We handle the full lifecycle — laptop configuration, account creation, security enrollment, application installation for new hires, and account deactivation, access revocation, and data transfer for departures. Same-day turnaround.",
  },
  {
    q: "What's the difference between your help desk and a break-fix provider?",
    a: "Break-fix providers only show up when something is already broken — and they charge by the hour. Our help desk is proactive, unlimited, and included in your monthly plan. We monitor your environment continuously, so many issues are resolved before your team even notices them.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Help Desk Services New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "IT Help Desk Services",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Unlimited IT help desk services for New Jersey businesses — direct phone and email support, same-day resolution, new employee onboarding, and remote troubleshooting.",
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
    { "@type": "ListItem", position: 2, name: "IT Help Desk Services New Jersey", item: "https://seedtechllc.com/help-desk-services-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function HelpDeskServicesNJPage() {
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
            <span className="text-light-base/60">IT Help Desk Services New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="cyan" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="cyan" className="mb-6">
            <Headphones className="w-3.5 h-3.5 mr-1.5" /> IT Help Desk — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Help Desk Services for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your employees shouldn&apos;t have to wait hours for a password reset or
              spend half a day fighting a printer issue. An IT help desk should actually
              help — quickly, directly, and without making you jump through hoops.
            </p>
            <p>
              SeedTech provides unlimited IT help desk services for businesses across New
              Jersey. Call and reach a real technician. Most issues resolved the same session.
              No ticket limits, no contracts, no phone trees.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free IT Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — Pain points */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Why Businesses Switch to SeedTech&apos;s Help Desk"
          description="Most IT providers treat help desk as an afterthought. Long wait times, impersonal ticketing systems, and no follow-through. Here's what drives businesses to us."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((card) => (
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

      {/* Section 2 — Service desk capabilities */}
      <Section>
        <SectionHeader
          eyebrow="What You Get"
          title="A Help Desk That Actually Helps"
          description="Unlimited requests, real technicians, and same-day resolution. Here's what SeedTech's IT service desk covers for your business."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceDesk.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Common request types */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Handle"
          title="Common IT Help Desk Requests"
          description="From password resets to network outages — here's a snapshot of what our service desk handles every day for New Jersey businesses."
          theme="light"
        />
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {requestTypes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-600" />
                <p className="text-body-sm text-dark-base/70 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Metrics */}
      <Section>
        <SectionHeader
          eyebrow="By the Numbers"
          title="Help Desk Performance You Can Count On"
          description="Fast response, high resolution rates, and zero hidden fees. Here's how SeedTech's IT service desk performs."
        />
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <LiquidGlassCard key={m.label} className="p-6 text-center">
              <p className="font-display text-heading text-seed-400 mb-1">{m.value}</p>
              <p className="text-body-sm font-medium text-white mb-1">{m.label}</p>
              <p className="text-xs text-light-base/40">{m.note}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Pricing note */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Included in Every Plan</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Unlimited Help Desk — No Per-Ticket Fees
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            Every SeedCare plan — Essentials ($110/user/mo), Plus ($130/user/mo), and Pro ($160/user/mo) —
            includes unlimited IT help desk support. Your team calls as often as they need to.
            There are no per-ticket charges and no hourly billing.
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
              Free IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            IT Help Desk Services Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedTech provides IT service desk support to businesses across New Jersey — from
            professional services firms in Morristown to manufacturers in Dover. Remote support
            for every employee, on-site when you need it.
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
        <SectionHeader title="IT Help Desk — Frequently Asked Questions" align="left" theme="light" />
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
            <Link href="/it-support-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Full IT support for NJ businesses.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Proactive IT management with flat-rate pricing.</p>
            </Link>
            <Link href="/outsourced-it-support-new-jersey" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Outsourced IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Why NJ businesses outsource IT to SeedTech.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl liquid-glass p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-light-base/50">See what your current IT is missing.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="IT Help Desk Services for New Jersey Businesses"
          description="Unlimited support. Real technicians. Same-day resolution. See what responsive IT actually looks like."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
