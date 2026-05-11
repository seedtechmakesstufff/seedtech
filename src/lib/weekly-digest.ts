/* ── Weekly Digest Email ──
 * Assembles a Monday-morning email summarizing what agents did last week and
 * what they're recommending for this week. Pulls from:
 *   - CronJobRun (what ran, durations, success/fail)
 *   - Event log (last 7 days)
 *   - SeoStrategyDoc (the latest analyst-authored brief)
 *   - AgentArtifact (pending review queue)
 *
 * Sent via Resend through the existing sendEmail helper.
 */

import { prisma } from "@/lib/prisma";
import { sendEmail, type EmailResult } from "@/lib/email";
import { getEmailBranding } from "@/lib/email";

const ANALYST_SOURCE = "ai-strategy-analyst";

export interface DigestOptions {
  siteId: string;
  /** Optional override; otherwise we resolve recipients from ReportPreference / EmailConfig / env */
  recipient?: string;
  appBaseUrl?: string;        // defaults to NEXTAUTH_URL or seedtechllc.com
}

/**
 * Resolve who should receive the digest for this site, in priority order:
 *   1. Explicit override (testing / manual trigger)
 *   2. EmailConfig.reportToEmail (edited via /admin/seo/agents Digest tab)
 *   3. ReportPreference rows (legacy — pre-Autopilot monthly report feature)
 *   4. WEEKLY_DIGEST_RECIPIENT env var
 *   5. Hardcoded SeedTech default
 */
export async function resolveDigestRecipients(
  siteId: string,
  override?: string
): Promise<string[]> {
  if (override) return [override];

  const emailConfig = await prisma.emailConfig.findUnique({
    where: { siteId },
    select: { reportToEmail: true },
  });
  if (emailConfig?.reportToEmail) {
    const list = emailConfig.reportToEmail.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }

  const prefs = await prisma.reportPreference.findMany({
    where: { siteId, enabled: true },
    select: { email: true },
  });
  if (prefs.length > 0) return Array.from(new Set(prefs.map((p) => p.email).filter(Boolean)));

  if (process.env.WEEKLY_DIGEST_RECIPIENT) return [process.env.WEEKLY_DIGEST_RECIPIENT];
  return ["sswaynos@seedtechllc.com"];
}

export async function sendWeeklyDigest(opts: DigestOptions): Promise<EmailResult> {
  // Prefer an explicit digest base URL — NEXTAUTH_URL captures whatever port
  // the dev server happened to be on, which is wrong for emails that may
  // outlive the dev session.
  const baseUrl =
    opts.appBaseUrl ??
    process.env.WEEKLY_DIGEST_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "https://seedtechllc.com";

  const branding = await getEmailBranding(opts.siteId);

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 7);

  const [site, runs, events, latestBrief, pendingArtifacts, gbpIdeas] = await Promise.all([
    prisma.site.findUnique({ where: { id: opts.siteId }, select: { name: true } }),
    prisma.cronJobRun.findMany({
      where: { siteId: opts.siteId, startedAt: { gte: since } },
      orderBy: { startedAt: "desc" },
      take: 100,
    }),
    prisma.event.findMany({
      where: { siteId: opts.siteId, occurredAt: { gte: since } },
      orderBy: { occurredAt: "desc" },
      take: 200,
    }),
    prisma.seoStrategyDoc.findFirst({
      where: { siteId: opts.siteId, source: ANALYST_SOURCE, isActive: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.agentArtifact.findMany({
      where: { siteId: opts.siteId, state: "pending_review" },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    // GBP post ideas pending review — surfaced separately in the digest
    prisma.agentArtifact.findMany({
      where: { siteId: opts.siteId, type: "gbp_post_draft", state: "pending_review" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Aggregate runs by jobType
  const jobsByType = new Map<string, { ok: number; fail: number; ms: number }>();
  for (const r of runs) {
    const cur = jobsByType.get(r.jobType) ?? { ok: 0, fail: 0, ms: 0 };
    if (r.status === "completed") cur.ok++;
    else if (r.status === "failed") cur.fail++;
    cur.ms += r.durationMs ?? 0;
    jobsByType.set(r.jobType, cur);
  }

  // Aggregate events by type with counts (group repetitive ones)
  const eventCounts = new Map<string, number>();
  for (const e of events) eventCounts.set(e.type, (eventCounts.get(e.type) ?? 0) + 1);

  // Pull a few notable events to surface verbatim
  const notable = events
    .filter((e) => e.severity === "warn" || e.severity === "critical")
    .slice(0, 6);

  const html = renderDigestHtml({
    siteName: site?.name ?? "Your site",
    weekOf: new Date().toISOString().slice(0, 10),
    appBaseUrl: baseUrl,
    jobsByType: Array.from(jobsByType.entries()).map(([type, v]) => ({ type, ...v })),
    eventCounts: Array.from(eventCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count })),
    notable: notable.map((e) => ({
      type: e.type,
      title: e.title,
      severity: e.severity,
      occurredAt: e.occurredAt,
    })),
    briefMarkdown: latestBrief?.content ?? null,
    briefUpdatedAt: latestBrief?.updatedAt ?? null,
    pendingArtifacts: pendingArtifacts.map((a) => ({
      id: a.id,
      title: a.title,
      agent: a.agent,
      type: a.type,
      createdAt: a.createdAt,
    })),
    gbpIdeas: gbpIdeas.map((a) => ({
      id: a.id,
      title: a.title,
      topicType: String((a.payload as Record<string, unknown>)?.topicType ?? "STANDARD"),
      summary: String((a.payload as Record<string, unknown>)?.summary ?? "").slice(0, 120),
      imagePrompt: String((a.payload as Record<string, unknown>)?.imagePrompt ?? ""),
      reasoning: String((a.payload as Record<string, unknown>)?.reasoning ?? ""),
    })),
    branding,
  });

  const recipients = await resolveDigestRecipients(opts.siteId, opts.recipient);
  return sendEmail({
    to: recipients,
    subject: `[${site?.name ?? "Site"}] Weekly Autopilot Digest — ${new Date().toLocaleDateString()}`,
    html,
  });
}

/* ── Renderer ── */

interface DigestData {
  siteName: string;
  weekOf: string;
  appBaseUrl: string;
  jobsByType: { type: string; ok: number; fail: number; ms: number }[];
  eventCounts: { type: string; count: number }[];
  notable: { type: string; title: string; severity: string; occurredAt: Date }[];
  briefMarkdown: string | null;
  briefUpdatedAt: Date | null;
  pendingArtifacts: { id: string; title: string; agent: string; type: string; createdAt: Date }[];
  gbpIdeas: { id: string; title: string; topicType: string; summary: string; imagePrompt: string; reasoning: string }[];
  branding: Awaited<ReturnType<typeof getEmailBranding>>;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function mdToBasicHtml(md: string): string {
  // Lightweight: headings, bullets, bold, paragraphs. The brief is markdown
  // we generate ourselves so we don't need a full parser.
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2 style="font-size:20px;margin:24px 0 8px;color:#0a0a0f;">${escapeHtml(line.slice(2))}</h2>`);
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3 style="font-size:16px;margin:20px 0 6px;color:#0a0a0f;">${escapeHtml(line.slice(3))}</h3>`);
    } else if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h4 style="font-size:14px;margin:16px 0 4px;color:#0a0a0f;">${escapeHtml(line.slice(4))}</h4>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) { out.push("<ul style=\"margin:0 0 12px 20px;padding:0;\">"); inList = true; }
      out.push(`<li style="margin:4px 0;">${escapeHtml(line.slice(2))}</li>`);
    } else if (line.startsWith("> ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<blockquote style="border-left:3px solid #40A660;padding:4px 12px;margin:12px 0;color:#444;">${escapeHtml(line.slice(2))}</blockquote>`);
    } else if (line === "") {
      if (inList) { out.push("</ul>"); inList = false; }
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      // Inline bold
      const inline = escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      out.push(`<p style="margin:8px 0;line-height:1.55;">${inline}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function renderDigestHtml(d: DigestData): string {
  const inboxUrl = `${d.appBaseUrl}/admin/inbox`;
  const strategyUrl = `${d.appBaseUrl}/admin/seo`;

  const jobsRows = d.jobsByType.length === 0
    ? `<tr><td style="padding:8px;color:#666;">No agent runs in the last 7 days.</td></tr>`
    : d.jobsByType.map((j) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(j.type)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;color:#16a34a;">${j.ok} ✓</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;color:${j.fail > 0 ? "#dc2626" : "#999"};">${j.fail} ✗</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;color:#666;">${Math.round(j.ms / 1000)}s</td>
        </tr>
      `).join("");

  const eventsRows = d.eventCounts.length === 0
    ? `<tr><td style="padding:8px;color:#666;">No events recorded.</td></tr>`
    : d.eventCounts.slice(0, 12).map((e) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;">${escapeHtml(e.type)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${e.count}</td>
        </tr>
      `).join("");

  const notableHtml = d.notable.length === 0 ? "" : `
    <h3 style="font-size:14px;margin:20px 0 6px;color:#0a0a0f;">Worth a closer look</h3>
    <ul style="margin:0 0 12px 20px;padding:0;">
      ${d.notable.map((e) => `<li style="margin:4px 0;color:${e.severity === "critical" ? "#dc2626" : "#b45309"};">${escapeHtml(e.title)} <span style="color:#999;font-size:12px;">— ${e.occurredAt.toLocaleDateString()}</span></li>`).join("")}
    </ul>
  `;

  const briefHtml = d.briefMarkdown
    ? mdToBasicHtml(d.briefMarkdown)
    : `<p style="color:#666;">No analyst brief yet — run the Strategy Analyst once GA4 has a few days of data.</p>`;

  const inboxBlock = d.pendingArtifacts.length === 0 ? `
    <p style="color:#666;margin:8px 0;">No items waiting for review.</p>
  ` : `
    <p style="margin:8px 0;color:#444;">${d.pendingArtifacts.length} draft${d.pendingArtifacts.length === 1 ? "" : "s"} waiting for your approval.</p>
    <ul style="margin:8px 0 0 20px;padding:0;">
      ${d.pendingArtifacts.slice(0, 8).map((a) => `<li style="margin:4px 0;">${escapeHtml(a.title)} <span style="color:#999;font-size:12px;">(${escapeHtml(a.agent)})</span></li>`).join("")}
    </ul>
  `;

  // GBP content ideas block — separate callout so it's easy to act on
  const gbpBlock = d.gbpIdeas.length === 0 ? "" : `
    <div style="background:#f0f4ff;border:1px solid #c7d7f7;border-radius:12px;padding:16px;margin:0 0 24px;">
      <h2 style="font-size:18px;margin:0 0 4px;color:#0a0a0f;">📍 Google My Business — ${d.gbpIdeas.length} post idea${d.gbpIdeas.length === 1 ? "" : "s"} ready</h2>
      <p style="font-size:13px;color:#555;margin:0 0 12px;">Each idea needs an image upload before it can be published. Open the Inbox to upload a photo, edit the copy, and approve.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:rgba(0,0,0,0.04);">
          <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #d6e0f7;color:#555;font-weight:600;">Idea</th>
          <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #d6e0f7;color:#555;font-weight:600;">Type</th>
          <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #d6e0f7;color:#555;font-weight:600;">Image suggestion</th>
          <th style="padding:6px 8px;text-align:right;border-bottom:1px solid #d6e0f7;color:#555;font-weight:600;">Action</th>
        </tr></thead>
        <tbody>
          ${d.gbpIdeas.map((g) => `
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e8eef8;vertical-align:top;">
                <div style="font-weight:600;color:#0a0a0f;">${escapeHtml(g.title)}</div>
                <div style="color:#555;font-size:12px;margin-top:2px;">${escapeHtml(g.summary)}${g.summary.length >= 120 ? "…" : ""}</div>
              </td>
              <td style="padding:8px;border-bottom:1px solid #e8eef8;vertical-align:top;">
                <span style="background:#e0e8ff;color:#3050c0;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;">${escapeHtml(g.topicType)}</span>
              </td>
              <td style="padding:8px;border-bottom:1px solid #e8eef8;font-size:12px;color:#666;vertical-align:top;font-style:italic;">${escapeHtml(g.imagePrompt)}</td>
              <td style="padding:8px;border-bottom:1px solid #e8eef8;text-align:right;vertical-align:top;">
                <a href="${inboxUrl}" style="color:#3b82f6;text-decoration:underline;font-size:12px;white-space:nowrap;">Add image &amp; approve →</a>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  const body = `
    <p style="margin:0 0 16px;color:#666;">Week of ${escapeHtml(d.weekOf)}</p>

    <div style="background:#f5fbf6;border:1px solid #d6f0d9;border-radius:12px;padding:16px;margin:0 0 24px;">
      <h2 style="font-size:18px;margin:0 0 8px;color:#0a0a0f;">Inbox: ${d.pendingArtifacts.length} pending</h2>
      ${inboxBlock}
      <p style="margin:12px 0 0;">
        <a href="${inboxUrl}" style="display:inline-block;background:#40A660;color:#0a0a0f;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Open Inbox →</a>
      </p>
    </div>

    ${gbpBlock}

    <h2 style="font-size:20px;margin:24px 0 8px;color:#0a0a0f;">This week's strategy brief</h2>
    ${d.briefUpdatedAt ? `<p style="font-size:12px;color:#999;margin:0 0 8px;">Generated ${d.briefUpdatedAt.toLocaleString()}</p>` : ""}
    ${briefHtml}
    <p style="margin:16px 0 0;"><a href="${strategyUrl}" style="color:#40A660;text-decoration:underline;font-size:13px;">View on the Strategy tab →</a></p>

    <h2 style="font-size:20px;margin:32px 0 8px;color:#0a0a0f;">Agent runs (last 7 days)</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#fafafa;">
        <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #eee;color:#666;font-weight:600;">Job</th>
        <th style="padding:6px 8px;text-align:right;border-bottom:1px solid #eee;color:#666;font-weight:600;">OK</th>
        <th style="padding:6px 8px;text-align:right;border-bottom:1px solid #eee;color:#666;font-weight:600;">Fail</th>
        <th style="padding:6px 8px;text-align:right;border-bottom:1px solid #eee;color:#666;font-weight:600;">Total time</th>
      </tr></thead>
      <tbody>${jobsRows}</tbody>
    </table>

    <h2 style="font-size:20px;margin:32px 0 8px;color:#0a0a0f;">Events (last 7 days)</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#fafafa;">
        <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #eee;color:#666;font-weight:600;">Type</th>
        <th style="padding:6px 8px;text-align:right;border-bottom:1px solid #eee;color:#666;font-weight:600;">Count</th>
      </tr></thead>
      <tbody>${eventsRows}</tbody>
    </table>
    ${notableHtml}
  `;

  const headerLogo = d.branding.logoUrl
    ? `<img src="${d.branding.logoUrl}" alt="${escapeHtml(d.branding.companyName)} logo" height="48" style="max-height:48px;max-width:240px;display:block;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;">${escapeHtml(d.branding.companyName)}</span>`;
  const footerDomain = d.branding.domain ? `<br /><a href="https://${d.branding.domain}" style="color:#4ade80;text-decoration:none;">${escapeHtml(d.branding.domain)}</a>` : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>${escapeHtml(d.siteName)} — Weekly Autopilot Digest</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0e1117;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">${headerLogo}</td></tr>
        <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0e1117;">${escapeHtml(d.siteName)} — Weekly Autopilot Digest</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">${escapeHtml(d.branding.companyName)}${footerDomain}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
