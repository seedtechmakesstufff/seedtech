import { buildMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, ShoppingCart, SquareTerminal, Music, Mic2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { GradientOrb, GridPattern, LiquidGlassPill, AnimatedH1, AnimatedH2 } from "@/components/kit";

import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { projects } from "@/data/projects";

export const generateMetadata = buildMetadata("/services/web-development");

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
    href: "/services/seedtech-platform",
    description:
      "Perfect for small businesses that need a clean, professional online presence.",
    includes: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Fast, modern website build",
      "Includes SeedTech's comprehensive SEO platform",
      "Contact form",
      "Launch and deployment",
    ],
  },
  {
    name: "Robust Build",
    starting: "$7,800",
    href: "/services/seedtech-platform",
    description:
      "For businesses that need a more robust website with custom layouts and deeper content.",
    highlighted: true,
    includes: [
      "8–15 pages",
      "Custom design and layout",
      "Advanced UI components",
      "Includes SeedTech's comprehensive SEO platform",
      "Content strategy support",
      "Scalable architecture",
    ],
  },
  {
    name: "Ecommerce Website",
    starting: "$15,000",
    href: "/services/ecommerce-development",
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
    href: "/services/custom-development",
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
        name="Web Design and Development Services"
        description="Professional web design services and web development company. Business websites, ecommerce platforms, and custom web applications built with modern frameworks."
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
            Web Design &amp; Development Services
          </p>
          <AnimatedH1 highlightWords={["Ecommerce,", "Platforms"]} className="mb-8 text-center">
            Professional Web Design Services — Websites, Ecommerce, and Custom Platforms
          </AnimatedH1>
          <p className="text-body-lg text-light-base/50 max-w-2xl mx-auto mb-4 leading-relaxed">
            SeedTech is a web development company that builds modern websites, ecommerce stores, and custom web applications. From fast-launch business websites on the SeedTech Platform to full-stack ecommerce and custom software development — every project is designed around the business, not forced into a template.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CHOOSE YOUR PATH — three build tracks
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark-base py-24 md:py-32 overflow-hidden">
        <GradientOrb color="seed" size="lg" className="top-0 left-1/4 opacity-10" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-1/4 opacity-8" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seed-400 mb-5">
              Choose Your Path
            </p>
            <AnimatedH2
              highlightWords={["Three"]}
              className="font-display text-heading md:text-heading-lg text-white leading-tight mb-4"
            >
              Three Web Development Services — Choose Your Path
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/40 max-w-lg mx-auto">
              Every business is different. Whether you need a professional website, a redesign, or a custom web application — pick the track that fits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ── Card 1: SeedTech Platform ─────────────────────────────── */}
            <Link href="/services/seedtech-platform" className="group relative liquid-glass liquid-glass-hover rounded-2xl p-8 flex flex-col min-h-[340px] overflow-hidden">
              {/* Tint glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-seed-500/10 via-transparent to-transparent pointer-events-none" />
              {/* Number watermark */}
              <span className="absolute top-5 right-6 text-[80px] font-display font-bold leading-none text-white/[0.03] select-none pointer-events-none">
                01
              </span>
              <div className="relative z-[1] flex flex-col flex-1">
                <div className="w-11 h-11 rounded-xl bg-seed-500/15 border border-seed-500/20 flex items-center justify-center mb-5 group-hover:bg-seed-500/25 transition-colors duration-300">
                  <Rocket className="w-5 h-5 text-seed-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-wide text-white mb-3">
                  Standard Website on the SeedTech Platform
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                  For service businesses, lead-generation brands, and professional firms, the SeedTech Platform is the fastest way to launch a professional website with modern infrastructure and SEO Autopilot already configured. Also ideal for website redesign projects.
                </p>
                <div className="flex items-center gap-2 text-seed-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Most popular</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* ── Card 2: Full-Stack Ecommerce ──────────────────────────── */}
            <Link href="/services/ecommerce-development" className="group relative liquid-glass liquid-glass-hover rounded-2xl p-8 flex flex-col min-h-[340px] overflow-hidden">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-5 right-6 text-[80px] font-display font-bold leading-none text-white/[0.03] select-none pointer-events-none">
                02
              </span>
              <div className="relative z-[1] flex flex-col flex-1">
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/25 transition-colors duration-300">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-wide text-white mb-3">
                  Full-Stack Ecommerce for Businesses That Need to Sell Online
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                  We design and build ecommerce experiences on Shopify, BigCommerce, and WordPress for businesses that need more than a simple brochure site — whether that means better storefront UX, platform migration, product architecture, or custom commerce functionality.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Explore ecommerce</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* ── Card 3: Custom Software ───────────────────────────────── */}
            <Link href="/services/custom-development" className="group relative liquid-glass liquid-glass-hover rounded-2xl p-8 flex flex-col min-h-[340px] overflow-hidden">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-5 right-6 text-[80px] font-display font-bold leading-none text-white/[0.03] select-none pointer-events-none">
                03
              </span>
              <div className="relative z-[1] flex flex-col flex-1">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/25 transition-colors duration-300">
                  <SquareTerminal className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-wide text-white mb-3">
                  Custom Software, Products, and Business Systems
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                  When your needs go beyond a website or storefront, we build custom SaaS products, internal tools, web apps, PWAs, and business platforms designed around the way your company actually works.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Discuss your project</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUSTED BY — bold statement + animated logo marquee
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center mb-14">
          {/* Validated pill */}
          <LiquidGlassPill variant="default" className="mb-6">Validated</LiquidGlassPill>
          <AnimatedH2 className="font-display text-heading md:text-title text-white leading-[1.1] mb-6" highlightWords={["Brands"]}>
            Trusted by Brands
          </AnimatedH2>
          <p className="text-body-lg text-light-base/40 max-w-2xl mx-auto leading-relaxed">
            We specialize in prioritizing and customizing what works best for your business.
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
              Web Development Services — Transparent Pricing
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
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Starting at</p>
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
                  <Link
                    href={tier.href}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      tier.highlighted
                        ? "liquid-glass-tinted-seed liquid-glass-hover text-white"
                        : "liquid-glass text-white"
                    }`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
          CHOOSE YOUR PATH — compact secondary nav
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
            Ready to go deeper?
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/services/seedtech-platform"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4 text-seed-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  SeedTech Platform — fast-launch websites for service businesses
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
            </Link>

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

          <div className="space-y-3">
            <Link
              href="/services/web-development/artist-intake"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-seed-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Artist or touring act? Start your project intake →
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
            </Link>

            <Link
              href="/services/web-development/comedian-intake"
              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Mic2 className="w-4 h-4 text-seed-400 shrink-0" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Comedian or live comedy act? Start your project intake →
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
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
