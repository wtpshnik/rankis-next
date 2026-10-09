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
    <header className="sticky top-0 z-40 bg-white border-b border-line">
      <div className="container-x flex h-16 items-center gap-4 md:h-20 md:gap-6">
        <Logo />
        <div className="hidden flex-1 md:block">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>
        <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="ml-auto hidden items-center gap-2 lg:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
            <PhoneIcon />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">{t.phone}</span>
            <span className="block text-xs text-muted">{t.email}</span>
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
