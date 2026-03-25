"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, ArrowRight, ArrowLeft, Check, Loader2,
  Building2, MapPin, Wrench, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateOption {
  slug: string;
  name: string;
  description: string;
  industry: string;
}

const STEPS = [
  { id: 1, label: "Site Info" },
  { id: 2, label: "Business Profile" },
  { id: 3, label: "Template" },
  { id: 4, label: "Create" },
];

export default function NewSitePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Site info
  const [siteName, setSiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [siteUrl, setSiteUrl] = useState("");

  // Step 2 — Business profile
  const [companyName, setCompanyName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [primaryServices, setPrimaryServices] = useState("");
  const [usp, setUsp] = useState("");

  // Step 3 — Template
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [region, setRegion] = useState("");

  useEffect(() => {
    // Load available templates from the API
    fetch("/api/admin/templates")
      .then((r) => r.json())
      .then((d) => {
        if (d.templates) setTemplates(d.templates);
      })
      .catch(() => {
        // Fallback templates
        setTemplates([
          { slug: "msp", name: "Managed IT / MSP", description: "Managed IT services provider", industry: "IT Services" },
          { slug: "blank", name: "Blank Site", description: "Start from scratch", industry: "Other" },
        ]);
      });
  }, []);

  // Auto-fill siteUrl from domain
  useEffect(() => {
    if (domain && !siteUrl) {
      setSiteUrl(`https://${domain}`);
    }
  }, [domain, siteUrl]);

  // Auto-fill companyName from siteName
  useEffect(() => {
    if (siteName && !companyName) {
      setCompanyName(siteName);
    }
  }, [siteName, companyName]);

  // Auto-fill region from serviceArea
  useEffect(() => {
    if (serviceArea && !region) {
      setRegion(serviceArea);
    }
  }, [serviceArea, region]);

  const canProceed = () => {
    if (step === 1) return siteName.trim() && domain.trim();
    if (step === 2) return true; // Optional
    if (step === 3) return selectedTemplate;
    return true;
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/sites/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: siteName,
          domain,
          siteUrl: siteUrl || `https://${domain}`,
          template: selectedTemplate,
          region,
          companyName: companyName || siteName,
          serviceArea,
          primaryServices,
          usp,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setStep(4);
        // Wait a moment then redirect
        setTimeout(() => {
          router.push("/admin/seo");
          router.refresh();
        }, 1500);
      } else {
        setError(d.error || "Failed to create site");
      }
    } catch {
      setError("Failed to connect");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
          <Globe className="w-6 h-6 text-seed-400" />
          Add New Site
        </h1>
        <p className="text-white/40 mt-1">Set up a new site with SEO tracking, content tools, and AI visibility scoring.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border transition-colors",
              step > s.id
                ? "bg-seed-500/20 border-seed-500/30 text-seed-400"
                : step === s.id
                  ? "bg-seed-500 border-seed-500 text-white"
                  : "bg-white/[0.04] border-white/[0.06] text-white/30"
            )}>
              {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            <span className={cn(
              "text-xs font-medium hidden sm:inline",
              step >= s.id ? "text-white/60" : "text-white/20"
            )}>{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "w-8 h-px",
                step > s.id ? "bg-seed-500/30" : "bg-white/[0.06]"
              )} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Site Info */}
      {step === 1 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-seed-400" /> Site Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Site Name *</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="e.g. My Company"
              className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Domain *</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. mycompany.com"
              className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Site URL</label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://mycompany.com"
              className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50"
            />
            <p className="text-xs text-white/20 mt-1">Auto-filled from domain if blank.</p>
          </div>
        </div>
      )}

      {/* Step 2: Business Profile */}
      {step === 2 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-seed-400" /> Business Profile
          </h2>
          <p className="text-xs text-white/40">This powers AI prompts, reports, and content generation. You can edit this later in Settings.</p>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Company Name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme IT Solutions" className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />Service Area
            </label>
            <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g. Northern New Jersey" className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              <Wrench className="w-3.5 h-3.5 inline mr-1" />Primary Services
            </label>
            <input type="text" value={primaryServices} onChange={(e) => setPrimaryServices(e.target.value)} placeholder="e.g. Managed IT, Cybersecurity, Cloud Services" className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Unique Selling Point</label>
            <textarea value={usp} onChange={(e) => setUsp(e.target.value)} placeholder="What makes this business different?" rows={3} className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 resize-none" />
          </div>
        </div>
      )}

      {/* Step 3: Template */}
      {step === 3 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-seed-400" /> Choose a Template
          </h2>
          <p className="text-xs text-white/40">Templates pre-fill keywords, tasks, content ideas, and page inventory. You can customize everything after creation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTemplate(t.slug)}
                className={cn(
                  "text-left p-4 rounded-lg border transition-colors",
                  selectedTemplate === t.slug
                    ? "border-seed-500/30 bg-seed-500/10"
                    : "border-white/[0.06] hover:border-white/10"
                )}
              >
                <p className={cn(
                  "text-sm font-medium",
                  selectedTemplate === t.slug ? "text-seed-400" : "text-white/70"
                )}>{t.name}</p>
                <p className="text-xs text-white/30 mt-1">{t.description}</p>
                <span className="inline-block text-[10px] text-white/20 mt-2 px-1.5 py-0.5 bg-white/[0.04] rounded">{t.industry}</span>
              </button>
            ))}
          </div>

          {selectedTemplate === "msp" && (
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Region (for keyword placeholders)</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. NJ, Northern New Jersey, Chicago" className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50" />
              <p className="text-xs text-white/20 mt-1">Keywords like &quot;managed IT services &#123;region&#125;&quot; → &quot;managed IT services NJ&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-seed-500/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-seed-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Site Created!</h2>
          <p className="text-sm text-white/40">
            <strong className="text-white/70">{siteName}</strong> is ready. Redirecting to dashboard…
          </p>
          <Loader2 className="w-5 h-5 animate-spin text-seed-400 mx-auto" />
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading || !canProceed()}
              className="flex items-center gap-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Create Site
            </button>
          )}
        </div>
      )}
    </div>
  );
}
