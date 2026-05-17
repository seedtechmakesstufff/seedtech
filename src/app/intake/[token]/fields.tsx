/* ── Intake field components ──
 * Pure form inputs. Each takes a `field` definition + value + onChange and
 * renders the correct UI. Used by FormView (filling out) and SummaryView
 * (editing after submit). The ReviewField wrapper used by ReviewView is also
 * here — it shows the answer read-only with an inline edit toggle.
 *
 * Focus management note: when MultiSelectField shows the "Other" input, we
 * focus it imperatively with `{ preventScroll: true }` so the browser does
 * not try to scroll the input into view (which would scroll the document
 * itself on Safari/Chrome and break the shell layout).
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Maximize2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionField } from "./sections";

const INPUT_BASE =
  "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
  "focus:border-transparent transition-all";

/* ── Field — write mode wrapper used in FormView + edit-mode ReviewField ── */

export function Field({
  field,
  value,
  onChange,
  showLabel = true,
  autoFocus = false,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
  showLabel?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      {showLabel && (
        <>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            {field.label}
            {field.required && <span className="text-emerald-600 ml-1">*</span>}
          </label>
          {field.hint && <p className="text-xs text-gray-400 mb-2">{field.hint}</p>}
        </>
      )}
      <FieldInput field={field} value={value} onChange={onChange} autoFocus={autoFocus} />
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  autoFocus,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
  autoFocus: boolean;
}) {
  switch (field.type) {
    case "textarea":
      return <ExpandableTextarea value={value} onChange={onChange} label={field.label} autoFocus={autoFocus} />;
    case "multiselect":
      return <MultiSelectField field={field} value={value} onChange={onChange} />;
    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(INPUT_BASE, "cursor-pointer")}
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "email":
    case "tel":
    case "text":
    default:
      return (
        <FocusableInput
          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
        />
      );
  }
}

/* ── FocusableInput — text input with non-scrolling autoFocus ── */

function FocusableInput({
  type,
  value,
  onChange,
  autoFocus,
}: {
  type: string;
  value: string;
  onChange: (val: string) => void;
  autoFocus: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_BASE}
    />
  );
}

/* ── ExpandableTextarea ── */

function ExpandableTextarea({
  value,
  onChange,
  label,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  autoFocus: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  return (
    <>
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={cn(INPUT_BASE, "resize-none pr-10")}
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          title="Expand"
          className="absolute bottom-2 right-2 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: "70vh" }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ExpandedTextarea value={value} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
}

function ExpandedTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 p-4 text-sm text-gray-900 resize-none focus:outline-none rounded-b-2xl"
      placeholder="Start typing…"
    />
  );
}

/* ── MultiSelectField — checkboxes with optional "Other" ── */

function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
}) {
  const lines = value ? value.split("\n").filter(Boolean) : [];
  const selected = lines.filter((l) => !l.startsWith("Other:"));
  const otherLine = lines.find((l) => l.startsWith("Other:"));
  const otherChecked = !!otherLine;
  const otherText = otherLine ? otherLine.slice(7) : "";

  function emit(sel: string[], oc: boolean, ot: string) {
    const parts = [...sel, ...(oc ? [`Other: ${ot}`] : [])];
    onChange(parts.join("\n"));
  }

  function toggle(opt: string) {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    emit(next, otherChecked, otherText);
  }

  function toggleOther() {
    emit(selected, !otherChecked, otherText);
  }

  return (
    <div className="space-y-2.5">
      {(field.options ?? []).map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <Checkbox checked={selected.includes(opt)} onChange={() => toggle(opt)} />
          <span className="text-sm text-gray-800">{opt}</span>
        </label>
      ))}
      <label className="flex items-center gap-3 cursor-pointer group">
        <Checkbox checked={otherChecked} onChange={toggleOther} />
        <span className="text-sm text-gray-800">Other</span>
      </label>
      {otherChecked && (
        <FocusableInput
          type="text"
          value={otherText}
          onChange={(v) => emit(selected, true, v)}
          autoFocus
        />
      )}
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
        checked ? "border-emerald-500 bg-emerald-500" : "border-gray-300 group-hover:border-emerald-400",
      )}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </div>
  );
}

/* ── ReviewField — read-only display with inline edit toggle ── */

export function ReviewField({
  field,
  value,
  onChange,
}: {
  field: SectionField;
  value: string;
  onChange: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const isEmpty = !value.trim();

  return (
    <div className="group rounded-xl border border-gray-100 bg-white px-4 py-3.5 hover:border-gray-200 transition-all">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-xs font-medium text-gray-500">
          {field.label}
          {field.required && isEmpty && <span className="ml-1 text-red-400">Required</span>}
        </span>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={cn(
            "flex items-center gap-1 text-xs font-medium transition-colors shrink-0",
            editing ? "text-emerald-600" : "text-gray-300 group-hover:text-gray-400 hover:text-emerald-500",
          )}
        >
          {editing ? (
            <>
              <X className="w-3 h-3" /> Done
            </>
          ) : (
            <>
              <Pencil className="w-3 h-3" /> Edit
            </>
          )}
        </button>
      </div>

      {editing ? (
        <div className="mt-2">
          <Field field={field} value={value} onChange={onChange} showLabel={false} autoFocus />
        </div>
      ) : (
        <div className={cn("mt-0.5", isEmpty && "mt-1")}>{renderReadOnly(field, value)}</div>
      )}
    </div>
  );
}

function renderReadOnly(field: SectionField, value: string) {
  if (!value.trim()) return <span className="text-gray-300 italic">Not answered</span>;
  if (field.type === "multiselect") {
    const parts = value.split("\n").filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {parts.map((p) => (
          <span
            key={p}
            className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700"
          >
            {p}
          </span>
        ))}
      </div>
    );
  }
  return <span className="text-gray-800 text-sm whitespace-pre-wrap">{value}</span>;
}
