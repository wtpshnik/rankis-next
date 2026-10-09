"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ListQuery } from "@/lib/query";
import { buildQuery } from "@/lib/search-params";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

type Props = { base: string; query: ListQuery; brands: string[] };

function FilterForm({ base, query, brands }: Props) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [min, setMin] = useState(query.min?.toString() ?? "");
  const [max, setMax] = useState(query.max?.toString() ?? "");
  const go = (patch: Partial<ListQuery>) => router.push(base + buildQuery(query, patch));
  const applyPrice = () => go({ min: min ? Number(min) : undefined, max: max ? Number(max) : undefined });
  const selected = new Set(query.brands ?? []);
  const visible = showAll ? brands : brands.slice(0, 8);
  const active = (query.brands?.length ?? 0) + (query.min != null || query.max != null ? 1 : 0) + (query.inStock ? 1 : 0);

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <span className="font-bold">{t.filters}</span>
        {active > 0 && (
          <Link href={base} className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline">
            {t.reset}
          </Link>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" checked={!!query.inStock} onChange={(e) => go({ inStock: e.target.checked || undefined })} className="h-4 w-4 accent-ink" />
        {t.onlyInStock}
      </label>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.priceRange}</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={t.from}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-ink"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={t.to}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-ink"
          />
        </div>
      </fieldset>

      {brands.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">{t.brands}</legend>
          <ul className="space-y-2">
            {visible.map((b) => (
              <li key={b}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.has(b)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(b);
                      else next.delete(b);
                      go({ brands: next.size ? [...next] : undefined });
                    }}
                    className="h-4 w-4 accent-ink"
                  />
                  <span className="line-clamp-1">{b}</span>
                </label>
              </li>
            ))}
          </ul>
          {brands.length > 8 && (
            <button type="button" onClick={() => setShowAll(!showAll)} className="mt-3 text-sm font-medium text-muted hover:text-ink">
              {showAll ? t.showLess : `${t.showAll} (${brands.length})`}
            </button>
          )}
        </fieldset>
      )}
    </div>
  );
}

export function Filters(props: Props) {
  const [open, setOpen] = useState(false);
  const active = (props.query.brands?.length ?? 0) + (props.query.min != null || props.query.max != null ? 1 : 0) + (props.query.inStock ? 1 : 0);
  return (
    <>
      <aside className="hidden lg:block">
        <FilterForm {...props} />
      </aside>
      <div className="lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          {t.filters}
          {active > 0 && <span className="rounded-full bg-accent px-1.5 text-xs">{active}</span>}
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setOpen(false)}>
            <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-24" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={t.filters}>
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-lg p-2 hover:bg-surface">
                  <CloseIcon />
                </button>
              </div>
              <FilterForm {...props} />
              <div className="mt-6">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  {t.apply}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
