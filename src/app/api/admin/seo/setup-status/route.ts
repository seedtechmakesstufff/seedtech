/**
 * GET /api/admin/seo/setup-status
 * Returns the completion status of each SEO Autopilot setup step.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx;

  // Run all checks in parallel
  const [
    businessProfile,
    contextNodeCount,
    serviceNodeCount,
    pageContextCount,
    linkedPageNodeCount,
    trackedKeywordCount,
    metadataWithTitleCount,
    totalMetadataPages,
    blogPostCount,
    sitePageCount,
    crawlRunCount,
    snapshotCount,
    competitorCount,
    siteRecord,
  ] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { siteId }, select: { companyName: true, primaryService: true, targetAudience: true, toneOfVoice: true } }),
    prisma.contextNode.count({ where: { siteId } }),
    prisma.contextNode.count({ where: { siteId, nodeType: { not: "business" } } }),
    prisma.pageContext.count({ where: { siteId } }),
    prisma.pageContextNode.count({ where: { contextNode: { siteId } } }),
    prisma.trackedKeyword.count({ where: { siteId } }),
    prisma.pageMetadata.count({ where: { siteId, title: { not: "" } } }),
    prisma.pageMetadata.count({ where: { siteId } }),
    prisma.blogPost.count({ where: { siteId, status: "published" } }).catch(() => 0),
    prisma.sitePage.count({ where: { siteId, status: "active" } }),
    prisma.seoCrawlRun.count({ where: { siteId } }).catch(() => 0),
    prisma.seoSnapshot.count({ where: { siteId } }).catch(() => 0),
    prisma.competitorDomain.count({ where: { siteId } }).catch(() => 0),
    prisma.site.findUnique({ where: { id: siteId }, select: { defaultOgImageUrl: true } }),
  ]);

  // Check GSC connection via env
  const gscConnected = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE
  );

  // Business profile completeness
  const bpComplete = !!(
    businessProfile?.companyName &&
    businessProfile?.primaryService &&
    businessProfile?.targetAudience
  );

  const steps = [
    {
      id: "business-profile",
      label: "Business Profile",
      description: "Company name, services, audience, and tone of voice",
      complete: bpComplete,
      href: "/admin/seo/context",
      detail: businessProfile?.companyName || null,
    },
    {
      id: "context-nodes",
      label: "Context Nodes",
      description: "Service/offering nodes with structured context",
      complete: serviceNodeCount >= 1,
      href: "/admin/seo/context",
      detail: serviceNodeCount > 0 ? `${serviceNodeCount} service node${serviceNodeCount === 1 ? "" : "s"}` : null,
    },
    {
      id: "page-contexts",
      label: "Page Contexts",
      description: "Page descriptions and keyword targets",
      complete: pageContextCount >= 5,
      href: "/admin/seo/context",
      detail: pageContextCount > 0 ? `${pageContextCount} page${pageContextCount === 1 ? "" : "s"}` : null,
    },
    {
      id: "node-links",
      label: "Node ↔ Page Links",
      description: "Connect service nodes to relevant pages",
      complete: linkedPageNodeCount >= 3,
      href: "/admin/seo/context",
      detail: linkedPageNodeCount > 0 ? `${linkedPageNodeCount} link${linkedPageNodeCount === 1 ? "" : "s"}` : null,
    },
    {
      id: "keywords",
      label: "Tracked Keywords",
      description: "Target keywords with tier, intent, and volume",
      complete: trackedKeywordCount >= 5,
      href: "/admin/seo/context",
      detail: trackedKeywordCount > 0 ? `${trackedKeywordCount} keyword${trackedKeywordCount === 1 ? "" : "s"}` : null,
    },
    {
      id: "search-console",
      label: "Search Console",
      description: "Connect Google Search Console for real position data",
      complete: gscConnected,
      href: "/admin/seo/settings",
      detail: gscConnected ? "Connected" : null,
    },
    {
      id: "default-og-image",
      label: "Default OG Image",
      description: "Site-wide fallback image for social sharing (1200×630)",
      complete: !!siteRecord?.defaultOgImageUrl,
      href: "/admin/seo/settings",
      detail: siteRecord?.defaultOgImageUrl ? "Uploaded" : null,
    },
    {
      id: "metadata",
      label: "Generate Metadata",
      description: "AI-generated titles and descriptions for pages",
      complete: metadataWithTitleCount >= 5,
      href: "/admin/seo?tab=metadata",
      detail: metadataWithTitleCount > 0 ? `${metadataWithTitleCount}/${totalMetadataPages || "—"} pages` : null,
    },
    {
      id: "site-crawl",
      label: "Run Site Crawl",
      description: "Audit on-page SEO across all pages",
      complete: crawlRunCount >= 1,
      href: "/admin/seo?tab=audit",
      detail: crawlRunCount > 0 ? `${crawlRunCount} crawl${crawlRunCount === 1 ? "" : "s"}` : null,
    },
  ];

  const completedCount = steps.filter((s) => s.complete).length;

  return NextResponse.json({
    steps,
    completedCount,
    totalCount: steps.length,
    // Extra stats for the other two cards
    stats: {
      blogPosts: blogPostCount,
      sitePages: sitePageCount,
      competitors: competitorCount,
      snapshots: snapshotCount,
      metadataCoverage: totalMetadataPages > 0 ? Math.round((metadataWithTitleCount / totalMetadataPages) * 100) : 0,
      keywordCount: trackedKeywordCount,
      nodeCount: contextNodeCount,
      pageContextCount,
    },
  });
}
