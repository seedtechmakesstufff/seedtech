"use client";

import { useEffect, useRef } from "react";

interface MattsCustomBackgroundProps {
  className?: string;
  blobCount?: number;
  mouseStrength?: number;
  mouseRadius?: number;
}

const TARGET_INTERVAL_MS = 1000 / 30;

const isSafari = typeof navigator !== "undefined"
  ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  : false;

const isMobile = typeof navigator !== "undefined"
  ? /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  : false;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function noise1D(time: number, seed: number) {
  const i = Math.floor(time);
  const f = time - i;
  const a = hash(i + seed * 11.17);
  const b = hash(i + 1 + seed * 11.17);
  return a + (b - a) * smoothstep(f);
}

function drift(time: number, seed: number) {
  const a = noise1D(time * 0.17, seed) * 2 - 1;
  const b = noise1D(time * 0.071, seed + 13.2) * 2 - 1;
  const c = noise1D(time * 0.029, seed + 29.4) * 2 - 1;
  return a * 0.56 + b * 0.29 + c * 0.15;
}

export default function MattsCustomBackground({
  className = "",
}: MattsCustomBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const lowerMassRef = useRef<HTMLDivElement>(null);
  const upperMassRef = useRef<HTMLDivElement>(null);
  const leftMassRef = useRef<HTMLDivElement>(null);
  const rightMassRef = useRef<HTMLDivElement>(null);
  const seamGroupRef = useRef<SVGGElement>(null);
  const streakGroupRef = useRef<SVGGElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layers = [
      { ref: atmosphereRef, x: 6, y: 3, seedX: 1.7, seedY: 2.9 },
      { ref: lowerMassRef, x: 12, y: 8, seedX: 4.3, seedY: 5.8 },
      { ref: upperMassRef, x: 10, y: 6, seedX: 7.1, seedY: 8.4 },
      { ref: leftMassRef, x: 7, y: 6, seedX: 10.6, seedY: 11.8 },
      { ref: rightMassRef, x: 10, y: 8, seedX: 13.7, seedY: 14.9 },
    ];

    let time = 0;
    let lastFrameTime = 0;

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < TARGET_INTERVAL_MS) return;

      const delta = Math.min(elapsed, 100) / 1000;
      lastFrameTime = timestamp - (elapsed % TARGET_INTERVAL_MS);
      time += delta;

      for (const layer of layers) {
        const el = layer.ref.current;
        if (!el) continue;
        if (reducedMotion) {
          el.style.transform = "translate3d(0px, 0px, 0)";
          continue;
        }

        const x = drift(time, layer.seedX) * layer.x;
        const y = drift(time, layer.seedY) * layer.y;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      const seam = seamGroupRef.current;
      const streaks = streakGroupRef.current;
      if (seam) {
        const sx = reducedMotion ? 0 : drift(time, 17.4) * 10;
        const sy = reducedMotion ? 0 : drift(time, 18.6) * 8;
        seam.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      }
      if (streaks) {
        const sx = reducedMotion ? 0 : drift(time, 20.1) * 14;
        const sy = reducedMotion ? 0 : drift(time, 21.3) * 10;
        streaks.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const blurHeavy = isMobile ? "60px" : "95px";
  const blurMedium = isMobile ? "34px" : "56px";
  const blurLight = isMobile ? "18px" : "28px";
  const streakCount = isSafari || isMobile ? 4 : 6;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #030805 0%, #06110a 22%, #173923 58%, #1f4f30 84%, #0a180f 100%)",
      }}
    >
      <div
        ref={atmosphereRef}
        style={{
          position: "absolute",
          inset: "-8%",
          willChange: "transform",
          background:
            "radial-gradient(72% 48% at 50% 14%, rgba(94,175,119,0.18) 0%, rgba(58,144,84,0.11) 30%, rgba(31,79,48,0.04) 62%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        ref={lowerMassRef}
        style={{
          position: "absolute",
          left: "-8%",
          bottom: "-18%",
          width: "118%",
          height: "78%",
          borderRadius: "50%",
          filter: `blur(${blurHeavy})`,
          willChange: "transform",
          background:
            "radial-gradient(70% 78% at 52% 36%, rgba(94,175,119,0.18) 0%, rgba(58,144,84,0.12) 24%, rgba(31,79,48,0.08) 54%, rgba(0,0,0,0) 100%)",
          opacity: lowPower ? 0.88 : 1,
        }}
      />

      <div
        ref={upperMassRef}
        style={{
          position: "absolute",
          right: "-12%",
          top: "8%",
          width: "74%",
          height: "46%",
          borderRadius: "50%",
          filter: `blur(${blurMedium})`,
          willChange: "transform",
          background:
            "radial-gradient(76% 76% at 56% 46%, rgba(94,175,119,0.16) 0%, rgba(58,144,84,0.1) 26%, rgba(31,79,48,0.05) 58%, rgba(0,0,0,0) 100%)",
          opacity: lowPower ? 0.82 : 0.94,
        }}
      />

      <div
        ref={leftMassRef}
        style={{
          position: "absolute",
          left: "-8%",
          bottom: "-6%",
          width: "34%",
          height: "40%",
          borderRadius: "50%",
          filter: `blur(${blurHeavy})`,
          willChange: "transform",
          background:
            "radial-gradient(72% 76% at 50% 50%, rgba(184,210,192,0.12) 0%, rgba(127,167,140,0.07) 34%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        ref={rightMassRef}
        style={{
          position: "absolute",
          right: "-10%",
          bottom: "-2%",
          width: "40%",
          height: "58%",
          borderRadius: "50%",
          filter: `blur(${blurHeavy})`,
          willChange: "transform",
          background:
            "radial-gradient(74% 80% at 48% 44%, rgba(184,210,192,0.24) 0%, rgba(127,167,140,0.11) 34%, rgba(0,0,0,0) 100%)",
        }}
      />

      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <g
          ref={streakGroupRef}
          style={{ willChange: "transform", transformOrigin: "50% 50%" }}
        >
          {Array.from({ length: streakCount }).map((_, i) => (
            <path
              key={i}
              d={`M -20 ${470 - i * 10} C 240 ${220 - i * 10}, 620 ${430 - i * 8}, 1020 ${320 - i * 6}`}
              fill="none"
              stroke="rgba(184,210,192,0.07)"
              strokeWidth={14 - i * 2}
              strokeLinecap="round"
              style={{
                filter: `blur(${Math.max(6, 18 - i * 2)}px)`,
                mixBlendMode: "screen",
              }}
            />
          ))}
        </g>

        <g
          ref={seamGroupRef}
          style={{ willChange: "transform", transformOrigin: "50% 50%" }}
        >
          <path
            d="M -20 470 C 240 220, 620 430, 1020 320"
            fill="none"
            stroke="rgba(184,210,192,0.11)"
            strokeWidth={10}
            strokeLinecap="round"
            style={{ filter: `blur(${blurLight})`, mixBlendMode: "screen" }}
          />
          <path
            d="M -20 470 C 240 220, 620 430, 1020 320"
            fill="none"
            stroke="rgba(228,238,230,0.76)"
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 86% at 52% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.62) 100%)",
        }}
      />
    </div>
  );
}
