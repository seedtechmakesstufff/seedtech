import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const p = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const latest = await p.seoPageAudit.findFirst({
    where: { siteId: "site_seedtech" },
    orderBy: { createdAt: "desc" },
    select: { runId: true, createdAt: true },
  });
  if (!latest) {
    console.log("No crawl results");
    return;
  }
  console.log("Run:", latest.runId, "at", latest.createdAt);

  const issues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, severity: { in: ["critical", "warning"] } },
    orderBy: [{ severity: "asc" }, { checkType: "asc" }, { url: "asc" }],
  });
  console.log("Total critical/warning issues:", issues.length, "\n");

  for (const i of issues) {
    const sev = i.severity.toUpperCase().padEnd(9);
    const check = i.checkType.padEnd(35);
    const url = i.url.padEnd(55);
    const msg = (i.message || "").substring(0, 140);
    console.log(`${sev} ${check} ${url} ${msg}`);
  }

  // Also show info issues for completeness
  const infoIssues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, severity: "info" },
    orderBy: [{ checkType: "asc" }, { url: "asc" }],
  });
  if (infoIssues.length > 0) {
    console.log("\n--- INFO issues:", infoIssues.length, "---");
    for (const i of infoIssues) {
      console.log(`INFO      ${i.checkType.padEnd(35)} ${i.url.padEnd(55)} ${(i.message || "").substring(0, 140)}`);
    }
  }

  await p.$disconnect();
}
main();
