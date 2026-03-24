/* ── Email Validation ──
 * Validates email format, checks TLD validity, and catches common typos
 * with "Did you mean?" suggestions.
 *
 * Used by: contact form, audit form, quote flow (client + server side)
 */

const VALID_TLDS = new Set([
  // Common
  "com", "net", "org", "edu", "gov", "mil", "int",
  // Country codes (major)
  "us", "uk", "ca", "au", "de", "fr", "jp", "cn", "in", "br", "mx", "it", "es", "nl", "ru",
  "kr", "se", "no", "fi", "dk", "ch", "at", "be", "pt", "ie", "nz", "za", "pl", "cz", "ro",
  "hu", "gr", "il", "sg", "hk", "tw", "th", "ph", "my", "vn", "id", "ae", "sa", "co", "ar",
  // New gTLDs (common)
  "io", "co", "ai", "app", "dev", "tech", "online", "store", "shop", "site", "xyz", "info",
  "biz", "pro", "me", "tv", "cc", "ws", "mobi", "name", "club", "live", "email", "cloud",
  "design", "agency", "digital", "media", "solutions", "services", "consulting", "global",
  "world", "space", "website", "blog", "news", "health", "law", "finance", "insurance",
  "construction", "plumbing", "dental", "vet", "cafe", "restaurant", "pub", "bar",
  // Microsoft / email providers
  "outlook", "hotmail",
]);

// Common domain typos → corrections
const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  "gmal.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com",
  "gmali.com": "gmail.com", "gnail.com": "gmail.com", "gamil.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.cm": "gmail.com", "gmail.con": "gmail.com",
  "gmail.om": "gmail.com", "gmail.cmo": "gmail.com", "gmail.ocm": "gmail.com",
  // Outlook
  "outlook.omc": "outlook.com", "outlook.con": "outlook.com", "outlook.cm": "outlook.com",
  "outlook.co": "outlook.com", "outlook.om": "outlook.com", "outlook.cmo": "outlook.com",
  "outloo.com": "outlook.com", "outlok.com": "outlook.com", "outlool.com": "outlook.com",
  "outllook.com": "outlook.com", "otlook.com": "outlook.com", "outtlook.com": "outlook.com",
  // Hotmail
  "hotmail.con": "hotmail.com", "hotmail.cm": "hotmail.com", "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com", "hotamil.com": "hotmail.com", "hotmail.co": "hotmail.com",
  // Yahoo
  "yahoo.con": "yahoo.com", "yahoo.cm": "yahoo.com", "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com", "yhoo.com": "yahoo.com", "yahoo.co": "yahoo.com",
  // iCloud
  "icloud.con": "icloud.com", "icloud.cm": "icloud.com", "iclud.com": "icloud.com",
  // AOL
  "aol.con": "aol.com", "aol.cm": "aol.com",
  // Common TLD typos (generic — applies to any domain)
};

// Common TLD typos → corrections
const TLD_TYPOS: Record<string, string> = {
  "omc": "com", "con": "com", "cm": "com", "co": "com", "om": "com",
  "cmo": "com", "ocm": "com", "vom": "com", "xom": "com", "comn": "com",
  "nte": "net", "ne": "net", "met": "net", "ner": "net", "bet": "net",
  "ogr": "org", "og": "org", "rog": "org", "orh": "org",
  "eud": "edu", "ed": "edu", "esu": "edu",
  "oi": "io", "iao": "io",
  "ifo": "info", "inf": "info",
};

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required." };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const [localPart, domain] = trimmed.split("@");

  // Local part checks
  if (!localPart || localPart.length === 0) {
    return { valid: false, error: "Email is missing the username before @." };
  }
  if (localPart.length > 64) {
    return { valid: false, error: "The username part of the email is too long." };
  }

  // Domain checks
  if (!domain || domain.length < 3) {
    return { valid: false, error: "Email domain is invalid." };
  }

  // Check for full domain typos first (e.g., "gmal.com" → "gmail.com")
  if (DOMAIN_TYPOS[domain]) {
    return {
      valid: false,
      error: `"${domain}" looks like a typo.`,
      suggestion: `${localPart}@${DOMAIN_TYPOS[domain]}`,
    };
  }

  // Extract TLD
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2) {
    return { valid: false, error: "Email has an invalid domain extension." };
  }

  // Check for TLD typos (e.g., ".omc" → ".com")
  if (TLD_TYPOS[tld]) {
    const correctedDomain = domainParts.slice(0, -1).join(".") + "." + TLD_TYPOS[tld];
    const correctedFull = DOMAIN_TYPOS[correctedDomain] || correctedDomain;
    return {
      valid: false,
      error: `".${tld}" is not a valid domain extension.`,
      suggestion: `${localPart}@${correctedFull}`,
    };
  }

  // Check TLD is in our known list
  if (!VALID_TLDS.has(tld)) {
    // Allow 2-letter TLDs we might have missed (country codes)
    if (tld.length === 2) {
      return { valid: true }; // Assume valid country code
    }
    return {
      valid: false,
      error: `".${tld}" doesn't appear to be a valid domain extension.`,
    };
  }

  // Check domain has at least one part before TLD
  if (domainParts.length < 2 || domainParts[0].length === 0) {
    return { valid: false, error: "Email domain name is incomplete." };
  }

  return { valid: true };
}
