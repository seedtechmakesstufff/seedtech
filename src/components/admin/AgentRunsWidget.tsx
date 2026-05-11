"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payload {
  totals: {
    runs: number;
    failed: number;
    tokensIn: number;
    tokensOut: number;
    costUsd: number;
    artifacts: number;
    successRate: number;
  };
  recent: Array<{
    id: string;
    agentKey: string;
    status: "running" | "completed" | "failed";
    startedAt: string;
    durationMs: number | null;
    resultSummary: string | null;
    artifactsCreated: number;
  }>;
}

const AGENT_LABELS: Record<string, string> = {
  "industry-researcher": "Industry Researcher",
  "strategy-analyst": "Strategy Analyst",
  "brief-generator": "Brief Generator",
  "blog-drafter": "Blog Drafter",
  "gbp-post-drafter": "GBP Post Drafter",
  "keyword-scout": "Keyword Scout",
  "content-decay-watcher": "Content Decay Watcher",
  "internal-link-agent": "Internal Link Agent",
  "weekly-digest": "Weekly Digest",
};

function fmtDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function AgentRunsWidget() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/agents/runs?window=7d", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-seed-400" />
          <h3 className="text-sm font-medium text-white/80">Agent Activity</h3>
          <span className="text-xs text-white/30">— last 7 days</span>
        </div>
        <Link href="/admin/seo/agent-runs" className="text-xs text-seed-300 hover:text-seed-200 inline-flex items-center gap-0.5">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {loading && <div className="text-white/40 text-sm py-8 text-center">Loading…</div>}
      {!loading && data && (
        <>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Mini label="Runs" value={String(data.totals.runs)} />
            <Mini
              label="Success"
              value={`${Math.round(data.totals.successRate * 100)}%`}
              tone={data.totals.failed > 0 ? "warn" : "ok"}
            />
            <Mini label="Cost" value={data.totals.costUsd > 0 ? `$${data.totals.costUsd.toFixed(2)}` : "—"} />
            <Mini label="Artifacts" value={String(data.totals.artifacts)} />
          </div>

          {data.recent.length === 0 ? (
            <div className="text-white/30 text-xs py-6 text-center">No agent activity yet — trigger one from <Link href="/admin/seo/agents" className="text-seed-300 hover:underline">Agents</Link>.</div>
          ) : (
            <div className="space-y-1.5">
              {data.recent.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-2 py-1.5 text-xs">
                  {r.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : r.status === "failed" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin" />
                  )}
                  <span className="text-white/80 shrink-0">{AGENT_LABELS[r.agentKey] ?? r.agentKey}</span>
                  <span className="text-white/40 truncate flex-1">{r.resultSummary ?? ""}</span>
                  <span className="text-white/30 shrink-0">{fmtDuration(r.durationMs)}</span>
                  <span className="text-white/30 shrink-0 w-16 text-right">{fmtRelative(r.startedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Mini({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "ok" | "warn" }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-white/30">{label}</div>
      <div className={cn(
        "text-base font-medium mt-0.5",
        tone === "ok" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-white/90",
      )}>{value}</div>
    </div>
  );
}
