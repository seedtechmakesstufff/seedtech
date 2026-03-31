#!/usr/bin/env python3
"""Quick test: just Week 3 insights + competitor gaps."""

import json
import sys
import urllib.request
import urllib.parse
import http.cookiejar

BASE = "http://localhost:3000"
EMAIL = "sswaynos@seedtechllc.com"
PASS = "SeedTech2026!"

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def api_get(path):
    try:
        resp = opener.open(f"{BASE}{path}", timeout=120)
        return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        try: return e.code, json.loads(body)
        except: return e.code, {"raw": body[:500]}
    except Exception as e:
        return 0, {"error": str(e)}

def api_post(path, data=None):
    body = json.dumps(data or {}).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=body,
        headers={"Content-Type": "application/json"}, method="POST")
    try:
        resp = opener.open(req, timeout=300)
        return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try: return e.code, json.loads(raw)
        except: return e.code, {"raw": raw[:500]}
    except Exception as e:
        return 0, {"error": str(e)}

# Auth
print("▸ Authenticating...")
code, csrf_data = api_get("/api/auth/csrf")
csrf_token = csrf_data.get("csrfToken", "")

no_redir = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirectHandler())
form_data = urllib.parse.urlencode({"csrfToken": csrf_token, "email": EMAIL, "password": PASS, "json": "true"}).encode()
req = urllib.request.Request(f"{BASE}/api/auth/callback/credentials", data=form_data,
    headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
try: no_redir.open(req, timeout=30)
except urllib.error.HTTPError: pass

code, session = api_get("/api/auth/session")
email = session.get("user", {}).get("email", "")
print(f"  Authenticated as: {email}\n")
if not email:
    print("Auth failed"); sys.exit(1)

# Test 3A: Insights
print("▸ [3A] Generating SEO insights (with ?action=generate)...")
code, data = api_post("/api/admin/seo/insights?action=generate")
print(f"  HTTP {code}")
if code == 200:
    insights = data.get("insights", [])
    count = data.get("count", len(insights))
    print(f"  Insights generated: {count}")
    by_type = {}
    for i in insights:
        t = i.get("type", "unknown")
        by_type[t] = by_type.get(t, 0) + 1
    for t, c in sorted(by_type.items()):
        print(f"    {t}: {c}")
    if insights:
        s = insights[0]
        print(f"  Sample: [{s.get('type')}] {s.get('title', '?')[:60]}")
        print(f"           {s.get('description', '?')[:80]}")
    print("  ✓ PASS")
else:
    print(f"  ✗ FAIL: {json.dumps(data, indent=2)[:300]}")

# Test 3B: Competitor gaps
print("\n▸ [3B] Competitor analysis + keyword gaps...")
code, data = api_get("/api/admin/seo/competitors/analysis")
print(f"  HTTP {code}")
if code == 200:
    overviews = data.get("overviews", [])
    gaps = data.get("gaps", [])
    kgaps = data.get("keywordGaps", [])
    print(f"  Overviews: {len(overviews)}")
    print(f"  Content gaps: {len(gaps)}")
    print(f"  Keyword gaps: {len(kgaps)}")
    by_gap = {}
    for kg in kgaps:
        g = kg.get("gapType", "unknown")
        by_gap[g] = by_gap.get(g, 0) + 1
    for g, c in sorted(by_gap.items()):
        print(f"    {g}: {c}")
    if kgaps:
        s = kgaps[0]
        print(f"  Sample: [{s.get('gapType')}] '{s.get('keyword', '?')}'")
        print(f"           {s.get('opportunity', '?')[:80]}")
    print("  ✓ PASS")
else:
    print(f"  ✗ FAIL: {json.dumps(data, indent=2)[:300]}")

print("\nDone.")
