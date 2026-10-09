export function formatPrice(n: number): string {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(n);
}

export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
