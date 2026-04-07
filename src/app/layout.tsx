import type { Metadata } from "next";
import { Inter, League_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";

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
  metadataBase: new URL("https://seedtechllc.com"),
  title: {
    default: "SeedTech | Premium IT Support, Web Development & SEO",
    template: "%s — SeedTech",
  },
  description:
    "Premium IT support, web development, and SEO solutions that help businesses grow. Based in New Jersey & California.",
  openGraph: {
    type: "website",
    siteName: "SeedTech",
    locale: "en_US",
    url: "https://seedtechllc.com",
    title: "SeedTech | Premium IT Support, Web Development & SEO",
    description:
      "Premium IT support, web development, and SEO solutions that help businesses grow. Based in New Jersey & California.",
    images: [
      {
        url: "/og-image-placeholder.png",
        width: 1200,
        height: 630,
        alt: "SeedTech — IT Support, Web Development & SEO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SeedTech | Premium IT Support, Web Development & SEO",
    description:
      "Premium IT support, web development, and SEO solutions that help businesses grow.",
    images: ["/og-image-placeholder.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "google9bb3425e79cd13be",
  },
  alternates: {
    canonical: "https://seedtechllc.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${inter.variable} ${leagueGothic.variable}`}>
      <head>
        {/* Global Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SeedTech",
              legalName: "SeedTech LLC",
              url: "https://seedtechllc.com",
              logo: "https://seedtechllc.com/img/seed graphics/seedtech_logo_white.webp",
              description:
                "Premium IT support, web development, and SEO solutions for growing businesses.",
              foundingDate: "2019",
              founders: [
                { "@type": "Person", name: "Matt Oliva", jobTitle: "CEO & Director of Managed IT" },
                { "@type": "Person", name: "Sam Swaynos", jobTitle: "Co-Owner & Product Director" },
              ],
              address: [
                {
                  "@type": "PostalAddress",
                  addressRegion: "NJ",
                  addressCountry: "US",
                },
                {
                  "@type": "PostalAddress",
                  addressRegion: "CA",
                  addressCountry: "US",
                },
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-201-620-9002",
                contactType: "sales",
                availableLanguage: "English",
              },
              sameAs: [
                "https://www.linkedin.com/company/seedtechllc",
                "https://www.instagram.com/seedtechllc",
                "https://www.facebook.com/seedtechllc",
              ],
              service: [
                { "@type": "Service", name: "Managed IT Support" },
                { "@type": "Service", name: "Web Development" },
                { "@type": "Service", name: "Ecommerce Development" },
                { "@type": "Service", name: "Custom Software Development" },
                { "@type": "Service", name: "SEO Autopilot" },
              ],
            }),
          }}
        />
      </head>
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
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
