#!/usr/bin/env bash
# Test Week 2 & 3 SEO features against the dev server
# Usage: ./scripts/test-week2-3.sh

set -euo pipefail

BASE="http://localhost:3000"
EMAIL="sswaynos@seedtechllc.com"
PASS="SeedTech2026!"
COOKIE_JAR="/tmp/seedtech-test-cookies.txt"

echo "═══════════════════════════════════════════"
echo "  SEO Autopilot — Week 2 & 3 Test Suite"
echo "═══════════════════════════════════════════"
echo ""

# ── Step 1: Authenticate via NextAuth ──────────────────────────
echo "▸ Authenticating as $EMAIL..."

# Get CSRF token
CSRF=$(curl -s -c "$COOKIE_JAR" "$BASE/api/auth/csrf" | python3 -c "import sys,json; print(json.load(sys.stdin)['csrfToken'])")
echo "  CSRF token: ${CSRF:0:20}..."

# Sign in
SIGNIN=$(curl -s -w "\n%{http_code}" \
  -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
  -X POST "$BASE/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=$CSRF&email=$EMAIL&password=$PASS" \
  -L)

HTTP_CODE=$(echo "$SIGNIN" | tail -1)
echo "  Sign-in response: HTTP $HTTP_CODE"

# Verify session
SESSION=$(curl -s -b "$COOKIE_JAR" "$BASE/api/auth/session")
USER_EMAIL=$(echo "$SESSION" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('email','NOT FOUND'))" 2>/dev/null || echo "PARSE ERROR")
echo "  Session user: $USER_EMAIL"
echo ""

if [ "$USER_EMAIL" = "NOT FOUND" ] || [ "$USER_EMAIL" = "PARSE ERROR" ]; then
  echo "✗ Authentication failed. Aborting."
  exit 1
fi

echo "✓ Authenticated successfully"
echo ""

# ── WEEK 2 TESTS ──────────────────────────────────────────────

echo "═══════════════════════════════════════════"
echo "  WEEK 2 — Content Calendar + Batch Writer"
echo "═══════════════════════════════════════════"
echo ""

# ── Test 2A: Generate Content Calendar ──
echo "▸ [2A] Generating 90-day content calendar (12 ideas)..."
echo "  This calls Claude API — may take 30-60 seconds..."
echo ""

CALENDAR=$(curl -s -w "\n---HTTP_CODE:%{http_code}---" \
  -b "$COOKIE_JAR" \
  -X POST "$BASE/api/admin/seo/content-calendar/generate" \
  -H "Content-Type: application/json" \
  -d '{"ideaCount": 12}')

CAL_CODE=$(echo "$CALENDAR" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
CAL_BODY=$(echo "$CALENDAR" | sed 's/---HTTP_CODE:[0-9]*---//')

echo "  HTTP Status: $CAL_CODE"
if [ "$CAL_CODE" = "200" ]; then
  SAVED=$(echo "$CAL_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'saved={d.get(\"saved\",\"?\")}, skipped={d.get(\"skipped\",\"?\")}, total={d.get(\"total\",\"?\")}')")
  echo "  Result: $SAVED"
  echo "  ✓ Content calendar generated"
else
  echo "  ✗ FAILED — Response:"
  echo "$CAL_BODY" | python3 -m json.tool 2>/dev/null || echo "$CAL_BODY"
fi
echo ""

# ── Test 2B: Run again to test dedup ──
echo "▸ [2B] Running calendar generation again (dedup test)..."
echo ""

CALENDAR2=$(curl -s -w "\n---HTTP_CODE:%{http_code}---" \
  -b "$COOKIE_JAR" \
  -X POST "$BASE/api/admin/seo/content-calendar/generate" \
  -H "Content-Type: application/json" \
  -d '{"ideaCount": 6}')

CAL2_CODE=$(echo "$CALENDAR2" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
CAL2_BODY=$(echo "$CALENDAR2" | sed 's/---HTTP_CODE:[0-9]*---//')

echo "  HTTP Status: $CAL2_CODE"
if [ "$CAL2_CODE" = "200" ]; then
  SAVED2=$(echo "$CAL2_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'saved={d.get(\"saved\",\"?\")}, skipped={d.get(\"skipped\",\"?\")}, total={d.get(\"total\",\"?\")}')")
  echo "  Result: $SAVED2"
  SKIPPED2=$(echo "$CAL2_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('skipped',0))")
  if [ "$SKIPPED2" -gt 0 ] 2>/dev/null; then
    echo "  ✓ Dedup working — $SKIPPED2 ideas skipped"
  else
    echo "  ⚠ No skipped ideas — dedup may not be triggering (could be different titles)"
  fi
else
  echo "  ✗ FAILED — Response:"
  echo "$CAL2_BODY" | python3 -m json.tool 2>/dev/null || echo "$CAL2_BODY"
fi
echo ""

# ── Test 2C: Batch Write Blog Posts ──
echo "▸ [2C] Writing 2 blog posts from content ideas..."
echo "  This calls Claude API 3x per post — may take 2-4 minutes..."
echo ""

BATCH=$(curl -s -w "\n---HTTP_CODE:%{http_code}---" \
  -b "$COOKIE_JAR" \
  -X POST "$BASE/api/admin/seo/blog-batch/generate" \
  -H "Content-Type: application/json" \
  -d '{"count": 2}')

BATCH_CODE=$(echo "$BATCH" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
BATCH_BODY=$(echo "$BATCH" | sed 's/---HTTP_CODE:[0-9]*---//')

echo "  HTTP Status: $BATCH_CODE"
if [ "$BATCH_CODE" = "200" ]; then
  WRITTEN=$(echo "$BATCH_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'written={d.get(\"written\",\"?\")}, failed={d.get(\"failed\",\"?\")}, total={d.get(\"total\",\"?\")}')")
  echo "  Result: $WRITTEN"
  # Show post titles
  echo "$BATCH_BODY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('posts', []):
    print(f'    📝 {p[\"title\"]} ({p[\"wordCount\"]} words) → /blog/{p[\"slug\"]}')
for e in d.get('errors', []):
    print(f'    ❌ {e[\"keyword\"]}: {e[\"error\"]}')
" 2>/dev/null || true
  echo "  ✓ Batch blog writer completed"
else
  echo "  ✗ FAILED — Response:"
  echo "$BATCH_BODY" | python3 -m json.tool 2>/dev/null || echo "$BATCH_BODY"
fi
echo ""

# ── WEEK 3 TESTS ──────────────────────────────────────────────

echo "═══════════════════════════════════════════"
echo "  WEEK 3 — Insights + Competitor Gaps"
echo "═══════════════════════════════════════════"
echo ""

# ── Test 3A: Generate Insights ──
echo "▸ [3A] Generating SEO insights..."
echo ""

INSIGHTS=$(curl -s -w "\n---HTTP_CODE:%{http_code}---" \
  -b "$COOKIE_JAR" \
  -X POST "$BASE/api/admin/seo/insights" \
  -H "Content-Type: application/json")

INS_CODE=$(echo "$INSIGHTS" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
INS_BODY=$(echo "$INSIGHTS" | sed 's/---HTTP_CODE:[0-9]*---//')

echo "  HTTP Status: $INS_CODE"
if [ "$INS_CODE" = "200" ]; then
  echo "$INS_BODY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
insights = d.get('insights', d.get('data', []))
if isinstance(insights, list):
    print(f'  Total insights: {len(insights)}')
    by_type = {}
    for i in insights:
        t = i.get('type', 'unknown')
        by_type[t] = by_type.get(t, 0) + 1
    for t, c in sorted(by_type.items()):
        print(f'    {t}: {c}')
else:
    print(f'  Response keys: {list(d.keys())}')
" 2>/dev/null || echo "  (could not parse insights)"
  echo "  ✓ Insights generated"
else
  echo "  ✗ FAILED — Response:"
  echo "$INS_BODY" | python3 -m json.tool 2>/dev/null || echo "${INS_BODY:0:500}"
fi
echo ""

# ── Test 3B: Competitor Analysis with Keyword Gaps ──
echo "▸ [3B] Running competitor analysis with keyword gaps..."
echo ""

COMP=$(curl -s -w "\n---HTTP_CODE:%{http_code}---" \
  -b "$COOKIE_JAR" \
  "$BASE/api/admin/seo/competitors/analysis")

COMP_CODE=$(echo "$COMP" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
COMP_BODY=$(echo "$COMP" | sed 's/---HTTP_CODE:[0-9]*---//')

echo "  HTTP Status: $COMP_CODE"
if [ "$COMP_CODE" = "200" ]; then
  echo "$COMP_BODY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
overviews = d.get('overviews', [])
gaps = d.get('gaps', [])
keyword_gaps = d.get('keywordGaps', [])
print(f'  Competitor overviews: {len(overviews)}')
print(f'  Content gaps: {len(gaps)}')
print(f'  Keyword gaps: {len(keyword_gaps)}')
if keyword_gaps:
    by_gap = {}
    for kg in keyword_gaps:
        g = kg.get('gap', 'unknown')
        by_gap[g] = by_gap.get(g, 0) + 1
    for g, c in sorted(by_gap.items()):
        print(f'    {g}: {c}')
    print(f'  Sample gap: {keyword_gaps[0].get(\"keyword\",\"?\")} — {keyword_gaps[0].get(\"action\",\"?\")}')
" 2>/dev/null || echo "  (could not parse competitor data)"
  echo "  ✓ Competitor analysis with keyword gaps complete"
else
  echo "  ✗ FAILED — Response:"
  echo "$COMP_BODY" | python3 -m json.tool 2>/dev/null || echo "${COMP_BODY:0:500}"
fi
echo ""

# ── Summary ──
echo "═══════════════════════════════════════════"
echo "  Test Summary"
echo "═══════════════════════════════════════════"
echo ""
echo "  [2A] Content Calendar: HTTP $CAL_CODE"
echo "  [2B] Calendar Dedup:   HTTP ${CAL2_CODE:-skipped}"
echo "  [2C] Batch Writer:     HTTP $BATCH_CODE"
echo "  [3A] SEO Insights:     HTTP $INS_CODE"
echo "  [3B] Competitor Gaps:  HTTP $COMP_CODE"
echo ""

# Cleanup
rm -f "$COOKIE_JAR"
echo "Done."
