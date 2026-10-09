"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { SafeImage } from "@/components/ui/SafeImage";
import { TrashIcon } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function CartTable() {
  const { items, setQty, remove } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const key = items.map((i) => i.slug).sort().join(",");

  useEffect(() => {
    if (!key) return;
    const missing = key.split(",").filter((s) => !products[s]);
    if (missing.length === 0) return;
    fetch(`/api/cart-products?slugs=${encodeURIComponent(missing.join(","))}`)
      .then((r) => r.json())
      .then((list: Product[]) => setProducts((prev) => ({ ...prev, ...Object.fromEntries(list.map((p) => [p.slug, p])) })))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
        <div className="text-lg font-semibold">{t.cartEmpty}</div>
        <Button href="/" variant="secondary" className="mt-6">
          {t.continueShopping}
        </Button>
      </div>
    );
  }

  const rows = items.map((i) => ({ ...i, product: products[i.slug] }));
  const total = rows.reduce((s, r) => s + (r.product?.price ?? 0) * r.qty, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-line rounded-card border border-line">
        {rows.map((r) => (
          <li key={r.slug} data-testid="cart-row" className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
              {r.product && <SafeImage src={r.product.images[0]} alt={r.product.name} fill sizes="80px" className="object-contain p-1" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/p/${r.slug}`} className="line-clamp-2 text-sm font-medium hover:underline">
                    {r.product?.name ?? r.slug}
                  </Link>
                  {r.product && (
                    <div className="mt-0.5 text-xs text-muted">
                      {t.code}: {r.product.sku}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => remove(r.slug)} aria-label={t.remove} className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink">
                  <TrashIcon />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <QuantityInput size="sm" value={r.qty} onChange={(n) => setQty(r.slug, n)} />
                <div className="text-right">
                  <div className="font-bold">{r.product ? formatPrice(r.product.price * r.qty) : "…"}</div>
                  {r.product && r.qty > 1 && <div className="text-xs text-muted">{formatPrice(r.product.price)} / vnt.</div>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-card border border-line p-5 lg:sticky lg:top-40">
        <div className="flex items-baseline justify-between">
          <span className="text-muted">{t.total}</span>
          <span className="text-2xl font-bold" data-testid="cart-total">
            {formatPrice(total)}
          </span>
        </div>
        <div className="mt-1 text-right text-xs text-muted">{t.vat}</div>
        <Button href="/checkout" size="lg" className="mt-5 w-full">
          {t.checkout}
        </Button>
        <Button href="/" variant="secondary" className="mt-2 w-full">
          {t.continueShopping}
        </Button>
      </aside>
    </div>
  );
}
