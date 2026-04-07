import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Clock, ShieldOff, MessageCircleX, TrendingDown } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "When to Switch IT Providers | SeedTech — Signs It's Time for a Change",
  description: "Not sure if your IT provider is doing a good job? Here are the warning signs that it's time to switch — and how to transition without disruption.",
  alternates: { canonical: "/insights/when-to-switch-it-provider" },
  openGraph: {
    title: "When to Switch IT Providers — SeedTech",
    description: "Warning signs your IT provider isn't working. How to evaluate, transition, and find a better fit.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "When to Switch IT Providers" }],
  },
};

const warningSignsDetailed = [
  { icon: Clock, title: "Slow response times", detail: "If your team waits hours — or days — for help on basic issues, your provider is either understaffed or deprioritizing you. A good MSP responds to critical issues within minutes, not hours." },
  { icon: ShieldOff, title: "No proactive security", detail: "If your provider only reacts to problems after they happen, they're not managing your IT — they're just fixing it. Ask: do they run endpoint detection? Patch automatically? Monitor 24/7? If you don't know, the answer is probably no." },
  { icon: MessageCircleX, title: "Poor communication", detail: "You shouldn't have to chase your IT company for updates. If tickets go into a black hole and nobody follows up, that's a relationship problem masquerading as an IT problem." },
  { icon: TrendingDown, title: "Recurring issues", detail: "The same printer failure, the same email problem, the same VPN drop. If issues keep coming back, your provider is treating symptoms instead of fixing root causes." },
  { icon: AlertTriangle, title: "No documentation", detail: "If your IT provider can't produce a network diagram, a password vault, or a list of your assets — they're operating blind. And so are you, if you ever need to switch." },
];

const faqs = [
  { q: "How long does it take to switch IT providers?", a: "A well-managed transition takes 1-2 weeks. The new provider documents your environment, deploys monitoring agents, configures security policies, and cuts over during a planned maintenance window. There should be zero downtime." },
  { q: "Will my current provider cooperate with the transition?", a: "Most do. Reputable providers will hand over credentials, documentation, and access. If yours refuses, that's another red flag — and a good new provider knows how to handle uncooperative handoffs." },
  { q: "What if I'm in a contract with my current IT provider?", a: "Review the termination clause. Many MSP contracts allow 30-60 day notice. If you're locked into a multi-year deal, you can still start planning the transition and engage your new provider for the overlap period." },
  { q: "How do I evaluate a new IT provider before switching?", a: "Ask for their security stack, response time SLA, backup verification process, and a reference from a similar-sized business. A good provider will also offer a free assessment of your current environment before quoting." },
  { q: "Can I switch without my employees noticing?", a: "Yes, that's the goal. The new provider deploys their tools in the background, tests everything, and transitions support on a scheduled date. Your team just gets a new number to call — and faster responses." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Article", headline: "When to Switch IT Providers",
  author: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  publisher: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  description: "Warning signs that your IT provider isn't working — and how to switch without disruption.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Insights", item: "https://seedtechllc.com/insights" },
  { "@type": "ListItem", position: 3, name: "When to Switch IT Providers", item: "https://seedtechllc.com/insights/when-to-switch-it-provider" },
]};

export default function WhenToSwitchITProviderPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link><span>/</span>
            <Link href="/insights" className="hover:text-light-base/50 transition-colors">Insights</Link><span>/</span>
            <span className="text-light-base/60">When to Switch</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> IT Provider Evaluation</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-3xl text-heading-lg md:text-display">When Should You Switch IT Providers?</AnimatedH1>
          <p className="text-body-lg leading-relaxed text-light-base/60 max-w-2xl">If you&apos;re asking the question, you probably already know the answer. <strong className="text-light-base/80">The most common reason businesses switch IT providers is slow response times</strong> — followed by recurring issues, poor communication, and a general sense that nobody is actually watching the systems.</p>
        </div>
      </section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-6">5 Warning Signs Your IT Provider Isn&apos;t Working</h2>
          <div className="space-y-4">
            {warningSignsDetailed.map((sign) => (
              <div key={sign.title} className="rounded-2xl border border-amber-100 bg-amber-50/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shrink-0"><sign.icon className="h-5 w-5 text-amber-700" /></div>
                  <div>
                    <h3 className="font-display text-card-title text-dark-base mb-2">{sign.title}</h3>
                    <p className="text-body-sm leading-relaxed text-dark-base/60">{sign.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-white mb-6">How to Evaluate Your Current Provider</h2>
          <p className="text-body leading-relaxed text-light-base/60 mb-8">Before switching, do a quick internal audit. Ask yourself these questions:</p>
          <div className="space-y-4">
            {[
              "When was the last time they proactively reached out to us about a risk or recommendation?",
              "Can they produce a current inventory of our hardware, software, and user accounts?",
              "Do we know what security tools are running on our systems right now?",
              "How long does it typically take to get a response when we have a problem?",
              "Have we had the same issue more than twice in the past 6 months?",
              "Do they have a backup of our data — and have they tested it recently?",
            ].map((q) => (
              <LiquidGlassCard key={q} className="p-5">
                <p className="text-body-sm text-light-base/70 leading-relaxed">{q}</p>
              </LiquidGlassCard>
            ))}
          </div>
          <p className="text-body leading-relaxed text-light-base/60 mt-6">If you answered &quot;no&quot; or &quot;I don&apos;t know&quot; to more than two of these, your IT is undermanaged.</p>
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-4">What a Good Transition Looks Like</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">Switching IT providers doesn&apos;t have to be painful. Here&apos;s what a well-managed transition looks like:</p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Discovery & documentation", desc: "The new provider audits your current environment — hardware, software, accounts, security config, backup status. This happens before any changes." },
              { step: "2", title: "Tool deployment", desc: "Monitoring agents, security software, and backup tools are deployed alongside your existing setup. Nothing gets removed until everything is verified." },
              { step: "3", title: "Parallel operation", desc: "Both providers run simultaneously for a brief overlap period. The new team tests everything and confirms baseline performance." },
              { step: "4", title: "Cutover", desc: "Support transitions to the new provider. Your team gets new contact information. Old tools are removed. Zero downtime." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-seed-50 text-seed-600 font-medium text-sm shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-display text-card-title text-dark-base mb-1">{item.title}</h3>
                  <p className="text-body-sm leading-relaxed text-dark-base/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Switching IT Providers — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">See what proactive IT looks like.</p></Link>
            <Link href="/insights/signs-your-it-company-is-failing" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Signs Your IT Company Is Failing →</h3><p className="text-body-sm text-dark-base/50">Deeper dive into IT red flags.</p></Link>
            <Link href="/insights/what-does-managed-it-cost-nj" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">What Does Managed IT Cost? →</h3><p className="text-body-sm text-dark-base/50">NJ pricing breakdown.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">See where your IT actually stands.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Thinking About Switching?" description="Get a free IT assessment. We&apos;ll review your current setup, document what we find, and give you an honest recommendation — even if the answer is to stay with your current provider." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
