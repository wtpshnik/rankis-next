import Link from "next/link";
import type { Category } from "@/lib/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { t } from "@/lib/ui-text";

export type Tile = Category & { image?: string; childCount: number };

export function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="container-x mt-12">
      <h2 className="text-2xl font-bold">{t.categories}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {tiles.map((c) => (
          <Link key={c.slug} href={`/c/${c.slug}`} className="group rounded-card border border-line p-3 transition-colors hover:border-ink">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
              {c.image && <SafeImage src={c.image} alt={c.name} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" />}
            </div>
            <div className="mt-3 font-semibold leading-tight">{c.name}</div>
            <div className="mt-0.5 text-xs text-muted">
              {c.childCount} {t.subcategories}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
