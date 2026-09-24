import type { Mal, Skissedel } from "./maltype.ts";

/**
 * Arket — dokumentet som en STRUKTUR, ikke som en tekst.
 *
 * ── HVORFOR DETTE ERSTATTET MARKDOWN ──────────────────────────────────────
 *
 * Første utgave ba Claude om markdown og lot teksten flyte nedover siden.
 * Den skrev godt, men den skrev fire sider. En produksjonsplan er en
 * ensider — ikke fordi det er penere, men fordi den skal kunne ligge på et
 * bord på en opptaksdag og leses av noen som har det travelt.
 *
 * Markdown kan ikke si «dette er faktaraden», «dette er boksen ved siden av
 * tabellen», «dette er de tre kortene nederst». Den kan bare si overskrift,
 * avsnitt, liste. Da blir alt en spalte, og en spalte blir fire sider.
 *
 * Her ber vi i stedet om DELENE. Claude fyller ut hver del, og oppsettet
 * er vårt. Da kan ikke dokumentet bli lengre enn arket det skal ligge på.
 *
 * ── DELENE ER DE SAMME SOM I MINIATYREN ───────────────────────────────────
 *
 * `Skissedel` i maltype.ts styrte allerede hvordan miniatyren på malkortet
 * tegnes. Nå styrer den også hva Claude skal fylle ut. Kortet du trykker på
 * viser derfor formen på dokumentet du får — ikke omtrent, men nøyaktig.
 *
 * ── HVORFOR ÉN FLAT TYPE OG IKKE EN UNION ─────────────────────────────────
 *
 * Skjemaet sendes til modellen som `input_schema` på et verktøy. En union
 * («enten dette objektet eller dette») uttrykkes i JSON Schema med `anyOf`,
 * og det er den konstruksjonen språkmodeller bommer oftest på. Ett objekt
 * med `type` påkrevd og resten valgfritt treffer hver gang.
 *
 * Prisen er at typen her er løsere enn virkeligheten. Den betales i
 * `Ark.tsx`, som plukker ut det delen faktisk trenger og hopper over resten.
 */

export type Post = { etikett: string; verdi: string };
export type Boks = { tittel: string; punkter: string[] };
export type Kort = { tittel: string; tekst: string };
export type Signatar = { navn: string; rolle: string };

export type Del = {
  type: Skissedel;
  tittel?: string;
  tekst?: string;
  poster?: Post[];
  kolonner?: string[];
  rader?: string[][];
  boks?: Boks;
  spalter?: Boks[];
  kort?: Kort[];
  punkter?: string[];
  felter?: Signatar[];
};

export type Ark = {
  /** Står i det mørke feltet øverst. Kort — det er en tittel, ikke en ingress. */
  overskrift: string;
  /** Én linje under overskriften. Hvem, hvor, når. */
  undertittel: string;
  deler: Del[];
};

/**
 * TAKHØYDER, IKKE ØNSKER.
 *
 * «Hold det kort» betyr ingenting for en modell som nettopp har fått en
 * detaljert brief. Tall betyr noe. Disse er regnet bakover fra hva som
 * faktisk får plass på A4 med 10 punkts skrift, og de står både i
 * instruksen og i valideringen.
 */
export const TAK = {
  overskrift: 64,
  undertittel: 170,
  delTittel: 48,
  tekst: 600,
  poster: 4,
  postVerdi: 54,
  rader: 7,
  kolonner: 4,
  celle: 165,
  punkter: 6,
  punkt: 190,
  kort: 3,
  kortTekst: 165,
  spalter: 2,
  felter: 2,
} as const;

/**
 * Hva hver del heter mens den blir til.
 *
 * Fremdriftsvisningen sier hva Claude holder på med nå. «Del 3 av 5» sier
 * ingenting om ventetiden er verdt det; «Setter opp tidsplanen for dagen»
 * gjør det.
 */
export const ARBEIDSLINJE: Record<Skissedel, string> = {
  topp: "Skriver tittelen",
  fakta: "Samler nøkkelopplysningene",
  tabellOgBoks: "Setter opp tidsplanen og hva vi trenger",
  tabell: "Bygger tabellen",
  toKolonner: "Fordeler innholdet i to spalter",
  kort3: "Skriver de tre kortene nederst",
  avsnitt: "Formulerer avsnittet",
  liste: "Setter opp listen",
  signatur: "Legger inn signaturfeltene",
};

/** Hva hver del ER, med ord modellen kan handle på. */
const FORKLARING: Record<Skissedel, string> = {
  topp: "Ikke en egen del — overskriften og undertittelen står i feltene «overskrift» og «undertittel».",
  fakta: `En rad med ${TAK.poster} korte nøkkelopplysninger. Fyll «poster» med etikett og verdi. Verdien er en opplysning, ikke en setning: «Torsdag 8. oktober», ikke «Vi kommer torsdag 8. oktober».`,
  tabellOgBoks: `Dagens hovedtabell, med en boks ved siden av. Fyll «tittel», «kolonner» (${TAK.kolonner} maks, helst 3), «rader» (${TAK.rader} maks), og «boks» med tittel og inntil ${TAK.punkter} punkter. Boksen er det leseren skal gjøre eller stille med — ikke en oppsummering av tabellen.`,
  tabell: `En tabell. Fyll «tittel», «kolonner» (${TAK.kolonner} maks) og «rader» (${TAK.rader} maks).`,
  toKolonner: `To spalter side om side. Fyll «spalter» med nøyaktig ${TAK.spalter} objekter, hver med tittel og inntil ${TAK.punkter} punkter.`,
  kort3: `Tre korte kort på rad. Fyll «kort» med nøyaktig ${TAK.kort} objekter, hver med en kort tittel og én til to setninger.`,
  avsnitt: "Et avsnitt løpende tekst. Fyll «tittel» og «tekst».",
  liste: `En punktliste. Fyll «tittel» og «punkter» (${TAK.punkter} maks).`,
  signatur: `Signaturfelt. Fyll «felter» med ${TAK.felter} objekter: navn og rolle. Står navnet ikke i informasjonen, skriv TBD(navn).`,
};

/** Delene malen faktisk har — `topp` er ikke en del, den er hodet. */
export function deleneI(mal: Mal): Skissedel[] {
  return mal.skisse.filter((d) => d !== "topp");
}

/**
 * Verktøyskjemaet Claude fyller ut.
 *
 * `type` begrenses til malens egne deler. Da kan ikke modellen finne på en
 * seksjon som oppsettet ikke har noe sted å tegne.
 */
export function arkSkjema(mal: Mal): Record<string, unknown> {
  const typer = deleneI(mal);
  return {
    type: "object",
    properties: {
      overskrift: {
        type: "string",
        description: `Tittelen øverst. Maks ${TAK.overskrift} tegn.`,
      },
      undertittel: {
        type: "string",
        description: `Én linje under tittelen: hvem, hvor, når. Maks ${TAK.undertittel} tegn.`,
      },
      deler: {
        type: "array",
        description: `Nøyaktig ${typer.length} deler, i denne rekkefølgen: ${typer.join(", ")}.`,
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: typer },
            tittel: { type: "string" },
            tekst: { type: "string" },
            poster: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  etikett: { type: "string" },
                  verdi: { type: "string" },
                },
                required: ["etikett", "verdi"],
              },
            },
            kolonner: { type: "array", items: { type: "string" } },
            rader: {
              type: "array",
              items: { type: "array", items: { type: "string" } },
            },
            boks: {
              type: "object",
              properties: {
                tittel: { type: "string" },
                punkter: { type: "array", items: { type: "string" } },
              },
              required: ["tittel", "punkter"],
            },
            spalter: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tittel: { type: "string" },
                  punkter: { type: "array", items: { type: "string" } },
                },
                required: ["tittel", "punkter"],
              },
            },
            kort: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tittel: { type: "string" },
                  tekst: { type: "string" },
                },
                required: ["tittel", "tekst"],
              },
            },
            punkter: { type: "array", items: { type: "string" } },
            felter: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  navn: { type: "string" },
                  rolle: { type: "string" },
                },
                required: ["navn", "rolle"],
              },
            },
          },
          required: ["type"],
        },
      },
    },
    required: ["overskrift", "undertittel", "deler"],
  };
}

/** Delene beskrevet for instruksen, i malens rekkefølge. */
export function delforklaring(mal: Mal): string {
  return deleneI(mal)
    .map((d, i) => `${i + 1}. ${d} — ${FORKLARING[d]}`)
    .join("\n");
}

/**
 * Leser det Claude sendte, og kaster alt som ikke hører hjemme.
 *
 * DETTE ER IKKE PARANOIA MOT MODELLEN — det er mot oss selv. Det samme
 * arket kommer tilbake fra klienten når noen ber om en rettelse, og da er
 * det data som har vært utenfor huset. Én funksjon som gjør det trygt begge
 * veier er bedre enn to som nesten gjør det.
 */
export function lesArk(rått: unknown, mal: Mal): Ark | null {
  if (!rått || typeof rått !== "object") return null;
  const o = rått as Record<string, unknown>;

  const tekst = (v: unknown, tak: number): string =>
    typeof v === "string" ? v.trim().slice(0, tak) : "";
  const liste = <T,>(v: unknown, tak: number, kart: (x: unknown) => T | null) =>
    Array.isArray(v)
      ? v
          .slice(0, tak)
          .map(kart)
          .filter((x): x is T => x !== null)
      : undefined;

  const gyldige = new Set<string>(deleneI(mal));

  const deler = liste<Del>(o.deler, gyldige.size + 2, (r) => {
    if (!r || typeof r !== "object") return null;
    const d = r as Record<string, unknown>;
    if (typeof d.type !== "string" || !gyldige.has(d.type)) return null;

    const boks = (v: unknown): Boks | null => {
      if (!v || typeof v !== "object") return null;
      const b = v as Record<string, unknown>;
      return {
        tittel: tekst(b.tittel, TAK.delTittel),
        punkter:
          liste<string>(b.punkter, TAK.punkter, (p) =>
            typeof p === "string" && p.trim() ? p.trim().slice(0, TAK.punkt) : null,
          ) ?? [],
      };
    };

    return {
      type: d.type as Skissedel,
      tittel: tekst(d.tittel, TAK.delTittel) || undefined,
      tekst: tekst(d.tekst, TAK.tekst) || undefined,
      poster: liste<Post>(d.poster, TAK.poster, (p) => {
        if (!p || typeof p !== "object") return null;
        const q = p as Record<string, unknown>;
        return {
          etikett: tekst(q.etikett, 28),
          verdi: tekst(q.verdi, TAK.postVerdi),
        };
      }),
      kolonner: liste<string>(d.kolonner, TAK.kolonner, (k) =>
        typeof k === "string" ? k.trim().slice(0, 40) : null,
      ),
      rader: liste<string[]>(d.rader, TAK.rader, (r2) =>
        Array.isArray(r2)
          ? r2
              .slice(0, TAK.kolonner)
              .map((c) => (typeof c === "string" ? c.trim().slice(0, TAK.celle) : ""))
          : null,
      ),
      boks: boks(d.boks) ?? undefined,
      spalter: liste<Boks>(d.spalter, TAK.spalter, boks),
      kort: liste<Kort>(d.kort, TAK.kort, (k) => {
        if (!k || typeof k !== "object") return null;
        const q = k as Record<string, unknown>;
        return {
          tittel: tekst(q.tittel, TAK.delTittel),
          tekst: tekst(q.tekst, TAK.kortTekst),
        };
      }),
      punkter: liste<string>(d.punkter, TAK.punkter, (p) =>
        typeof p === "string" && p.trim() ? p.trim().slice(0, TAK.punkt) : null,
      ),
      felter: liste<Signatar>(d.felter, TAK.felter, (f) => {
        if (!f || typeof f !== "object") return null;
        const q = f as Record<string, unknown>;
        return { navn: tekst(q.navn, 48), rolle: tekst(q.rolle, 48) };
      }),
    };
  });

  const overskrift = tekst(o.overskrift, TAK.overskrift);
  if (!overskrift || !deler?.length) return null;

  return {
    overskrift,
    undertittel: tekst(o.undertittel, TAK.undertittel),
    deler,
  };
}
