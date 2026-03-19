"use client";

import { useEffect, useState } from "react";
import GradualBlur from "@/components/ui/GradualBlur";

/**
 * Fixed viewport-bottom gradual blur overlay.
 * Fades out as the user approaches the bottom of the page
 * so it doesn't blur the footer.
 */
export function PageBlurOverlay() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const distFromBottom = docHeight - scrollY - winHeight;

      // Start fading out 300px before the bottom, fully gone at 50px
      const fadeStart = 300;
      const fadeEnd = 50;

      if (distFromBottom >= fadeStart) {
        setOpacity(1);
      } else if (distFromBottom <= fadeEnd) {
        setOpacity(0);
      } else {
        setOpacity((distFromBottom - fadeEnd) / (fadeStart - fadeEnd));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="12rem"
      strength={4}
      divCount={1}
      curve="bezier"
      exponential
      zIndex={30}
      style={{ opacity, transition: "opacity 0.3s ease-out" }}
    />
  );
}
