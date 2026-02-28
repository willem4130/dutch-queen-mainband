'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import posthog from 'posthog-js';
import { getConsent, setConsent, clearConsent, type ConsentState } from '@/lib/analytics';

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

  // Load consent from localStorage on mount
  useEffect(() => {
    const storedConsent = getConsent();
    setConsentState(storedConsent);
    setIsInitialized(true);
  }, []);

  // Initialize PostHog when consent is given
  useEffect(() => {
    if (!consent?.analytics || posthogInitialized) return;
    if (typeof window === 'undefined') return;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

    if (posthogKey && process.env.NODE_ENV === 'production') {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: false, // We'll track events manually
          disable_session_recording: false,
          persistence: 'localStorage',
          loaded: (ph) => {
            if (process.env.NODE_ENV === 'development') {
              ph.debug();
            }
          },
        });
        setPosthogInitialized(true);
      } catch (error) {
        console.error('Failed to initialize PostHog:', error);
      }
    }
  }, [consent?.analytics, posthogInitialized]);

  // Handle consent update
  const updateConsent = useCallback((analytics: boolean) => {
    setConsent(analytics);
    setConsentState({
      analytics,
      timestamp: Date.now(),
      version: '1.0',
    });

    // If user rejects, opt out of PostHog
    if (!analytics && posthogInitialized) {
      posthog.opt_out_capturing();
    }
  }, [posthogInitialized]);

  // Handle consent revocation
  const revokeConsent = useCallback(() => {
    clearConsent();
    setConsentState(null);

    // Opt out of PostHog
    if (posthogInitialized) {
      posthog.opt_out_capturing();
      posthog.reset();
    }
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
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
}
