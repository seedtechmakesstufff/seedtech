"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Ticket,
  X,
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
  BookingOption,
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

const cardClass = (opt: BookingOption) =>
  cn(
    "group relative flex flex-col gap-5 rounded-2xl p-6 text-left",
    "bg-dark-elevated border border-white/[0.07]",
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
    accentHoverBorder[opt.accent]
  );

/* Shared card face — identical for link cards and ticket-gated cards. */
function CardFace({ opt }: { opt: BookingOption }) {
  return (
    <>
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
        <h3 className="font-display text-card-title text-white">{opt.title}</h3>
        <p className="mt-2 text-body-sm leading-relaxed text-white/50">
          {opt.description}
        </p>
        {opt.requiresTicket && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-blue/90">
            <Ticket className="h-3.5 w-3.5" aria-hidden />
            Requires an open ticket number
          </span>
        )}
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
        Book this appointment
      </span>
    </>
  );
}

export function BookingGrid({ groups }: { groups: BookingGroup[] }) {
  // The support option currently being booked through the ticket gate.
  const [ticketOpt, setTicketOpt] = useState<BookingOption | null>(null);
  const [ticketValue, setTicketValue] = useState("");

  const closeTicket = () => {
    setTicketOpt(null);
    setTicketValue("");
  };

  const proceed = () => {
    if (!ticketOpt || !ticketValue.trim()) return;
    window.open(ticketOpt.url, "_blank", "noopener,noreferrer");
    closeTicket();
  };

  // Esc to close + lock body scroll while the gate is open.
  useEffect(() => {
    if (!ticketOpt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTicket();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [ticketOpt]);

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
            {group.options.map((opt) =>
              opt.requiresTicket ? (
                <motion.button
                  key={opt.id}
                  type="button"
                  data-booking={opt.id}
                  variants={fadeUp}
                  onClick={() => {
                    setTicketValue("");
                    setTicketOpt(opt);
                  }}
                  className={cn(cardClass(opt), "w-full")}
                >
                  <CardFace opt={opt} />
                </motion.button>
              ) : (
                <motion.a
                  key={opt.id}
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-booking={opt.id}
                  variants={fadeUp}
                  className={cardClass(opt)}
                >
                  <CardFace opt={opt} />
                </motion.a>
              )
            )}
          </motion.div>
        </section>
      ))}

      {/* ── Ticket gate ── */}
      {ticketOpt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ticket-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeTicket}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-dark-elevated p-6 shadow-elevated">
            <button
              type="button"
              onClick={closeTicket}
              aria-label="Close"
              className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <IconBox
                icon={iconMap[ticketOpt.icon]}
                variant="soft-dark"
                size="md"
                className="text-brand-blue"
              />
              <div>
                <h3
                  id="ticket-modal-title"
                  className="font-display text-card-title text-white"
                >
                  {ticketOpt.title}
                </h3>
                <p className="text-body-sm text-white/45">
                  Existing support ticket required
                </p>
              </div>
            </div>

            <p className="mt-4 text-body-sm leading-relaxed text-white/55">
              Enter your support ticket number to continue to scheduling. Don&apos;t
              have one yet? Call{" "}
              <a
                href="tel:+12016209002"
                className="font-medium text-white/80 hover:text-white"
              >
                (201) 620-9002
              </a>{" "}
              and we&apos;ll open one.
            </p>

            <label
              htmlFor="ticket-number"
              className="mt-5 block text-eyebrow uppercase tracking-widest text-white/40"
            >
              Ticket number
            </label>
            <input
              id="ticket-number"
              autoFocus
              value={ticketValue}
              onChange={(e) => setTicketValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") proceed();
              }}
              placeholder="e.g. ST-10432"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-blue/50"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeTicket}
                className="flex-1 rounded-xl border border-white/[0.12] px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceed}
                disabled={!ticketValue.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-glowSeed disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
              >
                Continue to booking
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <p className="mt-3 text-[12px] text-white/35">
              Please include this ticket number in the appointment notes when you
              book.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
