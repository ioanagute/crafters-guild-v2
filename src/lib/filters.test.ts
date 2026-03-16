import { describe, expect, it } from "vitest";
import {
  buildSearchParams,
  sanitizeGuildQuery,
  sanitizeMarketplaceFilters,
  sanitizeTavernFilter,
} from "@/lib/filters";

describe("filters helpers", () => {
  it("sanitizes marketplace filters against supported values", () => {
    expect(
      sanitizeMarketplaceFilters({
        query: "  cloak  ",
        category: "Apparel",
        sort: "price-asc",
        validCategories: ["All", "Apparel", "Tool"],
      }),
    ).toEqual({
      query: "cloak",
      category: "Apparel",
      sort: "price-asc",
      page: 1,
    });

    expect(
      sanitizeMarketplaceFilters({
        query: null,
        category: "Invalid",
        sort: "weird",
        validCategories: ["All", "Apparel", "Tool"],
      }),
    ).toEqual({
      query: "",
      category: "All",
      sort: "newest",
      page: 1,
    });

    expect(
      sanitizeMarketplaceFilters({
        query: null,
        category: "All",
        sort: "newest",
        page: "3",
        validCategories: ["All", "Apparel", "Tool"],
      }),
    ).toEqual({
      query: "",
      category: "All",
      sort: "newest",
      page: 3,
    });
  });

  it("sanitizes guild queries and tavern filters", () => {
    expect(sanitizeGuildQuery("  iron  ")).toBe("iron");
    expect(sanitizeTavernFilter("mine", false)).toBe("all");
    expect(sanitizeTavernFilter("mine", true)).toBe("mine");
    expect(sanitizeTavernFilter("invalid", true)).toBe("all");
  });

  it("builds search params without default blanks", () => {
    expect(buildSearchParams({ query: "cloak", sort: "", page: null }).toString()).toBe("query=cloak");
  });
});
