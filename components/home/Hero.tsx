import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";
import Link from "next/link";

export function Hero({ featured }: { featured?: Product }) {
  return (
    <section className="container-x mt-4 md:mt-6">
      <div className="grid overflow-hidden rounded-card bg-ink text-white lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t.siteName}
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-[1.1] md:text-5xl lg:text-[3.4rem]">{t.heroTitle}</h1>
          <p className="mt-4 max-w-md text-base text-white/70 md:text-lg">{t.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/c/ispardavimas" size="lg">
              {t.heroCta}
            </Button>
            <Button href="/c/sodo-technika" size="lg" className="!border-white/30 !bg-transparent !text-white hover:!border-white" variant="secondary">
              {t.catalog}
            </Button>
          </div>
        </div>
        {featured && (
          <Link href={`/p/${featured.slug}`} className="relative flex items-center justify-center bg-white/5 p-8 lg:p-12">
            <div className="relative aspect-square w-full max-w-sm rounded-card bg-white p-4">
              <SafeImage src={featured.images[0]} alt={featured.name} fill sizes="(max-width: 1024px) 80vw, 40vw" className="object-contain p-6" />
              {discountPercent(featured.price, featured.oldPrice) > 0 && (
                <Badge tone="accent" className="absolute left-4 top-4 !text-sm">
                  -{discountPercent(featured.price, featured.oldPrice)}%
                </Badge>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-white/90 p-3 text-ink backdrop-blur">
                <div className="line-clamp-1 text-sm font-medium">{featured.name}</div>
                <Price price={featured.price} oldPrice={featured.oldPrice} />
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
