import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Download,
  Rocket,
  Settings,
  Clock,
  CheckCircle2,
  Shield,
  FileText,
  Users,
  Monitor,
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
  AnimatedH1,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

export const generateMetadata = buildMetadata("/services/managed-it/onboarding", {
  title: "30-Day IT Onboarding | Switch IT Providers — SeedTech",
  description:
    "Switch IT providers with zero disruption. SeedTech's 4-week phased onboarding covers discovery, silent deployment, go-live, and optimization. Most teams are fully onboarded in 5-10 days.",
  ogTitle: "30-Day IT Onboarding | Switch Providers with Zero Disruption",
  ogDescription:
    "Switch IT providers in 30 days with zero disruption. 4-week phased rollout: discovery, silent deployment, go-live, optimization.",
  canonical: "/services/managed-it/onboarding",
});

const phases = [
  {
    week: "Week 1",
    icon: Search,
    title: "Discovery & Documentation",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    items: [
      "Full environment audit — workstations, servers, network, cloud",
      "Document credentials, vendor contacts, and licensing",
      "Review existing backup and security configurations",
      "Identify critical applications and user workflows",
      "Establish secure admin access and emergency contacts",
    ],
  },
  {
    week: "Week 2",
    icon: Download,
    title: "Silent Deployment",
    color: "text-seed-400",
    bg: "bg-seed-500/10",
    items: [
      "Deploy NinjaOne RMM agents to all endpoints",
      "Install SentinelOne next-gen antivirus across fleet",
      "Configure cloud backup for critical data and systems",
      "Build custom monitoring and alerting policies",
      "Run side-by-side with your existing provider — zero disruption",
    ],
  },
  {
    week: "Week 3",
    icon: Rocket,
    title: "Go-Live & Cutover",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    items: [
      "Official transition to SeedTech as primary IT provider",
      "Help desk and ticket system goes live for all users",
      "Users receive onboarding welcome and support instructions",
      "First-week hyper-care with accelerated response times",
      "Decommission old provider access and agents",
    ],
  },
  {
    week: "Week 4",
    icon: Settings,
    title: "Optimization & Hardening",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    items: [
      "Review first-week ticket data for recurring patterns",
      "Build automation for repeat issues identified during rollout",
      "Fine-tune alerting thresholds and monitoring policies",
      "Deliver initial reporting dashboard to stakeholders",
      "Schedule first vCIO strategy session (Plus & Pro plans)",
    ],
  },
];

const concerns = [
  { icon: Clock, title: "Downtime During Switch", answer: "Our silent deployment runs alongside your current provider. Nothing changes for users until go-live day — and even then, the only visible difference is better support." },
  { icon: FileText, title: "Lost Documentation", answer: "We build your environment documentation from scratch during Week 1. Even if your current provider has poor records, we will have a complete picture before go-live." },
  { icon: Users, title: "User Confusion", answer: "Every user receives a clear onboarding guide with new support contacts, ticket submission process, and FAQs. We make it simple." },
  { icon: Shield, title: "Security Gaps", answer: "Security tools deploy in Week 2, before go-live. By the time we cut over, SentinelOne and monitoring are already running and tested." },
  { icon: Monitor, title: "Losing Access to Old Data", answer: "We coordinate directly with your outgoing provider to ensure complete data handoff, credential transfer, and licensing continuity." },
];

const faqs = [
  { q: "How long does onboarding actually take?", a: "Most teams are fully onboarded in 5-10 business days. The 30-day framework includes a buffer for complex environments and an optimization phase after go-live." },
  { q: "What do you need from us during onboarding?", a: "A primary point of contact, admin credentials for key systems, and about 2 hours total of your time across the 4 weeks. We handle everything else." },
  { q: "Will our employees experience any downtime?", a: "No. Our silent deployment runs alongside your current provider. Users see zero impact until go-live, and even then it is a seamless handoff." },
  { q: "What if our current provider is uncooperative?", a: "We have done this before. We can work directly from your admin consoles, rebuild documentation from scratch, and coordinate licensing transfers without needing their help." },
  { q: "Is there a fee for onboarding?", a: "No. Onboarding is included with every SeedCare plan. There are no setup fees, migration charges, or hidden costs." },
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
    { "@type": "ListItem", position: 3, name: "Onboarding", item: "https://seedtechllc.com/services/managed-it/onboarding" },
  ],
};

export default function OnboardingPage() {
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
            <span className="text-light-base/60">Onboarding</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 left-1/3 opacity-15" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Zero-Disruption Transition</LiquidGlassPill>
          <AnimatedH1 highlightWords={["30", "Days"]} className="mb-6 max-w-4xl">
            Switch IT Providers in 30 Days — Zero Downtime
          </AnimatedH1>
          <p className="text-body-lg text-light-base/60 max-w-2xl leading-relaxed mb-10">
            Afraid of disruption during a provider switch? Our 4-week phased rollout deploys
            silently alongside your current provider. Most teams are fully onboarded in 5-10 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteButton service="it-support" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl liquid-glass-tinted-seed liquid-glass-hover text-white text-sm font-medium transition-all duration-300 relative overflow-hidden">
              Start Your Transition <ArrowRight className="w-4 h-4" />
            </QuoteButton>
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl liquid-glass text-white text-sm font-medium transition-all duration-200">
              Free IT Assessment First
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The 30-Day Roadmap"
          title="Four Phases. Zero Surprises."
          description="Every step is planned, documented, and communicated. You know exactly what is happening and when."
          theme="light"
        />
        <div className="space-y-8 max-w-4xl mx-auto">
          {phases.map((phase) => (
            <div key={phase.week} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-xl ${phase.bg} flex items-center justify-center`}>
                  <phase.icon className={`w-6 h-6 ${phase.color}`} />
                </div>
                <div>
                  <p className="text-eyebrow uppercase tracking-widest text-dark-base/40 text-xs">{phase.week}</p>
                  <h3 className="font-display text-card-title text-dark-base">{phase.title}</h3>
                </div>
              </div>
              <ul className="space-y-3 pl-16">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-sm text-dark-base/60">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Addressing Concerns */}
      <Section>
        <SectionHeader
          eyebrow="We Know the Fear"
          title="Every Switching Concern, Addressed"
          description="Switching IT providers feels risky. Here is how we eliminate that risk at every step."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerns.map((c) => (
            <LiquidGlassCard key={c.title} className="p-7">
              <IconBox icon={c.icon} className="text-seed-400 mb-4" />
              <h3 className="font-display text-card-title text-white mb-3">{c.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{c.answer}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Stats Strip */}
      <Section theme="light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          {[
            { stat: "5-10", label: "business days — typical full onboarding" },
            { stat: "0", label: "hours of downtime during transition" },
            { stat: "$0", label: "setup or migration fees" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-8">
              <p className="text-display font-display text-dark-base mb-2">{s.stat}</p>
              <p className="text-body-sm text-dark-base/50">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Onboarding Questions" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          theme="light"
          title="Ready to Make the Switch?"
          description="Start with a free assessment. We will evaluate your environment and map out your onboarding in detail."
          primaryLabel="Schedule Free Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="See Plans & Pricing"
          secondaryHref="/services/managed-it/plans"
        />
      </Section>
    </div>
  );
}
