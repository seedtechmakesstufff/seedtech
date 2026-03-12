"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  AlertTriangle,
  Brain,
  Gauge,
  RefreshCw,
  Globe,
  Loader2,
  Zap,
  BarChart3,
  Send,
} from "lucide-react";
import { TRACKED_KEYWORDS, SEO_TASKS, CONTENT_CALENDAR } from "@/data/seo-strategy";
import Link from "next/link";
import { BusinessContextModal } from "@/components/admin/BusinessContextModal";

const tierColors: Record<number, string> = {
  1: "bg-seed-500/20 text-seed-400 border-seed-500/30",
  2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="w-4 h-4 text-seed-400" />,
  "in-progress": <Clock className="w-4 h-4 text-yellow-400" />,
  "not-started": <Circle className="w-4 h-4 text-white/20" />,
};

/* ── Types for live data ── */
interface GSCSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  topKeywords: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
  trackedPositions: Record<string, number>;
}

interface PageSpeedScore {
  url: string;
  strategy: string;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  coreWebVitals: {
    lcp: number | null;
    cls: number | null;
    fcp: number | null;
    tbt: number | null;
  };
}

function scoreColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 90) return "bg-green-400/10 border-green-400/20";
  if (score >= 50) return "bg-yellow-400/10 border-yellow-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export default function SEODashboardPage() {
  const [contextOpen, setContextOpen] = useState(false);

  /* ── Search Console state ── */
  const [gscConnected, setGscConnected] = useState<boolean | null>(null);
  const [gscSummary, setGscSummary] = useState<GSCSummary | null>(null);
  const [gscLoading, setGscLoading] = useState(false);

  /* ── PageSpeed state ── */
  const [pageSpeedResults, setPageSpeedResults] = useState<PageSpeedScore[] | null>(null);
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false);

  /* ── AI Advisor state ── */
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");

  /* ── IndexNow state ── */
  const [indexNowLoading, setIndexNowLoading] = useState(false);
  const [indexNowResult, setIndexNowResult] = useState<string | null>(null);

  /* ── Static data ── */
  const tier1 = TRACKED_KEYWORDS.filter((k) => k.tier === 1);
  const tier2 = TRACKED_KEYWORDS.filter((k) => k.tier === 2);
  const tier3 = TRACKED_KEYWORDS.filter((k) => k.tier === 3);

  const tasksComplete = SEO_TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = SEO_TASKS.filter((t) => t.status === "in-progress").length;
  const tasksTotal = SEO_TASKS.length;

  const contentPublished = CONTENT_CALENDAR.filter((c) => c.status === "published").length;
  const contentTotal = CONTENT_CALENDAR.length;

  /* ── Check GSC connection on mount ── */
  useEffect(() => {
    fetch("/api/admin/seo/search-console?action=test")
      .then((r) => r.json())
      .then((d) => {
        setGscConnected(d.connected ?? false);
        if (d.connected) fetchGscData();
      })
      .catch(() => setGscConnected(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGscData = useCallback(async () => {
    setGscLoading(true);
    try {
      const res = await fetch("/api/admin/seo/search-console?action=summary&days=28");
      const data = await res.json();
      if (data.summary) setGscSummary(data.summary);
    } catch {
      /* ignore */
    }
    setGscLoading(false);
  }, []);

  const runPageSpeedAudit = useCallback(async () => {
    setPageSpeedLoading(true);
    setPageSpeedResults(null);
    try {
      const res = await fetch("/api/admin/seo/pagespeed?audit=true&strategy=mobile");
      const data = await res.json();
      if (data.results) setPageSpeedResults(data.results);
    } catch {
      /* ignore */
    }
    setPageSpeedLoading(false);
  }, []);

  const runAiAnalysis = useCallback(async (question?: string) => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/admin/seo/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || undefined,
          includeSearchConsole: gscConnected,
          includePageSpeed: !!pageSpeedResults,
          pageSpeedData: pageSpeedResults,
        }),
      });
      const data = await res.json();
      if (data.analysis) setAiAnalysis(data.analysis);
    } catch {
      /* ignore */
    }
    setAiLoading(false);
  }, [gscConnected, pageSpeedResults]);

  const pingIndexNow = useCallback(async () => {
    setIndexNowLoading(true);
    setIndexNowResult(null);
    try {
      const res = await fetch("/api/admin/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: [
            "https://seedtechllc.com",
            "https://seedtechllc.com/services/managed-it",
            "https://seedtechllc.com/pricing/it-support",
            "https://seedtechllc.com/blog",
          ],
        }),
      });
      const data = await res.json();
      setIndexNowResult(data.success ? `✓ Submitted ${data.results?.length || 0} URLs` : data.error || "Failed");
    } catch {
      setIndexNowResult("Failed to connect");
    }
    setIndexNowLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">SEO Dashboard</h1>
          <p className="text-white/40 mt-1">
            Live keyword tracking, performance audits, and AI-powered strategy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setContextOpen(true)}
            className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
            title="AI Business Context"
          >
            <Brain className="w-4 h-4 text-seed-400" />
            <span className="hidden sm:inline">AI Context</span>
          </button>
          <button
            onClick={pingIndexNow}
            disabled={indexNowLoading}
            className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            title="Ping IndexNow"
          >
            {indexNowLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-blue-400" />
            )}
            <span className="hidden sm:inline">IndexNow</span>
          </button>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Blog Writer
          </Link>
        </div>
      </div>

      {indexNowResult && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-sm text-blue-300 flex items-center justify-between">
          <span>{indexNowResult}</span>
          <button onClick={() => setIndexNowResult(null)} className="text-blue-400 hover:text-blue-300 text-xs">Dismiss</button>
        </div>
      )}

      {/* Business Context Modal */}
      <BusinessContextModal open={contextOpen} onClose={() => setContextOpen(false)} />

      {/* Strategy Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <Target className="w-5 h-5 text-seed-400 mb-3" />
          <p className="text-2xl font-semibold text-white">{TRACKED_KEYWORDS.length}</p>
          <p className="text-sm text-white/40 mt-1">Tracked Keywords</p>
          <p className="text-xs text-white/20 mt-2">
            {tier1.length} Tier 1 · {tier2.length} Tier 2 · {tier3.length} Tier 3
          </p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <CheckCircle2 className="w-5 h-5 text-seed-400 mb-3" />
          <p className="text-2xl font-semibold text-white">{tasksComplete}/{tasksTotal}</p>
          <p className="text-sm text-white/40 mt-1">SEO Tasks Complete</p>
          <p className="text-xs text-white/20 mt-2">{tasksInProgress} in progress</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <FileText className="w-5 h-5 text-blue-400 mb-3" />
          <p className="text-2xl font-semibold text-white">{contentPublished}/{contentTotal}</p>
          <p className="text-sm text-white/40 mt-1">Blog Posts Published</p>
          <p className="text-xs text-white/20 mt-2">Content calendar progress</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <TrendingUp className="w-5 h-5 text-yellow-400 mb-3" />
          {gscSummary ? (
            <>
              <p className="text-2xl font-semibold text-white">{gscSummary.avgPosition.toFixed(1)}</p>
              <p className="text-sm text-white/40 mt-1">Avg. Keyword Position</p>
              <p className="text-xs text-white/20 mt-2">
                {gscSummary.totalClicks.toLocaleString()} clicks · {gscSummary.totalImpressions.toLocaleString()} impressions
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold text-white">—</p>
              <p className="text-sm text-white/40 mt-1">Avg. Keyword Position</p>
              <p className="text-xs text-white/20 mt-2">
                {gscConnected === false ? (
                  <Link href="/admin/settings" className="text-seed-400 hover:underline">Connect Search Console →</Link>
                ) : gscLoading ? "Loading…" : "Connect Search Console"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Search Console Overview (when connected) */}
      {gscSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Keywords from GSC */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-seed-400" />
                Top Keywords (Search Console – 28d)
              </h2>
              <button onClick={fetchGscData} disabled={gscLoading} className="text-white/30 hover:text-white/60">
                <RefreshCw className={`w-3.5 h-3.5 ${gscLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                    <th className="px-5 py-2 font-medium">Keyword</th>
                    <th className="px-5 py-2 font-medium text-right">Clicks</th>
                    <th className="px-5 py-2 font-medium text-right">Impr.</th>
                    <th className="px-5 py-2 font-medium text-right">Pos.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {gscSummary.topKeywords.slice(0, 10).map((kw) => (
                    <tr key={kw.keyword} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-2 text-white/70">{kw.keyword}</td>
                      <td className="px-5 py-2 text-right font-mono text-seed-400">{kw.clicks}</td>
                      <td className="px-5 py-2 text-right font-mono text-white/40">{kw.impressions.toLocaleString()}</td>
                      <td className="px-5 py-2 text-right font-mono text-white/60">{kw.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Pages from GSC */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Top Pages (Search Console – 28d)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                    <th className="px-5 py-2 font-medium">Page</th>
                    <th className="px-5 py-2 font-medium text-right">Clicks</th>
                    <th className="px-5 py-2 font-medium text-right">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {gscSummary.topPages.slice(0, 8).map((pg) => (
                    <tr key={pg.page} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-2 text-white/50 font-mono text-xs truncate max-w-[250px]">
                        {pg.page.replace(/https?:\/\/[^/]+/, "")}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-seed-400">{pg.clicks}</td>
                      <td className="px-5 py-2 text-right font-mono text-white/40">{(pg.ctr * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Tracking Table */}
      <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-white/40" />
            Keyword Tracking
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3].map((t) => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded-full border ${tierColors[t]}`}>
                Tier {t}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                <th className="px-5 py-3 font-medium">Keyword</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Volume</th>
                <th className="px-5 py-3 font-medium">Intent</th>
                <th className="px-5 py-3 font-medium">Target Page</th>
                <th className="px-5 py-3 font-medium">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {TRACKED_KEYWORDS.map((kw) => {
                const livePos = gscSummary?.trackedPositions?.[kw.keyword];
                return (
                  <tr key={kw.keyword} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white/80 font-medium">{kw.keyword}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${tierColors[kw.tier]}`}>
                        T{kw.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/50 font-mono text-xs">{kw.volume}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-white/40">{kw.intent}</span>
                    </td>
                    <td className="px-5 py-3 text-white/40 font-mono text-xs">{kw.targetPage}</td>
                    <td className="px-5 py-3">
                      {livePos ? (
                        <span className="text-seed-400 font-mono font-semibold">{livePos.toFixed(1)}</span>
                      ) : kw.currentPosition ? (
                        <span className="text-white/40 font-mono">{kw.currentPosition}</span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PageSpeed Insights Panel */}
      <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-yellow-400" />
            PageSpeed Insights (Mobile)
          </h2>
          <button
            onClick={runPageSpeedAudit}
            disabled={pageSpeedLoading}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
          >
            {pageSpeedLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {pageSpeedLoading ? "Auditing pages…" : "Run Audit"}
          </button>
        </div>

        {pageSpeedResults ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                  <th className="px-5 py-3 font-medium">Page</th>
                  <th className="px-5 py-3 font-medium text-center">Perf.</th>
                  <th className="px-5 py-3 font-medium text-center">A11y</th>
                  <th className="px-5 py-3 font-medium text-center">SEO</th>
                  <th className="px-5 py-3 font-medium text-right">LCP</th>
                  <th className="px-5 py-3 font-medium text-right">CLS</th>
                  <th className="px-5 py-3 font-medium text-right">TBT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {pageSpeedResults.map((r) => (
                  <tr key={r.url} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white/50 font-mono text-xs truncate max-w-[200px]">
                      {new URL(r.url).pathname}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.performanceScore)} ${scoreColor(r.performanceScore)}`}>
                        {r.performanceScore}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.accessibilityScore)} ${scoreColor(r.accessibilityScore)}`}>
                        {r.accessibilityScore}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.seoScore)} ${scoreColor(r.seoScore)}`}>
                        {r.seoScore}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-white/50">
                      {r.coreWebVitals.lcp ? `${(r.coreWebVitals.lcp / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-white/50">
                      {r.coreWebVitals.cls?.toFixed(3) ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-white/50">
                      {r.coreWebVitals.tbt ? `${r.coreWebVitals.tbt}ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-white/20 text-sm">
            Click <strong className="text-white/40">Run Audit</strong> to analyze your site&apos;s Core Web Vitals and performance scores.
          </div>
        )}
      </div>

      {/* Two Column: Tasks + Content Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Tasks */}
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Implementation Roadmap</h2>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
            {SEO_TASKS.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                {statusIcons[task.status]}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.status === "done" ? "text-white/30 line-through" : "text-white/70"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-white/20">Phase {task.phase}</p>
                </div>
                {task.priority === "critical" && (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400/60 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Calendar */}
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Content Calendar</h2>
            <Link
              href="/admin/blog/new"
              className="text-xs text-seed-400 hover:text-seed-300 flex items-center gap-1"
            >
              New post <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
            {CONTENT_CALENDAR.map((item) => (
              <div key={item.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70 font-medium">{item.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === "published"
                        ? "bg-seed-500/20 text-seed-400"
                        : item.status === "draft"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : item.status === "scheduled"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/30">🎯 {item.targetKeyword}</span>
                  <span className="text-xs text-white/20">·</span>
                  <span className="text-xs text-white/20">{item.wordCount} words</span>
                  <span className="text-xs text-white/20">·</span>
                  <span className="text-xs text-white/20">{item.funnelStage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI SEO Advisor Panel */}
      <div className="bg-gradient-to-br from-seed-500/5 to-blue-500/5 border border-seed-500/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-seed-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-seed-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-seed-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI SEO Advisor</h3>
              <p className="text-xs text-white/30">
                Powered by GPT-4o • Analyzes {gscConnected ? "Search Console + " : ""}
                {pageSpeedResults ? "PageSpeed + " : ""}your business context
              </p>
            </div>
          </div>
          <button
            onClick={() => runAiAnalysis()}
            disabled={aiLoading}
            className="flex items-center gap-2 bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            {aiLoading ? "Analyzing…" : "Run Full Analysis"}
          </button>
        </div>

        {/* Quick question input */}
        <div className="px-6 py-3 border-b border-white/[0.04] flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && aiQuestion.trim()) {
                runAiAnalysis(aiQuestion.trim());
                setAiQuestion("");
              }
            }}
            placeholder="Ask a specific SEO question… (e.g. 'How can I rank for managed IT NJ?')"
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-seed-500/30"
          />
          <button
            onClick={() => {
              if (aiQuestion.trim()) {
                runAiAnalysis(aiQuestion.trim());
                setAiQuestion("");
              }
            }}
            disabled={!aiQuestion.trim() || aiLoading}
            className="bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 px-3 py-2 rounded-lg transition-colors disabled:opacity-30"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Output */}
        <div className="px-6 py-5">
          {aiLoading ? (
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-seed-400" />
              <span>Running SEO analysis — this may take 15–30 seconds…</span>
            </div>
          ) : aiAnalysis ? (
            <div className="prose prose-invert prose-sm max-w-none text-white/60 [&_strong]:text-white/80 [&_h1]:text-white [&_h2]:text-white/90 [&_h3]:text-white/80 [&_h2]:text-base [&_h3]:text-sm [&_ul]:space-y-1 [&_ol]:space-y-1 [&_li]:text-white/50">
              <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, "<br/>") }} />
            </div>
          ) : (
            <div className="space-y-2 text-sm text-white/40">
              <p>Click <strong className="text-white/60">Run Full Analysis</strong> for a comprehensive SEO audit, or ask a specific question above.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "What are my top 3 SEO priorities?",
                  "Which keywords should I target first?",
                  "How can I improve local SEO?",
                  "Content strategy recommendations",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => runAiAnalysis(q)}
                    className="text-xs bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-full px-3 py-1.5 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
