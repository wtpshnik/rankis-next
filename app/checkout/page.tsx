import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.checkout };

export default function CheckoutPage() {
  return (
    <main className="container-x py-16">
      <div className="mx-auto max-w-lg rounded-card border border-line p-8 text-center">
        <span className="inline-block h-2 w-10 rounded-full bg-accent" />
        <h1 className="mt-4 text-2xl font-bold">{t.checkoutSoon}</h1>
        <p className="mt-2 text-muted">{t.checkoutSoonText}</p>
        <div className="mt-6 space-y-1">
          <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="block text-xl font-bold hover:text-accent-hover">
            {t.phone}
          </a>
          <a href={`mailto:${t.email}`} className="block text-muted hover:text-ink">
            {t.email}
          </a>
        </div>
        <Button href="/cart" variant="secondary" className="mt-8">
          {t.backToCart}
        </Button>
      </div>
    </main>
  );
}
