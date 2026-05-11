// Test environment setup. Provide a stable encryption key for crypto tests
// and stub env vars that lib code expects to exist.

process.env.CREDENTIAL_ENCRYPTION_KEY =
  process.env.CREDENTIAL_ENCRYPTION_KEY ??
  "0".repeat(64); // 32 bytes hex of zeros — fine for round-trip tests

// NODE_ENV is read-only in Next.js's process.env types; vitest sets it itself
