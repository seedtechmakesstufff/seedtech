import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Search,
  Zap,
  CheckCircle2,
  Globe,
  Bot,
  TrendingUp,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Lightbulb,
  PhoneCall,
} from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  AnimatedH2,
  CTABanner,
  ProcessStep,
  LiquidGlassPill,
} from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { AutopilotCards } from "@/components/home/AutopilotCards";

export const generateMetadata = buildMetadata("/services/seo-autopilot");

// ─── Data ──────────────────────────────────────────────────────────────────────

const whySeoStats = [
  { stat: "68%",   label: "of all online experiences begin with a search engine" },
  { stat: "75%",   label: "of users never scroll past the first page of search results" },
  { stat: "14.6%", label: "average close rate for SEO leads vs. 1.7% for outbound" },
];

const seoServices = [
  {
    icon: MapPin,
    title: "Local SEO",
    body: "Rank in Google Maps and the Local Pack for the searches that drive foot traffic and phone calls. We optimize your Google Business Profile, build citations, and create location-specific content that puts you in front of buyers in your area.",
  },
  {
    icon: Bot,
    title: "AI Search Optimization",
    body: "ChatGPT, Google AI Overviews, Gemini, and Perplexity are answering buyer questions before they click a result. We structure your content to be cited by these systems — turning your pages into the authoritative answers AI recommends.",
  },
  {
    icon: FileText,
    title: "Content Strategy & Creation",
    body: "We build the content that earns rankings — blog posts, service pages, FAQ content, and landing pages mapped to your target keywords. Every piece is built for E-E-A-T: expertise, authority, trust, and direct relevance to what your customers search for.",
  },
  {
    icon: Search,
    title: "Technical SEO",
    body: "Fast load times, clean site structure, proper structured data, XML sitemaps, and canonical configuration. The technical foundation that lets Google find, crawl, and rank your pages without friction.",
  },
  {
    icon: TrendingUp,
    title: "Keyword Strategy",
    body: "A tiered keyword architecture built from your actual business — service terms, industry-specific queries, local modifiers, and question keywords. No generic lists. Every keyword maps to a specific page and a measurable business outcome.",
  },
  {
    icon: Users,
    title: "Link Authority Building",
    body: "Quality links from relevant, authoritative sources are still one of Google's top ranking signals. We build links through content, citations, and earned placements — not spam tactics that put your site at risk.",
  },
];

const whyNotAgency = [
  {
    icon: ShieldCheck,
    title: "You see everything",
    body: "Live Search Console data, keyword positions, AI visibility scores, competitor benchmarks — all in your dashboard. Not a monthly PDF you can't interrogate.",
  },
  {
    icon: Lightbulb,
    title: "Strategy that connects to execution",
    body: "We don't just make recommendations. We implement them — content gets written, published, and internally linked. The work happens.",
  },
  {
    icon: Star,
    title: "Built for AI search, not just Google",
    body: "Most agencies are still optimizing for blue links. We build for where search is going — AI citations, structured answers, and entity authority across every major AI platform.",
  },
  {
    icon: Globe,
    title: "No platform lock-in",
    body: "All content, code, and data is yours. No retainer traps, no access revoked when you cancel. The rankings and content we build stay with you.",
  },
];

const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const dashboardTabs = [
  { name: "Overview",        description: "Weekly health score, snapshots, key metrics" },
  { name: "AI Visibility",   description: "Per-page citation readiness scores (0–100)" },
  { name: "Keywords",        description: "Tracked keywords with GSC position data" },
  { name: "Site Audit",      description: "25+ automated on-page SEO checks" },
  { name: "Insights",        description: "AI-generated opportunities and fixes" },
  { name: "Topic Clusters",  description: "Pillar/spoke authority maps and gap analysis" },
  { name: "Citations",       description: "Brand mentions across 5 AI platforms" },
  { name: "Competitors",     description: "Content gaps and SERP benchmarking" },
  { name: "Strategy",        description: "AI advisor with tasks and content calendar" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SeoAutopilotPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="SEO Services"
        description="Search engine optimization for businesses that want to rank in Google, Google Maps, and AI search platforms like ChatGPT and Google AI Overviews. Local SEO, content strategy, technical SEO, and AI citation optimization."
        url="https://seedtechllc.com/services/seo-autopilot"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "SEO", url: "/services/seo-autopilot" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="seed" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="blue" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Search className="w-3.5 h-3.5 mr-1.5" /> SEO Services
          </LiquidGlassPill>
          <AnimatedH1
            highlightWords={["found.", "leads."]}
            className="mb-8 max-w-4xl leading-[1.05]"
          >
            Get found. Get leads. Rank where your customers are searching.
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mb-10 leading-relaxed">
            SEO is the highest-ROI lead channel for most businesses — and most businesses are
            completely invisible in it. We build the rankings, content, and AI citations that
            turn search traffic into customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact?service=seo"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-seed-500 to-emerald-500 text-white text-base font-semibold hover:shadow-glowSeed transition-all duration-300"
            >
              Start the Conversation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <PhoneCall className="w-5 h-5" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY SEO — stat-driven value
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              Why SEO
            </p>
            <AnimatedH2
              highlightWords={["lowest-cost"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              The lowest-cost lead channel most businesses completely ignore.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Paid ads stop the moment you stop paying. SEO compounds — rankings you earn today
              keep generating leads months and years from now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {whySeoStats.map((s) => (
              <div key={s.label} style={glassStyle} className="p-8 flex flex-col gap-3 text-center">
                <span className="font-display text-5xl font-bold text-seed-400">{s.stat}</span>
                <span className="text-sm text-white/45 leading-relaxed">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Why now — AI search */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                Why Now
              </p>
              <AnimatedH2
                highlightWords={["changed."]}
                className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-6"
              >
                Search has fundamentally changed.
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed mb-4">
                AI Overviews, ChatGPT, Gemini, and Perplexity are now answering buyer questions
                directly — before users ever click a result. The businesses being cited in those
                answers are capturing demand that used to require paid ads.
              </p>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                Traditional SEO still matters. But winning in 2026 means being findable in both
                Google blue links and AI-generated answers. We build for both.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Google Search & Maps",     note: "Traditional rankings and Local Pack — still the highest-volume channel." },
                { label: "Google AI Overviews",      note: "Answer-led results appearing for over a billion users. Cited sources get branded visibility without a click." },
                { label: "ChatGPT & Copilot Search", note: "Inline citations in conversational answers. Cited businesses win trust before the user visits any site." },
                { label: "Gemini & Perplexity",      note: "Research-mode queries with structured citations — increasingly used for B2B and high-consideration purchases." },
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
          WHAT WE DO — SEO services
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              What We Do
            </p>
            <AnimatedH2
              highlightWords={["complete"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              A complete SEO strategy — not just one piece of it.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Rankings come from doing several things right simultaneously. We cover every layer —
              from technical foundation to content to AI citations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoServices.map((s) => (
              <div key={s.title} style={glassStyle} className="p-7 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              How It Works
            </p>
            <AnimatedH2
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              From zero visibility to compounding traffic.
            </AnimatedH2>
            <p className="mt-4 text-sm md:text-base text-white/45 max-w-xl mx-auto leading-relaxed">
              Every engagement starts with understanding your business and ends with rankings that
              generate leads while you sleep.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Audit & strategy"
              description="We audit your current rankings, site health, AI visibility, and competitor positioning — then build a keyword strategy and content roadmap specific to your business and market."
            />
            <ProcessStep
              step="02"
              title="Build & optimize"
              description="Technical fixes, content creation, Google Business Profile optimization, and local citations go live. SEO Autopilot gets configured with your keyword targets, competitors, and business context."
            />
            <ProcessStep
              step="03"
              title="Monitor & compound"
              description="Every week, SEO Autopilot tracks positions, surfaces new opportunities, and emails you what moved. Rankings compound over time — the work we do in month 3 still pays off in month 18."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY NOT JUST AN AGENCY — differentiators
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              Why SeedTech
            </p>
            <AnimatedH2
              highlightWords={["transparency"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              SEO with transparency built in.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Most agencies deliver a monthly report and call it done. We give you the tool, the
              data, and the execution — so you always know exactly what is happening and why.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whyNotAgency.map((item) => (
              <div key={item.title} style={glassStyle} className="p-7 flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEO AUTOPILOT — THE TOOL
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              Powered By
            </p>
            <AnimatedH2
              highlightWords={["Autopilot"]}
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
            >
              SEO Autopilot Comes Built In
            </AnimatedH2>
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
              Every SEO engagement is powered by SEO Autopilot — our proprietary platform that
              lives inside your website&apos;s admin panel. It&apos;s not a third-party tool you
              pay for separately. It&apos;s built into the infrastructure of every SeedTech site
              and configured for your business from day one.
            </p>
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
              You get a real-time view of your rankings, AI visibility scores, competitor positions,
              and content opportunities — not a monthly PDF from an agency black box.
            </p>
          </div>

          <AutopilotCards />

          <div>
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
            <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-sm">
              <Globe className="w-4 h-4" />
              <span>Built into your SeedTech website. No separate login, no third-party subscription.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHO IT IS FOR
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                Built For
              </p>
              <AnimatedH2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight mb-5">
                BUSINESSES SERIOUS ABOUT GROWTH
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                Whether you&apos;re a law firm trying to rank above national directories,
                a contractor wanting to dominate local search, a restaurant filling tables, or a
                SaaS company competing for AI citations — we build the SEO infrastructure your
                business needs to win.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Law Firms & Professional Services", note: "Outrank directories. Become the firm AI cites.",              href: null },
                { label: "Contractors & Trade Businesses",    note: "Dominate local search and Google Maps.",                       href: null },
                { label: "Restaurants & Hospitality",         note: "Fill tables from \"near me\" and AI recommendation searches.",                href: "/seo-for-restaurants" },
                { label: "Healthcare & Dental Practices",     note: "Build E-E-A-T authority and rank for patient searches.",                      href: null },
                { label: "SaaS & Technology Companies",       note: "Get cited by AI when buyers compare options.",              href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-seed-400 shrink-0 mt-1" />
                  <div>
                    {item.href ? (
                      <Link href={item.href} className="text-sm font-semibold text-white hover:text-seed-400 transition-colors inline-flex items-center gap-1">
                        {item.label} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                    )}
                    <p className="text-xs text-white/40">{item.note}</p>
                  </div>
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
            title="Ready to start ranking?"
            description="Let's talk about where your business stands today and build the SEO strategy that gets you to the top."
            primaryLabel="Start the Conversation"
            primaryHref="/contact?service=seo"
            secondaryLabel="See Web Development"
            secondaryHref="/services/web-development"
          />
        </div>
      </section>
    </div>
  );
}
