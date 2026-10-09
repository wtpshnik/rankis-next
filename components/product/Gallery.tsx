"use client";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const cur = images[Math.min(i, images.length - 1)];
  return (
    <div
      className="outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setI((n) => (n + 1) % images.length);
        if (e.key === "ArrowLeft") setI((n) => (n - 1 + images.length) % images.length);
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-white">
        <SafeImage key={cur} src={cur} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain p-6" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, n) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`${alt} ${n + 1}`}
              aria-pressed={n === i}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition-colors ${n === i ? "border-ink" : "border-line hover:border-muted"}`}
            >
              <SafeImage src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
