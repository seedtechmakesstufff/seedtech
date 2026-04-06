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
    { url: `${SITE_URL}/services/seedtech-platform`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/ecommerce-development`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/custom-development`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/seo-autopilot`, changeFrequency: "monthly", priority: 0.9 },

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

    // Reviews
    { url: `${SITE_URL}/reviews`, changeFrequency: "monthly", priority: 0.7 },

    // Free Audit
    { url: `${SITE_URL}/free-audit`, changeFrequency: "monthly", priority: 0.8 },

    // SEO — Geo service pages
    { url: `${SITE_URL}/managed-it-services-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/it-support-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/emergency-it-support-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/cybersecurity-services-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/backup-disaster-recovery-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/cloud-services-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/server-down-help`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/ransomware-response-new-jersey`, changeFrequency: "monthly", priority: 0.9 },

    // SEO — Location pages
    { url: `${SITE_URL}/locations/morristown-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/mendham-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/chester-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/bernardsville-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/basking-ridge-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/morris-county-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/somerset-county-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/essex-county-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/union-county-it-support`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/locations/manhattan-it-support`, changeFrequency: "monthly", priority: 0.8 },

    // SEO — Nationwide
    { url: `${SITE_URL}/nationwide-it-support`, changeFrequency: "monthly", priority: 0.9 },

    // SEO — Insights articles
    { url: `${SITE_URL}/insights/what-does-managed-it-cost-nj`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights/when-to-switch-it-provider`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights/what-does-an-msp-do`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights/signs-your-it-company-is-failing`, changeFrequency: "monthly", priority: 0.8 },

    // SEO — Law firm vertical
    { url: `${SITE_URL}/it-support-law-firms-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/cybersecurity-law-firms-nj`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/data-security-law-firms-nj`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/it-compliance-law-firms-nj`, changeFrequency: "monthly", priority: 0.9 },

    // SEO — Data-driven service pages (Tier 6)
    { url: `${SITE_URL}/endpoint-security-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/help-desk-services-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/outsourced-it-support-new-jersey`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/managed-service-provider-new-jersey`, changeFrequency: "monthly", priority: 0.9 },

    // SEO — Construction vertical
    { url: `${SITE_URL}/it-support-construction-companies-nj`, changeFrequency: "monthly", priority: 0.9 },

    // SEO — Healthcare / HIPAA vertical
    { url: `${SITE_URL}/hipaa-compliant-it-support-nj`, changeFrequency: "monthly", priority: 0.9 },

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
