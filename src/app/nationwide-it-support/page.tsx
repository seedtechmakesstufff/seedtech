import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PhoneCall,
  Globe,
  CheckCircle2,
  Shield,
  Monitor,
  Headphones,
  Server,
  Radar,
  Workflow,
  Building2,
  Briefcase,
  Stethoscope,
  Scale,
  HardHat,
  ClipboardList,
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
import { FixingItRightTabs } from "@/components/managed-it/FixingItRightTabs";

export const metadata: Metadata = {
  title: "Nationwide IT Support Services | SeedTech — Remote & On-Site IT Across the U.S.",
  description:
    "SeedTech provides nationwide IT support — remote help desk, proactive monitoring, cybersecurity, and cloud management for businesses across the United States. Call (914) 362-8889.",
  alternates: { canonical: "/nationwide-it-support" },
  openGraph: {
    title: "Nationwide IT Support Services — SeedTech",
    description:
      "Remote and on-site IT support for businesses across the U.S. — proactive monitoring, cybersecurity, help desk, and cloud management from SeedTech.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nationwide IT Support — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const coreServices = [
  {
    icon: Headphones,
    title: "Remote help desk",
    body: "Your team gets direct access to real technicians — no phone trees, no ticket black holes. We resolve issues fast via remote tools, screen sharing, and clear communication.",
  },
  {
    icon: Radar,
    title: "24/7 proactive monitoring",
    body: "Every workstation, server, and network device is monitored around the clock using NinjaOne RMM. We catch issues before your team notices them — regardless of time zone.",
  },
  {
    icon: Shield,
    title: "Cybersecurity protection",
    body: "SentinelOne endpoint protection, MFA enforcement, email filtering, and automated patching. Layered security designed to protect distributed teams and remote offices.",
  },
  {
    icon: Server,
    title: "Cloud & backup management",
    body: "Microsoft 365 management, cloud backup, and disaster recovery planning. Your business data stays protected and recoverable wherever your team operates.",
  },
  {
    icon: Monitor,
    title: "Device & patch management",
    body: "Automated updates, OS patching, and software deployment across your entire fleet — whether your team uses Windows, macOS, or a mix of both.",
  },
  {
    icon: Workflow,
    title: "Vendor coordination",
    body: "We work directly with your ISPs, software vendors, phone providers, and other third parties to resolve issues and manage renewals so you do not have to.",
  },
];

const whyNationwide = [
  {
    title: "Same team, anywhere",
    body: "Whether you have employees in New Jersey, Texas, or California — your team talks to the same people. No hand-offs to unknown third-party techs.",
  },
  {
    title: "Consistent standards across locations",
    body: "Security policies, monitoring, patching, and documentation follow the same standard no matter where your people sit. No gaps, no inconsistencies.",
  },
  {
    title: "Built for remote and hybrid teams",
    body: "Remote work is not an afterthought for us. Our tooling is designed around distributed teams — cloud-first management, remote access support, and zero-trust security.",
  },
  {
    title: "On-site support when needed",
    body: "Most issues are resolved remotely in minutes. When something requires hands-on work, we dispatch qualified field technicians through our national partner network.",
  },
];

const industries = [
  { icon: Scale, title: "Law firms", body: "Compliance-ready IT, ethical wall configuration, encrypted email, and secure document management for firms of all sizes across the country." },
  { icon: Stethoscope, title: "Healthcare & dental", body: "HIPAA-aligned IT with encrypted communications, access controls, audit logging, and backup protection for patient data." },
  { icon: HardHat, title: "Construction & trades", body: "Rugged device management, field-to-office connectivity, and project management system support for companies operating across multiple job sites." },
  { icon: Briefcase, title: "Professional services", body: "Accounting firms, consultancies, and financial advisors need secure, fast, and reliable systems. We keep your tech running so you can focus on clients." },
  { icon: Building2, title: "Multi-location businesses", body: "Retail chains, franchise operations, and companies with distributed offices get unified IT management — one provider, one standard, every location." },
  { icon: Globe, title: "Remote-first companies", body: "Startups and businesses with fully distributed teams get the same level of monitoring, security, and support as a company with a physical headquarters." },
];

const stats = [
  { value: "50", label: "States covered" },
  { value: "100+", label: "Clients served" },
  { value: "16+", label: "Years in IT" },
  { value: "85", label: "Avg. hours of downtime saved/mo" },
];

const includedCards = [
  {
    icon: Headphones,
    title: "Help desk support",
    body: "Responsive support for your users during business hours when they need help.",
    href: "/help-desk-services-new-jersey",
  },
  {
    icon: Monitor,
    title: "Monitoring and maintenance",
    body: "Ongoing oversight of systems to catch issues early and keep devices running more reliably.",
    href: "/services/managed-it",
  },
  {
    icon: Shield,
    title: "Cybersecurity protection",
    body: "Endpoint protection, patching, and best-practice safeguards to help reduce risk.",
    href: "/cybersecurity-services-new-jersey",
  },
  {
    icon: Server,
    title: "Backup and recovery support",
    body: "Protection for important data and support for recovery planning when something goes wrong.",
    href: "/backup-disaster-recovery-new-jersey",
  },
  {
    icon: PhoneCall,
    title: "Vendor coordination",
    body: "Help working with internet providers, software vendors, phone providers, and other third parties when needed.",
    href: "/services/managed-it",
  },
  {
    icon: ClipboardList,
    title: "Guidance and recommendations",
    body: "Practical advice to help improve your environment over time, not just keep it running day to day.",
    href: "/services/managed-it/assessment",
  },
];

const faqs = [
  {
    q: "Can you really provide IT support nationwide?",
    a: "Yes. Our support model is built around remote-first tooling — NinjaOne for monitoring and management, SentinelOne for security, and direct screen-share access for help desk. Over 90% of issues are resolved remotely. For on-site needs, we dispatch qualified field technicians through our national partner network.",
  },
  {
    q: "How is nationwide support different from local support?",
    a: "The experience is the same — your team contacts us directly, we resolve the issue. The difference is infrastructure: we use cloud-based management tools that work identically whether your office is in Morristown, NJ or Austin, TX. No VPNs back to a central office required.",
  },
  {
    q: "Do you support companies with employees in multiple states?",
    a: "Absolutely. Multi-location and hybrid teams are one of our core use cases. We apply consistent security policies, monitoring, and documentation across every device and location — so your IT environment stays standardized as you grow.",
  },
  {
    q: "What does nationwide IT support cost?",
    a: "SeedCare plans start at $110/user/month for Essentials. Pricing is per-user, month-to-month, no long-term contracts. A 25-person distributed team would be approximately $2,750-$4,000/month depending on the tier.",
  },
  {
    q: "Can you handle on-site work outside of New Jersey?",
    a: "Yes. While our headquarters and core team are in New Jersey, we have a vetted national partner network for on-site dispatch. Most issues are resolved remotely, but when hands-on work is needed — hardware swaps, office moves, network installs — we can get boots on the ground.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "No. SeedCare plans are month-to-month. We believe in earning your trust through consistent service, not locking you into a contract. Plan structure and billing are outlined clearly up front.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nationwide IT Support Services",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Managed IT Support",
  areaServed: { "@type": "Country", name: "United States" },
  description:
    "Nationwide managed IT support — remote help desk, proactive monitoring, cybersecurity, cloud management, and vendor coordination for businesses across all 50 states.",
  offers: { "@type": "AggregateOffer", lowPrice: "110", highPrice: "160", priceCurrency: "USD", offerCount: "3" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "IT Services", item: "https://seedtechllc.com/services/managed-it" },
    { "@type": "ListItem", position: 3, name: "Nationwide IT Support", item: "https://seedtechllc.com/nationwide-it-support" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function NationwideITSupportPage() {
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
            <Link href="/services/managed-it" className="hover:text-light-base/50 transition-colors">Managed IT</Link>
            <span>/</span>
            <span className="text-light-base/60">Nationwide</span>
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
            <Globe className="w-3.5 h-3.5 mr-1.5" /> Nationwide Coverage
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Nationwide IT Support Services for Growing Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your business should not be limited by geography — and neither should your IT support.
              Whether your team is in one office or spread across the country, SeedTech delivers
              the same proactive monitoring, fast help desk response, and enterprise-grade
              cybersecurity to every user, every device, everywhere.
            </p>
            <p>
              Headquartered in New Jersey with remote-first infrastructure and a national
              dispatch network, we support businesses in all 50 states — no contracts,
              no franchise hand-offs, no impersonal call centers.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Free IT Assessment <ArrowRight className="h-4 w-4" />
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

      {/* Stats bar */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="block font-display text-[3rem] md:text-[3.5rem] leading-none bg-gradient-to-r from-[#c900d4] to-[#aba2f2] bg-clip-text text-transparent">
                {s.value}
              </span>
              <span className="mt-2 block text-sm text-light-base/50">{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Core services */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What You Get"
          title="Nationwide IT Services Built for the Way You Work"
          description="Everything a modern business needs from an IT partner — delivered remotely with the same quality and accountability as a local team sitting next door."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((s) => (
            <div key={s.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                <s.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{s.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why nationwide with SeedTech */}
      <Section>
        <SectionHeader
          eyebrow="Why SeedTech for Nationwide IT"
          title="One Team, One Standard, Every Location"
          description="Most national IT providers route you to a different call center every time. SeedTech is different — your team always works with the same people."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyNationwide.map((item) => (
            <LiquidGlassCard key={item.title} className="p-7">
              <h3 className="mb-3 font-display text-card-title text-white">{item.title}</h3>
              <Body className="text-light-base/55 leading-relaxed">{item.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* How SeedTech Works */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How SeedTech Works"
          title="A Support Process Designed to Actually Improve Things"
          description="We do not just close tickets — we investigate, document, and improve your environment over time."
          theme="light"
        />
        <FixingItRightTabs />
      </Section>

      {/* What's Included */}
      <Section>
        <SectionHeader
          eyebrow="What's Included"
          title="Managed IT Support Built Around the Day-to-Day Needs of Your Business"
          description="Our managed IT services are designed to cover the core pieces most businesses need to stay supported, secure, and productive."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {includedCards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <LiquidGlassCard className="p-7 h-full transition-all duration-200 group-hover:ring-1 group-hover:ring-white/20">
                <IconBox icon={card.icon} variant="gradient" className="mb-4" />
                <CardTitle className="mb-2 group-hover:text-seed-300 transition-colors">{card.title}</CardTitle>
                <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
              </LiquidGlassCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries We Support"
          title="IT Built for Your Industry, Delivered Nationwide"
          description="From law firms to construction companies — we understand the compliance, performance, and security requirements specific to your business."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <LiquidGlassCard key={ind.title} className="p-7">
              <IconBox icon={ind.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{ind.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{ind.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Value proposition */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            The Same People, the Same Standards — No Matter Where Your Business Operates
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-dark-base/60">
            <p>
              When you work with SeedTech, you are not getting routed to a random technician
              in a different state. You work with a consistent team that knows your systems,
              your people, and your business goals.
            </p>
            <p>
              We document everything, standardize configurations, and apply the same security
              policies across every device and every location. That means fewer gaps, faster
              response, and an IT environment that actually gets better over time.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "No long-term contracts",
                "Per-user pricing from $110/mo",
                "Month-to-month flexibility",
                "Same-day remote response",
                "National on-site dispatch",
                "16+ years of IT experience",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 rounded-xl border border-black/[0.05] bg-white px-4 py-3 text-sm text-dark-base/70 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-seed-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader title="Nationwide IT Support — FAQ" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Full managed IT across New Jersey.</p>
            </Link>
            <Link href="/it-support-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">IT Support NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Day-to-day IT support for NJ businesses.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services →</h3>
              <p className="text-body-sm text-dark-base/50">Enterprise-grade security for your team.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See where your IT stands today.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="IT Support That Works Wherever Your Business Does"
          description="Get a free IT assessment — we'll evaluate your environment, identify gaps, and show you what proactive nationwide IT support looks like."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
