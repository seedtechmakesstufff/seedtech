"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { QuoteFlowProvider, QuoteFlowModal } from "@/components/quote-flow";
import { PageBlurOverlay } from "./PageBlurOverlay";

/** Renders Navbar + Footer + modals for all non-admin routes. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isIntake = pathname.startsWith("/intake");
  const isSalesRepPage = pathname.startsWith("/work-with-seedtech");

  if (isAdmin || isIntake) {
    return <>{children}</>;
  }

  return (
    <QuoteFlowProvider>
      <Navbar />
      <main>{children}</main>
      <Footer variant={isSalesRepPage ? "compact" : "default"} />
      <QuoteFlowModal />
      {!isSalesRepPage && <PageBlurOverlay />}
    </QuoteFlowProvider>
  );
}
