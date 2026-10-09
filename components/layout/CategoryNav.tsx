"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavRoot } from "@/lib/nav";
import { useNavTree } from "@/lib/nav-client";
import { ChevronRight } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function CategoryNav({ roots: initial }: { roots: NavRoot[] }) {
  const roots = useNavTree(initial);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const active = roots.find((r) => r.slug === open);
  return (
    <nav className="relative hidden bg-ink text-white md:block" onMouseLeave={() => setOpen(null)} aria-label={t.catalog}>
      <div className="container-x flex h-12 items-stretch">
        {roots.map((r) => (
          <Link
            key={r.slug}
            href={`/c/${r.slug}`}
            onMouseEnter={() => setOpen(r.slug)}
            onFocus={() => setOpen(r.slug)}
            className={`group relative flex items-center px-4 text-[13.5px] font-semibold uppercase tracking-wide transition-colors first:pl-0 ${open === r.slug ? "text-accent" : "text-white/85 hover:text-white"}`}
          >
            {r.name}
            <span className={`absolute inset-x-4 bottom-0 h-0.5 bg-accent transition-transform duration-300 group-first:left-0 ${open === r.slug ? "scale-x-100" : "scale-x-0"}`} />
          </Link>
        ))}
        <Link href="/c/ispardavimas" className="ml-auto flex items-center gap-2 text-[13.5px] font-semibold uppercase tracking-wide text-accent hover:text-accent-hover">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          {t.promo}
        </Link>
      </div>
      {active && active.children.length > 0 && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-white text-ink shadow-lift">
          <div className="container-x grid grid-cols-3 gap-x-8 gap-y-2.5 py-7 lg:grid-cols-4">
            {active.children.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="group flex items-center gap-2 text-[15px] font-medium text-ink/80 hover:text-ink" onClick={() => setOpen(null)}>
                <span className="h-1.5 w-1.5 rounded-full bg-line transition-colors group-hover:bg-accent" />
                {c.name}
              </Link>
            ))}
            <Link href={`/c/${active.slug}`} className="col-span-full mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-2" onClick={() => setOpen(null)}>
              {t.allIn} {active.name.toLowerCase()} <ChevronRight />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
