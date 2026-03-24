/**
 * Business Context — site-specific business profile for prompts and strategy.
 *
 * Primary source: DB BusinessProfile (keyed by siteId).
 * Fallback: filesystem content/business-context.json (legacy, for backwards compat).
 *
 * buildStrategyPrompt() is now pure — it accepts a BusinessContext object,
 * so it can be used server-side without side-effects.
 */

import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

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

export const DEFAULT_CONTEXT: BusinessContext = {
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

// ── DB-backed reads/writes ──────────────────────────

/** Get business context from DB for a specific site, with filesystem fallback */
export async function getBusinessContextForSite(siteId: string): Promise<BusinessContext> {
  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { siteId },
    });

    if (profile) {
      return {
        companyName: profile.companyName,
        tagline: profile.tagline,
        location: profile.location,
        domain: profile.domain,
        primaryService: profile.primaryService,
        secondaryServices: profile.secondaryServices,
        targetAudience: profile.targetAudience,
        uniqueSellingPoints: profile.uniqueSellingPoints,
        toneOfVoice: profile.toneOfVoice,
        customInstructions: profile.customInstructions,
        updatedAt: profile.updatedAt.toISOString(),
      };
    }
  } catch {
    // DB unavailable — fall through to filesystem
  }

  // Fallback to filesystem
  return getBusinessContextFromFile();
}

/** Save business context to DB for a specific site */
export async function saveBusinessContextForSite(
  siteId: string,
  ctx: BusinessContext
): Promise<void> {
  await prisma.businessProfile.upsert({
    where: { siteId },
    create: {
      siteId,
      companyName: ctx.companyName,
      tagline: ctx.tagline,
      location: ctx.location,
      domain: ctx.domain,
      primaryService: ctx.primaryService,
      secondaryServices: ctx.secondaryServices,
      targetAudience: ctx.targetAudience,
      uniqueSellingPoints: ctx.uniqueSellingPoints,
      toneOfVoice: ctx.toneOfVoice,
      customInstructions: ctx.customInstructions,
    },
    update: {
      companyName: ctx.companyName,
      tagline: ctx.tagline,
      location: ctx.location,
      domain: ctx.domain,
      primaryService: ctx.primaryService,
      secondaryServices: ctx.secondaryServices,
      targetAudience: ctx.targetAudience,
      uniqueSellingPoints: ctx.uniqueSellingPoints,
      toneOfVoice: ctx.toneOfVoice,
      customInstructions: ctx.customInstructions,
    },
  });
}

// ── Legacy filesystem functions (backwards compat) ──

function ensureDir() {
  const dir = path.dirname(CONTEXT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getBusinessContextFromFile(): BusinessContext {
  ensureDir();
  try {
    if (fs.existsSync(CONTEXT_FILE)) {
      const raw = fs.readFileSync(CONTEXT_FILE, "utf-8");
      return JSON.parse(raw) as BusinessContext;
    }
  } catch {
    // fall through to defaults
  }
  saveBusinessContext(DEFAULT_CONTEXT);
  return DEFAULT_CONTEXT;
}

/** @deprecated Use getBusinessContextForSite(siteId) instead */
export function getBusinessContext(): BusinessContext {
  return getBusinessContextFromFile();
}

/** @deprecated Use saveBusinessContextForSite(siteId, ctx) instead */
export function saveBusinessContext(ctx: BusinessContext): void {
  ensureDir();
  ctx.updatedAt = new Date().toISOString();
  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(ctx, null, 2), "utf-8");
}

// ── Pure prompt builder ─────────────────────────────

/** Build the system-prompt-friendly string from a BusinessContext object */
export function buildStrategyPrompt(ctx?: BusinessContext): string {
  const c = ctx ?? getBusinessContextFromFile();
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
