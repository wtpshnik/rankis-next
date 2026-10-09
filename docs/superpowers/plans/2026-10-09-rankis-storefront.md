# rankis.lt Storefront (Stage 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new Next.js storefront for rankis.lt (home, category, product, search, cart) with a modern yellow/black design, running on ~3000 real products scraped from the current Verskis site into JSON.

**Architecture:** `scripts/scrape.ts` builds `data/categories.json` + `data/products.json` from public pages of rankis.lt (category menu embedded in every page, product URLs from `products.xml`, product data from JSON-LD + a few HTML attributes). `lib/catalog.ts` is the only module that reads the JSON and exposes typed query functions; all pages are React Server Components calling it. Cart is a client-side React context persisted to `localStorage`.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, `next/font` Inter, `tsx` for scripts, Vitest for unit tests, Playwright for smoke e2e. No UI library.

**Spec:** `docs/superpowers/specs/2026-10-09-rankis-storefront-design.md`

## Global Constraints

- Project folder: `C:\Users\MaksimNosovičTeronis\rankis-next` (already a git repo with the spec committed).
- Stack: Next.js latest stable (16.x) App Router + TypeScript + Tailwind v4. No UI component libraries.
- Data lives in `data/*.json`; `lib/catalog.ts` is the only reader. Pages never import JSON directly.
- Images are hot-linked from `https://www.rankis.lt/images/...`; `next.config.ts` must allow `www.rankis.lt` in `images.remotePatterns`.
- Scrape target: ~3000 products, max 150 per leaf category, polite: concurrency 6, 150 ms delay, browser `User-Agent`, retry on 429/5xx. Cache fetched pages in `data/.cache/` (git-ignored).
- UI language: Lithuanian. All UI strings in `lib/ui-text.ts`.
- Colors: bg `#FFFFFF`, text `#111111`, muted `#6B7280`, border `#E5E7EB`, accent `#FFD400`, accent-hover `#E6BF00`. Font Inter. Card radius 12px, 1px border, no shadow. Container max 1280px.
- Grid: 2 / 3 / 4 columns (mobile / tablet / desktop). Category page: 24 per page.
- Commit after each task. Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Windows host; run shell commands with Git Bash syntax. `python -I` for any ad-hoc Python.

---

## File Structure

```
rankis-next/
  package.json, next.config.ts, tsconfig.json, postcss.config.mjs, vitest.config.ts, playwright.config.ts
  app/
    layout.tsx            root layout: font, Header, MobileBar, Footer, CartProvider
    globals.css           Tailwind v4 import + @theme tokens
    page.tsx              home
    not-found.tsx
    c/[...slug]/page.tsx  category
    p/[slug]/page.tsx     product
    search/page.tsx
    cart/page.tsx
    checkout/page.tsx     stub
    (static)/pristatymas/page.tsx, garantija/page.tsx, kontaktai/page.tsx
  components/
    ui/Button.tsx, Badge.tsx, Price.tsx, QuantityInput.tsx
    layout/Header.tsx, CategoryNav.tsx, MobileBar.tsx, Footer.tsx, SearchBox.tsx
    catalog/ProductCard.tsx, ProductGrid.tsx, Filters.tsx, SortSelect.tsx, Pagination.tsx, Breadcrumbs.tsx, EmptyState.tsx
    product/Gallery.tsx, SpecsTable.tsx, AddToCart.tsx
    cart/CartProvider.tsx, CartIcon.tsx, CartTable.tsx
  lib/
    types.ts              Category, Product
    catalog.ts            data access (reads data/*.json)
    ui-text.ts            strings
    format.ts             formatPrice, discountPercent
    search-params.ts      parse/serialize category filter query params
  scripts/
    parse.ts              pure HTML→data functions (unit-tested)
    scrape.ts             fetcher/orchestrator; writes data/*.json
    __fixtures__/product.html
  data/
    categories.json, products.json, .cache/ (ignored)
  tests/
    parse.test.ts, catalog.test.ts, format.test.ts
  e2e/
    smoke.spec.ts
```

---

### Task 1: Scaffold project, theme tokens, types, UI text

**Files:**
- Create: whole Next.js scaffold via `create-next-app`, then edit `app/globals.css`, `app/layout.tsx`, `next.config.ts`, `.gitignore`
- Create: `lib/types.ts`, `lib/ui-text.ts`, `lib/format.ts`, `tests/format.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces: `Category`, `Product` types; `t` object of UI strings; `formatPrice(n): string` (`"1 246,41 €"`), `discountPercent(price, oldPrice): number`.

- [ ] **Step 1: Scaffold**

```bash
cd "C:/Users/MaksimNosovičTeronis/rankis-next"
npx --yes create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes
npm i -D tsx vitest @vitejs/plugin-react @playwright/test
```
If `create-next-app` refuses a non-empty directory, scaffold into `tmp-scaffold`, then `cp -r tmp-scaffold/. .` and `rm -rf tmp-scaffold`.

- [ ] **Step 2: Theme tokens** — replace `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #111111;
  --color-muted: #6b7280;
  --color-line: #e5e7eb;
  --color-accent: #ffd400;
  --color-accent-hover: #e6bf00;
  --color-surface: #f7f7f8;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --radius-card: 12px;
}

html { color: var(--color-ink); background: #fff; }
body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
.container-x { @apply mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8; }
```

- [ ] **Step 3: next.config.ts**

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "www.rankis.lt" }] },
};
export default nextConfig;
```

- [ ] **Step 4: Types, text, format**

`lib/types.ts`:
```ts
export type Category = { slug: string; name: string; parent: string | null };
export type Product = {
  slug: string; sku: string; name: string; brand: string;
  price: number; oldPrice?: number; inStock: boolean;
  images: string[]; description: string;
  specs: { name: string; value: string }[];
  categoryPath: string[];
};
```

`lib/ui-text.ts`:
```ts
export const t = {
  siteName: "RANKIS.LT",
  search: "Paieška", searchPlaceholder: "Ieškoti prekių, kodų...",
  cart: "Krepšelis", cartEmpty: "Krepšelis tuščias", addToCart: "Į krepšelį", added: "Pridėta",
  inStock: "Yra sandėlyje", outOfStock: "Užsakoma", code: "Kodas", brand: "Gamintojas",
  price: "Kaina", oldPrice: "Sena kaina", vat: "su PVM", save: "Sutaupote",
  home: "Pradžia", catalog: "Katalogas", all: "Visos prekės",
  filters: "Filtrai", reset: "Išvalyti", apply: "Taikyti", brands: "Gamintojai",
  priceRange: "Kaina, €", onlyInStock: "Tik turimos", sort: "Rikiuoti",
  sortPopular: "Populiariausios", sortPriceAsc: "Pigiausios", sortPriceDesc: "Brangiausios", sortName: "Pagal pavadinimą",
  results: "prekių", nothingFound: "Nieko nerasta", tryOther: "Pabandykite kitus filtrus arba paieškos žodžius.",
  specs: "Techniniai duomenys", description: "Aprašymas", related: "Panašios prekės",
  promo: "Akcijos", news: "Naujienos", categories: "Kategorijos", brandsStrip: "Mūsų prekių ženklai",
  qty: "Kiekis", total: "Iš viso", remove: "Pašalinti", checkout: "Pirkti", continueShopping: "Tęsti apsipirkimą",
  checkoutSoon: "Užsakymų priėmimas ruošiamas", checkoutSoonText: "Kol kas užsakykite telefonu arba el. paštu.",
  phone: "+370 689 00009", email: "uzsakymai@rankis.lt",
  delivery: "Pristatymas", warranty: "Garantija", contacts: "Kontaktai", service: "Serviso paslaugos",
  heroTitle: "Įrankiai ir sodo technika profesionalams ir namams",
  heroText: "Husqvarna, Makita, Stiga, Festool ir dar 40 prekių ženklų. Pristatymas per 1–3 d. d.",
  heroCta: "Žiūrėti akcijas",
  notFound: "Puslapis nerastas", page: "Puslapis", prev: "Ankstesnis", next: "Kitas",
  footerAbout: "UAB Teronis — įrankių ir sodo technikos prekyba nuo 1995 m.",
} as const;
```

`lib/format.ts`:
```ts
export function formatPrice(n: number): string {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(n);
}
export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
```

- [ ] **Step 5: Vitest config + test**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
```
Add to `package.json` scripts: `"test": "vitest run"`, `"scrape": "tsx scripts/scrape.ts"`, `"e2e": "playwright test"`.

`tests/format.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatPrice, discountPercent } from "@/lib/format";
describe("format", () => {
  it("formats EUR in Lithuanian locale", () => {
    expect(formatPrice(1246.41).replace(/\u00a0/g, " ")).toBe("1 246,41 €");
  });
  it("computes discount percent", () => {
    expect(discountPercent(4444.11, 5499)).toBe(19);
    expect(discountPercent(10)).toBe(0);
    expect(discountPercent(10, 9)).toBe(0);
  });
});
```

- [ ] **Step 6: Run** `npm test` → PASS. Add `data/.cache/` and `test-results/` to `.gitignore`. Remove boilerplate from `app/page.tsx` (leave `export default function Home(){return <main className="container-x py-10">rankis</main>}`), delete `public/*.svg`.

- [ ] **Step 7: Commit** `feat: scaffold Next.js storefront with theme tokens, types, ui text`

---

### Task 2: HTML parsers (pure functions) with fixture test

**Files:**
- Create: `scripts/parse.ts`, `scripts/__fixtures__/product.html`, `tests/parse.test.ts`

**Interfaces:**
- Produces:
  - `parseCategories(html: string): Category[]` — from the left menu `li.item-id-N > a[href][title]` present on every page; slug = URL path after host; parent = slug without last segment or `null`.
  - `parseProduct(html: string, url: string): Product | null` — JSON-LD `Product` + `BreadcrumbList`, `data-priceold`, gallery `img.product-gallery-element[data-src]`, `.product-attribute[data-attribute-name][data-attribute-values]`, `#tab_description` inner HTML (sanitized). Returns `null` if no `Product` JSON-LD or price ≤ 0.
  - `sanitizeDescription(html: string): string` — keeps `p, br, ul, ol, li, strong, b, em, h2, h3, table, tr, td, th`; drops `iframe, script, img, a` (keeps link text); drops the `.text-tab` boilerplate block; collapses whitespace; `<h1>` → `<h3>`.

- [ ] **Step 1: Save fixture** — copy the dumped page: `cp "C:/Users/MAKSIM~1/AppData/Local/Temp/claude/C--Users-MaksimNosovi-Teronis/f548fec3-8ac2-493f-a393-148863983eac/scratchpad/prod.html" scripts/__fixtures__/product.html`. If missing, re-download `https://www.rankis.lt/blue-bird-thcs-22-07-akumuliatorinis-pjuklas` with a browser User-Agent.

- [ ] **Step 2: Failing test** `tests/parse.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseCategories, parseProduct, sanitizeDescription } from "../scripts/parse";
const html = readFileSync("scripts/__fixtures__/product.html", "utf8");
const url = "https://www.rankis.lt/blue-bird-thcs-22-07-akumuliatorinis-pjuklas";

describe("parseCategories", () => {
  it("extracts the category tree from the page menu", () => {
    const cats = parseCategories(html);
    expect(cats.length).toBeGreaterThan(1000);
    expect(cats.find(c => c.slug === "sodo-technika")).toEqual({ slug: "sodo-technika", name: "Sodo technika", parent: null });
    const leaf = cats.find(c => c.slug === "sodo-technika/sodo-ir-vejos-traktoriukai/rider-vejos-traktoriukai")!;
    expect(leaf.parent).toBe("sodo-technika/sodo-ir-vejos-traktoriukai");
    expect(new Set(cats.map(c => c.slug)).size).toBe(cats.length);
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
```

- [ ] **Step 3: Run** `npm test` → FAIL (module not found).

- [ ] **Step 4: Implement** `scripts/parse.ts`:

```ts
import type { Category, Product } from "../lib/types";

const HOST = "https://www.rankis.lt/";

function decode(s: string): string {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

export function parseCategories(html: string): Category[] {
  const re = /<li class="[^"]*\bitem-id-\d+\b[^"]*">\s*<a href="https:\/\/www\.rankis\.lt\/([^"]+)" title="([^"]*)"/g;
  const seen = new Map<string, Category>();
  for (const m of html.matchAll(re)) {
    const slug = m[1].replace(/\/$/, "");
    if (seen.has(slug)) continue;
    const parts = slug.split("/");
    seen.set(slug, { slug, name: decode(m[2]) || parts.at(-1)!.replace(/-/g, " "), parent: parts.length > 1 ? parts.slice(0, -1).join("/") : null });
  }
  return [...seen.values()];
}

function jsonLd(html: string): any[] {
  const out: any[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { out.push(JSON.parse(m[1])); } catch { /* skip */ }
  }
  return out;
}

const KEEP = new Set(["p", "br", "ul", "ol", "li", "strong", "b", "em", "h2", "h3", "table", "tr", "td", "th", "tbody", "thead"]);

export function sanitizeDescription(html: string): string {
  let s = html.replace(/<div class="text-tab[\s\S]*$/, "");        // site boilerplate block to the end
  s = s.replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<h1\b[^>]*>/gi, "<h3>").replace(/<\/h1>/gi, "</h3>");
  s = s.replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (tag, name: string) => {
    const n = name.toLowerCase();
    if (!KEEP.has(n)) return "";
    return tag.startsWith("</") ? `</${n}>` : n === "br" ? "<br>" : `<${n}>`;
  });
  s = s.replace(/<p>\s*(&nbsp;|\s)*<\/p>/g, "").replace(/\s+/g, " ").trim();
  return s;
}

export function parseProduct(html: string, url: string): Product | null {
  const ld = jsonLd(html);
  const prod = ld.find(x => x["@type"] === "Product");
  if (!prod) return null;
  const price = Number(prod.offers?.price);
  if (!(price > 0)) return null;
  const slug = url.replace(HOST, "").replace(/\/$/, "");

  const crumbs = ld.find(x => x["@type"] === "BreadcrumbList")?.itemListElement ?? [];
  const categoryPath = crumbs.map((c: any) => String(c.item?.["@id"] ?? "").replace(HOST, "").replace(/\/$/, ""))
    .filter((s: string) => s && s !== slug);

  const oldM = html.match(/data-priceold="([\d.]+)"/);
  const oldPrice = oldM ? Number(oldM[1]) : undefined;

  const images: string[] = [];
  for (const m of html.matchAll(/<img[^>]*class="product-gallery-element"[^>]*>/g)) {
    const src = m[0].match(/data-src="([^"]+)"/)?.[1] ?? m[0].match(/\ssrc="([^"]+)"/)?.[1];
    if (src && !images.includes(src)) images.push(src);
  }
  if (images.length === 0 && prod.image) images.push(String(prod.image));

  const specs: { name: string; value: string }[] = [];
  for (const m of html.matchAll(/data-attribute-name="([^"]*)"\s+data-attribute-values='([^']*)'/g)) {
    try {
      const vals = JSON.parse(m[2]);
      specs.push({ name: decode(m[1]), value: (Array.isArray(vals) ? vals : [vals]).map(String).map(decode).join(", ") });
    } catch { /* skip */ }
  }

  const descM = html.match(/id="tab_description"[^>]*>([\s\S]*?)<div class="tabs-description tab-comments/);
  const description = descM ? sanitizeDescription(descM[1]) : sanitizeDescription(`<p>${String(prod.description ?? "")}</p>`);

  return {
    slug, sku: String(prod.sku ?? ""), name: decode(String(prod.name ?? "")), brand: decode(String(prod.brand ?? "")),
    price, oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    inStock: String(prod.offers?.availability ?? "").endsWith("InStock"),
    images, description, specs, categoryPath,
  };
}
```

- [ ] **Step 5: Run** `npm test` → PASS. If the description test fails on `iliustracinio`, check the fixture: the boilerplate is inside `<div class="text-tab text-tab-id-79">` — the regex above removes from that div to the end of the captured segment.

- [ ] **Step 6: Commit** `feat: product and category HTML parsers with fixture test`

---

### Task 3: Scraper orchestrator and data files

**Files:**
- Create: `scripts/scrape.ts`
- Produces: `data/categories.json` (array of `Category`), `data/products.json` (array of `Product`).

**Interfaces:**
- Consumes: `parseCategories`, `parseProduct` from Task 2.

- [ ] **Step 1: Implement** `scripts/scrape.ts`:

```ts
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseCategories, parseProduct } from "./parse";
import type { Category, Product } from "../lib/types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const TARGET = Number(process.env.TARGET ?? 3000);
const PER_LEAF = Number(process.env.PER_LEAF ?? 150);
const CONCURRENCY = 6, DELAY_MS = 150;
const CACHE = "data/.cache";
mkdirSync(CACHE, { recursive: true });

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchText(url: string): Promise<string | null> {
  const key = `${CACHE}/${createHash("sha1").update(url).digest("hex")}.html`;
  if (existsSync(key)) return readFileSync(key, "utf8");
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "lt" } });
      if (r.status === 404) return null;
      if (r.status === 429 || r.status >= 500) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      writeFileSync(key, text);
      await sleep(DELAY_MS);
      return text;
    } catch (e) {
      console.warn(`retry ${attempt + 1} ${url}: ${(e as Error).message}`);
      await sleep(1000 * 2 ** attempt);
    }
  }
  return null;
}

async function productUrls(): Promise<string[]> {
  const idx = await fetchText("https://www.rankis.lt/sitemap.xml");
  const chunks = [...(idx ?? "").matchAll(/<loc>([^<]*products\.xml[^<]*)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, "&"));
  // spread over the whole catalog: take every chunk but only a slice of each
  const urls: string[] = [];
  for (const c of chunks) {
    const xml = await fetchText(c);
    const locs = [...(xml ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    for (let i = 0; i < locs.length; i += Math.ceil(locs.length / 80)) urls.push(locs[i]);
  }
  return urls;
}

async function main() {
  const home = await fetchText("https://www.rankis.lt/");
  if (!home) throw new Error("cannot fetch home page");
  const categories: Category[] = parseCategories(home);
  const catSet = new Set(categories.map(c => c.slug));
  console.log(`categories: ${categories.length}`);

  const urls = await productUrls();
  console.log(`candidate product urls: ${urls.length}`);

  const products: Product[] = [];
  const perLeaf = new Map<string, number>();
  let i = 0;
  async function worker() {
    while (i < urls.length && products.length < TARGET) {
      const url = urls[i++];
      const html = await fetchText(url);
      if (!html) continue;
      const p = parseProduct(html, url);
      if (!p || p.categoryPath.length === 0 || !catSet.has(p.categoryPath.at(-1)!)) continue;
      const leaf = p.categoryPath.at(-1)!;
      if ((perLeaf.get(leaf) ?? 0) >= PER_LEAF) continue;
      perLeaf.set(leaf, (perLeaf.get(leaf) ?? 0) + 1);
      products.push(p);
      if (products.length % 100 === 0) console.log(`products: ${products.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // integrity
  const slugs = new Set<string>();
  for (const p of products) {
    if (!p.slug || !p.name || !(p.price > 0) || p.images.length === 0) throw new Error(`bad product ${p.slug}`);
    for (const c of p.categoryPath) if (!catSet.has(c)) throw new Error(`unknown category ${c} on ${p.slug}`);
    if (slugs.has(p.slug)) throw new Error(`duplicate slug ${p.slug}`);
    slugs.add(p.slug);
  }
  mkdirSync("data", { recursive: true });
  writeFileSync("data/categories.json", JSON.stringify(categories));
  writeFileSync("data/products.json", JSON.stringify(products));
  console.log(`done: ${products.length} products, ${categories.length} categories`);
}

main().catch(e => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Dry run** `TARGET=50 npm run scrape` → finishes, prints `done: 50 products`. Inspect `node -e "const p=require('./data/products.json');console.log(p[0], p.filter(x=>x.oldPrice).length)"`.

- [ ] **Step 3: Full run** `npm run scrape` in the background (expect 15–40 minutes). Verify: `done: ~3000`, brands count `node -e "const p=require('./data/products.json');console.log(new Set(p.map(x=>x.brand)).size, p.filter(x=>x.oldPrice).length, new Set(p.map(x=>x.categoryPath[0])).size)"` shows ≥ 20 brands, ≥ 50 discounted, all 6 top categories.

- [ ] **Step 4: Commit** `feat: scraper and initial product/category dataset` (commit `data/*.json`, not `.cache`).

---

### Task 4: Catalog data layer

**Files:**
- Create: `lib/catalog.ts`, `tests/catalog.test.ts`

**Interfaces:**
- Produces:
```ts
export type Sort = "popular" | "price-asc" | "price-desc" | "name";
export type ListQuery = { category?: string; brands?: string[]; min?: number; max?: number; inStock?: boolean; sort?: Sort; page?: number; perPage?: number; q?: string };
export type ListResult = { items: Product[]; total: number; page: number; pages: number };
export function getCategoryTree(): Category[]                 // all
export function getTopCategories(): Category[]                // parent === null
export function getCategory(slug: string): Category | undefined
export function getChildren(slug: string): Category[]
export function getAncestors(slug: string): Category[]         // root → parent
export function getCategoryImage(slug: string): string | undefined  // first product image under it
export function listProducts(q: ListQuery): ListResult
export function getProduct(slug: string): Product | undefined
export function getRelated(p: Product, n?: number): Product[]
export function getBrands(category?: string): string[]         // sorted, unique
export function getPromoProducts(n?: number): Product[]        // has oldPrice, biggest % first
export function getNewProducts(n?: number): Product[]          // first n in file order
export function getAllProductSlugs(): string[]
```

- [ ] **Step 1: Failing test** `tests/catalog.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import * as c from "@/lib/catalog";
describe("catalog", () => {
  it("has a tree with 6 roots", () => {
    expect(c.getTopCategories().length).toBe(6);
    expect(c.getChildren("sodo-technika").length).toBeGreaterThan(5);
    expect(c.getAncestors("sodo-technika/grandininiai-pjuklai").map(x => x.slug)).toEqual(["sodo-technika"]);
  });
  it("lists products in a category including descendants", () => {
    const r = c.listProducts({ category: "sodo-technika", perPage: 24 });
    expect(r.total).toBeGreaterThan(24);
    expect(r.items.length).toBe(24);
    expect(r.pages).toBe(Math.ceil(r.total / 24));
    for (const p of r.items) expect(p.categoryPath[0]).toBe("sodo-technika");
  });
  it("filters by brand, price, stock and sorts", () => {
    const brand = c.getBrands("sodo-technika")[0];
    const r = c.listProducts({ category: "sodo-technika", brands: [brand], inStock: true, sort: "price-asc", perPage: 100 });
    for (const p of r.items) { expect(p.brand).toBe(brand); expect(p.inStock).toBe(true); }
    for (let i = 1; i < r.items.length; i++) expect(r.items[i].price).toBeGreaterThanOrEqual(r.items[i - 1].price);
    const r2 = c.listProducts({ min: 100, max: 200, perPage: 1000 });
    for (const p of r2.items) { expect(p.price).toBeGreaterThanOrEqual(100); expect(p.price).toBeLessThanOrEqual(200); }
  });
  it("searches by name words and sku", () => {
    const any = c.getNewProducts(1)[0];
    expect(c.listProducts({ q: any.sku }).items[0].slug).toBe(any.slug);
    const word = any.name.split(" ").find(w => w.length > 3)!;
    expect(c.listProducts({ q: word.toLowerCase() }).total).toBeGreaterThan(0);
  });
  it("gets product and related", () => {
    const p = c.getNewProducts(1)[0];
    expect(c.getProduct(p.slug)?.slug).toBe(p.slug);
    const rel = c.getRelated(p, 8);
    expect(rel.length).toBeLessThanOrEqual(8);
    expect(rel.find(x => x.slug === p.slug)).toBeUndefined();
  });
  it("promo products are sorted by discount", () => {
    const promo = c.getPromoProducts(10);
    expect(promo.length).toBeGreaterThan(0);
    for (const p of promo) expect(p.oldPrice!).toBeGreaterThan(p.price);
  });
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** `lib/catalog.ts`:

```ts
import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { Category, Product } from "./types";
import { discountPercent } from "./format";

const categories = categoriesJson as Category[];
const products = productsJson as Product[];
const bySlug = new Map(categories.map(c => [c.slug, c]));
const productBySlug = new Map(products.map(p => [p.slug, p]));
const childrenOf = new Map<string | null, Category[]>();
for (const c of categories) childrenOf.set(c.parent, [...(childrenOf.get(c.parent) ?? []), c]);

export type Sort = "popular" | "price-asc" | "price-desc" | "name";
export type ListQuery = { category?: string; brands?: string[]; min?: number; max?: number; inStock?: boolean; sort?: Sort; page?: number; perPage?: number; q?: string };
export type ListResult = { items: Product[]; total: number; page: number; pages: number };

export const getCategoryTree = () => categories;
export const getTopCategories = () => childrenOf.get(null) ?? [];
export const getCategory = (slug: string) => bySlug.get(slug);
export const getChildren = (slug: string) => childrenOf.get(slug) ?? [];
export function getAncestors(slug: string): Category[] {
  const out: Category[] = [];
  let cur = bySlug.get(slug)?.parent ?? null;
  while (cur) { const c = bySlug.get(cur); if (!c) break; out.unshift(c); cur = c.parent; }
  return out;
}
const inCategory = (p: Product, slug: string) => p.categoryPath.includes(slug);
export const getCategoryImage = (slug: string) => products.find(p => inCategory(p, slug))?.images[0];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function listProducts(q: ListQuery): ListResult {
  let items = products;
  if (q.category) items = items.filter(p => inCategory(p, q.category!));
  if (q.brands?.length) { const set = new Set(q.brands); items = items.filter(p => set.has(p.brand)); }
  if (q.min != null) items = items.filter(p => p.price >= q.min!);
  if (q.max != null) items = items.filter(p => p.price <= q.max!);
  if (q.inStock) items = items.filter(p => p.inStock);
  if (q.q?.trim()) {
    const words = norm(q.q).split(/\s+/).filter(Boolean);
    items = items.filter(p => { const hay = norm(`${p.name} ${p.sku} ${p.brand}`); return words.every(w => hay.includes(w)); });
    items = [...items].sort((a, b) => Number(b.sku === q.q!.trim()) - Number(a.sku === q.q!.trim()));
  }
  switch (q.sort) {
    case "price-asc": items = [...items].sort((a, b) => a.price - b.price); break;
    case "price-desc": items = [...items].sort((a, b) => b.price - a.price); break;
    case "name": items = [...items].sort((a, b) => a.name.localeCompare(b.name, "lt")); break;
    default: items = [...items].sort((a, b) => Number(b.inStock) - Number(a.inStock)); // ponytail: no popularity data yet, in-stock first
  }
  const perPage = q.perPage ?? 24, total = items.length, pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, q.page ?? 1), pages);
  return { items: items.slice((page - 1) * perPage, page * perPage), total, page, pages };
}

export const getProduct = (slug: string) => productBySlug.get(slug);
export function getRelated(p: Product, n = 8): Product[] {
  const leaf = p.categoryPath.at(-1);
  const pool = leaf ? products.filter(x => x.slug !== p.slug && x.categoryPath.at(-1) === leaf) : [];
  const more = pool.length < n && p.categoryPath.length > 1 ? products.filter(x => x.slug !== p.slug && !pool.includes(x) && inCategory(x, p.categoryPath.at(-2)!)) : [];
  return [...pool, ...more].slice(0, n);
}
export function getBrands(category?: string): string[] {
  const pool = category ? products.filter(p => inCategory(p, category)) : products;
  return [...new Set(pool.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
export const getPromoProducts = (n = 12) => products.filter(p => p.oldPrice).sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice)).slice(0, n);
export const getNewProducts = (n = 12) => products.slice(0, n);
export const getAllProductSlugs = () => products.map(p => p.slug);
```
`tsconfig.json` needs `"resolveJsonModule": true` (create-next-app sets it).

- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: catalog data layer`

---

### Task 5: Cart state, shared UI primitives, layout (Header, CategoryNav, MobileBar, Footer)

**Files:**
- Create: `components/cart/CartProvider.tsx`, `components/cart/CartIcon.tsx`, `components/ui/Button.tsx`, `components/ui/Badge.tsx`, `components/ui/Price.tsx`, `components/layout/SearchBox.tsx`, `components/layout/Header.tsx`, `components/layout/CategoryNav.tsx`, `components/layout/MobileBar.tsx`, `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces:
  - `useCart(): { items: CartItem[]; add(slug: string, qty?: number): void; remove(slug: string): void; setQty(slug: string, qty: number): void; count: number; clear(): void }` where `CartItem = { slug: string; qty: number }`. Persisted under `localStorage["rankis-cart"]`. Hydration-safe: initial state empty, loaded in `useEffect`.
  - `<Button variant="primary"|"secondary"|"ghost" size="md"|"lg" asChild?>` — primary = `bg-accent text-ink hover:bg-accent-hover`, secondary = `border border-line bg-white hover:border-ink`, rounded-lg, font-semibold.
  - `<Badge tone="accent"|"neutral"|"green">`.
  - `<Price price oldPrice size="sm"|"lg">` — big price, struck old price, no VAT note on sm.
  - `<CategoryNav tree={Category[]} />` — client; top row of 6 roots on black bar; hover/focus opens a panel with level-2 columns and level-3 links (max 8 per column + "Visos").

- [ ] **Step 1: CartProvider**

```tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type CartItem = { slug: string; qty: number };
type Ctx = { items: CartItem[]; add: (slug: string, qty?: number) => void; remove: (slug: string) => void; setQty: (slug: string, qty: number) => void; clear: () => void; count: number };
const CartCtx = createContext<Ctx | null>(null);
const KEY = "rankis-cart";
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch {} setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, loaded]);
  const value = useMemo<Ctx>(() => ({
    items,
    add: (slug, qty = 1) => setItems(s => s.some(i => i.slug === slug) ? s.map(i => i.slug === slug ? { ...i, qty: i.qty + qty } : i) : [...s, { slug, qty }]),
    remove: slug => setItems(s => s.filter(i => i.slug !== slug)),
    setQty: (slug, qty) => setItems(s => qty <= 0 ? s.filter(i => i.slug !== slug) : s.map(i => i.slug === slug ? { ...i, qty } : i)),
    clear: () => setItems([]),
    count: items.reduce((n, i) => n + i.qty, 0),
  }), [items]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
export function useCart() { const c = useContext(CartCtx); if (!c) throw new Error("useCart outside CartProvider"); return c; }
```

- [ ] **Step 2: UI primitives** — `Button` (props: `variant`, `size`, `className`, `href?` → renders `<Link>` when `href` given), `Badge`, `Price`:

```tsx
// components/ui/Price.tsx
import { formatPrice, discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";
export function Price({ price, oldPrice, size = "sm" }: { price: number; oldPrice?: number; size?: "sm" | "lg" }) {
  const pct = discountPercent(price, oldPrice);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>{formatPrice(price)}</span>
      {pct > 0 && <span className="text-muted line-through">{formatPrice(oldPrice!)}</span>}
      {size === "lg" && <span className="text-sm text-muted">{t.vat}</span>}
    </div>
  );
}
```

- [ ] **Step 3: Header + SearchBox + CartIcon + CategoryNav + MobileBar + Footer**

Header (server component) layout: `container-x` flex row, h-20: logo (text wordmark `RANKIS` in black with a yellow square dot, `font-black tracking-tight text-2xl`), `<SearchBox />` flex-1 (client: form GET `/search`, input `name="q"`, rounded-full border, yellow round submit button), contacts block (phone bold + e-mail, hidden `<lg`), `<CartIcon />` (client: bag icon + count badge). Below: `<CategoryNav tree={getCategoryTree()} />` black bar `bg-ink text-white h-12`. Header is `sticky top-0 z-40 bg-white border-b border-line`.

CategoryNav (client): state `open: string | null`; root links `/c/<slug>`; on `onMouseEnter`/focus of a root, show `absolute left-0 right-0 top-full bg-white text-ink border-b border-line shadow-none` panel with `grid grid-cols-4 gap-6 py-6` of level-2 categories, each with up to 6 level-3 links and a "Visos →" link. Close on mouse leave of the whole nav and on `Escape`. Hidden on `<md`.

MobileBar (client, `md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-line grid grid-cols-3 h-14 z-40`): Katalogas (opens a full-screen drawer listing roots → children, two-level accordion), Paieška (`/search`), Krepšelis (`/cart` with count).

Footer: 4 columns on `md`: about + contacts; Informacija (Pristatymas, Garantija, Kontaktai, Serviso paslaugos); Kategorijos (6 roots); working hours placeholder "I–V 8:00–17:00". Bottom line `© 2026 UAB Teronis`. `bg-surface border-t border-line mt-16 pb-20 md:pb-8`.

`app/layout.tsx`: Inter via `next/font/google` with `variable: "--font-inter"`, `<html lang="lt">`, `<CartProvider><Header/>{children}<Footer/><MobileBar/></CartProvider>`. Metadata title template `%s | RANKIS.LT`.

- [ ] **Step 4: Run** `npm run dev`; open `/`: header, black nav with hover panel, footer render; no console errors. `npm run build` passes types.

- [ ] **Step 5: Commit** `feat: cart state, UI primitives, header/nav/footer layout`

---

### Task 6: Product card and grid

**Files:**
- Create: `components/catalog/ProductCard.tsx`, `components/catalog/ProductGrid.tsx`, `components/product/AddToCart.tsx`

**Interfaces:**
- `<ProductCard product />` — link to `/p/<slug>`; `next/image` 388px square (`sizes="(max-width:768px) 50vw, 25vw"`), `onError` fallback handled by wrapping image in a client `SafeImage` that swaps to `/placeholder.svg` (create a simple grey SVG in `public/`); brand (muted xs uppercase), name (`line-clamp-2 font-medium`), `Kodas: sku` (xs muted), `<Price>`, stock dot (`bg-green-500` / `bg-gray-300`) + label, `<Badge tone="accent">-N%</Badge>` top-left when discount. `<AddToCart slug compact />` bottom; on desktop `opacity-0 group-hover:opacity-100 focus-within:opacity-100`, always visible `<md`.
- `<AddToCart slug qty? compact? />` (client): button that calls `useCart().add`, shows `t.added` for 1.2 s afterwards.
- `<ProductGrid products />` — `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`.

- [ ] **Step 1: Implement** the three components and `public/placeholder.svg` (400×400, `#f3f4f6` rect, grey tool-outline optional).
- [ ] **Step 2: Temporarily** render `<ProductGrid products={getNewProducts(8)} />` on `/` and check hover state, badge, broken image fallback (edit one slug's image URL in a dev-only test) at 375 px and 1280 px.
- [ ] **Step 3: Commit** `feat: product card, grid, add-to-cart button`

---

### Task 7: Home page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/Hero.tsx`, `components/home/CategoryTiles.tsx`, `components/home/BrandStrip.tsx`, `components/home/ProductRail.tsx`

**Interfaces:**
- Consumes: `getTopCategories`, `getChildren`, `getCategoryImage`, `getBrands`, `getPromoProducts`, `getNewProducts`, `ProductGrid`.

- [ ] **Step 1: Hero** — `bg-ink text-white rounded-card` block, `container-x mt-6`, grid 2 cols on `lg`: left headline `text-4xl lg:text-5xl font-bold`, `t.heroText`, primary `<Button href="/c/ispardavimas">` + secondary white ghost `Katalogas`; right: `next/image` of the first promo product's image, cropped in a yellow-bordered square. No carousel.
- [ ] **Step 2: CategoryTiles** — section title `t.categories`; grid 2/3/6 of the 6 roots: card with `getCategoryImage(root.slug)` (object-contain in a `bg-surface` square) + name + count of children ("12 kategorijų").
- [ ] **Step 3: BrandStrip** — `getBrands()` top 12 by product count (compute in page with a `Map`), rendered as text chips linking to `/search?q=<brand>`; `overflow-x-auto` row on mobile.
- [ ] **Step 4: ProductRail** — `{ title, href, products }` → section heading with "Visos →" link + `<ProductGrid>` (8 items). Two rails: `t.promo` → `/c/ispardavimas`, `t.news` → `/search?q=`-less: link to `/c/sodo-technika`.
- [ ] **Step 5:** assemble `app/page.tsx`, set `export const metadata = { title: "RANKIS.LT — įrankiai ir sodo technika" }`. Check at 375 / 1280. Commit `feat: home page`.

---

### Task 8: Category page with filters, sort, pagination

**Files:**
- Create: `lib/search-params.ts`, `app/c/[...slug]/page.tsx`, `components/catalog/Breadcrumbs.tsx`, `components/catalog/Filters.tsx`, `components/catalog/SortSelect.tsx`, `components/catalog/Pagination.tsx`, `components/catalog/EmptyState.tsx`
- Test: `tests/search-params.test.ts`

**Interfaces:**
- `parseListParams(sp: Record<string, string | string[] | undefined>): ListQuery` — reads `brand` (comma-separated), `min`, `max`, `stock` (`"1"`), `sort`, `page`, `q`.
- `buildQuery(q: ListQuery, patch: Partial<ListQuery>): string` — returns `?...` string, drops defaults/empties, resets `page` when anything but page changes.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { parseListParams, buildQuery } from "@/lib/search-params";
describe("search params", () => {
  it("parses", () => {
    expect(parseListParams({ brand: "Makita,Stiga", min: "10", max: "99", stock: "1", sort: "price-asc", page: "3" }))
      .toEqual({ brands: ["Makita", "Stiga"], min: 10, max: 99, inStock: true, sort: "price-asc", page: 3 });
    expect(parseListParams({ sort: "bogus", page: "x" })).toEqual({});
  });
  it("builds and resets page on filter change", () => {
    expect(buildQuery({ brands: ["Makita"], page: 3 }, { page: 4 })).toBe("?brand=Makita&page=4");
    expect(buildQuery({ brands: ["Makita"], page: 3 }, { inStock: true })).toBe("?brand=Makita&stock=1");
    expect(buildQuery({}, {})).toBe("");
  });
});
```

- [ ] **Step 2: Implement** `lib/search-params.ts`:

```ts
import type { ListQuery, Sort } from "./catalog";
const SORTS: Sort[] = ["popular", "price-asc", "price-desc", "name"];
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
export function parseListParams(sp: Record<string, string | string[] | undefined>): ListQuery {
  const q: ListQuery = {};
  const brand = one(sp.brand); if (brand) q.brands = brand.split(",").filter(Boolean);
  const min = Number(one(sp.min)); if (one(sp.min) && Number.isFinite(min)) q.min = min;
  const max = Number(one(sp.max)); if (one(sp.max) && Number.isFinite(max)) q.max = max;
  if (one(sp.stock) === "1") q.inStock = true;
  const sort = one(sp.sort) as Sort; if (SORTS.includes(sort) && sort !== "popular") q.sort = sort;
  const page = Number(one(sp.page)); if (Number.isInteger(page) && page > 1) q.page = page;
  const text = one(sp.q).trim(); if (text) q.q = text;
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
```
Run `npm test` → PASS.

- [ ] **Step 3: Page** `app/c/[...slug]/page.tsx` (async server component; `params` and `searchParams` are Promises in Next 15+):

```tsx
import { notFound } from "next/navigation";
import { getCategory, getChildren, getAncestors, listProducts, getBrands } from "@/lib/catalog";
import { parseListParams, buildQuery } from "@/lib/search-params";
// ... imports of components, t
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const slug = (await params).slug.join("/");
  const cat = getCategory(slug); if (!cat) notFound();
  const q = { ...parseListParams(await searchParams), category: slug };
  const result = listProducts(q);
  const children = getChildren(slug), brands = getBrands(slug);
  const base = `/c/${slug}`;
  return (
    <main className="container-x py-6">
      <Breadcrumbs items={[...getAncestors(slug), cat]} />
      <h1 className="mt-2 text-3xl font-bold">{cat.name}</h1>
      {children.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{children.map(c => <Link key={c.slug} href={`/c/${c.slug}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink">{c.name}</Link>)}</div>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <Filters base={base} query={q} brands={brands} />
        <section>
          <div className="mb-4 flex items-center justify-between"><span className="text-sm text-muted">{result.total} {t.results}</span><SortSelect base={base} query={q} /></div>
          {result.items.length ? <ProductGrid products={result.items} /> : <EmptyState resetHref={base} />}
          <Pagination base={base} query={q} page={result.page} pages={result.pages} />
        </section>
      </div>
    </main>
  );
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const cat = getCategory((await params).slug.join("/"));
  return { title: cat?.name ?? t.notFound };
}
```
Do not add `generateStaticParams` (1083 categories × filters — render on demand; `export const dynamic = "force-dynamic"` is not needed, searchParams already makes it dynamic).

- [ ] **Step 4: Filters** (client; props `base, query, brands`): `<form method="GET" action={base}>` with brand checkboxes (`name="brand"` — wait: query uses one comma-separated value, so use a client handler: on change, `router.push(base + buildQuery(query, { brands }))`), min/max number inputs (apply on blur/Enter), in-stock toggle, `t.reset` link to `base`. On `<lg`: a "Filtrai (n)" button opens a bottom sheet (`fixed inset-0 z-50 bg-black/40` + white panel) containing the same form. Brand list collapsed to 8 with "Rodyti visus".
- [ ] **Step 5: SortSelect** (client): `<select>` of 4 sorts → `router.push(base + buildQuery(query, { sort }))`. **Pagination**: prev/next + numbered window of 5, links via `buildQuery(query, { page })`. **Breadcrumbs**: `Pradžia / … / name`, `text-sm text-muted`, `aria-label="breadcrumb"`. **EmptyState**: icon-less card with `t.nothingFound`, `t.tryOther`, secondary button `t.reset`.
- [ ] **Step 6: Verify** in browser: `/c/sodo-technika`, filter by brand, price range, stock, sort, page 2 — URL updates and results change; `/c/does-not-exist` → 404. Commit `feat: category page with filters, sort, pagination`.

---

### Task 9: Product page

**Files:**
- Create: `app/p/[slug]/page.tsx`, `components/product/Gallery.tsx`, `components/product/SpecsTable.tsx`, `components/ui/QuantityInput.tsx`

**Interfaces:**
- `<Gallery images alt />` (client): main `next/image` 800px with `object-contain` in `aspect-square bg-surface rounded-card`; thumbnails row (`grid grid-cols-5 gap-2`), active thumb `border-ink`; arrow keys switch.
- `<SpecsTable specs />` — 2-col table, zebra `odd:bg-surface`.
- `<QuantityInput value onChange min=1 />` (client) — minus / number / plus.
- `<AddToCart slug qty />` from Task 6 (non-compact, `size="lg"`).

- [ ] **Step 1: Page**

```tsx
export async function generateStaticParams() { return getAllProductSlugs().map(slug => ({ slug })); }
export async function generateMetadata({ params }) { const p = getProduct((await params).slug); return { title: p?.name ?? t.notFound, description: p?.description.replace(/<[^>]+>/g, "").slice(0, 160) }; }
export default async function ProductPage({ params }) {
  const p = getProduct((await params).slug); if (!p) notFound();
  const cats = p.categoryPath.map(getCategory).filter(Boolean) as Category[];
  return (
    <main className="container-x py-6">
      <Breadcrumbs items={cats} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_420px]">
        <Gallery images={p.images} alt={p.name} />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{p.brand}</div>
          <h1 className="mt-1 text-2xl font-bold lg:text-3xl">{p.name}</h1>
          <div className="mt-2 text-sm text-muted">{t.code}: {p.sku}</div>
          <div className="mt-6 rounded-card border border-line p-5">
            <Price price={p.price} oldPrice={p.oldPrice} size="lg" />
            {p.oldPrice && <div className="mt-1 text-sm text-muted">{t.save} {formatPrice(p.oldPrice - p.price)}</div>}
            <div className="mt-3 flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${p.inStock ? "bg-green-500" : "bg-gray-300"}`} />{p.inStock ? t.inStock : t.outOfStock}</div>
            <BuyBox slug={p.slug} />   {/* client: QuantityInput + AddToCart lg */}
          </div>
          {p.specs.length > 0 && <><h2 className="mt-10 text-lg font-semibold">{t.specs}</h2><SpecsTable specs={p.specs} /></>}
        </div>
      </div>
      {p.description && <section className="prose prose-neutral mt-12 max-w-3xl"><h2 className="text-lg font-semibold">{t.description}</h2><div dangerouslySetInnerHTML={{ __html: p.description }} /></section>}
      <ProductRail title={t.related} products={getRelated(p, 8)} />
    </main>
  );
}
```
Description is already sanitized by the scraper (`sanitizeDescription`, whitelist). Style the description container manually with Tailwind child selectors (`[&_p]:mt-3 [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc`) — do not add `@tailwindcss/typography`.

- [ ] **Step 2: Verify** two products (one discounted, one not), gallery switching, add to cart updates header count, related rail. Commit `feat: product page`.

---

### Task 10: Search page

**Files:**
- Create: `app/search/page.tsx`

- [ ] **Step 1:** Server page reading `searchParams`; `q = parseListParams(sp)`; `listProducts(q)`; heading `"{t.search}: “{q.q}”"`, result count, same `SortSelect` / `Pagination` with `base="/search"` (buildQuery keeps `q`); empty `q` shows a centered `SearchBox` large variant and the brand chip strip. `EmptyState` when 0 results.
- [ ] **Step 2: Verify** `/search?q=makita`, `/search?q=887400` (sku first), `/search?q=zzzz` empty state. Commit `feat: search page`.

---

### Task 11: Cart, checkout stub, static pages, 404

**Files:**
- Create: `app/cart/page.tsx`, `components/cart/CartTable.tsx`, `app/checkout/page.tsx`, `app/pristatymas/page.tsx`, `app/garantija/page.tsx`, `app/kontaktai/page.tsx`, `app/not-found.tsx`, `app/api/cart-products/route.ts`

**Interfaces:**
- Cart items hold only `slug`+`qty`; product data is fetched client-side: `GET /api/cart-products?slugs=a,b` → `Product[]` (route handler calling `getProduct`). `CartTable` (client) loads products for current items with `useEffect`, shows rows: image 80px, name link, sku, `QuantityInput`, line total, remove; summary card with `t.total`, primary `<Button href="/checkout">{t.checkout}</Button>`, secondary `t.continueShopping` → `/`. Empty cart: `t.cartEmpty` + button to `/`.

- [ ] **Step 1:** route handler:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
export function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") ?? "").split(",").filter(Boolean).slice(0, 100);
  return NextResponse.json(slugs.map(getProduct).filter(Boolean));
}
```
- [ ] **Step 2:** `CartTable`, `app/cart/page.tsx` (title `t.cart`), `app/checkout/page.tsx` (centered card: `t.checkoutSoon`, `t.checkoutSoonText`, phone `tel:` link, mail link, back to cart).
- [ ] **Step 3:** Static pages: shared `components/layout/StaticPage.tsx` `{ title, children }` wrapper; content = 2–3 paragraphs of real info where known (phone, e-mail, delivery 1–3 d.d., warranty per manufacturer), otherwise neutral text. `not-found.tsx`: `t.notFound` + `SearchBox` + link home.
- [ ] **Step 4: Verify** add 2 products → `/cart` shows both, qty change updates total, remove works, reload keeps cart, `/checkout` stub renders, static pages and 404 render. Commit `feat: cart, checkout stub, static pages, 404`.

---

### Task 12: Playwright smoke, build, final polish

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

- [ ] **Step 1:** `playwright.config.ts` with `webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true }`, `use: { baseURL: "http://localhost:3000" }`, projects: chromium desktop + `devices["iPhone 13"]`. `npx playwright install chromium` if browsers missing.

- [ ] **Step 2:** `e2e/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
test("home shows categories and products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /sodo technika/i }).first()).toBeVisible();
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(4);
});
test("category lists products and filters by stock", async ({ page }) => {
  await page.goto("/c/sodo-technika");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
  await page.goto("/c/sodo-technika?stock=1&sort=price-asc");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
});
test("product add to cart updates header and cart page", async ({ page }) => {
  await page.goto("/c/sodo-technika");
  await page.locator("a[href^='/p/']").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("€").first()).toBeVisible();
  await page.getByRole("button", { name: /į krepšelį/i }).first().click();
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.goto("/cart");
  await expect(page.getByTestId("cart-row")).toHaveCount(1);
});
test("search by word", async ({ page }) => {
  await page.goto("/search?q=makita");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
});
```
Add `data-testid="cart-count"` to the count badge in `CartIcon` (render `0` hidden → render nothing when 0, so the test's `toHaveText("1")` is unambiguous) and `data-testid="cart-row"` to `CartTable` rows.

- [ ] **Step 3: Run** `npm run e2e` → all pass on both projects. Fix anything that fails (real fixes, not test loosening).
- [ ] **Step 4:** `npm run build` → no type errors; note product pages count in output. `npm run lint` clean.
- [ ] **Step 5:** Visual pass in the Browser pane at 375 px and 1280 px for `/`, a category, a product, `/cart`; screenshot each for the user. Fix spacing/contrast issues found.
- [ ] **Step 6: Commit** `test: playwright smoke; build passes` and write `README.md` (5 lines: install, scrape, dev, test, build).

---

## Self-review notes

- Spec coverage: data script (T2–T3), catalog API (T4), header/nav/mobile bar/footer (T5), card (T6), home (T7), category + filters (T8), product (T9), search (T10), cart/checkout/static/404 (T11), tests + build + manual check (T12). Error handling: 404 (T8/T9/T11), empty state (T8/T10), broken image fallback (T6), scraper skips failures and fails only on integrity (T3).
- Deviation from spec: Next.js 16 instead of 15 (current stable); `ispardavimas` root is titled "Keturračiai" on the live site menu but is the promo category — keep the live name.
- Type consistency: `ListQuery`/`Sort` defined once in `lib/catalog.ts`, imported by `lib/search-params.ts`; `Product.categoryPath` holds full slugs (`a/b/c`), matching `Category.slug`.
