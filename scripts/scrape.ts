import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseCategories, parseProduct } from "./parse";
import type { Category, Product } from "../lib/types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const TARGET = Number(process.env.TARGET ?? 3000);
const PER_LEAF = Number(process.env.PER_LEAF ?? 150);
const CONCURRENCY = 6;
const DELAY_MS = 150;
const CACHE = "data/.cache";
mkdirSync(CACHE, { recursive: true });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
  const chunks = [...(idx ?? "").matchAll(/<loc>([^<]*products\.xml[^<]*)<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, "&"),
  );
  // spread over the whole catalog: every chunk, but only a slice of each
  const urls: string[] = [];
  for (const c of chunks) {
    const xml = await fetchText(c);
    const locs = [...(xml ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const step = Math.max(1, Math.ceil(locs.length / 200));
    for (let i = 0; i < locs.length; i += step) urls.push(locs[i]);
  }
  return urls;
}

// Listing pages are server-rendered: product cards are <a class="item_image_wrap_N" href=...>
async function listingUrls(slug: string, maxPages: number): Promise<string[]> {
  const out = new Set<string>();
  for (let page = 0; page < maxPages; page++) {
    const url = `https://www.rankis.lt/${slug}${page ? `/page/${page * 36}` : ""}`;
    const html = await fetchText(url);
    if (!html) break;
    const before = out.size;
    for (const m of html.matchAll(/<a[^>]+item_image_wrap_\d+[^>]*>/g)) {
      const href = m[0].match(/href="(https:\/\/www\.rankis\.lt\/[a-z0-9-]+)"/)?.[1];
      if (href) out.add(href);
    }
    if (out.size === before) break;
  }
  return [...out];
}

// roots whose products live under another primary category: tag them as extra categories
const EXTRA_ROOTS: [string, number][] = [
  ["ispardavimas", 20],
  ["akumuliatoriniu-irankiu-serijos", 6],
];

async function main() {
  const home = await fetchText("https://www.rankis.lt/");
  if (!home) throw new Error("cannot fetch home page");
  const categories: Category[] = parseCategories(home);
  const catSet = new Set(categories.map((c) => c.slug));
  console.log(`categories: ${categories.length}`);

  // homepage product links first: these are the promoted / discounted items
  const homeUrls = [...new Set([...home.matchAll(/href="(https:\/\/www\.rankis\.lt\/[a-z0-9-]+)"[^>]*title=/g)].map((m) => m[1]))];
  const extra = new Map<string, string[]>(); // product url -> extra root slugs
  const seedUrls: string[] = [...homeUrls, ...(await listingUrls("ypatingi-pasiulymai", 3))];
  for (const [root, pages] of EXTRA_ROOTS) {
    for (const u of await listingUrls(root, pages)) {
      seedUrls.push(u);
      extra.set(u, [...(extra.get(u) ?? []), root]);
    }
  }
  const urls = [...new Set([...seedUrls, ...(await productUrls())])];
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
      const ex = extra.get(url);
      if (ex) p.extraCategories = ex;
      products.push(p);
      if (products.length % 100 === 0) console.log(`products: ${products.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // integrity check
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
