import {
  Monitor,
  Shield,
  Cloud,
  Wifi,
} from "lucide-react";

export const southShoreMarineData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "A Busy Shop Running on Zero IT Support",
    body: "South Shore Marine came to SeedTech with no managed IT support, no backups, and no formal technology infrastructure in place. For a fast-moving marine service business with a packed service calendar and a growing customer base, the risk was real — a single hardware failure or data loss event could have meant lost customer records, missed appointments, and extended downtime with no one to call. Running a concierge operation on top of a full repair shop means the team needs their systems to work. There was no room for the kind of slow, reactive IT that most small businesses settle for.",
  },
  solution: {
    headline: "Proactive IT Built for a Service-First Business",
    body: "SeedTech deployed managed IT coverage across South Shore Marine's environment — bringing in 24/7 monitoring, endpoint management, SentinelOne cybersecurity, and unlimited business-hours helpdesk support. Google Workspace was set up as the backbone for email and cloud-based collaboration, giving the team a clean, reliable communication platform from day one. With SeedTech handling IT proactively in the background, South Shore Marine has a responsive partner ready when something goes wrong — and a team working to make sure it doesn't.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "24/7", label: "Proactive Monitoring" },
    { value: "100%", label: "Endpoint Coverage" },
    { value: "0", label: "Unplanned Downtime Events" },
    { value: "∞", label: "Helpdesk — No Ticket Caps" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Monitor,
      title: "Managed IT Support",
      body: "Ongoing SeedCare Essentials coverage — unlimited business-hours helpdesk, 24/7 monitoring and alerts, patch management, and a dedicated point of contact for every IT need.",
    },
    {
      icon: Cloud,
      title: "Google Workspace Setup & Management",
      body: "Full Google Workspace deployment for email and cloud-based document collaboration, keeping the team connected and organized across the shop.",
    },
    {
      icon: Shield,
      title: "Endpoint Security (SentinelOne)",
      body: "AI-driven antivirus and threat protection deployed across all endpoints — proactive ransomware and malware defense with real-time threat isolation.",
    },
    {
      icon: Wifi,
      title: "WiFi Infrastructure",
      body: "Managed wireless environment providing reliable connectivity across the shop and office, with remote monitoring and alerting.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Assessment",
      description:
        "SeedTech assessed South Shore Marine's environment, documenting the complete absence of any existing IT infrastructure, backup solution, or managed support. We identified key risks and defined the scope of what needed to be built.",
    },
    {
      step: "02",
      title: "Infrastructure Setup",
      description:
        "We deployed endpoint management through NinjaOne, set up Google Workspace across all users, and configured SentinelOne security across the environment. WiFi infrastructure was established and brought under remote management.",
    },
    {
      step: "03",
      title: "Stabilization & Coverage",
      description:
        "With the foundation in place, South Shore Marine transitioned to ongoing managed support under SeedCare Essentials — with monitoring, patching, and helpdesk coverage running continuously.",
    },
    {
      step: "04",
      title: "Ongoing Partnership",
      description:
        "SeedTech remains South Shore Marine's dedicated IT partner, handling day-to-day support and keeping the environment healthy so the team can stay focused on running their business.",
    },
  ],
};
