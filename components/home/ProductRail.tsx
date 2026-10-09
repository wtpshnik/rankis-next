import type { CardProduct, Product } from "@/lib/types";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHead } from "./SectionHead";

export function ProductRail({ title, eyebrow, href, products, className = "" }: { title: string; eyebrow?: string; href?: string; products: (Product | CardProduct)[]; className?: string }) {
  if (products.length === 0) return null;
  return (
    <section className={`container-x mt-14 ${className}`}>
      <SectionHead eyebrow={eyebrow} title={title} href={href} />
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
