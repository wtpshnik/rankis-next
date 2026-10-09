import { describe, it, expect } from "vitest";
import * as c from "@/lib/catalog";

describe("catalog", () => {
  it("has a tree with 6 roots", () => {
    expect(c.getTopCategories().length).toBe(6);
    expect(c.getChildren("sodo-technika").length).toBeGreaterThan(5);
    expect(c.getAncestors("sodo-technika/grandininiai-pjuklai").map((x) => x.slug)).toEqual(["sodo-technika"]);
  });
  it("lists products in a category including descendants", () => {
    const r = c.listProducts({ category: "sodo-technika", perPage: 5 });
    expect(r.total).toBeGreaterThan(5);
    expect(r.items.length).toBe(5);
    expect(r.pages).toBe(Math.ceil(r.total / 5));
    for (const p of r.items) expect(p.categoryPath[0]).toBe("sodo-technika");
  });
  it("filters by brand, price, stock and sorts", () => {
    const brand = c.getBrands("sodo-technika")[0];
    const r = c.listProducts({ category: "sodo-technika", brands: [brand], inStock: true, sort: "price-asc", perPage: 100 });
    for (const p of r.items) {
      expect(p.brand).toBe(brand);
      expect(p.inStock).toBe(true);
    }
    for (let i = 1; i < r.items.length; i++) expect(r.items[i].price).toBeGreaterThanOrEqual(r.items[i - 1].price);
    const r2 = c.listProducts({ min: 100, max: 200, perPage: 1000 });
    for (const p of r2.items) {
      expect(p.price).toBeGreaterThanOrEqual(100);
      expect(p.price).toBeLessThanOrEqual(200);
    }
  });
  it("searches by name words and sku", () => {
    const any = c.getNewProducts(1)[0];
    expect(c.listProducts({ q: any.sku }).items[0].slug).toBe(any.slug);
    const word = any.name.split(" ").find((w) => w.length > 3)!;
    expect(c.listProducts({ q: word.toLowerCase() }).total).toBeGreaterThan(0);
  });
  it("gets product and related", () => {
    const p = c.getNewProducts(1)[0];
    expect(c.getProduct(p.slug)?.slug).toBe(p.slug);
    const rel = c.getRelated(p, 8);
    expect(rel.length).toBeLessThanOrEqual(8);
    expect(rel.find((x) => x.slug === p.slug)).toBeUndefined();
  });
  it("promo products are sorted by discount", () => {
    const promo = c.getPromoProducts(10);
    expect(promo.length).toBeGreaterThan(0);
    for (const p of promo) expect(p.oldPrice!).toBeGreaterThan(p.price);
  });
});
