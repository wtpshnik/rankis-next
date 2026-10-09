"use client";
import { useEffect, useState } from "react";
import type { CardProduct } from "./types";
import { BASE_PATH } from "./base-path";

let cache: Promise<CardProduct[]> | null = null;

export function loadProductIndex(): Promise<CardProduct[]> {
  // ponytail: one ~450 KB JSON for 3000 products; split per category when the catalog grows
  cache ??= fetch(`${BASE_PATH}/search-index.json`)
    .then((r) => r.json() as Promise<CardProduct[]>)
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}

export function useProductIndex(): { items: CardProduct[] | null } {
  const [items, setItems] = useState<CardProduct[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadProductIndex().then((list) => alive && setItems(list));
    return () => {
      alive = false;
    };
  }, []);
  return { items };
}
