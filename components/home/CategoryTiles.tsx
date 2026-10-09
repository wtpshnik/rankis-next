import Link from "next/link";
import type { Category } from "@/lib/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChevronRight } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";
import { SectionHead } from "./SectionHead";

export type Tile = Category & { image?: string; childCount: number; count: number };

export function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="container-x mt-14">
      <SectionHead eyebrow="Katalogas" title={t.categories} />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {tiles.map((c, i) => (
          <Link
            key={c.slug}
            href={`/c/${c.slug}`}
            className={`group relative flex flex-col justify-end overflow-hidden rounded-[20px] bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${i === 0 ? "col-span-2 row-span-2 min-h-[320px] md:col-span-2 lg:col-span-2" : "min-h-[200px]"}`}
          >
            {c.image && (
              <div className={`absolute inset-x-0 top-0 ${i === 0 ? "bottom-24" : "bottom-16"}`}>
                <SafeImage src={c.image} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
              </div>
            )}
            <div className="relative">
              <div className={`display font-bold leading-tight tracking-tight ${i === 0 ? "text-2xl md:text-3xl" : "text-[15px] md:text-base"}`}>{c.name}</div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted">
                <span>
                  {c.childCount} {t.subcategories}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-colors group-hover:bg-accent">
                  <ChevronRight />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
