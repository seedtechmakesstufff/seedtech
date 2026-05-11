"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
} from "lucide-react";

interface WpStatus {
  connected: boolean;
  siteUrl?: string;
  pathPrefix?: string;
  postCount?: number;
  lastSyncAt?: string;
}

interface SyncResult {
  ok?: boolean;
  postsUpserted?: number;
  postsSkipped?: number;
  pagesUpserted?: number;
  errors?: string[];
  durationMs?: number;
  error?: string;
}

interface ConnectResult {
  ok?: boolean;
  siteTitle?: string;
  error?: string;
}

export function WordPressPanel() {
  const [status, setStatus] = useState<WpStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Connect form state
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [pathPrefix, setPathPrefix] = useState("/blog");
  const [connecting, setConnecting] = useState(false);
  const [connectResult, setConnectResult] = useState<ConnectResult | null>(null);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  // Disconnect state
  const [disconnecting, setDisconnecting] = useState(false);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const r = await fetch("/api/admin/integrations/wordpress/connect");
      const j = (await r.json()) as WpStatus;
      setStatus(j);
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const connect = async () => {
    setConnecting(true);
    setConnectResult(null);
    try {
      const r = await fetch("/api/admin/integrations/wordpress/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl, username, appPassword, pathPrefix }),
      });
      const j = (await r.json()) as ConnectResult;
      if (!r.ok) {
        setConnectResult({ error: j.error ?? "Connection failed" });
      } else {
        setConnectResult({ ok: true, siteTitle: j.siteTitle });
        await loadStatus();
      }
    } catch (e) {
      setConnectResult({ error: e instanceof Error ? e.message : "Connection failed" });
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      await fetch("/api/admin/integrations/wordpress/connect", { method: "DELETE" });
      setStatus({ connected: false });
      setSyncResult(null);
    } finally {
      setDisconnecting(false);
    }
  };

  const sync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const r = await fetch("/api/admin/integrations/wordpress/sync", { method: "POST" });
      const j = (await r.json()) as SyncResult;
      setSyncResult(r.ok ? j : { error: j.error ?? "Sync failed" });
      if (r.ok) await loadStatus();
    } catch (e) {
      setSyncResult({ error: e instanceof Error ? e.message : "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="px-6 pb-5 -mt-2">
        <div className="bg-dark-base/50 border border-white/[0.04] rounded-lg p-4">
          <Loader2 className="w-4 h-4 animate-spin text-white/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-5 -mt-2">
      <div className="bg-dark-base/50 border border-white/[0.04] rounded-lg p-4 space-y-4">
        {status?.connected ? (
          <>
            {/* Connected state */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Globe className="w-3.5 h-3.5 text-seed-400" />
                  <span className="font-mono text-xs text-white/60">{status.siteUrl}</span>
                </div>
                {status.postCount !== undefined && (
                  <p className="text-[11px] text-white/40">
                    {status.postCount} posts synced · path prefix: {status.pathPrefix ?? "/blog"}
                    {status.lastSyncAt && ` · last synced ${new Date(status.lastSyncAt).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={sync}
                  disabled={syncing}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500/15 hover:bg-seed-500/25 text-seed-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Sync now
                </button>
                <button
                  onClick={disconnect}
                  disabled={disconnecting}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-400/40 hover:text-red-300 text-white/50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  {disconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                  Disconnect
                </button>
              </div>
            </div>

            {/* Sync result */}
            {syncResult && !syncResult.error && (
              <div className="text-[11px] text-green-300/80 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                {syncResult.postsUpserted ?? 0} posts upserted · {syncResult.postsSkipped ?? 0} skipped · {syncResult.pagesUpserted ?? 0} pages · {syncResult.durationMs ?? 0}ms
                {syncResult.errors && syncResult.errors.length > 0 && (
                  <span className="text-yellow-300/70 ml-1">({syncResult.errors.length} warnings)</span>
                )}
              </div>
            )}
            {syncResult?.error && (
              <div className="text-[11px] text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> {syncResult.error}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Connect form */}
            <div className="space-y-3">
              <p className="text-xs text-white/50">
                Connect your client&apos;s WordPress site so agents can analyze existing content.
                Requires an{" "}
                <a
                  href="https://wordpress.org/documentation/article/application-passwords/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-seed-400 underline"
                >
                  Application Password
                </a>{" "}
                (WordPress &rarr; Users &rarr; Profile &rarr; Application Passwords).
              </p>

              <div className="grid grid-cols-1 gap-2">
                <input
                  type="url"
                  placeholder="Site URL (e.g. https://client.com)"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full bg-dark-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-seed-500/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="WordPress username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-dark-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-seed-500/50"
                  />
                  <input
                    type="password"
                    placeholder="Application password"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    className="bg-dark-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-seed-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-white/40 shrink-0">Blog path prefix:</label>
                  <input
                    type="text"
                    placeholder="/blog"
                    value={pathPrefix}
                    onChange={(e) => setPathPrefix(e.target.value)}
                    className="flex-1 bg-dark-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-seed-500/50"
                  />
                  <p className="text-[10px] text-white/30 shrink-0">
                    Use <code className="font-mono">/blog</code> for <code className="font-mono">/blog/post-slug</code>,
                    or leave empty for <code className="font-mono">/post-slug</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={connect}
                  disabled={connecting || !siteUrl || !username || !appPassword}
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-seed-500 hover:bg-seed-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-base transition-colors flex items-center gap-1.5"
                >
                  {connecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  Connect &amp; Test
                </button>

                {connectResult?.ok && (
                  <span className="text-[11px] text-green-300/80 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected to {connectResult.siteTitle ?? "WordPress"}
                  </span>
                )}
                {connectResult?.error && (
                  <span className="text-[11px] text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" /> {connectResult.error}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
