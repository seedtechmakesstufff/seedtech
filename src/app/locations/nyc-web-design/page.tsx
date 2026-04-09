import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PhoneCall,
  MapPin,
  Rocket,
  ShoppingCart,
  SquareTerminal,
  Code,
  Palette,
  Search,
  LineChart,
  Wrench,
  Globe,
  Landmark,
  Film,
  Stethoscope,
  Scale,
  Building2,
  Briefcase,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  IconBox,
  CardTitle,
  Body,
  AnimatedH1,
  AnimatedH2,
  FAQAccordion,
} from "@/components/kit";
import type { FAQItem } from "@/components/kit";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { QuoteButton } from "@/components/quote-flow";

export const metadata: Metadata = {
  title:
    "Web Design Company NYC | SeedTech — Web Development Agency New York",
  description:
    "SeedTech is a web design and development company serving New York City businesses. Modern websites, ecommerce, and custom web applications. Starting at $2,500. Call (914) 362-8889.",
  alternates: { canonical: "/locations/nyc-web-design" },
  openGraph: {
    title: "NYC Web Design & Development — SeedTech",
    description:
      "Web design and development for NYC businesses. Modern websites, ecommerce platforms, and custom web apps from SeedTech.",
    images: [
      {
        url: "/og-image-placeholder.png",
        width: 1200,
        height: 630,
        alt: "NYC Web Design — SeedTech",
      },
    ],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const services = [
  {
    icon: Rocket,
    title: "Business Websites",
    price: "From $2,500",
    body: "High-performance business websites on the SeedTech Platform with built-in SEO, mobile-first design, and a modern tech stack. Built for the pace and competition of the NYC market.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Development",
    price: "From $15,000",
    body: "Custom ecommerce experiences on Shopify, BigCommerce, and WooCommerce. Product catalog architecture, checkout optimization, and payment integration for NYC retailers and D2C brands.",
  },
  {
    icon: SquareTerminal,
    title: "Custom Web Applications",
    price: "From $10,000",
    body: "Dashboards, SaaS products, booking platforms, membership portals, and internal tools — built from scratch for the specific workflows of your NYC business.",
  },
  {
    icon: Palette,
    title: "Website Redesign",
    price: "Varies",
    body: "Your competitors in New York are investing in their digital presence. We redesign and rebuild websites on modern infrastructure — preserving your SEO while upgrading the experience.",
  },
];

const whyUs = [
  {
    icon: Code,
    title: "Modern tech stack",
    body: "Next.js, React, and Tailwind CSS — the same technologies used by the companies setting the standard in New York's tech ecosystem. Your site loads fast, ranks well, and scales.",
  },
  {
    icon: Search,
    title: "SEO built in from day one",
    body: "Every website ships with SEO Autopilot — our proprietary platform handling technical SEO, content optimization, and rank tracking. Critical for competing in the NYC search landscape.",
  },
  {
    icon: Globe,
    title: "Competitive in any market",
    body: "NYC is one of the most competitive digital markets in the world. We build sites that perform — fast load times, clean code, strong content architecture, and structured data.",
  },
  {
    icon: LineChart,
    title: "Results you can measure",
    body: "Google Analytics, Search Console integration, conversion tracking, and monthly reporting. You see exactly what your website investment is delivering.",
  },
  {
    icon: Wrench,
    title: "Ongoing maintenance available",
    body: "Post-launch maintenance plans from $125/month. Content updates, security patches, performance monitoring, and priority support to keep your NYC business competitive.",
  },
  {
    icon: MapPin,
    title: "NJ-based, NYC-serving",
    body: "Headquartered in New Jersey with deep experience serving Manhattan, Brooklyn, and the greater NYC metro area. Remote-first workflow with on-site availability when needed.",
  },
];

const industries = [
  {
    icon: Landmark,
    title: "Financial services",
    body: "Investment firms, fintech startups, and financial advisors need websites that communicate trust, compliance, and expertise. We build them with precision.",
  },
  {
    icon: Scale,
    title: "Law firms",
    body: "NYC law firms need websites that generate consultations. Attorney profiles, practice area content, client testimonials, and conversion-optimized contact flows.",
  },
  {
    icon: Film,
    title: "Media & creative agencies",
    body: "Portfolio-driven websites for NYC's creative industry — agencies, production companies, and studios. High-bandwidth visual design with performance to match.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    body: "Medical practices and health tech companies throughout NYC. Patient-facing portals, appointment booking, and HIPAA-conscious design and infrastructure.",
  },
  {
    icon: Building2,
    title: "Startups & SaaS",
    body: "NYC startups need to move fast. We build marketing sites, landing pages, and MVPs on a modern stack that scales as your company grows.",
  },
  {
    icon: Briefcase,
    title: "Professional services",
    body: "Accounting firms, consultancies, and advisory firms across NYC. Websites designed to communicate authority and convert high-value prospects.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How much does a website cost for a NYC business?",
    answer:
      "Starter websites begin at $2,500 for a clean, professional site on the SeedTech Platform. Robust builds run around $7,800. Ecommerce starts at $15,000, and custom web applications start at $10,000+. Pricing is transparent and scoped individually — no surprise invoices.",
  },
  {
    question: "Are you based in New York City?",
    answer:
      "Our headquarters are in Hopatcong, New Jersey. We serve NYC businesses through a remote-first workflow — most web development work does not require physical proximity. For discovery meetings, project kickoffs, or on-site needs, we are available throughout Manhattan and the boroughs.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Starter websites typically launch in 2–4 weeks. Robust builds take 4–8 weeks. Ecommerce and custom web applications range from 8–16 weeks depending on complexity. We provide a detailed timeline during the scoping phase.",
  },
  {
    question:
      "Can you build ecommerce websites for NYC-based retail businesses?",
    answer:
      "Yes — ecommerce is one of our core capabilities. We build on Shopify, BigCommerce, and WooCommerce, handling everything from product catalog architecture to checkout optimization, payment gateway configuration, and inventory management.",
  },
  {
    question: "Do you offer ongoing website maintenance?",
    answer:
      "Yes. Maintenance plans start at $125/month and include content updates, security patches, performance monitoring, and priority support. Higher tiers include SEO Autopilot management and monthly reporting.",
  },
  {
    question: "Will my website rank well in NYC searches?",
    answer:
      "Every website we build includes technical SEO configuration — metadata, structured data, sitemap generation, and Core Web Vitals optimization. NYC is a competitive market, and our SEO Autopilot platform provides ongoing optimization to help you build visibility over time.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Design & Development NYC",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "95 Main Street",
      addressLocality: "Hopatcong",
      addressRegion: "NJ",
      postalCode: "07843",
      addressCountry: "US",
    },
  },
  serviceType: "Web Design and Development",
  areaServed: {
    "@type": "City",
    name: "New York",
    containedInPlace: { "@type": "State", name: "New York" },
  },
  description:
    "Professional web design and development services for New York City businesses. Business websites, ecommerce stores, and custom web applications.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "2500",
    highPrice: "50000",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://seedtechllc.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Locations",
      item: "https://seedtechllc.com/locations",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "NYC Web Design",
      item: "https://seedtechllc.com/locations/nyc-web-design",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function NYCWebDesignPage() {
  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-light-base/30 flex items-center gap-1.5"
          >
            <Link
              href="/"
              className="hover:text-light-base/50 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/services/web-development"
              className="hover:text-light-base/50 transition-colors"
            >
              Web Development
            </Link>
            <span>/</span>
            <span className="text-light-base/60">New York City</span>
          </nav>
        </div>
      </div>

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb
          color="seed"
          size="xl"
          className="-top-40 right-0 opacity-20"
        />
        <GradientOrb
          color="blue"
          size="lg"
          className="bottom-10 -left-20 opacity-15"
        />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="seed" className="mb-6">
            <MapPin className="w-3.5 h-3.5 mr-1.5" /> New York City
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Web Design &amp; Development for NYC Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              New York City is the most competitive business environment in the
              country — your website needs to match. SeedTech builds modern
              websites, ecommerce stores, and custom web applications for NYC
              businesses that demand performance, speed, and measurable results.
            </p>
            <p>
              From fast-launch business sites starting at $2,500 to full-stack
              custom platforms, every project ships with our SEO Autopilot
              platform built in — so your investment starts generating organic
              traffic from day one.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <QuoteButton
              service="web-development"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              <PhoneCall className="h-4 w-4" /> (914) 362-8889
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Services ═══ */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What We Build"
          title="Web Development Services for New York City"
          description="Websites, ecommerce, and custom web applications — built for the speed and competition of the NYC market."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                  <s.icon className="h-5 w-5 text-seed-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-seed-600">
                  {s.price}
                </span>
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">
                {s.title}
              </h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Why SeedTech ═══ */}
      <Section>
        <SectionHeader
          eyebrow="Why SeedTech"
          title="A Web Development Agency Built for NYC Competition"
          description="We don't just build websites — we build digital assets designed to compete in the most demanding market in the country."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUs.map((item) => (
            <LiquidGlassCard key={item.title} className="p-7">
              <IconBox icon={item.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{item.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">
                {item.body}
              </Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ Industries ═══ */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Web Design for NYC Industries"
          description="We build for the industries that drive New York — finance, legal, media, healthcare, startups, and professional services."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-seed-50">
                <b.icon className="h-5 w-5 text-seed-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">
                {b.title}
              </h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Pricing snapshot ═══ */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Pricing"
            title="Transparent Web Development Pricing"
            description="No hidden fees, no surprise invoices. Every project is scoped individually."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: "Starter Website",
                price: "$2,500",
                desc: "5-page business website on the SeedTech Platform",
                href: "/services/seedtech-platform",
              },
              {
                name: "Robust Build",
                price: "$7,800",
                desc: "8–15 page custom site with advanced layouts",
                href: "/services/seedtech-platform",
              },
              {
                name: "Ecommerce Store",
                price: "$15,000+",
                desc: "Full ecommerce on Shopify, BigCommerce, or WooCommerce",
                href: "/services/ecommerce-development",
              },
              {
                name: "Custom Web App",
                price: "$10,000+",
                desc: "Dashboards, portals, SaaS products, internal tools",
                href: "/services/custom-development",
              },
            ].map((tier) => (
              <Link
                key={tier.name}
                href={tier.href}
                className="group liquid-glass liquid-glass-hover rounded-2xl p-6 flex flex-col"
              >
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
                  Starting at
                </p>
                <p className="font-display text-subheading text-seed-400 mb-1">
                  {tier.price}
                </p>
                <h3 className="font-display text-lg text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-body-sm text-light-base/45 leading-relaxed">
                  {tier.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-seed-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ Service Areas ═══ */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedH2 className="mb-6 font-display text-heading text-dark-base md:text-heading-lg">
            Serving All of New York City
          </AnimatedH2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            We build websites for businesses throughout NYC and the surrounding
            metro area.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Manhattan",
              "Brooklyn",
              "Queens",
              "Bronx",
              "Staten Island",
              "Midtown",
              "Financial District",
              "SoHo",
              "Tribeca",
              "Chelsea",
              "Williamsburg",
              "Jersey City",
              "Hoboken",
              "Long Island City",
            ].map((loc) => (
              <span
                key={loc}
                className="inline-block rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium text-dark-base/60 shadow-sm"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <TrustedBySection />

      {/* ═══ FAQ ═══ */}
      <Section>
        <SectionHeader
          title="NYC Web Design — Frequently Asked Questions"
          align="left"
        />
        <div className="max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      {/* ═══ Related Pages ═══ */}
      <Section theme="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-dark-base">
            Related Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/services/web-development"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Web Development Services →
              </h3>
              <p className="text-body-sm text-dark-base/50">
                Full overview of our web development capabilities.
              </p>
            </Link>
            <Link
              href="/locations/manhattan-it-support"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Manhattan IT Support →
              </h3>
              <p className="text-body-sm text-dark-base/50">
                Managed IT services for Manhattan businesses.
              </p>
            </Link>
            <Link
              href="/services/ecommerce-development"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Ecommerce Development →
              </h3>
              <p className="text-body-sm text-dark-base/50">
                Shopify, BigCommerce, and custom storefronts.
              </p>
            </Link>
            <Link
              href="/free-audit"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Free Website Audit →
              </h3>
              <p className="text-body-sm text-dark-base/50">
                See how your current website performs.
              </p>
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section>
        <CTABanner
          title="Need a Website for Your NYC Business?"
          description="Get a free quote for your web design or development project. We will scope your requirements, provide transparent pricing, and give you a realistic timeline."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
