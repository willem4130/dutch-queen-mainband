import type { MetadataRoute } from "next";

const BAND_API_URL =
  "https://dutch-queen-admin.vercel.app/api/bands/the-dutch-queen";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thedutchqueen.com";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#shows`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(BAND_API_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    const upcomingShows = data.shows?.upcoming || [];

    const showEntries: MetadataRoute.Sitemap = upcomingShows.map(() => ({
      url: `${baseUrl}/#shows`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticEntries, ...showEntries];
  } catch {
    return staticEntries;
  }
}
