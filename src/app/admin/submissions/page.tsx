"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Inbox,
  Mail,
  Phone,
  Building2,
  Globe,
  Monitor,
  MessageSquare,
  CheckCircle2,
  Clock,
  Archive,
  Eye,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────

interface Submission {
  id: string;
  source: "contact_page" | "quote_it" | "quote_web";
  status: "new" | "read" | "replied" | "archived";
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string | null;
  tier: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  contact_page: { label: "Contact Form", icon: MessageSquare, color: "text-blue-400 bg-blue-500/10" },
  quote_it: { label: "IT Quote", icon: Monitor, color: "text-purple-400 bg-purple-500/10" },
  quote_web: { label: "Web Quote", icon: Globe, color: "text-seed-400 bg-seed-500/10" },
};

const STATUS_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  new: { label: "New", icon: Inbox, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  read: { label: "Read", icon: Eye, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  replied: { label: "Replied", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  archived: { label: "Archived", icon: Archive, color: "text-white/30 bg-white/5 border-white/10" },
};

// ── Component ──────────────────────────────────────────

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterSource !== "all") params.set("source", filterSource);
    if (filterStatus !== "all") params.set("status", filterStatus);

    try {
      const res = await fetch(`/api/admin/submissions?${params}`);
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setSubmissions([]);
    }
    setLoading(false);
  }, [filterSource, filterStatus]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus as Submission["status"] } : s))
    );
  };

  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Submissions</h1>
          <p className="text-sm text-white/50 mt-1">
            {submissions.length} total{newCount > 0 && ` · ${newCount} new`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Source filter */}
        <div className="relative">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm bg-dark-overlay border border-white/[0.06] text-white/70 focus:border-seed-600/50 outline-none"
          >
            <option value="all">All Sources</option>
            <option value="contact_page">Contact Form</option>
            <option value="quote_it">IT Quote</option>
            <option value="quote_web">Web Quote</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm bg-dark-overlay border border-white/[0.06] text-white/70 focus:border-seed-600/50 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20">
          <Inbox className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => {
            const src = SOURCE_LABELS[sub.source] ?? SOURCE_LABELS.contact_page;
            const stat = STATUS_LABELS[sub.status] ?? STATUS_LABELS.new;
            const SrcIcon = src.icon;
            const StatIcon = stat.icon;
            const isExpanded = expanded === sub.id;

            return (
              <div
                key={sub.id}
                className={cn(
                  "rounded-xl border transition-all",
                  sub.status === "new"
                    ? "border-amber-500/20 bg-dark-raised"
                    : "border-white/[0.06] bg-dark-overlay"
                )}
              >
                {/* Row header */}
                <button
                  onClick={() => {
                    setExpanded(isExpanded ? null : sub.id);
                    if (sub.status === "new") updateStatus(sub.id, "read");
                  }}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  {/* Source badge */}
                  <div className={cn("shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", src.color)}>
                    <SrcIcon className="w-4.5 h-4.5" />
                  </div>

                  {/* Name & email */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{sub.fullName}</span>
                      {sub.status === "new" && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{sub.email}</p>
                  </div>

                  {/* Tier / Service */}
                  {(sub.tier || sub.service) && (
                    <span className="hidden sm:block text-xs text-white/30 px-2 py-1 rounded-md bg-white/[0.04]">
                      {sub.tier || sub.service}
                    </span>
                  )}

                  {/* Status */}
                  <span className={cn("shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border", stat.color)}>
                    <StatIcon className="w-3 h-3" />
                    {stat.label}
                  </span>

                  {/* Date */}
                  <span className="hidden md:block shrink-0 text-xs text-white/25">
                    {format(new Date(sub.createdAt), "MMM d, h:mm a")}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-white/20 shrink-0 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/[0.04] pt-4">
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-white/50">
                        <Mail className="w-4 h-4 text-white/30" />
                        <a href={`mailto:${sub.email}`} className="text-seed-400 hover:underline">
                          {sub.email}
                        </a>
                      </div>
                      {sub.phone && (
                        <div className="flex items-center gap-2 text-white/50">
                          <Phone className="w-4 h-4 text-white/30" />
                          <a href={`tel:${sub.phone}`} className="hover:text-white/70">
                            {sub.phone}
                          </a>
                        </div>
                      )}
                      {sub.company && (
                        <div className="flex items-center gap-2 text-white/50">
                          <Building2 className="w-4 h-4 text-white/30" />
                          {sub.company}
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {sub.message && (
                      <div className="rounded-lg bg-dark-base/50 p-4">
                        <p className="text-sm text-white/60 whitespace-pre-wrap">{sub.message}</p>
                      </div>
                    )}

                    {/* Quote metadata */}
                    {sub.metadata && Object.keys(sub.metadata).length > 0 && (
                      <div className="rounded-lg bg-dark-base/50 p-4">
                        <h4 className="text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Quote Details</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                          {Object.entries(sub.metadata).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-white/30 text-xs">{key}: </span>
                              <span className="text-white/60">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date + status actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/25">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(sub.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                      <div className="flex gap-2">
                        {sub.status !== "replied" && (
                          <button
                            onClick={() => updateStatus(sub.id, "replied")}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            Mark Replied
                          </button>
                        )}
                        {sub.status !== "archived" && (
                          <button
                            onClick={() => updateStatus(sub.id, "archived")}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>
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
