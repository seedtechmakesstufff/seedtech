import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, MapPin, Scale, Truck, Stethoscope, Wrench, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Morris County IT Support | SeedTech — Managed IT Services in Morris County, NJ",
  description: "SeedTech provides managed IT support for businesses across Morris County, NJ — Morristown, Parsippany, Dover, Randolph, and surrounding towns. Call (914) 362-8889.",
  alternates: { canonical: "/locations/morris-county-it-support" },
  openGraph: {
    title: "Morris County IT Support — SeedTech",
    description: "Managed IT services for Morris County businesses. Monitoring, cybersecurity, cloud management — local provider, no contracts.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Morris County IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "24/7 monitoring & alerting", body: "Every endpoint across your Morris County locations is monitored through NinjaOne. Hardware health, performance metrics, and security events — we see it all before it becomes a problem." },
  { icon: Headphones, title: "Unlimited help desk", body: "Your entire team gets direct help desk access. No per-ticket charges, no support caps. Real technicians who resolve issues remotely or dispatch on-site across Morris County." },
  { icon: Shield, title: "Cybersecurity & compliance", body: "SentinelOne EDR, MFA, email filtering, patch management, and access control policies. Configured for the compliance standards that Morris County professional firms require." },
  { icon: Server, title: "Cloud, backup & DR", body: "Microsoft 365 management, cloud backup with NinjaOne, and disaster recovery documentation. Your business data is protected, monitored, and recoverable." },
];

const localBusiness = [
  { icon: Scale, title: "Law firms", body: "Morris County — especially Morristown — is one of New Jersey&apos;s densest legal markets. We provide IT for firms that need ethical wall configuration, secure document management, and compliant communications." },
  { icon: Stethoscope, title: "Healthcare", body: "Medical practices, dental offices, and specialty clinics across Morris County need HIPAA-aligned IT. We handle encrypted email, patient data access controls, and compliant backup retention." },
  { icon: Truck, title: "Logistics & warehousing", body: "The warehouses and distribution centers along Routes 46 and 80 need reliable networks, mobile device management, and systems that run around the clock. We keep logistics technology running." },
  { icon: Wrench, title: "Contractors & trades", body: "Construction firms, electricians, and mechanical contractors across Morris County need field-accessible cloud tools, shared project documents, and secure office systems." },
];

const towns = ["Morristown", "Parsippany", "Dover", "Randolph", "Mendham", "Chester", "Netcong", "Stanhope", "Hopatcong", "Denville", "Rockaway", "Boonton", "Madison", "Chatham", "Florham Park"];

const faqs = [
  { q: "What towns in Morris County do you serve?", a: "We serve all of Morris County including Morristown, Parsippany, Dover, Randolph, Mendham, Chester, Netcong, Stanhope, Denville, Rockaway, Boonton, Madison, Chatham, Florham Park, and surrounding communities." },
  { q: "How quickly can you respond to on-site issues in Morris County?", a: "We're based in Hopatcong, in northwestern Morris County. On-site response is typically same-day across the county. Remote support begins within minutes of contact." },
  { q: "Do you support multi-location businesses across Morris County?", a: "Yes. We manage IT for businesses with offices in multiple Morris County towns. All locations are managed from a single pane of glass through NinjaOne — consistent security policies, centralized monitoring, unified help desk." },
  { q: "What industries do you specialize in within Morris County?", a: "Our strongest verticals in Morris County are law firms, medical practices, logistics/warehousing, and professional services. But our managed IT model works for any business with 5-100 users that needs reliable technology." },
  { q: "Is SeedTech based in Morris County?", a: "Yes — our office is in Hopatcong, NJ, in the northwestern corner of Morris County. We're local to the area and serve clients throughout the county and into Somerset, Essex, and Union counties." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Morris County NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "AdministrativeArea", name: "Morris County", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses across Morris County, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Morris County IT Support", item: "https://seedtechllc.com/locations/morris-county-it-support" },
]};

export default function MorrisCountyITSupportPage() {
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
            <span className="text-light-base/60">Morris County</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Morris County, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support Across Morris County</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Morris County has one of the highest concentrations of businesses in New Jersey — from the legal and financial hub of Morristown to the warehouses along Route 46 and the growing companies in Parsippany.</p>
            <p>SeedTech is based in Morris County and provides managed IT to businesses throughout the region. Monitoring, cybersecurity, cloud management, and a help desk that answers. Local, responsive, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Across Morris County" description="Full managed IT for businesses of every size throughout Morris County — from a provider that&apos;s actually based here." theme="light" />
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
        <SectionHeader eyebrow="Industries" title="Morris County Businesses We Support" description="We understand the industries that drive Morris County&apos;s economy." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Towns We Serve in Morris County</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech provides on-site and remote IT support across every community in Morris County.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {towns.map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Morris County IT Support — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Statewide managed IT overview.</p></Link>
            <Link href="/locations/morristown-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Morristown IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in Morris County&apos;s county seat.</p></Link>
            <Link href="/locations/somerset-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Somerset County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Somerset County.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Morris County?" description="SeedTech is based in Morris County and serves businesses across the region. Start with a free assessment — we&apos;ll show you exactly where your IT stands." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
