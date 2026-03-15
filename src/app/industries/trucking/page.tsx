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

export const metadata = {
  title: "Websites & Managed IT for Trucking & Logistics Companies — SeedTech",
  description:
    "SeedTech helps trucking, freight, bulk hauling, and logistics companies build trust faster, recruit drivers more effectively, and streamline operations with high-performance websites and proactive IT support.",
};

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
  { tool: "Email Security & Anti-Phishing", purpose: "Protect dispatch communications and financial data from breaches" },
  { tool: "Cloud Backup & File Management", purpose: "Secure off-site storage for BOLs, contracts, and compliance records" },
  { tool: "Endpoint Support", purpose: "Antivirus, patch management, and help desk for office and remote dispatch teams" },
  { tool: "Quote / Load Request Forms", purpose: "Structured intake tied to your ops workflow — not just a contact form" },
  { tool: "Call Tracking & Analytics", purpose: "Know exactly which pages and campaigns are generating real inquiries" },
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
    a: "We manage your office infrastructure — email security, endpoint protection, cloud backups, and help desk support. If your dispatch team, accounting team, or admin staff relies on computers and communication tools, we keep that running reliably.",
  },
];

export default function TruckingPage() {
  return (
    <div>
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
              <AnimatedH1 highlightWords={["Trust Faster"]} delay={0.15} className="text-left">
                Trucking & Logistics Companies That Build Trust Faster
              </AnimatedH1>
              <p className="mt-6 text-body-lg text-light-base/55 max-w-xl leading-relaxed">
                Shippers, brokers, and drivers evaluate your company online before they ever call. SeedTech helps trucking, freight, and logistics companies build websites that communicate capability clearly, recruit more effectively, and support the operations running behind the scenes.
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
              File: /public/industries/trucking-hero-1.jpg
              Recommended size: 273×400px (portrait) — Class 8 truck, highway, motion or parked fleet
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/trucking-hero-1.jpg"
                alt="Semi truck fleet on highway"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Semi / fleet on highway or yard
                </p>
              </div>
            </div>
            {/*
              IMAGE 2 — Bulk hauling, flatbed, or specialty freight load
              File: /public/industries/trucking-hero-2.jpg
              Recommended size: 273×400px (portrait) — flatbed with steel, bulk tanker, or specialized load
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/trucking-hero-2.jpg"
                alt="Flatbed or bulk freight specialty load"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Flatbed / bulk / specialty freight
                </p>
              </div>
            </div>
            {/*
              IMAGE 3 — Dispatch office or driver operations environment
              File: /public/industries/trucking-hero-3.jpg
              Recommended size: 273×400px (portrait) — dispatcher at screens, logistics ops room
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/trucking-hero-3.jpg"
                alt="Trucking dispatch operations office"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Dispatch office / logistics ops
                </p>
              </div>
            </div>
            {/*
              IMAGE 4 — SeedTech website / driver portal mockup on device
              File: /public/industries/trucking-hero-4.jpg
              Recommended size: 273×400px (portrait) — device mockup showing driver app or trucking site
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/trucking-hero-4.jpg"
                alt="Trucking company website mockup on device"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Website / driver portal mockup
                </p>
              </div>
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
              Most trucking companies do specialized work but present themselves too generically online.
            </h2>
            <p className="text-body text-dark-base/60 leading-relaxed mb-6">
              If your website doesn&apos;t clearly communicate your lanes, equipment, load types, compliance record, and service lines — shippers and brokers move on to the next option. Generic &ldquo;we haul everything&rdquo; websites don&apos;t convert.
            </p>
            <p className="text-body text-dark-base/60 leading-relaxed">
              And with driver shortages impacting operations across every freight segment, your careers page is as important as your quote flow. SeedTech builds both.
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
          title="Your website needs to do"
          titleHighlight="three things well."
          description="Trucking and logistics buyers don't just browse — they validate. Build trust, generate load requests, and reduce recruiting friction all from the same digital presence."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Shield} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Build Trust</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Authority number, safety rating, permits, insurance, testimonials — organized and visible before anyone has to ask. Over 74% of buyers validate across multiple sources.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={ClipboardList} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Generate Inquiries</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Load requests, quote forms, and brokerage intake flows that capture the right information upfront — so your ops team can respond fast and qualify quickly.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Users} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Recruit Drivers</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Mobile-first driver applications, clear comp and home-time details, and careers pages built to convert — not just to exist. Driver recruiting is a business problem, not just an HR task.
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
          description="Get a free audit covering your website, driver recruiting flow, and IT infrastructure — tailored to trucking and logistics operations."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="View Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
