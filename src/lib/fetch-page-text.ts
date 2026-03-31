/**
 * Fetches a page's content for AI analysis.
 *
 * Strategy:
 *   1. Try fetching the live rendered page (best for seeing actual user-facing content)
 *   2. If that fails, read the source code file directly (the truest source of truth)
 *
 * Used by page-context generation routes so Claude can actually read what a
 * page is about instead of guessing from a URL path.
 */

import { JSDOM } from "jsdom";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface PageContent {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
  /** Combined prompt-ready summary (title + headings + body excerpt) */
  summary: string;
  /** Where the content came from */
  source: "live" | "source-file" | "none";
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";

/** Root of the project (where src/ lives) */
const PROJECT_ROOT = path.resolve(process.cwd());

/**
 * Fetch a page and extract its text content for AI analysis.
 * Falls back to reading the source code file if the live page can't be fetched.
 *
 * @param pagePath  URL path like "/services/seedtech-platform"
 * @returns PageContent (always returns something — worst case source="none")
 */
export async function fetchPageText(pagePath: string): Promise<PageContent> {
  // ── Attempt 1: Fetch the live rendered page ──
  const liveResult = await fetchLivePage(pagePath);
  if (liveResult) return liveResult;

  // ── Attempt 2: Read the source code file ──
  const sourceResult = await readSourceFile(pagePath);
  if (sourceResult) return sourceResult;

  // ── Nothing worked ──
  return {
    title: "",
    metaDescription: "",
    headings: [],
    bodyText: "",
    summary: `[Could not fetch page or read source file for ${pagePath}]`,
    source: "none",
  };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Attempt 1: Live rendered page                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

async function fetchLivePage(pagePath: string): Promise<PageContent | null> {
  const url = `${SITE_URL}${pagePath}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "SeedTech-PageContext/1.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });

    if (!res.ok) return null;

    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    const title = doc.querySelector("title")?.textContent?.trim() || "";
    const metaDesc =
      doc
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim() || "";

    // Remove non-content elements
    const removeSelectors = [
      "nav", "header", "footer", "script", "style", "noscript",
      "svg", "iframe", "[role='navigation']", "[role='banner']",
      "[role='contentinfo']", ".navbar", ".footer", ".cookie-banner",
      ".quote-modal", "#__next-build-indicator",
    ];
    for (const sel of removeSelectors) {
      doc.querySelectorAll(sel).forEach((el) => el.remove());
    }

    // Extract headings
    const headingEls = doc.querySelectorAll("h1, h2, h3, h4");
    const headings: string[] = [];
    headingEls.forEach((h) => {
      const text = h.textContent?.replace(/\s+/g, " ").trim();
      if (text && text.length > 2) headings.push(`${h.tagName}: ${text}`);
    });

    // Extract body text
    const main =
      doc.querySelector("main") ||
      doc.querySelector("[role='main']") ||
      doc.querySelector("body");

    let bodyText = "";
    if (main) {
      const contentEls = main.querySelectorAll(
        "p, li, td, th, blockquote, figcaption, dt, dd, span, a, strong, em",
      );
      const textParts: string[] = [];
      const seen = new Set<string>();
      contentEls.forEach((el) => {
        const text = el.textContent?.replace(/\s+/g, " ").trim();
        if (text && text.length > 10 && !seen.has(text)) {
          seen.add(text);
          textParts.push(text);
        }
      });
      bodyText = textParts.join("\n");
    }

    if (bodyText.length < 100 && main) {
      bodyText =
        main.textContent?.replace(/\s+/g, " ").trim().slice(0, 5000) || "";
    }

    const MAX_BODY = 4000;
    if (bodyText.length > MAX_BODY) {
      bodyText = bodyText.slice(0, MAX_BODY) + "…";
    }

    // Build summary
    const summaryParts: string[] = [];
    if (title) summaryParts.push(`Page title: "${title}"`);
    if (metaDesc) summaryParts.push(`Meta description: "${metaDesc}"`);
    if (headings.length > 0) {
      summaryParts.push(`\nPage headings:\n${headings.join("\n")}`);
    }
    if (bodyText) {
      summaryParts.push(`\nPage content:\n${bodyText}`);
    }

    const summary = summaryParts.join("\n");

    return { title, metaDescription: metaDesc, headings, bodyText, summary, source: "live" };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Attempt 2: Read the source code file (the truest source)                  */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Map a URL path to its Next.js source file and read it.
 * e.g. "/services/seedtech-platform" → "src/app/services/seedtech-platform/page.tsx"
 */
async function readSourceFile(pagePath: string): Promise<PageContent | null> {
  // Normalize: "/" → "/page.tsx" lives at src/app/page.tsx
  const normalizedPath = pagePath === "/" ? "" : pagePath;

  // Try common file patterns
  const candidates = [
    path.join(PROJECT_ROOT, "src", "app", normalizedPath, "page.tsx"),
    path.join(PROJECT_ROOT, "src", "app", normalizedPath, "page.jsx"),
    path.join(PROJECT_ROOT, "src", "app", normalizedPath, "page.ts"),
    path.join(PROJECT_ROOT, "src", "app", normalizedPath, "page.js"),
  ];

  let filePath: string | null = null;
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }

  if (!filePath) return null;

  try {
    const source = await readFile(filePath, "utf-8");

    // Cap the source to keep prompt size reasonable
    const MAX_SOURCE = 6000; // source code is more dense/useful per char
    const cappedSource = source.length > MAX_SOURCE
      ? source.slice(0, MAX_SOURCE) + "\n// … [file truncated for AI analysis]"
      : source;

    // Extract what we can from the source code
    const title = extractFromSource(source, /title:\s*["'`]([^"'`]+)["'`]/) || "";
    const metaDesc = extractFromSource(source, /description:\s*["'`]([^"'`]+)["'`]/) || "";

    // Extract string literals that look like headings/copy
    const headings: string[] = [];
    const headingMatches = Array.from(
      source.matchAll(/(?:title|headline|eyebrow|name)["']?\s*[:=]\s*["'`]([^"'`]{5,80})["'`]/gi),
    );
    for (const m of headingMatches) {
      if (m[1] && !headings.includes(m[1])) headings.push(m[1]);
    }

    const summary = `[Source: ${filePath.replace(PROJECT_ROOT + "/", "")}]\n\nThis is the actual source code for this page:\n\n${cappedSource}`;

    return {
      title,
      metaDescription: metaDesc,
      headings,
      bodyText: cappedSource,
      summary,
      source: "source-file",
    };
  } catch {
    return null;
  }
}

function extractFromSource(source: string, pattern: RegExp): string | null {
  const match = source.match(pattern);
  return match?.[1] || null;
}
