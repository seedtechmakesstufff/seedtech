"use client";

import { useQuoteFlow } from "@/components/quote-flow";
import type { ServicePath } from "@/components/quote-flow";

interface QuoteButtonProps {
  children: React.ReactNode;
  className?: string;
  service?: ServicePath;
  tier?: string;
}

/**
 * A button that opens the QuoteFlowModal when clicked.
 * Pass `tier` to skip the package selection step and pre-select a specific package.
 */
export function QuoteButton({ children, className, service, tier }: QuoteButtonProps) {
  const { openQuoteFlow } = useQuoteFlow();
  return (
    <button onClick={() => openQuoteFlow(service, tier)} className={className}>
      {children}
    </button>
  );
}
