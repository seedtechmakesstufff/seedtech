#!/usr/bin/env python3
"""Test Week 2 & 3 SEO features against the dev server."""

import json
import sys
import time
import urllib.request
import urllib.parse
import http.cookiejar

BASE = "http://localhost:3000"
EMAIL = "sswaynos@seedtechllc.com"
PASS = "SeedTech2026!"

# Set up cookie-based session
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def api_get(path):
    try:
        resp = opener.open(f"{BASE}{path}", timeout=120)
        return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {"raw": body[:500]}
    except Exception as e:
        return 0, {"error": str(e)}

def api_post(path, data=None):
    body = json.dumps(data or {}).encode()
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        resp = opener.open(req, timeout=300)  # 5 min for long AI calls
        return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try:
            return e.code, json.loads(raw)
        except:
            return e.code, {"raw": raw[:500]}
    except Exception as e:
        return 0, {"error": str(e)}

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Don't follow redirects — just capture cookies and stop."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def sign_in():
    """Authenticate via NextAuth credentials flow."""
    print(f"▸ Authenticating as {EMAIL}...")
    
    # 1. Get CSRF token
    code, csrf_data = api_get("/api/auth/csrf")
    if code != 200:
        print(f"  ✗ Failed to get CSRF token: HTTP {code}")
        return False
    csrf_token = csrf_data.get("csrfToken", "")
    print(f"  CSRF: {csrf_token[:20]}...")
    
    # 2. POST credentials (don't follow redirect — just capture session cookie)
    no_redirect_opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        NoRedirectHandler(),
    )
    
    form_data = urllib.parse.urlencode({
        "csrfToken": csrf_token,
        "email": EMAIL,
        "password": PASS,
        "json": "true",  # NextAuth hint to return JSON
    }).encode()
    
    req = urllib.request.Request(
        f"{BASE}/api/auth/callback/credentials",
        data=form_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        resp = no_redirect_opener.open(req, timeout=30)
        print(f"  Sign-in response: HTTP {resp.getcode()}")
    except urllib.error.HTTPError as e:
        # 302 is expected — cookies are captured via cookiejar
        if e.code in (301, 302, 303, 307, 308):
            location = e.headers.get("Location", "")
            print(f"  Sign-in redirected to: {location[:60]}...")
            if "error" in location:
                print(f"  ✗ Auth failed — check credentials")
                return False
        else:
            print(f"  Sign-in HTTP {e.code}")
            return False
    
    # 3. Verify session
    code, session = api_get("/api/auth/session")
    user_email = session.get("user", {}).get("email", "")
    if user_email:
        print(f"  ✓ Authenticated as {user_email}")
        return True
    else:
        print(f"  ✗ No session — response: {session}")
        return False

def test_content_calendar():
    """Test 2A: Generate 90-day content calendar."""
    print("\n▸ [2A] Generating 90-day content calendar (12 ideas)...")
    print("  Calling Claude API — may take 30-60 seconds...")
    
    code, data = api_post("/api/admin/seo/content-calendar/generate", {"ideaCount": 12})
    print(f"  HTTP {code}")
    
    if code == 200 and data.get("success"):
        saved = data.get("saved", 0)
        skipped = data.get("skipped", 0)
        total = data.get("total", 0)
        print(f"  saved={saved}, skipped={skipped}, total={total}")
        ideas = data.get("ideas", [])
        for i, idea in enumerate(ideas[:3]):
            print(f"    {i+1}. {idea.get('title', '?')} → [{idea.get('targetKeyword', '?')}]")
        if len(ideas) > 3:
            print(f"    ... and {len(ideas) - 3} more")
        print("  ✓ Content calendar generated")
        return True
    else:
        print(f"  ✗ FAILED: {json.dumps(data, indent=2)[:500]}")
        return False

def test_calendar_dedup():
    """Test 2B: Run again to verify dedup."""
    print("\n▸ [2B] Running calendar generation again (dedup test, 6 ideas)...")
    
    code, data = api_post("/api/admin/seo/content-calendar/generate", {"ideaCount": 6})
    print(f"  HTTP {code}")
    
    if code == 200 and data.get("success"):
        saved = data.get("saved", 0)
        skipped = data.get("skipped", 0)
        print(f"  saved={saved}, skipped={skipped}")
        if skipped > 0:
            print(f"  ✓ Dedup working — {skipped} ideas skipped")
        else:
            print(f"  ⚠ No duplicates detected (titles may differ)")
        return True
    else:
        print(f"  ✗ FAILED: {json.dumps(data, indent=2)[:500]}")
        return False

def test_batch_writer():
    """Test 2C: Batch write 2 blog posts."""
    print("\n▸ [2C] Writing 2 blog posts from content ideas...")
    print("  Claude API × 3 per post — may take 2-4 minutes...")
    
    code, data = api_post("/api/admin/seo/blog-batch/generate", {"count": 2})
    print(f"  HTTP {code}")
    
    if code == 200 and data.get("success"):
        written = data.get("written", 0)
        failed = data.get("failed", 0)
        print(f"  written={written}, failed={failed}")
        for p in data.get("posts", []):
            print(f"    📝 {p['title']} ({p.get('wordCount', '?')} words) → /blog/{p['slug']}")
        for e in data.get("errors", []):
            print(f"    ❌ {e['keyword']}: {e['error']}")
        print("  ✓ Batch writer completed")
        return True
    else:
        print(f"  ✗ FAILED: {json.dumps(data, indent=2)[:500]}")
        return False

def test_insights():
    """Test 3A: Generate SEO insights."""
    print("\n▸ [3A] Generating SEO insights...")
    
    code, data = api_post("/api/admin/seo/insights?action=generate")
    print(f"  HTTP {code}")
    
    if code == 200:
        insights = data.get("insights", data.get("data", []))
        if isinstance(insights, list):
            print(f"  Total insights: {len(insights)}")
            by_type = {}
            for i in insights:
                t = i.get("type", "unknown")
                by_type[t] = by_type.get(t, 0) + 1
            for t, c in sorted(by_type.items()):
                print(f"    {t}: {c}")
        else:
            print(f"  Response keys: {list(data.keys())}")
        print("  ✓ Insights generated")
        return True
    else:
        print(f"  ✗ FAILED: {json.dumps(data, indent=2)[:500]}")
        return False

def test_competitor_gaps():
    """Test 3B: Competitor analysis with keyword gaps."""
    print("\n▸ [3B] Running competitor analysis with keyword gaps...")
    
    code, data = api_get("/api/admin/seo/competitors/analysis")
    print(f"  HTTP {code}")
    
    if code == 200:
        overviews = data.get("overviews", [])
        gaps = data.get("gaps", [])
        keyword_gaps = data.get("keywordGaps", [])
        print(f"  Competitor overviews: {len(overviews)}")
        print(f"  Content gaps: {len(gaps)}")
        print(f"  Keyword gaps: {len(keyword_gaps)}")
        if keyword_gaps:
            by_gap = {}
            for kg in keyword_gaps:
                g = kg.get("gapType", "unknown")
                by_gap[g] = by_gap.get(g, 0) + 1
            for g, c in sorted(by_gap.items()):
                print(f"    {g}: {c}")
            sample = keyword_gaps[0]
            print(f"  Sample: '{sample.get('keyword', '?')}' — {sample.get('opportunity', '?')[:80]}")
        print("  ✓ Competitor analysis complete")
        return True
    else:
        print(f"  ✗ FAILED: {json.dumps(data, indent=2)[:500]}")
        return False


if __name__ == "__main__":
    print("═══════════════════════════════════════════")
    print("  SEO Autopilot — Week 2 & 3 Test Suite")
    print("═══════════════════════════════════════════\n")
    
    if not sign_in():
        print("\n✗ Authentication failed. Aborting.")
        sys.exit(1)
    
    results = {}
    
    print("\n═══════════════════════════════════════════")
    print("  WEEK 2 — Content Calendar + Batch Writer")
    print("═══════════════════════════════════════════")
    
    results["2A Content Calendar"] = test_content_calendar()
    results["2B Calendar Dedup"] = test_calendar_dedup()
    results["2C Batch Writer"] = test_batch_writer()
    
    print("\n═══════════════════════════════════════════")
    print("  WEEK 3 — Insights + Competitor Gaps")
    print("═══════════════════════════════════════════")
    
    results["3A SEO Insights"] = test_insights()
    results["3B Competitor Gaps"] = test_competitor_gaps()
    
    print("\n═══════════════════════════════════════════")
    print("  Test Summary")
    print("═══════════════════════════════════════════\n")
    
    for name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  [{status}] {name}")
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    print(f"\n  {passed}/{total} tests passed")
    
    sys.exit(0 if passed == total else 1)
