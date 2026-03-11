import { Target, Wrench, Lightbulb, CheckCircle2, RefreshCw, Smartphone } from "lucide-react";

export const paddlersCoveData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "Inventory Chaos Across Two Sales Channels",
    body: "PaddlersCove was managing inventory across a BigCommerce online store and a Square POS system in their physical retail location — with no unified platform connecting the two. Stock counts were updated manually, pricing drifted between channels, and overselling was a recurring problem during peak season. Their existing BigCommerce theme was also generic and failed to reflect the premium, hands-on shopping experience the brand is known for.",
  },
  solution: {
    headline: "Custom Storefront + Proprietary Inventory Console",
    body: "We built a fully custom BigCommerce Stencil storefront designed around high-consideration outdoor gear purchases — rich product storytelling, guided category navigation, and a mobile-first experience. Then we engineered a proprietary inventory management console on Next.js that bridges BigCommerce and Square via their respective APIs, giving the PaddlersCove team a single dashboard to manage products, stock levels, pricing, and orders across every channel in real time.",
  },

  /* ── Screenshots ────────────────────────────────────────── */
  mainScreenshot: "/img/paddlerscove_api_console_dashboard.webp",

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "10 weeks",
  teamSize: "3 people",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "100%", label: "Inventory Accuracy" },
    { value: "2→1", label: "Dashboards Consolidated" },
    { value: "0", label: "Oversell Incidents Post-Launch" },
    { value: "10wk", label: "Discovery to Launch" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Target,
      title: "Custom Stencil Storefront",
      body: "A fully bespoke BigCommerce theme built on the Stencil framework — tailored to showcase high-consideration kayaks and outdoor gear with rich imagery, guided navigation, and conversion-focused product pages.",
    },
    {
      icon: Wrench,
      title: "Inventory Management Console",
      body: "A proprietary Next.js dashboard deployed on Vercel that serves as the single source of truth for all product data, stock levels, and pricing across BigCommerce and Square.",
    },
    {
      icon: RefreshCw,
      title: "BigCommerce ↔ Square API Bridge",
      body: "A custom REST integration layer that syncs inventory counts, product details, and pricing between the BigCommerce catalog and Square POS in real time — eliminating manual double-entry.",
    },
    {
      icon: Lightbulb,
      title: "Automated Sync Engine",
      body: "Scheduled and webhook-driven sync jobs that detect changes on either platform and propagate updates automatically — keeping every channel current without human intervention.",
    },
    {
      icon: Smartphone,
      title: "Mobile-Optimized Frontend",
      body: "A responsive, performance-tuned storefront delivering fast load times on mobile devices — critical for a customer base that frequently browses from docks, campgrounds, and on the road.",
    },
    {
      icon: CheckCircle2,
      title: "Product Management Dashboard",
      body: "A streamlined admin interface for the PaddlersCove team to create, edit, and bulk-update products from one place — with changes pushed to both BigCommerce and Square simultaneously.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Audit",
      description:
        "We audited PaddlersCove's existing BigCommerce store, Square POS setup, and manual inventory workflows. We mapped every pain point — overselling, pricing drift, duplicated data entry — and defined the scope for both the storefront rebuild and the custom console.",
    },
    {
      step: "02",
      title: "Architecture & Design",
      description:
        "We designed the Stencil storefront UX around high-consideration purchases: rich product pages, guided category flows, and trust-building elements. In parallel, we architected the inventory console's data model and API integration strategy with BigCommerce and Square.",
    },
    {
      step: "03",
      title: "Build & Integrate",
      description:
        "Development ran in two-week sprints. The Stencil theme was built alongside the Next.js console, with the API bridge connecting BigCommerce and Square tested against live sandbox data at every stage. Bi-weekly demos kept the client in the loop.",
    },
    {
      step: "04",
      title: "Launch & Handoff",
      description:
        "We ran a staged rollout — storefront first, then the inventory console with sync running in shadow mode before going live. The PaddlersCove team received a full walkthrough, documentation, and ongoing support to ensure confidence from day one.",
    },
  ],

  /* ── Testimonial ────────────────────────────────────────── */
  testimonial: {
    quote:
      "SeedTech didn't just build us a website — they built the system we needed to actually run our business without the constant fear of overselling or mismatched prices. The inventory console alone has saved us hours every week.",
    name: "PaddlersCove Team",
    role: "Owner",
  },
};
