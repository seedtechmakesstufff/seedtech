export type Department = "web-development" | "it-support";

export interface Project {
  slug: string;
  department: Department;
  client: string;
  title: string;
  tagline: string;
  description: string;
  url?: string;
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
    client: "Paddlers Cove",
    title: "BigCommerce Storefront & Custom Inventory Platform",
    tagline: "A fully custom ecommerce experience with a proprietary inventory management system syncing BigCommerce and Square in real time.",
    description:
      "Paddlers Cove is a specialty kayak retailer that needed far more than an off-the-shelf storefront. We built a heavily customized BigCommerce storefront on Stencil with a unique UX tailored to high-consideration outdoor equipment. Beyond the store, we engineered a custom product and inventory management platform built on Next.js that integrates both Square POS and BigCommerce via API — giving the team a single source of truth for stock levels, pricing, and orders across all channels.",
    url: "https://paddlerscove.com",
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
    client: "Bright Imaginations Learning",
    title: "Custom WordPress Website with Plugins & Integrations",
    tagline: "A purpose-built educational platform with custom WordPress development, plugins, and third-party integrations.",
    description:
      "Bright Imaginations Learning needed a website that could handle their educational content, enrollment flows, and third-party service integrations all in one cohesive platform. We built a fully custom WordPress site with bespoke plugins handling enrollment logic and custom API integrations connecting their scheduling and payment systems.",
    url: "https://www.brightimaginationslearning.com",
    techStack: ["WordPress", "Custom Plugins", "PHP", "REST APIs", "JavaScript"],
    tags: ["WordPress", "Custom Plugins", "Education", "Integrations"],
    highlights: [
      "Fully custom WordPress theme built from scratch",
      "Bespoke enrollment and scheduling plugin",
      "Third-party API integrations for payments and scheduling",
      "Performance-optimized for fast page loads",
    ],
  },
  {
    slug: "star-communications",
    department: "web-development",
    client: "Star Communications / Starcom Fiber",
    title: "Custom ISP & Fiber Services Website",
    tagline: "A clean, modern WordPress website for a regional fiber internet service provider.",
    description:
      "Starcom Fiber needed a professional web presence that clearly communicated their service plans, coverage areas, and support resources to residential and business customers. We delivered a fully custom WordPress build with a clean UI, intuitive plan comparison, and service availability tooling.",
    url: "https://starcomfiber.com",
    techStack: ["WordPress", "Custom Theme", "PHP", "JavaScript", "CSS"],
    tags: ["WordPress", "ISP", "Service Provider", "Custom Theme"],
    highlights: [
      "Custom WordPress theme designed to ISP industry standards",
      "Service plan comparison module",
      "Coverage area tooling for residential and business customers",
      "Accessibility-first build meeting WCAG AA",
    ],
  },
  {
    slug: "megasafe",
    department: "web-development",
    client: "Megasafe",
    title: "Ecommerce Website & Custom Mobile Management App",
    tagline: "A fully custom WordPress ecommerce build paired with a proprietary mobile product management app integrated directly into the store.",
    description:
      "Megasafe required a high-performance ecommerce site and an internal toolset to manage it efficiently. We built a custom WordPress + WooCommerce store with fully bespoke theme and plugin implementations, then engineered a custom mobile application that allows the team to manage products, inventory, and orders directly — with all changes syncing instantly to the WordPress backend.",
    url: "https://megasafe.com",
    techStack: ["WordPress", "WooCommerce", "Custom Plugins", "Mobile App", "REST API", "PHP"],
    tags: ["Ecommerce", "WordPress", "Mobile App", "Custom Plugins"],
    highlights: [
      "Fully custom WooCommerce implementation with bespoke plugins",
      "Proprietary mobile app for product and inventory management",
      "Real-time sync between mobile app and WordPress backend",
      "Custom admin workflows reducing product update time",
    ],
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
