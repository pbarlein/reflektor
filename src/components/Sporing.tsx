"use client";

import Script from "next/script";
import { tillatSporing } from "@/lib/miljo";

import { standardSkript } from "@/lib/samtykke";

/**
 * Google Tag Manager (brief 8.4, LÅST).
 *
 * Container-ID-en videreføres uendret fra dagens nettsted. Ikke opprett ny
 * container: over 100 historiske Google Ads-konverteringer henger på
 * oppsettet som ligger i denne, og budgivningsgrunnlaget kan ikke gjenskapes.
 *
 * ID-en står i klartekst her fordi den allerede er offentlig i sidekildekoden
 * på reflektor.no. Alle andre nøkler hører hjemme i Vercel-miljøvariabler.
 *
 * CONTAINEREN LASTES FOR ALLE, FRA FØRSTE SIDEVISNING. Endret 02.10.2026,
 * etter Påls eksplisitte valg. Det er samme oppførsel som Squarespace-siden
 * hadde fram til cutover.
 *
 * HVORFOR: Før dette ble containeren lastet først når besøkende hadde svart
 * på banneret. Den som ignorerte banneret og sendte skjema, ble da ikke talt
 * i GA4 eller Google Ads, heller ikke som modellert konvertering. Det er den
 * eneste KPI-en siden har.
 *
 * Consent Mode settes fortsatt til «nektet» FØR containeren laster
 * (Samtykkestandard under). Googles tagger sender da cookieløse signaler
 * som Google modellerer konverteringer fra, til noen sier ja.
 *
 * KONSEKVENSEN, som Pål ble forelagt og godtok 02.10.2026: tredjepartene i
 * containeren som ikke leser Consent Mode, kjører nå også før samtykke. Det
 * gjelder Apollo (bedriftsidentifisering), Microsoft Clarity (sesjonsopptak)
 * og HubSpot (CRM-sporing). Det er i strid med ekomlovens krav om aktivt
 * samtykke fra 01.01.2025, og banneret stopper dem ikke. Valget er Påls.
 *
 * TO AV TRE TRINN ER GJORT SENERE SAMME DAG, 02.10.2026:
 *
 * 1. CRM-ET AVHENGER IKKE LENGER AV SPORINGSKODEN. `/api/skjema` sender nå
 *    hvert lead rett til HubSpot fra serveren (lib/hubspot.ts), og
 *    kontaktskjemaet er merket `data-hs-do-not-collect` så HubSpots
 *    «collected forms» ikke oppretter kontakten en gang til. Leadet kommer
 *    fram også for den som blokkerer sporing — og, viktigere her: HubSpot-
 *    taggen kan nå settes bak samtykke uten at noe lead går tapt.
 * 2. CLARITY FÅR SAMTYKKET DIREKTE. Clarity leser ikke Consent Mode, men
 *    har sin egen `consentv2`-API, og den kalles nå fra <head> og fra
 *    banneret (lib/samtykke.ts). Uten samtykke kjører den i «no-consent
 *    mode» uten cookies, uansett hva GTM gjør.
 *
 * DET SOM GJENSTÅR er trinnet som faktisk stopper taggene: sett «Require
 * additional consent» på de tre taggene inne i GTM. Framgangsmåten står i
 * docs/gtm-samtykke.md. Containeren kan fortsatt lastes for alle.
 */
export const GTM_ID = "GTM-N4KGSS93";

/**
 * Consent Mode v2, satt FØR GTM.
 *
 * `beforeInteractive` plasserer skriptet i <head> og kjører det før
 * hydrering og før alle `afterInteractive`-skript — altså før GTM. Det er
 * det eneste som gjør resten av samtykkeløsningen ekte: settes ikke
 * standarden først, rekker taggene inni containeren å fyre på en udefinert
 * tilstand, og da er banneret bare pynt.
 *
 * Strategien virker kun fra rotlayoutet. Flyttes dette til en side, slutter
 * det å virke, og ingenting sier fra.
 *
 * Selve skriptet ligger i lib/samtykke.ts, sammen med logikken det speiler.
 */
export function Samtykkestandard() {
  return (
    /*
      eslint-disable-next-line @next/next/no-before-interactive-script-outside-document --
      Regelen gjelder Pages Router. node_modules/next/dist/docs/01-app/
      03-api-reference/02-components/script.md sier for App Router:
      «beforeInteractive scripts must be placed inside the root layout
      (app/layout.tsx)». Det er nøyaktig der denne står.
    */
    <Script
      id="samtykke-standard"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: standardSkript() }}
    />
  );
}

export function Sporing() {
  // Ingen container utenfor produksjon. Se tillatSporing() i miljo.ts —
  // forhåndsvisningene har målt forurenset GA4-eiendommen.
  if (!tillatSporing()) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * <noscript>-varianten av GTM er FJERNET, med vilje.
 *
 * Den lastet containeren i en iframe for besøkende uten JavaScript. Men uten
 * JavaScript finnes det ingen banner, ingen samtykke og ingen måte å si nei
 * på — og da skal containeren ikke lastes i det hele tatt.
 *
 * Det koster lite: nesten all sporing i containeren krever JavaScript for å
 * gjøre noe som helst. Det som forsvinner er en sidevisning uten kontekst,
 * fra en besøkende som uansett ikke kunne blitt sporet videre.
 */
