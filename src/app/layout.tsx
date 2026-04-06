import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/providers/AnalyticsProvider";
import { CookieConsent } from "@/components/CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Static metadata with fallback values
export const metadata: Metadata = {
  title: "The Dutch Queen | Official Website",
  description:
    "Official website of The Dutch Queen - Europe's Premier Queen Tribute Band",
  keywords: ["Queen", "tribute band", "live music", "Dutch Queen"],
  openGraph: {
    title: "The Dutch Queen | Official Website",
    description:
      "Official website of The Dutch Queen - Europe's Premier Queen Tribute Band",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dutch Queen | Official Website",
    description:
      "Official website of The Dutch Queen - Europe's Premier Queen Tribute Band",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} overflow-x-hidden bg-black font-sans text-white antialiased`}
      >
        <AnalyticsProvider>
          <Navigation />
          <main className="min-h-screen overflow-x-hidden">{children}</main>
          <Footer />
          <CookieConsent />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
