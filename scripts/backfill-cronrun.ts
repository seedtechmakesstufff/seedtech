import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";
config({ path: ".env.local" });
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const log = await prisma.gscSyncLog.findFirst({
    where: { siteId: "site_seedtech", status: "completed" },
    orderBy: { createdAt: "desc" },
  });
  if (!log) { console.log("No sync log found"); return; }
  await prisma.cronJobRun.create({
    data: {
      siteId: "site_seedtech",
      jobType: "gsc_pull",
      status: "completed",
      completedAt: log.completedAt ?? new Date(),
      durationMs: log.durationMs,
      resultSummary: `Fetched ${log.keywordsFetched} keywords, ${log.pagesFetched} pages.`,
    },
  });
  console.log("✓ Backfilled CronJobRun for initial GSC sync");
}
main().catch(console.error).finally(() => prisma.$disconnect());
