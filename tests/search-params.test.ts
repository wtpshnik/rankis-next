import { describe, it, expect } from "vitest";
import { parseListParams, buildQuery } from "@/lib/search-params";

describe("search params", () => {
  it("parses", () => {
    expect(parseListParams({ brand: "Makita,Stiga", min: "10", max: "99", stock: "1", sort: "price-asc", page: "3" })).toEqual({
      brands: ["Makita", "Stiga"],
      min: 10,
      max: 99,
      inStock: true,
      sort: "price-asc",
      page: 3,
    });
    expect(parseListParams({ sort: "bogus", page: "x" })).toEqual({});
  });
  it("builds and resets page on filter change", () => {
    expect(buildQuery({ brands: ["Makita"], page: 3 }, { page: 4 })).toBe("?brand=Makita&page=4");
    expect(buildQuery({ brands: ["Makita"], page: 3 }, { inStock: true })).toBe("?brand=Makita&stock=1");
    expect(buildQuery({}, {})).toBe("");
  });
});
