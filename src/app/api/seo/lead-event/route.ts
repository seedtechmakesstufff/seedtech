import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * POST /api/seo/lead-event — Track an SEO lead event (public, no auth)
 * GET  /api/seo/lead-event — Get lead analytics (admin only)
 */

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    sessionId,
    landingPage,
    conversionPage,
    utmSource,
    utmMedium,
    utmCampaign,
    referrer,
    keyword,
    eventType,
    metadata,
  } = body;

  if (!landingPage || !eventType) {
    return NextResponse.json(
      { error: "landingPage and eventType are required" },
      { status: 400 }
    );
  }

  await prisma.seoLeadEvent.create({
    data: {
      sessionId,
      landingPage,
      conversionPage,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      keyword,
      eventType,
      metadata: metadata || undefined,
    },
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get lead event summary
  const events = await prisma.seoLeadEvent.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate by landing page
  const byLandingPage: Record<
    string,
    { views: number; ctaClicks: number; submissions: number }
  > = {};
  for (const e of events) {
    if (!byLandingPage[e.landingPage]) {
      byLandingPage[e.landingPage] = { views: 0, ctaClicks: 0, submissions: 0 };
    }
    if (e.eventType === "page_view") byLandingPage[e.landingPage].views++;
    if (e.eventType === "cta_click") byLandingPage[e.landingPage].ctaClicks++;
    if (e.eventType === "form_submit") byLandingPage[e.landingPage].submissions++;
  }

  // Calculate conversion rates
  const landingPageStats = Object.entries(byLandingPage)
    .map(([page, stats]) => ({
      page,
      ...stats,
      conversionRate:
        stats.views > 0
          ? ((stats.submissions / stats.views) * 100).toFixed(1) + "%"
          : "0%",
    }))
    .sort((a, b) => b.submissions - a.submissions);

  // Aggregate by source
  const bySource: Record<string, number> = {};
  for (const e of events.filter((ev) => ev.eventType === "form_submit")) {
    const source = e.utmSource || e.referrer || "direct";
    bySource[source] = (bySource[source] || 0) + 1;
  }

  return NextResponse.json({
    totalEvents: events.length,
    totalSubmissions: events.filter((e) => e.eventType === "form_submit").length,
    totalCtaClicks: events.filter((e) => e.eventType === "cta_click").length,
    landingPageStats,
    conversionsBySource: bySource,
    recentEvents: events.slice(0, 20).map((e) => ({
      eventType: e.eventType,
      landingPage: e.landingPage,
      conversionPage: e.conversionPage,
      referrer: e.referrer,
      createdAt: e.createdAt,
    })),
  });
}
