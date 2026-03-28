"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ServicePath } from "./types";

interface QuoteFlowContextValue {
  isOpen: boolean;
  preselectedService: ServicePath | null;
  preselectedTier: string | null;
  openQuoteFlow: (service?: ServicePath, tier?: string) => void;
  closeQuoteFlow: () => void;
}

const QuoteFlowContext = createContext<QuoteFlowContextValue | null>(null);

export function QuoteFlowProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServicePath | null>(null);
  const [preselectedTier, setPreselectedTier] = useState<string | null>(null);

  const openQuoteFlow = useCallback((service?: ServicePath, tier?: string) => {
    setPreselectedService(service ?? null);
    setPreselectedTier(tier ?? null);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeQuoteFlow = useCallback(() => {
    setIsOpen(false);
    setPreselectedService(null);
    setPreselectedTier(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <QuoteFlowContext.Provider
      value={{ isOpen, preselectedService, preselectedTier, openQuoteFlow, closeQuoteFlow }}
    >
      {children}
    </QuoteFlowContext.Provider>
  );
}

export function useQuoteFlow() {
  const ctx = useContext(QuoteFlowContext);
  if (!ctx) {
    throw new Error("useQuoteFlow must be used within a QuoteFlowProvider");
  }
  return ctx;
}
