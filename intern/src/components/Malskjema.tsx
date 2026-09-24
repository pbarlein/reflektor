"use client";

import { useMemo, useRef, useState } from "react";

import { Arbeid } from "@/components/Arbeid";
import { Grunnlag } from "@/components/Grunnlag";
import { Arkramme, type Arkhandtak } from "@/components/Arkramme";
import { deleneI, type Ark as ArkData } from "@/content/arktype";
import type { Research } from "@/content/researchtype";
import { byggInstruks, eksempelverdier } from "@/content/maler";
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

type Tilstand = "klar" | "jobber" | "ferdig" | "feil";

export function Malskjema({ mal }: { mal: Mal }) {
  const [verdier, setVerdier] = useState<Verdier>(() => standardverdier(mal));
  const [kopiert, setKopiert] = useState(false);

  /*
   * HVER RETTELSE BLIR EN NY UTGAVE, IKKE EN OVERSKRIVING.
   *
   * Man ber om en endring, ser den, og oppdager at forrige utgave var
   * bedre. Uten historikk er den borte, og eneste vei tilbake er å be om
   * det motsatte og håpe. Utgavene koster ingenting å ta vare på.
   */
  const [utgaver, setUtgaver] = useState<ArkData[]>([]);
  const [rettelser, setRettelser] = useState<string[]>([]);
  const [vist, setVist] = useState(0);

  const [tilstand, setTilstand] = useState<Tilstand>("klar");
  const [gjort, setGjort] = useState(0);
  const [fase, setFase] = useState<"research" | "skriver">("skriver");
  const [sok, setSok] = useState<string[]>([]);
  /*
   * Researchen holdes på tvers av rettelser. Å slå opp bedriften på nytt
   * for hver lille endring ville kostet penger og tid uten å gi noe: den
   * endrer seg ikke mellom to utgaver av samme dokument.
   */
  const [research, setResearch] = useState<Research | null>(null);
  const [fraMinne, setFraMinne] = useState(false);
  const [feilmelding, setFeilmelding] = useState("");
  const [rettelse, setRettelse] = useState("");
  const [forMye, setForMye] = useState(false);

  /*
   * ── OPPLASTING ER HOVEDVEIEN DER MALEN HAR DEN ────────────────────────
   *
   * Feltene er skjult til noen ber om dem. Det er ikke for å spare plass —
   * det er for å gjøre det åpenbare valget til det enkleste. En produsent
   * som ser sytten felt og et opplastingsfelt, fyller ut sytten felt.
   */
  const [fil, setFil] = useState<{ navn: string; data: string } | null>(null);
  const [filfeil, setFilfeil] = useState("");
  const [viserFelter, setViserFelter] = useState(!mal.opplasting);
  const [drar, setDrar] = useState(false);

  const avbryt = useRef<AbortController | null>(null);
  const arkRef = useRef<Arkhandtak | null>(null);
  const resultatRef = useRef<HTMLDivElement>(null);

  const instruks = useMemo(() => byggInstruks(mal, verdier), [mal, verdier]);
  const deler = useMemo(() => deleneI(mal), [mal]);

  const mangler = mal.felt.filter(
    (f) => f.paakrevd && !(verdier[f.id] ?? "").trim(),
  );

  /*
   * «Fyll inn eksempel» vises bare på et urørt skjema.
   *
   * Knappen overskriver alt. Står den framme etter at noen har skrevet i
   * ti felt, er den en felle — ett feilklikk og arbeidet er borte. Er
   * skjemaet urørt, kan den ikke ødelegge noe, og det er akkurat da man
   * trenger den.
   */
  const urort = mal.felt.every(
    (f) => (verdier[f.id] ?? "") === (f.standard ?? ""),
  );

  const naavaerende = utgaver[vist];
  const nyeste = utgaver.length ? utgaver[utgaver.length - 1] : undefined;
  const kunde = (verdier.kunde ?? "").trim();
  const idag = new Date().toISOString().slice(0, 10);

  const sett = (id: string, v: string) =>
    setVerdier((f) => ({ ...f, [id]: v }));

  /** Æ, Ø og Å skrives om: filen skal videre som e-postvedlegg. */
  const filnavn = useMemo(() => {
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
  }, [kunde, mal.navn, idag]);

  /**
   * Leser PDF-en til base64 i nettleseren.
   *
   * `readAsDataURL` gir «data:application/pdf;base64,...», og alt etter
   * kommaet er det API-et vil ha. Grensen speiler serverens, så brukeren
   * får beskjed før filen er sendt og ikke etter.
   */
  async function lesFil(f: File) {
    setFilfeil("");
    if (f.type !== "application/pdf") {
      setFilfeil(
        "Det må være en PDF. Eksporter planen på nytt hvis du har den som noe annet.",
      );
      return;
    }
    if (f.size > 2_500_000) {
      setFilfeil(
        `Filen er ${(f.size / 1_000_000).toFixed(1)} MB, og taket er 2,5 MB. En eksportert plan er som regel under 1 MB — er din større, er den sannsynligvis skannet.`,
      );
      return;
    }
    const data = await new Promise<string>((løs, avvis) => {
      const leser = new FileReader();
      leser.onload = () => løs(String(leser.result).split(",")[1] ?? "");
      leser.onerror = () => avvis(leser.error);
      leser.readAsDataURL(f);
    }).catch(() => "");
    if (!data) {
      setFilfeil("Klarte ikke å lese filen. Prøv å laste den opp på nytt.");
      return;
    }
    setFil({ navn: f.name, data });
  }

  async function kopier() {
    try {
      await navigator.clipboard.writeText(instruks);
      setKopiert(true);
    } catch {
      setKopiert(false);
    }
  }

  /**
   * Kjører én runde mot generatoren.
   *
   * Uten `retting` er det en ny generering. Med, sendes utgaven som står nå
   * pluss setningen om hva som skal endres — se byggRettelse i maler.ts for
   * hvorfor det ikke er en samtale som vokser.
   */
  async function kjor(retting?: string, friskResearch = false) {
    const styring = new AbortController();
    avbryt.current = styring;

    /*
     * FLYTT BLIKKET TIL DER DET SKJER.
     *
     * Skjemaet er langt, og knappen står nederst. Uten dette trykker man
     * «Lag dokumentet» og blir stående å se på et tomt felt, mens
     * fremdriften kjører av gårde to skjermhøyder lenger opp.
     */
    resultatRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

    setTilstand("jobber");
    setGjort(0);
    setFase(research && !friskResearch ? "skriver" : "research");
    setSok([]);
    setFeilmelding("");

    try {
      const svar = await fetch("/api/dokument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mal: mal.slug,
          verdier,
          ...(fil ? { fil: { type: "application/pdf", data: fil.data } } : {}),
          ...(research && !friskResearch ? { research } : {}),
          ...(friskResearch ? { friskResearch: true } : {}),
          ...(retting && nyeste ? { forrige: nyeste, rettelse: retting } : {}),
        }),
        signal: styring.signal,
      });

      if (!svar.ok || !svar.body) {
        const kode = await svar
          .json()
          .then((d: { feil?: string }) => d.feil)
          .catch(() => "ukjent");
        setFeilmelding(
          kode === "mangler-nokkel"
            ? "Dokumentgeneratoren er ikke skrudd på ennå. ANTHROPIC_API_KEY mangler i Vercel."
            : kode === "ikke-innlogget"
              ? "Du er logget ut. Last siden på nytt."
              : kode === "for-lang"
                ? "Skjemaet er for langt. Kort ned de lange feltene."
                : kode === "fil-for-stor"
                  ? "Filen er for stor. Taket er 2,5 MB."
                  : kode === "ugyldig-fil"
                    ? "Filen ble ikke godtatt. Den må være en PDF."
                    : "Noe gikk galt. Prøv igjen.",
        );
        setTilstand("feil");
        return;
      }

      /*
       * NDJSON: én hendelse per linje. Den siste biten kan være en halv
       * linje, så den bæres med til neste runde i stedet for å kastes.
       */
      const leser = svar.body.getReader();
      const dekoder = new TextDecoder();
      let rest = "";
      let fikk = false;

      for (;;) {
        const { done, value } = await leser.read();
        if (done) break;
        rest += dekoder.decode(value, { stream: true });
        const linjer = rest.split("\n");
        rest = linjer.pop() ?? "";

        for (const l of linjer) {
          if (!l.trim()) continue;
          let h: {
            fase?: "research" | "skriver";
            sok?: string;
            research?: Research;
            fra?: string;
            fremdrift?: number;
            ark?: ArkData;
            feil?: string;
          };
          try {
            h = JSON.parse(l);
          } catch {
            continue;
          }
          if (h.fase) setFase(h.fase);
          if (h.sok) {
            const q = h.sok;
            setSok((s) => [...s, q]);
          }
          if (h.research) {
            setResearch(h.research);
            setFraMinne(h.fra === "hukommelse");
          }
          if (typeof h.fremdrift === "number") setGjort(h.fremdrift);
          if (h.feil) {
            setFeilmelding(h.feil);
            setTilstand("feil");
            return;
          }
          if (h.ark) {
            fikk = true;
            setUtgaver((u) => {
              setVist(u.length);
              return [...u, h.ark as ArkData];
            });
            if (retting) setRettelser((r) => [...r, retting]);
          }
        }
      }

      if (!fikk) {
        setFeilmelding("Svaret stoppet før dokumentet var ferdig. Prøv igjen.");
        setTilstand("feil");
        return;
      }
      setRettelse("");
      setTilstand("ferdig");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setTilstand(utgaver.length ? "ferdig" : "klar");
        return;
      }
      setFeilmelding("Mistet forbindelsen. Prøv igjen.");
      setTilstand("feil");
    }
  }

  const datotekst = new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${idag}T12:00:00Z`));

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
      <form
        className="flex flex-col gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          if (tilstand !== "jobber") void kjor();
        }}
      >
        {/*
          OPPLASTINGEN LIGGER FØRST, OG DEN ER IKKE ET ALTERNATIV BLANT
          LIKEVERDIGE. Den står alene til noen ber om feltene.
        */}
        {mal.opplasting && (
          <div className="flex flex-col gap-3">
            <div>
              <p className={ETIKETT}>{mal.opplasting.etikett}</p>
              <span className={HJELP}>{mal.opplasting.hjelp}</span>
            </div>

            {fil ? (
              <div className="flex items-center justify-between gap-3 rounded-flate border border-aksent bg-[color:var(--surface-accent-soft)] px-4 py-3.5">
                <span className="min-w-0 truncate text-[0.9375rem] text-blekk">
                  {fil.navn}
                </span>
                <button
                  type="button"
                  onClick={() => setFil(null)}
                  className="shrink-0 text-[0.875rem] font-medium text-aksent-tekst underline underline-offset-4"
                >
                  Fjern
                </button>
              </div>
            ) : (
              <label
                /*
                 * DRAG OG SLIPP MÅ FAKTISK VIRKE.
                 *
                 * Teksten sier «eller dra den hit». Et felt som sier det
                 * uten å ta imot et slipp, er verre enn et som ikke sier
                 * det: nettleseren åpner PDF-en i stedet, og produsenten
                 * mister siden med skjemaet på.
                 */
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrar(true);
                }}
                onDragLeave={() => setDrar(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrar(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) void lesFil(f);
                }}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-flate border border-dashed bg-kort px-5 py-9 text-center transition-colors hover:border-aksent hover:bg-[color:var(--surface-accent-soft)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-aksent motion-reduce:transition-none ${
                  drar
                    ? "border-aksent bg-[color:var(--surface-accent-soft)]"
                    : "border-kant-sterk"
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void lesFil(f);
                    /* Samme fil to ganger på rad gir ingen change uten dette. */
                    e.target.value = "";
                  }}
                />
                <span className="text-[0.9375rem] font-medium text-blekk">
                  Velg PDF
                </span>
                <span className="text-[0.8125rem] text-blekk-svak">
                  eller dra den hit
                </span>
              </label>
            )}

            {filfeil && (
              <p className="rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-varsel">
                {filfeil}
              </p>
            )}

            {!viserFelter && (
              <button
                type="button"
                onClick={() => setViserFelter(true)}
                className="self-start text-[0.9375rem] font-medium text-blekk-dempet underline underline-offset-4 transition-colors hover:text-blekk motion-reduce:transition-none"
              >
                eller fyll ut felter
              </button>
            )}

            {viserFelter && fil && (
              <p className="text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
                Feltene under gjelder foran planen der de sier noe annet. Lar du
                dem stå tomme, hentes svaret fra planen.
              </p>
            )}
          </div>
        )}

        {viserFelter &&
          mal.felt.map((f) => (
            <Feltet
              key={f.id}
              felt={f}
              verdi={verdier[f.id] ?? ""}
              sett={(v) => sett(f.id, v)}
            />
          ))}

        {mangler.length > 0 && !utgaver.length && !fil && viserFelter && (
          <p className="rounded-interaktiv border border-kant bg-dempet px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-blekk-dempet">
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
            type={tilstand === "jobber" ? "button" : "submit"}
            onClick={
              tilstand === "jobber" ? () => avbryt.current?.abort() : undefined
            }
            className="rounded-interaktiv bg-aksent px-4 py-2.5 text-[0.9375rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-[color:var(--action-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none"
          >
            {tilstand === "jobber"
              ? "Avbryt"
              : utgaver.length
                ? "Lag helt på nytt"
                : "Lag dokumentet"}
          </button>

          {urort && viserFelter && tilstand !== "jobber" && (
            <button
              type="button"
              onClick={() => setVerdier(eksempelverdier(mal))}
              className="rounded-interaktiv border border-kant px-4 py-2.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
            >
              Fyll inn eksempel
            </button>
          )}
        </div>

        {urort && viserFelter && tilstand !== "jobber" && (
          <p className="-mt-4 text-[0.8125rem] leading-relaxed text-pretty text-blekk-svak">
            Eksempelet er en ekte, komplett utfylling. Det viser hvor mye som
            hører hjemme i hvert felt, og lar deg se hva malen gjør før du
            bruker den på en kunde. Knappen forsvinner så snart du skriver selv.
          </p>
        )}

        {/*
          INSTRUKSEN LIGGER SAMMENFOLDET. Den er ikke det man kom for, men
          den er verdt å kunne se: hva Claude faktisk fikk, inkludert listen
          over felt som sto tomme.
        */}
        <details className="rounded-flate border border-kant bg-dempet">
          <summary className="cursor-pointer list-none px-4 py-3 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:text-blekk motion-reduce:transition-none">
            Se instruksen Claude får · {instruks.length.toLocaleString("nb-NO")}{" "}
            tegn
          </summary>
          <div className="border-t border-kant px-4 py-4">
            <button
              type="button"
              onClick={() => void kopier()}
              className="rounded-interaktiv border border-kant bg-kort px-3.5 py-2 text-[0.875rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
            >
              {kopiert ? "Kopiert ✓" : "Kopier instruksen"}
            </button>
            <pre className="mt-4 max-h-[24rem] overflow-auto font-sans text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-blekk-dempet">
              {instruks}
            </pre>
          </div>
        </details>
      </form>

      <div ref={resultatRef} className="flex flex-col gap-5 scroll-mt-24">
        {feilmelding && (
          <p className="rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-varsel">
            {feilmelding}
          </p>
        )}

        {tilstand === "jobber" && (
          <Arbeid
            deler={deler}
            gjort={gjort}
            rettelse={utgaver.length > 0}
            fase={fase}
            sok={sok}
          />
        )}

        {!utgaver.length && tilstand !== "jobber" && (
          <div className="rounded-flate border border-dashed border-kant px-6 py-14 text-center">
            <p className="text-[0.9375rem] text-blekk-svak">
              Fyll ut skjemaet og trykk «Lag dokumentet».
              <br />
              Ensideren dukker opp her.
            </p>
          </div>
        )}

        {naavaerende && tilstand !== "jobber" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {utgaver.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVist(i)}
                    aria-current={i === vist}
                    className={`h-8 min-w-8 rounded-interaktiv px-2 font-sans text-[0.8125rem] tabular-nums transition-colors motion-reduce:transition-none ${
                      i === vist
                        ? "bg-aksent text-[color:var(--text-on-accent)]"
                        : "border border-kant text-blekk-dempet hover:border-kant-sterk"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <span className="ml-1 text-[0.8125rem] text-blekk-svak">
                  {utgaver.length === 1
                    ? "utgave"
                    : `utgaver · viser ${vist + 1}`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => arkRef.current?.skrivUt()}
                className="rounded-interaktiv border border-kant px-4 py-2.5 text-[0.9375rem] font-medium text-blekk-dempet transition-colors hover:border-kant-sterk hover:text-blekk motion-reduce:transition-none"
              >
                Last ned dokumentet
              </button>
            </div>

            {/*
              OVERFLYT ER EN KNAPP, IKKE EN ADVARSEL.
              «Dokumentet er for langt» uten en vei ut gjør det til
              brukerens jobb å formulere seg ut av et problem vi selv har
              oppdaget presist. Vi vet hva som må skje — da kan vi be om
              det.
            */}
            {forMye && (
              <div className="flex flex-col gap-3 rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.875rem] leading-relaxed text-varsel">
                  Innholdet går ut over arket, og det nederste blir klippet.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    void kjor(
                      "Dokumentet får ikke plass på én side. Kort det ned til det som faktisk må stå der: fjern rader og punkter kunden ikke trenger før dagen, og kort ned de lengste formuleringene. Ikke fjern en hel seksjon.",
                    )
                  }
                  className="h-fit shrink-0 rounded-interaktiv border border-[color:var(--varsel-kant)] bg-kort px-3.5 py-2 text-[0.875rem] font-medium text-varsel transition-colors hover:border-varsel motion-reduce:transition-none"
                >
                  Kort ned så det får plass
                </button>
              </div>
            )}

            {research && (
              <Grunnlag
                research={research}
                fraMinne={fraMinne}
                påNyttOppslag={() => void kjor(undefined, true)}
              />
            )}

            <Arkramme
              ark={naavaerende}
              type={mal.navn}
              dato={datotekst}
              filnavn={filnavn}
              handtakRef={arkRef}
              påOverflyt={setForMye}
            />

            {/*
              SAMTALEN LIGGER UNDER ARKET, IKKE I EN SIDEPANEL.
              Man leser dokumentet, ser noe som er feil, og skriver det rett
              under det man nettopp leste. Å flytte blikket til en annen
              kolonne for å si «kort ned tidsplanen» er ett steg for mye.
            */}
            <div className="rounded-flate border border-kant bg-kort p-5">
              <label
                htmlFor="rettelse"
                className="block font-sans text-[0.8125rem] font-medium text-blekk"
              >
                Noe som skal endres?
              </label>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-blekk-svak">
                Skriv det som til en kollega. «Slå sammen de to siste radene»,
                «kort ned tidsplanen», «bytt ut Fredrik med Vivian».
              </span>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <textarea
                  id="rettelse"
                  rows={2}
                  value={rettelse}
                  onChange={(e) => setRettelse(e.target.value)}
                  onKeyDown={(e) => {
                    /* Enter sender. Skift+enter gir ny linje. */
                    if (e.key === "Enter" && !e.shiftKey && rettelse.trim()) {
                      e.preventDefault();
                      void kjor(rettelse.trim());
                    }
                  }}
                  placeholder="Kort ned tidsplanen til fem rader."
                  className={`${INPUT} mt-0 flex-1 resize-y leading-relaxed`}
                />
                <button
                  type="button"
                  disabled={!rettelse.trim()}
                  onClick={() => void kjor(rettelse.trim())}
                  className="h-fit rounded-interaktiv bg-aksent px-4 py-2.5 text-[0.9375rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-[color:var(--action-primary-hover)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                >
                  Send
                </button>
              </div>

              {rettelser.length > 0 && (
                <ol className="mt-4 flex flex-col gap-1.5 border-t border-kant pt-4">
                  {rettelser.map((r, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-blekk-svak"
                    >
                      <span className="tabular-nums text-aksent-tekst">
                        {i + 2}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
