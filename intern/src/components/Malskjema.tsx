"use client";

import { useMemo, useState } from "react";

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
 * ── HVORFOR DET IKKE KALLES EN API HER ────────────────────────────────────
 *
 * Intranettet har ingen API-nøkkel til Anthropic, og en nøkkel i denne
 * appen ville vært en kostnad og en hemmelighet noen må eie. Kopier-knappen
 * koster to sekunder ekstra og null kroner. Skal det bli ett trykk senere,
 * er det `byggInstruks` som allerede gjør jobben — da byttes bare knappen.
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

export function Malskjema({ mal }: { mal: Mal }) {
  const [verdier, setVerdier] = useState<Verdier>(() => standardverdier(mal));
  const [kopiert, setKopiert] = useState(false);

  const instruks = useMemo(() => byggInstruks(mal, verdier), [mal, verdier]);

  const mangler = mal.felt.filter(
    (f) => f.paakrevd && !(verdier[f.id] ?? "").trim(),
  );

  const sett = (id: string, v: string) => {
    setVerdier((f) => ({ ...f, [id]: v }));
    setKopiert(false);
  };

  async function kopier() {
    try {
      await navigator.clipboard.writeText(instruks);
      setKopiert(true);
    } catch {
      /*
       * Klarte vi ikke å skrive til utklippstavlen — eldre nettleser, eller
       * en side uten HTTPS — er instruksen fortsatt synlig nedenfor og kan
       * merkes manuelt. Da er det bedre å la knappen stå urørt enn å si at
       * noe ble kopiert som ikke ble det.
       */
      setKopiert(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <form
        className="flex flex-col gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          void kopier();
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
        INSTRUKSEN ER KLISTRET PÅ STORE SKJERMER. Skjemaet er langt, og en
        instruks man må rulle tilbake til for å se, er en instruks ingen
        leser. På telefon ligger den under, der den hører hjemme.
      */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[1.25rem] tracking-[-0.015em]">
            Instruksen til Claude
          </h2>
          <p className="text-[0.8125rem] text-blekk-svak">
            {instruks.length.toLocaleString("nb-NO")} tegn
          </p>
        </div>

        {/*
          NØYTRAL, IKKE RØD. Denne står der fra første sekund, før noen har
          rukket å skrive noe — og et skjema som møter deg med en rød
          feilmelding du ikke har fortjent, er et skjema man ikke stoler på.
          Den røde fargen er reservert for «Utkast» i resten av huben.
        */}
        {mangler.length > 0 && (
          <p className="mt-3 rounded-interaktiv border border-kant bg-dempet px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-blekk-dempet">
            <span className="font-medium text-blekk">
              {mangler.length === 1
                ? "Dokumentet trenger ett felt til:"
                : `Dokumentet trenger ${mangler.length} felt til:`}
            </span>{" "}
            {mangler.map((f) => f.etikett).join(", ")}. Du kan kopiere likevel —
            da skriver Claude TBD i stedet for å gjette.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void kopier()}
            className="rounded-interaktiv bg-aksent px-4 py-2.5 text-[0.9375rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-[color:var(--action-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
          >
            {kopiert ? "Kopiert ✓" : "Kopier instruksen"}
          </button>
          <a
            href="https://claude.ai/new"
            target="_blank"
            rel="noreferrer"
            className="rounded-interaktiv border border-kant px-4 py-2.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
          >
            Åpne Claude ↗
          </a>
        </div>

        {/*
          `aria-live` på statusen, ikke på knappeteksten. Uten den er
          «Kopiert ✓» en endring en skjermleser ikke nevner, og da vet
          brukeren ikke om trykket gjorde noe.
        */}
        <p aria-live="polite" className="sr-only">
          {kopiert ? "Instruksen er kopiert til utklippstavlen." : ""}
        </p>

        <pre className="mt-5 max-h-[32rem] overflow-auto rounded-flate border border-kant bg-dempet p-4 font-sans text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-blekk-dempet">
          {instruks}
        </pre>
      </div>
    </div>
  );
}
