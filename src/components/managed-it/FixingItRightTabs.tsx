"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    step: "01",
    label: "Get Your Team Moving",
    summary: "We start by helping your team get moving again as quickly as possible.",
    detail:
      "When something breaks, the first priority is restoring your team's ability to work. We triage the issue, communicate clearly, and move fast so disruption stays minimal.",
    values: [
      "Faster recovery when issues happen",
      "Clear communication during an incident",
      "Minimal disruption to your team",
      "More confidence in your IT environment",
    ],
  },
  {
    step: "02",
    label: "Look Deeper",
    summary:
      "Then we look deeper — reviewing device health, configuration, documentation, user setup, security settings, vendor issues, or bigger gaps in process.",
    detail:
      "A surface fix is often not enough. We dig into root causes so we understand what actually went wrong — and what needs to change.",
    values: [
      "Root cause analysis, not just quick patches",
      "Fewer recurring problems",
      "Better visibility into your environment",
      "Documentation improved along the way",
    ],
  },
  {
    step: "03",
    label: "Build a Better Foundation",
    summary:
      "Whenever possible, we recommend or implement a more reliable long-term solution — not just a temporary fix.",
    detail:
      "Not every issue can be caught ahead of time. Hardware fails. Vendors have outages. But when something cannot be prevented, we work to understand what happened and put better safeguards in place so it is less likely to happen again. SeedTech uses monitoring, maintenance, patching, security tools, and automation to keep systems healthy in the background — and when we can prevent it, we do.",
    values: [
      "Better stability over time",
      "Proactive monitoring running in the background",
      "Fewer surprises for your team",
      "A support experience that improves over time",
    ],
  },
];

export function FixingItRightTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
      {/* Left — tab list */}
      <div className="flex flex-row lg:flex-col gap-3 lg:w-72 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "flex items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-200 shrink-0 lg:shrink w-[72vw] sm:w-auto",
              active === i
                ? "border-seed-500/40 bg-seed-500/10 text-white"
                : "border-white/[0.07] bg-white/[0.02] text-white/50 hover:border-white/[0.14] hover:text-white/75"
            )}
          >
            <span
              className={cn(
                "font-display text-xl leading-none mt-0.5 shrink-0 transition-colors",
                active === i ? "text-seed-400" : "text-white/20"
              )}
            >
              {tab.step}
            </span>
            <span className="text-sm font-medium leading-snug">{tab.label}</span>
            {active === i && (
              <ChevronRight className="ml-auto h-4 w-4 text-seed-400 shrink-0 hidden lg:block" />
            )}
          </button>
        ))}
      </div>

      {/* Right — content panel */}
      <div className="flex-1 min-h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 md:p-9 h-full flex flex-col gap-6">
              {/* Summary */}
              <p className="text-body-lg leading-relaxed text-light-base/80">
                {tabs[active].summary}
              </p>
              {/* Detail */}
              <p className="text-body leading-relaxed text-light-base/50">
                {tabs[active].detail}
              </p>
              {/* Value cards */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                {tabs[active].values.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-seed-500/15 bg-white/[0.03] px-4 py-3.5 text-sm text-light-base/70"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-seed-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
