"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Building2,
  Briefcase,
  Globe,
  Shield,
  MessageSquare,
  Check,
  X,
  AlertTriangle,
  Link2,
  Maximize2,
  Minimize2,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface LinkedPage {
  id: string;
  relevance: string;
  pageContext: { id?: string; path: string; pageType: string };
}

interface ContextNodeData {
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
  linkedPages: LinkedPage[];
  posX: number;
  posY: number;
  updatedAt: string;
  [key: string]: unknown;
}

interface CanvasViewProps {
  nodes: ContextNodeData[];
  allPages: { id: string; path: string; pageType: string }[];
  onEditNode: (node: ContextNodeData) => void;
  onLinkNode: (nodeId: string) => void;
  onPositionsChange: (positions: { id: string; posX: number; posY: number }[]) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   Custom Node Components
   ═══════════════════════════════════════════════════════════════ */

/** Root business node — larger, indigo accent */
function BusinessNode({ data }: NodeProps<Node<ContextNodeData>>) {
  const d = data as unknown as ContextNodeData & { onEdit: () => void };
  return (
    <div
      className="group rounded-xl border border-indigo-500/30 bg-[#1a1a2e] shadow-lg shadow-indigo-500/5 min-w-[280px] max-w-[320px] cursor-pointer transition-all hover:border-indigo-400/50 hover:shadow-indigo-500/10"
      onDoubleClick={d.onEdit}
    >
      {/* Top color bar */}
      <div className="h-1.5 rounded-t-xl" style={{ backgroundColor: d.color }} />

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${d.color}20` }}
          >
            <Building2 className="w-5 h-5" style={{ color: d.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{d.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-indigo-300/40">Root • Business Identity</p>
          </div>
        </div>

        <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">{d.summary}</p>

        {/* Stats */}
        <div className="flex items-center gap-2.5 text-[10px] text-white/25">
          {d.usps.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5" /> {d.usps.length} USPs
            </span>
          )}
          {d.messaging && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="w-2.5 h-2.5" /> Voice
            </span>
          )}
          {d.doSay.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5 text-green-500/50" /> {d.doSay.length}
            </span>
          )}
          {d.dontSay.length > 0 && (
            <span className="flex items-center gap-0.5">
              <X className="w-2.5 h-2.5 text-red-500/50" /> {d.dontSay.length}
            </span>
          )}
        </div>
      </div>

      {/* Bottom handle — connects to service nodes */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500/60 !border-2 !border-indigo-400/30 !-bottom-1.5"
      />
    </div>
  );
}

/** Service node — standard card */
function ServiceNode({ data }: NodeProps<Node<ContextNodeData>>) {
  const d = data as unknown as ContextNodeData & { onEdit: () => void; onLink: () => void };
  return (
    <div
      className="group rounded-xl border border-white/[0.08] bg-[#1a1a2e] shadow-lg shadow-black/20 min-w-[240px] max-w-[280px] cursor-pointer transition-all hover:border-white/[0.15] hover:shadow-black/30"
      onDoubleClick={d.onEdit}
    >
      {/* Top handle — connects from business */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-white/20 !border-2 !border-white/10 !-top-1.5"
      />

      {/* Color bar */}
      <div className="h-1 rounded-t-xl" style={{ backgroundColor: d.color }} />

      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${d.color}20` }}
            >
              <Briefcase className="w-3.5 h-3.5" style={{ color: d.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{d.name}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/25">{d.nodeType}</p>
            </div>
          </div>

          {/* Quick link button */}
          <button
            onClick={(e) => { e.stopPropagation(); d.onLink(); }}
            className="p-1 rounded hover:bg-white/[0.06] text-white/20 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Link pages"
          >
            <Link2 className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[10px] text-white/35 line-clamp-2 leading-relaxed">{d.summary}</p>

        {/* Stats */}
        <div className="flex items-center gap-2 text-[9px] text-white/20">
          {d.usps.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5" /> {d.usps.length}
            </span>
          )}
          {d.doSay.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5 text-green-500/40" /> {d.doSay.length}
            </span>
          )}
          {d.dontSay.length > 0 && (
            <span className="flex items-center gap-0.5">
              <X className="w-2.5 h-2.5 text-red-500/40" /> {d.dontSay.length}
            </span>
          )}
        </div>

        {/* Linked pages chips */}
        {d.linkedPages.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {d.linkedPages.slice(0, 4).map((lp) => (
              <span
                key={lp.id}
                className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded-full border",
                  lp.relevance === "primary"
                    ? "bg-purple-500/10 border-purple-500/20 text-purple-300/70"
                    : lp.relevance === "secondary"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-300/70"
                      : "bg-white/[0.03] border-white/[0.05] text-white/25"
                )}
              >
                {lp.pageContext.path}
              </span>
            ))}
            {d.linkedPages.length > 4 && (
              <span className="text-[8px] text-white/20">+{d.linkedPages.length - 4}</span>
            )}
          </div>
        ) : (
          <p className="text-[9px] text-amber-500/40 flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" /> No pages linked
          </p>
        )}
      </div>

      {/* Bottom handle — connects to page nodes */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-white/20 !border-2 !border-white/10 !-bottom-1.5"
      />
    </div>
  );
}

/** Page leaf node — small pill */
function PageNode({ data }: NodeProps<Node<{ path: string; pageType: string; relevance: string; serviceColor: string }>>) {
  const d = data as unknown as { path: string; pageType: string; relevance: string; serviceColor: string };
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#141420] px-3 py-2 min-w-[160px] max-w-[200px]">
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-white/15 !border !border-white/10 !-top-1"
      />

      <div className="flex items-center gap-2">
        <Globe className="w-3 h-3 text-white/20 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-white/50 truncate">{d.path}</p>
          <p className="text-[8px] text-white/20">{d.pageType}</p>
        </div>
      </div>

      {/* Relevance badge */}
      <div className="mt-1">
        <span
          className={cn(
            "text-[8px] px-1.5 py-0.5 rounded-full border",
            d.relevance === "primary"
              ? "bg-purple-500/10 border-purple-500/20 text-purple-300/60"
              : d.relevance === "secondary"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-300/60"
                : "bg-white/[0.03] border-white/[0.05] text-white/25"
          )}
        >
          {d.relevance}
        </span>
      </div>
    </div>
  );
}

const nodeTypes = {
  business: BusinessNode,
  service: ServiceNode,
  page: PageNode,
};

/* ═══════════════════════════════════════════════════════════════
   Layout Helper — auto-arrange when no saved positions
   ═══════════════════════════════════════════════════════════════ */

function autoLayout(
  contextNodes: ContextNodeData[],
  onEdit: (node: ContextNodeData) => void,
  onLink: (nodeId: string) => void,
): { nodes: Node[]; edges: Edge[] } {
  const rfNodes: Node[] = [];
  const rfEdges: Edge[] = [];

  const businessNode = contextNodes.find((n) => n.nodeType === "business");
  const serviceNodes = contextNodes.filter((n) => n.nodeType !== "business");

  // Check if positions have been saved (any non-zero position)
  const hasSavedPositions = contextNodes.some((n) => n.posX !== 0 || n.posY !== 0);

  // ── Business node ──
  if (businessNode) {
    const bx = hasSavedPositions ? businessNode.posX : 400;
    const by = hasSavedPositions ? businessNode.posY : 40;

    rfNodes.push({
      id: businessNode.id,
      type: "business",
      position: { x: bx, y: by },
      data: { ...businessNode, onEdit: () => onEdit(businessNode) },
      draggable: true,
    });
  }

  // ── Service nodes ──
  const serviceSpacing = 320;
  const totalServiceWidth = serviceNodes.length * serviceSpacing;
  const startX = hasSavedPositions ? 0 : 400 - totalServiceWidth / 2 + serviceSpacing / 2;

  serviceNodes.forEach((sNode, i) => {
    const sx = hasSavedPositions ? sNode.posX : startX + i * serviceSpacing;
    const sy = hasSavedPositions ? sNode.posY : 260;

    rfNodes.push({
      id: sNode.id,
      type: "service",
      position: { x: sx, y: sy },
      data: {
        ...sNode,
        onEdit: () => onEdit(sNode),
        onLink: () => onLink(sNode.id),
      },
      draggable: true,
    });

    // Edge: business → service
    if (businessNode) {
      rfEdges.push({
        id: `e-${businessNode.id}-${sNode.id}`,
        source: businessNode.id,
        target: sNode.id,
        type: "smoothstep",
        animated: false,
        style: { stroke: sNode.color, strokeWidth: 1.5, strokeOpacity: 0.3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: sNode.color,
          width: 12,
          height: 12,
        },
      });
    }

    // ── Page leaf nodes for this service ──
    const pageSpacing = 220;
    const pageTotalWidth = sNode.linkedPages.length * pageSpacing;
    const pageStartX = hasSavedPositions ? sx : sx - pageTotalWidth / 2 + pageSpacing / 2;

    sNode.linkedPages.forEach((lp, pi) => {
      const pageId = `page-${sNode.id}-${lp.pageContext.path}`;
      const px = hasSavedPositions ? pageStartX + pi * pageSpacing : pageStartX + pi * pageSpacing;
      const py = hasSavedPositions ? sy + 220 : sy + 220;

      // Don't duplicate page nodes — check if we already have one for this path
      const existingPageNode = rfNodes.find((n) => n.id === pageId);
      if (!existingPageNode) {
        rfNodes.push({
          id: pageId,
          type: "page",
          position: { x: px, y: py },
          data: {
            path: lp.pageContext.path,
            pageType: lp.pageContext.pageType,
            relevance: lp.relevance,
            serviceColor: sNode.color,
          },
          draggable: true,
        });
      }

      // Edge: service → page
      const edgeColor =
        lp.relevance === "primary" ? "#a855f7" :
        lp.relevance === "secondary" ? "#3b82f6" :
        "#525252";

      rfEdges.push({
        id: `e-${sNode.id}-${pageId}`,
        source: sNode.id,
        target: pageId,
        type: "smoothstep",
        animated: lp.relevance === "primary",
        style: {
          stroke: edgeColor,
          strokeWidth: lp.relevance === "primary" ? 1.5 : 1,
          strokeOpacity: lp.relevance === "mention" ? 0.2 : 0.4,
          strokeDasharray: lp.relevance === "mention" ? "4 4" : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 10,
          height: 10,
        },
        label: lp.relevance === "primary" ? "" : lp.relevance,
        labelStyle: { fontSize: 9, fill: "#525252" },
        labelBgStyle: { fill: "#0d0d14", fillOpacity: 0.8 },
      });
    });
  });

  return { nodes: rfNodes, edges: rfEdges };
}

/* ═══════════════════════════════════════════════════════════════
   Main Canvas Component
   ═══════════════════════════════════════════════════════════════ */

export default function CanvasView({
  nodes: contextNodes,
  allPages: _allPages,
  onEditNode,
  onLinkNode,
  onPositionsChange,
  expanded,
  onToggleExpand,
}: CanvasViewProps) {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionsRef = useRef<Map<string, { posX: number; posY: number }>>(new Map());

  // Build initial layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => autoLayout(contextNodes, onEditNode, onLinkNode),
    [contextNodes, onEditNode, onLinkNode],
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, setRfEdges] = useEdgesState(initialEdges);

  // Sync when contextNodes change (e.g. after CRUD)
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = autoLayout(contextNodes, onEditNode, onLinkNode);
    setRfNodes(newNodes);
    setRfEdges(newEdges);
  }, [contextNodes, onEditNode, onLinkNode, setRfNodes, setRfEdges]);

  // Handle node drag — debounce save positions
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      // Track position changes
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          const nodeId = change.id;
          // Only save context node positions (not page leaf nodes)
          if (!nodeId.startsWith("page-")) {
            positionsRef.current.set(nodeId, {
              posX: change.position.x,
              posY: change.position.y,
            });
          }
        }
      }

      // Debounce save
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        if (positionsRef.current.size > 0) {
          const positions = Array.from(positionsRef.current.entries()).map(
            ([id, pos]) => ({ id, ...pos }),
          );
          onPositionsChange(positions);
          positionsRef.current.clear();
        }
      }, 1000);
    },
    [onNodesChange, onPositionsChange],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // ESC to exit fullscreen
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggleExpand();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded, onToggleExpand]);

  const canvasContent = (
    <div
      className={cn(
        "w-full rounded-xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden relative",
        expanded
          ? "fixed inset-0 z-50 rounded-none border-0"
          : "h-[calc(100vh-20rem)]"
      )}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={handleNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        className="context-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#ffffff08"
        />
        <Controls
          className="!bg-[#1a1a2e] !border-white/[0.08] !rounded-lg !shadow-lg [&>button]:!bg-transparent [&>button]:!border-white/[0.06] [&>button]:!text-white/40 [&>button:hover]:!bg-white/[0.04] [&>button:hover]:!text-white/60 [&>button]:!w-7 [&>button]:!h-7"
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap
          className="!bg-[#1a1a2e] !border-white/[0.08] !rounded-lg"
          nodeColor={(node) => {
            if (node.type === "business") return "#6366f1";
            if (node.type === "page") return "#525252";
            const d = node.data as unknown as ContextNodeData;
            return d?.color || "#a855f7";
          }}
          maskColor="rgba(0,0,0,0.6)"
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Expand / Collapse button — top right */}
      <button
        onClick={onToggleExpand}
        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-[#1a1a2e]/90 backdrop-blur-sm border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-[#1a1a2e] transition-all"
        title={expanded ? "Exit fullscreen" : "Fullscreen"}
      >
        {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Legend — top left */}
      <div className="absolute top-3 left-3 z-10 bg-[#1a1a2e]/90 backdrop-blur-sm border border-white/[0.06] rounded-lg px-3 py-2 space-y-1">
        <p className="text-[9px] uppercase tracking-wider text-white/25 font-semibold">Edges</p>
        <div className="flex items-center gap-3 text-[9px] text-white/30">
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-purple-500 rounded" /> Primary
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-blue-500 rounded" /> Secondary
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-white/20 rounded" /> Mention
          </span>
        </div>
        <p className="text-[9px] text-white/20">Double-click a node to edit</p>
      </div>

      {/* Expanded header bar */}
      {expanded && (
        <div className="absolute top-14 left-3 z-10 flex items-center gap-2 bg-[#1a1a2e]/90 backdrop-blur-sm border border-white/[0.06] rounded-lg px-3 py-2">
          <Boxes className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium text-white/60">Context Canvas</span>
          <span className="text-[10px] text-white/25 ml-1">ESC to exit</span>
        </div>
      )}
    </div>
  );

  return canvasContent;
}
