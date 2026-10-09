"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { CartIconSvg } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function CartIcon({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link href="/cart" className={`relative flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-surface ${className}`} aria-label={t.cart}>
      <span className="relative">
        <CartIconSvg className="h-6 w-6" />
        {count > 0 && (
          <span
            data-testid="cart-count"
            className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink"
          >
            {count}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-semibold lg:inline">{t.cart}</span>
    </Link>
  );
}
