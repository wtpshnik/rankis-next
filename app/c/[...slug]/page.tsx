import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAncestors, getBrands, getCategory, getChildren, listProducts } from "@/lib/catalog";
import { parseListParams, type RawParams } from "@/lib/search-params";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { Filters } from "@/components/catalog/Filters";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { EmptyState } from "@/components/catalog/EmptyState";
import { t } from "@/lib/ui-text";

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<RawParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug.join("/"));
  return { title: cat?.name ?? t.notFound };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = (await params).slug.join("/");
  const cat = getCategory(slug);
  if (!cat) notFound();
  const q = { ...parseListParams(await searchParams), category: slug };
  const result = listProducts(q);
  const children = getChildren(slug);
  const brands = getBrands(slug);
  const base = `/c/${slug}`;

  return (
    <main className="container-x py-6">
      <Breadcrumbs items={getAncestors(slug)} current={cat.name} />
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{cat.name}</h1>
      {children.length > 0 && (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 lg:flex-wrap">
          {children.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-ink">
              {c.name}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <Filters base={base} query={q} brands={brands} />
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
    </main>
  );
}
