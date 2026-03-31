import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const site = await prisma.site.findFirst();
  const siteId = site!.id;
  const [tasks, ideas, insights, crawls, snapshots, keywords, metadata, pages, nodes, pageContexts, competitors, blogPosts] = await Promise.all([
    prisma.seoTask.count({ where: { siteId } }),
    prisma.contentIdea.count({ where: { siteId } }),
    prisma.seoInsight.count({ where: { siteId, status: "active" } }),
    prisma.seoCrawlRun.count({ where: { siteId } }),
    prisma.seoSnapshot.count({ where: { siteId } }),
    prisma.trackedKeyword.count({ where: { siteId } }),
    prisma.pageMetadata.count({ where: { siteId, title: { not: "" } } }),
    prisma.sitePage.count({ where: { siteId } }),
    prisma.contextNode.count({ where: { siteId } }),
    prisma.pageContext.count({ where: { siteId } }),
    prisma.competitorDomain.count({ where: { siteId } }),
    prisma.blogPost.count({ where: { siteId, status: "published" } }),
  ]);
  console.log("=== DB State ===");
  console.log({ tasks, ideas, insights, crawls, snapshots, keywords, metadata, pages, nodes, pageContexts, competitors, blogPosts });
}

main().catch(console.error).finally(() => prisma.$disconnect());
