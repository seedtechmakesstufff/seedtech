"use client";

import { useQuoteFlow } from "@/components/quote-flow";
import type { ServicePath } from "@/components/quote-flow";

interface QuoteButtonProps {
  children: React.ReactNode;
  className?: string;
  service?: ServicePath;
}

/**
 * A button that opens the QuoteFlowModal when clicked.
 * Use this in both server and client components.
 */
export function QuoteButton({ children, className, service }: QuoteButtonProps) {
  const { openQuoteFlow } = useQuoteFlow();
  return (
    <button onClick={() => openQuoteFlow(service)} className={className}>
      {children}
    </button>
  );
}
