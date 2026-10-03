"use client";

import { useEffect, useRef, useState } from "react";

import { Knapp } from "./Knapp";
import { site, tilbud } from "@/content/site";
import { KILDE_NOKKEL, byggKilde } from "@/lib/kilde";
import { normaliserMobil, normaliserNettside } from "@/lib/kontaktfelt";

/**
 * Kontaktskjema — designet fra evidensen, ikke fra briefens fire felt.
 *
 * Briefens låsing på «maks 4 felt» utgår. Grunnlaget for den regelen er
 * observasjonsdata fra HubSpot uten kontroll for tilbudstype, og CXL har
 * motbevist at forholdet er lineært: 3→4 felt ga fall, 4→5 ga økning, og i
 * ett tilfelle slo ti felt tre. Kurven er flat der de fleste tester.
 *
 * Færre felt øker VOLUM. Det sier ingenting om kvalitet — og her står prisen
 * åpent, så siden selvkvalifiserer allerede. Da er det bedre å spørre om det
 * som faktisk trengs for å svare godt.
 *
 * Det ene godt dokumenterte funnet om skjemaer er Baymards modererte testing:
 * når KUN valgfrie felt er merket, får 32 % valideringsfeil. Derfor merkes
 * begge deler eksplisitt. Kun 14 % av nettsteder gjør det.
 *
 * Flertrinnsskjema er bevisst utelatt — ingen publisert kontrollert studie
 * finnes. Alle tallene som sirkulerer kommer fra leverandørblogger.
 *
 * Vanlig POST til /api/skjema, ikke serverhandling: det gir ekte sidelasting
 * på /takk, som hele målingen henger på. Virker også uten JavaScript.
 *
 * ENDRET 04.10.2026, bestilt av Pål:
 *
 * MOBILNUMMER ER PÅKREVD. Han ringer leads samme dag, og et lead uten
 * nummer er et lead som må vente på en e-post. Feltet flyttet samtidig opp
 * foran e-posten, fordi rekkefølgen i skjemaet er den samme som rekkefølgen
 * i varselet han får.
 *
 * NETTSIDE ER NYTT OG VALGFRITT. Den er det første han ser på før han
 * ringer. Står feltet tomt, utledes den av e-postdomenet når det ikke er en
 * gratisadresse — se lib/kontaktfelt.ts.
 *
 * INGEN BOOKINGKNAPP HER. Kalenderen står på /takk, rett etter innsending.
 * To handlinger ved siden av hverandre deler oppmerksomheten, og skjemaet er
 * den ene siden faktisk måles på.
 */

const felt =
  "w-full rounded-interaktiv border border-kant bg-white px-4 py-3 " +
  "text-blekk transition-colors placeholder:text-blekk-svak " +
  "focus:border-aksent focus:outline-none";

const feltMedFeil = `${felt.replace("border-kant", "border-aksent")}`;

/** Feltene som valideres i nettleseren utover det HTML-en gjør selv. */
type Feilfelt = "telefon" | "nettside";

export function Kontaktskjema({ side }: { side: string }) {
  // Tidsstempel settes på DOM-noden. Verdien leses kun ved innsending, så en
  // render for å lagre den ville vært bortkastet.
  const lastet = useRef<HTMLInputElement>(null);
  const kilde = useRef<HTMLInputElement>(null);
  const [feil, settFeil] = useState<Partial<Record<Feilfelt, string>>>({});
  const [sender, settSender] = useState(false);

  useEffect(() => {
    if (lastet.current) lastet.current.value = String(Date.now());
    // Kilden fra første (eller siste merkede) besøk, se lib/kilde.ts.
    // Mangler den, brukes dette besøket.
    if (kilde.current) {
      let verdi: string | null = null;
      try {
        verdi = localStorage.getItem(KILDE_NOKKEL);
      } catch {}
      kilde.current.value =
        verdi ??
        byggKilde(
          location.search,
          document.referrer,
          location.hostname,
          location.pathname,
        );
    }
  }, []);

  /*
    VALIDERINGEN SKJER VED INNSENDING, ikke ved hvert tastetrykk.

    En feilmelding som dukker opp mens man skriver det tredje sifferet i et
    telefonnummer er en feilmelding om at man ikke er ferdig. Baymards
    testing er entydig på at det oppleves som at skjemaet kjefter.

    Serveren validerer det samme uansett — se api/skjema/route.ts. Dette er
    til for å slippe en rundtur for en skrivefeil, ikke et vern.
  */
  function vedInnsending(e: React.FormEvent<HTMLFormElement>) {
    const skjema = e.currentTarget;
    const nye: Partial<Record<Feilfelt, string>> = {};

    const tlf = (skjema.elements.namedItem("telefon") as HTMLInputElement)
      ?.value;
    const m = normaliserMobil(tlf ?? "");
    if (!m.ok) nye.telefon = m.feil;

    const nett = (skjema.elements.namedItem("nettside") as HTMLInputElement)
      ?.value;
    if (nett?.trim()) {
      const n = normaliserNettside(nett);
      if (!n.ok) nye.nettside = n.feil;
    }

    settFeil(nye);
    if (Object.keys(nye).length > 0) {
      e.preventDefault();
      const forste = skjema.elements.namedItem(
        Object.keys(nye)[0],
      ) as HTMLInputElement | null;
      forste?.focus();
      return;
    }

    /*
      NAVN, E-POST OG BEDRIFT LEGGES I `sessionStorage` FOR KALENDEREN.

      /takk viser HubSpot-kalenderen rett etter innsending, og den kan
      forhåndsutfylles. Da slipper den som nettopp skrev navnet sitt å
      skrive det på nytt.

      IKKE I URL-EN. Adressen til /takk går til GA4, GTM og Clarity som
      `page_location`, den havner i nettleserhistorikken og i
      referrer-headeren til alt siden laster. `sessionStorage` er bundet til
      fanen, leses ikke av sporingen, og nøkkelen slettes av kalenderen med
      én gang verdien er brukt.

      Feiler lagringen — privat modus, blokkert lagring — skjer ingenting.
      Kalenderen vises som før, bare uten ferdig utfylte felt.
    */
    try {
      const les = (n: string) =>
        (skjema.elements.namedItem(n) as HTMLInputElement)?.value?.trim() ?? "";
      const ord = les("navn").split(/\s+/).filter(Boolean);
      sessionStorage.setItem(
        "rfl_lead",
        JSON.stringify({
          fornavn: ord[0] ?? "",
          etternavn: ord.slice(1).join(" "),
          epost: les("epost"),
          bedrift: les("bedrift"),
        }),
      );
    } catch {}

    /*
      KNAPPEN LÅSES, MEN SKJEMAET SENDES SOM VANLIG. `disabled` settes etter
      at nettleseren har begynt innsendingen; settes den synkront her, ville
      et deaktivert felt eller en deaktivert knapp kunne falt ut av
      POST-dataene i enkelte nettlesere.
    */
    settSender(true);
  }

  const feilmelding = (navn: Feilfelt) =>
    feil[navn] ? (
      <p id={`${navn}-feil`} role="alert" className="text-sm text-aksent">
        {feil[navn]}
      </p>
    ) : null;

  return (
    <form
      method="post"
      action="/api/skjema"
      onSubmit={vedInnsending}
      noValidate={false}
      className="grid gap-5"
      /*
        HOLDER HUBSPOTS «COLLECTED FORMS» UNNA. Lagt til 02.10.2026.

        Sporingsskriptet til HubSpot leser av skjemaer det ikke eier og
        oppretter kontakten selv. Fra 02.10.2026 sender /api/skjema hvert
        lead rett til HubSpot fra serveren (se lib/hubspot.ts), og uten
        dette attributtet ville samme innsending kommet inn to veier: én
        gang fra nettleseren og én gang fra serveren.

        Attributtet er HubSpots eget og slår av avlesningen for akkurat
        dette skjemaet. Serverveien er den som skal bli stående: den
        virker også for den som blokkerer sporing, og den er ikke avhengig
        av samtykke til markedsføringscookies.
      */
      data-hs-do-not-collect="true"
    >
      <input type="hidden" name="lastet" ref={lastet} defaultValue="0" />
      <input type="hidden" name="side" value={side} />
      <input type="hidden" name="kilde" ref={kilde} defaultValue="" />

      {/* Honningkrukke: skjult for mennesker, ikke for boter. Ingen CAPTCHA. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="firmanavn">Firmanavn</label>
        <input
          id="firmanavn"
          name="firmanavn"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="navn" className="text-sm font-medium">
          Navn <span className="text-blekk-dempet">(påkrevd)</span>
        </label>
        <input
          id="navn"
          name="navn"
          required
          autoComplete="name"
          className={felt}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <label htmlFor="bedrift" className="text-sm font-medium">
            Bedrift <span className="text-blekk-dempet">(påkrevd)</span>
          </label>
          <input
            id="bedrift"
            name="bedrift"
            required
            autoComplete="organization"
            className={felt}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="telefon" className="text-sm font-medium">
            Mobilnummer <span className="text-blekk-dempet">(påkrevd)</span>
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={feil.telefon ? true : undefined}
            aria-describedby={feil.telefon ? "telefon-feil" : undefined}
            className={feil.telefon ? feltMedFeil : felt}
          />
          {feilmelding("telefon")}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <label htmlFor="epost" className="text-sm font-medium">
            E-post <span className="text-blekk-dempet">(påkrevd)</span>
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            required
            autoComplete="email"
            className={felt}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="nettside" className="text-sm font-medium">
            Nettside <span className="text-blekk-dempet">(valgfritt)</span>
          </label>
          {/*
            IKKE `type="url"`. Den avviser «dinbedrift.no» fordi protokollen
            mangler — altså nøyaktig slik folk skriver en nettside — og
            nettleserens egen feilmelding ville kommet på en helt riktig
            adresse. Normaliseringen gjør jobben i stedet, både her og på
            serveren. Se lib/kontaktfelt.ts.
          */}
          <input
            id="nettside"
            name="nettside"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="dinbedrift.no"
            aria-invalid={feil.nettside ? true : undefined}
            aria-describedby={feil.nettside ? "nettside-feil" : undefined}
            className={feil.nettside ? feltMedFeil : felt}
          />
          {feilmelding("nettside")}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="melding" className="text-sm font-medium">
          Hva trenger dere?{" "}
          <span className="text-blekk-dempet">(valgfritt)</span>
        </label>
        <textarea
          id="melding"
          name="melding"
          rows={4}
          aria-describedby="melding-hjelp"
          className={felt}
        />
        <p id="melding-hjelp" className="text-sm text-blekk-dempet">
          Kort om bedriften og hva dere vil oppnå. Det gjør forslaget bedre.
        </p>
      </div>

      {/*
        Knappetekst beskriver hva du får, ikke hva du gjør. Ikke fordi et
        prosenttall sier det – de tallene er usporbare – men fordi det er
        klarere.

        `aria-disabled` OG IKKE `disabled` MENS DEN SENDER. En deaktivert
        knapp mister fokus, og skjermleseren mister da stedet sitt midt i
        innsendingen. `pointer-events-none` stopper det andre klikket;
        `aria-disabled` forteller hjelpemidlene hvorfor.
      */}
      <Knapp
        type="submit"
        aria-disabled={sender || undefined}
        className={`mt-1 justify-self-start ${sender ? "pointer-events-none opacity-70" : ""}`}
      >
        {sender ? "Sender …" : "Få et strategiforslag"}
      </Knapp>

      {/*
        Risikodemping ved knappen, ikke 400 px lenger ned.

        PRATEN KOM INN HER 19.09.2026, og ikke under overskriften der Pål
        først foreslo den. Grunnen er at denne linja allerede sa alt unntatt
        praten: svartid, at forslaget er konkret, og at det er
        uforpliktende. La man setningen under h2-en i stedet, sto
        «uforpliktende» to ganger i samme kort med 400 px mellom seg.

        REKKEFØLGEN ER POENGET. Pål bekreftet at skjemaet gir et skriftlig
        forslag først, og at praten kommer etterpå — om forslaget. «Så tar
        vi en uforpliktende prat om det» sier nettopp det. Den motsatte
        rekkefølgen ville byttet et lavterskelløfte (du får noe tilsendt)
        mot et høyere (du får en telefon), og terskelen på dette skjemaet
        er den eneste KPI-en siden har.

        Ordlyden er Påls egen setning satt sammen med det som allerede sto
        her. Ingen nye påstander er funnet på.
      */}
      <p className="text-sm text-blekk-dempet">
        Svar innen {tilbud.strategiforslagVirkedager} virkedager: et konkret
        forslag, ikke en generisk presentasjon. Så tar vi en uforpliktende prat
        om det. Eller ring{" "}
        <a
          href={`tel:${site.kontakt.telefon.replace(/\s/g, "")}`}
          className="underline underline-offset-2 hover:text-blekk"
        >
          {site.kontakt.telefon}
        </a>
        .
      </p>
    </form>
  );
}
