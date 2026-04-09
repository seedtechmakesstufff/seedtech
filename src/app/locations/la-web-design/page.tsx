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
  Film,
  Briefcase,
  Building2,
  ShoppingBag,
  Cpu,
  Stethoscope,
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
    "Web Development Los Angeles | SeedTech — Web Design Company LA",
  description:
    "SeedTech builds modern websites, ecommerce stores, and custom web applications for Los Angeles businesses. Starting at $2,500. Call (914) 362-8889.",
  alternates: { canonical: "/locations/la-web-design" },
  openGraph: {
    title: "Los Angeles Web Design & Development — SeedTech",
    description:
      "Web development agency serving Los Angeles businesses. Modern websites, ecommerce, and custom web apps from SeedTech.",
    images: [
      {
        url: "/og-image-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Los Angeles Web Design — SeedTech",
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
    body: "High-performance websites on the SeedTech Platform with built-in SEO, responsive design, and modern infrastructure. Designed for LA's service businesses, agencies, and growing companies.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Development",
    price: "From $15,000",
    body: "Custom ecommerce stores on Shopify, BigCommerce, and WooCommerce. From product catalog architecture to checkout optimization — built for LA's retail and D2C brands.",
  },
  {
    icon: SquareTerminal,
    title: "Custom Web Applications",
    price: "From $10,000",
    body: "SaaS products, booking platforms, membership portals, dashboards, and internal tools — built from scratch for the specific needs of your Los Angeles business.",
  },
  {
    icon: Palette,
    title: "Website Redesign",
    price: "Varies",
    body: "Your LA competitors are upgrading. We redesign and rebuild websites on modern infrastructure — preserving SEO equity while transforming the user experience.",
  },
];

const whyUs = [
  {
    icon: Code,
    title: "Modern tech stack",
    body: "Next.js, React, and Tailwind CSS — the same technologies used by the companies defining LA's tech scene. Your site loads fast, ranks well, and scales with your business.",
  },
  {
    icon: Search,
    title: "SEO built in from day one",
    body: "Every website ships with SEO Autopilot — our proprietary platform handling technical SEO, content optimization, and rank tracking. Essential for competing in the LA search landscape.",
  },
  {
    icon: Globe,
    title: "Remote-first, LA-serving",
    body: "Web development does not require geographic proximity. We deliver the same quality to Los Angeles that we do to our NJ and NYC clients — with timezone-flexible communication.",
  },
  {
    icon: LineChart,
    title: "Results you can measure",
    body: "Google Analytics, Search Console integration, conversion tracking, and monthly reporting. You see exactly what your website investment is delivering.",
  },
  {
    icon: Wrench,
    title: "Ongoing maintenance available",
    body: "Post-launch maintenance plans from $125/month. Content updates, security patches, performance monitoring, and priority support to keep your site competitive.",
  },
  {
    icon: MapPin,
    title: "East Coast efficiency, West Coast reach",
    body: "Headquartered in New Jersey. Our remote-first workflow means you get enterprise-quality development at rates that are more competitive than most LA agencies.",
  },
];

const industries = [
  {
    icon: Film,
    title: "Entertainment & media",
    body: "LA is the entertainment capital. We build portfolio sites, promotional platforms, artist pages, and media-rich experiences for production companies, talent, and agencies.",
  },
  {
    icon: Cpu,
    title: "Tech & SaaS",
    body: "Marketing sites, landing pages, product demos, and MVPs for LA's tech companies. Built on the same stack the best SaaS companies use — fast, scalable, conversion-optimized.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & D2C brands",
    body: "Ecommerce stores for LA's retail scene — from boutique fashion brands to high-volume consumer products. Shopify, BigCommerce, and custom storefronts.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare & wellness",
    body: "Medical practices, wellness brands, and health tech companies throughout LA. Patient portals, appointment booking, and clean, trustworthy design.",
  },
  {
    icon: Building2,
    title: "Real estate",
    body: "Property listing integrations, IDX search, and lead-generation websites for LA real estate agents, brokers, and property management companies.",
  },
  {
    icon: Briefcase,
    title: "Professional services",
    body: "Accounting firms, consultancies, law firms, and advisory businesses in Los Angeles. Websites designed to communicate expertise and convert prospects.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How much does a website cost for an LA business?",
    answer:
      "Starter websites begin at $2,500 for a professional 5-page site on the SeedTech Platform. Robust builds run around $7,800. Ecommerce starts at $15,000, and custom web applications start at $10,000+. Every project is scoped individually with transparent pricing.",
  },
  {
    question: "Are you based in Los Angeles?",
    answer:
      "No — our headquarters are in Hopatcong, New Jersey. We serve Los Angeles businesses through a remote-first workflow. Web development does not require physical proximity, and our East Coast location means you often get faster turnaround since we start working before your day begins.",
  },
  {
    question: "How do you work with clients in a different timezone?",
    answer:
      "We have flexible scheduling — project kickoffs, check-ins, and review sessions are scheduled during overlapping business hours (typically 9am–3pm PT / 12pm–6pm ET). Day-to-day communication happens asynchronously via Slack, email, and shared project boards.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Starter websites typically launch in 2–4 weeks. Robust builds take 4–8 weeks. Ecommerce and custom web applications range from 8–16 weeks depending on complexity. We provide a detailed timeline during the scoping phase.",
  },
  {
    question: "Can you build ecommerce for LA-based retail brands?",
    answer:
      "Yes — ecommerce is one of our core capabilities. We build on Shopify, BigCommerce, and WooCommerce, handling product catalog architecture, checkout optimization, payment gateways, shipping integration, and inventory management.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes. Maintenance plans start at $125/month and include content updates, security patches, performance monitoring, and priority support. Higher tiers include SEO Autopilot management and monthly reporting.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Design & Development Los Angeles",
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
    name: "Los Angeles",
    containedInPlace: { "@type": "State", name: "California" },
  },
  description:
    "Professional web design and development services for Los Angeles businesses. Business websites, ecommerce stores, and custom web applications.",
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
      name: "Los Angeles Web Design",
      item: "https://seedtechllc.com/locations/la-web-design",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function LAWebDesignPage() {
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
            <span className="text-light-base/60">Los Angeles</span>
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
            <MapPin className="w-3.5 h-3.5 mr-1.5" /> Los Angeles, CA
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Web Development for Los Angeles Businesses
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Los Angeles businesses operate at scale — your website needs to
              match. SeedTech builds modern websites, ecommerce stores, and
              custom web applications for LA companies that need performance,
              design quality, and measurable ROI from their digital presence.
            </p>
            <p>
              From starter business websites at $2,500 to custom platforms, every
              project ships with our SEO Autopilot system built in — giving your
              LA business an organic traffic engine from day one.
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
          title="Web Development Services for Los Angeles"
          description="Websites, ecommerce, and custom applications — built for businesses competing in the LA market."
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
          title="Enterprise-Quality Web Development at Competitive Rates"
          description="You get the same technology and quality that top LA agencies charge a premium for — without the overhead."
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
          title="Web Design for Los Angeles Industries"
          description="We build for the industries that define LA — entertainment, tech, retail, healthcare, real estate, and professional services."
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
            description="No hidden fees, no bloated LA agency markups. Every project is scoped individually."
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
            Serving All of Greater Los Angeles
          </AnimatedH2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            We build websites for businesses throughout the LA metro area and
            across Southern California.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Downtown LA",
              "Santa Monica",
              "Beverly Hills",
              "West Hollywood",
              "Venice",
              "Burbank",
              "Pasadena",
              "Glendale",
              "Long Beach",
              "Culver City",
              "Marina del Rey",
              "Hollywood",
              "Silver Lake",
              "Orange County",
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
          title="LA Web Design — Frequently Asked Questions"
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
              href="/services/custom-development"
              className="group rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight hover:shadow-lg transition-shadow"
            >
              <h3 className="font-display text-card-title text-dark-base mb-1 group-hover:text-seed-600 transition-colors">
                Custom Development →
              </h3>
              <p className="text-body-sm text-dark-base/50">
                SaaS, portals, internal tools, and web apps.
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
          title="Need a Website for Your LA Business?"
          description="Get a free quote for your web design or development project. Transparent pricing, realistic timelines, and modern technology — no LA agency markup."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
