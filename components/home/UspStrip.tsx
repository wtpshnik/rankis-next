const items = [
  { title: "Pristatymas 1–3 d. d.", text: "Kurjeriu, į paštomatą arba atsiėmimas vietoje", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { title: "Gamintojo garantija", text: "Iki 3 metų – oficialus atstovas Lietuvoje", icon: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3zM9 12l2 2 4-4" },
  { title: "Nuosavas servisas", text: "Garantinis ir pogarantinis remontas, priežiūra", icon: "M14 4a4 4 0 0 0-3.5 6L5 15.5 8.5 19l5.5-5.5A4 4 0 0 0 20 10l-2.5 1.5-2-2L17 7l-3-3Z" },
  { title: "Patarimas telefonu", text: "+370 689 00009 · I–V 8:00–17:00", icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" },
];

export function UspStrip() {
  return (
    <section className="container-x mt-3">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((i) => (
          <li key={i.title} className="flex items-start gap-3 rounded-2xl border border-line px-4 py-4 transition-colors hover:border-ink/20">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={i.icon} />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-bold leading-tight">{i.title}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-muted">{i.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
