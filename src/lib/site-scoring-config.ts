/* ── Site-Specific Config Loader ──
 * Loads IndustryConfig, BusinessProfile, and Authors from the database
 * for use in scoring engines (AI Visibility, E-E-A-T, AIO).
 *
 * Replaces all hardcoded SeedTech-specific values (geography, credentials,
 * known entities, authors) with per-site database-driven values.
 */

import { prisma } from "@/lib/prisma";

/* ── Types ── */

export interface SiteScoringConfig {
  brandName: string;
  siteUrl: string;
  description: string;
  industry: string;
  // Geographic terms for local authority checks
  geographicTerms: string[];
  geographicRegex: RegExp | null;
  // Credential keywords for expertise checks
  credentialKeywords: string[];
  credentialRegex: RegExp | null;
  // Known entities for entity relationship checks
  knownEntities: string[];
  knownEntityRegex: RegExp | null;
  // Authority domains for outbound link checks
  authorityDomains: string[];
  // Authors for E-E-A-T attribution
  authors: SiteAuthor[];
  defaultAuthor: SiteAuthor | null;
  // Experience evidence for content enrichment
  evidence: SiteEvidence[];
}

export interface SiteAuthor {
  id: string;
  name: string;
  slug: string;
  jobTitle: string;
  bio: string;
  imageUrl: string | null;
  canonicalUrl: string;
  sameAs: string[];
  expertise: string[];
  credentials: string[];
  experience: string;
  isDefault: boolean;
}

export interface SiteEvidence {
  type: string;
  title: string;
  content: string;
  source: string | null;
  tags: string[];
}

/* ── Defaults (fallback when no DB config exists) ── */

const DEFAULT_CREDENTIAL_KEYWORDS = [
  "certified", "certification", "licensed", "accredited", "degree", "credential",
];

const DEFAULT_KNOWN_ENTITIES = [
  "Microsoft", "Google", "Amazon", "AWS", "Azure", "Cisco",
  "NIST", "CISA", "Apple", "Dell", "HP",
];

const DEFAULT_AUTHORITY_DOMAINS = [
  "gov", "edu", "microsoft.com", "google.com", "nist.gov", "cisa.gov",
];

/* ── Cache ── */

const configCache = new Map<string, { config: SiteScoringConfig; loadedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Build a regex from an array of terms, escaping special chars.
 * Returns null if the array is empty.
 */
function buildRegex(terms: string[]): RegExp | null {
  if (!terms.length) return null;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
}

/**
 * Load scoring configuration for a site.
 * Combines IndustryConfig + BusinessProfile + Authors into a single config
 * that the scoring engines can use instead of hardcoded values.
 *
 * Results are cached for 5 minutes.
 */
export async function loadSiteScoringConfig(siteId: string): Promise<SiteScoringConfig> {
  // Check cache
  const cached = configCache.get(siteId);
  if (cached && Date.now() - cached.loadedAt < CACHE_TTL_MS) {
    return cached.config;
  }

  // Load from DB in parallel
  const [site, industryConfig, authors, evidence] = await Promise.all([
    prisma.site.findUnique({
      where: { id: siteId },
      include: { businessProfile: true },
    }),
    prisma.industryConfig.findUnique({ where: { siteId } }),
    prisma.author.findMany({
      where: { siteId },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    }),
    prisma.experienceEvidence.findMany({
      where: { siteId, isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const bp = site?.businessProfile;

  // Build geographic terms from IndustryConfig + BusinessProfile
  const geoTerms = [
    ...(industryConfig?.geographicTerms || []),
    ...(bp?.location ? [bp.location] : []),
  ].filter(Boolean);

  // Build credential keywords
  const credKeywords = industryConfig?.credentialKeywords?.length
    ? industryConfig.credentialKeywords
    : DEFAULT_CREDENTIAL_KEYWORDS;

  // Build known entities
  const entities = industryConfig?.knownEntities?.length
    ? industryConfig.knownEntities
    : DEFAULT_KNOWN_ENTITIES;

  // Build authority domains
  const authDomains = industryConfig?.authorityDomains?.length
    ? industryConfig.authorityDomains
    : DEFAULT_AUTHORITY_DOMAINS;

  const siteAuthors: SiteAuthor[] = authors.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    jobTitle: a.jobTitle,
    bio: a.bio,
    imageUrl: a.imageUrl,
    canonicalUrl: a.canonicalUrl,
    sameAs: a.sameAs,
    expertise: a.expertise,
    credentials: a.credentials,
    experience: a.experience,
    isDefault: a.isDefault,
  }));

  const siteEvidence: SiteEvidence[] = evidence.map((e) => ({
    type: e.type,
    title: e.title,
    content: e.content,
    source: e.source,
    tags: e.tags,
  }));

  const config: SiteScoringConfig = {
    brandName: bp?.companyName || site?.name || "Company",
    siteUrl: site?.domain ? `https://${site.domain}` : "",
    description: bp?.tagline || "",
    industry: industryConfig?.industry || "general",
    geographicTerms: geoTerms,
    geographicRegex: buildRegex(geoTerms),
    credentialKeywords: credKeywords,
    credentialRegex: buildRegex(credKeywords),
    knownEntities: entities,
    knownEntityRegex: buildRegex(entities),
    authorityDomains: authDomains,
    authors: siteAuthors,
    defaultAuthor: siteAuthors.find((a) => a.isDefault) || siteAuthors[0] || null,
    evidence: siteEvidence,
  };

  // Cache it
  configCache.set(siteId, { config, loadedAt: Date.now() });
  return config;
}

/**
 * Invalidate the cache for a site (call after updating config/authors/evidence).
 */
export function invalidateSiteScoringConfig(siteId: string): void {
  configCache.delete(siteId);
}

/**
 * Get the current year dynamically (replaces hardcoded year patterns).
 */
export function getCurrentYearRange(): string {
  const year = new Date().getFullYear();
  return `${year - 1}|${year}|${year + 1}`;
}

/**
 * Build a freshness regex for dynamic year checking.
 */
export function buildFreshnessRegex(): RegExp {
  return new RegExp(`\\b(${getCurrentYearRange()})\\b`);
}
