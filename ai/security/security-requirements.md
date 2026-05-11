# SeedTech Platform — Security Requirements

> **Purpose:** Authoritative reference for security implementation across all platform builds.
> Covers what is built, how it works, and the checklist for new client deployments.
> Updated May 2026.

---

## Table of Contents

1. [Form Security](#1-form-security)
2. [Rate Limiting](#2-rate-limiting)
3. [Authentication & Admin Access](#3-authentication--admin-access)
4. [Environment Variables & Secrets](#4-environment-variables--secrets)
5. [API Route Security](#5-api-route-security)
6. [Deployment Checklist](#6-deployment-checklist)

---

## 1. Form Security

All public-facing forms use a 5-layer defense stack. Every layer is required.

### Layer Stack

| Layer | Mechanism | Where |
|-------|-----------|-------|
| 1 | **Rate limiting** — max 5 submissions per IP per 60s | `src/lib/form-security.ts` |
| 2 | **Honeypot** — hidden `website_url` field must be empty | `src/components/forms/FormGuard.tsx` |
| 3 | **Timing guard** — form must take ≥ 2 seconds to fill out | `src/lib/form-security.ts` |
| 4 | **Content validation** — name/message entropy check (Shannon entropy > 4.4 = bot) | `src/lib/form-security.ts` |
| 5 | **reCAPTCHA v3** — Google bot score must be ≥ 0.5 (0=bot, 1=human) | `src/lib/form-security.ts` + per-route |

### Implementation Pattern

**Client side — every form component must:**
```tsx
import { FormGuard, useFormGuard } from "@/components/forms/FormGuard";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const guard = useFormGuard();
const { executeRecaptcha } = useGoogleReCaptcha();

// On submit:
const recaptchaToken = executeRecaptcha ? await executeRecaptcha("form_action") : "";
fetch("/api/your-route", {
  body: JSON.stringify({ ...formData, ...guard.fields(), recaptchaToken }),
});

// In JSX:
<FormGuard started={guard.started} />
```

**Server side — every API route must:**
```ts
import { validateFormSecurity, getClientIp, verifyRecaptcha } from "@/lib/form-security";

const ip = getClientIp(req);
const rejection = validateFormSecurity(ip, body);
if (rejection) return rejection;

const recaptchaOk = await verifyRecaptcha(body.recaptchaToken);
if (!recaptchaOk) return NextResponse.json({ error: "Bot check failed." }, { status: 400 });
```

### Forms Currently Protected

| Form | reCAPTCHA Action | Route |
|------|-----------------|-------|
| Contact | `contact_form` | `/api/contact` |
| Quote (Web Dev) | `quote_web` | `/api/quote-submission` |
| Quote (IT Support) | `quote_it` | `/api/quote-submission` |
| Quote (SEO) | `quote_seo` | `/api/quote-submission` |
| Free Audit | `audit_form` | `/api/audit-request` |

### Honeypot Behavior
- Honeypot triggers return `{ success: true }` with a `200` status — **bots think they succeeded**
- No error is surfaced to the submitter
- Warning is logged server-side: `[form-security] Honeypot triggered: {ip}`

### reCAPTCHA Badge
The reCAPTCHA floating badge is hidden via CSS (legally required disclosure is still in form copy):
```css
/* globals.css */
.grecaptcha-badge { visibility: hidden !important; }
```
Form copy must include: `"Protected by reCAPTCHA. Privacy Policy · Terms of Service"`

---

## 2. Rate Limiting

### Implementation
- **File:** `src/lib/rate-limit.ts`
- **Type:** In-memory sliding window
- **Default:** 5 requests per IP per 60 seconds (form routes)
- **Behavior on reset:** Limits reset on Vercel cold start / deploy — acceptable for serverless

### Usage Pattern
```ts
import { rateLimit } from "@/lib/rate-limit";

// Create a limiter (module-level, shared across requests in same instance)
const limiter = rateLimit({ interval: 60_000, limit: 5 });

// In a route handler:
const { limited } = limiter.check(ip);
if (limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
```

### Configured Limits

| Route type | Limit | Window |
|-----------|-------|--------|
| Public form submissions | 5 req | 60s per IP |
| Admin API routes | No rate limit (auth-gated instead) | — |

### Limitation
In-memory rate limiting does not persist across Vercel instances. This is acceptable for
the current scale — sophisticated distributed attacks would need Redis-backed limiting
(e.g., Upstash). Add this if abuse patterns emerge.

---

## 3. Authentication & Admin Access

### NextAuth Setup
- **Provider:** Credentials (email + password)
- **Session strategy:** JWT
- **JWT payload:** `userId`, `tenantId`, `siteId`, `role`
- **Secret:** `NEXTAUTH_SECRET` env var (must be set — never leave default)

### Role System
| Role | Access |
|------|--------|
| `owner` | Full access |
| `admin` | Full access except billing/owner actions |
| `editor` | Content only (blog, metadata) |
| `viewer` | Read-only |

### Protecting Routes

**Server components / API routes:**
```ts
import { requireSiteContext } from "@/lib/auth";
const session = await requireSiteContext();  // throws 401 if not authed
```

**Role-gated actions:**
```ts
import { hasRole } from "@/lib/auth";
if (!hasRole(session, "admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

### Admin Route Coverage
- All `/api/admin/*` routes call `requireSiteContext()` at the top
- All `/admin/*` pages are behind NextAuth session check
- The middleware (`src/middleware.ts`) currently only sets `x-pathname` header — **auth enforcement is at the route level, not middleware level**

> **Note for future:** Moving admin auth to middleware would be more robust. Currently, a missed `requireSiteContext()` call in a new route would be an unprotected endpoint. Always add it.

---

## 4. Environment Variables & Secrets

### Required for Security Features

| Variable | Purpose | Where to get |
|----------|---------|--------------|
| `NEXTAUTH_SECRET` | JWT signing key | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical site URL for auth redirects | Your production domain |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 client key | [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 server key | Same as above |

### Rules
- Never commit `.env.local` to git (already in `.gitignore`)
- `NEXT_PUBLIC_*` vars are exposed to the browser — never put secrets there
- All secret keys must be set in Vercel environment variables for production
- Rotate `NEXTAUTH_SECRET` if you suspect session compromise (invalidates all sessions)

### Graceful Degradation
- If `RECAPTCHA_SECRET_KEY` is not set, `verifyRecaptcha()` returns `true` (pass-through)
- This is intentional for local development — reCAPTCHA verification would fail on localhost
- **Do not ship to production without reCAPTCHA keys set**

---

## 5. API Route Security

### Public Routes (no auth required)
These routes accept submissions from unauthenticated users and are protected by form security instead:

| Route | Protection |
|-------|-----------|
| `POST /api/contact` | Rate limit + honeypot + timing + content validation + reCAPTCHA |
| `POST /api/quote-submission` | Same |
| `POST /api/audit-request` | Same |

### Admin Routes (auth required)
All routes under `/api/admin/*` must call `requireSiteContext()`. The pattern:
```ts
export async function GET(req: NextRequest) {
  const session = await requireSiteContext();  // 401 if not authed
  const siteId = session.user.siteId;
  // ...
}
```

### Cron Routes
Protected by `CRON_SECRET` header verification:
```ts
import { authenticateCron } from "@/lib/cron-runner";
const cronAuth = authenticateCron(req);
if (!cronAuth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Content Security
- All user-supplied content is treated as untrusted — never rendered as raw HTML
- No `dangerouslySetInnerHTML` for user content
- Blog post markdown is rendered via a sanitized renderer

---

## 6. Deployment Checklist

Run through this before every client site goes live:

### Environment
- [ ] `NEXTAUTH_SECRET` is set to a fresh random value (not the default/example)
- [ ] `NEXTAUTH_URL` is set to the production domain (e.g., `https://clientdomain.com`)
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` are set
- [ ] reCAPTCHA v3 domain whitelist includes the production domain
- [ ] All other required env vars are set in Vercel (see ONBOARDING.md Phase 1)

### Forms
- [ ] Contact form submits correctly and email arrives
- [ ] Quote form submits correctly and email arrives
- [ ] Honeypot test: manually fill `website_url` field via DevTools → submission should silently succeed but NOT send email
- [ ] reCAPTCHA badge is hidden but legal disclosure text is visible in form copy

### Auth
- [ ] Admin login works at `/admin`
- [ ] Accessing `/admin/seo` without login redirects to login page
- [ ] An `editor` role user cannot access settings-only routes

### Rate Limiting
- [ ] Submitting the contact form 6+ times rapidly returns a 429 error on the 6th attempt
