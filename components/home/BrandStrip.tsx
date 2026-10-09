import Link from "next/link";
import { t } from "@/lib/ui-text";

export function BrandStrip({ brands }: { brands: string[] }) {
  return (
    <section className="container-x mt-12">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t.brandsStrip}</h2>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {brands.map((b) => (
          <Link
            key={b}
            href={`/search?q=${encodeURIComponent(b)}`}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-ink"
          >
            {b}
          </Link>
        ))}
      </div>
    </section>
  );
}
