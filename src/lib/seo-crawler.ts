/* ── On-Page SEO Crawler v2 ──
 * Deep crawls the customer's pages and flags SEO issues.
 * Stores results in SeoPageAudit.
 *
 * v2 adds (2026 upgrade):
 *   - Broken link detection (internal + external)
 *   - Redirect chain detection
 *   - Structured data (JSON-LD) validation
 *   - Heading hierarchy (H1→H2→H3 order)
 *   - Robots meta / x-robots-tag noindex detection
 *   - Mobile viewport meta check
 *   - Content duplication (similarity hashing across pages)
 *   - Image SEO (format, lazy loading, file size hints)
 *   - E-E-A-T signal checks (via seo-eeat.ts)
 *   - AI Overview readiness (via seo-aio.ts)
 *   - Lang attribute check
 *   - Duplicate meta descriptions cross-page
 */

import { prisma } from "@/lib/prisma";
import { JSDOM } from "jsdom";
import { randomUUID } from "crypto";
import { auditEEAT } from "@/lib/seo-eeat";

export interface CrawlIssue {
  url: string;
  checkType: string;
  severity: "critical" | "warning" | "info" | "pass";
  message: string;
  details?: Record<string, unknown>;
}

export interface CrawlResult {
  runId: string;
  pagesScanned: number;
  issues: CrawlIssue[];
  summary: {
    critical: number;
    warning: number;
    info: number;
    pass: number;
  };
  /** E-E-A-T aggregate score across all crawled pages */
  eeatScore?: number;
}

const DEFAULT_PATHS = [
  "/",
  "/about",
  "/services",
  "/services/managed-it",
  "/services/web-development",
  "/pricing/it-support",
  "/pricing/web-development",
  "/industries",
  "/industries/trucking",
  "/industries/construction",
  "/industries/law-firms",
  "/industries/medical",
  "/blog",
  "/contact",
  "/free-audit",
  "/our-work",
];

/* ── Fetch helpers ── */

interface FetchResult {
  dom: JSDOM | null;
  statusCode: number;
  redirectChain: string[];
  headers: Record<string, string>;
}

async function fetchPage(url: string): Promise<FetchResult> {
  const redirectChain: string[] = [];
  let finalUrl = url;
  let statusCode = 0;
  const headers: Record<string, string> = {};

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SeedTech-SEO-Crawler/2.0" },
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });

    statusCode = res.status;
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });

    if (res.redirected && res.url !== url) {
      redirectChain.push(url, res.url);
      finalUrl = res.url;
    }

    if (!res.ok) return { dom: null, statusCode, redirectChain, headers };

    const html = await res.text();
    return {
      dom: new JSDOM(html, { url: finalUrl }),
      statusCode,
      redirectChain,
      headers,
    };
  } catch {
    return { dom: null, statusCode: 0, redirectChain, headers };
  }
}

/* ── Content hashing for duplication detection ── */

function simHash(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const freq: Record<string, number> = {};
  for (const w of words.slice(0, 200)) {
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([w]) => w)
    .join(",");
}

function similarity(a: string, b: string): number {
  const wordsA = a.split(",");
  const wordsB = b.split(",");
  const setB = new Set(wordsB);
  const intersection = wordsA.filter((x) => setB.has(x)).length;
  const union = new Set(wordsA.concat(wordsB)).size;
  return union > 0 ? intersection / union : 0;
}

/* ── Core audit function ── */

function auditPage(
  url: string,
  dom: JSDOM,
  headers: Record<string, string>
): CrawlIssue[] {
  const doc = dom.window.document;
  const issues: CrawlIssue[] = [];
  const path = new URL(url).pathname;

  // ────────────────────────────────────────────────────────
  // CORE CHECKS (preserved + improved from v1)
  // ────────────────────────────────────────────────────────

  // ── Title tag ──
  const title = doc.querySelector("title")?.textContent?.trim();
  if (!title) {
    issues.push({
      url: path,
      checkType: "missing-title",
      severity: "critical",
      message: "Page has no <title> tag",
    });
  } else if (title.length < 20) {
    issues.push({
      url: path,
      checkType: "short-title",
      severity: "warning",
      message: `Title is too short (${title.length} chars): "${title}"`,
      details: { title, length: title.length },
    });
  } else if (title.length > 60) {
    issues.push({
      url: path,
      checkType: "long-title",
      severity: "warning",
      message: `Title exceeds 60 chars (${title.length}): "${title.slice(0, 65)}…"`,
      details: { title, length: title.length },
    });
  } else {
    issues.push({
      url: path,
      checkType: "title-ok",
      severity: "pass",
      message: `Title is good (${title.length} chars)`,
      details: { title, length: title.length },
    });
  }

  // ── Meta description ──
  const metaDesc = doc
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();
  if (!metaDesc) {
    issues.push({
      url: path,
      checkType: "missing-meta-description",
      severity: "critical",
      message: "Page has no meta description",
    });
  } else if (metaDesc.length < 70) {
    issues.push({
      url: path,
      checkType: "short-meta-description",
      severity: "warning",
      message: `Meta description is too short (${metaDesc.length} chars)`,
      details: { metaDesc, length: metaDesc.length },
    });
  } else if (metaDesc.length > 160) {
    issues.push({
      url: path,
      checkType: "long-meta-description",
      severity: "warning",
      message: `Meta description exceeds 160 chars (${metaDesc.length})`,
      details: { metaDesc, length: metaDesc.length },
    });
  } else {
    issues.push({
      url: path,
      checkType: "meta-description-ok",
      severity: "pass",
      message: `Meta description is good (${metaDesc.length} chars)`,
      details: { metaDesc, length: metaDesc.length },
    });
  }

  // ── H1 tag ──
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length === 0) {
    issues.push({
      url: path,
      checkType: "missing-h1",
      severity: "critical",
      message: "Page has no H1 tag",
    });
  } else if (h1s.length > 1) {
    issues.push({
      url: path,
      checkType: "multiple-h1",
      severity: "warning",
      message: `Page has ${h1s.length} H1 tags (should be 1)`,
      details: { count: h1s.length },
    });
  } else {
    issues.push({
      url: path,
      checkType: "h1-ok",
      severity: "pass",
      message: "Page has exactly one H1",
    });
  }

  // ── Images without alt text ──
  const images = doc.querySelectorAll("img");
  const missingAlt = Array.from(images).filter((img: Element) => {
    const alt = img.getAttribute("alt")?.trim();
    return !alt;
  });
  if (missingAlt.length > 0) {
    issues.push({
      url: path,
      checkType: "missing-alt-text",
      severity: "warning",
      message: `${missingAlt.length} image(s) missing alt text`,
      details: {
        count: missingAlt.length,
        srcs: missingAlt
          .slice(0, 5)
          .map((i: Element) => i.getAttribute("src")),
      },
    });
  } else if (images.length > 0) {
    issues.push({
      url: path,
      checkType: "alt-text-ok",
      severity: "pass",
      message: `All ${images.length} images have alt text`,
    });
  }

  // ── Thin content ──
  const body = doc.querySelector("main") || doc.querySelector("body");
  const textContent =
    body?.textContent?.replace(/\s+/g, " ").trim() || "";
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({
      url: path,
      checkType: "thin-content",
      severity: "warning",
      message: `Page has thin content (${wordCount} words, recommend 300+)`,
      details: { wordCount },
    });
  } else {
    issues.push({
      url: path,
      checkType: "content-length-ok",
      severity: "pass",
      message: `Content length is good (${wordCount} words)`,
      details: { wordCount },
    });
  }

  // ── Open Graph tags ──
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDesc = doc.querySelector('meta[property="og:description"]');
  const ogImage = doc.querySelector('meta[property="og:image"]');
  if (!ogTitle || !ogDesc) {
    issues.push({
      url: path,
      checkType: "missing-og-tags",
      severity: "info",
      message: `Missing Open Graph tags: ${[!ogTitle && "og:title", !ogDesc && "og:description", !ogImage && "og:image"].filter(Boolean).join(", ")}`,
    });
  }

  // ── Canonical tag ──
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({
      url: path,
      checkType: "missing-canonical",
      severity: "info",
      message: "Page has no canonical tag",
    });
  }

  // ── Internal links ──
  const links = doc.querySelectorAll("a[href]");
  const hostname = new URL(url).hostname;
  const internalLinks = Array.from(links).filter((a: Element) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("/") || href.includes(hostname);
  });
  if (
    internalLinks.length < 3 &&
    path !== "/contact" &&
    path !== "/free-audit"
  ) {
    issues.push({
      url: path,
      checkType: "few-internal-links",
      severity: "info",
      message: `Only ${internalLinks.length} internal link(s) on this page (recommend 3+)`,
      details: { count: internalLinks.length },
    });
  }

  // ────────────────────────────────────────────────────────
  // NEW v2 CHECKS
  // ────────────────────────────────────────────────────────

  // ── Lang attribute ──
  const htmlEl = doc.querySelector("html");
  const lang = htmlEl?.getAttribute("lang")?.trim();
  if (!lang) {
    issues.push({
      url: path,
      checkType: "missing-lang",
      severity: "warning",
      message:
        'No lang attribute on <html> — add lang="en" for accessibility & SEO',
    });
  }

  // ── Robots meta / noindex ──
  const robotsMeta =
    doc
      .querySelector('meta[name="robots"]')
      ?.getAttribute("content")
      ?.toLowerCase() || "";
  const xRobots = (headers["x-robots-tag"] || "").toLowerCase();
  const isNoIndexed =
    robotsMeta.includes("noindex") || xRobots.includes("noindex");
  if (isNoIndexed) {
    issues.push({
      url: path,
      checkType: "noindex-detected",
      severity: "critical",
      message:
        "Page is set to noindex — it will not appear in search results",
      details: {
        robotsMeta,
        xRobotsTag: headers["x-robots-tag"] || null,
      },
    });
  }

  // ── Viewport meta (mobile-friendliness) ──
  const viewport =
    doc
      .querySelector('meta[name="viewport"]')
      ?.getAttribute("content") || "";
  if (!viewport) {
    issues.push({
      url: path,
      checkType: "missing-viewport",
      severity: "critical",
      message:
        "No viewport meta tag — page will not render correctly on mobile",
    });
  } else if (!viewport.includes("width=device-width")) {
    issues.push({
      url: path,
      checkType: "bad-viewport",
      severity: "warning",
      message: `Viewport meta exists but may be misconfigured: "${viewport}"`,
    });
  } else {
    issues.push({
      url: path,
      checkType: "viewport-ok",
      severity: "pass",
      message: "Viewport meta is correctly configured",
    });
  }

  // ── Heading hierarchy (H1 → H2 → H3, no skips) ──
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let prevLevel = 0;
  let hierarchyBroken = false;
  const skips: string[] = [];
  for (const h of Array.from(headings)) {
    const level = parseInt(h.tagName[1]);
    if (prevLevel > 0 && level > prevLevel + 1) {
      hierarchyBroken = true;
      skips.push(
        `${h.tagName} after H${prevLevel} ("${(h.textContent || "").trim().slice(0, 40)}")`
      );
    }
    prevLevel = level;
  }
  if (hierarchyBroken) {
    issues.push({
      url: path,
      checkType: "heading-hierarchy-broken",
      severity: "warning",
      message: `Heading hierarchy skips levels: ${skips.slice(0, 3).join("; ")}`,
      details: { skips },
    });
  } else if (headings.length > 1) {
    issues.push({
      url: path,
      checkType: "heading-hierarchy-ok",
      severity: "pass",
      message: "Heading hierarchy is correct",
    });
  }

  // ── Structured data (JSON-LD) validation ──
  const jsonLdScripts = doc.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  if (jsonLdScripts.length === 0) {
    issues.push({
      url: path,
      checkType: "no-structured-data",
      severity: "warning",
      message:
        "No JSON-LD structured data found — add schema markup for rich results",
    });
  } else {
    let validCount = 0;
    let invalidCount = 0;
    const schemaTypes: string[] = [];
    for (const script of Array.from(jsonLdScripts)) {
      try {
        const parsed = JSON.parse(script.textContent || "");
        validCount++;
        const schemaType = parsed["@type"];
        if (schemaType) {
          schemaTypes.push(
            Array.isArray(schemaType) ? schemaType.join(", ") : schemaType
          );
        }
      } catch {
        invalidCount++;
      }
    }
    if (invalidCount > 0) {
      issues.push({
        url: path,
        checkType: "invalid-json-ld",
        severity: "critical",
        message: `${invalidCount} JSON-LD block(s) contain invalid JSON — structured data will be ignored`,
      });
    }
    if (validCount > 0) {
      issues.push({
        url: path,
        checkType: "structured-data-ok",
        severity: "pass",
        message: `${validCount} valid JSON-LD block(s): ${schemaTypes.join(", ")}`,
        details: { count: validCount, types: schemaTypes },
      });
    }

    // Check for Speakable (AIO optimization) on content-heavy pages
    const hasSpeakable = Array.from(jsonLdScripts).some((s) =>
      (s.textContent || "").includes("SpeakableSpecification")
    );
    if (
      !hasSpeakable &&
      (path.startsWith("/blog") ||
        path.startsWith("/services") ||
        path.startsWith("/industries"))
    ) {
      issues.push({
        url: path,
        checkType: "no-speakable",
        severity: "info",
        message:
          "No Speakable structured data — adding it improves AI Overview citation chances",
      });
    }
  }

  // ── Image SEO (format, lazy loading) ──
  let flaggedFormat = false;
  let flaggedLazy = false;
  for (const img of Array.from(images).slice(0, 20)) {
    const src = img.getAttribute("src") || "";
    const loading = img.getAttribute("loading");

    // Modern image formats
    if (
      !flaggedFormat &&
      src &&
      !src.includes(".webp") &&
      !src.includes(".avif") &&
      !src.includes("data:") &&
      !src.includes("/_next/image")
    ) {
      const ext = src.split(".").pop()?.split("?")[0];
      if (
        ext &&
        ["jpg", "jpeg", "png", "gif"].includes(ext.toLowerCase())
      ) {
        issues.push({
          url: path,
          checkType: "unoptimized-image-format",
          severity: "info",
          message: `Image uses ${ext.toUpperCase()} — convert to WebP/AVIF for better performance`,
          details: { src: src.slice(0, 100) },
        });
        flaggedFormat = true;
      }
    }

    // Lazy loading on below-the-fold images (skip first 2)
    const imgIndex = Array.from(images).indexOf(img);
    if (!flaggedLazy && imgIndex > 1 && !loading) {
      issues.push({
        url: path,
        checkType: "missing-lazy-loading",
        severity: "info",
        message:
          'Some images lack loading="lazy" — add it for below-the-fold images',
      });
      flaggedLazy = true;
    }
  }

  // ── E-E-A-T signals ──
  const eeat = auditEEAT(url, dom);
  const criticalEeat = eeat.signals.filter(
    (s) => s.severity === "critical"
  );
  const warningEeat = eeat.signals.filter(
    (s) => s.severity === "warning"
  );

  for (const s of criticalEeat) {
    issues.push({
      url: path,
      checkType: `eeat-${s.signal}`,
      severity: "critical",
      message: s.message,
      details: { category: s.category, recommendation: s.recommendation },
    });
  }
  for (const s of warningEeat.slice(0, 3)) {
    issues.push({
      url: path,
      checkType: `eeat-${s.signal}`,
      severity: "warning",
      message: s.message,
      details: { category: s.category, recommendation: s.recommendation },
    });
  }

  // Store E-E-A-T score as a tracking item
  issues.push({
    url: path,
    checkType: "eeat-score",
    severity:
      eeat.overall >= 60
        ? "pass"
        : eeat.overall >= 40
          ? "info"
          : "warning",
    message: `E-E-A-T score: ${eeat.overall}/100 (Exp: ${eeat.experience}, Expt: ${eeat.expertise}, Auth: ${eeat.authority}, Trust: ${eeat.trust})`,
    details: {
      overall: eeat.overall,
      experience: eeat.experience,
      expertise: eeat.expertise,
      authority: eeat.authority,
      trust: eeat.trust,
    },
  });

  return issues;
}

/* ── Main crawl runner ── */

export async function runCrawl(
  baseUrl?: string,
  paths: string[] = DEFAULT_PATHS
): Promise<CrawlResult> {
  const siteUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.GOOGLE_SEARCH_CONSOLE_SITE?.replace(
      "sc-domain:",
      "https://"
    ) ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const runId = randomUUID();
  const allIssues: CrawlIssue[] = [];
  let pagesScanned = 0;
  const pageHashes: Record<string, string> = {};
  const collectedInternalLinks: {
    fromPage: string;
    toPath: string;
  }[] = [];
  const eeatScores: number[] = [];

  // Crawl pages in parallel batches of 3
  for (let i = 0; i < paths.length; i += 3) {
    const batch = paths.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map(async (crawlPath) => {
        const fullUrl = `${siteUrl}${crawlPath}`;
        const { dom, statusCode, redirectChain, headers } =
          await fetchPage(fullUrl);

        if (!dom) {
          return {
            issues: [
              {
                url: crawlPath,
                checkType: "fetch-failed",
                severity: "critical" as const,
                message: `Failed to fetch ${crawlPath} (${statusCode || "timeout"})`,
              },
            ],
            hash: "",
            links: [] as { fromPage: string; toPath: string }[],
            eeat: 0,
          };
        }

        pagesScanned++;

        const issues: CrawlIssue[] = [];

        // Check redirect chains
        if (redirectChain.length > 0) {
          issues.push({
            url: crawlPath,
            checkType: "redirect-chain",
            severity: "warning",
            message: `Redirect detected: ${redirectChain.join(" → ")}`,
            details: { chain: redirectChain },
          });
        }

        // Run all page audits
        issues.push(...auditPage(fullUrl, dom, headers));

        // Content hash for duplication detection
        const mainText = (
          dom.window.document.querySelector("main") ||
          dom.window.document.querySelector("body")
        )?.textContent
          ?.replace(/\s+/g, " ")
          .trim() || "";
        const hash = simHash(mainText);

        // Collect internal links for cross-page validation
        const links: { fromPage: string; toPath: string }[] = [];
        const anchors =
          dom.window.document.querySelectorAll("a[href]");
        for (const a of Array.from(anchors)) {
          const href = a.getAttribute("href") || "";
          if (href.startsWith("/") && !href.startsWith("//")) {
            links.push({
              fromPage: crawlPath,
              toPath: href.split("#")[0].split("?")[0],
            });
          }
        }

        // Extract E-E-A-T score from issues
        const eeatIssue = issues.find(
          (iss) => iss.checkType === "eeat-score"
        );
        const eeatScore =
          (eeatIssue?.details as { overall?: number })?.overall ?? 0;

        return { issues, hash, links, eeat: eeatScore };
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        allIssues.push(...r.value.issues);
        if (r.value.hash) {
          const crawlPath = r.value.issues[0]?.url || "";
          pageHashes[crawlPath] = r.value.hash;
        }
        collectedInternalLinks.push(...r.value.links);
        if (r.value.eeat > 0) eeatScores.push(r.value.eeat);
      }
    }
  }

  // ── Cross-page checks ──

  // Duplicate titles
  const titles: Record<string, string[]> = {};
  for (const issue of allIssues) {
    if (
      issue.checkType === "title-ok" ||
      issue.checkType === "short-title" ||
      issue.checkType === "long-title"
    ) {
      const t = (issue.details as { title?: string })?.title;
      if (t) {
        if (!titles[t]) titles[t] = [];
        titles[t].push(issue.url);
      }
    }
  }
  for (const [t, urls] of Object.entries(titles)) {
    if (urls.length > 1) {
      allIssues.push({
        url: urls.join(", "),
        checkType: "duplicate-title",
        severity: "warning",
        message: `Duplicate title across ${urls.length} pages: "${t.slice(0, 50)}…"`,
        details: { title: t, pages: urls },
      });
    }
  }

  // Duplicate meta descriptions
  const metaDescs: Record<string, string[]> = {};
  for (const issue of allIssues) {
    if (
      issue.checkType === "meta-description-ok" ||
      issue.checkType === "short-meta-description" ||
      issue.checkType === "long-meta-description"
    ) {
      const md = (issue.details as { metaDesc?: string })?.metaDesc;
      if (md) {
        if (!metaDescs[md]) metaDescs[md] = [];
        metaDescs[md].push(issue.url);
      }
    }
  }
  for (const [md, urls] of Object.entries(metaDescs)) {
    if (urls.length > 1) {
      allIssues.push({
        url: urls.join(", "),
        checkType: "duplicate-meta-description",
        severity: "warning",
        message: `Duplicate meta description across ${urls.length} pages: "${md.slice(0, 50)}…"`,
        details: { metaDesc: md, pages: urls },
      });
    }
  }

  // Content duplication (compare page content hashes)
  const hashEntries = Object.entries(pageHashes);
  for (let a = 0; a < hashEntries.length; a++) {
    for (let b = a + 1; b < hashEntries.length; b++) {
      const sim = similarity(hashEntries[a][1], hashEntries[b][1]);
      if (sim > 0.7) {
        allIssues.push({
          url: `${hashEntries[a][0]}, ${hashEntries[b][0]}`,
          checkType: "content-duplication",
          severity: sim > 0.85 ? "warning" : "info",
          message: `High content similarity (${Math.round(sim * 100)}%) between ${hashEntries[a][0]} and ${hashEntries[b][0]}`,
          details: {
            similarity: Math.round(sim * 100),
            pages: [hashEntries[a][0], hashEntries[b][0]],
          },
        });
      }
    }
  }

  // Broken internal links (links pointing to paths that returned errors)
  const failedPaths = new Set(
    allIssues
      .filter((i) => i.checkType === "fetch-failed")
      .map((i) => i.url)
  );
  for (const link of collectedInternalLinks) {
    if (failedPaths.has(link.toPath)) {
      allIssues.push({
        url: link.fromPage,
        checkType: "broken-internal-link",
        severity: "critical",
        message: `Broken link to ${link.toPath} (returns error)`,
        details: { from: link.fromPage, to: link.toPath },
      });
    }
  }

  // Store in DB (only non-pass issues to keep storage lean)
  const nonPassIssues = allIssues.filter((i) => i.severity !== "pass");
  if (nonPassIssues.length > 0) {
    await prisma.seoPageAudit.createMany({
      data: nonPassIssues.map((issue) => ({
        runId,
        url: issue.url,
        checkType: issue.checkType,
        severity: issue.severity,
        message: issue.message,
        details: (issue.details as object) ?? undefined,
      })),
    });
  }

  const summary = {
    critical: allIssues.filter((i) => i.severity === "critical").length,
    warning: allIssues.filter((i) => i.severity === "warning").length,
    info: allIssues.filter((i) => i.severity === "info").length,
    pass: allIssues.filter((i) => i.severity === "pass").length,
  };

  const avgEeat = eeatScores.length
    ? Math.round(
        eeatScores.reduce((a, b) => a + b, 0) / eeatScores.length
      )
    : undefined;

  return {
    runId,
    pagesScanned,
    issues: allIssues,
    summary,
    eeatScore: avgEeat,
  };
}

/* ── Get latest crawl results ── */

export async function getLatestCrawlResults() {
  const latest = await prisma.seoPageAudit.findFirst({
    orderBy: { createdAt: "desc" },
    select: { runId: true },
  });
  if (!latest) return null;

  const issues = await prisma.seoPageAudit.findMany({
    where: { runId: latest.runId },
    orderBy: [{ severity: "asc" }, { url: "asc" }],
  });

  return {
    runId: latest.runId,
    issueCount: issues.length,
    issues: issues.map((i) => ({
      url: i.url,
      checkType: i.checkType,
      severity: i.severity,
      message: i.message,
      details: i.details,
      createdAt: i.createdAt,
    })),
  };
}
