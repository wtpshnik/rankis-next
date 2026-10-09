import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProductSlugs, getCategory, getProduct, getRelated } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { Gallery } from "@/components/product/Gallery";
import { SpecsTable } from "@/components/product/SpecsTable";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductRail } from "@/components/home/ProductRail";
import { Price } from "@/components/ui/Price";
import { t } from "@/lib/ui-text";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return { title: t.notFound };
  return { title: p.name, description: p.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cats = p.categoryPath.map(getCategory).filter(Boolean) as Category[];
  return (
    <main className="container-x py-6">
      <Breadcrumbs items={cats} current={p.name} />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_440px] lg:gap-12">
        <Gallery images={p.images} alt={p.name} />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{p.brand}</div>
          <h1 className="mt-1 text-2xl font-bold leading-tight lg:text-3xl">{p.name}</h1>
          <div className="mt-2 text-sm text-muted">
            {t.code}: {p.sku}
          </div>
          <div className="mt-6 rounded-card border border-line p-5">
            <Price price={p.price} oldPrice={p.oldPrice} size="lg" />
            {p.oldPrice && (
              <div className="mt-1 text-sm font-medium text-green-700">
                {t.save} {formatPrice(p.oldPrice - p.price)}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${p.inStock ? "bg-green-500" : "bg-gray-300"}`} />
              {p.inStock ? t.inStock : t.outOfStock}
            </div>
            <BuyBox slug={p.slug} />
          </div>
          {p.specs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">{t.specs}</h2>
              <SpecsTable specs={p.specs} />
            </section>
          )}
        </div>
      </div>
      {p.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold">{t.description}</h2>
          <div className="rich mt-2 text-[15px] leading-relaxed text-ink/90" dangerouslySetInnerHTML={{ __html: p.description }} />
        </section>
      )}
      <ProductRail title={t.related} products={getRelated(p, 8)} className="!mt-16" />
    </main>
  );
}
