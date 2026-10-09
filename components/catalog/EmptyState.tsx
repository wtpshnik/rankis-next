import { Button } from "@/components/ui/Button";
import { t } from "@/lib/ui-text";

export function EmptyState({ resetHref, title = t.nothingFound, text = t.tryOther }: { resetHref?: string; title?: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-16 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 max-w-sm text-sm text-muted">{text}</p>
      {resetHref && (
        <Button href={resetHref} variant="secondary" className="mt-6">
          {t.reset}
        </Button>
      )}
    </div>
  );
}
