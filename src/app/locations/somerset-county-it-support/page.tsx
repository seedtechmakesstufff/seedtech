import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PhoneCall, MapPin, FlaskConical, Briefcase, Stethoscope, Building2, Shield, Monitor, Headphones, Server } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, LiquidGlassCard, LiquidGlassPill, CTABanner, IconBox, CardTitle, Body, AnimatedH1 } from "@/components/kit";

export const metadata: Metadata = {
  title: "Somerset County IT Support | SeedTech — Managed IT Services in Somerset County, NJ",
  description: "SeedTech provides managed IT support for Somerset County businesses — Basking Ridge, Bernardsville, Somerville, Bridgewater, and surrounding areas. Call (914) 362-8889.",
  alternates: { canonical: "/locations/somerset-county-it-support" },
  openGraph: {
    title: "Somerset County IT Support — SeedTech",
    description: "Managed IT services for Somerset County businesses. Local provider, proactive support, cybersecurity, and cloud management.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Somerset County IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "Proactive monitoring", body: "NinjaOne-powered monitoring across all your Somerset County endpoints. We track hardware health, disk space, performance metrics, and security events — and respond before issues escalate." },
  { icon: Headphones, title: "Direct support", body: "No ticket queues, no automated systems. Your team calls or messages us directly and gets a real technician. We handle everything from password resets to server failures." },
  { icon: Shield, title: "Security & compliance", body: "SentinelOne endpoint detection, MFA, email security, and automated patching. Configured for the regulatory requirements common in Somerset County&apos;s pharma and financial sectors." },
  { icon: Server, title: "Cloud & infrastructure", body: "Microsoft 365 administration, cloud backup, hybrid server management, and disaster recovery planning. We manage the infrastructure so your team can focus on work." },
];

const localBusiness = [
  { icon: FlaskConical, title: "Pharmaceutical & biotech", body: "Somerset County is a pharmaceutical corridor — from Bridgewater to Basking Ridge. We provide IT for the smaller life sciences firms, CROs, and medical device companies that need secure, compliant infrastructure." },
  { icon: Briefcase, title: "Financial & professional services", body: "Wealth managers, accounting firms, and consultancies throughout Somerset County handle sensitive financial data. We configure IT for confidentiality, compliance, and secure remote access." },
  { icon: Stethoscope, title: "Healthcare providers", body: "Medical offices, urgent care centers, and specialty practices across Somerset County need HIPAA-compliant IT — encrypted communications, access controls, and documented backup policies." },
  { icon: Building2, title: "Corporate & mid-market", body: "Somerset County&apos;s business parks in Bridgewater, Franklin, and Hillsborough attract growing companies that need scalable IT. Our per-user model grows with your headcount." },
];

const towns = ["Basking Ridge", "Bernardsville", "Somerville", "Bridgewater", "Bound Brook", "Franklin", "Hillsborough", "Watchung", "Warren", "Bedminster", "Branchburg", "Raritan"];

const faqs = [
  { q: "What areas of Somerset County do you cover?", a: "We serve all of Somerset County including Basking Ridge, Bernardsville, Somerville, Bridgewater, Bound Brook, Franklin, Hillsborough, Watchung, Warren, Bedminster, Branchburg, and Raritan." },
  { q: "How quickly can you respond on-site in Somerset County?", a: "On-site response across Somerset County is typically same-day. We're based in Hopatcong, about 30-40 minutes from most Somerset County locations. Remote support begins within minutes." },
  { q: "Do you support pharmaceutical and life sciences companies?", a: "Yes. We configure IT infrastructure for regulatory compliance common in pharma — access controls, audit trails, data retention, encrypted communications, and validated system environments." },
  { q: "What's the minimum business size you work with?", a: "Our SeedCare plans are designed for businesses with 5-100 users. We work with many Somerset County businesses in the 10-50 person range. Per-user pricing means there's no penalty for being small." },
  { q: "Can you support our office in Somerset County and another location elsewhere?", a: "Absolutely. We manage multi-location businesses with a centralized platform. All sites get the same monitoring, security policies, and support access regardless of location." },
];

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service", name: "IT Support Somerset County NJ",
  provider: { "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com", telephone: "+19143628889", email: "support@seedtechllc.com", address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" } },
  serviceType: "Managed IT Support", areaServed: { "@type": "AdministrativeArea", name: "Somerset County", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses across Somerset County, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
  { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
  { "@type": "ListItem", position: 3, name: "Somerset County IT Support", item: "https://seedtechllc.com/locations/somerset-county-it-support" },
]};

export default function SomersetCountyITSupportPage() {
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
            <span className="text-light-base/60">Somerset County</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6"><MapPin className="w-3.5 h-3.5 mr-1.5" /> Somerset County, NJ</LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Somerset County Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>Somerset County is a pharmaceutical hub and professional services center — from the corporate campuses in Bridgewater to the boutique firms in Bernardsville and Basking Ridge.</p>
            <p>SeedTech provides managed IT support across Somerset County. Monitoring, cybersecurity, cloud management, and a help desk your team can actually reach. Month-to-month, no contracts.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">Free IT Assessment <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"><PhoneCall className="h-4 w-4" /> (914) 362-8889</a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Across Somerset County" description="Complete managed IT for businesses throughout Somerset County — from a provider close enough to show up when it matters." theme="light" />
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
        <SectionHeader eyebrow="Industries" title="Somerset County Industries We Support" description="IT tailored to the industries that define Somerset County." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (<LiquidGlassCard key={b.title} className="p-7"><IconBox icon={b.icon} variant="gradient" className="mb-4" /><CardTitle className="mb-2">{b.title}</CardTitle><Body className="text-light-base/55 leading-relaxed">{b.body}</Body></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Communities We Serve in Somerset County</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {towns.map((loc) => (<span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Somerset County IT Support — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (<LiquidGlassCard key={faq.q} className="p-6"><h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3><p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p></LiquidGlassCard>))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3><p className="text-body-sm text-dark-base/50">Statewide managed IT overview.</p></Link>
            <Link href="/locations/basking-ridge-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Basking Ridge IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in Basking Ridge.</p></Link>
            <Link href="/locations/morris-county-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Morris County IT Support →</h3><p className="text-body-sm text-dark-base/50">IT services in neighboring Morris County.</p></Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"><h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3><p className="text-body-sm text-dark-base/50">Evaluate your IT — no obligation.</p></Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Somerset County?" description="Get a free IT assessment for your Somerset County business. We&apos;ll review your systems, identify risks, and give you a clear picture of where you stand." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
