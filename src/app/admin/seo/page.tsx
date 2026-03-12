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
} from "lucide-react";
import { TRACKED_KEYWORDS, SEO_TASKS, CONTENT_CALENDAR } from "@/data/seo-strategy";
import Link from "next/link";

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

export default function SEODashboardPage() {
  const tier1 = TRACKED_KEYWORDS.filter((k) => k.tier === 1);
  const tier2 = TRACKED_KEYWORDS.filter((k) => k.tier === 2);
  const tier3 = TRACKED_KEYWORDS.filter((k) => k.tier === 3);

  const tasksComplete = SEO_TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = SEO_TASKS.filter((t) => t.status === "in-progress").length;
  const tasksTotal = SEO_TASKS.length;

  const contentPublished = CONTENT_CALENDAR.filter((c) => c.status === "published").length;
  const contentTotal = CONTENT_CALENDAR.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">SEO Dashboard</h1>
          <p className="text-white/40 mt-1">Keyword tracking, strategy progress, and content engine.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          AI Blog Writer
        </Link>
      </div>

      {/* Strategy Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <Target className="w-5 h-5 text-seed-400 mb-3" />
          <p className="text-2xl font-semibold text-white">{TRACKED_KEYWORDS.length}</p>
          <p className="text-sm text-white/40 mt-1">Tracked Keywords</p>
          <p className="text-xs text-white/20 mt-2">{tier1.length} Tier 1 · {tier2.length} Tier 2 · {tier3.length} Tier 3</p>
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
          <p className="text-2xl font-semibold text-white">—</p>
          <p className="text-sm text-white/40 mt-1">Avg. Keyword Position</p>
          <p className="text-xs text-white/20 mt-2">Connect Search Console</p>
        </div>
      </div>

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
              {TRACKED_KEYWORDS.map((kw) => (
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
                    {kw.currentPosition ? (
                      <span className="text-seed-400 font-mono font-semibold">{kw.currentPosition}</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === "published"
                      ? "bg-seed-500/20 text-seed-400"
                      : item.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : item.status === "scheduled"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 text-white/30"
                  }`}>
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

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-br from-seed-500/5 to-blue-500/5 border border-seed-500/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-seed-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">AI Strategy Recommendations</h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-start gap-2">
                <span className="text-seed-400 mt-0.5">→</span>
                <span><strong className="text-white/70">Priority:</strong> Build out the /services/managed-it pillar page. This is the #1 highest-impact SEO action for your NJ market keywords.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-seed-400 mt-0.5">→</span>
                <span><strong className="text-white/70">Quick win:</strong> Start with blog post #1 (&quot;How Much Does Managed IT Cost in 2026?&quot;) — high-volume keyword with low competition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-seed-400 mt-0.5">→</span>
                <span><strong className="text-white/70">Technical:</strong> Add sitemap.ts and robots.ts immediately to help Google discover and index all 19 existing pages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-seed-400 mt-0.5">→</span>
                <span><strong className="text-white/70">Local SEO:</strong> Claim your Google Business Profile to start appearing in map packs for &quot;IT support NJ&quot; queries.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
