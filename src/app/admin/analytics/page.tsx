import {
  BarChart3,
  Globe,
  MousePointerClick,
  TrendingUp,
  Clock,
  Monitor,
  Smartphone,
  Users,
  Eye,
  ArrowUpRight,
} from "lucide-react";

/* ── Placeholder data — replace with real GA4 / Search Console data ── */

const TRAFFIC_STATS = [
  { label: "Sessions (30d)", value: "—", icon: Globe, note: "Awaiting GA4 connection" },
  { label: "Pageviews (30d)", value: "—", icon: Eye, note: "Awaiting GA4 connection" },
  { label: "Avg. Session Duration", value: "—", icon: Clock, note: "Awaiting GA4 connection" },
  { label: "Bounce Rate", value: "—", icon: ArrowUpRight, note: "Awaiting GA4 connection" },
];

const TOP_PAGES = [
  { path: "/", pageviews: "—", title: "Homepage" },
  { path: "/services/managed-it", pageviews: "—", title: "Managed IT Services" },
  { path: "/pricing/it-support", pageviews: "—", title: "IT Support Pricing" },
  { path: "/services/web-development", pageviews: "—", title: "Web Development" },
  { path: "/our-work", pageviews: "—", title: "Our Work" },
];

const TRAFFIC_SOURCES = [
  { source: "Organic Search", sessions: "—", pct: "—" },
  { source: "Direct", sessions: "—", pct: "—" },
  { source: "Social", sessions: "—", pct: "—" },
  { source: "Referral", sessions: "—", pct: "—" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-white/40 mt-1">Traffic, engagement, and conversion insights.</p>
      </div>

      {/* Connection Banner */}
      <div className="bg-seed-500/5 border border-seed-500/20 rounded-xl p-5 flex items-start gap-4">
        <BarChart3 className="w-6 h-6 text-seed-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">Connect Google Analytics 4</p>
          <p className="text-xs text-white/40 mt-1">
            To populate this dashboard with real data, integrate your GA4 property.
            Add your GA4 Measurement ID to the environment variables and configure the
            Google Analytics Data API.
          </p>
        </div>
      </div>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TRAFFIC_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5"
          >
            <stat.icon className="w-5 h-5 text-white/30 mb-3" />
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-sm text-white/40 mt-1">{stat.label}</p>
            <p className="text-xs text-white/20 mt-2">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Top Pages</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TOP_PAGES.map((page) => (
              <div key={page.path} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-white/70">{page.title}</p>
                  <p className="text-xs text-white/30 font-mono">{page.path}</p>
                </div>
                <span className="text-sm text-white/40 font-mono">{page.pageviews}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Traffic Sources</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TRAFFIC_SOURCES.map((src) => (
              <div key={src.source} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-white/70">{src.source}</span>
                <div className="text-right">
                  <span className="text-sm text-white/40 font-mono">{src.sessions}</span>
                  <span className="text-xs text-white/20 ml-2">({src.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Device Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <Monitor className="w-6 h-6 text-white/30 mx-auto mb-2" />
            <p className="text-xl font-semibold text-white">—</p>
            <p className="text-sm text-white/40">Desktop</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <Smartphone className="w-6 h-6 text-white/30 mx-auto mb-2" />
            <p className="text-xl font-semibold text-white">—</p>
            <p className="text-sm text-white/40">Mobile</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 text-center">
            <Monitor className="w-6 h-6 text-white/30 mx-auto mb-2" />
            <p className="text-xl font-semibold text-white">—</p>
            <p className="text-sm text-white/40">Tablet</p>
          </div>
        </div>
      </div>

      {/* Conversion Tracking */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Conversion Events</h2>
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { event: "Quote Flow Opened", count: "—" },
              { event: "Quote Submitted", count: "—" },
              { event: "Contact Form", count: "—" },
              { event: "Phone Clicks", count: "—" },
            ].map((e) => (
              <div key={e.event} className="text-center">
                <p className="text-xl font-semibold text-white">{e.count}</p>
                <p className="text-xs text-white/40 mt-1">{e.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
