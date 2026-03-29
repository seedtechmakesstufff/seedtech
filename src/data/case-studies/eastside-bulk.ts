import {
  Server,
  Shield,
  Cloud,
  Wifi,
  Monitor,
  HardDrive,
} from "lucide-react";

export const eastsideBulkData = {
  /* ── Challenge & Solution ───────────────────────────────── */
  challenge: {
    headline: "No Infrastructure. No Backups. No Safety Net.",
    body: "When Eastside Bulk came to SeedTech, they were running a growing trucking and wholesale operation with essentially no IT foundation in place. There was no managed support, no data backup, and no formal infrastructure — just a business scaling fast and hoping nothing went wrong. The stakes were high. Eastside Bulk relies on QuickBooks for their financials and day-to-day operations, and their office experiences frequent power outages — creating constant risk of data corruption, hardware failure, and unplanned downtime. Without backups, a single bad event could have meant permanent data loss. Without a technology partner, there was no one working proactively to prevent it.",
  },
  solution: {
    headline: "Full IT Buildout + Proactive Managed Support",
    body: "SeedTech stepped in as Eastside Bulk's dedicated IT partner and built their environment from the ground up. We deployed a physical on-site Windows server with file and folder backup, established Microsoft 365 across all users, and took over management of their entire workstation fleet — all under SeedTech's managed services plan, giving the team unlimited business-hours helpdesk support and 24/7 proactive monitoring. To address the power outage risk directly, we placed the server on a UPS and configured automatic reboot recovery — so when the power goes out, the system comes back online on its own. For WiFi, we moved to HPE Aruba's cloud management platform for remote visibility, alerting, and monitoring. The result is an environment built to absorb disruption and keep the business running.",
  },

  /* ── Sidebar Meta ───────────────────────────────────────── */
  timeline: "Ongoing since 2017",
  teamSize: "SeedTech Team",

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { value: "2017", label: "Partnership Started" },
    { value: "100%", label: "Endpoint Coverage" },
    { value: "0", label: "Data Loss Events" },
    { value: "24/7", label: "Proactive Monitoring" },
  ],

  /* ── Deliverables ───────────────────────────────────────── */
  deliverables: [
    {
      icon: Monitor,
      title: "Managed IT Support",
      body: "Ongoing managed services coverage across all endpoints — unlimited business-hours helpdesk, proactive monitoring, patch management, and a dedicated point of contact for every IT need.",
    },
    {
      icon: Server,
      title: "On-Site Server Deployment",
      body: "Physical Windows server deployed and managed on-site, serving as the central file repository with full backup managed through NinjaOne.",
    },
    {
      icon: Shield,
      title: "UPS & Power Recovery Automation",
      body: "Server placed on a UPS with automatic reboot configuration — ensuring clean, independent recovery after power loss events without requiring manual intervention.",
    },
    {
      icon: Cloud,
      title: "Microsoft 365 Setup & Management",
      body: "Full M365 deployment across all users, including account provisioning, license management, and ongoing administration.",
    },
    {
      icon: HardDrive,
      title: "QuickBooks Data Recovery",
      body: "Multiple successful recoveries performed over the course of the engagement — protecting critical financial data from corruption and power-loss-related failures.",
    },
    {
      icon: Wifi,
      title: "WiFi Infrastructure (HPE Aruba)",
      body: "WiFi environment managed through HPE Aruba's cloud platform with remote visibility, alerting, and monitoring across the office.",
    },
  ],

  /* ── Process ────────────────────────────────────────────── */
  process: [
    {
      step: "01",
      title: "Discovery & Assessment",
      description:
        "We documented Eastside Bulk's existing hardware, user accounts, and the complete absence of backup or IT management infrastructure. Power outage risk and QuickBooks exposure were identified as immediate priorities.",
    },
    {
      step: "02",
      title: "Infrastructure Buildout",
      description:
        "We deployed the on-site server, configured file and folder backup, set up UPS hardware with automatic reboot, and enrolled all workstations into NinjaOne. Microsoft 365 was provisioned across all users during this phase.",
    },
    {
      step: "03",
      title: "Stabilization & Coverage",
      description:
        "With the foundation in place, Eastside Bulk transitioned to ongoing managed support. WiFi infrastructure was established and later migrated to HPE Aruba for improved remote management and visibility.",
    },
    {
      step: "04",
      title: "Ongoing Partnership",
      description:
        "SeedTech has remained Eastside Bulk's IT partner for nearly a decade — handling helpdesk requests, responding to incidents, performing recoveries, and continuously maintaining the environment as the business grows.",
    },
  ],
};
