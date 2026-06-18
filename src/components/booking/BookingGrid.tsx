"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Ticket,
  X,
  Loader2,
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

/* Map a validation response to a human message for the gate. */
function ticketErrorMessage(status: number, reason?: string): string {
  if (status === 429 || reason === "rate_limited")
    return "Too many attempts — please wait a minute and try again.";
  if (reason === "not_open")
    return "That ticket is already closed. Open a new ticket to book support.";
  if (reason === "error")
    return "We couldn't verify your ticket right now — please try again in a moment.";
  // not_found / bad_request / anything else
  return "We couldn't find an open ticket with that number. Double-check it and try again.";
}

export function BookingGrid({ groups }: { groups: BookingGroup[] }) {
  // The support option currently being booked through the ticket gate.
  const [ticketOpt, setTicketOpt] = useState<BookingOption | null>(null);
  const [ticketValue, setTicketValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeTicket = () => {
    setTicketOpt(null);
    setTicketValue("");
    setChecking(false);
    setError(null);
  };

  // Verify the ticket number against the helpdesk before sending the visitor to
  // the calendar. On success we navigate in the same tab (no popup-blocker
  // surprises after the async check); on failure we show an inline message.
  const proceed = async () => {
    if (!ticketOpt || !ticketValue.trim() || checking) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber: ticketValue.trim() }),
      });
      const data = (await res.json().catch(() => null)) as
        | { valid?: boolean; reason?: string }
        | null;

      if (data?.valid) {
        window.location.href = ticketOpt.url; // navigating away; keep spinner
        return;
      }
      setError(ticketErrorMessage(res.status, data?.reason));
    } catch {
      setError(
        "We couldn't verify your ticket right now — please try again in a moment."
      );
    }
    setChecking(false); // only reached on failure (success returns above)
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
                    setError(null);
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
              Enter your support ticket number to continue to scheduling.
              Don&apos;t have a ticket yet? Open one at{" "}
              <a
                href="https://helpdesk.seedtechllc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-blue transition-colors hover:text-brand-blue/80"
              >
                helpdesk.seedtechllc.com
              </a>
              .
            </p>

            <label
              htmlFor="ticket-number"
              className="mt-5 block text-eyebrow uppercase tracking-widest text-white/40"
            >
              Ticket number
            </label>
            <div
              className={cn(
                "mt-2 flex items-center rounded-xl border bg-white/[0.04] transition-colors focus-within:border-brand-blue/50",
                error
                  ? "border-red-500/60 focus-within:border-red-500/60"
                  : "border-white/10"
              )}
            >
              <span className="select-none pl-4 pr-1 font-medium text-white/40">
                TKT-
              </span>
              <input
                id="ticket-number"
                autoFocus
                inputMode="numeric"
                value={ticketValue}
                onChange={(e) => {
                  setTicketValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") proceed();
                }}
                placeholder="000862"
                aria-invalid={!!error}
                className="w-full flex-1 bg-transparent py-3 pr-4 text-white placeholder:text-white/30 outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="mt-3 text-body-sm text-red-400">
                {error}
              </p>
            )}

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
                disabled={!ticketValue.trim() || checking}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-glowSeed disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
              >
                {checking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Checking…
                  </>
                ) : (
                  <>
                    Continue to booking
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </>
                )}
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
