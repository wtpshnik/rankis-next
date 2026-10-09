"use client";
import Link from "next/link";
import { useState } from "react";
import type { NavRoot } from "@/lib/nav";
import { useCart } from "@/components/cart/CartProvider";
import { CartIconSvg, ChevronDown, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function MobileBar({ roots }: { roots: NavRoot[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { count } = useCart();
  const item = "flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold";
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-3 border-t border-line bg-white md:hidden">
        <button type="button" className={item} onClick={() => setOpen(true)}>
          <MenuIcon />
          {t.catalog}
        </button>
        <Link href="/search" className={item}>
          <SearchIcon />
          {t.search}
        </Link>
        <Link href="/cart" className={`${item} relative`}>
          <span className="relative">
            <CartIconSvg />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold">
                {count}
              </span>
            )}
          </span>
          {t.cart}
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden" role="dialog" aria-label={t.catalog}>
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <span className="text-lg font-bold">{t.catalog}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-lg p-2 hover:bg-surface">
              <CloseIcon />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {roots.map((r) => (
              <li key={r.slug} className="border-b border-line">
                <div className="flex items-center">
                  <Link href={`/c/${r.slug}`} onClick={() => setOpen(false)} className="flex-1 px-4 py-3.5 font-semibold">
                    {r.name}
                  </Link>
                  {r.children.length > 0 && (
                    <button
                      type="button"
                      aria-expanded={expanded === r.slug}
                      onClick={() => setExpanded(expanded === r.slug ? null : r.slug)}
                      className="px-4 py-3.5 text-muted"
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform ${expanded === r.slug ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {expanded === r.slug && (
                  <ul className="bg-surface pb-2">
                    {r.children.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/c/${c.slug}`} onClick={() => setOpen(false)} className="block px-6 py-2.5 text-sm">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
