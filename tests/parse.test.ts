import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseCategories, parseProduct, sanitizeDescription } from "../scripts/parse";

const html = readFileSync("scripts/__fixtures__/product.html", "utf8");
const url = "https://www.rankis.lt/blue-bird-thcs-22-07-akumuliatorinis-pjuklas";

describe("parseCategories", () => {
  it("extracts the category tree from the page menu", () => {
    const cats = parseCategories(html);
    expect(cats.length).toBeGreaterThan(1000);
    expect(cats.find((c) => c.slug === "sodo-technika")).toEqual({ slug: "sodo-technika", name: "Sodo technika", parent: null });
    const leaf = cats.find((c) => c.slug === "sodo-technika/sodo-ir-vejos-traktoriukai/rider-vejos-traktoriukai")!;
    expect(leaf.parent).toBe("sodo-technika/sodo-ir-vejos-traktoriukai");
    expect(new Set(cats.map((c) => c.slug)).size).toBe(cats.length);
  });
});

describe("parseProduct", () => {
  const p = parseProduct(html, url)!;
  it("reads core fields from JSON-LD", () => {
    expect(p.slug).toBe("blue-bird-thcs-22-07-akumuliatorinis-pjuklas");
    expect(p.sku).toBe("887400");
    expect(p.name).toBe("Blue Bird THCS 22-07 akumuliatorinis pjūklas");
    expect(p.brand).toBe("Blue Bird industries");
    expect(p.price).toBe(249);
    expect(p.inStock).toBe(true);
    expect(p.oldPrice).toBeUndefined();
  });
  it("reads category path from breadcrumbs", () => {
    expect(p.categoryPath).toEqual([
      "sodo-technika",
      "sodo-technika/grandininiai-pjuklai",
      "sodo-technika/grandininiai-pjuklai/grandininiai-akumuliatoriniai-pjuklai",
    ]);
  });
  it("reads gallery images at 800px", () => {
    expect(p.images.length).toBeGreaterThanOrEqual(3);
    expect(p.images[0]).toMatch(/\/800x800\.g\/blue-bird-thcs-22-07-akumuliatorinis-pjuklas\.jpg/);
    expect(new Set(p.images).size).toBe(p.images.length);
  });
  it("reads specs and description", () => {
    expect(p.specs).toContainEqual({ name: "Gamintojas", value: "Blue Bird industries" });
    expect(p.description).toContain("labai lengvas");
    expect(p.description).not.toContain("<iframe");
    expect(p.description).not.toContain("iliustracinio");
  });
  it("returns null without product JSON-LD", () => {
    expect(parseProduct("<html></html>", url)).toBeNull();
  });
});

describe("sanitizeDescription", () => {
  it("strips dangerous tags and keeps text", () => {
    expect(sanitizeDescription('<p>Hi <a href="x">link</a> <script>1</script><img src="y"></p>')).toBe("<p>Hi link </p>");
  });
});
