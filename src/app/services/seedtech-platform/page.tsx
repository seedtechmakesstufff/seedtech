import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Zap,
  Shield,
} from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  AnimatedH2,
  CTABanner,
  ProcessStep,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { AutopilotCards } from "@/components/home/AutopilotCards";

export const metadata = {
  title: "SeedTech Platform — Launch a Custom Website Faster With SEO Built In | SeedTech",
  description:
    "The SeedTech Platform is our fast-launch website infrastructure for service businesses and lead-generation brands. Built on Next.js, you own your code, and SEO Autopilot is configured from day one.",
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const included = [
  "Custom website implementation on the SeedTech Platform",
  "Core page architecture based on your business and services",
  "Mobile-responsive frontend implementation",
  "Contact and lead-capture forms",
  "Performance-focused website setup",
  "Modern deployment workflow",
  "Business-context-driven content structure",
  "SEO Autopilot configuration",
  "Launch support",
];

const bestFor = [
  "Service businesses",
  "Local and regional businesses",
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

const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SeedTechPlatformPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="SeedTech Platform"
        description="Fast-launch website infrastructure for service businesses and lead-generation brands. Built on Next.js, you own your code, and SEO Autopilot is configured from day one."
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
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="seed" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="blue" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seed-400 mb-6">
            SeedTech Platform
          </p>
          <AnimatedH1
            highlightWords={["Faster", "SEO"]}
            className="mb-8 text-center leading-[1.05]"
          >
            Launch a Custom Website Faster — With SEO Already Built In
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The SeedTech Platform is our fast-launch website infrastructure for service businesses,
            professional firms, and lead-generation brands. We use your business context to scaffold
            the site, shape the page structure, and configure SEO Autopilot from day one — so you
            launch faster with a site that is ready to work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-seed-500 to-emerald-500 text-white text-base font-semibold hover:shadow-glowSeed transition-all duration-300"
            >
              Start Your Website Build
              <ArrowRight className="w-5 h-5" />
            </QuoteButton>
            <Link
              href="#how-it-works"
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
          WHAT IT IS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
                The Platform
              </p>
              <AnimatedH2
                highlightWords={["Serious"]}
                className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
              >
                A Faster Path to a Serious Website
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
                The SeedTech Platform gives you the speed of a proven system without forcing your
                business into a generic template. We use structured onboarding, modern infrastructure,
                and a repeatable build process to launch websites faster — then tailor the
                implementation around your business, services, and goals.
              </p>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                This is the middle ground between cheap templates and slow, expensive custom builds:
                a better foundation, a faster launch, and a more strategic result.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: "Built on open infrastructure",
                  note: "Powered by Next.js and modern open-source technology. No proprietary lock-in.",
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: "You own your code",
                  note: "Every line of code and every asset belongs to you. We build it, you keep it.",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: "SEO from day one",
                  note: "SEO Autopilot is configured during the build, not bolted on later.",
                },
              ].map((item) => (
                <div key={item.title} style={glassStyle} className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-seed-500/10 border border-seed-500/20 flex items-center justify-center text-seed-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed mt-1">{item.note}</p>
                  </div>
                </div>
              ))}
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
          WHAT'S INCLUDED
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              What&apos;s Included
            </p>
            <AnimatedH2
              highlightWords={["Platform"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              What Comes with the Platform
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Every SeedTech Platform build gives you the core website infrastructure you need
              to launch cleanly, operate confidently, and improve over time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {included.map((item) => (
              <div key={item} style={glassStyle} className="p-5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
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
              Website Builds Starting at $2,500
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
                <p className="font-display text-3xl md:text-4xl text-seed-400 mb-1">
                  {tier.starting}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Starting at</p>
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
          CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <CTABanner
            theme="light"
            title="Start with the Platform Built to Launch Better"
            description="Tell us about your business, your services, and what the website needs to do — and we'll turn that into a launch-ready site with SEO already operational."
            primaryLabel="Start Your Website Build"
            primaryHref="/contact"
            secondaryLabel="See All Web Development"
            secondaryHref="/services/web-development"
          />
        </div>
      </section>
    </div>
  );
}
