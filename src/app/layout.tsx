import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/providers/AnalyticsProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { siteConfig, bandApiUrl } from "@/lib/site-config";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const SITE_URL = siteConfig.siteUrl;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(bandApiUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    const seo = data.profile?.seo || {};
    const home = seo.pages?.home || {};
    const geo = seo.geographic || {};
    const org = seo.structuredData?.organization || {};

    const title = home.metaTitle || seo.metaTitle || siteConfig.bandName;
    const description = home.metaDescription || seo.metaDescription || "";
    const canonicalUrl =
      home.canonicalUrl || org.url || SITE_URL;
    const ogImage = home.ogImage || seo.ogImage || "/og-image.jpg";
    const locale = geo.primaryLocale
      ? geo.primaryLocale.replace("-", "_")
      : "nl_NL";
    const twitterCard = seo.defaults?.twitterCard || "summary_large_image";

    return {
      metadataBase: new URL(org.url || SITE_URL),
      title: {
        default: title,
        template: `%s | ${siteConfig.bandName}`,
      },
      description,
      keywords: [
        ...(home.keywords || []),
        ...(seo.keywords || []),
      ].filter(
        (kw, i, arr) => arr.indexOf(kw) === i,
      ),
      authors: [{ name: data.profile?.name || siteConfig.bandName }],
      creator: data.profile?.name || siteConfig.bandName,
      publisher: data.profile?.name || siteConfig.bandName,
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
        siteName: data.profile?.name || siteConfig.bandName,
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${data.profile?.name || siteConfig.bandName} - Queen Tribute Band`,
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
      metadataBase: new URL(SITE_URL),
      title: {
        default: `${siteConfig.bandName} | Queen Tribute Band | Nederland`,
        template: `%s | ${siteConfig.bandName}`,
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
    name: siteConfig.bandName,
    url: SITE_URL,
    genre: ["Rock", "Tribute"],
    foundingDate: "2024",
  };
  let websiteJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.bandName,
    url: SITE_URL,
    inLanguage: "nl",
  };

  try {
    const res = await fetch(bandApiUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    const seo = data.profile?.seo || {};
    const mg = seo.structuredData?.musicGroup || {};
    const org = seo.structuredData?.organization || {};

    musicGroupJsonLd = {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: mg.name || data.profile?.name || siteConfig.bandName,
      url: org.url || SITE_URL,
      description: seo.metaDescription || "",
      genre: mg.genre || ["Rock", "Tribute"],
      foundingDate: mg.foundingDate || data.profile?.established || "2024",
      ...(mg.foundingLocation && {
        location: { "@type": "Country", name: mg.foundingLocation },
      }),
      image: `${org.url || SITE_URL}${seo.ogImage || "/og-image.jpg"}`,
      logo: org.logo || `${org.url || SITE_URL}/logo/hero-logo.png`,
      ...(org.contactPoint?.email && { email: org.contactPoint.email }),
      ...(org.sameAs &&
        org.sameAs.length > 0 && { sameAs: org.sameAs }),
    };

    websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: org.name || data.profile?.name || siteConfig.bandName,
      url: org.url || SITE_URL,
      description: `Official website van ${org.name || data.profile?.name || siteConfig.bandName} - Queen Tribute Band uit Nederland`,
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
