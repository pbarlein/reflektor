"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

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
 * CONTAINEREN LASTES IKKE FØR BESØKENDE HAR SVART. Det er en bevisst og
 * kostbar beslutning, og den er tatt på grunnlag av hva containeren faktisk
 * inneholder — målt 17.09.2026, ikke antatt:
 *
 *   GA4 ................. retter seg etter Consent Mode
 *   Google Ads .......... retter seg etter Consent Mode
 *   Meta-piksel ......... gjør det IKKE
 *   Apollo.io ........... gjør det IKKE (B2B-besøksidentifisering)
 *   HubSpot ............. gjør det IKKE — satte fire cookies før samtykke
 *   Microsoft Clarity ... gjør det IKKE (sesjonsopptak)
 *   Microsoft Ads ....... gjør det IKKE
 *
 * Consent Mode styrer bare Googles egne tagger. Fire av de seks bryr seg
 * ikke, og de kan bare stanses inne i containeren — som koden her ikke kan
 * røre. Å laste GTM før samtykke ville altså latt sesjonsopptak og
 * besøksidentifisering kjøre på folk som ikke har sagt ja til noe.
 *
 * DET KOSTER MÅLING, og det skal sies rett ut: en besøkende som ignorerer
 * banneret og fyller ut skjemaet, blir ikke talt. Den som SVARER — også den
 * som svarer nei — blir det, fordi GA4 da sender cookieløse signaler som
 * Google modellerer konverteringer fra.
 *
 * SLIK SNUS DET TILBAKE når containeren er ryddet: sett utløsere på de fire
 * taggene som krever `samtykke_oppdatert` med riktig verdi, verifiser at
 * ingen tredjepart fyrer før valg, og la så GTM laste alltid. Da får vi
 * modellerte konverteringer også fra dem som ikke svarer. Kroken finnes
 * allerede — hendelsen `samtykke_oppdatert` med `samtykke_analyse` og
 * `samtykke_markedsforing`. Se A42 for oppskriften.
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
 * Har besøkende svart? Leses fra attributtet samtykkeskriptet satte i <head>,
 * av samme grunn som i Samtykke.tsx: det er kjent før React starter, og et
 * MutationObserver-abonnement gjør at GTM lastes i samme øyeblikk brukeren
 * trykker, uten at noe må sendes gjennom React-treet.
 */
function abonner(varsle: () => void) {
  const iakt = new MutationObserver(varsle);
  iakt.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-samtykke"],
  });
  return () => iakt.disconnect();
}

export function Sporing() {
  const svart = useSyncExternalStore(
    abonner,
    () => document.documentElement.getAttribute("data-samtykke") === "svart",
    // Serveren rendrer aldri containeren. Den skal uansett bare lastes etter
    // et valg, og et valg kan bare tas i nettleseren.
    () => false,
  );

  if (!svart) return null;

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
