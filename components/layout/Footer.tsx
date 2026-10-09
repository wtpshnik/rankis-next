import Link from "next/link";
import { Logo } from "./Logo";
import { getTopCategories } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

export function Footer() {
  const roots = getTopCategories();
  const info = [
    { href: "/pristatymas", label: t.delivery },
    { href: "/garantija", label: t.warranty },
    { href: "/kontaktai", label: t.contacts },
    { href: "/kontaktai", label: t.service },
  ];
  const col = "text-[11px] font-bold uppercase tracking-[0.18em] text-white/45";
  const link = "text-[15px] text-white/75 transition-colors hover:text-accent";
  return (
    <footer className="grain mt-20 bg-ink pb-24 text-white md:pb-10">
      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">{t.footerAbout}</p>
          <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="display mt-8 block text-3xl font-black tracking-tight text-accent hover:text-accent-hover">
            {t.phone}
          </a>
          <div className="mt-1 text-sm text-white/50">{t.hours}</div>
        </div>
        <div>
          <h3 className={col}>{t.info}</h3>
          <ul className="mt-5 space-y-2.5">
            {info.map((i) => (
              <li key={i.label}>
                <Link href={i.href} className={link}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={col}>{t.categories}</h3>
          <ul className="mt-5 space-y-2.5">
            {roots.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className={link}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={col}>{t.contacts}</h3>
          <ul className="mt-5 space-y-2.5">
            <li>
              <a href={`mailto:${t.email}`} className={link}>
                {t.email}
              </a>
            </li>
            <li className="text-[15px] text-white/75">UAB Teronis</li>
            <li className="text-[15px] text-white/75">Lietuva</li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} UAB Teronis. Visos teisės saugomos.</span>
        <span>Kainos nurodytos su PVM. Prekių nuotraukos iliustracinės.</span>
      </div>
    </footer>
  );
}
