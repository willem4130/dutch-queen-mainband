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

export const metadata: Metadata = {
  metadataBase: new URL("https://thedutchqueen.com"),
  title: {
    default: "The Dutch Queen | Queen Tribute Band | Nederland",
    template: "%s | The Dutch Queen",
  },
  description:
    "The Dutch Queen brengt een eerbetoon aan Queen met zowel de grote hits als minder bekend materiaal. Vijf gepassioneerde muzikanten verenigd door hun liefde voor Queen.",
  keywords: [
    "Queen tribute",
    "tribute band",
    "Queen coverband",
    "The Dutch Queen",
    "live muziek",
    "rock band",
    "Nederland",
    "Bohemian Rhapsody",
    "Freddie Mercury tribute",
    "Queen tribute band Nederland",
    "live Queen muziek",
    "We Will Rock You",
  ],
  authors: [{ name: "The Dutch Queen" }],
  creator: "The Dutch Queen",
  publisher: "The Dutch Queen",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thedutchqueen.com",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://thedutchqueen.com",
    siteName: "The Dutch Queen",
    title: "The Dutch Queen | Queen Tribute Band | Nederland",
    description:
      "The Dutch Queen brengt een eerbetoon aan Queen met zowel de grote hits als minder bekend materiaal. Vijf gepassioneerde muzikanten verenigd door hun liefde voor Queen.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Dutch Queen - Queen Tribute Band",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dutch Queen | Queen Tribute Band | Nederland",
    description:
      "The Dutch Queen brengt een eerbetoon aan Queen met zowel de grote hits als minder bekend materiaal. Vijf gepassioneerde muzikanten verenigd door hun liefde voor Queen.",
    images: ["/og-image.jpg"],
  },
};

// JSON-LD structured data for MusicGroup schema
const musicGroupJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "The Dutch Queen",
  url: "https://thedutchqueen.com",
  description:
    "The Dutch Queen brengt een eerbetoon aan Queen met zowel de grote hits als minder bekend materiaal. Vijf gepassioneerde muzikanten verenigd door hun liefde voor Queen.",
  genre: ["Rock", "Tribute"],
  foundingDate: "2024",
  image: "https://thedutchqueen.com/og-image.jpg",
  logo: "https://thedutchqueen.com/logo/hero-logo.png",
  email: "info@thedutchqueen.nl",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61556052640523",
    "https://www.instagram.com/thedutchqueenunplugged/",
    "https://www.youtube.com/watch?v=VCv3TxE81uk",
  ],
  location: {
    "@type": "Country",
    name: "Nederland",
  },
};

// JSON-LD structured data for the website
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Dutch Queen",
  url: "https://thedutchqueen.com",
  description:
    "Official website van The Dutch Queen - Queen Tribute Band uit Nederland",
  inLanguage: "nl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="overflow-x-hidden">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(musicGroupJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
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
