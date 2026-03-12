"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-white tracking-wide">SEEDTECH</h1>
          <p className="text-white/40 text-sm mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-dark-elevated border border-white/[0.06] rounded-xl p-8 space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@seedtechllc.com"
              required
              className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg bg-dark-base border border-white/[0.08] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-seed-500/50 focus:border-seed-500/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-brand-error text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
