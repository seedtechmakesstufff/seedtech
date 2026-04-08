import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Server,
  Shield,
  Headphones,
  Monitor,
  PhoneCall,
  Network,
  HardDrive,
  Wifi,
  Laptop,
  Wrench,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Stethoscope,
  Truck,
  Building2,
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
import { TrustedBySection } from "@/components/home/TrustedBySection";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Business IT Support & Infrastructure New Jersey | SeedTech — IT Infrastructure for NJ",
  description:
    "SeedTech provides business IT support and infrastructure services for New Jersey companies — servers, networking, workstations, cloud, and ongoing management. Flat-rate pricing.",
  alternates: { canonical: "/business-it-support-new-jersey" },
  openGraph: {
    title: "Business IT Support & Infrastructure New Jersey — SeedTech",
    description:
      "End-to-end business IT infrastructure — servers, networks, workstations, and cloud environments. Deployed, managed, and supported by SeedTech.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Business IT Support & Infrastructure New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const infraServices = [
  {
    icon: Server,
    title: "Server deployment & management",
    body: "On-premises and cloud server setup, configuration, monitoring, and maintenance. Windows Server, file servers, domain controllers, and application servers — deployed right and managed proactively.",
  },
  {
    icon: Network,
    title: "Network design & management",
    body: "Firewalls, switches, access points, VLANs, and VPN configuration. We design, deploy, and monitor your network infrastructure to ensure reliability and security.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi & connectivity",
    body: "Enterprise-grade wireless networks, structured cabling, ISP coordination, and failover connectivity. No dead zones, no dropped connections, no guessing games with your ISP.",
  },
  {
    icon: Laptop,
    title: "Workstation provisioning",
    body: "Laptops and desktops configured with your applications, security tools, and domain credentials before they reach your employees. Every device standardized, enrolled, and monitored from day one.",
  },
  {
    icon: HardDrive,
    title: "Storage & backup infrastructure",
    body: "NAS, SAN, cloud storage, and monitored backup solutions. File-level and image-level backups with verified recovery points — so your data is always recoverable.",
    href: "/backup-disaster-recovery-new-jersey",
  },
  {
    icon: Shield,
    title: "Security infrastructure",
    body: "SentinelOne endpoint protection, firewalls, MFA, access controls, and patch management deployed across your entire environment. Security is infrastructure, not an afterthought.",
    href: "/cybersecurity-services-new-jersey",
  },
];

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Your servers haven't been updated in months",
    body: "Unpatched servers are open targets. If no one is actively monitoring and patching your infrastructure, you're running on borrowed time.",
  },
  {
    icon: Wifi,
    title: "Your network is slow and unreliable",
    body: "Slow file transfers, dropped VPN connections, Wi-Fi dead zones. Most network problems stem from outdated equipment or poor configuration — not your ISP.",
  },
  {
    icon: HardDrive,
    title: "You don't know if your backups are running",
    body: "Backup jobs fail silently. If no one is monitoring them, you won't find out until you need a restore — and by then it's too late.",
  },
  {
    icon: Settings,
    title: "Every device is set up differently",
    body: "Some employees have antivirus, some don't. Some are on the domain, some aren't. Without standardized provisioning, your environment is a patchwork of risk.",
  },
];

const comparison = [
  { breakFix: "Called when something breaks", seedtech: "24/7 monitoring catches issues before they break" },
  { breakFix: "Hourly billing — incentive to take longer", seedtech: "Flat-rate — incentive to prevent problems" },
  { breakFix: "No documentation of your environment", seedtech: "Full environment documentation and asset tracking" },
  { breakFix: "Different tech every time you call", seedtech: "Assigned team that knows your systems" },
  { breakFix: "Security is an afterthought", seedtech: "Security is built into every layer of infrastructure" },
  { breakFix: "No strategic planning or roadmap", seedtech: "Quarterly business reviews and IT roadmap" },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Document management servers, secure client portals, and compliance-ready infrastructure for legal practices.",
  },
  {
    icon: Stethoscope,
    title: "Medical & dental practices",
    body: "HIPAA-compliant infrastructure, EHR system hosting, and medical device networking for healthcare providers.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Multi-site networking, dispatch system infrastructure, and mobile workforce connectivity for fleet operations.",
  },
  {
    icon: Building2,
    title: "Professional services",
    body: "Accounting firms, consultancies, and agencies with cloud-first infrastructure, remote access, and collaboration tools.",
  },
];

const faqs = [
  {
    q: "Do you support both on-premises and cloud infrastructure?",
    a: "Yes. Many of our clients run hybrid environments — on-premises servers for specific workloads and cloud services for email, backup, and collaboration. We design and manage both.",
  },
  {
    q: "Can you take over infrastructure someone else built?",
    a: "Absolutely. During onboarding, we audit your current environment, document everything, and create a remediation plan for any gaps. We regularly take over from previous IT providers or break-fix companies.",
  },
  {
    q: "Do you handle hardware purchasing?",
    a: "Yes. We recommend and procure servers, workstations, networking equipment, and peripherals. We buy through business channels at competitive pricing and handle warranty registration.",
  },
  {
    q: "What if we need to set up a new office?",
    a: "We handle end-to-end office IT setup — structured cabling, network infrastructure, server deployment, workstation provisioning, and connectivity. We coordinate with your electrician, landlord, and ISP to make it seamless.",
  },
  {
    q: "How do you handle infrastructure emergencies?",
    a: "Server failures, network outages, and security incidents are treated as critical priority. SeedCare clients have direct access to our team — no ticket queues, no waiting for a callback.",
  },
  {
    q: "Is infrastructure management included in SeedCare plans?",
    a: "Server and network monitoring, patching, and management are included. Large infrastructure projects like office moves, server migrations, or new deployments are scoped and quoted separately at project rates.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Business IT Support & Infrastructure New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Business IT Support and Infrastructure",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Business IT support and infrastructure services for New Jersey companies — servers, networking, workstations, cloud, and ongoing management.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Business IT Support New Jersey", item: "https://seedtechllc.com/business-it-support-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function BusinessITSupportNJPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-base/60">Business IT Support New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Server className="w-3.5 h-3.5 mr-1.5" /> IT Infrastructure — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Business IT Support & Infrastructure for New Jersey Companies
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your business runs on infrastructure — servers, networks, workstations, and
              the systems that connect them. When that infrastructure isn&apos;t managed
              properly, everything slows down, breaks, or becomes a security risk.
            </p>
            <p>
              SeedTech provides end-to-end IT infrastructure services for New Jersey
              businesses. We design, deploy, secure, and manage the technology your team
              depends on — with flat-rate pricing and no contracts.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Infrastructure Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              <PhoneCall className="h-4 w-4" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      {/* Section 1 — Common pain points */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Signs Your Infrastructure Needs Professional Management"
          description="These are the most common issues we find during initial assessments for new clients across New Jersey."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((card) => (
            <div key={card.title} className="rounded-2xl border border-red-100 bg-red-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <card.icon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Infrastructure services */}
      <Section>
        <SectionHeader
          eyebrow="What We Manage"
          title="End-to-End IT Infrastructure — Deployed and Managed"
          description="SeedTech handles the full stack — from the server rack to the workstation on your employee's desk."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infraServices.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Break-fix vs. managed comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="Break-Fix IT vs. Managed Infrastructure"
          description="Most businesses are still paying hourly for reactive IT. Here's how managed infrastructure changes the equation."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Break-Fix IT</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">SeedTech Managed Infrastructure</p>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < comparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.breakFix}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.seedtech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Serve"
          title="IT Infrastructure for New Jersey's Key Industries"
          description="Different industries have different infrastructure requirements. We design and manage environments tailored to your operational and compliance needs."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Business IT Infrastructure Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech designs, deploys, and manages IT infrastructure for businesses across
            New Jersey — from server rooms in Morristown to branch offices in Somerset County.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Morristown", "Mendham", "Chester", "Bernardsville", "Basking Ridge",
              "Hopatcong", "Parsippany", "Netcong", "Stanhope", "Dover", "Randolph",
              "Morris County", "Somerset County", "Essex County", "Union County",
            ].map((loc) => (
              <span key={loc} className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm">
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Business IT Infrastructure — Frequently Asked Questions" align="left" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <LiquidGlassCard key={faq.q} className="p-6">
              <h3 className="font-display text-card-title text-white mb-3">{faq.q}</h3>
              <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Complete IT management at flat-rate pricing.</p>
            </Link>
            <Link href="/onsite-it-setup-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Onsite IT Setup NJ →</h3>
              <p className="text-body-sm text-dark-base/50">New office, new equipment, hands-on setup.</p>
            </Link>
            <Link href="/backup-disaster-recovery-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Backup & Disaster Recovery →</h3>
              <p className="text-body-sm text-dark-base/50">Monitored backups and tested recovery plans.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Security layered into every infrastructure component.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="IT Infrastructure That Works — Not Just Exists"
          description="Servers, networks, workstations, and security — deployed, managed, and monitored. Start with a free infrastructure assessment."
          primaryLabel="Free Infrastructure Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
