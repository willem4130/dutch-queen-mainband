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
import showsData from "../content/bands/the-dutch-queen/data/shows.json";

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
  configOverride?: Partial<BandWebsiteConfig>
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
  genre: keyof typeof genrePresets
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
  config: BandWebsiteConfig
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
 * Get band content with fallbacks
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
 * Get shows/tour dates data
 */
export function getShowsData() {
  try {
    return {
      upcoming: showsData.upcoming || [],
      past: showsData.past || [],
      settings: showsData.settings || {
        showPastShows: true,
        maxUpcomingDisplay: 10,
        maxPastDisplay: 5,
        autoArchiveAfterDays: 7,
      },
    };
  } catch (error) {
    console.error("Error loading shows data:", error);
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
