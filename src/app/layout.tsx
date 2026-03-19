import type { Metadata } from "next";
import { Inter, League_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteFlowProvider, QuoteFlowModal } from "@/components/quote-flow";
import { PageBlurOverlay } from "@/components/layout/PageBlurOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeedTech | Premium IT Support, Web Development & Marketing",
  description:
    "Premium IT support, web development, and marketing solutions that help businesses grow. Based in Northern New Jersey.",
  verification: {
    google: "google9bb3425e79cd13be",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Admin routes render their own chrome (sidebar, topbar). Skip Navbar/Footer. */
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" className={`${inter.variable} ${leagueGothic.variable}`}>
      <body className="font-body">
        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is set */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        {isAdmin ? (
          children
        ) : (
          <QuoteFlowProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <QuoteFlowModal />
            <PageBlurOverlay />
          </QuoteFlowProvider>
        )}
      </body>
    </html>
  );
}
