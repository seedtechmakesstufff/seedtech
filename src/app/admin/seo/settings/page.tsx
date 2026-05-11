"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Brain,
  Zap,
  Info,
  Globe,
  Search,
  Gauge,
  Send,
  ExternalLink,
  CalendarClock,
  Mail,
  Clock,
  Eye,
  Image as ImageIcon,
  Upload,
  Trash2,
  RotateCcw,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

type Section = "connections" | "defaults" | "automation";

interface ConnectionStatus {
  status: "connected" | "invalid" | "rate_limited" | "missing" | "disconnected" | "error" | "untested";
  message: string;
  maskedKey?: string;
  model?: string;
  latencyMs?: number;
  siteUrl?: string;
}

const STATUS_CONFIG = {
  connected: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Connected" },
  invalid: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Invalid Key" },
  rate_limited: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Rate Limited" },
  missing: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Not Configured" },
  disconnected: { icon: XCircle, color: "text-white/30", bg: "bg-white/[0.03] border-white/[0.06]", label: "Not Connected" },
  error: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "Error" },
  untested: { icon: Info, color: "text-white/40", bg: "bg-white/[0.04] border-white/[0.08]", label: "Not Tested" },
};

const NAV_SECTIONS: { key: Section; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { key: "connections", label: "Connections", icon: Globe, desc: "API keys & integrations" },
  { key: "defaults", label: "Defaults", icon: Palette, desc: "OG image & site-wide SEO" },
  { key: "automation", label: "Automation & Reports", icon: CalendarClock, desc: "Cron, email & IndexNow" },
];

/* ═══════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════ */

export default function SeoSettingsPage() {
  const [section, setSection] = useState<Section>("connections");

  /* ── Shared state ── */
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});
  const [envLoaded, setEnvLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/env-status")
      .then((r) => r.json())
      .then((d) => { setEnvVars(d); setEnvLoaded(true); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-seed-400" />
          SEO Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Configure integrations, business context, keyword strategy, and automation for the SEO Autopilot system.
        </p>
      </div>

      {/* Layout: secondary sidebar + content */}
      <div className="flex gap-6 min-h-[calc(100vh-14rem)]">
        {/* Secondary sidebar */}
        <nav className="w-56 shrink-0 space-y-1">
          {NAV_SECTIONS.map((s) => {
            const active = section === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={cn(
                  "w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-all",
                  active
                    ? "bg-seed-500/10 border border-seed-500/20"
                    : "bg-transparent border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
                )}
              >
                <s.icon className={cn("w-5 h-5 mt-0.5 shrink-0", active ? "text-seed-400" : "text-white/30")} />
                <div>
                  <p className={cn("text-sm font-medium", active ? "text-seed-400" : "text-white/60")}>{s.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}

          {/* Quick env status */}
          {envLoaded && (
            <div className="mt-6 px-3.5 py-3 rounded-xl bg-dark-elevated border border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-2">Quick Status</p>
              <div className="space-y-1.5">
                <EnvDot label="Search Console" ok={!!envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL} />
                <EnvDot label="Claude AI" ok={!!envVars.CLAUDE_API_KEY} />
                <EnvDot label="IndexNow" ok={!!envVars.INDEXNOW_API_KEY} />
                <EnvDot label="Email Reports" ok={!!envVars.RESEND_API_KEY} />
                <EnvDot label="Cron Secret" ok={!!envVars.CRON_SECRET} />
                <EnvDot label="Database" ok={!!envVars.DATABASE_URL} />
              </div>
            </div>
          )}
          {/* AI Context link */}
          <div className="mt-6 px-3.5">
            <Link
              href="/admin/seo/context"
              className="flex items-start gap-3 px-3.5 py-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/15 hover:bg-purple-500/[0.08] hover:border-purple-500/25 transition-all"
            >
              <Brain className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-400">AI Context</p>
                <p className="text-[11px] text-white/30 mt-0.5">Business profile, page context, keywords & AI preview</p>
              </div>
            </Link>
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {section === "connections" && <ConnectionsSection envVars={envVars} envLoaded={envLoaded} />}
          {section === "defaults" && <DefaultsSection />}
          {section === "automation" && <AutomationSection envVars={envVars} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Connections
   ═══════════════════════════════════════════════════════════════ */

function ConnectionsSection({ envVars, envLoaded }: { envVars: Record<string, boolean>; envLoaded: boolean }) {
  /* ── Claude State ── */
  const [claudeStatus, setClaudeStatus] = useState<ConnectionStatus>({
    status: "untested", message: 'Click "Test" to verify your API key.',
  });
  const [testingClaude, setTestingClaude] = useState(false);

  const testClaude = useCallback(async () => {
    setTestingClaude(true);
    try {
      const res = await fetch("/api/admin/settings/test-openai", { method: "POST" });
      const data = await res.json();
      setClaudeStatus(data);
    } catch { setClaudeStatus({ status: "error", message: "Failed to reach the server." }); }
    setTestingClaude(false);
  }, []);

  /* ── GSC State ── */
  const [gscStatus, setGscStatus] = useState<ConnectionStatus>({
    status: "untested", message: 'Click "Test" to verify your setup.',
  });
  const [testingGsc, setTestingGsc] = useState(false);

  const testGSC = useCallback(async () => {
    setTestingGsc(true);
    try {
      const res = await fetch("/api/admin/seo/search-console?action=test");
      const data = await res.json();
      if (!data.configured) {
        setGscStatus({ status: "disconnected", message: data.message });
      } else if (data.connected) {
        setGscStatus({ status: "connected", message: data.message, siteUrl: data.siteUrl });
      } else {
        const sitesHint = data.availableSites?.length
          ? ` Available sites: ${data.availableSites.join(", ")}`
          : " (No sites found — add the service account as a user in Search Console first)";
        setGscStatus({ status: "error", message: data.message + sitesHint });
      }
    } catch { setGscStatus({ status: "error", message: "Failed to reach the server." }); }
    setTestingGsc(false);
  }, []);

  // Auto-test GSC once env vars are confirmed
  useEffect(() => {
    if (envLoaded && envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL && envVars.GOOGLE_SERVICE_ACCOUNT_KEY && envVars.GOOGLE_SEARCH_CONSOLE_SITE) {
      testGSC();
    }
  }, [envLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Google Workspace OAuth (multi-tenant) */}
      <Link
        href="/admin/seo/settings/integrations"
        className="block bg-dark-elevated border border-white/[0.06] rounded-xl px-6 py-5 hover:border-seed-500/30 hover:bg-seed-500/[0.03] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-seed-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Google Workspace Integrations →</p>
            <p className="text-xs text-white/50 mt-0.5">
              OAuth-based connections for Search Console, Analytics 4, and Business Profile. Used by every Autopilot agent.
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-white/30" />
        </div>
      </Link>

      {/* Claude AI */}
      <ConnectionCard
        title="Claude AI (Anthropic)"
        description="Powers the AI SEO Advisor, blog writer, keyword discovery, and insights engine."
        icon={<Brain className="w-5 h-5 text-purple-400" />}
        iconBg="bg-purple-500/10"
        status={claudeStatus}
        testing={testingClaude}
        onTest={testClaude}
        envPresent={envVars.CLAUDE_API_KEY}
        help={
          <p className="text-xs text-white/30">
            Get your API key from{" "}
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-seed-400 hover:underline">console.anthropic.com</a>.
            Set <code className="bg-white/[0.06] px-1 py-0.5 rounded">CLAUDE_API_KEY</code> in <code className="bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code>.
          </p>
        }
      />

      {/* Google Search Console */}
      <ConnectionCard
        title="Google Search Console"
        description="Real keyword rankings, clicks, impressions, and CTR data from Google."
        icon={<Search className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/10"
        status={gscStatus}
        testing={testingGsc}
        onTest={testGSC}
        envPresent={envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL}
        externalUrl="https://search.google.com/search-console"
        externalLabel="Open Search Console"
        help={
          <div className="text-xs text-white/30 space-y-2">
            <p className="font-medium text-white/50">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-seed-400 hover:underline">console.cloud.google.com</a></li>
              <li>Create a project → Enable the <strong className="text-white/50">Search Console API</strong></li>
              <li>Create a service account → Download the JSON key</li>
              <li>In <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-seed-400 hover:underline">Search Console</a>, add the service account email as a <strong className="text-white/50">Full</strong> user</li>
              <li>Add to <code className="bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code>:</li>
            </ol>
            <pre className="bg-white/[0.03] rounded px-3 py-2 mt-2 text-white/40 overflow-x-auto text-[11px]">{`GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\\nKEY\\n-----END PRIVATE KEY-----"
GOOGLE_SEARCH_CONSOLE_SITE=https://yourdomain.com`}</pre>
          </div>
        }
      />

      {/* PageSpeed Insights */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">PageSpeed Insights</h3>
            <p className="text-xs text-white/35">Core Web Vitals, performance, and accessibility scores.</p>
          </div>
          <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Ready</span>
        </div>
        <div className="p-6">
          <p className="text-xs text-white/30">
            Works out of the box for any public URL — no configuration needed. Optionally add{" "}
            <code className="bg-white/[0.06] px-1 py-0.5 rounded">PAGESPEED_API_KEY</code> for higher rate limits.
          </p>
        </div>
      </section>

      {/* IndexNow */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Send className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">IndexNow</h3>
            <p className="text-xs text-white/35">Instantly notify Bing & Yandex when content is published.</p>
          </div>
          {envVars.INDEXNOW_API_KEY ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Active</span>
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">Not configured</span>
          )}
        </div>
        <div className="p-6 space-y-3">
          <p className="text-xs text-white/30">
            Set <code className="bg-white/[0.06] px-1 py-0.5 rounded">INDEXNOW_API_KEY</code> to any random string. Host a verification file
            at <code className="bg-white/[0.06] px-1 py-0.5 rounded">{`public/{key}.txt`}</code> containing the key.
          </p>
          <p className="text-xs text-white/25">
            Blog posts automatically ping IndexNow on publish — no manual action needed.
          </p>
        </div>
      </section>

      {/* Google Analytics */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Google Analytics 4</h3>
            <p className="text-xs text-white/35">Page views, sessions, traffic sources, and user behavior.</p>
          </div>
          {envVars.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Active</span>
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">Not configured</span>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-white/30">
            Set <code className="bg-white/[0.06] px-1 py-0.5 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to your GA4 measurement ID (e.g., <code className="bg-white/[0.06] px-1 py-0.5 rounded">G-XXXXXXXXXX</code>).
          </p>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mt-2"
          >
            Open Google Analytics <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* Environment Variables Overview */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Zap className="w-5 h-5 text-seed-400" />
          <h3 className="font-semibold text-white">Environment Variables</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
            <EnvRow name="CLAUDE_API_KEY" present={envVars.CLAUDE_API_KEY} />
            <EnvRow name="GOOGLE_SERVICE_ACCOUNT_EMAIL" present={envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL} />
            <EnvRow name="GOOGLE_SERVICE_ACCOUNT_KEY" present={envVars.GOOGLE_SERVICE_ACCOUNT_KEY} />
            <EnvRow name="GOOGLE_SEARCH_CONSOLE_SITE" present={envVars.GOOGLE_SEARCH_CONSOLE_SITE} />
            <EnvRow name="PAGESPEED_API_KEY" present={envVars.PAGESPEED_API_KEY} optional />
            <EnvRow name="INDEXNOW_API_KEY" present={envVars.INDEXNOW_API_KEY} optional />
            <EnvRow name="NEXT_PUBLIC_GA_MEASUREMENT_ID" present={envVars.NEXT_PUBLIC_GA_MEASUREMENT_ID} optional />
            <EnvRow name="RESEND_API_KEY" present={envVars.RESEND_API_KEY} optional />
            <EnvRow name="CRON_SECRET" present={envVars.CRON_SECRET} optional />
            <EnvRow name="DATABASE_URL" present={envVars.DATABASE_URL} />
          </div>
          <p className="text-xs text-white/25 mt-4">
            Set variables in <code className="bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code> (dev) or Vercel Settings → Environment Variables (production). Restart/redeploy to apply.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Defaults (OG Image & site-wide SEO)
   ═══════════════════════════════════════════════════════════════ */

function DefaultsSection() {
  const [defaultOgImageUrl, setDefaultOgImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDefault = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/settings/default-og-image");
      const data = await res.json();
      setDefaultOgImageUrl(data.defaultOgImageUrl ?? null);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDefault(); }, [fetchDefault]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("ogImage", file);
      const res = await fetch("/api/admin/seo/settings/default-og-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDefaultOgImageUrl(data.defaultOgImageUrl);
      setMsg("Default OG image saved!");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  };

  const handleRemove = async () => {
    setUploading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/seo/settings/default-og-image", { method: "DELETE" });
      if (res.ok) {
        setDefaultOgImageUrl(null);
        setMsg("Default OG image removed — pages will use system placeholder.");
      }
    } catch {
      setMsg("Failed to remove image");
    }
    setUploading(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Default OG Image */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-seed-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Default OG Image</h3>
            <p className="text-xs text-white/35">Site-wide fallback Open Graph image for social sharing. Used when a page doesn&apos;t have its own OG image.</p>
          </div>
          {defaultOgImageUrl ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Set</span>
          ) : (
            <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">Using Placeholder</span>
          )}
        </div>
        <div className="p-6 space-y-4">
          {/* Cascade explanation */}
          <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
            <p className="text-xs font-medium text-white/50 mb-2">OG Image Priority (3-tier cascade)</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-seed-500/20 text-seed-400 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span className="text-white/60">Page-level OG image</span>
                <span className="text-white/25 ml-auto">per-page in Metadata tab</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span className="text-white/60">Site-wide default</span>
                <span className="text-white/25 ml-auto">set below ↓</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white/40 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span className="text-white/40">System placeholder</span>
                <span className="text-white/20 ml-auto">/og-image-placeholder.png</span>
              </div>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-2">
              <Upload className="w-3 h-3" />Site-Wide Default
              <span className="ml-auto text-[10px] text-white/20">1200×630 recommended</span>
            </label>

            {loading ? (
              <div className="flex items-center justify-center h-36 bg-white/[0.02] rounded-lg border border-white/[0.06]">
                <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
              </div>
            ) : defaultOgImageUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-white/[0.08]">
                <img
                  src={defaultOgImageUrl}
                  alt="Default OG image preview"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="p-1.5 rounded-md bg-black/70 text-white/70 hover:text-white transition-colors"
                    title="Replace image"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={uploading}
                    className="p-1.5 rounded-md bg-black/70 text-red-400/70 hover:text-red-400 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 h-36 rounded-lg border-2 border-dashed cursor-pointer transition-all",
                  dragOver
                    ? "border-seed-500/50 bg-seed-500/[0.04]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.03]"
                )}
              >
                <Upload className="w-5 h-5 text-white/30" />
                <div className="text-center">
                  <p className="text-xs text-white/50">
                    <span className="text-seed-400 font-medium">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-[10px] text-white/25 mt-0.5">PNG, JPEG, WebP — max 5 MB · 1200×630px</p>
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* Status message */}
          {msg && (
            <div className={cn("flex items-center gap-2 text-xs", msg.includes("fail") || msg.includes("error") ? "text-red-400" : "text-green-400")}>
              {msg.includes("fail") || msg.includes("error") ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {msg}
            </div>
          )}

          {/* Placeholder preview */}
          {!defaultOgImageUrl && !loading && (
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-2">Current fallback: System Placeholder</p>
              <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                <img
                  src="/og-image-placeholder.png"
                  alt="System placeholder"
                  className="w-full h-28 object-cover opacity-60"
                />
              </div>
              <p className="text-[10px] text-white/25 mt-2">
                This auto-generated branded image is used when no default is uploaded. Upload a custom image above for better social sharing.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Automation & Reports
   ═══════════════════════════════════════════════════════════════ */

function AutomationSection({ envVars }: { envVars: Record<string, boolean> }) {
  const [cronTesting, setCronTesting] = useState(false);
  const [cronResult, setCronResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  /* ── GSC Sync State ── */
  const [gscSync, setGscSync] = useState<{
    configured: boolean;
    lastSyncAt: string | null;
    lastSyncStatus: string | null;
    isStale: boolean;
    isSyncing: boolean;
    totalSyncs: number;
    lastKeywordsFetched: number;
    lastPagesFetched: number;
  } | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fetchSyncStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/gsc-sync");
      const data = await res.json();
      setGscSync(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  const triggerSync = useCallback(async (force = false) => {
    setSyncLoading(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/seo/gsc-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (data.status === "completed") {
        setSyncResult({ ok: true, message: data.message });
      } else if (data.status === "skipped") {
        setSyncResult({ ok: true, message: data.message });
      } else {
        setSyncResult({ ok: false, message: data.message || data.error || "Sync failed" });
      }
      fetchSyncStatus();
    } catch {
      setSyncResult({ ok: false, message: "Failed to reach the server." });
    }
    setSyncLoading(false);
  }, [fetchSyncStatus]);

  const testCron = useCallback(async () => {
    setCronTesting(true); setCronResult(null);
    try {
      const res = await fetch("/api/admin/seo/snapshot", { method: "POST" });
      const data = await res.json();
      setCronResult({ ok: !!data.id, message: data.id ? `Snapshot taken — health score: ${data.healthScore}` : "Failed to take snapshot" });
    } catch { setCronResult({ ok: false, message: "Failed to reach the server." }); }
    setCronTesting(false);
  }, []);

  const previewReport = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/admin/seo/reports");
      const data = await res.json();
      if (data.html) setReportPreview(data.html);
    } catch { /* silent */ }
    setPreviewLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* GSC Data Sync */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">GSC Data Sync</h3>
            <p className="text-xs text-white/40 mt-0.5">Pull keyword rankings &amp; page metrics from Google Search Console.</p>
          </div>
          {gscSync?.configured ? (
            gscSync.isStale ? (
              <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">Stale</span>
            ) : (
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Fresh</span>
            )
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">Not configured</span>
          )}
        </div>
        <div className="p-6 space-y-4">
          {/* Stats grid */}
          {gscSync && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Last Sync</p>
                <p className="text-sm text-white">
                  {gscSync.lastSyncAt
                    ? new Date(gscSync.lastSyncAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Status</p>
                <p className={cn("text-sm font-medium", {
                  "text-green-400": gscSync.lastSyncStatus === "completed",
                  "text-red-400": gscSync.lastSyncStatus === "failed",
                  "text-yellow-400": gscSync.lastSyncStatus === "running",
                  "text-white/30": !gscSync.lastSyncStatus,
                })}>
                  {gscSync.lastSyncStatus ? gscSync.lastSyncStatus.charAt(0).toUpperCase() + gscSync.lastSyncStatus.slice(1) : "—"}
                </p>
              </div>
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Keywords Pulled</p>
                <p className="text-sm text-white">{gscSync.lastKeywordsFetched}</p>
              </div>
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Total Syncs</p>
                <p className="text-sm text-white">{gscSync.totalSyncs}</p>
              </div>
            </div>
          )}

          {/* Schedule info */}
          <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
            <p className="text-xs text-white/40 mb-1">Sync Schedule</p>
            <p className="text-sm text-white">Staleness-based — auto-syncs when data is &gt;6 hours old on dashboard visit</p>
            <p className="text-[11px] text-white/25 mt-0.5">Uses ~4 GSC API calls per sync (1,200/day limit). Manual sync always available below.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerSync(true)}
              disabled={syncLoading || !gscSync?.configured}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {syncLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {syncLoading ? "Syncing…" : "Sync Now"}
            </button>
            {syncResult && (
              <div className={cn("flex items-center gap-2 text-xs", syncResult.ok ? "text-green-400" : "text-red-400")}>
                {syncResult.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span className="max-w-md truncate">{syncResult.message}</span>
              </div>
            )}
          </div>

          {!gscSync?.configured && (
            <p className="text-xs text-white/25">
              Configure Google Search Console in the{" "}
              <button onClick={() => {}} className="text-seed-400 hover:underline">Connections</button>{" "}
              tab to enable data sync.
            </p>
          )}
        </div>
      </section>

      {/* Weekly Cron */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Clock className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Weekly Cron Job</h3>
            <p className="text-xs text-white/40 mt-0.5">Runs every Monday at 6 AM UTC: snapshot → crawl → insights → email report.</p>
          </div>
          {envVars.CRON_SECRET ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Configured</span>
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">No CRON_SECRET</span>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-1">Schedule</p>
              <p className="text-sm text-white font-mono">0 6 * * 1</p>
              <p className="text-[11px] text-white/25 mt-0.5">Every Monday at 6:00 AM UTC</p>
            </div>
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-1">Endpoint</p>
              <p className="text-sm text-white font-mono">/api/cron/seo</p>
              <p className="text-[11px] text-white/25 mt-0.5">Requires Bearer CRON_SECRET header</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={testCron}
              disabled={cronTesting}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {cronTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {cronTesting ? "Taking Snapshot…" : "Take Snapshot Now"}
            </button>
            {cronResult && (
              <div className={cn("flex items-center gap-2 text-xs", cronResult.ok ? "text-green-400" : "text-red-400")}>
                {cronResult.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {cronResult.message}
              </div>
            )}
          </div>

          <p className="text-xs text-white/25">
            The cron job is configured in <code className="bg-white/[0.06] px-1 py-0.5 rounded">vercel.json</code>. It activates automatically when deployed to Vercel.
          </p>
        </div>
      </section>

      {/* Email Reports */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Mail className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Email Reports</h3>
            <p className="text-xs text-white/40 mt-0.5">Weekly SEO digest sent via Resend.</p>
          </div>
          {envVars.RESEND_API_KEY ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Configured</span>
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">No RESEND_API_KEY</span>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-1">From</p>
              <p className="text-sm text-white/60 font-mono text-xs">REPORT_FROM_EMAIL</p>
            </div>
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-1">To</p>
              <p className="text-sm text-white/60 font-mono text-xs">REPORT_TO_EMAIL</p>
            </div>
            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-1">Provider</p>
              <p className="text-sm text-white">Resend</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={previewReport}
              disabled={previewLoading}
              className="flex items-center gap-2 bg-dark-base hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Preview Report
            </button>
          </div>

          {reportPreview && (
            <div className="relative">
              <button
                onClick={() => setReportPreview(null)}
                className="absolute top-2 right-2 z-10 p-1 bg-dark-base rounded-full border border-white/[0.08] text-white/40 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
                <iframe
                  srcDoc={reportPreview}
                  title="Report Preview"
                  className="w-full h-[500px] border-0"
                />
              </div>
            </div>
          )}

          <p className="text-xs text-white/25">
            Set <code className="bg-white/[0.06] px-1 py-0.5 rounded">RESEND_API_KEY</code>,{" "}
            <code className="bg-white/[0.06] px-1 py-0.5 rounded">REPORT_FROM_EMAIL</code>, and{" "}
            <code className="bg-white/[0.06] px-1 py-0.5 rounded">REPORT_TO_EMAIL</code> in your environment to enable email delivery.
          </p>
        </div>
      </section>

      {/* Auto-IndexNow */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Send className="w-5 h-5 text-seed-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Auto-IndexNow on Publish</h3>
            <p className="text-xs text-white/40 mt-0.5">Automatically notifies search engines when blog posts are published or updated.</p>
          </div>
          {envVars.INDEXNOW_API_KEY ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Active</span>
          ) : (
            <span className="text-xs bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">Disabled</span>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-white/30">
            When a blog post is saved with status &quot;published&quot; — or when content changes on an already-published post — the system automatically pings IndexNow (Bing + api.indexnow.org). This is non-blocking and won&apos;t fail the save if the ping errors.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════════════════════════════ */

function ConnectionCard({
  title, description, icon, iconBg, status, testing, onTest, envPresent, externalUrl, externalLabel, help,
}: {
  title: string; description: string; icon: React.ReactNode; iconBg: string;
  status: ConnectionStatus; testing: boolean; onTest: () => void;
  envPresent?: boolean; externalUrl?: string; externalLabel?: string;
  help?: React.ReactNode;
}) {
  const cfg = STATUS_CONFIG[status.status];
  const StatusIcon = cfg.icon;

  return (
    <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/35">{description}</p>
        </div>
        {envPresent !== undefined && (
          envPresent ? (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Key Set</span>
          ) : (
            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">Missing</span>
          )
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Status badge */}
        <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", cfg.bg)}>
          <StatusIcon className={cn("w-5 h-5 shrink-0", cfg.color)} />
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-medium", cfg.color)}>{cfg.label}</p>
            <p className="text-xs text-white/40 mt-0.5">{status.message}</p>
          </div>
          {status.siteUrl && (
            <span className="text-xs text-white/30 font-mono shrink-0">{status.siteUrl}</span>
          )}
          {status.latencyMs != null && (
            <span className="text-xs text-white/30 shrink-0">{status.latencyMs}ms</span>
          )}
        </div>

        {/* Details grid */}
        {status.status !== "untested" && (status.maskedKey || status.model || status.latencyMs != null) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {status.maskedKey && (
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">API Key</p>
                <p className="text-sm text-white font-mono">{status.maskedKey}</p>
              </div>
            )}
            {status.model && (
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Model</p>
                <p className="text-sm text-white">{status.model}</p>
              </div>
            )}
            {status.latencyMs != null && (
              <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">Latency</p>
                <p className="text-sm text-white">{status.latencyMs}ms</p>
              </div>
            )}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTest}
            disabled={testing}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {testing ? "Testing…" : "Test Connection"}
          </button>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {externalLabel || "Open"} <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Help section */}
        {help && (
          <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
            {help}
          </div>
        )}
      </div>
    </section>
  );
}

function EnvRow({ name, present, optional }: { name: string; present?: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {present ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
      ) : optional ? (
        <XCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
      )}
      <code className="text-white/60">{name}</code>
      {optional && <span className="text-white/30 text-[10px]">(optional)</span>}
      <span className={cn("ml-auto", present ? "text-green-400/60" : optional ? "text-yellow-400/60" : "text-red-400/60")}>
        {present ? "Set" : optional ? "Not set" : "Missing"}
      </span>
    </div>
  );
}

function EnvDot({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-1.5 h-1.5 rounded-full", ok ? "bg-green-400" : "bg-white/20")} />
      <span className="text-[11px] text-white/40">{label}</span>
    </div>
  );
}
