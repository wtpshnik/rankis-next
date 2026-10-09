import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { Price } from "@/components/ui/Price";
import { discountPercent } from "@/lib/format";
import { t } from "@/lib/ui-text";
import { ChevronRight } from "@/components/ui/Icons";

export function Hero({ featured, stats }: { featured?: Product; stats: { products: number; brands: number } }) {
  const pct = featured ? discountPercent(featured.price, featured.oldPrice) : 0;
  return (
    <section className="container-x mt-4 md:mt-6">
      <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
        {/* main dark block */}
        <div className="grain relative overflow-hidden rounded-[22px] bg-ink text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[360px] w-[360px] rounded-full bg-accent/10 blur-3xl" aria-hidden />
          <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div className="animate-rise flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Oficialus atstovas
              </span>
              <h1 className="mt-6 text-[2.5rem] font-black leading-[0.98] tracking-[-0.035em] md:text-6xl lg:text-[4.3rem]">
                Įrankiai ir <span className="text-accent">sodo technika</span> be kompromisų
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 md:text-lg">{t.heroText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/c/ispardavimas" size="lg">
                  {t.heroCta} <ChevronRight />
                </Button>
                <Button href="/c/sodo-technika" size="lg" variant="outline-light">
                  {t.catalog}
                </Button>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  [`${Math.floor(stats.products / 1000)}k+`, "prekių sandėlyje"],
                  [`${stats.brands}+`, "prekių ženklų"],
                  ["1–3 d.", "pristatymas"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="display text-2xl font-black tracking-tight text-accent md:text-3xl">{v}</dt>
                    <dd className="mt-0.5 text-xs text-white/55 md:text-sm">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {featured && (
              <Link href={`/p/${featured.slug}`} className="animate-rise-late group relative flex items-center justify-center">
                <div className="relative w-full max-w-[380px] rounded-[20px] bg-white p-4 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-0.5deg]">
                  <div className="relative aspect-square">
                    <SafeImage src={featured.images[0]} alt={featured.name} fill sizes="(max-width: 1024px) 80vw, 30vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  {pct > 0 && (
                    <span className="display absolute -left-3 top-5 rotate-[-6deg] rounded-full bg-accent px-3.5 py-1.5 text-sm font-black text-ink shadow-md">-{pct}%</span>
                  )}
                  <div className="mt-2 border-t border-line pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{featured.brand}</div>
                    <div className="line-clamp-1 text-sm font-medium">{featured.name}</div>
                    <div className="mt-1.5">
                      <Price price={featured.price} oldPrice={featured.oldPrice} />
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* bento side tiles */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link href="/c/ispardavimas" className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[22px] bg-accent p-6 text-ink transition-transform duration-300 hover:-translate-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">Iki -35%</span>
            <div>
              <div className="display text-3xl font-black leading-none tracking-tight">Išpardavimas</div>
              <div className="mt-2 flex items-center gap-1 text-sm font-semibold">
                Žiūrėti pasiūlymus <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <span className="display pointer-events-none absolute -bottom-6 -right-3 text-[120px] font-black leading-none text-ink/10" aria-hidden>
              %
            </span>
          </Link>
          <Link href="/c/akumuliatoriniu-irankiu-serijos" className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[22px] bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-white">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted group-hover:text-white/50">Viena baterija – visi įrankiai</span>
            <div>
              <div className="display text-3xl font-black leading-none tracking-tight">Akumuliatorinės sistemos</div>
              <div className="mt-2 flex items-center gap-1 text-sm font-semibold">
                Makita, Husqvarna, DeWalt <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
