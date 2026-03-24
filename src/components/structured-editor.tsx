"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Minus,
  Quote,
  Code,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

/* ── Block Types ── */
export type BlockType = "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "table" | "hr" | "blockquote" | "code" | "faq-q" | "faq-a";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

const BLOCK_CONFIG: Record<BlockType, { label: string; color: string; icon: React.ReactNode; placeholder: string }> = {
  h1:         { label: "h1",         color: "bg-blue-500/80",    icon: <Heading1 className="w-3 h-3" />, placeholder: "Main heading…" },
  h2:         { label: "h2",         color: "bg-blue-500/60",    icon: <Heading2 className="w-3 h-3" />, placeholder: "Section heading…" },
  h3:         { label: "h3",         color: "bg-blue-500/40",    icon: <Heading3 className="w-3 h-3" />, placeholder: "Sub-heading…" },
  p:          { label: "p",          color: "bg-seed-500/60",    icon: <Type className="w-3 h-3" />,     placeholder: "Paragraph text…" },
  ul:         { label: "ul",         color: "bg-purple-500/60",  icon: <List className="w-3 h-3" />,     placeholder: "- Item 1\n- Item 2\n- Item 3" },
  ol:         { label: "ol",         color: "bg-purple-500/60",  icon: <ListOrdered className="w-3 h-3" />, placeholder: "1. First step\n2. Second step\n3. Third step" },
  table:      { label: "table",      color: "bg-orange-500/60",  icon: <Table className="w-3 h-3" />,    placeholder: "| Column 1 | Column 2 |\n|---|---|\n| Cell | Cell |" },
  hr:         { label: "hr",         color: "bg-white/20",       icon: <Minus className="w-3 h-3" />,    placeholder: "" },
  blockquote: { label: "quote",      color: "bg-yellow-500/60",  icon: <Quote className="w-3 h-3" />,    placeholder: "Quote text…" },
  code:       { label: "code",       color: "bg-emerald-500/60", icon: <Code className="w-3 h-3" />,     placeholder: "Code block content…" },
  "faq-q":    { label: "faq-q",      color: "bg-cyan-500/60",    icon: <Heading3 className="w-3 h-3" />, placeholder: "FAQ question?" },
  "faq-a":    { label: "faq-a",      color: "bg-cyan-500/40",    icon: <Type className="w-3 h-3" />,     placeholder: "FAQ answer…" },
};

const TYPE_OPTIONS: { type: BlockType; label: string }[] = [
  { type: "h1", label: "Heading 1" },
  { type: "h2", label: "Heading 2" },
  { type: "h3", label: "Heading 3" },
  { type: "p", label: "Paragraph" },
  { type: "ul", label: "Bullet List" },
  { type: "ol", label: "Numbered List" },
  { type: "table", label: "Table" },
  { type: "blockquote", label: "Blockquote" },
  { type: "code", label: "Code Block" },
  { type: "hr", label: "Divider" },
  { type: "faq-q", label: "FAQ Question" },
  { type: "faq-a", label: "FAQ Answer" },
];

let _blockId = 0;
function newId() { return `blk_${++_blockId}_${Date.now()}`; }

/* ── Markdown → Blocks Parser ── */
export function parseMarkdownToBlocks(md: string): ContentBlock[] {
  if (!md || !md.trim()) return [{ id: newId(), type: "p", content: "" }];

  const lines = md.split("\n");
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed)) {
      blocks.push({ id: newId(), type: "hr", content: "---" });
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      const type: BlockType = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      blocks.push({ id: newId(), type, content: headingMatch[2] });
      i++;
      continue;
    }

    // Table (starts with |)
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trimEnd().startsWith("|")) {
        tableLines.push(lines[i].trimEnd());
        i++;
      }
      blocks.push({ id: newId(), type: "table", content: tableLines.join("\n") });
      continue;
    }

    // Code block (```)
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      const lang = trimmed.slice(3).trim();
      i++;
      while (i < lines.length && !lines[i].trimEnd().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      const content = lang ? `\`\`\`${lang}\n${codeLines.join("\n")}\n\`\`\`` : codeLines.join("\n");
      blocks.push({ id: newId(), type: "code", content });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trimEnd().startsWith("> ")) {
        quoteLines.push(lines[i].trimEnd().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ id: newId(), type: "blockquote", content: quoteLines.join("\n") });
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(trimmed)) {
      const listLines: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trimEnd())) {
        listLines.push(lines[i].trimEnd());
        i++;
      }
      blocks.push({ id: newId(), type: "ul", content: listLines.join("\n") });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const listLines: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trimEnd())) {
        listLines.push(lines[i].trimEnd());
        i++;
      }
      blocks.push({ id: newId(), type: "ol", content: listLines.join("\n") });
      continue;
    }

    // Empty lines — skip
    if (!trimmed) {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trimEnd() !== "" &&
      !/^(#{1,3}\s|[-*+]\s|\d+\.\s|>\s|\||```|-{3,}|\*{3,}|_{3,})/.test(lines[i].trimEnd())
    ) {
      paraLines.push(lines[i].trimEnd());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ id: newId(), type: "p", content: paraLines.join("\n") });
    }
  }

  return blocks.length > 0 ? blocks : [{ id: newId(), type: "p", content: "" }];
}

/* ── Blocks → Markdown Serializer ── */
export function serializeBlocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h1": return `# ${block.content}`;
        case "h2": return `## ${block.content}`;
        case "h3": return `### ${block.content}`;
        case "p": return block.content;
        case "ul": return block.content;
        case "ol": return block.content;
        case "table": return block.content;
        case "hr": return "---";
        case "blockquote": return block.content.split("\n").map((l) => `> ${l}`).join("\n");
        case "code":
          if (block.content.startsWith("```")) return block.content;
          return `\`\`\`\n${block.content}\n\`\`\``;
        case "faq-q": return `### ${block.content}`;
        case "faq-a": return block.content;
        default: return block.content;
      }
    })
    .join("\n\n");
}

/* ── Single Block Component ── */
function BlockEditor({
  block,
  index,
  total,
  focused,
  onUpdate,
  onChangeType,
  onDelete,
  onMoveUp,
  onMoveDown,
  onFocus,
  onAddAfter,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  focused: boolean;
  onUpdate: (content: string) => void;
  onChangeType: (type: BlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onFocus: () => void;
  onAddAfter: () => void;
}) {
  const config = BLOCK_CONFIG[block.type];
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(el.scrollHeight, 36)}px`;
    }
  }, [block.content, block.type]);

  // Close type menu on outside click
  useEffect(() => {
    if (!showTypeMenu) return;
    const handler = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setShowTypeMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTypeMenu]);

  const isMultiline = ["ul", "ol", "table", "code", "blockquote"].includes(block.type);

  // Font sizing per block type
  const textClasses: Record<string, string> = {
    h1: "text-xl font-bold text-white",
    h2: "text-lg font-semibold text-white",
    h3: "text-base font-semibold text-white/90",
    p: "text-sm text-white/70 leading-relaxed",
    ul: "text-sm text-white/70 font-mono leading-relaxed",
    ol: "text-sm text-white/70 font-mono leading-relaxed",
    table: "text-xs text-white/70 font-mono leading-relaxed",
    hr: "text-white/20",
    blockquote: "text-sm text-white/60 italic leading-relaxed",
    code: "text-xs text-emerald-300/80 font-mono leading-relaxed",
    "faq-q": "text-base font-semibold text-cyan-300/90",
    "faq-a": "text-sm text-white/70 leading-relaxed",
  };

  if (block.type === "hr") {
    return (
      <div
        className={`group relative flex items-center gap-3 py-2 px-2 rounded-lg transition-colors ${focused ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
        onClick={onFocus}
      >
        {/* Grip + badge */}
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-white/15 cursor-grab" />
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shrink-0 ${config.color}`}>
          {config.icon}{config.label}
        </span>
        <div className="flex-1 border-t border-white/[0.08]" />
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDelete} className="p-1 text-white/20 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-start gap-3 py-2 px-2 rounded-lg transition-colors ${focused ? "bg-white/[0.03] ring-1 ring-white/[0.06]" : "hover:bg-white/[0.02]"}`}
      onClick={onFocus}
    >
      {/* Left: Grip + reorder */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3.5 h-3.5 text-white/15 cursor-grab" />
        <button onClick={onMoveUp} disabled={index === 0} className="p-0.5 text-white/15 hover:text-white/40 disabled:opacity-0 transition-colors">
          <ArrowUp className="w-3 h-3" />
        </button>
        <button onClick={onMoveDown} disabled={index === total - 1} className="p-0.5 text-white/15 hover:text-white/40 disabled:opacity-0 transition-colors">
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      {/* Tag badge (clickable to change type) */}
      <div className="relative shrink-0 pt-0.5" ref={typeMenuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowTypeMenu(!showTypeMenu); }}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider transition-all hover:ring-1 hover:ring-white/20 ${config.color}`}
        >
          {config.icon}{config.label}
          <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-50" />
        </button>

        {/* Type dropdown */}
        {showTypeMenu && (
          <div className="absolute z-50 top-full left-0 mt-1 w-44 bg-dark-elevated border border-white/[0.1] rounded-lg shadow-xl py-1 max-h-64 overflow-y-auto">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeType(opt.type);
                  setShowTypeMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${block.type === opt.type ? "text-seed-400 bg-seed-500/10" : "text-white/60 hover:text-white hover:bg-white/[0.04]"}`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold text-white ${BLOCK_CONFIG[opt.type].color}`}>
                  {BLOCK_CONFIG[opt.type].icon}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content editor */}
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => onUpdate(e.target.value)}
          onFocus={onFocus}
          placeholder={config.placeholder}
          rows={isMultiline ? 3 : 1}
          className={`w-full bg-transparent border-0 outline-none resize-none placeholder:text-white/15 ${textClasses[block.type] || textClasses.p}`}
          style={{ overflow: "hidden" }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0.5 shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onAddAfter(); }}
          className="p-1 text-white/20 hover:text-seed-400 transition-colors"
          title="Add block below"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-white/20 hover:text-red-400 transition-colors"
          title="Delete block"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Add Block Button ── */
function AddBlockButton({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/[0.06] text-white/20 hover:text-white/40 hover:border-white/[0.12] transition-colors text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        Add section
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-dark-elevated border border-white/[0.1] rounded-lg shadow-xl py-1 max-h-72 overflow-y-auto">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                onAdd(opt.type);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] text-left transition-colors"
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold text-white ${BLOCK_CONFIG[opt.type].color}`}>
                {BLOCK_CONFIG[opt.type].icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Structured Editor ── */
interface StructuredEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function StructuredEditor({ markdown, onChange }: StructuredEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseMarkdownToBlocks(markdown));
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"blocks" | "raw">("blocks");

  // Sync markdown → blocks when markdown changes externally (e.g. rewrite)
  const lastMarkdownRef = useRef(markdown);
  useEffect(() => {
    if (markdown !== lastMarkdownRef.current) {
      setBlocks(parseMarkdownToBlocks(markdown));
      lastMarkdownRef.current = markdown;
    }
  }, [markdown]);

  // Sync blocks → markdown
  const syncToMarkdown = useCallback(
    (newBlocks: ContentBlock[]) => {
      const md = serializeBlocksToMarkdown(newBlocks);
      lastMarkdownRef.current = md;
      onChange(md);
    },
    [onChange]
  );

  const updateBlock = useCallback((id: string, content: string) => {
    setBlocks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, content } : b));
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    setBlocks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, type } : b));
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (next.length === 0) next.push({ id: newId(), type: "p", content: "" });
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const addBlockAfter = useCallback((afterId: string | null, type: BlockType = "p") => {
    setBlocks((prev) => {
      const newBlock: ContentBlock = { id: newId(), type, content: "" };
      if (!afterId) return [...prev, newBlock];
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      setFocusedId(newBlock.id);
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const addBlockAtEnd = useCallback((type: BlockType) => {
    setBlocks((prev) => {
      const newBlock: ContentBlock = { id: newId(), type, content: "" };
      const next = [...prev, newBlock];
      setFocusedId(newBlock.id);
      syncToMarkdown(next);
      return next;
    });
  }, [syncToMarkdown]);

  const wordCount = blocks.reduce((sum, b) => {
    return sum + b.content.replace(/[#*_\[\]()>`~|\-]/g, "").split(/\s+/).filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/40">
          Body (markdown) – {wordCount} words
        </label>
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("blocks")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${viewMode === "blocks" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/50"}`}
          >
            Blocks
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${viewMode === "raw" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/50"}`}
          >
            Raw
          </button>
        </div>
      </div>

      {viewMode === "blocks" ? (
        <div className="bg-dark-base border border-white/[0.08] rounded-xl p-3 space-y-0.5 min-h-[400px]">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              focused={focusedId === block.id}
              onUpdate={(content) => updateBlock(block.id, content)}
              onChangeType={(type) => changeBlockType(block.id, type)}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, "up")}
              onMoveDown={() => moveBlock(block.id, "down")}
              onFocus={() => setFocusedId(block.id)}
              onAddAfter={() => addBlockAfter(block.id)}
            />
          ))}

          {/* Add section at bottom */}
          <div className="pt-2">
            <AddBlockButton onAdd={addBlockAtEnd} />
          </div>
        </div>
      ) : (
        <textarea
          value={markdown}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          rows={30}
          className="w-full rounded-xl bg-dark-base border border-white/[0.08] px-4 py-3 text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-seed-500/50 transition-colors resize-y"
        />
      )}
    </div>
  );
}
