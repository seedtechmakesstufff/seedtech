import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const p = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const latest = await p.seoPageAudit.findFirst({
    where: { siteId: "site_seedtech" },
    orderBy: { createdAt: "desc" },
    select: { runId: true },
  });
  if (!latest) return;

  const altIssues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, checkType: "missing-alt-text" },
  });

  for (const i of altIssues) {
    console.log(`\n=== ${i.url} ===`);
    console.log(`  Count: ${(i.details as any)?.count}`);
    console.log(`  Sample srcs:`, JSON.stringify((i.details as any)?.srcs, null, 2));
  }

  // Also check heading hierarchy details
  const headingIssues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, checkType: "heading-hierarchy-broken" },
  });
  for (const i of headingIssues) {
    console.log(`\n=== HEADING: ${i.url} ===`);
    console.log(`  Skips:`, JSON.stringify((i.details as any)?.skips, null, 2));
  }

  // Lazy loading details
  const lazyIssues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, checkType: "missing-lazy-loading" },
  });
  for (const i of lazyIssues) {
    console.log(`\n=== LAZY: ${i.url} ===`);
    console.log(`  Details:`, JSON.stringify(i.details, null, 2));
  }

  // Redirect details
  const redirectIssues = await p.seoPageAudit.findMany({
    where: { siteId: "site_seedtech", runId: latest.runId, checkType: "redirect-chain" },
  });
  for (const i of redirectIssues) {
    console.log(`\n=== REDIRECT: ${i.url} ===`);
    console.log(`  Chain:`, JSON.stringify((i.details as any)?.chain, null, 2));
  }

  await p.$disconnect();
}
main();
