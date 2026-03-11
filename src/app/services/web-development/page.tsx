import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Code2,
  Globe,
  LayoutDashboard,
  Layers,
  Gauge,
  Lock,
  Palette,
  RefreshCcw,
  Search,
  ShoppingCart,
  Smartphone,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  Badge,
  CTABanner,
  CheckList,
  DotPattern,
  ElevatedCard,
  GlassCard,
  GradientOrb,
  GradientText,
  GridPattern,
  IconBox,
  ProcessStep,
} from "@/components/kit";
import { QuoteButton } from "@/components/quote-flow";

export const metadata = {
  title: "Web Development Services — SeedTech",
  description:
    "Custom websites, ecommerce platforms, and web applications built to perform. SeedTech delivers modern, scalable web development for growing businesses.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const capabilities = [
  {
    icon: Globe,
    title: "Marketing Websites",
    body: "High-converting sites that tell your brand story, build trust, and turn visitors into leads.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Platforms",
    body: "Custom storefronts on BigCommerce, WooCommerce, or headless — built to sell and scale.",
  },
  {
    icon: LayoutDashboard,
    title: "Web Applications",
    body: "Dashboards, portals, booking systems, and SaaS tools built on modern, maintainable stacks.",
  },
  {
    icon: Code2,
    title: "Custom Integrations",
    body: "Connect your website to CRMs, ERPs, payment gateways, inventory systems, and third-party APIs.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    body: "Every project starts with design — wireframes, prototypes, and pixel-perfect interfaces before a line of code is written.",
  },
  {
    icon: RefreshCcw,
    title: "Migrations & Rebuilds",
    body: "Moving off an old platform or rebuilding from scratch? We handle complex migrations without the downtime.",
  },
];

const whyUs = [
  {
    icon: Gauge,
    title: "Performance-First",
    body: "Core Web Vitals, image optimization, and fast delivery architectures — built in from day one, not bolted on after.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Responsive",
    body: "Every layout, every component, every interaction is tested across devices. Mobile isn't an afterthought.",
  },
  {
    icon: Search,
    title: "SEO-Friendly Architecture",
    body: "Clean semantics, structured data, fast load times, and proper metadata — the technical foundation search engines reward.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    body: "HTTPS everywhere, secure form handling, dependency audits, and proper authentication patterns on every project.",
  },
  {
    icon: Layers,
    title: "Scalable Structure",
    body: "We build for where you're going, not just where you are. Clean codebases that your team can maintain and extend.",
  },
  {
    icon: Wrench,
    title: "Ongoing Support Available",
    body: "Launch is just the beginning. We offer care plans, retainers, and on-demand support to keep your site healthy.",
  },
];

const techStack = [
  { label: "Next.js", category: "Framework" },
  { label: "React", category: "Framework" },
  { label: "TypeScript", category: "Language" },
  { label: "WordPress", category: "CMS" },
  { label: "BigCommerce", category: "Ecommerce" },
  { label: "WooCommerce", category: "Ecommerce" },
  { label: "Shopify", category: "Ecommerce" },
  { label: "Vercel", category: "Hosting" },
  { label: "Tailwind CSS", category: "Styling" },
  { label: "REST APIs", category: "Integration" },
  { label: "Stripe", category: "Payments" },
  { label: "Square", category: "Payments" },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by understanding your business, your users, and your goals — not just what you want the site to look like, but what you need it to do.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Wireframes and high-fidelity mockups are reviewed and approved before development begins. No surprises.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "Iterative builds with regular check-ins. You see real progress throughout, not just a big reveal at the end.",
  },
  {
    step: "04",
    title: "QA & Launch",
    description:
      "Full cross-browser, cross-device QA, performance audit, and a staged launch with rollback capability.",
  },
];

const outcomes = [
  "Faster load times that reduce bounce rate",
  "Higher conversion rates from improved UX",
  "Better search rankings from clean technical SEO",
  "Easier content management for your team",
  "Lower long-term maintenance cost",
  "A codebase your next developer can actually work with",
];

const faqs = [
  {
    q: "How long does a typical website project take?",
    a: "Starter websites typically take 4–6 weeks. Growth and ecommerce projects run 8–16 weeks depending on scope and content readiness. Custom web applications vary based on complexity.",
  },
  {
    q: "Do you work with existing brands and designs?",
    a: "Yes. We can build from your existing brand guidelines, a Figma file, or start from scratch. We adapt to where you are.",
  },
  {
    q: "Will I be able to update the site myself?",
    a: "Absolutely. We set up a CMS or admin interface appropriate for your site and provide a recorded walkthrough so your team is fully self-sufficient at launch.",
  },
  {
    q: "What platforms do you build on?",
    a: "We're platform-agnostic. We build on Next.js, WordPress, BigCommerce, WooCommerce, and Shopify depending on what's right for your project.",
  },
  {
    q: "Do you offer hosting and maintenance?",
    a: "Yes — we offer website care plans that include hosting management, updates, backups, and ongoing support. Ask about our retainer options.",
  },
];

const comparison = [
  {
    label: "Page Builders",
    points: [
      "Template-constrained design",
      "Performance limitations",
      "Limited custom functionality",
      "Vendor lock-in",
      "Hard to scale",
    ],
    highlight: false,
    icon: "✗" as const,
  },
  {
    label: "SeedTech",
    points: [
      "100% custom design",
      "Performance-optimized builds",
      "Any functionality you need",
      "You own your code",
      "Architected to scale",
    ],
    highlight: true,
    icon: "✓" as const,
  },
  {
    label: "Large Agencies",
    points: [
      "Premium custom design",
      "Strong technical execution",
      "Wide capability range",
      "Higher cost",
      "Slower, less direct communication",
    ],
    highlight: false,
    icon: "~" as const,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WebDevelopmentPage() {
  return (
    <div className="pt-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-dark-base py-28">
        <GradientOrb color="blue" size="xl" className="-top-40 -right-40 opacity-25" />
        <GradientOrb color="seed" size="lg" className="top-1/2 -left-32 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="glass-dark">Web Development</Badge>
              <Badge variant="outline" size="sm">Custom Builds</Badge>
              <Badge variant="outline" size="sm">Ecommerce</Badge>
              <Badge variant="outline" size="sm">Web Apps</Badge>
            </div>
            <h1 className="font-display text-title md:text-display text-white leading-[1.05] mb-6">
              Websites That{" "}
              <GradientText as="span">Work as Hard</GradientText>
              {" "}as You Do
            </h1>
            <p className="text-body-lg text-light-base/60 max-w-2xl mb-10 leading-relaxed">
              We design and build custom websites, ecommerce platforms, and web applications that are fast, beautiful, and built to grow with your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteButton
                service="web-development"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </QuoteButton>
              <Link
                href="/pricing/web-development"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white text-sm font-medium hover:bg-white/[0.10] transition-all duration-200"
              >
                See Pricing
              </Link>
              <Link
                href="/our-work"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white/60 text-sm font-medium hover:text-white transition-colors"
              >
                View Our Work
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform strip ── */}
      <section className="bg-dark-elevated border-y border-white/[0.05] py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-body-sm text-light-base/35 uppercase tracking-wider shrink-0">Platforms we build on</p>
            <div className="flex flex-wrap gap-3">
              {["Next.js", "WordPress", "BigCommerce", "WooCommerce", "Shopify", "Vercel"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What we build ── */}
      <Section>
        <SectionHeader
          eyebrow="What We Build"
          title="Full-Service Web Development"
          description="From simple marketing sites to complex custom applications — we handle the full spectrum of web development."
          align="left"
          theme="dark"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <ElevatedCard key={cap.title} className="flex flex-col gap-4">
              <IconBox icon={cap.icon} variant="soft-dark" size="md" />
              <div>
                <h3 className="font-display text-card-title text-white mb-2">{cap.title}</h3>
                <p className="text-body-sm text-light-base/55 leading-relaxed">{cap.body}</p>
              </div>
            </ElevatedCard>
          ))}
        </div>
      </Section>

      {/* ── Web Dev Process graphic ── */}
      <Section className="!pt-0">
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-elevated">
          <div className="px-8 pt-8 pb-4">
            <p className="text-eyebrow uppercase tracking-widest text-seed-400 mb-2 text-xs">Our Approach</p>
            <h2 className="font-display text-heading text-white">The Web Development Process</h2>
          </div>
          <Image
            src="/Web-Dev-Process-graphic-1536x348.png"
            alt="SeedTech web development process overview"
            width={1536}
            height={348}
            className="w-full h-auto"
            priority
          />
        </div>
      </Section>

      {/* ── Process steps ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="How We Work"
          title="From First Call to Launch Day"
          description="A clear, collaborative process so you always know what's happening and what's next."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {processSteps.map((step) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
              theme="light"
            />
          ))}
        </div>

        {/* Agile methodology graphic */}
        <div className="rounded-2xl overflow-hidden border border-black/[0.06] bg-white shadow-cardLight">
          <div className="px-8 pt-8 pb-4">
            <p className="text-eyebrow uppercase tracking-widest text-seed-600 mb-2 text-xs">Methodology</p>
            <h3 className="font-display text-subheading text-dark-base">Agile, Iterative Development</h3>
            <p className="text-body-sm text-dark-base/55 mt-1 max-w-xl">
              We work in focused sprints with regular reviews — so you see real progress throughout, and we can adapt quickly when requirements evolve.
            </p>
          </div>
          <Image
            src="/Agile-Methodology-graphi-1536x421.png"
            alt="Agile methodology diagram"
            width={1536}
            height={421}
            className="w-full h-auto"
          />
        </div>
      </Section>

      {/* ── Why SeedTech ── */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeader
              eyebrow="Why SeedTech"
              title="Built Right the First Time"
              description="We've seen what happens when websites are built fast and cheap. We take a different approach — one that saves you money in the long run."
              align="left"
              theme="dark"
            />
            <CheckList items={outcomes} theme="dark" />
          </div>

          <div className="space-y-4">
            {/* Placeholder: performance / metrics visual */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-elevated aspect-[4/3] flex items-center justify-center relative">
              <DotPattern />
              <div className="relative z-10 text-center space-y-2 p-8">
                <BarChart3 className="w-10 h-10 text-white/10 mx-auto" />
                <p className="text-white/15 text-sm">Performance metrics graphic placeholder</p>
              </div>
            </div>
            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "98", label: "Avg. Lighthouse Score" },
                { value: "<2s", label: "Target Load Time" },
                { value: "100%", label: "Mobile Responsive" },
                { value: "A+", label: "Security Rating" },
              ].map((stat) => (
                <GlassCard key={stat.label} theme="dark" className="p-5 text-center" hover={false}>
                  <p className="font-display text-stat-number text-seed-400 leading-none mb-1">{stat.value}</p>
                  <p className="text-xs text-light-base/40">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Why us deep-dive ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Our Philosophy"
          title="We Build For Outcomes, Not Deliverables"
          description="Every decision we make — design, architecture, content structure — is tied back to your business goals."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Users,
              title: "User-Centered Design",
              body: "We map user journeys before we touch a design tool. Every layout decision is grounded in how real users navigate, read, and decide.",
            },
            {
              icon: Zap,
              title: "Speed Is a Feature",
              body: "A 1-second delay in page load time can reduce conversions by 7%. We obsess over performance because your customers notice.",
            },
            {
              icon: BarChart3,
              title: "Analytics From Day One",
              body: "We set up proper event tracking, conversion goals, and reporting so you can measure what's actually working.",
            },
            {
              icon: RefreshCcw,
              title: "Built to Evolve",
              body: "Your business will grow and change. We build with that in mind — clean architecture, modular components, and thorough documentation.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-seed-600/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-seed-600" />
              </div>
              <div>
                <h3 className="font-display text-card-title text-dark-base mb-2">{item.title}</h3>
                <p className="text-body-sm text-dark-base/60 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Tech stack ── */}
      <Section>
        <SectionHeader
          eyebrow="Technology"
          title="Modern Stack, Proven Results"
          description="We choose tools based on what's right for your project — not what's trendy or easiest for us."
          align="center"
          theme="dark"
        />
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-12">
          {techStack.map((tech) => (
            <div
              key={tech.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-elevated border border-white/[0.06]"
            >
              <span className="text-sm font-medium text-white">{tech.label}</span>
              <span className="text-xs text-light-base/30">{tech.category}</span>
            </div>
          ))}
        </div>

        {/* Placeholder: architecture diagram */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-elevated">
          <div className="aspect-[16/5] flex items-center justify-center relative">
            <DotPattern />
            <div className="relative z-10 text-center space-y-2">
              <Layers className="w-8 h-8 text-white/10 mx-auto" />
              <p className="text-white/15 text-sm">Tech stack / architecture diagram placeholder</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Portfolio teaser ── */}
      <Section theme="light">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Our Work"
            title="Projects We're Proud Of"
            description="A sample of what we've built for clients across industries."
            align="left"
            theme="light"
            className="mb-0"
          />
          <Link
            href="/our-work"
            className="inline-flex items-center gap-2 text-seed-600 hover:text-seed-700 text-sm font-medium transition-colors shrink-0 pb-1"
          >
            See all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { client: "Paddlers Cove", tag: "BigCommerce + Custom Platform", slug: "paddlers-cove" },
            { client: "Short Run Custom Boxes", tag: "WordPress + WooCommerce", slug: "short-run-custom-boxes" },
            { client: "Megasafe", tag: "WooCommerce + Mobile App", slug: "megasafe" },
          ].map((project) => (
            <Link
              key={project.slug}
              href={`/our-work/${project.slug}`}
              className="group rounded-2xl overflow-hidden border border-black/[0.06] bg-white shadow-cardLight hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-light-base to-white flex items-center justify-center relative overflow-hidden border-b border-black/[0.05]">
                <Globe className="w-8 h-8 text-dark-base/10" />
                {/* TODO: replace with project screenshot */}
                <p className="absolute bottom-2 left-3 text-xs text-dark-base/20">Screenshot placeholder</p>
              </div>
              <div className="p-5">
                <p className="text-xs text-dark-base/35 mb-1">{project.tag}</p>
                <p className="font-display text-card-title text-dark-base group-hover:text-seed-600 transition-colors">{project.client}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── Comparison ── */}
      <Section>
        <SectionHeader
          eyebrow="SeedTech vs. The Alternatives"
          title="Why Not Just Use a Page Builder?"
          description="Wix, Squarespace, and website builders are fine for some use cases. Here's when they're not."
          align="center"
          theme="dark"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {comparison.map((col) => (
            <div
              key={col.label}
              className={`rounded-2xl p-6 border ${
                col.highlight
                  ? "bg-dark-elevated border-seed-600/30 shadow-pricingHighlight"
                  : "bg-dark-elevated border-white/[0.06]"
              }`}
            >
              {col.highlight && (
                <span className="inline-flex mb-4 px-2.5 py-0.5 rounded-full text-xs bg-gradient-brand text-white">
                  Recommended
                </span>
              )}
              <h3 className={`font-display text-subheading mb-5 ${col.highlight ? "text-white" : "text-white/40"}`}>
                {col.label}
              </h3>
              <ul className="space-y-3">
                {col.points.map((pt) => (
                  <li
                    key={pt}
                    className={`flex items-start gap-3 text-body-sm ${col.highlight ? "text-light-base/70" : "text-white/30"}`}
                  >
                    <span className={`shrink-0 font-bold mt-0.5 ${col.highlight ? "text-seed-400" : "text-white/30"}`}>
                      {col.icon}
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section theme="light">
        <SectionHeader
          eyebrow="FAQ"
          title="Common Questions"
          description="Answers to the things people usually ask before starting a project."
          align="left"
          theme="light"
        />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/[0.05] shadow-cardLight p-6">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Pricing teaser + CTA ── */}
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { name: "Starter", price: "$2,500", desc: "Up to 5 pages, clean and fast." },
            { name: "Growth", price: "$7,800", desc: "8–15 pages, custom layouts.", highlight: true },
            { name: "Ecommerce", price: "$15,000", desc: "Full custom storefront." },
          ].map((tier) => (
            <GlassCard
              key={tier.name}
              theme="dark"
              className={`p-6 text-center ${tier.highlight ? "border-seed-600/30" : ""}`}
              hover={false}
            >
              <p className="text-body-sm text-light-base/35 uppercase tracking-wider mb-2">{tier.name}</p>
              <p className="font-display text-heading text-seed-400 mb-2">Starting at {tier.price}</p>
              <p className="text-body-sm text-light-base/50 mb-4">{tier.desc}</p>
              <Link
                href="/pricing/web-development"
                className="text-xs text-seed-400 hover:text-seed-300 font-medium transition-colors"
              >
                See full breakdown →
              </Link>
            </GlassCard>
          ))}
        </div>
        <p className="text-center text-body-sm text-light-base/30 mb-10">
          Custom web applications also available from $10,000+
        </p>
        <CTABanner
          title="Ready to Build Something Great?"
          description="Tell us about your project and we'll put together a tailored proposal within 48 hours."
          primaryLabel="Start Your Project"
          primaryHref="/contact"
          secondaryLabel="View Full Pricing"
          secondaryHref="/pricing/web-development"
        />
      </Section>

    </div>
  );
}

