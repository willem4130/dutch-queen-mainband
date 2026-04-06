/**
 * Analytics utility functions for tracking events
 * Supports both GA4 and PostHog with consent-aware tracking
 */

// Consent storage key
const CONSENT_KEY = "tdq_cookie_consent";
const CONSENT_VERSION = "1.0";

export interface ConsentState {
  analytics: boolean;
  timestamp: number;
  version: string;
}

// ============================================================
// CONSENT MANAGEMENT
// ============================================================

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const consent = JSON.parse(stored) as ConsentState;

    // Check version compatibility
    if (consent.version !== CONSENT_VERSION) {
      return null; // Force re-consent on version change
    }

    return consent;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;

  const consent: ConsentState = {
    analytics,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

  // Also set a simple cookie for potential server-side awareness
  document.cookie = `tdq_consent=${analytics ? "1" : "0"}; path=/; max-age=31536000; SameSite=Lax`;
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CONSENT_KEY);
  document.cookie = "tdq_consent=; path=/; max-age=0";
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics === true;
}

// ============================================================
// GA4 EVENT TRACKING
// ============================================================

interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

function trackGA4Event(eventName: string, params?: GA4EventParams): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

// ============================================================
// POSTHOG EVENT TRACKING
// ============================================================

function trackPostHogEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posthog = (window as any).posthog;
  if (posthog && typeof posthog.capture === "function") {
    posthog.capture(eventName, properties);
  }
}

// ============================================================
// UNIFIED EVENT TRACKING
// ============================================================

interface TrackEventOptions {
  name: string;
  properties?: Record<string, unknown>;
  ga4Only?: boolean;
  posthogOnly?: boolean;
}

export function trackEvent({
  name,
  properties,
  ga4Only,
  posthogOnly,
}: TrackEventOptions): void {
  if (!hasAnalyticsConsent()) return;

  if (!posthogOnly) {
    trackGA4Event(name, properties as GA4EventParams);
  }

  if (!ga4Only) {
    trackPostHogEvent(name, properties);
  }
}

// ============================================================
// SPECIALIZED TRACKING FUNCTIONS
// ============================================================

/**
 * Track when a user clicks on a show/tour date
 */
export function trackShowClick(params: {
  venue: string;
  date: string;
  city: string;
  status: "available" | "sold-out";
  ticketUrl?: string;
}): void {
  trackEvent({
    name: "show_click",
    properties: {
      venue: params.venue,
      date: params.date,
      city: params.city,
      status: params.status,
      ticket_url: params.ticketUrl,
    },
  });
}

/**
 * Track when a user views a gallery image
 */
export function trackGalleryImageView(params: {
  imageIndex: number;
  imageSrc: string;
  context: "grid" | "lightbox";
}): void {
  trackEvent({
    name: "gallery_view",
    properties: {
      image_index: params.imageIndex,
      image_src: params.imageSrc,
      context: params.context,
    },
  });
}

/**
 * Track lightbox navigation
 */
export function trackLightboxNavigate(params: {
  direction: "next" | "prev" | "close";
  imageIndex: number;
}): void {
  trackEvent({
    name: "lightbox_navigate",
    properties: {
      direction: params.direction,
      image_index: params.imageIndex,
    },
  });
}

/**
 * Track video interactions (hero video)
 */
export function trackVideoPlay(params: {
  action: "play" | "pause" | "mute" | "unmute";
  videoType: "hero";
}): void {
  trackEvent({
    name: "video_interaction",
    properties: {
      action: params.action,
      video_type: params.videoType,
    },
  });
}

/**
 * Track social media link clicks
 */
export function trackSocialClick(params: {
  platform:
    | "facebook"
    | "instagram"
    | "youtube"
    | "email"
    | "phone"
    | "spotify"
    | "tiktok";
  location: "navigation" | "footer" | "pro-page" | "contact";
}): void {
  trackEvent({
    name: "social_click",
    properties: {
      platform: params.platform,
      location: params.location,
    },
  });
}

/**
 * Track /pro page views (for venues/promoters)
 */
export function trackProPageView(params?: {
  section?: "presskit" | "technical" | "hospitality" | "downloads";
}): void {
  trackEvent({
    name: "pro_page_view",
    properties: {
      section: params?.section || "main",
    },
  });
}

/**
 * Track file downloads from pro page
 */
export function trackDownload(params: {
  fileName: string;
  fileType: "photo" | "logo" | "pdf" | "document" | "other";
}): void {
  trackEvent({
    name: "asset_download",
    properties: {
      file_name: params.fileName,
      file_type: params.fileType,
    },
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLinkClick(params: {
  url: string;
  linkText?: string;
}): void {
  trackEvent({
    name: "external_link_click",
    properties: {
      url: params.url,
      link_text: params.linkText,
    },
  });
}

/**
 * Track section scrolls into view
 */
export function trackSectionView(params: {
  section: "hero" | "about" | "shows" | "gallery" | "contact";
}): void {
  trackEvent({
    name: "section_view",
    properties: {
      section: params.section,
    },
  });
}
