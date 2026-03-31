import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Store,
  Layers,
  Package,
  Truck,
  Settings,
  RefreshCw,
  LayoutGrid,
  Rocket,
  SquareTerminal,
} from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  AnimatedH1,
  AnimatedH2,
  ProcessStep,
  FAQAccordion,
} from "@/components/kit";
import type { FAQItem } from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const generateMetadata = buildMetadata("/services/ecommerce-development", {
  title: "Ecommerce Development — Shopify, BigCommerce & WordPress",
  description:
    "Ecommerce design and development on Shopify, BigCommerce, and WordPress for businesses that need more than a basic storefront.",
  canonical: "/services/ecommerce-development",
});

// ─── Data ──────────────────────────────────────────────────────────────────────

const faqs: FAQItem[] = [
  {
    question: "Are we locked into your systems?",
    answer:
      "No — all code, files, servers, and assets are owned by you. We don't believe in locking customers into a system or holding them hostage to a singular platform, even SeedTech. Once a project is finished, we send over the full details and transfer complete ownership to you.",
  },
  {
    question: "Which ecommerce platform should I choose — Shopify, BigCommerce, or WordPress?",
    answer:
      "It depends on your business model, catalog complexity, and how much flexibility you need.\n\nShopify is our most common recommendation for direct-to-consumer brands — it's fast to launch, reliable at scale, and has a large ecosystem of payment and shipping integrations.\n\nBigCommerce is better suited for B2B or multi-channel sellers who need more native flexibility without heavy app dependencies.\n\nWordPress with WooCommerce makes sense when you're already invested in the WordPress ecosystem, need very custom checkout logic, or want tighter control over the full stack.\n\nWe'll help you evaluate the right fit based on your catalog size, expected traffic, and operational requirements — not just which platform is easiest for us to build on.",
  },
  {
    question: "Can you migrate my existing store?",
    answer:
      "Yes. We've handled platform migrations for stores moving between Shopify, BigCommerce, WooCommerce, and custom builds. Migration scope typically includes product data, customer records, order history, URL redirects, and SEO preservation.\n\nThe complexity varies based on catalog size and custom functionality. We assess the full migration requirements before quoting so there are no surprises mid-project.",
  },
  {
    question: "How long does an ecommerce build take?",
    answer:
      "Most ecommerce projects run 8–16 weeks from signed contract to launch, depending on catalog size, custom functionality, and integration complexity. A focused Shopify build with a defined catalog can move faster; a BigCommerce build with custom B2B pricing logic, ERP integrations, or a large SKU count will take longer.\n\nWe scope timelines project-by-project after the requirements phase so you have a realistic picture before work begins.",
  },
  {
    question: "Do you handle payment gateway and checkout setup?",
    answer:
      "Yes — payment gateway configuration, checkout flow, and tax/shipping setup are all included as part of a standard ecommerce build. We work with Stripe, PayPal, Shop Pay, and platform-native gateways depending on your platform and geography.\n\nIf you have specific compliance requirements (like PCI-DSS level considerations or regional payment methods), we factor those into the architecture from the start.",
  },
];

const platforms = [
  {
    name: "Shopify",
    description:
      "A strong fit for brands that need speed, a polished storefront, and a mature app ecosystem.",
    color: "seed",
  },
  {
    name: "BigCommerce",
    description:
      "A strong fit for businesses that need more flexibility, deeper customization, or a stronger long-term commerce foundation.",
    color: "blue",
  },
  {
    name: "WordPress / WooCommerce",
    description:
      "A strong fit for content-driven businesses that need ecommerce tightly integrated into a broader website experience.",
    color: "cyan",
  },
];

const capabilities = [
  { label: "New ecommerce storefronts", icon: <Store className="w-4 h-4" /> },
  { label: "Ecommerce redesigns and rebuilds", icon: <RefreshCw className="w-4 h-4" /> },
  { label: "Platform migrations and replatforming", icon: <Truck className="w-4 h-4" /> },
  { label: "Product and catalog architecture", icon: <Package className="w-4 h-4" /> },
  { label: "Content + commerce experiences", icon: <LayoutGrid className="w-4 h-4" /> },
  { label: "Custom storefront functionality", icon: <Settings className="w-4 h-4" /> },
  { label: "Ecommerce integrations", icon: <Layers className="w-4 h-4" /> },
  { label: "Platform-specific customization", icon: <ShoppingCart className="w-4 h-4" /> },
];

const bestFor = [
  "Brands launching or relaunching ecommerce",
  "Businesses migrating between platforms",
  "Stores with complex catalogs",
  "Teams that need custom storefront functionality",
  "Businesses that need content and commerce to work together",
];

const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const platformColors: Record<string, { bg: string; border: string; text: string }> = {
  seed: {
    bg: "bg-seed-500/10",
    border: "border-seed-500/20",
    text: "text-seed-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EcommerceDevelopmentPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="Ecommerce Development"
        description="Ecommerce design and development on Shopify, BigCommerce, and WordPress for businesses that need more than a basic storefront."
        url="https://seedtechllc.com/services/ecommerce-development"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Ecommerce Development", url: "/services/ecommerce-development" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="blue" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="cyan" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-6">
            Ecommerce Development
          </p>
          <AnimatedH1
            highlightWords={["Selling,", "Scale"]}
            className="mb-8 text-center leading-[1.05]"
          >
            Ecommerce Built for Selling, Operations, and Scale
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            We design and develop ecommerce experiences on Shopify, BigCommerce, and WordPress for
            businesses that need more than a basic storefront. From platform selection and storefront
            UX to catalog structure, integrations, and custom functionality — we build ecommerce
            systems around how the business actually sells.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start an Ecommerce Project
              <ArrowRight className="w-5 h-5" />
            </QuoteButton>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Talk Through Platforms
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MORE THAN A STOREFRONT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            The Offering
          </p>
          <AnimatedH2
            highlightWords={["Storefront"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            More Than a Storefront Build
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
            Strong ecommerce development is not just about launching a homepage, product pages,
            and a checkout. It is about building the structure behind the storefront: the platform
            fit, the catalog, the content, the customer journey, and the operational realities
            that keep the business moving.
          </p>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
            We build ecommerce systems that are designed to support selling — not just look like
            they do.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PLATFORMS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Platforms
            </p>
            <AnimatedH2
              highlightWords={["Right", "Platform"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              Built on the Right Commerce Platform for the Job
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-xl mx-auto leading-relaxed">
              We define the right platform based on how the business sells, what needs to be managed
              internally, and how much flexibility is required over time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const colors = platformColors[platform.color];
              return (
                <div key={platform.name} style={glassStyle} className="p-7 flex flex-col gap-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">{platform.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT WE BUILD
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Capabilities
            </p>
            <AnimatedH2
              highlightWords={["Ecommerce"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              What We Build in Ecommerce
            </AnimatedH2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap) => (
              <div key={cap.label} style={glassStyle} className="p-5 flex items-start gap-3">
                <div className="text-blue-400 shrink-0 mt-0.5">{cap.icon}</div>
                <span className="text-sm text-white/60">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OUR APPROACH
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Our Approach
          </p>
          <AnimatedH2
            highlightWords={["Business,"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            Built Around the Business, Not Just the Theme
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
            Many ecommerce projects stop at design and theme setup. Our approach is broader.
          </p>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
            We look at the storefront experience, the platform fit, the product structure, the
            content, and the workflows behind the store. That produces ecommerce systems that are
            more useful, more scalable, and better aligned with how the business actually operates.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROCESS — 4 steps
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Process
            </p>
            <AnimatedH2
              highlightWords={["Ecommerce"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              How We Approach Ecommerce Projects
            </AnimatedH2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProcessStep
              step="01"
              title="Platform & Business Fit"
              description="We look at what the business sells, how it sells today, and where the friction is."
            />
            <ProcessStep
              step="02"
              title="Architecture & Structure"
              description="We define platform direction, storefront approach, key templates, and required functionality."
            />
            <ProcessStep
              step="03"
              title="Build & Integration"
              description="We implement the storefront, content structure, and the features needed to support the business."
            />
            <ProcessStep
              step="04"
              title="QA & Launch"
              description="We test the core customer flows and launch with a stronger ecommerce foundation in place."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BEST FIT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
                Best Fit
              </p>
              <AnimatedH2
                highlightWords={["Real"]}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              >
                Best for Businesses That Need a Real Ecommerce Build
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                This is the right path for businesses that need more than a brochure website and
                need their online selling experience built around real operational needs.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {bestFor.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-sm text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Pricing
          </p>
          <AnimatedH2
            highlightWords={["$15,000"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            Ecommerce Projects Starting at $15,000
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/45 leading-relaxed mb-10 max-w-lg mx-auto">
            Every ecommerce project is scoped individually. We start with a discovery
            conversation to understand the platform, catalog, and feature requirements — then
            provide an accurate budget and timeline estimate.
          </p>
          <div
            style={{
              ...glassStyle,
              border: "1px solid rgba(59, 130, 246, 0.15)",
              background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            }}
            className="p-10 flex flex-col items-center gap-6"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider">Starting at</p>
            <p className="font-display text-5xl md:text-6xl text-blue-400 font-bold">$15,000+</p>
            <p className="text-sm text-white/50 leading-relaxed max-w-md">
              Includes platform setup, storefront design and development, catalog architecture,
              core integrations, and launch support. Larger scopes quoted after requirements gathering.
            </p>
            <QuoteButton
              service="web-development"
              tier="Ecommerce Website"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base font-semibold hover:shadow-lg transition-all duration-300"
            >
              Request a Quote
              <ArrowRight className="w-5 h-5" />
            </QuoteButton>
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
