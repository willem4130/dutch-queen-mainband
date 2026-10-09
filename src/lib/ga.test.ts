// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { disableGA, loadGA } from "./ga";

const gaScripts = () =>
  document.querySelectorAll('script[src*="googletagmanager.com"]').length;

afterEach(() => {
  document.head.innerHTML = "";
  for (const c of document.cookie.split(";")) {
    document.cookie = `${c.split("=")[0].trim()}=; Max-Age=0; path=/`;
  }
});

describe("Google Analytics consent gating", () => {
  it("layout.tsx never loads gtag itself (GA must wait for consent)", () => {
    const layout = readFileSync(
      join(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );
    expect(layout).not.toMatch(/googletagmanager|gtag\(/);
  });

  it("loads gtag.js once, and only when asked", () => {
    expect(gaScripts()).toBe(0);
    loadGA("G-TEST123");
    loadGA("G-TEST123");
    expect(gaScripts()).toBe(1);
  });

  it("does nothing without a measurement id", () => {
    loadGA(undefined);
    expect(gaScripts()).toBe(0);
  });

  it("on reject: disables GA and removes only the GA cookies", () => {
    document.cookie = "_ga=GA1.1.1; path=/";
    document.cookie = "_ga_TEST123=GS1.1; path=/";
    document.cookie = "tdq_consent=0; path=/";
    disableGA("G-TEST123");
    const flags = window as unknown as Record<string, unknown>;
    expect(flags["ga-disable-G-TEST123"]).toBe(true);
    expect(document.cookie).not.toMatch(/_ga/);
    expect(document.cookie).toContain("tdq_consent=0");
  });
});
