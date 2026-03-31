"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Send,
  Loader2,
  Calendar,
  FileText,
  Search,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Settings,
  Bell,
  BellOff,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

type Period = "weekly" | "monthly" | "quarterly" | "yearly";

interface ReportData {
  period: string;
  periodType: Period;
  dateRange: { start: string; end: string };
  currentHealth: number;
  previousHealth: number;
  healthDelta: number;
  totalClicks: number;
  totalImpressions: number;
  clicksDelta: number;
  impressionsDelta: number;
  avgPosition: number;
  avgCtr: number;
  positionDelta: number;
  ctrDelta: number;
  keywordMovers: { keyword: string; change: number; current: number }[];
  topPages: { page: string; clicks: number; impressions: number }[];
  criticalIssues: number;
  warningIssues: number;
  activeInsights: number;
  topInsights: { title: string; type: string; priority: number }[];
  publishedPosts: number;
  totalKeywordsTracked: number;
}

interface ReportPref {
  id: string;
  frequency: Period;
  email: string;
  dayOfWeek: number;
  dayOfMonth: number;
  enabled: boolean;
  lastSentAt: string | null;
}

/* ── Helpers ── */

const PERIODS: { value: Period; label: string; icon: typeof Calendar }[] = [
  { value: "weekly", label: "Weekly", icon: Calendar },
  { value: "monthly", label: "Monthly", icon: Calendar },
  { value: "quarterly", label: "Quarterly", icon: Calendar },
  { value: "yearly", label: "Yearly", icon: Calendar },
];

function healthColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function healthBg(score: number) {
  if (score >= 70) return "bg-green-500/10 border-green-500/20";
  if (score >= 50) return "bg-yellow-500/10 border-yellow-500/20";
  return "bg-red-500/10 border-red-500/20";
}

function fmtDelta(v: number, invert = false) {
  const positive = invert ? v <= 0 : v >= 0;
  return {
    text: `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
    color: positive ? "text-green-400" : "text-red-400",
    Icon: positive ? TrendingUp : TrendingDown,
  };
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

/* ── Page ── */

export default function SEOReportsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Email sending
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Preferences
  const [showPrefs, setShowPrefs] = useState(false);
  const [pref, setPref] = useState<ReportPref | null>(null);
  const [prefFreq, setPrefFreq] = useState<Period>("monthly");
  const [prefEmail, setPrefEmail] = useState("");
  const [prefEnabled, setPrefEnabled] = useState(true);
  const [prefSaving, setPrefSaving] = useState(false);

  const fetchReport = useCallback(async (p: Period) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/seo/reports?period=${p}`);
      if (!res.ok) throw new Error("Failed to load report");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(period);
  }, [period, fetchReport]);

  // Load preferences
  useEffect(() => {
    fetch("/api/admin/seo/reports/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (d.preferences?.length > 0) {
          const p = d.preferences[0];
          setPref(p);
          setPrefFreq(p.frequency);
          setPrefEmail(p.email);
          setPrefEnabled(p.enabled);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSendReport() {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/seo/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      const json = await res.json();
      setSendResult({ ok: json.success, msg: json.message || json.error || "Unknown" });
    } catch {
      setSendResult({ ok: false, msg: "Failed to send" });
    } finally {
      setSending(false);
    }
  }

  async function handleSavePrefs() {
    setPrefSaving(true);
    try {
      const res = await fetch("/api/admin/seo/reports/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frequency: prefFreq,
          email: prefEmail,
          enabled: prefEnabled,
        }),
      });
      const json = await res.json();
      if (json.preference) setPref(json.preference);
    } catch {
      /* silent */
    } finally {
      setPrefSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-seed-400" />
            SEO Reports
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Performance snapshots across weekly, monthly, quarterly, and yearly periods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Switcher */}
          <div className="flex bg-dark-elevated border border-white/[0.06] rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  period === p.value
                    ? "bg-seed-500/20 text-seed-400"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Send Report */}
          <button
            onClick={handleSendReport}
            disabled={sending || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-seed-500/10 text-seed-400 hover:bg-seed-500/20 border border-seed-500/20 rounded-lg transition-colors disabled:opacity-40"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Send Report
          </button>

          {/* Preferences Toggle */}
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors",
              showPrefs
                ? "bg-white/[0.06] border-white/10 text-white/70"
                : "bg-dark-elevated border-white/[0.06] text-white/40 hover:text-white/60"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
            <ChevronDown className={cn("w-3 h-3 transition-transform", showPrefs && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Send Result Toast */}
      {sendResult && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl text-sm border",
            sendResult.ok
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
        >
          {sendResult.ok ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {sendResult.msg}
          <button onClick={() => setSendResult(null)} className="ml-auto text-white/30 hover:text-white/60">×</button>
        </div>
      )}

      {/* Preferences Panel */}
      {showPrefs && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {prefEnabled ? <Bell className="w-4 h-4 text-seed-400" /> : <BellOff className="w-4 h-4 text-white/30" />}
              Email Report Preferences
            </h3>
            <button
              onClick={() => {
                setPrefEnabled(!prefEnabled);
              }}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors",
                prefEnabled ? "bg-seed-500" : "bg-white/10"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                  prefEnabled ? "left-5" : "left-0.5"
                )}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Frequency</label>
              <select
                value={prefFreq}
                onChange={(e) => setPrefFreq(e.target.value as Period)}
                className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly (default)</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Deliver To</label>
              <input
                type="email"
                value={prefEmail}
                onChange={(e) => setPrefEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-seed-500/50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSavePrefs}
                disabled={prefSaving}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-seed-500 hover:bg-seed-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {prefSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Preferences
              </button>
            </div>
          </div>

          {pref?.lastSentAt && (
            <p className="text-xs text-white/30">
              Last sent: {new Date(pref.lastSentAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => fetchReport(period)} className="mt-3 text-xs text-white/40 hover:text-white underline">
            Retry
          </button>
        </div>
      )}

      {/* Report Content */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Period Label */}
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Calendar className="w-4 h-4" />
            {data.period}
          </div>

          {/* Health Score */}
          <div className={cn("border rounded-xl p-6 text-center", healthBg(data.currentHealth))}>
            <p className="text-sm text-white/50 mb-2">Site Health Score</p>
            <p className={cn("text-6xl font-bold", healthColor(data.currentHealth))}>
              {data.currentHealth}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {data.healthDelta >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-400" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-400" />
              )}
              <span className={data.healthDelta >= 0 ? "text-green-400" : "text-red-400"}>
                {Math.abs(data.healthDelta).toFixed(1)} pts
              </span>
              <span className="text-white/30 text-sm ml-1">vs previous {data.periodType === "weekly" ? "week" : data.periodType === "monthly" ? "month" : data.periodType === "quarterly" ? "quarter" : "year"}</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Clicks",
                value: fmtNum(data.totalClicks),
                delta: fmtDelta(data.clicksDelta),
                icon: TrendingUp,
              },
              {
                label: "Impressions",
                value: fmtNum(data.totalImpressions),
                delta: fmtDelta(data.impressionsDelta),
                icon: Search,
              },
              {
                label: "Avg Position",
                value: data.avgPosition.toFixed(1),
                delta: fmtDelta(data.positionDelta, true),
                icon: BarChart3,
              },
              {
                label: "CTR",
                value: (data.avgCtr * 100).toFixed(2) + "%",
                delta: fmtDelta(data.ctrDelta),
                icon: TrendingUp,
              },
            ].map((m) => (
              <div key={m.label} className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">{m.label}</span>
                  <m.icon className="w-4 h-4 text-white/20" />
                </div>
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <m.delta.Icon className={cn("w-3 h-3", m.delta.color)} />
                  <span className={cn("text-xs", m.delta.color)}>{m.delta.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Posts Published", value: data.publishedPosts, icon: FileText },
              { label: "Keywords Tracked", value: data.totalKeywordsTracked, icon: Search },
              { label: "Active Insights", value: data.activeInsights, icon: Lightbulb },
            ].map((s) => (
              <div key={s.label} className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
                <s.icon className="w-5 h-5 text-white/20 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Two-column: Top Pages + Keyword Movers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-seed-400" />
                Top Pages
              </h3>
              {data.topPages.length > 0 ? (
                <div className="space-y-2">
                  {data.topPages.slice(0, 8).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-white/60 truncate max-w-[200px] font-mono">
                        {p.page.replace(/^https?:\/\/[^/]+/, "")}
                      </span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-white/80 font-medium">{p.clicks.toLocaleString()} clicks</span>
                        <span className="text-white/30">{p.impressions.toLocaleString()} impr</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30 text-center py-8">No GSC page data for this period.</p>
              )}
            </div>

            {/* Keyword Movers */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-seed-400" />
                Keyword Movers
              </h3>
              {data.keywordMovers.length > 0 ? (
                <div className="space-y-2">
                  {data.keywordMovers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-white/60 truncate max-w-[180px]">{m.keyword}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/50 font-mono">#{m.current.toFixed(1)}</span>
                        <span className={cn("font-medium flex items-center gap-0.5", m.change > 0 ? "text-green-400" : "text-red-400")}>
                          {m.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {Math.abs(m.change).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30 text-center py-8">No keyword movement data yet.</p>
              )}
            </div>
          </div>

          {/* Issues + Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Audit Issues
              </h3>
              <div className="flex items-center gap-6">
                {data.criticalIssues > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-white/70">{data.criticalIssues} Critical</span>
                  </div>
                )}
                {data.warningIssues > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-white/70">{data.warningIssues} Warnings</span>
                  </div>
                )}
                {data.criticalIssues === 0 && data.warningIssues === 0 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">No issues detected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Insights */}
            <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-seed-400" />
                Top Insights
              </h3>
              {data.topInsights.length > 0 ? (
                <div className="space-y-2">
                  {data.topInsights.map((ins, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-3 py-2 rounded-lg border-l-2 text-xs",
                        ins.priority >= 60
                          ? "border-red-500 bg-red-500/5"
                          : ins.priority >= 40
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-green-500 bg-green-500/5"
                      )}
                    >
                      <p className="text-white/70">{ins.title}</p>
                      <p className="text-white/30 mt-0.5">{ins.type.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30 text-center py-4">No insights available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
