import { formatPrice, discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";

export function Price({ price, oldPrice, size = "sm" }: { price: number; oldPrice?: number; size?: "sm" | "lg" }) {
  const pct = discountPercent(price, oldPrice);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>{formatPrice(price)}</span>
      {pct > 0 && <span className="text-muted line-through">{formatPrice(oldPrice!)}</span>}
      {size === "lg" && <span className="text-sm text-muted">{t.vat}</span>}
    </div>
  );
}
