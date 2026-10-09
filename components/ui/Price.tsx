import { formatPrice, discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";

export function Price({ price, oldPrice, size = "sm" }: { price: number; oldPrice?: number; size?: "sm" | "lg" }) {
  const pct = discountPercent(price, oldPrice);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`display font-bold tracking-tight ${size === "lg" ? "text-[2.1rem] leading-none" : "text-[17px]"} ${pct > 0 ? "text-ink" : ""}`}>{formatPrice(price)}</span>
      {pct > 0 && <span className={`text-muted line-through ${size === "lg" ? "text-base" : "text-xs"}`}>{formatPrice(oldPrice!)}</span>}
      {size === "lg" && <span className="text-sm text-muted">{t.vat}</span>}
    </div>
  );
}
