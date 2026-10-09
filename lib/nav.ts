import { getTopCategories, getChildren } from "./catalog";
import type { Category } from "./types";

export type NavRoot = Category & { children: (Category & { children: Category[] })[] };

export const getNavRoots = (): NavRoot[] =>
  getTopCategories().map((r) => ({
    ...r,
    children: getChildren(r.slug).map((c) => ({ ...c, children: getChildren(c.slug) })),
  }));
