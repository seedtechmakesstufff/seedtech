export type Department = "web-development" | "it-support";

export interface Project {
  slug: string;
  department: Department;
  client: string;
  title: string;
  tagline: string;
  description: string;
  url?: string;
  image?: string;
  /** Optional Vimeo or YouTube embed URL to show in the Screenshots section */
  videoUrl?: string;
  techStack: string[];
  tags: string[];
  highlights: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  /* ── Web Development ─────────────────────────────────── */
  {
    slug: "paddlers-cove",
    department: "web-development",
    client: "PaddlersCove",
    title: "BigCommerce Storefront & Custom Inventory Platform",
    tagline: "A fully custom ecommerce experience with a proprietary inventory management system syncing BigCommerce and Square in real time.",
    description:
      "PaddlersCove is a specialty kayak retailer that needed far more than an off-the-shelf storefront. We built a heavily customized BigCommerce storefront on Stencil with a unique UX tailored to high-consideration outdoor equipment. Beyond the store, we engineered a custom product and inventory management platform built on Next.js that integrates both Square POS and BigCommerce via API — giving the team a single source of truth for stock levels, pricing, and orders across all channels.",
    url: "https://paddlerscove.com",
    image: "/img/use_case_card_paddlerscove_1x.webp",
    techStack: ["BigCommerce", "Stencil", "Next.js", "Square API", "Vercel", "REST APIs"],
    tags: ["Ecommerce", "Custom Platform", "API Integration", "Inventory Management"],
    highlights: [
      "Custom Stencil storefront with brand-specific UX patterns",
      "Proprietary inventory platform built on Next.js + Vercel",
      "Real-time sync between BigCommerce and Square POS",
      "Automated product updates eliminating manual data entry",
      "Mobile-optimized storefront increasing mobile conversions",
    ],
    featured: true,
  },
  {
    slug: "short-run-custom-boxes",
    department: "web-development",
    client: "Drew & Rogers / Short Run Custom Boxes",
    title: "Custom Packaging Ecommerce Website",
    tagline: "A full-featured ecommerce site for a specialty custom packaging manufacturer, designed for complex product configuration.",
    description:
      "Short Run Custom Boxes required a sophisticated ecommerce presence that could handle highly configurable custom packaging orders. We designed and built a modern, conversion-focused site allowing customers to specify dimensions, materials, quantities, and print options — all feeding into a streamlined quote and order workflow.",
    url: "https://www.shortruncustomboxes.com",
    image: "/img/use_case_card_shortruncustomboxes_1x.webp",
    techStack: ["WordPress", "WooCommerce", "Custom Plugins", "PHP", "JavaScript"],
    tags: ["Ecommerce", "Custom Configuration", "WordPress", "Manufacturing"],
    highlights: [
      "Complex product configurator for custom packaging specs",
      "Streamlined quote-to-order workflow reducing friction",
      "Custom WordPress plugins for manufacturing-specific logic",
      "SEO-optimized architecture for niche packaging keywords",
    ],
    featured: true,
  },
  {
    slug: "bright-imaginations",
    department: "web-development",
    client: "Bright Imaginations Prep",
    title: "Custom WordPress Website for Private School",
    tagline: "A fully custom WordPress build with a bespoke calendar feature for a growing private schooling institution.",
    description:
      "Bright Imaginations Prep was on an older platform that couldn't keep pace with their growing enrollment and evolving needs. The UI felt dated and wasn't competitive with other institutions in the space. We delivered a fully custom WordPress site with a modern, admin-friendly design that the team can manage day-to-day without developer involvement. A standout feature is the custom-built calendar system, giving parents and staff a clear, interactive view of school events, enrollment deadlines, and schedules.",
    url: "https://brightimaginationsprep.com",
    image: "/img/use_case_card_bright_imaginations_1x.webp",
    techStack: ["WordPress", "Custom Theme", "PHP", "JavaScript", "Custom Calendar"],
    tags: ["WordPress", "Education", "Custom Features", "UI Overhaul"],
    highlights: [
      "Full platform migration from legacy system to WordPress",
      "Modern UI redesign to stay competitive in the private school market",
      "Custom-built interactive calendar feature for events and scheduling",
      "Admin-friendly CMS allowing staff to manage content independently",
      "Performance-optimized for fast page loads across devices",
    ],
    featured: true,
  },
  {
    slug: "starcom-fiber",
    department: "web-development",
    client: "StarCom Fiber",
    title: "Complete Website Overhaul for Fiber Telecom Provider",
    tagline: "A full website overhaul with GSAP-powered animations for one of New Jersey's leading fiber telecommunications companies.",
    description:
      "StarCom Fiber is a large fiber telecommunications company based in New Jersey with offices in Florida. They needed a complete website overhaul and facelift to better represent their position as an industry leader. We built a fully custom WordPress site leveraging the GSAP animation library to create a polished, modern experience that sets them apart from competitors in the telecom space.",
    url: "https://starcomfiber.com",
    image: "/img/use_case_card_starcom_1x.webp",
    techStack: ["WordPress", "Custom Theme", "GSAP", "PHP", "JavaScript", "CSS"],
    tags: ["WordPress", "Telecommunications", "GSAP Animations", "Website Overhaul"],
    highlights: [
      "Complete website overhaul and rebrand",
      "GSAP-powered animations creating a premium, modern feel",
      "Service plan comparison and coverage area tooling",
      "Designed to position StarCom as an industry leader in fiber",
      "Responsive design optimized for residential and business customers",
    ],
    featured: true,
  },
  {
    slug: "megasafe",
    department: "web-development",
    client: "Megasafe",
    title: "Custom WooCommerce Store & Product Management App",
    tagline: "A fully re-engineered WooCommerce store with a custom quote plugin and a proprietary Next.js product management app.",
    description:
      "Megasafe needed a complete ecommerce overhaul — their existing site was unusable and couldn't scale. We re-engineered the entire platform on WordPress + WooCommerce with a fully custom theme and bespoke plugin implementations. A custom-built quote plugin lets customers easily submit product quotes directly on the site. We migrated their entire inventory catalog from the old platform to WordPress, giving the team full control over products and day-to-day operations. Beyond the store, we built a fully custom product management app on Next.js, Vercel, and Neon with REST APIs that ties directly into the website. The app lets the team create and manage products, take photos using the native camera with built-in image guides for perfect product shots, and receive instant notifications when new quotes are submitted through the website's quote plugin.",
    url: "https://megasafe.com",
    image: "/img/use_case_card_megasafe_1x.webp",
    techStack: ["WordPress", "WooCommerce", "Custom Plugins", "Next.js", "Vercel", "Neon", "REST API", "PHP"],
    tags: ["Ecommerce", "WordPress", "Mobile App", "Custom Plugins", "Platform Migration"],
    highlights: [
      "Full platform migration from legacy site to WooCommerce",
      "Custom quote plugin for streamlined product quoting",
      "Entire inventory catalog migrated and restructured",
      "Proprietary Next.js app with native camera and image guides",
      "Real-time quote notifications synced between site and app",
      "Custom admin workflows giving the team full product control",
    ],
    featured: true,
  },
  {
    slug: "imperia-nj",
    department: "web-development",
    client: "Imperia",
    title: "Custom WordPress Website with GSAP Animations",
    tagline: "A stunning, animation-rich WordPress build for a premier New Jersey wedding and event venue.",
    description:
      "Imperia is a premier wedding and event venue in New Jersey that wanted to modernize their online presence to match the elegance of their physical space. We built a fully custom WordPress site featuring rich GSAP-powered animations that create a sophisticated, immersive browsing experience. The result is a modern, visually striking site that appeals to couples and event planners looking for a high-end venue.",
    url: "https://imperianj.com",
    image: "/img/use_case_card_imperia_1x.webp",
    techStack: ["WordPress", "Custom Theme", "GSAP", "PHP", "JavaScript", "CSS"],
    tags: ["WordPress", "GSAP Animations", "Events & Hospitality", "Custom Theme"],
    highlights: [
      "Fully custom WordPress theme with premium design",
      "GSAP animation library for smooth, engaging interactions",
      "Modern UI overhaul reflecting the venue's upscale brand",
      "Optimized for mobile to capture on-the-go event planners",
      "SEO-structured for local wedding and event venue searches",
    ],
    featured: true,
  },
  {
    slug: "trevor-noah-back-to-abnormal",
    department: "web-development",
    client: "Trevor Noah — Back to Abnormal Tour",
    title: "Custom Tour Platform with Interactive Voting Map",
    tagline: "A comprehensive custom-built platform for Trevor Noah's global tour — featuring ticketing, an interactive voting map, and a full backend management system.",
    description:
      "This was an extremely comprehensive custom-built platform for Trevor Noah's Back to Abnormal world tour. The platform allowed fans to purchase tickets, vote for Trevor to tour their country, and explore a fully custom interactive map interface where users could hover over their country and cast a vote. A real-time tally displayed the top 10 most-voted countries, giving management teams direct insight into new potential markets to add to the tour. The platform included a massive backend system to manage tours, presale codes, votes, and customer engagement — all built on Next.js and deployed on Google Cloud servers.",
    image: "/img/use_case_card_trevor_noah_1x.webp",
    videoUrl: "https://player.vimeo.com/video/1173486304?autoplay=1&loop=1&muted=1&controls=0&background=1",
    techStack: ["Next.js", "Google Cloud", "Node.js", "REST APIs", "Interactive Maps", "Real-time Data"],
    tags: ["Entertainment", "Custom Platform", "Interactive Map", "Tour Management"],
    highlights: [
      "Custom interactive world map with country-level hover and voting",
      "Real-time top-10 leaderboard of most-voted countries",
      "Full ticketing and presale code management system",
      "Comprehensive backend for tour, presale, and customer management",
      "Built on Next.js and Google Cloud for global scale",
      "Data-driven market discovery for tour expansion decisions",
    ],
    featured: true,
  },
  {
    slug: "ron-white-tatersalad",
    department: "web-development",
    client: "Ron White / TaterSalad.com",
    title: "Complete Website Overhaul with Custom Presale System",
    tagline: "A full architecture overhaul for Ron White's official site — featuring custom presale code capabilities, interactive tour maps, and streamlined admin workflows.",
    description:
      "The Ron White team was experiencing a highly unreliable and clunky website causing major disruptions to their operations. We overhauled the entire architecture on WordPress, dramatically improving functionality, speed, and optimized workflows for admin users to better manage tours, shows, and content. A standout feature is the fully custom presale code system, allowing management to dynamically set presale codes by tour or by individual show — giving fans early access to purchase tickets. We also augmented the interactive tour map, enabling multi-show cards to appear per city so fans can easily browse all available tours and shows in their area.",
    url: "https://tatersalad.com",
    image: "/img/use_case_card_ron_white.webp",
    techStack: ["WordPress", "Custom Plugins", "PHP", "JavaScript", "Interactive Maps", "WooCommerce"],
    tags: ["Entertainment", "WordPress", "Custom Presale", "Tour Management"],
    highlights: [
      "Complete architecture overhaul resolving reliability issues",
      "Custom presale code system — dynamic codes by tour or show",
      "Interactive tour map with multi-show cards per city",
      "Streamlined admin workflows for tour and show management",
      "Significant performance and speed improvements",
      "Mobile-optimized for fans browsing on the go",
    ],
    featured: true,
  },
  {
    slug: "bioox",
    department: "web-development",
    client: "BioOx",
    title: "Custom WooCommerce Store for Biological Science Products",
    tagline: "A fully custom WooCommerce build with bespoke features for a biological science company selling oxygen-enriched water, air scrubbing systems, and plant growth solutions.",
    description:
      "BioOx is a biological science company pioneering ROX-based (Reserve Oxygen) technology across water, air, and soil applications. They needed an ecommerce platform that could sell highly specialized products — BioOxygen Water, the Reactor 85 MK II air scrubber, and BioOx Grow — while clearly communicating complex science to both consumer and commercial audiences. We built a fully custom WooCommerce store with tailored product pages, use-case-driven navigation for verticals like clinics, equestrian, aquatics, and agriculture, an affiliate registration system, and investor relations integration. The result is a conversion-focused platform that bridges hard science with accessible buying experiences.",
    url: "https://www.bioox.us",
    image: "/img/use_case_card_bioox.webp",
    techStack: ["WordPress", "WooCommerce", "Elementor", "Custom Features", "PHP", "JavaScript"],
    tags: ["Ecommerce", "Science & Biotech", "WooCommerce", "Custom Features"],
    highlights: [
      "Custom WooCommerce store for complex biological science products",
      "Use-case-driven navigation spanning clinics, equestrian, agriculture, and aquatics",
      "Tailored product pages communicating ROX science to consumer and commercial buyers",
      "Built-in affiliate registration and management system",
      "Investor relations section integrated directly into the platform",
      "Mobile-optimized storefront for a science-first buying experience",
    ],
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByDepartment(dept: Department): Project[] {
  return projects.filter((p) => p.department === dept);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export const departmentLabels: Record<Department, string> = {
  "web-development": "Web Development",
  "it-support": "IT Support",
};
