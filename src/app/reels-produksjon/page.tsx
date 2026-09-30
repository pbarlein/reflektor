import type { Metadata } from "next";

import { SideSchema } from "@/components/Schema";
import { Tjenestelayout } from "@/components/tjeneste/Tjenestelayout";
import { reelsproduksjon } from "@/content/tjenester";
import { basisUrl } from "@/lib/miljo";

export const metadata: Metadata = {
  title: reelsproduksjon.tittel,
  description: reelsproduksjon.beskrivelse,
  alternates: { canonical: `${basisUrl()}/reels-produksjon` },
};

/**
 * `handlerOm` er entitetene siden faktisk handler om, ikke søkeord.
 *
 * De samme fire navnene står i brødteksten. Formatene er med fordi hele
 * argumentet om gjenbruk hviler på dem, og fordi en språkmodell som skal
 * svare på «kortvideo til fast pris» trenger å se at 9:16 er det samme
 * formatet TikTok og Shorts bruker.
 */
const emner = [
  "Instagram Reels",
  "TikTok",
  "YouTube Shorts",
  "Kort vertikal video",
  "9:16",
];

export default function ReelsProduksjon() {
  return (
    <>
      <SideSchema
        navn={reelsproduksjon.h1}
        beskrivelse={reelsproduksjon.beskrivelse}
        sti="/reels-produksjon"
        handlerOm={emner}
      />
      <Tjenestelayout side={reelsproduksjon} />
    </>
  );
}
