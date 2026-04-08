"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Target, TrendingUp, TrendingDown, CheckCircle2, Circle, Clock,
  ArrowRight, ArrowUpRight, ArrowDownRight, Sparkles, FileText, AlertTriangle,
  Brain, Gauge, RefreshCw, Globe, Loader2, Zap, BarChart3, Send, ShieldAlert,
  Lightbulb, Mail, Eye, X, ExternalLink, Bug, Link2, CalendarClock, Crosshair, SlidersHorizontal,
  Bot, XCircle, Award, Activity, Pencil, Swords, Network, MessageSquareQuote, Tags,
  Rocket, Layers,
  Search, Plus, Upload, Trash2, Check, Download, Copy, Compass, HelpCircle, Info, Minus,
} from "lucide-react";
import Link from "next/link";
import Lottie from "lottie-react";
import progressAnimation from "@/../public/lotties/progress.json";
import { cn } from "@/lib/utils";
import CompetitorsTab from "./competitors-tab";
import TopicClustersTab from "./topic-clusters-tab";
import CitationsTab from "./citations-tab";
import MetadataTab from "./metadata-tab";

type Tab = "overview" | "ai-visibility" | "keywords" | "audit" | "insights" | "clusters" | "citations" | "strategy" | "competitors" | "metadata";

interface AIVisibilityScoreData {
  id: string; pageUrl: string; overallScore: number; grade: string;
  citationReadiness: number; entityAuthority: number; structuredClarity: number;
  conversationalFit: number; multiEngineCoverage: number;
  failedChecks: { check: string; category: string; fix: string }[];
  scoredAt: string;
}

interface AIVisibilitySummary {
  totalPages: number; averageScore: number;
  gradeDistribution: Record<string, number>;
}

interface AICitationStat {
  platform: string; totalChecks: number; brandMentions: number; mentionRate: number;
}

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

interface TrackedKeywordData {
  id: string; keyword: string; tier: string; volume: string; competition: string;
  intent: string; targetPage: string; currentPosition: number | null;
  previousPosition: number | null; bestPosition: number | null;
  clicks28d: number; impressions28d: number; ctr28d: number;
}

interface SeoTaskData {
  id: string; phase: number; title: string; status: string; priority: string;
  sourceType: string | null; sourceUrl: string | null; sourceCheckType: string | null;
  autoResolved: boolean; createdAt: string;
}

interface ContentIdeaData {
  id: string; title: string; targetKeyword: string; wordCount: number;
  funnelStage: string; status: string; slug: string | null;
}

interface SiteInfo { id: string; name: string; domain: string; siteUrl: string }

/* ── Types for Keywords section (migrated from context page) ── */

interface TrackedKeyword {
  id: string;
  keyword: string;
  tier: string;
  volume: string;
  competition: string;
  intent: string;
  targetPage: string;
  currentPosition: number | null;
  previousPosition: number | null;
  clicks28d: number;
  impressions28d: number;
  cluster?: { id: string; name: string } | null;
}

interface KeywordSuggestion {
  keyword: string;
  tier: string;
  intent: string;
  targetPage: string;
  volume: string;
  competition: string;
  rationale: string;
}

type KeywordView = "manage" | "research";
type ResearchMode = "full-audit" | "discover" | "gaps" | "competitors" | "questions";

const RESEARCH_MODES: { key: ResearchMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { key: "full-audit", label: "Full Audit", icon: BarChart3, desc: "Comprehensive keyword strategy review" },
  { key: "discover", label: "Discover", icon: Compass, desc: "Find new keyword opportunities" },
  { key: "gaps", label: "Gap Analysis", icon: Crosshair, desc: "Find what you're missing" },
  { key: "competitors", label: "Competitive Intel", icon: Target, desc: "What competitors target" },
  { key: "questions", label: "Questions", icon: HelpCircle, desc: "What people ask" },
];

const tierMap: Record<string, number> = { tier1: 1, tier2: 2, tier3: 3 };

const _tierColors: Record<number, string> = {
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
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
  const [_discoveredKeywords, setDiscoveredKeywords] = useState<DiscoveredKeyword[]>([]);
  const [_discoveryLoading, setDiscoveryLoading] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [reportPreviewUrl, setReportPreviewUrl] = useState<string | null>(null);
  const [aiVisScores, setAiVisScores] = useState<AIVisibilityScoreData[]>([]);
  const [aiVisSummary, setAiVisSummary] = useState<AIVisibilitySummary | null>(null);
  const [aiVisLoading, setAiVisLoading] = useState(false);
  const [citationStats, setCitationStats] = useState<AICitationStat[]>([]);
  const [citationLoading, setCitationLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pageTrend, setPageTrend] = useState<AIVisibilityScoreData[]>([]);
  // Rewrite flow state
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<{
    rewritten: string; postId: string; postTitle: string;
    oldScore: number; oldGrade: string;
    newScore: { overall: number; grade: string; failedChecks: { check: string; category: string; fix: string }[] };
    fixedCount: number;
  } | null>(null);

  // DB-loaded data (replaces static seo-strategy.ts imports)
  const [trackedKeywords, setTrackedKeywords] = useState<TrackedKeywordData[]>([]);
  const [seoTasks, setSeoTasks] = useState<SeoTaskData[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdeaData[]>([]);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);

  // Content calendar generation
  const [calendarGenerating, setCalendarGenerating] = useState(false);
  const [calendarResult, setCalendarResult] = useState<{ saved: number; skipped: number; total: number } | null>(null);

  // Batch blog writer
  const [batchWriting, setBatchWriting] = useState(false);
  const [batchResult, setBatchResult] = useState<{ written: number; failed: number; total: number; posts: { title: string; slug: string; keyword: string }[] } | null>(null);

  // Setup status checklist
  const [setupSteps, setSetupSteps] = useState<{
    id: string; label: string; description: string;
    complete: boolean; href: string; detail: string | null;
  }[]>([]);
  const [setupStats, setSetupStats] = useState<{
    blogPosts: number; sitePages: number; competitors: number;
    snapshots: number; metadataCoverage: number; keywordCount: number;
    nodeCount: number; pageContextCount: number;
  } | null>(null);
  const [setupCompletedCount, setSetupCompletedCount] = useState(0);
  const [setupTotalCount, setSetupTotalCount] = useState(0);

  const tier1 = trackedKeywords.filter((k) => tierMap[k.tier] === 1);
  const tier2 = trackedKeywords.filter((k) => tierMap[k.tier] === 2);
  const tier3 = trackedKeywords.filter((k) => tierMap[k.tier] === 3);
  const tasksComplete = seoTasks.filter((t) => t.status === "done").length;
  const tasksInProgress = seoTasks.filter((t) => t.status === "in-progress").length;
  const tasksTotal = seoTasks.length;

  const fetchKeywords = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/seo/keywords");
      const d = await r.json();
      if (d.keywords) setTrackedKeywords(d.keywords);
    } catch {}
  }, []);

  const fetchStrategy = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/seo/strategy");
      const d = await r.json();
      if (d.tasks) setSeoTasks(d.tasks);
      if (d.contentIdeas) setContentIdeas(d.contentIdeas);
      if (d.site) setSiteInfo(d.site);
    } catch {}
  }, []);

  const generateCalendar = useCallback(async () => {
    setCalendarGenerating(true);
    setCalendarResult(null);
    try {
      const r = await fetch("/api/admin/seo/content-calendar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaCount: 12 }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setCalendarResult({ saved: d.saved, skipped: d.skipped, total: d.total });
      // Refresh strategy data to show new ideas
      fetchStrategy();
    } catch (err) {
      console.error("Calendar generation failed:", err);
      setCalendarResult({ saved: 0, skipped: 0, total: 0 });
    } finally {
      setCalendarGenerating(false);
    }
  }, [fetchStrategy]);

  const batchWritePosts = useCallback(async () => {
    setBatchWriting(true);
    setBatchResult(null);
    try {
      const r = await fetch("/api/admin/seo/blog-batch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 5, status: "draft" }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setBatchResult({ written: d.written, failed: d.failed, total: d.total, posts: d.posts || [] });
      fetchStrategy();
    } catch (err) {
      console.error("Batch blog write failed:", err);
      setBatchResult({ written: 0, failed: 0, total: 0, posts: [] });
    } finally {
      setBatchWriting(false);
    }
  }, [fetchStrategy]);

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

  const _doDiscoverKeywords = useCallback(async () => {
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
      // Fetch all URLs from sitemap for a full-site ping
      const baseUrl = siteInfo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://seedtechllc.com";
      let urls: string[] = [baseUrl];
      try {
        const sitemapRes = await fetch("/sitemap.xml");
        const sitemapText = await sitemapRes.text();
        const locMatches = sitemapText.match(/<loc>([^<]+)<\/loc>/g);
        if (locMatches && locMatches.length > 0) {
          urls = locMatches.map((m) => m.replace(/<\/?loc>/g, "")).filter(Boolean);
        }
      } catch { /* fallback to just baseUrl */ }

      const r = await fetch("/api/admin/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const d = await r.json();

      if (d.error) {
        setIndexNowResult(d.error);
      } else if (d.results) {
        const succeeded = d.results.filter((r: { success: boolean }) => r.success).length;
        setIndexNowResult(`Submitted ${succeeded}/${d.results.length} URLs`);
      } else if (d.result) {
        setIndexNowResult(d.result.success ? "Submitted 1 URL" : "Failed to submit");
      } else if (d.message) {
        setIndexNowResult(d.message);
      } else {
        setIndexNowResult("Unknown response");
      }
    } catch { setIndexNowResult("Failed to connect"); }
    setIndexNowLoading(false);
  }, [siteInfo]);

  const sendReport = useCallback(async () => {
    setReportSending(true); setReportResult(null);
    try { const r = await fetch("/api/admin/seo/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); const d = await r.json(); setReportResult(d.success ? "Report sent!" : d.message || "Failed"); } catch { setReportResult("Failed"); }
    setReportSending(false);
  }, []);

  const fetchAiVisibility = useCallback(async () => {
    setAiVisLoading(true);
    try {
      const r = await fetch("/api/admin/seo/ai-visibility");
      const d = await r.json();
      if (d.scores) setAiVisScores(d.scores);
      if (d.summary) setAiVisSummary(d.summary);
    } catch {}
    setAiVisLoading(false);
  }, []);

  const fetchCitations = useCallback(async () => {
    setCitationLoading(true);
    try {
      const r = await fetch("/api/admin/seo/ai-citations?days=30");
      const d = await r.json();
      if (d.stats) setCitationStats(d.stats);
    } catch {}
    setCitationLoading(false);
  }, []);

  const fetchPageTrend = useCallback(async (pageUrl: string) => {
    setSelectedPage(pageUrl);
    setRewriteResult(null);
    try {
      const r = await fetch(`/api/admin/seo/ai-visibility?pageUrl=${encodeURIComponent(pageUrl)}&days=90`);
      const d = await r.json();
      if (d.scores) setPageTrend(d.scores);
    } catch {}
  }, []);

  const requestRewrite = useCallback(async (pageUrl: string) => {
    setRewriteLoading(true);
    setRewriteResult(null);
    try {
      const r = await fetch("/api/admin/seo/ai-visibility/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageUrl }),
      });
      const d = await r.json();
      if (r.ok && d.rewritten) {
        setRewriteResult(d);
      } else if (d.message) {
        setRewriteResult(null);
      } else {
        console.error("Rewrite error:", d.error);
      }
    } catch (e) {
      console.error("Rewrite request failed:", e);
    }
    setRewriteLoading(false);
  }, []);

  /** Store rewritten content in sessionStorage and open blog editor */
  const openEditorWithRewrite = useCallback(() => {
    if (!rewriteResult) return;
    sessionStorage.setItem("ai-rewrite", JSON.stringify({
      postId: rewriteResult.postId,
      content: rewriteResult.rewritten,
      oldScore: rewriteResult.oldScore,
      oldGrade: rewriteResult.oldGrade,
      newScore: rewriteResult.newScore.overall,
      newGrade: rewriteResult.newScore.grade,
      fixedCount: rewriteResult.fixedCount,
    }));
    setSelectedPage(null);
    setPageTrend([]);
    setRewriteResult(null);
    router.push(`/admin/blog/${rewriteResult.postId}`);
  }, [rewriteResult, router]);

  const fetchSetupStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/seo/setup-status");
      const d = await r.json();
      if (d.steps) setSetupSteps(d.steps);
      if (d.stats) setSetupStats(d.stats);
      setSetupCompletedCount(d.completedCount ?? 0);
      setSetupTotalCount(d.totalCount ?? 0);
    } catch {}
  }, []);

  // ── Task status toggle ──
  const [taskUpdating, setTaskUpdating] = useState<string | null>(null);
  const cycleTaskStatus = useCallback(async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "not-started" ? "in-progress" : currentStatus === "in-progress" ? "done" : "not-started";
    setTaskUpdating(taskId);
    try {
      const r = await fetch("/api/admin/seo/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-task", id: taskId, status: nextStatus }),
      });
      if (r.ok) {
        setSeoTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: nextStatus } : t));
      }
    } catch {} finally { setTaskUpdating(null); }
  }, []);

  // ── Fix link builder: maps sourceCheckType → metadata tab with pre-selected page ──
  const METADATA_CHECK_TYPES = new Set([
    "missing-title", "missing-meta-description", "missing-h1", "missing-og-tags",
    "missing-canonical", "short-title", "long-title", "short-meta-description",
    "long-meta-description", "duplicate-title", "duplicate-meta-description",
    "no-structured-data", "invalid-json-ld", "noindex-detected",
  ]);
  const getTaskFixAction = useCallback((task: SeoTaskData): { label: string; action: () => void } | null => {
    if (!task.sourceCheckType || !task.sourceUrl) return null;
    if (METADATA_CHECK_TYPES.has(task.sourceCheckType)) {
      const path = (() => { try { return new URL(task.sourceUrl).pathname || "/"; } catch { return "/"; } })();
      return { label: "Edit Metadata", action: () => { setActiveTab("metadata"); setTimeout(() => { window.dispatchEvent(new CustomEvent("open-metadata-editor", { detail: { path } })); }, 100); } };
    }
    if (task.sourceCheckType === "thin-content" || task.sourceCheckType === "few-internal-links") {
      return { label: "Edit Content", action: () => router.push("/admin/seo/context?section=pages") };
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    fetch("/api/admin/seo/search-console?action=test").then((r) => r.json()).then((d) => { setGscConnected(d.connected ?? false); if (d.connected) fetchGscData(); }).catch(() => setGscConnected(false));
    fetchSnapshotHistory(); fetchInsights(); fetchCrawlResults(); fetchAiVisibility(); fetchCitations();
    fetchKeywords(); fetchStrategy(); fetchSetupStatus();

    // Auto-trigger GSC sync if data is stale (>6 hours)
    fetch("/api/admin/seo/gsc-sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ force: false }) })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "completed") {
          // Re-fetch keyword data since sync updated TrackedKeyword records
          fetchKeywords();
        }
      })
      .catch(() => { /* silent — non-blocking background sync */ });
  }, [fetchGscData, fetchSnapshotHistory, fetchInsights, fetchCrawlResults, fetchAiVisibility, fetchCitations, fetchKeywords, fetchStrategy, fetchSetupStatus]);

  const latestSnapshot = snapshotHistory[snapshotHistory.length - 1];
  const prevSnapshot = snapshotHistory.length > 1 ? snapshotHistory[snapshotHistory.length - 2] : null;
  const healthDelta = latestSnapshot && prevSnapshot ? latestSnapshot.healthScore - prevSnapshot.healthScore : 0;
  const healthScores = snapshotHistory.map((s) => s.healthScore);
  const criticalCount = crawlIssues?.filter((i) => i.severity === "critical").length ?? 0;
  const warningCount = crawlIssues?.filter((i) => i.severity === "warning").length ?? 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <Gauge className="w-4 h-4" /> },
    { id: "ai-visibility", label: "AI Visibility", icon: <Bot className="w-4 h-4" /> },
    { id: "keywords", label: "Keywords", icon: <Target className="w-4 h-4" /> },
    { id: "audit", label: "Site Audit", icon: <Bug className="w-4 h-4" />, badge: criticalCount + warningCount },
    { id: "insights", label: "Insights", icon: <Lightbulb className="w-4 h-4" />, badge: insights.length },
    { id: "clusters", label: "Topic Clusters", icon: <Network className="w-4 h-4" /> },
    { id: "citations", label: "Citations", icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: "competitors", label: "Competitors", icon: <Swords className="w-4 h-4" /> },
    { id: "strategy", label: "Strategy", icon: <Brain className="w-4 h-4" /> },
    { id: "metadata", label: "Metadata", icon: <Tags className="w-4 h-4" /> },
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
          <Link href="/admin/seo/settings" className="flex items-center gap-2 bg-dark-elevated hover:bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-sm font-medium px-3 py-2.5 rounded-lg transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-seed-400" /><span className="hidden sm:inline">Settings</span>
          </Link>
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
              <p className="text-2xl font-semibold text-white">{trackedKeywords.length}</p>
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

          {/* ── Setup Checklist + Quick Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Card 1: Production Checklist (Vercel-style) */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-white">Production Checklist</h3>
                  <span className="text-xs bg-white/[0.06] text-white/50 px-2 py-0.5 rounded-full font-medium">{setupCompletedCount}/{setupTotalCount}</span>
                </div>
                <Link href="/admin/seo/context" className="text-white/30 hover:text-white/60 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {setupSteps.map((step) => (
                  <Link
                    key={step.id}
                    href={step.href}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors group ${step.complete ? "hover:bg-white/[0.02]" : "hover:bg-seed-500/[0.04]"}`}
                  >
                    {step.complete ? (
                      <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-white/20 group-hover:text-white/40 shrink-0" />
                    )}
                    <span className={`text-sm flex-1 ${step.complete ? "text-white/40 line-through decoration-white/10" : "text-white/70 group-hover:text-white"}`}>
                      {step.label}
                    </span>
                    {step.complete && step.detail && (
                      <span className="text-xs text-white/20">{step.detail}</span>
                    )}
                    {!step.complete && (
                      <ArrowRight className="w-3.5 h-3.5 text-white/0 group-hover:text-seed-400 transition-colors" />
                    )}
                  </Link>
                ))}
              </div>
              {setupTotalCount > 0 && (
                <div className="px-5 py-3 border-t border-white/[0.04]">
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-seed-500 rounded-full transition-all duration-500"
                      style={{ width: `${(setupCompletedCount / setupTotalCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Content Coverage */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />Content Coverage
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Metadata Coverage", value: `${setupStats?.metadataCoverage ?? 0}%`, sub: "pages with AI titles", color: (setupStats?.metadataCoverage ?? 0) >= 80 ? "text-green-400" : (setupStats?.metadataCoverage ?? 0) >= 40 ? "text-yellow-400" : "text-white/30" },
                  { label: "Page Contexts", value: `${setupStats?.pageContextCount ?? 0}`, sub: "pages described", color: (setupStats?.pageContextCount ?? 0) >= 10 ? "text-green-400" : (setupStats?.pageContextCount ?? 0) >= 1 ? "text-yellow-400" : "text-white/30" },
                  { label: "Context Nodes", value: `${setupStats?.nodeCount ?? 0}`, sub: "service nodes", color: (setupStats?.nodeCount ?? 0) >= 3 ? "text-green-400" : (setupStats?.nodeCount ?? 0) >= 1 ? "text-yellow-400" : "text-white/30" },
                  { label: "Blog Posts", value: `${setupStats?.blogPosts ?? 0}`, sub: "published", color: (setupStats?.blogPosts ?? 0) >= 5 ? "text-green-400" : (setupStats?.blogPosts ?? 0) >= 1 ? "text-yellow-400" : "text-white/30" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">{row.label}</p>
                      <p className="text-xs text-white/25 mt-0.5">{row.sub}</p>
                    </div>
                    <p className={`text-lg font-semibold tabular-nums ${row.color}`}>{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Quick Actions */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-400" />Quick Actions
                </h3>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { label: "Generate All Metadata", description: "AI titles & descriptions for every page", icon: <Sparkles className="w-4 h-4" />, href: "/admin/seo?tab=metadata", color: "text-seed-400" },
                  { label: "Run Site Crawl", description: "25+ on-page SEO checks", icon: <Bug className="w-4 h-4" />, href: "/admin/seo?tab=audit", color: "text-orange-400" },
                  { label: "AI SEO Analysis", description: "Full strategy analysis by Claude", icon: <Brain className="w-4 h-4" />, href: "#ai-advisor", color: "text-blue-400", onClick: () => runAiAnalysis() },
                  { label: "Research Keywords", description: "Discover new keyword opportunities", icon: <Target className="w-4 h-4" />, href: "/admin/seo/context", color: "text-yellow-400" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    onClick={action.onClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className={`${action.color} shrink-0`}>{action.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors">{action.label}</p>
                      <p className="text-xs text-white/25 truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
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

      {/* AI VISIBILITY TAB */}
      {activeTab === "ai-visibility" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-seed-400" />AI Visibility Engine
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Your primary metric — how well your content gets cited by AI systems (Google AIO, ChatGPT, Perplexity, Gemini).
              </p>
            </div>
            <button onClick={fetchAiVisibility} disabled={aiVisLoading} className="flex items-center gap-2 bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50">
              {aiVisLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {aiVisLoading ? "Loading…" : "Refresh Scores"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Average Score Ring */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={aiVisSummary && aiVisSummary.averageScore >= 65 ? "#22c55e" : aiVisSummary && aiVisSummary.averageScore >= 50 ? "#eab308" : aiVisSummary && aiVisSummary.averageScore >= 35 ? "#f97316" : "#ef4444"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(aiVisSummary?.averageScore ?? 0) * 2.51} 251`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white">{aiVisSummary?.averageScore ?? "—"}</span>
                </div>
              </div>
              <p className="text-sm text-white/40 mt-2">Avg. AI Visibility</p>
              <p className="text-xs text-white/20 mt-1">{aiVisSummary?.totalPages ?? 0} pages scored</p>
            </div>

            {/* Grade Distribution */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <Award className="w-5 h-5 text-seed-400 mb-3" />
              <p className="text-sm font-medium text-white/60 mb-3">Grade Distribution</p>
              {aiVisSummary ? (
                <div className="space-y-2">
                  {(["A", "B", "C", "D", "F"] as const).map((grade) => {
                    const count = aiVisSummary.gradeDistribution[grade] || 0;
                    const total = aiVisSummary.totalPages || 1;
                    const pct = Math.round((count / total) * 100);
                    const gradeColors: Record<string, string> = { A: "bg-green-400", B: "bg-blue-400", C: "bg-yellow-400", D: "bg-orange-400", F: "bg-red-400" };
                    return (
                      <div key={grade} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/50 w-3">{grade}</span>
                        <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${gradeColors[grade]}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-mono text-white/30 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-white/20">No scores yet</p>
              )}
            </div>

            {/* Citation Tracker */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <Activity className="w-5 h-5 text-purple-400 mb-3" />
              <p className="text-sm font-medium text-white/60 mb-3">Citation Tracking (30d)</p>
              {citationStats.length > 0 ? (
                <div className="space-y-2">
                  {citationStats.map((stat) => (
                    <div key={stat.platform} className="flex items-center justify-between">
                      <span className="text-xs text-white/50 capitalize">{stat.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-semibold ${stat.mentionRate >= 50 ? "text-green-400" : stat.mentionRate >= 25 ? "text-yellow-400" : "text-red-400"}`}>
                          {stat.mentionRate}%
                        </span>
                        <span className="text-xs text-white/20">{stat.brandMentions}/{stat.totalChecks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : citationLoading ? (
                <div className="flex items-center gap-2 text-xs text-white/30"><Loader2 className="w-3 h-3 animate-spin" />Loading…</div>
              ) : (
                <p className="text-xs text-white/20">No citations tracked yet. Use the API or cron to start monitoring.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <Zap className="w-5 h-5 text-yellow-400 mb-3" />
              <p className="text-sm font-medium text-white/60 mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Link href="/admin/blog/new" className="flex items-center gap-2 text-xs bg-seed-500/10 hover:bg-seed-500/20 border border-seed-500/20 text-seed-400 px-3 py-2 rounded-lg transition-colors w-full">
                  <Sparkles className="w-3.5 h-3.5" />Write AI-Optimized Content
                </Link>
                <button onClick={() => { setActiveTab("overview"); setTimeout(() => runAiAnalysis(), 100); }} className="flex items-center gap-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 px-3 py-2 rounded-lg transition-colors w-full text-left">
                  <Brain className="w-3.5 h-3.5" />Run AI SEO Advisor
                </button>
                <button onClick={() => { fetchAiVisibility(); fetchCitations(); }} className="flex items-center gap-2 text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 px-3 py-2 rounded-lg transition-colors w-full text-left">
                  <RefreshCw className="w-3.5 h-3.5" />Refresh All Data
                </button>
              </div>
            </div>
          </div>

          {/* Per-Page Scores Table */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-seed-400" />Page Scores
              </h3>
              <span className="text-xs text-white/20">{aiVisScores.length} pages</span>
            </div>
            {aiVisScores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]">
                      <th className="px-5 py-3 font-medium">Page</th>
                      <th className="px-5 py-3 font-medium text-center">Grade</th>
                      <th className="px-5 py-3 font-medium text-center">Score</th>
                      <th className="px-5 py-3 font-medium text-center">Citation</th>
                      <th className="px-5 py-3 font-medium text-center">Entity</th>
                      <th className="px-5 py-3 font-medium text-center">Structure</th>
                      <th className="px-5 py-3 font-medium text-center">Conversational</th>
                      <th className="px-5 py-3 font-medium text-center">Multi-Engine</th>
                      <th className="px-5 py-3 font-medium text-center">Issues</th>
                      <th className="px-5 py-3 font-medium text-right">Scored</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {aiVisScores.map((score) => {
                      const gradeColors: Record<string, string> = {
                        A: "bg-green-500/20 text-green-400 border-green-500/30",
                        B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                        D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                        F: "bg-red-500/20 text-red-400 border-red-500/30",
                      };
                      const subScore = (val: number) => (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${val >= 70 ? "bg-green-400" : val >= 45 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${val}%` }} />
                          </div>
                          <span className="text-xs font-mono text-white/40">{val}</span>
                        </div>
                      );
                      return (
                        <tr key={score.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => fetchPageTrend(score.pageUrl)}>
                          <td className="px-5 py-3 text-white/50 font-mono text-xs truncate max-w-[220px]" title={score.pageUrl}>
                            {score.pageUrl.replace(/https?:\/\/[^/]+/, "")}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${gradeColors[score.grade] || gradeColors.F}`}>{score.grade}</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={`font-mono font-semibold text-sm ${score.overallScore >= 65 ? "text-green-400" : score.overallScore >= 50 ? "text-yellow-400" : score.overallScore >= 35 ? "text-orange-400" : "text-red-400"}`}>{score.overallScore}</span>
                          </td>
                          <td className="px-5 py-3">{subScore(score.citationReadiness)}</td>
                          <td className="px-5 py-3">{subScore(score.entityAuthority)}</td>
                          <td className="px-5 py-3">{subScore(score.structuredClarity)}</td>
                          <td className="px-5 py-3">{subScore(score.conversationalFit)}</td>
                          <td className="px-5 py-3">{subScore(score.multiEngineCoverage)}</td>
                          <td className="px-5 py-3 text-center">
                            {(score.failedChecks as { check: string; category: string; fix: string }[]).length > 0 ? (
                              <span className="text-xs text-red-400 font-mono">{(score.failedChecks as { check: string; category: string; fix: string }[]).length}</span>
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                            )}
                          </td>
                          <td className="px-5 py-3 text-right text-xs text-white/30">
                            {new Date(score.scoredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : aiVisLoading ? (
              <div className="px-5 py-10 text-center text-white/40 text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />Loading AI Visibility scores…
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm">
                <Bot className="w-10 h-10 text-seed-400/20 mx-auto mb-3" />
                <p className="text-white/40">No AI Visibility scores yet.</p>
                <p className="text-white/20 text-xs mt-1">Scores are generated when you publish blog posts via the AI Blog Writer, or when the SEO cron runs.</p>
                <Link href="/admin/blog/new" className="inline-flex items-center gap-2 mt-4 text-xs bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 px-4 py-2 rounded-lg transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />Write Your First AI-Optimized Post
                </Link>
              </div>
            )}
          </div>

          {/* Page Drill-Down — Right-aligned slide-over modal */}
          {selectedPage && (
            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => { setSelectedPage(null); setPageTrend([]); setRewriteResult(null); }}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div
                className="relative w-full max-w-lg h-full bg-dark-base border-l border-white/[0.08] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-dark-base/95 backdrop-blur-sm px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-seed-400 shrink-0" />Score Trend
                    </h3>
                    <p className="text-xs text-white/40 font-mono truncate mt-0.5">{selectedPage.replace(/https?:\/\/[^/]+/, "")}</p>
                  </div>
                  <button onClick={() => { setSelectedPage(null); setPageTrend([]); setRewriteResult(null); }} className="text-white/30 hover:text-white/60 ml-3 shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {pageTrend.length > 0 ? (
                  <div className="p-5 space-y-5">
                    {/* Latest Score Summary */}
                    {(() => {
                      const latest = pageTrend[pageTrend.length - 1];
                      const gradeColors: Record<string, string> = {
                        A: "bg-green-500/20 text-green-400 border-green-500/30",
                        B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                        D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                        F: "bg-red-500/20 text-red-400 border-red-500/30",
                      };
                      return (
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke={latest.overallScore >= 65 ? "#22c55e" : latest.overallScore >= 50 ? "#eab308" : latest.overallScore >= 35 ? "#f97316" : "#ef4444"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${latest.overallScore * 2.51} 251`} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">{latest.overallScore}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${gradeColors[(latest as { grade?: string }).grade || "F"] || gradeColors.F}`}>
                              Grade {(latest as { grade?: string }).grade || "—"}
                            </span>
                            <p className="text-xs text-white/30 mt-1">
                              Scored {new Date(latest.scoredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Sub-scores */}
                    {(() => {
                      const latest = pageTrend[pageTrend.length - 1];
                      const subs = [
                        { label: "Citation Readiness", value: latest.citationReadiness, color: "bg-green-400" },
                        { label: "Entity Authority", value: latest.entityAuthority, color: "bg-blue-400" },
                        { label: "Structured Clarity", value: latest.structuredClarity, color: "bg-purple-400" },
                        { label: "Conversational Fit", value: latest.conversationalFit, color: "bg-yellow-400" },
                        { label: "Multi-Engine", value: latest.multiEngineCoverage, color: "bg-orange-400" },
                      ];
                      return (
                        <div className="space-y-2">
                          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Sub-Scores</p>
                          {subs.map((s) => (
                            <div key={s.label} className="flex items-center gap-3">
                              <span className="text-xs text-white/50 w-32 shrink-0">{s.label}</span>
                              <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                              </div>
                              <span className="text-xs font-mono text-white/40 w-7 text-right">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Trend Chart */}
                    {pageTrend.length > 1 && (
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Score History</p>
                        <div className="flex items-end gap-1 h-20">
                          {pageTrend.map((s, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${s.overallScore} — ${new Date(s.scoredAt).toLocaleDateString()}`}>
                              <div className="w-full rounded-t" style={{ height: `${Math.max(4, s.overallScore)}%`, backgroundColor: s.overallScore >= 65 ? "#22c55e" : s.overallScore >= 50 ? "#eab308" : s.overallScore >= 35 ? "#f97316" : "#ef4444", opacity: 0.3 + (i / pageTrend.length) * 0.7 }} />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/20 mt-1">
                          <span>{new Date(pageTrend[0].scoredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          <span>{new Date(pageTrend[pageTrend.length - 1].scoredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    )}

                    {/* Failed Checks */}
                    {(() => {
                      const latest = pageTrend[pageTrend.length - 1];
                      const checks = latest.failedChecks as { check: string; category: string; fix: string }[];
                      if (checks.length === 0) return (
                        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/5 border border-green-500/10 rounded-lg px-4 py-3">
                          <CheckCircle2 className="w-4 h-4" />All checks passing!
                        </div>
                      );
                      return (
                        <div>
                          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />{checks.length} Failed Checks
                          </p>
                          <div className="space-y-1.5">
                            {checks.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-white/60">{c.check}</p>
                                  <p className="text-xs text-white/30 mt-0.5">{c.fix}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* ── Rewrite for AI Visibility ── */}
                    {(() => {
                      const latest = pageTrend[pageTrend.length - 1];
                      const checks = latest.failedChecks as { check: string; category: string; fix: string }[];
                      if (checks.length === 0 && !rewriteResult) return null;

                      // Rewrite ready — show score comparison + Edit Post
                      if (rewriteResult) {
                        const delta = rewriteResult.newScore.overall - rewriteResult.oldScore;
                        return (
                          <div className="bg-seed-500/5 border border-seed-500/15 rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-seed-400" />
                                <span className="text-sm font-semibold text-white">Rewrite Ready</span>
                              </div>
                              <span className={`text-xs font-mono ${delta > 0 ? "text-green-400" : "text-yellow-400"}`}>
                                {delta > 0 ? "+" : ""}{delta} pts
                              </span>
                            </div>

                            {/* Score comparison */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-center">
                                <p className="text-xs text-white/30 mb-1">Current</p>
                                <p className="text-2xl font-bold text-white/40">{rewriteResult.oldScore}</p>
                                <p className="text-xs text-white/20">Grade {rewriteResult.oldGrade}</p>
                              </div>
                              <div className="bg-white/[0.02] border border-seed-500/20 rounded-lg p-3 text-center">
                                <p className="text-xs text-seed-400 mb-1">Rewritten</p>
                                <p className="text-2xl font-bold text-white">{rewriteResult.newScore.overall}</p>
                                <p className="text-xs text-seed-400/70">Grade {rewriteResult.newScore.grade}</p>
                              </div>
                            </div>

                            {/* Fixed checks summary */}
                            {rewriteResult.fixedCount > 0 && (
                              <div className="flex items-center gap-2 text-xs text-green-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Fixed {rewriteResult.fixedCount} of {rewriteResult.fixedCount + rewriteResult.newScore.failedChecks.length} failed checks
                              </div>
                            )}
                            {rewriteResult.newScore.failedChecks.length > 0 && (
                              <p className="text-xs text-white/30">
                                {rewriteResult.newScore.failedChecks.length} check{rewriteResult.newScore.failedChecks.length !== 1 ? "s" : ""} still failing — you can tweak further in the editor.
                              </p>
                            )}

                            {/* Edit Post + Discard */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={openEditorWithRewrite}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-600 text-white text-sm font-semibold transition-colors"
                              >
                                <Pencil className="w-4 h-4" />Edit Post
                              </button>
                              <button
                                onClick={() => setRewriteResult(null)}
                                className="px-4 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 text-sm transition-colors"
                              >
                                Discard
                              </button>
                            </div>
                            <p className="text-xs text-white/20 text-center">Opens the blog editor with rewritten content pre-loaded for review.</p>
                          </div>
                        );
                      }

                      // Rewrite button (initial state)
                      return (
                        <button
                          onClick={() => requestRewrite(selectedPage!)}
                          disabled={rewriteLoading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-seed-500/10 to-purple-500/10 border border-seed-500/20 hover:border-seed-500/40 text-sm font-semibold text-seed-400 transition-all disabled:opacity-50"
                        >
                          {rewriteLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" />Rewriting with AI…</>
                          ) : (
                            <><Sparkles className="w-4 h-4" />Rewrite for AI Visibility</>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="px-5 py-16 text-center text-white/30 text-sm flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />Loading trend…
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What is AI Visibility? Explainer */}
          <div className="bg-gradient-to-br from-seed-500/5 to-purple-500/5 border border-seed-500/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-400" />How AI Visibility Scoring Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
              {[
                { label: "Citation Readiness", weight: "30%", desc: "Does your content have the factual density and structure AI systems need to cite it?", color: "text-green-400" },
                { label: "Entity Authority", weight: "20%", desc: "Are you establishing clear expertise signals with named entities and credentials?", color: "text-blue-400" },
                { label: "Structured Clarity", weight: "20%", desc: "Do you have comparison tables, definition lists, and clear data AI can extract?", color: "text-purple-400" },
                { label: "Conversational Fit", weight: "15%", desc: "Does your content answer questions in the way people ask AI assistants?", color: "text-yellow-400" },
                { label: "Multi-Engine", weight: "15%", desc: "Is your content optimized for Google AIO, ChatGPT, Perplexity, and Gemini?", color: "text-orange-400" },
              ].map((cat) => (
                <div key={cat.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${cat.color}`}>{cat.label}</span>
                    <span className="text-white/20">{cat.weight}</span>
                  </div>
                  <p className="text-white/30 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KEYWORDS TAB */}
      {activeTab === "keywords" && (
        <KeywordsSection />
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
                  <thead><tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/[0.04]"><th className="px-5 py-3 font-medium">Severity</th><th className="px-5 py-3 font-medium">Page</th><th className="px-5 py-3 font-medium">Issue</th><th className="px-5 py-3 font-medium">Check</th><th className="px-5 py-3 font-medium text-right">Action</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {crawlIssues.map((issue, idx) => {
                      const issuePath = (() => { try { return new URL(issue.url).pathname || "/"; } catch { return "/"; } })();
                      const isMetaFix = METADATA_CHECK_TYPES.has(issue.checkType);
                      const matchingTask = seoTasks.find((t) => t.sourceUrl === issue.url && t.sourceCheckType === issue.checkType);
                      return (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-3"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${issue.severity === "critical" ? "bg-red-500/10 text-red-400" : issue.severity === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"}`}>{issue.severity === "critical" && <AlertTriangle className="w-3 h-3" />}{issue.severity}</span></td>
                          <td className="px-5 py-3 text-white/50 font-mono text-xs max-w-[200px] truncate">{issuePath}</td>
                          <td className="px-5 py-3 text-white/70 text-xs">{issue.message}</td>
                          <td className="px-5 py-3 text-white/30 text-xs">{issue.checkType}</td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isMetaFix && (
                                <button
                                  onClick={() => {
                                    setActiveTab("metadata");
                                    setTimeout(() => { window.dispatchEvent(new CustomEvent("open-metadata-editor", { detail: { path: issuePath } })); }, 100);
                                  }}
                                  className="text-[11px] bg-seed-500/10 hover:bg-seed-500/20 text-seed-400 px-2 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <Pencil className="w-3 h-3" />Fix
                                </button>
                              )}
                              {matchingTask && (
                                <button
                                  onClick={() => setActiveTab("strategy")}
                                  className="text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />{matchingTask.status === "done" ? "Done" : "Task"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

      {/* COMPETITORS TAB */}
      {activeTab === "competitors" && (
        <CompetitorsTab />
      )}

      {/* CITATIONS TAB */}
      {activeTab === "citations" && (
        <CitationsTab />
      )}

      {/* TOPIC CLUSTERS TAB */}
      {activeTab === "clusters" && (
        <TopicClustersTab />
      )}

      {/* STRATEGY TAB */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2">
              <Circle className="w-3 h-3 text-white/20" /><span className="text-sm text-white/50">{seoTasks.filter((t) => t.status === "not-started").length} Not Started</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
              <Clock className="w-3 h-3 text-yellow-400" /><span className="text-sm text-yellow-300">{tasksInProgress} In Progress</span>
            </div>
            <div className="flex items-center gap-2 bg-seed-500/10 border border-seed-500/20 rounded-lg px-4 py-2">
              <CheckCircle2 className="w-3 h-3 text-seed-400" /><span className="text-sm text-seed-300">{tasksComplete} Done</span>
            </div>
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              <AlertTriangle className="w-3 h-3 text-red-400" /><span className="text-sm text-red-300">{seoTasks.filter((t) => (t.priority === "critical" || t.priority === "high") && t.status !== "done").length} High Priority</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Implementation Roadmap — NOW ACTIONABLE */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Implementation Roadmap</h2>
                <span className="text-xs text-white/30">{tasksComplete}/{tasksTotal} complete</span>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-[32rem] overflow-y-auto">
                {seoTasks.map((task) => {
                  const fixAction = getTaskFixAction(task);
                  const priorityBadge = task.priority === "critical"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : task.priority === "high"
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : task.priority === "medium"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : "bg-white/[0.03] text-white/30 border-white/[0.06]";
                  return (
                    <div key={task.id} className={`px-5 py-3 hover:bg-white/[0.02] transition-colors ${task.status === "done" ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-3">
                        {/* Clickable status toggle */}
                        <button
                          onClick={() => cycleTaskStatus(task.id, task.status)}
                          disabled={taskUpdating === task.id}
                          className="shrink-0 hover:scale-110 transition-transform disabled:opacity-50"
                          title={`Status: ${task.status} — Click to change`}
                        >
                          {taskUpdating === task.id
                            ? <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                            : statusIcons[task.status]}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${task.status === "done" ? "text-white/30 line-through" : "text-white/70"}`}>{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-white/20">Phase {task.phase}</span>
                            <span className={`text-[10px] px-1.5 py-0 rounded-full border ${priorityBadge}`}>{task.priority}</span>
                            {task.sourceType === "crawl" && <span className="text-[10px] text-blue-400/50 bg-blue-500/10 px-1.5 rounded-full">crawl</span>}
                            {task.autoResolved && <span className="text-[10px] text-seed-400/50 bg-seed-500/10 px-1.5 rounded-full">auto-resolved</span>}
                          </div>
                        </div>
                        {/* Fix action button */}
                        {fixAction && task.status !== "done" && (
                          <button
                            onClick={fixAction.action}
                            className="shrink-0 flex items-center gap-1 text-[11px] bg-seed-500/10 hover:bg-seed-500/20 text-seed-400 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3 h-3" />{fixAction.label}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {seoTasks.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <Rocket className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">No tasks yet.</p>
                    <p className="text-white/20 text-xs mt-1">Run a <button onClick={() => setActiveTab("audit")} className="text-seed-400 hover:underline">Site Audit</button> to auto-generate tasks.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Calendar */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" />Content Calendar</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={generateCalendar}
                    disabled={calendarGenerating || batchWriting}
                    className="flex items-center gap-1.5 text-xs bg-seed-500/10 hover:bg-seed-500/20 text-seed-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {calendarGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {calendarGenerating ? "Generating…" : "Generate 90-Day Plan"}
                  </button>
                  <button
                    onClick={batchWritePosts}
                    disabled={batchWriting || calendarGenerating || contentIdeas.filter(i => i.status === "idea").length === 0}
                    className="flex items-center gap-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    title={contentIdeas.filter(i => i.status === "idea").length === 0 ? "No unpublished ideas to write" : `Write ${Math.min(5, contentIdeas.filter(i => i.status === "idea").length)} blog posts from ideas`}
                  >
                    {batchWriting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />}
                    {batchWriting ? "Writing…" : "Write 5 Posts"}
                  </button>
                  <Link href="/admin/blog/new" className="text-xs text-seed-400 hover:text-seed-300 flex items-center gap-1">New post <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </div>
              {calendarResult && (
                <div className="px-5 py-2.5 bg-seed-500/5 border-b border-white/[0.04] flex items-center justify-between">
                  <span className="text-xs text-seed-400">
                    ✓ Generated {calendarResult.total} ideas — {calendarResult.saved} saved, {calendarResult.skipped} skipped (already existed)
                  </span>
                  <button onClick={() => setCalendarResult(null)} className="text-white/30 hover:text-white/50"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              {batchResult && (
                <div className="px-5 py-2.5 bg-blue-500/5 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">
                      ✓ Wrote {batchResult.written}/{batchResult.total} blog posts as drafts{batchResult.failed > 0 ? ` (${batchResult.failed} failed)` : ""}
                    </span>
                    <button onClick={() => setBatchResult(null)} className="text-white/30 hover:text-white/50"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  {batchResult.posts.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {batchResult.posts.map((p) => (
                        <Link key={p.slug} href={`/admin/blog`} className="text-[11px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded hover:bg-blue-500/20 transition-colors">
                          {p.keyword}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="divide-y divide-white/[0.04] max-h-[32rem] overflow-y-auto">
                {contentIdeas.map((item) => (
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
                {contentIdeas.length === 0 && <div className="px-5 py-6 text-center text-white/30 text-sm">No content ideas yet.</div>}
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

      {/* METADATA TAB */}
      {activeTab === "metadata" && (
        <MetadataTab />
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Keywords (migrated from /admin/seo/context)
   ═══════════════════════════════════════════════════════════════ */

function KeywordsSection() {
  const [view, setView] = useState<KeywordView>("manage");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Tracked Keywords
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Keywords with a <strong className="text-white/60">target page</strong> tell the AI which keywords belong to which page.
            When generating metadata for a page, keywords targeting it are marked as high-priority.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-dark-elevated border border-white/[0.06] rounded-lg p-0.5 w-fit">
          <button
            onClick={() => setView("manage")}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-md transition-all",
              view === "manage" ? "bg-purple-500/15 text-purple-300 border border-purple-500/20" : "text-white/40 hover:text-white/60",
            )}
          >
            Manage
          </button>
          <button
            onClick={() => setView("research")}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
              view === "research" ? "bg-purple-500/15 text-purple-300 border border-purple-500/20" : "text-white/40 hover:text-white/60",
            )}
          >
            <Sparkles className="w-3 h-3" />
            AI Research
          </button>
        </div>
      </div>

      {view === "manage" ? <KeywordManageView /> : <KeywordResearchView />}
    </div>
  );
}

/* ─── Manage View (CRUD) ─── */

function KeywordManageView() {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterIntent, setFilterIntent] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<TrackedKeyword>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Add keyword form
  const [addForm, setAddForm] = useState({
    keyword: "",
    tier: "tier2",
    intent: "informational",
    targetPage: "/",
    volume: "unknown",
    competition: "medium",
  });

  // Bulk import
  const [bulkText, setBulkText] = useState("");
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ imported: number; total: number } | null>(null);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/keywords");
      const data = await res.json();
      if (data.keywords) setKeywords(data.keywords);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeywords(); }, [fetchKeywords]);

  // ── Add single keyword ──
  const handleAdd = async () => {
    if (!addForm.keyword.trim()) return;
    setActionLoading("add");
    try {
      const res = await fetch("/api/admin/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setShowAddModal(false);
        setAddForm({ keyword: "", tier: "tier2", intent: "informational", targetPage: "/", volume: "unknown", competition: "medium" });
        await fetchKeywords();
      }
    } catch { /* silent */ }
    setActionLoading(null);
  };

  // ── Edit keyword inline ──
  const startEdit = (kw: TrackedKeyword) => {
    setEditingId(kw.id);
    setEditDraft({ tier: kw.tier, intent: kw.intent, targetPage: kw.targetPage, volume: kw.volume, competition: kw.competition });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setActionLoading(editingId);
    try {
      const res = await fetch(`/api/admin/seo/keywords/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      if (res.ok) {
        setEditingId(null);
        setSavedId(editingId);
        setTimeout(() => setSavedId(null), 2000);
        await fetchKeywords();
      }
    } catch { /* silent */ }
    setActionLoading(null);
  };

  // ── Delete keyword ──
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/seo/keywords/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingId(null);
        await fetchKeywords();
      }
    } catch { /* silent */ }
    setActionLoading(null);
  };

  // ── Bulk import ──
  const handleBulkImport = async () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setBulkImporting(true);
    setBulkResult(null);

    const kwArray = lines.map((line) => {
      // Support: keyword, tier, intent, targetPage  OR  just keyword
      const parts = line.split(/[,\t]/).map((p) => p.trim());
      return {
        keyword: parts[0],
        tier: parts[1] || "tier2",
        intent: parts[2] || "informational",
        targetPage: parts[3] || "/",
        volume: parts[4] || "unknown",
        competition: parts[5] || "medium",
      };
    });

    try {
      const res = await fetch("/api/admin/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kwArray),
      });
      if (res.ok) {
        const data = await res.json();
        setBulkResult(data);
        await fetchKeywords();
      }
    } catch { /* silent */ }
    setBulkImporting(false);
  };

  // ── Filtering ──
  const filtered = keywords.filter((kw) => {
    if (search && !kw.keyword.toLowerCase().includes(search.toLowerCase()) && !kw.targetPage.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTier !== "all" && kw.tier !== filterTier) return false;
    if (filterIntent !== "all" && kw.intent !== filterIntent) return false;
    return true;
  });

  const tier1 = keywords.filter((k) => k.tier === "tier1");
  const tier2 = keywords.filter((k) => k.tier === "tier2");
  const tier3 = keywords.filter((k) => k.tier === "tier3");

  const kwTierColors: Record<string, string> = {
    tier1: "bg-seed-500/20 text-seed-400 border-seed-500/30",
    tier2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    tier3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  const intentColors: Record<string, string> = {
    transactional: "text-emerald-400",
    commercial: "text-amber-400",
    informational: "text-blue-400",
    navigational: "text-white/40",
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4">
          <p className="text-2xl font-bold text-white/80">{keywords.length}</p>
          <p className="text-xs text-white/40 mt-1">Total Keywords</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4">
          <p className="text-2xl font-bold text-seed-400">{tier1.length}</p>
          <p className="text-xs text-white/40 mt-1">Tier 1 — Primary</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-400">{tier2.length}</p>
          <p className="text-xs text-white/40 mt-1">Tier 2 — Secondary</p>
        </div>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-4">
          <p className="text-2xl font-bold text-purple-400">{tier3.length}</p>
          <p className="text-xs text-white/40 mt-1">Tier 3 — Long-tail</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search keywords or target pages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Tier filter */}
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white/60 focus:outline-none focus:border-purple-500/50"
        >
          <option value="all">All Tiers</option>
          <option value="tier1">Tier 1</option>
          <option value="tier2">Tier 2</option>
          <option value="tier3">Tier 3</option>
        </select>

        {/* Intent filter */}
        <select
          value={filterIntent}
          onChange={(e) => setFilterIntent(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white/60 focus:outline-none focus:border-purple-500/50"
        >
          <option value="all">All Intents</option>
          <option value="transactional">Transactional</option>
          <option value="commercial">Commercial</option>
          <option value="informational">Informational</option>
          <option value="navigational">Navigational</option>
        </select>

        {/* Add / Import buttons */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-seed-500 hover:bg-seed-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        <button
          onClick={() => { setShowBulkModal(true); setBulkResult(null); setBulkText(""); }}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
      </div>

      {/* Keywords table */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-dark-elevated">
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Keyword</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Tier</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Position</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Intent</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Volume</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Competition</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Target Page</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((kw) => (
                editingId === kw.id ? (
                  /* ── Inline edit row ── */
                  <tr key={kw.id} className="bg-purple-500/[0.03]">
                    <td className="px-4 py-2 text-white/70 font-medium">{kw.keyword}</td>
                    <td className="px-3 py-2 text-center">
                      <select
                        value={editDraft.tier || kw.tier}
                        onChange={(e) => setEditDraft({ ...editDraft, tier: e.target.value })}
                        className="bg-dark-base border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="tier1">T1</option>
                        <option value="tier2">T2</option>
                        <option value="tier3">T3</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-white/40 text-xs">
                      {kw.currentPosition ? kw.currentPosition.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={editDraft.intent || kw.intent}
                        onChange={(e) => setEditDraft({ ...editDraft, intent: e.target.value })}
                        className="bg-dark-base border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="transactional">Transactional</option>
                        <option value="commercial">Commercial</option>
                        <option value="informational">Informational</option>
                        <option value="navigational">Navigational</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select
                        value={editDraft.volume || kw.volume}
                        onChange={(e) => setEditDraft({ ...editDraft, volume: e.target.value })}
                        className="bg-dark-base border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="very-low">Very Low</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="very-high">Very High</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select
                        value={editDraft.competition || kw.competition}
                        onChange={(e) => setEditDraft({ ...editDraft, competition: e.target.value })}
                        className="bg-dark-base border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={editDraft.targetPage ?? kw.targetPage}
                        onChange={(e) => setEditDraft({ ...editDraft, targetPage: e.target.value })}
                        className="w-full bg-dark-base border border-white/[0.1] rounded px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={saveEdit}
                          disabled={actionLoading === kw.id}
                          className="p-1 rounded bg-seed-500/20 hover:bg-seed-500/30 text-seed-400 transition-colors"
                          title="Save"
                        >
                          {actionLoading === kw.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/40 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ── Read row ── */
                  <tr
                    key={kw.id}
                    className={cn(
                      "transition-colors group",
                      savedId === kw.id ? "bg-emerald-500/[0.04]" : "hover:bg-white/[0.02]",
                      deletingId === kw.id ? "bg-red-500/[0.04]" : "",
                    )}
                  >
                    <td className="px-4 py-2.5 text-white/70 font-medium">
                      <div className="flex items-center gap-2">
                        {kw.keyword}
                        {savedId === kw.id && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", kwTierColors[kw.tier] || "")}>
                        T{kw.tier.replace("tier", "")}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-white/50 text-xs">
                          {kw.currentPosition ? kw.currentPosition.toFixed(1) : "—"}
                        </span>
                        {kw.currentPosition && kw.previousPosition && (
                          kw.currentPosition < kw.previousPosition
                            ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                            : kw.currentPosition > kw.previousPosition
                              ? <TrendingDown className="w-3 h-3 text-red-400" />
                              : <Minus className="w-3 h-3 text-white/20" />
                        )}
                      </div>
                    </td>
                    <td className={cn("px-3 py-2.5 capitalize text-xs", intentColors[kw.intent] || "text-white/40")}>{kw.intent}</td>
                    <td className="px-3 py-2.5 text-center text-xs text-white/40 capitalize">{kw.volume === "unknown" ? "—" : kw.volume}</td>
                    <td className="px-3 py-2.5 text-center text-xs text-white/40 capitalize">{kw.competition}</td>
                    <td className="px-3 py-2.5 text-white/30 text-xs font-mono">{kw.targetPage || "/"}</td>
                    <td className="px-3 py-2.5 text-center">
                      {deletingId === kw.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDelete(kw.id)}
                            disabled={actionLoading === kw.id}
                            className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-medium transition-colors"
                          >
                            {actionLoading === kw.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-0.5 rounded bg-white/[0.04] text-white/40 text-[10px] font-medium transition-colors hover:bg-white/[0.08]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(kw)}
                            className="p-1 rounded hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(kw.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              ))}
              {filtered.length === 0 && keywords.length > 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-white/30 text-sm">
                    No keywords match your filters.
                  </td>
                </tr>
              )}
              {keywords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Target className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-sm text-white/30 mb-3">No keywords tracked yet.</p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-seed-500/10 hover:bg-seed-500/20 border border-seed-500/20 text-seed-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Keyword
                      </button>
                      <button
                        onClick={() => { setShowBulkModal(true); setBulkResult(null); setBulkText(""); }}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        Bulk Import
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-white/[0.04] text-xs text-white/25">
            Showing {filtered.length} of {keywords.length} keywords
          </div>
        )}
      </section>

      {/* How keywords are used */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-purple-500/[0.04] border border-purple-500/10">
        <Info className="w-4 h-4 text-purple-400/60 mt-0.5 shrink-0" />
        <div className="text-xs text-white/40 space-y-1">
          <p><strong className="text-white/60">How keywords influence AI outputs:</strong></p>
          <p>• Keywords with a <strong className="text-white/55">target page</strong> matching the current page are labeled &quot;HIGH PRIORITY&quot; in the AI prompt</p>
          <p>• Keywords targeting <em>other</em> pages are shown to the AI with a &quot;do NOT use&quot; instruction for differentiation</p>
          <p>• Unassigned keywords (target page = /) are offered as &quot;use if relevant&quot;</p>
        </div>
      </div>

      {/* ═══ Add Keyword Modal ═══ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-dark-elevated border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-seed-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Add Keyword</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-white/50 mb-1.5 block">Keyword *</label>
                <input
                  type="text"
                  value={addForm.keyword}
                  onChange={(e) => setAddForm({ ...addForm, keyword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50"
                  placeholder="managed IT services NJ"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Tier</label>
                  <select
                    value={addForm.tier}
                    onChange={(e) => setAddForm({ ...addForm, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-seed-500/50"
                  >
                    <option value="tier1">Tier 1 — Primary</option>
                    <option value="tier2">Tier 2 — Secondary</option>
                    <option value="tier3">Tier 3 — Long-tail</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Intent</label>
                  <select
                    value={addForm.intent}
                    onChange={(e) => setAddForm({ ...addForm, intent: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-seed-500/50"
                  >
                    <option value="transactional">Transactional</option>
                    <option value="commercial">Commercial</option>
                    <option value="informational">Informational</option>
                    <option value="navigational">Navigational</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Volume</label>
                  <select
                    value={addForm.volume}
                    onChange={(e) => setAddForm({ ...addForm, volume: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-seed-500/50"
                  >
                    <option value="unknown">Unknown</option>
                    <option value="very-low">Very Low</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="very-high">Very High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Competition</label>
                  <select
                    value={addForm.competition}
                    onChange={(e) => setAddForm({ ...addForm, competition: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-seed-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-white/50 mb-1.5 block">Target Page</label>
                <input
                  type="text"
                  value={addForm.targetPage}
                  onChange={(e) => setAddForm({ ...addForm, targetPage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm font-mono text-white focus:outline-none focus:border-seed-500/50"
                  placeholder="/services/managed-it"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="text-sm text-white/40 hover:text-white/60 transition-colors">Cancel</button>
              <button
                onClick={handleAdd}
                disabled={!addForm.keyword.trim() || actionLoading === "add"}
                className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === "add" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Keyword
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Bulk Import Modal ═══ */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-dark-elevated border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Bulk Import Keywords</h3>
                  <p className="text-[11px] text-white/40">One keyword per line, optionally with CSV fields</p>
                </div>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="text-[11px] text-white/30 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 font-mono">
                <p className="text-white/50 mb-1">Format: keyword, tier, intent, targetPage, volume, competition</p>
                <p>managed IT services NJ, tier1, commercial, /services/managed-it, high, medium</p>
                <p>cybersecurity solutions, tier2, informational, /services/cybersecurity</p>
                <p>IT help desk support</p>
                <p className="text-white/20 mt-1">Columns after keyword are optional — defaults will be used.</p>
              </div>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm font-mono text-white focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Paste keywords here, one per line…"
                autoFocus
              />
              {bulkResult && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Imported {bulkResult.imported} of {bulkResult.total} keywords</span>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-white/25">
                {bulkText.split("\n").filter((l) => l.trim()).length} keywords detected
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowBulkModal(false)} className="text-sm text-white/40 hover:text-white/60 transition-colors">
                  {bulkResult ? "Close" : "Cancel"}
                </button>
                {!bulkResult && (
                  <button
                    onClick={handleBulkImport}
                    disabled={!bulkText.trim() || bulkImporting}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {bulkImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {bulkImporting ? "Importing…" : "Import Keywords"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AI Research View ─── */

function KeywordResearchView() {
  const [researchMode, setResearchMode] = useState<ResearchMode>("full-audit");
  const [focusArea, setFocusArea] = useState("");
  const [running, setRunning] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [dataSources, setDataSources] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; total: number } | null>(null);
  const streamRef = useRef<HTMLDivElement>(null);

  const startResearch = async () => {
    setRunning(true);
    setStreamText("");
    setSuggestions([]);
    setError(null);
    setDataSources(null);
    setSelectedSuggestions(new Set());
    setImportResult(null);

    try {
      const res = await fetch("/api/admin/seo/keywords/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: researchMode,
          focusArea: focusArea.trim() || undefined,
          includeGsc: true,
        }),
      });

      if (!res.ok || !res.body) {
        setError("Failed to start research");
        setRunning(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6));

            if (evt.type === "start") {
              setDataSources(evt.dataSources);
            }

            if (evt.type === "text") {
              setStreamText(evt.content);
              setTimeout(() => {
                streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" });
              }, 50);
            }

            if (evt.type === "done") {
              setStreamText(evt.fullText);
              if (evt.suggestions) setSuggestions(evt.suggestions);
              setRunning(false);
            }

            if (evt.type === "error") {
              setError(evt.error);
              setRunning(false);
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Research failed");
    }
    setRunning(false);
  };

  const toggleSuggestion = (idx: number) => {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedSuggestions.size === suggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(suggestions.map((_, i) => i)));
    }
  };

  const importSelected = async () => {
    const selected = suggestions.filter((_, i) => selectedSuggestions.has(i));
    if (selected.length === 0) return;
    setImporting(true);

    try {
      const res = await fetch("/api/admin/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected.map((s) => ({
          keyword: s.keyword,
          tier: s.tier,
          intent: s.intent,
          targetPage: s.targetPage,
          volume: s.volume,
          competition: s.competition,
        }))),
      });
      if (res.ok) {
        const data = await res.json();
        setImportResult(data);
      }
    } catch { /* silent */ }
    setImporting(false);
  };

  const resTierColors: Record<string, string> = {
    tier1: "bg-seed-500/20 text-seed-400 border-seed-500/30",
    tier2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    tier3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="space-y-5">
      {/* Research mode selector */}
      <div className="grid grid-cols-5 gap-2">
        {RESEARCH_MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setResearchMode(m.key)}
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-center transition-all border",
              researchMode === m.key
                ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                : "bg-dark-elevated border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.1]",
            )}
          >
            <m.icon className={cn("w-5 h-5", researchMode === m.key ? "text-purple-400" : "text-white/25")} />
            <span className="text-xs font-medium">{m.label}</span>
            <span className="text-[10px] text-white/25 leading-tight">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Focus area + Launch */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-white/50 mb-1.5 block">
            Focus Area <span className="text-white/25 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
            placeholder="e.g., cybersecurity, cloud services, specific page…"
          />
        </div>
        <button
          onClick={startResearch}
          disabled={running}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Researching…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Start Research
            </>
          )}
        </button>
      </div>

      {/* Data sources badge */}
      {dataSources && (
        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <span className="text-white/50">Data sources:</span>
          <span className={cn("flex items-center gap-1", dataSources.businessContext ? "text-emerald-400/60" : "text-white/20")}>
            <Check className="w-3 h-3" /> Business Profile
          </span>
          <span className={cn("flex items-center gap-1", (dataSources.existingKeywords as number) > 0 ? "text-emerald-400/60" : "text-white/20")}>
            <Check className="w-3 h-3" /> {dataSources.existingKeywords as number} Keywords
          </span>
          <span className={cn("flex items-center gap-1", dataSources.pageContexts ? "text-emerald-400/60" : "text-white/20")}>
            <Check className="w-3 h-3" /> Page Contexts
          </span>
          <span className={cn("flex items-center gap-1", dataSources.gsc ? "text-emerald-400/60" : "text-amber-400/60")}>
            {dataSources.gsc ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {dataSources.gsc ? "GSC Connected" : "GSC Not Connected"}
          </span>
        </div>
      )}

      {/* Stream output */}
      {(streamText || running) && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400/60" />
              <span className="text-xs font-medium text-white/50">AI Research Analysis</span>
              {running && <Lottie animationData={progressAnimation} loop autoplay style={{ width: 16, height: 16 }} />}
            </div>
            {!running && streamText && (
              <button
                onClick={() => { navigator.clipboard.writeText(streamText); }}
                className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            )}
          </div>
          <div
            ref={streamRef}
            className="p-5 max-h-[500px] overflow-y-auto prose prose-invert prose-sm prose-headings:text-white/80 prose-p:text-white/50 prose-li:text-white/50 prose-strong:text-white/70 prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:rounded max-w-none text-sm leading-relaxed"
          >
            <KwMarkdownRenderer text={streamText} />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-sm text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Keyword suggestions table */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                {suggestions.length} Keyword Suggestions Found
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                {selectedSuggestions.size === suggestions.length ? "Deselect All" : "Select All"}
              </button>
              {importResult ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <Check className="w-4 h-4" />
                  Imported {importResult.imported} keywords
                </span>
              ) : (
                <button
                  onClick={importSelected}
                  disabled={selectedSuggestions.size === 0 || importing}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg bg-seed-500 hover:bg-seed-600 text-white transition-colors disabled:opacity-40"
                >
                  {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Import {selectedSuggestions.size > 0 ? `${selectedSuggestions.size} Selected` : "Selected"}
                </button>
              )}
            </div>
          </div>

          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-3 py-2.5 w-8"></th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Keyword</th>
                    <th className="text-center px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Tier</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Intent</th>
                    <th className="text-center px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Volume</th>
                    <th className="text-center px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Comp.</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Target Page</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {suggestions.map((s, i) => (
                    <tr
                      key={i}
                      onClick={() => toggleSuggestion(i)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedSuggestions.has(i)
                          ? "bg-seed-500/[0.06]"
                          : "hover:bg-white/[0.02]",
                      )}
                    >
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedSuggestions.has(i)}
                          onChange={() => toggleSuggestion(i)}
                          className="rounded border-white/20 bg-transparent text-seed-500 focus:ring-seed-500/30 w-3.5 h-3.5"
                        />
                      </td>
                      <td className="px-3 py-2 text-white/70 font-medium">{s.keyword}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", resTierColors[s.tier] || resTierColors.tier2)}>
                          T{s.tier.replace("tier", "")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-white/40 capitalize text-xs">{s.intent}</td>
                      <td className="px-3 py-2 text-center text-xs text-white/40 capitalize">{s.volume}</td>
                      <td className="px-3 py-2 text-center text-xs text-white/40 capitalize">{s.competition}</td>
                      <td className="px-3 py-2 text-white/30 text-xs font-mono">{s.targetPage}</td>
                      <td className="px-3 py-2 text-white/30 text-[11px] max-w-xs truncate">{s.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!running && !streamText && !error && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
          <Sparkles className="w-8 h-8 text-purple-400/20 mx-auto mb-3" />
          <p className="text-sm text-white/30 mb-1">AI Keyword Research Agent</p>
          <p className="text-xs text-white/20 max-w-md mx-auto">
            Select a research mode above and click &quot;Start Research&quot; to analyze your keyword strategy.
            The AI will use your business profile, page contexts, existing keywords, and Google Search Console data to identify opportunities.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Simple Markdown Renderer for keyword research ─── */

function KwMarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("KEYWORD_SUGGESTION")) continue;

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-white/80 font-semibold text-sm mt-4 mb-2">{kwFormatInline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-white/80 font-semibold text-base mt-5 mb-2">{kwFormatInline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-white font-bold text-lg mt-6 mb-3">{kwFormatInline(line.slice(2))}</h1>);
    } else if (line.match(/^[-•*]\s/)) {
      elements.push(<p key={i} className="text-white/50 text-sm ml-4 my-0.5">• {kwFormatInline(line.replace(/^[-•*]\s+/, ""))}</p>);
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(<p key={i} className="text-white/50 text-sm ml-4 my-0.5">{kwFormatInline(line)}</p>);
    } else if (line.match(/^---+$/)) {
      elements.push(<hr key={i} className="border-white/[0.06] my-4" />);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-white/50 text-sm my-1">{kwFormatInline(line)}</p>);
    }
  }

  return <>{elements}</>;
}

function kwFormatInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index));
      parts.push(<strong key={key++} className="text-white/70 font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push(remaining.slice(0, codeMatch.index));
      parts.push(<code key={key++} className="text-purple-300 bg-purple-500/10 px-1 rounded text-xs">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) parts.push(remaining.slice(0, italicMatch.index));
      parts.push(<em key={key++} className="text-white/60">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    parts.push(remaining);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}