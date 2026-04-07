/**
 * Site configuration — single source of truth for all site-specific values.
 * When cloning this frontend for a new band, only this file and .env.local need to change.
 */

export const siteConfig = {
  bandId: process.env.NEXT_PUBLIC_BAND_ID || "the-dutch-queen",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://thedutchqueen.com",
  apiUrl: process.env.NEXT_PUBLIC_CMS_API_URL || "https://dutch-queen-admin.vercel.app/api",
  bandName: process.env.NEXT_PUBLIC_BAND_NAME || "The Dutch Queen",
  siteToggle: {
    fullbandUrl: process.env.NEXT_PUBLIC_FULLBAND_URL || "https://www.thedutchqueen.com",
    unpluggedUrl: process.env.NEXT_PUBLIC_UNPLUGGED_URL || "https://www.thedutchqueenunplugged.com",
  },
} as const;

/** Full API URL for the band endpoint */
export const bandApiUrl = `${siteConfig.apiUrl}/bands/${siteConfig.bandId}`;
