import {
  Globe,
  FileText,
  TrendingUp,
  Search,
  ArrowUpRight,
  Inbox,
  Bot,
} from "lucide-react";
import { AgentRunsWidget } from "@/components/admin/AgentRunsWidget";

const STATS = [
  {
    label: "Organic Sessions",
    value: "—",
    change: null,
    icon: Globe,
    note: "Connect Google Analytics",
  },
  {
    label: "Indexed Pages",
    value: "19",
    change: null,
    icon: FileText,
    note: "Current routes",
  },
  {
    label: "Avg. Position",
    value: "—",
    change: null,
    icon: TrendingUp,
    note: "Connect Search Console",
  },
  {
    label: "Blog Posts",
    value: "0",
    change: null,
    icon: FileText,
    note: "Start publishing",
  },
];

const QUICK_ACTIONS = [
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
  { label: "SEO Agents", href: "/admin/seo/agents", icon: Bot },
  { label: "Write a Blog Post", href: "/admin/blog/new", icon: FileText },
  { label: "SEO Dashboard", href: "/admin/seo", icon: Search },
  { label: "View Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Visit Site", href: "/", icon: Globe, external: true },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/40 mt-1">Welcome back. Here&apos;s an overview of your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-white/30" />
              {stat.change && (
                <span className="text-xs text-seed-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-sm text-white/40 mt-1">{stat.label}</p>
            {stat.note && (
              <p className="text-xs text-white/20 mt-2">{stat.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 bg-dark-elevated border border-white/[0.06] rounded-xl p-4 hover:border-seed-500/30 hover:bg-dark-elevated/80 transition-colors group"
            >
              <action.icon className="w-5 h-5 text-white/30 group-hover:text-seed-400 transition-colors" />
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Agent activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <AgentRunsWidget />
      </div>

      {/* SEO Health Summary */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">SEO Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-seed-400" />
              <span className="text-sm font-medium text-white/70">Technical</span>
            </div>
            <p className="text-xs text-white/40">Sitemap, robots.txt, metadata — Phase 1 tasks</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium text-white/70">Content</span>
            </div>
            <p className="text-xs text-white/40">0 blog posts published — content engine not started</p>
          </div>
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium text-white/70">Local SEO</span>
            </div>
            <p className="text-xs text-white/40">Google Business Profile — not yet claimed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
