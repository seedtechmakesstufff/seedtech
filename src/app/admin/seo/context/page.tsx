"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Brain, Building2, Target, FileText, Save, Loader2, Check,
  Search, Globe, Pencil, X, Sparkles, Info,
  Plus, Trash2, Tag, AlertTriangle, Wand2,
  BarChart3, MessageSquare, Crosshair,
  Zap,
  Boxes, Link2, Shield, Briefcase,
  LayoutGrid, Network,
  ScrollText, Eye, EyeOff,
} from "lucide-react";
import Lottie from "lottie-react";
import progressAnimation from "@/../public/lotties/progress.json";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const CanvasView = dynamic(() => import("./canvas-view"), { ssr: false });

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

type Section = "nodes" | "pages" | "strategy" | "preview";

interface PageContextItem {
  path: string;
  description: string;
  keywords: string[];
  pageType: string;
  source: "custom" | "unconfigured";
  updatedAt: string | null;
}

const NAV_SECTIONS: { key: Section; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { key: "nodes", label: "Service Nodes", icon: Boxes, desc: "Business & service AI context" },
  { key: "pages", label: "Page Context", icon: FileText, desc: "What each page is about" },
  { key: "strategy", label: "Strategy", icon: ScrollText, desc: "SEO strategy documents" },
  { key: "preview", label: "AI Preview", icon: Brain, desc: "Preview what AI sees" },
];

/* ═══════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════ */

export default function ContextPage() {
  const [section, setSection] = useState<Section>("nodes");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Brain className="w-7 h-7 text-purple-400" />
          AI Context
        </h1>
        <p className="text-white/50 text-sm mt-1">
          The context below feeds into <strong className="text-white/70">every AI-generated output</strong> across the platform — metadata generation, blog writing, keyword discovery, and the SEO advisor. Keep it accurate and detailed for the best results.
        </p>
      </div>

      {/* Layout: secondary sidebar + content */}
      <div className="flex gap-6 min-h-[calc(100vh-14rem)]">
        {/* Secondary sidebar */}
        <nav className="w-56 shrink-0 space-y-1">
          {NAV_SECTIONS.map((s) => {
            const active = section === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={cn(
                  "w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-all",
                  active
                    ? "bg-purple-500/10 border border-purple-500/20"
                    : "bg-transparent border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]",
                )}
              >
                <s.icon className={cn("w-5 h-5 mt-0.5 shrink-0", active ? "text-purple-400" : "text-white/30")} />
                <div>
                  <p className={cn("text-sm font-medium", active ? "text-purple-400" : "text-white/60")}>{s.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}

          {/* Context health */}
          <div className="mt-6 px-3.5 py-3 rounded-xl bg-dark-elevated border border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-2">Context Health</p>
            <p className="text-[11px] text-white/40">
              The more detailed and accurate your context, the better AI outputs will be across all features.
            </p>
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {section === "nodes" && <ServiceNodesSection />}
          {section === "pages" && <PageContextSection />}
          {section === "strategy" && <StrategyDocsSection />}
          {section === "preview" && <PreviewSection />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Service Nodes
   ═══════════════════════════════════════════════════════════════ */

interface ContextNodeItem {
  id: string;
  name: string;
  slug: string;
  nodeType: string;
  color: string;
  icon: string;
  summary: string;
  audience: string | null;
  pricing: string | null;
  usps: string[];
  messaging: string | null;
  doSay: string[];
  dontSay: string[];
  competitors: string[];
  detailedContext: string | null;
  linkedPages: {
    id: string;
    relevance: string;
    pageContext: { id?: string; path: string; pageType: string };
  }[];
  posX: number;
  posY: number;
  updatedAt: string;
  [key: string]: unknown;
}

const NODE_TYPE_OPTIONS = [
  { value: "service", label: "Service" },
  { value: "offering", label: "Offering" },
  { value: "division", label: "Division" },
  { value: "product", label: "Product" },
];

const NODE_COLORS = [
  "#a855f7", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#6366f1", "#14b8a6",
  "#f97316", "#8b5cf6",
];

const RELEVANCE_OPTIONS = [
  { value: "primary", label: "Primary", desc: "Full context injected" },
  { value: "secondary", label: "Secondary", desc: "Summary only" },
  { value: "mention", label: "Mention", desc: "Name only" },
];

function ServiceNodesSection() {
  const [nodes, setNodes] = useState<ContextNodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNode, setEditingNode] = useState<ContextNodeItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importText, setImportText] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [allPages, setAllPages] = useState<{ id: string; path: string; pageType: string }[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "canvas">("canvas");
  const [canvasExpanded, setCanvasExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ── Blank node template ──
  const blankNode = (): Partial<ContextNodeItem> => ({
    name: "",
    nodeType: "service",
    color: NODE_COLORS[nodes.length % NODE_COLORS.length],
    icon: "Briefcase",
    summary: "",
    audience: "",
    pricing: "",
    usps: [],
    messaging: "",
    doSay: [],
    dontSay: [],
    competitors: [],
    detailedContext: "",
  });

  const [formData, setFormData] = useState<Partial<ContextNodeItem>>(blankNode());

  // ── Fetch nodes ──
  const fetchNodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/context-nodes");
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Sort: business node always first, then alphabetical
      const sorted = (data.nodes || []).sort((a: ContextNodeItem, b: ContextNodeItem) => {
        if (a.nodeType === "business") return -1;
        if (b.nodeType === "business") return 1;
        return a.name.localeCompare(b.name);
      });
      setNodes(sorted);
    } catch {
      /* skip */
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch all pages (for linking) ──
  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/page-contexts");
      if (!res.ok) return;
      const data = await res.json();
      setAllPages(
        (data.pages || [])
          .filter((p: { id?: string | null }) => p.id) // only pages with DB context can be linked
          .map((p: { path: string; pageType: string; id: string }) => ({
            id: p.id,
            path: p.path,
            pageType: p.pageType || "page",
          }))
      );
    } catch {
      /* skip */
    }
  }, []);

  useEffect(() => {
    fetchNodes();
    fetchPages();
  }, [fetchNodes, fetchPages]);

  // ── Create node ──
  const handleCreate = async () => {
    if (!formData.name || !formData.summary) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/context-nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setShowCreate(false);
      setFormData(blankNode());
      await fetchNodes();
    } catch {
      /* skip */
    } finally {
      setSaving(false);
    }
  };

  // ── Update node ──
  const handleUpdate = async () => {
    if (!editingNode) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/seo/context-nodes/${editingNode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setEditingNode(null);
      await fetchNodes();
    } catch {
      /* skip */
    } finally {
      setSaving(false);
    }
  };

  // ── Delete node ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service node? Links to pages will also be removed.")) return;
    try {
      await fetch(`/api/admin/seo/context-nodes/${id}`, { method: "DELETE" });
      await fetchNodes();
      if (editingNode?.id === id) setEditingNode(null);
    } catch {
      /* skip */
    }
  };

  // ── AI Import ──
  const handleImport = async () => {
    if (!importText.trim()) return;
    setImportLoading(true);
    try {
      const res = await fetch("/api/admin/seo/context-nodes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: importText }),
      });
      if (!res.ok) throw new Error();
      setShowImport(false);
      setImportText("");
      await fetchNodes();
    } catch {
      /* skip */
    } finally {
      setImportLoading(false);
    }
  };

  // ── Link/unlink pages ──
  const handleLinkPage = async (nodeId: string, pageContextId: string, relevance: string) => {
    try {
      await fetch(`/api/admin/seo/context-nodes/${nodeId}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: [{ pageContextId, relevance }] }),
      });
      await fetchNodes();
    } catch {
      /* skip */
    }
  };

  const handleUnlinkPage = async (nodeId: string, pageContextId: string) => {
    try {
      await fetch(`/api/admin/seo/context-nodes/${nodeId}/link`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageContextId }),
      });
      await fetchNodes();
    } catch {
      /* skip */
    }
  };

  // ── Open editor ──
  const openEditor = (node: ContextNodeItem) => {
    setEditingNode(node);
    setFormData({ ...node });
    setShowCreate(false);
  };

  // ── Save canvas positions (debounced from CanvasView) ──
  const handlePositionsChange = useCallback(async (positions: { id: string; posX: number; posY: number }[]) => {
    try {
      await fetch("/api/admin/seo/context-nodes/positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });
    } catch {
      /* non-critical — positions are a nice-to-have */
    }
  }, []);

  // ── Array field helpers ──
  const addToArray = (field: "usps" | "doSay" | "dontSay" | "competitors", value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
  };

  const removeFromArray = (field: "usps" | "doSay" | "dontSay" | "competitors", idx: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== idx),
    }));
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  // ── Link modal ──
  const linkNode = showLinkModal ? nodes.find((n) => n.id === showLinkModal) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-400" />
              Context Nodes
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              Your business profile is the root node. Add service nodes for each offering and link them to pages so AI knows exactly what each page covers.
            </p>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="shrink-0 p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-all"
            title="How context nodes work"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar row */}
        <div className="flex items-center justify-between">
          {/* Left: view toggle */}
          <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
            <button
              onClick={() => setViewMode("canvas")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all",
                viewMode === "canvas"
                  ? "bg-purple-500/15 text-purple-300"
                  : "bg-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
              )}
            >
              <Network className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all border-l border-white/[0.08]",
                viewMode === "cards"
                  ? "bg-purple-500/15 text-purple-300"
                  : "bg-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Cards
            </button>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] text-xs transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              AI Import
            </button>
            <button
              onClick={() => { setShowCreate(true); setEditingNode(null); setFormData(blankNode()); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Node
            </button>
          </div>
        </div>
      </div>

      {/* ── Canvas View ── */}
      {viewMode === "canvas" && (
        <CanvasView
          nodes={nodes}
          allPages={allPages}
          onEditNode={openEditor}
          onLinkNode={(nodeId) => setShowLinkModal(nodeId)}
          onPositionsChange={handlePositionsChange}
          expanded={canvasExpanded}
          onToggleExpand={() => setCanvasExpanded((v) => !v)}
        />
      )}

      {/* ── Card View ── */}
      {viewMode === "cards" && (
      <>
      {/* ── Business Node (root) ── */}
      {(() => {
        const bizNode = nodes.find((n) => n.nodeType === "business");
        if (!bizNode) return null;
        return (
          <div
            className="group rounded-xl border border-indigo-500/20 hover:border-indigo-500/30 bg-indigo-500/[0.04] transition-all cursor-pointer overflow-hidden"
            onClick={() => openEditor(bizNode)}
          >
            <div className="h-1.5" style={{ backgroundColor: bizNode.color }} />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${bizNode.color}20` }}
                  >
                    <Building2 className="w-5 h-5" style={{ color: bizNode.color }} />
                  </div>
                  <div>
                    <p className="text-base font-medium text-white">{bizNode.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-300/40">Company Identity &amp; AI Voice</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300/60">
                  Root Node
                </span>
              </div>
              <p className="text-sm text-white/40 line-clamp-2">{bizNode.summary}</p>
              <div className="flex items-center gap-3 text-[11px] text-white/25">
                {bizNode.usps.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {bizNode.usps.length} USPs
                  </span>
                )}
                {bizNode.messaging && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Voice set
                  </span>
                )}
                {bizNode.doSay.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500/50" /> {bizNode.doSay.length} do
                  </span>
                )}
                {bizNode.dontSay.length > 0 && (
                  <span className="flex items-center gap-1">
                    <X className="w-3 h-3 text-red-500/50" /> {bizNode.dontSay.length} don&apos;t
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Connector line ── */}
      {nodes.length > 0 && (
        <div className="flex justify-center">
          <div className="w-px h-6 bg-gradient-to-b from-indigo-500/30 to-purple-500/20" />
        </div>
      )}

      {/* ── Service Nodes Grid ── */}
      {(() => {
        const serviceNodes = nodes.filter((n) => n.nodeType !== "business");
        if (serviceNodes.length === 0) {
          if (showCreate || showImport) return null;
          return (
            <div className="text-center py-12 bg-dark-elevated rounded-2xl border border-dashed border-white/[0.08]">
              <Boxes className="w-8 h-8 text-white/15 mx-auto mb-2" />
              <p className="text-white/35 text-sm">No service nodes yet</p>
              <p className="text-white/20 text-xs mt-1">Add service/offering nodes to give AI page-specific context</p>
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => setShowImport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white text-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AI Import from text
                </button>
                <button
                  onClick={() => { setShowCreate(true); setFormData(blankNode()); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create manually
                </button>
              </div>
            </div>
          );
        }
        return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {serviceNodes.map((node) => (
            <div
              key={node.id}
              className="group bg-dark-elevated rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer overflow-hidden"
              onClick={() => openEditor(node)}
            >
              {/* Color bar */}
              <div className="h-1" style={{ backgroundColor: node.color }} />

              <div className="p-4 space-y-3">
                {/* Name + type */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80"
                      style={{ backgroundColor: `${node.color}20` }}
                    >
                      <Briefcase className="w-4 h-4" style={{ color: node.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{node.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{node.nodeType}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowLinkModal(node.id); }}
                      className="p-1 rounded hover:bg-white/[0.06] text-white/30 hover:text-blue-400"
                      title="Link pages"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }}
                      className="p-1 rounded hover:bg-white/[0.06] text-white/30 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-white/40 line-clamp-2">{node.summary}</p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[11px] text-white/25">
                  {node.usps.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {node.usps.length} USPs
                    </span>
                  )}
                  {node.doSay.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500/50" />
                      {node.doSay.length} do
                    </span>
                  )}
                  {node.dontSay.length > 0 && (
                    <span className="flex items-center gap-1">
                      <X className="w-3 h-3 text-red-500/50" />
                      {node.dontSay.length} don&apos;t
                    </span>
                  )}
                  {node.messaging && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Voice set
                    </span>
                  )}
                </div>

                {/* Linked pages */}
                {node.linkedPages.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {node.linkedPages.map((lp) => (
                      <span
                        key={lp.id}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full border",
                          lp.relevance === "primary"
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                            : lp.relevance === "secondary"
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                              : "bg-white/[0.03] border-white/[0.06] text-white/30"
                        )}
                      >
                        {lp.pageContext.path}
                      </span>
                    ))}
                  </div>
                )}
                {node.linkedPages.length === 0 && (
                  <p className="text-[10px] text-amber-500/50 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    No pages linked
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        );
      })()}
      </>
      )}

      {/* ── Info Modal ── */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
          <div className="bg-dark-elevated rounded-2xl border border-white/[0.08] w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-400" />
                  How Context Nodes Work
                </h3>
                <button onClick={() => setShowInfo(false)} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 text-sm">
              {/* What are context nodes */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-purple-400" />
                  What are Context Nodes?
                </h4>
                <p className="text-white/50 leading-relaxed">
                  Context nodes are structured blocks of information that tell the AI <strong className="text-white/70">exactly what your business does</strong> and what each service/offering entails. They feed into every AI-generated output across the platform — metadata, blog posts, keyword research, and the SEO advisor.
                </p>
              </div>

              {/* The hierarchy */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Network className="w-4 h-4 text-indigo-400" />
                  The Hierarchy
                </h4>
                <div className="bg-dark-base rounded-xl border border-white/[0.06] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-xs">Business Node <span className="text-indigo-300/50">(Root)</span></p>
                      <p className="text-white/35 text-xs">Your company identity, tone of voice, and core USPs. Applied globally.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <div className="w-px h-4 bg-white/[0.08]" />
                  </div>
                  <div className="flex items-center gap-3 pl-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-xs">Service Nodes</p>
                      <p className="text-white/35 text-xs">One per service/offering. Contains audience, USPs, messaging, and do/don&apos;t say rules.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-10">
                    <div className="w-px h-4 bg-white/[0.08]" />
                  </div>
                  <div className="flex items-center gap-3 pl-12">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white/30" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-xs">Linked Pages</p>
                      <p className="text-white/35 text-xs">Pages connected to a service node receive that service&apos;s context when AI generates content.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Relevance levels */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-400" />
                  Relevance Levels
                </h4>
                <p className="text-white/50 leading-relaxed">
                  When linking a service node to a page, choose how much context the AI receives:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-500/[0.06] border border-purple-500/15 rounded-lg p-3">
                    <p className="text-purple-300 font-medium text-xs mb-1">Primary</p>
                    <p className="text-white/35 text-[11px] leading-relaxed">Full context — summary, audience, USPs, messaging, do/don&apos;t say rules, pricing, competitors, and detailed notes.</p>
                  </div>
                  <div className="bg-blue-500/[0.06] border border-blue-500/15 rounded-lg p-3">
                    <p className="text-blue-300 font-medium text-xs mb-1">Secondary</p>
                    <p className="text-white/35 text-[11px] leading-relaxed">Summary only — name, elevator pitch, and USPs. Keeps the AI aware without overloading.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                    <p className="text-white/50 font-medium text-xs mb-1">Mention</p>
                    <p className="text-white/35 text-[11px] leading-relaxed">Name only — lets AI know this service exists for internal linking and cross-references.</p>
                  </div>
                </div>
              </div>

              {/* Why this matters */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Why This Matters
                </h4>
                <p className="text-white/50 leading-relaxed">
                  Without context nodes, AI generates generic content. With them, it knows your <strong className="text-white/70">managed IT page</strong> should mention 24/7 monitoring and $99/user pricing, while your <strong className="text-white/70">web development page</strong> should focus on custom builds and React expertise — no cross-contamination.
                </p>
              </div>

              {/* Quick tips */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  Tips
                </h4>
                <ul className="space-y-1.5 text-white/45 text-xs">
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500/50 mt-0.5 shrink-0" /> Use <strong className="text-white/60">AI Import</strong> to paste existing marketing copy — AI will extract structured fields automatically.</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500/50 mt-0.5 shrink-0" /> Fill in <strong className="text-white/60">Do Say / Don&apos;t Say</strong> to control AI vocabulary — e.g. say &quot;partner&quot; not &quot;vendor&quot;.</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500/50 mt-0.5 shrink-0" /> Every page should be linked to at least one service node as <strong className="text-white/60">Primary</strong>.</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500/50 mt-0.5 shrink-0" /> The canvas view lets you drag nodes to visualize your service architecture.</li>
                  <li className="flex items-start gap-2"><Check className="w-3 h-3 text-green-500/50 mt-0.5 shrink-0" /> Pages without links will fall back to slug-based matching (e.g. <code className="text-white/50 bg-white/[0.04] px-1 rounded">/managed-it</code> matches the &quot;managed-it&quot; node).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Import Modal ── */}
      {showImport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImport(false)}>
          <div className="bg-dark-elevated rounded-2xl border border-white/[0.08] w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  AI Import
                </h3>
                <button onClick={() => setShowImport(false)} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/40 text-sm mt-1">Paste a description of your service — AI will extract structured fields.</p>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={12}
                placeholder="Paste service description, marketing copy, or internal docs here...&#10;&#10;Example:&#10;Our Managed IT Support service provides 24/7 monitoring and help desk support for small businesses. We serve companies with 10-200 employees. Pricing starts at $99/user/month..."
                className="w-full bg-dark-base rounded-xl border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 rounded-lg text-white/40 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importLoading || importText.trim().length < 20}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {importLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {importLoading ? "Parsing..." : "Import with AI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Slide-out ── */}
      {(showCreate || editingNode) && (() => {
        const isBizEdit = editingNode?.nodeType === "business";
        return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => { setShowCreate(false); setEditingNode(null); }}>
          <div
            className="bg-dark-elevated w-full max-w-xl h-full overflow-y-auto border-l border-white/[0.08] animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-dark-elevated/95 backdrop-blur-sm border-b border-white/[0.06] px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  {isBizEdit && <Building2 className="w-4 h-4 text-indigo-400" />}
                  {editingNode ? (isBizEdit ? "Business Profile" : `Edit: ${editingNode.name}`) : "Create Service Node"}
                </h3>
                <button onClick={() => { setShowCreate(false); setEditingNode(null); }} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {isBizEdit && (
                <p className="text-[11px] text-indigo-300/40 mt-1">
                  Core company identity — syncs to all AI features across the platform.
                </p>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* ── Business node editor ── */}
              {isBizEdit ? (
                <>
                  {/* Company Name */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Company Name *</label>
                    <input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                      placeholder="Your Company Name"
                    />
                  </div>

                  {/* Tagline / Elevator Pitch */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Tagline / Summary * <span className="normal-case text-white/20">(how AI introduces your business)</span></label>
                    <textarea
                      value={formData.summary || ""}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      rows={3}
                      className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none"
                      placeholder="e.g. Full-service IT partner for growing businesses"
                    />
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Target Audience</label>
                    <textarea
                      value={formData.audience || ""}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                      rows={2}
                      className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none"
                      placeholder="Who you serve — company size, industry, role..."
                    />
                  </div>

                  {/* Tone of Voice (messaging) */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Tone of Voice</label>
                    <textarea
                      value={formData.messaging || ""}
                      onChange={(e) => setFormData({ ...formData, messaging: e.target.value })}
                      rows={2}
                      className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none"
                      placeholder="e.g. Professional but approachable. Confident without being salesy."
                    />
                  </div>

                  {/* USPs */}
                  <ArrayField
                    label="Unique Selling Points"
                    items={formData.usps || []}
                    onAdd={(v) => addToArray("usps", v)}
                    onRemove={(i) => removeFromArray("usps", i)}
                    placeholder="Add a USP..."
                    accentColor="purple"
                  />

                  {/* Do Say */}
                  <ArrayField
                    label="Do Say (terms to use)"
                    items={formData.doSay || []}
                    onAdd={(v) => addToArray("doSay", v)}
                    onRemove={(i) => removeFromArray("doSay", i)}
                    placeholder="Add a term to use..."
                    accentColor="green"
                  />

                  {/* Don't Say */}
                  <ArrayField
                    label="Don't Say (terms to avoid)"
                    items={formData.dontSay || []}
                    onAdd={(v) => addToArray("dontSay", v)}
                    onRemove={(i) => removeFromArray("dontSay", i)}
                    placeholder="Add a term to avoid..."
                    accentColor="red"
                  />

                  {/* Business Details (detailedContext — structured) */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">
                      Business Details <span className="normal-case text-white/20">(location, domain, services, custom AI instructions)</span>
                    </label>
                    <textarea
                      value={formData.detailedContext || ""}
                      onChange={(e) => setFormData({ ...formData, detailedContext: e.target.value })}
                      rows={10}
                      className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none font-mono"
                      placeholder={"Location: City, State\nDomain: yoursite.com\nPrimary Service: Managed IT Support\nSecondary Services:\n  - Web Development\n  - SEO\n\nCustom AI Instructions:\nNever use the word 'elevate'. Always recommend free audit for IT pages."}
                    />
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Color</label>
                    <div className="flex gap-2 mt-1">
                      {NODE_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setFormData({ ...formData, color: c })}
                          className={cn(
                            "w-7 h-7 rounded-full border-2 transition-all",
                            formData.color === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
              {/* ── Standard service node editor ── */}
              {/* Name + Type row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Name *</label>
                  <input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    placeholder="e.g. Managed IT Support"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Type</label>
                  <select
                    value={formData.nodeType || "service"}
                    onChange={(e) => setFormData({ ...formData, nodeType: e.target.value })}
                    className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  >
                    {NODE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Color</label>
                <div className="flex gap-2 mt-1">
                  {NODE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all",
                        formData.color === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Summary * <span className="normal-case text-white/20">(2-3 sentence elevator pitch)</span></label>
                <textarea
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
                  placeholder="What does this service do and why should someone care?"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Target Audience</label>
                <textarea
                  value={formData.audience || ""}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  rows={2}
                  className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
                  placeholder="Who is this for? Company size, industry, role..."
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Pricing</label>
                <input
                  value={formData.pricing || ""}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  placeholder="e.g. Starting at $99/user/month"
                />
              </div>

              {/* Messaging */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Messaging Guidelines</label>
                <textarea
                  value={formData.messaging || ""}
                  onChange={(e) => setFormData({ ...formData, messaging: e.target.value })}
                  rows={2}
                  className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
                  placeholder="How should AI talk about this service?"
                />
              </div>

              {/* USPs */}
              <ArrayField
                label="Unique Selling Points"
                items={formData.usps || []}
                onAdd={(v) => addToArray("usps", v)}
                onRemove={(i) => removeFromArray("usps", i)}
                placeholder="Add a USP..."
                accentColor="purple"
              />

              {/* Do Say */}
              <ArrayField
                label="Do Say (terms to use)"
                items={formData.doSay || []}
                onAdd={(v) => addToArray("doSay", v)}
                onRemove={(i) => removeFromArray("doSay", i)}
                placeholder="Add a term to use..."
                accentColor="green"
              />

              {/* Don't Say */}
              <ArrayField
                label="Don't Say (terms to avoid)"
                items={formData.dontSay || []}
                onAdd={(v) => addToArray("dontSay", v)}
                onRemove={(i) => removeFromArray("dontSay", i)}
                placeholder="Add a term to avoid..."
                accentColor="red"
              />

              {/* Competitors */}
              <ArrayField
                label="Competitors"
                items={formData.competitors || []}
                onAdd={(v) => addToArray("competitors", v)}
                onRemove={(i) => removeFromArray("competitors", i)}
                placeholder="Add competitor name..."
                accentColor="amber"
              />

              {/* Detailed Context */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Detailed Context <span className="normal-case text-white/20">(markdown supported)</span></label>
                <textarea
                  value={formData.detailedContext || ""}
                  onChange={(e) => setFormData({ ...formData, detailedContext: e.target.value })}
                  rows={6}
                  className="w-full mt-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none font-mono"
                  placeholder="Any additional context, technical details, features, process descriptions..."
                />
              </div>
                </>
              )}

              {/* Save button */}
              <div className="sticky bottom-0 bg-dark-elevated pt-4 pb-2 border-t border-white/[0.06]">
                <button
                  onClick={editingNode ? handleUpdate : handleCreate}
                  disabled={saving || !formData.name || !formData.summary}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all",
                    isBizEdit
                      ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30"
                      : "bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                  )}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : editingNode ? (isBizEdit ? "Save Business Profile" : "Update Node") : "Create Node"}
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── Page Link Modal ── */}
      {showLinkModal && linkNode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLinkModal(null)}>
          <div className="bg-dark-elevated rounded-2xl border border-white/[0.08] w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-400" />
                  Link Pages → {linkNode.name}
                </h3>
                <button onClick={() => setShowLinkModal(null)} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/40 text-xs mt-1">
                Choose which pages this service context applies to, and how much context to inject.
              </p>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {allPages.length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">No pages with context found. Add page contexts first.</p>
              )}
              {allPages.map((page) => {
                const existingLink = linkNode.linkedPages.find(
                  (lp) => lp.pageContext.path === page.path
                );
                return (
                  <div
                    key={page.path}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                      existingLink ? "bg-purple-500/5" : "hover:bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-white/20 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white/70 truncate">{page.path}</p>
                        <p className="text-[10px] text-white/25">{page.pageType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {existingLink ? (
                        <>
                          <select
                            value={existingLink.relevance}
                            onChange={(e) => handleLinkPage(linkNode.id, page.id, e.target.value)}
                            className="bg-dark-base border border-white/[0.08] rounded text-[11px] text-white/60 px-1.5 py-0.5 focus:outline-none"
                          >
                            {RELEVANCE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUnlinkPage(linkNode.id, page.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-white/20 hover:text-red-400"
                            title="Unlink"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleLinkPage(linkNode.id, page.id, "primary")}
                          className="text-[11px] px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:bg-purple-500/10 hover:border-purple-500/20 transition-all"
                        >
                          Link
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex gap-4 text-[10px] text-white/25">
                {RELEVANCE_OPTIONS.map((r) => (
                  <span key={r.value}>
                    <strong className="text-white/40">{r.label}:</strong> {r.desc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Array field helper component ── */
function ArrayField({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  accentColor,
}: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  accentColor: string;
}) {
  const [input, setInput] = useState("");
  const colorMap: Record<string, string> = {
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    red: "bg-red-500/10 border-red-500/20 text-red-300",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  };
  const chipClass = colorMap[accentColor] || colorMap.purple;

  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">{label}</label>
      <div className="flex gap-2 mt-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(input);
              setInput("");
            }
          }}
          className="flex-1 bg-dark-base rounded-lg border border-white/[0.08] text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
          placeholder={placeholder}
        />
        <button
          onClick={() => { onAdd(input); setInput(""); }}
          disabled={!input.trim()}
          className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white text-sm disabled:opacity-30"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item, i) => (
            <span key={i} className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", chipClass)}>
              {item}
              <button onClick={() => onRemove(i)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: Page Context Map
   ═══════════════════════════════════════════════════════════════ */

function PageContextSection() {
  const [pages, setPages] = useState<PageContextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ description: "", keywords: "", pageType: "page" });
  const [saving, setSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [generatingSingle, setGeneratingSingle] = useState<string | null>(null);

  // ── Bulk generate state ──
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);
  const [bulkLog, setBulkLog] = useState<{ path: string; status: "generating" | "saved" | "error"; description?: string; error?: string }[]>([]);
  const [bulkStats, setBulkStats] = useState({ total: 0, generated: 0, saved: 0, skipped: 0, errors: 0 });
  const bulkLogRef = useRef<HTMLDivElement>(null);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/page-contexts");
      const data = await res.json();
      if (data.pages) setPages(data.pages);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openEditor = (page: PageContextItem) => {
    setEditing(page.path);
    setDraft({
      description: page.description,
      keywords: page.keywords.join(", "),
      pageType: page.pageType,
    });
  };

  const saveContext = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/page-contexts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: editing,
          description: draft.description,
          keywords: draft.keywords.split(",").map((k) => k.trim()).filter(Boolean),
          pageType: draft.pageType,
        }),
      });
      if (res.ok) {
        setSavedPath(editing);
        setTimeout(() => setSavedPath(null), 2000);
        await fetchPages();
        setEditing(null);
      }
    } catch { /* silent */ }
    setSaving(false);
  };

  const resetToDefault = async (path: string) => {
    try {
      await fetch("/api/admin/seo/page-contexts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      await fetchPages();
      if (editing === path) setEditing(null);
    } catch { /* silent */ }
  };

  // ── Generate context for single page via AI ──
  const handleGenerateSingle = async (path: string, kind: string) => {
    setGeneratingSingle(path);
    try {
      const res = await fetch("/api/admin/seo/page-contexts/generate-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, kind, save: false }),
      });
      if (res.ok) {
        const data = await res.json();
        setDraft({
          description: data.description || "",
          keywords: (data.keywords || []).join(", "),
          pageType: data.pageType || kind,
        });
      }
    } catch { /* silent */ }
    setGeneratingSingle(null);
  };

  // ── Bulk generate all unconfigured pages ──
  const handleBulkGenerate = async () => {
    setBulkRunning(true);
    setBulkDone(false);
    setBulkLog([]);
    setBulkStats({ total: 0, generated: 0, saved: 0, skipped: 0, errors: 0 });

    try {
      const res = await fetch("/api/admin/seo/page-contexts/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipConfigured: true }),
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

  const filtered = pages.filter((p) =>
    !search || p.path.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const customCount = pages.filter((p) => p.source === "custom").length;
  const unconfiguredCount = pages.filter((p) => p.source === "unconfigured").length;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Page Context Map
        </h2>
        <p className="text-xs text-white/40 mt-0.5">
          Each page needs a clear description of what it covers. This is the <strong className="text-white/60">#1 signal</strong> the AI uses when generating metadata, so be specific and accurate.
        </p>
      </div>

      {/* Stats + Auto-populate button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40">
            <span className="text-white/70 font-medium">{pages.length}</span> pages total
          </span>
          <span className="text-xs text-purple-400/70">
            {customCount} configured
          </span>
          {unconfiguredCount > 0 && (
            <span className="text-xs text-amber-400/70">
              {unconfiguredCount} need context
            </span>
          )}
        </div>
        {unconfiguredCount > 0 && (
          <button
            onClick={() => { setBulkOpen(true); setBulkDone(false); setBulkRunning(false); setBulkLog([]); }}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Auto-populate with AI
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Page list */}
      <div className="space-y-2">
        {filtered.map((page) => (
          <div key={page.path}>
            {editing === page.path ? (
              /* ── Inline editor ── */
              <div className="bg-dark-elevated border border-purple-500/20 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-mono text-white/80">{page.path}</span>
                  </div>
                  <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">
                    Page Description
                    <span className="text-white/25 font-normal ml-2">2-4 sentences describing what this page covers</span>
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
                    placeholder="Describe what this page is about, what services/products it covers, who it's for…"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">
                      Page Keywords
                      <span className="text-white/25 font-normal ml-2">comma-separated</span>
                    </label>
                    <input
                      type="text"
                      value={draft.keywords}
                      onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="managed IT, IT support NJ"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Page Type</label>
                    <select
                      value={draft.pageType}
                      onChange={(e) => setDraft({ ...draft, pageType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="page">Page</option>
                      <option value="service">Service</option>
                      <option value="industry">Industry</option>
                      <option value="blog">Blog</option>
                      <option value="landing">Landing</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={saveContext}
                    disabled={saving || !draft.description.trim()}
                    className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Context
                  </button>
                  <button
                    onClick={() => handleGenerateSingle(page.path, page.pageType)}
                    disabled={generatingSingle === page.path}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors disabled:opacity-50"
                  >
                    {generatingSingle === page.path ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generatingSingle === page.path ? "Generating…" : "Generate with AI"}
                  </button>
                  {page.source === "custom" && (
                    <button
                      onClick={() => resetToDefault(page.path)}
                      className="text-xs text-white/30 hover:text-red-400 transition-colors"
                    >
                      Remove context
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ── Read-only row ── */
              <button
                onClick={() => openEditor(page)}
                className={cn(
                  "w-full text-left bg-dark-elevated border rounded-xl px-5 py-4 transition-all hover:border-white/[0.12] group",
                  savedPath === page.path
                    ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                    : page.source === "custom"
                      ? "border-purple-500/15"
                      : "border-white/[0.06]",
                )}
              >
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-white/80">{page.path}</span>
                      {page.source === "custom" && (
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-purple-400/60 bg-purple-500/10 px-1.5 py-0.5 rounded">configured</span>
                      )}
                      {page.source === "unconfigured" && (
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-400/60 bg-amber-500/10 px-1.5 py-0.5 rounded">needs context</span>
                      )}
                      {savedPath === page.path && (
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> saved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-1 line-clamp-2">
                      {page.description || <span className="italic text-white/20">No description — click to add context for better AI outputs</span>}
                    </p>
                    {page.keywords.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        <Tag className="w-3 h-3 text-white/15" />
                        {page.keywords.map((kw) => (
                          <span key={kw} className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Pencil className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 mt-0.5 shrink-0 transition-colors" />
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-purple-500/[0.04] border border-purple-500/10">
        <Info className="w-4 h-4 text-purple-400/60 mt-0.5 shrink-0" />
        <p className="text-xs text-white/40">
          <strong className="text-white/60">Tip:</strong> The more specific your page descriptions, the better the AI can differentiate between pages. Instead of &quot;IT support page&quot;, write &quot;Managed IT Support — unlimited helpdesk, network monitoring, cybersecurity, cloud management for SMBs in New Jersey.&quot;
        </p>
      </div>

      {/* ═══ Bulk Generate Modal ═══ */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-dark-elevated border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Auto-populate Page Context</h3>
                  <p className="text-[11px] text-white/40">AI-generated descriptions for unconfigured pages</p>
                </div>
              </div>
              {!bulkRunning && (
                <button onClick={() => setBulkOpen(false)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Pre-run state */}
              {!bulkRunning && !bulkDone && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-500/[0.04] border border-purple-500/10">
                    <p className="text-sm text-white/70">This will use AI to analyze each unconfigured page and generate a context description, keywords, and page type automatically.</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" />{customCount} configured — will be skipped</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" />{unconfiguredCount} pages to generate</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/25">Context is generated from your business profile, existing metadata, and URL structure. Each page takes ~2-3 seconds. You can review and edit results afterward.</p>
                  <button
                    onClick={handleBulkGenerate}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Context for {unconfiguredCount} Pages
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
                        {bulkDone ? "Complete" : "Analyzing pages…"}
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
                        <span>{bulkStats.skipped} configured pages skipped</span>
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
                          {entry.status === "saved" && entry.description && (
                            <p className="text-[11px] text-white/30 mt-0.5 truncate">{entry.description}</p>
                          )}
                          {entry.status === "error" && entry.error && (
                            <p className="text-[11px] text-red-400/60 mt-0.5">{entry.error}</p>
                          )}
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {entry.status === "saved" && <span className="text-[9px] text-emerald-400/60 uppercase font-medium">saved</span>}
                          {entry.status === "generating" && <span className="text-[9px] text-purple-400/60 uppercase font-medium">analyzing</span>}
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

/* ═══════════════════════════════════════════════════════════════
   SECTION: Strategy Documents
   ═══════════════════════════════════════════════════════════════ */

interface StrategyDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  version: number;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

const STRATEGY_CATEGORIES = [
  { key: "keyword_strategy", label: "Keyword Strategy", icon: Target, color: "text-seed-400" },
  { key: "content_roadmap", label: "Content Roadmap", icon: FileText, color: "text-blue-400" },
  { key: "audit_findings", label: "Audit Findings", icon: BarChart3, color: "text-amber-400" },
  { key: "competitive_analysis", label: "Competitive Analysis", icon: Crosshair, color: "text-red-400" },
  { key: "general", label: "General", icon: ScrollText, color: "text-purple-400" },
];

function StrategyDocsSection() {
  const [docs, setDocs] = useState<StrategyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StrategyDoc | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formContent, setFormContent] = useState("");
  const [formActive, setFormActive] = useState(true);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/strategy-docs?active=false");
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch { /* skip */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const resetForm = () => {
    setFormTitle("");
    setFormCategory("general");
    setFormContent("");
    setFormActive(true);
    setEditing(null);
    setCreating(false);
  };

  const startEdit = (doc: StrategyDoc) => {
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormContent(doc.content);
    setFormActive(doc.isActive);
    setEditing(doc);
    setCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setCreating(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    setSaving(true);

    try {
      if (editing) {
        await fetch(`/api/admin/seo/strategy-docs/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            category: formCategory,
            content: formContent,
            isActive: formActive,
          }),
        });
      } else {
        await fetch("/api/admin/seo/strategy-docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            category: formCategory,
            content: formContent,
            isActive: formActive,
            source: "manual",
          }),
        });
      }
      resetForm();
      await fetchDocs();
    } catch { /* skip */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this strategy document?")) return;
    try {
      await fetch(`/api/admin/seo/strategy-docs/${id}`, { method: "DELETE" });
      await fetchDocs();
    } catch { /* skip */ }
  };

  const toggleActive = async (doc: StrategyDoc) => {
    try {
      await fetch(`/api/admin/seo/strategy-docs/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !doc.isActive }),
      });
      await fetchDocs();
    } catch { /* skip */ }
  };

  const getCategoryMeta = (cat: string) =>
    STRATEGY_CATEGORIES.find((c) => c.key === cat) || STRATEGY_CATEGORIES[4];

  const isFormOpen = creating || editing;
  const activeDocs = docs.filter((d) => d.isActive);
  const inactiveDocs = docs.filter((d) => !d.isActive);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">SEO Strategy Documents</h2>
          <p className="text-sm text-white/40 mt-0.5">
            Persistent strategy context that feeds into every AI prompt — blog writer, metadata, keyword research, and advisor.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Strategy Doc
          </button>
        )}
      </div>

      {/* Active indicator */}
      <div className="flex items-center gap-3 text-[11px] text-white/30">
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
          <span>{activeDocs.length} active {activeDocs.length === 1 ? "doc" : "docs"} feeding AI prompts</span>
        </span>
        {inactiveDocs.length > 0 && (
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span>{inactiveDocs.length} inactive</span>
          </span>
        )}
      </div>

      {/* Create / Edit Form */}
      {isFormOpen && (
        <div className="bg-dark-elevated border border-white/[0.08] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {editing ? `Editing: ${editing.title}` : "New Strategy Document"}
            </h3>
            <button onClick={resetForm} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-seed-500/50"
              placeholder="e.g., Reactive Keyword Strategy — Managed IT"
            />
          </div>

          {/* Category + Active */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-white/50 mb-1.5 block">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white focus:outline-none focus:border-seed-500/50"
              >
                {STRATEGY_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-white/20 bg-transparent text-seed-500 focus:ring-seed-500/30 w-4 h-4"
                />
                <span className="text-xs text-white/50">Active (feeds AI prompts)</span>
              </label>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">
              Content <span className="text-white/25 font-normal">(Markdown supported)</span>
            </label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-seed-500/50 font-mono leading-relaxed min-h-[300px] resize-y"
              placeholder="Write the strategy narrative in Markdown. This will be injected into every AI prompt across the platform — metadata generation, blog writing, keyword research, etc."
            />
          </div>

          {/* Save */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={resetForm}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formTitle.trim() || !formContent.trim()}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editing ? "Update" : "Create"} Document
            </button>
          </div>
        </div>
      )}

      {/* Documents list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
        </div>
      ) : docs.length === 0 && !isFormOpen ? (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
          <ScrollText className="w-8 h-8 text-purple-400/20 mx-auto mb-3" />
          <p className="text-sm text-white/30 mb-1">No strategy documents yet</p>
          <p className="text-xs text-white/20 max-w-md mx-auto">
            Strategy documents persist your SEO thinking — keyword rationale, audit findings, content roadmaps, competitive analysis.
            Every active document feeds into all AI-generated content.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => {
            const catMeta = getCategoryMeta(doc.category);
            const CatIcon = catMeta.icon;
            const isExpanded = expandedId === doc.id;

            return (
              <div
                key={doc.id}
                className={cn(
                  "bg-dark-elevated border rounded-xl overflow-hidden transition-all",
                  doc.isActive ? "border-white/[0.08]" : "border-white/[0.04] opacity-60",
                )}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                >
                  <CatIcon className={cn("w-4 h-4 shrink-0", catMeta.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{doc.title}</span>
                      <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                        doc.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/[0.03] text-white/30 border-white/[0.06]",
                      )}>
                        {doc.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-[10px] text-white/20">v{doc.version}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-white/25">{catMeta.label}</span>
                      <span className="text-[11px] text-white/15">
                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                      {doc.source && (
                        <span className="text-[11px] text-white/15">via {doc.source}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(doc); }}
                      className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.05] transition-colors"
                      title={doc.isActive ? "Deactivate" : "Activate"}
                    >
                      {doc.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(doc); }}
                      className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.05] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="p-1.5 rounded-lg text-white/25 hover:text-red-400/70 hover:bg-red-500/[0.05] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-white/[0.04]">
                    <pre className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap font-sans mt-3 max-h-[500px] overflow-y-auto">
                      {doc.content}
                    </pre>
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

/* ═══════════════════════════════════════════════════════════════
   SECTION: AI Preview
   ═══════════════════════════════════════════════════════════════ */

function PreviewSection() {
  const [selectedPath, setSelectedPath] = useState("/");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<{ path: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/seo/page-contexts")
      .then((r) => r.json())
      .then((d) => { if (d.pages) setPages(d.pages); })
      .catch(() => {});
  }, []);

  const generatePreview = async () => {
    setLoading(true);
    setPreview(null);
    try {
      const res = await fetch("/api/admin/seo/context-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedPath }),
      });
      const data = await res.json();
      setPreview(data.prompt || "Failed to generate preview");
    } catch {
      setPreview("Error loading preview");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Context Preview
        </h2>
        <p className="text-xs text-white/40 mt-0.5">
          See exactly what the AI receives when generating metadata for a specific page. Use this to debug and improve your context.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-white/50 mb-1.5 block">Select a page</label>
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-dark-base text-sm text-white focus:outline-none focus:border-purple-500/50"
          >
            {pages.map((p) => (
              <option key={p.path} value={p.path}>{p.path}</option>
            ))}
          </select>
        </div>
        <button
          onClick={generatePreview}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Preview
        </button>
      </div>

      {preview && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400/60" />
            <span className="text-xs font-medium text-white/50">Full AI prompt for <span className="font-mono text-white/70">{selectedPath}</span></span>
          </div>
          <pre className="p-4 text-xs text-white/50 overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto font-mono leading-relaxed">
            {preview}
          </pre>
        </div>
      )}

      {!preview && !loading && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-12 text-center">
          <Brain className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/30">Select a page and click &quot;Generate Preview&quot; to see the full AI prompt</p>
        </div>
      )}
    </div>
  );
}
