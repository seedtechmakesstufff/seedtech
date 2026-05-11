"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Bot,
  ChevronRight,
  Loader2,
  Sparkles,
  Database,
  HardDrive,
  SlidersHorizontal,
} from "lucide-react";
import { AGENT_CONFIGS } from "@/lib/agent-configs";

interface AgentDef {
  key: string;
  label: string;
  description: string;
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  cadence: string;
}

interface Props {
  agent: AgentDef | null;
  onClose: () => void;
}

export function AgentDetailModal({ agent, onClose }: Props) {
  const [tuneRequest, setTuneRequest] = useState("");
  const [tuning, setTuning] = useState(false);
  const [tuneSuggestion, setTuneSuggestion] = useState<string | null>(null);
  const [tuneError, setTuneError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when agent changes
  useEffect(() => {
    setTuneRequest("");
    setTuneSuggestion(null);
    setTuneError(null);
  }, [agent?.key]);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!agent) return null;

  const config = AGENT_CONFIGS[agent.key];
  const Icon = agent.icon ?? Bot;

  const handleTune = async () => {
    if (!tuneRequest.trim()) return;
    setTuning(true);
    setTuneSuggestion(null);
    setTuneError(null);
    try {
      const r = await fetch(`/api/admin/agents/${agent.key}/tune`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: tuneRequest }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Failed");
      setTuneSuggestion(j.suggestion as string);
    } catch (e) {
      setTuneError(e instanceof Error ? e.message : "Failed");
    } finally {
      setTuning(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm"
    >
      <div className="h-full w-full max-w-2xl bg-dark-base border-l border-white/[0.08] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06] shrink-0">
          <div className="w-9 h-9 rounded-lg bg-seed-500/10 flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-seed-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">{agent.label}</h2>
            <p className="text-[11px] text-white/40">{agent.cadence}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Overview */}
          <section className="space-y-3">
            <SectionHeading icon={Bot} label="Overview" />
            <p className="text-sm text-white/60 leading-relaxed">
              {config?.what ?? agent.description}
            </p>
          </section>

          {/* Reads / Writes */}
          {config && (
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                  <Database className="w-3 h-3" /> Reads
                </p>
                <ul className="space-y-1.5">
                  {config.reads.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-white/60">
                      <ChevronRight className="w-3 h-3 text-white/20 mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                  <HardDrive className="w-3 h-3" /> Writes
                </p>
                <ul className="space-y-1.5">
                  {config.writes.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-white/60">
                      <ChevronRight className="w-3 h-3 text-white/20 mt-0.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Settings */}
          {config && config.settings.length > 0 && (
            <section className="space-y-3">
              <SectionHeading icon={SlidersHorizontal} label="Config" />
              <div className="divide-y divide-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden">
                {config.settings.map((s, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-xs text-white/70">{s.label}</p>
                      {s.note && <p className="text-[11px] text-white/30 mt-0.5">{s.note}</p>}
                    </div>
                    <span className="text-xs font-mono text-seed-300 shrink-0">{s.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Tuning */}
          <section className="space-y-3">
            <SectionHeading icon={Sparkles} label="AI Tuning" />
            <p className="text-xs text-white/40">
              Describe a behaviour change in plain English. Claude will analyse this agent&apos;s config and suggest a specific code or prompt change.
            </p>
            <textarea
              value={tuneRequest}
              onChange={(e) => setTuneRequest(e.target.value)}
              rows={4}
              placeholder={`e.g. "Lower the minimum share score to 30 and explain what would change" or "Make the brief generator produce 4 briefs per run instead of 2–3"`}
              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 px-4 py-3 resize-none focus:outline-none focus:border-seed-500/50 transition-colors"
            />
            <button
              onClick={handleTune}
              disabled={tuning || !tuneRequest.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-seed-500 hover:bg-seed-400 text-dark-base text-sm font-semibold disabled:opacity-40 transition-colors"
            >
              {tuning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {tuning ? "Thinking…" : "Get suggestion"}
            </button>

            {tuneError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-300">
                {tuneError}
              </div>
            )}

            {tuneSuggestion && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-seed-400" /> Claude&apos;s suggestion
                </p>
                <pre className="whitespace-pre-wrap text-xs text-white/70 font-mono leading-relaxed">
                  {tuneSuggestion}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-white/30" />
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</h3>
    </div>
  );
}
