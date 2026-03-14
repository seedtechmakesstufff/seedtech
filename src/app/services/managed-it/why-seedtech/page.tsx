import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileSearch,
  Wrench,
  KeyRound,
  Bot,
  UserCheck,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  GradientText,
  LiquidGlassPill,
  CTABanner,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

export const metadata: Metadata = {
  title: "Why SeedTech | Accountability, Not Volume — Small MSP Advantage",
  description:
    "Tired of ticket black holes and revolving-door technicians? SeedTech is built for accountability, not volume. Learn why small MSPs outperform large IT firms for growing businesses.",
  openGraph: {
    title: "Why SeedTech | Accountability, Not Volume",
    description:
      "Tired of ticket black holes and revolving-door technicians? Learn why small MSPs outperform large IT firms.",
    url: "https://seedtechllc.com/services/managed-it/why-seedtech",
    type: "website",
  },
  alternates: { canonical: "https://seedtechllc.com/services/managed-it/why-seedtech" },
};

const largeFirmPains = [
  { icon: AlertTriangle, title: "Hidden Costs", body: "Nickel-and-dimed for every on-site visit, after-hours call, or anything classified as a \"project.\" Your monthly invoice is never what you expected." },
  { icon: XCircle, title: "Ticket Black Holes", body: "You submit an issue and hear nothing for days. Tickets get closed without resolution. No one follows up." },
  { icon: Users, title: "Revolving-Door Technicians", body: "A different person every time you call. You re-explain your setup, your apps, your network — again and again." },
  { icon: Wrench, title: "Generic Solutions", body: "Cookie-cutter scripts that don't fit your environment. The same runbook for every client, regardless of your actual infrastructure." },
  { icon: FileSearch, title: "No Strategic Guidance", body: "Just break-fix with a monthly invoice. No one is thinking about your hardware lifecycle, security posture, or long-term IT roadmap." },
  { icon: KeyRound, title: "No One Takes Ownership", body: "Issues bounce between L1, L2, and L3 support tiers. By the time someone actually fixes it, you've lost half a day." },
];

const seedtechAdvantages = [
  { icon: UserCheck, title: "Deep Familiarity", body: "We know your file structure, your QuickBooks environment, your permission structure. No re-explaining." },
  { icon: ShieldCheck, title: "Direct Authority", body: "The person who picks up your alert has the authority to act. No escalation queues, no internal transfers." },
  { icon: Bot, title: "Custom Automation", body: "We build repeat-fix automation tailored to your specific systems — not generic scripts applied to every client." },
  { icon: CheckCircle2, title: "Clear Ownership", body: "Every alert has one owner from detection to resolution. No hiding behind headcount." },
];

const faqs = [
  { q: "How is SeedTech structured differently from larger MSPs?", a: "Most large MSPs rely on tiered support — your issue bounces between L1, L2, and engineering before anyone resolves it. At SeedTech, the person who picks up the alert has the authority and context to act. One owner, start to finish." },
  { q: "What if we need after-hours support?", a: "Emergency support is available on every plan. Real-time monitoring means we often detect and begin resolving issues before you even know about them — including nights and weekends." },
  { q: "How do you handle on-site issues?", a: "SeedCare Plus includes up to 4 hours per month of on-site support. SeedCare Pro includes unlimited on-site. For Essentials clients, on-site can be added as needed." },
  { q: "What happens during the transition from our current provider?", a: "We follow a 4-week phased rollout: discovery, silent deployment, go-live, and optimization. We deploy in the background with zero disruption. Most teams are fully onboarded in 5-10 business days." },
];

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
    { "@type": "ListItem", position: 2, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
    { "@type": "ListItem", position: 3, name: "Why SeedTech", item: "https://seedtechllc.com/services/managed-it/why-seedtech" },
  ],
};

export default function WhySeedTechPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services/managed-it" className="hover:text-light-base/50 transition-colors">Managed IT</Link>
            <span>/</span>
            <span className="text-light-base/60">Why SeedTech</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Why Switch to SeedTech</LiquidGlassPill>
          <h1 className="font-display text-title md:text-display text-white leading-[1.05] mb-6 max-w-4xl">
            Built for{" "}
            <GradientText as="span">Accountability</GradientText>,{" "}
            Not Volume
          </h1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            Your current IT provider has 50 technicians — so why does no one know your setup?
            SeedTech is structured around deep familiarity, not ticket throughput. You get
            people who know your environment, not whoever is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200">
              Free IT Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Problem"
          title="What Large MSPs Get Wrong"
          description="If any of these sound familiar, you are not alone. These are the top reasons businesses switch to SeedTech."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {largeFirmPains.map((p) => (
            <div key={p.title} className="rounded-2xl border border-red-100 bg-red-50/30 p-7">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-display text-card-title text-dark-base mb-2">{p.title}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison */}
      <Section>
        <SectionHeader
          eyebrow="The Difference"
          title="Large Firms vs. SeedTech"
          description="A simple issue at a large MSP can bounce between 3-4 people before anyone fixes it. At SeedTech, the person who picks up the alert owns it through resolution."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="liquid-glass rounded-2xl p-8 border border-red-500/20">
            <h3 className="font-display text-card-title text-red-400 mb-6">Large Firms Operate in Tiers</h3>
            <ul className="space-y-4">
              {[
                "Level 1 support — scripts, basic triage",
                "Escalation to Level 2 — wait for availability",
                "Escalation to engineering — more delays",
                "Internal ticket transfers — ownership gets lost",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-light-base/50">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="liquid-glass rounded-2xl p-8 border border-emerald-500/20 liquid-glass-tinted-seed">
            <h3 className="font-display text-card-title text-emerald-400 mb-6">Our Structure is Simpler</h3>
            <ul className="space-y-4">
              {[
                "Monitoring alerts immediately — no waiting for a user to report",
                "The person responding has authority to act — no permission chains",
                "Fewer internal handoffs — less context lost",
                "Clear ownership of resolution — one person, start to finish",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-light-base/70">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Structure Advantage */}
      <Section theme="light">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-eyebrow uppercase tracking-widest mb-4 text-seed-600">Our Philosophy</p>
          <h2 className="font-display text-heading md:text-heading-lg text-dark-base mb-6">
            Effective IT Doesn&apos;t Require a Pit Crew
          </h2>
          <p className="text-body-lg text-dark-base/60 leading-relaxed">
            Headcount doesn&apos;t fix problems — structure does. A focused team that
            knows your environment, builds automation for repeat issues, and owns every
            outcome will always outperform a rotating cast of strangers reading from a script.
          </p>
        </div>
        <SectionHeader
          eyebrow="How We're Built"
          title="What Our Structure Allows"
          description="Deep familiarity. Direct authority. Clear ownership of every outcome."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {seedtechAdvantages.map((a) => (
            <div key={a.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-7">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <a.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base mb-2">{a.title}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Blockquote */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-heading md:text-heading-lg font-display text-white leading-tight mb-8">
            &ldquo;You don&apos;t get &lsquo;whoever is free.&rsquo;{" "}
            <GradientText as="span">You get people who know your environment.</GradientText>&rdquo;
          </blockquote>
          <p className="text-light-base/40 text-body-sm">
            Focused enough to know you. Skilled enough to protect you.
            Accountable enough to own every outcome.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader eyebrow="FAQ" title="Questions About Switching" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Switch?"
          description="Schedule a free IT assessment and see the difference accountability makes."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="See Plans & Pricing"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
