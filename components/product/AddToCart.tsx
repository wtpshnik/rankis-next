"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { CartIconSvg } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function AddToCart({ slug, qty = 1, compact = false, className = "" }: { slug: string; qty?: number; compact?: boolean; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <Button
      size={compact ? "sm" : "lg"}
      className={`${compact ? "w-full" : "w-full sm:w-auto"} ${done ? "!bg-ink !text-white" : ""} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(slug, qty);
        setDone(true);
      }}
      aria-live="polite"
    >
      <CartIconSvg className="h-4 w-4" />
      {done ? t.added : t.addToCart}
    </Button>
  );
}
