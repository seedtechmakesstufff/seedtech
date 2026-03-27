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

/**
 * Generic placeholder context — used ONLY when no BusinessProfile exists in DB
 * and no filesystem config is found. All fields are clearly marked as unconfigured
 * so AI prompts won't silently use another client's branding.
 */
export const DEFAULT_CONTEXT: BusinessContext = {
  companyName: "[Company Name — configure in Settings > Business Profile]",
  tagline: "",
  location: "",
  domain: "",
  primaryService: "",
  secondaryServices: [],
  targetAudience: "",
  uniqueSellingPoints: [],
  toneOfVoice: "Professional but approachable. Confident without being salesy. Technical when needed, but always explain in plain language.",
  customInstructions: "",
  updatedAt: new Date().toISOString(),
};

/** Check whether a BusinessContext has been properly configured (not just defaults) */
export function isBusinessContextConfigured(ctx: BusinessContext): boolean {
  return !!(ctx.companyName && !ctx.companyName.startsWith("[") && ctx.domain);
}

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
