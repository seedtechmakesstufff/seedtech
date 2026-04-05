import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, Building2, TreePine, Briefcase, Home, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Mendham IT Support | SeedTech — Managed IT Services in Mendham, NJ",
  description: "SeedTech provides IT support for businesses in Mendham, NJ — proactive monitoring, cybersecurity, cloud management, and responsive help desk. Call (914) 362-8889.",
  alternates: { canonical: "/locations/mendham-it-support" },
  openGraph: {
    title: "Mendham IT Support — SeedTech",
    description: "Managed IT services for Mendham businesses. Local provider, proactive support, no contracts.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mendham IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "Proactive monitoring", body: "We monitor your Mendham office systems 24/7 through NinjaOne — catching disk failures, resource issues, and security threats before they cause downtime." },
  { icon: Headphones, title: "Responsive help desk", body: "When something breaks or someone needs help, your team contacts us directly. No automated phone trees — real technicians who know your environment." },
  { icon: Shield, title: "Security & compliance", body: "SentinelOne endpoint protection, multi-factor authentication, and email filtering. Configured for the compliance requirements of professional services and healthcare." },
  { icon: Server, title: "Cloud & data protection", body: "Microsoft 365 administration, monitored cloud backup, and disaster recovery planning. Your business data is protected and recoverable." },
];

const localBusiness = [
  { icon: Briefcase, title: "Professional services", body: "Mendham&apos;s business community includes financial advisors, consultancies, and service firms that need reliable, secure IT without managing it themselves." },
  { icon: Home, title: "Home-based & hybrid businesses", body: "Many Mendham professionals work from home or run small businesses locally. We support hybrid setups with cloud access, VPN, and remote endpoint management." },
  { icon: TreePine, title: "Equestrian & rural businesses", body: "Mendham&apos;s rural character means internet connectivity and on-site infrastructure matter. We optimize what you have and ensure backup solutions work even with limited bandwidth." },
  { icon: Building2, title: "Small offices & retail", body: "From Main Street shops to small office suites, Mendham businesses need IT that works without a dedicated team. That&apos;s exactly what SeedCare provides." },
];

const faqs = [
  { q: "Do you provide on-site support in Mendham?", a: "Yes. Mendham is within our primary service area in Morris County. We handle on-site work for hardware, network, and new office setups. Most routine support is remote for speed." },
  { q: "We're a small business — is SeedTech a good fit?", a: "Absolutely. Our SeedCare plans are built for businesses with 5-100 users. Per-user pricing means a 5-person Mendham office pays the same rate per person as a 50-person company." },
  { q: "How do you handle internet connectivity issues in Mendham?", a: "Rural areas of Mendham can have spotty internet. We help optimize your existing connection, configure failover options where available, and ensure cloud services work reliably over your bandwidth." },
  { q: "What's the response time for Mendham businesses?", a: "Remote support begins within minutes. On-site visits to Mendham are typically same-day for urgent issues — we're based in Hopatcong, about 25 minutes away." },
  { q: "Do you support home offices in Mendham?", a: "Yes. Many of our clients have team members working from home. We manage their endpoints, configure VPN access, and ensure security policies apply whether they're in the office or at home." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Mendham NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "City", name: "Mendham", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses in Mendham, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Mendham IT Support", item: "https://seedtechllc.com/locations/mendham-it-support" },
]};

export default function MendhamITSupportPage() {
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
            <span className="text-light-base/60">Mendham</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><Building2 className="w-3.5 h-3.5 mr-1.5" /> Mendham, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Mendham Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Mendham is a tight-knit community with small businesses, professional service firms, and home-based operations that need reliable technology without enterprise complexity.</p>
            <p>SeedTech provides managed IT support for Mendham businesses — proactive monitoring, cybersecurity, cloud management, and a real help desk. Month-to-month, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Available in Mendham" description="Full managed IT for Mendham businesses — monitoring, support, security, and cloud. All included." theme="light" />
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
        <SectionHeader eyebrow="Local Businesses" title="Mendham Industries We Support" description="We understand the specific needs of Mendham&apos;s business community." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Also Serving Nearby Communities</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech provides IT support throughout Morris County and the surrounding region.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Morristown", "Chester", "Bernardsville", "Basking Ridge", "Hopatcong", "Parsippany", "Randolph", "Morris County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="IT Support in Mendham — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p></Link>
            <Link href="/locations/morristown-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Morristown IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in nearby Morristown.</p></Link>
            <Link href="/locations/chester-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Chester IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in nearby Chester.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">See where your IT stands today.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Mendham?" description="Get a free IT assessment for your Mendham business. No sales pitch — just an honest look at your systems and what proactive IT would look like." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
