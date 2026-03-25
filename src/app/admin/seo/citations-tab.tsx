"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bot,
  Loader2,
  PlayCircle,
  TrendingUp,
  TrendingDown,
  Globe,
  Search,
  Award,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
  Swords,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

/* ── Types ── */

interface CitationDashboardData {
  currentMentionRate: number;
  previousMentionRate: number;
  mentionRateChange: number;
  totalChecksAllTime: number;
  totalMentionsAllTime: number;
  totalUrlCitations: number;
  recentTrend: CitationTrend[];
  platformBreakdown: PlatformBreakdown[];
  topQueries: QueryInsight[];
  competitorComparison: CompetitorComparison[];
  recentCitations: RecentCitation[];
  citationTypeDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
}

interface CitationTrend {
  date: string;
  totalChecks: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number;
  citationRate: number;
}

interface PlatformBreakdown {
  platform: string;
  totalChecks: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number;
  avgPosition: number | null;
  topCitationType: string | null;
  sentiment: { positive: number; neutral: number; negative: number };
}

interface QueryInsight {
  query: string;
  timesChecked: number;
  timesMentioned: number;
  mentionRate: number;
  platforms: string[];
  latestCitationType: string | null;
  latestSentiment: string | null;
}

interface CompetitorComparison {
  competitorId: string;
  competitorName: string;
  competitorDomain: string;
  totalChecks: number;
  mentionCount: number;
  mentionRate: number;
  urlCitationCount: number;
  ourMentionRate: number;
  gap: number;
}

interface RecentCitation {
  id: string;
  platform: string;
  query: string;
  brandMentioned: boolean;
  urlCited: string | null;
  context: string | null;
  citationType: string | null;
  sentiment: string | null;
  position: number | null;
  checkedAt: string;
}

interface CheckRun {
  id: string;
  status: string;
  totalQueries: number;
  totalPlatforms: number;
  brandMentions: number;
  urlCitations: number;
  mentionRate: number | null;
  durationMs: number | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

/* ── Helpers ── */

const platformLabels: Record<string, string> = {
  perplexity: "Perplexity",
  chatgpt: "ChatGPT",
  google_aio: "Google AIO",
  gemini: "Gemini",
  copilot: "Copilot",
};

const platformColors: Record<string, string> = {
  perplexity: "bg-blue-500",
  chatgpt: "bg-green-500",
  google_aio: "bg-red-500",
  gemini: "bg-purple-500",
  copilot: "bg-cyan-500",
};

const citationTypeLabels: Record<string, string> = {
  direct_quote: "Direct Quote",
  brand_mention: "Brand Mention",
  url_citation: "URL Citation",
  recommendation: "Recommendation",
};

const sentimentIcons: Record<string, React.ReactNode> = {
  positive: <ThumbsUp className="w-3.5 h-3.5 text-green-400" />,
  neutral: <Minus className="w-3.5 h-3.5 text-white/40" />,
  negative: <ThumbsDown className="w-3.5 h-3.5 text-red-400" />,
};

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function rateColor(rate: number): string {
  if (rate >= 0.5) return "text-green-400";
  if (rate >= 0.25) return "text-yellow-400";
  if (rate >= 0.1) return "text-orange-400";
  return "text-red-400";
}

function _rateBg(rate: number): string {
  if (rate >= 0.5) return "bg-green-400/10 border-green-400/20";
  if (rate >= 0.25) return "bg-yellow-400/10 border-yellow-400/20";
  if (rate >= 0.1) return "bg-orange-400/10 border-orange-400/20";
  return "bg-red-400/10 border-red-400/20";
}

/* ── Component ── */

export default function CitationsTab() {
  const [data, setData] = useState<CitationDashboardData | null>(null);
  const [runs, setRuns] = useState<CheckRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);

  // ── Spot check state ──
  const [spotQuery, setSpotQuery] = useState("");
  const [spotPlatform, setSpotPlatform] = useState("perplexity");
  const [spotLoading, setSpotLoading] = useState(false);
  const [spotResult, setSpotResult] = useState<RecentCitation | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [dashRes, runsRes] = await Promise.all([
        fetch("/api/admin/seo/citations"),
        fetch("/api/admin/seo/citations/runs"),
      ]);
      if (dashRes.ok) setData(await dashRes.json());
      if (runsRes.ok) {
        const r = await runsRes.json();
        setRuns(r.runs || []);
      }
    } catch (e) {
      console.error("Failed to load citation data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const runCheck = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/admin/seo/citations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxQueries: 15 }),
      });
      if (res.ok) {
        const result = await res.json();
        setRunResult(
          `Check complete: ${result.brandMentions} mentions in ${result.totalQueries} queries across ${result.totalPlatforms} platforms (${pct(result.mentionRate)} rate) in ${(result.durationMs / 1000).toFixed(1)}s`
        );
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        setRunResult(`Error: ${err.error || "Check failed"}`);
      }
    } catch {
      setRunResult("Error: Network failure");
    } finally {
      setRunning(false);
    }
  };

  const runSpotCheck = async () => {
    if (!spotQuery.trim()) return;
    setSpotLoading(true);
    setSpotResult(null);
    try {
      const res = await fetch("/api/admin/seo/citations/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: spotQuery, platform: spotPlatform }),
      });
      if (res.ok) {
        setSpotResult(await res.json());
      }
    } catch {
      /* ignore */
    } finally {
      setSpotLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-seed-400 animate-spin" />
        <span className="ml-3 text-white/40 text-sm">Loading citation data...</span>
      </div>
    );
  }

  const hasData = data && data.totalChecksAllTime > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-seed-400" />
            AI Citation Intelligence
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Track how AI platforms cite your brand in their responses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCheck}
            disabled={running}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4" />
            )}
            {running ? "Running..." : "Run Citation Check"}
          </button>
        </div>
      </div>

      {/* Run result banner */}
      {runResult && (
        <div className={`rounded-lg px-4 py-2 text-sm flex items-center justify-between ${runResult.startsWith("Error") ? "bg-red-500/10 border border-red-500/20 text-red-300" : "bg-green-500/10 border border-green-500/20 text-green-300"}`}>
          <span>{runResult}</span>
          <button onClick={() => setRunResult(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {!hasData ? (
        /* ── Empty State ── */
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
          <Bot className="w-12 h-12 text-seed-400/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No Citation Data Yet</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            Run your first citation check to see how AI platforms like ChatGPT, Perplexity, and Google AIO mention your brand.
          </p>
          <button
            onClick={runCheck}
            disabled={running}
            className="inline-flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Run First Citation Check
          </button>
        </div>
      ) : (
        <>
          {/* ── Top Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Mention Rate"
              value={pct(data.currentMentionRate)}
              subValue={data.mentionRateChange !== 0 ? `${data.mentionRateChange > 0 ? "+" : ""}${pct(data.mentionRateChange)} vs last` : undefined}
              trend={data.mentionRateChange > 0 ? "up" : data.mentionRateChange < 0 ? "down" : undefined}
              colorClass={rateColor(data.currentMentionRate)}
            />
            <StatCard
              label="Brand Mentions"
              value={data.totalMentionsAllTime.toString()}
              subValue={`of ${data.totalChecksAllTime} checks`}
              colorClass="text-blue-400"
            />
            <StatCard
              label="URL Citations"
              value={data.totalUrlCitations.toString()}
              subValue="direct links to your pages"
              colorClass="text-purple-400"
            />
            <StatCard
              label="Total Checks"
              value={data.totalChecksAllTime.toString()}
              subValue={`across ${runs.length} runs`}
              colorClass="text-white/60"
            />
            <StatCard
              label="Best Platform"
              value={data.platformBreakdown[0]?.platform ? platformLabels[data.platformBreakdown[0].platform] || data.platformBreakdown[0].platform : "N/A"}
              subValue={data.platformBreakdown[0] ? `${pct(data.platformBreakdown[0].mentionRate)} mention rate` : undefined}
              colorClass="text-seed-400"
            />
          </div>

          {/* ── Platform Breakdown ── */}
          {data.platformBreakdown.length > 0 && (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <Globe className="w-4 h-4 text-seed-400" />
                <h3 className="text-sm font-semibold text-white">Platform Breakdown</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.platformBreakdown.map((pb) => (
                  <div key={pb.platform} className="px-5 py-3 flex items-center gap-4">
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${platformColors[pb.platform] || "bg-white/20"}`} />
                      <span className="text-sm text-white/80">{platformLabels[pb.platform] || pb.platform}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${platformColors[pb.platform] || "bg-white/20"}`}
                            style={{ width: `${Math.min(100, pb.mentionRate * 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-mono w-14 text-right ${rateColor(pb.mentionRate)}`}>
                          {pct(pb.mentionRate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40 shrink-0">
                      <span>{pb.brandMentions}/{pb.totalChecks} mentions</span>
                      <span>{pb.urlCitations} URLs</span>
                      {pb.avgPosition && <span>Avg pos #{pb.avgPosition.toFixed(1)}</span>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {pb.sentiment.positive > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-green-400">
                          <ThumbsUp className="w-3 h-3" />{pb.sentiment.positive}
                        </span>
                      )}
                      {pb.sentiment.negative > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-red-400 ml-1">
                          <ThumbsDown className="w-3 h-3" />{pb.sentiment.negative}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Two-Column: Top Queries + Competitor Comparison ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Queries */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Top Citation Queries</h3>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                {data.topQueries.length === 0 ? (
                  <div className="px-5 py-6 text-center text-white/30 text-sm">No query data yet.</div>
                ) : (
                  data.topQueries.map((q, i) => (
                    <div key={i} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-white/80 flex-1">&ldquo;{q.query}&rdquo;</p>
                        <span className={`text-sm font-mono shrink-0 ${rateColor(q.mentionRate)}`}>
                          {pct(q.mentionRate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
                        <span>{q.timesMentioned}/{q.timesChecked} checks</span>
                        {q.platforms.length > 0 && (
                          <span className="flex items-center gap-1">
                            {q.platforms.map((p) => (
                              <span key={p} className={`w-1.5 h-1.5 rounded-full ${platformColors[p] || "bg-white/20"}`} title={platformLabels[p] || p} />
                            ))}
                          </span>
                        )}
                        {q.latestSentiment && sentimentIcons[q.latestSentiment]}
                        {q.latestCitationType && (
                          <span className="text-white/20">{citationTypeLabels[q.latestCitationType] || q.latestCitationType}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <Swords className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Competitor Citation Comparison</h3>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                {data.competitorComparison.length === 0 ? (
                  <div className="px-5 py-6 text-center text-white/30 text-sm">Add competitors to compare citation rates.</div>
                ) : (
                  <>
                    {/* Our rate header */}
                    <div className="px-5 py-3 bg-seed-500/5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-seed-400 font-medium">Your Brand</span>
                        <span className={`text-sm font-mono ${rateColor(data.currentMentionRate)}`}>
                          {pct(data.currentMentionRate)}
                        </span>
                      </div>
                    </div>
                    {data.competitorComparison.map((comp) => (
                      <div key={comp.competitorId} className="px-5 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-white/80">{comp.competitorName}</span>
                            <span className="text-xs text-white/20 ml-2">{comp.competitorDomain}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-mono ${rateColor(comp.mentionRate)}`}>
                              {pct(comp.mentionRate)}
                            </span>
                            {comp.gap !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${comp.gap > 0 ? "text-red-400" : "text-green-400"}`}>
                                {comp.gap > 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                {Math.abs(comp.gap * 100).toFixed(1)}pp
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500/60 rounded-full" style={{ width: `${Math.min(100, comp.mentionRate * 100)}%` }} />
                          </div>
                          <span className="text-xs text-white/20">{comp.mentionCount}/{comp.totalChecks}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Citation Type + Sentiment Distribution ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Citation Types</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {Object.keys(data.citationTypeDistribution).length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-2">No citation type data yet.</p>
                ) : (
                  Object.entries(data.citationTypeDistribution).map(([type, count]) => {
                    const total = Object.values(data.citationTypeDistribution).reduce((a, b) => a + b, 0);
                    const widthPct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-white/60">{citationTypeLabels[type] || type}</span>
                          <span className="text-white/40">{count} ({widthPct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500/60 rounded-full transition-all" style={{ width: `${widthPct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-white">Sentiment Analysis</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {Object.keys(data.sentimentDistribution).length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-2">No sentiment data yet.</p>
                ) : (
                  <>
                    {(["positive", "neutral", "negative"] as const).map((sent) => {
                      const count = data.sentimentDistribution[sent] || 0;
                      const total = Object.values(data.sentimentDistribution).reduce((a, b) => a + b, 0);
                      const widthPct = total > 0 ? (count / total) * 100 : 0;
                      const barColors = { positive: "bg-green-500/60", neutral: "bg-white/20", negative: "bg-red-500/60" };
                      return (
                        <div key={sent}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/60 flex items-center gap-1.5 capitalize">
                              {sentimentIcons[sent]} {sent}
                            </span>
                            <span className="text-white/40">{count} ({widthPct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${barColors[sent]}`} style={{ width: `${widthPct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent Citations ── */}
          {data.recentCitations.length > 0 && (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-seed-400" />
                <h3 className="text-sm font-semibold text-white">Recent Citations</h3>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
                {data.recentCitations.map((c) => (
                  <div key={c.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${platformColors[c.platform] || "bg-white/20"}`} />
                          <span className="text-xs text-white/40">{platformLabels[c.platform] || c.platform}</span>
                          {c.citationType && (
                            <span className="text-xs bg-white/[0.04] px-1.5 py-0.5 rounded text-white/30">
                              {citationTypeLabels[c.citationType] || c.citationType}
                            </span>
                          )}
                          {c.sentiment && sentimentIcons[c.sentiment]}
                          {c.position && <span className="text-xs text-white/20">#{c.position}</span>}
                        </div>
                        <p className="text-sm text-white/70">&ldquo;{c.query}&rdquo;</p>
                        {c.context && (
                          <div className="mt-1.5">
                            <button
                              onClick={() => setExpandedCitation(expandedCitation === c.id ? null : c.id)}
                              className="text-xs text-seed-400 hover:text-seed-300 flex items-center gap-1"
                            >
                              {expandedCitation === c.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {expandedCitation === c.id ? "Hide context" : "Show context"}
                            </button>
                            {expandedCitation === c.id && (
                              <p className="text-xs text-white/30 mt-1 p-2 bg-white/[0.02] rounded-lg leading-relaxed whitespace-pre-wrap">
                                {c.context}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {c.urlCited && (
                          <a
                            href={c.urlCited}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="w-3 h-3" />URL
                          </a>
                        )}
                        <span className="text-xs text-white/20 block mt-1">
                          {new Date(c.checkedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Spot Check ── */}
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Spot Check</h3>
              <span className="text-xs text-white/30 ml-2">Test a single query on a specific platform</span>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={spotQuery}
                  onChange={(e) => setSpotQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSpotCheck()}
                  placeholder="e.g. Best managed IT company in NJ"
                  className="flex-1 bg-dark-base border border-white/[0.08] text-sm text-white placeholder-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-seed-500/50"
                />
                <select
                  value={spotPlatform}
                  onChange={(e) => setSpotPlatform(e.target.value)}
                  className="bg-dark-base border border-white/[0.08] text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-seed-500/50"
                >
                  <option value="perplexity">Perplexity</option>
                  <option value="chatgpt">ChatGPT</option>
                  <option value="google_aio">Google AIO</option>
                  <option value="gemini">Gemini</option>
                  <option value="copilot">Copilot</option>
                </select>
                <button
                  onClick={runSpotCheck}
                  disabled={spotLoading || !spotQuery.trim()}
                  className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/20 text-amber-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {spotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Check
                </button>
              </div>
              {spotResult && (
                <div className={`mt-3 p-3 rounded-lg border ${spotResult.brandMentioned ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {spotResult.brandMentioned ? (
                      <span className="text-green-400 text-sm font-medium flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Brand Mentioned!</span>
                    ) : (
                      <span className="text-red-400 text-sm font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Not Mentioned</span>
                    )}
                    {spotResult.urlCited && (
                      <a href={spotResult.urlCited} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />{spotResult.urlCited}
                      </a>
                    )}
                  </div>
                  {spotResult.context && (
                    <p className="text-xs text-white/40 p-2 bg-white/[0.02] rounded leading-relaxed">{spotResult.context}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Check Run History ── */}
          {runs.length > 0 && (
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-white/40" />
                  <h3 className="text-sm font-semibold text-white">Check Run History</h3>
                  <span className="text-xs text-white/20">{runs.length} runs</span>
                </div>
                {showHistory ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
              </button>
              {showHistory && (
                <div className="border-t border-white/[0.06] divide-y divide-white/[0.04] max-h-64 overflow-y-auto">
                  {runs.map((run) => (
                    <div key={run.id} className="px-5 py-3 flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${run.status === "completed" ? "bg-green-400" : run.status === "running" ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white/60">
                          {run.totalQueries} queries &times; {run.totalPlatforms} platforms
                        </span>
                      </div>
                      <span className={`text-sm font-mono ${rateColor(run.mentionRate ?? 0)}`}>
                        {run.mentionRate != null ? pct(run.mentionRate) : "—"}
                      </span>
                      <span className="text-xs text-white/20">
                        {run.brandMentions} mentions
                      </span>
                      <span className="text-xs text-white/20">
                        {run.durationMs != null ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
                      </span>
                      <span className="text-xs text-white/20">
                        {new Date(run.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({
  label,
  value,
  subValue,
  trend,
  colorClass = "text-white",
}: {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down";
  colorClass?: string;
}) {
  return (
    <div className="bg-dark-elevated border border-white/[0.06] rounded-xl px-4 py-3">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`text-xl font-semibold ${colorClass}`}>{value}</span>
        {trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
        {trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
      </div>
      {subValue && <p className="text-xs text-white/30 mt-1">{subValue}</p>}
    </div>
  );
}
