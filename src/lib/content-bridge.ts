/**
 * Content Bridge
 *
 * This module bridges the new content system with the existing configuration system,
 * allowing for a smooth transition and backward compatibility.
 */

import { getConfig } from "../../config/config-utils";
import { loadBandContent, contentExists } from "./content-loader";
import type { BandWebsiteConfig } from "../../config/band.config";
import type { BandContent } from "@/types/content";

/**
 * Check if CMS mode is enabled via environment variable
 */
function isCMSEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_CMS === "true" ||
    process.env.NODE_ENV === "development"
  ); // Enable CMS by default in development
}

/**
 * Check if new content system has data
 */
async function hasNewContent(
  bandId: string = "template-band",
): Promise<boolean> {
  // If CMS is enabled, try CMS first
  if (isCMSEnabled()) {
    try {
      const content = await loadBandContent(bandId, "cms");
      return Boolean(content);
    } catch {
      // Fall back to checking file system
      try {
        return await contentExists(bandId);
      } catch {
        return false;
      }
    }
  }

  // Default behavior - check file system
  try {
    return await contentExists(bandId);
  } catch {
    return false;
  }
}

/**
 * Convert new content format to old config format
 */
function contentToConfig(content: BandContent): Partial<BandWebsiteConfig> {
  const { profile, about, social, contact } = content;

  return {
    content: {
      bandName: profile.name,
      tagline: profile.tagline,
      description: {
        short: about.descriptions.short,
        medium: about.descriptions.medium,
        long: about.descriptions.long,
      },
      contact: {
        email: contact.primary.email,
        phone: contact.primary.phone,
        address: contact.office?.address,
      },
      social: {
        facebook: social.platforms.facebook?.url,
        instagram: social.platforms.instagram?.url,
        twitter: social.platforms.twitter?.url,
        youtube: social.platforms.youtube?.url,
        spotify: social.platforms.spotify?.url,
        bandcamp: social.platforms.bandcamp?.url,
      },
      seo: {
        metaTitle: profile.seo.metaTitle,
        metaDescription: profile.seo.metaDescription,
        keywords: profile.seo.keywords,
      },
    },
    core: {
      primaryColorPalette: {
        primary: profile.theme.primaryColor || "amber-900",
        secondary: profile.theme.secondaryColor || "teal-800",
        accent: profile.theme.accentColor || "purple-600",
        background: "black",
        surface: "gray-900",
      },
      typographyPair: {
        headingFont: "Inter",
        bodyFont: "Inter",
        fontScale: "balanced",
      },
      heroBackground: {
        type: "image",
        source: `/content/bands/${profile.id}/assets/backgrounds/hero/main.jpg`,
        overlayIntensity: 0.4,
      },
      sectionBackgroundStrategy: {
        about: "video",
        shows: "video",
        gallery: "gradient",
        contact: "gradient",
      },
      animationIntensity: profile.theme.animationIntensity || "full",
      colorTemperature: "neutral",
      contrastLevel: "balanced",
      borderRadiusScale: "subtle",
    },
    genre: {
      particleEffectsDensity: profile.theme.particleEffects ? 0.8 : 0,
      glowIntensity: profile.theme.glowEffects ? 0.3 : 0,
      textureOverlays: "subtle",
      motionSpeedMultiplier: 1.0,
      shadowIntensity: "moderate",
      backgroundFocusEffect: "moderate",
      colorSaturation: "balanced",
      layoutSpacing: "balanced",
    },
  } as Partial<BandWebsiteConfig>;
}

/**
 * Get unified content (tries CMS/new system first, falls back to old)
 */
export async function getUnifiedContent(
  bandId: string = "template-band",
): Promise<{
  source: "cms" | "new" | "old";
  config: BandWebsiteConfig;
}> {
  const hasNew = await hasNewContent(bandId);

  if (hasNew) {
    try {
      // Use CMS if enabled, otherwise file system
      const contentSource = isCMSEnabled() ? "cms" : "file";
      const content = await loadBandContent(bandId, contentSource);
      const oldConfig = getConfig();
      const convertedConfig = contentToConfig(content);

      // Merge new content with old config structure
      const mergedConfig: BandWebsiteConfig = {
        ...oldConfig,
        ...convertedConfig,
        core: { ...oldConfig.core, ...convertedConfig.core },
        genre: { ...oldConfig.genre, ...convertedConfig.genre },
        content: { ...oldConfig.content, ...convertedConfig.content },
        media: {
          ...oldConfig.media,
          hero: {
            background: `/content/bands/${content.profile.id}/assets/backgrounds/hero/main.jpg`,
            fallbackImage: `/content/bands/${content.profile.id}/assets/backgrounds/hero/fallback.jpg`,
          },
          gallery: {
            images: [
              "image-1.jpg",
              "image-2.jpg",
              "image-3.jpg",
              "image-4.jpg",
            ].map(
              (img) =>
                `/content/bands/${content.profile.id}/assets/gallery/${img}`,
            ),
          },
        },
      } as BandWebsiteConfig;

      return { source: isCMSEnabled() ? "cms" : "new", config: mergedConfig };
    } catch (error) {
      console.warn(
        "Failed to load new content, falling back to old config:",
        error,
      );
    }
  }

  // Fallback to old configuration
  return { source: "old", config: getConfig() };
}

/**
 * Get band name from either system
 */
export async function getBandName(): Promise<string> {
  const { config } = await getUnifiedContent();
  return config.content.bandName;
}

/**
 * Get media paths from either system
 */
export async function getMediaPaths(bandId: string = "template-band"): Promise<{
  hero: string;
  gallery: string[];
  about?: string[];
  shows?: string[];
}> {
  const hasNew = await hasNewContent(bandId);

  if (hasNew) {
    const contentSource = isCMSEnabled() ? "cms" : "file";
    const content = await loadBandContent(bandId, contentSource);
    const basePath = `/content/bands/${content.profile.id}/assets`;

    return {
      hero: `${basePath}/backgrounds/hero/main.jpg`,
      gallery: [1, 2, 3, 4].map((i) => `${basePath}/gallery/image-${i}.jpg`),
      about: [`${basePath}/backgrounds/about/bg-1.mp4`],
      shows: [`${basePath}/backgrounds/shows/bg-1.mp4`],
    };
  }

  // Use old system paths
  const config = getConfig();
  return {
    hero: config.media.hero.background,
    gallery: config.media.gallery.images.map((img) => `/gallery/${img}`),
    about: config.media.sections.about,
    shows: config.media.sections.shows,
  };
}
