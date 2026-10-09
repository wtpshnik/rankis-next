"use client";
import { useEffect, useState } from "react";
import type { NavRoot } from "./nav";
import { BASE_PATH } from "./base-path";

let cache: Promise<NavRoot[]> | null = null;

export function loadNav(): Promise<NavRoot[]> {
  cache ??= fetch(`${BASE_PATH}/nav.json`)
    .then((r) => r.json() as Promise<NavRoot[]>)
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}

// Starts with the shallow roots rendered by the server, upgrades to the full two-level tree once loaded.
export function useNavTree(initial: NavRoot[]): NavRoot[] {
  const [tree, setTree] = useState(initial);
  useEffect(() => {
    let alive = true;
    loadNav().then((full) => alive && full.length > 0 && setTree(full));
    return () => {
      alive = false;
    };
  }, []);
  return tree;
}
