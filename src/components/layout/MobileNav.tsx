"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface MobileNavItem {
  label: string;
  href: string;
  /** React node icon shown before label on root page */
  iconNode?: React.ReactNode;
  /** Sub-items with rich card display */
  children?: {
    label: string;
    href: string;
    description?: string;
  }[];
  /** Featured image cards shown below children */
  featuredCards?: {
    title: string;
    description: string;
    href: string;
    image: string;
  }[];
}

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  logoUrl?: string;
  logoAlt?: string;
  /** CTA button config */
  cta?: {
    label: string;
    onClick: () => void;
  };
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export function MobileNav({ open, onClose, items, logoUrl, logoAlt = "Logo", cta }: MobileNavProps) {
  const [activeSub, setActiveSub] = useState<MobileNavItem | null>(null);

  const handleClose = () => {
    setActiveSub(null);
    onClose();
  };

  const handleLinkClick = (href: string) => {
    handleClose();
    window.location.href = href;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0f] md:hidden"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Header: logo + close */}
          <div className="flex items-center justify-between px-6 h-16 shrink-0">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={140}
                height={32}
                className="h-6 w-auto object-contain"
              />
            )}
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <AnimatePresence mode="wait">
              {activeSub ? (
                /* ─── Sub-page ─── */
                <motion.div
                  key="sub"
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 80, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  {/* Back breadcrumb */}
                  <button
                    onClick={() => setActiveSub(null)}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors mb-5"
                  >
                    <span>Back</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/60">{activeSub.label}</span>
                  </button>

                  {/* Rich children cards */}
                  <div className="flex flex-col gap-2">
                    {activeSub.children?.map((child) => (
                      <button
                        key={child.href}
                        onClick={() => handleLinkClick(child.href)}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-left"
                      >
                        <div>
                          <p className="text-[14px] font-semibold text-white leading-tight">{child.label}</p>
                          {child.description && (
                            <p className="text-[12px] text-white/40 leading-relaxed mt-0.5 line-clamp-2">{child.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Featured image cards */}
                  {activeSub.featuredCards && activeSub.featuredCards.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      {activeSub.featuredCards.map((card) => (
                        <button
                          key={card.href}
                          onClick={() => handleLinkClick(card.href)}
                          className="relative flex flex-col justify-end rounded-xl overflow-hidden aspect-[3/4] text-left"
                        >
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover opacity-80"
                            sizes="45vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/50 to-transparent" />
                          <div className="relative z-10 p-3.5">
                            <p className="text-[13px] font-semibold text-white leading-tight">{card.title}</p>
                            <p className="text-[11px] text-white/50 leading-snug mt-1 line-clamp-2">{card.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                /* ─── Root page ─── */
                <motion.div
                  key="root"
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  <nav className="flex flex-col gap-1 mt-4">
                    {items.map((item) => {
                      const hasChildren = Boolean(item.children?.length);
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (hasChildren) {
                              setActiveSub(item);
                            } else {
                              handleLinkClick(item.href);
                            }
                          }}
                          className={cn(
                            "flex items-center w-full py-3.5 text-left transition-colors",
                            "text-[15px] font-medium text-white/70 hover:text-white"
                          )}
                        >
                          {item.iconNode && (
                            <span className="mr-2 flex items-center">{item.iconNode}</span>
                          )}
                          <span>{item.label}</span>
                          {hasChildren && (
                            <ChevronRight className="w-4 h-4 ml-auto text-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* CTA button */}
                  {cta && (
                    <button
                      onClick={() => {
                        cta.onClick();
                        handleClose();
                      }}
                      className="mt-6 inline-flex items-center px-6 py-3 text-[14px] font-semibold text-white bg-seed-600 hover:bg-seed-500 rounded-xl transition-colors"
                    >
                      {cta.label}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
