import { describe, it, expect } from "vitest";
import { formatPrice, discountPercent } from "@/lib/format";

describe("format", () => {
  it("formats EUR in Lithuanian locale", () => {
    expect(formatPrice(1246.41).replace(/ /g, " ")).toBe("1 246,41 €");
  });
  it("computes discount percent", () => {
    expect(discountPercent(4444.11, 5499)).toBe(19);
    expect(discountPercent(10)).toBe(0);
    expect(discountPercent(10, 9)).toBe(0);
  });
});
