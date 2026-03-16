"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Target, TrendingUp, TrendingDown, CheckCircle2, Circle, Clock,
  ArrowRight, ArrowUpRight, ArrowDownRight, Sparkles, FileText, AlertTriangle,
  Brain, Gauge, RefreshCw, Globe, Loader2, Zap, BarChart3, Send, ShieldAlert,
  Lightbulb, Mail, Eye, X, ExternalLink, Bug, Link2, CalendarClock, Crosshair,
} from "lucide-react";
import { TRACKED_KEYWORDS, SEO_TASKS, CONTENT_CALENDAR } from "@/data/seo-strategy";
import Link from "next/link";
import { BusinessContextModal } from "@/components/admin/BusinessContextModal";

type Tab = "overview" | "keywords" | "audit" | "insights" | "strategy";

interface GSCSummary {
  totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number;
  topKeywords: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
  trackedPositions: Record<string, number>;
}

interface PageSpeedScore {
  url: string; strategy: string; performanceScore: number; accessibilityScore: number;
  bestPracticesScore: number; seoScore: number;
  coreWebVitals: { lcp: number | null; cls: number | null; fcp: number | null; tbt: number | null };
}

interface SnapshotData {
  id: string; date: string; healthScore: number; totalClicks: number;
  totalImpressions: number; avgCtr: number; avgPosition: number;
}

interface CrawlIssue { url: string; checkType: string; severity: string; message: string; details: unknown }

interface InsightItem {
  id: string; type: string; status: string; title: string;
  description: string; actionUrl: string | null; priority: number; createdAt: string;
}

interface DiscoveredKeyword { keyword: string; rationale: string; estimatedVolume: string; difficulty: string }

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

const insightCfg: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  content_freshness: { icon: <CalendarClock className="w-4 h-4" />, color: "text-orange-400", label: "Content Freshness" },
  cannibalization: { icon: <Crosshair className="w-4 h-4" />, color: "text-red-400", label: "Cannibalization" },
  internal_linking: { icon: <Link2 className="w-4 h-4" />, color: "text-blue-400", label: "Internal Linking" },
  keyword_opportunity: { icon: <Target className="w-4 h-4" />, color: "text-seed-400", label: "Keyword Opportunity" },
  general: { icon: <Lightbulb className="w-4 h-4" />, color: "text-yellow-400", label: "General" },
};

function scoreColor(s: number) { return s >= 90 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400"; }
function scoreBg(s: number) { return s >= 90 ? "bg-green-400/10 border-green-400/20" : s >= 50 ? "bg-yellow-400/10 border-yellow-400/20" : "bg-red-400/10 border-red-400/20"; }
function healthColor(s: number) { return s >= 80 ? "#22c55e" : s >= 60 ? "#eab308" : s >= 40 ? "#f97316" : "#ef4444"; }

function Sparkline({ values, color = "#10b981" }: { values: number[]; color?: string }) {
  if (values.length < 2) return <span className="text-white/20 text-xs">{"—"}</span>;
  const mn = Math.min(...values), mx = Math.max(...values), rng = mx - mn || 1;
  return (
    <div className="flex items-end gap-px h-6 w-20">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm min-h-[2px]" style={{ height: `${Math.max(8, ((v - mn) / rng) * 100)}%`, backgroundColor: color, opacity: 0.3 + (i / values.length) * 0.7 }} />
      ))}
    </div>
  );
}

export default function SEODashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [contextOpen, setContextOpen] = useState(false);
  const [gscConnected, setGscConnected] = useState<boolean | null>(null);
  const [gscSummary, setGscSummary] = useState<GSCSummary | null>(null);
  const [gscLoading, setGscLoading] = useState(false);
  const [pageSpeedResults, setPageSpeedResults] = useState<PageSpeedScore[] | null>(null);
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [indexNowLoading, setIndexNowLoading] = useState(false);
  const [indexNowResult, setIndexNowResult] = useState<string | null>(null);
  const [snapshotHistory, setSnapshotHistory] = useState<SnapshotData[]>([]);
  const [takingSnapshot, setTakingSnapshot] = useState(false);
  const [crawlIssues, setCrawlIssues] = useState<CrawlIssue[] | null>(null);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlRunning, setCrawlRunning] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsGenerating, setInsightsGenerating] = useState(false);
  const [discoveredKeywords, setDiscoveredKeywords] = useState<DiscoveredKeyword[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [reportPreviewUrl, setReportPreviewUrl] = useState<string | null>(null);

  const tier1 = TRACKED_KEYWORDS.filter((k) => k.tier === 1);
  const tier2 = TRACKED_KEYWORDS.filter((k) => k.tier === 2);
  const tier3 = TRACKED_KEYWORDS.filter((k) => k.tier === 3);
  const tasksComplete = SEO_TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = SEO_TASKS.filter((t) => t.status === "in-progress").length;
  const tasksTotal = SEO_TASKS.length;

  const fetchGscData = useCallback(async () => {
    setGscLoading(true);
    try { const r = await fetch("/api/admin/seo/search-console?action=summary&days=28"); const d = await r.json(); if (d.summary) setGscSummary(d.summary); } catch {}
    setGscLoading(false);
  }, []);

  const fetchSnapshotHistory = useCallback(async () => {
    try { const r = await fetch("/api/admin/seo/snapshot?action=history&limit=12"); const d = await r.json(); if (d.history) setSnapshotHistory(d.history); } catch {}
  }, []);

  const doTakeSnapshot = useCallback(async () => {
    setTakingSnapshot(true);
    try { await fetch("/api/admin/seo/snapshot", { method: "POST" }); await fetchSnapshotHistory(); } catch {}
    setTakingSnapshot(false);
  }, [fetchSnapshotHistory]);

  const fetchCrawlResults = useCallback(async () => {
    setCrawlLoading(true);
    try { const r = await fetch("/api/admin/seo/crawl"); const d = await r.json(); if (d.results?.issues) setCrawlIssues(d.results.issues); } catch {}
    setCrawlLoading(false);
  }, []);

  const doRunCrawl = useCallback(async () => {
    setCrawlRunning(true);
    try { await fetch("/api/admin/seo/crawl", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); await fetchCrawlResults(); } catch {}
    setCrawlRunning(false);
  }, [fetchCrawlResults]);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try { const r = await fetch("/api/admin/seo/insights"); const d = await r.json(); if (d.insights) setInsights(d.insights); } catch {}
    setInsightsLoading(false);
  }, []);

  const generateInsights = useCallback(async () => {
    setInsightsGenerating(true);
    try { const r = await fetch("/api/admin/seo/insights?action=generate", { method: "POST" }); const d = await r.json(); if (d.insights) setInsights(d.insights); } catch {}
    setInsightsGenerating(false);
  }, []);

  const dismissInsight = useCallback(async (id: string) => {
    try { await fetch("/api/admin/seo/insights?action=dismiss", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setInsights((p) => p.filter((i) => i.id !== id)); } catch {}
  }, []);

  const resolveInsight = useCallback(async (id: string) => {
    try { await fetch("/api/admin/seo/insights?action=resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setInsights((p) => p.filter((i) => i.id !== id)); } catch {}
  }, []);

  const doDiscoverKeywords = useCallback(async () => {
    setDiscoveryLoading(true);
    try { const r = await fetch("/api/admin/seo/keyword-discovery", { method: "POST" }); const d = await r.json(); if (d.keywords) setDiscoveredKeywords(d.keywords); } catch {}
    setDiscoveryLoading(false);
  }, []);

  const runPageSpeedAudit = useCallback(async () => {
    setPageSpeedLoading(true); setPageSpeedResults(null);
    try { const r = await fetch("/api/admin/seo/pagespeed?audit=true&strategy=mobile"); const d = await r.json(); if (d.results) setPageSpeedResults(d.results); } catch {}
    setPageSpeedLoading(false);
  }, []);

  const runAiAnalysis = useCallback(async (question?: string) => {
    setAiLoading(true); setAiAnalysis(null);
    try {
      const r = await fetch("/api/admin/seo/ai-advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question || undefined, includeSearchConsole: gscConnected, includePageSpeed: !!pageSpeedResults, pageSpeedData: pageSpeedResults }) });
      const d = await r.json(); if (d.analysis) setAiAnalysis(d.analysis);
    } catch {}
    setAiLoading(false);
  }, [gscConnected, pageSpeedResults]);

  const pingIndexNow = useCallback(async () => {
    setIndexNowLoading(true); setIndexNowResult(null);
    try {
      const r = await fetch("/api/admin/seo/indexnow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls: ["https://seedtechllc.com", "https://seedtechllc.com/services/managed-it", "https://seedtechllc.com/pricing/it-support", "https://seedtechllc.com/blog"] }) });
      const d = await r.json(); setIndexNowResult(d.success ? "Submitted " + (d.results?.length || 0) + " URLs" : d.error || "Failed");
    } catch { setIndexNowResult("Failed to connect"); }
    setIndexNowLoading(false);
  }, []);

  const sendReport = useCallback(async () => {
    setReportSending(true); setReportResult(null);
    try { const r = await fetch("/api/admin/seo/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); const d = await r.json(); setReportResult(d.success ? "Report sent!" : d.message || "Failed"); } catch { setReportResult("Failed"); }
    setReportSending(false);
  }, []);

  useEffect(() => {
    fetch("/api/admin/seo/search-console?action=test").then((r) => r.json()).then((d) => { setGscConnected(d.connected ?? false); if (d.connected) fetchGscData(); }).catch(() => setGscConnected(false));
    fetchSnapshotHistory(); fetchInsights(); fetchCrawlResults();
  }, [fetchGscData, fetchSnapshotHistory, fetchInsights, fetchCrawlResults]);

  const latestSnapshot = snapshotHistory[snapshotHistory.length - 1];
  const prevSnapshot = snapshotHistory.length > 1 ? snapshotHistory[snapshotHistory.length - 2] : null;
  const healthDelta = latestSnapshot && prevSnapshot ? latestSnapshot.healthScore - prevSnapshot.healthScore : 0;
  const healthScores = snapshotHistory.map((s) => s.healthScore);
  const criticalCount = crawlIssues?.filter((i) => i.severity === "critical").length ?? 0;
  const warningCount = crawlIssues?.filter((i) => i.severity === "warning").length ?? 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <Gauge className="w-4 h-4" /> },
    { id: "keywords", label: "Keywords", icon: <Target className="w-4 h-4" /> },
    { id: "audit", label: "Site Audit", icon: <Bug className="w-4 h-4" />, badge: criticalCount + warningCount },
    { id: "insights", label: "Insights", icon: <Lightbulb className="w-4 h-4" />, badge: insights.length },
    { id: "strategy", label: "Strategy", icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">SEO Autopilot</h1>
          <p className="text-white/40 mt-1">Health monitoring, audits, insights & AI-powered strategy.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setContextOpen(true)} className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors">
            <Brain className="w-4 h-4 text-seed-400" /><span className="hidden sm:inline">AI Context</span>
          </button>
          <button onClick={pingIndexNow} disabled={indexNowLoading} className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {indexNowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-blue-400" />}<span className="hidden sm:inline">IndexNow</span>
          </button>
          <button onClick={() => setReportPreviewUrl("/api/admin/seo/reports?format=html")} className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-purple-400" /><span className="hidden sm:inline">Report</span>
          </button>
          <Link href="/admin/blog/new" className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />AI Blog Writer
          </Link>
        </div>
      </div>

      {indexNowResult && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-sm text-blue-300 flex items-center justify-between">
          <span>{indexNowResult}</span>
          <button onClick={() => setIndexNowResult(null)} className="text-blue-400 text-xs">Dismiss</button>
        </div>
      )}
      {reportResult && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 text-sm text-purple-300 flex items-center justify-between">
          <span>{reportResult}</span>
          <button onClick={() => setReportResult(null)} className="text-purple-400 text-xs">Dismiss</button>
        </div>
      )}

      {reportPreviewUrl && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-8" onClick={() => setReportPreviewUrl(null)}>
          <div className="relative bg-[#111] border border-white/10 rounded-xl overflow-hidden max-w-2xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-sm text-white font-medium">SEO Report Preview</span>
              <div className="flex items-center gap-2">
                <button onClick={sendReport} disabled={reportSending} className="text-xs bg-seed-500 hover:bg-seed-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1">
                  {reportSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}Send Email
                </button>
                <button onClick={() => setReportPreviewUrl(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <iframe src={reportPreviewUrl} className="w-full h-[70vh] bg-white/5" />
          </div>
        </div>
      )}

      <BusinessContextModal open={contextOpen} onClose={() => setContextOpen(false)} />

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${activeTab === tab.id ? "border-seed-500 text-seed-400" : "border-transparent text-white/40 hover:text-white/70"}`}>
            {tab.icon}{tab.label}
            {tab.badge && tab.badge > 0 ? <span className="ml-1 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {/* Health Score Ring */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={healthColor(latestSnapshot?.healthScore ?? 0)} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(latestSnapshot?.healthScore ?? 0) * 2.51} 251`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{latestSnapshot?.healthScore ?? "\u2014"}</span>
                </div>
              </div>
              <p className="text-sm text-white/40 mt-2">Health Score</p>
              {healthDelta !== 0 && <div className={`flex items-center gap-1 text-xs mt-1 ${healthDelta > 0 ? "text-green-400" : "text-red-400"}`}>{healthDelta > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{Math.abs(healthDelta).toFixed(1)} pts</div>}
              <div className="mt-2"><Sparkline values={healthScores} color={healthColor(latestSnapshot?.healthScore ?? 0)} /></div>
              <button onClick={doTakeSnapshot} disabled={takingSnapshot} className="mt-3 text-xs text-white/30 hover:text-white/60 flex items-center gap-1 disabled:opacity-50">
                {takingSnapshot ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}Take Snapshot
              </button>
            </div>
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <Target className="w-5 h-5 text-seed-400 mb-3" />
              <p className="text-2xl font-semibold text-white">{TRACKED_KEYWORDS.length}</p>
              <p className="text-sm text-white/40 mt-1">Tracked Keywords</p>
              <p className="text-xs text-white/20 mt-2">{tier1.length} T1 &middot; {tier2.length} T2 &middot; {tier3.length} T3</p>
            </div>
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <CheckCircle2 className="w-5 h-5 text-seed-400 mb-3" />
              <p className="text-2xl font-semibold text-white">{tasksComplete}/{tasksTotal}</p>
              <p className="text-sm text-white/40 mt-1">SEO Tasks</p>
              <p className="text-xs text-white/20 mt-2">{tasksInProgress} in progress</p>
            </div>
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <TrendingUp className="w-5 h-5 text-yellow-400 mb-3" />
              {gscSummary ? (
                <>
                  <p className="text-2xl font-semibold text-white">{gscSummary.avgPosition.toFixed(1)}</p>
                  <p className="text-sm text-white/40 mt-1">Avg. Position</p>
                  <p className="text-xs text-white/20 mt-2">{gscSummary.totalClicks.toLocaleString()} clicks</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-white">\u2014</p>
                  <p className="text-sm text-white/40 mt-1">Avg. Position</p>
                  <p className="text-xs text-white/20 mt-2">{gscConnected === false ? "Not connected" : "Loading\u2026"}</p>
                </>
              )}
            </div>
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <ShieldAlert className="w-5 h-5 text-red-400 mb-3" />
              <p className="text-2xl font-semibold text-white">{criticalCount + warningCount}</p>
              <p className="text-sm text-white/40 mt-1">Audit Issues</p>
              <p className="text-xs text-white/20 mt-2">
                {criticalCount > 0 && <span className="text-red-400">{criticalCount} critical</span>}
                {criticalCount > 0 && warningCount > 0 && " \u00b7 "}
                {warningCount > 0 && <span className="text-yellow-400">{warningCount} warnings</span>}
                {criticalCount === 0 && warningCount === 0 && "All clear"}
              </p>
            </div>
          </div>

          {gscSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-seed-400" />Top Keywords (28d)</h2>
                  <button onClick={fetchGscData} disabled={gscLoading} className="text-white/30 hover:text-white/60"><RefreshCw className={`w-3.5 h-3.5 ${gscLoading ? "animate-spin" : ""}`} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-2 font-medium">Keyword</th><th className="px-5 py-2 font-medium text-right">Clicks</th><th className="px-5 py-2 font-medium text-right">Impr.</th><th className="px-5 py-2 font-medium text-right">Pos.</th></tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {gscSummary.topKeywords.slice(0, 10).map((kw) => (
                        <tr key={kw.keyword} className="hover:bg-white/[0.02]"><td className="px-5 py-2 text-white/70">{kw.keyword}</td><td className="px-5 py-2 text-right font-mono text-seed-400">{kw.clicks}</td><td className="px-5 py-2 text-right font-mono text-white/40">{kw.impressions.toLocaleString()}</td><td className="px-5 py-2 text-right font-mono text-white/60">{kw.position.toFixed(1)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06]"><h2 className="text-sm font-semibold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" />Top Pages (28d)</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-2 font-medium">Page</th><th className="px-5 py-2 font-medium text-right">Clicks</th><th className="px-5 py-2 font-medium text-right">CTR</th></tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {gscSummary.topPages.slice(0, 8).map((pg) => (
                        <tr key={pg.page} className="hover:bg-white/[0.02]"><td className="px-5 py-2 text-white/50 font-mono text-xs truncate max-w-[250px]">{pg.page.replace(/https?:\/\/[^/]+/, "")}</td><td className="px-5 py-2 text-right font-mono text-seed-400">{pg.clicks}</td><td className="px-5 py-2 text-right font-mono text-white/40">{(pg.ctr * 100).toFixed(1)}%</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AI SEO Advisor */}
          <div className="bg-gradient-to-br from-seed-500/5 to-blue-500/5 border border-seed-500/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-seed-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-seed-500/20 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-seed-400" /></div>
                <div><h3 className="text-sm font-semibold text-white">AI SEO Advisor</h3><p className="text-xs text-white/30">Powered by Claude</p></div>
              </div>
              <button onClick={() => runAiAnalysis()} disabled={aiLoading} className="flex items-center gap-2 bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}{aiLoading ? "Analyzing\u2026" : "Run Full Analysis"}
              </button>
            </div>
            <div className="px-6 py-3 border-b border-white/[0.04] flex gap-2">
              <input type="text" value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && aiQuestion.trim()) { runAiAnalysis(aiQuestion.trim()); setAiQuestion(""); } }} placeholder="Ask a specific SEO question\u2026" className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-seed-500/30" />
              <button onClick={() => { if (aiQuestion.trim()) { runAiAnalysis(aiQuestion.trim()); setAiQuestion(""); } }} disabled={!aiQuestion.trim() || aiLoading} className="bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 px-3 py-2 rounded-lg transition-colors disabled:opacity-30"><ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5">
              {aiLoading ? (
                <div className="flex items-center gap-3 text-white/40 text-sm"><Loader2 className="w-4 h-4 animate-spin text-seed-400" />Running SEO analysis\u2026</div>
              ) : aiAnalysis ? (
                <div className="prose prose-invert prose-sm max-w-none text-white/60 [&_strong]:text-white/80 [&_h2]:text-base [&_h3]:text-sm"><div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, "<br/>") }} /></div>
              ) : (
                <div className="space-y-2 text-sm text-white/40">
                  <p>Click <strong className="text-white/60">Run Full Analysis</strong> for a comprehensive SEO audit, or ask a question.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["What are my top 3 SEO priorities?", "Which keywords should I target first?", "How can I improve local SEO?", "Content strategy recommendations"].map((q) => (
                      <button key={q} onClick={() => runAiAnalysis(q)} className="text-xs bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-full px-3 py-1.5 text-white/40 hover:text-white/60 transition-colors">{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KEYWORDS TAB */}
      {activeTab === "keywords" && (
        <div className="space-y-6">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Search className="w-4 h-4 text-white/40" />Keyword Tracking</h2>
              <div className="flex gap-2">{[1, 2, 3].map((t) => <span key={t} className={`text-xs px-2 py-0.5 rounded-full border ${tierColors[t]}`}>Tier {t}</span>)}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Keyword</th><th className="px-5 py-3 font-medium">Tier</th><th className="px-5 py-3 font-medium">Volume</th><th className="px-5 py-3 font-medium">Intent</th><th className="px-5 py-3 font-medium">Target Page</th><th className="px-5 py-3 font-medium text-right">Position</th><th className="px-5 py-3 font-medium text-right">Trend</th></tr></thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {TRACKED_KEYWORDS.map((kw) => {
                    const livePos = gscSummary?.trackedPositions?.[kw.keyword];
                    const prev = kw.currentPosition ?? null;
                    const delta = livePos && prev ? prev - livePos : null;
                    return (
                      <tr key={kw.keyword} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/80 font-medium">{kw.keyword}</td>
                        <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full border ${tierColors[kw.tier]}`}>T{kw.tier}</span></td>
                        <td className="px-5 py-3 text-white/50 font-mono text-xs">{kw.volume}</td>
                        <td className="px-5 py-3 text-xs text-white/40">{kw.intent}</td>
                        <td className="px-5 py-3 text-white/40 font-mono text-xs">{kw.targetPage}</td>
                        <td className="px-5 py-3 text-right">{livePos ? <span className="text-seed-400 font-mono font-semibold">{livePos.toFixed(1)}</span> : kw.currentPosition ? <span className="text-white/40 font-mono">{kw.currentPosition}</span> : <span className="text-white/20">\u2014</span>}</td>
                        <td className="px-5 py-3 text-right">{delta !== null && Math.abs(delta) >= 0.3 ? <span className={`flex items-center justify-end gap-1 text-xs ${delta > 0 ? "text-green-400" : "text-red-400"}`}>{delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(delta).toFixed(1)}</span> : <span className="text-white/20 text-xs">\u2014</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Keyword Discovery */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" />AI Keyword Discovery</h2>
              <button onClick={doDiscoverKeywords} disabled={discoveryLoading} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 disabled:opacity-50">
                {discoveryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}{discoveryLoading ? "Discovering\u2026" : "Discover Keywords"}
              </button>
            </div>
            {discoveredKeywords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Keyword</th><th className="px-5 py-3 font-medium">Est. Volume</th><th className="px-5 py-3 font-medium">Difficulty</th><th className="px-5 py-3 font-medium">Rationale</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {discoveredKeywords.map((kw) => (
                      <tr key={kw.keyword} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/80 font-medium">{kw.keyword}</td>
                        <td className="px-5 py-3 text-white/50 font-mono text-xs">{kw.estimatedVolume}</td>
                        <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${kw.difficulty === "Low" ? "bg-green-400/10 text-green-400" : kw.difficulty === "Medium" ? "bg-yellow-400/10 text-yellow-400" : "bg-red-400/10 text-red-400"}`}>{kw.difficulty}</span></td>
                        <td className="px-5 py-3 text-white/40 text-xs max-w-[300px]">{kw.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-white/20 text-sm">
                {discoveryLoading ? <div className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />AI is analyzing your keyword landscape\u2026</div> : <>Click <strong className="text-white/40">Discover Keywords</strong> to find new opportunities using AI.</>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUDIT TAB */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-semibold text-white">On-Page SEO Audit</h2><p className="text-white/40 text-sm mt-1">Crawls your site for missing titles, meta descriptions, alt text, thin content, and more.</p></div>
            <button onClick={doRunCrawl} disabled={crawlRunning || crawlLoading} className="flex items-center gap-2 bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50">
              {crawlRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bug className="w-4 h-4" />}{crawlRunning ? "Crawling\u2026" : "Run Site Crawl"}
            </button>
          </div>

          {crawlIssues && (
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-sm text-red-300 font-medium">{criticalCount} Critical</span></div>
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2"><div className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-sm text-yellow-300 font-medium">{warningCount} Warnings</span></div>
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-sm text-blue-300 font-medium">{crawlIssues.filter((i) => i.severity === "info").length} Info</span></div>
            </div>
          )}

          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            {crawlIssues && crawlIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Severity</th><th className="px-5 py-3 font-medium">Page</th><th className="px-5 py-3 font-medium">Issue</th><th className="px-5 py-3 font-medium">Check</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {crawlIssues.map((issue, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${issue.severity === "critical" ? "bg-red-500/10 text-red-400" : issue.severity === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"}`}>{issue.severity === "critical" && <AlertTriangle className="w-3 h-3" />}{issue.severity}</span></td>
                        <td className="px-5 py-3 text-white/50 font-mono text-xs max-w-[200px] truncate">{issue.url}</td>
                        <td className="px-5 py-3 text-white/70 text-xs">{issue.message}</td>
                        <td className="px-5 py-3 text-white/30 text-xs">{issue.checkType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : crawlLoading || crawlRunning ? (
              <div className="px-5 py-10 text-center text-white/40 text-sm flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />{crawlRunning ? "Crawling your site\u2026" : "Loading\u2026"}</div>
            ) : (
              <div className="px-5 py-10 text-center text-white/20 text-sm">No crawl results yet. Click <strong className="text-white/40">Run Site Crawl</strong> to audit all pages.</div>
            )}
          </div>

          {/* PageSpeed */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Gauge className="w-4 h-4 text-yellow-400" />PageSpeed Insights (Mobile)</h2>
              <button onClick={runPageSpeedAudit} disabled={pageSpeedLoading} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 disabled:opacity-50">
                {pageSpeedLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}{pageSpeedLoading ? "Auditing\u2026" : "Run PageSpeed"}
              </button>
            </div>
            {pageSpeedResults ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Page</th><th className="px-5 py-3 font-medium text-center">Perf.</th><th className="px-5 py-3 font-medium text-center">A11y</th><th className="px-5 py-3 font-medium text-center">SEO</th><th className="px-5 py-3 font-medium text-right">LCP</th><th className="px-5 py-3 font-medium text-right">CLS</th><th className="px-5 py-3 font-medium text-right">TBT</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {pageSpeedResults.map((r) => (
                      <tr key={r.url} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/50 font-mono text-xs truncate max-w-[200px]">{new URL(r.url).pathname}</td>
                        <td className="px-5 py-3 text-center"><span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.performanceScore)} ${scoreColor(r.performanceScore)}`}>{r.performanceScore}</span></td>
                        <td className="px-5 py-3 text-center"><span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.accessibilityScore)} ${scoreColor(r.accessibilityScore)}`}>{r.accessibilityScore}</span></td>
                        <td className="px-5 py-3 text-center"><span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(r.seoScore)} ${scoreColor(r.seoScore)}`}>{r.seoScore}</span></td>
                        <td className="px-5 py-3 text-right font-mono text-xs text-white/50">{r.coreWebVitals.lcp ? `${(r.coreWebVitals.lcp / 1000).toFixed(1)}s` : "\u2014"}</td>
                        <td className="px-5 py-3 text-right font-mono text-xs text-white/50">{r.coreWebVitals.cls?.toFixed(3) ?? "\u2014"}</td>
                        <td className="px-5 py-3 text-right font-mono text-xs text-white/50">{r.coreWebVitals.tbt ? `${r.coreWebVitals.tbt}ms` : "\u2014"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-white/20 text-sm">Click <strong className="text-white/40">Run PageSpeed</strong> to analyze Core Web Vitals.</div>
            )}
          </div>
        </div>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-semibold text-white flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" />SEO Insights</h2><p className="text-white/40 text-sm mt-1">Content freshness alerts, cannibalization detection, internal linking suggestions.</p></div>
            <button onClick={generateInsights} disabled={insightsGenerating} className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50">
              {insightsGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}{insightsGenerating ? "Scanning\u2026" : "Scan for Insights"}
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {Object.entries(insightCfg).map(([type, config]) => {
              const count = insights.filter((i) => i.type === type).length;
              if (count === 0) return null;
              return <div key={type} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] ${config.color}`}>{config.icon}{config.label}<span className="ml-1 text-white/30">({count})</span></div>;
            })}
          </div>

          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => {
                const config = insightCfg[insight.type] || insightCfg.general;
                return (
                  <div key={insight.id} className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/[0.03] ${config.color}`}>{config.icon}{config.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${insight.priority >= 60 ? "bg-red-500/10 text-red-400" : insight.priority >= 40 ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}>Priority: {insight.priority}</span>
                        </div>
                        <h3 className="text-sm font-medium text-white/90 mb-1">{insight.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{insight.description}</p>
                        {insight.actionUrl && <Link href={insight.actionUrl} className="inline-flex items-center gap-1 text-xs text-seed-400 hover:text-seed-300 mt-2">Take Action <ExternalLink className="w-3 h-3" /></Link>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => resolveInsight(insight.id)} className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2.5 py-1.5 rounded-lg" title="Resolve"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => dismissInsight(insight.id)} className="text-xs bg-white/[0.03] hover:bg-white/[0.06] text-white/30 px-2.5 py-1.5 rounded-lg" title="Dismiss"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : insightsLoading || insightsGenerating ? (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-10 text-center text-white/40 text-sm flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />{insightsGenerating ? "Analyzing content\u2026" : "Loading\u2026"}</div>
          ) : (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-10 text-center text-sm">
              <Lightbulb className="w-10 h-10 text-yellow-400/20 mx-auto mb-3" />
              <p className="text-white/40">No active insights right now.</p>
              <p className="text-white/20 text-xs mt-1">Click <strong className="text-white/40">Scan for Insights</strong> to analyze your content.</p>
            </div>
          )}
        </div>
      )}

      {/* STRATEGY TAB */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06]"><h2 className="text-sm font-semibold text-white">Implementation Roadmap</h2></div>
              <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
                {SEO_TASKS.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                    {statusIcons[task.status]}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.status === "done" ? "text-white/30 line-through" : "text-white/70"}`}>{task.title}</p>
                      <p className="text-xs text-white/20">Phase {task.phase}</p>
                    </div>
                    {task.priority === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-red-400/60 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" />Content Calendar</h2>
                <Link href="/admin/blog/new" className="text-xs text-seed-400 hover:text-seed-300 flex items-center gap-1">New post <ArrowRight className="w-3 h-3" /></Link>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
                {CONTENT_CALENDAR.map((item) => (
                  <div key={item.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70 font-medium">{item.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "published" ? "bg-seed-500/20 text-seed-400" : item.status === "draft" ? "bg-yellow-500/20 text-yellow-400" : item.status === "scheduled" ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/30"}`}>{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-white/30">{item.targetKeyword}</span>
                      <span className="text-xs text-white/20">{item.wordCount} words</span>
                      <span className="text-xs text-white/20">{item.funnelStage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {snapshotHistory.length > 0 && (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-seed-400" />Health Score History</h2>
                <button onClick={doTakeSnapshot} disabled={takingSnapshot} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 disabled:opacity-50">{takingSnapshot ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}Take Snapshot</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium text-center">Health</th><th className="px-5 py-3 font-medium text-right">Clicks</th><th className="px-5 py-3 font-medium text-right">Impressions</th><th className="px-5 py-3 font-medium text-right">Avg. Pos.</th><th className="px-5 py-3 font-medium text-right">CTR</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {[...snapshotHistory].reverse().map((snap) => (
                      <tr key={snap.id} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white/60 text-xs">{new Date(snap.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td className="px-5 py-3 text-center"><span className={`inline-block w-8 text-center font-mono font-semibold text-xs px-1.5 py-0.5 rounded border ${scoreBg(snap.healthScore)} ${scoreColor(snap.healthScore)}`}>{snap.healthScore}</span></td>
                        <td className="px-5 py-3 text-right font-mono text-seed-400">{snap.totalClicks.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-mono text-white/40">{snap.totalImpressions.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-mono text-white/60">{snap.avgPosition.toFixed(1)}</td>
                        <td className="px-5 py-3 text-right font-mono text-white/40">{(snap.avgCtr * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
