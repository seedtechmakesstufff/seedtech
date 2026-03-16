/* ── On-Page SEO Crawler ──
 * Crawls the customer's own pages and flags SEO issues.
 * Stores results in SeoPageAudit.
 */

import { prisma } from "@/lib/prisma";
import { JSDOM } from "jsdom";
import { randomUUID } from "crypto";

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
];

/**
 * Fetch a page and parse its HTML. Uses server-side fetch.
 */
async function fetchPage(url: string): Promise<JSDOM | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SeedTech-SEO-Crawler/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return new JSDOM(html, { url });
  } catch {
    return null;
  }
}

/**
 * Run all checks on a single page.
 */
function auditPage(url: string, dom: JSDOM): CrawlIssue[] {
  const doc = dom.window.document;
  const issues: CrawlIssue[] = [];
  const path = new URL(url).pathname;

  // ── Title tag ──
  const title = doc.querySelector("title")?.textContent?.trim();
  if (!title) {
    issues.push({ url: path, checkType: "missing-title", severity: "critical", message: "Page has no <title> tag" });
  } else if (title.length < 20) {
    issues.push({ url: path, checkType: "short-title", severity: "warning", message: `Title is too short (${title.length} chars): "${title}"`, details: { title, length: title.length } });
  } else if (title.length > 60) {
    issues.push({ url: path, checkType: "long-title", severity: "warning", message: `Title exceeds 60 chars (${title.length}): "${title.slice(0, 65)}…"`, details: { title, length: title.length } });
  } else {
    issues.push({ url: path, checkType: "title-ok", severity: "pass", message: `Title is good (${title.length} chars)` });
  }

  // ── Meta description ──
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
  if (!metaDesc) {
    issues.push({ url: path, checkType: "missing-meta-description", severity: "critical", message: "Page has no meta description" });
  } else if (metaDesc.length < 70) {
    issues.push({ url: path, checkType: "short-meta-description", severity: "warning", message: `Meta description is too short (${metaDesc.length} chars)`, details: { length: metaDesc.length } });
  } else if (metaDesc.length > 160) {
    issues.push({ url: path, checkType: "long-meta-description", severity: "warning", message: `Meta description exceeds 160 chars (${metaDesc.length})`, details: { length: metaDesc.length } });
  } else {
    issues.push({ url: path, checkType: "meta-description-ok", severity: "pass", message: `Meta description is good (${metaDesc.length} chars)` });
  }

  // ── H1 tag ──
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length === 0) {
    issues.push({ url: path, checkType: "missing-h1", severity: "critical", message: "Page has no H1 tag" });
  } else if (h1s.length > 1) {
    issues.push({ url: path, checkType: "multiple-h1", severity: "warning", message: `Page has ${h1s.length} H1 tags (should be 1)`, details: { count: h1s.length } });
  } else {
    issues.push({ url: path, checkType: "h1-ok", severity: "pass", message: "Page has exactly one H1" });
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
      details: { count: missingAlt.length, srcs: missingAlt.slice(0, 5).map((i: Element) => i.getAttribute("src")) },
    });
  } else if (images.length > 0) {
    issues.push({ url: path, checkType: "alt-text-ok", severity: "pass", message: `All ${images.length} images have alt text` });
  }

  // ── Thin content ──
  const body = doc.querySelector("main") || doc.querySelector("body");
  const textContent = body?.textContent?.replace(/\s+/g, " ").trim() || "";
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
    issues.push({ url: path, checkType: "content-length-ok", severity: "pass", message: `Content length is good (${wordCount} words)` });
  }

  // ── Open Graph tags ──
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDesc = doc.querySelector('meta[property="og:description"]');
  if (!ogTitle || !ogDesc) {
    issues.push({
      url: path,
      checkType: "missing-og-tags",
      severity: "info",
      message: `Missing Open Graph tags: ${[!ogTitle && "og:title", !ogDesc && "og:description"].filter(Boolean).join(", ")}`,
    });
  }

  // ── Canonical tag ──
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({ url: path, checkType: "missing-canonical", severity: "info", message: "Page has no canonical tag" });
  }

  // ── Internal links ──
  const links = doc.querySelectorAll("a[href]");
  const internalLinks = Array.from(links).filter((a: Element) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("/") || href.includes(new URL(url).hostname);
  });
  if (internalLinks.length < 3 && path !== "/contact" && path !== "/free-audit") {
    issues.push({
      url: path,
      checkType: "few-internal-links",
      severity: "info",
      message: `Only ${internalLinks.length} internal link(s) on this page (recommend 3+)`,
      details: { count: internalLinks.length },
    });
  }

  return issues;
}

/**
 * Run a full site crawl and store results.
 */
export async function runCrawl(
  baseUrl?: string,
  paths: string[] = DEFAULT_PATHS
): Promise<CrawlResult> {
  const siteUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.GOOGLE_SEARCH_CONSOLE_SITE?.replace("sc-domain:", "https://") ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const runId = randomUUID();
  const allIssues: CrawlIssue[] = [];
  let pagesScanned = 0;

  // Crawl pages in parallel batches of 3
  for (let i = 0; i < paths.length; i += 3) {
    const batch = paths.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map(async (path) => {
        const fullUrl = `${siteUrl}${path}`;
        const dom = await fetchPage(fullUrl);
        if (!dom) {
          return [{ url: path, checkType: "fetch-failed", severity: "critical" as const, message: `Failed to fetch ${path} (404 or timeout)` }];
        }
        pagesScanned++;
        return auditPage(fullUrl, dom);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled") {
        allIssues.push(...r.value);
      }
    }
  }

  // Also check for duplicate titles across pages
  const titles: Record<string, string[]> = {};
  for (const issue of allIssues) {
    if (issue.checkType === "title-ok" || issue.checkType === "short-title" || issue.checkType === "long-title") {
      const title = (issue.details as { title?: string })?.title;
      if (title) {
        if (!titles[title]) titles[title] = [];
        titles[title].push(issue.url);
      }
    }
  }
  for (const [title, urls] of Object.entries(titles)) {
    if (urls.length > 1) {
      allIssues.push({
        url: urls.join(", "),
        checkType: "duplicate-title",
        severity: "warning",
        message: `Duplicate title across ${urls.length} pages: "${title.slice(0, 50)}…"`,
        details: { title, pages: urls },
      });
    }
  }

  // Store in DB
  const nonPassIssues = allIssues.filter((i) => i.severity !== "pass");
  if (nonPassIssues.length > 0) {
    await prisma.seoPageAudit.createMany({
      data: nonPassIssues.map((issue) => ({
        runId,
        url: issue.url,
        checkType: issue.checkType,
        severity: issue.severity,
        message: issue.message,
        details: issue.details as object ?? undefined,
      })),
    });
  }

  const summary = {
    critical: allIssues.filter((i) => i.severity === "critical").length,
    warning: allIssues.filter((i) => i.severity === "warning").length,
    info: allIssues.filter((i) => i.severity === "info").length,
    pass: allIssues.filter((i) => i.severity === "pass").length,
  };

  return { runId, pagesScanned, issues: allIssues, summary };
}

/**
 * Get the most recent crawl results.
 */
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
