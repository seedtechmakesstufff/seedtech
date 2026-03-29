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

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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

function drawCurveStroke(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offsetY: number,
  offsetX: number,
  controlLift: number,
  lineWidth: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(-width * 0.02 + offsetX, height * (0.8 + offsetY));
  ctx.bezierCurveTo(
    width * 0.24 + offsetX,
    height * (0.34 + controlLift + offsetY),
    width * 0.62 + offsetX,
    height * (0.7 - controlLift * 0.65 + offsetY),
    width * 1.02 + offsetX,
    height * (0.56 + offsetY)
  );
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export default function MattsCustomBackground({
  className = "",
}: MattsCustomBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = isSafari || isMobile;

    let width = 0;
    let height = 0;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    let baseField: CanvasGradient | null = null;
    let topAtmosphere: CanvasGradient | null = null;
    let lowerFalloff: CanvasGradient | null = null;
    let cornerVignette: CanvasGradient | null = null;

    const rebuildStatics = () => {
      baseField = ctx.createLinearGradient(0, 0, width, height);
      baseField.addColorStop(0, "#030805");
      baseField.addColorStop(0.2, "#06110a");
      baseField.addColorStop(0.5, "#173923");
      baseField.addColorStop(0.84, "#1f4f30");
      baseField.addColorStop(1, "#0a180f");

      topAtmosphere = ctx.createRadialGradient(
        width * 0.5,
        height * 0.16,
        width * 0.05,
        width * 0.5,
        height * 0.16,
        width * 0.88
      );
      topAtmosphere.addColorStop(0, rgba(94, 175, 119, 0.12));
      topAtmosphere.addColorStop(0.3, rgba(58, 144, 84, 0.08));
      topAtmosphere.addColorStop(0.7, rgba(31, 79, 48, 0.02));
      topAtmosphere.addColorStop(1, rgba(0, 0, 0, 0));

      lowerFalloff = ctx.createLinearGradient(0, height * 0.46, 0, height);
      lowerFalloff.addColorStop(0, rgba(0, 0, 0, 0));
      lowerFalloff.addColorStop(1, rgba(0, 0, 0, 0.42));

      cornerVignette = ctx.createRadialGradient(
        width * 0.52,
        height * 0.5,
        width * 0.2,
        width * 0.52,
        height * 0.5,
        width * 0.96
      );
      cornerVignette.addColorStop(0, rgba(0, 0, 0, 0));
      cornerVignette.addColorStop(1, rgba(0, 0, 0, 0.62));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      baseField = null;
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let lastFrameTime = 0;

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < TARGET_INTERVAL_MS) return;

      const delta = Math.min(elapsed, 100) / 1000;
      lastFrameTime = timestamp - (elapsed % TARGET_INTERVAL_MS);

      if (document.hidden || width === 0) return;
      if (reducedMotion && time > 0) {
        cancelAnimationFrame(rafRef.current);
        return;
      }

      time += delta;

      ctx.save();
      ctx.scale(dpr, dpr);

      if (!baseField) rebuildStatics();

      ctx.fillStyle = baseField!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = topAtmosphere!;
      ctx.fillRect(0, 0, width, height);

      const seamOffsetX = drift(time, 1.7) * width * 0.018;
      const seamOffsetY = drift(time, 3.1) * height * 0.014;
      const controlLift = drift(time, 5.9) * 0.028;

      // Main lower continuous mass.
      const lowerMass = ctx.createRadialGradient(
        width * 0.52 + drift(time, 8.2) * width * 0.03,
        height * 0.84 + drift(time, 9.3) * height * 0.025,
        width * 0.04,
        width * 0.52,
        height * 0.84,
        width * 0.72
      );
      lowerMass.addColorStop(0, rgba(94, 175, 119, 0.17));
      lowerMass.addColorStop(0.2, rgba(58, 144, 84, 0.12));
      lowerMass.addColorStop(0.48, rgba(31, 79, 48, 0.07));
      lowerMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.filter = lowPower ? "blur(24px)" : "blur(44px)";
      ctx.fillStyle = lowerMass;
      ctx.fillRect(-width * 0.12, height * 0.26, width * 1.24, height * 0.9);

      // Upper ridge glow near the seam.
      const upperMass = ctx.createRadialGradient(
        width * 0.76 + drift(time, 11.4) * width * 0.028,
        height * 0.36 + drift(time, 12.3) * height * 0.02,
        width * 0.04,
        width * 0.76,
        height * 0.36,
        width * 0.46
      );
      upperMass.addColorStop(0, rgba(94, 175, 119, 0.16));
      upperMass.addColorStop(0.22, rgba(58, 144, 84, 0.1));
      upperMass.addColorStop(0.55, rgba(31, 79, 48, 0.05));
      upperMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = upperMass;
      ctx.fillRect(-width * 0.08, height * 0.08, width * 1.18, height * 0.72);

      // Left and right diffuse masses from the reference.
      const leftMass = ctx.createRadialGradient(
        width * 0.06 + drift(time, 15.6) * width * 0.02,
        height * 0.94,
        width * 0.02,
        width * 0.06,
        height * 0.94,
        width * 0.34
      );
      leftMass.addColorStop(0, rgba(184, 210, 192, 0.1));
      leftMass.addColorStop(0.34, rgba(127, 167, 140, 0.06));
      leftMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = leftMass;
      ctx.fillRect(-width * 0.04, height * 0.62, width * 0.42, height * 0.46);

      const rightMass = ctx.createRadialGradient(
        width * 0.94 + drift(time, 18.4) * width * 0.014,
        height * 0.72 + drift(time, 19.7) * height * 0.02,
        width * 0.03,
        width * 0.94,
        height * 0.72,
        width * 0.38
      );
      rightMass.addColorStop(0, rgba(184, 210, 192, 0.22));
      rightMass.addColorStop(0.32, rgba(127, 167, 140, 0.11));
      rightMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = rightMass;
      ctx.fillRect(width * 0.6, height * 0.32, width * 0.44, height * 0.8);

      // Smeared bands that follow the seam.
      ctx.globalCompositeOperation = lowPower ? "screen" : "lighter";
      for (let i = 0; i < (lowPower ? 4 : 7); i++) {
        const alpha = 0.05 - i * 0.005;
        const blur = lowPower ? 10 + i * 2 : 16 + i * 3;
        ctx.filter = `blur(${blur}px)`;
        drawCurveStroke(
          ctx,
          width,
          height,
          seamOffsetY - 0.025 + i * 0.008 + drift(time + i * 0.6, 22 + i) * 0.003,
          seamOffsetX + drift(time + i * 0.8, 31 + i) * width * 0.008,
          controlLift + 0.01,
          lowPower ? 8 - i * 0.8 : 13 - i,
          rgba(184, 210, 192, Math.max(alpha, 0.01))
        );
      }

      // Main seam.
      ctx.filter = lowPower ? "blur(10px)" : "blur(18px)";
      drawCurveStroke(
        ctx,
        width,
        height,
        seamOffsetY,
        seamOffsetX,
        controlLift,
        lowPower ? 7 : 10,
        rgba(184, 210, 192, 0.11)
      );

      ctx.filter = "none";
      drawCurveStroke(
        ctx,
        width,
        height,
        seamOffsetY,
        seamOffsetX,
        controlLift,
        lowPower ? 1.3 : 1.6,
        rgba(228, 238, 230, 0.74)
      );

      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
      ctx.fillStyle = lowerFalloff!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = cornerVignette!;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", willChange: "transform" }}
    />
  );
}
