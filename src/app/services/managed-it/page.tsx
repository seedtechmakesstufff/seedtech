import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Headphones,
  MessageSquare,
  Radar,
  Repeat,
  Monitor,
  Server,
  PhoneCall,
  Workflow,
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
  CheckList,
  AnimatedH1,
} from "@/components/kit";
import { FixingItRightTabs } from "@/components/managed-it/FixingItRightTabs";
import { AreasWeServeSection } from "@/components/home/AreasWeServeSection";
export const generateMetadata = buildMetadata("/services/managed-it");

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const sectionOneCards = [
  {
    icon: Radar,
    title: "Catch issues early where possible",
    body: "Monitoring and maintenance help identify many problems before they become bigger disruptions.",
  },
  {
    icon: Headphones,
    title: "Help your team get back to work quickly",
    body: "When something goes wrong, your team needs a clear path back to productivity.",
  },
  {
    icon: Repeat,
    title: "Reduce repeat issues",
    body: "A recurring issue usually means the real cause was never fully addressed.",
  },
  {
    icon: Shield,
    title: "Keep systems secure and supported",
    body: "Ongoing updates, protection, and oversight help reduce risk and keep things running more reliably.",
  },
  {
    icon: MessageSquare,
    title: "Getting support should feel easier",
    body: "Your team should know who to contact, what to expect, and what happens next.",
  },
  {
    icon: Workflow,
    title: "Improve your environment over time",
    body: "Great IT support should not just maintain the status quo. It should help your systems become more stable and better organized.",
  },
];

const sectionFourCards = [
  {
    icon: Headphones,
    title: "Help desk support",
    body: "Responsive support for your users during business hours when they need help.",
    href: "/help-desk-services-new-jersey",
  },
  {
    icon: Monitor,
    title: "Monitoring and maintenance",
    body: "Ongoing oversight of systems to catch issues early and keep devices running more reliably.",
    href: "/managed-it-services-new-jersey",
  },
  {
    icon: Shield,
    title: "Cybersecurity protection",
    body: "Endpoint protection, patching, and best-practice safeguards to help reduce risk.",
    href: "/cybersecurity-services-new-jersey",
  },
  {
    icon: Server,
    title: "Backup and recovery support",
    body: "Protection for important data and support for recovery planning when something goes wrong.",
    href: "/backup-disaster-recovery-new-jersey",
  },
  {
    icon: PhoneCall,
    title: "Vendor coordination",
    body: "Help working with internet providers, software vendors, phone providers, and other third parties when needed.",
    href: "/outsourced-it-support-new-jersey",
  },
  {
    icon: ClipboardList,
    title: "Guidance and recommendations",
    body: "Practical advice to help improve your environment over time, not just keep it running day to day.",
    href: "/services/managed-it/assessment",
  },
];

const tiers = [
  {
    icon: Shield, name: "SeedCare Essentials", price: "$110", unit: "/user/mo",
    description: "Baseline protection for small teams.",
    features: ["Unlimited remote help desk", "Endpoint monitoring", "Patch management", "Antivirus (SentinelOne)", "30-day cloud backup"],
  },
  {
    icon: ShieldCheck, name: "SeedCare Plus", price: "$130", unit: "/user/mo",
    description: "Ops-ready coverage with proactive monitoring.", highlight: true,
    features: ["Everything in Essentials", "Up to 4 hrs/mo on-site", "Network monitoring", "50 GB cloud backup", "Vendor coordination", "Monthly health reports"],
  },
  {
    icon: ShieldPlus, name: "SeedCare Pro", price: "$160", unit: "/user/mo",
    description: "Full-service IT for growing organizations.",
    features: ["Everything in Plus", "Unlimited on-site support", "Unlimited cloud backup", "Quarterly vCIO sessions", "Hardware refresh planning", "Priority response"],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Assessment",
    body: "We review your current environment, identify immediate concerns, and learn how your business operates.",
  },
  {
    step: "02",
    title: "Setup and Stabilization",
    body: "We put the right tools, protections, and visibility in place so support starts from a stronger foundation.",
  },
  {
    step: "03",
    title: "Ongoing Support",
    body: "Once everything is in place, we continue supporting your team, monitoring systems, and improving the environment over time.",
  },
];

const faqs = [
  {
    q: "What is included in managed IT support?",
    a: "Managed IT support typically includes help desk support, monitoring, maintenance, cybersecurity protection, backup support, and practical guidance to help keep your business running smoothly.",
  },
  {
    q: "Do you only fix problems after they happen?",
    a: "No. We use monitoring, maintenance, patching, and security tools to help identify many issues early. Not everything can be prevented, but proactive support helps reduce downtime and improve response.",
  },
  {
    q: "What if the same issue keeps happening?",
    a: "Recurring issues are usually a sign that the real problem has not been fully addressed. We work to identify the cause and recommend or implement a better long-term fix whenever possible.",
  },
  {
    q: "Can you support a growing business?",
    a: "Yes. Our support model is built around monitoring, documentation, automation, and clear ownership so we can stay organized and responsive as clients grow.",
  },
  {
    q: "How quickly can we get started?",
    a: "We begin with an assessment, then build a rollout plan based on your environment, priorities, and business needs. The goal is to make the transition clear and low-disruption.",
  },
  {
    q: "Do you offer after-hours support?",
    a: "We provide 24/7 monitoring, while live help desk support is during business hours. After-hours requests are handled based on urgency, project scope, special arrangement, or emergency need.",
  },
  {
    q: "Do you offer on-site support?",
    a: "Yes, when needed. Some issues can be handled remotely, while others are better addressed in person depending on the problem, location, and scope.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "We believe in earning trust through service and consistency. Plan structure and billing terms can be clearly outlined up front so expectations are simple.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed IT Services",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "moliva@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Proactive IT support designed to keep teams productive, systems secure, and day-to-day operations moving while reducing repeat problems over time.",
  offers: { "@type": "AggregateOffer", lowPrice: "110", highPrice: "160", priceCurrency: "USD", offerCount: "3" },
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
    { "@type": "ListItem", position: 2, name: "Services", item: "https://seedtechllc.com/services" },
    { "@type": "ListItem", position: 3, name: "Managed IT", item: "https://seedtechllc.com/services/managed-it" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ManagedITPage() {
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
            <Link href="/services" className="hover:text-light-base/50 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-light-base/60">Managed IT</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">Managed IT Services</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Proactive IT Support for Growing Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Technology should help your business run smoothly — not create more interruptions,
              confusion, or repeat problems.
            </p>
            <p>
              At SeedTech, we provide proactive IT support designed to keep your team productive,
              your systems secure, and your day-to-day operations moving. We focus on catching
              issues early when we can, responding quickly when something goes wrong, and working
              to prevent the same problems from happening again.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">
              Free IT Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services/managed-it/plans" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200">
              See Plans & Pricing
            </Link>
          </div>
        </div>
      </section>


      {/* Pricing Tiers */}
      <Section>
        <SectionHeader title="Simple Managed IT Support Plans" description="Choose the level of support that fits your business today, with room to grow as your needs evolve." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <LiquidGlassCard key={tier.name} className={`p-6 flex flex-col ${tier.highlight ? "liquid-glass-tinted-seed" : ""}`}>
              {tier.highlight && <LiquidGlassPill variant="seed" size="sm" className="self-start mb-4">Most Popular</LiquidGlassPill>}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center">
                  <tier.icon className="w-5 h-5 text-seed-400" />
                </div>
                <h3 className="font-display text-card-title text-white">{tier.name}</h3>
              </div>
              <p className="text-body-sm text-light-base/50 mb-4">{tier.description}</p>
              <div className="mb-5">
                <span className="font-display text-heading text-seed-400">{tier.price}</span>
                <span className="text-body-sm text-light-base/40">{tier.unit}</span>
              </div>
              <CheckList theme="dark" items={tier.features} className="mb-6 flex-1" />
              <Link href="/services/managed-it/plans" className={`w-full text-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${tier.highlight ? "liquid-glass-tinted-seed liquid-glass-hover text-white" : "liquid-glass text-white"}`}>
                Compare Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </LiquidGlassCard>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <Link href="/services/managed-it/plans" className="text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors">Full plan comparison & pricing calculator →</Link>
          <Link href="/services/managed-it/mobile-device-management" className="text-light-base/40 hover:text-light-base/60 text-sm transition-colors">MDM add-on from $12/device/mo →</Link>
        </div>
      </Section>
      {/* Section 2 — Tabbed: We Focus on Fixing It Right */}
      <Section>
        <SectionHeader
          eyebrow="How SeedTech Works"
          title="We Focus on Fixing It Right"
          description="When something breaks, we do not want to just patch it and move on. We want to help resolve the issue, understand what caused it, and reduce the chances of it happening again."
        />
        <FixingItRightTabs />
      </Section>
      {/* Section 1 */}
      <Section theme="light">
        <SectionHeader eyebrow="What Managed IT Should Actually Do" title="Support Should Do More Than Just Respond to Problems" description="Great IT support is not just about fixing something after it breaks. It is about helping your business stay productive, reducing unnecessary downtime, and making technology easier to manage over time." theme="light" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionOneCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <card.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4 */}
      <Section>
        <SectionHeader
          eyebrow="What’s Included"
          title="Managed IT Support Built Around the Day-to-Day Needs of Your Business"
          description="Our managed IT services are designed to cover the core pieces most businesses need to stay supported, secure, and productive."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionFourCards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <LiquidGlassCard className="p-7 h-full transition-all duration-200 group-hover:ring-1 group-hover:ring-white/20">
                <IconBox icon={card.icon} variant="gradient" className="mb-4" />
                <CardTitle className="mb-2 group-hover:text-seed-300 transition-colors">{card.title}</CardTitle>
                <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
              </LiquidGlassCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* Section 5 */}
      <Section theme="light">
        <SectionHeader eyebrow="Built for Growing Businesses" title="Structured to Support You as You Grow" description="Good IT support is not about being the loudest or most complicated provider. It is about having the right systems, the right process, and clear ownership." theme="light" />
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            SeedTech is built around proactive monitoring, automation, documentation, and direct
            accountability.
          </p>
          <p className="text-body-lg leading-relaxed text-dark-base/60">
            That helps us stay responsive, reduce unnecessary handoffs, and support clients in a
            way that feels organized, steady, and easy to work with.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Quicker response",
              "Less confusion",
              "Better follow-through",
              "A support experience that feels personal and consistent",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-black/[0.05] bg-white p-5 text-body-sm text-dark-base/70 shadow-cardLight">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-seed-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Section 6 */}
      <Section theme="light">
        <SectionHeader eyebrow="How We Get Started" title="A Clear Process from Assessment to Ongoing Support" description="We want onboarding to feel organized, not disruptive." theme="light" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((s) => (
            <div key={s.step} className="relative">
              <span className="font-display text-[4rem] leading-none text-seed-600/15 absolute -top-2 -left-1">{s.step}</span>
              <div className="pt-14">
                <h3 className="font-display text-card-title text-dark-base mb-3">{s.title}</h3>
                <p className="text-body-sm text-dark-base/60 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>


      {/* Areas We Serve */}
      <AreasWeServeSection />

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Frequently Asked Questions" align="left" theme="light" />
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
        <CTABanner title="Proactive IT Support for Growing Businesses" description="Technology should help your business run smoothly — not create more interruptions, confusion, or repeat problems." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="See Plans & Pricing" secondaryHref="/services/managed-it/plans" />
      </Section>
    </div>
  );
}
