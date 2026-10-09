"use client";
import { t } from "@/lib/ui-text";

export function QuantityInput({ value, onChange, min = 1, size = "md" }: { value: number; onChange: (n: number) => void; min?: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-9" : "h-12";
  const btn = `${h} w-10 text-lg font-medium text-muted hover:bg-surface hover:text-ink disabled:opacity-40`;
  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-lg border border-line`} role="group" aria-label={t.qty}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="−">
        −
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className="w-12 border-x border-line text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label={t.qty}
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} aria-label="+">
        +
      </button>
    </div>
  );
}
