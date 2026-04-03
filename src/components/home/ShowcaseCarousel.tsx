"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Showcase items ── */
const showcaseItems = [
  {
    src: "/img/use_case_card_paddlerscove_1x.webp",
    client: "paddlerscove.com",
    slug: "paddlers-cove",
  },
  {
    src: "/img/use_case_card_trevor_noah_1x.webp",
    client: "Trevor Noah — Back to Abnormal",
    slug: "trevor-noah-back-to-abnormal",
  },
  {
    src: "/img/use_case_card_starcom_1x.webp",
    client: "starcomfiber.com",
    slug: "starcom-fiber",
  },
  {
    src: "/img/use_case_card_megasafe_1x.webp",
    client: "megasafe.com",
    slug: "megasafe",
  },
  {
    src: "/img/use_case_card_imperia_1x.webp",
    client: "imperianj.com",
    slug: "imperia-nj",
  },
  {
    src: "/img/use_case_card_bioox.webp",
    client: "bioox.us",
    slug: "bioox",
  },
  {
    src: "/img/use_case_card_carla-marie-and-anthony-show_1x.webp",
    client: "carlamarieandanthonyshow.com",
    slug: "carla-marie-and-anthony-show",
  },
  {
    src: "/img/use_case_card_ron_white.webp",
    client: "tatersalad.com",
    slug: "ron-white-tatersalad",
  },
  {
    src: "/img/use_case_card_shortruncustomboxes_1x.webp",
    client: "shortruncustomboxes.com",
    slug: "short-run-custom-boxes",
  },
  {
    src: "/img/use_case_card_vick_tipnes.webp",
    client: "vicktipnes.com",
    slug: null,
  },
];

const TOTAL = showcaseItems.length;
const VISIBLE_SIDE = 2;

/*
 * Card positioning — absolute pixel offsets so left/right are perfectly
 * symmetric.  sign(offset) controls direction, abs(offset) controls
 * how far out and how much tilt.
 */
const CARD_SPACING = 420; // px between card centers (tuned for 620px-wide landscape cards)
const CARD_ROTATION = -2; // degrees per step — subtle lean like Squarespace

function getCardStyle(offset: number) {
  const absOffset = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset > 0 ? 1 : -1;

  if (absOffset > VISIBLE_SIDE) {
    return {
      opacity: 0,
      scale: 0.6,
      x: sign * CARD_SPACING * (VISIBLE_SIDE + 1),
      rotate: sign * -CARD_ROTATION * (VISIBLE_SIDE + 1),
      zIndex: 0,
    };
  }

  const x = offset * CARD_SPACING;
  const rotate = offset * -CARD_ROTATION; // left tilts CW, right tilts CCW
  const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.88 : 0.76;
  const zIndex = 10 - absOffset;
  const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.85 : 0.55;

  return { opacity, scale, x, rotate, zIndex };
}

/* ── Cursor-following "Next" / "Prev" pill ── */
function CursorFollower({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const midpoint = rect.width / 2;
      // Dead zone = center card width (~620px on lg, use half = 310)
      // so cursor pill never appears over the center card
      const halfCard = 310;

      setPos({ x: relX, y: relY });

      if (relX < midpoint - halfCard) setLabel("Prev");
      else if (relX > midpoint + halfCard) setLabel("Next");
      else setLabel(null);
    };

    const onLeave = () => setLabel(null);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 pointer-events-none",
            "w-[72px] h-[72px] rounded-full",
            "bg-white text-dark-base",
            "flex items-center justify-center",
            "text-[13px] font-semibold tracking-tight",
            "shadow-2xl shadow-black/40"
          )}
          style={{
            left: pos.x - 36,
            top: pos.y - 36,
          }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main carousel section ── */
export function ShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(TOTAL / 2)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, []);

  /* Click handler — left half = prev, right half = next, center card = link */
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      // Don't intercept if they clicked a link (center card)
      const target = e.target as HTMLElement;
      if (target.closest("a")) return;

      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const midpoint = rect.width / 2;
      const halfCard = 310; // match cursor dead zone

      if (relX < midpoint - halfCard) goPrev();
      else if (relX > midpoint + halfCard) goNext();
    },
    [goNext, goPrev]
  );

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const centerItem = showcaseItems[activeIndex];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-dark-base">
      {/* Background — blurred hero of active card */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={centerItem.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-[80px] scale-150 saturate-[0.5]"
              priority={false}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-dark-base/90" />
      </div>

      {/* Section label */}
      <div className="relative z-10 text-center mb-10 md:mb-14 px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-medium">
          Websites Made with SeedTech
        </p>
      </div>

      {/* Cards area */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative z-10 mx-auto h-[260px] sm:h-[320px] md:h-[400px] lg:h-[460px] select-none"
        style={{ cursor: "none" }}
      >
        {/* Cursor follower */}
        <CursorFollower containerRef={containerRef} />

        {/* Cards stack */}
        <div className="relative w-full h-full flex items-center justify-center">
          {showcaseItems.map((item, i) => {
            let offset = i - activeIndex;
            if (offset > TOTAL / 2) offset -= TOTAL;
            if (offset < -TOTAL / 2) offset += TOTAL;

            const isVisible = Math.abs(offset) <= VISIBLE_SIDE;
            if (!isVisible) return null;

            const style = getCardStyle(offset);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={item.client}
                layout
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotate: style.rotate,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 26,
                  mass: 1,
                }}
                className={cn(
                  "absolute",
                  "w-[320px] h-[180px] sm:w-[400px] sm:h-[225px] md:w-[520px] md:h-[293px] lg:w-[620px] lg:h-[349px]",
                  "rounded-[16px] overflow-hidden",
                  "shadow-2xl shadow-black/50",
                  isCenter
                    ? "border-2 border-white/20"
                    : "border border-white/[0.08]"
                )}
              >
                {isCenter ? (
                  item.slug ? (
                  <Link
                    href={`/our-work/${item.slug}`}
                    className="block relative w-full h-full group"
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.client} — built by SeedTech`}
                      fill
                      sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 520px, 620px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority
                    />
                    {/* Hover hint */}
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-white/70 font-medium">
                        View project →
                      </span>
                    </div>
                  </Link>
                  ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.src}
                      alt={`${item.client} — built by SeedTech`}
                      fill
                      sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 520px, 620px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  )
                ) : (
                  <Image
                    src={item.src}
                    alt={`${item.client} — built by SeedTech`}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 520px, 620px"
                    className="object-cover"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom — active site name + branding */}
      <div className="relative z-10 text-center mt-8 md:mt-12 px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-white/50"
          >
            {centerItem.client}
          </motion.p>
        </AnimatePresence>
        <p className="mt-3 text-xs text-white/20">
          Made with{" "}
          <span className="text-white/30 font-medium">SeedTech</span>
        </p>
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-5">
        {showcaseItems.map((item, i) => (
          <button
            key={item.client}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex
                ? "bg-white/50 w-5"
                : "bg-white/10 w-1.5 hover:bg-white/25"
            )}
            aria-label={`Go to ${item.client}`}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </section>
  );
}
