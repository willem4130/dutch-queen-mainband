import { describe, expect, it } from "vitest";
import { membersJsonLd } from "./band-members";

describe("membersJsonLd", () => {
  it("turns the CMS line-up into schema.org Person entries", () => {
    expect(
      membersJsonLd([
        { name: "Merijn van Haren", role: "Vocals" },
        { name: " Tim van Delft ", role: " Drums " },
      ]),
    ).toEqual([
      { "@type": "Person", name: "Merijn van Haren", roleName: "Vocals" },
      { "@type": "Person", name: "Tim van Delft", roleName: "Drums" },
    ]);
  });

  it("skips entries without a name and omits an empty role", () => {
    expect(
      membersJsonLd([{ name: "", role: "Bass" }, { role: "Keys" }, { name: "Kees Lewiszong" }]),
    ).toEqual([{ "@type": "Person", name: "Kees Lewiszong" }]);
  });

  it("returns nothing for a missing or malformed list", () => {
    expect(membersJsonLd(undefined)).toEqual([]);
    expect(membersJsonLd("Merijn")).toEqual([]);
    expect(membersJsonLd([null, 3])).toEqual([]);
  });
});
