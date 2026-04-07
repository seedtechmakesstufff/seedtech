import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  HardHat,
  Shield,
  Headphones,
  Monitor,
  Wrench,
  PhoneCall,
  Cloud,
  MapPin,
  AlertTriangle,
  Clock,
  Smartphone,
  Wifi,
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

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "IT Support for Construction Companies NJ | SeedTech — Managed IT for Contractors",
  description:
    "SeedTech provides IT support for construction companies in New Jersey — job-site connectivity, project management software support, mobile device management, and cybersecurity. Call (914) 362-8889.",
  alternates: { canonical: "/it-support-construction-companies-nj" },
  openGraph: {
    title: "IT Support for Construction Companies NJ — SeedTech",
    description:
      "Managed IT for NJ construction firms. Job-site tech, project management support, mobile device security, and a help desk that understands the trades.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "IT Support for Construction Companies NJ — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const painPoints = [
  {
    icon: MapPin,
    title: "Your team works in the field, not at a desk",
    body: "Superintendents, foremen, and estimators are on job sites — not in an office. They need IT support that works over cellular, handles tablets and phones, and doesn't require them to sit at a desktop to get help.",
  },
  {
    icon: Clock,
    title: "Downtime on a job site costs real money",
    body: "If estimating software crashes before a bid deadline, or the project manager can't pull up plans, you're burning crew time and risking missed deadlines. Construction IT problems don't wait for next-day callbacks.",
  },
  {
    icon: AlertTriangle,
    title: "Your IT provider doesn't understand construction workflows",
    body: "Generic MSPs don't know the difference between Procore and QuickBooks. They don't understand RFI tracking, submittals, or why your estimating software needs to talk to your accounting system. You need IT that speaks your language.",
  },
  {
    icon: Smartphone,
    title: "Personal and company devices are mixed together",
    body: "Field workers use personal phones for job photos, company iPads for plans, and shared laptops for estimating. Without mobile device management, you have no visibility into what's on these devices or how to secure them.",
  },
];

const whatYouGet = [
  {
    icon: Headphones,
    title: "Help desk for office and field",
    body: "Your office staff and field teams call the same number and reach a real technician. Software issues, email problems, connectivity, and device troubleshooting — handled same-day regardless of where your people are working.",
  },
  {
    icon: Monitor,
    title: "Project management software support",
    body: "Procore, Buildertrend, PlanGrid, CoConstruct, Sage, and custom estimating platforms. We support the tools your construction business actually runs on — not just generic office applications.",
  },
  {
    icon: Smartphone,
    title: "Mobile device management",
    body: "Company phones, tablets, and field laptops enrolled, secured, and managed remotely. If a device is lost on a job site, we can wipe it. If it needs an update, we push it. Zero trips to the office required.",
  },
  {
    icon: Shield,
    title: "Cybersecurity for contractors",
    body: "SentinelOne endpoint protection on every device, automated patching, MFA on email and cloud applications, and employee offboarding security. Construction companies are increasingly targeted — ransomware doesn't skip the trades.",
  },
  {
    icon: Cloud,
    title: "Cloud file access and backup",
    body: "Plans, specs, contracts, and project documentation accessible from the field and protected by automated backup. We set up cloud storage that works for construction workflows — shared folders with proper permissions, not chaos.",
  },
  {
    icon: Wifi,
    title: "Job-site and trailer connectivity",
    body: "Temporary office setups, construction trailers, and multi-site networking. We help configure portable hotspots, VPN access for remote plan review, and secure connections between the field and the back office.",
  },
];

const softwareWeSupport = [
  "Procore", "Buildertrend", "PlanGrid", "CoConstruct",
  "Sage 100 Contractor", "QuickBooks", "Viewpoint Vista",
  "Bluebeam Revu", "AutoCAD", "Microsoft Project",
  "Foundation Software", "HeavyBid", "Timberline",
];

const faqs = [
  {
    q: "Do you support construction-specific software like Procore and Sage?",
    a: "Yes. We support the business applications construction companies actually use — Procore, Buildertrend, PlanGrid, Sage 100 Contractor, Bluebeam, AutoCAD, and many others. If your team needs help with installation, updates, integration, or troubleshooting, we handle it.",
  },
  {
    q: "Can your help desk support field workers on job sites?",
    a: "Absolutely. Our help desk is phone and email-based — your field team doesn't need to be in the office to get support. We can remotely access devices, troubleshoot over the phone, and push updates to mobile devices without requiring a trip back to HQ.",
  },
  {
    q: "How do you handle devices that get lost or stolen on job sites?",
    a: "With mobile device management (MDM), we can remotely lock, locate, or wipe any company device. If a tablet or laptop goes missing from a job site, we contain the risk immediately while you figure out the logistics.",
  },
  {
    q: "Is cybersecurity really a concern for construction companies?",
    a: "Yes. Construction companies are increasingly targeted by ransomware and phishing attacks because they handle high-value contracts, bank routing information, and subcontractor payment data. A successful attack can halt operations and delay projects across multiple sites.",
  },
  {
    q: "What does IT support cost for a construction company?",
    a: "SeedCare plans start at $110/user/month for Essentials, $130 for Plus, and $160 for Pro. Per-user pricing scales naturally — whether you have 10 office staff or 50 employees across multiple locations. No contracts, no setup fees.",
  },
  {
    q: "Can you set up technology for temporary job-site trailers?",
    a: "Yes. We help with portable hotspot configuration, VPN access for field teams, printer/scanner setup for trailer offices, and secure connections back to your main network. When the job wraps, we help decommission the setup cleanly.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support for Construction Companies NJ",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "IT Support for Construction Companies",
  areaServed: { "@type": "State", name: "New Jersey" },
  description: "Managed IT support for construction companies in New Jersey — job-site connectivity, project management software support, mobile device management, and cybersecurity for contractors.",
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
    { "@type": "ListItem", position: 2, name: "IT Support for Construction Companies NJ", item: "https://seedtechllc.com/it-support-construction-companies-nj" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ITSupportConstructionNJPage() {
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
            <span className="text-light-base/60">IT Support for Construction Companies NJ</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-10 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="emerald" className="mb-6">
            <HardHat className="w-3.5 h-3.5 mr-1.5" /> Construction IT — New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            IT Support for Construction Companies in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Construction companies don&apos;t run like typical offices — your people are
              in the field, your software is specialized, and downtime means burned crew
              hours and missed deadlines. You need IT support that understands the trades.
            </p>
            <p>
              SeedTech provides managed IT for construction firms across New Jersey —
              project management software support, mobile device management, job-site
              connectivity, and cybersecurity. Help desk for the office and the field.
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

      {/* Section 1 — Pain points */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Sound Familiar?"
          title="Why Generic IT Doesn&apos;t Work for Construction"
          description="Your IT provider probably treats you like every other 20-person office. Construction is different — your challenges are different, and your IT support should be too."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((card) => (
            <div key={card.title} className="rounded-2xl border border-amber-100 bg-amber-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <card.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — What you get */}
      <Section>
        <SectionHeader
          eyebrow="What You Get"
          title="IT Support Built for Construction"
          description="From the back office to the job site — SeedTech provides IT support that works the way construction companies actually operate."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGet.map((card) => (
            <LiquidGlassCard key={card.title} className="p-7">
              <IconBox icon={card.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{card.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{card.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Software we support */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Tools We Know"
          title="Construction Software We Support"
          description="We don't just support Microsoft Office. We know the applications construction companies depend on — and we keep them running."
          theme="light"
        />
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {softwareWeSupport.map((sw) => (
              <div key={sw} className="flex items-center gap-2 rounded-2xl bg-white border border-black/[0.05] shadow-cardLight px-5 py-4">
                <Wrench className="h-4 w-4 shrink-0 text-seed-600" />
                <p className="text-body-sm font-medium text-dark-base">{sw}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">Simple Pricing</LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            IT Support That Scales With Your Crew
          </h2>
          <p className="text-body-lg leading-relaxed text-light-base/60 mb-8">
            SeedCare Essentials starts at $110/user/mo. Plus at $130. Pro at $160.
            Per-user pricing means you pay for the people who need support — whether
            that&apos;s 5 office staff or 40 across three sites. No contracts, no setup fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services/managed-it/plans"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              See Plans & Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services/managed-it/assessment"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Free IT Assessment
            </Link>
          </div>
        </div>
      </Section>

      {/* NJ geo signals */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Serving Construction Companies Across New Jersey
          </h2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            SeedTech provides IT support to general contractors, specialty trades, and
            construction management firms throughout New Jersey — from Morristown to
            Hopatcong, Morris County to Union County.
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
        <SectionHeader title="Construction IT — Frequently Asked Questions" align="left" />
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
              <p className="text-body-sm text-dark-base/50">Proactive IT with flat-rate pricing.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-dark-base/50">Layered security for NJ businesses.</p>
            </Link>
            <Link href="/endpoint-security-new-jersey" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Endpoint Security NJ →</h3>
              <p className="text-body-sm text-dark-base/50">SentinelOne on every device.</p>
            </Link>
            <Link href="/services/managed-it/assessment" className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow">
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">Free IT Assessment →</h3>
              <p className="text-body-sm text-dark-base/50">See where your construction IT stands.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="IT Support for Construction Companies in NJ"
          description="From the back office to the job site. Help desk, security, project software support, and mobile device management — built for how construction works."
          primaryLabel="Free IT Assessment"
          primaryHref="/services/managed-it/assessment"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
