"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */

export interface HoverTarget {
  text: string;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
}

interface HoverPreviewProps {
  /** Text with {0}, {1}, etc. placeholders for targets */
  content: string;
  targets: HoverTarget[];
  /** Position of the preview image relative to target */
  imagePosition?: "above" | "below";
  /** Animation speeds in seconds */
  enterSpeed?: number;
  exitSpeed?: number;
  /** Max rotation (degrees) for the floating image */
  maxRotation?: number;
  /** Max pixel offset as cursor moves within the target */
  maxOffset?: number;
  /** Image dimensions */
  imageWidth?: number;
  imageHeight?: number;
  /** Border radius CSS value */
  imageBorderRadius?: string;
  /** Show shadow on the image */
  showImageShadow?: boolean;
  /** Container className */
  className?: string;
  /** Target text className */
  targetClassName?: string;
}

/* ── Component ── */

export function HoverPreview({
  content,
  targets,
  imagePosition = "above",
  enterSpeed = 0.2,
  exitSpeed = 0.15,
  maxRotation = 10,
  maxOffset = 12,
  imageWidth = 260,
  imageHeight = 160,
  imageBorderRadius = "0.75rem",
  showImageShadow = true,
  className = "",
  targetClassName = "",
}: HoverPreviewProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      const el = targetRefs.current[index];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Normalized -1 to 1 within the target element
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x: nx, y: ny });
    },
    []
  );

  // Split content by {0}, {1}, etc. into parts
  const parts = content.split(/(\{\d+\})/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\{(\d+)\}$/);
        if (!match) return <span key={i}>{part}</span>;

        const targetIdx = parseInt(match[1], 10);
        const target = targets[targetIdx];
        if (!target) return <span key={i}>{part}</span>;

        const isActive = activeIndex === targetIdx;
        const rotation = isActive ? mousePos.x * maxRotation : 0;
        const offsetX = isActive ? mousePos.x * maxOffset : 0;
        const offsetY = isActive ? mousePos.y * (maxOffset * 0.5) : 0;

        const inner = (
          <span
            key={i}
            ref={(el) => { targetRefs.current[targetIdx] = el; }}
            className={`relative inline-block cursor-pointer ${targetClassName}`}
            onMouseEnter={() => setActiveIndex(targetIdx)}
            onMouseLeave={() => setActiveIndex(null)}
            onMouseMove={(e) => handleMouseMove(e, targetIdx)}
          >
            {/* The hoverable text */}
            <span className="relative z-10 border-b-2 border-seed-500/40 hover:border-seed-500 transition-colors duration-200">
              {target.text}
            </span>

            {/* Floating image preview */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: imagePosition === "above" ? 10 : -10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: offsetX,
                    rotate: rotation,
                    translateY: offsetY,
                  }}
                  exit={{ opacity: 0, scale: 0.85, y: imagePosition === "above" ? 10 : -10 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    opacity: { duration: isActive ? enterSpeed : exitSpeed },
                  }}
                  className="absolute z-50 pointer-events-none"
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                    left: "50%",
                    marginLeft: -(imageWidth / 2),
                    ...(imagePosition === "above"
                      ? { bottom: "100%", marginBottom: 12 }
                      : { top: "100%", marginTop: 12 }),
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      borderRadius: imageBorderRadius,
                      boxShadow: showImageShadow
                        ? "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.08)"
                        : undefined,
                    }}
                  >
                    <Image
                      src={target.imageUrl}
                      alt={target.altText || target.text}
                      fill
                      className="object-cover"
                      sizes={`${imageWidth}px`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        );

        // Wrap in Link if linkUrl provided
        if (target.linkUrl) {
          return (
            <Link key={i} href={target.linkUrl} className="inline">
              {inner}
            </Link>
          );
        }

        return inner;
      })}
    </span>
  );
}
