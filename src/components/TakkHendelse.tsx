"use client";

import { useEffect } from "react";

/**
 * GA4 key event `takk_page_view` (brief 8.4, LÅST).
 *
 * Navnet skal være identisk med dagens. GA4-property 317376140. Den native
 * Google Ads-taggen «Takkeside - Gads Conversion» utløses på samme sidevisning
 * og bærer over 100 historiske konverteringer.
 *
 * Endres navnet eller URL-en mister Reflektor målingen av sin eneste KPI.
 *
 * Verifisering før produksjon (8.4): hard reload mellom hver test – GTM kan
 * servere gammel versjon i inntil et kvarter – og bekreft i Google
 * Ads-grensesnittet, ikke bare i GTM Preview.
 *
 * ADVARSEL, AVKLART 27.09.2026: IKKE LAG EN GTM-UTLØSER PÅ DENNE HENDELSEN.
 *
 * Denne pushen er i dag uten mottaker. Ingen utløser i GTM-containeren lytter
 * på `takk_page_view` — det er verifisert i både publisert kode og i
 * grensesnittet.
 *
 * Nøkkelhendelsen finnes likevel, og den er ekte. Den lages INNE I GA4, som en
 * «opprettet hendelse» avledet av page_view:
 *
 *   event_name  contains  page_view
 *   page_location  contains  takk
 *   page_referrer  contains  reflektor.no
 *
 * Det ser ut som en mangel at pushen ikke er koblet opp, og fristelsen til å
 * «fikse» det er stor. Gjør man det, sender GTM en hendelse som heter
 * `takk_page_view` INN i GA4, samtidig som GA4 lager sin egen med samme navn
 * fra den samme sidevisningen. Resultatet er dobbelttelling av den ene
 * KPI-en Reflektor har — og det er nøyaktig den feilen versjon 36 i
 * containeren ryddet opp i for Meta-taggen («Pause Meta Lead - fjerner
 * dobbelttelling»).
 *
 * Pushen beholdes fordi briefen låser navnet og fordi den er et ufarlig
 * krokpunkt hvis oppsettet en dag legges om. Den skal ikke kobles til noe nå.
 *
 * MERK OGSÅ at GA4-betingelsen krever `page_referrer contains reflektor.no`.
 * Skjemaets POST → 303 bevarer referreren — verifisert i nettleser: /kontaktoss
 * følger med til /takk. Endres den flyten, ryker nøkkelhendelsen uten at noe
 * annet ser galt ut.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function TakkHendelse() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "takk_page_view" });
  }, []);

  return null;
}
