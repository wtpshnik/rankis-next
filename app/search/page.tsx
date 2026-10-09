import { Suspense } from "react";
import type { Metadata } from "next";
import { getTopBrands, listProducts } from "@/lib/catalog";
import { parseListParams, type RawParams } from "@/lib/search-params";
import { SearchBox } from "@/components/layout/SearchBox";
import { BrandStrip } from "@/components/home/BrandStrip";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { EmptyState } from "@/components/catalog/EmptyState";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.search };

export default async function SearchPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const q = parseListParams(await searchParams);
  if (!q.q) {
    return (
      <main className="container-x py-12">
        <h1 className="text-3xl font-bold">{t.search}</h1>
        <p className="mt-2 text-muted">{t.searchHint}</p>
        <div className="mt-6 max-w-2xl">
          <Suspense>
            <SearchBox size="lg" />
          </Suspense>
        </div>
        <BrandStrip brands={getTopBrands(14)} />
      </main>
    );
  }
  const result = listProducts(q);
  return (
    <main className="container-x py-6">
      <h1 className="text-3xl font-bold">
        {t.searchResultsFor}: <span className="text-muted">„{q.q}“</span>
      </h1>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-muted">
          {result.total} {t.results}
        </span>
        <SortSelect base="/search" query={q} />
      </div>
      <div className="mt-4">{result.items.length ? <ProductGrid products={result.items} /> : <EmptyState resetHref="/search" />}</div>
      <Pagination base="/search" query={q} page={result.page} pages={result.pages} />
    </main>
  );
}
