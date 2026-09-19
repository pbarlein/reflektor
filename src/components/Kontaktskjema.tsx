"use client";

import { Knapp } from "./Knapp";
import { useEffect, useRef } from "react";
import { site, tilbud } from "@/content/site";

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
 */

const felt =
  "w-full rounded-interaktiv border border-kant bg-white px-4 py-3 " +
  "text-blekk transition-colors placeholder:text-blekk-svak " +
  "focus:border-aksent focus:outline-none";

export function Kontaktskjema({ side }: { side: string }) {
  // Tidsstempel settes på DOM-noden. Verdien leses kun ved innsending, så en
  // render for å lagre den ville vært bortkastet.
  const lastet = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (lastet.current) lastet.current.value = String(Date.now());
  }, []);

  return (
    <form method="post" action="/api/skjema" className="grid gap-5">
      <input type="hidden" name="lastet" ref={lastet} defaultValue="0" />
      <input type="hidden" name="side" value={side} />

      {/* Honningkrukke: skjult for mennesker, ikke for boter. Ingen CAPTCHA. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="firmanavn">Firmanavn</label>
        <input id="firmanavn" name="firmanavn" tabIndex={-1} autoComplete="off" />
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
      </div>

      <div className="grid gap-2">
        <label htmlFor="telefon" className="text-sm font-medium">
          Telefon <span className="text-blekk-dempet">(valgfritt)</span>
        </label>
        <input
          id="telefon"
          name="telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={felt}
        />
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
      */}
      <Knapp type="submit" className="mt-1 justify-self-start">
        Få et strategiforslag
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
