import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Phone,
  PhoneCall,
  Headphones,
  Cloud,
  Shield,
  Settings,
  Users,
  Building2,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Scale,
  Stethoscope,
  Truck,
  Globe,
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
  title: "VoIP & Phone Systems New Jersey | SeedTech — Business Phone Solutions for NJ",
  description:
    "SeedTech provides VoIP and business phone system support for New Jersey companies — setup, configuration, troubleshooting, and vendor management for cloud phone systems. Call (914) 362-8889.",
  alternates: { canonical: "/voip-phone-systems-new-jersey" },
  openGraph: {
    title: "VoIP & Phone Systems New Jersey — SeedTech",
    description:
      "Business phone system setup and support for NJ companies. VoIP deployment, configuration, troubleshooting, and vendor management — handled by SeedTech.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "VoIP & Phone Systems New Jersey — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const phoneProblems = [
  {
    icon: AlertTriangle,
    title: "Your phone system is outdated and unsupported",
    body: "Legacy PBX systems are expensive to maintain, difficult to modify, and often no longer receiving security updates. When hardware fails, replacement parts are hard to find.",
  },
  {
    icon: DollarSign,
    title: "Your phone bill keeps climbing",
    body: "Traditional phone systems charge per line, per feature, and per long-distance minute. VoIP consolidates everything into a predictable monthly cost — often 30-50% less than legacy systems.",
  },
  {
    icon: Users,
    title: "Remote workers can't use the office phone system",
    body: "If your employees work from home or travel, they can't access the office phone system. VoIP works anywhere with internet — same number, same extension, same features, any device.",
  },
  {
    icon: Settings,
    title: "Adding or changing extensions is a nightmare",
    body: "With a traditional PBX, adding a user or changing a call flow requires a vendor visit. VoIP systems are managed through a web portal — changes take minutes, not days.",
  },
];

const voipServices = [
  {
    icon: Phone,
    title: "VoIP system deployment",
    body: "Full setup and configuration of cloud-based phone systems — user accounts, extensions, call routing, auto-attendants, voicemail, and call groups. Your team is making calls on day one.",
  },
  {
    icon: Cloud,
    title: "Cloud phone system management",
    body: "Ongoing management of your VoIP platform — adding users, modifying call flows, configuring hunt groups, and updating auto-attendant menus. We handle the admin so you don't have to.",
  },
  {
    icon: Wifi,
    title: "Network optimization for VoIP",
    body: "VoIP call quality depends on your network. We configure QoS (Quality of Service), VLAN segmentation, and bandwidth allocation to ensure crystal-clear calls without lag or drops.",
  },
  {
    icon: Headphones,
    title: "Phone hardware setup",
    body: "Desk phones, conference phones, headsets, and softphone apps — procured, configured, and deployed. Every device provisioned with the correct extension and settings before it reaches your desk.",
  },
  {
    icon: Shield,
    title: "Phone system security",
    body: "SIP trunking security, call encryption, fraud protection, and access controls. VoIP systems are targets for toll fraud — we configure protections most businesses don't know they need.",
  },
  {
    icon: Globe,
    title: "Number porting & migration",
    body: "Keep your existing business phone numbers. We manage the porting process from your current carrier to your new VoIP platform — no downtime, no lost numbers.",
  },
];

const comparison = [
  { legacy: "Hardware PBX in your server closet", voip: "Cloud-hosted — no hardware to maintain" },
  { legacy: "Per-line, per-feature billing", voip: "Flat per-user pricing — all features included" },
  { legacy: "Vendor visit required for changes", voip: "Web portal — changes in minutes" },
  { legacy: "Office-only — no remote access", voip: "Works from any device, anywhere" },
  { legacy: "Proprietary hardware — expensive replacements", voip: "Standard IP phones or softphone apps" },
  { legacy: "Limited call recording and analytics", voip: "Full call recording, analytics, and reporting" },
];

const platforms = [
  "Microsoft Teams Phone",
  "Google Voice for Business",
  "RingCentral",
  "Zoom Phone",
  "8x8",
  "Vonage Business",
  "Nextiva",
  "GoTo Connect",
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Call recording for compliance, DID numbers per attorney, and secure client communication. Auto-attendants that route callers to the right department every time.",
  },
  {
    icon: Stethoscope,
    title: "Medical & dental practices",
    body: "HIPAA-compliant phone systems with encrypted calls, after-hours routing, and integration with appointment scheduling systems.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Mobile extensions for drivers and field staff, dispatch routing, and multi-location call management from a single system.",
  },
  {
    icon: Building2,
    title: "Professional services",
    body: "Professional auto-attendants, conference calling, and unified communications — making a 10-person firm sound like a 100-person operation.",
  },
];

const faqs = [
  {
    q: "What VoIP platforms do you support?",
    a: "We work with all major cloud phone platforms — Microsoft Teams Phone, Google Voice, RingCentral, Zoom Phone, 8x8, and others. We help you choose the right platform based on your existing tools, budget, and requirements.",
  },
  {
    q: "Can we keep our existing phone numbers?",
    a: "Yes. Number porting is a standard part of any VoIP migration. We manage the porting process with your current carrier to ensure no downtime or lost numbers during the transition.",
  },
  {
    q: "How reliable is VoIP compared to landlines?",
    a: "Modern VoIP is extremely reliable — as long as your network and internet connection are solid. We configure QoS, VLAN segmentation, and redundant connectivity to ensure call quality matches or exceeds traditional phone systems.",
  },
  {
    q: "What happens if the internet goes down?",
    a: "Cloud VoIP systems offer built-in failover options — calls can be forwarded to mobile phones, sent to voicemail, or routed to a backup location automatically. We configure these failover rules during deployment.",
  },
  {
    q: "Do we need to buy new desk phones?",
    a: "Not necessarily. Many employees work fine with softphone apps on their computer or mobile device. For those who prefer physical phones, we recommend and procure cost-effective IP phones that work with your chosen platform.",
  },
  {
    q: "Is VoIP phone support included in SeedCare plans?",
    a: "Basic phone system vendor management (calling the provider, troubleshooting issues) is included in SeedCare plans. Full VoIP deployment and migration projects are scoped separately. Ongoing administration can be included in your managed IT agreement.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "VoIP & Phone Systems New Jersey",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "VoIP and Business Phone Systems",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "VoIP and business phone system deployment, configuration, and support for New Jersey businesses.",
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
    { "@type": "ListItem", position: 2, name: "VoIP & Phone Systems New Jersey", item: "https://seedtechllc.com/voip-phone-systems-new-jersey" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function VoIPPhoneSystemsNJPage() {
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
            <span className="text-light-base/60">VoIP & Phone Systems New Jersey</span>
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
            <Phone className="w-3.5 h-3.5 mr-1.5" /> VoIP & Phone Systems — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            VoIP & Business Phone Systems for New Jersey Companies
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your business phone system should work from anywhere, cost less than
              your current setup, and not require a vendor visit every time you need
              to add a user. If that&apos;s not what you have, it&apos;s time to switch.
            </p>
            <p>
              SeedTech deploys, configures, and supports cloud phone systems for
              businesses across New Jersey. VoIP setup, number porting, network
              optimization, and ongoing management — so your phones just work.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free Phone System Review <ArrowRight className="h-4 w-4" />
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

      {/* Section 1 — Phone system problems */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Signs Your Phone System Needs an Upgrade"
          description="If any of these describe your current setup, you're overpaying for less functionality than a modern VoIP system provides."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {phoneProblems.map((card) => (
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

      {/* Section 2 — VoIP services */}
      <Section>
        <SectionHeader
          eyebrow="What We Do"
          title="VoIP & Phone System Services"
          description="From initial deployment to ongoing management — SeedTech handles your business phone system end-to-end."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {voipServices.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Legacy vs VoIP comparison */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Side by Side"
          title="Legacy Phone System vs. Cloud VoIP"
          description="Here's what changes when you move from a traditional phone system to cloud-based VoIP."
          theme="light"
        />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-black/[0.05] bg-white shadow-cardLight overflow-hidden">
            <div className="grid grid-cols-2 border-b border-black/[0.08] px-6 py-3">
              <p className="text-xs font-semibold text-dark-base/40 uppercase tracking-wider">Legacy Phone System</p>
              <p className="text-xs font-semibold text-seed-600 uppercase tracking-wider">Cloud VoIP</p>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-6 py-4 ${i < comparison.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
                <div className="flex items-start gap-2 pr-4">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-body-sm text-dark-base/50">{row.legacy}</p>
                </div>
                <div className="flex items-start gap-2 pr-4">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seed-600" />
                  <p className="text-body-sm text-dark-base/80 font-medium">{row.voip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Platforms we support */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Platform Agnostic</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Platforms We Deploy & Support
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            We don&apos;t push one platform. We recommend based on your existing tools,
            budget, and requirements — then deploy and manage whichever platform fits best.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((p) => (
              <span key={p} className="inline-block rounded-xl liquid-glass px-5 py-2.5 text-sm font-medium text-light-base/70">
                {p}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 5 — Industries */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Phone Systems for New Jersey's Key Industries"
          description="Different industries have different communication requirements. We configure phone systems that match your operational reality."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((card) => (
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

      {/* TrustedBySection */}
      <TrustedBySection />

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            VoIP & Phone System Support Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech deploys and supports business phone systems across New Jersey — from
            multi-line setups in Morristown law firms to mobile-first systems for logistics
            companies in Somerset County.
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
        <SectionHeader title="VoIP & Phone Systems — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Proactive IT with phone system management included.</p>
            </Link>
            <Link href="/business-it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Business IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Full IT infrastructure management.</p>
            </Link>
            <Link href="/microsoft-it-solutions-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Microsoft IT Solutions →</h3>
              <p className="text-body-sm text-dark-base/50">Teams Phone and Microsoft 365 integration.</p>
            </Link>
            <Link href="/google-workspace-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Google Workspace Support →</h3>
              <p className="text-body-sm text-dark-base/50">Google Voice and Workspace integration.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Upgrade Your Business Phone System?"
          description="Modern VoIP — lower cost, more features, works from anywhere. Start with a free phone system review."
          primaryLabel="Free Phone System Review"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
