import Link from "next/link";
import type { Category } from "@/lib/types";
import { t } from "@/lib/ui-text";

export function Breadcrumbs({ items, current }: { items: Category[]; current?: string }) {
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
      <Link href="/" className="hover:text-ink">
        {t.home}
      </Link>
      {items.map((c) => (
        <span key={c.slug} className="flex items-center gap-2">
          <span aria-hidden>/</span>
          <Link href={`/c/${c.slug}`} className="hover:text-ink">
            {c.name}
          </Link>
        </span>
      ))}
      {current && (
        <span className="flex items-center gap-2">
          <span aria-hidden>/</span>
          <span className="line-clamp-1 text-ink">{current}</span>
        </span>
      )}
    </nav>
  );
}
