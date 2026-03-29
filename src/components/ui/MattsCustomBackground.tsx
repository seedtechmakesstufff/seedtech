"use client";

import { useEffect, useRef } from "react";

interface WaveLayer {
  baseY: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  thickness: number;
  lift: number;
  alpha: number;
  driftX: number;
  driftY: number;
  detail: number;
}

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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function wander(time: number, a: number, b: number, c: number, phase: number) {
  return (
    Math.sin(time * a + phase) * 0.58 +
    Math.sin(time * b + phase * 1.7) * 0.28 +
    Math.sin(time * c + phase * 2.3) * 0.14
  );
}

function drawWavePath(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layer: WaveLayer,
  time: number
) {
  const yAt = (x: number) => {
    const nx = x / width;
    const primary = Math.sin(nx * Math.PI * layer.frequency + time * layer.speed + layer.phase);
    const secondary = Math.sin(nx * Math.PI * (layer.frequency * 1.43) - time * (layer.speed * 0.47) + layer.phase * 0.7);
    const tertiary = Math.sin(nx * Math.PI * (layer.frequency * 0.72) + time * (layer.speed * 0.19) + layer.phase * 1.3);
    return (
      layer.baseY +
      primary * layer.amplitude +
      secondary * (layer.amplitude * layer.detail) +
      tertiary * (layer.amplitude * 0.16)
    ) * height;
  };

  ctx.beginPath();
  ctx.moveTo(-width * 0.08, yAt(0) - layer.lift * height);

  const segments = 7;
  for (let i = 0; i < segments; i++) {
    const x0 = (i / segments) * width;
    const x1 = ((i + 1) / segments) * width;
    const y0 = yAt(x0);
    const y1 = yAt(x1);
    const cx = (x0 + x1) / 2;
    ctx.bezierCurveTo(cx, y0 - layer.lift * height, cx, y1 - layer.lift * height, x1, y1 - layer.lift * height);
  }

  ctx.lineTo(width * 1.06, height * 1.08);
  ctx.lineTo(-width * 0.08, height * 1.08);
  ctx.closePath();
}

export default function MattsCustomBackground({
  className = "",
  blobCount = 7,
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

    let topField: CanvasGradient | null = null;
    let atmosphericFalloff: CanvasGradient | null = null;
    let upperLift: CanvasGradient | null = null;
    let centerHaze: CanvasGradient | null = null;
    let lowerMist: CanvasGradient | null = null;
    let rightBloom: CanvasGradient | null = null;
    let rightBloomSoft: CanvasGradient | null = null;
    let leftEdgeFeather: CanvasGradient | null = null;
    let rightEdgeFeather: CanvasGradient | null = null;
    let lowerShadow: CanvasGradient | null = null;
    let vignette: CanvasGradient | null = null;

    const seed = Math.floor(Math.random() * 1_000_000_000);
    const rnd = makeRng(seed);

    const qualityLayerCount = isLowPower ? 3 : clamp(Math.round(blobCount * 0.6), 4, 5);

    const layers: WaveLayer[] = Array.from({ length: qualityLayerCount }, (_, i) => ({
      baseY: 0.5 + i * 0.08 + rnd() * 0.04,
      amplitude: 0.038 + rnd() * 0.03,
      frequency: 0.82 + rnd() * 0.72,
      speed: 0.19 + rnd() * 0.16,
      phase: rnd() * Math.PI * 2,
      thickness: 0.18 + rnd() * 0.16,
      lift: 0.028 + rnd() * 0.024,
      alpha: 0.2 - i * 0.022,
      driftX: 0.01 + rnd() * 0.018,
      driftY: 0.006 + rnd() * 0.01,
      detail: 0.14 + rnd() * 0.08,
    }));

    const rebuildStatics = () => {
      topField = ctx.createLinearGradient(0, 0, width, height);
      topField.addColorStop(0, "#050806");
      topField.addColorStop(0.2, "#07110B");
      topField.addColorStop(0.44, "#1B4027");
      topField.addColorStop(0.68, "#2D6E42");
      topField.addColorStop(1, "#08110B");

      atmosphericFalloff = ctx.createLinearGradient(0, 0, 0, height);
      atmosphericFalloff.addColorStop(0, "rgba(0, 0, 0, 0.14)");
      atmosphericFalloff.addColorStop(0.28, "rgba(0, 0, 0, 0.015)");
      atmosphericFalloff.addColorStop(1, "rgba(0, 0, 0, 0.3)");

      upperLift = ctx.createRadialGradient(
        width * 0.5,
        height * 0.12,
        width * 0.04,
        width * 0.5,
        height * 0.12,
        width * 0.7
      );
      upperLift.addColorStop(0, rgba(94, 175, 119, 0.1));
      upperLift.addColorStop(0.35, rgba(58, 144, 84, 0.06));
      upperLift.addColorStop(1, rgba(0, 0, 0, 0));

      centerHaze = ctx.createRadialGradient(
        width * 0.46,
        height * 0.58,
        width * 0.04,
        width * 0.46,
        height * 0.58,
        width * 0.42
      );
      centerHaze.addColorStop(0, rgba(94, 175, 119, 0.09));
      centerHaze.addColorStop(0.45, rgba(58, 144, 84, 0.045));
      centerHaze.addColorStop(1, rgba(0, 0, 0, 0));

      lowerMist = ctx.createRadialGradient(
        width * 0.14,
        height * 0.9,
        width * 0.02,
        width * 0.14,
        height * 0.9,
        width * 0.3
      );
      lowerMist.addColorStop(0, rgba(184, 210, 192, 0.11));
      lowerMist.addColorStop(0.38, rgba(127, 167, 140, 0.07));
      lowerMist.addColorStop(1, rgba(0, 0, 0, 0));

      leftEdgeFeather = ctx.createLinearGradient(0, 0, width * 0.18, 0);
      leftEdgeFeather.addColorStop(0, rgba(0, 0, 0, 0.16));
      leftEdgeFeather.addColorStop(0.35, rgba(0, 0, 0, 0.05));
      leftEdgeFeather.addColorStop(1, rgba(0, 0, 0, 0));

      rightEdgeFeather = ctx.createLinearGradient(width * 0.82, 0, width, 0);
      rightEdgeFeather.addColorStop(0, rgba(0, 0, 0, 0));
      rightEdgeFeather.addColorStop(0.65, rgba(0, 0, 0, 0.05));
      rightEdgeFeather.addColorStop(1, rgba(0, 0, 0, 0.15));

      rightBloom = ctx.createRadialGradient(
        width * 0.93,
        height * 0.58,
        width * 0.02,
        width * 0.93,
        height * 0.58,
        width * 0.4
      );
      rightBloom.addColorStop(0, rgba(184, 210, 192, 0.3));
      rightBloom.addColorStop(0.22, rgba(127, 167, 140, 0.15));
      rightBloom.addColorStop(0.62, rgba(58, 144, 84, 0.06));
      rightBloom.addColorStop(1, rgba(0, 0, 0, 0));

      rightBloomSoft = ctx.createRadialGradient(
        width * 0.88,
        height * 0.52,
        width * 0.04,
        width * 0.88,
        height * 0.52,
        width * 0.52
      );
      rightBloomSoft.addColorStop(0, rgba(184, 210, 192, 0.12));
      rightBloomSoft.addColorStop(0.48, rgba(127, 167, 140, 0.08));
      rightBloomSoft.addColorStop(1, rgba(0, 0, 0, 0));

      lowerShadow = ctx.createLinearGradient(0, height * 0.45, 0, height);
      lowerShadow.addColorStop(0, rgba(0, 0, 0, 0));
      lowerShadow.addColorStop(1, rgba(0, 0, 0, 0.5));

      vignette = ctx.createRadialGradient(
        width * 0.52,
        height * 0.42,
        width * 0.18,
        width * 0.52,
        height * 0.42,
        width * 0.95
      );
      vignette.addColorStop(0, rgba(0, 0, 0, 0));
      vignette.addColorStop(1, rgba(0, 0, 0, 0.7));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      topField = null;
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

      if (!topField) rebuildStatics();

      ctx.fillStyle = topField!;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = atmosphericFalloff!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = upperLift!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = centerHaze!;
      ctx.fillRect(0, 0, width, height);

      const seamGlide = wander(time, 0.23, 0.11, 0.051, 1.6) * width * 0.018;
      const seamLift = wander(time, 0.17, 0.07, 0.031, 0.8) * height * 0.008;
      const bloomScale = 1 + wander(time, 0.16, 0.06, 0.027, 2.4) * 0.026;

      const waveColors = [
        [7, 17, 11],
        [27, 64, 39],
        [45, 110, 66],
        [58, 144, 84],
        [94, 175, 119],
      ];

      layers.forEach((layer, index) => {
        const offsetX = wander(
          time,
          0.09 + layer.driftX,
          0.043 + layer.driftX * 0.5,
          0.019 + layer.driftX * 0.2,
          layer.phase
        ) * width * layer.driftX;
        const offsetY = wander(
          time,
          0.07 + layer.driftY,
          0.031 + layer.driftY * 0.4,
          0.015 + layer.driftY * 0.2,
          layer.phase * 1.2
        ) * layer.driftY;
        ctx.save();
        ctx.translate(offsetX, offsetY * height);
        drawWavePath(ctx, width, height, {
          ...layer,
          phase:
            layer.phase +
            time * 0.028 * (index % 2 === 0 ? 1 : -0.62) +
            Math.sin(time * 0.06 + index) * 0.12,
          baseY:
            layer.baseY -
            Math.sin(time * (0.08 + index * 0.026)) * 0.008 -
            Math.sin(time * 0.034 + index * 1.7) * 0.005,
        }, time);

        const color = waveColors[Math.min(index, waveColors.length - 1)];
        ctx.clip();

        const softFill = ctx.createRadialGradient(
          width * (0.34 + index * 0.09) + wander(time, 0.11, 0.047, 0.019, index + 0.5) * width * 0.035,
          height * (0.66 + index * 0.04),
          width * 0.04,
          width * (0.34 + index * 0.09),
          height * (0.66 + index * 0.04),
          width * (0.46 - index * 0.035)
        );
        softFill.addColorStop(0, rgba(color[0], color[1], color[2], layer.alpha * 0.42));
        softFill.addColorStop(0.45, rgba(color[0], color[1], color[2], layer.alpha * 0.22));
        softFill.addColorStop(1, rgba(0, 0, 0, 0));

        const bodyFill = ctx.createLinearGradient(0, height * 0.26, width, height);
        bodyFill.addColorStop(0, rgba(color[0], color[1], color[2], layer.alpha * 0.18));
        bodyFill.addColorStop(0.42, rgba(color[0], color[1], color[2], layer.alpha * 0.56));
        bodyFill.addColorStop(1, rgba(0, 0, 0, layer.alpha * 0.08));

        ctx.filter = isLowPower ? "blur(18px)" : "blur(34px)";
        ctx.fillStyle = softFill;
        ctx.fillRect(-width * 0.12, -height * 0.08, width * 1.24, height * 1.18);

        ctx.filter = isLowPower ? "blur(8px)" : "blur(14px)";
        ctx.fillStyle = bodyFill;
        ctx.fillRect(-width * 0.1, -height * 0.08, width * 1.2, height * 1.16);

        const sheen = ctx.createLinearGradient(0, height * 0.34, width, height * 0.82);
        sheen.addColorStop(0, rgba(184, 210, 192, 0));
        sheen.addColorStop(0.3, rgba(184, 210, 192, layer.alpha * 0.08));
        sheen.addColorStop(0.55, rgba(184, 210, 192, layer.alpha * 0.035));
        sheen.addColorStop(1, rgba(184, 210, 192, 0));
        ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
        ctx.filter = isLowPower ? "blur(10px)" : "blur(18px)";
        ctx.fillStyle = sheen;
        ctx.fillRect(-width * 0.08, -height * 0.04, width * 1.16, height * 1.08);

        ctx.globalCompositeOperation = "source-over";
        ctx.filter = "none";
        ctx.restore();
      });

      ctx.save();
      ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
      for (let i = 0; i < (isLowPower ? 2 : 3); i++) {
        const glaze = ctx.createRadialGradient(
          width * (0.36 + i * 0.17) + wander(time, 0.13 + i * 0.02, 0.061, 0.023, i + 1.2) * width * 0.02,
          height * (0.58 + i * 0.08),
          width * 0.015,
          width * (0.36 + i * 0.17),
          height * (0.58 + i * 0.08),
          width * (0.22 + i * 0.04)
        );
        glaze.addColorStop(0, rgba(94, 175, 119, 0.07 - i * 0.012));
        glaze.addColorStop(0.4, rgba(58, 144, 84, 0.04 - i * 0.008));
        glaze.addColorStop(1, rgba(0, 0, 0, 0));
        ctx.fillStyle = glaze;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      const lowerBulge = ctx.createRadialGradient(
        width * 0.28 + wander(time, 0.21, 0.09, 0.041, 0.7) * width * 0.018,
        height * 0.86,
        width * 0.04,
        width * 0.28,
        height * 0.86,
        width * 0.48
      );
      lowerBulge.addColorStop(0, rgba(94, 175, 119, 0.18));
      lowerBulge.addColorStop(0.38, rgba(58, 144, 84, 0.1));
      lowerBulge.addColorStop(1, rgba(0, 0, 0, 0));
      ctx.fillStyle = lowerBulge;
      ctx.fillRect(0, height * 0.48, width, height * 0.6);
      ctx.fillStyle = lowerMist!;
      ctx.fillRect(0, height * 0.55, width, height * 0.45);

      ctx.save();
      ctx.globalCompositeOperation = isLowPower ? "screen" : "lighter";
      ctx.translate(seamGlide, seamLift);
      ctx.beginPath();
      ctx.moveTo(-width * 0.04, height * 0.572);
      ctx.bezierCurveTo(
        width * 0.16, height * 0.5,
        width * 0.34, height * 0.522,
        width * 0.5, height * 0.56
      );
      ctx.bezierCurveTo(
        width * 0.68, height * 0.603,
        width * 0.84, height * 0.55,
        width * 1.04, height * 0.51
      );
      ctx.lineWidth = isLowPower ? 4.5 : 7.5;
      ctx.strokeStyle = rgba(184, 210, 192, 0.08);
      ctx.shadowColor = rgba(184, 210, 192, 0.12);
      ctx.shadowBlur = isLowPower ? 12 : 22;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-width * 0.04, height * 0.565);
      ctx.bezierCurveTo(
        width * 0.16, height * 0.49,
        width * 0.34, height * 0.515,
        width * 0.5, height * 0.555
      );
      ctx.bezierCurveTo(
        width * 0.68, height * 0.598,
        width * 0.84, height * 0.545,
        width * 1.04, height * 0.505
      );
      ctx.lineWidth = isLowPower ? 1.2 : 1.55;
      ctx.strokeStyle = rgba(214, 232, 220, 0.72 + Math.sin(time * 0.37) * 0.03);
      ctx.shadowColor = rgba(184, 210, 192, 0.28);
      ctx.shadowBlur = isLowPower ? 8 : 14;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(-width * 0.012, height * 0.008);
      ctx.scale(bloomScale, bloomScale);
      ctx.fillStyle = rightBloom!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = rightBloomSoft!;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      ctx.fillStyle = leftEdgeFeather!;
      ctx.fillRect(0, 0, width * 0.18, height);
      ctx.fillStyle = rightEdgeFeather!;
      ctx.fillRect(width * 0.82, 0, width * 0.18, height);

      ctx.fillStyle = lowerShadow!;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = vignette!;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [blobCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", willChange: "transform" }}
    />
  );
}
