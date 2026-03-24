/**
 * Email & form validation utilities.
 *
 * Catches typos like ".omc", ".con", ".gmal" that slip past
 * basic HTML type="email" validation.
 */

// ── Known valid TLDs (common ones — covers 99%+ of real submissions) ────────
const VALID_TLDS = new Set([
  // Generic
  "com", "org", "net", "edu", "gov", "mil", "int",
  // Common new gTLDs
  "io", "co", "ai", "app", "dev", "tech", "site", "online", "store",
  "shop", "cloud", "design", "digital", "agency", "media", "studio",
  "consulting", "solutions", "services", "pro", "biz", "info", "name",
  "mobi", "tel", "jobs", "travel", "museum", "coop", "aero",
  // Country codes (major)
  "us", "uk", "ca", "au", "de", "fr", "es", "it", "nl", "be",
  "at", "ch", "se", "no", "dk", "fi", "ie", "pt", "pl", "cz",
  "sk", "hu", "ro", "bg", "hr", "si", "lt", "lv", "ee",
  "jp", "cn", "kr", "in", "sg", "hk", "tw", "th", "ph", "my",
  "id", "vn", "nz", "za", "br", "mx", "ar", "cl", "co",
  "ru", "ua", "il", "ae", "sa", "tr", "eg", "ng", "ke", "gh",
  // Two-level country TLDs
  "co.uk", "co.za", "co.nz", "co.in", "co.jp", "co.kr",
  "com.au", "com.br", "com.mx", "com.ar", "com.sg", "com.hk",
  "com.tw", "com.ph", "com.my", "com.ng", "com.eg", "com.tr",
  "org.uk", "org.au", "net.au", "gov.uk", "ac.uk",
]);

// ── Common domain typos → corrections ───────────────────────────────────────
const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  "gmal.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmai.com": "gmail.com",
  // Outlook
  "outlook.omc": "outlook.com",
  "outlook.con": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.om": "outlook.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
  "otlook.com": "outlook.com",
  "outlook.co": "outlook.com",
  // Hotmail
  "hotmail.con": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.om": "hotmail.com",
  // Yahoo
  "yahoo.con": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.om": "yahoo.com",
  // iCloud
  "icloud.con": "icloud.com",
  "icloud.cm": "icloud.com",
  // AOL
  "aol.con": "aol.com",
  "aol.cm": "aol.com",
};

// ── Core validation ─────────────────────────────────────────────────────────

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string; // "Did you mean user@gmail.com?"
}

/**
 * Validates an email address beyond what HTML type="email" catches.
 *
 * Checks:
 * 1. Basic format (user@domain.tld)
 * 2. No spaces, no double dots
 * 3. TLD is a real, known TLD (catches .omc, .con, .gmal, etc.)
 * 4. Domain typo detection with suggestions
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required." };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  // No spaces anywhere
  if (/\s/.test(trimmed)) {
    return { valid: false, error: "Email cannot contain spaces." };
  }

  // Split into parts
  const atIndex = trimmed.lastIndexOf("@");
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  // Local part checks
  if (local.length === 0) {
    return { valid: false, error: "Email is missing the username before @." };
  }
  if (local.length > 64) {
    return { valid: false, error: "Email username is too long." };
  }

  // Domain checks
  if (domain.length < 3) {
    return { valid: false, error: "Email domain is too short." };
  }
  if (/\.\./.test(domain)) {
    return { valid: false, error: "Email domain contains consecutive dots." };
  }

  // Extract TLD (handle two-level like co.uk)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { valid: false, error: "Email domain is missing a valid extension." };
  }

  const lastTwo = domainParts.slice(-2).join(".");
  const lastOne = domainParts[domainParts.length - 1];

  const tldValid = VALID_TLDS.has(lastTwo) || VALID_TLDS.has(lastOne);

  // Check for known domain typos
  const typoCorrection = DOMAIN_TYPOS[domain];
  if (typoCorrection) {
    return {
      valid: false,
      error: `"${domain}" looks like a typo.`,
      suggestion: `${local}@${typoCorrection}`,
    };
  }

  if (!tldValid) {
    // Try to be helpful — check if the TLD is close to a known one
    const closeTld = findCloseTLD(lastOne);
    if (closeTld) {
      const correctedDomain = [...domainParts.slice(0, -1), closeTld].join(".");
      return {
        valid: false,
        error: `".${lastOne}" isn't a recognized email extension.`,
        suggestion: `${local}@${correctedDomain}`,
      };
    }
    return {
      valid: false,
      error: `".${lastOne}" isn't a recognized email extension. Please check for typos.`,
    };
  }

  return { valid: true };
}

/**
 * Simple check — returns true/false only. Use in API routes for quick gating.
 */
export function isValidEmail(email: string): boolean {
  return validateEmail(email).valid;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Find a TLD within edit distance 1 of the input */
function findCloseTLD(input: string): string | null {
  const common = ["com", "net", "org", "edu", "gov", "io", "co", "us", "uk", "ca", "au", "de"];
  for (const tld of common) {
    if (editDistance(input, tld) === 1) return tld;
  }
  return null;
}

/** Levenshtein edit distance (small strings only) */
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
