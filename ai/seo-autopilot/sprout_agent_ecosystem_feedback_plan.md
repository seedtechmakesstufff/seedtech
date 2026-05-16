# Sprout Agent Ecosystem — Recommended Feedback & Implementation Plan

## Purpose

This document defines the recommended agent infrastructure for Sprout, SeedTech’s CRM / outbound / marketing automation system.

The goal is not to build “one giant AI sales agent.” The goal is to build a modular agent ecosystem where each agent has a narrow responsibility, shares common data structures, and feeds into Sprout’s existing workflow automation engine.

Sprout should evolve from:

```txt
Find leads → store leads → send workflows
```

into:

```txt
Discover opportunities
→ enrich and diagnose
→ match SeedTech offer
→ generate campaign assets
→ route to landers/workflows
→ monitor performance
→ improve the system continuously
```

---

## Core Philosophy

### 1. Discovery agents should be thin adapters

Discovery agents should not own strategy, scoring, messaging, or outreach.

They should only:

```txt
Find raw candidates
Normalize the data
Deduplicate obvious matches
Send candidates into the shared enrichment pipeline
```

This prevents each discovery source from becoming its own disconnected mini-system.

### 2. The value lives in the shared intelligence layer

The most valuable part of Sprout is not scraping leads. It is:

```txt
Diagnosis
Offer matching
Sales brief generation
Campaign routing
Performance analysis
Continuous improvement
```

### 3. Approval-first outbound

Initial outbound should remain agent-assisted, not fully autonomous.

Recommended rule:

```txt
Agent researches
Agent scores
Agent drafts
Human approves
Workflow sends
```

Auto-send can be added later only for trusted segments, low-risk messages, verified emails, and healthy deliverability.

---

# Recommended Agent Ecosystem

## Agent Map

```txt
DISCOVERY LAYER
├── Google / Google Maps Discovery Agent
├── Business Formation Agent
└── Government Opportunity Agent

INTELLIGENCE LAYER
├── Lead Enrichment / Audit Agent
├── Sales Strategist Agent
├── Offer Intelligence Agent
├── Campaign / Lander Agent
├── Growth Strategist Agent
├── Lead Quality Auditor Agent
└── Deliverability Guardian Agent

KNOWLEDGE / GOVERNANCE LAYER
├── Brand Guardian Agent
├── Proof / Use Case Agent
├── Pricing Reference Agent
└── SEO Intelligence Agent

NURTURE / CONTENT LAYER
├── Newsletter / Nurture Agent
├── Content Research Agent
└── Content Repurposing Agent

EXECUTION LAYER
├── Sprout Workflow Automation Engine
├── Email Templates
├── Review Queue
├── Campaign Landers
└── Website / SEO Platform
```

---

# Phase 1 — Three Discovery Agents

The first three discovery agents should be:

1. Google / Google Maps Discovery Agent
2. Business Formation Agent
3. Government Opportunity Agent

These are the best balance of volume, freshness, and high-intent opportunity.

---

## 1. Google / Google Maps Discovery Agent

### Purpose

Find local SMBs and service businesses from Google / Google Maps data.

This is the broadest discovery source and should be used for local lead generation, especially businesses with strong offline presence but weak digital presence.

### Best-fit targets

- Restaurants
- Med spas
- gyms
- HVAC companies
- plumbers
- electricians
- roofers
- contractors
- dentists
- law firms
- local retail
- pool companies
- wellness businesses
- professional services

### Signals to collect

```ts
interface GoogleMapsCandidate {
  source: "google_maps";
  placeId: string;
  company: string;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  categories?: string[];
  rating?: number | null;
  reviewCount?: number | null;
  googleMapsUrl?: string | null;
  businessStatus?: string | null;
}
```

### Useful lead signals

- High reviews + weak website
- High reviews + no online conversion path
- No website
- Weak title/meta
- Slow website
- No GBP posts
- Poor photos
- Low review count vs competitors
- Unclaimed / incomplete GBP
- No clear CTA
- Old-looking website
- Wix/Squarespace/WordPress site with obvious performance issues

### Recommended output

The agent should not create final leads directly. It should create a raw candidate record:

```txt
google_maps_candidates
→ candidate_intake
→ enrichment_pipeline
```

---

## 2. Business Formation Agent

### Purpose

Pull newly filed LLCs / corporations from Secretary of State portals daily.

These businesses are early-stage and often need:

- website
- domain
- email
- Google Business Profile
- SEO
- IT setup
- WiFi/networking
- automation
- business systems
- software
- ecommerce
- POS integrations

### Strategic value

This is a “first contact wins” source.

Newly formed businesses may not have an agency, MSP, SEO vendor, website vendor, or IT provider yet.

### Initial target states

Start with a narrow scope before expanding.

Recommended starting states:

```txt
NJ
NY
PA
DE
FL
TX
CA
```

But build the adapter pattern so each state can have its own scraper/API implementation.

### Candidate data model

```ts
interface BusinessFormationCandidate {
  source: "business_formation";
  state: string;
  legalName: string;
  entityType?: string | null;
  formationDate?: string | null;
  filingDate?: string | null;
  registeredAgent?: string | null;
  principalAddress?: string | null;
  mailingAddress?: string | null;
  status?: string | null;
  detectedIndustry?: string | null;
  confidence?: number;
  rawRecordUrl?: string | null;
}
```

### Filtering rules

Do not treat every new LLC as a good lead.

Recommended filters:

```txt
formationDate within last 30-90 days
AND status is active
AND detected industry is commercial/local/service-oriented
AND not obviously a holding company
AND not obviously real estate shell / asset holding only
AND not duplicate of existing lead/client
```

### Good lead examples

- New restaurant group
- New contracting company
- New med spa
- New gym
- New professional services firm
- New local service business
- New ecommerce brand
- New logistics/trucking operation

### Lower-quality examples

- Holdings LLC
- Personal real estate LLC
- Anonymous investment vehicle
- Family trust entity
- Dormant entity
- Duplicate DBA structure

---

## 3. Government Opportunity Agent

### Purpose

Monitor government contract awards and RFPs.

This source has two opportunity types:

```ts
type GovernmentSignalType = "contract_award" | "open_rfp";
```

### Signal 1 — Contract awards

Companies winning contracts are likely growing, hiring, expanding operations, or taking on bigger obligations.

They may need:

- managed IT
- cybersecurity
- compliance support
- website updates
- authority-building content
- proposal support
- automation
- helpdesk
- infrastructure
- CRM/process improvements

### Signal 2 — Open RFPs

Organizations issuing IT/web/digital RFPs are active buyers right now.

They may need:

- website redesign
- IT support
- cybersecurity
- digital modernization
- CRM implementation
- software development
- automation consulting
- proposal response from SeedTech

### Candidate data model

```ts
interface GovernmentOpportunityCandidate {
  source: "government";
  signalType: "contract_award" | "open_rfp";
  title: string;
  agency?: string | null;
  awardedCompany?: string | null;
  value?: number | null;
  postedDate?: string | null;
  dueDate?: string | null;
  awardDate?: string | null;
  location?: string | null;
  state?: string | null;
  keywords?: string[];
  naicsCodes?: string[];
  url?: string | null;
  summary?: string | null;
}
```

### Recommended sources

- SAM.gov
- State procurement portals
- County bid portals
- Municipal bid portals
- School district RFP pages
- Public contract award databases
- State transparency portals

### Recommended routing

```txt
open_rfp + web/IT/digital terms
→ create high-priority opportunity
→ notify human
→ suggest proposal response

contract_award + SMB/company winner
→ create sales brief
→ recommend SeedTech support angle
→ send to review queue
```

---

# Phase 2 — Shared Candidate Intake & Enrichment Pipeline

All discovery agents should feed a single shared intake pipeline.

## Candidate Intake Pipeline

```txt
Raw Candidate
→ Normalize
→ Dedupe
→ Verify
→ Enrich
→ Score
→ Diagnose
→ Offer Match
→ Sales Brief
→ Review Queue
```

## Candidate intake record

```ts
interface CandidateIntakeRecord {
  id: string;
  source:
    | "google_maps"
    | "business_formation"
    | "government"
    | "manual"
    | "import";

  sourceRecordId?: string | null;
  sourceUrl?: string | null;

  company?: string | null;
  legalName?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  industry?: string | null;
  detectedIndustry?: string | null;

  rawPayload: Record<string, unknown>;

  status:
    | "new"
    | "deduped"
    | "enriching"
    | "qualified"
    | "rejected"
    | "needs_review"
    | "converted_to_lead";

  createdAt: string;
  updatedAt: string;
}
```

---

## Enrichment Pipeline

The enrichment pipeline is where the value lives.

It should inspect every candidate regardless of source.

### Enrichment modules

```txt
1. Deduplication
2. Business verification
3. Website discovery
4. Website audit
5. Tech stack detection
6. Google Business Profile audit
7. SEO signals
8. Social signals
9. Company legitimacy signals
10. Buying trigger detection
11. Pain diagnosis
12. Offer matching
13. Sales brief generation
14. Outreach draft generation
15. Campaign lander recommendation
```

---

## Enriched lead profile

```ts
interface EnrichedLeadProfile {
  candidateId: string;

  verification: {
    businessExists: boolean;
    websiteLive: boolean;
    professionalEmailFound: boolean;
    phoneFound: boolean;
    confidence: number;
    reasons: string[];
  };

  websiteAudit?: {
    hasWebsite: boolean;
    cms?: "wordpress" | "wix" | "squarespace" | "shopify" | "custom" | "unknown";
    hasSSL?: boolean;
    hasAnalytics?: boolean;
    hasGTM?: boolean;
    hasSchema?: boolean;
    mobileFriendly?: boolean;
    speedScore?: number | null;
    seoIssues: string[];
    conversionGaps: string[];
    technicalIssues: string[];
  };

  gbpSignals?: {
    hasProfile?: boolean;
    claimed?: boolean;
    rating?: number | null;
    reviewCount?: number | null;
    recentReviews?: boolean;
    missingFields?: string[];
    photoQuality?: "weak" | "average" | "strong" | "unknown";
    gbpScore?: number;
  };

  buyingSignals: {
    triggers: string[];
    urgency: "low" | "medium" | "high" | "urgent";
    rationale: string;
  };

  painDiagnosis: {
    primaryPain: string;
    secondaryPains: string[];
    evidence: string[];
  };

  offerMatch: {
    primaryOffer:
      | "web_development"
      | "seo"
      | "managed_it"
      | "cybersecurity"
      | "automation"
      | "custom_software"
      | "ecommerce"
      | "consulting";
    secondaryOffer?: string;
    fitScore: number;
    rationale: string;
  };

  score: {
    leadScore: number;
    contactConfidence: number;
    opportunityScore: number;
    priority: "low" | "medium" | "high";
  };
}
```

---

# Phase 3 — Sales Strategist Agent

## Purpose

This should become the core “brain” of Sprout.

The Sales Strategist Agent takes enriched data and creates a structured sales brief.

It should answer:

```txt
Why this lead?
Why now?
What pain do they likely have?
What should SeedTech sell them?
What proof should we reference?
What lander should we send them to?
What workflow should they enter?
What should a human review before sending?
```

## Sales brief model

```ts
interface SalesBrief {
  leadId?: string;
  candidateId: string;

  summary: string;

  whyNow: {
    trigger: string;
    urgency: "low" | "medium" | "high" | "urgent";
    explanation: string;
  };

  painPoints: {
    primary: string;
    secondary: string[];
    evidence: string[];
  };

  recommendedOffer: {
    service: string;
    packageName?: string | null;
    rationale: string;
    pricingReference?: string | null;
  };

  recommendedCampaign: {
    landerPath?: string | null;
    workflowId?: string | null;
    emailTemplateId?: string | null;
  };

  proofToUse: {
    caseStudies: string[];
    useCases: string[];
    servicePages: string[];
  };

  outreach: {
    subjectLineOptions: string[];
    firstTouchDraft: string;
    followUpAngle: string;
    personalizationTokens: Record<string, string>;
  };

  risks: {
    dataQualityIssues: string[];
    complianceConcerns: string[];
    deliverabilityConcerns: string[];
  };

  recommendedNextAction:
    | "approve_outreach"
    | "needs_human_research"
    | "reject"
    | "call_first"
    | "add_to_newsletter_only";
}
```

---

# Phase 4 — Campaign / Lander Agent

## Purpose

Create and maintain campaign-level landing pages.

Important rule:

```txt
Do not create one landing page per lead.
Create reusable campaign landers by industry, service, signal, or offer.
```

## Recommended lander levels

### Level 1 — Permanent industry pages

Examples:

```txt
/industries/restaurants
/industries/contractors
/industries/law-firms
/industries/med-spas
/industries/hvac
/industries/professional-services
```

These are SEO-oriented and should follow the SeedTech website page-building rules.

### Level 2 — Campaign landers

Examples:

```txt
/campaigns/new-business-website-launch
/campaigns/restaurant-local-seo
/campaigns/contractor-managed-it
/campaigns/rfp-website-redesign
/campaigns/google-business-profile-audit
/campaigns/ai-automation-for-smbs
```

These are shorter, conversion-oriented, and used in outbound campaigns.

### Level 3 — Tracking URLs

Use query params or tracking IDs, not separate pages:

```txt
/campaigns/restaurant-local-seo?lead=abc123&source=google_maps
/campaigns/new-business-website-launch?lead=def456&source=business_formation
```

## Campaign template model

```ts
interface CampaignLanderTemplate {
  id: string;
  slug: string;
  path: string;

  industry?: string;
  service: string;
  sourceSignals: string[];

  audience: string;
  primaryPain: string;
  primaryOffer: string;
  cta: string;

  heroHeadline: string;
  heroSubheadline: string;

  sections: {
    type: "pain" | "solution" | "proof" | "process" | "faq" | "cta";
    title: string;
    body: string;
  }[];

  recommendedWorkflowId?: string;
  recommendedEmailTemplateId?: string;

  status: "draft" | "active" | "needs_update" | "archived";
}
```

## Integration with SeedTech website repo

The SeedTech website already has strong page-building conventions.

Any generated page should follow:

- static metadata
- canonical URL
- JSON-LD
- breadcrumb JSON-LD
- page context
- static route registration when permanent
- design kit rules
- section rhythm
- CTA pattern
- banned phrase rules
- industry page pattern
- service page pattern

Campaign pages should be generated as reviewable PRs, not pushed live automatically.

Recommended flow:

```txt
Campaign Agent recommends page
→ Brand Guardian reviews copy/design
→ Human approves
→ GitHub PR created in website repo
→ Deploy
→ Sprout links campaigns/workflows to final URL
```

---

# Phase 5 — Knowledge / Governance Agents

These agents keep generated content accurate, on-brand, and consistent.

---

## 1. Brand Guardian Agent

### Purpose

Maintain SeedTech brand consistency across:

- campaign landers
- emails
- newsletters
- proposals
- social posts
- service descriptions
- case study references
- CTAs

### Sources of truth

- SeedTech design kit
- website page-building directive
- design-system docs
- brand voice rules
- banned phrases
- component patterns
- section patterns
- CTA patterns

### Responsibilities

```txt
Review generated content
Flag off-brand copy
Remove generic AI phrases
Ensure CTA clarity
Ensure page structure follows SeedTech patterns
Ensure Liquid Glass / component rules are followed
Ensure content is specific, not filler
```

### Output model

```ts
interface BrandReview {
  status: "approved" | "needs_revision" | "rejected";
  issues: {
    severity: "low" | "medium" | "high";
    category: "tone" | "design" | "structure" | "cta" | "seo" | "accuracy";
    message: string;
    suggestedFix: string;
  }[];
  revisedCopy?: string;
}
```

---

## 2. Proof / Use Case Agent

### Purpose

Find relevant SeedTech proof points for sales and marketing content.

### It should reference

- website use cases
- case studies
- project pages
- service pages
- industry pages
- testimonials
- measurable results
- client examples

### Responsibilities

```txt
Match lead industry to relevant use cases
Match offer to service proof
Suggest proof points for emails
Suggest proof sections for landers
Suggest internal links for campaign pages
```

### Example

```txt
Lead: restaurant
Pain: weak local SEO
Recommended proof:
- restaurant SEO page
- local visibility audit offer
- website / SEO service examples
```

---

## 3. Pricing Reference Agent

### Purpose

Prevent invented pricing.

### Rules

```txt
Never generate pricing from memory.
Only quote approved website pricing pages or structured pricing records.
If unsure, use “starting at” language or route to consultation.
Never promise discounts unless explicitly approved.
```

### Responsibilities

```txt
Attach pricing references to sales briefs
Validate proposal drafts
Validate campaign page pricing sections
Validate email claims about cost
Flag outdated or missing pricing
```

### Output

```ts
interface PricingValidation {
  status: "valid" | "needs_review" | "invalid";
  approvedPricingSource?: string;
  pricingLanguage: string;
  warnings: string[];
}
```

---

## 4. SEO Intelligence Agent

### Purpose

Use the SeedTech website SEO tool as a market intelligence layer for Sprout.

The SEO system should inform:

- which industries deserve more lead discovery
- which campaign pages deserve more investment
- which keywords are gaining traction
- which pages need internal links
- which landing pages need CTR improvements
- which topics should become newsletter content

### Inputs

- Google Search Console data
- tracked keywords
- SEO insights
- page performance
- CTR opportunities
- strike-distance keywords
- internal linking suggestions
- stale content alerts
- keyword cannibalization
- E-E-A-T issues

### Example loop

```txt
SEO tool finds:
“managed IT services NJ” has impressions but low CTR

Sprout recommendation:
- update managed IT campaign lander headline
- prioritize NJ managed IT leads
- test subject line around “IT support pricing”
- add internal links to /services/managed-it
```

---

# Phase 6 — Newsletter / Nurture Agent

## Purpose

Separate from outbound sales agents.

This agent manages long-term nurture and thought leadership.

It should not behave like a cold sales agent.

It should behave like a content strategist and newsletter editor.

## Responsibilities

```txt
Monitor RSS feeds
Monitor Reddit/social discussions
Monitor industry news
Monitor AI trends
Monitor cybersecurity/IT/SEO/web trends
Summarize relevant topics
Map topics to SeedTech services
Draft newsletter editions
Recommend audience segments
Recommend CTA
Submit for approval
Send through Sprout workflows
Analyze performance
```

## Recommended content sources

- RSS feeds from trusted tech/business publications
- Google Search trends
- Reddit RSS for relevant subreddits
- industry blogs
- cybersecurity advisories
- small business tech publications
- AI tooling updates
- SEO industry sources
- local business news
- government procurement news
- SeedTech website SEO insights
- Sprout campaign performance data

## Newsletter brief model

```ts
interface NewsletterBrief {
  id: string;
  theme: string;

  audience:
    | "all_contacts"
    | "clients"
    | "warm_leads"
    | "cold_leads"
    | "lost_leads"
    | "industry_segment";

  segmentFilters?: Record<string, unknown>;

  topicSources: {
    title: string;
    url: string;
    sourceName: string;
    summary: string;
    relevance: string;
  }[];

  sections: {
    title: string;
    body: string;
    seedtechAngle: string;
    cta?: string;
  }[];

  subjectLineOptions: string[];
  previewTextOptions: string[];

  recommendedCTA: {
    label: string;
    url: string;
    rationale: string;
  };

  status: "draft" | "needs_review" | "approved" | "sent";
}
```

## Newsletter cadence

Recommended:

```txt
Monthly for all contacts
Biweekly for warm leads
Quarterly for clients if not already receiving client-specific updates
```

Avoid over-emailing cold contacts.

---

# Phase 7 — Quality & Safety Agents

The user has selected two additional agents:

1. Deliverability Guardian Agent
2. Lead Quality Auditor Agent

These should be prioritized before high-volume outbound.

---

## 1. Deliverability Guardian Agent

### Purpose

Protect SeedTech’s sending reputation.

This is a required safety layer before any large-scale outbound.

### Watches

```txt
Bounce rate
Complaint rate
Unsubscribe rate
Open rate decline
Click rate decline
Reply quality
Suppression list growth
Sending volume
Source-level email quality
Domain health
Campaign-level risk
```

### Recommended thresholds

These should be configurable.

```ts
interface DeliverabilityThresholds {
  maxBounceRate: number;        // e.g. 0.03 to 0.05
  maxComplaintRate: number;     // e.g. 0.001 to 0.003
  maxUnsubscribeRate: number;   // e.g. 0.01 to 0.02
  minOpenRateWarning: number;   // depends on list/campaign
  maxDailyColdVolume: number;
  maxNewDomainRampVolume: number;
}
```

### Actions

```txt
Warn
Recommend pause
Auto-pause campaign if severe
Suppress bad emails
Flag bad discovery source
Require email verification before send
Reduce send volume
Recommend subject/body changes
Recommend warming strategy
```

### Output model

```ts
interface DeliverabilityAlert {
  level: "info" | "warning" | "critical";
  campaignId?: string;
  source?: string;
  metric: string;
  value: number;
  threshold: number;
  recommendation: string;
  autoActionTaken?: string;
}
```

### Recommended rules

```txt
If bounce rate exceeds threshold:
  pause source/campaign
  require verification before future sends

If complaint rate exceeds threshold:
  immediately pause campaign
  alert admin
  inspect messaging and targeting

If unsubscribes spike:
  reduce frequency
  inspect audience fit
  revise CTA and message tone

If open rate drops:
  test subject lines
  inspect sender reputation
  review segment quality
```

---

## 2. Lead Quality Auditor Agent

### Purpose

Evaluate which discovery sources and agent decisions produce real opportunities.

This agent keeps the whole system honest.

### Watches

```txt
Candidate volume by source
Qualification rate
Deduplication rate
Rejected rate
Email validity
Website found rate
Lead score distribution
Sales brief quality
Approval rate
Send rate
Open rate
Click rate
Reply rate
Booked call rate
Won deal rate
Bad fit rate
```

### Source score model

```ts
interface SourceQualityScore {
  source: "google_maps" | "business_formation" | "government";
  period: "daily" | "weekly" | "monthly";

  candidatesFound: number;
  qualifiedLeads: number;
  rejectedCandidates: number;
  duplicateRate: number;

  emailValidityRate: number;
  websiteFoundRate: number;
  averageLeadScore: number;
  averageOpportunityScore: number;

  approvedOutreachRate: number;
  replyRate: number;
  bookedCallRate: number;
  wonRate: number;

  qualityScore: number;
  recommendation: string;
}
```

### Recommendation examples

```txt
Business Formation Agent is producing many holding companies.
Tighten industry classification and reject “holdings”, “ventures”, “properties”, “capital”.

Google Maps restaurant leads have high click rate but low form conversion.
Improve restaurant campaign lander CTA.

Government RFP leads are low volume but high value.
Notify human immediately instead of adding to normal nurture.
```

---

# Phase 8 — Growth Strategist Agent

## Purpose

Analyze system-wide results and recommend improvements.

This is the “manager” agent.

It should review every level:

```txt
Discovery quality
Enrichment accuracy
Offer matching
Campaign lander conversion
Email performance
Workflow performance
Newsletter performance
SEO/content performance
Sales outcomes
```

## Output model

```ts
interface GrowthRecommendation {
  id: string;

  level:
    | "discovery"
    | "enrichment"
    | "offer_match"
    | "campaign_lander"
    | "email"
    | "workflow"
    | "newsletter"
    | "seo"
    | "sales";

  finding: string;
  evidence: string[];
  recommendation: string;

  priority: "low" | "medium" | "high" | "critical";

  suggestedAction:
    | "change_agent_config"
    | "update_lander"
    | "update_email_template"
    | "pause_campaign"
    | "create_new_campaign"
    | "revise_offer_match"
    | "create_content"
    | "human_review";

  affectedAssets?: {
    campaignIds?: string[];
    workflowIds?: string[];
    landerPaths?: string[];
    emailTemplateIds?: string[];
    agentIds?: string[];
  };

  status: "open" | "accepted" | "dismissed" | "implemented";
}
```

## Example recommendations

```txt
Finding:
Restaurant SEO leads from Google Maps click emails but do not submit forms.

Evidence:
- 42% click rate
- 0 form submissions
- 18 page visits
- average time on page below 20 seconds

Recommendation:
Revise /campaigns/restaurant-local-seo with a clearer audit CTA, shorter hero, and proof section.

Priority:
High
```

---

# Phase 9 — Inbox / Reply Classifier Agent

This is not required immediately, but should be planned.

## Purpose

Classify inbound replies and route them correctly.

### Reply categories

```txt
interested
not_now
unsubscribe
wrong_contact
referral
pricing_question
meeting_request
objection
angry
out_of_office
bounce
vendor_request
existing_client
```

### Actions

```txt
Interested → notify human / create task
Pricing question → draft response with Pricing Reference Agent
Meeting request → create task / calendar flow
Not now → add to long-term nurture
Unsubscribe → suppress immediately
Wrong contact → ask for referral or suppress
Angry → suppress and alert admin
```

---

# Recommended Build Order

## MVP 1 — Foundation

```txt
1. Candidate Intake
2. Shared Enrichment Pipeline
3. Sales Brief model
4. Review Queue
5. Google Maps Discovery Agent
```

Goal:

```txt
Find real businesses
Enrich them
Generate sales briefs
Approve or reject
```

---

## MVP 2 — Three-source discovery

```txt
1. Business Formation Agent
2. Government Opportunity Agent
3. Source-specific config
4. Source quality reporting
```

Goal:

```txt
Three discovery agents feeding one pipeline.
```

---

## MVP 3 — Campaign routing

```txt
1. Campaign / Lander Agent
2. Industry campaign templates
3. Tracking URL generation
4. Workflow recommendation
5. Website repo PR generation for new campaign pages
```

Goal:

```txt
Approved leads route to relevant campaign pages and workflows.
```

---

## MVP 4 — Governance

```txt
1. Brand Guardian Agent
2. Pricing Reference Agent
3. Proof / Use Case Agent
4. Deliverability Guardian Agent
5. Lead Quality Auditor Agent
```

Goal:

```txt
Generated content is safe, accurate, on-brand, and deliverability-aware.
```

---

## MVP 5 — Nurture and optimization

```txt
1. Newsletter / Nurture Agent
2. SEO Intelligence Agent
3. Growth Strategist Agent
4. Content Repurposing Agent
```

Goal:

```txt
Sprout becomes a continuous marketing and sales improvement system.
```

---

# Sprout Data Collections / Tables to Consider

Depending on whether Sprout remains Firestore-first, these may be Firestore collections.

```txt
agentConfigs
agentRuns
candidateIntake
candidateEnrichments
salesBriefs
leadScores
leadQualityReports
deliverabilityReports
deliverabilityAlerts
campaignLanderTemplates
campaignTrackingEvents
growthRecommendations
newsletterBriefs
newsletterIssues
newsletterSources
brandReviews
pricingValidations
proofMatches
```

---

# Suggested Agent Config Model

```ts
interface AgentConfig {
  id: string;
  type:
    | "google_maps_discovery"
    | "business_formation"
    | "government_opportunity"
    | "lead_enrichment"
    | "sales_strategist"
    | "campaign_lander"
    | "brand_guardian"
    | "proof_use_case"
    | "pricing_reference"
    | "newsletter_nurture"
    | "seo_intelligence"
    | "growth_strategist"
    | "deliverability_guardian"
    | "lead_quality_auditor";

  name: string;
  description: string;
  enabled: boolean;

  schedule?: string;
  cronExpression?: string;

  config: Record<string, unknown>;

  stats: {
    totalRuns: number;
    lastRunAt?: string;
    lastStatus?: "success" | "error" | "partial";
  };

  createdAt: string;
  updatedAt: string;
}
```

---

# Agent Run Model

```ts
interface AgentRun {
  id: string;
  agentConfigId: string;
  agentType: string;

  status: "pending" | "running" | "complete" | "error" | "cancelled";

  startedAt: string;
  completedAt?: string;

  outcome: {
    candidatesFound?: number;
    candidatesQualified?: number;
    candidatesRejected?: number;
    leadsCreated?: number;
    salesBriefsCreated?: number;
    recommendationsCreated?: number;
    alertsCreated?: number;
    errors?: number;
  };

  logs: {
    level: "info" | "warning" | "error";
    message: string;
    metadata?: Record<string, unknown>;
    timestamp: string;
  }[];

  error?: string;
}
```

---

# Human Review Queue

The review queue is critical.

Items requiring review:

```txt
New qualified lead
Sales brief
First-touch email
Campaign lander recommendation
Newsletter issue
Growth strategist recommendation
Deliverability warning
Pricing validation warning
Brand guardian rejection
```

## Review item model

```ts
interface ReviewQueueItem {
  id: string;

  type:
    | "lead_approval"
    | "outreach_approval"
    | "campaign_lander_approval"
    | "newsletter_approval"
    | "growth_recommendation"
    | "deliverability_alert"
    | "pricing_warning"
    | "brand_review";

  title: string;
  summary: string;

  priority: "low" | "medium" | "high" | "urgent";

  relatedLeadId?: string;
  relatedCandidateId?: string;
  relatedCampaignId?: string;
  relatedWorkflowId?: string;
  relatedAgentRunId?: string;

  status: "pending" | "approved" | "rejected" | "needs_changes";

  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
```

---

# Key Safety Rules

## Outbound safety

```txt
Do not auto-send to unverified emails.
Do not auto-send if deliverability alerts are active.
Do not auto-send if source quality is below threshold.
Do not auto-send if Brand Guardian rejects the content.
Do not quote pricing unless Pricing Reference Agent validates it.
Do not use a case study unless Proof Agent validates relevance.
Do not create one landing page per lead.
Do not send government RFP opportunities into normal nurture without human review.
```

## Content safety

```txt
Avoid generic AI copy.
Avoid overpromising.
Avoid fake urgency.
Avoid invented pricing.
Avoid invented proof.
Avoid unverifiable statistics.
Avoid claims not supported by SeedTech website or approved sources.
```

## Domain safety

```txt
Ramp cold email volume slowly.
Pause sources with high bounce rates.
Suppress bounced/complaining contacts immediately.
Track complaint rate by campaign and source.
Separate newsletter nurture from cold outbound.
```

---

# Recommended First Claude Implementation Task

Claude should not try to build everything at once.

Recommended first implementation prompt:

```txt
Build the Candidate Intake + Sales Brief foundation for Sprout.

Create:
1. TypeScript types for CandidateIntakeRecord, EnrichedLeadProfile, SalesBrief, AgentConfig, AgentRun, and ReviewQueueItem.
2. Firestore collection naming conventions.
3. A shared candidate intake service.
4. A placeholder enrichment pipeline that accepts normalized candidates and produces a mock SalesBrief.
5. A review queue item creation function for sales briefs.
6. Basic admin UI route/page to list pending sales briefs.
7. Keep all outbound email sending behind human approval.
```

---

# Recommended Second Claude Task

```txt
Implement the Google Maps Discovery Agent as the first real discovery source.

Requirements:
1. Agent config supports industries, locations, radius, max results, min rating, min review count.
2. Agent creates CandidateIntakeRecord records.
3. It does not create leads directly.
4. It calls the shared candidate intake service.
5. It logs AgentRun results.
6. It dedupes by placeId, website domain, phone, and company/address.
7. It creates review queue items only after enrichment/sales brief generation.
```

---

# Recommended Third Claude Task

```txt
Implement Deliverability Guardian Agent and Lead Quality Auditor Agent.

Deliverability Guardian:
- Reads automationEmailDeliveries, suppressions, campaign tracking data, and workflow stats.
- Creates deliverability alerts.
- Recommends campaign/source pauses.
- Blocks auto-send eligibility when severe issues exist.

Lead Quality Auditor:
- Scores each discovery source by qualification rate, duplicate rate, email validity, approval rate, reply rate, booked call rate, and won rate.
- Produces weekly source quality reports.
- Creates GrowthRecommendation records when a source needs tuning.
```

---

# Final Architecture Summary

Sprout should become a multi-agent growth operating system.

```txt
Discovery agents find opportunities.
Enrichment agents understand them.
Sales strategy agents decide what to do.
Campaign agents create conversion paths.
Governance agents keep everything accurate and on-brand.
Deliverability agents protect the domain.
Quality agents improve the source mix.
Newsletter agents nurture the market.
Growth strategist agents improve the whole system.
Sprout workflows execute approved actions.
SeedTech website provides proof, pricing, SEO intelligence, and campaign landers.
```

This architecture is robust because each agent has a narrow job, every agent produces reviewable artifacts, and the entire system improves from performance feedback over time.
