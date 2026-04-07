import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, MapPin, Scale, Stethoscope, GraduationCap, Building2, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";
import { TrustedBySection } from "@/components/home/TrustedBySection";

export const metadata: Metadata = {
  title: "Essex County IT Support | SeedTech — Managed IT Services in Essex County, NJ",
  description: "SeedTech provides managed IT support for Essex County businesses — Montclair, Livingston, West Orange, Millburn, and surrounding areas. Call (914) 362-8889.",
  alternates: { canonical: "/locations/essex-county-it-support" },
  openGraph: {
    title: "Essex County IT Support — SeedTech",
    description: "Managed IT services for Essex County businesses. Proactive monitoring, cybersecurity, help desk, and cloud management.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Essex County IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "24/7 monitoring", body: "NinjaOne agents across every workstation, server, and laptop. We detect disk failures, security events, and performance issues across your Essex County network before they impact your team." },
  { icon: Headphones, title: "Responsive help desk", body: "No hold queues. Your team contacts us directly and reaches a technician — not a dispatcher. We resolve password resets, printer issues, VPN problems, and application errors the same day." },
  { icon: Shield, title: "Layered cybersecurity", body: "SentinelOne endpoint detection, DNS filtering, email security, and multi-factor authentication. Configured for the threat environment Essex County businesses actually face." },
  { icon: Server, title: "Cloud & backup", body: "Microsoft 365 management, cloud backup with verified restores, hybrid server administration, and disaster recovery planning. Your data stays protected and recoverable." },
];

const localBusiness = [
  { icon: Scale, title: "Legal & professional services", body: "Essex County is home to hundreds of law firms and professional offices. We configure IT for client confidentiality, secure document management, and ethical compliance — including encrypted email and access controls." },
  { icon: Stethoscope, title: "Healthcare & medical", body: "Medical practices, dental offices, and specialty clinics across Essex County need HIPAA-compliant IT. We implement encryption, access controls, audit trails, and backup policies that satisfy regulatory requirements." },
  { icon: GraduationCap, title: "Education & nonprofits", body: "Private schools, tutoring centers, and nonprofits throughout Essex County need reliable IT on tight budgets. Our per-user model keeps costs predictable while providing enterprise-grade security and support." },
  { icon: Building2, title: "Small & mid-size businesses", body: "From Montclair retail shops to Livingston service firms, Essex County businesses rely on technology daily. We handle the IT so owners can focus on running their business — not troubleshooting printers." },
];

const towns = ["Montclair", "Livingston", "West Orange", "Millburn", "Maplewood", "South Orange", "Verona", "Cedar Grove", "Caldwell", "Essex Fells", "Bloomfield", "Nutley"];

const faqs = [
  { q: "What areas of Essex County do you serve?", a: "We serve all of Essex County including Montclair, Livingston, West Orange, Millburn, Maplewood, South Orange, Verona, Cedar Grove, Caldwell, Essex Fells, Bloomfield, and Nutley." },
  { q: "How fast can you get on-site in Essex County?", a: "On-site response is typically same-day. We're based in Hopatcong — about 40-50 minutes from most Essex County locations. Remote support begins within minutes of your call." },
  { q: "Do you work with law firms in Essex County?", a: "Yes. We support multiple law firms with secure document management, encrypted email, MFA, and access controls designed for attorney-client privilege and ethical compliance requirements." },
  { q: "Is there a long-term contract?", a: "No. SeedTech operates month-to-month. We keep clients by doing good work, not by locking them in. You can cancel at any time with 30 days notice." },
  { q: "What does IT support cost for an Essex County business?", a: "Our SeedCare plans start at $110 per user per month for Essentials. Most businesses choose our Plus plan at $130/user/mo. We provide a free assessment to recommend the right tier for your needs." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Essex County NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "AdministrativeArea", name: "Essex County", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses across Essex County, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Essex County IT Support", item: "https://seedtechllc.com/locations/essex-county-it-support" },
]};

export default function EssexCountyITSupportPage() {
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
            <span className="text-light-base/60">Essex County</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Essex County, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Essex County Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Essex County is one of New Jersey&apos;s most densely populated counties — a mix of urban centers and affluent suburban communities. From downtown Montclair to the medical offices in Livingston, businesses here need IT that&apos;s fast and reliable.</p>
            <p>SeedTech provides managed IT support across Essex County. Proactive monitoring, cybersecurity, cloud management, and a help desk your team can actually reach. Month-to-month, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Across Essex County" description="Full-service managed IT for businesses throughout Essex County — from a provider who picks up the phone." theme="light" />
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
        <SectionHeader eyebrow="Industries" title="Essex County Industries We Support" description="IT tailored to the businesses that define Essex County." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Communities We Serve in Essex County</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {towns.map((loc) => (<span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>))}
          </div>
        </div>
      </Section>

      <TrustedBySection />

      <Section>
        <SectionHeader title="Essex County IT Support — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Statewide managed IT overview.</p></Link>
            <Link href="/locations/morris-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Morris County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Morris County.</p></Link>
            <Link href="/locations/union-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Union County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Union County.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Essex County?" description="Get a free IT assessment for your Essex County business. We&apos;ll review your infrastructure, identify vulnerabilities, and give you an honest recommendation." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
