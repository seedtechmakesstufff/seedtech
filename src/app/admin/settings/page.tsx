"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  CheckCircle2,
  XCircle,
  Shield,
  Zap,
  Brain,
  Building2,
  Server,
  Lock,
  Users,
  Mail,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SettingsPage() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/settings/env-status")
      .then((r) => r.json())
      .then((d) => setEnvVars(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-seed-400" />
          Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Admin preferences, authentication, and environment overview.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/settings/team"
          className="group bg-dark-elevated border border-white/[0.06] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-seed-500/20 hover:bg-seed-500/[0.03] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center group-hover:bg-seed-500/15 transition-colors">
            <Users className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-seed-400 transition-colors">
              Team Management
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Invite members, manage roles &amp; permissions
            </p>
          </div>
        </Link>
        <Link
          href="/admin/seo/settings"
          className="group bg-dark-elevated border border-white/[0.06] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-seed-500/20 hover:bg-seed-500/[0.03] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center group-hover:bg-seed-500/15 transition-colors">
            <Zap className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-seed-400 transition-colors">
              SEO Autopilot Settings
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              API keys, integrations, automation &amp; reports
            </p>
          </div>
        </Link>
        <Link
          href="/admin/email"
          className="group bg-dark-elevated border border-white/[0.06] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-seed-500/20 hover:bg-seed-500/[0.03] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center group-hover:bg-seed-500/15 transition-colors">
            <Mail className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-seed-400 transition-colors">
              Email Automations
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Resend status, template editor, and form submissions
            </p>
          </div>
        </Link>
        <Link
          href="/admin/settings/branding"
          className="group bg-dark-elevated border border-white/[0.06] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-seed-500/20 hover:bg-seed-500/[0.03] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-seed-500/10 flex items-center justify-center group-hover:bg-seed-500/15 transition-colors">
            <ImageIcon className="w-5 h-5 text-seed-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-seed-400 transition-colors">
              Branding
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Upload company logo for emails and platform assets
            </p>
          </div>
        </Link>
      </div>

      {/* Admin & Platform */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Shield className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">Admin &amp; Platform</h2>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              label="Allowed Admin Emails"
              value={process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Configured server-side"}
              icon={<Users className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Auth Provider"
              value="NextAuth — Credentials"
              icon={<Lock className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="AI Model"
              value="claude-opus-4-6 (Anthropic)"
              icon={<Brain className="w-4 h-4 text-white/40" />}
            />
            <InfoCard
              label="Database"
              value="Neon PostgreSQL (Prisma ORM)"
              icon={<Building2 className="w-4 h-4 text-white/40" />}
            />
          </div>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Server className="w-5 h-5 text-seed-400" />
          <div>
            <h2 className="font-semibold text-white">Environment Variables</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Core platform variables. SEO-specific variables are managed in{" "}
              <Link href="/admin/seo/settings" className="text-seed-400 hover:underline">SEO Settings</Link>.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
            <EnvRow name="NEXTAUTH_URL" present={envVars.NEXTAUTH_URL ?? true} />
            <EnvRow name="NEXTAUTH_SECRET" present={envVars.NEXTAUTH_SECRET ?? true} />
            <EnvRow name="ADMIN_EMAILS" present={envVars.ADMIN_EMAILS ?? true} />
            <EnvRow name="ADMIN_PASSWORD" present={envVars.ADMIN_PASSWORD ?? true} />
            <EnvRow name="DATABASE_URL" present={envVars.DATABASE_URL ?? false} />
            <EnvRow name="RESEND_API_KEY" present={envVars.RESEND_API_KEY ?? false} optional />
          </div>

          <p className="text-xs text-white/25 mt-4">
            Set variables in <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">.env.local</code> (dev) or Vercel Settings → Environment Variables (production).
            Changes require a server restart to take effect.
          </p>
        </div>
      </section>
    </div>
  );
}

/* Reusable Components */

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-dark-base rounded-lg px-4 py-3 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-white/40">{label}</p>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function EnvRow({ name, present, optional }: { name: string; present: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {present ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
      ) : optional ? (
        <XCircle className="w-3.5 h-3.5 text-yellow-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-400" />
      )}
      <code className="text-white/60">{name}</code>
      {optional && <span className="text-white/30 text-[10px]">(optional)</span>}
      <span className={cn("ml-auto", present ? "text-green-400/60" : optional ? "text-yellow-400/60" : "text-red-400/60")}>
        {present ? "Set" : optional ? "Not set" : "Missing"}
      </span>
    </div>
  );
}
