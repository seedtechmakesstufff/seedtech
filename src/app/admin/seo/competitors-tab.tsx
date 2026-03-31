"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Swords,
  Plus,
  Loader2,
  Globe,
  AlertTriangle,
  ExternalLink,
  PlayCircle,
  Trash2,
  BarChart3,
  Bot,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface CompetitorOverview {
  competitorId: string;
  domain: string;
  name: string;
  pagesAnalyzed: number;
  avgAiVisScore: number;
  avgEeatScore: number;
  topTopics: string[];
  lastAnalyzed: string | null;
}

interface ContentGap {
  topic: string;
  competitorUrl: string;
  competitorScore: number;
  ourScore: number | null;
  gapType: "missing" | "weaker" | "stronger";
  opportunity: string;
}

interface CompetitorDomain {
  id: string;
  domain: string;
  name: string;
  isActive: boolean;
  lastAnalyzed: string | null;
}

interface KeywordGap {
  keyword: string;
  competitorDomain: string;
  competitorUrl: string;
  competitorHasCoverage: boolean;
  weHaveCoverage: boolean;
  gapType: "they-have-we-dont" | "we-have-they-dont" | "both-have";
  opportunity: string;
}

/* ── Grade Helpers ── */

function scoreGrade(score: number): { grade: string; color: string } {
  if (score >= 80) return { grade: "A", color: "text-green-400" };
  if (score >= 65) return { grade: "B", color: "text-blue-400" };
  if (score >= 50) return { grade: "C", color: "text-amber-400" };
  if (score >= 35) return { grade: "D", color: "text-orange-400" };
  return { grade: "F", color: "text-red-400" };
}

/* ── Component ── */

export default function CompetitorsTab() {
  const [overviews, setOverviews] = useState<CompetitorOverview[]>([]);
  const [gaps, setGaps] = useState<ContentGap[]>([]);
  const [keywordGaps, setKeywordGaps] = useState<KeywordGap[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newName, setNewName] = useState("");
  const [expandedGaps, setExpandedGaps] = useState(false);
  const [expandedKeywordGaps, setExpandedKeywordGaps] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [compRes, analysisRes] = await Promise.all([
        fetch("/api/admin/seo/competitors"),
        fetch("/api/admin/seo/competitors/analysis"),
      ]);
      const compData = await compRes.json();
      const analysisData = await analysisRes.json();
      setCompetitors(compData.competitors || []);
      setOverviews(analysisData.overviews || []);
      setGaps(analysisData.gaps || []);
      setKeywordGaps(analysisData.keywordGaps || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const addCompetitor = async () => {
    if (!newDomain || !newName) return;
    try {
      await fetch("/api/admin/seo/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain, name: newName }),
      });
      setNewDomain("");
      setNewName("");
      setShowAddForm(false);
      loadData();
    } catch { /* silent */ }
  };

  const runAnalysis = async (competitorId: string) => {
    setAnalyzing(competitorId);
    try {
      await fetch("/api/admin/seo/competitors/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorId }),
      });
      loadData();
    } catch { /* silent */ }
    finally { setAnalyzing(null); }
  };

  const removeCompetitor = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from competitors?`)) return;
    try {
      await fetch(`/api/admin/seo/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "_remove", name: "_remove" }), // handled by deactivation
      });
      loadData();
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-seed-400 animate-spin" />
      </div>
    );
  }

  const missingGaps = gaps.filter((g) => g.gapType === "missing");
  const weakerGaps = gaps.filter((g) => g.gapType === "weaker");

  return (
    <div className="space-y-6">
      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-seed-400" />
            Competitive Intelligence
          </h2>
          <p className="text-white/40 text-sm mt-0.5">
            Compare your AI Visibility against competitors and find content gaps.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-seed-500 hover:bg-seed-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      {/* Add Competitor Form */}
      {showAddForm && (
        <div className="bg-dark-elevated border border-seed-500/20 rounded-xl p-5 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="competitor.com"
              className="flex-1 bg-dark-base border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-seed-500/40 focus:outline-none"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Competitor Name"
              className="flex-1 bg-dark-base border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-seed-500/40 focus:outline-none"
            />
            <button
              onClick={addCompetitor}
              disabled={!newDomain || !newName}
              className="px-4 py-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {overviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-white">{overviews.length}</p>
            <p className="text-xs text-white/40 mt-1">Competitors Tracked</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{missingGaps.length}</p>
            <p className="text-xs text-white/40 mt-1">Content Gaps (Missing)</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-amber-400">{weakerGaps.length}</p>
            <p className="text-xs text-white/40 mt-1">Weaker Than Competitors</p>
          </div>
        </div>
      )}

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {competitors.map((comp) => {
          const overview = overviews.find((o) => o.competitorId === comp.id);
          const aiGrade = overview ? scoreGrade(overview.avgAiVisScore) : null;
          const eeatGrade = overview ? scoreGrade(overview.avgEeatScore) : null;

          return (
            <div
              key={comp.id}
              className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-sm font-semibold text-white">{comp.name}</p>
                    <p className="text-xs text-white/40">{comp.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runAnalysis(comp.id)}
                    disabled={analyzing === comp.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-seed-500/10 text-seed-400 hover:bg-seed-500/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {analyzing === comp.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <PlayCircle className="w-3 h-3" />
                    )}
                    {analyzing === comp.id ? "Analyzing..." : "Analyze"}
                  </button>
                  <button
                    onClick={() => removeCompetitor(comp.id, comp.name)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                {overview ? (
                  <div className="space-y-4">
                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-white/40" />
                          <span className={cn("text-lg font-bold", aiGrade?.color)}>
                            {overview.avgAiVisScore}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30">AI Visibility</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-white/40" />
                          <span className={cn("text-lg font-bold", eeatGrade?.color)}>
                            {overview.avgEeatScore}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30">E-E-A-T</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-lg font-bold text-white">
                            {overview.pagesAnalyzed}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30">Pages</p>
                      </div>
                    </div>

                    {/* Top topics */}
                    {overview.topTopics.length > 0 && (
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Top Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {overview.topTopics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-0.5 text-[10px] bg-white/[0.04] text-white/50 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {overview.lastAnalyzed && (
                      <p className="text-[10px] text-white/20">
                        Last analyzed: {new Date(overview.lastAnalyzed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BarChart3 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30">Not analyzed yet</p>
                    <button
                      onClick={() => runAnalysis(comp.id)}
                      disabled={analyzing === comp.id}
                      className="mt-2 text-xs text-seed-400 hover:text-seed-300"
                    >
                      Run first analysis →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {competitors.length === 0 && (
          <div className="col-span-full bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
            <Swords className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No competitors tracked yet.</p>
            <p className="text-white/25 text-xs mt-1">
              Add competitors to compare AI Visibility scores and find content gaps.
            </p>
          </div>
        )}
      </div>

      {/* Content Gaps */}
      {gaps.length > 0 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedGaps(!expandedGaps)}
            className="w-full px-5 py-4 border-b border-white/[0.06] flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <h2 className="text-sm font-semibold text-white">
                  Content Gaps
                  <span className="text-white/40 font-normal ml-2">({gaps.length})</span>
                </h2>
                <p className="text-[10px] text-white/30 mt-0.5">
                  Topics where competitors outperform you or you have no coverage
                </p>
              </div>
            </div>
            {expandedGaps ? (
              <ChevronUp className="w-4 h-4 text-white/30" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30" />
            )}
          </button>

          {expandedGaps && (
            <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
              {gaps.slice(0, 20).map((gap, i) => (
                <div
                  key={i}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      gap.gapType === "missing" ? "bg-red-400" : "bg-amber-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{gap.topic}</p>
                    <p className="text-xs text-white/30 truncate">{gap.opportunity}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    {gap.ourScore !== null ? (
                      <span className="text-white/40">
                        You: <span className={cn("font-medium", scoreGrade(gap.ourScore).color)}>{gap.ourScore}</span>
                      </span>
                    ) : (
                      <span className="text-red-400/60">No content</span>
                    )}
                    <span className="text-white/20">vs</span>
                    <span className="text-white/40">
                      Them: <span className={cn("font-medium", scoreGrade(gap.competitorScore).color)}>{gap.competitorScore}</span>
                    </span>
                  </div>
                  <a
                    href={gap.competitorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/20 hover:text-seed-400 flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyword Gaps */}
      {keywordGaps.length > 0 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedKeywordGaps(!expandedKeywordGaps)}
            className="w-full px-5 py-4 border-b border-white/[0.06] flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Swords className="w-5 h-5 text-seed-400" />
              <div className="text-left">
                <h2 className="text-sm font-semibold text-white">
                  Keyword Gaps
                  <span className="text-white/40 font-normal ml-2">({keywordGaps.length})</span>
                </h2>
                <p className="text-[10px] text-white/30 mt-0.5">
                  Keywords where competitors have content and you don&apos;t — plus your advantages
                </p>
              </div>
            </div>
            {expandedKeywordGaps ? (
              <ChevronUp className="w-4 h-4 text-white/30" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30" />
            )}
          </button>

          {expandedKeywordGaps && (
            <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
              {keywordGaps.slice(0, 30).map((gap, i) => (
                <div
                  key={i}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      gap.gapType === "they-have-we-dont"
                        ? "bg-red-400"
                        : gap.gapType === "we-have-they-dont"
                        ? "bg-green-400"
                        : "bg-blue-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{gap.keyword}</p>
                    <p className="text-xs text-white/30 truncate">{gap.opportunity}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-shrink-0">
                    {gap.gapType === "they-have-we-dont" && (
                      <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">They have it</span>
                    )}
                    {gap.gapType === "we-have-they-dont" && (
                      <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Our advantage</span>
                    )}
                    {gap.competitorDomain !== "—" && (
                      <span className="text-white/20">{gap.competitorDomain}</span>
                    )}
                  </div>
                  {gap.competitorUrl && gap.competitorUrl.startsWith("http") && (
                    <a
                      href={gap.competitorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/20 hover:text-seed-400 flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
