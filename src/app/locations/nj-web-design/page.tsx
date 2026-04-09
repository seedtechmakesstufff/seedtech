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
  Gauge,
  Scale,
  HardHat,
  Stethoscope,
  Truck,
  Utensils,
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
    "Web Design Company in New Jersey | SeedTech — Website Development NJ",
  description:
    "SeedTech is a New Jersey web design and development company building business websites, ecommerce stores, and custom web applications. Starting at $2,500. Call (914) 362-8889.",
  alternates: { canonical: "/locations/nj-web-design" },
  openGraph: {
    title: "NJ Web Design & Development — SeedTech",
    description:
      "New Jersey web design company building modern websites, ecommerce platforms, and custom web apps. Starter sites from $2,500.",
    images: [
      {
        url: "/og-image-placeholder.png",
        width: 1200,
        height: 630,
        alt: "New Jersey Web Design — SeedTech",
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
    body: "Fast-launch websites on the SeedTech Platform with built-in SEO, responsive design, and a modern tech stack. Perfect for service businesses, professional firms, and growing companies across New Jersey.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Development",
    price: "From $15,000",
    body: "Custom ecommerce stores on Shopify, BigCommerce, and WooCommerce. Product catalog setup, secure checkout, payment gateway integration, and scalable architecture for NJ retailers and D2C brands.",
  },
  {
    icon: SquareTerminal,
    title: "Custom Web Applications",
    price: "From $10,000",
    body: "Dashboards, booking systems, membership platforms, SaaS products, and internal tools — built from scratch around how your New Jersey business actually operates.",
  },
  {
    icon: Palette,
    title: "Website Redesign",
    price: "Varies",
    body: "Outdated website hurting your brand? We redesign and rebuild on modern infrastructure — preserving your SEO equity with proper redirects and migration planning.",
  },
];

const whyUs = [
  {
    icon: Code,
    title: "Modern tech stack",
    body: "We build with Next.js, React, and Tailwind CSS — the same tools used by Vercel, Stripe, and Netflix. Your site loads fast, ranks well, and scales.",
  },
  {
    icon: Search,
    title: "SEO built in from day one",
    body: "Every SeedTech website ships with SEO Autopilot — our proprietary platform that handles technical SEO, content optimization, and rank tracking automatically.",
  },
  {
    icon: Gauge,
    title: "Performance-first",
    body: "Sub-second load times, 90+ Lighthouse scores, Core Web Vitals passing. Speed is not optional — it directly impacts your Google rankings and conversion rate.",
  },
  {
    icon: LineChart,
    title: "Results you can measure",
    body: "Google Analytics, Search Console integration, conversion tracking, and monthly reporting. You see exactly what your website investment is delivering.",
  },
  {
    icon: Wrench,
    title: "Ongoing maintenance available",
    body: "Post-launch maintenance plans from $125/month. Content updates, security patches, performance monitoring, and priority support — so your site stays current.",
  },
  {
    icon: MapPin,
    title: "Local to New Jersey",
    body: "Headquartered in Hopatcong, NJ. We work with businesses across Morris, Sussex, Passaic, Essex, Bergen, Union, and Somerset counties — and beyond.",
  },
];

const industries = [
  {
    icon: Scale,
    title: "Law firms",
    body: "Professional websites for NJ law firms — attorney profiles, practice area pages, secure contact forms, and content designed to build trust and generate consultations.",
  },
  {
    icon: HardHat,
    title: "Construction & trades",
    body: "Portfolio-driven websites for contractors, builders, and trade businesses across New Jersey. Project galleries, bid request forms, and service area pages.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare & dental",
    body: "HIPAA-conscious website design for medical practices, dental offices, and healthcare providers. Online booking, patient portals, and ADA-accessible layouts.",
  },
  {
    icon: Truck,
    title: "Trucking & logistics",
    body: "Driver application portals, fleet showcases, and lead-generation sites for trucking companies operating out of New Jersey.",
  },
  {
    icon: Utensils,
    title: "Restaurants & hospitality",
    body: "Menu-driven websites with online ordering integration, reservation systems, and location-specific landing pages for NJ restaurant groups.",
  },
  {
    icon: Briefcase,
    title: "Professional services",
    body: "Accounting firms, consultancies, financial advisors, and agencies — we build websites that communicate expertise and convert visitors into clients.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How much does a website cost in New Jersey?",
    answer:
      "Our starter websites begin at $2,500 for a clean, professional 5-page site on the SeedTech Platform. Robust builds with custom layouts run around $7,800. Ecommerce starts at $15,000, and custom web applications start at $10,000+. Every project is scoped individually based on your requirements.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Starter websites typically launch in 2–4 weeks. Robust builds and redesigns take 4–8 weeks. Ecommerce and custom web applications range from 8–16 weeks depending on complexity. We provide a detailed timeline during the scoping phase.",
  },
  {
    question: "Do you only work with businesses in New Jersey?",
    answer:
      "No — we work with businesses nationwide. But as a New Jersey-based company, we have deep roots in the NJ business community and serve a large number of local clients across Morris, Sussex, Passaic, Essex, Bergen, Union, and Somerset counties.",
  },
  {
    question: "Do you offer website maintenance after launch?",
    answer:
      "Yes. Maintenance plans start at $125/month and include content updates, security patches, performance monitoring, uptime monitoring, and priority support. Higher tiers include SEO Autopilot management and monthly reporting.",
  },
  {
    question: "Will my website be optimized for search engines?",
    answer:
      "Every website we build includes technical SEO configuration — proper metadata, structured data, sitemap generation, and Core Web Vitals optimization. Sites on the SeedTech Platform also include our SEO Autopilot system for ongoing rank tracking and content optimization.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. We handle full website redesigns including content migration, URL redirect mapping, SEO preservation, and modern UI/UX design. We audit your current site first to ensure nothing valuable is lost in the transition.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Design & Development New Jersey",
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
    "@type": "State",
    name: "New Jersey",
  },
  description:
    "Professional web design and development services for New Jersey businesses. Business websites, ecommerce stores, and custom web applications.",
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
      name: "New Jersey Web Design",
      item: "https://seedtechllc.com/locations/nj-web-design",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function NJWebDesignPage() {
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
            <span className="text-light-base/60">New Jersey</span>
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
            <MapPin className="w-3.5 h-3.5 mr-1.5" /> New Jersey
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Web Design &amp; Development Company in New Jersey
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              SeedTech is a New Jersey-based web design and development company
              building modern websites, ecommerce stores, and custom web
              applications for businesses across the state. From starter sites at
              $2,500 to full-stack custom platforms, we build digital products
              that are designed around your business — not forced into a
              template.
            </p>
            <p>
              Every website we build includes SEO Autopilot — our proprietary
              platform that handles technical SEO, content optimization, and rank
              tracking from day one. Your investment starts working for you the
              moment it launches.
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
          title="Web Development Services for New Jersey Businesses"
          description="From fast-launch business websites to full ecommerce and custom applications — every project is scoped around your goals and budget."
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
          title="What Sets Us Apart from Other NJ Web Design Companies"
          description="We are not a template shop. Every site is built on a modern tech stack with SEO, performance, and measurable results baked in."
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
          title="Web Design for New Jersey Industries"
          description="We build websites for the businesses that make New Jersey run — from law firms to construction companies to healthcare providers."
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
            description="No hidden fees, no surprises. Every project is scoped individually."
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
            Serving Businesses Across New Jersey
          </AnimatedH2>
          <p className="text-body-lg leading-relaxed text-dark-base/60 mb-8">
            Our headquarters are in Hopatcong, NJ. We work with businesses
            across the state — and nationwide.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Morris County",
              "Sussex County",
              "Passaic County",
              "Essex County",
              "Bergen County",
              "Union County",
              "Somerset County",
              "Warren County",
              "Hudson County",
              "Middlesex County",
              "Monmouth County",
              "Mercer County",
              "Camden County",
              "Atlantic County",
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
          title="NJ Web Design — Frequently Asked Questions"
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
          title="Ready to Build Your Website?"
          description="Get a free quote for your New Jersey web design or development project. We will scope your requirements, provide transparent pricing, and give you a realistic timeline."
          primaryLabel="Get a Free Quote"
          primaryHref="/contact"
          secondaryLabel="Call (914) 362-8889"
          secondaryHref="tel:+19143628889"
        />
      </Section>
    </div>
  );
}
