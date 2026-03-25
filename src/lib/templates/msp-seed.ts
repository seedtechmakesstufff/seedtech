/* ── SEO Strategy Data ──
 * This file serves as the single source of truth for the SEO dashboard.
 * It mirrors the strategy from SEO/AI_SEO_OPTIMIZATION.md and feeds
 * the admin SEO dashboard + AI blog generator.
 */

export interface TrackedKeyword {
  keyword: string;
  tier: 1 | 2 | 3;
  volume: string;
  competition: string;
  intent: "Transactional" | "Commercial" | "Informational" | "Navigational";
  targetPage: string;
  currentPosition: number | null; // null = not tracking yet
}

export interface SEOTask {
  id: string;
  phase: number;
  title: string;
  status: "done" | "in-progress" | "not-started";
  priority: "critical" | "high" | "medium" | "low";
}

export interface ContentIdea {
  id: string;
  title: string;
  targetKeyword: string;
  wordCount: number;
  funnelStage: string;
  status: "published" | "draft" | "scheduled" | "idea";
  slug?: string;
}

/* ── Tracked Keywords (from SEO strategy doc) ── */

export const TRACKED_KEYWORDS: TrackedKeyword[] = [
  // Tier 1 — Primary money keywords
  { keyword: "managed IT services NJ", tier: 1, volume: "300–500", competition: "Medium-High", intent: "Transactional", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "IT support Northern NJ", tier: 1, volume: "400–600", competition: "Medium", intent: "Transactional", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "IT support company NJ", tier: 1, volume: "200–350", competition: "Medium", intent: "Transactional", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "managed service provider NJ", tier: 1, volume: "150–250", competition: "Medium", intent: "Transactional", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "NJ IT services", tier: 1, volume: "200–400", competition: "Medium", intent: "Transactional", targetPage: "/services/managed-it", currentPosition: null },

  // Tier 2 — Secondary commercial
  { keyword: "best managed IT services NJ", tier: 2, volume: "100–200", competition: "Medium", intent: "Commercial", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "small business IT support NJ", tier: 2, volume: "150–300", competition: "Low-Medium", intent: "Commercial", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "outsourced IT support NJ", tier: 2, volume: "100–200", competition: "Low-Medium", intent: "Commercial", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "IT help desk NJ", tier: 2, volume: "100–150", competition: "Low", intent: "Commercial", targetPage: "/services/managed-it", currentPosition: null },
  { keyword: "IT support pricing", tier: 2, volume: "500–800", competition: "Medium", intent: "Commercial", targetPage: "/pricing/it-support", currentPosition: null },
  { keyword: "managed IT cost per user", tier: 2, volume: "200–400", competition: "Low-Medium", intent: "Commercial", targetPage: "/pricing/it-support", currentPosition: null },
  { keyword: "web development NJ", tier: 2, volume: "200–400", competition: "Medium", intent: "Transactional", targetPage: "/services/web-development", currentPosition: null },

  // Tier 3 — Long-tail / informational (blog targets)
  { keyword: "how much does managed IT cost", tier: 3, volume: "500–800", competition: "Low-Medium", intent: "Informational", targetPage: "/blog", currentPosition: null },
  { keyword: "break fix vs managed IT", tier: 3, volume: "300–500", competition: "Low", intent: "Informational", targetPage: "/blog", currentPosition: null },
  { keyword: "how to choose an MSP", tier: 3, volume: "200–400", competition: "Low", intent: "Informational", targetPage: "/blog", currentPosition: null },
  { keyword: "cybersecurity for small business NJ", tier: 3, volume: "100–200", competition: "Low", intent: "Informational", targetPage: "/blog", currentPosition: null },
  { keyword: "what is endpoint monitoring", tier: 3, volume: "100–300", competition: "Low", intent: "Informational", targetPage: "/blog", currentPosition: null },
  { keyword: "per user IT pricing", tier: 3, volume: "100–200", competition: "Low", intent: "Informational", targetPage: "/blog", currentPosition: null },
];

/* ── SEO Implementation Tasks (from strategy doc phases) ── */

export const SEO_TASKS: SEOTask[] = [
  // Phase 1 — Foundation
  { id: "p1-1", phase: 1, title: "Add metadata to every page", status: "not-started", priority: "critical" },
  { id: "p1-2", phase: 1, title: "Create sitemap.ts", status: "not-started", priority: "critical" },
  { id: "p1-3", phase: 1, title: "Create robots.ts", status: "not-started", priority: "critical" },
  { id: "p1-4", phase: 1, title: "Noindex /design-kit", status: "not-started", priority: "high" },
  { id: "p1-5", phase: 1, title: "Set up Google Search Console", status: "not-started", priority: "critical" },
  { id: "p1-6", phase: 1, title: "Set up Google Analytics 4", status: "not-started", priority: "critical" },
  { id: "p1-7", phase: 1, title: "Claim Google Business Profile", status: "not-started", priority: "critical" },

  // Phase 2 — Money Page
  { id: "p2-1", phase: 2, title: "Build /services/managed-it pillar (2k+ words)", status: "not-started", priority: "critical" },
  { id: "p2-2", phase: 2, title: "Add Service schema to managed-it", status: "not-started", priority: "high" },
  { id: "p2-3", phase: 2, title: "Add FAQ schema to /pricing/it-support", status: "not-started", priority: "high" },
  { id: "p2-4", phase: 2, title: "Add Organization + LocalBusiness schema to homepage", status: "not-started", priority: "high" },
  { id: "p2-5", phase: 2, title: "Create default OG image (1200×630)", status: "not-started", priority: "medium" },

  // Phase 3 — Content Engine
  { id: "p3-1", phase: 3, title: "Build blog infrastructure", status: "in-progress", priority: "critical" },
  { id: "p3-2", phase: 3, title: "Publish first 4 blog posts", status: "not-started", priority: "high" },
  { id: "p3-3", phase: 3, title: "Implement internal linking strategy", status: "not-started", priority: "high" },
  { id: "p3-4", phase: 3, title: "Add Article schema to blog posts", status: "not-started", priority: "medium" },
];

/* ── Blog Content Calendar (from strategy doc) ── */

export const CONTENT_CALENDAR: ContentIdea[] = [
  { id: "blog-1", title: "How Much Does Managed IT Cost in 2026?", targetKeyword: "how much does managed IT cost", wordCount: 2000, funnelStage: "Top → Mid", status: "idea" },
  { id: "blog-2", title: "Break-Fix vs. Managed IT: Which Is Right for Your Business?", targetKeyword: "break fix vs managed IT", wordCount: 1800, funnelStage: "Mid", status: "idea" },
  { id: "blog-3", title: "7 Signs Your Small Business Needs IT Support", targetKeyword: "signs you need IT support", wordCount: 1500, funnelStage: "Top", status: "idea" },
  { id: "blog-4", title: "How to Choose a Managed Service Provider (MSP)", targetKeyword: "how to choose an MSP", wordCount: 2000, funnelStage: "Mid", status: "idea" },
  { id: "blog-5", title: "Managed IT vs. In-House IT: A Cost Comparison", targetKeyword: "managed IT vs in-house IT", wordCount: 1800, funnelStage: "Mid", status: "idea" },
  { id: "blog-6", title: "IT Support for Small Business: What to Expect & What It Costs", targetKeyword: "IT support for small business cost", wordCount: 1800, funnelStage: "Top → Mid", status: "idea" },
  { id: "blog-7", title: "What Does a Managed Service Provider Actually Do?", targetKeyword: "what does a managed service provider do", wordCount: 1500, funnelStage: "Top", status: "idea" },
  { id: "blog-8", title: "Cybersecurity Basics for Small Businesses in New Jersey", targetKeyword: "cybersecurity for small business NJ", wordCount: 1500, funnelStage: "Top", status: "idea" },
  { id: "blog-9", title: "What Is Endpoint Monitoring (And Why Does Your Business Need It)?", targetKeyword: "what is endpoint monitoring", wordCount: 1200, funnelStage: "Top", status: "idea" },
  { id: "blog-10", title: "The IT Onboarding Checklist Every Growing Team Needs", targetKeyword: "IT onboarding checklist", wordCount: 1500, funnelStage: "Top", status: "idea" },
  { id: "blog-11", title: "Microsoft 365 Setup for Business: A Step-by-Step Guide", targetKeyword: "Microsoft 365 setup for business", wordCount: 1800, funnelStage: "Top", status: "idea" },
  { id: "blog-12", title: "Per-User IT Pricing Explained: Why It's Better for Small Business", targetKeyword: "per user IT pricing", wordCount: 1500, funnelStage: "Mid", status: "idea" },
];
