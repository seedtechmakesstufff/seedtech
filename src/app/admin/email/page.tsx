"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Send,
  Eye,
  Edit3,
  RotateCcw,
  Save,
  ExternalLink,
  Info,
  Zap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

type Tab = "overview" | "templates";

interface ConnectionStatus {
  ok: boolean;
  keyMasked?: string;
  verifiedDomains?: string[];
  pendingDomains?: string[];
  domainCount?: number;
  message: string;
}

interface EmailTemplate {
  key: string;
  label: string;
  description: string;
  trigger: string;
  subject: string;
  heading: string;
  body: string;
  enabled: boolean;
  isCustomized: boolean;
  defaultSubject: string;
  defaultHeading: string;
  defaultBody: string;
}

/* ═══════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════ */

export default function EmailPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Mail className="w-7 h-7 text-seed-400" />
          Email Automations
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Resend integration status, editable transactional templates, and delivery settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-raised rounded-xl border border-white/[0.06] w-fit">
        {(["overview", "templates"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t
                ? "bg-dark-elevated text-white shadow-sm border border-white/[0.08]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t === "overview"  && "Overview"}
            {t === "templates" && "Templates"}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "overview"  && <OverviewTab />}
      {tab === "templates" && <TemplatesTab />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Overview Tab
   ═══════════════════════════════════════════════════════════════ */

function OverviewTab() {
  const [envVars, setEnvVars]   = useState<Record<string, boolean>>({});
  const [connection, setConnection] = useState<ConnectionStatus | null>(null);
  const [testing, setTesting]   = useState(false);

  // Email config (DB-editable)
  const [cfg, setCfg] = useState({ fromAddress: "", notifyRecipients: "", reportFromEmail: "", reportToEmail: "" });
  const [cfgSources, setCfgSources] = useState<Record<string, string>>({});
  const [cfgSaving, setCfgSaving] = useState(false);
  const [cfgMsg, setCfgMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [cfgLoaded, setCfgLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/env-status")
      .then((r) => { if (!r.ok) throw new Error(`env-status ${r.status}`); return r.json(); })
      .then(setEnvVars)
      .catch((e) => console.warn("[email page] env-status:", e));
    fetch("/api/admin/email/config")
      .then((r) => r.json())
      .then((d) => {
        setCfg({
          fromAddress:      d.fromAddress      ?? "",
          notifyRecipients: d.notifyRecipients ?? "",
          reportFromEmail:  d.reportFromEmail  ?? "",
          reportToEmail:    d.reportToEmail    ?? "",
        });
        setCfgSources({
          fromAddress:      d.sourceFromAddress,
          notifyRecipients: d.sourceNotifyRecipients,
          reportFromEmail:  d.sourceReportFrom,
          reportToEmail:    d.sourceReportTo,
        });
        setCfgLoaded(true);
      })
      .catch(() => setCfgLoaded(true));
  }, []);

  const saveConfig = async () => {
    setCfgSaving(true);
    setCfgMsg(null);
    try {
      const res = await fetch("/api/admin/email/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (res.ok) {
        setCfgMsg({ ok: true, text: "Settings saved." });
        // Refresh sources
        const d = await res.json();
        void d; // saved — re-fetch to update source badges
        const fresh = await fetch("/api/admin/email/config").then((r) => r.json());
        setCfgSources({
          fromAddress:      fresh.sourceFromAddress,
          notifyRecipients: fresh.sourceNotifyRecipients,
          reportFromEmail:  fresh.sourceReportFrom,
          reportToEmail:    fresh.sourceReportTo,
        });
      } else {
        setCfgMsg({ ok: false, text: "Save failed — check console." });
      }
    } catch {
      setCfgMsg({ ok: false, text: "Request failed." });
    }
    setCfgSaving(false);
  };

  const testConnection = async () => {
    setTesting(true);
    setConnection(null);
    try {
      const res = await fetch("/api/admin/email/test-connection", { method: "POST" });
      setConnection(await res.json());
    } catch {
      setConnection({ ok: false, message: "Request failed" });
    }
    setTesting(false);
  };

  const resendKeySet = envVars.RESEND_API_KEY ?? false;

  return (
    <div className="space-y-6">
      {/* ── Status row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          label="API Key"
          present={resendKeySet}
          detail="RESEND_API_KEY"
          help="Get your key at resend.com/api-keys"
          href="https://resend.com/api-keys"
        />
        <StatusCard
          label="From Address"
          present={!!cfg.fromAddress}
          detail={cfg.fromAddress || "Not set"}
          help="Must match a verified domain in Resend"
          source={cfgSources.fromAddress}
        />
        <StatusCard
          label="Notify Recipients"
          present={!!cfg.notifyRecipients}
          detail={cfg.notifyRecipients || "Not set"}
          help="Who receives internal form notifications"
          optional
          source={cfgSources.notifyRecipients}
        />
      </div>

      {/* ── Email Config Editor ────────────────────────────────── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-seed-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Sender &amp; Recipients</h3>
            <p className="text-xs text-white/40">
              Saved to the database — overrides environment variables at runtime.
            </p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {!cfgLoaded ? (
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              {/* From address */}
              <ConfigField
                label="From Address"
                hint="e.g. SeedTech <hello@seedtechllc.com>"
                value={cfg.fromAddress}
                onChange={(v) => setCfg((p) => ({ ...p, fromAddress: v }))}
                source={cfgSources.fromAddress}
                placeholder="SeedTech <hello@seedtechllc.com>"
              />

              {/* Notify recipients */}
              <ConfigField
                label="Notification Recipients"
                hint="Comma-separated — receives alerts for new contact &amp; quote submissions"
                value={cfg.notifyRecipients}
                onChange={(v) => setCfg((p) => ({ ...p, notifyRecipients: v }))}
                source={cfgSources.notifyRecipients}
                placeholder="sam@seedtechllc.com, moliva@seedtechllc.com"
              />

              {/* SEO report emails */}
              <div className="pt-1 border-t border-white/[0.04]">
                <p className="text-xs text-white/30 mb-4 uppercase tracking-wide">SEO Digest Report</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ConfigField
                    label="Report From"
                    hint="Sender for weekly SEO digests"
                    value={cfg.reportFromEmail}
                    onChange={(v) => setCfg((p) => ({ ...p, reportFromEmail: v }))}
                    source={cfgSources.reportFromEmail}
                    placeholder="seo@seedtechllc.com"
                  />
                  <ConfigField
                    label="Report To"
                    hint="Who receives the SEO digest"
                    value={cfg.reportToEmail}
                    onChange={(v) => setCfg((p) => ({ ...p, reportToEmail: v }))}
                    source={cfgSources.reportToEmail}
                    placeholder="sam@seedtechllc.com"
                  />
                </div>
              </div>

              {/* Save row */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={saveConfig}
                  disabled={cfgSaving}
                  className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {cfgSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {cfgSaving ? "Saving…" : "Save Settings"}
                </button>
                {cfgMsg && (
                  <span className={cn("flex items-center gap-1.5 text-xs", cfgMsg.ok ? "text-green-400" : "text-red-400")}>
                    {cfgMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {cfgMsg.text}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Connection Test ────────────────────────────────────── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-seed-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Connection Test</h3>
            <p className="text-xs text-white/40">Verify your Resend API key and domain verification status.</p>
          </div>
          {connection && (
            <div className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border",
              connection.ok
                ? "text-green-400 bg-green-500/10 border-green-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
            )}>
              {connection.ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {connection.ok ? "Connected" : "Failed"}
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          {connection && (
            <div className={cn("flex items-start gap-3 px-4 py-3 rounded-lg border",
              connection.ok ? "bg-green-500/5 border-green-500/15" : "bg-red-500/5 border-red-500/15"
            )}>
              {connection.ok
                ? <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                : <XCircle    className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
              <div className="space-y-1 flex-1">
                <p className={cn("text-sm", connection.ok ? "text-green-300" : "text-red-300")}>
                  {connection.message}
                </p>
                {connection.keyMasked && (
                  <p className="text-xs text-white/30 font-mono">Key: {connection.keyMasked}</p>
                )}
                {(connection.verifiedDomains?.length ?? 0) > 0 || (connection.pendingDomains?.length ?? 0) > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {connection.verifiedDomains?.map((d) => (
                      <span key={d} className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        ✓ {d}
                      </span>
                    ))}
                    {connection.pendingDomains?.map((d) => (
                      <span key={d} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ⏳ {d} (pending)
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={testConnection}
              disabled={testing}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {testing ? "Testing…" : "Test Connection"}
            </button>
            <a
              href="https://resend.com/domains"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Manage Domains <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Env Variables ─────────────────────────────────────── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Info className="w-4 h-4 text-white/40" />
          <div>
            <h3 className="text-sm font-semibold text-white">Environment Variables</h3>
            <p className="text-xs text-white/30 mt-0.5">Fallback values — DB settings above take priority when set.</p>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <EnvRow name="RESEND_API_KEY"    present={envVars.RESEND_API_KEY} />
          <EnvRow name="EMAIL_FROM"        present={envVars.EMAIL_FROM}         optional />
          <EnvRow name="EMAIL_NOTIFY"      present={envVars.EMAIL_NOTIFY}       optional />
          <EnvRow name="REPORT_FROM_EMAIL" present={envVars.REPORT_FROM_EMAIL}  optional />
          <EnvRow name="REPORT_TO_EMAIL"   present={envVars.REPORT_TO_EMAIL}    optional />
          <p className="text-xs text-white/25 pt-3">
            Set in <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code> (dev) or Vercel
            Settings → Environment Variables (production). The DB settings above override these at runtime.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Templates Tab
   ═══════════════════════════════════════════════════════════════ */

function TemplatesTab() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<EmailTemplate>>({});
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ key: string; ok: boolean; text: string } | null>(null);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/email/templates");
    const data = await res.json();
    setTemplates(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Fetch logo so the preview iframe can show it (relative path works fine in-browser)
  useEffect(() => {
    fetch("/api/admin/branding/logo")
      .then((r) => r.json())
      .then((d) => setLogoUrl(d.logoUrl ?? null))
      .catch(() => {});
  }, []);

  const startEdit = (t: EmailTemplate) => {
    setEditing(t.key);
    setDraft({ subject: t.subject, heading: t.heading, body: t.body, enabled: t.enabled });
    setPreview(null);
    setSaveMsg(null);
  };

  const cancelEdit = () => { setEditing(null); setDraft({}); setPreview(null); };

  const save = async (key: string) => {
    setSaving(true);
    const res = await fetch("/api/admin/email/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, ...draft }),
    });
    const ok = res.ok;
    setSaveMsg({ key, ok, text: ok ? "Saved successfully." : "Save failed — try again." });
    if (ok) { await load(); setEditing(null); setDraft({}); }
    setSaving(false);
  };

  const resetTemplate = async (key: string) => {
    setResetting(key);
    await fetch(`/api/admin/email/templates?key=${key}`, { method: "DELETE" });
    await load();
    if (editing === key) cancelEdit();
    setResetting(null);
  };

  const toggleEnabled = async (key: string, enabled: boolean) => {
    await fetch("/api/admin/email/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    setTemplates((prev) => prev.map((t) => t.key === key ? { ...t, enabled } : t));
  };

  const buildPreview = (t: EmailTemplate, d: Partial<EmailTemplate>) => {
    const heading = d.heading ?? t.heading;
    const body = d.body ?? t.body;
    const headerContent = logoUrl
      ? `<img src="${logoUrl}" alt="Logo" height="44" style="max-height:44px;max-width:220px;object-fit:contain;display:block;margin:0 auto;" />`
      : `<span style="font-size:20px;font-weight:700;color:#fff;">Seed<span style="color:#4ade80;">Tech</span></span>`;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td style="background:#0e1117;border-radius:12px 12px 0 0;padding:28px 36px;text-align:center;">
          ${headerContent}
        </td></tr>
        <tr><td style="background:#fff;padding:36px;border-radius:0 0 12px 12px;">
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0e1117;">${heading}</h1>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
          ${body.split("\n").map((p: string) => p ? `<p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 14px;">${p}</p>` : "").join("")}
        </td></tr>
        <tr><td style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">SeedTech LLC · Northern New Jersey</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
    setPreview(html);
  };

  if (loading) return <div className="text-center py-20 text-white/30"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      {/* Test email modal */}
      {testingKey && (
        <TestEmailModal
          templateKey={testingKey}
          templateLabel={templates.find((t) => t.key === testingKey)?.label ?? testingKey}
          onClose={() => setTestingKey(null)}
        />
      )}
      <p className="text-sm text-white/40">
        Edit the subject, heading, and body copy for each automated email. Variables like <code className="bg-white/[0.06] px-1 rounded text-xs">{"{{fullName}}"}</code> are filled in automatically at send time. Toggle any template off to disable that automation.
      </p>

      {templates.map((t) => {
        const isEditing = editing === t.key;
        const d = isEditing ? draft : {};

        return (
          <div key={t.key} className={cn(
            "rounded-xl border overflow-hidden transition-colors",
            isEditing ? "border-seed-500/30 bg-dark-elevated" : "border-white/[0.06] bg-dark-elevated"
          )}>
            {/* Row header */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-semibold text-white">{t.label}</span>
                  {t.isCustomized && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-seed-500/10 text-seed-400 border border-seed-500/20 uppercase tracking-wide">
                      Customized
                    </span>
                  )}
                  {!t.enabled && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/30 border border-white/[0.06] uppercase tracking-wide">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-0.5">{t.description}</p>
                <p className="text-[11px] text-white/25 mt-0.5">Trigger: {t.trigger}</p>
              </div>

              {/* Toggle enabled */}
              <button
                onClick={() => toggleEnabled(t.key, !t.enabled)}
                className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                title={t.enabled ? "Disable this template" : "Enable this template"}
              >
                {t.enabled
                  ? <ToggleRight className="w-6 h-6 text-seed-400" />
                  : <ToggleLeft className="w-6 h-6 text-white/25" />}
              </button>

              {/* Edit / Reset / Send Test buttons */}
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setTestingKey(t.key)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                    title="Send a test email for this template"
                  >
                    <Send className="w-3.5 h-3.5" /> Test
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={cancelEdit}
                  className="shrink-0 text-xs text-white/30 hover:text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  Cancel
                </button>
              )}
              {t.isCustomized && !isEditing && (
                <button
                  onClick={() => resetTemplate(t.key)}
                  disabled={resetting === t.key}
                  className="shrink-0 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                  title="Reset to default"
                >
                  {resetting === t.key
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RotateCcw className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* View-only field display (collapsed) */}
            {!isEditing && (
              <div className="px-6 pb-5 space-y-2">
                <FieldDisplay label="Subject" value={t.subject} mono />
                <FieldDisplay label="Heading" value={t.heading} />
                <FieldDisplay label="Body" value={t.body} multiline />
              </div>
            )}

            {/* Edit form (expanded) */}
            {isEditing && (
              <div className="px-6 pb-6 space-y-4 border-t border-white/[0.05] pt-5">
                {/* Subject */}
                <label className="block">
                  <span className="text-xs text-white/40 font-medium mb-1.5 block">Subject Line</span>
                  <input
                    type="text"
                    value={d.subject ?? t.subject}
                    onChange={(e) => setDraft((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full bg-dark-base border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-seed-500/40 focus:ring-1 focus:ring-seed-500/20 transition-colors"
                  />
                  <p className="text-[11px] text-white/25 mt-1">Variables: <code>{"{{fullName}}"}</code> <code>{"{{serviceLabel}}"}</code> <code>{"{{teamName}}"}</code></p>
                </label>

                {/* Heading */}
                <label className="block">
                  <span className="text-xs text-white/40 font-medium mb-1.5 block">Email Heading (H1)</span>
                  <input
                    type="text"
                    value={d.heading ?? t.heading}
                    onChange={(e) => setDraft((p) => ({ ...p, heading: e.target.value }))}
                    className="w-full bg-dark-base border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500/40 focus:ring-1 focus:ring-seed-500/20 transition-colors"
                  />
                </label>

                {/* Body */}
                <label className="block">
                  <span className="text-xs text-white/40 font-medium mb-1.5 block">
                    Body Copy
                    <span className="text-white/25 ml-2">— use blank lines between paragraphs</span>
                  </span>
                  <textarea
                    rows={6}
                    value={d.body ?? t.body}
                    onChange={(e) => setDraft((p) => ({ ...p, body: e.target.value }))}
                    className="w-full bg-dark-base border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500/40 focus:ring-1 focus:ring-seed-500/20 transition-colors resize-y"
                  />
                </label>

                {/* Preview */}
                {preview && (
                  <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                    <div className="flex items-center justify-between px-4 py-2 bg-dark-base border-b border-white/[0.06]">
                      <span className="text-xs text-white/40">Preview</span>
                      <button onClick={() => setPreview(null)} className="text-xs text-white/30 hover:text-white/60">Hide</button>
                    </div>
                    <div className="bg-white rounded-b-xl overflow-hidden max-h-96">
                      <iframe srcDoc={preview} title="Email Preview" className="w-full h-96 border-0" />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => save(t.key)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => buildPreview(t, d)}
                    className="flex items-center gap-2 bg-dark-base hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  {t.isCustomized && (
                    <button
                      onClick={() => resetTemplate(t.key)}
                      className="flex items-center gap-2 text-sm text-white/30 hover:text-white/60 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset to Default
                    </button>
                  )}
                  {saveMsg?.key === t.key && (
                    <span className={cn("text-xs", saveMsg.ok ? "text-green-400" : "text-red-400")}>
                      {saveMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <XCircle className="w-3.5 h-3.5 inline mr-1" />}
                      {saveMsg.text}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Test Email Modal
   ═══════════════════════════════════════════════════════════════ */

function TestEmailModal({ templateKey, templateLabel, onClose }: {
  templateKey: string;
  templateLabel: string;
  onClose: () => void;
}) {
  const [addresses, setAddresses] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<{ addr: string; ok: boolean; message: string }[]>([]);

  const send = async () => {
    const addrs = addresses.split(/[\s,;]+/).map((a) => a.trim()).filter(Boolean);
    if (addrs.length === 0) return;
    setSending(true);
    setResults([]);
    const next: typeof results = [];
    for (const addr of addrs) {
      try {
        const res = await fetch("/api/admin/email/send-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: addr, templateKey }),
        });
        const data = await res.json();
        next.push({ addr, ok: data.ok, message: data.message ?? (data.ok ? "Sent" : "Failed") });
      } catch {
        next.push({ addr, ok: false, message: "Request failed" });
      }
    }
    setResults(next);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-md bg-dark-elevated border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white">Send Test Email</h3>
            <p className="text-[11px] text-white/40 mt-0.5">Template: <span className="text-white/60">{templateLabel}</span></p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          <label className="block">
            <span className="text-xs text-white/40 font-medium mb-1.5 block">Recipients</span>
            <textarea
              rows={3}
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              placeholder={"sam@seedtechllc.com\nmoliva@seedtechllc.com"}
              className="w-full bg-dark-base border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500/40 focus:ring-1 focus:ring-seed-500/20 transition-colors resize-none font-mono"
            />
            <p className="text-[11px] text-white/25 mt-1">One address per line, or comma-separated.</p>
          </label>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-1.5">
              {results.map((r) => (
                <div key={r.addr} className={cn(
                  "flex items-center gap-2 text-xs px-3 py-2 rounded-lg border",
                  r.ok ? "bg-green-500/5 border-green-500/15 text-green-300" : "bg-red-500/5 border-red-500/15 text-red-300"
                )}>
                  {r.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span className="font-mono text-white/60 flex-1 truncate">{r.addr}</span>
                  <span>{r.message}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={send}
              disabled={sending || !addresses.trim()}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Sending…" : `Send${results.length > 0 ? " Again" : ""}`}
            </button>
            {results.length > 0 && results.every((r) => r.ok) && (
              <button onClick={onClose} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════════════════════════════ */

/* source badge: "db" | "env" | "none" | undefined */
function SourceBadge({ source }: { source?: string }) {
  if (!source) return null;
  const map: Record<string, { label: string; cls: string }> = {
    db:   { label: "DB",  cls: "bg-seed-500/10 text-seed-300 border-seed-500/20" },
    env:  { label: "ENV", cls: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    none: { label: "None", cls: "bg-white/5 text-white/25 border-white/10" },
  };
  const info = map[source] ?? map.none;
  return (
    <span className={cn("inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none", info.cls)}>
      {info.label}
    </span>
  );
}

function ConfigField({
  label, hint, value, onChange, source, placeholder,
}: {
  label: string; hint: string; value: string;
  onChange: (v: string) => void; source?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs text-white/50 font-medium">{label}</span>
        <SourceBadge source={source} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-base border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-seed-500/40 focus:ring-1 focus:ring-seed-500/20 transition-colors"
      />
      <p className="text-[11px] text-white/25 mt-1" dangerouslySetInnerHTML={{ __html: hint }} />
    </label>
  );
}

function StatusCard({
  label, present, detail, help, href, optional, source,
}: {
  label: string; present: boolean; detail: string; help: string; href?: string; optional?: boolean; source?: string;
}) {
  return (
    <div className={cn(
      "rounded-xl border p-5 space-y-2",
      present
        ? "bg-green-500/5 border-green-500/15"
        : optional
          ? "bg-amber-500/5 border-amber-500/15"
          : "bg-red-500/5 border-red-500/15"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">{label}</span>
        {present
          ? <CheckCircle2 className="w-4 h-4 text-green-400" />
          : optional
            ? <AlertCircle className="w-4 h-4 text-amber-400" />
            : <XCircle className="w-4 h-4 text-red-400" />}
      </div>
      <p className={cn("text-sm font-medium", present ? "text-green-300" : optional ? "text-amber-300" : "text-red-300")}>
        {present ? "Configured" : optional ? "Not set (optional)" : "Missing"}
      </p>
      <div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <code className="text-[11px] text-white/30">{detail}</code>
          {source && <SourceBadge source={source} />}
        </div>
        <p className="text-[11px] text-white/25 mt-0.5">{help}</p>
        {href && !present && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] text-seed-400 hover:underline flex items-center gap-1 mt-1">
            Get API key <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function EnvRow({ name, present, optional }: { name: string; present?: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs py-0.5">
      {present
        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
        : optional
          ? <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
      <code className="text-white/60">{name}</code>
      {optional && <span className="text-white/25 text-[10px]">(optional)</span>}
      <span className={cn("ml-auto", present ? "text-green-400/60" : optional ? "text-amber-400/60" : "text-red-400/60")}>
        {present ? "Set" : optional ? "Not set" : "Missing"}
      </span>
    </div>
  );
}

function FieldDisplay({ label, value, mono, multiline }: {
  label: string; value: string; mono?: boolean; multiline?: boolean;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-xs text-white/25 w-16 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
      <span className={cn("text-white/50 flex-1 min-w-0 break-words", mono && "font-mono text-xs", multiline && "whitespace-pre-line line-clamp-2")}>
        {value}
      </span>
    </div>
  );
}

