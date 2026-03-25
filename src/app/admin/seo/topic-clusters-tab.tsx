"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Network,
  Plus,
  Loader2,
  Sparkles,
  Target,
  Link2,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  FileText,
  ArrowRight,
} from "lucide-react";

// ── Types ──

interface Subtopic {
  id: string;
  title: string;
  slug: string;
  targetKeyword: string;
  searchIntent: string;
  contentStatus: string;
  matchedPageUrl: string | null;
  priority: number;
  wordCountTarget: number;
  briefNotes: string | null;
}

interface LinkSuggestion {
  id: string;
  sourcePageUrl: string;
  targetPageUrl: string;
  anchorText: string;
  reason: string;
  status: string;
}

interface Cluster {
  id: string;
  name: string;
  pillarPage: string;
  description: string | null;
  seedKeyword: string;
  status: string;
  authorityScore: number | null;
  coveragePercent: number | null;
  avgContentScore: number | null;
  avgAiVisScore: number | null;
  linkDensity: number | null;
  lastScoredAt: string | null;
  subtopics: Subtopic[];
  linkSuggestions?: LinkSuggestion[];
  _count: {
    keywords: number;
    subtopics: number;
    linkSuggestions: number;
    contentIdeas?: number;
  };
}

interface GapResult {
  clusterId: string;
  clusterName: string;
  totalSubtopics: number;
  publishedCount: number;
  draftCount: number;
  missingCount: number;
  coveragePercent: number;
  missingTopics: { title: string; targetKeyword: string; priority: number; searchIntent: string }[];
  weakTopics: { title: string; pageUrl: string; score: number; issue: string }[];
}

interface AuthorityResult {
  clusterId: string;
  clusterName: string;
  authorityScore: number;
  coveragePercent: number;
  avgContentScore: number;
  avgAiVisScore: number;
  linkDensity: number;
  breakdown: {
    topicCoverage: number;
    contentQuality: number;
    internalLinking: number;
    aiVisibility: number;
  };
}

// ── Component ──

export default function TopicClustersTab() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [seedKeyword, setSeedKeyword] = useState("");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"subtopics" | "gaps" | "links">("subtopics");
  const [gapResults, setGapResults] = useState<Record<string, GapResult>>({});
  const [authorityResults, setAuthorityResults] = useState<Record<string, AuthorityResult>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchClusters = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/clusters");
      if (res.ok) {
        const data = await res.json();
        setClusters(data.clusters || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const handleGenerate = async () => {
    if (!seedKeyword.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/seo/clusters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedKeyword: seedKeyword.trim() }),
      });
      if (res.ok) {
        setSeedKeyword("");
        await fetchClusters();
      }
    } catch {
      /* silent */
    } finally {
      setGenerating(false);
    }
  };

  const handleAnalyzeGaps = async (clusterId: string) => {
    setActionLoading(`gaps-${clusterId}`);
    try {
      const res = await fetch(`/api/admin/seo/clusters/${clusterId}/gaps`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setGapResults((prev) => ({ ...prev, [clusterId]: data }));
        await fetchClusters();
      }
    } catch {
      /* silent */
    } finally {
      setActionLoading(null);
    }
  };

  const handleScoreAuthority = async (clusterId: string) => {
    setActionLoading(`score-${clusterId}`);
    try {
      const res = await fetch(`/api/admin/seo/clusters/${clusterId}/score`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAuthorityResults((prev) => ({ ...prev, [clusterId]: data }));
        await fetchClusters();
      }
    } catch {
      /* silent */
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnforceLinks = async (clusterId: string) => {
    setActionLoading(`links-${clusterId}`);
    try {
      const res = await fetch(`/api/admin/seo/clusters/${clusterId}/links`, { method: "POST" });
      if (res.ok) {
        await fetchClusters();
        // Also fetch detail to get link suggestions
        const detailRes = await fetch(`/api/admin/seo/clusters/${clusterId}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          setClusters((prev) =>
            prev.map((c) => (c.id === clusterId ? { ...c, linkSuggestions: detailData.cluster.linkSuggestions } : c))
          );
        }
      }
    } catch {
      /* silent */
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (clusterId: string) => {
    if (!confirm("Archive this cluster?")) return;
    try {
      await fetch(`/api/admin/seo/clusters/${clusterId}`, { method: "DELETE" });
      await fetchClusters();
    } catch {
      /* silent */
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "idea":
      case "draft":
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-zinc-500" />;
    }
  };

  const intentBadge = (intent: string) => {
    const colors: Record<string, string> = {
      informational: "bg-blue-500/20 text-blue-400",
      commercial: "bg-purple-500/20 text-purple-400",
      transactional: "bg-green-500/20 text-green-400",
      navigational: "bg-zinc-500/20 text-zinc-400",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[intent] || colors.informational}`}>
        {intent}
      </span>
    );
  };

  const scoreColor = (score: number | null) => {
    if (score === null) return "text-zinc-500";
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-seed-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generator */}
      <div className="bg-dark-elevated rounded-xl border border-dark-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-seed-500/20">
            <Sparkles className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Cluster Generator</h3>
            <p className="text-sm text-zinc-400">
              Enter a seed keyword to generate a full topic cluster with pillar + spoke pages
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. managed IT services, web development, cybersecurity..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-dark-base border border-dark-border text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-seed-500/50"
          />
          <button
            onClick={handleGenerate}
            disabled={!seedKeyword.trim() || generating}
            className="px-5 py-2.5 rounded-lg bg-seed-500 text-white font-medium hover:bg-seed-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate Cluster
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cluster List */}
      {clusters.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Network className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No topic clusters yet</p>
          <p className="text-sm mt-1">Generate your first cluster with a seed keyword above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clusters.filter((c) => c.status !== "archived").map((cluster) => {
            const isExpanded = expandedCluster === cluster.id;
            const gaps = gapResults[cluster.id];
            const authority = authorityResults[cluster.id];
            const published = cluster.subtopics.filter((s) => s.contentStatus === "published").length;
            const missing = cluster.subtopics.filter((s) => s.contentStatus === "missing").length;
            const total = cluster.subtopics.length;

            return (
              <div
                key={cluster.id}
                className="bg-dark-elevated rounded-xl border border-dark-border overflow-hidden"
              >
                {/* Cluster Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-dark-raised/50 transition-colors"
                  onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-seed-500/10 mt-0.5">
                        <Network className="w-5 h-5 text-seed-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold truncate">{cluster.name}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              cluster.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-zinc-500/20 text-zinc-400"
                            }`}
                          >
                            {cluster.status}
                          </span>
                        </div>
                        {cluster.description && (
                          <p className="text-sm text-zinc-400 mb-2 line-clamp-1">
                            {cluster.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span>Pillar: {cluster.pillarPage}</span>
                          <span>
                            {published}/{total} published
                          </span>
                          {missing > 0 && (
                            <span className="text-yellow-400">{missing} gaps</span>
                          )}
                          {cluster._count.keywords > 0 && (
                            <span>{cluster._count.keywords} keywords tracked</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score Badges */}
                    <div className="flex items-center gap-4 ml-4">
                      {cluster.authorityScore !== null && (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${scoreColor(cluster.authorityScore)}`}>
                            {cluster.authorityScore}
                          </div>
                          <div className="text-xs text-zinc-500">Authority</div>
                        </div>
                      )}
                      {cluster.coveragePercent !== null && (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${scoreColor(cluster.coveragePercent)}`}>
                            {cluster.coveragePercent}%
                          </div>
                          <div className="text-xs text-zinc-500">Coverage</div>
                        </div>
                      )}
                      {cluster.avgAiVisScore !== null && (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${scoreColor(cluster.avgAiVisScore)}`}>
                            {Math.round(cluster.avgAiVisScore)}
                          </div>
                          <div className="text-xs text-zinc-500">AI Vis</div>
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Coverage bar */}
                  {total > 0 && (
                    <div className="mt-3 ml-12">
                      <div className="w-full bg-dark-base rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-seed-500 rounded-full transition-all"
                          style={{ width: `${(published / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-dark-border">
                    {/* Action Bar */}
                    <div className="px-5 py-3 flex items-center gap-2 border-b border-dark-border bg-dark-base/50">
                      <div className="flex gap-1">
                        {(["subtopics", "gaps", "links"] as const).map((view) => (
                          <button
                            key={view}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveView(view);
                            }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              activeView === view
                                ? "bg-seed-500/20 text-seed-400"
                                : "text-zinc-400 hover:text-white hover:bg-dark-raised"
                            }`}
                          >
                            {view === "subtopics" && <Target className="w-3.5 h-3.5 inline mr-1.5" />}
                            {view === "gaps" && <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />}
                            {view === "links" && <Link2 className="w-3.5 h-3.5 inline mr-1.5" />}
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div className="flex-1" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyzeGaps(cluster.id);
                        }}
                        disabled={actionLoading === `gaps-${cluster.id}`}
                        className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-dark-raised flex items-center gap-1.5"
                      >
                        {actionLoading === `gaps-${cluster.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Analyze Gaps
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScoreAuthority(cluster.id);
                        }}
                        disabled={actionLoading === `score-${cluster.id}`}
                        className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-dark-raised flex items-center gap-1.5"
                      >
                        {actionLoading === `score-${cluster.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <BarChart3 className="w-3.5 h-3.5" />
                        )}
                        Score
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnforceLinks(cluster.id);
                        }}
                        disabled={actionLoading === `links-${cluster.id}`}
                        className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-dark-raised flex items-center gap-1.5"
                      >
                        {actionLoading === `links-${cluster.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Link2 className="w-3.5 h-3.5" />
                        )}
                        Check Links
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(cluster.id);
                        }}
                        className="px-3 py-1.5 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtopics View */}
                    {activeView === "subtopics" && (
                      <div className="divide-y divide-dark-border">
                        {cluster.subtopics.map((subtopic) => (
                          <div key={subtopic.id} className="px-5 py-3 flex items-center gap-3">
                            {statusIcon(subtopic.contentStatus)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-medium truncate">
                                  {subtopic.title}
                                </span>
                                {intentBadge(subtopic.searchIntent)}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                                <span>🎯 {subtopic.targetKeyword}</span>
                                <span>{subtopic.wordCountTarget} words</span>
                                {subtopic.matchedPageUrl && (
                                  <span className="text-green-400">→ {subtopic.matchedPageUrl}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-zinc-500">P{subtopic.priority}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Gaps View */}
                    {activeView === "gaps" && (
                      <div className="p-5">
                        {gaps ? (
                          <div className="space-y-4">
                            {/* Gap Summary */}
                            <div className="grid grid-cols-4 gap-3">
                              <div className="bg-dark-base rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-white">{gaps.totalSubtopics}</div>
                                <div className="text-xs text-zinc-500">Total Topics</div>
                              </div>
                              <div className="bg-dark-base rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-green-400">{gaps.publishedCount}</div>
                                <div className="text-xs text-zinc-500">Published</div>
                              </div>
                              <div className="bg-dark-base rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-yellow-400">{gaps.draftCount}</div>
                                <div className="text-xs text-zinc-500">In Pipeline</div>
                              </div>
                              <div className="bg-dark-base rounded-lg p-3 text-center">
                                <div className="text-lg font-bold text-red-400">{gaps.missingCount}</div>
                                <div className="text-xs text-zinc-500">Missing</div>
                              </div>
                            </div>

                            {/* Missing Topics */}
                            {gaps.missingTopics.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">
                                  📝 Content to Create ({gaps.missingTopics.length})
                                </h4>
                                <div className="space-y-2">
                                  {gaps.missingTopics.map((topic, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-3 bg-dark-base rounded-lg px-4 py-2.5"
                                    >
                                      <div className="flex-1">
                                        <div className="text-sm text-white">{topic.title}</div>
                                        <div className="text-xs text-zinc-500">
                                          {topic.targetKeyword} · {topic.searchIntent}
                                        </div>
                                      </div>
                                      <span className="text-xs text-zinc-400">P{topic.priority}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Weak Topics */}
                            {gaps.weakTopics.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">
                                  ⚠️ Content to Improve ({gaps.weakTopics.length})
                                </h4>
                                <div className="space-y-2">
                                  {gaps.weakTopics.map((topic, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-3 bg-dark-base rounded-lg px-4 py-2.5"
                                    >
                                      <div className="flex-1">
                                        <div className="text-sm text-white">{topic.title}</div>
                                        <div className="text-xs text-zinc-500">
                                          {topic.pageUrl} · {topic.issue}
                                        </div>
                                      </div>
                                      <span className={`text-sm font-bold ${scoreColor(topic.score)}`}>
                                        {topic.score}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {gaps.missingTopics.length === 0 && gaps.weakTopics.length === 0 && (
                              <div className="text-center py-6 text-zinc-500 text-sm">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                Full coverage — no content gaps detected
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-zinc-500 text-sm">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            Click &ldquo;Analyze Gaps&rdquo; to scan this cluster for content gaps
                          </div>
                        )}
                      </div>
                    )}

                    {/* Links View */}
                    {activeView === "links" && (
                      <div className="p-5">
                        {cluster.linkSuggestions && cluster.linkSuggestions.length > 0 ? (
                          <div className="space-y-2">
                            {cluster.linkSuggestions.map((link) => (
                              <div
                                key={link.id}
                                className="flex items-center gap-3 bg-dark-base rounded-lg px-4 py-3"
                              >
                                <Link2 className="w-4 h-4 text-seed-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-zinc-300 truncate">{link.sourcePageUrl}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                    <span className="text-seed-400 truncate">{link.targetPageUrl}</span>
                                  </div>
                                  <div className="text-xs text-zinc-500 mt-0.5">
                                    Anchor: &quot;{link.anchorText}&quot; · {link.reason}
                                  </div>
                                </div>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    link.status === "accepted"
                                      ? "bg-green-500/20 text-green-400"
                                      : link.status === "dismissed"
                                        ? "bg-zinc-500/20 text-zinc-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {link.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-zinc-500 text-sm">
                            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            Click &ldquo;Check Links&rdquo; to analyze internal linking within this cluster
                          </div>
                        )}
                      </div>
                    )}

                    {/* Authority Breakdown */}
                    {authority && (
                      <div className="px-5 py-4 bg-dark-base/30 border-t border-dark-border">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-seed-400" />
                          Authority Breakdown
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: "Topic Coverage", value: authority.breakdown.topicCoverage, weight: "30%" },
                            { label: "Content Quality", value: authority.breakdown.contentQuality, weight: "25%" },
                            { label: "Internal Links", value: authority.breakdown.internalLinking, weight: "20%" },
                            { label: "AI Visibility", value: authority.breakdown.aiVisibility, weight: "25%" },
                          ].map((dim) => (
                            <div key={dim.label} className="bg-dark-base rounded-lg p-3">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-xs text-zinc-500">{dim.label}</span>
                                <span className="text-xs text-zinc-600">{dim.weight}</span>
                              </div>
                              <div className={`text-lg font-bold ${scoreColor(dim.value)}`}>
                                {Math.round(dim.value)}
                              </div>
                              <div className="w-full bg-dark-border rounded-full h-1.5 mt-1">
                                <div
                                  className="h-full bg-seed-500 rounded-full"
                                  style={{ width: `${dim.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
