import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { SafeImage } from "@/components/ui/SafeImage";
import { AddToCart } from "@/components/product/AddToCart";

export function ProductCard({ product: p }: { product: Product }) {
  const pct = discountPercent(p.price, p.oldPrice);
  return (
    <div className="group relative flex flex-col rounded-card border border-line bg-white p-3 transition-colors hover:border-ink">
      <Link href={`/p/${p.slug}`} className="flex flex-1 flex-col" aria-label={p.name}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
          <SafeImage
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {pct > 0 && (
            <Badge tone="accent" className="absolute left-2 top-2">
              -{pct}%
            </Badge>
          )}
        </div>
        <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{p.brand || " "}</div>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-snug">{p.name}</h3>
        <div className="mt-1 text-xs text-muted">
          {t.code}: {p.sku}
        </div>
        <div className="mt-3">
          <Price price={p.price} oldPrice={p.oldPrice} />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <span className={`h-2 w-2 rounded-full ${p.inStock ? "bg-green-500" : "bg-gray-300"}`} />
          {p.inStock ? t.inStock : t.outOfStock}
        </div>
      </Link>
      <div className="mt-3 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <AddToCart slug={p.slug} compact />
      </div>
    </div>
  );
}
