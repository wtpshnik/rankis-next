import { getTopCategories, getChildren } from "./catalog";
import type { Category } from "./types";

export type NavRoot = Category & { children: (Category & { children: Category[] })[] };

export const getNavRoots = (): NavRoot[] =>
  getTopCategories().map((r) => ({
    ...r,
    // ponytail: level 3 dropped — the nav tree ships in every static page's payload, 3 levels cost ~120 KB per page
    children: getChildren(r.slug).map((c) => ({ ...c, children: [] as Category[] })),
  }));

// Roots only (no children): what the server embeds in every page; menus load the full tree from /nav.json
export const getNavRootsShallow = (): NavRoot[] => getTopCategories().map((r) => ({ ...r, children: [] }));
