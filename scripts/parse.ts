import type { Category, Product } from "../lib/types";

const HOST = "https://www.rankis.lt/";

function decode(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseCategories(html: string): Category[] {
  const re = /<li class="[^"]*\bitem-id-\d+\b[^"]*">\s*<a href="https:\/\/www\.rankis\.lt\/([^"]+)" title="([^"]*)"/g;
  const seen = new Map<string, Category>();
  for (const m of html.matchAll(re)) {
    const slug = m[1].replace(/\/$/, "");
    if (seen.has(slug)) continue;
    const parts = slug.split("/");
    seen.set(slug, {
      slug,
      name: decode(m[2]) || parts.at(-1)!.replace(/-/g, " "),
      parent: parts.length > 1 ? parts.slice(0, -1).join("/") : null,
    });
  }
  return [...seen.values()];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonLd(html: string): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: any[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      /* skip malformed block */
    }
  }
  return out;
}

const KEEP = new Set(["p", "br", "ul", "ol", "li", "strong", "b", "em", "h2", "h3", "table", "tr", "td", "th", "tbody", "thead"]);

export function sanitizeDescription(html: string): string {
  let s = html.replace(/<div class="text-tab[\s\S]*$/, ""); // site boilerplate block runs to the end
  s = s.replace(/<(script|style|iframe)\b[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<h1\b[^>]*>/gi, "<h3>").replace(/<\/h1>/gi, "</h3>");
  s = s.replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (tag, name: string) => {
    const n = name.toLowerCase();
    if (!KEEP.has(n)) return "";
    return tag.startsWith("</") ? `</${n}>` : n === "br" ? "<br>" : `<${n}>`;
  });
  s = s.replace(/<p>(\s|&nbsp;)*<\/p>/g, "").replace(/\s+/g, " ").trim();
  return s;
}

export function parseProduct(html: string, url: string): Product | null {
  const ld = jsonLd(html);
  const prod = ld.find((x) => x["@type"] === "Product");
  if (!prod) return null;
  const price = Number(prod.offers?.price);
  if (!(price > 0)) return null;
  const slug = url.replace(HOST, "").replace(/\/$/, "");

  const crumbs = ld.find((x) => x["@type"] === "BreadcrumbList")?.itemListElement ?? [];
  const categoryPath = crumbs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => String(c.item?.["@id"] ?? "").replace(HOST, "").replace(/\/$/, ""))
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
    } catch {
      /* skip */
    }
  }

  const descM = html.match(/id="tab_description"[^>]*>([\s\S]*?)<div class="tabs-description tab-comments/);
  const description = descM
    ? sanitizeDescription(descM[1])
    : sanitizeDescription(`<p>${String(prod.description ?? "")}</p>`);

  return {
    slug,
    sku: String(prod.sku ?? ""),
    name: decode(String(prod.name ?? "")),
    brand: decode(String(prod.brand ?? "")),
    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    inStock: String(prod.offers?.availability ?? "").endsWith("InStock"),
    images,
    description,
    specs,
    categoryPath,
  };
}
