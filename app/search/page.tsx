import type { Metadata } from "next";
import { getTopBrands } from "@/lib/catalog";
import { SearchBrowser } from "@/components/catalog/SearchBrowser";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.search };

export default function SearchPage() {
  return <SearchBrowser brands={getTopBrands(14)} />;
}
