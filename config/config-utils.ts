/**
 * Configuration Utilities for Band Website Framework
 *
 * This module provides utilities to:
 * 1. Load and validate configuration
 * 2. Generate CSS variables from config
 * 3. Apply parameter-driven styling
 * 4. Handle Queen Claude integration
 *
 * ARCHITECTURE NOTE:
 * This site is configured as a single-band website for "The Dutch Queen".
 * Content is directly imported from the /content/bands/the-dutch-queen/ directory.
 * The original multi-band template structure has been removed in favor of this
 * dedicated single-band implementation.
 */

import { BandWebsiteConfig, defaultConfig, genrePresets } from "./band.config";
// Single-band content imports - hardcoded for The Dutch Queen
import bandProfile from "../content/bands/the-dutch-queen/band-profile.json";
import aboutData from "../content/bands/the-dutch-queen/data/about.json";
// Shows data now loaded from API (see getShowsData function below)

// Re-export types for convenience
export type { BandWebsiteConfig };

// ================================
// CONFIGURATION LOADING
// ================================

let currentConfig: BandWebsiteConfig = defaultConfig;

/**
 * Load configuration from various sources
 */
export function loadConfig(
  configOverride?: Partial<BandWebsiteConfig>,
): BandWebsiteConfig {
  try {
    // Merge with defaults
    currentConfig = {
      ...defaultConfig,
      ...configOverride,
      core: { ...defaultConfig.core, ...configOverride?.core },
      genre: { ...defaultConfig.genre, ...configOverride?.genre },
      content: { ...defaultConfig.content, ...configOverride?.content },
      media: { ...defaultConfig.media, ...configOverride?.media },
    };

    return currentConfig;
  } catch (error) {
    console.error("Error loading config:", error);
    currentConfig = defaultConfig;
    return defaultConfig;
  }
}

/**
 * Get current configuration
 */
export function getConfig(): BandWebsiteConfig {
  try {
    return currentConfig || defaultConfig;
  } catch (error) {
    console.error("Error getting config:", error);
    return defaultConfig;
  }
}

/**
 * Apply a genre preset
 */
export function applyGenrePreset(
  genre: keyof typeof genrePresets,
): BandWebsiteConfig {
  currentConfig = {
    ...currentConfig,
    genre: genrePresets[genre],
  };
  return currentConfig;
}

// ================================
// CSS VARIABLE GENERATION
// ================================

/**
 * Generate CSS custom properties from configuration
 */
export function generateCSSVariables(
  config: BandWebsiteConfig,
): Record<string, string> {
  const vars: Record<string, string> = {};

  // Color palette
  vars["--color-primary"] = config.core.primaryColorPalette.primary;
  vars["--color-secondary"] = config.core.primaryColorPalette.secondary;
  vars["--color-accent"] = config.core.primaryColorPalette.accent;
  vars["--color-background"] = config.core.primaryColorPalette.background;
  vars["--color-surface"] = config.core.primaryColorPalette.surface;

  // Typography
  vars["--font-heading"] = config.core.typographyPair.headingFont;
  vars["--font-body"] = config.core.typographyPair.bodyFont;

  // Spacing based on font scale
  const spacingMultiplier = {
    compact: 0.8,
    balanced: 1.0,
    spacious: 1.2,
  }[config.core.typographyPair.fontScale];

  vars["--spacing-multiplier"] = spacingMultiplier.toString();

  // Layout spacing
  const layoutSpacingMultiplier = {
    compact: 0.75,
    balanced: 1.0,
    spacious: 1.25,
  }[config.genre.layoutSpacing];

  vars["--layout-spacing-multiplier"] = layoutSpacingMultiplier.toString();

  // Border radius
  const borderRadiusValues = {
    sharp: "0px",
    subtle: "4px",
    modern: "8px",
    rounded: "12px",
  };
  vars["--border-radius"] = borderRadiusValues[config.core.borderRadiusScale];

  // Animation speed
  vars["--motion-speed-multiplier"] =
    config.genre.motionSpeedMultiplier.toString();

  // Effects intensity
  vars["--particle-density"] = config.genre.particleEffectsDensity.toString();
  vars["--glow-intensity"] = config.genre.glowIntensity.toString();

  // Shadow system
  const shadowValues = {
    flat: "none",
    subtle: "0 1px 3px rgba(0, 0, 0, 0.12)",
    moderate: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    dramatic:
      "0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)",
  };
  vars["--shadow-default"] = shadowValues[config.genre.shadowIntensity];

  return vars;
}

/**
 * Inject CSS variables into document
 */
export function injectCSSVariables(config: BandWebsiteConfig): void {
  if (typeof document === "undefined") return;

  const vars = generateCSSVariables(config);
  const root = document.documentElement;

  Object.entries(vars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

// ================================
// STYLING UTILITIES
// ================================

/**
 * Get Tailwind classes based on configuration
 */
export function getConfiguredClasses() {
  const config = getConfig();

  return {
    // Primary colors
    primary: {
      bg: `bg-${config.core.primaryColorPalette.primary}`,
      text: `text-${config.core.primaryColorPalette.primary}`,
      border: `border-${config.core.primaryColorPalette.primary}`,
      hover: `hover:bg-${config.core.primaryColorPalette.primary}`,
    },

    // Secondary colors
    secondary: {
      bg: `bg-${config.core.primaryColorPalette.secondary}`,
      text: `text-${config.core.primaryColorPalette.secondary}`,
      border: `border-${config.core.primaryColorPalette.secondary}`,
      hover: `hover:bg-${config.core.primaryColorPalette.secondary}`,
    },

    // Accent colors
    accent: {
      bg: `bg-${config.core.primaryColorPalette.accent}`,
      text: `text-${config.core.primaryColorPalette.accent}`,
      border: `border-${config.core.primaryColorPalette.accent}`,
      hover: `hover:bg-${config.core.primaryColorPalette.accent}`,
    },

    // Typography
    typography: {
      heading: `font-${config.core.typographyPair.headingFont.toLowerCase()}`,
      body: `font-${config.core.typographyPair.bodyFont.toLowerCase()}`,
    },

    // Border radius
    rounded: {
      default: `rounded-${
        config.core.borderRadiusScale === "sharp"
          ? "none"
          : config.core.borderRadiusScale === "subtle"
            ? "sm"
            : config.core.borderRadiusScale === "modern"
              ? "md"
              : "lg"
      }`,
      button: `rounded-${
        config.core.borderRadiusScale === "sharp"
          ? "none"
          : config.core.borderRadiusScale === "rounded"
            ? "full"
            : "lg"
      }`,
    },
  };
}

/**
 * Get animation duration based on motion speed multiplier
 */
export function getAnimationDuration(baseDuration: number): number {
  const config = getConfig();
  return baseDuration / config.genre.motionSpeedMultiplier;
}

/**
 * Get animation classes based on intensity setting
 */
export function getAnimationClasses() {
  const config = getConfig();

  const intensityMap = {
    minimal: {
      transition: "transition-all duration-300",
      hover: "hover:scale-105",
      entrance: "animate-fade-in",
    },
    moderate: {
      transition: "transition-all duration-500",
      hover: "hover:scale-110 hover:shadow-lg",
      entrance: "animate-slide-up",
    },
    full: {
      transition: "transition-all duration-700",
      hover: "hover:scale-110 hover:shadow-xl hover:rotate-1",
      entrance: "animate-complex-entrance",
    },
  };

  return intensityMap[config.core.animationIntensity];
}

// ================================
// CONTENT UTILITIES
// ================================

/**
 * Get band content from API or JSON fallback
 * Fetches profile, about, contact, and social data
 */
export async function getBandContentFromAPI(): Promise<{
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
}> {
  const bandId = process.env.NEXT_PUBLIC_BAND_ID || "the-dutch-queen";
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL;
  const useCMS = process.env.NEXT_PUBLIC_USE_CMS === "true";

  if (useCMS && apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/bands/${bandId}`, {
        cache: "no-store", // Always fetch fresh data
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        bandName: data.profile?.name || "The Dutch Queen",
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
    } catch (error) {
      console.error("Failed to fetch band content from API:", error);
      // Fall through to JSON fallback
    }
  }

  // Fallback to existing getBandContent() which uses JSON imports
  return getBandContent();
}

/**
 * Get band content with fallbacks (sync version for backward compatibility)
 */
export function getBandContent() {
  try {
    // Get config for social and contact info
    const config = getConfig();

    return {
      bandName: bandProfile.name || "The Dutch Queen",
      tagline: bandProfile.tagline || "Een ode aan Queen",
      description: {
        short: aboutData.descriptions.short,
        medium: aboutData.descriptions.medium,
        long: aboutData.descriptions.long,
      },
      social: config.content.social || {},
      contact: config.content.contact || { email: "" },
    };
  } catch (error) {
    console.error("Error loading band content from files:", error);

    // Fallback to config
    const config = getConfig();

    if (!config || !config.content) {
      return {
        bandName: "Your Band Name",
        tagline: "Your Musical Journey",
        description: {
          short: "A band that creates unforgettable music",
          medium: "We create music that connects hearts and moves souls.",
          long: "Our music is a journey through emotions, bringing people together through the universal language of sound.",
        },
        social: {},
        contact: { email: "" },
      };
    }

    return {
      bandName:
        config.content.bandName !== "[BAND_NAME]"
          ? config.content.bandName
          : "Your Band Name",
      tagline:
        config.content.tagline !== "[BAND_TAGLINE]"
          ? config.content.tagline
          : "Your Musical Journey",
      description: {
        short:
          config.content.description?.short !== "[SHORT_DESCRIPTION]"
            ? config.content.description?.short
            : "A band that creates unforgettable music",
        medium:
          config.content.description?.medium !== "[MEDIUM_DESCRIPTION]"
            ? config.content.description?.medium
            : "We create music that connects hearts and moves souls.",
        long:
          config.content.description?.long !== "[LONG_DESCRIPTION]"
            ? config.content.description?.long
            : "Our music is a journey through emotions, bringing people together through the universal language of sound.",
      },
      social: config.content.social || {},
      contact: config.content.contact || { email: "" },
    };
  }
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
 * Get shows/tour dates data from API or JSON fallback
 * Now async to support API fetching
 */
export async function getShowsData() {
  const bandId = process.env.NEXT_PUBLIC_BAND_ID || "the-dutch-queen";
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL;
  const useCMS = process.env.NEXT_PUBLIC_USE_CMS === "true";

  // Try to fetch from API if enabled
  if (useCMS && apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/bands/${bandId}`, {
        cache: "no-store", // Always fetch fresh data
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // API returns shows in different format than frontend expects
      // Need to transform: {venue: {name, city}, soldOut: boolean}
      // To: {venue: string, city: string, status: string}
      const transformShow = (show: ApiShow) => ({
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
        upcoming: (allShows.upcoming || [])
          .sort(
            (a: ApiShow, b: ApiShow) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map(transformShow),
        past: (allShows.past || [])
          .sort(
            (a: ApiShow, b: ApiShow) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map(transformShow),
        settings: allShows.settings || {
          showPastShows: true,
          maxUpcomingDisplay: 10,
          maxPastDisplay: 5,
          autoArchiveAfterDays: 7,
        },
      };
    } catch (error) {
      console.error(
        "Failed to fetch shows from API, using JSON fallback:",
        error,
      );
      // Fall through to JSON fallback below
    }
  }

  // Fallback to JSON file if API is disabled or failed
  try {
    const fallback = await import(
      "../content/bands/the-dutch-queen/data/shows.json"
    );
    return fallback.default;
  } catch (error) {
    console.error("Error loading shows data from JSON:", error);
    return {
      upcoming: [],
      past: [],
      settings: {
        showPastShows: true,
        maxUpcomingDisplay: 10,
        maxPastDisplay: 5,
        autoArchiveAfterDays: 7,
      },
    };
  }
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

/**
 * Get gallery data from API or local fallback
 */
export async function getGalleryData(): Promise<{
  images: GalleryImage[];
}> {
  const bandId = process.env.NEXT_PUBLIC_BAND_ID || "the-dutch-queen";
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL;
  const useCMS = process.env.NEXT_PUBLIC_USE_CMS === "true";

  if (useCMS && apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/bands/${bandId}`, {
        cache: "no-store", // Always fetch fresh data
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Transform API format to frontend format
      const images: GalleryImage[] = (data.gallery?.images || []).map(
        (item: ApiMediaItem & { hasCustomLayout?: boolean }) => ({
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
    } catch (error) {
      console.error("Failed to fetch gallery from API:", error);
      // Fall through to local fallback
    }
  }

  // Local fallback - return paths from config
  const config = getConfig();
  const localImages = config.media?.gallery?.images || [];

  return {
    images: localImages.map((filename: string) => ({
      src: `/gallery/${filename}`,
      alt: "Gallery image",
    })),
  };
}

/**
 * Get media paths with fallbacks
 */
export function getMediaPaths() {
  try {
    const config = getConfig();

    if (!config || !config.media) {
      return {
        hero: {
          background: "/hero-bg.jpg",
          fallback: "/hero-bg.jpg",
        },
        sections: {
          about: ["/videos/about-bg-1.mp4"],
          shows: ["/videos/shows-bg-1.mp4"],
          gallery: [],
          contact: [],
        },
        gallery: [],
        logos: {
          main: "/logo.png",
          icon: "/favicon.ico",
        },
      };
    }

    return {
      hero: {
        background: config.media.hero?.background || "/hero-bg.jpg",
        fallback: config.media.hero?.fallbackImage || "/hero-bg.jpg",
      },
      sections: config.media.sections || {
        about: ["/videos/about-bg-1.mp4"],
        shows: ["/videos/shows-bg-1.mp4"],
        gallery: [],
        contact: [],
      },
      gallery:
        config.media.gallery?.images?.map((img) => `/gallery/${img}`) || [],
      logos: config.media.logos || {
        main: "/logo.png",
        icon: "/favicon.ico",
      },
    };
  } catch (error) {
    console.error("Error getting media paths:", error);
    return {
      hero: {
        background: "/hero-bg.jpg",
        fallback: "/hero-bg.jpg",
      },
      sections: {
        about: ["/videos/about-bg-1.mp4"],
        shows: ["/videos/shows-bg-1.mp4"],
        gallery: [],
        contact: [],
      },
      gallery: [],
      logos: {
        main: "/logo.png",
        icon: "/favicon.ico",
      },
    };
  }
}

// ================================
// VALIDATION UTILITIES
// ================================

/**
 * Validate configuration against schema
 */
export function validateConfig(config: BandWebsiteConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!config.content.bandName || config.content.bandName === "[BAND_NAME]") {
    errors.push("Band name is required");
  }

  if (!config.content.tagline || config.content.tagline === "[BAND_TAGLINE]") {
    errors.push("Band tagline is required");
  }

  // Check color values
  const colorRegex = /^([a-z]+-\d{1,3}|#[0-9A-Fa-f]{6})$/;
  Object.entries(config.core.primaryColorPalette).forEach(([key, value]) => {
    if (!colorRegex.test(value)) {
      errors.push(`Invalid color format for ${key}: ${value}`);
    }
  });

  // Check animation multiplier bounds
  if (
    config.genre.motionSpeedMultiplier < 0.5 ||
    config.genre.motionSpeedMultiplier > 2.0
  ) {
    errors.push("Motion speed multiplier must be between 0.5 and 2.0");
  }

  // Check particle density bounds
  if (
    config.genre.particleEffectsDensity < 0 ||
    config.genre.particleEffectsDensity > 1
  ) {
    errors.push("Particle effects density must be between 0 and 1");
  }

  return { valid: errors.length === 0, errors };
}

// ================================
// QUEEN CLAUDE INTEGRATION
// ================================

/**
 * Export configuration in Queen Claude compatible format
 */
export function exportForQueenClaude(config: BandWebsiteConfig) {
  return {
    design_system: {
      colors: config.core.primaryColorPalette,
      typography: config.core.typographyPair,
      spacing: config.genre.layoutSpacing,
      border_radius: config.core.borderRadiusScale,
      shadows: config.genre.shadowIntensity,
    },
    animation_system: {
      intensity: config.core.animationIntensity,
      speed_multiplier: config.genre.motionSpeedMultiplier,
      particles: config.genre.particleEffectsDensity,
      glow: config.genre.glowIntensity,
    },
    content: config.content,
    media: config.media,
    version: config.version,
  };
}
