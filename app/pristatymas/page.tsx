import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";
import { t } from "@/lib/ui-text";

export const metadata: Metadata = { title: t.delivery };

export default function Page() {
  return (
    <StaticPage title={t.delivery}>
      <p>Prekes pristatome visoje Lietuvoje. Prekių likučiai atnaujinami kartą per parą, todėl pristatymo terminas priklauso nuo sandėlio, kuriame yra prekė.</p>
      <h3>Pristatymo būdai</h3>
      <ul>
        <li>Kurjeriu į nurodytą adresą – 1–3 d. d. iš Savanorių sandėlio, 3–7 d. d. iš kitų sandėlių.</li>
        <li>Į paštomatą – smulkioms prekėms iki 30 kg.</li>
        <li>Atsiėmimas prekybos vietoje – nemokamai, suderinus laiką telefonu.</li>
      </ul>
      <h3>Kaina</h3>
      <p>Pristatymo kaina apskaičiuojama pagal prekės svorį ir matmenis ir parodoma prieš patvirtinant užsakymą. Didesnės vertės užsakymams pristatymas nemokamas.</p>
    </StaticPage>
  );
}
