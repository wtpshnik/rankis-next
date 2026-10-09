import { Suspense } from "react";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { CategoryNav } from "./CategoryNav";
import { CartIcon } from "@/components/cart/CartIcon";
import { PhoneIcon } from "@/components/ui/Icons";
import type { NavRoot } from "@/lib/nav";
import { t } from "@/lib/ui-text";

export function Header({ roots }: { roots: NavRoot[] }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="h-1 bg-accent" aria-hidden />
      <div className="container-x flex h-16 items-center gap-4 md:h-[76px] md:gap-8">
        <Logo />
        <div className="hidden flex-1 md:block">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>
        <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="ml-auto hidden items-center gap-3 lg:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-accent">
            <PhoneIcon />
          </span>
          <span className="leading-tight">
            <span className="display block text-[15px] font-bold tracking-tight">{t.phone}</span>
            <span className="block text-xs text-muted">{t.hours}</span>
          </span>
        </a>
        <CartIcon className="ml-auto lg:ml-0" />
      </div>
      <div className="container-x pb-3 md:hidden">
        <Suspense>
          <SearchBox />
        </Suspense>
      </div>
      <CategoryNav roots={roots} />
    </header>
  );
}
