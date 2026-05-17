/* ── ReviewView ──
 * Shown after the user finishes the last form section. Lists every answer
 * grouped by section, with inline-edit buttons per field. Footer has
 * back-to-form and confirm-submit buttons.
 *
 * Sidebar nav scrolls the body imperatively via `bodyRef` so the browser
 * cannot move the document.
 */
"use client";

import { useRef } from "react";
import { Check, ChevronLeft, CheckCircle2, FolderOpen, Loader2, Pencil } from "lucide-react";
import { IntakeShell } from "./IntakeShell";
import { ReviewField } from "./fields";
import type { Section } from "./sections";

interface ReviewViewProps {
  companyName: string;
  assetDriveUrl: string | null;
  sections: Section[];
  formData: Record<string, string>;
  onChangeField: (id: string, val: string) => void;
  onBack: () => void;
  onEditSection: (idx: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}

export function ReviewView({
  companyName,
  assetDriveUrl,
  sections,
  formData,
  onChangeField,
  onBack,
  onEditSection,
  onSubmit,
  submitting,
  error,
}: ReviewViewProps) {
  const bodyRef = useRef<HTMLElement>(null);

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
          <div className="px-6 pt-7 pb-6">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
            <p className="text-base font-bold text-gray-900 truncate">{companyName}</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1" style={{ overscrollBehavior: "contain" }}>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 shrink-0">
                  <Check className="w-3 h-3" />
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
        <div className="px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Review your answers</h1>
          <p className="text-sm text-gray-400 mt-1">Everything looks good? Hit confirm below — or click any answer to edit it.</p>
        </div>
      }
      footer={
        <div className="px-8 py-4 flex gap-3 max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Submit
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="px-8 py-8 max-w-2xl space-y-10">
        {sections.map((sec, si) => (
          <div key={sec.id} data-section-id={sec.id}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{sec.title}</h2>
              <button
                type="button"
                onClick={() => onEditSection(si)}
                className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                <Pencil className="w-3 h-3" /> Edit section
              </button>
            </div>
            <div className="space-y-4">
              {sec.fields.map((field) => (
                <ReviewField
                  key={field.id}
                  field={field}
                  value={formData[field.id] ?? ""}
                  onChange={(v) => onChangeField(field.id, v)}
                />
              ))}
            </div>
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </IntakeShell>
  );
}
