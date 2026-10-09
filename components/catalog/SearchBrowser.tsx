"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { applyQuery } from "@/lib/query";
import { parseListParams } from "@/lib/search-params";
import { useProductIndex } from "@/lib/product-index";
import { SearchBox } from "@/components/layout/SearchBox";
import { BrandStrip } from "@/components/home/BrandStrip";
import { SortSelect } from "./SortSelect";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";
import { t } from "@/lib/ui-text";

function Browser({ brands }: { brands: string[] }) {
  const sp = useSearchParams();
  const q = parseListParams(Object.fromEntries(sp.entries()));
  const { items } = useProductIndex();

  if (!q.q) {
    return (
      <main className="container-x py-12">
        <h1 className="text-3xl font-bold">{t.search}</h1>
        <p className="mt-2 text-muted">{t.searchHint}</p>
        <div className="mt-6 max-w-2xl">
          <SearchBox size="lg" />
        </div>
        <BrandStrip brands={brands} />
      </main>
    );
  }
  const result = items ? applyQuery(items, q) : null;
  return (
    <main className="container-x py-6">
      <h1 className="text-3xl font-bold">
        {t.searchResultsFor}: <span className="text-muted">„{q.q}“</span>
      </h1>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-muted">{result ? `${result.total} ${t.results}` : "…"}</span>
        <SortSelect base="/search" query={q} />
      </div>
      <div className="mt-4">
        {result && (result.items.length ? <ProductGrid products={result.items} /> : <EmptyState resetHref="/search" />)}
      </div>
      {result && <Pagination base="/search" query={q} page={result.page} pages={result.pages} />}
    </main>
  );
}

export function SearchBrowser({ brands }: { brands: string[] }) {
  return (
    <Suspense fallback={<main className="container-x py-12 h-96" />}>
      <Browser brands={brands} />
    </Suspense>
  );
}
