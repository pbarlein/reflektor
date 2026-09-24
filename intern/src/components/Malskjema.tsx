"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Markdown } from "@/components/Markdown";
import { Utskrift } from "@/components/Utskrift";
import { byggInstruks } from "@/content/maler";
import type { Felt, Mal } from "@/content/maltype";

/**
 * Skjemaet, og instruksen det bygger.
 *
 * ── HVORFOR INSTRUKSEN VISES, OG IKKE BARE KOPIERES ───────────────────────
 *
 * Den som limer inn noe hen ikke har lest, oppdager ikke at et felt sto
 * tomt. Instruksen ligger derfor åpent nederst, og den oppdaterer seg mens
 * du skriver. Da ser man hva Claude faktisk får — inkludert listen over hva
 * som IKKE ble fylt ut.
 *
 * ── TO VEIER UT, OG HVORFOR BEGGE FINNES ──────────────────────────────────
 *
 * «Lag dokumentet» sender skjemaet til /api/dokument, som kjører det mot
 * Claude og strømmer teksten tilbake. Det er hovedveien.
 *
 * «Kopier instruksen» er ikke en rest fra før API-et kom. Den er der for
 * den som vil videre i en samtale — justere tonen, legge ved kundens
 * profilpakke, be om en variant. Et ferdig dokument er et svar; instruksen
 * er en samtale man kan fortsette.
 *
 * KLIENTEN SENDER ALDRI INSTRUKSEN TIL SERVEREN. Den sender mal-slug og
 * feltene, og serveren bygger instruksen på nytt. Se route.ts for hvorfor.
 *
 * ── PÅKREVDE FELT ─────────────────────────────────────────────────────────
 *
 * Knappen låses ikke. Et skjema som nekter å gi deg noe før alt er utfylt,
 * er ubrukelig den dagen du mangler ett felt og har dårlig tid. I stedet
 * teller vi opp hva som mangler, og instruksen sier til Claude at de
 * feltene skal bli TBD — ikke gjettes.
 */

type Verdier = Record<string, string>;

function standardverdier(mal: Mal): Verdier {
  const v: Verdier = {};
  for (const f of mal.felt) if (f.standard) v[f.id] = f.standard;
  return v;
}

const ETIKETT =
  "block font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-blekk";
const HJELP = "mt-1 block text-[0.8125rem] leading-snug text-blekk-svak";
const INPUT =
  "mt-2.5 block w-full rounded-interaktiv border border-kant bg-kort px-3.5 py-2.5 text-[0.9375rem] text-blekk transition-colors placeholder:text-blekk-svak focus:border-kant-sterk focus:outline-2 focus:outline-offset-1 focus:outline-aksent motion-reduce:transition-none";

function Feltet({
  felt,
  verdi,
  sett,
}: {
  felt: Felt;
  verdi: string;
  sett: (v: string) => void;
}) {
  const id = `felt-${felt.id}`;

  if (felt.type === "flervalg") {
    const valgte = verdi ? verdi.split(" · ") : [];
    const veksle = (v: string) =>
      sett(
        (valgte.includes(v)
          ? valgte.filter((x) => x !== v)
          : [...valgte, v]
        ).join(" · "),
      );
    return (
      <fieldset>
        <legend className={ETIKETT}>{felt.etikett}</legend>
        {felt.hjelp && <span className={HJELP}>{felt.hjelp}</span>}
        <div className="mt-2.5 flex flex-wrap gap-2">
          {felt.valg?.map((v) => {
            const paa = valgte.includes(v);
            return (
              <label
                key={v}
                className={`cursor-pointer rounded-interaktiv border px-3 py-1.5 text-[0.875rem] transition-colors motion-reduce:transition-none ${
                  paa
                    ? "border-aksent bg-[color:var(--surface-accent-soft)] text-aksent-tekst"
                    : "border-kant text-blekk-dempet hover:border-kant-sterk"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={paa}
                  onChange={() => veksle(v)}
                />
                {v}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div>
      <label htmlFor={id} className={ETIKETT}>
        {felt.etikett}
      </label>
      {felt.hjelp && <span className={HJELP}>{felt.hjelp}</span>}

      {felt.type === "lang" ? (
        <textarea
          id={id}
          rows={3}
          value={verdi}
          placeholder={felt.plassholder}
          onChange={(e) => sett(e.target.value)}
          className={`${INPUT} resize-y leading-relaxed`}
        />
      ) : felt.type === "valg" ? (
        <select
          id={id}
          value={verdi}
          onChange={(e) => sett(e.target.value)}
          className={INPUT}
        >
          <option value="">Velg …</option>
          {felt.valg?.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={felt.type === "dato" ? "date" : "text"}
          value={verdi}
          placeholder={felt.plassholder}
          onChange={(e) => sett(e.target.value)}
          className={INPUT}
        />
      )}
    </div>
  );
}

type Tilstand = "klar" | "skriver" | "ferdig" | "feil";

export function Malskjema({ mal }: { mal: Mal }) {
  const [verdier, setVerdier] = useState<Verdier>(() => standardverdier(mal));
  const [kopiert, setKopiert] = useState<"" | "instruks" | "dokument">("");
  const [dokument, setDokument] = useState("");
  const [tilstand, setTilstand] = useState<Tilstand>("klar");
  const [feilmelding, setFeilmelding] = useState("");
  const avbryt = useRef<AbortController | null>(null);


  const instruks = useMemo(() => byggInstruks(mal, verdier), [mal, verdier]);

  const mangler = mal.felt.filter(
    (f) => f.paakrevd && !(verdier[f.id] ?? "").trim(),
  );

  const sett = (id: string, v: string) => {
    setVerdier((f) => ({ ...f, [id]: v }));
    setKopiert("");
  };

  async function kopier(hva: "instruks" | "dokument") {
    try {
      await navigator.clipboard.writeText(
        hva === "instruks" ? instruks : dokument,
      );
      setKopiert(hva);
    } catch {
      /*
       * Klarte vi ikke å skrive til utklippstavlen — eldre nettleser, eller
       * en side uten HTTPS — er teksten fortsatt synlig og kan merkes
       * manuelt. Da er det bedre å la knappen stå urørt enn å si at noe ble
       * kopiert som ikke ble det.
       */
      setKopiert("");
    }
  }

  const kunde = (verdier.kunde ?? "").trim();
  const idag = new Date().toISOString().slice(0, 10);

  /**
   * Filnavnet PDF-en foreslås med.
   *
   * Nettleseren bruker sidens tittel som forslag i «Lagre som PDF». Uten
   * dette heter filen «Produksjonsplan — Reflektor internt», og den femte
   * produksjonsplanen i nedlastingsmappen heter «Produksjonsplan (4)».
   *
   * Æ, Ø og Å skrives om. Ikke av nød — moderne filsystemer takler dem —
   * men fordi filen skal videre som e-postvedlegg, og der er det fortsatt
   * systemer som ikke gjør det.
   */
  function filnavn(): string {
    const reint = (t: string) =>
      t
        .toLowerCase()
        .replaceAll("æ", "ae")
        .replaceAll("ø", "oe")
        .replaceAll("å", "aa")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return [kunde && reint(kunde), reint(mal.navn), idag]
      .filter(Boolean)
      .join("-");
  }

  /**
   * Åpner nettleserens utskrift, som også er veien til PDF.
   *
   * Tittelen byttes rett før og settes tilbake etterpå. `print()` blokkerer
   * til dialogen er lukket i de fleste nettlesere, men ikke i alle — derfor
   * ryddes den også opp på `afterprint`, som fyrer uansett.
   */
  function skrivUt() {
    const forrige = document.title;
    document.title = filnavn();
    const rydd = () => {
      document.title = forrige;
      window.removeEventListener("afterprint", rydd);
    };
    window.addEventListener("afterprint", rydd);
    window.print();
    rydd();
  }

  /**
   * Strømmer dokumentet inn mens det skrives.
   *
   * Teksten legges på fortløpende, ikke når alt er ferdig. Et dokument tar
   * titalls sekunder, og en tom boks i et halvt minutt ser ut som at
   * ingenting skjer.
   */
  async function lagDokument() {
    avbryt.current?.abort();
    const styring = new AbortController();
    avbryt.current = styring;

    setDokument("");
    setFeilmelding("");
    setTilstand("skriver");
    setKopiert("");

    try {
      const svar = await fetch("/api/dokument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mal: mal.slug, verdier }),
        signal: styring.signal,
      });

      if (!svar.ok || !svar.body) {
        const kode = await svar
          .json()
          .then((d: { feil?: string }) => d.feil)
          .catch(() => "ukjent");
        setFeilmelding(
          kode === "mangler-nokkel"
            ? "Dokumentgeneratoren er ikke skrudd på ennå. ANTHROPIC_API_KEY mangler i Vercel. Bruk «Kopier instruksen» i mellomtiden."
            : kode === "ikke-innlogget"
              ? "Du er logget ut. Last siden på nytt."
              : kode === "for-lang"
                ? "Skjemaet er for langt. Kort ned de lange feltene."
                : "Noe gikk galt. Prøv igjen.",
        );
        setTilstand("feil");
        return;
      }

      const leser = svar.body.getReader();
      const dekoder = new TextDecoder();
      for (;;) {
        const { done, value } = await leser.read();
        if (done) break;
        const bit = dekoder.decode(value, { stream: true });
        setDokument((d) => d + bit);
      }
      setTilstand("ferdig");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setTilstand(dokument ? "ferdig" : "klar");
        return;
      }
      setFeilmelding("Mistet forbindelsen. Prøv igjen.");
      setTilstand("feil");
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <form
        className="flex flex-col gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          void lagDokument();
        }}
      >
        {mal.felt.map((f) => (
          <Feltet
            key={f.id}
            felt={f}
            verdi={verdier[f.id] ?? ""}
            sett={(v) => sett(f.id, v)}
          />
        ))}
      </form>

      {/*
        RESULTATET ER KLISTRET PÅ STORE SKJERMER. Skjemaet er langt, og et
        dokument man må rulle tilbake til for å se, blir ikke lest mens det
        skrives. På telefon ligger det under, der det hører hjemme.
      */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        {mangler.length > 0 && tilstand === "klar" && (
          <p className="mb-4 rounded-interaktiv border border-kant bg-dempet px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-blekk-dempet">
            <span className="font-medium text-blekk">
              {mangler.length === 1
                ? "Dokumentet trenger ett felt til:"
                : `Dokumentet trenger ${mangler.length} felt til:`}
            </span>{" "}
            {mangler.map((f) => f.etikett).join(", ")}. Du kan lage det likevel
            — da skriver Claude TBD i stedet for å gjette.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              tilstand === "skriver"
                ? avbryt.current?.abort()
                : void lagDokument()
            }
            className="rounded-interaktiv bg-aksent px-4 py-2.5 text-[0.9375rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-[color:var(--action-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
          >
            {tilstand === "skriver"
              ? "Avbryt"
              : dokument
                ? "Lag på nytt"
                : "Lag dokumentet"}
          </button>

          {dokument && tilstand !== "skriver" && (
            <>
              <button
                type="button"
                onClick={() => void kopier("dokument")}
                className="rounded-interaktiv border border-kant px-4 py-2.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
              >
                {kopiert === "dokument" ? "Kopiert ✓" : "Kopier dokumentet"}
              </button>
              <button
                type="button"
                onClick={skrivUt}
                className="rounded-interaktiv border border-kant px-4 py-2.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
              >
                Last ned PDF
              </button>
            </>
          )}
        </div>

        {/*
          NETTLESEREN STEMPLER SIN EGEN URL I MARGEN.

          Chrome og Safari legger inn adresse, dato og sidetall i
          utskriftsmargen med mindre brukeren slår det av, og det finnes
          ingen CSS som styrer det — det er en innstilling i dialogen, ikke
          i dokumentet.

          «localhost:3000/dokument/produksjonsplan» nederst på en
          produksjonsplan som sendes til Jordbærpikene er ikke en detalj.
          Derfor står oppskriften her, ved knappen, og ikke i en
          dokumentasjon ingen leser i det øyeblikket de trenger den.
        */}
        {dokument && tilstand !== "skriver" && (
          <p className="mt-3.5 max-w-[46ch] text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
            I utskriftsvinduet: velg{" "}
            <span className="text-blekk-dempet">Lagre som PDF</span> som
            skriver, og skru av{" "}
            <span className="text-blekk-dempet">topptekst og bunntekst</span>{" "}
            under flere innstillinger. Ellers stempler nettleseren adressen
            sin i margen.
          </p>
        )}

        {/*
          `aria-live` på en egen, skjult linje. Knappeteksten endrer seg, men
          en tekstendring i en knapp er ikke noe en skjermleser nevner av seg
          selv — og da vet man ikke om trykket gjorde noe.
        */}
        <p aria-live="polite" className="sr-only">
          {tilstand === "skriver"
            ? "Claude skriver dokumentet."
            : tilstand === "ferdig"
              ? "Dokumentet er ferdig."
              : kopiert
                ? "Kopiert til utklippstavlen."
                : ""}
        </p>

        {feilmelding && (
          <p className="mt-4 rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-varsel">
            {feilmelding}
          </p>
        )}

        {(dokument || tilstand === "skriver") && (
          <div className="mt-5 max-h-[38rem] overflow-y-auto rounded-flate border border-kant bg-kort p-6 sm:p-8">
            {dokument ? (
              <Markdown kilde={dokument} />
            ) : (
              <p className="text-[0.9375rem] text-blekk-svak">
                Claude leser gjennom skjemaet …
              </p>
            )}
            {tilstand === "skriver" && dokument && (
              <span
                aria-hidden
                className="mt-1 inline-block h-4 w-[2px] animate-pulse bg-aksent align-middle"
              />
            )}
          </div>
        )}

        {/*
          ARKET. Usynlig på skjerm, og det eneste som er synlig på papir.
          Det ligger her og ikke i en egen rute fordi utskriften skal treffe
          nøyaktig det dokumentet du ser på — ikke en ny generering.
        */}
        {/*
          ARKET HENGER RETT UNDER <body>, IKKE HER.

          Utskriften plasserer arket øverst på siden med `position:
          absolute`, og en absolutt posisjon regnes fra nærmeste
          posisjonerte forelder. Her er det kolonnen som er `sticky` på
          store skjermer — så arket kom ut innrykket på høyre halvdel av
          papiret, med seks centimeter tom venstremarg.

          Portalen flytter det ut av kolonnen og gjør body til referansen.
          `document` finnes ikke under serverrendringen, men `dokument` er
          alltid tomt der: det fylles først når noen trykker på knappen.
        */}
        {dokument &&
          tilstand !== "skriver" &&
          createPortal(
            <Utskrift
              kilde={dokument}
              tittel={mal.navn}
              kunde={kunde || undefined}
              dato={new Intl.DateTimeFormat("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(`${idag}T12:00:00Z`))}
            />,
            document.body,
          )}

        {/*
          INSTRUKSEN LIGGER SAMMENFOLDET. Den er ikke det man kom for, men
          den er verdt å kunne se: hva Claude faktisk fikk, inkludert listen
          over felt som sto tomme. Og den kan tas med inn i en samtale hvis
          dokumentet trenger en runde til.
        */}
        <details className="mt-6 rounded-flate border border-kant bg-dempet">
          <summary className="cursor-pointer list-none px-4 py-3 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none">
            Se instruksen Claude får · {instruks.length.toLocaleString("nb-NO")}{" "}
            tegn
          </summary>
          <div className="border-t border-kant px-4 py-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void kopier("instruks")}
                className="rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
              >
                {kopiert === "instruks" ? "Kopiert ✓" : "Kopier instruksen"}
              </button>
              <a
                href="https://claude.ai/new"
                target="_blank"
                rel="noreferrer"
                className="rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
              >
                Åpne Claude ↗
              </a>
            </div>
            <pre className="mt-4 max-h-[24rem] overflow-auto font-sans text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-blekk-dempet">
              {instruks}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
