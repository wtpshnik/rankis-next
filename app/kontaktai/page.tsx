import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.contacts };

export default function Page() {
  return (
    <StaticPage title={t.contacts}>
      <p>
        <strong>UAB Teronis</strong>
        <br />
        Tel.{" "}
        <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="font-semibold underline-offset-2 hover:underline">
          {t.phone}
        </a>
        <br />
        El. paštas{" "}
        <a href={`mailto:${t.email}`} className="underline-offset-2 hover:underline">
          {t.email}
        </a>
        <br />
        Darbo laikas: {t.hours}
      </p>
      <h3>{t.service}</h3>
      <p>Serviso centre atliekame garantinį ir pogarantinį remontą, techninę priežiūrą ir konsultuojame renkantis techniką. Prieš atvykdami susisiekite telefonu.</p>
    </StaticPage>
  );
}
