import type { Mal } from "./maltype.ts";

/**
 * Researchen som kjøres FØR dokumentet skrives.
 *
 * ── HVORFOR DEN FINNES ────────────────────────────────────────────────────
 *
 * Bestilt 24.09.2026: «du skal ha som rutine å lære deg alt du kan om
 * bedriften, slik at produsenten ikke må ha masse forbehold i planen.»
 *
 * Uten dette steget visste generatoren bare det som sto i skjemaet. Den
 * kunne skrive en teknisk korrekt produksjonsplan uten å vite at kunden
 * selger til andre bedrifter og ikke til folk på gata — og en plan for en
 * B2B-leverandør ser ikke ut som en plan for en iskrembutikk. Den
 * forskjellen måtte produsenten bære alene, som forbehold i teksten.
 *
 * ── DEN ER ET ALIBI, OG DA MÅ DEN KUNNE ETTERPRØVES ───────────────────────
 *
 * Alt som hentes fra nettet vises til produsenten med kilde før dokumentet
 * lages. Det er ikke en vennlighet — det er forskjellen på et faglig
 * grunnlag og en påstand. Produsenten skal kunne se hva Claude tror, og
 * overprøve det.
 *
 * `usikkert` er like viktig som resten. En research som ikke sier hva den
 * IKKE fant, later som den vet mer enn den gjør.
 */

export type Kilde = { tittel: string; url: string };

export type Funn = {
  /** Selve funnet, som en fullstendig setning. */
  tekst: string;
  /** Hvilken av kildene under det kommer fra. Tom hvis det er en slutning. */
  kilde?: string;
};

export type Research = {
  /** Hva bedriften driver med, i to til tre setninger. */
  virksomhet: string;
  /** Selger de til folk eller til andre bedrifter? Styrer alt annet. */
  marked: "Til forbrukere" | "Til bedrifter" | "Begge deler" | "Uavklart";
  /** Avdelinger, lokasjoner, kjede eller frittstående. */
  struktur: Funn[];
  /** Eierskap, konsern, oppkjøp. Tomt hvis ingenting er funnet. */
  eierskap: Funn[];
  /** Ferskt som kan påvirke dokumentet: åpninger, kampanjer, endringer. */
  ferskt: Funn[];
  /** Hvem som kjøper, og hvordan de kjøper. */
  publikum: Funn[];
  /** Fagpraksis for DENNE dokumenttypen i DENNE bransjen. */
  fagpraksis: Funn[];
  /**
   * Virkemidler som faktisk sprer innhold i denne bransjen, avgrenset til
   * det Reflektor kan lage på én produksjonsdag med to personer.
   */
  virkemidler: Funn[];
  /** Det researchen ikke klarte å bekrefte. Skal ikke være tom av vane. */
  usikkert: string[];
  kilder: Kilde[];
  /** Når researchen ble gjort. Settes av serveren, ikke av modellen. */
  hentet: string;
};

/** Tak, av samme grunn som i arktype: tall virker, «hold det kort» gjør ikke. */
export const RTAK = {
  virksomhet: 600,
  funn: 260,
  perListe: 6,
  usikkert: 5,
  usikkertTekst: 200,
  kilder: 12,
  tittel: 140,
  url: 400,
} as const;

const MARKEDER = [
  "Til forbrukere",
  "Til bedrifter",
  "Begge deler",
  "Uavklart",
] as const;

const funnSkjema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      tekst: { type: "string" },
      kilde: {
        type: "string",
        description:
          "URL-en funnet kommer fra. Utelat hvis det er din egen slutning.",
      },
    },
    required: ["tekst"],
  },
} as const;

export const RESEARCHVERKTOY = "lever_research";

export function researchSkjema(): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      virksomhet: {
        type: "string",
        description: `Hva bedriften driver med, i to til tre setninger. Maks ${RTAK.virksomhet} tegn.`,
      },
      marked: {
        type: "string",
        enum: MARKEDER,
        description:
          "Selger de til forbrukere eller til andre bedrifter? Dette styrer hvordan dokumentet skal se ut. Velg «Uavklart» hvis du ikke fant noe som avgjør det.",
      },
      struktur: {
        ...funnSkjema,
        description:
          "Avdelinger, lokasjoner, kjede eller frittstående, antall ansatte.",
      },
      eierskap: {
        ...funnSkjema,
        description:
          "Eierstruktur, konserntilhørighet, oppkjøp. Tom liste hvis du ikke fant noe.",
      },
      ferskt: {
        ...funnSkjema,
        description:
          "Hendelser siste tolv måneder som kan påvirke dokumentet: nye avdelinger, kampanjer, lederskifte, omtale.",
      },
      publikum: {
        ...funnSkjema,
        description: "Hvem som kjøper av dem, og hvordan de kjøper.",
      },
      fagpraksis: {
        ...funnSkjema,
        description:
          "Hva som er god praksis for akkurat denne dokumenttypen, for akkurat denne typen virksomhet. Ikke generelle råd om innholdsproduksjon.",
      },
      virkemidler: {
        ...funnSkjema,
        description:
          "Konkrete virkemidler som sprer innhold i denne bransjen, og som Reflektor kan lage på én produksjonsdag med to personer. Hvert punkt skal si HVA man gjør, ikke at man bør engasjere.",
      },
      usikkert: {
        type: "array",
        items: { type: "string" },
        description: `Det du IKKE klarte å bekrefte. Maks ${RTAK.usikkert} punkter. Skal ikke være tom av vane.`,
      },
      kilder: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tittel: { type: "string" },
            url: { type: "string" },
          },
          required: ["tittel", "url"],
        },
      },
    },
    required: ["virksomhet", "marked", "usikkert", "kilder"],
  };
}

/**
 * Oppdraget researchfasen får.
 *
 * ── HVORFOR DEN BLE SNUDD 24.09.2026 ──────────────────────────────────────
 *
 * Bestilt: «en produksjonsplan skal tross alt bestemme hva som skal filmes.
 * bruk mindre tid på nettet, og gjør kall i supermetrics for å få oversikt
 * over hva som faktisk publiseres av kunden, konkurrenter og kartlegg
 * virale virkemidler i relasjon til hva som er fordelaktig og
 * gjennomførbart for reflektor.»
 *
 * Første utgave brukte seks søk på å finne ut hvem bedriften var. Det ga en
 * pen oppsummering av «om oss»-siden deres, og null hjelp til spørsmålet
 * dokumentet faktisk skal svare på: hva skal kamera peke på den dagen.
 *
 * Nå er rekkefølgen motsatt. Publiseringstallene ligger øverst i instruksen
 * og er målte. Nettsøket er redusert til det ene spørsmålet tallene ikke kan
 * svare på — selger de til folk eller til andre bedrifter — pluss det som er
 * ferskt. Alt annet skal leses ut av det som faktisk er publisert.
 */
export function researchInstruks(
  mal: Mal,
  kunde: string,
  lokasjon: string,
  /** Målte publiseringstall. Tom streng når vi ikke har dem. */
  publisering = "",
  /** SoMe-strategien i Canva, hvis produsenten har oppgitt lenken. */
  strategi = "",
): string {
  return [
    `Du undersøker en kunde for Reflektor AS, et norsk byrå som lager foto og video til sosiale medier. En produsent skal straks lage dokumentet «${mal.navn}» for denne kunden, og du skal gi hen grunnlaget.`,
    "",
    `KUNDEN\n- Navn: ${kunde}${lokasjon ? `\n- Sted eller avdeling: ${lokasjon}` : ""}`,
    "",
    publisering ? `${publisering}\n` : "",
    strategi
      ? `KUNDENS SOME-STRATEGI\nProdusenten har oppgitt at strategien ligger her: ${strategi}\nDu kan ikke åpne den. Nevn den under «usikkert» som noe produsenten bør lese mot dette grunnlaget, og ikke gjett hva som står i den.\n`
      : "",
    [
      "SLIK PRIORITERER DU",
      publisering
        ? "Publiseringstallene over er MÅLT. De er det eneste grunnlaget ditt som ikke er noens egen påstand, og de skal bære det meste av svaret ditt. Les dem før du søker."
        : "Vi har ingen publiseringstall for denne kunden. Da må nettsøket bære mer enn det pleier, men det er fortsatt ikke et bedriftsportrett du skal skrive.",
      "Søk sparsomt. Du har tre søk, og de skal brukes på det tallene IKKE kan svare på: om de selger til forbrukere eller til bedrifter, og om noe ferskt er på gang. Ikke bruk et søk på å bekrefte noe du allerede kan se.",
      "Du skriver ikke en presentasjon av bedriften. Du svarer på ett spørsmål: hva skal vi lage for dem, og hvorfor akkurat det.",
    ].join("\n"),
    "",
    [
      "DETTE SKAL DU FINNE UT",
      "1. Om de selger til forbrukere eller til andre bedrifter. Dette er det viktigste enkeltfunnet: en plan for en leverandør som selger til kjøkkensjefer, ser ikke ut som en plan for en iskrembutikk. Tonen, hvem som skal på film, og hva som skal filmes, er forskjellig.",
      "2. Hva de faktisk publiserer, og hva som går. Hvilket format, hvor ofte, hvilke motiver. Er det stor forskjell på formatene, si det med tallene.",
      "3. Hva konkurrentene gjør som kunden ikke gjør, og motsatt. Et hull er en anbefaling.",
      "4. Virkemidler som sprer innhold i denne bransjen, OG som vi kan lage. Se rammene under — dette er det punktet det er lettest å bomme på.",
      "5. Ferskt siste tolv måneder som kan påvirke dokumentet: nye avdelinger, kampanjer, sesong.",
      "6. Struktur og eierskap, men bare der det endrer hva som filmes. Én butikk eller femten er relevant. Organisasjonsnummeret er det ikke.",
    ].join("\n"),
    "",
    /*
     * ── RAMMENE ER EKTE, OG DE MÅ STÅ ─────────────────────────────────────
     *
     * Uten dem foreslår modellen ukelange serier, daglig publisering og
     * konsepter som krever et filmteam. Alt sammen «riktig» og ingenting av
     * det gjennomførbart. Rammene under er hvordan Reflektor faktisk
     * jobber, og de er hentet fra malverket — ikke funnet på her.
     */
    [
      "SLIK JOBBER REFLEKTOR. ET VIRKEMIDDEL VI IKKE KAN LAGE, ER IKKE ET FUNN",
      "- Én produksjonsdag hos kunden. To personer med alt utstyr.",
      "- Dagen gir 8–10 leveranser, laget i tre til fem oppsett på stedet.",
      "- Materialet publiseres over en måned, som regel to ganger i uken.",
      "- Vi filmer det som finnes der: lokalet, folkene som jobber der, produktene deres.",
      "- Vi har ikke skuespillere, studio, flere opptaksdager eller noen som publiserer for kunden fra dag til dag.",
      "Et virkemiddel som krever at noen filmer seg selv hver dag, at vi følger en trend samme uke den oppstår, eller at det lages tretti klipp i måneden, er ikke gjennomførbart. Skriv det da ikke — eller skriv hvordan det kan gjøres om til noe som lar seg filme på én dag.",
    ].join("\n"),
    "",
    [
      "REGLER",
      "Hvert funn fra nettet skal ha en kilde. Finner du det ikke, er det ikke et funn — da hører det hjemme under «usikkert».",
      "Slutninger fra publiseringstallene trenger ikke kilde. Tallene ER kilden, og de står i instruksen. Si hvilket tall du bygger på: «reels har median 8 400 visninger mot 260 likes på bilder» er en slutning, «video funker best» er en gjetning.",
      "Ikke gjett org.nr., omsetning, antall ansatte eller eierforhold. Slike tall er verdiløse hvis de er feil, og de blir stående i et dokument som går til kunden.",
      "Er du i tvil om du har funnet RIKTIG bedrift — mange norske navn går igjen — skriv det under «usikkert» i stedet for å bygge videre på det.",
      "«usikkert» skal ha innhold. En research som ikke sier hva den ikke fant, later som den vet mer enn den gjør.",
      "Virkemidler skal være konkrete nok til å filmes. «Vis menneskene bak» er ikke et virkemiddel. «Kokken lager rettens vanskeligste steg i ett tak, uten klipp» er det.",
      "Skriv på norsk, i fullstendige setninger.",
    ].join("\n"),
    "",
    `SLIK BRUKES DETTE\nProdusenten ser researchen din med kilder før dokumentet lages, og kan overprøve den. Dokumentet «${mal.navn}» skal deretter bygges på den. Skriv derfor det som faktisk endrer hva vi lager, ikke alt du fant.`,
    "",
    `Kall ${RESEARCHVERKTOY} når du er ferdig.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Leser svaret og kapper alt som er for langt. Samme rolle som `lesArk`. */
export function lesResearch(rått: unknown): Omit<Research, "hentet"> | null {
  if (!rått || typeof rått !== "object") return null;
  const o = rått as Record<string, unknown>;

  const tekst = (v: unknown, tak: number) =>
    typeof v === "string" ? v.trim().slice(0, tak) : "";

  const funn = (v: unknown): Funn[] =>
    Array.isArray(v)
      ? v
          .slice(0, RTAK.perListe)
          .map((f) => {
            if (!f || typeof f !== "object") return null;
            const q = f as Record<string, unknown>;
            const t = tekst(q.tekst, RTAK.funn);
            if (!t) return null;
            const k = tekst(q.kilde, RTAK.url);
            return { tekst: t, ...(k ? { kilde: k } : {}) };
          })
          .filter((f): f is Funn => f !== null)
      : [];

  const virksomhet = tekst(o.virksomhet, RTAK.virksomhet);
  if (!virksomhet) return null;

  const marked = MARKEDER.includes(o.marked as (typeof MARKEDER)[number])
    ? (o.marked as Research["marked"])
    : "Uavklart";

  return {
    virksomhet,
    marked,
    struktur: funn(o.struktur),
    eierskap: funn(o.eierskap),
    ferskt: funn(o.ferskt),
    publikum: funn(o.publikum),
    fagpraksis: funn(o.fagpraksis),
    virkemidler: funn(o.virkemidler),
    usikkert: Array.isArray(o.usikkert)
      ? o.usikkert
          .slice(0, RTAK.usikkert)
          .map((u) => tekst(u, RTAK.usikkertTekst))
          .filter(Boolean)
      : [],
    kilder: Array.isArray(o.kilder)
      ? o.kilder
          .slice(0, RTAK.kilder)
          .map((k) => {
            if (!k || typeof k !== "object") return null;
            const q = k as Record<string, unknown>;
            const url = tekst(q.url, RTAK.url);
            /* Bare http(s). En `javascript:`-lenke i et kildekort er en åpen dør. */
            if (!/^https?:\/\//i.test(url)) return null;
            return { tittel: tekst(q.tittel, RTAK.tittel) || url, url };
          })
          .filter((k): k is Kilde => k !== null)
      : [],
  };
}

/** Researchen slik dokumentinstruksen ser den. */
export function researchTilTekst(r: Research): string {
  const liste = (navn: string, f: Funn[]) =>
    f.length ? `${navn}\n${f.map((x) => `- ${x.tekst}`).join("\n")}` : "";

  return [
    "DETTE VET VI OM KUNDEN",
    "Dette er undersøkt på nettet rett før du skrev dette dokumentet, og produsenten har sett det. Bruk det til å treffe riktig: en plan for en bedrift som selger til andre bedrifter ser ikke ut som en plan for en butikk.",
    "",
    `Virksomhet: ${r.virksomhet}`,
    `Marked: ${r.marked}`,
    liste("Struktur:", r.struktur),
    liste("Eierskap:", r.eierskap),
    liste("Ferskt:", r.ferskt),
    liste("Publikum:", r.publikum),
    liste("Fagpraksis for dette dokumentet:", r.fagpraksis),
    liste("Virkemidler som er gjennomførbare for oss:", r.virkemidler),
    r.usikkert.length
      ? `Ikke bekreftet:\n${r.usikkert.map((u) => `- ${u}`).join("\n")}`
      : "",
    "",
    "DETTE ER BAKGRUNN, IKKE INNHOLD. Det skal forme valgene dine — hva som filmes, hvem som er med, hvordan det formuleres. Det skal IKKE skrives inn i dokumentet som opplysninger om kunden. Kunden vet hvem de er, og et dokument som forteller dem det, ser ut som en mal med navnet deres limt inn.",
    "Er noe i researchen i strid med det produsenten har fylt ut, gjelder produsenten.",
  ]
    .filter(Boolean)
    .join("\n");
}
