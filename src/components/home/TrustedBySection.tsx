"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, X, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { reviews, type Review } from "@/data/reviews";
import Link from "next/link";
import { AnimatedH2 } from "@/components/kit";

/* ── Logo clients (scrolling row) ── */
const clientLogos = [
  "StarCom Fiber",
  "Drew & Rogers",
  "BioOx",
  "PaddlersCove",
  "Megasafe",
  "Mesa",
  "Vick Tipnes Enterprises",
  "Blackstone Medical Services",
  "Ron White",
  "Trevor Noah",
  "Kevin James",
  "Hiler Trucking",
  "Eastside Bulk",
  "Carla Marie & Anthony Show",
  "Fine Indian Dining Group",
];

/* Double them for seamless loop */
const doubledLogos = [...clientLogos, ...clientLogos];

const TRUNCATE_LENGTH = 180;

/* ── Star rating ── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < count ? "text-amber-400 fill-amber-400" : "text-white/10"
          )}
        />
      ))}
    </div>
  );
}

/* ── Review Card ── */
function ReviewCard({
  review,
  onReadMore,
}: {
  review: Review;
  onReadMore: (review: Review) => void;
}) {
  const needsTruncation = review.text.length > TRUNCATE_LENGTH;
  const displayText = needsTruncation
    ? review.text.slice(0, TRUNCATE_LENGTH).replace(/\s+\S*$/, "") + "..."
    : review.text;

  return (
    <div
      className={cn(
        "shrink-0 w-[320px] md:w-[380px] mx-2 p-6 rounded-2xl",
        "bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm",
        "flex flex-col gap-4 transition-all duration-300",
        "hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1",
        needsTruncation && "cursor-pointer"
      )}
      onClick={() => needsTruncation && onReadMore(review)}
    >
      <div className="flex items-center justify-between">
        <Stars count={review.rating} />
        <Quote className="w-5 h-5 text-seed-400/30" />
      </div>

      <p className="text-sm text-white/70 leading-relaxed flex-1">
        &ldquo;{displayText}&rdquo;
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.06]">
        <div>
          <p className="text-sm font-medium text-white/80">{review.author}</p>
          {review.role && (
            <p className="text-xs text-white/30">{review.role}</p>
          )}
        </div>
        {needsTruncation && (
          <button className="flex items-center gap-1 text-xs text-seed-400 hover:text-seed-300 transition-colors group">
            Read more
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
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
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
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
        <Stars count={review.rating} />

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

/* ── Pause-on-hover auto-scrolling container ── */
function AutoScrollRow({
  children,
  direction = "left",
  speed = 40,
  className,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame: number;
    let pos = direction === "left" ? 0 : el.scrollWidth / 2;

    const step = () => {
      if (!pausedRef.current && el) {
        pos += direction === "left" ? 0.5 : -0.5;
        // Reset to create seamless loop
        const half = el.scrollWidth / 2;
        if (direction === "left" && pos >= half) pos = 0;
        if (direction === "right" && pos <= 0) pos = half;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [direction, speed]);

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="flex w-max">{children}</div>
    </div>
  );
}

/* ── Main Section ── */
export function TrustedBySection() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleClose = useCallback(() => setSelectedReview(null), []);

  /* Double reviews for seamless loop */
  const doubledReviews = [...reviews, ...reviews];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-dark-base">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl px-6 text-center mb-16">
          <AnimatedH2
            className="font-display text-heading md:text-heading-lg text-white leading-[1.1]"
            highlightWords={["Brands"]}
          >
            Infrastructure Trusted by Brands
          </AnimatedH2>
          <p className="mt-5 text-body-lg text-white/50 leading-relaxed">
            SeedTech has powered IT &amp; Website infrastructures for numerous
            businesses — small to large
          </p>
        </div>

        {/* Logo marquee — edge-blurred */}
        <div className="relative mb-8">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-r from-dark-base to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-l from-dark-base to-transparent pointer-events-none" />

          <AutoScrollRow direction="left" speed={35}>
            {doubledLogos.map((name, i) => (
              <div
                key={`logo-${i}`}
                className="mx-2 shrink-0 flex items-center justify-center px-8 py-4 rounded-xl border border-white/[0.06] bg-dark-elevated/50"
              >
                <span className="text-sm font-semibold text-white/25 tracking-wide whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </AutoScrollRow>
        </div>

        {/* Review cards marquee — edge-blurred, opposite direction */}
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-r from-dark-base to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-l from-dark-base to-transparent pointer-events-none" />

          <AutoScrollRow direction="right" speed={30}>
            {doubledReviews.map((review, i) => (
              <ReviewCard
                key={`${review.id}-${i}`}
                review={review}
                onReadMore={setSelectedReview}
              />
            ))}
          </AutoScrollRow>
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm text-seed-400 hover:text-seed-300 transition-colors group"
          >
            View all reviews
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {selectedReview && (
          <ReviewModal review={selectedReview} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
