import type { Metadata } from "next";

import { Kommer } from "@/components/Kommer";
import { krevBruker } from "@/lib/tilgang";

export const metadata: Metadata = { title: "Hva haster?" };

export default async function Side() {
  await krevBruker();
  return (
    <Kommer
      tittel="Hva haster?"
      hva="En kort og konkret gjøremålsliste, satt sammen av det som finnes i e-post, kalender og Dropbox — hva som faktisk haster, ikke alt som finnes."
    />
  );
}
