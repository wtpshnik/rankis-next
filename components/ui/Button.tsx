import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98]";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-hover hover:shadow-[0_10px_24px_-10px_rgb(255_212_0/0.9)]",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:bg-surface",
  dark: "bg-ink text-white hover:bg-ink-2",
  "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
};
const sizes: Record<Size, string> = { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-sm", lg: "h-13 px-7 text-base" };

type Props = { variant?: Variant; size?: Size; className?: string; href?: string } & Omit<ComponentProps<"button">, "className">;

export function Button({ variant = "primary", size = "md", className = "", href, children, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
