import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, Building2, Landmark, ShoppingBag, Wrench, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";
import { TrustedBySection } from "@/components/home/TrustedBySection";

export const metadata: Metadata = {
  title: "Chester IT Support | SeedTech — Managed IT Services in Chester, NJ",
  description: "SeedTech provides IT support for businesses in Chester, NJ — monitoring, cybersecurity, help desk, and cloud management for local businesses. Call (914) 362-8889.",
  alternates: { canonical: "/locations/chester-it-support" },
  openGraph: {
    title: "Chester IT Support — SeedTech",
    description: "Managed IT services for Chester businesses. Local NJ provider with proactive support and no contracts.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Chester IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "System monitoring", body: "Continuous monitoring of your Chester office workstations, servers, and network equipment. We detect and resolve issues before they affect your operations." },
  { icon: Headphones, title: "Direct help desk", body: "Your team gets direct access to real technicians — not a call center. We handle everything from password resets to complex network issues." },
  { icon: Shield, title: "Cybersecurity protection", body: "SentinelOne endpoint security, MFA enforcement, and email filtering protect your business from ransomware, phishing, and credential theft." },
  { icon: Server, title: "Cloud & backup management", body: "Microsoft 365 administration, cloud backup through NinjaOne, and documented disaster recovery. Your data is always protected and accessible." },
];

const localBusiness = [
  { icon: ShoppingBag, title: "Retail & hospitality", body: "Chester&apos;s historic downtown is home to boutiques, restaurants, and specialty shops. We manage POS system connectivity, guest Wi-Fi, and back-office technology for retail and hospitality businesses." },
  { icon: Wrench, title: "Trades & contractors", body: "Contractors and trade businesses operating from Chester need mobile-friendly IT — cloud access to plans, estimates, and scheduling from the field, with secure office systems back at base." },
  { icon: Landmark, title: "Professional offices", body: "Accountants, attorneys, and consultants with offices along Main Street need secure, compliant IT. We configure systems for data privacy and professional standards." },
  { icon: Building2, title: "Small businesses", body: "Chester&apos;s small-town character means many businesses run lean. SeedCare gives you enterprise-grade IT at a price point that works for a 5-person team." },
];

const faqs = [
  { q: "Do you serve businesses in Chester Borough and Chester Township?", a: "Yes, we serve both Chester Borough (the downtown area) and the broader Chester Township. On-site support is available for both — we're about 20 minutes away in Hopatcong." },
  { q: "Can you help with POS and retail technology?", a: "We support the infrastructure around POS systems — network connectivity, secure Wi-Fi, and backup. For the POS software itself, we coordinate with your vendor while managing the underlying technology." },
  { q: "What size business do you work with in Chester?", a: "Our SeedCare plans work for businesses with 5-100 users. Many Chester clients are in the 5-20 user range. Per-user pricing means you only pay for what you need." },
  { q: "How quickly can you get to Chester for on-site work?", a: "Chester is about 20 minutes from our Hopatcong office. We can typically be on-site same-day for urgent issues. Most routine support is handled remotely for faster resolution." },
  { q: "Do you offer IT support without a long-term contract?", a: "Yes — all SeedCare plans are month-to-month. No annual contracts, no cancellation fees. You stay because the service works, not because you're locked in." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Chester NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "City", name: "Chester", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses in Chester, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Chester IT Support", item: "https://seedtechllc.com/locations/chester-it-support" },
]};

export default function ChesterITSupportPage() {
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
            <span className="text-light-base/60">Chester</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><Building2 className="w-3.5 h-3.5 mr-1.5" /> Chester, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Chester Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Chester&apos;s downtown is a destination — boutiques, restaurants, and professional offices lining a historic Main Street. The businesses here run lean, and technology needs to be reliable without being complicated.</p>
            <p>SeedTech provides managed IT support for Chester businesses — monitoring, security, help desk, and cloud management. Flat-rate pricing, no contracts, and a team that picks up the phone.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Available in Chester" description="Everything a Chester business needs — managed, monitored, and supported." theme="light" />
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
        <SectionHeader eyebrow="Local Businesses" title="Chester Industries We Support" description="IT tailored to the businesses that make Chester&apos;s economy run." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Also Serving Nearby Communities</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech provides IT support throughout Morris County and western New Jersey.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Mendham", "Morristown", "Bernardsville", "Basking Ridge", "Netcong", "Stanhope", "Dover", "Morris County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <TrustedBySection />

      <Section>
        <SectionHeader title="IT Support in Chester — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p></Link>
            <Link href="/locations/mendham-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Mendham IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in nearby Mendham.</p></Link>
            <Link href="/locations/bernardsville-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Bernardsville IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in nearby Bernardsville.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Chester?" description="Get a free IT assessment for your Chester business. We&apos;ll look at your systems, flag risks, and show you what managed IT looks like." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
