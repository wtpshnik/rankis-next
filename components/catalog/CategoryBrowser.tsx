"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { CardProduct } from "@/lib/types";
import { applyQuery, brandsOf } from "@/lib/query";
import { parseListParams } from "@/lib/search-params";
import { Filters } from "./Filters";
import { SortSelect } from "./SortSelect";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";
import { t } from "@/lib/ui-text";

function Browser({ base, items }: { base: string; items: CardProduct[] }) {
  const sp = useSearchParams();
  const q = parseListParams(Object.fromEntries(sp.entries()));
  const result = applyQuery(items, q);
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
      <Filters base={base} query={q} brands={brandsOf(items)} />
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-sm text-muted">
            {result.total} {t.results}
          </span>
          <SortSelect base={base} query={q} />
        </div>
        {result.items.length ? <ProductGrid products={result.items} /> : <EmptyState resetHref={base} />}
        <Pagination base={base} query={q} page={result.page} pages={result.pages} />
      </section>
    </div>
  );
}

export function CategoryBrowser(props: { base: string; items: CardProduct[] }) {
  return (
    <Suspense fallback={<div className="mt-8 h-96" />}>
      <Browser {...props} />
    </Suspense>
  );
}
