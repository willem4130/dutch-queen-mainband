import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The privacy statement must name every analytics tool this site can load.
// Adding a tracker? Add it to src/app/privacy/page.tsx (in all three repos).
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("privacy statement", () => {
  const page = read("src/app/privacy/page.tsx");

  it("mentions every analytics tool the site can load", () => {
    const provider = read("src/providers/AnalyticsProvider.tsx");
    if (provider.includes("posthog")) expect(page).toMatch(/PostHog/);
    if (provider.includes("loadGA")) expect(page).toMatch(/Google Analytics/);
  });

  it("is linked from the cookie banner", () => {
    expect(read("src/components/CookieConsent.tsx")).toContain('href="/privacy"');
  });

  it("gives Reject All and Accept All the same look", () => {
    const banner = read("src/components/CookieConsent.tsx");
    expect(banner.match(/className=\{CHOICE_BUTTON\}/g)).toHaveLength(2);
  });

  it("offers a way to withdraw consent", () => {
    expect(page).toContain("<CookieSettingsButton />");
  });
});
