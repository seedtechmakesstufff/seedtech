"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LiquidGlassBackground — multi-hue fluid blend field.

   This canvas intentionally avoids a single "bottom blob" silhouette.
   Instead, it layers randomized drifting color fields and wide wave ribbons
   so blending happens across the full viewport.
   ═══════════════════════════════════════════════════════════════════════════ */

/** A drifting radial light field */
interface ColorField {
  bx: number;
  by: number;
  driftX: number;
  driftY: number;
  spdX: number;
  spdY: number;
  size: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
  feather: number;
  mouseWeight: number;
}

interface WaveRibbon {
  baseY: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  thickness: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
}

interface LiquidGlassBackgroundProps {
  className?: string;
  blobCount?: number;
  mouseStrength?: number;
  mouseRadius?: number;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

export default function LiquidGlassBackground({
  className = "",
  blobCount = 10,
  mouseStrength = 0.18,
  mouseRadius = 0.3,
}: LiquidGlassBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, smoothX: -9999, smoothY: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // SeedTech-first palette: emerald + mint + cyan, with restrained blue support.
    const huePool = [128, 136, 146, 158, 170, 188, 206];
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const rnd = makeRng(seed);

    const fields: ColorField[] = Array.from({ length: clamp(blobCount, 7, 18) }, (_, i) => {
      const hueBase = huePool[i % huePool.length] + (rnd() - 0.5) * 12;
      return {
        bx: 0.08 + rnd() * 0.84,
        by: 0.07 + rnd() * 0.86,
        driftX: 0.03 + rnd() * 0.07,
        driftY: 0.03 + rnd() * 0.07,
        spdX: 0.08 + rnd() * 0.22,
        spdY: 0.08 + rnd() * 0.22,
        size: 0.24 + rnd() * 0.34,
        hue: hueBase,
        sat: 68 + rnd() * 20,
        light: 36 + rnd() * 16,
        alpha: 0.025 + rnd() * 0.035,
        feather: 0.38 + rnd() * 0.26,
        mouseWeight: 0.3 + rnd() * 0.7,
      };
    });

    const ribbons: WaveRibbon[] = Array.from({ length: 7 }, () => ({
      baseY: 0.08 + rnd() * 0.84,
      amp: 0.04 + rnd() * 0.09,
      freq: 0.8 + rnd() * 2.2,
      speed: 0.08 + rnd() * 0.2,
      phase: rnd() * Math.PI * 2,
      thickness: 0.12 + rnd() * 0.22,
      hue: huePool[Math.floor(rnd() * huePool.length)] + (rnd() - 0.5) * 10,
      sat: 72 + rnd() * 18,
      light: 44 + rnd() * 20,
      alpha: 0.016 + rnd() * 0.02,
    }));

    let time = 0;

    const draw = () => {
      if (w === 0) { rafRef.current = requestAnimationFrame(draw); return; }

      time += 0.016;

      // Smooth mouse
      const m = mouseRef.current;
      if (m.x > -5000) {
        m.smoothX += (m.x - m.smoothX) * 0.04;
        m.smoothY += (m.y - m.smoothY) * 0.04;
      } else {
        m.smoothX += (-9999 - m.smoothX) * 0.01;
        m.smoothY += (-9999 - m.smoothY) * 0.01;
      }
      const mouseNX = m.smoothX > -5000 ? m.smoothX / w : -9999;
      const mouseNY = m.smoothX > -5000 ? m.smoothY / h : -9999;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep green base with subtle cool support so the scene stays brand-led.
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#010203");
      base.addColorStop(0.32, "#030e09");
      base.addColorStop(0.68, "#061d15");
      base.addColorStop(1, "#040f14");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      const mintLift = ctx.createRadialGradient(
        w * 0.24, h * 0.22, w * 0.06,
        w * 0.24, h * 0.22, w * 0.62
      );
      mintLift.addColorStop(0, "rgba(100, 255, 170, 0.04)");
      mintLift.addColorStop(0.55, "rgba(56, 200, 130, 0.018)");
      mintLift.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mintLift;
      ctx.fillRect(0, 0, w, h);

      const coolLift = ctx.createRadialGradient(
        w * 0.84, h * 0.14, w * 0.04,
        w * 0.84, h * 0.14, w * 0.58
      );
      coolLift.addColorStop(0, "rgba(120, 185, 255, 0.028)");
      coolLift.addColorStop(0.62, "rgba(58, 128, 225, 0.012)");
      coolLift.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coolLift;
      ctx.fillRect(0, 0, w, h);

      // Randomized wave ribbons so movement and blend are full-canvas.
      ctx.globalCompositeOperation = "screen";
      for (const r of ribbons) {
        const yAt = (x: number) => {
          const nx = x / w;
          const main = Math.sin(nx * Math.PI * r.freq + time * r.speed + r.phase);
          const ripple = Math.sin(nx * Math.PI * (r.freq * 1.9) - time * (r.speed * 0.45) + r.phase * 0.7);
          return (r.baseY + main * r.amp + ripple * (r.amp * 0.32)) * h;
        };

        ctx.beginPath();
        ctx.moveTo(0, yAt(0));
        const segments = 12;
        for (let i = 0; i < segments; i++) {
          const x0 = (i / segments) * w;
          const x1 = ((i + 1) / segments) * w;
          const y0 = yAt(x0);
          const y1 = yAt(x1);
          const cx = (x0 + x1) / 2;
          ctx.bezierCurveTo(cx, y0, cx, y1, x1, y1);
        }

        for (let i = segments; i >= 0; i--) {
          const x = (i / segments) * w;
          ctx.lineTo(x, yAt(x) + r.thickness * h);
        }
        ctx.closePath();

        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, hsla(r.hue - 8, r.sat, r.light - 8, r.alpha * 0.6));
        g.addColorStop(0.5, hsla(r.hue, r.sat, r.light, r.alpha));
        g.addColorStop(1, hsla(r.hue + 8, r.sat, r.light + 6, r.alpha * 0.75));

        ctx.fillStyle = g;
        ctx.fill();
      }

      // Drifting color fields add soft, non-uniform hue intersections.
      ctx.globalCompositeOperation = "lighter";

      for (const p of fields) {
        let cx = (p.bx + Math.sin(time * p.spdX) * p.driftX) * w;
        let cy = (p.by + Math.cos(time * p.spdY) * p.driftY) * h;

        if (mouseNX > -1) {
          const dx = cx / w - mouseNX;
          const dy = cy / h - mouseNY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = clamp(mouseRadius, 0.16, 0.6);
          if (dist < radius) {
            const push = Math.pow(1 - dist / radius, 2) * clamp(mouseStrength, 0, 0.6) * p.mouseWeight;
            cx += (dx / (dist + 0.001)) * push * w;
            cy += (dy / (dist + 0.001)) * push * h;
          }
        }

        const r = p.size * w;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, hsla(p.hue + 4, p.sat, p.light + 10, p.alpha));
        grad.addColorStop(p.feather, hsla(p.hue, p.sat, p.light, p.alpha * 0.62));
        grad.addColorStop(1, hsla(p.hue - 8, p.sat, p.light - 16, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = "source-over";

      // Specular sweeps to mimic smooth highlights crossing the scene.
      ctx.globalCompositeOperation = "screen";
      const sweepA = ctx.createLinearGradient(0, h * 0.15, w, h * 0.55);
      sweepA.addColorStop(0, "rgba(240, 255, 248, 0)");
      sweepA.addColorStop(0.42, "rgba(186, 248, 220, 0.032)");
      sweepA.addColorStop(0.72, "rgba(150, 222, 255, 0.016)");
      sweepA.addColorStop(1, "rgba(240, 255, 248, 0)");
      ctx.fillStyle = sweepA;
      ctx.fillRect(0, 0, w, h);

      const sweepB = ctx.createLinearGradient(0, h * 0.65, w, h * 0.2);
      sweepB.addColorStop(0, "rgba(255, 255, 255, 0)");
      sweepB.addColorStop(0.5, "rgba(120, 225, 190, 0.018)");
      sweepB.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sweepB;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";

      // Soft vignette for depth, without creating a bottom-anchored mass.
      const vigGrad = ctx.createRadialGradient(
        w * 0.52, h * 0.46, w * 0.2,
        w * 0.52, h * 0.46, w * 0.92
      );
      vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Extra low-lift dark wash to keep the whole scene moodier.
      const darkWash = ctx.createLinearGradient(0, 0, 0, h);
      darkWash.addColorStop(0, "rgba(0, 0, 0, 0.42)");
      darkWash.addColorStop(0.45, "rgba(0, 0, 0, 0.32)");
      darkWash.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = darkWash;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [blobCount, mouseRadius, mouseStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
