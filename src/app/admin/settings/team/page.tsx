"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Crown,
  Eye,
  PenLine,
  Trash2,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: string;
  joinedAt: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

const ROLE_ICONS: Record<string, typeof Shield> = {
  owner: Crown,
  admin: Shield,
  editor: PenLine,
  viewer: Eye,
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<string, string> = {
  owner: "text-amber-400 bg-amber-400/10",
  admin: "text-seed-400 bg-seed-400/10",
  editor: "text-blue-400 bg-blue-400/10",
  viewer: "text-white/50 bg-white/[0.06]",
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Failed to load team");
      const data = await res.json();
      setMembers(data.members || []);
      setInvites(data.invites || []);
    } catch {
      setMessage({ type: "error", text: "Failed to load team members" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invite");
      setMessage({ type: "success", text: `Invite sent to ${inviteEmail}` });
      setInviteEmail("");
      setShowInvite(false);
      loadTeam();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to send invite" });
    } finally {
      setSending(false);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove");
      }
      setMessage({ type: "success", text: `${name} removed` });
      loadTeam();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to remove" });
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }
      loadTeam();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to update role" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-seed-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/settings"
            className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Settings
          </Link>
          <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-seed-400" />
            Team Management
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage team members and their access levels.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-4 py-2 bg-seed-500 hover:bg-seed-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={cn(
            "px-4 py-3 rounded-lg text-sm flex items-center gap-2",
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Invite form */}
      {showInvite && (
        <div className="bg-dark-elevated border border-seed-500/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-seed-400" />
            Send Invitation
          </h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@example.com"
              className="flex-1 bg-dark-base border border-white/[0.06] rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-seed-500/40 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-dark-base border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:border-seed-500/40 focus:outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleInvite}
              disabled={!inviteEmail || sending}
              className="px-4 py-2 bg-seed-500 hover:bg-seed-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send
            </button>
          </div>
          <p className="text-xs text-white/30">
            Invite expires in 7 days. The user will need to create an account to accept.
          </p>
        </div>
      )}

      {/* Members list */}
      <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Users className="w-5 h-5 text-seed-400" />
          <h2 className="font-semibold text-white">
            Team Members
            <span className="text-white/40 font-normal ml-2">({members.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {members.map((member) => {
            const Icon = ROLE_ICONS[member.role] || Eye;
            return (
              <div
                key={member.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-seed-500/10 flex items-center justify-center text-seed-400 font-semibold text-sm">
                  {(member.name || member.email)[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {member.name || member.email}
                  </p>
                  <p className="text-xs text-white/40 truncate">{member.email}</p>
                </div>

                {/* Role badge */}
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    ROLE_COLORS[member.role] || ROLE_COLORS.viewer
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {ROLE_LABELS[member.role] || member.role}
                </div>

                {/* Actions (not for owners) */}
                {member.role !== "owner" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="bg-dark-base border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleRemove(member.id, member.name || member.email)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {members.length === 0 && (
            <div className="px-6 py-12 text-center text-white/40 text-sm">
              No team members yet. Invite someone to get started.
            </div>
          )}
        </div>
      </section>

      {/* Pending invites */}
      {invites.length > 0 && (
        <section className="bg-dark-elevated border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-white">
              Pending Invites
              <span className="text-white/40 font-normal ml-2">({invites.length})</span>
            </h2>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{invite.email}</p>
                  <p className="text-xs text-white/40">
                    Invited as {ROLE_LABELS[invite.role] || invite.role} · Expires{" "}
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(invite.id, invite.email)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Cancel invite"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
