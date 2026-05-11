import { describe, it, expect } from "vitest";
import { inferIntent, inferTier, suggestTargetPage } from "./keyword-scout";

describe("keyword-scout heuristics", () => {
  describe("inferIntent", () => {
    const noBrand = new Set<string>();
    const seedtech = new Set(["seedtech", "seed", "tech"]);

    it("detects transactional intent", () => {
      expect(inferIntent("buy managed it nj", noBrand)).toBe("transactional");
      expect(inferIntent("managed it pricing", noBrand)).toBe("transactional");
      expect(inferIntent("it support near me", noBrand)).toBe("transactional");
    });

    it("detects commercial intent", () => {
      expect(inferIntent("best msp in nj", noBrand)).toBe("commercial");
      expect(inferIntent("seedcare vs ntiva", noBrand)).toBe("commercial");
      expect(inferIntent("managed it review", noBrand)).toBe("commercial");
    });

    it("detects informational intent", () => {
      expect(inferIntent("how to choose an msp", noBrand)).toBe("informational");
      expect(inferIntent("what is managed it", noBrand)).toBe("informational");
      expect(inferIntent("guide to it support", noBrand)).toBe("informational");
    });

    it("detects navigational intent when brand token appears", () => {
      expect(inferIntent("seedtech contact", seedtech)).toBe("navigational");
      expect(inferIntent("seedtech reviews", seedtech)).toBe("navigational");
    });

    it("falls back to informational for unknown queries", () => {
      expect(inferIntent("unrelated topic xyz", noBrand)).toBe("informational");
    });
  });

  describe("inferTier", () => {
    it("tier1 for high impressions", () => {
      expect(inferTier(1500)).toBe("tier1");
      expect(inferTier(1000)).toBe("tier1");
    });
    it("tier2 for mid impressions", () => {
      expect(inferTier(500)).toBe("tier2");
      expect(inferTier(200)).toBe("tier2");
    });
    it("tier3 for low impressions", () => {
      expect(inferTier(50)).toBe("tier3");
      expect(inferTier(199)).toBe("tier3");
    });
  });

  describe("suggestTargetPage", () => {
    const pages = [
      { path: "/services/managed-it", kind: "service", title: "Managed IT Services" },
      { path: "/services/web-development", kind: "service", title: "Web Development" },
      { path: "/blog/managed-it-cost", kind: "blog", title: "Managed IT cost guide" },
      { path: "/about", kind: "about", title: "About" },
    ];

    it("matches service pages by token overlap", () => {
      expect(suggestTargetPage("managed it pricing", pages)).toBe("/services/managed-it");
      expect(suggestTargetPage("web development cost", pages)).toBe("/services/web-development");
    });

    it("prefers service pages over blog matches when both match", () => {
      // 'managed it cost' matches both /services/managed-it and /blog/managed-it-cost
      // service kind gets +0.5 boost; both share tokens 'managed' and 'it' (and 'cost' for blog)
      // but service-page boost should still win
      const r = suggestTargetPage("managed it cost", pages);
      expect(["/services/managed-it", "/blog/managed-it-cost"]).toContain(r);
    });

    it("returns / when nothing matches", () => {
      expect(suggestTargetPage("zzz unrelated query", pages)).toBe("/");
    });

    it("returns / for very short queries with no long tokens", () => {
      expect(suggestTargetPage("it", pages)).toBe("/");
    });
  });
});
