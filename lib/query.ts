import type { CardProduct, Product } from "./types";

// Pure, client-safe filtering / sorting / paging over compact products. No data imports here.

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
export type ListResult<T = CardProduct> = { items: T[]; total: number; page: number; pages: number };

export const toCard = (p: Product | CardProduct): CardProduct =>
  "image" in p ? p : { slug: p.slug, sku: p.sku, name: p.name, brand: p.brand, price: p.price, oldPrice: p.oldPrice, inStock: p.inStock, image: p.images[0] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function applyQuery<T extends CardProduct>(all: T[], q: ListQuery): ListResult<T> {
  let items = all;
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
      // ponytail: no popularity data yet; in-stock first keeps source order otherwise
      items = [...items].sort((a, b) => Number(b.inStock) - Number(a.inStock));
  }
  const perPage = q.perPage ?? 24;
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, q.page ?? 1), pages);
  return { items: items.slice((page - 1) * perPage, page * perPage), total, page, pages };
}

export const brandsOf = (items: CardProduct[]) => [...new Set(items.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
