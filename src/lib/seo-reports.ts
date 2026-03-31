/* ── SEO Email Reports ──
 * Build and send weekly/monthly/quarterly/yearly SEO digest emails.
 * Site-aware: loads branding, URLs, and email config from DB.
 * Supports date-range-based report periods for the Reports dashboard.
 */

import { prisma } from "@/lib/prisma";
import { getSnapshotHistory, getKeywordTrends } from "@/lib/seo-snapshot";
import { getActiveInsights } from "@/lib/seo-insights";
import { getLatestCrawlResults } from "@/lib/seo-crawler";
import { getSiteUrl } from "@/lib/site-data";
import { getBusinessContextForSite } from "@/lib/business-context";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import { sendSeoDigest } from "@/lib/email";

/* ── Types ── */

export type ReportPeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export interface ReportData {
  period: string;
  periodType: ReportPeriod;
  dateRange: { start: string; end: string };
  currentHealth: number;
  previousHealth: number;
  healthDelta: number;
  totalClicks: number;
  totalImpressions: number;
  clicksDelta: number;
  impressionsDelta: number;
  avgPosition: number;
  avgCtr: number;
  positionDelta: number;
  ctrDelta: number;
  keywordMovers: { keyword: string; change: number; current: number }[];
  topPages: { page: string; clicks: number; impressions: number }[];
  criticalIssues: number;
  warningIssues: number;
  activeInsights: number;
  topInsights: { title: string; type: string; priority: number }[];
  publishedPosts: number;
  totalKeywordsTracked: number;
}

export interface ReportBranding {
  companyName: string;
  siteUrl: string;
  fromEmail: string;
  toEmail: string;
}

/* ── Period helpers ── */

function getPeriodDays(period: ReportPeriod): number {
  switch (period) {
    case "weekly": return 7;
    case "monthly": return 30;
    case "quarterly": return 90;
    case "yearly": return 365;
  }
}

function getDateRange(period: ReportPeriod, refDate?: Date) {
  const end = refDate || new Date();
  const days = getPeriodDays(period);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);
  return { start, end, prevStart, prevEnd };
}

function formatPeriodLabel(period: ReportPeriod, start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const labels: Record<ReportPeriod, string> = {
    weekly: "Week of " + fmt(start),
    monthly: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    quarterly: "Q" + Math.ceil((start.getMonth() + 1) / 3) + " " + start.getFullYear(),
    yearly: String(start.getFullYear()),
  };
  return labels[period] + " (" + fmt(start) + " \u2014 " + fmt(end) + ")";
}

/* ── Resolve branding from DB / env ── */

async function getReportBranding(siteId: string): Promise<ReportBranding> {
  const siteUrl = await getSiteUrl(siteId);
  let companyName = "Your Company";
  try {
    const ctx = await getBusinessContextForSite(siteId);
    companyName = ctx.companyName;
  } catch {
    /* use default */
  }

  const domain = new URL(siteUrl).hostname;
  return {
    companyName,
    siteUrl,
    fromEmail: process.env.REPORT_FROM_EMAIL || "seo@" + domain,
    toEmail: process.env.REPORT_TO_EMAIL || "admin@" + domain,
  };
}

/* ── Build report data ── */

export async function buildReportData(
  siteId: string = DEFAULT_SITE_ID,
  period: ReportPeriod = "monthly",
  refDate?: Date,
): Promise<ReportData> {
  const { start, end, prevStart, prevEnd } = getDateRange(period, refDate);

  const snapshotCount =
    period === "yearly" ? 52 : period === "quarterly" ? 13 : period === "monthly" ? 5 : 2;

  const [snapshots, keywords, insights, crawl, gscCurrent, gscPrevious, publishedPosts, trackedKw] =
    await Promise.allSettled([
      getSnapshotHistory(snapshotCount, siteId),
      getKeywordTrends(snapshotCount, siteId),
      getActiveInsights(siteId),
      getLatestCrawlResults(siteId),
      prisma.gscDailyKeyword.aggregate({
        where: { siteId, date: { gte: start, lte: end } },
        _sum: { clicks: true, impressions: true },
        _avg: { position: true, ctr: true },
      }),
      prisma.gscDailyKeyword.aggregate({
        where: { siteId, date: { gte: prevStart, lte: prevEnd } },
        _sum: { clicks: true, impressions: true },
        _avg: { position: true, ctr: true },
      }),
      prisma.blogPost.count({
        where: { siteId, status: "published", publishedAt: { gte: start, lte: end } },
      }),
      prisma.trackedKeyword.count({ where: { siteId } }),
    ]);

  const snapshotList = snapshots.status === "fulfilled" ? snapshots.value : [];
  const keywordTrends = keywords.status === "fulfilled" ? keywords.value : {};
  const insightList = insights.status === "fulfilled" ? insights.value : [];
  const crawlResult = crawl.status === "fulfilled" ? crawl.value : null;
  const curGsc = gscCurrent.status === "fulfilled" ? gscCurrent.value : null;
  const prevGsc = gscPrevious.status === "fulfilled" ? gscPrevious.value : null;

  const latest = snapshotList[snapshotList.length - 1];
  const previous = snapshotList.length > 1 ? snapshotList[snapshotList.length - 2] : null;

  const totalClicks = curGsc?._sum?.clicks ?? latest?.totalClicks ?? 0;
  const totalImpressions = curGsc?._sum?.impressions ?? latest?.totalImpressions ?? 0;
  const avgPosition = curGsc?._avg?.position ?? latest?.avgPosition ?? 0;
  const avgCtr = curGsc?._avg?.ctr ?? latest?.avgCtr ?? 0;

  const prevClicks = prevGsc?._sum?.clicks ?? previous?.totalClicks ?? 0;
  const prevImpressions = prevGsc?._sum?.impressions ?? previous?.totalImpressions ?? 0;
  const prevPosition = prevGsc?._avg?.position ?? previous?.avgPosition ?? 0;
  const prevCtr = prevGsc?._avg?.ctr ?? previous?.avgCtr ?? 0;

  const pct = (cur: number, prev: number) =>
    prev > 0 ? ((cur - prev) / prev) * 100 : 0;

  // Keyword movers
  const movers: { keyword: string; change: number; current: number }[] = [];
  for (const [keyword, positions] of Object.entries(keywordTrends)) {
    if (positions.length >= 2) {
      const currentPos = positions[positions.length - 1].position;
      const prevPos = positions[positions.length - 2].position;
      if (currentPos !== null && prevPos !== null) {
        const change = prevPos - currentPos;
        if (Math.abs(change) > 0.5) {
          movers.push({ keyword, change, current: currentPos });
        }
      }
    }
  }
  movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  // Top pages
  let topPages: { page: string; clicks: number; impressions: number }[] = [];
  try {
    const pages = await prisma.gscDailyPage.groupBy({
      by: ["pageUrl"],
      where: { siteId, date: { gte: start, lte: end } },
      _sum: { clicks: true, impressions: true },
      orderBy: { _sum: { clicks: "desc" } },
      take: 10,
    });
    topPages = pages.map((p) => ({
      page: p.pageUrl,
      clicks: p._sum.clicks ?? 0,
      impressions: p._sum.impressions ?? 0,
    }));
  } catch {
    /* no GSC data */
  }

  const issues = crawlResult?.issues ?? [];
  const criticalIssues = issues.filter((r: { severity: string }) => r.severity === "critical").length;
  const warningIssues = issues.filter((r: { severity: string }) => r.severity === "warning").length;

  return {
    period: formatPeriodLabel(period, start, end),
    periodType: period,
    dateRange: { start: start.toISOString(), end: end.toISOString() },
    currentHealth: latest?.healthScore ?? 0,
    previousHealth: previous?.healthScore ?? 0,
    healthDelta: (latest?.healthScore ?? 0) - (previous?.healthScore ?? 0),
    totalClicks,
    totalImpressions,
    clicksDelta: pct(totalClicks, prevClicks),
    impressionsDelta: pct(totalImpressions, prevImpressions),
    avgPosition,
    avgCtr,
    positionDelta: prevPosition > 0 ? avgPosition - prevPosition : 0,
    ctrDelta: pct(avgCtr, prevCtr),
    keywordMovers: movers.slice(0, 10),
    topPages,
    criticalIssues,
    warningIssues,
    activeInsights: insightList.length,
    topInsights: insightList.slice(0, 5).map((i) => ({
      title: i.title,
      type: i.type,
      priority: i.priority,
    })),
    publishedPosts: publishedPosts.status === "fulfilled" ? publishedPosts.value : 0,
    totalKeywordsTracked: trackedKw.status === "fulfilled" ? trackedKw.value : 0,
  };
}

/* ── Build HTML email ── */

export function buildReportHtml(data: ReportData, branding: ReportBranding): string {
  const healthColor =
    data.currentHealth >= 70 ? "#22c55e" : data.currentHealth >= 50 ? "#eab308" : "#ef4444";
  const deltaArrow = data.healthDelta >= 0 ? "\u2191" : "\u2193";
  const deltaColor = data.healthDelta >= 0 ? "#22c55e" : "#ef4444";
  const fmtDelta = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(1) + "%";

  const topPagesHtml = data.topPages.length > 0 ? '<div style="margin-bottom:24px"><h2 style="color:#fff;font-size:18px;margin:0 0 12px">\uD83D\uDCC4 Top Pages</h2><table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #333"><th style="text-align:left;padding:8px;color:#9ca3af;font-size:12px">Page</th><th style="text-align:right;padding:8px;color:#9ca3af;font-size:12px">Clicks</th></tr>' + data.topPages.slice(0, 5).map((p) => '<tr style="border-bottom:1px solid #222"><td style="padding:8px;color:#e5e7eb;font-size:13px">' + p.page.replace(/^https?:\/\/[^/]+/, "") + '</td><td style="padding:8px;color:#e5e7eb;font-size:13px;text-align:right">' + p.clicks.toLocaleString() + "</td></tr>").join("") + "</table></div>" : "";

  const moversHtml = data.keywordMovers.length > 0 ? '<div style="margin-bottom:24px"><h2 style="color:#fff;font-size:18px;margin:0 0 12px">\uD83D\uDCC8 Keyword Movers</h2><table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #333"><th style="text-align:left;padding:8px;color:#9ca3af;font-size:12px">Keyword</th><th style="text-align:right;padding:8px;color:#9ca3af;font-size:12px">Position</th><th style="text-align:right;padding:8px;color:#9ca3af;font-size:12px">Change</th></tr>' + data.keywordMovers.map((m) => '<tr style="border-bottom:1px solid #222"><td style="padding:8px;color:#e5e7eb;font-size:14px">' + m.keyword + '</td><td style="padding:8px;color:#e5e7eb;font-size:14px;text-align:right">' + m.current.toFixed(1) + '</td><td style="padding:8px;font-size:14px;text-align:right;color:' + (m.change > 0 ? "#22c55e" : "#ef4444") + '">' + (m.change > 0 ? "\u2191" : "\u2193") + " " + Math.abs(m.change).toFixed(1) + "</td></tr>").join("") + "</table></div>" : "";

  const issuesHtml = (data.criticalIssues + data.warningIssues > 0) ? '<div style="margin-bottom:24px;background:#1a1a2e;border-radius:8px;padding:16px"><h2 style="color:#fff;font-size:18px;margin:0 0 8px">\u26A0\uFE0F Issues</h2>' + (data.criticalIssues > 0 ? '<p style="color:#ef4444;margin:4px 0">\uD83D\uDD34 ' + data.criticalIssues + " critical</p>" : "") + (data.warningIssues > 0 ? '<p style="color:#eab308;margin:4px 0">\uD83D\uDFE1 ' + data.warningIssues + " warnings</p>" : "") + "</div>" : "";

  const insightsHtml = data.topInsights.length > 0 ? '<div style="margin-bottom:24px"><h2 style="color:#fff;font-size:18px;margin:0 0 12px">\uD83D\uDCA1 Top Insights</h2>' + data.topInsights.map((ins) => '<div style="background:#1a1a2e;border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid ' + (ins.priority >= 60 ? "#ef4444" : ins.priority >= 40 ? "#eab308" : "#22c55e") + '"><p style="color:#e5e7eb;font-size:14px;margin:0">' + ins.title + '</p><p style="color:#9ca3af;font-size:12px;margin:4px 0 0">' + ins.type.replace(/_/g, " ") + "</p></div>").join("") + "</div>" : "";

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;background:#0a0a0a;color:#e5e7eb;padding:24px;margin:0"><div style="max-width:600px;margin:0 auto;background:#111;border-radius:12px;padding:32px;border:1px solid #333">'
    + '<div style="text-align:center;margin-bottom:32px"><h1 style="color:#fff;font-size:24px;margin:0">' + branding.companyName + ' \u2014 SEO Report</h1><p style="color:#9ca3af;font-size:14px;margin:8px 0 0">' + data.period + "</p></div>"
    + '<div style="text-align:center;background:#1a1a2e;border-radius:12px;padding:24px;margin-bottom:24px"><p style="color:#9ca3af;font-size:14px;margin:0 0 8px">Site Health Score</p><p style="font-size:48px;font-weight:bold;color:' + healthColor + ';margin:0">' + data.currentHealth + '</p><p style="color:' + deltaColor + ";font-size:16px;margin:4px 0 0\">" + deltaArrow + " " + Math.abs(data.healthDelta).toFixed(1) + " from previous</p></div>"
    + '<div style="display:flex;gap:12px;margin-bottom:24px">'
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Clicks</p><p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">' + data.totalClicks.toLocaleString() + '</p><p style="color:' + (data.clicksDelta >= 0 ? "#22c55e" : "#ef4444") + ';font-size:11px;margin:2px 0 0">' + fmtDelta(data.clicksDelta) + "</p></div>"
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Impressions</p><p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">' + data.totalImpressions.toLocaleString() + '</p><p style="color:' + (data.impressionsDelta >= 0 ? "#22c55e" : "#ef4444") + ';font-size:11px;margin:2px 0 0">' + fmtDelta(data.impressionsDelta) + "</p></div>"
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Avg Position</p><p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">' + data.avgPosition.toFixed(1) + '</p><p style="color:' + (data.positionDelta <= 0 ? "#22c55e" : "#ef4444") + ';font-size:11px;margin:2px 0 0">' + (data.positionDelta <= 0 ? "\u2191" : "\u2193") + " " + Math.abs(data.positionDelta).toFixed(1) + "</p></div>"
    + "</div>"
    + topPagesHtml
    + moversHtml
    + issuesHtml
    + insightsHtml
    + '<div style="display:flex;gap:12px;margin-bottom:24px">'
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Posts Published</p><p style="color:#fff;font-size:20px;font-weight:bold;margin:4px 0 0">' + data.publishedPosts + "</p></div>"
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Keywords Tracked</p><p style="color:#fff;font-size:20px;font-weight:bold;margin:4px 0 0">' + data.totalKeywordsTracked + "</p></div>"
    + '<div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center"><p style="color:#9ca3af;font-size:12px;margin:0">Active Insights</p><p style="color:#fff;font-size:20px;font-weight:bold;margin:4px 0 0">' + data.activeInsights + "</p></div>"
    + "</div>"
    + '<div style="text-align:center;margin-top:32px"><a href="' + branding.siteUrl + '/admin/seo/reports" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px">View Full Report \u2192</a></div>'
    + '<p style="color:#6b7280;font-size:12px;text-align:center;margin:24px 0 0">' + branding.companyName + " \u2022 Automated " + data.periodType + " SEO report</p>"
    + "</div></body></html>";
}

/* ── Send email via Resend ── */

export async function sendReport(
  siteId: string = DEFAULT_SITE_ID,
  toOverride?: string,
  period: ReportPeriod = "monthly",
): Promise<{ success: boolean; message: string }> {
  const [reportData, branding] = await Promise.all([
    buildReportData(siteId, period),
    getReportBranding(siteId),
  ]);
  const html = buildReportHtml(reportData, branding);

  const result = await sendSeoDigest({
    to: toOverride || branding.toEmail,
    from: branding.fromEmail,
    subject: "SEO Report \u2014 Health " + reportData.currentHealth + "/100 \u2014 " + reportData.period,
    html,
  });

  if (!result.success) {
    return { success: false, message: result.error ?? "Email send failed" };
  }

  return { success: true, message: "Report sent successfully" };
}

/* ── Preview report (returns HTML string) ── */

export async function previewReport(
  siteId: string = DEFAULT_SITE_ID,
  period: ReportPeriod = "monthly",
): Promise<string> {
  const [reportData, branding] = await Promise.all([
    buildReportData(siteId, period),
    getReportBranding(siteId),
  ]);
  return buildReportHtml(reportData, branding);
}

/* ── Process scheduled report sends (called by cron) ── */

export async function processScheduledReports(siteId: string = DEFAULT_SITE_ID): Promise<number> {
  const now = new Date();
  const prefs = await prisma.reportPreference.findMany({
    where: { siteId, enabled: true },
    include: { user: true },
  });

  let sent = 0;
  for (const pref of prefs) {
    const shouldSend = checkShouldSend(
      pref.frequency as ReportPeriod,
      pref.lastSentAt,
      now,
      pref.dayOfWeek,
      pref.dayOfMonth,
    );
    if (!shouldSend) continue;

    try {
      const result = await sendReport(siteId, pref.email, pref.frequency as ReportPeriod);
      if (result.success) {
        await prisma.reportPreference.update({
          where: { id: pref.id },
          data: { lastSentAt: now },
        });
        sent++;
      }
    } catch {
      console.error("Failed to send report to " + pref.email);
    }
  }

  return sent;
}

function checkShouldSend(
  frequency: ReportPeriod,
  lastSentAt: Date | null,
  now: Date,
  dayOfWeek: number,
  dayOfMonth: number,
): boolean {
  if (!lastSentAt) return true;

  const daysSinceLast = (now.getTime() - lastSentAt.getTime()) / (1000 * 60 * 60 * 24);

  switch (frequency) {
    case "weekly":
      return daysSinceLast >= 6 && now.getDay() === dayOfWeek;
    case "monthly":
      return daysSinceLast >= 25 && now.getDate() === dayOfMonth;
    case "quarterly":
      return daysSinceLast >= 80 && now.getDate() === dayOfMonth && [0, 3, 6, 9].includes(now.getMonth());
    case "yearly":
      return daysSinceLast >= 350 && now.getMonth() === 0 && now.getDate() === dayOfMonth;
  }
}
