/**
 * Stillbilder fra Reflektors arkiv.
 *
 * To sett med hver sin jobb:
 *
 * `redaksjonelt` viser KVALITET. Åtte bilder i tre bånd: 5/4/3, så 7/5, så
 * 4/4/4. Bredden varierer, høyden gjør det ikke innenfor hvert bånd.
 *
 * Det siste er et rettet feilgrep. Første versjon satte `aspect-ratio` per
 * celle, og da ble høyden en funksjon av bredden: en smal celle med samme
 * format ble mye lavere enn en bred, og det etterlot et tydelig hull under
 * den korteste i hver rad. Nå styres høyden av `row-span` mot faste
 * radhøyder, uavhengig av bredden. Variasjonen ligger i bredden, som er der
 * den skal ligge — et rutenett med like celler leser som et arkiv, ikke som
 * et utvalg.
 *
 * `band` viser VOLUM. Tolv små bilder i et tett, jevnt rutenett. Her er
 * likheten poenget: det skal se ut som mye, ikke som utvalgt. Abonnementet
 * selger mengde og jevnhet, og seksjonen argumenterer for nettopp det.
 *
 * INGEN BILDETEKSTER, med vilje. Flere av bildene kan jeg ikke knytte til en
 * godkjent kunde uten å gjette, og halvt navngitte bildetekster leser som en
 * inkonsekvens. Det navngitte beviset ligger i hero.proof, reel-veggen og
 * anmeldelsene. Disse to seksjonene er et visuelt argument om spennvidde og
 * mengde, ikke en kundeliste.
 *
 * Alt-tekstene beskriver hva man SER, ikke hvem kunden er.
 *
 * Kilder: /Reflektor/SALG/Claude Code/Bilder og videoer. 4K-originaler på
 * 5–30 MB, nedskalert til én kildefil hver. next/image lager AVIF/WebP og
 * responsive størrelser derfra. Se docs/media.md.
 */
export type Bilde = {
  fil: string;
  alt: string;
  /** Tailwind-klasser for kolonnespenn og format i det redaksjonelle nettet. */
  celle?: string;
};

/** Store bilder. Kildefil 1600 px; next/image skalerer og konverterer. */
export const redaksjonelt: Bilde[] = [
  // Bånd 1 — 5/4/3, alle fem radhøyder
  { fil: "peppes1", alt: "Gjest med pizzastykke foran et neonskilt",
    celle: "col-span-2 aspect-[4/5] sm:col-span-5 sm:row-span-5 sm:aspect-auto" },
  { fil: "goretex1", alt: "Mann i skalljakke i en togdør",
    celle: "aspect-[4/5] sm:col-span-4 sm:row-span-5 sm:aspect-auto" },
  { fil: "kafe1", alt: "Vegg av flasker i en butikkhylle",
    celle: "aspect-[4/5] sm:col-span-3 sm:row-span-5 sm:aspect-auto" },

  // Bånd 2 — de to liggende bildene, lavere bånd
  { fil: "drone", alt: "Dronebilde av hotellanlegg med utendørsbasseng",
    celle: "col-span-2 aspect-[16/9] sm:col-span-7 sm:row-span-4 sm:aspect-auto" },
  { fil: "stallen", alt: "Kokker på et kjøkken med en plakett",
    celle: "col-span-2 aspect-[4/3] sm:col-span-5 sm:row-span-4 sm:aspect-auto" },

  // Bånd 3 — tre like brede
  { fil: "dag1", alt: "Nærbilde av bakverk på brett",
    celle: "aspect-[4/5] sm:col-span-4 sm:row-span-5 sm:aspect-auto" },
  { fil: "helios", alt: "Flaskestilleben på grønt tekstil",
    celle: "aspect-[4/5] sm:col-span-4 sm:row-span-5 sm:aspect-auto" },
  { fil: "industri", alt: "Nærbilde av slitt arbeidsutstyr",
    celle: "aspect-[4/5] sm:col-span-4 sm:row-span-5 sm:aspect-auto" },
];

/** Små bilder. Kildefil 640 px; next/image skalerer og konverterer. */
export const band: Bilde[] = [
  { fil: "dag2", alt: "Ansatte samlet i en butikk" },
  { fil: "dag3", alt: "Lykkehjul under et arrangement" },
  { fil: "dag4", alt: "Opptak med kamera under et arrangement" },
  { fil: "dag5", alt: "Kunder med handleposer" },
  { fil: "dag6", alt: "Bakverk i en disk" },
  { fil: "peppes2", alt: "Gjest ved et bord med pizza" },
  { fil: "goretex2", alt: "Nærbilde av en sko på asfalt" },
  { fil: "sunkost", alt: "Produktbilde av pakninger og glass" },
  { fil: "kafe2", alt: "Person i genser fotografert bakfra utendørs" },
  { fil: "portrett", alt: "Portrett utendørs mot blå himmel" },
  { fil: "mat1", alt: "Ansatte i et produksjonslokale" },
  { fil: "mat2", alt: "Person om bord i en båt" },
];
