"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  Ruler,
  Wrench,
  Laptop,
  HardDrive,
  Moon,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconBox } from "@/components/kit";
import type {
  BookingAccent,
  BookingGroup,
  BookingIconKey,
} from "@/app/booking/booking-options";

/* Resolve the serializable icon key (from the data module) to a Lucide icon. */
const iconMap: Record<BookingIconKey, LucideIcon> = {
  compass: Compass,
  ruler: Ruler,
  wrench: Wrench,
  laptop: Laptop,
  "hard-drive": HardDrive,
  moon: Moon,
  "clipboard-check": ClipboardCheck,
};

/* Accent → icon + hover-border colors, kept in one place so groups stay coherent. */
const accentIconClass: Record<BookingAccent, string> = {
  seed: "text-seed-400",
  blue: "text-brand-blue",
  cyan: "text-brand-cyan",
  emerald: "text-brand-emerald",
};

const accentHoverBorder: Record<BookingAccent, string> = {
  seed: "hover:border-seed-500/40",
  blue: "hover:border-brand-blue/40",
  cyan: "hover:border-brand-cyan/40",
  emerald: "hover:border-brand-emerald/40",
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function BookingGrid({ groups }: { groups: BookingGroup[] }) {
  return (
    <div className="flex flex-col gap-16">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <div className="mb-6">
            <h2
              id={`group-${group.id}`}
              className="font-display text-heading text-white"
            >
              {group.label}
            </h2>
            <p className="mt-1 text-body-sm text-white/45">{group.description}</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {group.options.map((opt) => (
              <motion.a
                key={opt.id}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                data-booking={opt.id}
                variants={fadeUp}
                className={cn(
                  "group relative flex flex-col gap-5 rounded-2xl p-6",
                  "bg-dark-elevated border border-white/[0.07]",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
                  accentHoverBorder[opt.accent]
                )}
              >
                <div className="flex items-start justify-between">
                  <IconBox
                    icon={iconMap[opt.icon]}
                    variant="soft-dark"
                    size="lg"
                    className={accentIconClass[opt.accent]}
                  />
                  <ArrowUpRight
                    className="h-5 w-5 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden
                  />
                </div>

                <div>
                  <h3 className="font-display text-card-title text-white">
                    {opt.title}
                  </h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-white/50">
                    {opt.description}
                  </p>
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                  Book this appointment
                </span>
              </motion.a>
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
