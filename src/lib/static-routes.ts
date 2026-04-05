/**
 * Single source of truth for all known static routes on the site.
 *
 * Used by:
 *  - /api/admin/seo/metadata              (GET — page list for Metadata tab)
 *  - /api/admin/seo/metadata/generate-all  (POST — bulk AI metadata generation)
 *  - /api/admin/seo/page-contexts          (GET — page list for Page Contexts)
 *  - /api/admin/seo/page-contexts/generate-all (POST — bulk AI context generation)
 *
 * When you add a new page to the site, add it here and it will appear
 * in all SEO Autopilot tabs automatically.
 */

export interface StaticRoute {
  path: string;
  kind: string;
}

export const STATIC_ROUTES: StaticRoute[] = [
  // ── Core pages ──
  { path: "/", kind: "page" },
  { path: "/about", kind: "page" },
  { path: "/contact", kind: "page" },
  { path: "/free-audit", kind: "landing" },

  // ── Services ──
  { path: "/services", kind: "page" },
  { path: "/services/managed-it", kind: "service" },
  { path: "/services/managed-it/plans", kind: "service" },
  { path: "/services/managed-it/assessment", kind: "service" },
  { path: "/services/managed-it/onboarding", kind: "service" },
  { path: "/services/managed-it/why-seedtech", kind: "service" },
  { path: "/services/managed-it/mobile-device-management", kind: "service" },
  { path: "/services/web-development", kind: "service" },
  { path: "/services/seedtech-platform", kind: "service" },
  { path: "/services/ecommerce-development", kind: "service" },
  { path: "/services/custom-development", kind: "service" },
  { path: "/services/seo-autopilot", kind: "service" },

  // ── Pricing ──
  { path: "/pricing/it-support", kind: "page" },
  { path: "/pricing/web-development", kind: "page" },

  // ── Industries ──
  { path: "/industries", kind: "page" },
  { path: "/industries/trucking", kind: "industry" },
  { path: "/industries/construction", kind: "industry" },
  { path: "/industries/law-firms", kind: "industry" },
  { path: "/industries/medical", kind: "industry" },

  // ── Content ──
  { path: "/blog", kind: "page" },
  { path: "/our-work", kind: "page" },
  { path: "/reviews", kind: "page" },

  // ── Legal ──
  { path: "/terms-conditions", kind: "page" },

  // ── SEO — Geo service pages ──
  { path: "/managed-it-services-new-jersey", kind: "landing" },
  { path: "/it-support-new-jersey", kind: "landing" },
  { path: "/emergency-it-support-new-jersey", kind: "landing" },
  { path: "/cybersecurity-services-new-jersey", kind: "landing" },
  { path: "/backup-disaster-recovery-new-jersey", kind: "landing" },
  { path: "/cloud-services-new-jersey", kind: "landing" },
  { path: "/server-down-help", kind: "landing" },
  { path: "/ransomware-response-new-jersey", kind: "landing" },

  // ── SEO — Location pages ──
  { path: "/locations/morristown-it-support", kind: "landing" },
  { path: "/locations/mendham-it-support", kind: "landing" },
  { path: "/locations/chester-it-support", kind: "landing" },
  { path: "/locations/bernardsville-it-support", kind: "landing" },
  { path: "/locations/basking-ridge-it-support", kind: "landing" },
  { path: "/locations/morris-county-it-support", kind: "landing" },
  { path: "/locations/somerset-county-it-support", kind: "landing" },
  { path: "/locations/essex-county-it-support", kind: "landing" },
  { path: "/locations/union-county-it-support", kind: "landing" },

  // ── SEO — Insights articles ──
  { path: "/insights/what-does-managed-it-cost-nj", kind: "article" },
  { path: "/insights/when-to-switch-it-provider", kind: "article" },
  { path: "/insights/what-does-an-msp-do", kind: "article" },
  { path: "/insights/signs-your-it-company-is-failing", kind: "article" },

  // ── SEO — Law firm vertical cluster ──
  { path: "/it-support-law-firms-new-jersey", kind: "landing" },
  { path: "/cybersecurity-law-firms-nj", kind: "landing" },
  { path: "/data-security-law-firms-nj", kind: "landing" },
  { path: "/it-compliance-law-firms-nj", kind: "landing" },

  // ── SEO — Data-driven service pages (Tier 6) ──
  { path: "/endpoint-security-new-jersey", kind: "landing" },
  { path: "/help-desk-services-new-jersey", kind: "landing" },
  { path: "/outsourced-it-support-new-jersey", kind: "landing" },
  { path: "/managed-service-provider-new-jersey", kind: "landing" },

  // ── SEO — Construction vertical ──
  { path: "/it-support-construction-companies-nj", kind: "landing" },

  // ── SEO — Healthcare / HIPAA vertical ──
  { path: "/hipaa-compliant-it-support-nj", kind: "landing" },
];
