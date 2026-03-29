import {
  Monitor,
  Shield,
  Cloud,
  Headphones,
} from "lucide-react";

export const kellyPlumbingHeatingData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "A Trades Business That Needed IT to Keep Up",
    body: "Kelly Plumbing & Heating had been with another IT provider, but the relationship wasn't working. Response times were inconsistent, and for a company that starts dispatching technicians early in the morning and runs on tight scheduling all day, “we'll get to it” isn't a viable answer. Their day starts before most businesses are open, and their IT needed to be ready to match that pace. They came to SeedTech looking for a provider that would actually treat their business like a priority.",
  },
  solution: {
    headline: "Responsive, Proactive IT That Keeps the Office Moving",
    body: "SeedTech transitioned Kelly Plumbing & Heating onto SeedCare Plus with a clean handoff from their previous provider — no gap in coverage, no dropped issues, no day-one scramble. We enrolled all endpoints in NinjaOne for 24/7 monitoring, deployed SentinelOne across every machine, and made sure Microsoft 365 was properly configured for a team that depends on scheduling, estimates, and job coordination. Under SeedCare Plus, the team gets unlimited helpdesk support and unlimited IT advisory — meaning when something goes wrong at 7am, there's someone to call who already knows their environment.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "0", label: "Coverage Gaps During Transition" },
    { value: "24/7", label: "Proactive Monitoring" },
    { value: "∞", label: "Helpdesk — No Ticket Caps" },
    { value: "1988", label: "In Business Since" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Monitor,
      title: "Managed IT Support (SeedCare Plus)",
      body: "Full SeedCare Plus coverage — unlimited helpdesk support, unlimited IT advisory, 24/7 monitoring and alerts, and patch management across all endpoints, with no ticket caps and no waiting.",
    },
    {
      icon: Cloud,
      title: "Microsoft 365 Management",
      body: "Microsoft 365 configured and managed across the team — email, cloud document access, and ongoing license and account administration handled by SeedTech.",
    },
    {
      icon: Shield,
      title: "Endpoint Security (SentinelOne)",
      body: "AI-driven antivirus and threat protection deployed across all endpoints — proactive ransomware and malware defense with real-time threat isolation and automatic response.",
    },
    {
      icon: Headphones,
      title: "24/7 Proactive Monitoring",
      body: "NinjaOne running continuously across all endpoints — watching for issues, generating alerts, and making sure the team's IT environment doesn't wait for something to break before it gets attention.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Assessment & Transition Planning",
      description:
        "SeedTech reviewed Kelly Plumbing & Heating's environment and coordinated a clean handoff from their previous provider — making sure nothing was dropped and coverage stayed continuous through the switch.",
    },
    {
      step: "02",
      title: "Onboarding & Deployment",
      description:
        "Endpoints were enrolled in NinjaOne, SentinelOne was deployed, and Microsoft 365 was reviewed and properly configured. Full SeedCare Plus coverage went active from day one with no gaps.",
    },
    {
      step: "03",
      title: "Stabilization",
      description:
        "SeedTech addressed any outstanding issues in the environment, established a clean baseline, and made sure the team had a helpdesk they could actually rely on from the first week.",
    },
    {
      step: "04",
      title: "Ongoing Partnership",
      description:
        "SeedTech manages Kelly Plumbing & Heating's IT environment on an ongoing basis — monitoring continuously, responding quickly, and handling support the same way they handle their own customers' calls.",
    },
  ],
};
