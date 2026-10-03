"use client";

import { useEffect, useRef, useState } from "react";

import { Knappelenke } from "@/components/Knapp";
import { erBooket } from "@/lib/motemelding";

/**
 * HubSpots møtekalender, innebygd på /takk.
 *
 * HVORFOR DEN STÅR HER OG IKKE VED SKJEMAET. Besluttet 03.10.2026 etter
 * research: vises kalenderen umiddelbart etter innsending, booker rundt to
 * av tre møte. Ved manuell oppfølging er tallet rundt én av tre. Ved siden
 * av skjemaet ville den vært en konkurrerende handling på en side som bare
 * måles på én.
 *
 * KODEN ER HUBSPOTS EGEN: en `div.meetings-iframe-container` med `data-src`,
 * pluss `MeetingsEmbedCode.js`, som finner containeren og setter inn en
 * iframe. Formatet er hentet fra HubSpots innbyggingsdialog, ikke gjettet.
 *
 * SKRIPTET LASTES AV EFFEKTEN, IKKE AV `next/script`, og det er en
 * rekkefølgebeslutning. Forhåndsutfyllingen må stå i `data-src` FØR skriptet
 * leser den, og med `next/script` er det ingen garanti for hvem som er
 * først. Her settes attributtet og skriptet legges til i samme effekt, i den
 * rekkefølgen. Det fjerner samtidig et `setState` i effekten, som
 * React-kompilatoren ikke tillater.
 *
 * Skriptet lastes uansett ETTER at siden er interaktiv, altså etter
 * `takk_page_view`. Den sidevisningen er Reflektors eneste KPI og skal ikke
 * stå bak en tredjepart i køen.
 */

/** Møtelenken. Byttes den, byttes den her og i Vercel-regelen for /book. */
const MOTELENKE = "https://meetings-eu1.hubspot.com/paal-barlein/intro";

/** Reserven når skriptet ikke når fram. Vercel-regel, brukes også i e-poster. */
const BOOKLENKE = "https://www.reflektor.no/book";

const SKRIPT =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

/**
 * Feltene HubSpot fyller ut fra adressen.
 *
 * MÅLT, IKKE GJETTET. HubSpot dokumenterer ikke forhåndsutfylling for
 * innebygde kalendere noe sted — hverken i utviklerdokumentasjonen eller i
 * kunnskapsbasen. Jeg kjørte derfor kalenderen i en nettleser 04.10.2026,
 * klikket fram til skjemasteget og leste av verdiene: `firstName`,
 * `lastName`, `email` og `company` — alle i kamelnotasjon — sto ferdig
 * utfylt. Små bokstaver ble prøvd i samme runde og er ikke nødvendig.
 *
 * SIDEN DET IKKE ER DOKUMENTERT, KAN DET SLUTTE Å VIRKE uten varsel. Da blir
 * feltene stående tomme og den som booker fyller dem ut selv — nøyaktig slik
 * det var før. Ingenting ødelegges, og ingenting annet avhenger av det.
 */
type Forhandsutfylling = {
  fornavn?: string;
  etternavn?: string;
  epost?: string;
  bedrift?: string;
};

function medFelter(base: string, f: Forhandsutfylling): string {
  const u = new URL(base);
  u.searchParams.set("embed", "true");
  if (f.fornavn) u.searchParams.set("firstName", f.fornavn);
  if (f.etternavn) u.searchParams.set("lastName", f.etternavn);
  if (f.epost) u.searchParams.set("email", f.epost);
  if (f.bedrift) u.searchParams.set("company", f.bedrift);
  return u.toString();
}

/** Leser og TØMMER det skjemaet la igjen. Tåler at lagring er blokkert. */
function hentOgTom(): Forhandsutfylling {
  try {
    const rå = sessionStorage.getItem("rfl_lead");
    if (!rå) return {};
    sessionStorage.removeItem("rfl_lead");
    const f = JSON.parse(rå) as Forhandsutfylling;
    return typeof f === "object" && f !== null ? f : {};
  } catch {
    return {};
  }
}

export function Motekalender() {
  const boks = useRef<HTMLDivElement>(null);
  const [reserve, settReserve] = useState(false);

  useEffect(() => {
    const node = boks.current;
    if (!node) return;

    /*
      FORHÅNDSUTFYLLINGEN LESES FRA `sessionStorage`, ikke fra adressen.

      Personopplysninger skal aldri stå i URL-en til /takk. URL-en går til
      GA4, GTM og Clarity som `page_location`, og den havner i
      nettleserhistorikken og i referrer-headeren til alt siden laster. Et
      navn der er en personopplysning vi har gitt bort uten grunn.

      `sessionStorage` er bundet til fanen, overlever ikke at den lukkes, og
      leses aldri av sporingen. Nøkkelen slettes med én gang verdien er
      brukt: kalenderen trenger den i det øyeblikket den settes opp, og
      aldri igjen.
    */
    const f = hentOgTom();
    if (f.fornavn || f.epost) node.dataset.src = medFelter(MOTELENKE, f);

    const s = document.createElement("script");
    s.src = SKRIPT;
    s.async = true;
    document.body.appendChild(s);

    /*
      RESERVEN. Blokkeres HubSpot-skriptet — annonseblokkering, streng
      nettverkspolicy, dårlig forbindelse — står containeren tom, og den som
      nettopp sendte skjemaet ser et hull der det skulle vært en kalender.

      Vakten sjekker DOM-en og ikke om skriptet lastet: et skript kan laste
      og likevel ikke gjøre noe.

      DEN STARTER SKJULT, ikke synlig. Motsatt vei ville vist en knapp i tre
      sekunder på hver eneste lasting og så fjernet den igjen — en side som
      retter seg selv foran øynene på folk ser ødelagt ut.
    */
    const t = setTimeout(() => {
      settReserve(!node.querySelector("iframe"));
    }, 3000);

    return () => {
      clearTimeout(t);
      s.remove();
    };
  }, []);

  /*
    LYTTEREN PÅ BOOKING. HubSpot sender `{ meetingBookSucceeded: true }` fra
    iframen når møtet er bekreftet.

    Den pusher BARE en hendelse til dataLayer. Ingen navn, ingen e-post,
    ingenting om hvem som booket — GTM og GA4 skal ikke få personopplysninger
    herfra, og hendelsen i seg selv er alt målingen trenger.

    Taggen og GA4-hendelsen settes opp i GTM av Cowork. Den skal ikke lages
    her: en utløser som fyrer uten at noen vet om den er nøyaktig den feilen
    TakkHendelse.tsx advarer mot.

    Opphavssjekken ligger i lib/motemelding.ts og er testet. Uten den kunne
    hvem som helst utløst en konverteringshendelse ved å poste ett objekt.
  */
  useEffect(() => {
    const lytt = (e: MessageEvent) => {
      if (!erBooket(e.origin, e.data)) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "mote_booket", mote_kilde: "takkeside" });
    };
    window.addEventListener("message", lytt);
    return () => window.removeEventListener("message", lytt);
  }, []);

  return (
    <div className="mt-6">
      <div
        ref={boks}
        className="meetings-iframe-container min-h-[34rem]"
        data-src={`${MOTELENKE}?embed=true`}
      />
      {reserve && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-blekk-dempet">
            Får du ikke opp kalenderen? Denne lenken åpner den i et eget vindu.
          </p>
          <Knappelenke href={BOOKLENKE}>
            Book en prat på 30 minutter
          </Knappelenke>
        </div>
      )}
    </div>
  );
}
