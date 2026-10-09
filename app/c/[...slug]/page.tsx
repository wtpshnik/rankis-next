import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategorySlugs, getAncestors, getCategory, getCategoryCards, getChildren } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoryBrowser } from "@/components/catalog/CategoryBrowser";
import { t } from "@/lib/ui-text";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategorySlugs().map((s) => ({ slug: s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug.join("/"));
  return { title: cat?.name ?? t.notFound };
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).slug.join("/");
  const cat = getCategory(slug);
  if (!cat) notFound();
  const children = getChildren(slug);
  const base = `/c/${slug}`;

  return (
    <main className="container-x py-6">
      <Breadcrumbs items={getAncestors(slug)} current={cat.name} />
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{cat.name}</h1>
      {children.length > 0 && (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 lg:flex-wrap">
          {children.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-ink">
              {c.name}
            </Link>
          ))}
        </div>
      )}
      <CategoryBrowser base={base} items={getCategoryCards(slug)} />
    </main>
  );
}
