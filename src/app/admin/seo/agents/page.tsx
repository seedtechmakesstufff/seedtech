"use client";

import { useState } from "react";
import { Bot, Mail } from "lucide-react";
import { AgentsTab } from "./AgentsTab";
import { DigestTab } from "./DigestTab";

type Tab = "agents" | "digest";

export default function SeoAgentsPage() {
  const [tab, setTab] = useState<Tab>("agents");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display tracking-wide text-white flex items-center gap-3">
          <Bot className="w-7 h-7 text-seed-400" />
          SEO Agents
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Run individual agents, the full weekly pipeline, and manage the weekly digest email.
        </p>
      </div>

      <div className="flex gap-1 border-b border-white/[0.06]">
        <TabButton active={tab === "agents"} onClick={() => setTab("agents")} icon={<Bot className="w-4 h-4" />}>
          Agents
        </TabButton>
        <TabButton active={tab === "digest"} onClick={() => setTab("digest")} icon={<Mail className="w-4 h-4" />}>
          Digest
        </TabButton>
      </div>

      {tab === "agents" && <AgentsTab />}
      {tab === "digest" && <DigestTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
        active ? "border-seed-500 text-seed-400" : "border-transparent text-white/40 hover:text-white/70"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
