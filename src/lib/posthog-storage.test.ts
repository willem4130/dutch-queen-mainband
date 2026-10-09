// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearPostHogStorage } from "./analytics";

// In-memory Web Storage: newer Node versions ship their own (disabled)
// localStorage global, which hides jsdom's in tests.
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, String(v)),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  };
}

const keys = (s: Storage) =>
  Array.from({ length: s.length }, (_, i) => s.key(i));

beforeEach(() => {
  vi.stubGlobal("localStorage", memoryStorage());
  vi.stubGlobal("sessionStorage", memoryStorage());
});
afterEach(() => vi.unstubAllGlobals());

describe("clearPostHogStorage", () => {
  it("removes PostHog's browser storage and keeps everything else", () => {
    localStorage.setItem("ph_phc_TEST_posthog", '{"distinct_id":"x"}');
    localStorage.setItem("__ph_opt_in_out_phc_TEST", "0");
    sessionStorage.setItem("ph_phc_TEST_primary_window_exists", "true");
    localStorage.setItem("tdq_cookie_consent", '{"analytics":false}');

    clearPostHogStorage();

    expect(keys(localStorage)).toEqual(["tdq_cookie_consent"]);
    expect(keys(sessionStorage)).toEqual([]);
  });

  it("never throws when storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      get length(): number {
        throw new Error("SecurityError");
      },
    });
    expect(() => clearPostHogStorage()).not.toThrow();
  });
});
