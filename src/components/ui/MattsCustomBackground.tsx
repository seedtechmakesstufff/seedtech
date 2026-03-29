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
  const p0 = { x: -width * 0.02 + offsetX, y: height * (0.8 + offsetY) };
  const p1 = { x: width * 0.24 + offsetX, y: height * (0.34 + controlLift + offsetY) };
  const p2 = { x: width * 0.62 + offsetX, y: height * (0.7 - controlLift * 0.65 + offsetY) };
  const p3 = { x: width * 1.02 + offsetX, y: height * (0.56 + offsetY) };

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
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
    const isLowPower = isSafari || isMobile;

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
      baseField.addColorStop(0.18, "#06110a");
      baseField.addColorStop(0.5, "#173923");
      baseField.addColorStop(0.82, "#1f4f30");
      baseField.addColorStop(1, "#0a180f");

      topAtmosphere = ctx.createRadialGradient(
        width * 0.48,
        height * 0.14,
        width * 0.06,
        width * 0.48,
        height * 0.14,
        width * 0.85
      );
      topAtmosphere.addColorStop(0, rgba(94, 175, 119, 0.12));
      topAtmosphere.addColorStop(0.28, rgba(58, 144, 84, 0.08));
      topAtmosphere.addColorStop(0.72, rgba(31, 79, 48, 0.03));
      topAtmosphere.addColorStop(1, rgba(0, 0, 0, 0));

      lowerFalloff = ctx.createLinearGradient(0, height * 0.4, 0, height);
      lowerFalloff.addColorStop(0, rgba(0, 0, 0, 0));
      lowerFalloff.addColorStop(1, rgba(0, 0, 0, 0.42));

      cornerVignette = ctx.createRadialGradient(
        width * 0.52,
        height * 0.48,
        width * 0.2,
        width * 0.52,
        height * 0.48,
        width * 0.95
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

      const seamOffsetX = drift(time, 1.7) * width * 0.02;
      const seamOffsetY = drift(time, 3.1) * height * 0.02;
      const controlLift = drift(time, 5.9) * 0.03;

      const p0 = { x: -width * 0.02 + seamOffsetX, y: height * (0.8 + seamOffsetY) };
      const p1 = { x: width * 0.24 + seamOffsetX, y: height * (0.34 + controlLift + seamOffsetY) };
      const p2 = { x: width * 0.62 + seamOffsetX, y: height * (0.7 - controlLift * 0.65 + seamOffsetY) };
      const p3 = { x: width * 1.02 + seamOffsetX, y: height * (0.56 + seamOffsetY) };

      // Main lower mass under the seam.
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.lineTo(width * 1.04, height * 1.05);
      ctx.lineTo(-width * 0.04, height * 1.05);
      ctx.closePath();
      ctx.clip();

      const lowerBody = ctx.createRadialGradient(
        width * 0.54 + drift(time, 8.2) * width * 0.04,
        height * 0.82 + drift(time, 9.3) * height * 0.03,
        width * 0.03,
        width * 0.54,
        height * 0.82,
        width * 0.66
      );
      lowerBody.addColorStop(0, rgba(94, 175, 119, 0.16));
      lowerBody.addColorStop(0.18, rgba(58, 144, 84, 0.12));
      lowerBody.addColorStop(0.46, rgba(31, 79, 48, 0.08));
      lowerBody.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.filter = isLowPower ? "blur(26px)" : "blur(46px)";
      ctx.fillStyle = lowerBody;
      ctx.fillRect(-width * 0.08, height * 0.28, width * 1.16, height * 0.84);

      const lowerGlide = ctx.createLinearGradient(0, height * 0.44, width, height * 0.98);
      lowerGlide.addColorStop(0, rgba(184, 210, 192, 0.03));
      lowerGlide.addColorStop(0.35, rgba(184, 210, 192, 0.07));
      lowerGlide.addColorStop(0.7, rgba(184, 210, 192, 0.02));
      lowerGlide.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
      ctx.filter = isLowPower ? "blur(18px)" : "blur(32px)";
      ctx.fillStyle = lowerGlide;
      ctx.fillRect(-width * 0.08, height * 0.34, width * 1.16, height * 0.74);

      ctx.restore();

      // Upper sweep and folded streak region around the seam.
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-width * 0.04, height * 0.14);
      ctx.lineTo(width * 1.04, height * 0.14);
      ctx.lineTo(width * 1.04, height * 0.72);
      ctx.bezierCurveTo(
        width * 0.84 + seamOffsetX, height * (0.55 + seamOffsetY),
        width * 0.56 + seamOffsetX, height * (0.62 + seamOffsetY),
        width * 0.22 + seamOffsetX, height * (0.46 + seamOffsetY)
      );
      ctx.bezierCurveTo(
        width * 0.1 + seamOffsetX, height * (0.41 + seamOffsetY),
        width * 0.02 + seamOffsetX, height * (0.45 + seamOffsetY),
        -width * 0.04, height * 0.5
      );
      ctx.closePath();
      ctx.clip();

      const upperBody = ctx.createRadialGradient(
        width * 0.78 + drift(time, 11.4) * width * 0.03,
        height * 0.34 + drift(time, 12.3) * height * 0.02,
        width * 0.04,
        width * 0.78,
        height * 0.34,
        width * 0.42
      );
      upperBody.addColorStop(0, rgba(94, 175, 119, 0.18));
      upperBody.addColorStop(0.2, rgba(58, 144, 84, 0.12));
      upperBody.addColorStop(0.5, rgba(31, 79, 48, 0.08));
      upperBody.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.filter = isLowPower ? "blur(18px)" : "blur(34px)";
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = upperBody;
      ctx.fillRect(-width * 0.06, height * 0.12, width * 1.12, height * 0.66);

      for (let i = 0; i < (isLowPower ? 4 : 7); i++) {
        const spread = i * 0.008;
        const alpha = 0.055 - i * 0.006;
        const blur = isLowPower ? 10 + i * 2 : 16 + i * 3;
        ctx.filter = `blur(${blur}px)`;
        ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
        drawCurveStroke(
          ctx,
          width,
          height,
          seamOffsetY - 0.022 + spread + drift(time + i * 0.7, 14 + i) * 0.004,
          seamOffsetX + drift(time + i * 0.5, 20 + i) * width * 0.01,
          controlLift + 0.01,
          isLowPower ? 9 - i : 14 - i * 1.2,
          rgba(184, 210, 192, Math.max(alpha, 0.01))
        );
      }

      ctx.restore();

      // Broad lower left and right soft masses from the reference.
      ctx.filter = isLowPower ? "blur(22px)" : "blur(40px)";
      const leftMass = ctx.createRadialGradient(
        width * 0.04 + drift(time, 31.2) * width * 0.02,
        height * 0.92,
        width * 0.02,
        width * 0.04,
        height * 0.92,
        width * 0.32
      );
      leftMass.addColorStop(0, rgba(184, 210, 192, 0.11));
      leftMass.addColorStop(0.3, rgba(127, 167, 140, 0.07));
      leftMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = leftMass;
      ctx.fillRect(-width * 0.04, height * 0.66, width * 0.44, height * 0.42);

      const rightMass = ctx.createRadialGradient(
        width * 0.94 + drift(time, 37.4) * width * 0.015,
        height * 0.7 + drift(time, 39.5) * height * 0.02,
        width * 0.03,
        width * 0.94,
        height * 0.7,
        width * 0.36
      );
      rightMass.addColorStop(0, rgba(184, 210, 192, 0.22));
      rightMass.addColorStop(0.34, rgba(127, 167, 140, 0.11));
      rightMass.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = rightMass;
      ctx.fillRect(width * 0.62, height * 0.34, width * 0.46, height * 0.78);

      // Main seam with soft glow underlay.
      ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
      ctx.filter = isLowPower ? "blur(12px)" : "blur(20px)";
      drawCurveStroke(
        ctx,
        width,
        height,
        seamOffsetY,
        seamOffsetX,
        controlLift,
        isLowPower ? 7 : 10,
        rgba(184, 210, 192, 0.12)
      );

      ctx.filter = "none";
      drawCurveStroke(
        ctx,
        width,
        height,
        seamOffsetY,
        seamOffsetX,
        controlLift,
        isLowPower ? 1.35 : 1.7,
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
