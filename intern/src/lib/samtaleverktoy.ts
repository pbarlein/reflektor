import type Anthropic from "@anthropic-ai/sdk";

/**
 * Det Claude kan GJØRE i en rapportsamtale, ikke bare svare på.
 *
 * ── HVA SOM ER INNENFOR OG HVA SOM IKKE ER DET ────────────────────────────
 *
 * Bestilt 08.10.2026: en samtaleboks under stegene der man kan gi
 * kommandoer — «du gjennomfører merking i HubSpot basert på følgende».
 *
 * Verktøyene her gjør alt som ligger INNE i intranettet: krysse av steg,
 * svare på beslutningen, skrive notat, slå opp tidligere uker. Det er
 * handlinger på data vi selv eier, de er alle reversible, og de vises i
 * samtalen idet de skjer.
 *
 * HUBSPOT ER IKKE HER, og det er ikke en forglemmelse. Intranettet har
 * ingen HubSpot-kobling — HubSpot finnes bare som tall den planlagte
 * oppgaven har skrevet inn i rapporten. Å skrive til kundebasen krever en
 * token med skrivetilgang og et eget sett verktøy. Se `samtale/route.ts`
 * for hva systeminstruksen sier til Claude om det: den skal produsere en
 * presis handlingsliste i stedet for å late som den har utført noe.
 *
 * ── HVORFOR AVHENGIGHETENE SENDES INN ─────────────────────────────────────
 *
 * `rapportlager.ts` åpner Blob-butikken ved import. En test som vil vite om
 * «kryss av steg tre» treffer steg tre, skal ikke trenge en sky-token.
 * Samme grep som `rapportflytt.ts`.
 */

export type Verktoyresultat = {
  /** Til modellen. Kort — den skal kunne handle videre på det. */
  tekst: string;
  /** Til skjermen, i fortid. Tom når handlingen ikke endret noe. */
  gjort?: string;
  feil?: boolean;
};

/** Det verktøyene trenger utenfra. Injiseres, se kommentaren over. */
export type Verktoykontekst = {
  type: string;
  id: string;
  /** Stegene i rapporten, til oppslag på tittel og til grensesjekk. */
  steg: readonly { title: string }[];
  sporsmal: string | null;
  settSteg: (indeks: number, gjort: boolean) => Promise<boolean>;
  svarPaaBeslutning: (
    svar: "ja" | "nei" | "senere",
    kommentar: string,
  ) => Promise<boolean>;
  skrivNotat: (tekst: string) => Promise<boolean>;
  tidligereUker: (antall: number) => Promise<string>;
};

export const VERKTOY: Anthropic.Tool[] = [
  {
    name: "kryss_av_steg",
    description:
      "Krysser av eller av-krysser ett av stegene i denne ukens rapport. " +
      "Bruk det når brukeren sier at noe er gjort, eller ber deg merke det " +
      "som gjort. Avkryssingen er den samme som boksene på skjermen, og den " +
      "styrer purringen på forfalte steg.",
    input_schema: {
      type: "object",
      properties: {
        indeks: {
          type: "integer",
          description:
            "Stegets nummer, fra 0. Steg 1 på skjermen er indeks 0. Er du " +
            "i tvil om hvilket steg brukeren mener, spør i stedet for å gjette.",
        },
        gjort: {
          type: "boolean",
          description: "true krysser av, false fjerner avkryssingen.",
        },
      },
      required: ["indeks", "gjort"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "svar_paa_beslutning",
    description:
      "Registrerer svaret på ukens beslutning. Bruk det BARE når brukeren " +
      "selv har sagt hva svaret er. Du skal aldri bestemme på hans vegne — " +
      "anbefal gjerne, men registrer bare det han har sagt.",
    input_schema: {
      type: "object",
      properties: {
        svar: { type: "string", enum: ["ja", "nei", "senere"] },
        kommentar: {
          type: "string",
          description:
            "Begrunnelsen med brukerens egne ord, eller tom streng. Ikke dikt opp en begrunnelse.",
        },
      },
      required: ["svar", "kommentar"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "skriv_notat",
    description:
      "Legger et notat på rapporten. Notatene følger rapporten og er med i " +
      "nedlastingen. Bruk det til å feste en beslutning, en observasjon " +
      "eller en handlingsliste brukeren skal ha tilbake senere.",
    input_schema: {
      type: "object",
      properties: {
        tekst: { type: "string", description: "Notatet. Kort og konkret." },
      },
      required: ["tekst"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "hent_tidligere_uker",
    description:
      "Henter tidligere ukers rapporter med tall, steg og svar. Bruk det " +
      "når spørsmålet handler om utvikling over tid, om noe er prøvd før, " +
      "eller om hva som faktisk ble gjort en tidligere uke. Denne ukens " +
      "rapport har du allerede.",
    input_schema: {
      type: "object",
      properties: {
        antall: {
          type: "integer",
          description: "Hvor mange uker bakover, 1–8.",
        },
      },
      required: ["antall"],
      additionalProperties: false,
    },
    strict: true,
  },
];

export const VERKTOYNAVN: readonly string[] = VERKTOY.map((v) => v.name);

/** Maks uker `hent_tidligere_uker` henter. Hver uke er et eget Blob-kall. */
const MAKS_UKER = 8;

function somTall(v: unknown): number | null {
  return typeof v === "number" && Number.isInteger(v) ? v : null;
}

/**
 * Kjører ett verktøykall.
 *
 * ── DEN ALDRI KASTER ──────────────────────────────────────────────────────
 *
 * Et verktøy som kaster, river samtalen ned midt i en strøm, og brukeren
 * sitter igjen med halv tekst og ingen beskjed. Alt som går galt kommer
 * tilbake som et resultat med `feil: true`, og modellen får vite hva som
 * skjedde — da kan den rette seg selv eller si fra.
 */
export async function kjorVerktoy(
  navn: string,
  inn: unknown,
  k: Verktoykontekst,
): Promise<Verktoyresultat> {
  const a = (inn ?? {}) as Record<string, unknown>;

  try {
    if (navn === "kryss_av_steg") {
      const i = somTall(a.indeks);
      if (i === null || i < 0 || i >= k.steg.length) {
        return {
          feil: true,
          tekst:
            `Det finnes ikke noe steg ${String(a.indeks)}. Rapporten har ` +
            `${k.steg.length} steg, med indeks 0 til ${k.steg.length - 1}: ` +
            k.steg.map((s, n) => `${n}: ${s.title}`).join(" | "),
        };
      }
      const gjort = a.gjort === true;
      if (!(await k.settSteg(i, gjort))) {
        return {
          feil: true,
          tekst: "Kunne ikke lagre. Rapporten ble ikke funnet.",
        };
      }
      const tittel = k.steg[i].title;
      return {
        tekst: gjort
          ? `Steg ${i + 1} er krysset av.`
          : `Avkryssingen på steg ${i + 1} er fjernet.`,
        gjort: gjort
          ? `Krysset av: ${tittel}`
          : `Fjernet avkryssingen: ${tittel}`,
      };
    }

    if (navn === "svar_paa_beslutning") {
      if (!k.sporsmal) {
        return {
          feil: true,
          tekst: "Denne uka har ingen beslutning å svare på.",
        };
      }
      const svar = a.svar;
      if (svar !== "ja" && svar !== "nei" && svar !== "senere") {
        return { feil: true, tekst: "Svaret må være ja, nei eller senere." };
      }
      const kommentar = typeof a.kommentar === "string" ? a.kommentar : "";
      if (!(await k.svarPaaBeslutning(svar, kommentar))) {
        return {
          feil: true,
          tekst: "Kunne ikke lagre. Rapporten ble ikke funnet.",
        };
      }
      return {
        tekst: `Svaret «${svar}» er registrert.`,
        gjort: `Svarte «${svar}» på beslutningen`,
      };
    }

    if (navn === "skriv_notat") {
      const tekst = typeof a.tekst === "string" ? a.tekst.trim() : "";
      if (!tekst) return { feil: true, tekst: "Notatet var tomt." };
      if (!(await k.skrivNotat(tekst))) {
        return {
          feil: true,
          tekst: "Kunne ikke lagre. Rapporten ble ikke funnet.",
        };
      }
      return { tekst: "Notatet er lagret.", gjort: "Skrev notat" };
    }

    if (navn === "hent_tidligere_uker") {
      const bedt = somTall(a.antall) ?? 4;
      const antall = Math.min(Math.max(bedt, 1), MAKS_UKER);
      const tekst = await k.tidligereUker(antall);
      return {
        tekst: tekst || "Det finnes ingen tidligere rapporter.",
        gjort: `Leste ${antall} tidligere uker`,
      };
    }

    return { feil: true, tekst: `Ukjent verktøy «${navn}».` };
  } catch (e) {
    /* Se kommentaren over: en strøm som dør er verre enn en feilmelding. */
    return {
      feil: true,
      tekst: `Verktøyet feilet: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
