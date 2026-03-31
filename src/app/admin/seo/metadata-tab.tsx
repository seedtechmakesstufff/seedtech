"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Globe, Check, AlertTriangle, X, ChevronRight, Save, Loader2,
  EyeOff, FileText, Image as ImageIcon, Link2, Tag, Search,
  Upload, Trash2, Sparkles, RotateCcw, Bug,
} from "lucide-react";
import Lottie from "lottie-react";
import progressAnimation from "@/../public/lotties/progress.json";

/* ── Types ── */
interface PageMeta {
  path: string;
  kind: string;
  pageTitle: string | null;
  id: string | null;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  twitterCard: string;
  canonical: string | null;
  noIndex: boolean;
  noFollow: boolean;
  jsonLdType: string | null;
  lastCrawledAt: string | null;
  crawlStatus: string | null;
  updatedAt: string | null;
}

function getStatus(p: PageMeta): "complete" | "partial" | "missing" {
  if (p.title && p.description && p.canonical) return "complete";
  if (p.title || p.description) return "partial";
  return "missing";
}

function statusBadge(status: "complete" | "partial" | "missing") {
  if (status === "complete")
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"><Check className="w-3 h-3" />Complete</span>;
  if (status === "partial")
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" />Partial</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full"><X className="w-3 h-3" />Missing</span>;
}

/* ── Main Component ── */
export default function MetadataTab() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "complete" | "partial" | "missing">("all");
  const [editing, setEditing] = useState<PageMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // OG image upload state
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const ogFileRef = useRef<HTMLInputElement>(null);

  // AI generation state
  const [generating, setGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    title: string; description: string; ogTitle: string; ogDescription: string;
    canonical: string; jsonLdType: string; reasoning: string;
  } | null>(null);

  // Bulk generation state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);
  const [bulkLog, setBulkLog] = useState<{ path: string; status: "generating" | "saved" | "error"; title?: string; description?: string; error?: string }[]>([]);
  const [bulkStats, setBulkStats] = useState({ total: 0, generated: 0, saved: 0, skipped: 0, errors: 0 });
  const bulkLogRef = useRef<HTMLDivElement>(null);

  // Draft state for the editor
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    canonical: "",
    noIndex: false,
    noFollow: false,
    jsonLdType: "",
  });

  // Crawl issue warnings — loaded from latest crawl for per-page indicators
  interface CrawlIssueItem { url: string; checkType: string; severity: string; message: string }
  const [crawlIssues, setCrawlIssues] = useState<CrawlIssueItem[]>([]);

  // Build per-path issue map
  const issuesByPath = crawlIssues.reduce<Record<string, CrawlIssueItem[]>>((acc, issue) => {
    const path = (() => { try { return new URL(issue.url).pathname || "/"; } catch { return "/"; } })();
    (acc[path] = acc[path] || []).push(issue);
    return acc;
  }, {});

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/metadata");
      const data = await res.json();
      if (data.pages) setPages(data.pages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
    // Also fetch latest crawl issues for warning indicators
    fetch("/api/admin/seo/crawl").then((r) => r.json()).then((d) => {
      if (d.results?.issues) setCrawlIssues(d.results.issues);
    }).catch(() => {});
  }, [fetchPages]);

  // Listen for external "open-metadata-editor" events (from Audit/Strategy tab Fix buttons)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.path) return;
      const page = pages.find((p) => p.path === detail.path);
      if (page) {
        openEditor(page);
      }
    };
    window.addEventListener("open-metadata-editor", handler);
    return () => window.removeEventListener("open-metadata-editor", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const openEditor = (page: PageMeta) => {
    setEditing(page);
    setDraft({
      title: page.title ?? "",
      description: page.description ?? "",
      ogTitle: page.ogTitle ?? "",
      ogDescription: page.ogDescription ?? "",
      ogImageUrl: page.ogImageUrl ?? "",
      canonical: page.canonical ?? page.path,
      noIndex: page.noIndex,
      noFollow: page.noFollow,
      jsonLdType: page.jsonLdType ?? "",
    });
    setSaveMsg("");
    setAiSuggestion(null);
  };

  const saveMeta = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/admin/seo/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: editing.path, ...draft }),
      });
      if (res.ok) {
        setSaveMsg("Saved!");
        await fetchPages();
        // Update editing with fresh data
        const fresh = pages.find((p) => p.path === editing.path);
        if (fresh) setEditing({ ...fresh, ...draft });
      } else {
        const err = await res.json();
        setSaveMsg(err.error ?? "Failed to save");
      }
    } catch {
      setSaveMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  // ── OG Image Upload ──
  const handleOgUpload = async (file: File) => {
    if (!editing || !file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("ogImage", file);
      fd.append("path", editing.path);
      const res = await fetch("/api/admin/seo/metadata/og-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDraft((d) => ({ ...d, ogImageUrl: data.ogImageUrl }));
      setSaveMsg("Image uploaded!");
      await fetchPages();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleOgRemove = async () => {
    if (!editing) return;
    setUploading(true);
    try {
      const res = await fetch("/api/admin/seo/metadata/og-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: editing.path }),
      });
      if (res.ok) {
        setDraft((d) => ({ ...d, ogImageUrl: "" }));
        setSaveMsg("Image removed");
        await fetchPages();
      }
    } catch {
      setSaveMsg("Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const onOgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleOgUpload(file);
    e.target.value = "";
  };

  const onOgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleOgUpload(file);
  };

  // ── AI Generation ──
  const handleAiGenerate = async () => {
    if (!editing) return;
    setGenerating(true);
    setAiSuggestion(null);
    setSaveMsg("");
    try {
      const res = await fetch("/api/admin/seo/metadata/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: editing.path,
          currentTitle: draft.title || null,
          currentDescription: draft.description || null,
          pageKind: editing.kind || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setAiSuggestion(data);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const acceptAiField = (field: keyof typeof draft) => {
    if (!aiSuggestion || !(field in aiSuggestion)) return;
    const value = aiSuggestion[field as keyof typeof aiSuggestion];
    if (typeof value === "string") {
      setDraft((d) => ({ ...d, [field]: value }));
    }
  };

  const acceptAllAi = () => {
    if (!aiSuggestion) return;
    setDraft((d) => ({
      ...d,
      title: aiSuggestion.title || d.title,
      description: aiSuggestion.description || d.description,
      ogTitle: aiSuggestion.ogTitle || d.ogTitle,
      ogDescription: aiSuggestion.ogDescription || d.ogDescription,
      canonical: aiSuggestion.canonical || d.canonical,
      jsonLdType: aiSuggestion.jsonLdType || d.jsonLdType,
    }));
    setAiSuggestion(null);
    setSaveMsg("AI suggestions applied — review & save");
  };

  // ── Bulk Generate All ──
  const handleBulkGenerate = async () => {
    setBulkRunning(true);
    setBulkDone(false);
    setBulkLog([]);
    setBulkStats({ total: 0, generated: 0, saved: 0, skipped: 0, errors: 0 });

    try {
      const res = await fetch("/api/admin/seo/metadata/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipComplete: true }),
      });

      if (!res.ok || !res.body) {
        setBulkStats((s) => ({ ...s, errors: 1 }));
        setBulkLog([{ path: "—", status: "error", error: "Failed to start generation" }]);
        setBulkRunning(false);
        setBulkDone(true);
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
              setBulkStats((s) => ({ ...s, total: evt.total, skipped: evt.skipped ?? 0 }));
            }

            if (evt.type === "progress") {
              setBulkLog((prev) => {
                const existing = prev.findIndex((l) => l.path === evt.path);
                const entry = {
                  path: evt.path,
                  status: evt.status as "generating" | "saved" | "error",
                  title: evt.title,
                  description: evt.description,
                  error: evt.error,
                };
                if (existing >= 0) {
                  const updated = [...prev];
                  updated[existing] = entry;
                  return updated;
                }
                return [...prev, entry];
              });

              // Auto-scroll log
              setTimeout(() => {
                bulkLogRef.current?.scrollTo({ top: bulkLogRef.current.scrollHeight, behavior: "smooth" });
              }, 50);
            }

            if (evt.type === "done") {
              setBulkStats({
                total: evt.generated + evt.errors,
                generated: evt.generated,
                saved: evt.saved,
                skipped: evt.skipped,
                errors: evt.errors,
              });
              setBulkDone(true);
              setBulkRunning(false);
              // Refresh the page list
              await fetchPages();
            }
          } catch {
            /* skip malformed SSE line */
          }
        }
      }
    } catch {
      setBulkRunning(false);
      setBulkDone(true);
    }
  };

  // Filter + search
  const filtered = pages.filter((p) => {
    const status = getStatus(p);
    if (filter !== "all" && status !== filter) return false;
    if (search && !p.path.toLowerCase().includes(search.toLowerCase()) && !(p.title ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Stats
  const total = pages.length;
  const complete = pages.filter((p) => getStatus(p) === "complete").length;
  const partial = pages.filter((p) => getStatus(p) === "partial").length;
  const missing = pages.filter((p) => getStatus(p) === "missing").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/30">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />Loading page metadata…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => setFilter("all")} className={`p-4 rounded-xl border transition-colors text-left ${filter === "all" ? "border-seed-500/40 bg-seed-500/5" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-white/40 mt-1">Total Pages</p>
        </button>
        <button onClick={() => setFilter("complete")} className={`p-4 rounded-xl border transition-colors text-left ${filter === "complete" ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
          <p className="text-2xl font-bold text-emerald-400">{complete}</p>
          <p className="text-xs text-white/40 mt-1">Complete</p>
        </button>
        <button onClick={() => setFilter("partial")} className={`p-4 rounded-xl border transition-colors text-left ${filter === "partial" ? "border-amber-500/40 bg-amber-500/5" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
          <p className="text-2xl font-bold text-amber-400">{partial}</p>
          <p className="text-xs text-white/40 mt-1">Partial</p>
        </button>
        <button onClick={() => setFilter("missing")} className={`p-4 rounded-xl border transition-colors text-left ${filter === "missing" ? "border-red-500/40 bg-red-500/5" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}>
          <p className="text-2xl font-bold text-red-400">{missing}</p>
          <p className="text-xs text-white/40 mt-1">Missing</p>
        </button>
      </div>

      {/* Bulk generate button */}
      {(missing + partial) > 0 && (
        <button
          onClick={() => { setBulkOpen(true); setBulkDone(false); setBulkLog([]); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500/30 bg-purple-500/[0.06] hover:bg-purple-500/[0.12] text-purple-300 text-sm font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate All Metadata with AI
          <span className="text-[10px] text-purple-400/60 ml-1">({missing + partial} pages need metadata)</span>
        </button>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-seed-500/50"
        />
      </div>

      {/* Page table */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Path</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">Description</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider w-24">OG</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider w-28">Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-white/30">No pages found</td></tr>
            )}
            {filtered.map((page) => {
              const status = getStatus(page);
              const hasOg = !!(page.ogTitle || page.ogImageUrl);
              const pageIssues = issuesByPath[page.path] || [];
              const criticalIssues = pageIssues.filter((i) => i.severity === "critical");
              const warningIssues = pageIssues.filter((i) => i.severity === "warning");
              return (
                <tr
                  key={page.path}
                  onClick={() => openEditor(page)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-white/20 shrink-0" />
                      <span className="text-white/80 font-mono text-xs truncate max-w-[200px]">{page.path}</span>
                      {page.noIndex && <span title="noindex"><EyeOff className="w-3 h-3 text-red-400/60" /></span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-white/60 text-xs truncate block max-w-[220px]">{page.title || "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-white/40 text-xs truncate block max-w-[260px]">{page.description ? `${page.description.slice(0, 80)}…` : "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasOg
                      ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <X className="w-4 h-4 text-white/15 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {statusBadge(status)}
                      {pageIssues.length > 0 && (
                        <span
                          title={`${criticalIssues.length} critical, ${warningIssues.length} warnings from site audit`}
                          className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${criticalIssues.length > 0 ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}
                        >
                          <Bug className="w-2.5 h-2.5" />{pageIssues.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3"><ChevronRight className="w-4 h-4 text-white/20" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Slide-out Editor ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(null)} />
          {/* Panel */}
          <div className="relative w-full max-w-lg bg-dark-base border-l border-white/[0.08] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-dark-base border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Edit Metadata</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">{editing.path}</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* ── Crawl Issues Warning ── */}
              {(() => {
                const editorIssues = issuesByPath[editing.path] || [];
                if (editorIssues.length === 0) return null;
                return (
                  <div className="border border-red-500/20 bg-red-500/[0.04] rounded-lg p-3">
                    <p className="text-xs font-medium text-red-300 flex items-center gap-1.5 mb-2">
                      <Bug className="w-3.5 h-3.5" />
                      {editorIssues.length} audit issue{editorIssues.length !== 1 ? "s" : ""} found on this page
                    </p>
                    <div className="space-y-1">
                      {editorIssues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 ${issue.severity === "critical" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>{issue.severity}</span>
                          <span className="text-xs text-white/50">{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── AI Generate Button ── */}
              <button
                onClick={handleAiGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-500/30 bg-purple-500/[0.06] hover:bg-purple-500/[0.12] text-purple-300 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "Generating metadata…" : "Auto-generate with AI"}
              </button>

              {/* ── AI Suggestions Panel ── */}
              {aiSuggestion && (
                <div className="border border-purple-500/20 bg-purple-500/[0.04] rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-purple-500/[0.06] flex items-center justify-between">
                    <p className="text-[10px] font-medium text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />AI Suggestions
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={acceptAllAi}
                        className="text-[10px] text-purple-300 hover:text-purple-200 font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />Accept All
                      </button>
                      <button
                        onClick={() => setAiSuggestion(null)}
                        className="text-[10px] text-white/30 hover:text-white/60"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {/* Per-field suggestions */}
                    {([
                      ["title", "Title", aiSuggestion.title],
                      ["description", "Description", aiSuggestion.description],
                      ["ogTitle", "OG Title", aiSuggestion.ogTitle],
                      ["ogDescription", "OG Description", aiSuggestion.ogDescription],
                      ["canonical", "Canonical", aiSuggestion.canonical],
                      ["jsonLdType", "Schema Type", aiSuggestion.jsonLdType],
                    ] as [keyof typeof draft, string, string][])
                      .filter(([, , val]) => val)
                      .map(([field, label, value]) => (
                        <div key={field} className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-purple-300/60 font-medium">{label}</p>
                            <p className="text-xs text-white/70 mt-0.5 break-words">{value}</p>
                          </div>
                          <button
                            onClick={() => acceptAiField(field)}
                            className="shrink-0 mt-2 text-purple-400 hover:text-purple-300 transition-colors"
                            title={`Use this ${label.toLowerCase()}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    {/* Reasoning */}
                    {aiSuggestion.reasoning && (
                      <div className="pt-2 border-t border-purple-500/10">
                        <p className="text-[10px] text-white/30 italic">{aiSuggestion.reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share Preview */}
              <div className="border border-white/[0.08] rounded-lg overflow-hidden">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-3 py-2 bg-white/[0.02]">Share Preview</p>
                <div className="p-3">
                  {/* Google-style preview */}
                  <div className="space-y-0.5">
                    <p className="text-xs text-white/30 font-mono truncate">seedtechllc.com{draft.canonical || editing.path}</p>
                    <p className="text-sm font-medium text-blue-400 truncate">{draft.title || "Untitled Page"} — SeedTech</p>
                    <p className="text-xs text-white/40 line-clamp-2">{draft.description || "No description set"}</p>
                  </div>
                  {/* Social card preview */}
                  <div className="mt-3 border border-white/[0.06] rounded-lg overflow-hidden">
                    <div className="h-28 bg-white/[0.03] flex items-center justify-center">
                      {draft.ogImageUrl
                        ? <img src={draft.ogImageUrl} alt="" className="w-full h-full object-cover" />
                        : <ImageIcon className="w-8 h-8 text-white/10" />}
                    </div>
                    <div className="p-2.5 bg-white/[0.02]">
                      <p className="text-[10px] text-white/30 uppercase">seedtechllc.com</p>
                      <p className="text-xs font-medium text-white/80 truncate mt-0.5">{draft.ogTitle || draft.title || "Untitled"}</p>
                      <p className="text-[11px] text-white/40 truncate">{draft.ogDescription || draft.description || ""}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-1.5">
                  <Tag className="w-3 h-3" />Title Tag
                  <span className="ml-auto text-white/30">{draft.title.length}/60</span>
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50"
                  placeholder="Page title"
                />
                {draft.title.length > 60 && <p className="text-[10px] text-amber-400 mt-1">Title is over 60 characters — may be truncated in search results</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3 h-3" />Meta Description
                  <span className="ml-auto text-white/30">{draft.description.length}/160</span>
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50 resize-none"
                  placeholder="Page description"
                />
                {draft.description.length > 160 && <p className="text-[10px] text-amber-400 mt-1">Description is over 160 characters — may be truncated</p>}
              </div>

              {/* Canonical */}
              <div>
                <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-1.5">
                  <Link2 className="w-3 h-3" />Canonical URL
                </label>
                <input
                  type="text"
                  value={draft.canonical}
                  onChange={(e) => setDraft({ ...draft, canonical: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white font-mono focus:outline-none focus:border-seed-500/50"
                  placeholder="/about"
                />
              </div>

              {/* ── OG Image Upload ── */}
              <div>
                <label className="text-xs font-medium text-white/50 flex items-center gap-1.5 mb-1.5">
                  <ImageIcon className="w-3 h-3" />OG Image
                  <span className="ml-auto text-[10px] text-white/20">1200×630 recommended</span>
                </label>

                {draft.ogImageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/[0.08]">
                    <img
                      src={draft.ogImageUrl}
                      alt="OG preview"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        onClick={() => ogFileRef.current?.click()}
                        disabled={uploading}
                        className="p-1.5 rounded-md bg-black/70 text-white/70 hover:text-white transition-colors"
                        title="Replace image"
                      >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={handleOgRemove}
                        disabled={uploading}
                        className="p-1.5 rounded-md bg-black/70 text-red-400/70 hover:text-red-400 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onOgDrop}
                    onClick={() => ogFileRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 h-28 rounded-lg border-2 border-dashed cursor-pointer transition-all
                      ${dragOver
                        ? "border-seed-400 bg-seed-500/[0.06]"
                        : "border-white/[0.10] hover:border-seed-500/30 hover:bg-seed-500/[0.03]"
                      }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 text-seed-400 animate-spin" />
                        <p className="text-xs text-white/50">Uploading…</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-white/30" />
                        <div className="text-center">
                          <p className="text-xs text-white/50">
                            <span className="text-seed-400 font-medium">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-[10px] text-white/25 mt-0.5">PNG, JPEG, WebP — max 5 MB</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={ogFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={onOgFileChange}
                />
              </div>

              {/* OG text overrides */}
              <details className="group">
                <summary className="text-xs font-medium text-white/50 cursor-pointer flex items-center gap-1.5 py-2">
                  <ImageIcon className="w-3 h-3" />Open Graph Text Overrides
                  <ChevronRight className="w-3 h-3 ml-auto transition-transform group-open:rotate-90" />
                </summary>
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={draft.ogTitle}
                    onChange={(e) => setDraft({ ...draft, ogTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50"
                    placeholder="OG Title (defaults to title)"
                  />
                  <textarea
                    value={draft.ogDescription}
                    onChange={(e) => setDraft({ ...draft, ogDescription: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50 resize-none"
                    placeholder="OG Description (defaults to description)"
                  />
                </div>
              </details>

              {/* Robots */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.noIndex}
                    onChange={(e) => setDraft({ ...draft, noIndex: e.target.checked })}
                    className="accent-seed-500 w-3.5 h-3.5"
                  />
                  <EyeOff className="w-3 h-3" /> noindex
                </label>
                <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.noFollow}
                    onChange={(e) => setDraft({ ...draft, noFollow: e.target.checked })}
                    className="accent-seed-500 w-3.5 h-3.5"
                  />
                  nofollow
                </label>
              </div>

              {/* JSON-LD type */}
              <div>
                <label className="text-xs font-medium text-white/50 mb-1.5 block">JSON-LD Schema Type</label>
                <select
                  value={draft.jsonLdType}
                  onChange={(e) => setDraft({ ...draft, jsonLdType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-seed-500/50"
                >
                  <option value="">None</option>
                  <option value="WebPage">WebPage</option>
                  <option value="Service">Service</option>
                  <option value="Article">Article</option>
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="Organization">Organization</option>
                  <option value="FAQPage">FAQPage</option>
                  <option value="HowTo">HowTo</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={saveMeta}
                  disabled={saving}
                  className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Metadata
                </button>
                {saveMsg && (
                  <span className={`text-xs ${saveMsg === "Saved!" || saveMsg.includes("uploaded") || saveMsg.includes("applied") ? "text-emerald-400" : saveMsg.includes("removed") ? "text-white/40" : "text-red-400"}`}>{saveMsg}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Generate Modal ── */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => { if (!bulkRunning) setBulkOpen(false); }} />
          <div className="relative w-full max-w-xl bg-dark-base border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Bulk Generate Metadata</p>
                  <p className="text-[11px] text-white/30">AI-powered metadata for all pages</p>
                </div>
              </div>
              {!bulkRunning && (
                <button onClick={() => setBulkOpen(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Pre-run state */}
              {!bulkRunning && !bulkDone && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-500/[0.04] border border-purple-500/10">
                    <p className="text-sm text-white/70">This will use AI to generate optimized metadata for all pages that are missing or incomplete.</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" />{complete} complete — will be skipped</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" />{partial + missing} pages to generate</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/25">Metadata is generated from your business profile, SEO keywords, and page context. Each page takes ~2-3 seconds.</p>
                  <button
                    onClick={handleBulkGenerate}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Metadata for {partial + missing} Pages
                  </button>
                </div>
              )}

              {/* Running / Done — Log area */}
              {(bulkRunning || bulkDone) && (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/50">
                        {bulkDone ? "Complete" : "Generating…"}
                      </span>
                      <span className="text-white/30 font-mono">
                        {bulkLog.filter((l) => l.status === "saved").length}/{bulkStats.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${bulkDone ? "bg-emerald-500" : "bg-purple-500"}`}
                        style={{ width: `${bulkStats.total > 0 ? (bulkLog.filter((l) => l.status !== "generating").length / bulkStats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Log */}
                  <div
                    ref={bulkLogRef}
                    className="max-h-72 overflow-y-auto rounded-lg border border-white/[0.06] bg-black/30 divide-y divide-white/[0.03]"
                  >
                    {bulkStats.skipped > 0 && (
                      <div className="px-3 py-2 flex items-center gap-2 text-xs text-white/20">
                        <Check className="w-3 h-3 text-white/15" />
                        <span>{bulkStats.skipped} complete pages skipped</span>
                      </div>
                    )}
                    {bulkLog.map((entry, i) => (
                      <div key={i} className="px-3 py-2 flex items-start gap-2">
                        <div className="mt-0.5 shrink-0">
                          {entry.status === "generating" && <Lottie animationData={progressAnimation} loop autoplay style={{ width: 12, height: 12 }} className="shrink-0" />}
                          {entry.status === "saved" && <Check className="w-3 h-3 text-emerald-400" />}
                          {entry.status === "error" && <X className="w-3 h-3 text-red-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-white/50">{entry.path}</p>
                          {entry.status === "saved" && entry.title && (
                            <p className="text-[11px] text-white/30 mt-0.5 truncate">&quot;{entry.title}&quot;</p>
                          )}
                          {entry.status === "error" && entry.error && (
                            <p className="text-[11px] text-red-400/60 mt-0.5">{entry.error}</p>
                          )}
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {entry.status === "saved" && <span className="text-[9px] text-emerald-400/60 uppercase font-medium">saved</span>}
                          {entry.status === "generating" && <span className="text-[9px] text-purple-400/60 uppercase font-medium">generating</span>}
                          {entry.status === "error" && <span className="text-[9px] text-red-400/60 uppercase font-medium">failed</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Done stats */}
                  {bulkDone && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15 text-center">
                        <p className="text-lg font-bold text-emerald-400">{bulkStats.saved}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Saved</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                        <p className="text-lg font-bold text-white/40">{bulkStats.skipped}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Skipped</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-center">
                        <p className="text-lg font-bold text-red-400">{bulkStats.errors}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Errors</p>
                      </div>
                    </div>
                  )}

                  {/* Done button */}
                  {bulkDone && (
                    <button
                      onClick={() => setBulkOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Done
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
