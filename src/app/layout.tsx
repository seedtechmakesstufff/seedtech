import type { Metadata } from "next";
import { Inter, League_Gothic } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteFlowProvider, QuoteFlowModal } from "@/components/quote-flow";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${leagueGothic.variable}`}>
      <body className="font-body">
        <QuoteFlowProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <QuoteFlowModal />
        </QuoteFlowProvider>
      </body>
    </html>
  );
}
