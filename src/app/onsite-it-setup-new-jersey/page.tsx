import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  MapPin,
  Wrench,
  Server,
  Network,
  Wifi,
  Laptop,
  PhoneCall,
  Monitor,
  Printer,
  Package,
  Shield,
  CheckCircle2,
  Building2,
  Scale,
  Stethoscope,
  Truck,
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
  title: "Onsite IT Setup New Jersey | SeedTech — Office IT Installation & Configuration",
  description:
    "SeedTech provides onsite IT setup for New Jersey businesses — new office buildouts, hardware deployment, network installation, workstation provisioning, and server rack configuration.",
  alternates: { canonical: "/onsite-it-setup-new-jersey" },
  openGraph: {
    title: "Onsite IT Setup New Jersey — SeedTech",
    description:
      "New office? New equipment? SeedTech handles onsite IT setup — cabling, networking, server deployment, workstation configuration, and everything in between.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Onsite IT Setup New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const setupServices = [
  {
    icon: Network,
    title: "Network installation & configuration",
    body: "Firewalls, managed switches, wireless access points, VLANs, and VPN setup. We design and deploy your network from scratch or reconfigure an existing one that isn't performing.",
  },
  {
    icon: Server,
    title: "Server rack & deployment",
    body: "Physical server installation, UPS configuration, cable management, and initial server setup. Windows Server, Active Directory, file shares, and domain services — configured on-site.",
  },
  {
    icon: Wifi,
    title: "Structured cabling & Wi-Fi",
    body: "Cat6 runs, patch panels, cable management, and enterprise wireless deployment. We coordinate with your electrician and contractor to ensure clean, code-compliant installations.",
  },
  {
    icon: Laptop,
    title: "Workstation provisioning",
    body: "Every laptop and desktop configured with your applications, domain credentials, security tools, and printers before your employees sit down. No day-one setup chaos.",
  },
  {
    icon: Printer,
    title: "Printer & peripheral setup",
    body: "Network printers, scanners, label printers, and shared peripherals — installed, configured, and mapped to the correct users and departments.",
  },
  {
    icon: Monitor,
    title: "Conference room & AV setup",
    body: "Conference room displays, webcams, speakerphones, and video conferencing systems. We configure Teams, Zoom, or Meet rooms so they just work.",
  },
];

const scenarios = [
  {
    icon: Building2,
    title: "New office buildout",
    body: "Moving into a new space? We handle the full IT buildout — cabling, networking, server deployment, workstation setup, and connectivity. Your team walks in on day one and everything works.",
  },
  {
    icon: Package,
    title: "Equipment refresh or rollout",
    body: "Deploying 20 new laptops? Replacing aging switches? We stage, configure, and deploy new equipment — then decommission and wipe the old hardware securely.",
  },
  {
    icon: MapPin,
    title: "Branch office expansion",
    body: "Opening a satellite office or remote location? We replicate your main office environment — same security, same network standards, same user experience — at the new site.",
  },
  {
    icon: Shield,
    title: "Security hardware deployment",
    body: "New firewall, access points with WPA3, or physical security cameras with NVR. We handle the rack-and-stack, configuration, and ongoing monitoring.",
  },
];

const process = [
  {
    step: "1",
    title: "Site survey & planning",
    body: "We visit your location, assess the space, review floor plans, and plan the infrastructure layout — network drops, server closet, AP placement, and power requirements.",
  },
  {
    step: "2",
    title: "Procurement & staging",
    body: "We spec and procure the right hardware at business pricing, then stage and pre-configure everything in our lab before the on-site install day.",
  },
  {
    step: "3",
    title: "On-site installation",
    body: "Our technicians arrive with pre-configured equipment and install everything — cabling, network gear, servers, workstations, printers, and AV. Minimal disruption to your team.",
  },
  {
    step: "4",
    title: "Testing & handoff",
    body: "Every connection, every device, every user account is tested before we leave. We walk your team through the setup and provide documentation for your environment.",
  },
  {
    step: "5",
    title: "Ongoing management",
    body: "After installation, your infrastructure is enrolled in NinjaOne for 24/7 monitoring. SeedCare plans provide ongoing management — so nothing degrades after we leave.",
  },
];

const faqs = [
  {
    q: "Do you handle the full office IT buildout or just specific pieces?",
    a: "Both. We can handle a complete office buildout from structured cabling to workstation deployment, or you can bring us in for specific projects — network setup, server installation, or a hardware refresh.",
  },
  {
    q: "How long does a typical office setup take?",
    a: "A small office (5-15 employees) can typically be set up in 1-2 days. Larger offices with server infrastructure and complex networking may take 3-5 days. We provide a detailed timeline during planning.",
  },
  {
    q: "Do you provide the hardware or do we buy our own?",
    a: "We can handle procurement through business channels at competitive pricing, or we can work with hardware you've already purchased. We recommend letting us spec and procure — it ensures compatibility and includes proper warranty.",
  },
  {
    q: "Can you coordinate with our landlord, electrician, and contractor?",
    a: "Yes. We regularly coordinate with building management, electricians, and general contractors for cabling, power, and construction timelines. We handle the IT coordination so you don't have to translate between trades.",
  },
  {
    q: "What happens after the setup is complete?",
    a: "If you're on a SeedCare plan, your new infrastructure is immediately monitored and managed 24/7. If it's a one-time project, we provide documentation and can offer ongoing support as needed.",
  },
  {
    q: "How much does onsite IT setup cost?",
    a: "Project pricing depends on scope — number of workstations, network complexity, server requirements, and cabling needs. We provide a fixed-price quote after the site survey. No hourly surprises.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Onsite IT Setup New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Onsite IT Setup and Installation",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Onsite IT setup and installation for New Jersey businesses — office buildouts, network installation, server deployment, workstation provisioning, and hardware rollouts.",
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
    { "@type": "ListItem", position: 2, name: "Onsite IT Setup New Jersey", item: "https://seedtechllc.com/onsite-it-setup-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function OnsiteITSetupNJPage() {
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
            <span className="text-light-base/60">Onsite IT Setup New Jersey</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <MapPin className="w-3.5 h-3.5 mr-1.5" /> Onsite IT Setup — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Onsite IT Setup & Installation for New Jersey Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              New office? New equipment? Moving locations? Some IT work requires boots on
              the ground — and it needs to be done right the first time. Poorly set up
              infrastructure creates problems that last for years.
            </p>
            <p>
              SeedTech provides onsite IT setup across New Jersey — network installation,
              server deployment, workstation provisioning, structured cabling, and full
              office buildouts. Everything configured, tested, and documented before
              your team starts working.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Request a Site Survey <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — Setup services */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Set Up"
          title="Onsite IT Services — Everything You Need, Installed Right"
          description="From network drops to server racks to employee workstations — we handle the physical installation and configuration that remote IT can't."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {setupServices.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <card.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Common scenarios */}
      <Section>
        <SectionHeader
          eyebrow="Common Projects"
          title="When You Need Onsite IT Setup"
          description="Whether it's a brand-new office or a hardware refresh across your team, we handle the physical work so your team stays productive."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {scenarios.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Our process */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How It Works"
          title="Our Onsite Setup Process"
          description="Every onsite project follows the same structured process — plan, stage, install, test, and transition to ongoing management."
          theme="light"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {process.map((step) => (
            <div key={step.step} className="flex gap-5 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-seed-600 text-white font-display text-lg">
                {step.step}
              </div>
              <div>
                <h3 className="mb-1 font-display text-card-title text-dark-base">{step.title}</h3>
                <p className="text-body-sm leading-relaxed text-dark-base/60">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Checklist */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Before You Move In</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            New Office IT Checklist
          </h2>
          <div className="text-left space-y-3 mt-8">
            {[
              "Structured cabling (Cat6) to every desk and conference room",
              "Firewall and managed switch installed and configured",
              "Enterprise Wi-Fi with proper AP placement and coverage testing",
              "Server rack with UPS, patch panel, and cable management",
              "Every workstation domain-joined, security-enrolled, and tested",
              "Printers and peripherals mapped to correct users",
              "VPN configured for remote workers",
              "Backup and monitoring enrolled in NinjaOne",
              "Conference room AV tested and working",
              "Full environment documentation delivered",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl liquid-glass p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                <p className="text-body-sm text-light-base/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Onsite IT Setup Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides onsite IT setup and installation across New Jersey. Whether
            you&apos;re building out a new office in Morristown or deploying equipment in
            Parsippany, our technicians handle the hands-on work.
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
        <SectionHeader title="Onsite IT Setup — Frequently Asked Questions" align="left" />
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
            <Link href="/business-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Business IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">End-to-end IT infrastructure management.</p>
            </Link>
            <Link href="/managed-it-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Managed IT Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Ongoing IT management after setup.</p>
            </Link>
            <Link href="/nationwide-it-support" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Nationwide IT Support →</h3>
              <p className="text-body-sm text-dark-base/50">Setup and support beyond New Jersey.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">Start with a site survey and plan.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Need Onsite IT Setup?"
          description="New office, new equipment, or expanding locations — SeedTech handles the hands-on installation and configuration. Start with a site survey."
          primaryLabel="Request a Site Survey"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
