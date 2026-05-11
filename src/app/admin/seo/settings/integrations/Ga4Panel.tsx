"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

interface Property {
  property: string;
  displayName: string;
  accountDisplayName: string;
}

interface SyncResult {
  rowsFetched?: number;
  rowsUpserted?: number;
  startDate?: string;
  endDate?: string;
  durationMs?: number;
  skipped?: string;
  error?: string;
}

export function Ga4Panel({
  selectedProperty,
  onPropertySaved,
}: {
  selectedProperty: string | null;
  onPropertySaved: () => void;
}) {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [loadingProps, setLoadingProps] = useState(false);
  const [propsError, setPropsError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(!selectedProperty);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    if (!pickerOpen || properties) return;
    setLoadingProps(true);
    setPropsError(null);
    fetch("/api/integrations/ga4/properties")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Failed");
        return j.properties as Property[];
      })
      .then(setProperties)
      .catch((e) => setPropsError(e instanceof Error ? e.message : "Failed to load properties"))
      .finally(() => setLoadingProps(false));
  }, [pickerOpen, properties]);

  const saveProperty = async (property: string) => {
    setSaving(true);
    try {
      const r = await fetch("/api/integrations/ga4/property", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setPropsError(j.error ?? "Failed to save");
        return;
      }
      setPickerOpen(false);
      onPropertySaved();
    } finally {
      setSaving(false);
    }
  };

  const sync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const r = await fetch("/api/admin/integrations/ga4/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      });
      const j = (await r.json()) as SyncResult;
      setSyncResult(r.ok ? j : { error: j.error ?? "Sync failed" });
    } catch (e) {
      setSyncResult({ error: e instanceof Error ? e.message : "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  const selected = properties?.find((p) => p.property === selectedProperty);

  return (
    <div className="px-6 pb-5 -mt-2 space-y-3">
      <div className="bg-dark-base/50 border border-white/[0.04] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-white/60">
            <span className="text-white/40">Property: </span>
            {selectedProperty ? (
              <span className="text-white font-mono">
                {selected?.displayName ?? selectedProperty}
              </span>
            ) : (
              <span className="text-yellow-300">Not selected</span>
            )}
          </div>
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="text-[11px] text-white/60 hover:text-white underline"
          >
            {pickerOpen ? "Cancel" : selectedProperty ? "Change" : "Pick a property"}
          </button>
        </div>

        {pickerOpen && (
          <div className="space-y-2">
            {loadingProps && (
              <div className="text-xs text-white/40 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading properties…
              </div>
            )}
            {propsError && (
              <div className="text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> {propsError}
              </div>
            )}
            {properties && properties.length === 0 && (
              <div className="text-xs text-white/40">
                No GA4 properties found on this Google account.
              </div>
            )}
            {properties && properties.length > 0 && (
              <select
                disabled={saving}
                defaultValue={selectedProperty ?? ""}
                onChange={(e) => e.target.value && saveProperty(e.target.value)}
                className="w-full bg-dark-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="" disabled>
                  Select a property…
                </option>
                {properties.map((p) => (
                  <option key={p.property} value={p.property}>
                    {p.accountDisplayName} → {p.displayName} ({p.property})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {selectedProperty && !pickerOpen && (
          <div className="flex items-center gap-3">
            <button
              onClick={sync}
              disabled={syncing}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-seed-500/15 hover:bg-seed-500/25 text-seed-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              {syncing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              Sync last 7 days
            </button>
            {syncResult && !syncResult.error && (
              <span className="text-[11px] text-green-300/80 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                {syncResult.rowsUpserted ?? 0} rows in {syncResult.durationMs ?? 0} ms
              </span>
            )}
            {syncResult?.error && (
              <span className="text-[11px] text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                {syncResult.error}
              </span>
            )}
            {syncResult?.skipped && (
              <span className="text-[11px] text-yellow-300">
                Skipped: {syncResult.skipped}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
