/**
 * Content Loader System
 *
 * This module handles loading content from various sources:
 * - File system (JSON files in /content directory)
 * - API endpoints (future)
 * - Headless CMS (future)
 */

import { readFile } from "fs/promises";
import { join } from "path";
import type {
  BandContent,
  BandProfile,
  AboutContent,
  SocialContent,
  ContactContent,
  ShowsContent,
  MediaAssets,
  ContentConfig,
  ContentSource,
} from "@/types/content";

// Default configuration
const DEFAULT_BAND_ID = "template-band";
const CONTENT_BASE_PATH = "/content/bands";

/**
 * Content loader class that handles all content fetching
 */
export class ContentLoader {
  private config: ContentConfig;
  private readonly cache: Map<string, unknown> = new Map();

  constructor(config?: Partial<ContentConfig>) {
    // Use environment variables for default configuration
    const defaultSource =
      process.env.NEXT_PUBLIC_USE_CMS === "true" ? "cms" : "file";
    const defaultBandId = process.env.NEXT_PUBLIC_BAND_ID || DEFAULT_BAND_ID;
    const defaultApiUrl =
      process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:3002/api";

    this.config = {
      source: defaultSource,
      bandId: defaultBandId,
      apiUrl: defaultApiUrl,
      fallbackToFile: true,
      ...config,
    };
  }

  /**
   * Load complete band content
   */
  async loadBandContent(): Promise<BandContent> {
    const bandId = this.config.bandId || DEFAULT_BAND_ID;

    switch (this.config.source) {
      case "file":
        return this.loadFromFiles(bandId);
      case "api":
        return this.loadFromAPI(bandId);
      case "cms":
        return this.loadFromCMS(bandId);
      default:
        return this.loadFromFiles(bandId);
    }
  }

  /**
   * Load content from file system
   */
  private async loadFromFiles(bandId: string): Promise<BandContent> {
    try {
      const basePath = join(process.cwd(), "content", "bands", bandId);

      // Load all content files in parallel
      const [profile, about, social, contact, shows] = await Promise.all([
        this.loadJsonFileFromDisk<BandProfile>(
          join(basePath, "band-profile.json"),
        ),
        this.loadJsonFileFromDisk<AboutContent>(
          join(basePath, "data", "about.json"),
        ),
        this.loadJsonFileFromDisk<SocialContent>(
          join(basePath, "data", "social.json"),
        ),
        this.loadJsonFileFromDisk<ContactContent>(
          join(basePath, "data", "contact.json"),
        ),
        this.loadJsonFileFromDisk<ShowsContent>(
          join(basePath, "data", "shows.json"),
        ),
      ]);

      return {
        profile,
        about,
        social,
        contact,
        shows,
      };
    } catch (error) {
      console.error("Failed to load content from files:", error);
      throw new Error(`Failed to load band content for ${bandId}`);
    }
  }

  /**
   * Load content from API (placeholder for future implementation)
   */
  private async loadFromAPI(bandId: string): Promise<BandContent> {
    if (!this.config.apiUrl) {
      if (this.config.fallbackToFile) {
        return this.loadFromFiles(bandId);
      }
      throw new Error("API URL not configured");
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/bands/${bandId}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (this.config.fallbackToFile) {
        console.warn("API failed, falling back to file system:", error);
        return this.loadFromFiles(bandId);
      }
      throw error;
    }
  }

  /**
   * Load content from CMS (Payload CMS integration)
   */
  private async loadFromCMS(bandId: string): Promise<BandContent> {
    const cmsUrl = this.config.apiUrl || "http://localhost:3002/api";

    try {
      const response = await fetch(`${cmsUrl}/bands/${bandId}`);
      if (!response.ok) {
        throw new Error(`CMS request failed: ${response.statusText}`);
      }

      const bandContent = await response.json();

      // Cache the result
      this.cache.set(`cms-${bandId}`, bandContent);

      return bandContent;
    } catch (error) {
      if (this.config.fallbackToFile) {
        console.warn("CMS failed, falling back to file system:", error);
        return this.loadFromFiles(bandId);
      }
      throw error;
    }
  }

  /**
   * Load a single JSON file from disk (for server-side file loading)
   */
  private async loadJsonFileFromDisk<T>(filePath: string): Promise<T> {
    // Check cache first
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath) as T;
    }

    try {
      const fileContent = await readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent) as T;

      // Cache the result
      this.cache.set(filePath, data);

      return data;
    } catch (error) {
      console.error(`Failed to load JSON file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Load a single JSON file via HTTP (for API/CMS sources)
   */
  private async loadJsonFile<T>(path: string): Promise<T> {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path) as T;
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.statusText}`);
      }
      const data = await response.json();

      // Cache the result
      this.cache.set(path, data);

      return data;
    } catch (error) {
      console.error(`Failed to load JSON file ${path}:`, error);
      throw error;
    }
  }

  /**
   * Load media assets for a band
   */
  async loadMediaAssets(bandId?: string): Promise<MediaAssets> {
    const id = bandId || this.config.bandId || DEFAULT_BAND_ID;
    const basePath = `${CONTENT_BASE_PATH}/${id}/assets`;

    // For now, return paths based on directory structure
    // In production, this would scan directories or fetch from CMS
    return {
      backgrounds: {
        hero: [`${basePath}/backgrounds/hero/`],
        about: [`${basePath}/backgrounds/about/`],
        shows: [`${basePath}/backgrounds/shows/`],
        contact: [`${basePath}/backgrounds/contact/`],
        gallery: [`${basePath}/backgrounds/gallery/`],
      },
      gallery: await this.getGalleryImages(id),
      videos: [`${basePath}/videos/`],
      logos: {
        main: `${basePath}/logos/main-logo.png`,
        icon: `${basePath}/logos/icon.png`,
        favicon: `${basePath}/logos/favicon.ico`,
        light: `${basePath}/logos/logo-light.png`,
        dark: `${basePath}/logos/logo-dark.png`,
      },
    };
  }

  /**
   * Get gallery images for a band
   */
  private async getGalleryImages(bandId: string): Promise<string[]> {
    const basePath = `${CONTENT_BASE_PATH}/${bandId}/assets/gallery`;

    // In a real implementation, this would scan the directory
    // For now, return expected image paths
    return [
      `${basePath}/image-1.jpg`,
      `${basePath}/image-2.jpg`,
      `${basePath}/image-3.jpg`,
      `${basePath}/image-4.jpg`,
    ];
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ContentConfig>): void {
    this.config = { ...this.config, ...config };
    this.clearCache();
  }
}

// Singleton instance for easy access
let contentLoaderInstance: ContentLoader | null = null;

/**
 * Get or create the content loader instance
 */
export function getContentLoader(
  config?: Partial<ContentConfig>,
): ContentLoader {
  if (!contentLoaderInstance) {
    contentLoaderInstance = new ContentLoader(config);
  } else if (config) {
    contentLoaderInstance.updateConfig(config);
  }
  return contentLoaderInstance;
}

/**
 * Utility function to load band content
 */
export async function loadBandContent(
  bandId?: string,
  source?: ContentSource,
): Promise<BandContent> {
  const loader = getContentLoader({ bandId, source });
  return loader.loadBandContent();
}

/**
 * Utility function to load media assets
 */
export async function loadMediaAssets(bandId?: string): Promise<MediaAssets> {
  const loader = getContentLoader({ bandId });
  return loader.loadMediaAssets();
}

/**
 * Utility function to get band profile
 */
export async function getBandProfile(bandId?: string): Promise<BandProfile> {
  const loader = getContentLoader({ bandId });
  const content = await loader.loadBandContent();
  return content.profile;
}

/**
 * Check if content exists for a band
 */
export async function contentExists(bandId: string): Promise<boolean> {
  try {
    const filePath = join(
      process.cwd(),
      "content",
      "bands",
      bandId,
      "band-profile.json",
    );
    await readFile(filePath, "utf-8");
    return true;
  } catch {
    return false;
  }
}
