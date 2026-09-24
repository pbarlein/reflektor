import { friskTilgang, googleOppsett } from "@/lib/google";
import { hentGoogletoken } from "@/lib/hukommelse";

/**
 * Gmail-oppslaget.
 *
 * ── HVA DET ER FOR ────────────────────────────────────────────────────────
 *
 * Bestilt 24.09.2026: har kunden sendt en brief eller en instruks på e-post,
 * skal dokumentet bygges på den. Da slipper produsenten å lete den fram, og
 * — viktigere — ingenting faller ut fordi hen ikke fant den.
 *
 * ── DET ER DEN INNLOGGEDE SOM LESER SIN EGEN POSTKASSE ────────────────────
 *
 * Tilgangen hviler på den ansattes eget samtykke ved innlogging, og den er
 * lese-bare. Det er noe annet enn at arbeidsgiver leser ansattes e-post.
 * Refresh-tokenet ligger serverside i den private Blob-butikken, aldri i
 * cookien — se `hukommelse.ts`.
 *
 * ── SØKET ER SMALT MED VILJE ──────────────────────────────────────────────
 *
 * Vi henter ikke «alt». Vi søker på kundens navn, i det siste året, og tar
 * de nyeste trådene. En bredere henting ville sendt mer av postkassen til
 * Anthropic uten å gjøre dokumentet bedre — det er briefen som er nyttig,
 * ikke julebordsplanleggingen.
 */

const API = "https://gmail.googleapis.com/gmail/v1/users/me";

/** Så mange tråder leses. Flere gir mer støy, ikke mer brief. */
const MAKS_MELDINGER = 8;
/** Per melding. En lang tråd er som regel lang på grunn av sitatene. */
const MAKS_TEGN = 6_000;

export type Epost = {
  id: string;
  fra: string;
  emne: string;
  dato: string;
  tekst: string;
};

/** Har denne brukeren gitt oss Gmail-tilgang? */
export async function harGmail(epost: string): Promise<boolean> {
  return Boolean(await hentGoogletoken(epost));
}

type Hode = { name: string; value: string };
type Del = {
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: Del[];
};

function hode(hoder: Hode[], navn: string): string {
  return hoder.find((h) => h.name.toLowerCase() === navn)?.value ?? "";
}

/** Gmail koder kroppen som base64url, og deler den i MIME-deler. */
function avkod(data: string): string {
  const fylt = data.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const binart = atob(fylt + "=".repeat((4 - (fylt.length % 4)) % 4));
    const bytes = new Uint8Array(binart.length);
    for (let i = 0; i < binart.length; i++) bytes[i] = binart.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}

/**
 * Plukker ut ren tekst.
 *
 * `text/plain` foretrekkes. Finnes bare HTML, strippes taggene grovt — vi
 * skal lese innholdet, ikke gjengi det, og en HTML-parser her ville vært en
 * avhengighet for å gjøre noe dårligere enn dette.
 */
function brodtekst(del: Del | undefined): string {
  if (!del) return "";

  if (del.mimeType === "text/plain" && del.body?.data) {
    return avkod(del.body.data);
  }

  for (const d of del.parts ?? []) {
    const t = brodtekst(d);
    if (t) return t;
  }

  if (del.mimeType === "text/html" && del.body?.data) {
    return avkod(del.body.data)
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n");
  }

  return "";
}

/**
 * Klipper bort sitert historikk.
 *
 * En tråd på ti svar inneholder den første meldingen ti ganger. Uten dette
 * er nesten alt vi sender videre, det samme sagt om igjen.
 */
function utenSitater(tekst: string): string {
  const linjer = tekst.split("\n");
  const stopp = linjer.findIndex(
    (l) =>
      /^>/.test(l.trim()) ||
      /^-{2,}\s*Forwarded message/i.test(l.trim()) ||
      /^(På|Den) .+ skrev .+:$/i.test(l.trim()) ||
      /^On .+ wrote:$/i.test(l.trim()) ||
      /^Fra:\s/i.test(l.trim()),
  );
  return (stopp > 0 ? linjer.slice(0, stopp) : linjer).join("\n").trim();
}

/**
 * Søker i postkassen til den innloggede.
 *
 * Returnerer tom liste på alt som går galt — manglende tilgang, utløpt
 * samtykke, feil fra Google. Gmail er et gode, ikke en forutsetning, og et
 * dokument uten e-postgrunnlag er bedre enn ingen dokument.
 */
export async function sokEpost(
  brukerEpost: string,
  kunde: string,
  signal?: AbortSignal,
): Promise<Epost[]> {
  const oppsett = googleOppsett();
  if (!oppsett || !kunde.trim()) return [];

  const refresh = await hentGoogletoken(brukerEpost);
  if (!refresh) return [];

  const tilgang = await friskTilgang(oppsett, refresh);
  if (!tilgang) return [];

  const hent = (sti: string) =>
    fetch(`${API}${sti}`, {
      headers: { authorization: `Bearer ${tilgang}` },
      cache: "no-store",
      signal,
    });

  try {
    /*
     * `-in:spam -in:trash` fordi et søppelfiltrert nyhetsbrev med kundens
     * navn i ikke er en brief. Ett år er nok: eldre e-post beskriver en
     * kunde som var, ikke en kunde som er.
     */
    const q = `"${kunde.replace(/"/g, "")}" newer_than:1y -in:spam -in:trash`;
    const liste = await hent(
      `/messages?q=${encodeURIComponent(q)}&maxResults=${MAKS_MELDINGER}`,
    );
    if (!liste.ok) return [];

    const { messages } = (await liste.json()) as {
      messages?: { id: string }[];
    };
    if (!messages?.length) return [];

    const ut: Epost[] = [];
    for (const m of messages.slice(0, MAKS_MELDINGER)) {
      const svar = await hent(`/messages/${m.id}?format=full`);
      if (!svar.ok) continue;
      const data = (await svar.json()) as {
        payload?: Del & { headers?: Hode[] };
        internalDate?: string;
      };
      const hoder = data.payload?.headers ?? [];
      const tekst = utenSitater(brodtekst(data.payload)).slice(0, MAKS_TEGN);
      if (!tekst) continue;

      ut.push({
        id: m.id,
        fra: hode(hoder, "from").slice(0, 160),
        emne: hode(hoder, "subject").slice(0, 200) || "(uten emne)",
        dato: data.internalDate
          ? new Date(Number(data.internalDate)).toISOString().slice(0, 10)
          : "",
        tekst,
      });
    }
    return ut;
  } catch {
    return [];
  }
}
