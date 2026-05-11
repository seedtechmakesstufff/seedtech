/* ── WordPress REST API Client ──────────────────────────────────────────────
 * Self-hosted WordPress via Application Password authentication.
 * Credentials format (stored encrypted in IntegrationCredential):
 *   { siteUrl, username, appPassword, pathPrefix? }
 * pathPrefix defaults to "/blog" — used when building SitePage.path.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface WpCredentials {
  siteUrl: string;        // e.g. "https://client.com" (no trailing slash)
  username: string;
  appPassword: string;    // WordPress Application Password (spaces allowed)
  pathPrefix?: string;    // Default "/blog"; set to "" if posts live at /{slug}
}

export interface WpPost {
  id: number;
  slug: string;
  title: string;           // HTML-decoded
  body: string;            // HTML content
  excerpt: string;         // HTML-decoded excerpt
  publishedAt: string;     // ISO date string
  modifiedAt: string;      // ISO date string
  status: "publish" | "draft" | "private" | string;
  categories: number[];
  tags: number[];
  // Yoast SEO fields — present when Yoast plugin is active
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export interface WpPage {
  id: number;
  slug: string;
  title: string;
  status: string;
  modifiedAt: string;
}

export interface WpTestResult {
  ok: boolean;
  siteTitle?: string;
  error?: string;
}

// WordPress REST API returns HTML-encoded strings like "Managed IT &#038; Support"
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<[^>]+>/g, ""); // strip any inline HTML tags
}

function authHeader(creds: WpCredentials): string {
  return "Basic " + Buffer.from(`${creds.username}:${creds.appPassword}`).toString("base64");
}

async function wpFetch<T>(url: string, creds: WpCredentials): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(creds),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WordPress API ${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractYoast(post: any): { metaTitle?: string; metaDescription?: string; focusKeyword?: string } {
  const yoast = post?.yoast_head_json;
  if (!yoast) return {};
  return {
    metaTitle: yoast.title ?? undefined,
    metaDescription: yoast.description ?? undefined,
    // Yoast stores focus keyword in post meta — available via ACF or custom REST field
    focusKeyword: post?.meta?.["_yoast_wpseo_focuskw"] ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): WpPost {
  const yoast = extractYoast(raw);
  return {
    id: raw.id as number,
    slug: raw.slug as string,
    title: decodeHtmlEntities((raw.title?.rendered ?? "") as string),
    body: (raw.content?.rendered ?? "") as string,
    excerpt: decodeHtmlEntities((raw.excerpt?.rendered ?? "") as string),
    publishedAt: (raw.date ?? raw.date_gmt ?? "") as string,
    modifiedAt: (raw.modified ?? raw.modified_gmt ?? "") as string,
    status: (raw.status ?? "publish") as string,
    categories: (raw.categories ?? []) as number[],
    tags: (raw.tags ?? []) as number[],
    ...yoast,
  };
}

/** Fetch all published posts from a WordPress site (paginated). */
export async function fetchWpPosts(
  creds: WpCredentials,
  opts: { since?: Date } = {}
): Promise<WpPost[]> {
  const base = `${creds.siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`;
  const all: WpPost[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const params = new URLSearchParams({
      status: "publish",
      per_page: String(perPage),
      page: String(page),
      _fields: "id,slug,title,content,excerpt,date,modified,status,categories,tags,yoast_head_json,meta",
      orderby: "modified",
      order: "desc",
    });
    if (opts.since) {
      params.set("after", opts.since.toISOString());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let batch: any[];
    try {
      batch = await wpFetch<unknown[]>(`${base}?${params}`, creds);
    } catch (e) {
      if (e instanceof Error && e.message.includes("400")) break; // past last page
      throw e;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;

    all.push(...batch.map(mapPost));
    if (batch.length < perPage) break;
    page++;
  }

  return all;
}

/** Fetch all published pages from a WordPress site (paginated). */
export async function fetchWpPages(creds: WpCredentials): Promise<WpPage[]> {
  const base = `${creds.siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/pages`;
  const all: WpPage[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      status: "publish",
      per_page: "100",
      page: String(page),
      _fields: "id,slug,title,status,modified",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let batch: any[];
    try {
      batch = await wpFetch<unknown[]>(`${base}?${params}`, creds);
    } catch (e) {
      if (e instanceof Error && e.message.includes("400")) break;
      throw e;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;

    all.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...batch.map((p: any) => ({
        id: p.id as number,
        slug: p.slug as string,
        title: decodeHtmlEntities((p.title?.rendered ?? "") as string),
        status: (p.status ?? "publish") as string,
        modifiedAt: (p.modified ?? "") as string,
      }))
    );
    if (batch.length < 100) break;
    page++;
  }

  return all;
}

/** Test connectivity and credentials. Returns { ok, siteTitle } or { ok: false, error }. */
export async function testWpConnection(creds: WpCredentials): Promise<WpTestResult> {
  try {
    const url = `${creds.siteUrl.replace(/\/$/, "")}/wp-json`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = await wpFetch<any>(url, creds);
    return { ok: true, siteTitle: info?.name ?? "WordPress Site" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Compute word count from HTML string (strips tags, counts words). */
export function computeWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}

/** Derive a targetKeyword from title + slug when Yoast focus keyword is unavailable. */
export function deriveTargetKeyword(title: string, slug: string): string {
  // Prefer slug-based keyword: "managed-it-services-nj" → "managed it services nj"
  const fromSlug = slug.replace(/-/g, " ").replace(/\d{4}$/, "").trim();
  return fromSlug.length > 5 ? fromSlug : title.toLowerCase().slice(0, 60);
}
