import Link from "next/link";
import { t } from "@/lib/ui-text";

export function BrandStrip({ brands }: { brands: string[] }) {
  const row = [...brands, ...brands]; // doubled for a seamless marquee loop
  return (
    <section className="mt-14 border-y border-line bg-surface/60 py-6">
      <div className="container-x mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t.brandsStrip}</div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <Link
              key={`${b}-${i}`}
              href={`/search?q=${encodeURIComponent(b)}`}
              className="display shrink-0 rounded-full border border-line bg-white px-5 py-2.5 text-[15px] font-bold uppercase tracking-tight text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              {b}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
