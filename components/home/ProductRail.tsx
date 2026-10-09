import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ChevronRight } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function ProductRail({ title, href, products, className = "" }: { title: string; href?: string; products: Product[]; className?: string }) {
  if (products.length === 0) return null;
  return (
    <section className={`container-x mt-12 ${className}`}>
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {href && (
          <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold hover:text-accent-hover">
            {t.allIn} <ChevronRight />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
