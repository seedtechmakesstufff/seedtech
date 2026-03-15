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
  BarChart3,
  Lock,
  Monitor,
  Zap,
  TrendingUp,
  HeartHandshake,
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
  LiquidGlassCard,
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

const intakeStats = [
  { value: "53%", label: "Higher Revenue", note: "Firms using digital intake tools" },
  { value: "48%", label: "More Leads", note: "With online intake forms & scheduling" },
  { value: "+10%", label: "Conversion Lift", note: "From e-signature integration" },
  { value: "+7%", label: "Conversion Lift", note: "From text messaging follow-up" },
  { value: "+5%", label: "Conversion Lift", note: "From online intake forms" },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Turn More Visitors Into Consultations",
    body: "Structured intake, clear practice-area pages, and consultation scheduling convert passive browsers into qualified leads.",
  },
  {
    icon: Zap,
    title: "Reduce Friction to First Contact",
    body: "Online forms, scheduling, and SMS follow-up eliminate phone tag and make it easy for prospects to take the next step.",
  },
  {
    icon: Shield,
    title: "Build Trust Before the First Call",
    body: "Attorney profiles, credentials, client reviews, and case results create a trust impression that wins consultations before you say a word.",
  },
  {
    icon: HeartHandshake,
    title: "One Partner. Less Vendor Chaos.",
    body: "Website, intake systems, IT support, email security, and backup — all managed by one team. No finger-pointing between vendors.",
  },
  {
    icon: Lock,
    title: "Keep Your Firm Secure and Compliant",
    body: "Email encryption, MFA, endpoint protection, and cloud backup aligned with bar association cybersecurity guidance.",
  },
  {
    icon: Monitor,
    title: "Launch Faster With AI-Accelerated Development",
    body: "Our AI-assisted workflows compress build timelines to 4–8 weeks without cutting corners on quality or compliance.",
  },
  {
    icon: BarChart3,
    title: "Support Growth Without Feeling Cobbled Together",
    body: "Add practice areas, attorneys, locations, and integrations as you grow — on a platform built to scale with your firm.",
  },
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

const operationsTools = [
  { tool: "Online Intake Forms", purpose: "Structured case-type capture, urgency routing, and qualification before the first call", category: "Website" },
  { tool: "Consultation Scheduler", purpose: "Self-service booking that eliminates phone tag and speeds up first contact", category: "Website" },
  { tool: "SMS & Email Follow-Up", purpose: "Automated confirmations, reminders, and follow-up that ensure no lead goes cold", category: "Website" },
  { tool: "Review Capture System", purpose: "Post-engagement review requests that build visible social proof over time", category: "Website" },
  { tool: "Attorney & Practice-Area CMS", purpose: "Scalable content management for attorney bios, practice areas, and case results", category: "Website" },
  { tool: "Microsoft 365 & Email Security", purpose: "Secure email with phishing protection, encryption, and archiving for privileged communications", category: "IT" },
  { tool: "Cloud Backup & Device Support", purpose: "Off-site backup of client files and case data — recoverable in minutes, not days", category: "IT" },
  { tool: "Analytics & Call Tracking", purpose: "See which pages, intake paths, and referral sources generate actual consultations", category: "Website" },
];

const securityStats = [
  { value: "60%", label: "of firms have formal cybersecurity policies" },
  { value: "#1", label: "target: phishing & ransomware remain top threats to law firms" },
  { value: "75%", label: "of attorneys use cloud computing — many without proper security" },
  { value: "24/7", label: "monitoring, patching, and threat response from SeedTech" },
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
  {
    q: "What practice areas do you work with?",
    a: "We work with firms across personal injury, family law, criminal defense, immigration, employment, estate planning, real estate, and business law. Any practice area where trust, intake, and responsiveness drive client acquisition is a fit.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. We offer managed IT support, content updates, security monitoring, and system maintenance as an ongoing partnership. Most firms stay with us long-term because we're always available when something needs attention.",
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

        {/* Image mosaic */}
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image src="/industries/law-firms-hero-1.jpg" alt="Professional law firm office environment" fill className="object-cover" priority />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">273×400px<br />Law office / conference room</p>
              </div>
            </div>
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image src="/industries/law-firms-hero-2.jpg" alt="Attorney at work in a law firm" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">273×400px<br />Attorney profile / headshot setting</p>
              </div>
            </div>
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image src="/industries/law-firms-hero-3.jpg" alt="Legal consultation in progress" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">273×400px<br />Consultation / legal research</p>
              </div>
            </div>
            <div className="relative aspect-[273/400] rounded-t-2xl overflow-hidden bg-white/[0.05]">
              <Image src="/industries/law-firms-hero-4.jpg" alt="Law firm website mockup on device" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
                <p className="text-white/20 text-xs text-center px-4 font-mono leading-relaxed">273×400px<br />Website / intake portal mockup</p>
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
              "Bar-Aligned Security Standards",
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
              <div key={s.label} className="rounded-2xl border border-black/[0.07] bg-white shadow-cardLight p-6 flex flex-col gap-2">
                <span className="font-display text-3xl font-bold text-seed-600">{s.value}</span>
                <span className="text-body-sm text-dark-base/55 leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Intake Impact Chart ── */}
      <Section>
        <SectionHeader
          eyebrow="The Data"
          title="How digital intake impacts"
          titleHighlight="law firm performance."
          description="Clio's 2025 data on solo and small firms shows that digital intake tools don't just improve UX — they directly impact revenue, lead volume, and conversion rates."
          align="center"
        />
        <div className="max-w-4xl mx-auto">
          {/* Chart visual placeholder */}
          <div className="relative rounded-3xl border border-white/[0.08] bg-dark-elevated overflow-hidden mb-8">
            {/*
              VISUAL PLACEHOLDER — Intake Impact Bar Chart
              Replace with: Horizontal or vertical bar chart graphic showing the 5 stats below
              Recommended: Clean bar chart on dark background, seed-green bars
              Size: Full-width, ~320px tall
              Message: Intake optimization is a revenue issue, not just a UX issue
            */}
            <div className="relative aspect-[16/7] flex items-center justify-center bg-white/[0.02]">
              <Image src="/industries/law-firms-intake-chart.jpg" alt="Bar chart showing digital intake impact on law firm performance" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/15 text-sm text-center px-8 font-mono leading-relaxed">
                  VISUAL: Bar chart — &quot;How Digital Intake Impacts Law Firm Performance&quot;<br />
                  Recommended: Horizontal bars, dark bg, seed-green accent<br />
                  ~1140×500px
                </p>
              </div>
            </div>
          </div>
          {/* Stat cards below chart */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {intakeStats.map((s) => (
              <LiquidGlassCard key={s.label} className="p-5 text-center">
                <p className="font-display text-2xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-body-sm font-medium text-seed-400 mb-1">{s.label}</p>
                <p className="text-[11px] text-light-base/35 leading-snug">{s.note}</p>
              </LiquidGlassCard>
            ))}
          </div>
          <p className="text-center text-[11px] text-light-base/25 mt-4">Source: Clio 2025 Solo & Small Firm Data</p>
        </div>
      </Section>

      {/* ── Three Functions ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What Your Website Should Actually Do"
          title="Trust. Intake."
          titleHighlight="Responsiveness."
          description="Your website needs to function as three systems at once. If any one of them fails, you're losing consultations to firms who got it right."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Trust System + visual placeholder */}
          <div className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight overflow-hidden flex flex-col">
            {/*
              VISUAL PLACEHOLDER — Trust System
              Replace with: Mockup of attorney profile page or firm homepage with trust signals
              Recommended: Desktop or mobile screenshot mockup
              Size: Card-width, ~200px tall
              Message: Your website builds trust before any conversation
            */}
            <div className="relative aspect-[4/3] bg-stone-50 flex items-center justify-center border-b border-black/[0.04]">
              <Image src="/industries/law-firms-trust-mockup.jpg" alt="Law firm website trust signals mockup" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-dark-base/15 text-[10px] text-center px-4 font-mono leading-relaxed">
                  VISUAL: Attorney profile page mockup<br />or homepage with trust signals<br />~400×300px
                </p>
              </div>
            </div>
            <div className="p-7 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">Trust System</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">
                Attorney profiles, credentials, practice-area clarity, client reviews, and case results. Prospective clients form a trust impression before the first call — your website is where it happens.
              </p>
            </div>
          </div>
          {/* Intake System + visual placeholder */}
          <div className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight overflow-hidden flex flex-col">
            {/*
              VISUAL PLACEHOLDER — Intake System
              Replace with: Mockup of consultation intake form or scheduling page
              Recommended: UI mockup showing form fields, case-type selector, submit CTA
              Size: Card-width, ~200px tall
              Message: Structured intake captures qualified leads
            */}
            <div className="relative aspect-[4/3] bg-stone-50 flex items-center justify-center border-b border-black/[0.04]">
              <Image src="/industries/law-firms-intake-mockup.jpg" alt="Law firm intake form mockup" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-dark-base/15 text-[10px] text-center px-4 font-mono leading-relaxed">
                  VISUAL: Intake form / consultation<br />request page mockup<br />~400×300px
                </p>
              </div>
            </div>
            <div className="p-7 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">Intake System</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">
                Structured consultation request forms, case type routing, and online scheduling. The right intake flow captures qualified leads and reduces the work required before the first meeting.
              </p>
            </div>
          </div>
          {/* Responsiveness System + visual placeholder */}
          <div className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight overflow-hidden flex flex-col">
            {/*
              VISUAL PLACEHOLDER — Responsiveness System
              Replace with: Mockup showing SMS confirmation, email notification, or scheduling confirmation
              Recommended: Mobile phone mockup with SMS/notification UI
              Size: Card-width, ~200px tall
              Message: No inquiry goes unanswered
            */}
            <div className="relative aspect-[4/3] bg-stone-50 flex items-center justify-center border-b border-black/[0.04]">
              <Image src="/industries/law-firms-response-mockup.jpg" alt="SMS and email follow-up system mockup" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-dark-base/15 text-[10px] text-center px-4 font-mono leading-relaxed">
                  VISUAL: SMS confirmation / email<br />notification / scheduling UI<br />~400×300px
                </p>
              </div>
            </div>
            <div className="p-7 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">Responsiveness System</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">
                Email routing, SMS follow-up, and appointment confirmations ensure no inquiry goes unanswered. Clio data shows a 10% conversion lift from e-signatures and 7% from text messaging.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Benefits Section ── */}
      <Section>
        <SectionHeader
          eyebrow="Why It Matters"
          title="What stronger digital infrastructure"
          titleHighlight="actually does for your firm."
          description="This isn't about having a prettier website. It's about building systems that directly impact how your firm acquires clients, operates daily, and grows."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <GlassCard key={b.title} className="flex flex-col gap-3 p-7">
              <IconBox icon={b.icon} variant="gradient" />
              <h3 className="font-display text-card-title text-white">{b.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{b.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ── Mid-Page CTA ── */}
      <div className="bg-gradient-to-r from-seed-600 to-seed-500 py-12">
        <div className="mx-auto max-w-4xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl md:text-2xl text-white font-bold mb-2">
              Ready to see what your firm&apos;s website is missing?
            </h3>
            <p className="text-sm text-white/70">Free audit — website, intake flow, IT, and security. No commitment.</p>
          </div>
          <Link
            href="/free-audit"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-seed-700 font-medium hover:bg-white/90 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            Get a Free Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

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
              <div key={f.title} className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-7 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl bg-seed-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-seed-600" />
                </div>
                <h3 className="font-display text-card-title text-dark-base">{f.title}</h3>
                <p className="text-body-sm text-dark-base/55 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>

        {/* Website mockup visual placeholder — full-width below feature cards */}
        <div className="mt-12 max-w-5xl mx-auto">
          {/*
            VISUAL PLACEHOLDER — Full Website Mockup
            Replace with: Desktop + mobile side-by-side mockup of a law firm website
            Showing: Homepage, practice-area page, or attorney profile page
            Recommended: Browser frame mockup on light background
            Size: Full-width, ~400px tall
            Message: SeedTech builds premium, modern, conversion-focused legal websites
          */}
          <div className="relative rounded-3xl border border-black/[0.06] bg-stone-50 shadow-cardLight overflow-hidden">
            <div className="relative aspect-[16/7] flex items-center justify-center">
              <Image src="/industries/law-firms-website-mockup.jpg" alt="Law firm website desktop and mobile mockup" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-dark-base/15 text-sm text-center px-8 font-mono leading-relaxed">
                  VISUAL: Desktop + mobile mockup of a law firm website<br />
                  Show: Homepage or practice-area page in browser frame<br />
                  ~1140×500px
                </p>
              </div>
            </div>
          </div>
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

      {/* ── Tools That Optimize Modern Law Firms ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="The Full Stack"
          title="Tools that optimize modern"
          titleHighlight="law firm operations."
          description="From the website layer to the IT layer — every tool below is designed to help your firm acquire clients more efficiently and operate more reliably."
          align="center"
          theme="light"
        />
        <div className="max-w-3xl mx-auto rounded-3xl border border-black/[0.07] bg-white shadow-cardLight overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-seed-50">
                <th className="px-6 py-4 text-body-sm font-semibold text-dark-base">Tool</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-dark-base">What It Does for Your Firm</th>
                <th className="px-6 py-4 text-body-sm font-semibold text-dark-base hidden md:table-cell">Layer</th>
              </tr>
            </thead>
            <tbody>
              {operationsTools.map((row, i) => (
                <tr key={row.tool} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  <td className="px-6 py-4 text-body-sm font-medium text-dark-base">{row.tool}</td>
                  <td className="px-6 py-4 text-body-sm text-dark-base/55">{row.purpose}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${row.category === "Website" ? "bg-seed-50 text-seed-600" : "bg-blue-50 text-blue-600"}`}>
                      {row.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Managed IT & Security ── */}
      <Section>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-body-sm font-medium text-seed-400 mb-3 uppercase tracking-widest">Managed IT & Security</p>
            <h2 className="font-display text-h2 text-white leading-tight mb-6">
              Law firms are prime targets. Your IT should reflect that.
            </h2>
            <p className="text-body text-light-base/55 leading-relaxed mb-6">
              You manage privileged communications, confidential case files, financial records, and strategic client data. A single breach can destroy client trust, trigger bar complaints, and cost your firm its reputation.
            </p>
            <p className="text-body text-light-base/55 leading-relaxed mb-8">
              SeedTech provides managed IT and cybersecurity infrastructure aligned with ABA guidance — including email encryption, MFA, endpoint protection, cloud backup, and 24/7 monitoring.
            </p>
            {/* IT Dashboard visual placeholder */}
            {/*
              VISUAL PLACEHOLDER — IT Dashboard
              Replace with: Screenshot of a managed IT dashboard showing device health, backup status, security alerts
              Recommended: Dark-themed dashboard screenshot in a browser/app frame
              Size: Full-width of left column, ~280px tall
              Message: SeedTech provides visibility into your firm's IT health
            */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
              <div className="relative aspect-[16/9] flex items-center justify-center">
                <Image src="/industries/law-firms-it-dashboard.jpg" alt="Managed IT security dashboard for law firms" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/15 text-[10px] text-center px-6 font-mono leading-relaxed">
                    VISUAL: IT dashboard screenshot<br />
                    Show: Device health, backup status, security alerts<br />
                    Dark-themed, ~560×315px
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {securityStats.map((s) => (
              <LiquidGlassCard key={s.label} className="p-6 flex flex-col gap-2">
                <span className="font-display text-2xl font-bold text-white">{s.value}</span>
                <span className="text-body-sm text-light-base/50 leading-snug">{s.label}</span>
              </LiquidGlassCard>
            ))}
          </div>
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
          <ProcessStep theme="light" step="01" title="Discovery & Strategy" description="We audit your current site, understand your practice areas, intake workflow, and competitive landscape, and map the page architecture that supports your firm's growth goals." />
          <ProcessStep theme="light" step="02" title="Build & Configure" description="We design and build your site with AI-assisted workflows — practice-area pages, attorney profiles, intake forms, scheduling, review integration, and security infrastructure built in." />
          <ProcessStep theme="light" step="03" title="Launch & Support" description="We launch, configure analytics and call tracking, and remain available for managed IT support, content updates, security monitoring, and system maintenance going forward." />
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <SectionHeader
          eyebrow="Common Questions"
          title="Questions we hear from law firms"
          align="center"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-white/[0.08] bg-dark-elevated overflow-hidden">
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
