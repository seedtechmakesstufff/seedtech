import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BarChart3,
  FileText,
  LayoutDashboard,
  TrendingUp,
  Search,
  Zap,
  CheckCircle2,
  Globe,
  Bot,
} from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  AnimatedH2,
  CTABanner,
  ProcessStep,
} from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "SEO Autopilot — AI-Powered SEO for Modern Businesses | SeedTech",
  description:
    "65% of searches now end without a click. SEO Autopilot tracks your brand across ChatGPT, Perplexity, Google AIO, and Gemini — so you become the source AI recommends.",
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "AI is eating your traffic",
    body: "65% of searches now end with an AI-generated answer — no click required. If AI doesn't cite you, you're invisible.",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Old SEO tactics no longer work",
    body: "Keyword stuffing, generic blog posts, and link farms don't get you cited by ChatGPT or Perplexity. The rules have changed.",
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: "You can't see where you stand",
    body: "Traditional tools track Google rankings. None of them show you how often AI systems mention your brand — or why they don't.",
  },
];

const pillars = [
  {
    id: "citations",
    icon: <Brain className="w-6 h-6" />,
    title: "AI Citation Engine",
    tagline: "Be the source AI recommends",
    description:
      "SEO Autopilot monitors your brand across ChatGPT, Perplexity, Google AI Overviews, Gemini, and Copilot in real time. You'll know exactly when AI mentions you, what it says, whether it links to you, and what you need to change to become the go-to source it cites.",
    bullets: [
      "Live citation monitoring across 5 AI engines",
      "AI Visibility score (0–100) for every page",
      "Content recommendations to increase citation rate",
      "Brand sentiment and mention tracking",
    ],
    stat: "5",
    statLabel: "AI platforms monitored",
    color: "from-seed-600/20 to-emerald-600/10",
  },
  {
    id: "audits",
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Automated Weekly Audits",
    tagline: "Real data, every Monday",
    description:
      "Ranking on Google is harder than ever. You need consistent data to know where you stand. SEO Autopilot crawls your entire site weekly, tracks every keyword position, and delivers a health score — so you're always making decisions based on real numbers, not guesses.",
    bullets: [
      "25+ on-page SEO checks every week",
      "Keyword position tracking with trend history",
      "Site health score with delta from prior week",
      "Competitor benchmarking and gap analysis",
    ],
    stat: "25+",
    statLabel: "automated checks weekly",
    color: "from-brand-blue/15 to-brand-cyan/10",
  },
  {
    id: "content",
    icon: <FileText className="w-6 h-6" />,
    title: "AI-First Content",
    tagline: "Built to be cited, not just ranked",
    description:
      "AI systems cite content that is structured, authoritative, and answers questions directly. SEO Autopilot scores your existing content and generates new blog posts engineered for the exact format AI platforms pull from — E-E-A-T scoring, topic cluster maps, and citation-optimized structure built in.",
    bullets: [
      "E-E-A-T scoring (Experience, Expertise, Authority, Trust)",
      "Topic cluster maps with content gap analysis",
      "AI-first blog generation with citation structure",
      "Internal linking recommendations",
    ],
    stat: "50%",
    statLabel: "of score weighted to AI visibility",
    color: "from-brand-cyan/15 to-emerald-600/10",
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Your SEO Command Center",
    tagline: "Manage SEO without an agency",
    description:
      "Most businesses pay agencies thousands per month for reports they can't act on. SEO Autopilot gives you a 9-tab command center built directly into your website — keywords, audits, insights, citations, competitors, and strategy — all in one place, explained in plain English.",
    bullets: [
      "9-tab dashboard: keywords, audits, insights, citations",
      "Weekly digest emailed to your inbox automatically",
      "AI Strategy Advisor with real-time recommendations",
      "Competitor content analysis and opportunity alerts",
    ],
    stat: "9",
    statLabel: "dashboard tabs in one platform",
    color: "from-seed-600/15 to-brand-blue/10",
  },
];

const dashboardTabs = [
  { name: "Overview", description: "Weekly health score, snapshots, key metrics" },
  { name: "AI Visibility", description: "Per-page citation readiness scores (0–100)" },
  { name: "Keywords", description: "Tracked keywords with GSC position data" },
  { name: "Site Audit", description: "25+ automated on-page SEO checks" },
  { name: "Insights", description: "AI-generated opportunities and fixes" },
  { name: "Topic Clusters", description: "Pillar/spoke authority maps and gap analysis" },
  { name: "Citations", description: "Brand mentions across 5 AI platforms" },
  { name: "Competitors", description: "Content gaps and SERP benchmarking" },
  { name: "Strategy", description: "AI advisor with tasks and content calendar" },
];

const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SeoAutopilotPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="SEO Autopilot"
        description="AI-powered SEO platform that tracks your brand across ChatGPT, Perplexity, Google AI Overviews, Gemini, and Copilot — and helps you become the source AI recommends."
        url="https://seedtechllc.com/services/seo-autopilot"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "SEO Autopilot", url: "/services/seo-autopilot" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="seed" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="blue" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seed-400 mb-6">
            SEO Autopilot
          </p>
          <AnimatedH1
            highlightWords={["AI", "Recommends"]}
            className="mb-8 text-center leading-[1.05]"
          >
            Become the Source AI Recommends
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
            65% of searches now end with an AI-generated answer — no click required.
            Your competitors are losing visibility and don&apos;t even know it.
          </p>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-8 leading-relaxed">
            SEO Autopilot is built into every website we build — giving you a best-in-class
            website and a full AI-search intelligence layer, all in one.
          </p>
          {/* Requirement callout */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-seed-500/30 bg-seed-500/5 text-seed-400 text-sm mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-seed-400 shrink-0" />
            Requires a SeedTech-built website — included in every web development engagement
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-seed-500 to-emerald-500 text-white text-base font-semibold hover:shadow-glowSeed transition-all duration-300"
            >
              Start with a New Website
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          THE PROBLEM — why old SEO is broken
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              The Problem
            </p>
            <AnimatedH2
              highlightWords={["Changed"]}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            >
              SEO Has Changed. Most Businesses Haven&apos;t.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              AI-generated answers now dominate the top of search results.
              If AI doesn&apos;t cite you, millions of potential customers will never see your name.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} style={glassStyle} className="p-7 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400">
                  {p.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                  {p.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4 VALUE PILLARS — expanded detail cards
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              What It Does
            </p>
            <AnimatedH2
              highlightWords={["Autopilot"]}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              Everything Your SEO Needs on Autopilot
            </AnimatedH2>
          </div>

          <div className="flex flex-col gap-10">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.id}
                className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
              >
                {/* Text side */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400 shrink-0">
                      {pillar.icon}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-seed-400">
                      {pillar.tagline}
                    </p>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wide leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                    {pillar.description}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {pillar.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stat card side */}
                <div className="w-full lg:w-72 shrink-0">
                  <div
                    style={{
                      ...glassStyle,
                      background: `linear-gradient(135deg, ${pillar.color.includes("seed") ? "rgba(64,166,96,0.08)" : "rgba(59,130,246,0.08)"} 0%, rgba(255,255,255,0.03) 100%)`,
                    }}
                    className="p-8 flex flex-col items-center text-center gap-3"
                  >
                    <span className="font-display text-6xl font-bold text-seed-400">
                      {pillar.stat}
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-wider max-w-[160px]">
                      {pillar.statLabel}
                    </span>
                    <div className="mt-4 w-10 h-10 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400">
                      {pillar.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9-TAB DASHBOARD SHOWCASE
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              The Dashboard
            </p>
            <AnimatedH2
              highlightWords={["Nine", "Tabs"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              Nine Tabs. Zero Agency Fees.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-xl mx-auto leading-relaxed">
              Every piece of intelligence your SEO strategy needs — built directly into your website.
              No third-party logins, no monthly reports you can&apos;t act on.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardTabs.map((tab, i) => (
              <div key={tab.name} style={glassStyle} className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[11px] font-bold text-seed-400 uppercase tracking-widest opacity-60">
                    0{i + 1}
                  </span>
                  <h4 className="font-display text-[15px] font-bold text-white uppercase tracking-wide">
                    {tab.name}
                  </h4>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{tab.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-white/30 text-sm">
            <Globe className="w-4 h-4" />
            <span>Built into your SeedTech website. No third-party platform, no separate login.</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              How It Works
            </p>
            <AnimatedH2
              highlightWords={["Built", "In"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              Your Website Gets Built In
            </AnimatedH2>
            <p className="mt-4 text-sm md:text-base text-white/45 max-w-xl mx-auto leading-relaxed">
              SEO Autopilot isn&apos;t a plugin you bolt onto an old site. It&apos;s woven into the
              architecture of every website we build — so the intelligence layer is live from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="We build your website"
              description="We design and develop your site on our framework — a modern Next.js stack built specifically to support SEO Autopilot's intelligence layer, AI citation scoring, and weekly automation."
            />
            <ProcessStep
              step="02"
              title="We configure Autopilot for your business"
              description="We set up your business profile, tracked keywords, industry scoring config, competitors, and author credentials — customized for your vertical and location."
            />
            <ProcessStep
              step="03"
              title="Weekly intelligence, automatically"
              description="Every Monday, Autopilot crawls your site, tracks keyword positions, checks brand mentions across 5 AI engines, and emails you a plain-English digest of what changed and what to do next."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHO IT'S FOR — quick callout
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                Built For
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight mb-5">
                BUSINESSES SERIOUS ABOUT GROWTH
              </h2>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                Whether you&apos;re a law firm trying to rank above national directories,
                a contractor wanting to dominate local search, or a SaaS company competing
                for AI citations against larger brands — when we build your website,
                SEO Autopilot comes with it. Your intelligence layer is live from launch day.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Law Firms & Professional Services", note: "Outrank directories. Become the firm AI cites." },
                { label: "Contractors & Trade Businesses", note: "Dominate local search and AI answers." },
                { label: "Healthcare & Dental Practices", note: "Build E-E-A-T authority and trust signals." },
                { label: "SaaS & Technology Companies", note: "Get cited by AI when buyers compare options." },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-seed-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/40">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          REQUIREMENT CALLOUT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(74, 222, 128, 0.15)",
              background: "linear-gradient(135deg, rgba(64,166,96,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            className="p-10 md:p-14 flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                One Requirement
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight mb-5">
                YOUR WEBSITE NEEDS TO BE BUILT BY US
              </h2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed max-w-lg">
                SEO Autopilot is deeply integrated into the website architecture we build — it&apos;s
                not a plugin, bolt-on, or third-party integration. The scoring engine, AI monitoring,
                and weekly automation are woven into the codebase itself.
              </p>
              <p className="mt-4 text-sm md:text-[15px] text-white/50 leading-relaxed max-w-lg">
                That means to use SEO Autopilot, your website needs to be built on our framework.
                If you&apos;re already a SeedTech web client — you&apos;re ready to activate it.
                If you&apos;re on an older site or a different platform, we&apos;ll rebuild it as part
                of your engagement.
              </p>
            </div>
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-64">
              {[
                { label: "Already a SeedTech client", note: "Activate SEO Autopilot on your existing site." },
                { label: "On a different platform", note: "We rebuild your site and include Autopilot at launch." },
                { label: "Starting fresh", note: "Your new site ships with Autopilot built in from day one." },
              ].map((item) => (
                <div key={item.label} style={glassStyle} className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <CTABanner
            theme="light"
            title="Ready to get cited by AI?"
            description="Let's talk about your website and get SEO Autopilot working for your business."
            primaryLabel="Start the Conversation"
            primaryHref="/contact"
            secondaryLabel="See Web Development"
            secondaryHref="/services/web-development"
          />
        </div>
      </section>
    </div>
  );
}
