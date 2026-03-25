"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SiteOption {
  id: string;
  name: string;
  domain: string;
  slug: string;
  tenantName: string;
}

export function SiteSwitcher() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/sites")
      .then((r) => r.json())
      .then((d) => {
        if (d.sites) setSites(d.sites);
        if (d.currentSiteId) setCurrentSiteId(d.currentSiteId);
      })
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentSite = sites.find((s) => s.id === currentSiteId);

  const switchSite = async (siteId: string) => {
    if (siteId === currentSiteId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    try {
      const r = await fetch("/api/admin/sites/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      const d = await r.json();
      if (d.success) {
        setCurrentSiteId(siteId);
        setOpen(false);
        // Reload to pick up new site context in all components
        router.refresh();
      }
    } catch {}
    setSwitching(false);
  };

  if (sites.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
          "bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06]",
          open && "bg-white/[0.06] border-white/[0.1]"
        )}
      >
        <Globe className="w-4 h-4 text-seed-400 shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white/80 truncate text-xs font-medium">
            {currentSite?.name ?? "Select site"}
          </p>
          {currentSite && (
            <p className="text-white/30 truncate text-[10px]">{currentSite.domain}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-white/30 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-dark-raised border border-white/[0.08] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-1 max-h-60 overflow-y-auto">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => switchSite(site.id)}
                disabled={switching}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm transition-colors",
                  site.id === currentSiteId
                    ? "bg-seed-500/10 text-seed-400"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                <Globe className="w-3.5 h-3.5 shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium">{site.name}</p>
                  <p className="truncate text-[10px] opacity-50">{site.domain}</p>
                </div>
                {site.id === currentSiteId && (
                  <Check className="w-3.5 h-3.5 text-seed-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-white/[0.06]">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/admin/sites/new");
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add new site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
