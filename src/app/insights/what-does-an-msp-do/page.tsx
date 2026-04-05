import Link from "next/link";
import type { Metadata } from "next";
import { HelpCircle, Monitor, Shield, Headphones, Server, Settings, Users } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "What Does an MSP Do? | SeedTech — Managed Service Provider Explained",
  description: "A managed service provider (MSP) handles your IT infrastructure — monitoring, security, help desk, backup, and vendor management. Here's what that means in practice.",
  alternates: { canonical: "/insights/what-does-an-msp-do" },
  openGraph: {
    title: "What Does an MSP Do? — SeedTech",
    description: "What a managed service provider actually does, what's included, and how to tell if you need one.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "What Does an MSP Do?" }],
  },
};

const mspServices = [
  { icon: Monitor, title: "System monitoring", body: "An MSP installs monitoring agents on every workstation, server, and network device. These agents track hardware health, disk space, CPU usage, memory, and security events in real time — and alert the MSP team when something needs attention." },
  { icon: Shield, title: "Cybersecurity", body: "This includes endpoint detection and response (EDR), email filtering, DNS security, multi-factor authentication, and automated patching. A good MSP layers multiple security tools — not just antivirus — to protect against modern threats." },
  { icon: Headphones, title: "Help desk support", body: "When your employees have IT problems — a frozen screen, a printer issue, a VPN that won't connect — the MSP is who they call. A good MSP provides direct access to a technician, not a ticket queue." },
  { icon: Server, title: "Backup & disaster recovery", body: "An MSP configures and monitors your backups — verifying that they complete successfully and that data can actually be restored. This includes file-level backup, full image backup, and disaster recovery planning." },
  { icon: Settings, title: "Cloud & infrastructure management", body: "This covers Microsoft 365 administration, cloud storage management, server maintenance, network configuration, and keeping all your systems updated and properly licensed." },
  { icon: Users, title: "Vendor coordination", body: "When your internet goes down, your phone system breaks, or your line-of-business software has a bug — the MSP coordinates with those vendors on your behalf. You make one call; they handle the rest." },
];

const faqs = [
  { q: "What does MSP stand for?", a: "MSP stands for Managed Service Provider. It's a company that manages some or all of a business's IT infrastructure and support on an ongoing, subscription basis — as opposed to break-fix IT, where you only call when something breaks." },
  { q: "How is an MSP different from a break-fix IT company?", a: "Break-fix IT charges by the hour and only works when you call. An MSP charges a flat monthly fee and proactively monitors, maintains, and secures your systems. The goal is to prevent problems, not just fix them." },
  { q: "Does my small business need an MSP?", a: "If you have 5+ employees using computers and you don't have an in-house IT person, an MSP is likely the most cost-effective way to keep your systems secure, maintained, and supported. Even a 10-person office has real IT needs." },
  { q: "What size companies use MSPs?", a: "Most MSPs work with businesses between 5 and 500 users. Companies smaller than that often rely on break-fix or a part-time IT person. Companies larger than that usually have internal IT departments (sometimes supplemented by co-managed MSP services)." },
  { q: "Can an MSP replace our internal IT person?", a: "Often, yes. An MSP provides a full team — help desk, security, infrastructure — for less than the cost of one full-time IT employee. For businesses with an existing IT person, an MSP can also work alongside them (co-managed IT)." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Article", headline: "What Does an MSP Do?",
  author: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  publisher: { "@type": "Organization", name: "SeedTech", url: "https://seedtechllc.com" },
  description: "A clear explanation of what managed service providers do, what's included, and how to evaluate whether your business needs one.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Insights", item: "https://seedtechllc.com/insights" },
  { "@type": "ListItem", position: 3, name: "What Does an MSP Do?", item: "https://seedtechllc.com/insights/what-does-an-msp-do" },
]};

export default function WhatDoesAnMSPDoPage() {
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
            <span className="text-light-base/60">What Does an MSP Do?</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><HelpCircle className="w-3.5 h-3.5 mr-1.5" /> MSP Explained</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-3xl text-heading-lg md:text-display">What Does a Managed Service Provider (MSP) Actually Do?</AnimatedH1>
          <p className="text-body-lg leading-relaxed text-light-base/60 max-w-2xl">A managed service provider <strong className="text-light-base/80">handles your IT infrastructure on an ongoing basis</strong> — monitoring your systems, securing your data, supporting your employees, and managing your technology vendors. Think of it as an outsourced IT department that works proactively, not just when something breaks.</p>
        </div>
      </section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-4">MSP vs. Break-Fix IT</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">There are two models for business IT support:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-6">
              <h3 className="font-display text-card-title text-dark-base mb-2">Break-Fix IT</h3>
              <ul className="space-y-2">
                {["Call when something breaks", "Billed by the hour", "No ongoing monitoring", "Reactive only", "No incentive to prevent problems"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-sm text-dark-base/60">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-seed-100 bg-seed-50/30 p-6">
              <h3 className="font-display text-card-title text-dark-base mb-2">Managed IT (MSP)</h3>
              <ul className="space-y-2">
                {["Proactive monitoring 24/7", "Flat monthly fee per user", "Security included", "Issues prevented before they happen", "Aligned incentive: fewer problems = better service"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-sm text-dark-base/60">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-seed-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-body leading-relaxed text-dark-base/70">The key difference: a break-fix company makes money when things go wrong. An MSP makes money when things run smoothly. The incentives are completely different.</p>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Core Services" title="What an MSP Manages" description="Here's what a full-service managed IT provider typically handles." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mspServices.map((s) => (<LiquidGlassCard key={s.title} className="p-7"><IconBox icon={s.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{s.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{s.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-heading text-dark-base mb-4">Do You Need an MSP?</h2>
          <p className="text-body leading-relaxed text-dark-base/70 mb-6">You likely need a managed service provider if any of these apply:</p>
          <ul className="space-y-3 mb-8">
            {[
              "You have 5+ employees who use computers for daily work",
              "You don't have a full-time, dedicated IT person on staff",
              "Your current IT support is reactive — they only show up when something breaks",
              "You're not sure what security tools are running on your systems",
              "You've had the same IT problem more than twice in the past year",
              "Your business handles sensitive client data (financial, medical, legal)",
              "You're growing and your IT hasn't kept pace",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-seed-500 shrink-0" />
                <span className="text-body-sm text-dark-base/70">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-body leading-relaxed text-dark-base/70">If three or more of these describe your situation, managed IT is almost certainly more cost-effective — and more secure — than what you&apos;re doing now.</p>
        </div>
      </Section>

      <Section>
        <SectionHeader title="MSP Basics — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">See how SeedTech does managed IT.</p></Link>
            <Link href="/insights/what-does-managed-it-cost-nj" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">What Does Managed IT Cost? →</h3><p className="text-body-sm text-dark-base/50">NJ pricing breakdown.</p></Link>
            <Link href="/insights/when-to-switch-it-provider" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">When to Switch IT Providers →</h3><p className="text-body-sm text-dark-base/50">Signs it&apos;s time for a change.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Find out if you need managed IT.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Want to See What Managed IT Looks Like?" description="Get a free IT assessment. We&apos;ll review your current setup and show you exactly what a managed IT provider would handle — and what it would cost." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
