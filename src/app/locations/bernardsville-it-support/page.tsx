import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, Building2, Briefcase, DollarSign, Stethoscope, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";
import { TrustedBySection } from "@/components/home/TrustedBySection";

export const metadata: Metadata = {
  title: "Bernardsville IT Support | SeedTech — Managed IT Services in Bernardsville, NJ",
  description: "SeedTech provides IT support for businesses in Bernardsville, NJ — monitoring, cybersecurity, cloud management, and responsive help desk. Call (914) 362-8889.",
  alternates: { canonical: "/locations/bernardsville-it-support" },
  openGraph: {
    title: "Bernardsville IT Support — SeedTech",
    description: "Managed IT services for Bernardsville businesses. Local NJ provider, proactive support, no long-term contracts.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Bernardsville IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "Endpoint monitoring", body: "Every device in your Bernardsville office is monitored 24/7. We detect hardware degradation, disk failures, and security anomalies before they cause problems." },
  { icon: Headphones, title: "Help desk access", body: "When your team needs help, they reach a real person — not a chatbot. We resolve most issues remotely within minutes and escalate on-site when needed." },
  { icon: Shield, title: "Security suite", body: "SentinelOne EDR, multi-factor authentication, conditional access policies, and automated patching. Protection designed for small professional offices." },
  { icon: Server, title: "Backup & cloud", body: "Cloud backup monitored daily through NinjaOne, Microsoft 365 management, and documented disaster recovery. Your data is safe and your cloud is properly configured." },
];

const localBusiness = [
  { icon: DollarSign, title: "Financial services", body: "Bernardsville has a concentration of wealth management firms, financial advisors, and family offices. We provide the secure, compliant IT infrastructure these businesses require — encrypted communications, access controls, and audit trails." },
  { icon: Stethoscope, title: "Healthcare practices", body: "Medical and dental offices along Morristown Road need HIPAA-aligned IT. We configure encrypted email, controlled access to patient systems, and compliant backup and retention policies." },
  { icon: Briefcase, title: "Professional services", body: "Attorneys, CPAs, and consultants in Bernardsville handle sensitive client data. We ensure systems are secure, communications are protected, and technology supports rather than complicates their practice." },
  { icon: Building2, title: "Local businesses", body: "From the shops on Mine Brook Road to offices throughout Bernardsville, local businesses need IT that works reliably without a full-time IT hire. That&apos;s the SeedCare model." },
];

const faqs = [
  { q: "Do you provide IT support on-site in Bernardsville?", a: "Yes. Bernardsville is within our core service area — about 35 minutes from our Hopatcong office. On-site visits are same-day for critical issues. Routine support is handled remotely for speed." },
  { q: "Do you work with financial services firms?", a: "Yes — financial services is one of our key verticals. We configure IT for compliance requirements including encrypted communications, access controls, data retention, and audit logging." },
  { q: "What makes SeedTech different from other IT companies?", a: "Month-to-month pricing with no contracts. Per-user billing so you know exactly what you're paying. Modern tools (NinjaOne, SentinelOne) instead of legacy software. And a help desk that actually picks up." },
  { q: "Can you migrate our office to Microsoft 365?", a: "Yes. We handle full M365 migrations — mailbox cutover, data migration, security configuration, and user training. Most Bernardsville offices can be migrated with zero downtime." },
  { q: "How much does IT support cost for a small Bernardsville office?", a: "SeedCare Essentials starts at $110/user/month. A 10-person office would be $1,100/month for full managed IT including monitoring, help desk, cybersecurity, and cloud backup." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Bernardsville NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "City", name: "Bernardsville", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses in Bernardsville, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Bernardsville IT Support", item: "https://seedtechllc.com/locations/bernardsville-it-support" },
]};

export default function BernardsvilleITSupportPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link><span>/</span>
            <Link href="/managed-it-services-new-jersey" className="hover:text-light-base/50 transition-colors">IT Services NJ</Link><span>/</span>
            <span className="text-light-base/60">Bernardsville</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><Building2 className="w-3.5 h-3.5 mr-1.5" /> Bernardsville, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Bernardsville Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Bernardsville sits at the crossroads of Somerset County&apos;s professional corridor — home to financial firms, medical practices, and businesses that handle sensitive data every day.</p>
            <p>SeedTech provides managed IT for Bernardsville businesses. Proactive monitoring, cybersecurity, cloud management, and a help desk that actually answers. No contracts, per-user pricing.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services in Bernardsville" description="Full managed IT — monitoring, security, support, and cloud — without the overhead of an internal hire." theme="light" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50"><s.icon className="h-5 w-5 text-seed-600" /></div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{s.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Local Businesses" title="Bernardsville Industries We Support" description="IT configured for the specific needs of Bernardsville&apos;s professional community." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Also Serving Nearby Communities</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech serves businesses across Somerset County and Morris County.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Basking Ridge", "Morristown", "Mendham", "Chester", "Parsippany", "Hopatcong", "Somerset County", "Morris County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <TrustedBySection />

      <Section>
        <SectionHeader title="IT Support in Bernardsville — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p></Link>
            <Link href="/locations/basking-ridge-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Basking Ridge IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in nearby Basking Ridge.</p></Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3><p className="text-body-sm text-dark-base/50">Protect sensitive client data.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Bernardsville?" description="Get a free assessment for your Bernardsville business. We&apos;ll review your infrastructure, identify risks, and show you what modern managed IT looks like." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
