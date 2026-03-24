/* ── E-E-A-T Signal Analyzer ──
 * Evaluates Experience, Expertise, Authoritativeness, and Trustworthiness
 * signals across pages and content. Used by the crawler, insights engine,
 * content scorer, and AI advisor.
 *
 * Google's March 2025 E-E-A-T update made these signals weighted more
 * heavily than traditional on-page factors for YMYL and service pages.
 */

import { JSDOM } from "jsdom";

/* ── Types ── */

export interface EEATSignal {
  category: "experience" | "expertise" | "authority" | "trust";
  signal: string;
  present: boolean;
  severity: "critical" | "warning" | "info" | "pass";
  message: string;
  recommendation?: string;
}

export interface EEATScore {
  overall: number; // 0-100
  experience: number;
  expertise: number;
  authority: number;
  trust: number;
  signals: EEATSignal[];
}

export interface AuthorEntity {
  name: string;
  slug: string;
  jobTitle: string;
  bio: string;
  image?: string;
  url: string; // canonical URL for this author (e.g. /about#sam)
  sameAs: string[]; // LinkedIn, GitHub, etc.
  expertise: string[]; // topics this author is qualified to write about
  experience: string; // years / background description
}

/* ── Default Authors (for SeedTech's own site) ── */

export const DEFAULT_AUTHORS: Record<string, AuthorEntity> = {
  seedtech: {
    name: "SeedTech",
    slug: "seedtech",
    jobTitle: "IT Services & Web Development",
    bio: "SeedTech provides managed IT services, cybersecurity solutions, and custom web development for small and mid-size businesses in Northern New Jersey.",
    url: "https://seedtechllc.com/about",
    sameAs: [],
    expertise: [
      "Managed IT Services",
      "Cybersecurity",
      "Web Development",
      "Cloud Computing",
      "IT Support",
    ],
    experience: "Professional IT services company serving Northern NJ businesses.",
  },
};

/**
 * Get an author entity by name. Falls back to the default "seedtech" entity.
 */
export function getAuthorEntity(authorName?: string): AuthorEntity {
  if (!authorName) return DEFAULT_AUTHORS.seedtech;
  const slug = authorName.toLowerCase().replace(/\s+/g, "-");
  return DEFAULT_AUTHORS[slug] || {
    ...DEFAULT_AUTHORS.seedtech,
    name: authorName,
    slug,
  };
}

/* ── Page-Level E-E-A-T Audit ── */

/**
 * Audit a page's HTML for E-E-A-T signals.
 * This checks for author info, trust signals, expertise markers, etc.
 */
export function auditEEAT(url: string, dom: JSDOM): EEATScore {
  const doc = dom.window.document;
  const signals: EEATSignal[] = [];
  const path = new URL(url).pathname;

  // ── EXPERIENCE signals ──

  // 1. First-person experience markers in content
  const bodyText = (doc.querySelector("main") || doc.querySelector("body"))?.textContent || "";
  const experienceMarkers = [
    /\bwe('ve| have) (worked|built|helped|managed|deployed|implemented)\b/i,
    /\bin our experience\b/i,
    /\bwe've seen\b/i,
    /\bour (team|clients|customers)\b/i,
    /\byears of experience\b/i,
    /\bcase stud(y|ies)\b/i,
    /\breal[- ]world example/i,
  ];
  const hasExperienceMarkers = experienceMarkers.some((r) => r.test(bodyText));
  signals.push({
    category: "experience",
    signal: "first-person-experience",
    present: hasExperienceMarkers,
    severity: hasExperienceMarkers ? "pass" : "warning",
    message: hasExperienceMarkers
      ? "Content includes first-person experience markers"
      : "Content lacks first-person experience — add real examples, case studies, or 'we've seen' language",
    recommendation: hasExperienceMarkers ? undefined : "Add sentences like 'In our experience working with NJ businesses...' or reference specific client outcomes.",
  });

  // 2. Case study / testimonial / review references
  const hasTestimonials = /testimon|review|client said|customer feedback|case study result/i.test(bodyText);
  signals.push({
    category: "experience",
    signal: "social-proof",
    present: hasTestimonials,
    severity: hasTestimonials ? "pass" : "info",
    message: hasTestimonials
      ? "Page includes testimonials or social proof"
      : "Consider adding client testimonials or case study references",
  });

  // ── EXPERTISE signals ──

  // 3. Author attribution
  const hasAuthorSchema = !!doc.querySelector('script[type="application/ld+json"]')?.textContent?.includes('"Person"');
  const hasAuthorByline = !!doc.querySelector('[class*="author"], [rel="author"], .byline, [itemprop="author"]');
  const hasAnyAuthor = hasAuthorSchema || hasAuthorByline;
  signals.push({
    category: "expertise",
    signal: "author-attribution",
    present: hasAnyAuthor,
    severity: path.startsWith("/blog") ? (hasAnyAuthor ? "pass" : "critical") : (hasAnyAuthor ? "pass" : "info"),
    message: hasAnyAuthor
      ? "Author attribution found (schema or byline)"
      : "No author attribution — Google's E-E-A-T guidelines require clear authorship for content pages",
    recommendation: hasAnyAuthor ? undefined : "Add an author byline with name, credentials, and link to author bio page.",
  });

  // 4. Person structured data
  signals.push({
    category: "expertise",
    signal: "person-schema",
    present: hasAuthorSchema,
    severity: path.startsWith("/blog") ? (hasAuthorSchema ? "pass" : "warning") : "info",
    message: hasAuthorSchema
      ? "Person schema found in JSON-LD"
      : "No Person schema — add JSON-LD Person markup for the content author",
  });

  // 5. Credentials / qualifications mentioned
  const credentialPatterns = [
    /\b(certified|certification|licensed|accredited|degree|credential)\b/i,
    /\b(CompTIA|CISSP|CISM|PMP|AWS|Microsoft|Cisco|ITIL)\b/i,
    /\b(years? of experience|decade|veteran)\b/i,
  ];
  const hasCredentials = credentialPatterns.some((r) => r.test(bodyText));
  signals.push({
    category: "expertise",
    signal: "credentials",
    present: hasCredentials,
    severity: hasCredentials ? "pass" : "info",
    message: hasCredentials
      ? "Expertise credentials mentioned in content"
      : "Consider mentioning relevant certifications, years of experience, or qualifications",
  });

  // ── AUTHORITY signals ──

  // 6. Outbound links to authoritative sources
  const links = doc.querySelectorAll("a[href]");
  const outboundLinks = Array.from(links).filter((a) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("http") && !href.includes(new URL(url).hostname);
  });
  const authorityDomains = ["gov", "edu", "microsoft.com", "google.com", "nist.gov", "cisa.gov"];
  const hasAuthoritySources = outboundLinks.some((a) => {
    const href = a.getAttribute("href") || "";
    return authorityDomains.some((d) => href.includes(d));
  });
  signals.push({
    category: "authority",
    signal: "authority-citations",
    present: hasAuthoritySources,
    severity: path.startsWith("/blog") ? (hasAuthoritySources ? "pass" : "warning") : "info",
    message: hasAuthoritySources
      ? "Links to authoritative sources found (.gov, .edu, major tech companies)"
      : "No outbound links to authoritative sources — citing .gov, .edu, or industry authorities boosts trust",
    recommendation: hasAuthoritySources ? undefined : "Link to NIST, CISA, Microsoft, or Google official documentation where relevant.",
  });

  // 7. Organization schema present
  const hasOrgSchema = !!doc.querySelector('script[type="application/ld+json"]')?.textContent?.includes('"Organization"');
  signals.push({
    category: "authority",
    signal: "organization-schema",
    present: hasOrgSchema,
    severity: hasOrgSchema ? "pass" : "info",
    message: hasOrgSchema
      ? "Organization schema present"
      : "No Organization schema found — helps Google connect content to your entity",
  });

  // ── TRUST signals ──

  // 8. HTTPS (should always pass for modern sites)
  const isHttps = url.startsWith("https://") || url.startsWith("http://localhost");
  signals.push({
    category: "trust",
    signal: "https",
    present: isHttps,
    severity: isHttps ? "pass" : "critical",
    message: isHttps ? "Site uses HTTPS" : "Site does not use HTTPS — this is a critical trust signal",
  });

  // 9. Privacy policy / terms links
  const hasPrivacyLink = Array.from(links).some((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    return href.includes("privacy") || href.includes("terms") || href.includes("cookie");
  });
  signals.push({
    category: "trust",
    signal: "privacy-policy",
    present: hasPrivacyLink,
    severity: hasPrivacyLink ? "pass" : "warning",
    message: hasPrivacyLink
      ? "Privacy/terms links found"
      : "No privacy policy or terms links — Google considers these a trust signal",
  });

  // 10. Contact information present
  const hasContactInfo = /\b(contact|phone|email|call us|get in touch)\b/i.test(bodyText) ||
    Array.from(links).some((a) => (a.getAttribute("href") || "").includes("/contact"));
  signals.push({
    category: "trust",
    signal: "contact-info",
    present: hasContactInfo,
    severity: hasContactInfo ? "pass" : "warning",
    message: hasContactInfo
      ? "Contact information or link found"
      : "No visible contact information — business pages should have clear contact details",
  });

  // 11. Last updated / date freshness
  const hasDateSignal = !!doc.querySelector("time, [datetime], .date, .updated, [itemprop='dateModified']");
  signals.push({
    category: "trust",
    signal: "date-freshness",
    present: hasDateSignal,
    severity: path.startsWith("/blog") ? (hasDateSignal ? "pass" : "warning") : "info",
    message: hasDateSignal
      ? "Date/timestamp signal found"
      : "No visible date — consider showing 'Last updated' for content pages",
  });

  // ── Score calculation ──
  const categoryScores: Record<string, number[]> = {
    experience: [],
    expertise: [],
    authority: [],
    trust: [],
  };

  for (const s of signals) {
    const score = s.severity === "pass" ? 100 : s.severity === "info" ? 60 : s.severity === "warning" ? 30 : 0;
    categoryScores[s.category].push(score);
  }

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 50;

  const experience = avg(categoryScores.experience);
  const expertise = avg(categoryScores.expertise);
  const authority = avg(categoryScores.authority);
  const trust = avg(categoryScores.trust);

  // Weighted: Trust 30%, Expertise 25%, Experience 25%, Authority 20%
  const overall = Math.round(trust * 0.3 + expertise * 0.25 + experience * 0.25 + authority * 0.2);

  return { overall, experience, expertise, authority, trust, signals };
}

/* ── Content-Level E-E-A-T Scoring (for blog writer / content scorer) ── */

export interface ContentEEATResult {
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

/**
 * Score a piece of Markdown content for E-E-A-T signals
 * before it's published. Used by the content scoring engine.
 */
export function scoreContentEEAT(markdown: string, targetKeyword?: string): ContentEEATResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 50; // Start at baseline

  // Experience: First-person markers
  if (/\b(we've|we have|our team|in our experience|we've seen)\b/i.test(markdown)) {
    score += 10;
  } else {
    issues.push("No first-person experience language detected");
    suggestions.push("Add sentences like 'In our experience...' or 'We've helped clients...'");
  }

  // Experience: Specific examples or case studies
  if (/\b(for example|case study|client|real-world|we helped|we built)\b/i.test(markdown)) {
    score += 8;
  } else {
    suggestions.push("Include specific examples or client stories to demonstrate experience");
  }

  // Expertise: Data points and statistics
  const dataPointCount = (markdown.match(/\d+%|\$[\d,]+|\d+ (percent|million|billion|thousand)/gi) || []).length;
  if (dataPointCount >= 3) {
    score += 10;
  } else if (dataPointCount >= 1) {
    score += 5;
  } else {
    issues.push("No data points or statistics found");
    suggestions.push("Add specific numbers, percentages, or cost figures to support claims");
  }

  // Expertise: External citations
  const externalLinks = (markdown.match(/\[.*?\]\(https?:\/\/(?!seedtechllc\.com).*?\)/g) || []).length;
  if (externalLinks >= 2) {
    score += 8;
  } else {
    suggestions.push("Cite authoritative external sources (NIST, CISA, Microsoft docs, etc.)");
  }

  // Authority: Internal links
  const internalLinks = (markdown.match(/\[.*?\]\(\/.*?\)/g) || []).length;
  if (internalLinks >= 3) {
    score += 8;
  } else if (internalLinks >= 1) {
    score += 4;
  } else {
    issues.push("No internal links — SEO authority distribution requires cross-linking");
    suggestions.push("Link to relevant service pages, pricing pages, or related blog posts");
  }

  // Trust: Actionable advice (not just fluff)
  const actionablePatterns = /\b(step \d|how to|checklist|tip:|here's what|you should|we recommend)\b/i;
  if (actionablePatterns.test(markdown)) {
    score += 6;
  } else {
    suggestions.push("Add actionable steps or recommendations — Google favors helpful content");
  }

  // Keyword integration (natural, not stuffed)
  if (targetKeyword) {
    const kwCount = (markdown.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), "g")) || []).length;
    const wordCount = markdown.split(/\s+/).length;
    const density = kwCount / wordCount;
    if (density >= 0.005 && density <= 0.025) {
      score += 10; // Good density
    } else if (density < 0.005) {
      issues.push(`Target keyword "${targetKeyword}" appears only ${kwCount} times — too sparse`);
      suggestions.push(`Use "${targetKeyword}" naturally 3-6 times throughout the content`);
    } else {
      issues.push(`Target keyword "${targetKeyword}" appears ${kwCount} times — may be over-optimized`);
      suggestions.push("Reduce keyword density and use natural variations instead");
    }
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    issues,
    suggestions,
  };
}
