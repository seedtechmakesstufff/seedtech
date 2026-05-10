"use client";

import { useState, useEffect, useRef } from "react";
import { LockKeyhole } from "lucide-react";

const STORAGE_KEY = "srg_v1";

export function SalesRepGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
    setReady(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sales-rep-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setUnlocked(true);
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        emailRef.current?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Children always stay in the React tree so RSC hydration works correctly.
          When locked they are visually hidden and collapsed so they take no space. */}
      <div className={unlocked ? "" : "invisible h-0 overflow-hidden"} aria-hidden={!unlocked}>
        {children}
      </div>

      {/* Gate form — shown when locked */}
      {!unlocked && (
        <section className="bg-dark-base py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-md">
              <div className="rounded-3xl border border-white/[0.08] bg-dark-elevated p-8 md:p-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-seed-500/30 bg-seed-500/10">
                  <LockKeyhole className="h-5 w-5 text-seed-400" />
                </div>

                <p className="text-[11px] uppercase tracking-[0.22em] text-seed-400">
                  Access required
                </p>
                <h2 className="mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-white">
                  Compensation details
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Enter your email and the access code we shared with you to view
                  the full compensation calculator and partner details.
                </p>

                {/* Show a subtle loading state while sessionStorage is being read */}
                {!ready ? (
                  <div className="mt-8 h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                    <div>
                      <label
                        htmlFor="srg-email"
                        className="mb-1.5 block text-xs text-white/60"
                      >
                        Your email
                      </label>
                      <input
                        ref={emailRef}
                        id="srg-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/[0.12] bg-dark-base px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-seed-500/50 focus:outline-none focus:ring-1 focus:ring-seed-500/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="srg-password"
                        className="mb-1.5 block text-xs text-white/60"
                      >
                        Access code
                      </label>
                      <input
                        id="srg-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-white/[0.12] bg-dark-base px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-seed-500/50 focus:outline-none focus:ring-1 focus:ring-seed-500/30"
                      />
                    </div>

                    {error && (
                      <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 w-full rounded-2xl bg-gradient-brand py-4 text-sm font-semibold text-white transition-all duration-200 hover:shadow-glowSeed disabled:opacity-60"
                    >
                      {loading ? "Checking…" : "Unlock details"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
