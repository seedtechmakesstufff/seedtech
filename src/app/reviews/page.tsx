"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X } from "lucide-react";
import {
  GradientOrb,
  GridPattern,
  CTABanner,
  LiquidGlassPill,
  AnimatedH1,
} from "@/components/kit";
import { Section } from "@/components/layout/Section";
import { reviews, type Review } from "@/data/reviews";
import { cn } from "@/lib/utils";

/* ── Stars ── */
function Stars({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  const sizeClass = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < count ? "text-amber-400 fill-amber-400" : "text-white/10"
          )}
        />
      ))}
    </div>
  );
}

/* ── Full Review Card ── */
function FullReviewCard({
  review,
  index,
  onSelect,
}: {
  review: Review;
  index: number;
  onSelect: (review: Review) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(review)}
      className={cn(
        "group relative p-6 rounded-2xl cursor-pointer",
        "bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm",
        "transition-all duration-300",
        "hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1 hover:shadow-lg hover:shadow-seed-500/5"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <Stars count={review.rating} />
        <Quote className="w-5 h-5 text-seed-400/30 group-hover:text-seed-400/50 transition-colors" />
      </div>

      <p className="text-[15px] text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{review.author}</p>
          {review.role && (
            <p className="text-xs text-white/30 mt-0.5">{review.role}</p>
          )}
        </div>
        {review.source && (
          <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">
            {review.source}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── Review Modal ── */
function ReviewModal({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-dark-elevated border border-white/[0.08] rounded-2xl p-8 shadow-2xl"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <Quote className="w-8 h-8 text-seed-400/40 mb-4" />
        <Stars count={review.rating} size="md" />

        <p className="mt-4 text-white/80 leading-relaxed text-[15px]">
          &ldquo;{review.text}&rdquo;
        </p>

        <div className="mt-6 pt-4 border-t border-white/[0.06]">
          <p className="text-sm font-medium text-white/80">{review.author}</p>
          {review.role && (
            <p className="text-xs text-white/40 mt-0.5">{review.role}</p>
          )}
          {review.source && (
            <p className="text-xs text-white/20 mt-1 capitalize">
              via {review.source}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Page ── */
export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const handleClose = useCallback(() => setSelectedReview(null), []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-24 text-center">
        <GradientOrb
          color="seed"
          size="xl"
          className="-top-40 left-1/2 -translate-x-1/2 opacity-20"
        />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <LiquidGlassPill variant="seed" className="mb-4">
            Client Reviews
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Say"]}>
            What Our Clients Say
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/60 max-w-2xl mx-auto">
            Real feedback from real businesses we&apos;ve helped grow with
            custom web development, managed IT, and digital infrastructure.
          </p>
        </div>
      </section>

      {/* Stats + Grid */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <FullReviewCard
              key={review.id}
              review={review}
              index={i}
              onSelect={setSelectedReview}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Ready to Work With Us?"
        description="Join the growing list of businesses we've helped succeed."
        primaryLabel="Get a Free Consultation"
        primaryHref="/free-audit"
        secondaryLabel="View Our Work"
        secondaryHref="/our-work"
      />

      {/* Modal */}
      <AnimatePresence>
        {selectedReview && (
          <ReviewModal review={selectedReview} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
