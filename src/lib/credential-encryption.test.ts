import { describe, it, expect } from "vitest";
import { encryptCredential, decryptCredential, isEncrypted } from "./credential-encryption";

describe("credential-encryption", () => {
  it("round-trips arbitrary text", () => {
    const plaintext = JSON.stringify({ refresh_token: "1//abc.def-ghi", scope: "x y", granted_at: "2026-05-10T00:00:00Z" });
    const encoded = encryptCredential(plaintext);
    expect(encoded).not.toContain("refresh_token");
    expect(decryptCredential(encoded)).toBe(plaintext);
  });

  it("produces a different ciphertext on each call (non-deterministic IV)", () => {
    const a = encryptCredential("hello");
    const b = encryptCredential("hello");
    expect(a).not.toBe(b);
    expect(decryptCredential(a)).toBe("hello");
    expect(decryptCredential(b)).toBe("hello");
  });

  it("isEncrypted recognizes our format and rejects others", () => {
    expect(isEncrypted(encryptCredential("x"))).toBe(true);
    expect(isEncrypted("not encrypted")).toBe(false);
    expect(isEncrypted("a.b")).toBe(false);
    expect(isEncrypted("a.b.c.d")).toBe(false);
  });

  it("rejects tampered ciphertext via auth tag", () => {
    const encoded = encryptCredential("secret");
    const [iv, tag, _ct] = encoded.split(".");
    const tampered = `${iv}.${tag}.${Buffer.from("tampered").toString("base64")}`;
    expect(() => decryptCredential(tampered)).toThrow();
  });

  it("rejects malformed encoded values", () => {
    expect(() => decryptCredential("not-valid")).toThrow();
  });
});
