"use client";
import { useState } from "react";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { AddToCart } from "./AddToCart";

export function BuyBox({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <QuantityInput value={qty} onChange={setQty} />
      <AddToCart slug={slug} qty={qty} className="flex-1" />
    </div>
  );
}
