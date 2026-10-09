import Link from "next/link";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={`display inline-flex items-center gap-1.5 text-[26px] font-black leading-none tracking-[-0.04em] ${light ? "text-white" : "text-ink"} ${className}`} aria-label="RANKIS.LT">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-accent text-ink">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 4a4 4 0 0 0-3.5 6L5 15.5 8.5 19l5.5-5.5A4 4 0 0 0 20 10l-2.5 1.5-2-2L17 7l-3-3Z" />
        </svg>
      </span>
      <span>RANKIS</span>
      <span className={light ? "text-white/40" : "text-ink/30"}>.LT</span>
    </Link>
  );
}
