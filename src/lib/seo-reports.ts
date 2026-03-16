/* ── SEO Email Reports ──
 * Build and send weekly/monthly SEO digest emails.
 * Uses a simple HTML template emailed via Resend or any SMTP endpoint.
 */

import { getSnapshotHistory, getKeywordTrends } from "@/lib/seo-snapshot";
import { getActiveInsights } from "@/lib/seo-insights";
import { getLatestCrawlResults } from "@/lib/seo-crawler";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REPORT_FROM = process.env.REPORT_FROM_EMAIL || "seo@seedtechllc.com";
const REPORT_TO = process.env.REPORT_TO_EMAIL || "admin@seedtechllc.com";

/* ── Types ── */

export interface ReportData {
  period: string;
  currentHealth: number;
  previousHealth: number;
  healthDelta: number;
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  avgCtr: number;
  keywordMovers: { keyword: string; change: number; current: number }[];
  criticalIssues: number;
  warningIssues: number;
  activeInsights: number;
  topInsights: { title: string; type: string; priority: number }[];
}

/* ── Build report data ── */

export async function buildReportData(): Promise<ReportData> {
  const [snapshots, keywords, insights, crawl] = await Promise.allSettled([
    getSnapshotHistory(2),
    getKeywordTrends(2),
    getActiveInsights(),
    getLatestCrawlResults(),
  ]);

  const snapshotList = snapshots.status === "fulfilled" ? snapshots.value : [];
  const keywordTrends = keywords.status === "fulfilled" ? keywords.value : {};
  const insightList = insights.status === "fulfilled" ? insights.value : [];
  const crawlResult = crawl.status === "fulfilled" ? crawl.value : null;

  const latest = snapshotList[snapshotList.length - 1];
  const previous = snapshotList.length > 1 ? snapshotList[snapshotList.length - 2] : null;

  // Calculate keyword movers (biggest position changes)
  const movers: { keyword: string; change: number; current: number }[] = [];
  for (const [keyword, positions] of Object.entries(keywordTrends)) {
    if (positions.length >= 2) {
      const currentPos = positions[positions.length - 1].position;
      const prevPos = positions[positions.length - 2].position;
      if (currentPos !== null && prevPos !== null) {
        const change = prevPos - currentPos; // positive = improved (lower position is better)
        if (Math.abs(change) > 0.5) {
          movers.push({ keyword, change, current: currentPos });
        }
      }
    }
  }
  movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  const issues = crawlResult?.issues ?? [];
  const criticalIssues = issues.filter((r: { severity: string }) => r.severity === "critical").length;
  const warningIssues = issues.filter((r: { severity: string }) => r.severity === "warning").length;

  return {
    period: `${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    currentHealth: latest?.healthScore ?? 0,
    previousHealth: previous?.healthScore ?? 0,
    healthDelta: (latest?.healthScore ?? 0) - (previous?.healthScore ?? 0),
    totalClicks: latest?.totalClicks ?? 0,
    totalImpressions: latest?.totalImpressions ?? 0,
    avgPosition: latest?.avgPosition ?? 0,
    avgCtr: latest?.avgCtr ?? 0,
    keywordMovers: movers.slice(0, 10),
    criticalIssues,
    warningIssues,
    activeInsights: insightList.length,
    topInsights: insightList.slice(0, 5).map((i) => ({
      title: i.title,
      type: i.type,
      priority: i.priority,
    })),
  };
}

/* ── Build HTML email ── */

export function buildReportHtml(data: ReportData): string {
  const healthColor = data.currentHealth >= 70 ? "#22c55e" : data.currentHealth >= 50 ? "#eab308" : "#ef4444";
  const deltaArrow = data.healthDelta >= 0 ? "↑" : "↓";
  const deltaColor = data.healthDelta >= 0 ? "#22c55e" : "#ef4444";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e7eb;padding:24px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#111;border-radius:12px;padding:32px;border:1px solid #333">

  <div style="text-align:center;margin-bottom:32px">
    <h1 style="color:#fff;font-size:24px;margin:0">🌱 SeedTech SEO Report</h1>
    <p style="color:#9ca3af;font-size:14px;margin:8px 0 0">${data.period}</p>
  </div>

  <!-- Health Score -->
  <div style="text-align:center;background:#1a1a2e;border-radius:12px;padding:24px;margin-bottom:24px">
    <p style="color:#9ca3af;font-size:14px;margin:0 0 8px">Site Health Score</p>
    <p style="font-size:48px;font-weight:bold;color:${healthColor};margin:0">${data.currentHealth}</p>
    <p style="color:${deltaColor};font-size:16px;margin:4px 0 0">${deltaArrow} ${Math.abs(data.healthDelta).toFixed(1)} from previous</p>
  </div>

  <!-- Key Metrics -->
  <div style="display:flex;gap:12px;margin-bottom:24px">
    <div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">Clicks</p>
      <p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">${data.totalClicks.toLocaleString()}</p>
    </div>
    <div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">Impressions</p>
      <p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">${data.totalImpressions.toLocaleString()}</p>
    </div>
    <div style="flex:1;background:#1a1a2e;border-radius:8px;padding:16px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">Avg Position</p>
      <p style="color:#fff;font-size:24px;font-weight:bold;margin:4px 0 0">${data.avgPosition.toFixed(1)}</p>
    </div>
  </div>

  <!-- Keyword Movers -->
  ${data.keywordMovers.length > 0 ? `
  <div style="margin-bottom:24px">
    <h2 style="color:#fff;font-size:18px;margin:0 0 12px">📈 Keyword Movers</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr style="border-bottom:1px solid #333">
        <th style="text-align:left;padding:8px;color:#9ca3af;font-size:12px">Keyword</th>
        <th style="text-align:right;padding:8px;color:#9ca3af;font-size:12px">Position</th>
        <th style="text-align:right;padding:8px;color:#9ca3af;font-size:12px">Change</th>
      </tr>
      ${data.keywordMovers.map((m) => `
      <tr style="border-bottom:1px solid #222">
        <td style="padding:8px;color:#e5e7eb;font-size:14px">${m.keyword}</td>
        <td style="padding:8px;color:#e5e7eb;font-size:14px;text-align:right">${m.current.toFixed(1)}</td>
        <td style="padding:8px;font-size:14px;text-align:right;color:${m.change > 0 ? "#22c55e" : "#ef4444"}">${m.change > 0 ? "↑" : "↓"} ${Math.abs(m.change).toFixed(1)}</td>
      </tr>`).join("")}
    </table>
  </div>` : ""}

  <!-- Issues -->
  ${data.criticalIssues + data.warningIssues > 0 ? `
  <div style="margin-bottom:24px;background:#1a1a2e;border-radius:8px;padding:16px">
    <h2 style="color:#fff;font-size:18px;margin:0 0 8px">⚠️ Site Audit Issues</h2>
    ${data.criticalIssues > 0 ? `<p style="color:#ef4444;margin:4px 0">🔴 ${data.criticalIssues} critical issue(s)</p>` : ""}
    ${data.warningIssues > 0 ? `<p style="color:#eab308;margin:4px 0">🟡 ${data.warningIssues} warning(s)</p>` : ""}
  </div>` : ""}

  <!-- Insights -->
  ${data.topInsights.length > 0 ? `
  <div style="margin-bottom:24px">
    <h2 style="color:#fff;font-size:18px;margin:0 0 12px">💡 Top Insights</h2>
    ${data.topInsights.map((ins) => `
    <div style="background:#1a1a2e;border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid ${ins.priority >= 60 ? "#ef4444" : ins.priority >= 40 ? "#eab308" : "#22c55e"}">
      <p style="color:#e5e7eb;font-size:14px;margin:0">${ins.title}</p>
      <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">${ins.type.replace(/_/g, " ")}</p>
    </div>`).join("")}
  </div>` : ""}

  <!-- CTA -->
  <div style="text-align:center;margin-top:32px">
    <a href="${SITE_URL}/admin/seo" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px">
      View Full Dashboard →
    </a>
  </div>

  <p style="color:#6b7280;font-size:12px;text-align:center;margin:24px 0 0">
    SeedTech SEO Autopilot • Automated weekly report
  </p>

</div>
</body>
</html>`.trim();
}

/* ── Send email via Resend ── */

export async function sendReport(to?: string): Promise<{ success: boolean; message: string }> {
  const reportData = await buildReportData();
  const html = buildReportHtml(reportData);

  if (!RESEND_API_KEY) {
    // If Resend not configured, return the HTML for preview
    return {
      success: false,
      message: "RESEND_API_KEY not configured. Report generated but not sent.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: REPORT_FROM,
        to: to || REPORT_TO,
        subject: `SEO Report — Health ${reportData.currentHealth}/100 — ${reportData.period}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Email send failed: ${JSON.stringify(err)}`,
      };
    }

    return { success: true, message: "Report sent successfully" };
  } catch (err) {
    return {
      success: false,
      message: `Email send error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/* ── Preview report (returns HTML string) ── */

export async function previewReport(): Promise<string> {
  const reportData = await buildReportData();
  return buildReportHtml(reportData);
}
