"use client";
import { useRouter } from "next/navigation";
import type { ListQuery, Sort } from "@/lib/catalog";
import { buildQuery } from "@/lib/search-params";
import { t } from "@/lib/ui-text";

const options: { value: Sort; label: string }[] = [
  { value: "popular", label: t.sortPopular },
  { value: "price-asc", label: t.sortPriceAsc },
  { value: "price-desc", label: t.sortPriceDesc },
  { value: "name", label: t.sortName },
];

export function SortSelect({ base, query }: { base: string; query: ListQuery }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted sm:inline">{t.sort}:</span>
      <select
        value={query.sort ?? "popular"}
        onChange={(e) => router.push(base + buildQuery(query, { sort: e.target.value as Sort }))}
        className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium outline-none focus:border-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
