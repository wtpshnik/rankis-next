export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="container-x py-10">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <div className="rich mt-6 max-w-3xl text-[15px] leading-relaxed text-ink/90">{children}</div>
    </main>
  );
}
