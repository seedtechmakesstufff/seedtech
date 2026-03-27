/* ── IndexNow Integration ──
 *
 * Notifies Bing, Yandex, and other engines when new content is published.
 * Free, instant indexing requests.
 *
 * Required env var:
 *   INDEXNOW_API_KEY — A random string (you generate it). 
 *   Also serve this key at https://yourdomain.com/{key}.txt
 *
 * Docs: https://www.indexnow.org/documentation
 */

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export interface IndexNowResult {
  url: string;
  success: boolean;
  responses: { endpoint: string; status: number }[];
}

/**
 * Check if IndexNow is configured.
 */
export function isIndexNowConfigured(): boolean {
  return !!(process.env.INDEXNOW_API_KEY && process.env.GOOGLE_SEARCH_CONSOLE_SITE);
}

/**
 * Ping search engines about a new or updated URL.
 */
export async function submitUrl(urlToIndex: string): Promise<IndexNowResult> {
  const apiKey = process.env.INDEXNOW_API_KEY;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE;
  if (!siteUrl) {
    return { url: urlToIndex, success: false, responses: [{ endpoint: "none", status: 0 }] };
  }
  const host = new URL(siteUrl).hostname;

  if (!apiKey) {
    return {
      url: urlToIndex,
      success: false,
      responses: [{ endpoint: "none", status: 0 }],
    };
  }

  const responses: { endpoint: string; status: number }[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key: apiKey,
          keyLocation: `https://${host}/${apiKey}.txt`,
          urlList: [urlToIndex],
        }),
      });
      responses.push({ endpoint, status: res.status });
    } catch {
      responses.push({ endpoint, status: 0 });
    }
  }

  const success = responses.some((r) => r.status >= 200 && r.status < 300);

  return { url: urlToIndex, success, responses };
}

/**
 * Submit multiple URLs at once (e.g., after a sitemap update).
 */
export async function submitUrls(urls: string[]): Promise<IndexNowResult[]> {
  return Promise.all(urls.map(submitUrl));
}
