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
  return (
    <footer className="mt-16 border-t border-line bg-surface pb-20 md:pb-8">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{t.footerAbout}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">{t.info}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {info.map((i) => (
              <li key={i.label}>
                <Link href={i.href} className="text-muted hover:text-ink">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">{t.categories}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {roots.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="text-muted hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">{t.contacts}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="font-semibold hover:text-accent-hover">
                {t.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${t.email}`} className="text-muted hover:text-ink">
                {t.email}
              </a>
            </li>
            <li className="text-muted">{t.hours}</li>
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-line pt-6 text-xs text-muted">© {new Date().getFullYear()} UAB Teronis. Visos teisės saugomos.</div>
    </footer>
  );
}
