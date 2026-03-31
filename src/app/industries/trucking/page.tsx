import {
  Truck,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  MapPin,
  FileCheck,
  BarChart3,
  ChevronDown,
  ClipboardList,
  Search,
  Zap,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  LiquidGlassPill,
  CTABanner,
  GlassCard,
  IconBox,
  ProcessStep,
} from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/industries/trucking", {
  title: "Websites & Managed IT for Trucking & Logistics Companies",
  description:
    "SeedTech helps trucking companies improve service-line clarity, clean up hiring and quote flows, and keep office technology more reliable.",
});

const stats = [
  { value: "1.46M+", label: "employees in U.S. truck transportation" },
  { value: "892K+", label: "heavy & tractor-trailer drivers nationwide" },
  { value: "75%+", label: "of buyers use video to research a company before contact" },
  { value: "74%", label: "use multiple sources to validate a company before reaching out" },
];

const features = [
  {
    icon: Truck,
    title: "Service-Line Clarity Pages",
    body: "Buyers need to know exactly what you haul, where you run, and what equipment you operate. Separate service pages for general freight, specialized, bulk, brokerage, and flatbed — so nothing is ambiguous.",
  },
  {
    icon: ClipboardList,
    title: "Quote & Load Request Flows",
    body: "Structured online quote requests that capture lane, load type, volume, and contact info — so your ops team has what they need before the first call.",
  },
  {
    icon: Users,
    title: "Driver Recruiting & Application Pages",
    body: "Mobile-first driver application flows built for CDL-A and CDL-B recruiting — with low friction, clear comp details, and integration with your ATS or onboarding system.",
  },
  {
    icon: MapPin,
    title: "Terminal & Location Pages",
    body: "Multi-terminal companies need location pages that communicate hours, contacts, dispatch info, and service radius — not just a Google Maps embed.",
  },
  {
    icon: FileCheck,
    title: "Permits, Insurance & Compliance Resources",
    body: "A dedicated trust page with your authority number, insurance certificates, safety rating, and compliance links — giving shippers and brokers the proof they need to work with you.",
  },
  {
    icon: BarChart3,
    title: "Testimonials & Proof Systems",
    body: "Structured review capture and display systems that build visible social proof — the kind that converts a first-time visitor into a load tender or driver application.",
  },
];

const itTools = [
  { tool: "Driver Application Flow", purpose: "Low-friction mobile-friendly online applications integrated with onboarding" },
  { tool: "Email Security & Anti-Phishing Training", purpose: "Protect dispatch communications and financial data from breaches" },
  { tool: "Cloud Backup & File Management", purpose: "Secure off-site storage for BOLs, contracts, and compliance records" },
  { tool: "Computer Support", purpose: "Antivirus, patch management, and help desk for office and remote dispatch teams" },
  { tool: "Quote / Load Request Forms", purpose: "Structured intake tied to your ops workflow — not just a contact form" },
  { tool: "Call Tracking & Analytics (Dialpad)", purpose: "Know exactly which pages and campaigns are generating real inquiries — available when using Dialpad" },
];

const eastsideBulkModules = [
  "Distinct service-line pages: Materials / Trucking / Brokerage",
  "48-hour delivery commitment — prominently displayed",
  "Multiple office locations with contact details",
  "Dedicated permits & insurance resource page",
  "Jobs / hiring entry point in primary navigation",
  "Structured quote request pathways",
];

const faqs = [
  {
    q: "Our operation is specialized. Can you build for our specific niche?",
    a: "Yes. Whether you run bulk liquid, flatbed, heavy haul, drayage, or brokerage, we build around your actual service lines — not a generic trucking template. The more specific your niche, the more valuable the clarity.",
  },
  {
    q: "How do we stand out against larger carriers online?",
    a: "Clarity, trust signals, and operational specificity. Large carriers are often generic. A well-built site that clearly communicates your lanes, equipment, compliance record, and specialization can outperform much larger competitors in the regions you actually serve.",
  },
  {
    q: "Can you integrate our site with our TMS or dispatch software?",
    a: "We can build connectors and API integrations with major platforms including Samsara, KeepTruckin/Motive, and other dispatch/load management systems. For custom integrations, we scope it as part of the project.",
  },
  {
    q: "We need to hire drivers constantly. Can you help with that?",
    a: "Recruiting is a core piece of how we build trucking sites — not an afterthought. We build dedicated careers pages, driver-facing landing pages, and mobile-optimized application flows that reduce drop-off and increase conversion.",
  },
  {
    q: "What does IT support look like for a trucking operation?",
    a: "We manage your office infrastructure — file and email security, device and computer support, cloud backups, and help desk support. If your dispatch team, accounting team, or admin staff relies on computers and communication tools, we keep that running reliably.",
  },
];

export default function TruckingPage() {
  return (
    <div>
      <ServiceJsonLd
        name="IT Services for Trucking & Logistics"
        description="Fleet management software, GPS tracking, ELD compliance, cybersecurity, and custom websites for trucking and logistics companies."
        url="https://seedtechllc.com/industries/trucking"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: "Trucking & Logistics", url: "/industries/trucking" },
        ]}
      />
      {/* ── Hero ── */}
      <section className="relative bg-dark-base pt-36 pb-6">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />

        {/* Top row: headline left, CTA right */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Headline block */}
            <div className="max-w-3xl">
              <LiquidGlassPill variant="seed" className="mb-6">
                <Truck className="w-3.5 h-3.5 inline mr-1.5" />
                Trucking & Logistics
              </LiquidGlassPill>
              <AnimatedH1 highlightWords={["Clarity and Reliability"]} delay={0.15} className="text-left">
                Websites and IT Support for Trucking Companies That Need Clarity and Reliability
              </AnimatedH1>
              <p className="mt-6 text-body-lg text-light-base/55 max-w-xl leading-relaxed">
                Trucking companies need to communicate clearly with shippers, brokers, drivers, and internal staff. SeedTech helps small and mid-size operations improve the way they present services online, handle inquiries and recruiting, and keep office technology running reliably behind the scenes.
              </p>
            </div>
            {/* CTA block — pinned bottom-right on desktop */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4 lg:items-end lg:shrink-0">
              <Link
                href="/free-audit"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-seed-600 to-seed-500 text-white font-medium hover:shadow-glowSeed transition-all duration-200 whitespace-nowrap"
              >
                Get a Free Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl liquid-glass text-white font-medium transition-all duration-200 whitespace-nowrap"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>

        {/* Image mosaic — 4 images, rounded top corners only */}
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/*
              IMAGE 1 — Semi truck / tractor-trailer on highway or yard
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_1_1_5x.webp"
                alt="Semi truck fleet on highway"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/*
              IMAGE 2 — Bulk hauling, flatbed, or specialty freight load
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_2_1_5x.webp"
                alt="Flatbed or bulk freight specialty load"
                fill
                className="object-cover"
              />
            </div>
            {/*
              IMAGE 3 — Dispatch office or driver operations environment
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_3_1_5x.webp"
                alt="Trucking dispatch operations office"
                fill
                className="object-cover"
              />
            </div>
            {/*
              IMAGE 4 — SeedTech website / driver portal mockup on device
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_4_1_5x.webp"
                alt="Trucking company website mockup on device"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <div className="bg-dark-elevated border-y border-white/[0.05] py-5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              "Website + IT in One Partner",
              "Driver Recruiting Systems",
              "Quote & Load Intake Flows",
              "NJ-Based, Nationwide Capable",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-body-sm text-light-base/50">
                <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why This Matters ── */}
      <Section theme="light">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-body-sm font-medium text-seed-600 mb-3 uppercase tracking-widest">The Problem</p>
            <h2 className="font-display text-h2 text-dark-base leading-tight mb-6">
              Many trucking companies do specialized work but present themselves too generally online.
            </h2>
            <p className="text-body text-dark-base/60 leading-relaxed mb-6">
              That creates confusion for the people you want to reach and extra work for the people already running the business.
            </p>
            <p className="text-body text-dark-base/60 leading-relaxed">
              We help make the operation easier to understand and easier to support, from service-line clarity on the website to dependable day-to-day technology help.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/[0.07] bg-white shadow-cardLight p-6 flex flex-col gap-2"
              >
                <span className="font-display text-3xl font-bold text-seed-600">{s.value}</span>
                <span className="text-body-sm text-dark-base/55 leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Three Functions ── */}
      <Section>
        <SectionHeader
          eyebrow="Why Digital Infrastructure Matters"
          title="What Your Website and Support"
          titleHighlight="Should Actually Handle"
          description="The goal is to communicate clearly, make inbound requests easier to manage, and reduce disruption on the office side of the business."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Shield} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Explain What You Actually Do</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Your site should make service lines, equipment, locations, and capabilities clear quickly.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={ClipboardList} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Make Quote and Hiring Flows Easier</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Load requests and driver applications should be practical, mobile-friendly, and easier for your team to follow up on.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Users} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Keep the Office Side Dependable</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Dispatch, accounting, email, files, and user support all matter. Reliable IT support helps reduce disruption where it actually hurts.
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* ── What We Build ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Build"
          title="What your trucking website should include"
          description="These are the components that make a trucking company's website work as an operational asset — not just a placeholder."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-7 flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-seed-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-seed-600" />
                </div>
                <h3 className="font-display text-card-title text-dark-base">{f.title}</h3>
                <p className="text-body-sm text-dark-base/55 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Eastside Bulk Industry Example ── */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
            <div className="px-8 pt-8 pb-0 md:px-12 md:pt-10">
              <LiquidGlassPill variant="seed" className="mb-5">Industry Structure Example</LiquidGlassPill>
              <h2 className="font-display text-h2 text-white leading-tight mb-4">
                What a well-structured logistics site looks like in practice
              </h2>
              <p className="text-body text-light-base/55 leading-relaxed mb-8">
                Eastside Bulk is a publicly visible example of a logistics operation with a site that works as a business tool. Not because of design — because of structure. Here&apos;s what they get right:
              </p>
            </div>
            <div className="px-8 pb-10 md:px-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eastsideBulkModules.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-seed-400 mt-0.5 shrink-0" />
                  <span className="text-body-sm text-light-base/65">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-8 pb-10 md:px-12">
              <p className="text-body-sm text-light-base/35 italic">
                This is a structural reference only — not a SeedTech case study. We use it to illustrate the kind of information architecture that makes logistics sites work.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── How We Work ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How It Works"
          title="From brief to live site —"
          titleHighlight="on a real timeline."
          description="Our AI-accelerated process cuts build time significantly without sacrificing the industry-specific depth your company needs."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ProcessStep
            theme="light"
            step="01"
            title="Discovery & Mapping"
            description="We map your service lines, lanes, equipment, compliance posture, and recruiting needs — then design the page architecture around your actual operation."
          />
          <ProcessStep
            theme="light"
            step="02"
            title="Build & Configure"
            description="We build your site with service pages, recruiting flows, quote intake, compliance resources, and location pages — all tested for speed and mobile performance."
          />
          <ProcessStep
            theme="light"
            step="03"
            title="Launch & Manage"
            description="We launch with analytics and call tracking in place, and we remain available for ongoing IT support, site updates, and recruiting system management."
          />
        </div>
      </Section>

      {/* ── IT Tools Table ── */}
      <Section>
        <SectionHeader
          eyebrow="Managed IT"
          title="Technology that keeps your operation connected"
          description="Behind the website, SeedTech manages the infrastructure your dispatch team, accounting team, and admin staff depend on every day."
          align="center"
        />
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                <th className="px-6 py-4 text-body-sm font-semibold text-white/70">Technology Tool</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-white/70">What It Does for You</th>
              </tr>
            </thead>
            <tbody>
              {itTools.map((row, i) => (
                <tr key={row.tool} className={i % 2 === 0 ? "" : "bg-white/[0.02]"}>
                  <td className="px-6 py-4 text-body-sm font-medium text-white/80">{row.tool}</td>
                  <td className="px-6 py-4 text-body-sm text-light-base/45">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── SEO Autopilot ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Built-In SEO"
          title="Your website comes with an"
          titleHighlight="SEO command center."
          description="Every SeedTech site includes a built-in SEO dashboard with live keyword rankings, performance audits, and instant indexing. Your team controls it directly — no agency retainer, no third-party subscriptions."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Search,
              title: "Live Keyword Rankings",
              body: "See where your company ranks on Google for terms like \"flatbed trucking NJ\" or \"LTL freight Northeast\" — updated in real time from Search Console.",
            },
            {
              icon: BarChart3,
              title: "Performance Audits",
              body: "One-click Core Web Vitals and PageSpeed audits. Know exactly what Google sees when it evaluates your site — and what to fix.",
            },
            {
              icon: Zap,
              title: "Instant Indexing",
              body: "New service page or driver recruiting post? One click notifies search engines instantly via IndexNow — no waiting for crawlers to find it.",
            },
            {
              icon: Sparkles,
              title: "Your Company, Your Voice",
              body: "The system knows your fleet, your lanes, your services, and your compliance certifications. You control the business context that drives every recommendation.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">{item.title}</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <p className="text-body-sm text-dark-base/45 leading-relaxed">
            Most trucking websites are static brochures that never change. Yours comes with a full SEO dashboard — keyword tracking, performance insights, and instant indexing all built in.
          </p>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Common Questions"
          title="Questions we hear from trucking companies"
          align="center"
          theme="light"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-black/[0.07] bg-white shadow-cardLight overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none">
                <span className="font-display text-card-title text-dark-base">{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-dark-base/30 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-7 pb-6">
                <p className="text-body-sm text-dark-base/55 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ── */}
      <Section>
        <CTABanner
          title="Ready to build a trucking website that works as hard as your fleet?"
          description="Get a free audit covering your website, driver recruiting, IT infrastructure, and tech support — tailored to trucking and logistics operations."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="View Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
