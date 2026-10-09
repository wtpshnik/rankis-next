"use client";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function SearchBox({ size = "md", className = "" }: { size?: "md" | "lg"; className?: string }) {
  const sp = useSearchParams();
  const h = size === "lg" ? "h-14 text-base" : "h-11 text-sm";
  return (
    <form action="/search" method="GET" role="search" className={`relative flex w-full ${className}`}>
      <input
        type="search"
        name="q"
        defaultValue={sp.get("q") ?? ""}
        placeholder={t.searchPlaceholder}
        aria-label={t.search}
        autoComplete="off"
        className={`${h} w-full rounded-full border border-line bg-white pl-5 pr-14 outline-none transition-colors focus:border-ink`}
      />
      <button
        type="submit"
        aria-label={t.search}
        className={`absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-accent text-ink hover:bg-accent-hover flex items-center justify-center`}
      >
        <SearchIcon />
      </button>
    </form>
  );
}
