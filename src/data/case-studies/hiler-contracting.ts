import {
  Monitor,
  Shield,
  Cloud,
  HardDrive,
} from "lucide-react";

export const hilerContractingData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "A Growing Business Held Together by a Favor",
    body: "Hiler Contracting had been relying on someone they knew for IT help — a break-fix arrangement that worked in the loosest sense of the word. When something broke, they’d make a call and hope it got answered. There were no backups, no monitoring, no formal support agreement, and no guarantee that help would be available when they needed it. For a contracting operation where the office needs to keep pace with the field, that kind of arrangement isn’t a support strategy — it’s just deferred risk.",
  },
  solution: {
    headline: "Structured, Proactive IT That the Business Can Actually Rely On",
    body: "SeedTech replaced the informal break-fix arrangement with a proper managed IT foundation under SeedCare Essentials. Endpoints were enrolled in NinjaOne for 24/7 monitoring and management, SentinelOne was deployed across every machine for endpoint security, and Microsoft 365 was set up for email and cloud-based document access. File-level backup was configured and automated — giving Hiler Contracting a recovery path for the first time, with monthly reporting so they always know the backups are actually running. The shift from reactive to proactive means Hiler Contracting’s IT isn’t something they have to think about until it breaks. It’s something that’s being actively managed every day.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "24/7", label: "Proactive Monitoring" },
    { value: "30-day", label: "Backup Retention" },
    { value: "100%", label: "Endpoint Coverage" },
    { value: "∞", label: "Helpdesk — No Ticket Caps" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Monitor,
      title: "Managed IT Support (SeedCare Essentials)",
      body: "Ongoing SeedCare Essentials coverage — unlimited business-hours helpdesk, 24/7 monitoring and alerts, and patch management across all endpoints, with a real SLA behind every request.",
    },
    {
      icon: Cloud,
      title: "Microsoft 365 Setup & Management",
      body: "Microsoft 365 deployed and configured across the team — professional email, cloud-based document access, and ongoing account management replacing whatever informal tools came before.",
    },
    {
      icon: Shield,
      title: "Endpoint Security (SentinelOne)",
      body: "AI-driven threat protection deployed across every endpoint — proactive ransomware and malware defense with real-time isolation, running automatically without requiring manual intervention.",
    },
    {
      icon: HardDrive,
      title: "File-Level Backup",
      body: "Automated, cloud-based file backup configured across the environment for the first time — with monthly reporting so the team always knows their data is protected and recoverable.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Assessment",
      description:
        "SeedTech came in, reviewed the environment, and documented what was actually in place — hardware, software, and the gaps. We identified the immediate priorities: monitoring, security, backup, and a path off the break-fix arrangement.",
    },
    {
      step: "02",
      title: "Infrastructure & Security",
      description:
        "Endpoints were enrolled in NinjaOne, SentinelOne was deployed across every machine, and Microsoft 365 was set up and configured. File-level backup was established, automated, and confirmed running.",
    },
    {
      step: "03",
      title: "Stabilization & Coverage",
      description:
        "With the foundation in place, Hiler Contracting moved onto SeedCare Essentials — monitoring, patching, and helpdesk coverage running continuously and an actual support relationship replacing the informal one.",
    },
    {
      step: "04",
      title: "Ongoing Partnership",
      description:
        "SeedTech manages Hiler Contracting’s environment on an ongoing basis — proactively monitoring, responding to issues, and making sure the business has an IT partner that’s accountable, not just available.",
    },
  ],
};
