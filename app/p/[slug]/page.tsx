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

const trust = [
  { label: "Pristatymas 1–3 d. d.", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Gamintojo garantija", icon: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3zM9 12l2 2 4-4" },
  { label: "Nuosavas servisas", icon: "M14 4a4 4 0 0 0-3.5 6L5 15.5 8.5 19l5.5-5.5A4 4 0 0 0 20 10l-2.5 1.5-2-2L17 7l-3-3Z" },
];

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cats = p.categoryPath.map(getCategory).filter(Boolean) as Category[];
  return (
    <main className="container-x py-6">
      <Breadcrumbs items={cats} current={p.name} />
      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_460px] lg:gap-14">
        <Gallery images={p.images} alt={p.name} />
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            <span className="h-0.5 w-6 bg-accent" /> {p.brand || t.brand}
          </div>
          <h1 className="mt-3 text-[26px] font-bold leading-[1.1] tracking-tight lg:text-[32px]">{p.name}</h1>
          <div className="mt-3 text-sm text-muted">
            {t.code}: <span className="font-medium text-ink/70">{p.sku}</span>
          </div>

          <div className="mt-7 rounded-[20px] border border-line bg-white p-6 shadow-[0_24px_50px_-30px_rgb(15_15_16/0.25)] lg:sticky lg:top-36">
            <Price price={p.price} oldPrice={p.oldPrice} size="lg" />
            {p.oldPrice && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-2.5 py-1 text-xs font-bold text-ink">
                {t.save} {formatPrice(p.oldPrice - p.price)}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${p.inStock ? "bg-green-500" : "bg-gray-300"}`} />
              {p.inStock ? t.inStock : t.outOfStock}
            </div>
            <BuyBox slug={p.slug} />
            <ul className="mt-6 grid gap-2.5 border-t border-line pt-5">
              {trust.map((x) => (
                <li key={x.label} className="flex items-center gap-3 text-sm text-ink/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={x.icon} />
                    </svg>
                  </span>
                  {x.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_460px] lg:gap-14">
        {p.description ? (
          <section>
            <h2 className="text-xl font-bold tracking-tight">{t.description}</h2>
            <div className="rich mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/85" dangerouslySetInnerHTML={{ __html: p.description }} />
          </section>
        ) : (
          <div />
        )}
        {p.specs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold tracking-tight">{t.specs}</h2>
            <SpecsTable specs={p.specs} />
          </section>
        )}
      </div>

      <ProductRail eyebrow="Gali patikti" title={t.related} products={getRelated(p, 8)} className="!mt-20" />
    </main>
  );
}
