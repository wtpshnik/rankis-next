import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { CardProduct, Category, Product } from "./types";
import { discountPercent } from "./format";
import { applyQuery, toCard, type ListQuery, type ListResult } from "./query";

export type { ListQuery, ListResult, Sort } from "./query";

// ponytail: in-memory JSON catalog, server-side only; swap this module for DB queries in the backend stage
const categories = categoriesJson as Category[];
const products = productsJson as Product[];
const bySlug = new Map(categories.map((c) => [c.slug, c]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const childrenOf = new Map<string | null, Category[]>();
for (const c of categories) childrenOf.set(c.parent, [...(childrenOf.get(c.parent) ?? []), c]);

export const getCategoryTree = () => categories;
export const getTopCategories = () => childrenOf.get(null) ?? [];
export const getCategory = (slug: string) => bySlug.get(slug);
export const getChildren = (slug: string) => childrenOf.get(slug) ?? [];

export function getAncestors(slug: string): Category[] {
  const out: Category[] = [];
  let cur = bySlug.get(slug)?.parent ?? null;
  while (cur) {
    const c = bySlug.get(cur);
    if (!c) break;
    out.unshift(c);
    cur = c.parent;
  }
  return out;
}

const inCategory = (p: Product, slug: string) => p.categoryPath.includes(slug) || (p.extraCategories?.includes(slug) ?? false);

export const getCategoryImage = (slug: string) => products.find((p) => inCategory(p, slug))?.images[0];
export const getCategoryProducts = (slug: string) => products.filter((p) => inCategory(p, slug));
export const getCategoryCards = (slug: string): CardProduct[] => getCategoryProducts(slug).map(toCard);
export const getAllCards = (): CardProduct[] => products.map(toCard);

export function listProducts(q: ListQuery): ListResult<Product> {
  const pool = q.category ? getCategoryProducts(q.category) : products;
  const r = applyQuery(pool.map(toCard), q);
  return { ...r, items: r.items.map((c) => productBySlug.get(c.slug)!) };
}

export const getProduct = (slug: string) => productBySlug.get(slug);

export function getRelated(p: Product, n = 8): Product[] {
  const leaf = p.categoryPath.at(-1);
  const pool = leaf ? products.filter((x) => x.slug !== p.slug && x.categoryPath.at(-1) === leaf) : [];
  const more =
    pool.length < n && p.categoryPath.length > 1
      ? products.filter((x) => x.slug !== p.slug && !pool.includes(x) && inCategory(x, p.categoryPath.at(-2)!))
      : [];
  return [...pool, ...more].slice(0, n);
}

export function getBrands(category?: string): string[] {
  const pool = category ? getCategoryProducts(category) : products;
  return [...new Set(pool.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function getTopBrands(n = 12): string[] {
  const count = new Map<string, number>();
  for (const p of products) if (p.brand) count.set(p.brand, (count.get(p.brand) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([b]) => b);
}

export const getPromoProducts = (n = 12) =>
  products
    .filter((p) => p.oldPrice)
    .sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice))
    .slice(0, n);

export const getNewProducts = (n = 12) => products.slice(0, n);
export const getAllProductSlugs = () => products.map((p) => p.slug);
export const getAllCategorySlugs = () => categories.map((c) => c.slug);
