"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Settings,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Building2,
  Brain,
  Shield,
  Zap,
  Info,
  Globe,
  Search,
  Gauge,
  Send,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface OpenAIStatus {
  status: "connected" | "invalid" | "rate_limited" | "missing" | "error" | "untested";
  message: string;
  maskedKey?: string;
  model?: string;
  latencyMs?: number;
}

interface GSCStatus {
  status: "connected" | "disconnected" | "error" | "untested";
  message: string;
  siteUrl?: string;
}

/* ── Helpers ── */

const STATUS_CONFIG = {
  connected: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Connected" },
  invalid: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Invalid Key" },
  rate_limited: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Rate Limited" },
  missing: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Not Configured" },
  disconnected: { icon: XCircle, color: "text-white/30", bg: "bg-white/[0.03] border-white/[0.06]", label: "Not Connected" },
  error: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "Error" },
  untested: { icon: Info, color: "text-white/40", bg: "bg-white/[0.04] border-white/[0.08]", label: "Not Tested" },
};

/* ══════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  /* ── OpenAI State ── */
  const [openaiStatus, setOpenaiStatus] = useState<OpenAIStatus>({
    status: "untested",
    message: 'Click "Test Connection" to verify your API key.',
  });
  const [testingKey, setTestingKey] = useState(false);

  /* ── Google Search Console State ── */
  const [gscStatus, setGscStatus] = useState<GSCStatus>({
    status: "untested",
    message: 'Click "Test Connection" to verify your setup.',
  });
  const [testingGsc, setTestingGsc] = useState(false);

  /* ── Env Vars Status (fetched from server) ── */
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});
  const [envLoaded, setEnvLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/admin/settings/env-status")
      .then((r) => r.json())
      .then((d) => {
        setEnvVars(d);
        setEnvLoaded(true);
        if (!d.GOOGLE_SERVICE_ACCOUNT_EMAIL || !d.GOOGLE_SERVICE_ACCOUNT_KEY) {
          setGscStatus({ status: "disconnected", message: "Google Search Console is not configured. Add service account credentials to .env.local" });
        }
      })
      .catch(() => {});
  }, []);

  /* ── Test OpenAI key ── */
  const testOpenAI = useCallback(async () => {
    setTestingKey(true);
    try {
      const res = await fetch("/api/admin/settings/test-openai", { method: "POST" });
      const data = await res.json();
      setOpenaiStatus(data);
    } catch {
      setOpenaiStatus({ status: "error", message: "Failed to reach the server." });
    }
    setTestingKey(false);
  }, []);

  /* ── Test Google Search Console ── */
  const testGSC = useCallback(async () => {
    setTestingGsc(true);
    try {
      const res = await fetch("/api/admin/seo/search-console?action=test");
      const data = await res.json();
      if (!data.configured) {
        setGscStatus({ status: "disconnected", message: data.message });
      } else if (data.connected) {
        setGscStatus({
          status: "connected",
          message: data.message,
          siteUrl: data.siteUrl,
        });
      } else {
        const sitesHint = data.availableSites?.length
          ? ` Available sites: ${data.availableSites.join(", ")}`
          : " (No sites found — add the service account as a user in Search Console first)";
        setGscStatus({ status: "error", message: data.message + sitesHint });
      }
    } catch {
      setGscStatus({ status: "error", message: "Failed to reach the server." });
    }
    setTestingGsc(false);
  }, []);

  // Auto-test GSC once env vars are confirmed present
  useEffect(() => {
    if (envLoaded && envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL && envVars.GOOGLE_SERVICE_ACCOUNT_KEY && envVars.GOOGLE_SEARCH_CONSOLE_SITE) {
      testGSC();
    }
  }, [envLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusCfg = STATUS_CONFIG[openaiStatus.status];
  const StatusIcon = statusCfg.icon;
  const gscCfg = STATUS_CONFIG[gscStatus.status];
  const GscIcon = gscCfg.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-seed-400" />
          Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Manage integrations, AI configuration, and admin preferences.
        </p>
      </div>

      {/* ─── Claude AI API Key Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Key className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">Claude AI API Key</h2>
          <span className="text-xs text-white/30 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">claude-sonnet-4-5</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Status badge */}
          <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", statusCfg.bg)}>
            <StatusIcon className={cn("w-5 h-5 shrink-0", statusCfg.color)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", statusCfg.color)}>
                {statusCfg.label}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{openaiStatus.message}</p>
            </div>
            {openaiStatus.latencyMs != null && (
              <span className="text-xs text-white/30 shrink-0">
                {openaiStatus.latencyMs}ms
              </span>
            )}
          </div>

          {/* Details */}
          {openaiStatus.status !== "untested" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {openaiStatus.maskedKey && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">API Key</p>
                  <p className="text-sm text-white font-mono">{openaiStatus.maskedKey}</p>
                </div>
              )}
              {openaiStatus.model && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">Model</p>
                  <p className="text-sm text-white">{openaiStatus.model}</p>
                </div>
              )}
              {openaiStatus.latencyMs != null && (
                <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
                  <p className="text-xs text-white/40 mb-1">Latency</p>
                  <p className="text-sm text-white">{openaiStatus.latencyMs}ms</p>
                </div>
              )}
            </div>
          )}

          {/* Test button */}
          <button
            onClick={testOpenAI}
            disabled={testingKey}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            {testingKey ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {testingKey ? "Testing…" : "Test Connection"}
          </button>

          {/* Help text */}
          <p className="text-xs text-white/30">
            The API key is stored in <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code> on the server. 
            To change it, update the <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">OPENAI_API_KEY</code> variable and restart the dev server.
          </p>
        </div>
      </section>

      {/* ─── Integrations Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Globe className="w-5 h-5 text-seed-400" />
          <div>
            <h2 className="font-semibold text-white">SEO Integrations</h2>
            <p className="text-xs text-white/40 mt-0.5">Connect external services to power the SEO dashboard with real data.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Google Search Console */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Google Search Console</h3>
                <p className="text-xs text-white/35">Real keyword rankings, clicks, impressions, and CTR data.</p>
              </div>
            </div>

            <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", gscCfg.bg)}>
              <GscIcon className={cn("w-5 h-5 shrink-0", gscCfg.color)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", gscCfg.color)}>{gscCfg.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{gscStatus.message}</p>
              </div>
              {gscStatus.siteUrl && (
                <span className="text-xs text-white/30 font-mono shrink-0">{gscStatus.siteUrl}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testGSC}
                disabled={testingGsc}
                className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {testingGsc ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {testingGsc ? "Testing…" : "Test Connection"}
              </button>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                Open Search Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06] text-xs text-white/30 space-y-2">
              <p className="font-medium text-white/50">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-seed-400 hover:underline">console.cloud.google.com</a></li>
                <li>Create a new project (or select existing)</li>
                <li>Enable the <strong className="text-white/50">Search Console API</strong> from the API Library</li>
                <li>Go to <strong className="text-white/50">IAM &amp; Admin → Service Accounts</strong> → Create a service account</li>
                <li>Create a JSON key for the service account — download it</li>
                <li>In <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-seed-400 hover:underline">Search Console</a>, add the service account email as a <strong className="text-white/50">Full</strong> user under Settings → Users</li>
                <li>Add these to <code className="bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code> and restart:</li>
              </ol>
              <pre className="bg-white/[0.03] rounded px-3 py-2 mt-2 text-white/40 overflow-x-auto">{`GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SEARCH_CONSOLE_SITE=https://seedtechllc.com`}</pre>
            </div>
          </div>

          <hr className="border-white/[0.06]" />

          {/* PageSpeed Insights */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">PageSpeed Insights</h3>
                <p className="text-xs text-white/35">Core Web Vitals, performance, and accessibility scores.</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Ready</span>
            </div>
            <p className="text-xs text-white/30">
              No configuration needed — works out of the box for any public URL. 
              Optionally add <code className="bg-white/[0.06] px-1 py-0.5 rounded">PAGESPEED_API_KEY</code> for higher rate limits.
            </p>
          </div>

          <hr className="border-white/[0.06]" />

          {/* IndexNow */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">IndexNow</h3>
                <p className="text-xs text-white/35">Instantly notify Bing &amp; Yandex when you publish new content.</p>
              </div>
            </div>
            <p className="text-xs text-white/30">
              Add <code className="bg-white/[0.06] px-1 py-0.5 rounded">INDEXNOW_API_KEY</code> to <code className="bg-white/[0.06] px-1 py-0.5 rounded">.env.local</code>. 
              Generate any random string (e.g., a UUID). Then host a file at <code className="bg-white/[0.06] px-1 py-0.5 rounded">https://seedtechllc.com/&#123;key&#125;.txt</code> containing the key.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Admin & Environment Section ─── */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Shield className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">Admin & Environment</h2>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              label="Allowed Admin Emails"
              value={process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Configured server-side"}
              icon={<Shield className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Auth Provider"
              value="NextAuth — Credentials"
              icon={<Key className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="AI Model"
              value="claude-sonnet-4-5 (Anthropic)"
              icon={<Brain className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Blog Storage"
              value="File-based JSON (content/blog/)"
              icon={<Building2 className="w-4 h-4 text-white/40" />}
            />
          </div>

          <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-seed-400" />
              <p className="text-sm font-medium text-white">Environment Variables Status</p>
            </div>
            <div className="space-y-1.5">
              <EnvRow name="NEXTAUTH_URL" present={envVars.NEXTAUTH_URL ?? true} />
              <EnvRow name="NEXTAUTH_SECRET" present={envVars.NEXTAUTH_SECRET ?? true} />
              <EnvRow name="CLAUDE_API_KEY" present={envVars.CLAUDE_API_KEY ?? false} />
              <EnvRow name="ADMIN_EMAILS" present={envVars.ADMIN_EMAILS ?? true} />
              <EnvRow name="ADMIN_PASSWORD" present={envVars.ADMIN_PASSWORD ?? true} />
              <EnvRow name="GOOGLE_SERVICE_ACCOUNT_EMAIL" present={envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? false} />
              <EnvRow name="GOOGLE_SERVICE_ACCOUNT_KEY" present={envVars.GOOGLE_SERVICE_ACCOUNT_KEY ?? false} />
              <EnvRow name="GOOGLE_SEARCH_CONSOLE_SITE" present={envVars.GOOGLE_SEARCH_CONSOLE_SITE ?? false} />
              <EnvRow name="PAGESPEED_API_KEY" present={envVars.PAGESPEED_API_KEY ?? false} optional />
              <EnvRow name="INDEXNOW_API_KEY" present={envVars.INDEXNOW_API_KEY ?? false} optional />
            </div>
          </div>

          <p className="text-xs text-white/30">
            Environment variables and admin credentials are managed in{" "}
            <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code>.
            Changes require a server restart to take effect.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── Reusable Components ── */

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-white/40">{label}</p>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function EnvRow({ name, present, optional }: { name: string; present: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {present ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
      ) : optional ? (
        <XCircle className="w-3.5 h-3.5 text-yellow-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-400" />
      )}
      <code className="text-white/60">{name}</code>
      {optional && <span className="text-white/30 text-[10px]">(optional)</span>}
      <span className={cn("ml-auto", present ? "text-green-400/60" : optional ? "text-yellow-400/60" : "text-red-400/60")}>
        {present ? "Set" : optional ? "Not set" : "Missing"}
      </span>
    </div>
  );
}
