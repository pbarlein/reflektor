"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
 * TRINN TRE BLIR IKKE GJORT. Avklart av Pål 02.10.2026: samtykkekravet
 * settes IKKE på de tre taggene inne i GTM. Her sto «det som gjenstår», og
 * det var feil — det er ikke en oppgave som venter, det er et valg som er
 * tatt. Framgangsmåten står fortsatt i docs/gtm-samtykke.md, hvis valget en
 * gang gjøres om.
 *
 * FORBEHOLDET OVER ER DERMED EN VARIG TILSTAND, ikke et mellomstadium:
 * Apollo kjører før samtykke, og det er i strid med ekomlovens krav om
 * aktivt samtykke fra 01.01.2025. Clarity og HubSpot er dempet av de to
 * grepene over — Apollo har ingen annen bryter enn GTM. Valget er Påls, og
 * det er tatt med dette kjent.
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

/**
 * CONTAINEREN LASTES ETTER AT SIDEN ER FERDIG. Endret 02.10.2026.
 *
 * MÅLINGEN SOM UTLØSTE DET: Total Blocking Time var 1 207 ms på forsiden,
 * 1 217 ms på /reels-produksjon og 1 434 ms på den tyngste bloggartikkelen.
 * Med GTM og alt den laster blokkert scorer forsiden 99. Egen kode er
 * altså rask; det er tredjepartene i containeren som spiser hovedtråden
 * mens siden fortsatt holder på å bli brukbar.
 *
 * SAMTYKKEOPPSETTET ER NØYAKTIG SOM FØR. Dette er ikke en endring i HVA
 * som lastes eller HVEM som får det — variant 2 står: GTM med HubSpot,
 * Clarity og Apollo laster for alle. Det eneste som er endret er NÅR.
 *
 * REKKEFØLGEN SOM MÅ HOLDE, og som holder:
 *
 * 1. `Samtykkestandard` kjører fortsatt `beforeInteractive`, altså i
 *    <head> før alt annet. Consent Mode settes der, og `dataLayer`
 *    opprettes der.
 * 2. Hendelser som pushes før containeren laster, går IKKE tapt. De ligger
 *    i `dataLayer`-arrayen, og GTM leser hele arrayen når den starter.
 *    Det gjelder `samtykke_oppdatert` fra banneret og `takk_page_view`.
 * 3. Containeren lastes ved det som kommer først av: nettleseren er ferdig
 *    (`load`) og har et ledig øyeblikk (`requestIdleCallback`), eller
 *    brukeren gjør noe (rulling, trykk, tast). Det siste er viktig: den
 *    som ruller med en gang skal ikke vente på en tomgangsluke som aldri
 *    kommer.
 *
 * `/takk` ER UNNTAKET, og det er ikke til forhandling. Der fyrer
 * GA4-nøkkelhendelsen og Ads-konverteringen som bærer 107+ historiske
 * konverteringer. En utsettelse der ville byttet målingen av Reflektors
 * eneste KPI mot noen hundre millisekunder på en side ingen vurderer oss
 * etter. Containeren lastes derfor med en gang.
 *
 * IKKE PARTYTOWN. Den flytter tredjepartsskript til en web worker og er
 * ustabil med nettopp GTM, HubSpot og Meta — og en ustabil sporing er
 * dyrere enn en treg side.
 */
export function Sporing() {
  // Ingen container utenfor produksjon. Se tillatSporing() i miljo.ts —
  // forhåndsvisningene har målt forurenset GA4-eiendommen.
  const pa = tillatSporing();
  const sti = usePathname();
  /*
    `/takk` leses med `startsWith` og ikke likhet, slik at en etterfølgende
    skråstrek eller et språkprefiks senere ikke stilner konverteringen.
  */
  const erTakk = sti?.startsWith("/takk") ?? false;
  const [last, settLast] = useState(false);

  /*
    `/takk` SETTER IKKE TILSTAND. Den rendrer <Script> med en gang, under
    returen. Å sette tilstand synkront i en effekt er noe React-
    kompilatoren avviser — og med rette: verdien er kjent før effekten
    kjører, så en ekstra rendring ville vært gratis arbeid på nettopp den
    siden som ikke har noe å gi bort.
  */
  useEffect(() => {
    if (!pa || erTakk || last) return;

    let ferdig = false;
    const start = () => {
      if (ferdig) return;
      ferdig = true;
      rydd();
      settLast(true);
    };

    /*
      To veier inn, og den som kommer først vinner.

      `requestIdleCallback` har et tak på 2,5 sekunder, slik at en side med
      mye å gjøre ikke utsetter containeren i det uendelige. Safari har
      ikke `requestIdleCallback`; der er `setTimeout` hele mekanismen.
    */
    let tomgang = 0;
    let klokke = 0;
    const etterLast = () => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        tomgang = w.requestIdleCallback(start, { timeout: 2500 });
      } else {
        klokke = window.setTimeout(start, 2500);
      }
    };

    const hendelser = ["scroll", "pointerdown", "keydown", "touchstart"];
    const rydd = () => {
      window.removeEventListener("load", etterLast);
      hendelser.forEach((h) => window.removeEventListener(h, start));
      if (tomgang) {
        (
          window as unknown as { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(tomgang);
      }
      if (klokke) window.clearTimeout(klokke);
    };

    if (document.readyState === "complete") etterLast();
    else window.addEventListener("load", etterLast);
    hendelser.forEach((h) =>
      window.addEventListener(h, start, { once: true, passive: true }),
    );

    return rydd;
  }, [pa, erTakk, last]);

  if (!pa) return null;
  if (!erTakk && !last) return null;

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
