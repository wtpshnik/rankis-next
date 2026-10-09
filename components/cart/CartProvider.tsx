"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { slug: string; qty: number };
type Ctx = {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = "rankis-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);
  const value = useMemo<Ctx>(
    () => ({
      items,
      add: (slug, qty = 1) =>
        setItems((s) =>
          s.some((i) => i.slug === slug) ? s.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i)) : [...s, { slug, qty }],
        ),
      remove: (slug) => setItems((s) => s.filter((i) => i.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((s) => (qty <= 0 ? s.filter((i) => i.slug !== slug) : s.map((i) => (i.slug === slug ? { ...i, qty } : i)))),
      clear: () => setItems([]),
      count: items.reduce((n, i) => n + i.qty, 0),
    }),
    [items],
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
