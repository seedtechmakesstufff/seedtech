"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Loader2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Trash2,
} from "lucide-react";

interface WeekBucket {
  week: string;            // "2026-W19"
  label: string;
  pending: number;
  approved: number;
  published: number;
  rejected: number;
  failed: number;
  total: number;
  latestAt: string;
  digest: { status: string; sentAt: string } | null;
}

export default function InboxPage() {
  const [weeks, setWeeks] = useState<WeekBucket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadWeeks = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/inbox/weeks", { cache: "no-store" });
      const j = await r.json();
      setWeeks(j.weeks ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWeeks();
  }, []);

  const clearAll = async () => {
    if (!confirm("Delete ALL inbox artifacts? This cannot be undone.")) return;
    setClearing(true);
    try {
      await fetch("/api/inbox", { method: "DELETE" });
      setWeeks([]);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
              <Inbox className="w-7 h-7 text-seed-400" />
              Inbox
            </h1>
            <p className="text-white/50 text-sm mt-1">
              One row per week. Click a week to review the agent-generated items from that period.
            </p>
          </div>
          <button
            onClick={clearAll}
            disabled={clearing || !weeks?.length}
            className="shrink-0 text-xs font-medium px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors flex items-center gap-1.5 mt-1"
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Clear all artifacts
          </button>
        </div>
      </div>

      <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-6 px-5 py-3 text-[11px] uppercase tracking-wide text-white/40 border-b border-white/[0.06]">
          <div>Week</div>
          <div className="text-right">Pending</div>
          <div className="text-right">Approved</div>
          <div className="text-right">Published</div>
          <div className="text-right">Total</div>
          <div className="text-right pr-1">Digest</div>
        </div>

        {loading && (
          <div className="px-5 py-8 text-sm text-white/40 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {!loading && weeks && weeks.length === 0 && (
          <div className="px-5 py-8 text-sm text-white/40 text-center">
            No agent activity yet. Run agents from <Link href="/admin/seo/agents" className="underline">SEO Agents</Link>.
          </div>
        )}

        {!loading && weeks?.map((w) => {
          const isCurrent = isCurrentWeek(w.week);
          return (
            <Link
              key={w.week}
              href={`/admin/inbox/${w.week}`}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-6 px-5 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors items-center group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-seed-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{w.label}</p>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-wide text-seed-300 bg-seed-500/15 px-1.5 py-0.5 rounded">
                        This week
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 truncate font-mono">{w.week}</p>
                </div>
              </div>
              <Stat value={w.pending} tone={w.pending > 0 ? "warn" : "muted"} />
              <Stat value={w.approved} tone="muted" />
              <Stat value={w.published} tone={w.published > 0 ? "good" : "muted"} />
              <Stat value={w.total} tone="muted" emphasized />
              <div className="text-right pr-1 flex items-center justify-end gap-2">
                {w.digest ? (
                  w.digest.status === "completed" ? (
                    <span className="text-[11px] text-green-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> sent
                    </span>
                  ) : (
                    <span className="text-[11px] text-yellow-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {w.digest.status}
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> not sent
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, tone, emphasized }: { value: number; tone: "good" | "warn" | "muted"; emphasized?: boolean }) {
  const color =
    tone === "good" ? "text-green-300"
    : tone === "warn" && value > 0 ? "text-yellow-300"
    : "text-white/40";
  return (
    <div className={`text-right tabular-nums ${emphasized ? "text-white text-sm font-semibold" : "text-xs"} ${color}`}>
      {value}
    </div>
  );
}

function isCurrentWeek(week: string): boolean {
  const today = new Date();
  const isoYear = today.getUTCFullYear();
  // Match server-side toIsoWeek logic locally
  const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const w = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  const current = `${d.getUTCFullYear()}-W${String(w).padStart(2, "0")}`;
  void isoYear;
  return current === week;
}
