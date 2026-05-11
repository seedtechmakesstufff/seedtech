# SEO Autopilot

Agentic SEO layer on top of the SeedTech platform. Ten agents run on cron, produce artifacts in a review queue, and a human approves to publish.

## Docs

- **[onboarding.md](onboarding.md)** — Per-client playbook: provision the site, seed business profile, keywords, strategy docs, run the first audit cycle, activate the autopilot.
- **[setup.md](setup.md)** — Per-environment infra: env vars, encryption key, Google Cloud OAuth client, API enablement, DB migrations. Run this once per deployment.
- **[agents.md](agents.md)** — Imperative spec for every agent (reads, writes, schedule, file path).
- **[architecture.md](architecture.md)** — Schema, artifact lifecycle, events, dedup, rate limits, integrations, file map.
- **[seo-strategy.md](seo-strategy.md)** — Page-build playbook for SEO landing pages (separate concern from the autopilot).

**Which doc do I read first?**
- Setting up a fresh deployment → `setup.md`.
- Onboarding a new client onto an existing deployment → `onboarding.md`.
- Editing an agent or adding a new one → `agents.md` + `architecture.md`.

## Core idea

Humans are the approval bottleneck, not the work bottleneck.

- Sync jobs (GSC, GA4, GBP) keep DB state fresh.
- Agents read DB + the `Event` log and emit `AgentArtifact` rows in `state=pending_review`.
- A human approves in `/admin/inbox/[week]`.
- A publisher applies the side effect (publish post, reply to review, create GBP post).
- The Weekly Digest email summarises pending work every Monday.

## Quick index

| Concern | File |
|---|---|
| Add a new agent | follow patterns in `src/lib/agents/*` + `agent-configs.ts` + `vercel.json` |
| Add a new artifact type | register publisher in `agent-artifact-publishers.ts` |
| Add a new event type | add to `EVENT_TYPES` in `src/lib/events.ts` |
| Tweak dedup thresholds | `src/lib/dedup.ts` (`BRIEF_THRESHOLDS`, `GBP_POST_THRESHOLDS`) |
| Change cron schedule | `vercel.json` |
