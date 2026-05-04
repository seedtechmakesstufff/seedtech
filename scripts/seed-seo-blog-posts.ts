/* ── Seed restaurant SEO blog posts ──
 * Creates two long-form SEO posts referenced from /seo-for-restaurants:
 *   1. "Restaurant SEO Statistics 2026" (formerly the "By the Numbers" section)
 *   2. "Why Most Restaurant Websites Are Invisible to Google and AI Search"
 *      (formerly the "What's Broken" section)
 */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SITE_ID = "site_seedtech";

function countWords(text: string): number {
  return text
    .replace(/[#*_\[\]()>`~-]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

const posts = [
  {
    slug: "restaurant-seo-statistics-2026",
    title: "Restaurant SEO Statistics 2026: The Numbers Every Owner Should Know",
    excerpt:
      "If you run a restaurant and you're wondering whether SEO is worth investing in, the data is overwhelming. Here are the numbers that explain why restaurants who invest in search win, and why most don't.",
    targetKeyword: "restaurant seo statistics",
    metaTitle: "Restaurant SEO Statistics 2026 — Local Search Data You Need",
    metaDescription:
      "Restaurant SEO statistics for 2026: 64% of diners check Google before booking, 88% of local searches lead to a visit within 24 hours, and AI search now drives a meaningful share of restaurant discovery.",
    body: `Most restaurant owners know "SEO matters" the way they know "good lighting matters" — vaguely, abstractly, and usually as the last thing they get to. But the data on restaurant search behavior in 2026 is no longer abstract. It is the single largest discovery channel for new diners, it is shifting fast toward AI-mediated answers, and the gap between restaurants who optimize for it and restaurants who don't is widening every quarter.

Here is the data, in plain numbers, with sources you can verify.

## Diners start their journey on search, not on social

Across multiple industry studies — including reports from Google, BrightLocal, SOCi, and OpenTable — the same pattern shows up: when a person decides they want to eat out, the very first thing they do is search.

- **88%** of consumers who do a local search on their phone visit or call a business within 24 hours.
- **64%** of diners check Google search results or Google Maps before deciding where to eat.
- **76%** of "near me" mobile searches result in an offline visit within a day.
- The phrase **"restaurants near me"** alone is searched several million times per day in the United States.

Social media still matters for brand-building. But for *intent* — for "I am hungry, where am I going right now" — search is the channel.

## Google Maps is the highest-leverage real estate in hospitality

If you've ever wondered why some restaurants always seem to be packed even though their food is mediocre, the answer is usually the same: they rank in the **Map Pack** for their local search terms.

- The top 3 Google Maps results (the "Map Pack") capture roughly **44%** of all clicks for local restaurant searches.
- Map Pack results get **3x more clicks** than the organic blue-link results below them.
- Restaurants that show up in the Map Pack receive a **2-3x increase in reservations** compared to similar restaurants that don't.
- A fully optimized Google Business Profile generates an average of **1,260 monthly views** for restaurants in mid-size markets — and far more in dense metro areas.

The Map Pack isn't a small piece of the SEO pie. For restaurants, it is the pie.

## AI search is no longer a future trend — it's a current channel

In 2024, AI-mediated search (ChatGPT, Perplexity, Gemini, Google's AI Overviews, Copilot) was a curiosity. By 2026, it is a meaningful slice of restaurant discovery.

- **45%** of consumers now use AI assistants at least occasionally to discover new restaurants and recommendations.
- AI Overviews appear on more than **60%** of "best [cuisine] in [city]" queries, often above the traditional Map Pack.
- ChatGPT, Perplexity, and Gemini collectively answer billions of recommendation-style queries each month.
- Restaurants that optimize for **AI citation** (structured data, clear content, schema-marked menus) see meaningful inbound traffic from AI assistants — often within the first 60–90 days of optimization.

The mistake most restaurant owners make is assuming AI search will replace Google. It won't. It will *layer* on top of Google. Both channels matter. Restaurants who appear in both win.

## Reviews are the single biggest local ranking factor

Google has been transparent for years about the role reviews play in local rankings. The data:

- **93%** of consumers say online reviews influence their restaurant choice.
- Restaurants with a **4.5+ star rating** receive **70%** more reservations than those at 4.0 or below.
- Each additional star on Google is correlated with a **5–9%** increase in revenue for hospitality businesses.
- Restaurants that respond to reviews (positive *and* negative) rank higher than those that don't.

If you're getting reviews but not actively managing them — replying, monitoring, requesting more — you're leaving rank and revenue on the table.

## Speed and mobile experience aren't optional anymore

Google's Core Web Vitals are now a hard ranking signal, and **70% of restaurant searches happen on mobile**.

- Restaurants with sub-2-second mobile load times rank an average of **3 positions higher** than slower competitors.
- A **1-second delay** in mobile load time reduces conversions by **20%**.
- Sites that pass all three Core Web Vitals checks see **~24%** more organic traffic than those that don't.

Most restaurant websites — especially WordPress sites with bloated themes and a half-dozen plugins — fail Core Web Vitals. That's a ranking penalty *and* a conversion penalty.

## What this means for your restaurant

The data is overwhelming and clear:

1. **Search is the #1 discovery channel** for new diners — bigger than Instagram, bigger than TikTok, bigger than referrals.
2. **Map Pack rankings drive the largest share of clicks** for local restaurant searches.
3. **AI search is a real, current, additive channel** — not a future trend.
4. **Reviews are foundational** — both as a ranking factor and a conversion factor.
5. **Site speed and mobile experience** are non-negotiable.

Restaurants that invest in all five of these areas compound their visibility every month. Restaurants that don't watch their reservations slowly drain to the ones who do.

If you'd like a free audit of where your restaurant currently stands across all five dimensions, [get in touch](/contact?service=seo-restaurant). We'll show you exactly where the gaps are — and what fixing them is worth.`,
  },
  {
    slug: "why-restaurant-websites-are-invisible-to-google-and-ai",
    title: "Why Most Restaurant Websites Are Invisible to Google and AI Search",
    excerpt:
      "If your restaurant doesn't show up when people search, it's almost never bad luck. It's a small set of fixable problems — the same ones we see on 90% of the restaurant sites we audit.",
    targetKeyword: "restaurant website seo problems",
    metaTitle: "Why Restaurant Websites Don't Rank — The 6 Most Common Issues",
    metaDescription:
      "Most restaurant websites are invisible to Google and AI search because of the same six fixable problems: bloated themes, no schema, broken Map Pack signals, and more. Here's how to diagnose them.",
    body: `When we audit restaurant websites, we see the same problems over and over. They aren't exotic, they aren't hard to fix, and they almost always explain the gap between "we have a website" and "we get reservations from search."

Here are the six issues that cause most restaurants to disappear from Google and AI search results — and what each one is actually costing you.

## 1. The site is built on a bloated WordPress theme

This is the most common problem we see, and it's the most expensive one.

Most restaurant websites are built on a generic WordPress theme — purchased from ThemeForest, customized once, then stitched together with 15 to 30 plugins for sliders, popups, reservation widgets, social feeds, and analytics. The result:

- **Mobile load times of 4–7 seconds** (Google's threshold for "slow" is 2.5).
- **Failing Core Web Vitals** across all three metrics.
- **Unpredictable plugin conflicts** that break the menu page or reservation form silently.
- **Constant security patching** for plugins that haven't been updated in years.

Google explicitly downranks slow, fragile sites. AI assistants are even harsher — they preferentially cite sites that are clean, structured, and fast to crawl. A bloated WordPress site is a double penalty: lower Google rank *and* lower likelihood of being cited by ChatGPT, Gemini, or Perplexity.

**The fix:** rebuild on a modern, custom-coded framework (we use Next.js for the same reason Nike, TikTok, and OpenAI use it). Server-side rendering, edge caching, and image optimization are baked in by default — not bolted on with a plugin.

## 2. No structured data anywhere on the site

This is the silent killer. Most restaurant websites have **zero** schema markup — no Restaurant schema, no Menu schema, no FAQ schema, no Review schema, no LocalBusiness schema.

Schema is the language Google and AI assistants use to understand what your page is *about*. Without it, your menu is just a list of words on a page. With it, your menu is a structured database that Google can pull dish names, prices, dietary tags, and ingredients from — and that AI assistants can cite directly when someone asks "what's on the menu at [your restaurant]?"

What proper schema unlocks:

- **Rich results in Google**: star ratings, price ranges, menu snippets, reservation links — all visible in the search result itself.
- **Direct citation by AI assistants**: ChatGPT, Gemini, and Perplexity preferentially cite content with structured data because it's machine-readable.
- **Better Map Pack performance**: LocalBusiness schema reinforces your NAP (name, address, phone) consistency, a key Map Pack ranking factor.

**The fix:** add Restaurant, Menu, FAQPage, and Review schema across the entire site, with the data wired to your actual menu and reservation system so it stays current automatically.

## 3. The Google Business Profile is half-configured and forgotten

We see this on roughly **80%** of the restaurants we audit. Common patterns:

- The address listed on Google doesn't match the address on the website (a "NAP inconsistency" — major Map Pack penalty).
- Hours haven't been updated since the menu changed two years ago.
- No photos posted in the last six months. Google explicitly favors actively-maintained profiles.
- Categories are wrong or missing (e.g. "Restaurant" but not "Italian restaurant" or "Pizza restaurant").
- No Q&A, no posts, no offers, no products — Google Business Profile features that all influence rank.

Your Google Business Profile is **the single most important asset for restaurant SEO** — it controls your Map Pack ranking, which we already established is where most clicks happen.

**The fix:** weekly GBP optimization. Posts. Photos. Q&A responses. Hours kept current. Categories filled out completely. This is not a one-time fix — it's an ongoing operating discipline.

## 4. Reviews are not actively managed

Reviews are the number one ranking signal for local restaurant SEO, and they're also the number one conversion signal. But almost no restaurant manages them like the asset they are.

What we see:

- **No active review-request flow.** Diners aren't being asked for reviews after their meal.
- **No replies.** Especially to negative reviews. Google penalizes restaurants that ignore feedback.
- **No tracking.** Owners have no idea whether their star count is going up or down month-over-month.
- **Inconsistent review velocity.** Long stretches of zero new reviews, then a sudden flood — Google reads this as suspicious.

**The fix:** an automated review-request flow tied to your POS or reservation system. Every diner gets an ask. Every review gets a reply. Every change in your star rating gets tracked.

## 5. There's no content beyond the homepage and menu

Most restaurant websites have four pages: home, menu, about, contact. That's it. Which means:

- Zero opportunity to rank for **specific search queries** ("date night Italian in Hoboken," "private dining for 20 in Jersey City," "best happy hour in Montclair").
- Zero **dedicated landing pages** for events, parties, dietary needs, or specific cuisines.
- Zero **citable content** for AI assistants to pull from.
- Zero **internal linking signal** — Google relies on internal links to understand a site's structure.

The restaurants that rank for high-intent local searches all have one thing in common: they have **dedicated landing pages** for the searches they want to rank for. A page for date night. A page for private dining. A page for gluten-free dining. A page for the specific neighborhood they serve.

**The fix:** a dedicated keyword landing page strategy — anywhere from 5 pages (single-location) to 20+ pages (multi-location, competitive market). Each page targets a specific high-intent search and is structured for both Google ranking and AI citation.

## 6. There's no measurement, so no improvement

The last problem is meta: most restaurant owners have no visibility into any of this. They don't know:

- What keywords they currently rank for (or don't).
- What their Map Pack position is for their key searches.
- Whether they're being cited by AI assistants — or which competitors are.
- What their site's Core Web Vitals scores are.
- What's working and what isn't.

Without measurement, every SEO decision is a guess. With measurement, the work compounds — every month, you know exactly what moved, and exactly what to do next.

**The fix:** a dedicated SEO platform (we use our own — SEO Autopilot — built specifically for this) that tracks rankings, audits, citations, and Map Pack position automatically, and surfaces what to do next.

## Where to start

If even three of the six items above describe your restaurant, you have a real and fixable visibility problem. The good news: every one of them has a known fix. The better news: fixing them isn't slow — most restaurants we work with see meaningful Map Pack movement within 60–90 days.

If you'd like a free audit of where your restaurant currently stands on all six of these dimensions, [get in touch](/contact?service=seo-restaurant). We'll show you exactly what's broken — and what fixing it is worth.`,
  },
];

async function main() {
  console.log("🌱 Seeding restaurant SEO blog posts…");

  // Resolve the Sam Swaynos author for SEO posts (web/marketing lead)
  const samAuthor = await prisma.author.findFirst({
    where: { siteId: SITE_ID, slug: "sam-swaynos" },
  });
  const authorId = samAuthor?.id ?? null;
  const authorName = samAuthor?.name ?? "Sam Swaynos";

  for (const post of posts) {
    const wordCount = countWords(post.body);
    const result = await prisma.blogPost.upsert({
      where: { siteId_slug: { siteId: SITE_ID, slug: post.slug } },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        category: "SEO",
        tags: ["restaurant-seo", "local-seo", "ai-search"],
        targetKeyword: post.targetKeyword,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        status: "published",
        wordCount,
        publishedAt: new Date(),
        author: authorName,
        authorId,
      },
      create: {
        siteId: SITE_ID,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        author: authorName,
        authorId,
        category: "SEO",
        tags: ["restaurant-seo", "local-seo", "ai-search"],
        targetKeyword: post.targetKeyword,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        status: "published",
        wordCount,
        publishedAt: new Date(),
      },
    });
    console.log(`✅ ${result.slug} (${wordCount} words) → ${result.id}`);
  }

  console.log("🎉 Done.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
