/**
 * Run the first GSC sync to populate keyword data
 * Run: npx tsx scripts/run-gsc-sync.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });

// We need to set up the prisma instance for the gsc-sync module
// Since gsc-sync imports from @/lib/prisma, we'll use fetch to trigger the API instead
// But for scripts, let's call the GSC API directly

import { google } from "googleapis";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SITE_ID = "site_seedtech";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

function getClient() {
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE!;

  try {
    const parsed = JSON.parse(key);
    if (parsed.private_key) key = parsed.private_key;
    if (parsed.client_email) email = parsed.client_email;
  } catch {
    // Raw PEM
  }

  if (key && !key.includes("\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.JWT({ email, key, scopes: SCOPES });
  return { searchconsole: google.searchconsole({ version: "v1", auth }), siteUrl };
}

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

async function main() {
  const { searchconsole, siteUrl } = getClient();
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 28);
  
  console.log(`Fetching GSC data for ${siteUrl} (${fmt(startDate)} to ${fmt(endDate)})...\n`);
  
  // Create sync log
  const syncLog = await prisma.gscSyncLog.create({
    data: { siteId: SITE_ID, status: "running", syncType: "full", daysRange: 28 },
  });
  
  const startTime = Date.now();
  
  try {
    // Fetch keywords
    const kwRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ["query"],
        rowLimit: 500,
        type: "web",
      },
    });
    
    const keywords = (kwRes.data.rows ?? []).map((r: any) => ({
      keyword: r.keys![0],
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: Math.round((r.position ?? 0) * 10) / 10,
    }));
    
    console.log(`Fetched ${keywords.length} keywords`);
    
    // Fetch pages
    const pgRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ["page"],
        rowLimit: 200,
        type: "web",
      },
    });
    
    const pages = (pgRes.data.rows ?? []).map((r: any) => ({
      page: r.keys![0],
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: Math.round((r.position ?? 0) * 10) / 10,
    }));
    
    console.log(`Fetched ${pages.length} pages`);
    
    // Store keyword data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const kw of keywords) {
      await prisma.gscDailyKeyword.upsert({
        where: {
          siteId_date_query_device_country: {
            siteId: SITE_ID, date: today, query: kw.keyword, device: "all", country: "all",
          },
        },
        create: {
          siteId: SITE_ID, date: today, query: kw.keyword,
          clicks: kw.clicks, impressions: kw.impressions, ctr: kw.ctr, position: kw.position,
          device: "all", country: "all",
        },
        update: { clicks: kw.clicks, impressions: kw.impressions, ctr: kw.ctr, position: kw.position },
      });
    }
    console.log(`Stored ${keywords.length} keyword records`);
    
    // Store page data
    for (const pg of pages) {
      await prisma.gscDailyPage.upsert({
        where: {
          siteId_date_pageUrl_device_country: {
            siteId: SITE_ID, date: today, pageUrl: pg.page, device: "all", country: "all",
          },
        },
        create: {
          siteId: SITE_ID, date: today, pageUrl: pg.page,
          clicks: pg.clicks, impressions: pg.impressions, ctr: pg.ctr, position: pg.position,
          device: "all", country: "all",
        },
        update: { clicks: pg.clicks, impressions: pg.impressions, ctr: pg.ctr, position: pg.position },
      });
    }
    console.log(`Stored ${pages.length} page records`);
    
    // Update tracked keywords
    const tracked = await prisma.trackedKeyword.findMany({
      where: { siteId: SITE_ID, isActive: true },
    });
    
    const gscMap = new Map<string, typeof keywords[0]>();
    for (const kw of keywords) {
      gscMap.set(kw.keyword.toLowerCase(), kw);
    }
    
    let updated = 0;
    for (const tk of tracked) {
      const gscData = gscMap.get(tk.keyword.toLowerCase());
      if (!gscData) continue;
      
      const data: Record<string, unknown> = {
        previousPosition: tk.currentPosition,
        currentPosition: gscData.position,
        clicks28d: gscData.clicks,
        impressions28d: gscData.impressions,
        ctr28d: gscData.ctr,
      };
      
      if (tk.bestPosition === null || gscData.position < tk.bestPosition) {
        data.bestPosition = gscData.position;
      }
      
      await prisma.trackedKeyword.update({ where: { id: tk.id }, data });
      updated++;
      console.log(`  ↻ ${tk.keyword}: pos ${gscData.position}, clicks ${gscData.clicks}, impressions ${gscData.impressions}`);
    }
    
    const durationMs = Date.now() - startTime;
    
    await prisma.gscSyncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "completed",
        keywordsFetched: keywords.length,
        pagesFetched: pages.length,
        keywordsUpdated: updated,
        completedAt: new Date(),
        durationMs,
      },
    });
    
    console.log(`\n✓ Sync complete in ${durationMs}ms`);
    console.log(`  Keywords: ${keywords.length} fetched, ${updated}/${tracked.length} tracked keywords updated`);
    console.log(`  Pages: ${pages.length} fetched`);
    
    // Show top 10 keywords
    console.log("\nTop 10 keywords by clicks:");
    const sorted = [...keywords].sort((a, b) => b.clicks - a.clicks);
    for (const kw of sorted.slice(0, 10)) {
      console.log(`  ${kw.keyword}: pos ${kw.position}, ${kw.clicks} clicks, ${kw.impressions} imp`);
    }
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await prisma.gscSyncLog.update({
      where: { id: syncLog.id },
      data: { status: "failed", completedAt: new Date(), durationMs: Date.now() - startTime, errorMessage: errMsg },
    });
    console.error("Sync failed:", errMsg);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
