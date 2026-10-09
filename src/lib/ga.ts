// Google Analytics 4 — loaded ONLY after the visitor accepts analytics cookies.
// AnalyticsProvider is the single consent chokepoint that calls these. Never put
// the gtag <Script> back in layout.tsx: that loads GA and sets _ga cookies
// before consent (AVG / Telecommunicatiewet). Guarded by ga.test.ts.

const GA_SRC = "https://www.googletagmanager.com/gtag/js?id=";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function setDisabled(id: string, disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = disabled;
}

/** Load gtag.js and start GA4 for `id` (no-op without an id or when loaded). */
export function loadGA(id: string | undefined): void {
  if (!id || typeof window === "undefined") return;
  setDisabled(id, false);
  if (document.querySelector(`script[src^="${GA_SRC}"]`)) return;

  const w = window as GtagWindow;
  const dataLayer = (w.dataLayer = w.dataLayer || []);
  w.gtag = function gtag() {
    // gtag.js only recognises the Arguments object, not a spread array.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id);

  const script = document.createElement("script");
  script.async = true;
  script.src = GA_SRC + encodeURIComponent(id);
  document.head.appendChild(script);
}

/** Stop GA for `id` (if it was loaded) and remove its cookies. */
export function disableGA(id: string | undefined): void {
  if (typeof window === "undefined") return;
  if (id) setDisabled(id, true);
  deleteGACookies();
}

/** Expire _ga, _ga_<id>, _gid and _gat* on this host and its parent domains. */
export function deleteGACookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^(_ga|_ga_.+|_gid|_gat.*)$/.test(n));
  if (names.length === 0) return;

  const labels = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < labels.length - 1; i++) {
    domains.push(`.${labels.slice(i).join(".")}`);
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
