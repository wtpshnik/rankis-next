import type { Metadata } from "next";
import { CartTable } from "@/components/cart/CartTable";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.cart };

export default function CartPage() {
  return (
    <main className="container-x py-6">
      <h1 className="mb-6 text-3xl font-bold">{t.cart}</h1>
      <CartTable />
    </main>
  );
}
