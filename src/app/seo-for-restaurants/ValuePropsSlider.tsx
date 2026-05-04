"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ValueProp = {
  icon: ReactNode;
  title: string;
  body: string;
};

type Props = {
  items: ValueProp[];
};

export function ValuePropsSlider({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

    // Determine active index based on scroll position (first visible card)
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const cardWidth = children[0].offsetWidth + 20; // approx gap
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    const cardWidth = firstChild ? firstChild.offsetWidth + 20 : el.clientWidth * 0.9;
    el.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - 24, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Scroll track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((v) => (
          <div
            key={v.title}
            className="group relative aspect-[4/5] shrink-0 snap-start rounded-2xl overflow-hidden border border-white/10 bg-dark-raised w-[80%] sm:w-[48%] lg:w-[calc((100%-2.5rem)/3)]"
          >
            {/* Background image placeholder — replace with <Image /> when ready */}
            <div className="absolute inset-0 bg-gradient-to-br from-seed-900/40 via-dark-raised to-blue-900/30">
              {/* When swapping in a real image, use:
                  <Image src="/restaurant-card-X.jpg" alt="..." fill className="object-cover" />
                  Recommended size: 800×1000 (4:5 ratio, 2x retina) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 [&>svg]:w-24 [&>svg]:h-24 [&>svg]:text-white/20">
                {v.icon}
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-black/40 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-white/40 border border-white/10">
                placeholder · 800×1000
              </div>
            </div>

            {/* Top gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/0" />

            {/* Text — top-left corner */}
            <div className="relative z-10 p-6 md:p-7 max-w-[88%]">
              <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                {v.title}
              </h3>
              <p className="text-xs md:text-sm text-white/75 leading-relaxed">
                {v.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls row: pagination dots + arrows */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {/* Pagination dots */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-white/70"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Arrows — hidden on mobile (use swipe), visible md+ */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous"
            className="h-11 w-11 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/80 flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Next"
            className="h-11 w-11 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/80 flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
