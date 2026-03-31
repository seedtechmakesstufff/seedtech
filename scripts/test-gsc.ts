import { google } from "googleapis";
import fs from "fs";

const content = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
for (const line of content.split("\n")) {
  const idx = line.indexOf("=");
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
}

let key = env["GOOGLE_SERVICE_ACCOUNT_KEY"];
const email = env["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
const site = env["GOOGLE_SEARCH_CONSOLE_SITE"];

if (key && !key.includes("\n")) key = key.replace(/\\n/g, "\n");

console.log("Testing with email:", email);
console.log("Testing with site:", site);
console.log("Key valid PEM:", key?.startsWith("-----BEGIN PRIVATE KEY-----"));
console.log("Key line count:", key?.split("\n").length);

async function main() {
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const sc = google.searchconsole({ version: "v1", auth });

  console.log("\n--- Testing sites.list() ---");
  try {
    const sites = await sc.sites.list();
    console.log("Sites:", JSON.stringify(sites.data));
  } catch (e: any) {
    console.log("Error:", e.message);
  }

  console.log("\n--- Testing sites.get() ---");
  try {
    const result = await sc.sites.get({ siteUrl: site });
    console.log("Result:", JSON.stringify(result.data));
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}

main().catch(console.error);
