import { Hero } from "@/components/home/Hero";
import { UspStrip } from "@/components/home/UspStrip";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { getBrands, getCategoryImage, getCategoryProducts, getChildren, getNewProducts, getPromoProducts, getTopBrands, getTopCategories } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

export default function Home() {
  const promo = getPromoProducts(8);
  const tiles = getTopCategories()
    .map((c) => ({ ...c, image: getCategoryImage(c.slug), childCount: getChildren(c.slug).length, count: getCategoryProducts(c.slug).length }))
    .sort((a, b) => b.count - a.count);
  return (
    <main className="pb-8">
      {/* 122k = live rankis.lt catalog size (products.xml sitemap); the demo dataset holds a 3k slice */}
      <Hero featured={promo[0]} stats={{ products: 122_000, brands: getBrands().length }} />
      <UspStrip />
      <CategoryTiles tiles={tiles} />
      <ProductRail eyebrow="Tik dabar" title={t.promo} href="/c/ispardavimas" products={promo} />
      <BrandStrip brands={getTopBrands(18)} />
      <ProductRail eyebrow="Ką tik atkeliavo" title={t.news} href="/c/sodo-technika" products={getNewProducts(8)} />
    </main>
  );
}
