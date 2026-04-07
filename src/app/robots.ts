/* ── Robots.txt ──
 * Next.js serves this at /robots.txt automatically.
 */

import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/design-kit"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
