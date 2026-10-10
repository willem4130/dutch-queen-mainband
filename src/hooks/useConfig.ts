"use client";

/**
 * React hook for the /pro page (press kit + riders).
 *
 * Fetches in the browser with cache: "no-store" by design, so the pro page
 * always shows the latest CMS data.
 */

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

// ================================
// PRESS KIT & RIDERS HOOKS
// ================================

/**
 * Press Kit data structure from API
 */
export interface PresskitData {
  bio: {
    short: string;
    full: string;
  };
  photos: string[];
  logos: string[];
  videos: string[];
  socialStats: Record<string, string | number>;
}

/**
 * Riders data structure from API
 */
export interface RidersData {
  technical: {
    summary: string;
    sound: {
      requirements: string;
      inputList: string[];
    };
    lighting: string;
    stage: string;
    backline: string;
    stagePlotUrl: string | null;
    pdfUrl: string | null;
  };
  hospitality: {
    summary: string;
    dressing: string;
    catering: string;
    accommodation: string;
    parking: string;
    pdfUrl: string | null;
  };
}

/**
 * Hook to fetch all pro data (presskit + riders) in one call
 */
export function useProData() {
  const [data, setData] = useState<{
    presskit: PresskitData | null;
    riders: RidersData | null;
    bandName: string;
    contact: { email: string; phone?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProData = async () => {
      const bandId = siteConfig.bandId;
      const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL;
      const useCMS = process.env.NEXT_PUBLIC_USE_CMS === "true";

      if (!useCMS || !apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/bands/${bandId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const apiData = await response.json();
        setData({
          presskit: apiData.presskit || null,
          riders: apiData.riders || null,
          bandName: apiData.profile?.name || siteConfig.bandName,
          contact: apiData.contact || { email: "" },
        });
      } catch (err) {
        console.error("Error loading pro data:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load pro data"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProData();
  }, []);

  return { data, loading, error };
}
