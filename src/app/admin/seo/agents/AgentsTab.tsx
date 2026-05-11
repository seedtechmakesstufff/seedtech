"use client";

import { useState } from "react";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Activity,
  FileText,
  MapPin,
  Link2,
  Mail,
  ListChecks,
  Bot,
  Newspaper,
  Info,
} from "lucide-react";
import Link from "next/link";
import { AgentDetailModal } from "./AgentDetailModal";

interface AgentDef {
  key: string;
  label: string;
  description: string;
  endpoint: string;
  icon: typeof Bot;
  cadence: string;
}

const AGENTS: AgentDef[] = [
  { key: "industry-researcher", label: "Industry Researcher", description: "Fetches primary sources (FMCSA, ABA, FDA, NRA…) across your client verticals and extracts novel insights. Runs first so the Brief Generator has fresh real-world signals.", endpoint: "/api/admin/agents/industry-researcher/run", icon: Newspaper, cadence: "Mon 8 AM UTC" },
  { key: "strategy-analyst", label: "Strategy Analyst", description: "Reads everything (GSC, GA4, GBP, events, citations) and writes the weekly priority brief.", endpoint: "/api/admin/agents/strategy-analyst/run", icon: Sparkles, cadence: "Mon 10 AM UTC" },
  { key: "brief-generator", label: "Brief Generator", description: "Turns research signals + analyst priorities into structured content briefs queued for approval.", endpoint: "/api/admin/agents/brief-generator/run", icon: FileText, cadence: "Mon 10:30 AM UTC" },
  { key: "blog-drafter", label: "Blog Drafter", description: "Drafts full posts from approved briefs. Approve in Inbox to publish.", endpoint: "/api/admin/agents/blog-drafter/run", icon: FileText, cadence: "daily 12 PM UTC" },
  { key: "gbp-post-drafter", label: "GBP Post Drafter", description: "Drafts 1-2 Google Business Profile posts per location.", endpoint: "/api/admin/agents/gbp-post-drafter/run", icon: MapPin, cadence: "Mon 11:30 AM UTC" },
  { key: "keyword-scout", label: "Keyword Scout", description: "Surfaces queries from GSC you don't track yet.", endpoint: "/api/admin/agents/keyword-scout/run", icon: Search, cadence: "Mon 9 AM UTC" },
  { key: "content-decay-watcher", label: "Content Decay Watcher", description: "Detects posts losing traffic/conversions and queues refresh briefs.", endpoint: "/api/admin/agents/content-decay-watcher/run", icon: Activity, cadence: "daily 5:30 AM UTC" },
  { key: "internal-link-agent", label: "Internal Link Agent", description: "Suggests internal-link insertions across recent posts.", endpoint: "/api/admin/agents/internal-link-agent/run", icon: Link2, cadence: "daily 7 AM UTC" },
  { key: "weekly-digest", label: "Weekly Digest Email", description: "Sends the Monday-morning summary email.", endpoint: "/api/admin/agents/weekly-digest/run", icon: Mail, cadence: "Mon 1 PM UTC · 9 AM EDT" },
];

interface RunResult {
  ok?: boolean;
  error?: string;
  durationMs?: number;
  [key: string]: unknown;
}

interface RunAllStep {
  step: string;
  success: boolean;
  durationMs: number;
  result?: unknown;
  error?: string;
}

export function AgentsTab() {
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, RunResult>>({});
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null);
  const [runAllPending, setRunAllPending] = useState(false);
  const [runAllResult, setRunAllResult] = useState<{ steps: RunAllStep[]; durationMs: number } | null>(null);

  const runOne = async (agent: AgentDef) => {
    setRunning(agent.key);
    try {
      const r = await fetch(agent.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const j = (await r.json()) as RunResult;
      setResults((prev) => ({ ...prev, [agent.key]: r.ok ? j : { error: j.error ?? "Failed" } }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [agent.key]: { error: e instanceof Error ? e.message : "Failed" },
      }));
    } finally {
      setRunning(null);
    }
  };

  const runAll = async () => {
    if (!confirm("Run the full weekly pipeline now? This calls Claude multiple times and takes 2-5 minutes.")) return;
    setRunAllPending(true);
    setRunAllResult(null);
    try {
      const r = await fetch("/api/admin/agents/run-all", { method: "POST" });
      const j = await r.json();
      setRunAllResult(r.ok ? j : { steps: [], durationMs: 0 });
    } finally {
      setRunAllPending(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-seed-500/[0.08] to-transparent border border-seed-500/30 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-seed-400" />
              Run all weekly agents
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-xl">
              Fires Industry Researcher → Keyword Scout → Decay Watcher → Internal Link Agent → Strategy Analyst → Brief
              Generator → GBP Post Drafter → Weekly Digest, in order. Skips Blog Drafter (consumes
              briefs you&apos;ve already approved — use <Link href="/admin/inbox" className="underline">Inbox</Link>).
            </p>
          </div>
          <button
            onClick={runAll}
            disabled={runAllPending}
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 transition-colors flex items-center gap-2"
          >
            {runAllPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {runAllPending ? "Running…" : "Run all weekly agents"}
          </button>
        </div>

        {runAllResult && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[11px] text-white/50">Total time: {Math.round((runAllResult.durationMs ?? 0) / 1000)}s</p>
            {runAllResult.steps.map((s) => (
              <div key={s.step} className="flex items-center gap-2 text-xs">
                {s.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
                <span className="text-white font-mono">{s.step}</span>
                <span className="text-white/40">— {Math.round(s.durationMs / 1000)}s</span>
                {s.error && <span className="text-red-300">— {s.error}</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const result = results[agent.key];
          const pending = running === agent.key;
          return (
            <div key={agent.key} className="bg-dark-elevated border border-white/[0.06] rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-seed-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white">{agent.label}</p>
                  <span className="text-[10px] uppercase tracking-wide text-white/40 bg-white/[0.06] px-2 py-0.5 rounded">{agent.cadence}</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{agent.description}</p>
                {result && (
                  <p className="text-[11px] mt-1 font-mono text-white/60">
                    {result.error ? (
                      <span className="text-red-300">{result.error}</span>
                    ) : (
                      <>✓ {Math.round((result.durationMs ?? 0) / 1000)}s — {summarizeResult(result)}</>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="text-xs px-2 py-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-colors"
                title="View config & tune"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={pending}
                onClick={() => runOne(agent)}
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/[0.08] hover:bg-seed-500/15 hover:text-seed-300 text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Run
              </button>
            </div>
          );
        })}
      </section>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}

function summarizeResult(r: RunResult): string {
  const interesting = ["briefsCreated", "draftsCreated", "postsDrafted", "candidatesFound", "artifactsQueued", "newReviewsDrafted", "rowsUpserted", "messageId", "priorities"];
  const parts: string[] = [];
  for (const key of interesting) if (r[key] != null) parts.push(`${key}=${r[key]}`);
  return parts.join(", ") || "ok";
}
