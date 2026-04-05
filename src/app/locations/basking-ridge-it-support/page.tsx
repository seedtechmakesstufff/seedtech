import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, Building2, FlaskConical, Briefcase, Stethoscope, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Basking Ridge IT Support | SeedTech — Managed IT Services in Basking Ridge, NJ",
  description: "SeedTech provides IT support for Basking Ridge businesses — proactive monitoring, cybersecurity, cloud management, and help desk. Call (914) 362-8889.",
  alternates: { canonical: "/locations/basking-ridge-it-support" },
  openGraph: {
    title: "Basking Ridge IT Support — SeedTech",
    description: "Managed IT services for Basking Ridge businesses. Proactive support, cybersecurity, and cloud management from a local NJ provider.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Basking Ridge IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "Infrastructure monitoring", body: "Servers, workstations, and network equipment in your Basking Ridge office are monitored 24/7. We get alerted on failures, performance issues, and security events before they impact your team." },
  { icon: Headphones, title: "Help desk", body: "Direct access to our support team for every employee. No ticket queues, no automated responses — technicians who know your environment and resolve issues quickly." },
  { icon: Shield, title: "Enterprise-grade security", body: "SentinelOne endpoint detection, MFA enforcement, email security, and automated patch management. Security that matches the standards your corporate neighbors expect." },
  { icon: Server, title: "Cloud management", body: "Microsoft 365 administration, cloud backup, license optimization, and hybrid cloud support. We manage the complexity so your team just uses the tools." },
];

const localBusiness = [
  { icon: FlaskConical, title: "Pharma & biotech", body: "Basking Ridge is home to major pharmaceutical operations and the biotech firms that support them. We provide IT for smaller life sciences companies that need compliant, secure infrastructure without enterprise overhead." },
  { icon: Briefcase, title: "Corporate services", body: "The corporate campus environment around Basking Ridge creates a strong professional services ecosystem — consultancies, staffing firms, and business services. We manage IT for these growing companies." },
  { icon: Stethoscope, title: "Medical offices", body: "Healthcare providers in the Basking Ridge area need HIPAA-compliant IT — encrypted email, access controls, compliant backup, and documented security policies. We configure all of it." },
  { icon: Building2, title: "Growing companies", body: "Basking Ridge&apos;s business parks attract companies that are scaling. We provide IT infrastructure that grows with your team — add users month-to-month, no renegotiation required." },
];

const faqs = [
  { q: "Do you support businesses in the Basking Ridge corporate parks?", a: "Yes. We support businesses throughout Basking Ridge including the office parks along Allen Road, North Maple Avenue, and surrounding areas. On-site response is same-day for critical issues." },
  { q: "Can you handle compliance requirements for life sciences companies?", a: "We configure IT infrastructure for compliance with common frameworks including HIPAA, SOC 2 controls, and data retention requirements. We're not a compliance firm, but we build the technical foundation these standards require." },
  { q: "How does pricing work for a growing Basking Ridge company?", a: "SeedCare is per-user, month-to-month. When you hire, add a user. When someone leaves, remove them. No annual true-ups, no minimum commitments. Starts at $110/user/month." },
  { q: "What's the difference between SeedTech and the big MSPs?", a: "We're smaller, faster, and more accountable. You won't be account number 847. Our clients get direct access to the team that manages their systems — no layers of account managers between you and support." },
  { q: "Can you manage our existing server infrastructure?", a: "Yes. We manage on-premises servers, hybrid environments, and cloud-only setups. During onboarding we assess your current infrastructure and recommend what to keep, what to migrate, and what to replace." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Basking Ridge NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "City", name: "Basking Ridge", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses in Basking Ridge, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Basking Ridge IT Support", item: "https://seedtechllc.com/locations/basking-ridge-it-support" },
]};

export default function BaskingRidgeITSupportPage() {
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
            <span className="text-light-base/60">Basking Ridge</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><Building2 className="w-3.5 h-3.5 mr-1.5" /> Basking Ridge, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Basking Ridge Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Basking Ridge is a corporate hub — pharmaceutical companies, professional services firms, and growing businesses that demand reliable, secure technology.</p>
            <p>SeedTech provides managed IT for Basking Ridge businesses. Monitoring, cybersecurity, cloud management, and a help desk your team will actually use. Per-user pricing, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services in Basking Ridge" description="Everything your Basking Ridge business needs from IT — without the overhead of building it internally." theme="light" />
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
        <SectionHeader eyebrow="Local Businesses" title="Basking Ridge Industries We Support" description="IT services tailored to the industries that define Basking Ridge&apos;s economy." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Also Serving Nearby Communities</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech provides IT support across Somerset County and into Morris County.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Bernardsville", "Morristown", "Mendham", "Chester", "Parsippany", "Somerset County", "Morris County", "Union County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="IT Support in Basking Ridge — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p></Link>
            <Link href="/locations/bernardsville-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Bernardsville IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Bernardsville.</p></Link>
            <Link href="/cloud-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cloud Services NJ →</h3><p className="text-body-sm text-dark-base/50">M365 management and cloud migration.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">See where your IT stands today.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Basking Ridge?" description="Get a free IT assessment for your Basking Ridge business. We&apos;ll evaluate your systems, security posture, and cloud configuration — no sales pitch." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
