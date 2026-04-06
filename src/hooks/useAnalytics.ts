"use client";

import { useCallback } from "react";
import { useAnalyticsContext } from "@/providers/AnalyticsProvider";
import {
  trackEvent as baseTrackEvent,
  trackShowClick as baseTrackShowClick,
  trackGalleryImageView as baseTrackGalleryImageView,
  trackLightboxNavigate as baseTrackLightboxNavigate,
  trackVideoPlay as baseTrackVideoPlay,
  trackSocialClick as baseTrackSocialClick,
  trackProPageView as baseTrackProPageView,
  trackDownload as baseTrackDownload,
  trackExternalLinkClick as baseTrackExternalLinkClick,
  trackSectionView as baseTrackSectionView,
} from "@/lib/analytics";

/**
 * Hook for tracking analytics events
 * Provides consent-aware tracking functions
 */
export function useAnalytics() {
  const { hasAnalyticsConsent, isConsentDetermined, revokeConsent } =
    useAnalyticsContext();

  // Generic event tracking
  const trackEvent = useCallback(
    (name: string, properties?: Record<string, unknown>) => {
      if (!hasAnalyticsConsent) return;
      baseTrackEvent({ name, properties });
    },
    [hasAnalyticsConsent],
  );

  // Show click tracking
  const trackShowClick = useCallback(
    (params: Parameters<typeof baseTrackShowClick>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackShowClick(params);
    },
    [hasAnalyticsConsent],
  );

  // Gallery image view tracking
  const trackGalleryImageView = useCallback(
    (params: Parameters<typeof baseTrackGalleryImageView>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackGalleryImageView(params);
    },
    [hasAnalyticsConsent],
  );

  // Lightbox navigate tracking
  const trackLightboxNavigate = useCallback(
    (params: Parameters<typeof baseTrackLightboxNavigate>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackLightboxNavigate(params);
    },
    [hasAnalyticsConsent],
  );

  // Video play tracking
  const trackVideoPlay = useCallback(
    (params: Parameters<typeof baseTrackVideoPlay>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackVideoPlay(params);
    },
    [hasAnalyticsConsent],
  );

  // Social click tracking
  const trackSocialClick = useCallback(
    (params: Parameters<typeof baseTrackSocialClick>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackSocialClick(params);
    },
    [hasAnalyticsConsent],
  );

  // Pro page view tracking
  const trackProPageView = useCallback(
    (params?: Parameters<typeof baseTrackProPageView>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackProPageView(params);
    },
    [hasAnalyticsConsent],
  );

  // Download tracking
  const trackDownload = useCallback(
    (params: Parameters<typeof baseTrackDownload>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackDownload(params);
    },
    [hasAnalyticsConsent],
  );

  // External link click tracking
  const trackExternalLinkClick = useCallback(
    (params: Parameters<typeof baseTrackExternalLinkClick>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackExternalLinkClick(params);
    },
    [hasAnalyticsConsent],
  );

  // Section view tracking
  const trackSectionView = useCallback(
    (params: Parameters<typeof baseTrackSectionView>[0]) => {
      if (!hasAnalyticsConsent) return;
      baseTrackSectionView(params);
    },
    [hasAnalyticsConsent],
  );

  return {
    // Consent state
    hasConsent: hasAnalyticsConsent,
    isConsentDetermined,
    revokeConsent,

    // Tracking functions
    trackEvent,
    trackShowClick,
    trackGalleryImageView,
    trackLightboxNavigate,
    trackVideoPlay,
    trackSocialClick,
    trackProPageView,
    trackDownload,
    trackExternalLinkClick,
    trackSectionView,
  };
}
