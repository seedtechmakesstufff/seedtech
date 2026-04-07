import Link from "next/link";
import type { Metadata } from "next";
import { DollarSign } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "What Does Managed IT Cost in NJ? | SeedTech — IT Pricing Guide",
  description: "Managed IT services in New Jersey typically cost $100-$300/user/month. See what's included, what drives the price, and how SeedTech's SeedCare plans compare.",
  alternates: { canonical: "/insights/what-does-managed-it-cost-nj" },
  openGraph: {
    title: "What Does Managed IT Cost in NJ? — SeedTech",
    description: "Managed IT pricing breakdown for New Jersey businesses. Per-user costs, what's included, and what to watch out for.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "What Does Managed IT Cost in NJ?" }],
  },
};

const faqs = [
  { q: "What is the average cost of managed IT services in NJ?", a: "Most managed IT providers in New Jersey charge between $100 and $300 per user per month. The price depends on the scope of services, response time guarantees, security tools included, and whether on-site support is covered." },
  { q: "Is per-user or per-device pricing better?", a: "Per-user pricing is generally more predictable. A single user might have a laptop, phone, and home workstation — per-device models charge for each. Per-user means one price covers all their devices." },
  { q: "Are there setup fees for managed IT?", a: "Many providers charge onboarding fees ranging from $500 to $5,000+ depending on complexity. SeedTech includes onboarding in the monthly price — no separate setup fee." },
  { q: "What's included in a managed IT plan vs. what costs extra?", a: "A good managed IT plan includes monitoring, patching, help desk, security tools, and backup. Watch for providers that list these as add-ons. If endpoint security or backup costs extra, the base price is misleading." },
  { q: "Can I switch managed IT providers without downtime?", a: "Yes. A well-managed transition takes 1-2 weeks. The new provider documents your systems, deploys their tools, and cuts over during a maintenance window. SeedTech handles the full transition process." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Article", headline: "What Does Managed IT Cost in NJ?",
  author: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  publisher: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  description: "A breakdown of managed IT pricing in New Jersey — per-user costs, what's included, and how to evaluate MSP proposals.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Insights", item: "https://seedtechllc.com/insights" },
  { "@type": "ListItem", position: 3, name: "What Does Managed IT Cost in NJ?", item: "https://seedtechllc.com/insights/what-does-managed-it-cost-nj" },
]};

export default function WhatDoesManagedITCostPage() {
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
            <span className="text-light-base/60">IT Cost in NJ</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><DollarSign className="w-3.5 h-3.5 mr-1.5" /> IT Pricing Guide</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-3xl text-heading-lg md:text-display">What Does Managed IT Cost in New Jersey?</AnimatedH1>
          <p className="text-body-lg leading-relaxed text-light-base/60 max-w-2xl">Managed IT services in New Jersey typically cost <strong className="text-light-base/80">$100 to $300 per user per month</strong>. The price depends on what&apos;s included — monitoring, help desk, security, backup — and whether those are bundled or billed separately.</p>
        </div>
      </section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl prose-container">
          <h2 className="font-display text-heading text-dark-base mb-4">How Managed IT Pricing Works</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">Most managed service providers (MSPs) in New Jersey use one of two pricing models: <strong>per-user</strong> or <strong>per-device</strong>. Per-user pricing is more common and more predictable — it covers everything a person uses regardless of how many devices they have.</p>

          <div className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight mb-8">
            <h3 className="font-display text-card-title text-dark-base mb-4">Typical NJ Managed IT Pricing Ranges</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
                <span className="text-body-sm text-dark-base/70">Basic monitoring + help desk only</span>
                <span className="font-medium text-dark-base">$80–$120/user/mo</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
                <span className="text-body-sm text-dark-base/70">Full managed IT (monitoring, security, backup, help desk)</span>
                <span className="font-medium text-dark-base">$120–$200/user/mo</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
                <span className="text-body-sm text-dark-base/70">Premium (compliance, DR, on-site included)</span>
                <span className="font-medium text-dark-base">$200–$300/user/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-dark-base/70">Enterprise / co-managed IT</span>
                <span className="font-medium text-dark-base">$300+/user/mo</span>
              </div>
            </div>
          </div>

          <h2 className="font-display text-heading text-dark-base mb-4">What Should Be Included</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-4">A well-structured managed IT plan should include these as standard — not as add-ons:</p>
          <ul className="space-y-2 mb-8">
            {[
              "24/7 monitoring of all workstations, servers, and network devices",
              "Help desk support — phone, email, or chat with a real technician",
              "Automated patching for OS and third-party applications",
              "Endpoint security (not just antivirus — real EDR like SentinelOne)",
              "Cloud backup with verified restores",
              "Microsoft 365 or Google Workspace administration",
              "Multi-factor authentication setup and management",
              "Vendor coordination (ISP, printer, phone system, LOB apps)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-seed-500 shrink-0" />
                <span className="text-body-sm text-dark-base/70">{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-display text-heading text-dark-base mb-4">What Drives the Price Up</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-4">Several factors push managed IT pricing higher:</p>
          <ul className="space-y-2 mb-8">
            {[
              "On-site support included (vs. remote-only)",
              "Compliance requirements (HIPAA, SOX, PCI-DSS)",
              "Complex infrastructure (on-prem servers, hybrid cloud, multiple locations)",
              "After-hours or 24/7 emergency support",
              "Disaster recovery with tested failover",
              "Legacy systems that require manual maintenance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-seed-500 shrink-0" />
                <span className="text-body-sm text-dark-base/70">{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-display text-heading text-dark-base mb-4">Red Flags in MSP Pricing</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">Not all managed IT quotes are created equal. Watch for these:</p>
          <div className="space-y-3 mb-8">
            {[
              { flag: "Endpoint security listed as an add-on", why: "Security should be included. If it's extra, the base price is incomplete." },
              { flag: "No backup in the base plan", why: "Backup is foundational. A plan without it isn't a managed plan." },
              { flag: "Multi-year contract required", why: "Good MSPs don't need lock-in. Month-to-month shows confidence." },
              { flag: "Vague 'unlimited support' with no SLA", why: "Unlimited means nothing without response time commitments." },
              { flag: "Setup fees over $2,000 for a small office", why: "Onboarding should be straightforward, not a profit center." },
            ].map((item) => (
              <div key={item.flag} className="rounded-xl border border-amber-100 bg-amber-50/30 p-5">
                <p className="font-medium text-dark-base text-body-sm mb-1">{item.flag}</p>
                <p className="text-body-sm text-dark-base/60">{item.why}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display text-heading text-dark-base mb-4">How SeedTech Prices IT Support</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-4">Our SeedCare plans are per-user, month-to-month, with no contracts and no setup fees:</p>
          <div className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight mb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
                <div><span className="font-medium text-dark-base">SeedCare Essentials</span><span className="text-body-sm text-dark-base/50 ml-2">Monitoring, patching, help desk, basic security</span></div>
                <span className="font-medium text-seed-600">$110/user/mo</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
                <div><span className="font-medium text-dark-base">SeedCare Plus</span><span className="text-body-sm text-dark-base/50 ml-2">+ SentinelOne, cloud backup, vendor mgmt</span></div>
                <span className="font-medium text-seed-600">$130/user/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <div><span className="font-medium text-dark-base">SeedCare Pro</span><span className="text-body-sm text-dark-base/50 ml-2">+ DR planning, compliance docs, priority SLA</span></div>
                <span className="font-medium text-seed-600">$160/user/mo</span>
              </div>
            </div>
          </div>
          <p className="text-body-sm text-dark-base/50 mb-8">Every plan includes NinjaOne monitoring, Microsoft 365 management, and direct access to a real technician. No ticket portals.</p>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Managed IT Cost — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Full overview of our managed IT services.</p></Link>
            <Link href="/insights/what-does-an-msp-do" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">What Does an MSP Do? →</h3><p className="text-body-sm text-dark-base/50">Understanding managed service providers.</p></Link>
            <Link href="/insights/when-to-switch-it-provider" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">When to Switch IT Providers →</h3><p className="text-body-sm text-dark-base/50">Signs it&apos;s time for a change.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Get a personalized quote for your business.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Want to Know What IT Would Cost for Your Business?" description="Get a free IT assessment. We&apos;ll review your systems and provide a clear, per-user quote — no pressure, no contracts." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
