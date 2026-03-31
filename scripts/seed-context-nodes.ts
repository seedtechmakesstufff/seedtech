/**
 * Seed script — backfill SeedTech context nodes with real service data.
 * Run: npx tsx scripts/seed-context-nodes.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const site = await prisma.site.findFirst();
  if (!site) {
    console.error("No site found in database");
    process.exit(1);
  }
  const siteId = site.id;
  console.log(`Site: ${site.domain} (${siteId})\n`);

  // ── Check existing nodes ──
  const existingNodes = await prisma.contextNode.findMany({ where: { siteId } });
  console.log(`Existing nodes: ${existingNodes.length}`);
  existingNodes.forEach((n) => console.log(`  - ${n.nodeType}: ${n.name} (${n.slug})`));

  // ── Check existing page contexts ──
  const pages = await prisma.pageContext.findMany({
    where: { siteId },
    select: { id: true, path: true, pageType: true },
  });
  console.log(`\nPage contexts: ${pages.length}`);
  pages.forEach((p) => console.log(`  - ${p.path} (${p.pageType})`));

  // ── Define service nodes ──
  const serviceNodes = [
    {
      name: "Managed IT Support (SeedCare)",
      slug: "managed-it",
      nodeType: "service",
      color: "#3b82f6",
      icon: "Shield",
      summary:
        "SeedCare is SeedTech's managed IT brand — three tiered plans (Essentials $110, Plus $130, Pro $160 per user/month), month-to-month, flat-rate per-user pricing. Proactive monitoring, unlimited remote help desk, vendor coordination, and a discovery-first sales process. Built for multi-location businesses with office + field workers.",
      audience:
        "Small-to-mid businesses (5–150 users) in NY/NJ metro. Multi-location or hybrid teams with office staff and field crews. Industries: construction, fiber/telecom, professional services, trades. Currently frustrated with large MSPs (ticket black holes, revolving techs, hidden costs).",
      pricing:
        "SeedCare Essentials: $110/user/mo • SeedCare Plus: $130–135/user/mo (recommended) • SeedCare Pro: $155–160/user/mo. Add-ons: MDM $12/device/mo, 5G failover $40/location/mo. No minimums, no annual contracts.",
      usps: [
        "Month-to-month — no annual contracts, earn the business every cycle",
        "Per-user pricing covers ALL devices (laptop, phone, monitors, peripherals)",
        "Unlimited remote help desk on every plan — no ticket caps",
        "Mix-and-match plans by role/location (execs on Pro, field on Essentials)",
        "Proactive monitoring catches issues before users report them",
        "Same technicians who know your environment — not whoever is free",
        "Assessment Walkthrough first — low-risk, high-value entry point",
        "Full vendor coordination (ISPs, carriers, LOB software) — no more phone tag",
      ],
      messaging:
        "Confident, direct, no-BS. Professional but approachable. Lead with accountability and structure, not headcount. Frame SeedTech as the opposite of large, impersonal MSPs. Never defensive about team size — reframe as 'the right structure, not a large team'. Use 'proactive' not 'reactive'. Use 'partner' not 'vendor'.",
      doSay: [
        "Proactive IT support",
        "Flat-rate, per-user pricing",
        "No long-term contracts",
        "Unlimited remote help desk",
        "Mix and match plans",
        "Field + office support",
        "We handle your vendors",
        "Assessment, not a contract",
        "You get people who know your environment",
        "Accountability, not volume",
        "No ticket black holes",
        "SeedCare Essentials / Plus / Pro",
      ],
      dontSay: [
        "Break-fix",
        "Per-device pricing",
        "Hourly billing",
        "Minimum seats",
        "Annual commitment",
        "We're a small company",
        "Not enough technicians",
        "Smaller team",
      ],
      competitors: [
        "Large MSPs (Kaseya-backed, ConnectWise-driven)",
        "Traditional break-fix IT shops",
        "In-house IT staff ($65k/yr per person, ~1:20 ratio)",
      ],
      detailedContext: `## SeedCare Plans

### Essentials ($110/user/mo)
Baseline protection. Remote support + monitoring.
- Unlimited remote help desk
- Unlimited on-site (business hours)
- Endpoint monitoring + patch management
- SentinelOne antivirus
- File cloud backup (30-day)

### Plus ($130–135/user/mo) ⭐ RECOMMENDED
Ops-ready. Proactive monitoring + vendor management.
- Everything in Essentials
- Up to 4 hrs/month on-site
- Network monitoring
- M365/Google cloud backup (50GB)
- Monthly device health reports
- Vendor coordination
- Unlimited consultation

### Pro ($155–160/user/mo)
Full-service IT for growing orgs.
- Everything in Plus
- Unlimited on-site
- Unlimited cloud backup (full image)
- Quarterly vCIO / QBR strategy sessions
- Hardware refresh planning
- Project coordination
- Priority response

## Support Stack
- NinjaOne (RMM — monitoring, patching, backup)
- SentinelOne (AI endpoint security)
- Custom PowerShell automation
- Real-time push alerting

## Sales Process
1. First Meeting (60 min) — discovery questions, NOT a pitch
2. Assessment Walkthrough (45–60 min) — technical deep dive
3. Deliverable: action plan + recommended SeedCare tier

## Onboarding (30 days)
- Week 1: Deep dive discovery (network maps, credentials, vendor contacts)
- Week 2: Silent deployment (NinjaOne + SentinelOne agents, zero disruption)
- Week 3: Go live (automations, monitoring, alerting active)
- Week 4: Optimization (fine-tune based on first week of live data)

## Key Messaging Priority
**HIGH PRIORITY**: "Accountability, not volume" — the #1 differentiator.
Large MSPs have ticket escalation tiers (L1→L2→L3), revolving techs, and ticket black holes.
SeedTech has one team with direct authority, same people who know your environment, clear ownership through resolution.

## Ideal Client
Multi-location/hybrid teams, office + field workers, emergency response windows, vendor complexity, currently on break-fix or frustrated with large MSP.`,
      posX: 200,
      posY: 260,
    },
    {
      name: "Web Development",
      slug: "web-development",
      nodeType: "service",
      color: "#10b981",
      icon: "Globe",
      summary:
        "Full-service web development — from branding and design through to production builds on modern frameworks. Covers the SeedTech Platform (fast-launch for service businesses), fully custom builds, and ecommerce storefronts. Every web build includes SEO Autopilot configuration.",
      audience:
        "Service businesses, lead-generation brands, professional firms, and growing companies that need a modern website. Companies that want to own their code (not locked into Wix/Squarespace). Businesses ready to invest $2,500–$25,000+ in a proper web presence.",
      pricing:
        "SeedTech Platform: Basic Build from $2,500 (up to 5 pages), Robust Build from $7,800 (8–15 pages). Custom Development: $15,000+ for complex systems. Ecommerce: varies by platform and scope.",
      usps: [
        "Built on Next.js — you own your code, not locked into a page builder",
        "SEO Autopilot configured from day one — not bolted on later",
        "Three paths: SeedTech Platform (fast launch), Custom Development, Ecommerce",
        "Same team handles IT + web + SEO — no vendor coordination tax",
        "Performance-optimized builds (fast load times, Core Web Vitals)",
        "Scalable architecture that grows with your business",
      ],
      messaging:
        "Position web development as a spectrum — SeedTech Platform for fast launches, custom builds for complex needs, ecommerce for stores. Always mention SEO is built in, not an afterthought. Emphasize code ownership vs. page builders.",
      doSay: [
        "You own your code",
        "SEO built in from day one",
        "SeedTech Platform",
        "Modern frameworks (Next.js, React)",
        "Performance-optimized",
        "Scalable architecture",
        "Three paths for different needs",
      ],
      dontSay: [
        "WordPress",
        "Wix",
        "Squarespace",
        "Template-based",
        "Drag and drop",
        "Page builder",
      ],
      competitors: [
        "Wix / Squarespace / WordPress agencies",
        "Freelance web developers",
        "Large digital agencies ($50k+ projects)",
      ],
      detailedContext: `## Three Web Development Paths

### 1. SeedTech Platform (Fast Launch)
For service businesses and lead-gen brands.
- Basic Build: $2,500 (up to 5 pages)
- Robust Build: $7,800 (8–15 pages)
- Includes: mobile-responsive, forms, SEO Autopilot, deployment
- Built on Next.js, performance-optimized

### 2. Custom Development
For businesses with complex requirements.
- $15,000+ depending on scope
- Custom UI/UX, integrations, dashboards
- Full-stack development

### 3. Ecommerce Development
For businesses selling products online.
- Shopify, custom storefronts
- Inventory management, payment processing
- B2B and B2C solutions

## Every Web Build Includes
- SEO Autopilot configuration
- Mobile-responsive design
- Performance optimization
- Contact/lead capture forms
- Launch and deployment
- Code ownership (you own everything)`,
      posX: 520,
      posY: 260,
    },
    {
      name: "SEO Autopilot",
      slug: "seo-autopilot",
      nodeType: "offering",
      color: "#f59e0b",
      icon: "TrendingUp",
      summary:
        "SEO Autopilot is SeedTech's AI-powered SEO platform that comes built into every website build. It monitors visibility, plans content, generates metadata, tracks keywords, and provides an AI SEO advisor — all configured from the same business context used to build the site.",
      audience:
        "SeedTech web development clients who want their SEO operational from launch. Service businesses and lead-gen brands. Not currently intended for ecommerce storefronts.",
      pricing:
        "Included with SeedTech Platform web builds. Also available as a standalone platform for existing websites.",
      usps: [
        "Configured from your business context — not generic keyword stuffing",
        "Built into the website from day one — not added months later",
        "AI-powered metadata generation using Claude",
        "Keyword tracking with Google Search Console integration",
        "AI SEO advisor for strategic recommendations",
        "Structured context nodes prevent cross-service contamination",
      ],
      messaging:
        "Position as the reason SeedTech websites launch ready to compete — not just live, but SEO-operational. Emphasize that SEO Autopilot is configured from the same business context used to build the site, so everything is aligned from the start.",
      doSay: [
        "SEO Autopilot",
        "Built in from day one",
        "Configured from your business context",
        "AI-powered metadata",
        "Keyword tracking",
        "SEO advisor",
        "Operational from launch",
      ],
      dontSay: [
        "SEO plugin",
        "SEO add-on",
        "Yoast",
        "Manual SEO",
        "Keyword stuffing",
      ],
      competitors: [
        "Yoast / RankMath / SEO plugins",
        "Semrush / Ahrefs (monitoring-only, no built-in generation)",
        "Freelance SEO consultants",
        "Generic AI writing tools (no business context)",
      ],
      detailedContext: `## What SEO Autopilot Does
- AI metadata generation (title tags, meta descriptions) powered by Claude
- Keyword research agent with 5 research modes
- Google Search Console integration for real position tracking
- AI SEO advisor with strategic recommendations
- Context nodes system for service-specific content generation
- Bulk generation with streaming progress

## How It Works
1. Business context is structured into nodes (business profile, services, keywords)
2. Each page is linked to relevant service nodes with relevance levels
3. When generating metadata, the AI receives page-specific context
4. No cross-contamination: managed IT pages get managed IT context, web dev pages get web dev context

## Best for
- Service-business websites
- Lead-generation sites
- Professional firms
- NOT currently for ecommerce storefronts`,
      posX: 840,
      posY: 260,
    },
  ];

  // ── Create or update service nodes ──
  for (const node of serviceNodes) {
    const existing = await prisma.contextNode.findFirst({
      where: { siteId, slug: node.slug },
    });

    if (existing) {
      console.log(`\n✏️  Updating existing node: ${node.name}`);
      await prisma.contextNode.update({
        where: { id: existing.id },
        data: {
          name: node.name,
          nodeType: node.nodeType,
          color: node.color,
          icon: node.icon,
          summary: node.summary,
          audience: node.audience,
          pricing: node.pricing,
          usps: node.usps,
          messaging: node.messaging,
          doSay: node.doSay,
          dontSay: node.dontSay,
          competitors: node.competitors,
          detailedContext: node.detailedContext,
          posX: node.posX,
          posY: node.posY,
        },
      });
    } else {
      console.log(`\n✅ Creating node: ${node.name}`);
      await prisma.contextNode.create({
        data: {
          siteId,
          ...node,
        },
      });
    }
  }

  // ── Also update the business node position if it exists ──
  const bizNode = await prisma.contextNode.findFirst({
    where: { siteId, nodeType: "business" },
  });
  if (bizNode) {
    await prisma.contextNode.update({
      where: { id: bizNode.id },
      data: { posX: 520, posY: 40 },
    });
    console.log(`\n📍 Updated business node position`);
  }

  // ── Link nodes to page contexts ──
  const linkMap: Record<string, { path: string; relevance: string }[]> = {
    "managed-it": [
      { path: "/services/managed-it", relevance: "primary" },
      { path: "/pricing/it-support", relevance: "primary" },
      { path: "/services/managed-it/why-seedtech", relevance: "primary" },
      { path: "/", relevance: "secondary" },
      { path: "/services", relevance: "secondary" },
      { path: "/about", relevance: "mention" },
      { path: "/contact", relevance: "mention" },
    ],
    "web-development": [
      { path: "/services/web-development", relevance: "primary" },
      { path: "/services/seedtech-platform", relevance: "primary" },
      { path: "/services/ecommerce-development", relevance: "primary" },
      { path: "/services/custom-development", relevance: "primary" },
      { path: "/pricing/web-development", relevance: "primary" },
      { path: "/", relevance: "secondary" },
      { path: "/services", relevance: "secondary" },
      { path: "/our-work", relevance: "secondary" },
      { path: "/about", relevance: "mention" },
    ],
    "seo-autopilot": [
      { path: "/services/seo-autopilot", relevance: "primary" },
      { path: "/services/seedtech-platform", relevance: "secondary" },
      { path: "/services/web-development", relevance: "mention" },
      { path: "/", relevance: "mention" },
    ],
  };

  for (const [slug, links] of Object.entries(linkMap)) {
    const node = await prisma.contextNode.findFirst({
      where: { siteId, slug },
    });
    if (!node) continue;

    for (const link of links) {
      const page = pages.find((p) => p.path === link.path);
      if (!page) {
        console.log(`  ⚠️  Page not found for linking: ${link.path}`);
        continue;
      }

      await prisma.pageContextNode.upsert({
        where: {
          pageContextId_contextNodeId: {
            pageContextId: page.id,
            contextNodeId: node.id,
          },
        },
        create: {
          pageContextId: page.id,
          contextNodeId: node.id,
          relevance: link.relevance,
        },
        update: {
          relevance: link.relevance,
        },
      });
      console.log(`  🔗 ${node.name} → ${link.path} (${link.relevance})`);
    }
  }

  console.log("\n🎉 Done! Context nodes seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
