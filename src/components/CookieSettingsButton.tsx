"use client";

import { useAnalyticsContext } from "@/providers/AnalyticsProvider";

/**
 * Lets visitors change or withdraw their cookie choice (AVG: withdrawing must
 * be as easy as giving consent). Clearing the choice disables analytics,
 * deletes the GA cookies and brings the cookie banner back.
 */
export function CookieSettingsButton() {
  const { hasAnalyticsConsent, isConsentDetermined, revokeConsent } =
    useAnalyticsContext();

  const status = !isConsentDetermined
    ? "Je hebt nog geen keuze gemaakt."
    : hasAnalyticsConsent
      ? "Je hebt statistieken toegestaan."
      : "Je hebt statistieken geweigerd.";

  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <button
        type="button"
        onClick={revokeConsent}
        disabled={!isConsentDetermined}
        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white/40 hover:bg-white/5 disabled:cursor-default disabled:opacity-50"
      >
        Cookie-instellingen wijzigen
      </button>
      <span className="text-sm text-white/50" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
