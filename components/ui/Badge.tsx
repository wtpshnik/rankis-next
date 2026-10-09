type Tone = "accent" | "neutral" | "green";
const tones: Record<Tone, string> = {
  accent: "bg-accent text-ink",
  neutral: "bg-surface text-muted",
  green: "bg-green-100 text-green-800",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${tones[tone]} ${className}`}>{children}</span>;
}
