import { buildMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Users,
  LayoutDashboard,
  Smartphone,
  Globe,
  Workflow,
  Cog,
  Zap,
  Package,
  ShoppingCart,
  Rocket,
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

export const generateMetadata = buildMetadata("/services/custom-development", {
  title: "Custom Development — SaaS, Portals, Apps & Business Systems",
  description:
    "Custom software, platforms, and applications built around real workflows. SaaS products, internal tools, portals, and business systems designed for how your business actually operates.",
  canonical: "/services/custom-development",
});

// ─── Data ──────────────────────────────────────────────────────────────────────

const faqs: FAQItem[] = [
  {
    question: "Are we locked into your systems?",
    answer:
      "No — all code, files, servers, and assets are owned by you. We don't believe in locking customers into a system or holding them hostage to a singular platform, even SeedTech. Once a project is finished, we send over the full details and transfer complete ownership to you.",
  },
  {
    question: "How does pricing work for custom projects?",
    answer:
      "Custom development is scoped and quoted project-by-project. We don't use fixed price lists because the work varies significantly — a lightweight internal dashboard has a very different scope than a multi-tenant SaaS platform or a customer-facing portal with complex business logic.\n\nAfter an initial conversation, we put together a detailed requirements breakdown and a fixed-scope proposal so you know exactly what's included and what it costs before any work begins. No hourly billing surprises.",
  },
  {
    question: "How long do custom builds take?",
    answer:
      "It depends heavily on scope. Focused internal tools and operational dashboards often run 6–10 weeks. Full SaaS platforms, multi-role portals, or systems with significant third-party integrations typically run 12–24 weeks.\n\nWe build realistic timelines into every proposal and don't compress them to win the project. You'll know upfront how long things will take and why.",
  },
  {
    question: "Can you work with our existing codebase or systems?",
    answer:
      "Yes. We regularly integrate with existing codebases, internal APIs, third-party services, and legacy systems. Before scoping, we do a technical review of what you have in place so we can build in a way that extends your current infrastructure rather than working around it.\n\nIf the existing system has limitations that would create problems down the line, we'll flag them during scoping — not after we're halfway through the build.",
  },
  {
    question: "What happens after the project launches?",
    answer:
      "At launch, we hand over full documentation, credentials, and access. If you have an internal team that will take over, we make sure they're oriented and capable of running the system independently.\n\nFor clients who want continued support — bug fixes, feature iterations, infrastructure monitoring — we offer ongoing retainer arrangements. That's scoped separately and isn't required.",
  },
];

const capabilities = [
  { label: "SaaS products", icon: <Globe className="w-4 h-4" /> },
  { label: "Internal business systems", icon: <Database className="w-4 h-4" /> },
  { label: "Customer and client portals", icon: <Users className="w-4 h-4" /> },
  { label: "Operational dashboards", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Progressive web apps", icon: <Smartphone className="w-4 h-4" /> },
  { label: "Web applications", icon: <Globe className="w-4 h-4" /> },
  { label: "Workflow and automation platforms", icon: <Workflow className="w-4 h-4" /> },
  { label: "Custom software tied to specific business processes", icon: <Cog className="w-4 h-4" /> },
];

const signals = [
  "Your workflow is unique and doesn\u2019t fit standard tools",
  "Your users need different roles and permissions",
  "Existing tools are creating inefficiency",
  "You need application logic beyond a normal website",
  "You are building a real product or operational system",
];

const caseStudies = [
  {
    client: "Cambium",
    type: "Custom Inventory Management Platform",
    description:
      "A purpose-built inventory management system designed around Cambium\u2019s specific operational workflows, replacing manual tracking with a streamlined digital platform.",
    icon: <Package className="w-5 h-5" />,
    color: "cyan",
  },
  {
    client: "Paddlers Cove",
    type: "Product Catalog & Inventory System",
    description:
      "A custom product catalog and inventory management system built for an ecommerce business, connecting storefront operations with back-end inventory tracking.",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "blue",
  },
];

const bestFor = [
  "Founders building SaaS products",
  "Businesses replacing manual processes",
  "Teams that need internal software",
  "Organizations with multi-user systems",
  "Companies that need customer portals or workflow tools",
  "Businesses that need application-level functionality",
];

const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const caseStudyColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "rgba(6,182,212,0.08)",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "rgba(59,130,246,0.08)",
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CustomDevelopmentPage() {
  return (
    <div className="pt-20">
      <ServiceJsonLd
        name="Custom Development"
        description="Custom software, platforms, and applications built around real workflows. SaaS products, internal tools, portals, PWAs, and business systems."
        url="https://seedtechllc.com/services/custom-development"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Custom Development", url: "/services/custom-development" },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dark-base py-32 md:py-44">
        <GradientOrb color="cyan" size="xl" className="-top-32 left-1/3 -translate-x-1/2 opacity-20" />
        <GradientOrb color="blue" size="lg" className="top-1/2 right-0 opacity-10" />
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-6">
            Custom Development
          </p>
          <AnimatedH1
            highlightWords={["Software,", "Real"]}
            className="mb-8 text-center leading-[1.05]"
          >
            Custom Software, Platforms, and Applications Built Around Real Workflows
          </AnimatedH1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            When your needs go beyond a standard website or off-the-shelf platform, we design and
            develop custom systems tailored to how your business actually works. From SaaS products
            and internal tools to portals, apps, PWAs, and business platforms — we build software
            with real logic behind it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-base font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start a Custom Project
              <ArrowRight className="w-5 h-5" />
            </QuoteButton>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Discuss Your Build
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHEN A STANDARD WEBSITE ISN'T ENOUGH
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
            Beyond Websites
          </p>
          <AnimatedH2
            highlightWords={["Standard", "Enough"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            When a Standard Website Is Not Enough
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
            Some projects need more than pages, forms, and plugins. They need user roles, workflows,
            dashboards, permissions, data models, and business logic.
          </p>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
            That is where custom development becomes the right path. We design and build software
            systems that support real operations, real products, and real workflows — not just
            marketing pages.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT WE BUILD
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              Capabilities
            </p>
            <AnimatedH2
              highlightWords={["Build"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              What We Build
            </AnimatedH2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap) => (
              <div key={cap.label} style={glassStyle} className="p-5 flex items-start gap-3">
                <div className="text-cyan-400 shrink-0 mt-0.5">{cap.icon}</div>
                <span className="text-sm text-white/60">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHEN CUSTOM IS THE RIGHT FIT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
                Right Fit
              </p>
              <AnimatedH2
                highlightWords={["Off-the-Shelf"]}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              >
                The Right Fit When Off-the-Shelf Tools Start Fighting the Business
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                Custom development makes sense when your workflow, users, or business logic no longer
                fit inside standard tools. If your team is relying on workarounds, stitching together
                disconnected software, or forcing important processes into tools that were never
                designed for them — custom development is the more valuable path.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {signals.map((signal) => (
                <div key={signal} className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/60">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OUR APPROACH
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              Approach
            </p>
            <AnimatedH2
              highlightWords={["Architecture,"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
            >
              Strategy, Architecture, and Build
            </AnimatedH2>
            <p className="text-sm md:text-[15px] text-white/45 leading-relaxed max-w-2xl mx-auto mb-4">
              We approach custom projects from the inside out. That means understanding the workflow,
              the users, the business logic, and the operational goals first — then translating that
              into architecture, interfaces, and a build plan that makes sense.
            </p>
            <p className="text-sm md:text-[15px] text-white/45 leading-relaxed max-w-2xl mx-auto">
              We are not just designing screens. We are defining and implementing the system behind them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProcessStep
              step="01"
              title="Discovery"
              description="Understand the workflow, users, and business logic that the system needs to support."
            />
            <ProcessStep
              step="02"
              title="Architecture"
              description="Define the data model, user roles, integrations, and technical approach."
            />
            <ProcessStep
              step="03"
              title="Build"
              description="Develop the system iteratively with regular review points and working demos."
            />
            <ProcessStep
              step="04"
              title="Launch & Evolve"
              description="Deploy, onboard users, and continue evolving the system as the business grows."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BUILD PHILOSOPHY
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
            Philosophy
          </p>
          <AnimatedH2
            highlightWords={["Used,"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            Built to Be Used, Not Just Demonstrated
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed mb-4">
            A useful system has to hold up after launch. It has to be maintainable, understandable,
            and capable of evolving with the business.
          </p>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
            Our focus is not just to ship something custom. It is to build something the business
            can actually use, operate, and grow with over time.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CASE STUDIES
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              Recent Work
            </p>
            <AnimatedH2
              highlightWords={["Built"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              Custom Systems We&apos;ve Built
            </AnimatedH2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.map((study) => {
              const colors = caseStudyColors[study.color];
              return (
                <div
                  key={study.client}
                  style={{
                    ...glassStyle,
                    border: `1px solid ${study.color === "cyan" ? "rgba(6,182,212,0.15)" : "rgba(59,130,246,0.15)"}`,
                    background: `linear-gradient(135deg, ${colors.glow} 0%, rgba(255,255,255,0.02) 100%)`,
                  }}
                  className="p-8 flex flex-col gap-5"
                >
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
                    {study.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
                      {study.client}
                    </p>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                      {study.type}
                    </h3>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {study.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BEST FIT
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
                Best Fit
              </p>
              <AnimatedH2
                highlightWords={["Real"]}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              >
                Best for Teams That Need a Real System
              </AnimatedH2>
              <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
                This path is best for organizations that need more than a website and need software
                built around how the business operates.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {bestFor.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(64, 166, 96, 0.15)",
                  background: "linear-gradient(135deg, rgba(64,166,96,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                className="p-5"
              >
                <p className="text-sm text-white/50 leading-relaxed">
                  Need a simpler website, not a custom system?{" "}
                  <Link href="/services/seedtech-platform" className="text-seed-400 hover:text-seed-300 transition-colors font-medium">
                    See the SeedTech Platform
                    <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING / QUOTE
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
            Pricing
          </p>
          <AnimatedH2
            highlightWords={["Scoped"]}
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
          >
            Every Custom Project Is Scoped Individually
          </AnimatedH2>
          <p className="text-sm md:text-[15px] text-white/45 leading-relaxed mb-10 max-w-lg mx-auto">
            Custom development scope varies significantly based on complexity, users, integrations,
            and business logic. We start with a discovery conversation to understand what the system
            needs to do — then provide a detailed scope, timeline, and budget.
          </p>
          <QuoteButton
            service="web-development"
            tier="Custom Web Application"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-base font-semibold hover:shadow-lg transition-all duration-300"
          >
            Request a Quote
            <ArrowRight className="w-5 h-5" />
          </QuoteButton>
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
