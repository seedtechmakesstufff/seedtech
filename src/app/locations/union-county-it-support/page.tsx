import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, MapPin, Landmark, Stethoscope, ShoppingBag, Building2, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Union County IT Support | SeedTech — Managed IT Services in Union County, NJ",
  description: "SeedTech provides managed IT support for Union County businesses — Summit, Westfield, Cranford, Scotch Plains, and surrounding areas. Call (914) 362-8889.",
  alternates: { canonical: "/locations/union-county-it-support" },
  openGraph: {
    title: "Union County IT Support — SeedTech",
    description: "Managed IT services for Union County businesses. Proactive monitoring, cybersecurity, help desk, and cloud management.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Union County IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "Proactive monitoring", body: "NinjaOne agents on every device in your Union County office. We monitor hardware health, disk space, patch compliance, and security events — and fix issues before your team notices them." },
  { icon: Headphones, title: "Direct help desk", body: "Your employees call or message us and get a real technician. No hold music, no ticket portals. We handle everything from account lockouts to application crashes the same day." },
  { icon: Shield, title: "Cybersecurity", body: "SentinelOne endpoint protection, email filtering, DNS security, and multi-factor authentication. Union County businesses face the same threats as enterprise companies — we provide enterprise-grade defense." },
  { icon: Server, title: "Cloud & infrastructure", body: "Microsoft 365 administration, cloud backup with verified restores, server management, and disaster recovery planning. Your infrastructure stays current, secure, and recoverable." },
];

const localBusiness = [
  { icon: Landmark, title: "Financial services & insurance", body: "Union County&apos;s proximity to New York City makes it a natural home for financial advisors, insurance agencies, and accounting firms. We configure IT for SEC, FINRA, and SOX compliance with secure client portals and encrypted communications." },
  { icon: Stethoscope, title: "Healthcare & dental", body: "Medical practices, dental offices, and specialty clinics throughout Union County need HIPAA-compliant IT. We implement encrypted storage, access controls, backup verification, and audit-ready documentation." },
  { icon: ShoppingBag, title: "Retail & service businesses", body: "From Westfield&apos;s downtown shops to Cranford&apos;s local service businesses, Union County retail depends on point-of-sale systems, payment processing, and reliable Wi-Fi. We keep those systems running." },
  { icon: Building2, title: "Professional offices", body: "Law firms, real estate agencies, and consulting practices in Summit, Westfield, and across Union County rely on document management, email, and secure remote access. We provide the IT backbone." },
];

const towns = ["Summit", "Westfield", "Cranford", "Scotch Plains", "Fanwood", "Mountainside", "New Providence", "Berkeley Heights", "Springfield", "Clark", "Garwood", "Kenilworth"];

const faqs = [
  { q: "What parts of Union County do you serve?", a: "We serve all of Union County including Summit, Westfield, Cranford, Scotch Plains, Fanwood, Mountainside, New Providence, Berkeley Heights, Springfield, Clark, Garwood, and Kenilworth." },
  { q: "How quickly can you respond on-site in Union County?", a: "On-site response is typically same-day. We're based in Hopatcong — about 40-50 minutes from most Union County locations via Route 78 or 22. Remote support starts within minutes." },
  { q: "Do you support businesses with regulatory compliance needs?", a: "Yes. We work with financial services, healthcare, and legal firms across Union County. We configure IT for HIPAA, SEC, FINRA, and other regulatory frameworks — including access controls, encryption, audit trails, and backup verification." },
  { q: "What happens when something breaks after hours?", a: "Our monitoring runs 24/7. Critical alerts — server failures, security events, backup failures — trigger immediate response regardless of the time. Your SeedCare plan includes after-hours emergency support." },
  { q: "Can you take over from our current IT provider?", a: "Yes. We handle the full transition — documenting your current systems, migrating credentials, deploying our monitoring agents, and configuring security policies. Most transitions complete within 1-2 weeks with zero downtime." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Union County NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "AdministrativeArea", name: "Union County", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses across Union County, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Union County IT Support", item: "https://seedtechllc.com/locations/union-county-it-support" },
]};

export default function UnionCountyITSupportPage() {
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
            <span className="text-light-base/60">Union County</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Union County, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Union County Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Union County sits at the crossroads of Routes 22 and 78 — a strategic location that attracts financial firms in Summit, professional offices in Westfield, and growing businesses throughout the county.</p>
            <p>SeedTech provides managed IT support across Union County. Proactive monitoring, cybersecurity, cloud management, and a help desk that answers the phone. Month-to-month, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Across Union County" description="Complete managed IT for businesses throughout Union County — from a provider who answers when you call." theme="light" />
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
        <SectionHeader eyebrow="Industries" title="Union County Industries We Support" description="IT built for the industries that power Union County." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Communities We Serve in Union County</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {towns.map((loc) => (<span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Union County IT Support — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Statewide managed IT overview.</p></Link>
            <Link href="/locations/essex-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Essex County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Essex County.</p></Link>
            <Link href="/locations/somerset-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Somerset County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Somerset County.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Union County?" description="Get a free IT assessment for your Union County business. We&apos;ll review your systems, identify risks, and provide a clear recommendation — no sales pitch." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
