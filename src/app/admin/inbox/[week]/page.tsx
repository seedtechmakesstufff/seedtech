"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Bot,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Check,
  Star,
  MapPin,
  FileText,
  BookOpen,
  Search,
  Link2,
  Sparkles,
  Upload,
  ImageIcon,
  TrendingUp,
} from "lucide-react";

interface Artifact {
  id: string;
  siteId: string;
  agent: string;
  type: string;
  state: string;
  title: string;
  summary: string | null;
  payload: Record<string, unknown>;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  publishError: string | null;
}

const STATE_TABS = [
  { key: "pending_review", label: "Pending" },
  { key: "approved,published", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "failed", label: "Failed" },
];

interface GroupDef {
  type: string;
  label: string;
  description: string;
  icon: typeof Bot;
  accent: string;     // tailwind text color
  bg: string;         // tailwind bg color
}

const GROUPS: GroupDef[] = [
  { type: "review_reply_draft", label: "Reviews to reply to", description: "Drafted replies for new Google reviews. Edit text inline before approving.", icon: Star, accent: "text-yellow-300", bg: "bg-yellow-400/10" },
  { type: "gbp_post_draft", label: "GBP posts to publish", description: "Google Business Profile posts. Approve to publish to your locations.", icon: MapPin, accent: "text-blue-300", bg: "bg-blue-400/10" },
  { type: "content_brief", label: "Content briefs", description: "Structured plans for posts to write. Approve to queue the Blog Drafter.", icon: FileText, accent: "text-purple-300", bg: "bg-purple-400/10" },
  { type: "blog_draft", label: "Blog drafts ready to publish", description: "Full posts written by the Blog Drafter. Approve to publish.", icon: BookOpen, accent: "text-green-300", bg: "bg-green-400/10" },
  { type: "keyword_candidate", label: "New keywords to track", description: "GSC queries that are ranking but not in TrackedKeywords yet.", icon: Search, accent: "text-cyan-300", bg: "bg-cyan-400/10" },
  { type: "link_suggestions", label: "Internal link suggestions", description: "Anchors the Internal Link Agent wants to add to existing posts.", icon: Link2, accent: "text-orange-300", bg: "bg-orange-400/10" },
  { type: "page_draft", label: "Page copy drafts", description: "Optimised title, meta, H1 and body copy for service/location pages. Approve to apply metadata.", icon: FileText, accent: "text-teal-300", bg: "bg-teal-400/10" },
];

const AGENT_LABELS: Record<string, string> = {
  "gbp-post-drafter": "GBP Post Drafter",
  "gbp-review-reply": "Review Reply Agent",
  "blog-drafter": "Blog Drafter",
  "brief-generator": "Brief Generator",
  "keyword-scout": "Keyword Scout",
  "internal-link-agent": "Internal Link Agent",
  "content-decay-watcher": "Content Decay Watcher",
  "page-drafter": "Page Drafter",
  "page-opportunity-scout": "Page Opportunity Scout",
  "strategy-analyst": "Strategy Analyst",
  "weekly-digest": "Weekly Digest",
  "industry-researcher": "Industry Researcher",
};

const TYPE_LABELS: Record<string, string> = {
  "gbp_post_draft": "GBP Post",
  "review_reply_draft": "Review Reply",
  "blog_draft": "Blog Draft",
  "content_brief": "Content Brief",
  "keyword_candidate": "Keyword",
  "link_suggestions": "Link Suggestion",
  "page_draft": "Page Draft",
};

export default function InboxWeekPage() {
  const params = useParams<{ week: string }>();
  const week = decodeURIComponent(params.week);
  const router = useRouter();

  const [tab, setTab] = useState<string>("pending_review");
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [analystBrief, setAnalystBrief] = useState<{ title: string; content: string; updatedAt: string } | null>(null);
  const [weekLabel, setWeekLabel] = useState<string>(week);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [narrativeOpen, setNarrativeOpen] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(
        `/api/inbox/by-week?week=${encodeURIComponent(week)}&state=${encodeURIComponent(tab)}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      setArtifacts(j.artifacts ?? []);
      setAnalystBrief(j.analystBrief ?? null);
      // pull a human label from the server's range so it stays in sync
      if (j.weekStart && j.weekEnd) {
        const start = new Date(j.weekStart);
        const end = new Date(j.weekEnd);
        end.setUTCDate(end.getUTCDate() - 1);
        setWeekLabel(
          `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`
        );
      }
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  }, [week, tab]);

  useEffect(() => { void load(); }, [load]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectableIds = (artifacts ?? [])
    .filter((a) => a.state === "pending_review")
    .map((a) => a.id);

  const toggleAll = () => {
    if (selected.size === selectableIds.length && selectableIds.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(selectableIds));
    }
  };

  const act = async (id: string, action: "approve" | "reject", edits?: Record<string, unknown>) => {
    setPending(id);
    try {
      await fetch(`/api/inbox/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edits ? { edits } : {}),
      });
      await load();
    } finally {
      setPending(null);
    }
  };

  const draftBriefNow = async (briefId: string, fast: boolean) => {
    setPending(briefId);
    try {
      await fetch(`/api/admin/agents/blog-drafter/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId, fast }),
      });
      await load();
    } finally {
      setPending(null);
    }
  };

  const bulk = async (action: "approve" | "reject") => {
    if (selected.size === 0) return;
    const label = action === "approve" ? `Approve ${selected.size} selected items?` : `Reject ${selected.size} selected items?`;
    if (!confirm(label + " This calls the publisher for each — may take a minute.")) return;
    setBulkRunning(true);
    setBulkResult(null);
    try {
      const r = await fetch(`/api/inbox/bulk-${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const j = await r.json();
      const okCount = action === "approve" ? j.approved : j.rejected;
      setBulkResult(`${okCount}/${j.total} ${action}d`);
      await load();
    } catch (e) {
      setBulkResult(e instanceof Error ? e.message : "Bulk action failed");
    } finally {
      setBulkRunning(false);
    }
  };

  const allSelected = selectableIds.length > 0 && selected.size === selectableIds.length;
  const pendingMode = tab === "pending_review";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={() => router.push("/admin/inbox")}
            className="text-xs text-white/40 hover:text-white/80 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All weeks
          </button>
          <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
            <Inbox className="w-7 h-7 text-seed-400" />
            {weekLabel}
          </h1>
          <p className="text-white/50 text-sm mt-1 font-mono">{week}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              tab === t.key ? "bg-seed-500 text-dark-base" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bulk action bar — sticky when items selected */}
      {pendingMode && selectableIds.length > 0 && (
        <div className="sticky top-0 z-10 -mx-1 px-3 py-3 bg-dark-elevated border border-white/[0.08] rounded-xl flex items-center gap-3 flex-wrap shadow-lg">
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-seed-500"
            />
            {allSelected ? "Deselect all" : `Select all (${selectableIds.length})`}
          </label>
          <span className="text-xs text-white/40">{selected.size} selected</span>
          <div className="flex-1" />
          <button
            disabled={selected.size === 0 || bulkRunning}
            onClick={() => bulk("approve")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            {bulkRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            Approve {selected.size} selected
          </button>
          <button
            disabled={selected.size === 0 || bulkRunning}
            onClick={() => bulk("reject")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-400/40 text-white/70 hover:text-red-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-3 h-3" />
            Reject {selected.size} selected
          </button>
          {bulkResult && (
            <span className="text-xs text-white/60 basis-full">{bulkResult}</span>
          )}
        </div>
      )}

      {/* Narrative — analyst brief at top */}
      {analystBrief && (
        <section className="bg-gradient-to-br from-seed-500/[0.06] to-transparent border border-seed-500/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setNarrativeOpen((o) => !o)}
            className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-seed-500/[0.03] transition-colors"
          >
            {narrativeOpen ? <ChevronDown className="w-4 h-4 text-seed-300" /> : <ChevronRight className="w-4 h-4 text-seed-300" />}
            <div className="w-8 h-8 rounded-lg bg-seed-500/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-seed-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{analystBrief.title}</p>
              <p className="text-[11px] text-white/40 mt-0.5">
                Strategy Analyst — generated {new Date(analystBrief.updatedAt).toLocaleString()}
              </p>
            </div>
          </button>
          {narrativeOpen && (
            <div className="border-t border-seed-500/10 px-5 py-5">
              <MarkdownText markdown={analystBrief.content} />
            </div>
          )}
        </section>
      )}

      {/* Grouped artifact sections */}
      <div className="space-y-6">
        {loading && !artifacts && (
          <div className="text-sm text-white/40 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {artifacts && artifacts.length === 0 && (
          <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-8 text-center text-sm text-white/40">
            {pendingMode ? "Nothing pending in this week." : "No items in this view."}
          </div>
        )}

        {artifacts && artifacts.length > 0 && GROUPS.map((group) => {
          const items = artifacts.filter((a) => a.type === group.type);
          if (items.length === 0) return null;
          const Icon = group.icon;
          const pendingInGroup = items.filter((a) => a.state === "pending_review").length;
          const groupIds = items.filter((a) => a.state === "pending_review").map((a) => a.id);
          const groupAllSelected = groupIds.length > 0 && groupIds.every((id) => selected.has(id));
          const toggleGroup = () => {
            const next = new Set(selected);
            if (groupAllSelected) {
              for (const id of groupIds) next.delete(id);
            } else {
              for (const id of groupIds) next.add(id);
            }
            setSelected(next);
          };
          return (
            <section key={group.type} className="space-y-2">
              <div className="flex items-center gap-3 px-1">
                <div className={`w-7 h-7 rounded-lg ${group.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${group.accent}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-semibold text-white">{group.label}</h2>
                    <span className="text-[10px] uppercase tracking-wide text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded">
                      {items.length}{pendingInGroup !== items.length ? ` · ${pendingInGroup} pending` : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">{group.description}</p>
                </div>
                {pendingMode && groupIds.length > 0 && (
                  <button
                    onClick={toggleGroup}
                    className="text-[11px] text-white/50 hover:text-seed-300 underline"
                  >
                    {groupAllSelected ? "Deselect group" : "Select group"}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {items.map((a) => (
                  <ArtifactCard
                    key={a.id}
                    artifact={a}
                    checkable={a.state === "pending_review"}
                    checked={selected.has(a.id)}
                    onToggleCheck={() => toggle(a.id)}
                    pending={pending === a.id}
                    onApprove={(edits) => act(a.id, "approve", edits)}
                    onReject={() => act(a.id, "reject")}
                    onDraftNow={(fast) => draftBriefNow(a.id, fast)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Catch-all for unknown types so we never silently drop artifacts */}
        {artifacts && artifacts.length > 0 && (() => {
          const known = new Set(GROUPS.map((g) => g.type));
          const orphans = artifacts.filter((a) => !known.has(a.type));
          if (orphans.length === 0) return null;
          return (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-white px-1">Other</h2>
              <div className="space-y-3">
                {orphans.map((a) => (
                  <ArtifactCard
                    key={a.id}
                    artifact={a}
                    checkable={a.state === "pending_review"}
                    checked={selected.has(a.id)}
                    onToggleCheck={() => toggle(a.id)}
                    pending={pending === a.id}
                    onApprove={(edits) => act(a.id, "approve", edits)}
                    onReject={() => act(a.id, "reject")}
                  />
                ))}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}

/* ── MarkdownText: lightweight renderer for analyst briefs ── */

function MarkdownText({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    out.push(
      <ul key={`ul-${key}`} className="list-disc ml-5 mb-3 text-sm text-white/80 space-y-1">
        {listBuffer.map((l, i) => <li key={i}>{renderInline(l)}</li>)}
      </ul>
    );
    listBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!.trimEnd();
    if (raw.startsWith("# ")) {
      flushList(String(i));
      out.push(<h2 key={i} className="text-lg font-display tracking-wide text-white mt-4 mb-2">{raw.slice(2)}</h2>);
    } else if (raw.startsWith("## ")) {
      flushList(String(i));
      out.push(<h3 key={i} className="text-base font-semibold text-white mt-4 mb-1.5">{raw.slice(3)}</h3>);
    } else if (raw.startsWith("### ")) {
      flushList(String(i));
      out.push(<h4 key={i} className="text-sm font-semibold text-white/90 mt-3 mb-1">{raw.slice(4)}</h4>);
    } else if (raw.startsWith("- ") || raw.startsWith("* ")) {
      listBuffer.push(raw.slice(2));
    } else if (raw.startsWith("> ")) {
      flushList(String(i));
      out.push(
        <blockquote key={i} className="border-l-2 border-seed-500/40 pl-3 text-sm text-white/70 italic my-2">
          {renderInline(raw.slice(2))}
        </blockquote>
      );
    } else if (raw === "") {
      flushList(String(i));
    } else {
      flushList(String(i));
      out.push(<p key={i} className="text-sm text-white/80 leading-relaxed mb-2">{renderInline(raw)}</p>);
    }
  }
  flushList("end");
  return <div>{out}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Bold support: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function ArtifactCard({
  artifact,
  checkable,
  checked,
  onToggleCheck,
  pending,
  onApprove,
  onReject,
  onDraftNow,
}: {
  artifact: Artifact;
  checkable: boolean;
  checked: boolean;
  onToggleCheck: () => void;
  pending: boolean;
  onApprove: (edits?: Record<string, unknown>) => void;
  onReject: () => void;
  onDraftNow?: (fast: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  // GBP-specific: track the uploaded image URL so the approve button can be gated
  const [gbpImageUrl, setGbpImageUrl] = useState<string | null>(
    artifact.type === "gbp_post_draft"
      ? ((artifact.payload?.uploadedImageUrl as string | null) ?? null)
      : null
  );

  const editKey =
    artifact.type === "review_reply_draft" ? "reply"
    : artifact.type === "gbp_post_draft" ? "summary"
    : null;
  const editableText = editKey ? (artifact.payload?.[editKey] as string | undefined) ?? "" : null;
  const showEditor = artifact.state === "pending_review" && editableText != null;
  const currentText = edited ?? editableText ?? "";

  // For GBP posts: Approve is disabled until an image has been uploaded
  const gbpApproveBlocked = artifact.type === "gbp_post_draft" && artifact.state === "pending_review" && !gbpImageUrl;

  const handleApprove = () => {
    const edits: Record<string, unknown> = {};
    if (edited != null && editKey != null) edits[editKey] = edited;
    if (artifact.type === "gbp_post_draft" && gbpImageUrl) edits.uploadedImageUrl = gbpImageUrl;
    onApprove(Object.keys(edits).length > 0 ? edits : undefined);
  };

  return (
    <div className={`bg-dark-elevated border rounded-xl overflow-hidden transition-colors ${checked ? "border-seed-500/40" : "border-white/[0.06]"}`}>
      <div className="px-5 py-4 flex items-center gap-3">
        {checkable && (
          <label className="shrink-0 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggleCheck}
              className="w-4 h-4 rounded accent-seed-500"
            />
          </label>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center gap-3 text-left hover:opacity-90 transition-opacity min-w-0"
        >
          {open ? <ChevronDown className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />}
          <div className="w-8 h-8 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-seed-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{artifact.title}</p>
            <p className="text-[11px] text-white/40 mt-0.5 truncate">
              {AGENT_LABELS[artifact.agent] ?? artifact.agent} · {TYPE_LABELS[artifact.type] ?? artifact.type} · {new Date(artifact.createdAt).toLocaleString()}
            </p>
          </div>
          <StateBadge state={artifact.state} />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] px-5 py-4 space-y-4">
          {artifact.summary && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Source</p>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{artifact.summary}</p>
            </div>
          )}

          {editableText != null && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">
                {showEditor ? "Draft (edit before approving)" : "Draft"}
              </p>
              {showEditor ? (
                <textarea
                  className="w-full bg-dark-base border border-white/10 rounded-lg p-3 text-sm text-white font-mono"
                  rows={5}
                  value={currentText}
                  onChange={(e) => setEdited(e.target.value)}
                />
              ) : (
                <p className="text-sm text-white whitespace-pre-wrap">{editableText}</p>
              )}
            </div>
          )}

          <TypeSpecificView artifact={artifact} gbpImageUrl={gbpImageUrl} onGbpImageUploaded={setGbpImageUrl} />

          <details className="text-xs text-white/40">
            <summary className="cursor-pointer hover:text-white/60">Raw payload</summary>
            <pre className="mt-2 bg-dark-base/60 border border-white/[0.05] rounded-lg p-3 overflow-auto">
              {JSON.stringify(artifact.payload, null, 2)}
            </pre>
          </details>

          {artifact.publishError && (
            <div className="text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>Publish failed: {artifact.publishError}</span>
            </div>
          )}

          {artifact.type === "content_brief" && artifact.state === "approved" && onDraftNow && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-yellow-300/80">Approved — waiting for the daily Blog Drafter cron, or:</span>
              <button
                disabled={pending}
                onClick={() => onDraftNow(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                Draft now (Sonnet)
              </button>
              <button
                disabled={pending}
                onClick={() => onDraftNow(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:border-seed-400/40 text-white/70 hover:text-seed-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                Draft now (Haiku, faster)
              </button>
            </div>
          )}

          {artifact.state === "pending_review" && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={pending || gbpApproveBlocked}
                onClick={handleApprove}
                title={gbpApproveBlocked ? "Upload an image before approving" : undefined}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Approve &amp; publish
              </button>
              {gbpApproveBlocked && (
                <span className="text-[11px] text-yellow-300/80 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Upload an image above to enable publishing
                </span>
              )}
              <button
                disabled={pending}
                onClick={onReject}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-400/40 text-white/70 hover:text-red-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3 h-3" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SimilarityBadge({ payload }: { payload: Record<string, unknown> }) {
  const w = payload.similarityWarning as
    | { matchedUrl?: string; matchedTitle?: string; matchedSummary?: string; matchedAt?: string; score?: number; action?: string }
    | undefined;
  if (!w) return null;
  const score = typeof w.score === "number" ? w.score.toFixed(2) : "?";
  const isConverted = w.action === "converted_to_refresh";
  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border text-xs ${isConverted ? "bg-blue-500/[0.06] border-blue-500/30 text-blue-200" : "bg-yellow-500/[0.06] border-yellow-500/30 text-yellow-200"}`}>
      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">
          {isConverted ? "Auto-converted to refresh" : "Potential duplicate"}
          <span className="ml-1.5 opacity-70 font-normal">similarity {score}</span>
        </p>
        {w.matchedUrl && w.matchedTitle && (
          <p className="opacity-80 truncate">
            Matches existing post: <Link href={`/admin${w.matchedUrl}`} className="underline">{w.matchedTitle}</Link>{" "}
            <span className="opacity-60 font-mono">({w.matchedUrl})</span>
          </p>
        )}
        {w.matchedSummary && (
          <p className="opacity-80 italic">
            Recent GBP post ({w.matchedAt?.slice(0, 10) ?? "—"}): &ldquo;{w.matchedSummary}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

function TypeSpecificView({
  artifact,
  gbpImageUrl,
  onGbpImageUploaded,
}: {
  artifact: Artifact;
  gbpImageUrl?: string | null;
  onGbpImageUploaded?: (url: string) => void;
}) {
  const p = artifact.payload as Record<string, unknown>;

  if (artifact.type === "content_brief") {
    return (
      <div className="space-y-3">
        <SimilarityBadge payload={p} />
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="Target keyword" value={String(p.targetKeyword ?? "")} />
          <Field label="Slug" value={String(p.targetSlug ?? "")} />
          <Field label="Type" value={String(p.type ?? "")} />
          <Field label="Word count" value={String(p.wordCountTarget ?? "")} />
          <Field label="Intent" value={String(p.intent ?? "")} />
          <Field label="Funnel stage" value={String(p.funnelStage ?? "")} />
        </div>
        {Array.isArray(p.sections) && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Sections</p>
            <ol className="text-xs text-white/70 list-decimal ml-5 space-y-1.5">
              {(p.sections as { h2: string; bullets: string[] }[]).map((s, i) => (
                <li key={i}>
                  <span className="font-semibold text-white">{s.h2}</span>
                  <ul className="list-disc ml-5 mt-1 text-white/50">
                    {s.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}
        {Array.isArray(p.mustInclude) && (
          <p className="text-xs text-white/60"><span className="text-white/40">Must include:</span> {(p.mustInclude as string[]).join(" · ")}</p>
        )}
        {Array.isArray(p.internalLinks) && (
          <p className="text-xs text-white/60"><span className="text-white/40">Internal links:</span> {(p.internalLinks as string[]).join(" · ")}</p>
        )}
      </div>
    );
  }

  if (artifact.type === "blog_draft") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="Title" value={String(p.title ?? "")} />
          <Field label="Slug" value={String(p.slug ?? "")} />
          <Field label="Word count" value={String(p.wordCount ?? "")} />
          <Field label="Target keyword" value={String(p.targetKeyword ?? "")} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Excerpt</p>
          <p className="text-sm text-white/80">{String(p.excerpt ?? "")}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Body preview</p>
          <p className="text-sm text-white/60 font-mono whitespace-pre-wrap">{String(p.bodyPreview ?? "").slice(0, 400)}…</p>
        </div>
        {p.blogPostId != null && (
          <Link href={`/admin/blog/${p.blogPostId}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-seed-300 hover:text-seed-200">
            <ExternalLink className="w-3 h-3" /> Open in editor
          </Link>
        )}
      </div>
    );
  }

  if (artifact.type === "keyword_candidate") {
    return (
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Keyword" value={String(p.keyword ?? "")} />
          <Field label="Intent" value={String(p.intent ?? "")} />
          <Field label="Tier" value={String(p.tier ?? "")} />
          <Field label="Target page" value={String(p.targetPage ?? "/")} />
          <Field label="Impressions (28d)" value={String(p.impressions28d ?? 0)} />
          <Field label="Clicks (28d)" value={String(p.clicks28d ?? 0)} />
          <Field label="Avg position" value={typeof p.position === "number" ? p.position.toFixed(1) : "—"} />
          <Field label="CTR" value={typeof p.ctr28d === "number" ? `${(p.ctr28d * 100).toFixed(1)}%` : "—"} />
        </div>
        <p className="text-[11px] text-white/40">Approving creates a TrackedKeyword row.</p>
      </div>
    );
  }

  if (artifact.type === "link_suggestions") {
    const suggestions = (p.suggestions ?? []) as Array<{ targetPageUrl: string; anchorText: string; context: string; reason: string }>;
    return (
      <div className="space-y-3 text-xs">
        <p className="text-white/60"><span className="text-white/40">Source post:</span> {String(p.sourcePageUrl ?? "")}</p>
        <ol className="space-y-2 list-decimal ml-5">
          {suggestions.map((s, i) => (
            <li key={i} className="space-y-1">
              <div className="text-white">Link to <code className="font-mono text-seed-300">{s.targetPageUrl}</code> with anchor <span className="font-semibold">&ldquo;{s.anchorText}&rdquo;</span></div>
              {s.context && <div className="text-white/50 italic">&ldquo;{s.context}&rdquo;</div>}
              <div className="text-white/40 text-[11px]">{s.reason}</div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (artifact.type === "gbp_post_draft") {
    return (
      <GbpPostDraftView
        artifact={artifact}
        gbpImageUrl={gbpImageUrl ?? null}
        onGbpImageUploaded={onGbpImageUploaded ?? (() => {})}
      />
    );
  }

  return null;
}

function GbpPostDraftView({
  artifact,
  gbpImageUrl,
  onGbpImageUploaded,
}: {
  artifact: Artifact;
  gbpImageUrl: string | null;
  onGbpImageUploaded: (url: string) => void;
}) {
  const p = artifact.payload as Record<string, unknown>;
  const perf = p.performanceContext as { topPerformingType?: string; highPerformers?: string[]; avoidedTopics?: string[] } | undefined;
  const isPending = artifact.state === "pending_review";

  return (
    <div className="space-y-4 text-xs">
      <SimilarityBadge payload={p} />

      {/* Image uploader — always shown for pending, preview only otherwise */}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2 flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" /> Image
          {isPending && <span className="text-red-400 font-semibold">(required before publishing)</span>}
        </p>
        {isPending ? (
          <GbpImageUploader
            artifactId={artifact.id}
            existingUrl={gbpImageUrl}
            onUploaded={onGbpImageUploaded}
          />
        ) : (
          gbpImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gbpImageUrl} alt="GBP post image" className="max-h-48 rounded-lg border border-white/10 object-cover" />
          )
        )}
        {!!p.imagePrompt && isPending && (
          <p className="mt-2 text-white/50 italic flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-yellow-400/70" />
            <span>Image suggestion: {String(p.imagePrompt ?? "")}</span>
          </p>
        )}
      </div>

      {/* Topic + CTA */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Topic type" value={String(p.topicType ?? "")} />
        <Field label="CTA type" value={p.ctaType ? String(p.ctaType) : "(none)"} />
        <Field label="Location" value={String(p.locationDbId ?? "")} />
      </div>

      {p.ctaUrl != null && p.ctaUrl !== "" && (
        <CtaUrlCheck ctaUrl={String(p.ctaUrl)} locationDbId={p.locationDbId ? String(p.locationDbId) : undefined} />
      )}

      {/* Performance context */}
      {perf && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-white/40 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Why this idea
          </p>
          {!!p.reasoning && <p className="text-white/70">{String(p.reasoning ?? "")}</p>}
          <p className="text-white/40">
            Top performing type: <span className="text-white/60">{perf.topPerformingType ?? "—"}</span>
          </p>
          {Array.isArray(perf.highPerformers) && perf.highPerformers.length > 0 && (
            <div>
              <p className="text-white/40 mb-1">High-CTR reference posts:</p>
              <ul className="space-y-0.5">
                {(perf.highPerformers as string[]).map((h, i) => (
                  <li key={i} className="text-green-400/70 flex items-start gap-1">
                    <span className="shrink-0 mt-0.5">✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(perf.avoidedTopics) && perf.avoidedTopics.length > 0 && (
            <div>
              <p className="text-white/40 mb-1">Avoided (low CTR):</p>
              <ul className="space-y-0.5">
                {(perf.avoidedTopics as string[]).map((a, i) => (
                  <li key={i} className="text-red-400/60 flex items-start gap-1">
                    <span className="shrink-0 mt-0.5">✗</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GbpImageUploader({
  artifactId,
  existingUrl,
  onUploaded,
}: {
  artifactId: string;
  existingUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const r = await fetch(`/api/admin/integrations/gbp/artifacts/${artifactId}/upload-image`, {
        method: "POST",
        body: form,
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error ?? "Upload failed");
      setPreviewUrl(j.url as string);
      onUploaded(j.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  if (previewUrl) {
    return (
      <div className="space-y-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Uploaded image preview" className="max-h-48 rounded-lg border border-seed-500/30 object-cover" />
        <label className="inline-flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 cursor-pointer">
          <Upload className="w-3 h-3" />
          Replace image
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onInputChange} />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-white/20 hover:border-seed-500/50 rounded-lg cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-white/40" />
        ) : (
          <>
            <Upload className="w-5 h-5 text-white/30" />
            <span className="text-xs text-white/40">Drop image here or click to upload</span>
            <span className="text-[10px] text-white/25">JPEG · PNG · WebP · max 10 MB</span>
          </>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onInputChange} disabled={uploading} />
      </label>
      {error && (
        <p className="text-xs text-red-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

function CtaUrlCheck({ ctaUrl, locationDbId }: { ctaUrl: string; locationDbId?: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/integrations/gbp/validate-cta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ctaUrl, locationDbId }),
        });
        const j = await r.json();
        if (cancelled) return;
        if (j.ok) setStatus("ok");
        else { setStatus("fail"); setError(j.error ?? "Invalid"); }
      } catch (e) {
        if (cancelled) return;
        setStatus("fail");
        setError(e instanceof Error ? e.message : "Check failed");
      }
    })();
    return () => { cancelled = true; };
  }, [ctaUrl, locationDbId]);
  return (
    <p className="text-white/60 flex items-start gap-2">
      <span className="text-white/40 shrink-0">CTA URL:</span>
      <span className="break-all">{ctaUrl}</span>
      {status === "loading" && <Loader2 className="w-3 h-3 animate-spin text-white/40 shrink-0 mt-0.5" />}
      {status === "ok" && <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />}
      {status === "fail" && (
        <span className="text-red-300 inline-flex items-start gap-1 shrink-0">
          <AlertTriangle className="w-3 h-3 mt-0.5" />
          <span className="text-[10px]">{error}</span>
        </span>
      )}
    </p>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="text-xs text-white truncate">{value || "—"}</p>
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending_review: { label: "Pending", cls: "text-yellow-300 bg-yellow-400/10" },
    approved: { label: "Approved", cls: "text-blue-300 bg-blue-400/10" },
    published: { label: "Published", cls: "text-green-300 bg-green-400/10" },
    rejected: { label: "Rejected", cls: "text-white/40 bg-white/[0.06]" },
    failed: { label: "Failed", cls: "text-red-300 bg-red-400/10" },
  };
  const m = map[state] ?? { label: state, cls: "text-white/40 bg-white/[0.06]" };
  return (
    <span className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded shrink-0 ${m.cls}`}>
      {m.label}
    </span>
  );
}
