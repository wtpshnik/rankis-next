import { Suspense } from "react";
import { SearchBox } from "@/components/layout/SearchBox";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/ui-text";

export default function NotFound() {
  return (
    <main className="container-x py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="text-7xl font-black tracking-tight text-line">404</div>
        <h1 className="mt-2 text-2xl font-bold">{t.notFound}</h1>
        <p className="mt-2 text-muted">{t.notFoundText}</p>
        <div className="mt-6">
          <Suspense>
            <SearchBox size="lg" />
          </Suspense>
        </div>
        <Button href="/" variant="secondary" className="mt-6">
          {t.home}
        </Button>
      </div>
    </main>
  );
}
