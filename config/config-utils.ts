/**
 * Band content utilities (server-side)
 *
 * getBandData() fetches the band API once per render (Next dedupes identical
 * fetches and caches them for 5 minutes) and returns content, shows and gallery
 * in the shape the components expect. If the CMS is disabled or the API fails,
 * everything falls back to the bundled JSON/config.
 *
 * ARCHITECTURE NOTE:
 * This site is configured as a single-band website for "The Dutch Queen".
 * Fallback content is imported from the /content/bands/the-dutch-queen/ directory.
 */

import { defaultConfig } from "./band.config";
import { siteConfig } from "../src/lib/site-config";
// Single-band content imports - hardcoded for The Dutch Queen
import bandProfile from "../content/bands/the-dutch-queen/band-profile.json";
import aboutData from "../content/bands/the-dutch-queen/data/about.json";
import showsFallback from "../content/bands/the-dutch-queen/data/shows.json";

// ================================
// TYPES
// ================================

export interface BandContentData {
  bandName: string;
  tagline: string;
  description: {
    short: string;
    medium: string;
    long: string;
  };
  social: Record<string, string>;
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface ShowData {
  date: string;
  time: string;
  venue: string;
  city: string;
  status: string;
  ticketUrl?: string;
}

export interface ShowsData {
  upcoming: ShowData[];
  past: ShowData[];
  settings: {
    showPastShows: boolean;
    maxUpcomingDisplay: number;
    maxPastDisplay: number;
    autoArchiveAfterDays: number;
  };
}

/**
 * Gallery image format for frontend
 */
export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  // Grid layout fields for custom bento grid positioning
  displayOrder?: number;
  gridRow?: number;
  gridColumn?: number;
  gridSpan?: number;
  hasCustomLayout?: boolean; // True when admin has set custom grid positions
}

export interface BandData {
  content: BandContentData;
  shows: ShowsData;
  gallery: { images: GalleryImage[] };
}

/**
 * API show format (from backend)
 */
interface ApiShow {
  date: string;
  time: string;
  venue: {
    name: string;
    city: string;
    country: string;
  };
  ticketUrl: string;
  soldOut: boolean;
}

/**
 * API media item format (from backend gallery)
 */
interface ApiMediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  altText?: string;
  description?: string;
  type: string;
  category?: string;
  tags: string[];
  width?: number;
  height?: number;
  // Grid layout fields
  displayOrder?: number;
  gridRow?: number;
  gridColumn?: number;
  gridSpan?: number;
  hasCustomLayout?: boolean;
}

const DEFAULT_SHOW_SETTINGS: ShowsData["settings"] = {
  showPastShows: true,
  maxUpcomingDisplay: 10,
  maxPastDisplay: 5,
  autoArchiveAfterDays: 7,
};

// ================================
// BUNDLED FALLBACKS
// ================================

/**
 * Band content from the bundled JSON/config (used when the CMS is unavailable)
 */
function getBandContent(): BandContentData {
  return {
    bandName: bandProfile.name || siteConfig.bandName,
    tagline: bandProfile.tagline || "Een ode aan Queen",
    description: {
      short: aboutData.descriptions.short,
      medium: aboutData.descriptions.medium,
      long: aboutData.descriptions.long,
    },
    social: defaultConfig.content.social || {},
    contact: defaultConfig.content.contact || { email: "" },
  };
}

function getShowsFallback(): ShowsData {
  return showsFallback as ShowsData;
}

function getGalleryFallback(): { images: GalleryImage[] } {
  const localImages = defaultConfig.media?.gallery?.images || [];
  return {
    images: localImages.map((filename: string) => ({
      src: `/gallery/${filename}`,
      alt: "Gallery image",
    })),
  };
}

// ================================
// API TRANSFORMS
// ================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiBand = any;

function contentFromApi(data: ApiBand): BandContentData {
  return {
    bandName: data.profile?.name || siteConfig.bandName,
    tagline: data.profile?.tagline || "Een ode aan Queen",
    description: {
      short: data.about?.descriptions?.short || "",
      medium: data.about?.descriptions?.medium || "",
      long: data.about?.descriptions?.long || "",
    },
    social: data.social || {},
    contact: {
      email: data.contact?.email || "",
      phone: data.contact?.phone,
      address: data.contact?.address,
    },
  };
}

function showsFromApi(data: ApiBand): ShowsData {
  // API returns shows in different format than frontend expects
  // Need to transform: {venue: {name, city}, soldOut: boolean}
  // To: {venue: string, city: string, status: string}
  const transformShow = (show: ApiShow): ShowData => ({
    date: show.date,
    time: show.time,
    venue: show.venue.name,
    city: show.venue.city,
    status: show.soldOut ? "sold-out" : "tickets",
    ticketUrl: show.ticketUrl,
  });

  const allShows = data.shows || { upcoming: [], past: [] };

  // Trust the API's categorization (based on isPast field in database)
  // Don't re-filter by date - the admin controls what's upcoming/past
  return {
    upcoming: [...(allShows.upcoming || [])]
      .sort(
        (a: ApiShow, b: ApiShow) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      .map(transformShow),
    past: [...(allShows.past || [])]
      .sort(
        (a: ApiShow, b: ApiShow) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .map(transformShow),
    settings: allShows.settings || DEFAULT_SHOW_SETTINGS,
  };
}

function galleryFromApi(data: ApiBand): { images: GalleryImage[] } {
  // Transform API format to frontend format
  const images: GalleryImage[] = (data.gallery?.images || []).map(
    (item: ApiMediaItem) => ({
      src: item.url,
      alt: item.altText || item.title || item.description || "Gallery image",
      width: item.width,
      height: item.height,
      displayOrder: item.displayOrder,
      gridRow: item.gridRow,
      gridColumn: item.gridColumn,
      gridSpan: item.gridSpan,
      hasCustomLayout: item.hasCustomLayout,
    }),
  );

  // Sort by displayOrder if present
  images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return { images };
}

// ================================
// SERVER DATA LOADER
// ================================

/**
 * Fetch band content, shows and gallery from the CMS API (one request,
 * cached 5 minutes), falling back to the bundled JSON on any failure.
 * Server-only: call from server components (layout/page).
 */
export async function getBandData(): Promise<BandData> {
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL;
  const useCMS = process.env.NEXT_PUBLIC_USE_CMS === "true";

  if (useCMS && apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/bands/${siteConfig.bandId}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: contentFromApi(data),
        shows: showsFromApi(data),
        gallery: galleryFromApi(data),
      };
    } catch (error) {
      console.error(
        "Failed to fetch band data from API, using fallback:",
        error,
      );
      // Fall through to bundled fallback
    }
  }

  return {
    content: getBandContent(),
    shows: getShowsFallback(),
    gallery: getGalleryFallback(),
  };
}
