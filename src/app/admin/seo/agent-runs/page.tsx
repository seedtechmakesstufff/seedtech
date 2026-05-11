"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Activity, RefreshCw, AlertTriangle, CheckCircle2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Window = "7d" | "30d" | "all";

interface AgentSummary {
  agent: string;
  runs: number;
  completed: number;
  failed: number;
  running: number;
  successRate: number;
  p50DurationMs: number | null;
  p95DurationMs: number | null;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  artifacts: number;
}

interface AgentRunRow {
  id: string;
  agentKey: string;
  trigger: string;
  status: "running" | "completed" | "failed";
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  model: string | null;
  tokensIn: number | null;
  tokensOut: number | null;
  costEstimateUsd: string | null;
  artifactsCreated: number;
  resultSummary: string | null;
  error: string | null;
}

interface Payload {
  window: Window;
  since: string | null;
  totals: {
    runs: number;
    failed: number;
    tokensIn: number;
    tokensOut: number;
    costUsd: number;
    artifacts: number;
    successRate: number;
  };
  summary: AgentSummary[];
  recent: AgentRunRow[];
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

function fmtCost(n: number): string {
  if (n === 0) return "—";
  if (n < 0.01) return `<$0.01`;
  return `$${n.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n === 0) return "—";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(2)}M`;
}

function fmtRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return d.toLocaleDateString();
}

function StatusPill({ status }: { status: AgentRunRow["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs">
        <CheckCircle2 className="w-3 h-3" /> completed
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 text-xs">
        <AlertTriangle className="w-3 h-3" /> failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs">
      <Loader2 className="w-3 h-3 animate-spin" /> running
    </span>
  );
}

function TriggerPill({ trigger }: { trigger: string }) {
  const color =
    trigger === "manual" ? "bg-blue-500/10 text-blue-300"
    : trigger === "run_all" ? "bg-purple-500/10 text-purple-300"
    : trigger === "chained" ? "bg-cyan-500/10 text-cyan-300"
    : "bg-white/[0.05] text-white/60";
  return <span className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide", color)}>{trigger}</span>;
}

export default function AgentRunsPage() {
  const [window, setWindow] = useState<Window>("7d");
  const [filterAgent, setFilterAgent] = useState<string>("");
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ window });
      if (filterAgent) q.set("agent", filterAgent);
      const res = await fetch(`/api/admin/agents/runs?${q.toString()}`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [window, filterAgent]);

  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-seed-400" />
            Agent Runs
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Observability for every agent invocation — duration, model usage, token spend, and artifacts produced.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white/80 text-sm border border-white/[0.06] disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          {(["7d", "30d", "all"] as Window[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={cn(
                "px-3 py-1 rounded text-xs",
                window === w ? "bg-seed-500/20 text-seed-200" : "text-white/60 hover:text-white",
              )}
            >
              {w === "all" ? "All time" : `Last ${w}`}
            </button>
          ))}
        </div>
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/80"
        >
          <option value="">All agents</option>
          {Object.entries(AGENT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Totals row */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Runs" value={data.totals.runs.toString()} />
          <Stat label="Success rate" value={`${Math.round(data.totals.successRate * 100)}%`}
                tone={data.totals.failed > 0 ? "warn" : "ok"} />
          <Stat label="Tokens in / out" value={`${fmtTokens(data.totals.tokensIn)} / ${fmtTokens(data.totals.tokensOut)}`} />
          <Stat label="Est. cost" value={fmtCost(data.totals.costUsd)} />
          <Stat label="Artifacts created" value={data.totals.artifacts.toString()} />
        </div>
      )}

      {/* Per-agent rollup */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] text-sm text-white/70 font-medium">Per-agent rollup</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-white/40 bg-white/[0.02]">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Agent</th>
                <th className="text-right px-3 py-2 font-medium">Runs</th>
                <th className="text-right px-3 py-2 font-medium">Success</th>
                <th className="text-right px-3 py-2 font-medium">p50</th>
                <th className="text-right px-3 py-2 font-medium">p95</th>
                <th className="text-right px-3 py-2 font-medium">Tokens</th>
                <th className="text-right px-3 py-2 font-medium">Cost</th>
                <th className="text-right px-3 py-2 font-medium">Artifacts</th>
              </tr>
            </thead>
            <tbody>
              {data?.summary.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-white/40">No runs in this window</td></tr>
              )}
              {data?.summary.map((a) => (
                <tr key={a.agent} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-2 text-white/90">
                    <button
                      onClick={() => setFilterAgent(filterAgent === a.agent ? "" : a.agent)}
                      className="hover:text-seed-300"
                    >
                      {AGENT_LABELS[a.agent] ?? a.agent}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right text-white/70">{a.runs}</td>
                  <td className={cn(
                    "px-3 py-2 text-right",
                    a.failed === 0 ? "text-emerald-300" : a.successRate < 0.8 ? "text-red-300" : "text-amber-300",
                  )}>
                    {Math.round(a.successRate * 100)}%{a.failed > 0 && <span className="text-white/40 text-xs"> ({a.failed} failed)</span>}
                  </td>
                  <td className="px-3 py-2 text-right text-white/70">{fmtDuration(a.p50DurationMs)}</td>
                  <td className="px-3 py-2 text-right text-white/70">{fmtDuration(a.p95DurationMs)}</td>
                  <td className="px-3 py-2 text-right text-white/70">{fmtTokens(a.tokensIn + a.tokensOut)}</td>
                  <td className="px-3 py-2 text-right text-white/70">{fmtCost(a.costUsd)}</td>
                  <td className="px-3 py-2 text-right text-white/70">{a.artifacts || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent runs */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] text-sm text-white/70 font-medium">
          Recent runs {filterAgent && <span className="text-white/40">— {AGENT_LABELS[filterAgent] ?? filterAgent}</span>}
        </div>
        <div className="divide-y divide-white/[0.04]">
          {data?.recent.length === 0 && (
            <div className="px-4 py-8 text-center text-white/40 text-sm">No runs yet</div>
          )}
          {data?.recent.map((r) => {
            const isOpen = expanded.has(r.id);
            return (
              <div key={r.id}>
                <button
                  onClick={() => toggle(r.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] text-left"
                >
                  {isOpen ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/90 text-sm">{AGENT_LABELS[r.agentKey] ?? r.agentKey}</span>
                      <StatusPill status={r.status} />
                      <TriggerPill trigger={r.trigger} />
                      <span className="text-white/40 text-xs">{fmtRelative(r.startedAt)}</span>
                    </div>
                    {r.resultSummary && (
                      <div className="text-white/50 text-xs mt-1 truncate">{r.resultSummary}</div>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-white/50 shrink-0">
                    <span>{fmtDuration(r.durationMs)}</span>
                    {r.artifactsCreated > 0 && <span>{r.artifactsCreated} artifacts</span>}
                    {r.costEstimateUsd && <span>{fmtCost(Number(r.costEstimateUsd))}</span>}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-12 py-3 bg-white/[0.01] text-xs text-white/60 space-y-1">
                    <div><span className="text-white/40">Run id:</span> {r.id}</div>
                    <div><span className="text-white/40">Started:</span> {new Date(r.startedAt).toLocaleString()}</div>
                    {r.completedAt && <div><span className="text-white/40">Completed:</span> {new Date(r.completedAt).toLocaleString()}</div>}
                    {r.model && <div><span className="text-white/40">Model:</span> {r.model}</div>}
                    {(r.tokensIn != null || r.tokensOut != null) && (
                      <div><span className="text-white/40">Tokens:</span> {r.tokensIn ?? 0} in / {r.tokensOut ?? 0} out</div>
                    )}
                    {r.error && (
                      <div className="mt-2 p-2 rounded bg-red-500/5 border border-red-500/20 text-red-300 whitespace-pre-wrap">
                        {r.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-white/40">
        Tip: trigger runs from <Link href="/admin/seo/agents" className="text-seed-300 hover:underline">Agents</Link> or wait for cron.
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "ok" | "warn" }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="text-xs text-white/40 uppercase tracking-wide">{label}</div>
      <div className={cn(
        "text-xl font-medium mt-1",
        tone === "ok" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-white/90",
      )}>{value}</div>
    </div>
  );
}
