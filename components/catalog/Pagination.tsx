import Link from "next/link";
import type { ListQuery } from "@/lib/query";
import { buildQuery } from "@/lib/search-params";
import { t } from "@/lib/ui-text";

export function Pagination({ base, query, page, pages }: { base: string; query: ListQuery; page: number; pages: number }) {
  if (pages <= 1) return null;
  const href = (p: number) => base + buildQuery(query, { page: p });
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  const btn = "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors";
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={t.page}>
      {page > 1 && (
        <Link href={href(page - 1)} className={`${btn} border-line hover:border-ink`}>
          {t.prev}
        </Link>
      )}
      {nums.map((n) => (
        <Link key={n} href={href(n)} aria-current={n === page ? "page" : undefined} className={`${btn} ${n === page ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} className={`${btn} border-line hover:border-ink`}>
          {t.next}
        </Link>
      )}
    </nav>
  );
}
