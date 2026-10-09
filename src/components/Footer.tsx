"use client";

import { useBandContentAsync } from "@/hooks/useConfig";
import { useAnalyticsContext } from "@/providers/AnalyticsProvider";

export function Footer() {
  // Use async hook to get live data from CMS API
  const { content } = useBandContentAsync();
  // Clears the cookie choice: analytics stop and the cookie banner returns.
  const { revokeConsent } = useAnalyticsContext();

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">{content.bandName}</span>
            <span className="mx-2">·</span>
            <a
              href="/privacy"
              className="underline-offset-2 transition-colors hover:text-white/70 hover:underline"
            >
              Privacy
            </a>
            <span className="mx-2">·</span>
            <button
              type="button"
              onClick={revokeConsent}
              className="underline-offset-2 transition-colors hover:text-white/70 hover:underline"
            >
              Cookie-instellingen
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
