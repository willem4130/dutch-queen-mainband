/**
 * React Hooks for Content Management
 *
 * These hooks provide easy access to band content within React components,
 * with automatic loading, caching, and error handling.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadBandContent,
  loadMediaAssets,
  getContentLoader,
} from "@/lib/content-loader";
import type {
  BandProfile,
  AboutContent,
  SocialContent,
  ContactContent,
  ShowsContent,
  MediaAssets,
  ContentLoadState,
  ContentSource,
} from "@/types/content";

/**
 * Main hook to load and access band content
 */
export function useBandContent(
  bandId?: string,
  source?: ContentSource,
): ContentLoadState & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ContentLoadState>({
    loading: true,
    error: null,
    data: null,
  });

  const fetchContent = useCallback(async () => {
    setState((prev: ContentLoadState) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const content = await loadBandContent(bandId, source);
      setState({
        loading: false,
        error: null,
        data: content,
      });
    } catch (error) {
      setState({
        loading: false,
        error:
          error instanceof Error ? error : new Error("Failed to load content"),
        data: null,
      });
    }
  }, [bandId, source]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    ...state,
    refetch: fetchContent,
  };
}

/**
 * Hook to access band profile information
 */
export function useBandProfile(): BandProfile | null {
  const { data } = useBandContent();
  return data?.profile || null;
}

/**
 * Hook to access about content
 */
export function useAboutContent(): AboutContent | null {
  const { data } = useBandContent();
  return data?.about || null;
}

/**
 * Hook to access social media content
 */
export function useSocialContent(): SocialContent | null {
  const { data } = useBandContent();
  return data?.social || null;
}

/**
 * Hook to access contact information
 */
export function useContactContent(): ContactContent | null {
  const { data } = useBandContent();
  return data?.contact || null;
}

/**
 * Hook to access shows/tour information
 */
export function useShowsContent(): ShowsContent | null {
  const { data } = useBandContent();
  return data?.shows || null;
}

/**
 * Hook to load and access media assets
 */
export function useMediaAssets(bandId?: string): {
  loading: boolean;
  error: Error | null;
  assets: MediaAssets | null;
  refetch: () => Promise<void>;
} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [assets, setAssets] = useState<MediaAssets | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const mediaAssets = await loadMediaAssets(bandId);
      setAssets(mediaAssets);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load media assets"),
      );
    } finally {
      setLoading(false);
    }
  }, [bandId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    loading,
    error,
    assets,
    refetch: fetchAssets,
  };
}

/**
 * Hook to get active social media platforms
 */
export function useActiveSocialPlatforms(): Array<{
  name: string;
  url: string;
  handle?: string;
}> {
  const social = useSocialContent();

  if (!social) return [];

  return Object.entries(social.platforms)
    .filter(([, platform]: [string, unknown]) => {
      const p = platform as { active?: boolean };
      return p.active;
    })
    .map(([name, platform]: [string, unknown]) => {
      const p = platform as { url: string; handle?: string };
      return {
        name,
        url: p.url,
        handle: p.handle,
      };
    })
    .sort((a, b) => {
      const orderA = social.preferredOrder.indexOf(a.name);
      const orderB = social.preferredOrder.indexOf(b.name);

      if (orderA === -1 && orderB === -1) return 0;
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;

      return orderA - orderB;
    });
}

/**
 * Hook to get upcoming shows
 */
export function useUpcomingShows(limit?: number): ShowsContent["upcoming"] {
  const shows = useShowsContent();

  if (!shows?.upcoming) return [];

  const upcoming = shows.upcoming
    .filter((show: { date: string }) => new Date(show.date) >= new Date())
    .sort(
      (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Hook to get featured shows
 */
export function useFeaturedShows(): ShowsContent["upcoming"] {
  const shows = useShowsContent();

  if (!shows?.upcoming) return [];

  return shows.upcoming
    .filter(
      (show: { featured?: boolean; date: string }) =>
        show.featured && new Date(show.date) >= new Date(),
    )
    .sort(
      (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
}

/**
 * Hook to clear content cache
 */
export function useClearContentCache(): () => void {
  return useCallback(() => {
    const loader = getContentLoader();
    loader.clearCache();
  }, []);
}

/**
 * Hook to check if we're using fallback content
 */
export function useIsFallbackContent(): boolean {
  const profile = useBandProfile();

  // Check if we're using placeholder content
  return profile?.name === "[Your Band Name]" || false;
}

/**
 * Hook to get formatted contact email
 */
export function useContactEmail(): string {
  const contact = useContactContent();
  return contact?.primary.email || "contact@band.com";
}

/**
 * Hook to get formatted contact phone
 */
export function useContactPhone(): string | null {
  const contact = useContactContent();
  return contact?.primary.phoneDisplay || contact?.primary.phone || null;
}
