/**
 * Site Templates — reusable starter data for new site onboarding.
 *
 * Each template provides keywords, tasks, content ideas, and pages
 * that can be seeded into the DB during site creation.
 *
 * Templates are identified by a slug and registered in TEMPLATES map.
 */

/* ── Template Types ── */

export interface TemplateKeyword {
  keyword: string;
  tier: "tier1" | "tier2" | "tier3";
  volume: string;
  competition: string;
  intent: "transactional" | "commercial" | "informational" | "navigational";
  targetPage: string;
}

export interface TemplateTask {
  phase: number;
  title: string;
  status: "done" | "in-progress" | "not-started";
  priority: "critical" | "high" | "medium" | "low";
}

export interface TemplateContentIdea {
  title: string;
  targetKeyword: string;
  wordCount: number;
  funnelStage: string;
}

export interface TemplatePage {
  path: string;
  kind: string; // home, service, location, blog, landing, pricing
  title: string;
  source: "manual";
}

export interface SiteTemplate {
  slug: string;
  name: string;
  description: string;
  industry: string;
  keywords: TemplateKeyword[];
  tasks: TemplateTask[];
  contentIdeas: TemplateContentIdea[];
  pages: TemplatePage[];
}

/* ── MSP / IT Services Template ── */

const MSP_TEMPLATE: SiteTemplate = {
  slug: "msp",
  name: "Managed IT / MSP",
  description: "Managed IT services provider with helpdesk, cybersecurity, and cloud services.",
  industry: "IT Services",
  keywords: [
    // Tier 1
    { keyword: "managed IT services {region}", tier: "tier1", volume: "300–500", competition: "Medium-High", intent: "transactional", targetPage: "/services/managed-it" },
    { keyword: "IT support {region}", tier: "tier1", volume: "400–600", competition: "Medium", intent: "transactional", targetPage: "/services/managed-it" },
    { keyword: "IT support company {region}", tier: "tier1", volume: "200–350", competition: "Medium", intent: "transactional", targetPage: "/services/managed-it" },
    { keyword: "managed service provider {region}", tier: "tier1", volume: "150–250", competition: "Medium", intent: "transactional", targetPage: "/services/managed-it" },
    // Tier 2
    { keyword: "best managed IT services {region}", tier: "tier2", volume: "100–200", competition: "Medium", intent: "commercial", targetPage: "/services/managed-it" },
    { keyword: "small business IT support {region}", tier: "tier2", volume: "150–300", competition: "Low-Medium", intent: "commercial", targetPage: "/services/managed-it" },
    { keyword: "outsourced IT support {region}", tier: "tier2", volume: "100–200", competition: "Low-Medium", intent: "commercial", targetPage: "/services/managed-it" },
    { keyword: "IT support pricing", tier: "tier2", volume: "500–800", competition: "Medium", intent: "commercial", targetPage: "/pricing/it-support" },
    { keyword: "managed IT cost per user", tier: "tier2", volume: "200–400", competition: "Low-Medium", intent: "commercial", targetPage: "/pricing/it-support" },
    // Tier 3
    { keyword: "how much does managed IT cost", tier: "tier3", volume: "500–800", competition: "Low-Medium", intent: "informational", targetPage: "/blog" },
    { keyword: "break fix vs managed IT", tier: "tier3", volume: "300–500", competition: "Low", intent: "informational", targetPage: "/blog" },
    { keyword: "how to choose an MSP", tier: "tier3", volume: "200–400", competition: "Low", intent: "informational", targetPage: "/blog" },
    { keyword: "cybersecurity for small business {region}", tier: "tier3", volume: "100–200", competition: "Low", intent: "informational", targetPage: "/blog" },
    { keyword: "what is endpoint monitoring", tier: "tier3", volume: "100–300", competition: "Low", intent: "informational", targetPage: "/blog" },
  ],
  tasks: [
    { phase: 1, title: "Add metadata to every page", status: "not-started", priority: "critical" },
    { phase: 1, title: "Create sitemap.ts", status: "not-started", priority: "critical" },
    { phase: 1, title: "Create robots.ts", status: "not-started", priority: "critical" },
    { phase: 1, title: "Set up Google Search Console", status: "not-started", priority: "critical" },
    { phase: 1, title: "Set up Google Analytics 4", status: "not-started", priority: "critical" },
    { phase: 1, title: "Claim Google Business Profile", status: "not-started", priority: "critical" },
    { phase: 2, title: "Build /services/managed-it pillar (2k+ words)", status: "not-started", priority: "critical" },
    { phase: 2, title: "Add Service schema to service pages", status: "not-started", priority: "high" },
    { phase: 2, title: "Add FAQ schema to pricing pages", status: "not-started", priority: "high" },
    { phase: 2, title: "Add Organization + LocalBusiness schema to homepage", status: "not-started", priority: "high" },
    { phase: 3, title: "Build blog infrastructure", status: "not-started", priority: "critical" },
    { phase: 3, title: "Publish first 4 blog posts", status: "not-started", priority: "high" },
    { phase: 3, title: "Implement internal linking strategy", status: "not-started", priority: "high" },
  ],
  contentIdeas: [
    { title: "How Much Does Managed IT Cost in {year}?", targetKeyword: "how much does managed IT cost", wordCount: 2000, funnelStage: "Top → Mid" },
    { title: "Break-Fix vs. Managed IT: Which Is Right?", targetKeyword: "break fix vs managed IT", wordCount: 1800, funnelStage: "Mid" },
    { title: "7 Signs Your Business Needs IT Support", targetKeyword: "signs you need IT support", wordCount: 1500, funnelStage: "Top" },
    { title: "How to Choose a Managed Service Provider", targetKeyword: "how to choose an MSP", wordCount: 2000, funnelStage: "Mid" },
    { title: "Managed IT vs. In-House IT: A Cost Comparison", targetKeyword: "managed IT vs in-house IT", wordCount: 1800, funnelStage: "Mid" },
    { title: "What Does a Managed Service Provider Actually Do?", targetKeyword: "what does a managed service provider do", wordCount: 1500, funnelStage: "Top" },
    { title: "Cybersecurity Basics for Small Businesses", targetKeyword: "cybersecurity for small business", wordCount: 1500, funnelStage: "Top" },
    { title: "What Is Endpoint Monitoring?", targetKeyword: "what is endpoint monitoring", wordCount: 1200, funnelStage: "Top" },
  ],
  pages: [
    { path: "/", kind: "home", title: "Home", source: "manual" },
    { path: "/services/managed-it", kind: "service", title: "Managed IT Services", source: "manual" },
    { path: "/services/cybersecurity", kind: "service", title: "Cybersecurity", source: "manual" },
    { path: "/services/cloud", kind: "service", title: "Cloud Services", source: "manual" },
    { path: "/pricing/it-support", kind: "pricing", title: "IT Support Pricing", source: "manual" },
    { path: "/about", kind: "landing", title: "About Us", source: "manual" },
    { path: "/contact", kind: "landing", title: "Contact", source: "manual" },
    { path: "/blog", kind: "blog", title: "Blog", source: "manual" },
  ],
};

/* ── Blank Template (no starter data) ── */

const BLANK_TEMPLATE: SiteTemplate = {
  slug: "blank",
  name: "Blank Site",
  description: "Start from scratch with no preset data.",
  industry: "Other",
  keywords: [],
  tasks: [
    { phase: 1, title: "Add metadata to every page", status: "not-started", priority: "critical" },
    { phase: 1, title: "Set up Google Search Console", status: "not-started", priority: "critical" },
    { phase: 1, title: "Set up Google Analytics 4", status: "not-started", priority: "critical" },
    { phase: 1, title: "Create sitemap.ts", status: "not-started", priority: "critical" },
  ],
  contentIdeas: [],
  pages: [
    { path: "/", kind: "home", title: "Home", source: "manual" },
  ],
};

/* ── Template Registry ── */

export const TEMPLATES: Record<string, SiteTemplate> = {
  msp: MSP_TEMPLATE,
  blank: BLANK_TEMPLATE,
};

export function getTemplate(slug: string): SiteTemplate | null {
  return TEMPLATES[slug] ?? null;
}

export function listTemplates(): { slug: string; name: string; description: string; industry: string }[] {
  return Object.values(TEMPLATES).map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    industry: t.industry,
  }));
}

/**
 * Apply template variable substitution.
 * Replaces {region} and {year} placeholders in keywords and content ideas.
 */
export function applyTemplateVars(
  template: SiteTemplate,
  vars: { region?: string; year?: string }
): SiteTemplate {
  const region = vars.region ?? "";
  const year = vars.year ?? new Date().getFullYear().toString();

  const sub = (s: string) =>
    s.replace(/\{region\}/g, region).replace(/\{year\}/g, year).trim();

  return {
    ...template,
    keywords: template.keywords.map((k) => ({
      ...k,
      keyword: sub(k.keyword),
    })),
    contentIdeas: template.contentIdeas.map((i) => ({
      ...i,
      title: sub(i.title),
      targetKeyword: sub(i.targetKeyword),
    })),
  };
}
