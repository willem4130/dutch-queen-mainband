import { describe, expect, it } from "vitest";
import { isoStartDate } from "./event-date";

describe("isoStartDate", () => {
  it("turns the CMS date + time into ISO 8601", () => {
    expect(isoStartDate("Oct 23, 2026", "19:30")).toBe("2026-10-23T19:30");
    expect(isoStartDate("Jun 4, 2027", "8:05")).toBe("2027-06-04T08:05");
  });

  it("falls back to the date alone without a usable time", () => {
    expect(isoStartDate("Dec 1, 2026")).toBe("2026-12-01");
    expect(isoStartDate("Dec 1, 2026", "TBA")).toBe("2026-12-01");
  });

  it("rejects dates it cannot read", () => {
    expect(isoStartDate("23 oktober 2026", "19:30")).toBeNull();
    expect(isoStartDate("Foo 1, 2026")).toBeNull();
  });
});
