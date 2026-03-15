import {
  Scale,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  ClipboardList,
  Gavel,
  Phone,
  ChevronDown,
  Star,
  CalendarCheck,
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
  title: "Websites & Managed IT for Law Firms — SeedTech",
  description:
    "SeedTech helps law firms convert more consultations, reduce intake friction, and secure daily operations with high-performance websites and managed IT.",
};

/* ── Data ───────────────────────────────────────────────────────────────────── */

const stats = [
  { value: "1.37M", label: "U.S. lawyers competing for the same clients" },
  { value: "53%", label: "higher revenue for firms using digital intake tools" },
  { value: "48%", label: "more leads reported with online intake" },
  { value: "75%", label: "of attorneys already use cloud computing for work" },
];

const features = [
  {
    icon: Gavel,
    title: "Practice-Area Architecture",
    body: "Dedicated, SEO-optimized pages for every practice area your firm handles — so buyers searching for specific legal help find you, not a competitor.",
  },
  {
    icon: Users,
    title: "Attorney Profile Pages",
    body: "Professional bio pages with headshots, credentials, bar admissions, and practice focus areas. Buyers want to know who they're hiring before the first call.",
  },
  {
    icon: ClipboardList,
    title: "Structured Intake & Consultation Forms",
    body: "Online intake flows that capture case type, urgency, and contact details — so your team gets qualified information before spending billable time.",
  },
  {
    icon: CalendarCheck,
    title: "Consultation Scheduling",
    body: "Integrated scheduling that lets prospective clients book a consultation directly from your website — reducing phone tag and speeding up first contact.",
  },
  {
    icon: Star,
    title: "Reviews & Testimonial Systems",
    body: "Structured review capture and display that turns satisfied clients into visible social proof for every future prospect evaluating your firm.",
  },
  {
    icon: Phone,
    title: "Responsiveness Systems",
    body: "SMS follow-up, email routing, and intake notifications that ensure no inquiry goes unanswered. Clio data shows a 7% conversion lift from text messaging alone.",
  },
];

const comparisonRows = [
  { old: "Static brochure website", modern: "Conversion-focused intake system" },
  { old: "Generic contact form", modern: "Structured consultation request flow" },
  { old: "Single 'About Us' page for all attorneys", modern: "Individual attorney profile pages with credentials" },
  { old: "One page listing all practice areas", modern: "Dedicated, SEO-optimized pages per practice area" },
  { old: "No follow-up after form submission", modern: "Automated confirmation, SMS, and routing" },
  { old: "Multiple disconnected vendors", modern: "One integrated website + IT partner" },
  { old: "Reactive IT when something breaks", modern: "Proactive monitoring, backup, and security" },
];

const itTools = [
  { tool: "Microsoft 365 & Email Security", purpose: "Secure email with phishing protection, encryption, and archiving for privileged communications" },
  { tool: "Cloud Backup & Recovery", purpose: "Off-site backup of client files, case documents, and firm data — recoverable in minutes" },
  { tool: "Endpoint Protection", purpose: "Antivirus, threat monitoring, and patch management across all firm devices" },
  { tool: "MFA & Access Controls", purpose: "Multi-factor authentication and role-based access to protect client data at every layer" },
  { tool: "Help Desk Support", purpose: "Real support when systems break — no waiting in ticket queues while attorneys sit idle" },
  { tool: "Call Tracking & Analytics", purpose: "See which pages and intake paths are generating actual consultations" },
];

const faqs = [
  {
    q: "We already have a website. Why would we rebuild it?",
    a: "Most law firm websites were built to look professional — not to convert visitors into consultations. If your site doesn't have structured intake forms, practice-area pages optimized for search, attorney profiles, and review integration, it's leaving consultations on the table. Firms using digital intake tools report up to 53% higher revenue.",
  },
  {
    q: "How long does it take to launch a new site?",
    a: "Our AI-accelerated development pipeline moves significantly faster than traditional agencies. Most law firm website builds launch in 4–8 weeks depending on scope, number of practice areas, and integration complexity.",
  },
  {
    q: "Do you work with firms that already have an IT provider?",
    a: "Yes. We can complement an existing IT setup or take over entirely. Many firms come to us specifically because they want one partner managing both their website and IT — so there's no finger-pointing between vendors when something breaks.",
  },
  {
    q: "How do you handle confidentiality and data security?",
    a: "Security is foundational to everything we build. We implement email encryption, MFA, endpoint protection, cloud backup, and access controls aligned with bar association cybersecurity guidance. 60% of firms have formal cybersecurity policies — we help you meet or exceed that standard.",
  },
  {
    q: "Can you support multiple practice areas and attorney pages?",
    a: "Absolutely. We architect sites with scalable practice-area page structures and individual attorney profiles. As your firm grows and adds attorneys or practice areas, the site scales with you.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default function LawFirmsPage() {
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
                <Scale className="w-3.5 h-3.5 inline mr-1.5" />
                Law Firms
              </LiquidGlassPill>
              <AnimatedH1 highlightWords={["Intake System"]} delay={0.15} className="text-left">
                Your Website Is Your Firm&apos;s Intake System — Not a Brochure
              </AnimatedH1>
              <p className="mt-6 text-body-lg text-light-base/55 max-w-xl leading-relaxed">
                Most law firms don&apos;t have a traffic problem — they have an intake-friction problem. SeedTech builds digital infrastructure that helps law firms convert more visitors into qualified consultations, respond faster, and operate more securely.
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
              IMAGE 1 — Professional attorney office or conference room
              File: /public/industries/law-firms-hero-1.jpg
              Recommended size: 273×400px (portrait)
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/law-firms-hero-1.jpg"
                alt="Professional law firm office environment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Law office / conference room
                </p>
              </div>
            </div>
            {/*
              IMAGE 2 — Attorney profile or team headshot setting
              File: /public/industries/law-firms-hero-2.jpg
              Recommended size: 273×400px (portrait)
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/law-firms-hero-2.jpg"
                alt="Attorney at work in a law firm"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Attorney profile / headshot setting
                </p>
              </div>
            </div>
            {/*
              IMAGE 3 — Legal research / consultation in progress
              File: /public/industries/law-firms-hero-3.jpg
              Recommended size: 273×400px (portrait)
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/law-firms-hero-3.jpg"
                alt="Legal consultation in progress"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Consultation / legal research
                </p>
              </div>
            </div>
            {/*
              IMAGE 4 — Law firm website mockup on device
              File: /public/industries/law-firms-hero-4.jpg
              Recommended size: 273×400px (portrait)
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/industries/law-firms-hero-4.jpg"
                alt="Law firm website mockup on device"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">
                  273×400px<br />Website / intake portal mockup
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
              "AI-Accelerated Build Timeline",
              "Intake & Consultation Systems",
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
              Most law firm websites don&apos;t convert — they just exist.
            </h2>
            <p className="text-body text-dark-base/60 leading-relaxed mb-6">
              Prospective clients are evaluating your firm online before they ever call. They&apos;re looking for practice-area clarity, attorney credentials, client reviews, and a clear path to schedule a consultation — not a generic brochure with a stock photo of a gavel.
            </p>
            <p className="text-body text-dark-base/60 leading-relaxed">
              Clio&apos;s 2025 data shows firms using digital intake tools — online forms, e-signatures, schedulers, and text messaging — report up to 53% higher revenue and 48% more leads. The issue isn&apos;t visibility. It&apos;s friction.
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
          eyebrow="What Your Website Should Actually Do"
          title="Trust. Intake."
          titleHighlight="Responsiveness."
          description="Your website needs to function as three systems at once. If any one of them fails, you're losing consultations to firms who got it right."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Shield} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Trust System</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Attorney profiles, credentials, practice-area clarity, client reviews, and case results. Prospective clients form a trust impression before the first call — your website is where it happens.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={ClipboardList} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Intake System</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Structured consultation request forms, case type routing, and online scheduling. The right intake flow captures qualified leads and reduces the work required before the first meeting.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Phone} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Responsiveness System</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Email routing, SMS follow-up, and appointment confirmations ensure no inquiry goes unanswered. Clio data shows a 10% conversion lift from e-signatures and 7% from text messaging.
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* ── What We Build ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Build"
          title="What your law firm website should include"
          description="These aren't nice-to-haves. These are the components that turn a law firm website into a consultation-generating system — not a digital placeholder."
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

      {/* ── Old vs Modern Comparison ── */}
      <Section>
        <SectionHeader
          eyebrow="The Shift"
          title="Old law firm website vs."
          titleHighlight="modern intake system."
          description="The gap between a static brochure site and a modern, intake-optimized law firm website is the difference between leaving consultations on the table and filling your calendar."
          align="center"
        />
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-body-sm font-semibold text-red-400/80">Old Approach</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-emerald-400">Modern Approach</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.old} className={i % 2 === 0 ? "bg-dark-elevated" : "bg-white/[0.02]"}>
                  <td className="px-6 py-4 text-body-sm text-light-base/40">{row.old}</td>
                  <td className="px-6 py-4 text-body-sm text-light-base/70">{row.modern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Process: How We Work ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How It Works"
          title="From consultation to launch —"
          titleHighlight="fast."
          description="Our AI-accelerated development process compresses timelines without cutting corners on quality, compliance, or intake optimization."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ProcessStep
            theme="light"
            step="01"
            title="Discovery & Strategy"
            description="We audit your current site, understand your practice areas, intake workflow, and competitive landscape, and map the page architecture that supports your firm's growth goals."
          />
          <ProcessStep
            theme="light"
            step="02"
            title="Build & Configure"
            description="We design and build your site with AI-assisted workflows — practice-area pages, attorney profiles, intake forms, scheduling, review integration, and security infrastructure built in."
          />
          <ProcessStep
            theme="light"
            step="03"
            title="Launch & Support"
            description="We launch, configure analytics and call tracking, and remain available for managed IT support, content updates, security monitoring, and system maintenance going forward."
          />
        </div>
      </Section>

      {/* ── Managed IT Table ── */}
      <Section>
        <SectionHeader
          eyebrow="Managed IT & Security"
          title="Technology that keeps your firm secure and running"
          description="Law firms are prime targets for cyberattacks because they manage privileged, confidential, financial, and strategic data. SeedTech manages the infrastructure that protects it."
          align="center"
        />
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-body-sm font-semibold text-white">Technology Tool</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-white">What It Does for Your Firm</th>
              </tr>
            </thead>
            <tbody>
              {itTools.map((row, i) => (
                <tr key={row.tool} className={i % 2 === 0 ? "bg-dark-elevated" : "bg-white/[0.02]"}>
                  <td className="px-6 py-4 text-body-sm font-medium text-light-base/80">{row.tool}</td>
                  <td className="px-6 py-4 text-body-sm text-light-base/50">{row.purpose}</td>
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
          title="Questions we hear from law firms"
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
          title="Ready to turn your website into your firm's best intake tool?"
          description="Get a free audit covering your website, intake flow, IT infrastructure, and security posture — designed specifically for law firms."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="Talk to Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
