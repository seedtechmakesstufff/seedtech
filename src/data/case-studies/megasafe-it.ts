import {
  Monitor,
  Shield,
  Cloud,
  HardDrive,
  Globe,
} from "lucide-react";

export const megasafeItData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "A Business Built on Security — Without a Managed IT Foundation",
    body: "Megasafe's entire value proposition to their clients is expertise and trust. They're the company that answers questions nobody else can, that shows up on time, and that makes sure every detail is handled correctly. Internally, though, their IT environment hadn't gotten the same attention. Email was unmanaged, documents lived locally, and there was no proactive monitoring or endpoint security in place. For a business that handles sensitive client relationships across jewelers, banks, and pharmaceutical operators, that's a gap worth closing.",
  },
  solution: {
    headline: "A Properly Managed Environment to Match a High-Trust Business",
    body: "SeedTech migrated Megasafe to Microsoft 365 — moving email and documents off local and legacy systems and onto a cloud-based platform that's properly configured, backed up, and accessible. We enrolled all endpoints in NinjaOne for 24/7 monitoring and deployed SentinelOne for AI-driven endpoint security across the environment. Under SeedCare Plus, the team also has access to unlimited helpdesk support and unlimited IT advisory — meaning when a question comes up, there's someone to call who actually knows their environment. The engagement also builds on SeedTech's existing work as Megasafe's website partner. Having one trusted technology partner across both the external-facing site and the internal IT environment means fewer vendors, cleaner accountability, and a team that already understands the business.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "0", label: "Migration Downtime" },
    { value: "24/7", label: "Proactive Monitoring" },
    { value: "∞", label: "Helpdesk — No Ticket Caps" },
    { value: "2", label: "Technology Partnerships" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Cloud,
      title: "Microsoft 365 Migration",
      body: "Full migration of email and documents to Microsoft 365 — configured correctly from the start, with proper account setup, data transfer, and no disruption to the team's daily workflow.",
    },
    {
      icon: Monitor,
      title: "Managed IT Support (SeedCare Plus)",
      body: "Ongoing SeedCare Plus coverage — unlimited helpdesk support, unlimited IT advisory, 24/7 monitoring and alerts, and patch management across all endpoints.",
    },
    {
      icon: Shield,
      title: "Endpoint Security (SentinelOne)",
      body: "AI-driven threat protection deployed across all endpoints — real-time defense against ransomware, malware, and other threats with automatic isolation when something is detected.",
    },
    {
      icon: HardDrive,
      title: "Cloud Document Management",
      body: "Microsoft 365 configured for cloud-based file access and storage — replacing local-only documents with a secure, backed-up, accessible alternative.",
    },
    {
      icon: Globe,
      title: "Website (SeedTech Web Team)",
      body: "Megasafe's public-facing website designed, built, and maintained by SeedTech — a separate engagement that forms the foundation of an ongoing, full-service technology partnership.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Assessment",
      description:
        "SeedTech reviewed Megasafe's existing environment — email setup, file storage, hardware, and the gaps in monitoring and security. With a clear picture of what was in place and what was missing, we scoped the work.",
    },
    {
      step: "02",
      title: "Microsoft 365 Migration",
      description:
        "We migrated email accounts and documents to Microsoft 365, configuring everything properly and ensuring the cutover went smoothly. The team was up and running on the new platform without losing a day of work.",
    },
    {
      step: "03",
      title: "Managed Coverage",
      description:
        "Endpoints were enrolled in NinjaOne, SentinelOne was deployed, and Megasafe was brought onto SeedCare Plus — 24/7 monitoring, security, and helpdesk support all active from that point forward.",
    },
    {
      step: "04",
      title: "Ongoing Partnership",
      description:
        "SeedTech continues to manage both Megasafe's IT environment and their website — handling support, monitoring, and advisory as the business grows and their technology needs evolve.",
    },
  ],
};
