import Link from "next/link";
import type { CardProduct } from "@/lib/types";
import { discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { SafeImage } from "@/components/ui/SafeImage";
import { AddToCart } from "@/components/product/AddToCart";

export function ProductCard({ product: p }: { product: CardProduct }) {
  const pct = discountPercent(p.price, p.oldPrice);
  return (
    <div className="group relative flex flex-col rounded-card border border-line bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift">
      <Link href={`/p/${p.slug}`} className="flex flex-1 flex-col" aria-label={p.name}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface/60">
          <SafeImage
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {pct > 0 && (
            <Badge tone="accent" className="absolute left-2 top-2 !rounded-full !px-2.5 !py-1 !text-xs">
              -{pct}%
            </Badge>
          )}
          {!p.inStock && (
            <Badge tone="neutral" className="absolute right-2 top-2 !rounded-full">
              {t.outOfStock}
            </Badge>
          )}
        </div>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{p.brand || " "}</div>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-sans text-[14px] font-medium leading-snug tracking-normal text-ink/90 group-hover:text-ink">{p.name}</h3>
        <div className="mt-1 text-[11px] text-muted">
          {t.code}: {p.sku}
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <Price price={p.price} oldPrice={p.oldPrice} />
          {p.inStock && (
            <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {t.inStock}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3 md:opacity-0 md:translate-y-1 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <AddToCart slug={p.slug} compact />
      </div>
    </div>
  );
}
