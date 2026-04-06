import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/providers/AnalyticsProvider";
import { CookieConsent } from "@/components/CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const BAND_API_URL =
  "https://dutch-queen-admin.vercel.app/api/bands/the-dutch-queen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(BAND_API_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    const seo = data.profile?.seo || {};
    const home = seo.pages?.home || {};
    const geo = seo.geographic || {};
    const org = seo.structuredData?.organization || {};

    const title = home.metaTitle || seo.metaTitle || "The Dutch Queen";
    const description = home.metaDescription || seo.metaDescription || "";
    const canonicalUrl =
      home.canonicalUrl || org.url || "https://thedutchqueen.com";
    const ogImage = home.ogImage || seo.ogImage || "/og-image.jpg";
    const locale = geo.primaryLocale
      ? geo.primaryLocale.replace("-", "_")
      : "nl_NL";
    const twitterCard = seo.defaults?.twitterCard || "summary_large_image";

    return {
      metadataBase: new URL(org.url || "https://thedutchqueen.com"),
      title: {
        default: title,
        template: "%s | The Dutch Queen",
      },
      description,
      keywords: [
        ...(home.keywords || []),
        ...(seo.keywords || []),
      ].filter(
        (kw, i, arr) => arr.indexOf(kw) === i,
      ),
      authors: [{ name: data.profile?.name || "The Dutch Queen" }],
      creator: data.profile?.name || "The Dutch Queen",
      publisher: data.profile?.name || "The Dutch Queen",
      robots: {
        index: home.noIndex !== true,
        follow: home.noFollow !== true,
        googleBot: {
          index: home.noIndex !== true,
          follow: home.noFollow !== true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        locale,
        url: canonicalUrl,
        siteName: data.profile?.name || "The Dutch Queen",
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${data.profile?.name || "The Dutch Queen"} - Queen Tribute Band`,
            type: "image/jpeg",
          },
        ],
      },
      twitter: {
        card: twitterCard as "summary_large_image" | "summary",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      metadataBase: new URL("https://thedutchqueen.com"),
      title: {
        default: "The Dutch Queen | Queen Tribute Band | Nederland",
        template: "%s | The Dutch Queen",
      },
      description:
        "The Dutch Queen brengt een eerbetoon aan Queen met zowel de grote hits als minder bekend materiaal.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let musicGroupJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "The Dutch Queen",
    url: "https://thedutchqueen.com",
    genre: ["Rock", "Tribute"],
    foundingDate: "2024",
  };
  let websiteJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Dutch Queen",
    url: "https://thedutchqueen.com",
    inLanguage: "nl",
  };

  try {
    const res = await fetch(BAND_API_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    const seo = data.profile?.seo || {};
    const mg = seo.structuredData?.musicGroup || {};
    const org = seo.structuredData?.organization || {};

    musicGroupJsonLd = {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: mg.name || data.profile?.name || "The Dutch Queen",
      url: org.url || "https://thedutchqueen.com",
      description: seo.metaDescription || "",
      genre: mg.genre || ["Rock", "Tribute"],
      foundingDate: mg.foundingDate || data.profile?.established || "2024",
      ...(mg.foundingLocation && {
        location: { "@type": "Country", name: mg.foundingLocation },
      }),
      image: `${org.url || "https://thedutchqueen.com"}${seo.ogImage || "/og-image.jpg"}`,
      logo: org.logo || `${org.url || "https://thedutchqueen.com"}/logo/hero-logo.png`,
      ...(org.contactPoint?.email && { email: org.contactPoint.email }),
      ...(org.sameAs &&
        org.sameAs.length > 0 && { sameAs: org.sameAs }),
    };

    websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: org.name || data.profile?.name || "The Dutch Queen",
      url: org.url || "https://thedutchqueen.com",
      description: `Official website van ${org.name || data.profile?.name || "The Dutch Queen"} - Queen Tribute Band uit Nederland`,
      inLanguage: seo.geographic?.primaryLocale?.split("-")[0] || "nl",
    };
  } catch {
    // Fallback JSON-LD already set above
  }

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
