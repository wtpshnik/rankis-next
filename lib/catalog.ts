import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { Category, Product } from "./types";
import { discountPercent } from "./format";

// ponytail: in-memory JSON catalog; swap this module for DB queries in the backend stage
const categories = categoriesJson as Category[];
const products = productsJson as Product[];
const bySlug = new Map(categories.map((c) => [c.slug, c]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const childrenOf = new Map<string | null, Category[]>();
for (const c of categories) childrenOf.set(c.parent, [...(childrenOf.get(c.parent) ?? []), c]);

export type Sort = "popular" | "price-asc" | "price-desc" | "name";
export type ListQuery = {
  category?: string;
  brands?: string[];
  min?: number;
  max?: number;
  inStock?: boolean;
  sort?: Sort;
  page?: number;
  perPage?: number;
  q?: string;
};
export type ListResult = { items: Product[]; total: number; page: number; pages: number };

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
export const countInCategory = (slug: string) => products.filter((p) => inCategory(p, slug)).length;

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function listProducts(q: ListQuery): ListResult {
  let items = products;
  if (q.category) items = items.filter((p) => inCategory(p, q.category!));
  if (q.brands?.length) {
    const set = new Set(q.brands);
    items = items.filter((p) => set.has(p.brand));
  }
  if (q.min != null) items = items.filter((p) => p.price >= q.min!);
  if (q.max != null) items = items.filter((p) => p.price <= q.max!);
  if (q.inStock) items = items.filter((p) => p.inStock);
  if (q.q?.trim()) {
    const raw = q.q.trim();
    const words = norm(raw).split(/\s+/).filter(Boolean);
    items = items.filter((p) => {
      const hay = norm(`${p.name} ${p.sku} ${p.brand}`);
      return words.every((w) => hay.includes(w));
    });
    items = [...items].sort((a, b) => Number(b.sku === raw) - Number(a.sku === raw));
  }
  switch (q.sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "name":
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, "lt"));
      break;
    default:
      // ponytail: no popularity data yet; in-stock first keeps file order otherwise
      items = [...items].sort((a, b) => Number(b.inStock) - Number(a.inStock));
  }
  const perPage = q.perPage ?? 24;
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, q.page ?? 1), pages);
  return { items: items.slice((page - 1) * perPage, page * perPage), total, page, pages };
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
  const pool = category ? products.filter((p) => inCategory(p, category)) : products;
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
