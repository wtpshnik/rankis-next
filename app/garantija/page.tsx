import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.warranty };

export default function Page() {
  return (
    <StaticPage title={t.warranty}>
      <p>Visoms prekėms taikoma gamintojo garantija. Garantinis laikotarpis nurodytas prekės aprašyme ir priklauso nuo gamintojo: paprastai 2 metai privatiems pirkėjams ir 1 metai juridiniams asmenims.</p>
      <h3>Kaip kreiptis</h3>
      <ul>
        <li>Susisiekite su mumis telefonu arba el. paštu ir nurodykite užsakymo numerį bei gedimo aprašymą.</li>
        <li>Pristatykite prekę į mūsų serviso centrą arba suderinkite jos paėmimą kurjeriu.</li>
        <li>Garantinis remontas atliekamas per 14–30 dienų, priklausomai nuo dalių tiekimo.</li>
      </ul>
      <h3>Servisas</h3>
      <p>Atliekame ir pogarantinį sodo technikos bei įrankių remontą, sezoninę priežiūrą ir grandinių galandimą.</p>
    </StaticPage>
  );
}
