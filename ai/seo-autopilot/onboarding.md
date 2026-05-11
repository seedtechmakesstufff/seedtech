# SEO Autopilot — Client Onboarding

Step-by-step playbook for deploying the autopilot on a new client site. Each phase depends on the previous one. Budget ~4 hours for a thorough first-time setup; subsequent sites are faster once you have the rhythm.

For developer/infra setup (env vars, OAuth client, migrations) see [setup.md](setup.md). For per-agent behavior see [agents.md](agents.md).

---

## Phase 1 — Provision the site

Dev time. ~15 minutes.

1. **Create Tenant + Site rows** (Prisma seed or admin panel). Note the `siteId`.
2. **Confirm env vars** are set globally (see [setup.md](setup.md)). The autopilot reuses one set of credentials across all sites — only the per-site DB rows differ.
3. **Add the site's domain** to `Site.domain` (used by the GBP CTA-URL allowlist).
4. **Add a Membership** so the client user can sign in with the appropriate role (owner / admin / editor / viewer).

---

## Phase 2 — Business Profile (the core of everything)

Every AI output is shaped by this. Thin context here = thin output everywhere.

`/admin/seo/context` → fill in:

- **Company name, domain, primary service, secondary services**
- **Target audience** — who actually buys
- **Location** — geo signals for local search
- **Tone of voice** — adjectives, do/don't-say rules
- **Custom instructions** — anything specific (legal disclaimers, branded terminology, competitor names to avoid)

The `BusinessProfile` row drives `buildStrategyPrompt()` which feeds every agent. Test it: open **AI Preview** and verify the prompt looks coherent before generating anything.

---

## Phase 3 — Connect Google services

`/admin/seo/settings/integrations`:

1. **Connect Google** → consent screen → redirects back with success.
2. **Pick a GA4 property** (if multiple) → saved to `Site.ga4PropertyId`.
3. **Pick a GBP location** → creates a `GbpLocation` row.
4. **Run manual syncs** from the same page to seed initial data:
   - GA4 sync → fills `PageMetrics` for last 30 days
   - GBP sync → fills `GbpLocation`, `GbpReview`, `GbpPost`, `GbpMetricsDaily`

GSC continues to use the existing service-account flow or OAuth. Either works.

---

## Phase 4 — Keyword strategy

This is where most of the work lives. Budget 2–3 hours.

### 4A — Read the site first

Before touching keywords, **read every page**. Note:
- Hero section language (exact phrases)
- FAQ questions (these match Google's "People Also Ask")
- Pricing specifics (high commercial intent)
- Differentiator claims competitors can't make
- Industry-specific terms from vertical pages

### 4B — Seed Tracked Keywords

`/admin/seo/keywords` → Manage. For each keyword set:
- **Tier** — T1 (head, competitive), T2 (service/geo, achievable), T3 (question/long-tail, blog targets)
- **Intent** — informational / commercial / transactional / navigational
- **Target page** — the URL this keyword should drive traffic to
- Leave volume/competition as `unknown` until GSC provides real data

### 4C — Derivation rules

Every keyword should come from one of these (don't invent):
1. Actual page copy already on the site
2. FAQ content
3. Pricing specifics ("$X/month", "starting at $Y", "no contract")
4. Differentiator language
5. Industry-page framing
6. Local geography (county, city, metro)

### 4D — Reactive / pain-point layer

After base keywords, add a crisis-moment layer (highest conversion intent, lowest competition):
- **Crisis**: "business email not working", "got hacked help"
- **Post-incident**: "how to prevent data breach"
- **Frustration**: "IT support too slow", "how to fire IT company"
- **Compliance panic**: "cyber insurance denied"
- **Cost shock**: "IT support too expensive"
- **Growth trigger**: "outgrew break fix"

Adapt the patterns to the client's vertical.

### 4E — AI keyword research

`/admin/seo/keywords` → **AI Research** tab. Five modes:
- **Full Audit** — comprehensive GSC analysis
- **Discover Keywords** — AI suggestions from context + GSC
- **Gap Analysis** — what competitors rank for that we don't
- **Competitor Analysis** — deep-dive on specific domains
- **Question Keywords** — PAA-style queries

After base seeding, run **Full Audit** to surface near-me gaps, brand vs non-brand split, and high-impression/low-click opportunities.

---

## Phase 5 — Strategy documents

`/admin/seo/context` → **Strategy** tab. Markdown documents that persist your SEO thesis and feed into every AI prompt.

Categories: `keyword_strategy`, `audit_findings`, `content_roadmap`, `competitive_analysis`, `general`.

Seed 3–4 during onboarding:
1. **Keyword Architecture** — tier structure, intent distribution, what's NOT included and why
2. **Reactive Keyword Thesis** — pain-point categories + conversion rationale (if you built that layer)
3. **GSC Baseline Audit** — current state metrics, brand vs non-brand split, quick wins, 90-day targets
4. **Blog Content Roadmap** — specific articles needed, priority order, content guidelines

Each doc has an `isActive` toggle. Only active docs feed into AI prompts. Deactivate outdated strategy instead of deleting — version history is preserved.

> Note: the **Strategy Analyst agent** (Mon 08:00 UTC) writes its own weekly `SeoStrategyDoc` with `source="ai-strategy-analyst"`. Your hand-written docs and the agent-written one coexist — both feed downstream.

---

## Phase 6 — Industry Researcher sources

The Industry Researcher (Mon 05:00 UTC) ships with 14 RSS feeds across four verticals (trucking, law, restaurant, general). If the client is in a different vertical:

- Edit `SOURCES` in `src/lib/agents/industry-researcher.ts` to add feeds for their industry.
- Each entry needs `industry`, `domain`, `label`, `feedUrl`.
- Prefer primary/authoritative sources (regulators, trade associations, court systems) over blogs.

If the client is in one of the existing verticals, no code change needed — the agent pulls signals automatically.

---

## Phase 7 — First audit cycle

1. **Run Site Crawl** — `/admin/seo` → Audit → "Run Site Crawl". Checks 25+ on-page issues.
2. **Generate All Metadata** — Metadata tab. AI generates titles + descriptions for every page using business profile + strategy docs.
3. **Take First Snapshot** — Overview → "Take Snapshot". Captures health-score baseline.
4. **Run PageSpeed** — Audit → "Run PageSpeed" for Core Web Vitals.

---

## Phase 8 — Activate the autopilot

`/admin/seo/agents` — fire each agent manually once so the human reviewer sees exactly what gets produced before crons take over.

Recommended first-run order:

1. **Industry Researcher** → writes `ResearchSignal` rows (status=fresh)
2. **Keyword Scout** → upserts new `TrackedKeyword` rows from GSC
3. **Strategy Analyst** → writes the weekly `SeoStrategyDoc`
4. **Brief Generator** → 2–3 `content_brief` artifacts land in `/admin/inbox/[week]`
5. Approve a brief → **Blog Drafter** → `blog_draft` artifact
6. Approve the draft → `BlogPost` row (status=draft) created for final review
7. **GBP Post Drafter** → 1–2 ideas per location
8. **Internal Link Agent** → suggestions in the inbox
9. **Content Decay Watcher** → flags decaying posts
10. **Weekly Digest** → email lands at configured recipients

After this dry run, the Vercel crons take over (see [agents.md](agents.md) for schedule).

---

## Phase 9 — Configure the digest

`/admin/seo/agents` → **Digest** tab → **Recipients**.

- Comma-separated emails. Saves to `EmailConfig.notifyRecipients` for this site.
- Without per-tenant config, falls back to `DIGEST_RECIPIENTS` env.
- Test by triggering **Weekly Digest** manually — verify the email lands and the inbox links work in production (these use `WEEKLY_DIGEST_BASE_URL`).

---

## Day-to-day workflow (after onboarding)

| Frequency | Action | Where |
|---|---|---|
| **Daily** | Review pending artifacts — approve/reject | `/admin/inbox/[week]` |
| **Daily** | Check health score, GSC sync status | Overview tab |
| **Weekly** | Read the Monday digest email; approve the week's lineup | Inbox + email |
| **Weekly** | Review AI Visibility scores, rewrite weak pages | AI Visibility tab |
| **Bi-weekly** | Review keyword positions, discover new opportunities | Keywords tab |
| **Monthly** | Update strategy docs with new findings | AI Context → Strategy |
| **Quarterly** | Re-run full audit, refresh GSC baseline | AI Research → Full Audit |

Everything else is automated by cron — sync jobs, agents, decay detection, digest email.

---

## What the AI sees (context chain)

```
BusinessProfile + Tracked Keywords + Strategy Docs + Site Pages
                              ↓
              Industry Researcher → ResearchSignal rows
                              ↓
              Strategy Analyst → weekly SeoStrategyDoc
                              ↓
              Brief Generator → content_brief artifacts (dedup-checked)
                              ↓
              [human approves]
                              ↓
              Blog Drafter → blog_draft artifacts
                              ↓
              [human approves]
                              ↓
              BlogPost row → final publish flow
```

Every output is only as good as the context chain. Onboarding quality determines the quality of everything the autopilot produces afterward.

---

## Onboarding checklist

Copy this into a client ticket and tick off as you go.

- [ ] Phase 1 — Tenant + Site rows, Membership, env vars confirmed
- [ ] Phase 2 — BusinessProfile filled in, AI Preview looks coherent
- [ ] Phase 3 — Google connected (GSC + GA4 + GBP), manual syncs run once
- [ ] Phase 4 — Keywords seeded (base + reactive layer), AI Research Full Audit run
- [ ] Phase 5 — 3–4 strategy docs written + active
- [ ] Phase 6 — Industry Researcher sources cover the client's vertical
- [ ] Phase 7 — Site crawl + metadata generation + first snapshot done
- [ ] Phase 8 — All 10 agents run manually once; first inbox week reviewed
- [ ] Phase 9 — Digest recipients configured; test email sent and verified
- [ ] Hand-off — Client trained on the inbox approval flow
