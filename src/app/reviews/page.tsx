"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X, MonitorSmartphone, Rocket, ShoppingCart, SquareTerminal, ArrowRight, ExternalLink } from "lucide-react";
import {
    GradientOrb,
    GridPattern,
    LiquidGlassPill,
    AnimatedH1,
} from "@/components/kit";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { reviews as staticReviews, type Review } from "@/data/reviews";
import { cn } from "@/lib/utils";

/* ── Extended Review type for Google API data ── */
interface GoogleReview extends Review {
    relativeTime?: string;
    profilePhoto?: string;
    profileUrl?: string;
}

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
    review: GoogleReview;
    index: number;
    onSelect: (review: GoogleReview) => void;
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
                        <div className="flex items-center gap-2">
                          {review.relativeTime && (
                              <span className="text-[10px] text-white/20">{review.relativeTime}</span>
                                  )}
                                  <Quote className="w-5 h-5 text-seed-400/30 group-hover:text-seed-400/50 transition-colors" />
                        </div>
                </div>
                <p className="text-[15px] text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                        &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {review.profilePhoto && (
                              <img
                                              src={review.profilePhoto}
                                              alt={review.author}
                                              className="w-8 h-8 rounded-full object-cover opacity-70"
                                            />
                            )}
                                  <div>
                                              <p className="text-sm font-medium text-white/80">{review.author}</p>
                                    {review.role && (
                                <p className="text-xs text-white/30 mt-0.5">{review.role}</p>
                                              )}
                                  </div>
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
    review: GoogleReview;
    onClose: () => void;
}) {
    return (
          <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
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
                                  <div className="flex items-center gap-3">
                                    {review.profilePhoto && (
                                        <img
                                                          src={review.profilePhoto}
                                                          alt={review.author}
                                                          className="w-10 h-10 rounded-full object-cover opacity-70"
                                                        />
                                      )}
                                              <div>
                                                            <p className="text-sm font-medium text-white/80">{review.author}</p>
                                                {review.role && (
                                          <p className="text-xs text-white/40 mt-0.5">{review.role}</p>
                                                            )}
                                                {review.relativeTime && (
                                          <p className="text-xs text-white/20 mt-0.5">{review.relativeTime}</p>
                                                            )}
                                              </div>
                                  </div>
                          {review.source && (
                                      <div className="flex items-center justify-between mt-3">
                                                    <p className="text-xs text-white/20 capitalize">
                                                                    via {review.source}
                                                    </p>
                                        {review.profileUrl && (
                                                        <a
                                                                            href={review.profileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-1 text-xs text-seed-400/50 hover:text-seed-400 transition-colors"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                          >
                                                                          View on Google <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                      </div>
                                  )}
                        </div>
                </motion.div>
          </motion.div>
        );
}

/* ── Loading Skeleton ── */
function ReviewSkeleton({ index }: { index: number }) {
    return (
          <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse"
                >
                <div className="flex justify-between mb-4">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="w-3.5 h-3.5 rounded bg-white/10" />
                            ))}
                        </div>
                        <div className="w-5 h-5 rounded bg-white/5" />
                </div>
                <div className="space-y-2 mb-5">
                        <div className="h-3 bg-white/10 rounded w-full" />
                        <div className="h-3 bg-white/10 rounded w-5/6" />
                        <div className="h-3 bg-white/10 rounded w-4/6" />
                </div>
                <div className="pt-4 border-t border-white/[0.05] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="h-3 bg-white/10 rounded w-24" />
                </div>
          </motion.div>
        );
}

/* ── Stats Bar ── */
function StatsBar({ totalRating, totalReviews }: { totalRating?: number; totalReviews?: number }) {
    if (!totalRating && !totalReviews) return null;
    return (
          <div className="flex items-center justify-center gap-6 mb-10 py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit mx-auto">
            {totalRating && (
                    <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                              <span className="text-xl font-semibold text-white">{totalRating.toFixed(1)}</span>
                              <span className="text-sm text-white/40">average</span>
                    </div>
                )}
            {totalRating && totalReviews && <div className="w-px h-6 bg-white/10" />}
            {totalReviews && (
                    <div className="flex items-center gap-2">
                              <span className="text-xl font-semibold text-white">{totalReviews}</span>
                              <span className="text-sm text-white/40">Google reviews</span>
                    </div>
                )}
          </div>
        );
}

/* ── Page ── */
export default function ReviewsPage() {
    const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null);
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [totalRating, setTotalRating] = useState<number | undefined>();
    const [totalReviews, setTotalReviews] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const handleClose = useCallback(() => setSelectedReview(null), []);
  
    useEffect(() => {
          async function fetchReviews() {
                  try {
                            setIsLoading(true);
                            setError(null);
                            const response = await fetch("/api/reviews");
                    
                            if (!response.ok) {
                                        throw new Error("Failed to fetch reviews");
                            }
                    
                            const data = await response.json();
                    
                            if (data.reviews && data.reviews.length > 0) {
                                        setReviews(data.reviews);
                                        setTotalRating(data.totalRating);
                                        setTotalReviews(data.totalReviews);
                            } else {
                                        // Fall back to static reviews if API returns empty
                                        setReviews(staticReviews as GoogleReview[]);
                            }
                  } catch (err) {
                            console.error("Error fetching Google reviews:", err);
                            setError("Unable to load live reviews");
                            // Fall back to static reviews on error
                            setReviews(staticReviews as GoogleReview[]);
                  } finally {
                            setIsLoading(false);
                  }
          }
      
          fetchReviews();
    }, []);
  
    return (
          <div className="pt-20">
            {/* Hero */}
                <section className="relative overflow-hidden bg-dark-base py-24 text-center">
                        <GradientOrb color="seed" size="xl" className="-top-40 left-1/2 -translate-x-1/2 opacity-20" />
                        <GridPattern />
                        <div className="relative z-10 mx-auto max-w-4xl px-6">
                                  <LiquidGlassPill variant="seed" className="mb-4">
                                              Client Reviews
                                  </LiquidGlassPill>
                                  <AnimatedH1 highlightWords={["Say"]}>
                                              What Our Clients Say
                                  </AnimatedH1>
                                  <p className="mt-6 text-body-lg text-light-base/60 max-w-2xl mx-auto">
                                              Real feedback from real businesses we&apos;ve helped grow with custom web development, managed IT, and digital infrastructure.
                                  </p>
                        </div>
                </section>
          
            {/* Stats + Grid */}
                <Section>
                  {!isLoading && !error && (
                      <StatsBar totalRating={totalRating} totalReviews={totalReviews} />
                    )}
                
                  {error && (
                      <p className="text-center text-xs text-white/20 mb-6">{error} — showing recent reviews</p>
                        )}
                
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {isLoading
                                        ? Array.from({ length: 6 }).map((_, i) => (
                                                          <ReviewSkeleton key={i} index={i} />
                                                        ))
                                        : reviews.map((review, i) => (
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
                <section className="bg-dark-base py-20 md:py-28 border-t border-white/[0.05]">
                        <div className="max-w-3xl mx-auto px-6">
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
                                              Ready to go deeper?
                                  </p>
                                  <div className="flex flex-col gap-2">
                                              <Link
                                                              href="/services/managed-it"
                                                              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
                                                            >
                                                            <div className="flex items-center gap-3">
                                                                            <MonitorSmartphone className="w-4 h-4 text-seed-400 shrink-0" />
                                                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                                                              Managed IT Support &mdash; proactive monitoring, helpdesk, and infrastructure
                                                                            </span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
                                              </Link>
                                              <Link
                                                              href="/services/seedtech-platform"
                                                              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-seed-500/30 hover:bg-seed-500/[0.04] transition-all duration-200"
                                                            >
                                                            <div className="flex items-center gap-3">
                                                                            <Rocket className="w-4 h-4 text-seed-400 shrink-0" />
                                                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                                                              Basic Website &mdash; deploy your website with modern design and functionality
                                                                            </span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-seed-400 transition-colors shrink-0" />
                                              </Link>
                                              <Link
                                                              href="/services/ecommerce-development"
                                                              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all duration-200"
                                                            >
                                                            <div className="flex items-center gap-3">
                                                                            <ShoppingCart className="w-4 h-4 text-blue-400 shrink-0" />
                                                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                                                              Ecommerce &mdash; Shopify, BigCommerce, and custom storefronts
                                                                            </span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors shrink-0" />
                                              </Link>
                                              <Link
                                                              href="/services/custom-development"
                                                              className="group flex items-center justify-between px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-200"
                                                            >
                                                            <div className="flex items-center gap-3">
                                                                            <SquareTerminal className="w-4 h-4 text-cyan-400 shrink-0" />
                                                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                                                                              Custom Development &mdash; SaaS, portals, internal tools, and web apps
                                                                            </span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors shrink-0" />
                                              </Link>
                                  </div>
                                  <p className="text-center text-sm text-white/25 mt-8">
                                              Not sure where to start?{" "}
                                              <Link href="/contact" className="text-seed-400/70 hover:text-seed-400 transition-colors">
                                                            Contact us and we&apos;ll point you in the right direction.
                                              </Link>
                                  </p>
                        </div>
                </section>
          
            {/* Modal */}
                <AnimatePresence>
                  {selectedReview && (
                      <ReviewModal review={selectedReview} onClose={handleClose} />
                    )}
                </AnimatePresence>
          </div>
        );
}
