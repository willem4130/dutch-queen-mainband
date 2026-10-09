"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import posthog from "posthog-js";
import {
  getConsent,
  setConsent,
  clearConsent,
  clearPostHogStorage,
  type ConsentState,
} from "@/lib/analytics";
import { loadGA, disableGA } from "@/lib/ga";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// ============================================================
// TYPES
// ============================================================

interface AnalyticsContextType {
  hasAnalyticsConsent: boolean;
  isConsentDetermined: boolean;
  updateConsent: (analytics: boolean) => void;
  revokeConsent: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  hasAnalyticsConsent: false,
  isConsentDetermined: false,
  updateConsent: () => {},
  revokeConsent: () => {},
});

// ============================================================
// PROVIDER
// ============================================================

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [consent, setConsentState] = useState<ConsentState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [posthogInitialized, setPosthogInitialized] = useState(false);

  // Load consent from localStorage on mount. GA starts only with explicit
  // consent; otherwise remove any _ga cookies set before consent gating.
  useEffect(() => {
    const storedConsent = getConsent();
    setConsentState(storedConsent);
    setIsInitialized(true);
    if (storedConsent?.analytics) {
      loadGA(GA_ID);
    } else {
      disableGA(GA_ID);
      clearPostHogStorage();
    }
  }, []);

  // Initialize PostHog when consent is given
  useEffect(() => {
    if (!consent?.analytics || posthogInitialized) return;
    if (typeof window === "undefined") return;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

    if (posthogKey && process.env.NODE_ENV === "production") {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: false, // We'll track events manually
          disable_session_recording: false,
          persistence: "localStorage",
          loaded: (ph) => {
            // Init only runs with consent; undo an opt-out left behind by an
            // earlier withdrawal, which PostHog remembers in localStorage.
            if (ph.has_opted_out_capturing()) {
              ph.opt_in_capturing();
            }
            if (process.env.NODE_ENV === "development") {
              ph.debug();
            }
          },
        });
        setPosthogInitialized(true);
      } catch (error) {
        console.error("Failed to initialize PostHog:", error);
      }
    }
  }, [consent?.analytics, posthogInitialized]);

  // Handle consent update
  const updateConsent = useCallback(
    (analytics: boolean) => {
      setConsent(analytics);
      setConsentState({
        analytics,
        timestamp: Date.now(),
        version: "1.0",
      });

      if (analytics) {
        loadGA(GA_ID);
        // Accepting again after withdrawing: PostHog is still opted out.
        if (posthogInitialized && posthog.has_opted_out_capturing()) {
          posthog.opt_in_capturing();
        }
      } else {
        disableGA(GA_ID);
      }

      // If user rejects, opt out of PostHog
      if (!analytics && posthogInitialized) {
        posthog.opt_out_capturing();
      }
      if (!analytics) {
        clearPostHogStorage();
      }
    },
    [posthogInitialized],
  );

  // Handle consent revocation
  const revokeConsent = useCallback(() => {
    clearConsent();
    setConsentState(null);
    disableGA(GA_ID);

    // Opt out of PostHog
    if (posthogInitialized) {
      posthog.opt_out_capturing();
      posthog.reset();
    }
    clearPostHogStorage();
  }, [posthogInitialized]);

  const value: AnalyticsContextType = {
    hasAnalyticsConsent: consent?.analytics === true,
    isConsentDetermined: isInitialized && consent !== null,
    updateConsent,
    revokeConsent,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error(
      "useAnalyticsContext must be used within AnalyticsProvider",
    );
  }
  return context;
}
