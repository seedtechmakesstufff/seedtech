import fs from "fs";
import path from "path";

const CONTEXT_FILE = path.join(process.cwd(), "content", "business-context.json");

export interface BusinessContext {
  companyName: string;
  tagline: string;
  location: string;
  domain: string;
  primaryService: string;
  secondaryServices: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
  toneOfVoice: string;
  customInstructions: string;
  updatedAt: string;
}

const DEFAULT_CONTEXT: BusinessContext = {
  companyName: "SeedTech",
  tagline: "Managed IT services and web development for growing businesses",
  location: "Hopatcong, NJ (Northern New Jersey)",
  domain: "seedtechllc.com",
  primaryService: "Managed IT support — per-user pricing, no contracts, unlimited remote help desk",
  secondaryServices: [
    "Web development (Next.js, React, custom builds)",
    "Digital marketing & SEO",
    "Cybersecurity & compliance",
    "Cloud migration & management",
  ],
  targetAudience: "Small and mid-size businesses in Northern NJ / NYC metro area (10–200 employees)",
  uniqueSellingPoints: [
    "Per-user pricing with no long-term contracts",
    "Same-day onboarding",
    "24/7 monitoring with human support",
    "Local NJ company — not an offshore help desk",
    "Full-stack web development in-house",
  ],
  toneOfVoice: "Professional but approachable. Confident without being salesy. Technical when needed, but always explain in plain language.",
  customInstructions: "Always link back to /services/managed-it and /pricing/it-support where relevant. Write for Northern New Jersey business owners. Never mention Austin. Include real-world examples and actionable advice. Use Markdown formatting.",
  updatedAt: new Date().toISOString(),
};

/** Ensure the content directory exists */
function ensureDir() {
  const dir = path.dirname(CONTEXT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Read business context from file, or return defaults */
export function getBusinessContext(): BusinessContext {
  ensureDir();
  try {
    if (fs.existsSync(CONTEXT_FILE)) {
      const raw = fs.readFileSync(CONTEXT_FILE, "utf-8");
      return JSON.parse(raw) as BusinessContext;
    }
  } catch {
    // fall through to defaults
  }
  // Write defaults to disk on first read
  saveBusinessContext(DEFAULT_CONTEXT);
  return DEFAULT_CONTEXT;
}

/** Save business context to file */
export function saveBusinessContext(ctx: BusinessContext): void {
  ensureDir();
  ctx.updatedAt = new Date().toISOString();
  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(ctx, null, 2), "utf-8");
}

/** Build the system-prompt-friendly string from the context */
export function buildStrategyPrompt(ctx?: BusinessContext): string {
  const c = ctx ?? getBusinessContext();
  return `
${c.companyName} — ${c.tagline}
Location: ${c.location}
Domain: ${c.domain}

Primary service: ${c.primaryService}
Other services: ${c.secondaryServices.join("; ")}

Target audience: ${c.targetAudience}

Unique selling points:
${c.uniqueSellingPoints.map((u) => `• ${u}`).join("\n")}

Tone of voice: ${c.toneOfVoice}

Additional instructions: ${c.customInstructions}
`.trim();
}
