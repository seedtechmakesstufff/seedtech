import {
  HardHat,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  ClipboardList,
  FolderOpen,
  FileCheck,
  TrendingUp,
  Building2,
  ChevronDown,
  Search,
  BarChart3,
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

export const generateMetadata = buildMetadata("/industries/construction");

const stats = [
  { value: "919K+", label: "U.S. construction establishments" },
  { value: "67%", label: "of construction leaders say growth depends on digital tools" },
  { value: "55%", label: "cite labor shortages as a primary growth barrier" },
  { value: "74%", label: "of buyers use multiple sources to validate a company before contact" },
];

const features = [
  {
    icon: FolderOpen,
    title: "Project Portfolio & Gallery",
    body: "Your work is your most powerful sales tool. We build galleries and case study pages that show scale, scope, and quality — fast.",
  },
  {
    icon: ClipboardList,
    title: "Bid & Estimate Request Flows",
    body: "Structured intake forms that capture project specs, location, timeline, and contact info — so every inquiry is qualified before you pick up the phone.",
  },
  {
    icon: Users,
    title: "Careers & Recruiting Pages",
    body: "Labor shortages are real. We build recruiting-first careers pages with low-friction applications to attract and convert qualified tradespeople.",
  },
  {
    icon: FileCheck,
    title: "Certifications & Safety Pages",
    body: "Dedicated pages for your certifications, safety records, insurance, bonding, and compliance — giving buyers the proof they need to hire with confidence.",
  },
  {
    icon: Building2,
    title: "Service Area & Location Pages",
    body: "SEO-optimized pages for every market you serve. When buyers search for contractors in their area, your company shows up.",
  },
  {
    icon: TrendingUp,
    title: "Review & Testimonial Systems",
    body: "Structured review capture flows and display blocks that turn satisfied clients into visible proof for every future prospect.",
  },
];

const itTools = [
  { tool: "Google Workspace Management", purpose: "Secure business email, anti-phishing, spam filtering" },
  { tool: "File Backups & Cloud Storage", purpose: "Protect drawings, contracts, and client data off-site" },
  { tool: "Device Protection", purpose: "Antivirus, threat monitoring, and patch management for office PCs and laptops" },
  { tool: "Remote Access & VPN", purpose: "Secure field-to-office connectivity for project managers and estimators" },
  { tool: "Help Desk Support", purpose: "Real support when systems break — no waiting in ticket queues" },
  { tool: "Call Tracking & Analytics (Website / VoIP)", purpose: "See which pages and campaigns are driving actual inquiries" },
];

const faqs = [
  {
    q: "We already have a website. Why would we need to rebuild it?",
    a: "Most construction websites were built to look presentable — not to generate bids, support recruiting, or prove capability to serious buyers. If your site doesn't have structured project galleries, estimate intake flows, certifications pages, and careers sections, it's leaving business on the table.",
  },
  {
    q: "How long does it take to launch?",
    a: "Timelines depend on scope, approvals, and how much content has to be organized, but our goal is to keep the project moving in a clear and practical way.",
  },
  {
    q: "Do you handle IT support for field teams?",
    a: "Yes. We support both office infrastructure and field-facing devices — laptops, tablets, and connected tools used on job sites. If it's in your technology stack, we can manage it.",
  },
  {
    q: "Can you help with multiple locations or service areas?",
    a: "Absolutely. Multi-location pages and geo-targeted SEO are a standard part of how we build for construction companies operating across multiple markets.",
  },
  {
    q: "We're a small operation. Is this relevant to us?",
    a: "Yes. Your buyers don't know you're small until they meet you — your website sets the tone before the first call. A professionally built, credibility-forward site helps smaller operations compete with larger firms on appearance and trust.",
  },
];

export default function ConstructionPage() {
  return (
    <div>
      <ServiceJsonLd
        name="IT Services for Construction & Rigging"
        description="Project management tools, job-site connectivity, fleet GPS tracking, cybersecurity, and custom websites for construction and rigging companies."
        url="https://seedtechllc.com/industries/construction"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: "Construction & Rigging", url: "/industries/construction" },
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
                <HardHat className="w-3.5 h-3.5 inline mr-1.5" />
                Construction & Rigging
              </LiquidGlassPill>
              <AnimatedH1 highlightWords={["Need Things to Work"]} delay={0.15} className="text-left">
                Technology and Website Support for Construction Companies That Need Things to Work
              </AnimatedH1>
              <p className="mt-6 text-body-lg text-light-base/55 max-w-xl leading-relaxed">
                Construction businesses do not need polished marketing talk. They need a website that shows capability clearly, a better way to handle inbound requests, and dependable technology support for the office side of the business. SeedTech helps small and mid-size construction companies keep things organized, credible, and easier to manage.
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
              IMAGE 1 — Full-width jobsite or aerial project photo
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_1_1_5x.webp"
                alt="Active construction job site with heavy equipment"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/*
              IMAGE 2 — Close-up of rigging, steel, or specialty trade work
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_2_1_5x.webp"
                alt="Rigging and specialty trade work close-up"
                fill
                className="object-cover"
              />
            </div>
            {/*
              IMAGE 3 — Completed project showcase: building exterior or infrastructure
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_3_1_5x.webp"
                alt="Completed construction project showcase"
                fill
                className="object-cover"
              />
            </div>
            {/*
              IMAGE 4 — SeedTech website mockup on device (laptop/tablet)
            */}
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image
                src="/img/seed%20graphics/hero_4_1_5x.webp"
                alt="Construction company website mockup on device"
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
              "AI-Accelerated Build Timeline",
              "Recruiting & Bid Systems",
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
              A lot of construction sites look fine but do not do much for the business.
            </h2>
            <p className="text-body text-dark-base/60 leading-relaxed mb-6">
              They bury proof of work, make quote requests harder than they should be, and leave office teams working around outdated systems.
            </p>
            <p className="text-body text-dark-base/60 leading-relaxed">
              We help simplify that. The goal is to make the company easier to trust, easier to contact, and easier to run.
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

      {/* ── What Industrial Buyers Actually Do ── */}
      <Section>
        <SectionHeader
          eyebrow="Why Digital Infrastructure Matters"
          title="What Your Website and Support"
          titleHighlight="Should Actually Do"
          description="The goal is not more vendor talk. It is clearer proof, cleaner inbound requests, and support that helps the office side of the business run better."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Shield} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Show Your Work Clearly</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Project pages, certifications, service areas, and company information should help buyers understand what you do without having to dig.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={Users} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Make Inquiries Easier to Manage</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              Quote and estimate requests should capture the information your team actually needs, not just generate another vague contact form submission.
            </p>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 p-8">
            <IconBox icon={ClipboardList} variant="gradient" size="lg" />
            <h3 className="font-display text-card-title text-white">Support the Office Behind the Field Work</h3>
            <p className="text-body-sm text-light-base/55 leading-relaxed">
              We help keep the communication, devices, backups, and day-to-day support side of the business more reliable.
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* ── What We Build ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Build"
          title="What your construction website should include"
          description="These aren't nice-to-haves. These are the components that make a construction company's website work as a business tool — not just a digital brochure."
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

      {/* ── Process: How We Work ── */}
      <Section>
        <SectionHeader
          eyebrow="How It Works"
          title="From brief to live site —"
          titleHighlight="fast."
          description="Our AI-accelerated development process compresses timelines without cutting corners on quality or industry fit."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ProcessStep
            theme="dark"
            step="01"
            title="Discovery & Strategy"
            description="We audit your current site, understand your service lines, markets, and operational workflow, and map the page architecture that supports your business goals."
          />
          <ProcessStep
            theme="dark"
            step="02"
            title="Build & Configure"
            description="We design and build your site with AI-assisted workflows — project galleries, intake forms, careers pages, certifications sections, and location pages built in."
          />
          <ProcessStep
            theme="dark"
            step="03"
            title="Launch & Support"
            description="We launch, configure analytics and call tracking, and remain available for managed IT support, content updates, and system maintenance going forward."
          />
        </div>
      </Section>

      {/* ── Managed IT Table ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Managed IT"
          title="Technology that keeps your operation running"
          description="Beyond the website, SeedTech manages the IT infrastructure that construction companies depend on — so you never lose a day of work to a system failure."
          align="center"
          theme="light"
        />
        <div className="max-w-3xl mx-auto rounded-3xl border border-black/[0.07] bg-white shadow-cardLight overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-seed-50">
                <th className="px-6 py-4 text-body-sm font-semibold text-dark-base">Technology Tool</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-dark-base">What It Does for You</th>
              </tr>
            </thead>
            <tbody>
              {itTools.map((row, i) => (
                <tr key={row.tool} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  <td className="px-6 py-4 text-body-sm font-medium text-dark-base">{row.tool}</td>
                  <td className="px-6 py-4 text-body-sm text-dark-base/55">{row.purpose}</td>
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
              body: "See where your company ranks on Google for terms like \"commercial roofing NJ\" or \"steel erection contractor\" — updated in real time from Search Console.",
            },
            {
              icon: BarChart3,
              title: "Performance Audits",
              body: "One-click Core Web Vitals and PageSpeed audits. Know exactly what Google sees when it evaluates your site — and what to fix first.",
            },
            {
              icon: Zap,
              title: "Instant Indexing",
              body: "New project gallery or service page? One click notifies search engines instantly via IndexNow — no waiting for crawlers to discover it.",
            },
            {
              icon: Sparkles,
              title: "Your Company, Your Voice",
              body: "The system knows your trade specialties, certifications, service areas, and project history. You control the business context that drives every recommendation.",
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
            Most construction websites are static brochures with a phone number. Yours comes with a full SEO engine — keyword tracking that replaces $300/mo tools, an AI strategist that replaces agency retainers, and a content system that turns one keyword into a published page in minutes.
          </p>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <SectionHeader
          eyebrow="Common Questions"
          title="Questions we hear from construction companies"
          align="center"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/[0.08] bg-dark-elevated overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none">
                <span className="font-display text-card-title text-white">{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-white/40 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-7 pb-6">
                <p className="text-body-sm text-light-base/55 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ── */}
      <Section>
        <CTABanner
          title="Ready to build a construction website that actually works?"
          description="Get a free audit covering your website, IT infrastructure, and digital presence — tailored to construction and rigging companies."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="View Our Work"
          secondaryHref="/our-work"
        />
      </Section>
    </div>
  );
}
