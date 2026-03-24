import {
  Target,
  Wrench,
  Lightbulb,
  CheckCircle2,
  ShoppingCart,
  Users,
} from "lucide-react";

export const biooxData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "Complex Science Products Without a Proper Sales Platform",
    body: "BioOx had a growing product line spanning oxygen-enriched water, industrial air scrubbers, and agricultural growth solutions — but no ecommerce platform capable of handling the complexity. Their existing site couldn't communicate the science behind ROX technology in a way that converted visitors into buyers, and lacked the infrastructure for affiliate programs, investor relations, and vertical-specific use cases across healthcare, equestrian, aquatics, and agriculture.",
  },
  solution: {
    headline: "Custom WooCommerce Store Built for Science-Driven Commerce",
    body: "We built a fully custom WooCommerce store with tailored product pages that bridge complex biological science with accessible buying experiences. Use-case-driven navigation guides visitors from clinics, stables, gyms, and farms directly to the products that solve their problems. We integrated an affiliate registration and management system, an investor relations section, and custom features throughout — all on a platform the BioOx team can manage day-to-day.",
  },

  /* ── Screenshots ────────────────────────────────────────── */
  mainScreenshot: "/img/bioox/bioox_1600x900_2_1_5x.webp",

  /* ── Additional images used in sidebar ──────────────────── */
  sidebarImage: "/img/bioox/bioox_700x700_1_1_5x.webp",

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "8 weeks",
  teamSize: "2 people",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "6+", label: "Vertical Use-Case Pages" },
    { value: "3", label: "Product Lines Launched" },
    { value: "100%", label: "Self-Manageable by Client" },
    { value: "8wk", label: "Discovery to Launch" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Target,
      title: "Custom WooCommerce Storefront",
      body: "A fully tailored WordPress + WooCommerce store designed around BioOx's unique product catalog — oxygen water, air scrubbers, and agricultural solutions — with custom product pages built to communicate complex science clearly.",
    },
    {
      icon: Wrench,
      title: "Use-Case Navigation System",
      body: "Vertical-specific landing pages for clinics, equestrian stables, aquatic centers, gyms, agriculture, and industrial facilities — routing each audience directly to their relevant products and proof points.",
    },
    {
      icon: ShoppingCart,
      title: "Custom Product Configurator",
      body: "Tailored product pages with rich science-backed content, comparison data, and clear CTAs designed to convert both individual consumers and commercial buyers.",
    },
    {
      icon: Users,
      title: "Affiliate Registration System",
      body: "A built-in affiliate program with registration, login, and management workflows — allowing BioOx to scale their sales reach through partner networks.",
    },
    {
      icon: Lightbulb,
      title: "Investor Relations Integration",
      body: "A dedicated investor relations section integrated directly into the platform, giving stakeholders and potential investors easy access to company information and updates.",
    },
    {
      icon: CheckCircle2,
      title: "Mobile-Optimized Experience",
      body: "A responsive, performance-tuned storefront ensuring the science-heavy content and product pages load fast and read cleanly on every device size.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Product Mapping",
      description:
        "We mapped BioOx's full product line, target verticals, and the science behind ROX technology to define the information architecture. We identified the key buyer personas — consumers, commercial operators, affiliates, and investors — and scoped the features each audience needed.",
    },
    {
      step: "02",
      title: "Design & Architecture",
      description:
        "We designed a use-case-driven navigation structure and product page templates that translate complex biological science into clear, conversion-focused layouts. WooCommerce was configured with the custom fields and taxonomy needed for BioOx's diverse catalog.",
    },
    {
      step: "03",
      title: "Build & Customize",
      description:
        "Custom WooCommerce development ran in focused sprints — product pages, affiliate system, investor section, and vertical landing pages were built and reviewed iteratively. Custom features were implemented to handle BioOx's unique requirements beyond standard WooCommerce.",
    },
    {
      step: "04",
      title: "Launch & Handoff",
      description:
        "We launched the full platform, configured analytics and conversion tracking, and walked the BioOx team through every admin workflow. The site is fully self-manageable — the team handles products, content, and affiliates independently.",
    },
  ],
};
