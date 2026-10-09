import type { ListQuery, Sort } from "./catalog";

const SORTS: Sort[] = ["popular", "price-asc", "price-desc", "name"];
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export type RawParams = Record<string, string | string[] | undefined>;

export function parseListParams(sp: RawParams): ListQuery {
  const q: ListQuery = {};
  const brand = one(sp.brand);
  if (brand) q.brands = brand.split(",").filter(Boolean);
  const min = Number(one(sp.min));
  if (one(sp.min) && Number.isFinite(min)) q.min = min;
  const max = Number(one(sp.max));
  if (one(sp.max) && Number.isFinite(max)) q.max = max;
  if (one(sp.stock) === "1") q.inStock = true;
  const sort = one(sp.sort) as Sort;
  if (SORTS.includes(sort) && sort !== "popular") q.sort = sort;
  const page = Number(one(sp.page));
  if (Number.isInteger(page) && page > 1) q.page = page;
  const text = one(sp.q).trim();
  if (text) q.q = text;
  return q;
}

export function buildQuery(base: ListQuery, patch: Partial<ListQuery>): string {
  const keys = Object.keys(patch) as (keyof ListQuery)[];
  const q: ListQuery = { ...base, ...patch };
  if (!(keys.length === 1 && keys[0] === "page")) delete q.page;
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.brands?.length) p.set("brand", q.brands.join(","));
  if (q.min != null) p.set("min", String(q.min));
  if (q.max != null) p.set("max", String(q.max));
  if (q.inStock) p.set("stock", "1");
  if (q.sort && q.sort !== "popular") p.set("sort", q.sort);
  if (q.page && q.page > 1) p.set("page", String(q.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}
