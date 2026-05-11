import { describe, it, expect, vi } from "vitest";

// Mock prisma BEFORE importing the lib under test — the lib uses dynamic import
vi.mock("@/lib/prisma", () => ({
  prisma: {
    site: {
      findUnique: vi.fn().mockResolvedValue({
        domain: "seedtechllc.com",
        siteUrl: "https://seedtechllc.com",
      }),
    },
    businessProfile: {
      findUnique: vi.fn().mockResolvedValue({ domain: "seedtechllc.com" }),
    },
  },
}));

import { validateGbpCtaUrl } from "./gbp";

describe("validateGbpCtaUrl", () => {
  it("accepts URLs on the site domain", async () => {
    await expect(
      validateGbpCtaUrl("site_x", "https://seedtechllc.com/blog/foo")
    ).resolves.toBeUndefined();
  });

  it("accepts URLs on the same domain with www subdomain", async () => {
    await expect(
      validateGbpCtaUrl("site_x", "https://www.seedtechllc.com/contact")
    ).resolves.toBeUndefined();
  });

  it("accepts the location's website URI as an additional allowed host", async () => {
    await expect(
      validateGbpCtaUrl("site_x", "https://branch.example.com/book", "https://branch.example.com")
    ).resolves.toBeUndefined();
  });

  it("rejects an off-domain URL", async () => {
    await expect(validateGbpCtaUrl("site_x", "https://google.com/foo")).rejects.toThrow(
      /not on the site's allowlist/i
    );
  });

  it("rejects malformed URLs", async () => {
    await expect(validateGbpCtaUrl("site_x", "not-a-url")).rejects.toThrow(/Invalid CTA URL/);
  });

  it("rejects non-http(s) protocols", async () => {
    await expect(validateGbpCtaUrl("site_x", "javascript:alert(1)")).rejects.toThrow(/http/);
  });

  it("treats null/empty as valid (no CTA configured)", async () => {
    await expect(validateGbpCtaUrl("site_x", null)).resolves.toBeUndefined();
    await expect(validateGbpCtaUrl("site_x", undefined)).resolves.toBeUndefined();
    await expect(validateGbpCtaUrl("site_x", "")).resolves.toBeUndefined();
  });
});
