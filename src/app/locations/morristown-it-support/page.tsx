import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PhoneCall,
  Building2,
  Scale,
  Stethoscope,
  Briefcase,
  Shield,
  Monitor,
  Headphones,
  Server,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CardTitle,
  Body,
  AnimatedH1,
} from "@/components/kit";

export const metadata: Metadata = {
  title: "Morristown IT Support | SeedTech — Managed IT Services in Morristown, NJ",
  description:
    "SeedTech provides IT support for businesses in Morristown, NJ — proactive monitoring, help desk, cybersecurity, and cloud management. Call (914) 362-8889.",
  alternates: { canonical: "/locations/morristown-it-support" },
  openGraph: {
    title: "Morristown IT Support — SeedTech",
    description: "Managed IT services for Morristown businesses. Proactive support, cybersecurity, and cloud management from a local NJ provider.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Morristown IT Support — SeedTech" }],
  },
};

const services = [
  { icon: Monitor, title: "24/7 monitoring", body: "Every workstation and server in your Morristown office is monitored around the clock. We catch issues before your team notices them." },
  { icon: Headphones, title: "Help desk support", body: "Your employees get direct access to our help desk — no phone trees, no ticket queues. Real technicians who resolve issues fast." },
  { icon: Shield, title: "Cybersecurity", body: "SentinelOne endpoint protection, MFA enforcement, email filtering, and patch management. Layered security built for professional services firms." },
  { icon: Server, title: "Cloud & backup", body: "Microsoft 365 management, cloud backup with NinjaOne, and disaster recovery planning. Your data is protected and recoverable." },
];

const localBusiness = [
  { icon: Scale, title: "Law firms", body: "Morristown is home to dozens of law firms — from solo practitioners on South Street to mid-size firms near the courthouse. We handle compliance-ready IT, ethical wall configuration, and secure document management." },
  { icon: Stethoscope, title: "Medical & dental practices", body: "Healthcare providers along Madison Avenue and throughout Morristown need HIPAA-aligned IT. We configure encrypted email, access controls, and backup for patient data." },
  { icon: Briefcase, title: "Professional services", body: "Accounting firms, consultancies, and financial advisors in the Morristown business district rely on secure, fast systems. We keep your tech running so you can focus on clients." },
  { icon: Building2, title: "Growing businesses", body: "Morristown's central location and transit access make it a hub for growing companies. We scale IT infrastructure as your team grows — no long-term contracts required." },
];

const faqs = [
  { q: "Do you provide on-site IT support in Morristown?", a: "Yes. Morristown is within our primary service area. We provide on-site support for hardware issues, network troubleshooting, and new office setups. Most day-to-day support is handled remotely for faster resolution." },
  { q: "How fast can you respond to an issue at our Morristown office?", a: "Remote support begins within minutes. On-site response in Morristown is typically same-day for critical issues — we're based in Hopatcong, about 30 minutes away." },
  { q: "Do you support law firms in Morristown?", a: "Yes — law firms are one of our core verticals. We handle ethical wall configuration, encrypted email, document management systems, and compliance-ready backup for firms of all sizes." },
  { q: "What does IT support cost for a Morristown business?", a: "SeedCare plans start at $110/user/month for Essentials. Pricing is per-user, month-to-month, no contracts. A 10-person office would be approximately $1,100-$1,600/month depending on the tier." },
  { q: "Can you help us move to a new Morristown office?", a: "Absolutely. We handle office moves including network setup, workstation deployment, phone system configuration, and ISP coordination. We'll have your team productive on day one." },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support Morristown NJ",
  provider: {
    "@type": "LocalBusiness", name: "SeedTech", url: "https://seedtechllc.com",
    telephone: "+19143628889", email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Managed IT Support",
  areaServed: { "@type": "City", name: "Morristown", containedInPlace: { "@type": "State", name: "New Jersey" } },
  description: "Managed IT support for businesses in Morristown, NJ — monitoring, help desk, cybersecurity, and cloud management.",
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://seedtechllc.com/locations" },
    { "@type": "ListItem", position: 3, name: "Morristown IT Support", item: "https://seedtechllc.com/locations/morristown-it-support" },
  ],
};

export default function MorristownITSupportPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/managed-it-services-new-jersey" className="hover:text-light-base/50 transition-colors">IT Services NJ</Link>
            <span>/</span>
            <span className="text-light-base/60">Morristown</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> Morristown, NJ
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">IT Support for Morristown Businesses</AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Morristown is one of the busiest professional hubs in Morris County — law firms,
              medical practices, financial services, and growing companies packed into a walkable
              downtown. Your IT needs to keep pace.
            </p>
            <p>
              SeedTech provides managed IT support for Morristown businesses — proactive
              monitoring, fast help desk, cybersecurity, and cloud management. No contracts,
              no bloat.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/services/managed-it/assessment" className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300">
              Free IT Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+19143628889" className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200">
              <PhoneCall className="h-4 w-4" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      <Section theme="light">
        <SectionHeader eyebrow="What You Get" title="IT Services Available in Morristown" description="Everything a Morristown business needs from an IT provider — without the overhead of an internal team." theme="light" />
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
        <SectionHeader eyebrow="Local Businesses" title="Morristown Industries We Support" description="We understand the IT needs specific to Morristown's business community." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {localBusiness.map((b) => (
            <LiquidGlassCard key={b.title} className="p-7">
              <IconBox icon={b.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{b.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{b.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">Also Serving Nearby Communities</h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">SeedTech provides IT support throughout Morris County and surrounding areas.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Mendham", "Chester", "Bernardsville", "Basking Ridge", "Parsippany", "Dover", "Randolph", "Morris County"].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">{loc}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="IT Support in Morristown — FAQ" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Protect your Morristown office from threats.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Systems down? We respond immediately.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See where your IT stands today.</p>
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <CTABanner title="Need IT Support in Morristown?" description="Get a free IT assessment for your Morristown business. We'll evaluate your systems, identify gaps, and show you exactly what proactive IT looks like." primaryLabel="Free IT Assessment" primaryHref="/services/managed-it/assessment" secondaryLabel="Call (914) 362-8889" secondaryHref="tel:+19143628889" />
      </Section>
    </div>
  );
}
