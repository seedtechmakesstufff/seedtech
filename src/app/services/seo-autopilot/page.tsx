import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BarChart3,
  FileText,
  LayoutDashboard,
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

export const generateMetadata = buildMetadata("/services/seo-autopilot", {
  title: "SEO Autopilot — Launch Your Website with SEO Already Operational",
  description:
    "SeedTech websites launch with SEO Autopilot already configured — monitoring visibility, planning content, and improving search performance from day one.",
  canonical: "/services/seo-autopilot",
});

// ─── Data ──────────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "Your search data lives in Search Console",
    body: "Clicks, impressions, positions — it's all there. But it stays in Search Console and never connects to what you publish.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Your opportunities live in a spreadsheet",
    body: "Someone exports keywords into a doc. Priorities get discussed. A brief might get written. Maybe.",
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: "Your links get handled at the end",
    body: "Internal links — the thing Google says helps it find and rank new pages — gets skipped or forgotten entirely.",
  },
];

const pillars = [
  {
    id: "connect",
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Connect Your Site & Search Console",
    tagline: "Start with first-party data",
    description:
      "SEO Autopilot analyzes what your site is about, what Google already rewards, and where the gaps are — using real Search Console data, not generic keyword lists. Clicks, impressions, CTR, average position, pages, and queries: your first-party intelligence layer.",
    bullets: [
      "Live Search Console performance data",
      "Site context analysis — what you do, where, for whom",
      "Automatic gap detection between rankings and content",
      "AI-feature traffic included in Web report tracking",
    ],
    stat: "1st",
    statLabel: "party search data, not guesses",
    color: "from-seed-600/20 to-emerald-600/10",
  },
  {
    id: "backlog",
    icon: <Brain className="w-6 h-6" />,
    title: "Turn Signals Into a Ranked Backlog",
    tagline: "Prioritize what actually matters",
    description:
      "Instead of dumping keywords, SEO Autopilot combines your site context, Search Console signals, and competitor patterns into a prioritized queue of what to publish next — mapped to the words your customers actually search for.",
    bullets: [
      "Competitor content gap analysis",
      "Backlog ranked by search demand and site authority",
      "Focused on helpful, people-first topics — not volume",
      "Updated automatically as rankings shift",
    ],
    stat: "25+",
    statLabel: "automated checks per audit cycle",
    color: "from-brand-blue/15 to-brand-cyan/10",
  },
  {
    id: "content",
    icon: <FileText className="w-6 h-6" />,
    title: "Generate Structured, Reviewable Content",
    tagline: "Built to be cited, not just ranked",
    description:
      "Generate strategy-grade briefs, recommended angles, draft copy, CTAs, and supporting structure — all reflecting what your site does and what your audience actually searches for. Review before you publish. Keep control of the strategy.",
    bullets: [
      "On-brand drafts with your tone, services, and location",
      "Structured for E-E-A-T: expertise, authority, trust",
      "Internal link recommendations built into every draft",
      "AI process transparency — review when you want it",
    ],
    stat: "50%",
    statLabel: "of score weighted to content quality",
    color: "from-brand-cyan/15 to-emerald-600/10",
  },
  {
    id: "publish",
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Connect & Publish From One Dashboard",
    tagline: "Ship SEO without juggling five tools",
    description:
      "Internal links, crawlable site structure, and CMS publishing — all from one place. New content doesn't launch as an island. Every page connects to the rest of your site so Google can find it, understand it, and rank it.",
    bullets: [
      "Internal linking built in — not an afterthought",
      "CMS scheduling from your admin panel",
      "Weekly digest emailed every Monday",
      "No third-party logins, no agency retainer",
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
            Built into the SeedTech platform
          </p>
          <AnimatedH1
            highlightWords={["SEO", "operational."]}
            className="mb-8 text-center leading-[1.05]"
          >
            Launch your website with SEO already operational.
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-6 leading-relaxed">
            SeedTech websites are scaffolded from your business context and launched with SEO Autopilot already configured — so your site is not just live fast, it is ready to monitor visibility, plan content, and improve search performance from day one.
          </p>
          <p className="text-sm text-white/30 max-w-xl mx-auto mb-10 leading-relaxed">
            Best for service-business and lead-generation websites. Ecommerce is not currently supported.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-seed-500 to-emerald-500 text-white text-base font-semibold hover:shadow-glowSeed transition-all duration-300"
            >
              Start Your Website Build
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              See Platform Pricing
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
              highlightWords={["Fragmented."]}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            >
              SEO Isn&apos;t Hard. It&apos;s Fragmented.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Your search data, your opportunities, your briefs, your links, your publishing — they all live in different places. SEO Autopilot turns that into one system.
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
              How It Works
            </p>
            <AnimatedH2
              highlightWords={["Backlog", "Publish-Ready"]}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              From Backlog to Publish-Ready
            </AnimatedH2>
            <p className="mt-4 text-sm md:text-base text-white/45 max-w-xl mx-auto leading-relaxed">
              Discover what matters, prioritize it, generate it with context, connect it to the rest of your site, and ship it — all in one system.
            </p>
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
              highlightWords={["modern", "SEO"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              One platform for modern SEO execution.
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
              Setup
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
              description="We design and develop your site on our framework — a modern Next.js stack built to support SEO Autopilot's intelligence layer, Search Console integration, and weekly automation from launch day."
            />
            <ProcessStep
              step="02"
              title="We configure Autopilot for your business"
              description="We set up your business profile, tracked keywords, competitor list, and Search Console connection — customized for your vertical and location so the backlog reflects what your customers actually search for."
            />
            <ProcessStep
              step="03"
              title="Weekly intelligence, automatically"
              description="Every Monday, Autopilot crawls your site, tracks keyword positions, surfaces content opportunities, and emails you a plain-English digest of what changed and what to do next."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY NOW — Search changed, fundamentals didn't
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                Why Now
              </p>
              <AnimatedH2
                highlightWords={["Fundamentals", "Didn't."]}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight mb-6"
              >
                Search Changed. The Fundamentals Didn&apos;t.
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed mb-4">
                People are searching differently — longer questions, more complex queries, and more answer-led experiences. AI Overviews are used by more than a billion people. In Google&apos;s biggest markets, they&apos;ve driven over a 10% increase in Google usage for the queries where they appear.
              </p>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                That doesn&apos;t mean SEO is dead. It means visibility now depends even more on publishing pages that are useful, trustworthy, and easy for modern search systems to surface and cite. The fundamentals got more important — not less.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Google Search Essentials", note: "Helpful, people-first content. Descriptive titles and headings. Crawlable links. No special AI-only markup required." },
                { label: "AI Overviews & AI Mode", note: "Same foundational SEO practices apply. Internal links, page experience, and accurate structured data remain worthwhile." },
                { label: "ChatGPT & Copilot Search", note: "AI answer engines cite sources inline and in a Sources panel. Discoverable, credible, and easy to cite is the right target." },
              ].map((item) => (
                <div key={item.label} style={glassStyle} className="p-5 flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0" />
                    {item.label}
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed pl-6">{item.note}</p>
                </div>
              ))}
            </div>
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
          TRUST MODULE — people-first SEO, not scaled spam
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(74, 222, 128, 0.12)",
              background: "linear-gradient(135deg, rgba(64,166,96,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            className="p-10 md:p-14"
          >
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">Our Approach</p>
              <AnimatedH2
                highlightWords={["Spam"]}
                className="font-display text-2xl md:text-3xl font-bold text-white leading-tight"
              >
                Built for People-First SEO. Not Scaled Spam.
              </AnimatedH2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Uses first-party search data",
                  body: "Every recommendation starts with your actual Search Console data — not generic keyword prompts. Your real clicks, impressions, and rankings drive the backlog.",
                },
                {
                  title: "Pages connect. They don't launch as islands.",
                  body: "Internal linking is built into every publish workflow — not an afterthought. Google says links help it find and rank new pages. We take that seriously.",
                },
                {
                  title: "Review when you want it",
                  body: "Automate the busywork. Keep control of the strategy. Every draft is reviewable before it publishes. You stay in the loop on what goes live.",
                },
              ].map((item) => (
                <div key={item.title} style={glassStyle} className="p-6 flex flex-col gap-3">
                  <CheckCircle2 className="w-5 h-5 text-seed-400" />
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.body}</p>
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
            title="Automate the busywork. Keep control of the strategy."
            description="Let's talk about your site and get SEO Autopilot working for your business."
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
