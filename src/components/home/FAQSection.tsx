"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { homepageFAQs } from "@/data/faqs";
import { AnimatedH2 } from "@/components/kit";

/* ── Accordion Item ── */
function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "border-b border-white/[0.06] last:border-b-0"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-start justify-between gap-4 w-full py-6 text-left group"
        aria-expanded={open}
      >
        <span
          className={cn(
            "text-[15px] md:text-base font-medium leading-snug transition-colors duration-200",
            open ? "text-white" : "text-white/70 group-hover:text-white"
          )}
        >
          {question}
        </span>
        <span
          className={cn(
            "mt-0.5 shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200",
            open
              ? "bg-seed-500/20 text-seed-400"
              : "bg-white/[0.04] text-white/30 group-hover:bg-white/[0.08] group-hover:text-white/50"
          )}
        >
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm md:text-[15px] text-white/50 leading-relaxed max-w-3xl space-y-3">
              {answer.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Section ── */
export function FAQSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-dark-base">
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-seed-500 text-eyebrow uppercase tracking-widest mb-3">
            FAQ
          </p>
          <AnimatedH2 className="font-display text-heading md:text-heading-lg text-white leading-[1.1]">
            Frequently Asked Questions
          </AnimatedH2>
          <p className="mt-4 text-white/40 text-body-lg max-w-xl mx-auto">
            Questions most people consider when discussing our services
          </p>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] px-6 md:px-8">
          {homepageFAQs.map((faq, i) => (
            <FAQItem key={i} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
