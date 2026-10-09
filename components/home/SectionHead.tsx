import Link from "next/link";
import { ChevronRight } from "@/components/ui/Icons";
import { t } from "@/lib/ui-text";

export function SectionHead({ eyebrow, title, href }: { eyebrow?: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            <span className="h-0.5 w-6 bg-accent" /> {eyebrow}
          </div>
        )}
        <h2 className="text-[26px] font-black leading-none tracking-tight md:text-[32px]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-line px-4 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-white">
          {t.allIn} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
