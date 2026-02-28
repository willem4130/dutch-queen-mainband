'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import { useAnalyticsContext } from '@/providers/AnalyticsProvider';
import { getConsent } from '@/lib/analytics';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { updateConsent, isConsentDetermined } = useAnalyticsContext();

  // Show banner if consent not yet determined
  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      const consent = getConsent();
      if (!consent) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    setIsVisible(false);
  };

  const handleReject = () => {
    updateConsent(false);
    setIsVisible(false);
  };

  // Don't show if consent already determined
  if (isConsentDetermined) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-6 shadow-2xl backdrop-blur-xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />

              {/* Close button */}
              <button
                onClick={handleReject}
                className="absolute right-4 top-4 p-1 text-white/40 transition-colors hover:text-white/80"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                    <Cookie className="h-6 w-6 text-amber-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    We value your privacy
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    We use cookies and similar technologies to understand how you use our website,
                    improve your experience, and show you personalized content. You can choose to
                    accept or reject these cookies.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Your data is stored securely in the EU</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                  <button
                    onClick={handleReject}
                    className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:bg-white/5 hover:text-white"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAccept}
                    className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-amber-400"
                  >
                    Accept All
                  </button>
                </div>
              </div>

              {/* Privacy link */}
              <div className="relative mt-4 border-t border-white/10 pt-4">
                <a
                  href="/privacy"
                  className="text-xs text-white/50 underline-offset-2 transition-colors hover:text-white/70 hover:underline"
                >
                  Learn more about how we use your data
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
