import { Hero } from "@/components/home/Hero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { getCategoryImage, getChildren, getNewProducts, getPromoProducts, getTopBrands, getTopCategories } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

export default function Home() {
  const promo = getPromoProducts(8);
  const tiles = getTopCategories().map((c) => ({ ...c, image: getCategoryImage(c.slug), childCount: getChildren(c.slug).length }));
  return (
    <main className="pb-8">
      <Hero featured={promo[0]} />
      <CategoryTiles tiles={tiles} />
      <ProductRail title={t.promo} href="/c/ispardavimas" products={promo} />
      <BrandStrip brands={getTopBrands(14)} />
      <ProductRail title={t.news} href="/c/sodo-technika" products={getNewProducts(8)} />
    </main>
  );
}
