import type { CardProduct, Product } from "@/lib/types";
import { toCard } from "@/lib/query";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: (Product | CardProduct)[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={toCard(p)} />
      ))}
    </div>
  );
}
