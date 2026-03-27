/* ── Dynamic Sitemap ──
 * Auto-generates sitemap.xml from static routes + dynamic blog/work posts.
 * Next.js serves this at /sitemap.xml automatically.
 */

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/free-audit`, changeFrequency: "monthly", priority: 0.9 },

    // Services
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/managed-it`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services/managed-it/plans`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/managed-it/assessment`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/managed-it/onboarding`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/managed-it/why-seedtech`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/managed-it/mobile-device-management`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/web-development`, changeFrequency: "monthly", priority: 0.9 },

    // Pricing
    { url: `${SITE_URL}/pricing/it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pricing/web-development`, changeFrequency: "monthly", priority: 0.8 },

    // Industries
    { url: `${SITE_URL}/industries`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/industries/trucking`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/industries/construction`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/industries/law-firms`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/industries/medical`, changeFrequency: "monthly", priority: 0.8 },

    // Blog index
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },

    // Our Work index
    { url: `${SITE_URL}/our-work`, changeFrequency: "weekly", priority: 0.7 },

    // Legal
    { url: `${SITE_URL}/terms-conditions`, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* ── Dynamic blog posts ── */
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available — skip dynamic routes
  }

  return [...staticRoutes, ...blogRoutes];
}
