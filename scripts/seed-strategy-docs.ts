/**
 * Seed initial SEO Strategy Documents
 *
 * Populates the strategy we've built during the onboarding session:
 * 1. Keyword Strategy — the thesis behind our 157-keyword architecture
 * 2. Audit Findings — what GSC data revealed about current state
 * 3. Content Roadmap — blog articles needed and why
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const p = new PrismaClient({ adapter });

const SITE_ID = "site_seedtech";

const docs = [
  {
    title: "Keyword Architecture — 157 Keywords, 3 Tiers",
    category: "keyword_strategy",
    source: "manual",
    content: `## Keyword Strategy Overview

SeedTech tracks 157 keywords across a 3-tier architecture designed to build authority from the bottom up.

### Tier Structure
- **Tier 1 (13 keywords)**: Head terms like "managed IT services northern NJ", "web development company NJ". These are the competitive battleground. We don't expect to win here immediately — authority flows UP from Tier 2 and 3 content.
- **Tier 2 (81 keywords)**: Service-specific, industry-specific, local geo, and conversion keywords. These are the real pipeline — specific enough to convert, achievable enough to rank.
- **Tier 3 (63 keywords)**: Question keywords (FAQ-derived) and blog content keywords. The content engine that feeds authority to Tier 1 and 2 pages.

### Intent Distribution
- Commercial: 82 (52%) — people evaluating services
- Informational: 49 (31%) — people researching problems
- Transactional: 24 (15%) — people ready to buy/contact
- Navigational: 2 (1%) — brand searches

### Keyword Derivation Methodology
Every keyword was derived from one of these sources (not invented):
1. **Actual page copy** — language used on service pages, hero sections, feature lists
2. **FAQ schema content** — exact questions from the site's own FAQ sections (these match Google's "People Also Ask" patterns)
3. **Pricing specifics** — "$110/user/month", "starting at $2,500", "no contract" (high commercial intent)
4. **Differentiator language** — "unlimited help desk", "no ticket black holes", "proactive not reactive" (competitors can't claim these)
5. **Industry page framing** — "digital intake tools law firm", "driver application page trucking" (exact positioning from industry pages)
6. **Local geography** — Northern NJ, Morris/Sussex/Passaic/Warren County, Hopatcong, Parsippany, Morristown, NYC metro

### What This Strategy Does NOT Include
- Made-up search volume numbers (all set to "unknown" until GSC provides real data)
- Generic MSP terms that could apply to any IT company in America
- Keywords targeting "/blog" generically (every blog keyword maps to a specific article slug)
`,
  },
  {
    title: "Reactive Keyword Thesis — Pain-Point Targeting",
    category: "keyword_strategy",
    source: "manual",
    content: `## Reactive / Pain-Point Keyword Strategy

**Core thesis**: Most managed IT searches happen AFTER something breaks. The business owner isn't browsing — they're panicking. These keywords target the exact moment someone realizes they need professional IT.

### 6 Pain Categories (48 keywords total)

**1. Crisis Moment (16 keywords)** — "Something is broken RIGHT NOW"
Email outages, network failures, security breaches, server crashes. These are panic searches with the highest conversion intent and lowest competition. Example: "business email not working", "my business got hacked what do I do", "ransomware attacked my business"

**2. Frustration (9 keywords)** — "My current IT is useless"
The slow burn — bad MSP experience finally boils over. Maps directly to the /why-seedtech page and switching content. Example: "IT support takes too long to respond", "same IT problems keep happening", "how to fire your IT company"

**3. Post-Incident (6 keywords)** — "That just happened, never again"
The breach/outage happened, dust settled, now they want prevention. Converts slower but produces high-value long-term clients. Example: "how to prevent data breach small business", "what to do after a data breach"

**4. Compliance Panic (6 keywords)** — "I just found out I'm not compliant"
Insurance denials, failed audits, client requirements. Example: "cyber insurance denied need IT security", "HIPAA IT requirements small practice", "failed security audit what now"

**5. Cost Shock (6 keywords)** — "I'm paying too much"
Budget pressure creates switching intent. Maps to per-user pricing and no-contract positioning. Example: "IT support too expensive for small business", "IT company locked me into a contract", "how much should IT support cost per user"

**6. Growth Trigger (5 keywords)** — "We outgrew our setup"
Business scaled and the old approach doesn't work. Greenfield prospects who've never had real IT. Example: "outgrew break fix need managed IT", "nephew does our IT need professional help"

### Implications for Content
Every reactive keyword implies a specific blog article or landing page. The content should:
- Lead with empathy ("We know that feeling when your email goes down on a Monday morning")
- Provide immediate actionable advice (builds trust before the pitch)
- Include a clear path to the free IT assessment (the conversion mechanism)
- Reference SeedTech's differentiators naturally (30-min triage, no contracts, per-user pricing)
`,
  },
  {
    title: "GSC Baseline — March 2026 Audit",
    category: "audit_findings",
    source: "ai-audit",
    content: `## Google Search Console Findings — March 2026

### Current State (Grade: B-)
- **94% of organic clicks are brand queries** ("seed tech", "seedtech", "seedtech llc")
- Only 2 of 18 total clicks in the last 28 days came from non-brand service searches
- Average position across all queries: **27.8** (page 3 of Google)
- The site has visibility (impressions) but almost zero click-through on service terms

### What This Means
1. People who already know SeedTech can find it. Good — brand presence is established.
2. People searching for IT services, web development, or cybersecurity in NJ are NOT finding SeedTech. This is the core problem the keyword strategy addresses.
3. The gap between impressions and clicks suggests we're appearing on page 2-3 for relevant terms but not compelling enough to get the click.

### Quick Win Opportunities (from GSC data)
- Law firm IT-related searches show positions in the 40s-50s — industry page optimization could move these significantly
- "IT support" + location modifiers showing early impressions — these need dedicated local content
- Brand searches converting well — add "SeedTech LLC New Jersey" as a tracked keyword to protect and monitor

### 90-Day Target Metrics
- Increase non-brand organic clicks from 2 to 15+
- Improve average position from 27.8 to under 20
- Get at least 5 Tier 2 keywords to page 1 (positions 1-10)
- Grow total monthly impressions by 50%
`,
  },
  {
    title: "Blog Content Roadmap — 31 Articles",
    category: "content_roadmap",
    source: "manual",
    content: `## Blog Content Roadmap

The keyword strategy identifies 31 specific blog articles that need to be written. Each article targets 1-3 Tier 3 keywords and funnels readers toward service pages and the free IT assessment.

### Priority 1 — Reactive/Crisis Content (write first)
These capture people in pain-point moments with the highest conversion potential:
- \`/blog/signs-you-need-a-new-it-provider\` — targets "my IT company is not responsive", "signs you need to switch IT providers"
- \`/blog/signs-your-it-company-is-overcharging\` — targets "signs your IT company is overcharging you", "tired of IT company hidden fees"
- \`/blog/employee-clicked-phishing-link\` — targets crisis moment search
- \`/blog/ransomware-prevention-guide\` — targets "how to prevent ransomware small business"
- \`/blog/managed-it-vs-break-fix\` — targets comparison search
- \`/blog/what-should-it-support-cost-per-user\` — targets cost-aware search

### Priority 2 — Comparison & Education Content
- \`/blog/wix-vs-custom-website\` — captures DIY-frustrated business owners
- \`/blog/squarespace-vs-nextjs\` — technical comparison that builds authority
- \`/blog/outsource-it-vs-hire-in-house\` — decision-stage content
- \`/blog/questions-to-ask-before-hiring-an-msp\` — evaluation-stage content
- \`/blog/small-business-website-cost-2026\` — pricing transparency content
- \`/blog/custom-website-vs-template\` — positioning the SeedTech Platform

### Priority 3 — Cybersecurity Authority Content
- \`/blog/cybersecurity-stats-small-business\` — stat-driven content (60% of SMBs close after breach)
- \`/blog/cybersecurity-checklist-small-business\` — checklist format (highly shareable)
- \`/blog/why-endpoint-security-matters\` — positions SentinelOne stack
- \`/blog/prevent-data-breach-small-business\` — post-incident content
- \`/blog/signs-your-business-has-been-hacked\` — awareness content
- \`/blog/after-data-breach-next-steps\` — crisis recovery content
- \`/blog/cyber-insurance-it-requirements\` — compliance-driven content
- \`/blog/failed-security-audit-next-steps\` — compliance panic content

### Priority 4 — AI/SEO Thought Leadership
- \`/blog/how-to-get-cited-by-ai-search\` — positions SeedTech as forward-thinking
- \`/blog/why-your-website-gets-no-traffic\` — leads to SEO Autopilot service

### Priority 5 — MSP Switching & Frustration Content
- \`/blog/why-your-msp-sends-a-different-tech-every-time\` — addresses large MSP pain point
- \`/blog/is-your-it-company-actually-doing-anything\` — provocative title, high click potential
- \`/blog/how-to-switch-it-providers-without-downtime\` — practical guide, conversion content
- \`/blog/when-to-stop-using-your-nephew-for-it\` — humor + relatability for small business owners
- \`/blog/ransomware-recovery-steps\` — post-incident practical guide

### Content Guidelines
- Every article must include a citeable opening paragraph (20-60 words, directly answering the core question)
- Every article must reference SeedTech entity naturally ("SeedTech, a Northern NJ managed IT provider...")
- Every article must link to at least 2 internal service pages
- Every article must end with a CTA pointing to the free IT assessment
- AI systems (Google AIO, ChatGPT, Perplexity) prioritize content with specific facts, numbers, and structured answers
`,
  },
];

async function main() {
  console.log(`\n📝 Seeding ${docs.length} SEO Strategy Documents...\n`);

  for (const doc of docs) {
    const created = await p.seoStrategyDoc.create({
      data: {
        siteId: SITE_ID,
        title: doc.title,
        category: doc.category as any,
        content: doc.content,
        isActive: true,
        source: doc.source,
      },
    });
    console.log(`   ✅ "${created.title}" (${doc.category})`);
  }

  const total = await p.seoStrategyDoc.count({ where: { siteId: SITE_ID } });
  console.log(`\n📊 Total strategy docs: ${total}`);
  console.log(`   All active and feeding into AI prompts.\n`);

  await p.$disconnect();
}

main().catch(console.error);
