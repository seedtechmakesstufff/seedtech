/* ── FormView ──
 * The default intake state. Renders ONE section at a time with a step nav in
 * the sidebar, the section's fields in the body, and back/continue buttons +
 * progress bar in the footer. The final section's "Continue" button advances
 * to the review state.
 */
"use client";

import { useEffect, useRef } from "react";
import { Check, ChevronLeft, ChevronRight, ClipboardList, FolderOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntakeShell } from "./IntakeShell";
import { Field } from "./fields";
import { isSectionComplete, type Section } from "./sections";

interface FormViewProps {
  companyName: string;
  assetDriveUrl: string | null;
  sections: Section[];
  currentSection: number;
  formData: Record<string, string>;
  onChangeField: (id: string, val: string) => void;
  onChangeSection: (idx: number) => void;
  onReview: () => void;
  submitting: boolean;
  error: string;
}

export function FormView({
  companyName,
  assetDriveUrl,
  sections,
  currentSection,
  formData,
  onChangeField,
  onChangeSection,
  onReview,
  submitting,
  error,
}: FormViewProps) {
  const section = sections[currentSection];
  const canAdvance = isSectionComplete(section, formData);
  const isLast = currentSection === sections.length - 1;

  const bodyRef = useRef<HTMLElement>(null);
  // Scroll the body to top whenever the active section changes, so users
  // never land mid-page after clicking a step.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [currentSection]);

  return (
    <IntakeShell
      bodyRef={bodyRef}
      sidebar={
        <Sidebar
          companyName={companyName}
          assetDriveUrl={assetDriveUrl}
          sections={sections}
          currentSection={currentSection}
          formData={formData}
          onChangeSection={onChangeSection}
        />
      }
      header={
        <div className="px-8 py-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{section.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{section.subtitle}</p>
          </div>
          <span className="text-xs font-medium text-gray-400 tabular-nums shrink-0 mt-1">
            {currentSection + 1} / {sections.length}
          </span>
        </div>
      }
      footer={
        <>
          <div className="px-8 pt-3">
            <div className="flex gap-1.5 max-w-2xl">
              {sections.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-500",
                    i < currentSection
                      ? "bg-emerald-500"
                      : i === currentSection
                      ? "bg-emerald-400"
                      : "bg-gray-200",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="px-8 py-4 flex gap-3 max-w-2xl">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={() => onChangeSection(currentSection - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={isLast ? onReview : () => onChangeSection(currentSection + 1)}
              disabled={!canAdvance || submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : isLast ? (
                <>
                  <ClipboardList className="w-4 h-4" /> Review answers
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </>
      }
    >
      <div className="px-8 py-8 max-w-2xl space-y-8">
        {section.fields.map((field) => (
          <Field
            key={field.id}
            field={field}
            value={formData[field.id] ?? ""}
            onChange={(val) => onChangeField(field.id, val)}
          />
        ))}

        {section.id === "assets" && assetDriveUrl && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-start gap-3">
            <FolderOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Upload your files to Google Drive</p>
              <p className="text-xs text-gray-500 mt-0.5 mb-2">Logo, photos, existing copy, brand guidelines.</p>
              <a
                href={assetDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Open folder <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </IntakeShell>
  );
}

function Sidebar({
  companyName,
  assetDriveUrl,
  sections,
  currentSection,
  formData,
  onChangeSection,
}: {
  companyName: string;
  assetDriveUrl: string | null;
  sections: Section[];
  currentSection: number;
  formData: Record<string, string>;
  onChangeSection: (idx: number) => void;
}) {
  return (
    <>
      <div className="px-6 pt-7 pb-6">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Onboarding for</p>
        <p className="text-base font-bold text-gray-900 truncate">{companyName}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 space-y-1" style={{ overscrollBehavior: "contain" }}>
        {sections.map((s, i) => {
          const done = isSectionComplete(s, formData);
          const active = i === currentSection;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChangeSection(i)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : done
                  ? "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all",
                  active
                    ? "bg-emerald-500 text-white"
                    : done
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                {done && !active ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={cn("text-sm", active ? "font-semibold" : "font-medium")}>{s.title}</span>
            </button>
          );
        })}
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
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
          </a>
        </div>
      )}
    </>
  );
}
