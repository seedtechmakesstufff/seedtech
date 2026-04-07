import Link from "next/link";
import type { Metadata } from "next";
import { AlertOctagon, Clock, ShieldOff, Ghost, Repeat, FileWarning, BugOff } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Signs Your IT Company Is Failing You | SeedTech — Red Flags to Watch For",
  description: "Slow responses, recurring issues, no security updates? Here are the signs your IT company isn't doing their job — and what to do about it.",
  alternates: { canonical: "/insights/signs-your-it-company-is-failing" },
  openGraph: {
    title: "Signs Your IT Company Is Failing You — SeedTech",
    description: "Red flags that your IT provider is underperforming — and what good IT support should look like.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Signs Your IT Company Is Failing You" }],
  },
};

const signs = [
  { icon: Clock, number: "1", title: "Response times are getting worse", detail: "Early in the relationship they answered quickly. Now it takes hours to get a callback and days to resolve anything. This usually means they've taken on too many clients without adding staff." },
  { icon: Repeat, number: "2", title: "The same issues keep coming back", detail: "If the same printer, VPN, or email problem recurs every month, your IT company is applying band-aids instead of fixing root causes. Proper managed IT means identifying why something broke — not just rebooting it." },
  { icon: Ghost, number: "3", title: "You never hear from them proactively", detail: "A good IT provider reaches out with recommendations, security updates, and quarterly reviews. If you only hear from them when you call with a problem — or when the invoice arrives — they're not managing anything." },
  { icon: ShieldOff, number: "4", title: "You don't know what security tools are running", detail: "Ask your IT company: what endpoint security is on our machines? When were patches last applied? Is MFA enabled on all accounts? If they can't answer immediately, your security posture is a guess." },
  { icon: FileWarning, number: "5", title: "There's no documentation", detail: "No network diagram. No password vault. No asset inventory. No written disaster recovery plan. If your IT company walked away tomorrow, would you be able to hand off to someone else? No documentation means no." },
  { icon: BugOff, number: "6", title: "They're still using outdated tools", detail: "If your IT company is running basic antivirus instead of EDR, managing passwords in a spreadsheet, or remoting into machines with TeamViewer instead of an RMM platform — their toolkit hasn't been updated in a decade." },
];

const faqs = [
  { q: "How do I know if my IT company is actually monitoring my systems?", a: "Ask them to show you. A real monitoring platform (like NinjaOne or ConnectWise) produces dashboards showing device health, patch compliance, and alert history. If they can't show you a dashboard, they're not monitoring." },
  { q: "My IT company says everything is fine — how do I verify?", a: "Request a third-party IT assessment. An independent audit will check your security posture, backup status, patch levels, and network configuration. The results often reveal gaps your current provider missed or ignored." },
  { q: "Is it normal for IT issues to take days to resolve?", a: "For critical issues, no. Server outages, security incidents, and system-wide failures should be addressed within hours. Non-critical requests (new user setup, software installs) might take a business day. Multi-day resolution times for any issue suggest understaffing." },
  { q: "What should I expect from a managed IT provider?", a: "Proactive monitoring, fast help desk response, regular security patching, verified backups, and periodic business reviews. You should feel like someone is watching your systems — not just waiting for your call." },
  { q: "Should I confront my IT company about these issues?", a: "Yes, but with specifics. Document response times, recurring issues, and unanswered questions. Present them clearly. A good provider will acknowledge gaps and present a plan. If they get defensive or dismissive, that tells you everything." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Article", headline: "Signs Your IT Company Is Failing You",
  author: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  publisher: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  description: "Red flags that your IT provider is underperforming — slow responses, recurring issues, no security, no documentation.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Insights", item: "https://seedtechllc.com/insights" },
  { "@type": "ListItem", position: 3, name: "Signs Your IT Company Is Failing", item: "https://seedtechllc.com/insights/signs-your-it-company-is-failing" },
]};

export default function SignsYourITCompanyIsFailingPage() {
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
            <span className="text-light-base/60">IT Red Flags</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><AlertOctagon className="w-3.5 h-3.5 mr-1.5" /> IT Red Flags</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-3xl text-heading-lg md:text-display">Signs Your IT Company Is Failing You</AnimatedH1>
          <p className="text-body-lg leading-relaxed text-light-base/60 max-w-2xl">Most businesses don&apos;t realize their IT provider is underperforming until something goes seriously wrong — a data breach, a multi-day outage, or a failed backup when it mattered most. <strong className="text-light-base/80">Here are the warning signs to watch for before that happens.</strong></p>
        </div>
      </section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-8">6 Signs Your IT Provider Isn&apos;t Doing Their Job</h2>
          <div className="space-y-5">
            {signs.map((sign) => (
              <div key={sign.number} className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 shrink-0"><sign.icon className="h-5 w-5 text-red-600" /></div>
                  <div>
                    <h3 className="font-display text-card-title text-dark-base mb-2"><span className="text-red-500 mr-2">#{sign.number}</span>{sign.title}</h3>
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
          <h2 className="font-display text-heading text-white mb-6">What Good IT Support Looks Like</h2>
          <p className="text-body leading-relaxed text-light-base/60 mb-8">For contrast, here&apos;s what you should expect from a competent managed IT provider:</p>
          <div className="space-y-4">
            {[
              { title: "Fast, direct support", desc: "Your employees call and reach a real person. Critical issues get response within minutes, not hours." },
              { title: "Proactive communication", desc: "Your IT provider reaches out to you with recommendations, not just invoices. Quarterly reviews, security updates, and hardware lifecycle planning." },
              { title: "Visible security posture", desc: "You know exactly what tools are running, when patches were last applied, and what your MFA coverage looks like. The MSP can show you a dashboard." },
              { title: "Documented environment", desc: "Network diagrams, asset inventories, password vaults, and disaster recovery procedures — all maintained and current." },
              { title: "Root cause resolution", desc: "When something breaks, the MSP fixes it AND explains why it happened and how they're preventing it from happening again." },
            ].map((item) => (
              <LiquidGlassCard key={item.title} className="p-6">
                <h3 className="font-display text-card-title text-white mb-2">{item.title}</h3>
                <p className="text-body-sm text-light-base/55 leading-relaxed">{item.desc}</p>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-4">What to Do If You See These Signs</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">Don&apos;t panic, but don&apos;t ignore it either. Here&apos;s a practical path forward:</p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Document specific issues", desc: "Track response times, recurring problems, and unanswered questions. Specifics are more useful than general frustration." },
              { step: "2", title: "Have a direct conversation", desc: "Present your concerns clearly. A good provider will acknowledge gaps and present a remediation plan. A bad one will get defensive." },
              { step: "3", title: "Get a second opinion", desc: "Request an independent IT assessment from another provider. This reveals the actual state of your systems — patches, backups, security, documentation." },
              { step: "4", title: "Plan the transition (if needed)", desc: "If the conversation doesn't produce results, start planning. A new MSP can transition your systems in 1-2 weeks with zero downtime." },
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
        <SectionHeader title="IT Provider Red Flags — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">What proactive IT actually looks like.</p></Link>
            <Link href="/insights/when-to-switch-it-provider" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">When to Switch IT Providers →</h3><p className="text-body-sm text-dark-base/50">How to evaluate and transition.</p></Link>
            <Link href="/insights/what-does-an-msp-do" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">What Does an MSP Do? →</h3><p className="text-body-sm text-dark-base/50">Understand managed service providers.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Find out what your IT is really doing.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Not Sure If Your IT Provider Is Doing Their Job?" description="Get a free, independent IT assessment. We&apos;ll check your security posture, backup status, and patch levels — and give you an honest report." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
