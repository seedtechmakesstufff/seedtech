import fs from "fs";

const content = fs.readFileSync(".env.local", "utf8");

// Parse env file manually
const env = {};
for (const line of content.split("\n")) {
  const idx = line.indexOf("=");
  if (idx > 0) {
    env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
  }
}

const rawKey = env["GOOGLE_SERVICE_ACCOUNT_KEY"];
const email = env["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
const site = env["GOOGLE_SEARCH_CONSOLE_SITE"];

console.log("=== RAW ENV VALUES ===");
console.log("EMAIL:", email);
console.log("SITE:", site);
console.log("KEY length:", rawKey?.length);
console.log("KEY first 60:", rawKey?.substring(0, 60));
console.log("KEY last 40:", rawKey?.substring(rawKey.length - 40));
console.log("KEY has real newline (\\n char):", rawKey?.includes("\n"));
console.log("KEY has literal backslash-n:", rawKey?.includes("\\n"));

// --- Simulate site-data.ts getSearchConsoleIntegration ---
// The env fallback does: credentials: JSON.stringify({ client_email: email, private_key: key })
const credentials = JSON.stringify({
  client_email: email,
  private_key: rawKey,
});

console.log("\n=== AFTER JSON.stringify IN site-data.ts ===");
const credParsed = JSON.parse(credentials);
console.log("Parsed private_key first 60:", credParsed.private_key?.substring(0, 60));
console.log("Has real newline after JSON round-trip:", credParsed.private_key?.includes("\n"));

// --- Simulate getClient in google-search-console.ts ---
let key = credParsed.private_key;

console.log("\n=== BEFORE FIX ===");
console.log("key has real newline:", key?.includes("\n"));

// Apply the fix (from our patch)
if (key && !key.includes("\n")) {
  key = key.replace(/\\n/g, "\n");
}

console.log("\n=== AFTER FIX ===");
console.log("key has real newline:", key?.includes("\n"));
console.log("key line count:", key?.split("\n").length);
console.log("key starts correctly:", key?.startsWith("-----BEGIN PRIVATE KEY-----"));
console.log("key ends correctly:", key?.trim().endsWith("-----END PRIVATE KEY-----"));
console.log("key first 50:", key?.substring(0, 50));
