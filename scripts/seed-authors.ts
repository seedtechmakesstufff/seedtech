/* ── Seed Author entities for EEAT ── */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Author: Matt Oliva
  const matt = await prisma.author.upsert({
    where: { siteId_slug: { siteId: "site_seedtech", slug: "matt-oliva" } },
    update: {},
    create: {
      siteId: "site_seedtech",
      name: "Matt Oliva",
      slug: "matt-oliva",
      jobTitle: "CEO & Director of Managed IT",
      bio: "Matt Oliva is the CEO of SeedTech and leads the managed IT services division. With over 15 years of experience in IT infrastructure, cybersecurity, and business technology consulting, Matt specializes in designing proactive IT support strategies for small and mid-size businesses across Northern New Jersey. He holds CompTIA A+, Network+, and Security+ certifications.",
      imageUrl: "/images/team/matt-oliva.jpg",
      canonicalUrl: "/about#matt-oliva",
      sameAs: ["https://www.linkedin.com/in/mattoliva/"],
      expertise: [
        "managed IT services",
        "cybersecurity",
        "IT infrastructure",
        "cloud solutions",
        "business continuity",
        "network management",
      ],
      credentials: ["CompTIA A+", "CompTIA Network+", "CompTIA Security+"],
      experience:
        "15+ years in IT services, infrastructure, and cybersecurity for SMBs",
      isDefault: true,
    },
  });
  console.log("✅ Matt Oliva:", matt.id);

  // Seed Author: Sam Swaynos
  const sam = await prisma.author.upsert({
    where: { siteId_slug: { siteId: "site_seedtech", slug: "sam-swaynos" } },
    update: {},
    create: {
      siteId: "site_seedtech",
      name: "Sam Swaynos",
      slug: "sam-swaynos",
      jobTitle: "Co-Owner & Product Director",
      bio: "Sam Swaynos is the Co-Owner and Product Director at SeedTech, overseeing web development, digital marketing, and product strategy. With a background in full-stack development and SEO, Sam builds custom web applications and marketing systems that drive measurable business results for clients in Northern New Jersey.",
      imageUrl: "/images/team/sam-swaynos.jpg",
      canonicalUrl: "/about#sam-swaynos",
      sameAs: ["https://www.linkedin.com/in/samswaynos/"],
      expertise: [
        "web development",
        "SEO",
        "digital marketing",
        "full-stack development",
        "ecommerce",
        "custom applications",
      ],
      credentials: [],
      experience:
        "10+ years in web development, SEO, and digital product strategy",
      isDefault: false,
    },
  });
  console.log("✅ Sam Swaynos:", sam.id);

  // Link existing blog posts to Matt (default author)
  const updated = await prisma.blogPost.updateMany({
    where: { siteId: "site_seedtech", authorId: null },
    data: { authorId: matt.id, author: "Matt Oliva" },
  });
  console.log(`✅ Linked ${updated.count} posts to Matt`);

  // Remove orphan /services/cybersecurity from site_pages (no route exists)
  const deleted = await prisma.sitePage.deleteMany({
    where: { siteId: "site_seedtech", path: "/services/cybersecurity" },
  });
  console.log(`✅ Removed ${deleted.count} orphan /services/cybersecurity page(s)`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
