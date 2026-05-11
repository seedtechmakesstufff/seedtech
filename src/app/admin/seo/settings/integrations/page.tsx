"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plug,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  BarChart3,
  MapPin,
  ArrowUpRight,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Ga4Panel } from "./Ga4Panel";
import { GbpPanel } from "./GbpPanel";
import { WordPressPanel } from "./WordPressPanel";

type IntegrationType =
  | "google_search_console"
  | "google_analytics"
  | "google_business_profile";

interface IntegrationStatus {
  type: IntegrationType;
  connected: boolean;
  authType: string | null;
  grantedAt: string | null;
  scope: string | null;
  property: string | null;
}

interface StatusResponse {
  oauthConfigured: boolean;
  integrations: IntegrationStatus[];
}

const INTEGRATIONS: Record<
  IntegrationType,
  { label: string; description: string; icon: typeof Search }
> = {
  google_search_console: {
    label: "Google Search Console",
    description: "Search query data, page impressions, click-through rates.",
    icon: Search,
  },
  google_analytics: {
    label: "Google Analytics 4",
    description: "Sessions, conversions, engagement, and revenue per page.",
    icon: BarChart3,
  },
  google_business_profile: {
    label: "Google Business Profile",
    description: "Locations, reviews, posts, and local search performance.",
    icon: MapPin,
  },
};

export default function IntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsInner />
    </Suspense>
  );
}

function IntegrationsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<IntegrationType | "all" | null>(null);

  const successTypes = searchParams.get("oauth_success");
  const errorReason = searchParams.get("oauth_error");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/integrations/google/status", { cache: "no-store" });
      const json = (await r.json()) as StatusResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const connect = (types: IntegrationType[]) => {
    if (!data?.oauthConfigured) return;
    setPending(types.length > 1 ? "all" : types[0]!);
    window.location.href = `/api/integrations/google/connect?types=${types.join(",")}`;
  };

  const disconnect = async (type: IntegrationType) => {
    setPending(type);
    try {
      await fetch("/api/integrations/google/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      await load();
    } finally {
      setPending(null);
    }
  };

  const dismissBanner = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("oauth_success");
    url.searchParams.delete("oauth_error");
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Plug className="w-7 h-7 text-seed-400" />
          Integrations
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Connect Google services so SEO Autopilot agents can read and act on your data.
        </p>
      </div>

      {successTypes && (
        <Banner tone="success" onDismiss={dismissBanner}>
          Connected: {successTypes.split(",").map((t) => INTEGRATIONS[t as IntegrationType]?.label ?? t).join(", ")}
        </Banner>
      )}
      {errorReason && (
        <Banner tone="error" onDismiss={dismissBanner}>
          Connection failed ({errorReason}). See <Link href="/ai/seo-autopilot/PHASE_8_SETUP.md" className="underline">setup guide</Link>.
        </Banner>
      )}

      {data && !data.oauthConfigured && (
        <Banner tone="warn">
          Google OAuth is not configured. Set <code className="font-mono">GOOGLE_OAUTH_CLIENT_ID</code>,{" "}
          <code className="font-mono">GOOGLE_OAUTH_CLIENT_SECRET</code>, and{" "}
          <code className="font-mono">GOOGLE_OAUTH_REDIRECT_URI</code> in Vercel env vars, then redeploy.
        </Banner>
      )}

      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">WordPress</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Pull existing posts and pages from a self-hosted WordPress site so agents can analyze content.
          </p>
        </div>
        <div className="px-6 py-5 flex items-center gap-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-seed-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">WordPress REST API</p>
            <p className="text-xs text-white/40 mt-0.5">
              Syncs published posts and pages into the platform daily. Requires an Application Password.
            </p>
          </div>
        </div>
        <WordPressPanel />
      </section>

      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Google Workspace</h2>
            <p className="text-xs text-white/40 mt-0.5">
              One consent screen authorizes all three. You can connect them individually too.
            </p>
          </div>
          <button
            disabled={!data?.oauthConfigured || pending !== null}
            onClick={() =>
              connect(["google_search_console", "google_analytics", "google_business_profile"])
            }
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-seed-500 hover:bg-seed-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-base transition-colors flex items-center gap-1.5"
          >
            {pending === "all" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            Connect all
          </button>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {loading && !data ? (
            <div className="p-6 text-sm text-white/40 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : (
            data?.integrations.map((row) => (
              <div key={row.type}>
                <IntegrationRow
                  row={row}
                  disabled={!data.oauthConfigured}
                  pending={pending === row.type}
                  onConnect={() => connect([row.type])}
                  onDisconnect={() => disconnect(row.type)}
                />
                {row.type === "google_analytics" && row.connected && (
                  <Ga4Panel selectedProperty={row.property} onPropertySaved={load} />
                )}
                {row.type === "google_business_profile" && row.connected && <GbpPanel />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function IntegrationRow({
  row,
  disabled,
  pending,
  onConnect,
  onDisconnect,
}: {
  row: IntegrationStatus;
  disabled: boolean;
  pending: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const meta = INTEGRATIONS[row.type];
  const Icon = meta.icon;
  return (
    <div className="px-6 py-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-seed-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{meta.label}</p>
          {row.connected ? (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
              Connected
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-white/40 bg-white/[0.06] px-2 py-0.5 rounded">
              Not connected
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">{meta.description}</p>
        {row.connected && row.grantedAt && (
          <p className="text-[11px] text-white/30 mt-1">
            Authorized {new Date(row.grantedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      {row.connected ? (
        <button
          disabled={pending}
          onClick={onDisconnect}
          className="text-xs font-semibold px-3 py-2 rounded-lg border border-white/10 hover:border-red-400/40 hover:text-red-300 text-white/70 disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Disconnect
        </button>
      ) : (
        <button
          disabled={disabled || pending}
          onClick={onConnect}
          className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/[0.08] hover:bg-seed-500/15 hover:text-seed-300 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Connect
        </button>
      )}
    </div>
  );
}

function Banner({
  tone,
  children,
  onDismiss,
}: {
  tone: "success" | "error" | "warn";
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  const styles = {
    success: "border-green-500/30 bg-green-500/[0.06] text-green-200",
    error: "border-red-500/30 bg-red-500/[0.06] text-red-200",
    warn: "border-yellow-500/30 bg-yellow-500/[0.06] text-yellow-200",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? XCircle : AlertTriangle;
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm flex items-start gap-3 ${styles}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs opacity-60 hover:opacity-100">
          Dismiss
        </button>
      )}
    </div>
  );
}
