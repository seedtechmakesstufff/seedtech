import {
  Monitor,
  Cloud,
  Phone,
  Wifi,
  Laptop,
} from "lucide-react";

export const westShoreMarineData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "A New Location That Needed to Be Ready on Day One",
    body: "Taking over an existing business location means inheriting its infrastructure — or lack thereof. The West Shore Marine acquisition came with a new building, new service needs, and the immediate pressure of getting everything operational before customers started calling. That included standing up internet service with a new ISP, provisioning new office hardware, and porting the previous owner's phone number so there was no gap in customer reachability. There was no margin for a slow rollout. A marina that can't answer its phones or process work orders from day one loses business fast.",
  },
  solution: {
    headline: "Full Technology Buildout for a New Marina Location",
    body: "SeedTech managed the entire technology setup for the West Shore Marine location end to end. We coordinated new internet service through Optimum Business, provisioned three new office PCs and a shop laptop used for ECU diagnostics and boat computer configuration, and deployed Dialpad as the business phone system — complete with a custom call menu and intelligent call routing. Critically, we successfully migrated the previous owner's existing phone number over to Dialpad, ensuring customers could reach West Shore Marine on the same number they already knew. Google Workspace was extended from South Shore Marine to cover the new location as well, keeping both businesses running on a unified platform. All endpoints were brought under SeedTech's managed services coverage from day one.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "Day 1", label: "Fully Operational" },
    { value: "2", label: "Locations Unified" },
    { value: "0", label: "Dropped Calls During Transition" },
    { value: "24/7", label: "Proactive Monitoring" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Wifi,
      title: "ISP Coordination & Internet Setup",
      body: "SeedTech worked directly with Optimum Business to establish new internet service at the West Shore Marine location — handling the coordination so the owners didn't have to.",
    },
    {
      icon: Laptop,
      title: "Hardware Provisioning",
      body: "Three new office PCs and a dedicated shop laptop configured and deployed — the shop laptop set up specifically for ECU diagnostics and boat computer configuration in the service department.",
    },
    {
      icon: Phone,
      title: "Dialpad VoIP Phone System",
      body: "Full Dialpad deployment with a custom call menu, call routing, and voicemail configuration — giving West Shore Marine a professional phone presence from day one.",
    },
    {
      icon: Phone,
      title: "Phone Number Migration",
      body: "Successful porting of the previous owner's existing business phone number to Dialpad — ensuring zero disruption to customer reachability during the ownership transition.",
    },
    {
      icon: Cloud,
      title: "Google Workspace Extension",
      body: "Google Workspace extended from South Shore Marine to cover West Shore Marine — keeping both locations on a unified email and collaboration platform under the same ownership.",
    },
    {
      icon: Monitor,
      title: "Managed IT Coverage",
      body: "All endpoints enrolled in NinjaOne with SeedCare Essentials coverage — 24/7 monitoring, SentinelOne security, patch management, and unlimited business-hours helpdesk support.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Planning",
      description:
        "As soon as the acquisition was confirmed, SeedTech assessed what the new location would need — internet, hardware, phones, and how to integrate it with the existing South Shore Marine environment. We mapped out the full scope before anything was ordered or installed.",
    },
    {
      step: "02",
      title: "ISP & Infrastructure",
      description:
        "We coordinated with Optimum Business to establish internet service at the new location, then configured the network environment to support the office and service department operations.",
    },
    {
      step: "03",
      title: "Hardware & Phone System",
      description:
        "Office PCs and the shop laptop were provisioned and deployed. Dialpad was configured with a custom call menu and routing, and the previous owner's phone number was successfully ported — keeping the business reachable without interruption.",
    },
    {
      step: "04",
      title: "Managed Coverage & Handoff",
      description:
        "All endpoints were enrolled in NinjaOne and brought under SeedCare Essentials. Google Workspace was extended to cover the new location, and the team was walked through everything before going live.",
    },
  ],
};
