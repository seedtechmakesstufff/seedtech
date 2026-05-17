/* ── SummaryView ──
 * Shown after the form has been submitted. The full set of answers is laid
 * out grouped by section, every field editable in place. Edits debounce-save
 * to the server via PATCH so the client can keep tweaking after submit.
 *
 * Sidebar nav scrolls the body imperatively via `bodyRef` — never via the
 * browser's hash-anchor mechanism, which would move the document.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, FolderOpen } from "lucide-react";
import { IntakeShell } from "./IntakeShell";
import { Field } from "./fields";
import type { Section } from "./sections";

interface SummaryViewProps {
  token: string;
  companyName: string;
  assetDriveUrl: string | null;
  sections: Section[];
  initialAnswers: Record<string, string>;
}

export function SummaryView({
  token,
  companyName,
  assetDriveUrl,
  sections,
  initialAnswers,
}: SummaryViewProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const bodyRef = useRef<HTMLElement>(null);
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cancel pending timers on unmount so we don't fire after navigating away.
  useEffect(() => {
    const timers = saveTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  function updateField(id: string, val: string) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    const existing = saveTimers.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      saveTimers.current.delete(id);
      void saveField(id, val);
    }, 800);
    saveTimers.current.set(id, timer);
  }

  async function saveField(id: string, val: string) {
    setSaving(true);
    try {
      await fetch(`/api/intake/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [id]: val }),
      });
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  function scrollToSection(id: string) {
    const container = bodyRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-section-id="${id}"]`);
    if (container && target) {
      container.scrollTo({ top: target.offsetTop - 16, behavior: "smooth" });
    }
  }

  return (
    <IntakeShell
      bodyRef={bodyRef}
      sidebar={
        <>
          <div className="px-6 pt-7 pb-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
            <p className="text-base font-bold text-gray-900 truncate">{companyName}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">Submitted</span>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1" style={{ overscrollBehavior: "contain" }}>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-100 shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-medium">{s.title}</span>
              </button>
            ))}
          </nav>
          {assetDriveUrl && (
            <div className="p-4 border-t border-gray-100">
              <a
                href={assetDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <FolderOpen className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="font-medium">Upload to Drive</span>
              </a>
            </div>
          )}
        </>
      }
      header={
        <div className="px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your answers are in!</h1>
              <p className="text-sm text-gray-400 mt-0.5">You can still update any answer below — changes save automatically.</p>
            </div>
          </div>
          <span className="text-xs text-gray-300 shrink-0 tabular-nums">
            {saving
              ? "Saving…"
              : savedAt
              ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : ""}
          </span>
        </div>
      }
    >
      <div className="px-8 py-8 max-w-2xl space-y-10">
        {sections.map((sec) => (
          <div key={sec.id} data-section-id={sec.id}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{sec.title}</h2>
            <div className="space-y-6">
              {sec.fields.map((field) => (
                <Field
                  key={field.id}
                  field={field}
                  value={answers[field.id] ?? ""}
                  onChange={(val) => updateField(field.id, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </IntakeShell>
  );
}
