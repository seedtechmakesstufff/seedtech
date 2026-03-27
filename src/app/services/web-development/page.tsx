import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { GradientOrb, GridPattern, LiquidGlassPill, AnimatedH1, AnimatedH2 } from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Web Development — SeedTech",
  description:
    "Custom websites, ecommerce platforms, and web applications. Let the work speak for itself.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const _clients = [
  "StarCom Fiber",
  "Drew & Rogers",
  "BioOx",
  "PaddlersCove",
  "Megasafe",
  "Mesa",
  "Vick Tipnes Enterprises",
  "Blackstone Medical Services",
  "Ron White",
  "Trevor Noah",
  "Kevin James",
  "Hiler Trucking",
  "Eastside Bulk",
  "Carla Marie & Anthony Show",
  "Fine Indian Dining Group",
];

// Two rows for the animated marquee — duplicate for seamless loop
const logoRowTop = [
  "StarCom Fiber",
  "Drew & Rogers",
  "BioOx",
  "PaddlersCove",
  "Megasafe",
  "Mesa",
  "Vick Tipnes Enterprises",
  "Blackstone Medical Services",
  "StarCom Fiber",
  "Drew & Rogers",
  "BioOx",
  "PaddlersCove",
  "Megasafe",
  "Mesa",
  "Vick Tipnes Enterprises",
  "Blackstone Medical Services",
];

const logoRowBottom = [
  "Ron White",
  "Trevor Noah",
  "Kevin James",
  "Hiler Trucking",
  "Eastside Bulk",
  "Carla Marie & Anthony Show",
  "Fine Indian Dining Group",
  "Ron White",
  "Trevor Noah",
  "Kevin James",
  "Hiler Trucking",
  "Eastside Bulk",
  "Carla Marie & Anthony Show",
  "Fine Indian Dining Group",
];

const featuredWork = projects
  .filter((p) => p.department === "web-development")
  .slice(0, 8);

const pricing = [
  {
    name: "Starter Website",
    starting: "$2,500",
    description:
      "Perfect for small businesses that need a clean, professional online presence.",
    includes: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Fast, modern website build",
      "Basic SEO setup",
      "Contact form",
      "Launch and deployment",
    ],
  },
  {
    name: "Growth Website",
    starting: "$7,800",
    description:
      "For businesses that need a more robust website with custom layouts and deeper content.",
    highlighted: true,
    includes: [
      "8–15 pages",
      "Custom design and layout",
      "Advanced UI components",
      "SEO-friendly structure",
      "Content strategy support",
      "Scalable architecture",
    ],
  },
  {
    name: "Ecommerce Website",
    starting: "$15,000",
    description:
      "Full-featured ecommerce platforms designed to convert visitors into customers.",
    includes: [
      "Custom storefront design",
      "Product catalog setup",
      "Secure checkout integration",
      "Payment gateway configuration",
      "Inventory management",
      "Scalable ecommerce architecture",
    ],
  },
  {
    name: "Custom Web Application",
    starting: "$10,000+",
    description:
      "Custom platforms, portals, or specialized functionality for your business.",
    includes: [
      "Dashboards & internal tools",
      "Booking systems",
      "Membership platforms",
      "Custom SaaS products",
      "API integrations",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WebDevelopmentPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="Web Development"
        description="Custom websites, ecommerce platforms, and web applications built with modern frameworks. From branding to full-stack development."
        url="https://seedtechllc.com/services/web-development"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Web Development", url: "/services/web-development" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="blue" size="xl" className="-top-52 left-1/2 -translate-x-1/2 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="text-eyebrow uppercase tracking-[0.2em] text-seed-400 mb-6">
            Web Development
          </p>
          <AnimatedH1 highlightWords={["Actually", "Work"]} className="mb-8 text-center">
            We Build Websites That Actually Work
          </AnimatedH1>
          <p className="text-body-lg text-light-base/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Custom websites, ecommerce platforms, and web applications —
            designed and built from scratch for businesses that take their
            online presence seriously.
          </p>
          <QuoteButton
            service="web-development"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-brand text-white text-base font-medium hover:shadow-glowSeed transition-all duration-300"
          >
            Start a Project
            <ArrowRight className="w-5 h-5" />
          </QuoteButton>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUSTED BY — bold statement + animated logo marquee
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center mb-14">
          {/* Validated pill */}
          <LiquidGlassPill variant="default" className="mb-6">Validated</LiquidGlassPill>
          <AnimatedH2 className="font-display text-heading md:text-title text-white leading-[1.1] mb-6">
            Infrastructure Trusted by Brands
          </AnimatedH2>
          <p className="text-body-lg text-light-base/40 max-w-2xl mx-auto leading-relaxed">
            SeedTech has powered IT &amp; Website infrastructures for numerous businesses — small to large.
          </p>
        </div>

        {/* Animated logo marquee with edge blur — contained */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden">
            {/* Left blur */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-dark-base to-transparent pointer-events-none" />
            {/* Right blur */}
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-dark-base to-transparent pointer-events-none" />

            {/* Row 1 — left to right */}
            <div className="flex animate-marquee-reverse whitespace-nowrap mb-4">
              {logoRowTop.map((name, i) => (
                <div
                  key={`top-${i}`}
                  className="mx-2 shrink-0 flex items-center justify-center px-8 py-4 rounded-xl border border-white/[0.06] bg-dark-elevated/50"
                >
                  <span className="text-sm font-semibold text-white/25 tracking-wide">
                    {name}
                  </span>
                </div>
              ))}
            </div>

            {/* Row 2 — right to left */}
            <div className="flex animate-marquee whitespace-nowrap">
              {logoRowBottom.map((name, i) => (
                <div
                  key={`bottom-${i}`}
                  className="mx-2 shrink-0 flex items-center justify-center px-8 py-4 rounded-xl border border-white/[0.06] bg-dark-elevated/50"
                >
                  <span className="text-sm font-semibold text-white/25 tracking-wide">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURED WORK
          ══════════════════════════════════════════════════════════════════════ */}
      <Section className="!pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">
                Featured Work
              </p>
              <AnimatedH2 className="font-display text-heading md:text-title text-white">
                Recent Projects
              </AnimatedH2>
            </div>
            <Link
              href="/our-work"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-20">
            {featuredWork.map((project) => (
              <Link
                key={project.slug}
                href={`/our-work/${project.slug}`}
                className="group block"
              >
                {/* Image area */}
                <div className="liquid-glass rounded-2xl overflow-hidden mb-6">
                  <div className="aspect-[16/9] relative">
                    {project.image ? (
                      <>
                        <Image
                          src={project.image}
                          alt={project.client}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 960px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-elevated/60 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="text-center space-y-1">
                          <p className="text-white/30 text-sm font-medium">
                            {project.client}
                          </p>
                          <p className="text-white/15 text-xs">Screenshot coming soon</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-subheading text-white group-hover:text-seed-400 transition-colors mb-2">
                      {project.client}
                    </h3>
                    <p className="text-body-sm text-light-base/40 max-w-lg leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <LiquidGlassPill key={tech} size="sm" variant="default">{tech}</LiquidGlassPill>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="sm:hidden text-center mt-12">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 text-sm font-medium text-seed-400 hover:text-seed-300 transition-colors"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING
          ══════════════════════════════════════════════════════════════════════ */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-3">
              Pricing
            </p>
            <AnimatedH2 className="font-display text-heading md:text-title text-white">
              Simple, Transparent Pricing
            </AnimatedH2>
          </div>

          {/* Horizontal scroll on mobile, 4-col row on desktop */}
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`min-w-[260px] snap-start liquid-glass rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "liquid-glass-tinted-seed"
                    : ""
                }`}
              >
                <p className="font-display text-subheading md:text-heading text-seed-400 mb-1">
                  {tier.starting}
                </p>
                <h3 className="font-display text-lg md:text-subheading text-white mb-3">
                  {tier.name}
                </h3>
                <p className="text-body-sm text-light-base/45 leading-relaxed mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-seed-500 shrink-0 mt-0.5" />
                      <span className="text-body-sm text-light-base/60">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <QuoteButton
                    service="web-development"
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      tier.highlighted
                        ? "liquid-glass-tinted-seed liquid-glass-hover text-white"
                        : "liquid-glass text-white"
                    }`}
                  >
                    Get a Quote
                    <ArrowRight className="w-4 h-4" />
                  </QuoteButton>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-body-sm text-light-base/25 mt-8">
            Every project is scoped individually.{" "}
            <Link
              href="/pricing/web-development"
              className="text-seed-500/60 hover:text-seed-400 transition-colors"
            >
              See full pricing breakdown →
            </Link>
          </p>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          CLOSE
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-28 md:py-36">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedH2 className="font-display text-heading md:text-title text-white mb-6">
            Let&apos;s Build Something Great.
          </AnimatedH2>
          <p className="text-body-lg text-light-base/40 mb-10 max-w-lg mx-auto">
            Tell us about your project and we&apos;ll put together a tailored
            proposal within 48 hours.
          </p>
          <QuoteButton
            service="web-development"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-brand text-white text-base font-medium hover:shadow-glowSeed transition-all duration-300"
          >
            Start a Project
            <ArrowRight className="w-5 h-5" />
          </QuoteButton>
        </div>
      </section>
    </div>
  );
}
