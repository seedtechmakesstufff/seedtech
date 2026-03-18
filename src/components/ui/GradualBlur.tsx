"use client";

import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";
import * as math from "mathjs";

/* ── Types ────────────────────────────────────────────────────── */

type GradualBlurProps = PropsWithChildren<{
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  target?: "parent" | "page";
  className?: string;
  style?: CSSProperties;
}>;

/* ── Constants ────────────────────────────────────────────────── */

const DEFAULT_CONFIG: Required<
  Omit<GradualBlurProps, "children" | "style" | "className">
> & { className: string; style: CSSProperties } = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  width: "100%",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  target: "parent",
  className: "",
  style: {},
};

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
};

const getGradientDirection = (position: string): string => {
  const map: Record<string, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return map[position] || "to bottom";
};

/* ── Intersection hook ────────────────────────────────────────── */

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement>,
  shouldObserve = false
): boolean {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

/* ── Component ───────────────────────────────────────────────── */

function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...props }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(props)]
  );

  const isVisible = useIntersectionObserver(
    containerRef as React.RefObject<HTMLDivElement>,
    config.animated === "scroll"
  );

  /* ── Build blur divs ─────────────────────────────────────── */
  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const curveFunc =
      CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue =
          Number(math.pow(2, progress * 4)) * 0.0625 * config.strength;
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * config.strength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      const divStyle: CSSProperties = {
        position: "absolute",
        inset: "0",
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }
    return divs;
  }, [config]);

  /* ── Container style ─────────────────────────────────────── */
  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = ["top", "bottom"].includes(config.position);
    const isHorizontal = ["left", "right"].includes(config.position);
    const isPageTarget = config.target === "page";

    const baseStyle: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? `opacity ${config.duration} ${config.easing}`
        : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = config.height;
      baseStyle.width = config.width || "100%";
      (baseStyle as Record<string, unknown>)[config.position] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = config.width || config.height;
      baseStyle.height = "100%";
      (baseStyle as Record<string, unknown>)[config.position] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, isVisible]);

  /* ── Animate-in callback ─────────────────────────────────── */
  const { animated, duration } = config;
  useEffect(() => {
    if (isVisible && animated === "scroll") {
      const ms = parseFloat(duration) * 1000;
      const t = setTimeout(() => {}, ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, duration]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur isolate ${config.className}`}
      style={containerStyle}
    >
      <div
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {blurDivs}
      </div>
    </div>
  );
}

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";
export default GradualBlurMemo;
