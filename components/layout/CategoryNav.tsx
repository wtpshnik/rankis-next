"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavRoot } from "@/lib/nav";
import { ChevronRight } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function CategoryNav({ roots }: { roots: NavRoot[] }) {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const active = roots.find((r) => r.slug === open);
  return (
    <nav className="relative hidden bg-ink text-white md:block" onMouseLeave={() => setOpen(null)} aria-label={t.catalog}>
      <div className="container-x flex h-12 items-stretch gap-1">
        {roots.map((r) => (
          <Link
            key={r.slug}
            href={`/c/${r.slug}`}
            onMouseEnter={() => setOpen(r.slug)}
            onFocus={() => setOpen(r.slug)}
            className={`flex items-center px-4 text-sm font-semibold transition-colors ${open === r.slug ? "bg-white/10 text-accent" : "hover:text-accent"}`}
          >
            {r.name}
          </Link>
        ))}
      </div>
      {active && active.children.length > 0 && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-white text-ink shadow-[0_24px_40px_-24px_rgba(0,0,0,0.25)]">
          <div className="container-x grid grid-cols-3 gap-x-8 gap-y-6 py-6 lg:grid-cols-4">
            {active.children.slice(0, 12).map((c) => (
              <div key={c.slug}>
                <Link href={`/c/${c.slug}`} className="font-semibold hover:text-accent-hover" onClick={() => setOpen(null)}>
                  {c.name}
                </Link>
                {c.children.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {c.children.slice(0, 6).map((g) => (
                      <li key={g.slug}>
                        <Link href={`/c/${g.slug}`} className="text-sm text-muted hover:text-ink" onClick={() => setOpen(null)}>
                          {g.name}
                        </Link>
                      </li>
                    ))}
                    {c.children.length > 6 && (
                      <li>
                        <Link href={`/c/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-medium hover:text-accent-hover" onClick={() => setOpen(null)}>
                          {t.allIn} <ChevronRight />
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {active.children.length > 12 && (
            <div className="container-x pb-5">
              <Link href={`/c/${active.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold hover:text-accent-hover" onClick={() => setOpen(null)}>
                {t.allIn} {active.name.toLowerCase()} <ChevronRight />
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
