"use client";

import { useState } from "react";
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

interface SyncResult {
  ok?: boolean;
  accounts?: number;
  locations?: number;
  reviewsUpserted?: number;
  newReviewsDrafted?: number;
  postsUpserted?: number;
  metricsDays?: number;
  errors?: string[];
  durationMs?: number;
  error?: string;
}

export function GbpPanel() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const sync = async () => {
    setSyncing(true);
    setResult(null);
    try {
      const r = await fetch("/api/admin/integrations/gbp/sync", { method: "POST" });
      const j = (await r.json()) as SyncResult;
      setResult(r.ok ? j : { error: j.error ?? "Sync failed" });
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="px-6 pb-5 -mt-2">
      <div className="bg-dark-base/50 border border-white/[0.04] rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={sync}
            disabled={syncing}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500/15 hover:bg-seed-500/25 text-seed-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Sync now (locations, reviews, posts, metrics)
          </button>
          {result && !result.error && result.ok && (
            <span className="text-[11px] text-green-300/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              {result.locations ?? 0} locations · {result.reviewsUpserted ?? 0} reviews · {result.newReviewsDrafted ?? 0} reply drafts queued · {result.postsUpserted ?? 0} posts · {result.metricsDays ?? 0} metric-days · {result.durationMs ?? 0}ms
            </span>
          )}
          {result?.error && (
            <span className="text-[11px] text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> {result.error}
            </span>
          )}
        </div>
        {result?.errors && result.errors.length > 0 && (
          <details className="text-[11px] text-yellow-300/80">
            <summary className="cursor-pointer">{result.errors.length} non-fatal warnings</summary>
            <ul className="mt-1 ml-4 list-disc">
              {result.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
