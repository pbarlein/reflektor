/**
 * Hva kunden og konkurrentene faktisk publiserer.
 *
 * ── HVORFOR DETTE ER VIKTIGERE ENN NETTSØK ────────────────────────────────
 *
 * Bestilt 24.09.2026: «en produksjonsplan skal tross alt bestemme hva som
 * skal filmes. bruk mindre tid på nettet, og gjør kall i supermetrics for å
 * få oversikt over hva som faktisk publiseres av kunden, konkurrenter og
 * kartlegg virale virkemidler.»
 *
 * Nettsøk forteller hva en bedrift SIER om seg selv. Det er nyttig én gang —
 * selger de til folk eller til andre bedrifter — og temmelig verdiløst etter
 * det. En produksjonsplan skal avgjøre hva kamera peker på, og til det
 * finnes det bare én relevant kilde: hva som faktisk er publisert, og hva
 * som gikk.
 *
 * Tallene her er MÅLT. De er det eneste i hele grunnlaget som ikke er en
 * påstand, og de er derfor det eneste modellen har lov til å trekke en
 * slutning av uten kilde.
 *
 * ── HVORFOR MEDIAN OG IKKE SNITT ──────────────────────────────────────────
 *
 * Én reel som traff algoritmen med 240 000 visninger drar et snitt over alt
 * annet, og da konkluderer modellen med at «video funker» for en konto der
 * nitten av tjue videoer gikk under tusen. Medianen sier hva et VANLIG
 * innlegg gjør, og det er det en produksjonsdag skal planlegges mot.
 *
 * ── HVORFOR DEN ER SLÅTT AV UTEN NØKKEL ───────────────────────────────────
 *
 * Reflektors Supermetrics-abonnement er en Claude-kobling, ikke API-
 * produktet. Uten `SUPERMETRICS_API_KEY` er hele modulen mørk, og
 * researchen kjører som før. Det er samme mønster som ANTHROPIC_API_KEY og
 * blob-lagringen: en manglende nøkkel skal aldri gi en feilmelding til en
 * produsent som bare skulle lage en plan.
 */

/** Instagram Public Data. Virker på enhver offentlig Business-/Creator-konto. */
const KILDE = "IGPD2";
const ENDEPUNKT = "https://api.supermetrics.com/enterprise/v2/query/data/json";

/** Ett år. Kortere vindu gir for få innlegg til at medianen betyr noe. */
const DAGER = 365;
/** Kunden pluss konkurrenter. Flere enn dette og oppslaget tar for lang tid. */
export const MAKS_KONTOER = 4;
const MAKS_RADER = 200;
/** Toppinnlegg vi tar med per konto. Nok til å se et mønster, ikke en liste. */
const TOPP = 5;
const MAKS_BILDETEKST = 180;
/**
 * Hele oppslaget. Det er et gode, ikke en forutsetning — går det tregt, er
 * en plan uten publiseringsdata bedre enn en plan som aldri kom.
 */
const TIDSGRENSE_MS = 25_000;

export type Format = "Video" | "Karusell" | "Bilde";

export type Formattall = {
  format: Format;
  /** Antall innlegg av dette formatet i vinduet. */
  antall: number;
  /** Median visninger. Bare reels rapporterer dette. */
  visninger: number | null;
  medianLikes: number;
  medianKommentarer: number;
};

export type Toppinnlegg = {
  format: Format;
  dato: string;
  visninger: number | null;
  likes: number;
  /** Bildeteksten, kappet. Det er den som sier hva innlegget HANDLET om. */
  tekst: string;
  lenke: string;
};

export type Konto = {
  brukernavn: string;
  /** Er dette kunden selv, eller en konkurrent vi sammenligner med? */
  rolle: "Kunden" | "Konkurrent";
  /** Innlegg totalt i vinduet. */
  innlegg: number;
  /** Omtrent hvor ofte de publiserer, i innlegg per måned. */
  perManed: number;
  fordeling: Formattall[];
  topp: Toppinnlegg[];
};

export type Publisering = {
  kontoer: Konto[];
  /** Kontoer vi ba om, men ikke fikk. Skal vises — et hull er ikke et null. */
  mislyktes: string[];
  fra: string;
  til: string;
};

export function harSupermetrics(): boolean {
  return Boolean(process.env.SUPERMETRICS_API_KEY);
}

/*
 * ── FELTENE ER I DENNE REKKEFØLGEN, OG DET ER MED VILJE ───────────────────
 *
 * Med `no_headers` kommer radene som rene lister i nøyaktig denne
 * rekkefølgen. Da slipper vi å gjette hva en kolonne heter. Skulle API-et
 * likevel sende en hoderad, oppdages den i `lesRader` og hoppes over.
 */
const FELTER = [
  "post_timestamp",
  "post_type",
  "post_caption",
  "post_permalink",
  "post_likes",
  "post_comments",
  "post_views",
] as const;

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function median(tall: number[]): number {
  if (!tall.length) return 0;
  const s = [...tall].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function tallAv(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Instagram-ordene, oversatt. Ukjente formater regnes som bilde. */
function formatAv(rå: unknown): Format {
  const s = String(rå ?? "").toUpperCase();
  if (s.includes("VIDEO") || s.includes("REEL")) return "Video";
  if (s.includes("CAROUSEL")) return "Karusell";
  return "Bilde";
}

/**
 * «@jordbaerpikene», «instagram.com/jordbaerpikene/» og hele URL-en er
 * samme konto.
 *
 * Skjemaet ber om et brukernavn, men folk limer inn det de har i
 * utklippstavlen. Protokollen er valgfri i mønsteret: uten den ble
 * «instagram.com/jordbaerpikene» kappet ved første skråstrek og slått opp
 * som kontoen «instagram.com».
 */
export function rensBrukernavn(rå: string): string {
  return rå
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "")
    .trim()
    .slice(0, 60);
}

export type Rad = {
  dato: string;
  format: Format;
  tekst: string;
  lenke: string;
  likes: number;
  kommentarer: number;
  visninger: number | null;
};

/**
 * Gjør svaret om til rader.
 *
 * Eksportert fordi den testes direkte. Den er det eneste stedet i huset som
 * tolker et API-svar vi ikke har sett med egne øyne — kontrakten er lest i
 * dokumentasjonen, ikke verifisert mot en nøkkel — og da må formtoleransen
 * kunne prøves uten å ringe noen.
 *
 * Tar imot både lister og objekter, og hopper over en eventuell hoderad.
 * API-svar er ikke en kontrakt vi kontrollerer, og et oppslag som krasjer
 * på en uventet form, tar hele dokumentet med seg.
 */
export function lesRader(rått: unknown): Rad[] {
  const data =
    rått && typeof rått === "object"
      ? ((rått as Record<string, unknown>).data ?? rått)
      : null;
  if (!Array.isArray(data)) return [];

  const rader: Rad[] = [];
  for (const r of data) {
    const hent = (i: number, navn: string): unknown =>
      Array.isArray(r)
        ? r[i]
        : r && typeof r === "object"
          ? (r as Record<string, unknown>)[navn]
          : undefined;

    const dato = String(hent(0, "post_timestamp") ?? "").slice(0, 10);
    /* Hoderaden har feltnavnet i datokolonnen. Den er ikke et innlegg. */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dato)) continue;

    rader.push({
      dato,
      format: formatAv(hent(1, "post_type")),
      tekst: String(hent(2, "post_caption") ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAKS_BILDETEKST),
      lenke: String(hent(3, "post_permalink") ?? "").slice(0, 300),
      likes: tallAv(hent(4, "post_likes")) ?? 0,
      kommentarer: tallAv(hent(5, "post_comments")) ?? 0,
      visninger: tallAv(hent(6, "post_views")),
    });
  }
  return rader;
}

export function sammenstill(
  brukernavn: string,
  rolle: Konto["rolle"],
  rader: Rad[],
): Konto {
  const fordeling: Formattall[] = (["Video", "Karusell", "Bilde"] as const)
    .map((format) => {
      const av = rader.filter((r) => r.format === format);
      const visninger = av
        .map((r) => r.visninger)
        .filter((v): v is number => v !== null);
      return {
        format,
        antall: av.length,
        visninger: visninger.length ? median(visninger) : null,
        medianLikes: median(av.map((r) => r.likes)),
        medianKommentarer: median(av.map((r) => r.kommentarer)),
      };
    })
    .filter((f) => f.antall > 0);

  /*
   * Rangeres på visninger der de finnes, ellers på likes. En reel og et
   * bilde måles ikke i samme enhet, og å late som de gjør det ville satt
   * alle reels øverst uansett hvordan de gikk.
   */
  const topp = [...rader]
    .sort((a, b) => (b.visninger ?? b.likes) - (a.visninger ?? a.likes))
    .slice(0, TOPP)
    .map((r) => ({
      format: r.format,
      dato: r.dato,
      visninger: r.visninger,
      likes: r.likes,
      tekst: r.tekst,
      lenke: r.lenke,
    }));

  return {
    brukernavn,
    rolle,
    innlegg: rader.length,
    perManed: Math.round((rader.length / (DAGER / 30.4)) * 10) / 10,
    fordeling,
    topp,
  };
}

async function hentKonto(
  brukernavn: string,
  fra: string,
  til: string,
  nokkel: string,
  signal: AbortSignal,
): Promise<Rad[] | null> {
  const svar = await fetch(ENDEPUNKT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${nokkel}`,
    },
    body: JSON.stringify({
      ds_id: KILDE,
      ds_accounts: brukernavn,
      /*
       * Fast vindu framfor `last_x_days`. Et relativt vindu tolkes i en
       * tidssone vi ikke har satt, og et oppslag som stille flytter seg en
       * dag, er vanskeligere å feilsøke enn to datoer vi har regnet ut selv.
       */
      date_range_type: "custom",
      start_date: fra,
      end_date: til,
      fields: FELTER.join(","),
      max_rows: MAKS_RADER,
      settings: {
        report_type: "BusinessDiscoveryMedia",
        no_headers: true,
      },
    }),
    signal,
  });

  /*
   * En konto som ikke finnes, er ikke en feil i systemet — det er en
   * skrivefeil eller en privat konto, og det skal vises til produsenten
   * som nettopp det.
   */
  if (!svar.ok) return null;
  const rader = lesRader(await svar.json());
  return rader.length ? rader : null;
}

/**
 * Slår opp kunden og konkurrentene.
 *
 * Returnerer null når det ikke finnes nøkkel, ingen kontoer er oppgitt,
 * eller ingen av dem kunne hentes. Kaster aldri.
 */
export async function hentPublisering({
  kunde,
  konkurrenter,
  signal,
}: {
  /** Kundens Instagram-brukernavn. Tom streng hvis det ikke er oppgitt. */
  kunde: string;
  konkurrenter: readonly string[];
  signal?: AbortSignal;
}): Promise<Publisering | null> {
  const nokkel = process.env.SUPERMETRICS_API_KEY;
  if (!nokkel) return null;

  const onsket: { brukernavn: string; rolle: Konto["rolle"] }[] = [];
  const sett = new Set<string>();
  for (const [rå, rolle] of [
    [kunde, "Kunden" as const],
    ...konkurrenter.map((k) => [k, "Konkurrent" as const] as const),
  ] as const) {
    const b = rensBrukernavn(rå);
    if (!b || sett.has(b.toLowerCase())) continue;
    sett.add(b.toLowerCase());
    onsket.push({ brukernavn: b, rolle });
  }
  if (!onsket.length) return null;

  const nå = new Date();
  const til = iso(nå);
  const fra = iso(new Date(nå.getTime() - DAGER * 86_400_000));

  const klokke = new AbortController();
  const frist = setTimeout(() => klokke.abort(), TIDSGRENSE_MS);
  signal?.addEventListener("abort", () => klokke.abort(), { once: true });

  try {
    /* Kontoene er uavhengige av hverandre og hentes samtidig. */
    const svar = await Promise.all(
      onsket.slice(0, MAKS_KONTOER).map(async (o) => {
        try {
          const rader = await hentKonto(
            o.brukernavn,
            fra,
            til,
            nokkel,
            klokke.signal,
          );
          return rader ? sammenstill(o.brukernavn, o.rolle, rader) : o;
        } catch {
          return o;
        }
      }),
    );

    const kontoer = svar.filter((s): s is Konto => "innlegg" in s);
    const mislyktes = svar
      .filter((s) => !("innlegg" in s))
      .map((s) => s.brukernavn);

    if (!kontoer.length) return null;
    return { kontoer, mislyktes, fra, til };
  } catch (e) {
    if (signal?.aborted) throw e;
    console.error("publiseringsdata feilet, researchen kjører uten", e);
    return null;
  } finally {
    clearTimeout(frist);
  }
}

/**
 * Publiseringsdataene slik en instruks ser dem.
 *
 * `tilDokument` sier hvem som leser. Researchen skal bygge på tallene;
 * dokumentet skal som hovedregel ikke gjengi dem. Unntaket er
 * månedsrapporten, der tall er hele poenget — og den ber om dem i
 * strukturen sin, så regelen under treffer riktig uten å vite hvilken mal
 * den er i.
 */
export function publiseringTilTekst(
  p: Publisering,
  tilDokument = false,
): string {
  const konto = (k: Konto) => {
    const fordeling = k.fordeling
      .map(
        (f) =>
          `  - ${f.format}: ${f.antall} innlegg, median ${f.medianLikes} likes og ${f.medianKommentarer} kommentarer${
            f.visninger !== null ? `, median ${f.visninger} visninger` : ""
          }`,
      )
      .join("\n");
    const topp = k.topp
      .map(
        (t) =>
          `  - ${t.dato}, ${t.format}, ${
            t.visninger !== null
              ? `${t.visninger} visninger`
              : `${t.likes} likes`
          }: «${t.tekst || "uten bildetekst"}»`,
      )
      .join("\n");
    return [
      `${k.rolle}: @${k.brukernavn} — ${k.innlegg} innlegg, omtrent ${k.perManed} i måneden`,
      fordeling && `Fordeling og hvordan de gikk:\n${fordeling}`,
      topp && `Innleggene som gikk best:\n${topp}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  return [
    "DETTE ER FAKTISK PUBLISERT",
    `Målte tall fra Instagram for perioden ${p.fra} til ${p.til}. Dette er det eneste i grunnlaget ditt som ikke er en påstand — alt annet er noen som har sagt noe om seg selv.`,
    "",
    p.kontoer.map(konto).join("\n\n"),
    p.mislyktes.length
      ? `\nIkke hentet: ${p.mislyktes.map((m) => `@${m}`).join(", ")}. Kontoen finnes ikke, er privat, eller er ikke en Business-/Creator-konto. Du vet altså ingenting om disse — ikke slutt noe av at de mangler.`
      : "",
    "",
    "MEDIANEN ER TALLET SOM BETYR NOE. Ett innlegg som traff algoritmen sier ingenting om hva en produksjonsdag skal lage. Medianen sier hva et vanlig innlegg gjør.",
    tilDokument
      ? [
          "",
          "DETTE ER BAKGRUNN. Tallene skal forme hva dokumentet foreslår — hvilket format, hvor mange klipp, hvilke motiver — og de skal bare SKRIVES INN i dokumentet hvis en av delene du skal fylle ut uttrykkelig ber om tall. I alle andre dokumenter er en Instagram-statistikk noe kunden ikke har bedt om.",
          "Skriver du et tall herfra, skriv det nøyaktig som det står. Ikke rund av, ikke regn om, og ikke legg til et tall som ikke står her.",
          "Har produsenten fylt ut et felt som sier noe annet enn tallene, gjelder produsenten.",
        ].join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
