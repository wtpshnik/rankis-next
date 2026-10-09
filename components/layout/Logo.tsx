import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-1 text-2xl font-black tracking-tight ${className}`} aria-label="RANKIS.LT">
      <span>RANKIS</span>
      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />
      <span className="text-muted">LT</span>
    </Link>
  );
}
