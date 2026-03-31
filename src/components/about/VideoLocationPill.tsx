"use client";

import { useRef, useEffect } from "react";

const pillStyle: React.CSSProperties = {
  borderRadius: "13.092px",
  border: "0.818px solid rgba(255, 255, 255, 0.12)",
  background:
    "linear-gradient(95deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 70%), rgba(255,255,255,0.07)",
  boxShadow:
    "0 1.227px 0 0.818px rgba(255,255,255,0.14) inset, 0 -0.818px 0 0.818px rgba(0,0,0,0.10) inset, 0 6.546px 26.184px 0 rgba(0,0,0,0.18), 0 1.637px 6.546px 0 rgba(0,0,0,0.12)",
  backdropFilter: "blur(16.365px)",
  WebkitBackdropFilter: "blur(16.365px)",
};

export function VideoLocationPill() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;

    let ticking = false;

    const position = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const pillH = pill.offsetHeight;
      const pad = 24;

      // Not in viewport at all — hide
      if (rect.top >= vh || rect.bottom <= 0) {
        pill.style.opacity = "0";
        return;
      }

      pill.style.opacity = "1";

      // Desired: 24px from bottom of viewport, expressed as offset from container top
      const desiredTop = vh - pad - pillH - rect.top;
      // Clamped so it never goes above container top + pad ...
      const minOffset = pad;
      // ... or below container bottom - pad - pillH
      const maxOffset = rect.height - pad - pillH;

      pill.style.transform = `translateY(${Math.max(minOffset, Math.min(desiredTop, maxOffset))}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          position();
          ticking = false;
        });
      }
    };

    // Initial position + resize
    position();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-video overflow-hidden rounded-2xl">
      <iframe
        src="https://player.vimeo.com/video/920640866?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1&controls=0&title=0&byline=0&portrait=0"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
        title="SeedTech Background"
      />
      <div
        ref={pillRef}
        className="absolute top-0 left-6 z-10 pointer-events-none"
        style={{ opacity: 0, willChange: "transform" }}
      >
        <span
          className="text-sm text-white/80 px-4 py-2 inline-block pointer-events-auto"
          style={pillStyle}
        >
          Based in New Jersey &amp; California
        </span>
      </div>
    </div>
  );
}
