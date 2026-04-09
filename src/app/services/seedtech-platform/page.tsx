import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShoppingCart,
  SquareTerminal,
} from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  AnimatedH2,
  ProcessStep,
  FAQAccordion,
  LiquidGlassPill,
} from "@/components/kit";
import type { FAQItem } from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { AutopilotCards } from "@/components/home/AutopilotCards";
import { WebBuildCards } from "@/components/services/WebBuildCards";
import Image from "next/image";

export const generateMetadata = buildMetadata("/services/seedtech-platform");

// ─── Data ──────────────────────────────────────────────────────────────────────

const faqs: FAQItem[] = [
  {
    question: "Are we locked into your systems?",
    answer:
      "No — all code, files, servers, and assets are owned by you. We don't believe in locking customers into a system or holding them hostage to a singular platform, even SeedTech. Once a project is finished, we send over the full details and transfer complete ownership to you.",
  },
  {
    question: "How long does a typical website build take?",
    answer:
      "Most SeedTech Platform builds are completed in 4–8 weeks from kickoff, depending on the number of pages, content readiness, and revision cycles. The Starter Build tends to move faster; the Robust Build includes more custom layout work, so we build in extra time for design refinement.\n\nThe biggest factor on our side is how quickly we receive content, brand assets, and feedback. We provide a clear onboarding checklist at the start so nothing stalls mid-build.",
  },
  {
    question: "What is SEO Autopilot and is it really included in every build?",
    answer:
      "Yes — SEO Autopilot is our in-house SEO intelligence platform, and it's configured for your site as part of every SeedTech Platform build. It covers keyword tracking, weekly site health audits, AI search visibility scoring across ChatGPT, Perplexity, Gemini, and Google, internal link recommendations, and a strategy dashboard.\n\nYou don't have to set it up or integrate anything — it's live from day one because the platform is built around it.",
  },
  {
    question: "Do I need to provide content before we start?",
    answer:
      "You don't need everything ready on day one, but having your core messaging, services list, and any existing brand assets prepared will speed things up significantly. We provide a content brief during onboarding that makes it straightforward to gather what we need.\n\nIf you need help with copy or content direction, we can fold that into the project scope — just let us know upfront.",
  },
  {
    question: "Can I update the site myself after launch?",
    answer:
      "Yes. Because the site is built on standard Next.js infrastructure (not a locked CMS), your team can make direct edits to the codebase with a developer, or we can configure a headless CMS like Contentful or Sanity for non-technical editing. We walk through the handoff in detail at launch so you know exactly how to manage the site going forward.",
  },
];

const bestFor = [
  "Service businesses",
  "Local and regional businesses",
  "Restaurants and hospitality brands",
  "Professional firms",
  "Lead-generation websites",
  "Businesses that need a modern launch path",
  "Teams that want SEO built in from day one",
];

const pricing = [
  {
    name: "Basic Build",
    starting: "$2,500",
    description:
      "A streamlined business website with essential pages, form handling, and a fast launch path on the SeedTech Platform.",
    includes: [
      "Up to 5 pages",
      "Mobile-responsive implementation",
      "Contact and lead-capture forms",
      "Performance-optimized build",
      "SEO Autopilot configuration",
      "Launch and deployment",
    ],
  },
  {
    name: "Robust Build",
    starting: "$7,800",
    highlighted: true,
    description:
      "A more tailored implementation for businesses that need expanded page structure, more customization, and a deeper rollout.",
    includes: [
      "8\u201315 pages",
      "Custom design and layout",
      "Advanced UI components",
      "Content strategy support",
      "SEO Autopilot configuration",
      "Scalable architecture",
    ],
  },
];


// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SeedTechPlatformPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="Business Website Design — SeedTech Platform"
        description="Professional business website design starting at $2,500. Fast-launch website infrastructure for service businesses and lead-generation brands with SEO Autopilot built in."
        url="https://seedtechllc.com/services/seedtech-platform"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "SeedTech Platform", url: "/services/seedtech-platform" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base pt-32 md:pt-44 pb-32 md:pb-48">
        <GradientOrb color="seed" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="blue" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <LiquidGlassPill variant="default" size="sm" dot>
              Web Development
            </LiquidGlassPill>
            <LiquidGlassPill variant="seed" size="sm" dot>
              SeedTech Platform
            </LiquidGlassPill>
          </div>

          <AnimatedH1
            highlightWords={["Faster", "SEO"]}
            className="mb-8 text-center leading-[1.05]"
          >
            Business Website Design — Launch a Custom Website Faster With SEO Already Built In
          </AnimatedH1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-seed-500 to-emerald-500 text-white text-base font-semibold hover:shadow-glowSeed transition-all duration-300"
            >
              Start Your Website Build
              <ArrowRight className="w-5 h-5" />
            </QuoteButton>
            <Link
              href="#the-platform"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/30 max-w-md mx-auto">
            Best for service-business and lead-generation websites. Not currently intended for ecommerce storefronts.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT IT IS + WEB BUILD FEATURE CARDS
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="the-platform" className="bg-dark-base -mt-20 md:-mt-28 pb-24 md:pb-32 relative z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background:
                "linear-gradient(95deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 70%), rgba(255,255,255,0.07)",
              boxShadow:
                "0 1.5px 0 1px rgba(255,255,255,0.14) inset, 0 -1px 0 1px rgba(0,0,0,0.10) inset, 0 8px 32px 0 rgba(0,0,0,0.18), 0 2px 8px 0 rgba(0,0,0,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            className="overflow-hidden"
          >
            {/* Text — centered, top */}
            <div className="px-8 pt-10 pb-8 md:px-14 md:pt-14 md:pb-10 text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                The Platform
              </p>
              <AnimatedH2
                highlightWords={["Website"]}
                className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
              >
                A Faster Path to Professional Website Design
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                The SeedTech Platform is our business website design infrastructure for service
                businesses, professional firms, and lead-generation brands. We use your business
                context to scaffold the site, shape the page structure, and configure SEO Autopilot
                from day one — so you launch faster with a site that is ready to work.
              </p>
            </div>

            {/* Image — padded, natural height */}
            <div className="px-6 pb-8 md:px-10 md:pb-10">
              <Image
                src="/img/seed graphics/seedtech_platform_website_build.webp"
                alt="SeedTech Platform website build preview"
                width={1600}
                height={900}
                className="w-full h-auto block rounded-xl"
                sizes="(max-width: 768px) calc(100vw - 3rem), calc(100vw - 5rem)"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* What's Included header — centered */}
            <div className="px-8 pt-10 pb-6 md:px-14 md:pt-12 md:pb-8 text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-3">
                What&apos;s Included
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                What Comes with the Platform
              </h2>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">
                Every SeedTech Platform build gives you the core website infrastructure you need
                to launch cleanly, operate confidently, and improve over time.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="px-6 pb-8 md:px-10 md:pb-10">
              <WebBuildCards />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 5 steps
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              How It Works
            </p>
            <AnimatedH2
              highlightWords={["Launch-Ready"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              From Business Context to Launch-Ready Website
            </AnimatedH2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Onboarding"
              description="You complete a guided questionnaire covering your business, services, goals, page needs, and content direction."
            />
            <ProcessStep
              step="02"
              title="Site Scaffold"
              description="We use that input to scaffold your website structure, core pages, and implementation on the SeedTech Platform."
            />
            <ProcessStep
              step="03"
              title="Tailored Buildout"
              description="We refine the content structure, page layout, forms, and visual direction so the site reflects your business — not a generic starting point."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-2xl mx-auto">
            <ProcessStep
              step="04"
              title="SEO Autopilot Setup"
              description="The same business context configures SEO Autopilot, so the website and SEO system launch in sync."
            />
            <ProcessStep
              step="05"
              title="Launch"
              description="You go live with a production-ready website and a built-in SEO operating layer already in place."
            />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          WHY IT'S DIFFERENT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
            Why It&apos;s Different
          </p>
          <AnimatedH2
            highlightWords={["Infrastructure,"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            Built on Better Infrastructure, Not Rebuilt from Scratch Every Time
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
            The advantage of the SeedTech Platform is not that it cuts corners. It removes
            unnecessary repetition. We have already built the infrastructure, workflows, and
            implementation patterns needed to launch modern business websites efficiently.
          </p>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
            That lets us spend less time rebuilding the same foundation and more time tailoring
            the site around your business, your services, and your growth goals. The result is a
            faster path to launch with a cleaner, more scalable website foundation underneath it.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEO AUTOPILOT BUILT IN
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 flex flex-col gap-10">
          {/* Centered text block */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              Built-In SEO
            </p>
            <AnimatedH2
              highlightWords={["Autopilot"]}
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
            >
              SEO Autopilot Comes Built In
            </AnimatedH2>
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
              Most businesses launch a website first and worry about SEO later. The SeedTech
              Platform works differently.
            </p>
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-6">
              Because your website is scaffolded from structured business context, we configure
              SEO Autopilot from the same inputs used to build the site itself. Your pages, content
              direction, and SEO workflows are aligned from the start — not added months later as
              an afterthought.
            </p>
            <Link
              href="/services/seo-autopilot"
              className="inline-flex items-center gap-2 text-sm font-semibold text-seed-400 hover:text-seed-300 transition-colors"
            >
              Explore SEO Autopilot
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive autopilot cards */}
          <AutopilotCards />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BEST FIT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                Best Fit
              </p>
              <AnimatedH2
                highlightWords={["Fast", "Well"]}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              >
                For Businesses That Need to Launch Fast and Launch Well
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                The SeedTech Platform is best for businesses that want a serious website without the
                long timeline and complexity of a fully bespoke build.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {bestFor.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-seed-400 shrink-0" />
                    <span className="text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                className="p-5"
              >
                <p className="text-sm text-white/50 leading-relaxed">
                  Looking for ecommerce?{" "}
                  <Link href="/services/ecommerce-development" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    See our ecommerce development offering
                    <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              Pricing
            </p>
            <AnimatedH2
              highlightWords={["$2,500"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              Business Website Design Starting at $2,500
            </AnimatedH2>
            <p className="text-sm text-white/40 max-w-lg mx-auto">
              Both options are built on the SeedTech Platform and include SEO Autopilot setup.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`liquid-glass rounded-2xl p-8 flex flex-col ${
                  tier.highlighted ? "liquid-glass-tinted-seed" : ""
                }`}
              >
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Starting at</p>
                <p className="font-display text-3xl md:text-4xl text-seed-400 mb-3">
                  {tier.starting}
                </p>
                <h3 className="font-display text-xl md:text-2xl text-white mb-3">
                  {tier.name}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-seed-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-white/60">{item}</span>
                    </li>
                  ))}
                </ul>

                <QuoteButton
                  service="web-development"
                  tier={tier.name}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-seed-500 to-emerald-500 text-white hover:shadow-glowSeed"
                      : "liquid-glass text-white"
                  }`}
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4" />
                </QuoteButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seed-400 mb-3">FAQ</p>
            <h2 className="font-display text-heading md:text-heading-lg text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EXPLORE OTHER PATHS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
            Explore other web development paths
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/services/ecommerce-development"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Ecommerce Development — Shopify, BigCommerce, and custom storefronts
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/services/custom-development"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <SquareTerminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Custom Development — SaaS, portals, internal tools, and web apps
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>
          </div>

          <p className="text-center text-sm text-white/25 mt-8">
            Not sure which fits your project?{" "}
            <Link href="/contact" className="text-seed-400/70 hover:text-seed-400 transition-colors">
              Contact us and we&apos;ll help you figure it out.
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
