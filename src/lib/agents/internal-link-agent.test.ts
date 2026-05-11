import { describe, it, expect } from "vitest";
import { insertMarkdownLink } from "./internal-link-agent";

describe("insertMarkdownLink", () => {
  it("wraps the first verbatim occurrence", () => {
    const body = "We offer managed IT and web development.";
    const result = insertMarkdownLink(body, "managed IT", "/services/managed-it");
    expect(result).toBe("We offer [managed IT](/services/managed-it) and web development.");
  });

  it("is case-insensitive on the anchor match", () => {
    const body = "Our Managed It practice is mature.";
    const result = insertMarkdownLink(body, "managed it", "/services/managed-it");
    // We preserve the original casing in the wrapped text
    expect(result).toBe("Our [Managed It](/services/managed-it) practice is mature.");
  });

  it("returns null if the body already contains the target URL", () => {
    const body = "See [our services](/services/managed-it) for more.";
    const result = insertMarkdownLink(body, "services", "/services/managed-it");
    expect(result).toBeNull();
  });

  it("returns null if the anchor is not present", () => {
    const body = "We offer cloud hosting.";
    const result = insertMarkdownLink(body, "managed IT", "/services/managed-it");
    expect(result).toBeNull();
  });

  it("does not double-wrap a phrase already inside a link", () => {
    const body = "Read our [managed IT guide](/blog/managed-it).";
    const result = insertMarkdownLink(body, "managed IT", "/services/managed-it");
    // Already linked once — but our regex avoids matches followed by `]`,
    // and the existing link contains the target URL only if it matches; here
    // it's a different URL, so the lookahead fires only on bracketed text.
    // The function should either return null (already-linked phrase) or
    // wrap a different occurrence; in this body there isn't one.
    expect(result).toBeNull();
  });

  it("only wraps the first occurrence when there are multiple matches", () => {
    const body = "We do managed IT. We focus on managed IT.";
    const result = insertMarkdownLink(body, "managed IT", "/services/managed-it");
    expect(result).toBe("We do [managed IT](/services/managed-it). We focus on managed IT.");
  });

  it("escapes regex metacharacters in anchor text", () => {
    const body = "Our (premium) tier costs more.";
    const result = insertMarkdownLink(body, "(premium)", "/pricing");
    expect(result).toBe("Our [(premium)](/pricing) tier costs more.");
  });
});
