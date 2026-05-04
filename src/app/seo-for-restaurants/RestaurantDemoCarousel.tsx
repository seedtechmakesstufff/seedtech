"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const demoItems = [
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_1_2x.webp", alt: "Restaurant website demo 1" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_2_2x.webp", alt: "Restaurant website demo 2" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_3_2x.webp", alt: "Restaurant website demo 3" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_4_2x.webp", alt: "Restaurant website demo 4" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_5_2x.webp", alt: "Restaurant website demo 5" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_6_2x.webp", alt: "Restaurant website demo 6" },
  { src: "/img/seo-autopilot/restaurants/demos/restaurant_demo_7_2x.webp", alt: "Restaurant website demo 7" },
];

const TOTAL = demoItems.length;
const CARD_ROTATION = -2;

function getCardStyle(offset: number, isMobile: boolean) {
  const CARD_SPACING = isMobile ? 200 : 420;
  const VISIBLE_SIDE = isMobile ? 1 : 2;
  const absOffset = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset > 0 ? 1 : -1;

  if (absOffset > VISIBLE_SIDE) {
    return { opacity: 0, scale: 0.6, x: sign * CARD_SPACING * (VISIBLE_SIDE + 1), rotate: sign * -CARD_ROTATION * (VISIBLE_SIDE + 1), zIndex: 0 };
  }

  return {
    opacity: absOffset === 0 ? 1 : isMobile ? 0.5 : absOffset === 1 ? 0.85 : 0.55,
    scale: absOffset === 0 ? 1 : isMobile ? 0.82 : absOffset === 1 ? 0.88 : 0.76,
    x: offset * CARD_SPACING,
    rotate: offset * -CARD_ROTATION,
    zIndex: 10 - absOffset,
  };
}

function CursorFollower({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
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
      const halfCard = 310;
      setPos({ x: relX, y: relY });
      if (relX < midpoint - halfCard) setLabel("Prev");
      else if (relX > midpoint + halfCard) setLabel("Next");
      else setLabel(null);
    };
    const onLeave = () => setLabel(null);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
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
          className="absolute z-50 pointer-events-none w-[72px] h-[72px] rounded-full bg-white text-dark-base flex items-center justify-center text-[13px] font-semibold tracking-tight shadow-2xl shadow-black/40"
          style={{ left: pos.x - 36, top: pos.y - 36 }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RestaurantDemoCarousel() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(TOTAL / 2));
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goNext = useCallback(() => setActiveIndex((p) => (p + 1) % TOTAL), []);
  const goPrev = useCallback(() => setActiveIndex((p) => (p - 1 + TOTAL) % TOTAL), []);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const midpoint = rect.width / 2;
    const halfCard = isMobile ? 120 : 310;
    if (relX < midpoint - halfCard) goPrev();
    else if (relX > midpoint + halfCard) goNext();
  }, [goNext, goPrev, isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const centerItem = demoItems[activeIndex];
  const VISIBLE_SIDE = isMobile ? 1 : 2;

  return (
    <div className="relative">
      {/* Background blurred active image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image src={centerItem.src} alt="" fill sizes="100vw" className="object-cover blur-[80px] scale-150 saturate-[0.5]" priority={false} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-dark-base/90" />
      </div>

      {/* Cards area */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 mx-auto h-[190px] sm:h-[270px] md:h-[360px] lg:h-[420px] select-none overflow-hidden"
        style={{ cursor: "none" }}
      >
        <CursorFollower containerRef={containerRef} />
        <div className="relative w-full h-full flex items-center justify-center">
          {demoItems.map((item, i) => {
            let offset = i - activeIndex;
            if (offset > TOTAL / 2) offset -= TOTAL;
            if (offset < -TOTAL / 2) offset += TOTAL;
            if (Math.abs(offset) > VISIBLE_SIDE) return null;
            const style = getCardStyle(offset, isMobile);
            const isCenter = offset === 0;
            return (
              <motion.div
                key={item.src}
                layout
                animate={{ x: style.x, scale: style.scale, rotate: style.rotate, opacity: style.opacity, zIndex: style.zIndex }}
                transition={{ type: "spring", stiffness: 220, damping: 26, mass: 1 }}
                className={cn(
                  "absolute",
                  "w-[240px] h-[135px] sm:w-[380px] sm:h-[214px] md:w-[500px] md:h-[281px] lg:w-[600px] lg:h-[338px]",
                  "rounded-[16px] overflow-hidden shadow-2xl shadow-black/50",
                  isCenter ? "border-2 border-white/20" : "border border-white/[0.08]"
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 380px, (max-width: 1024px) 500px, 600px"
                  className="object-cover"
                  priority={isCenter}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-5">
        {demoItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex ? "bg-white/50 w-5" : "bg-white/10 w-1.5 hover:bg-white/25"
            )}
            aria-label={`Go to demo ${i + 1}`}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
