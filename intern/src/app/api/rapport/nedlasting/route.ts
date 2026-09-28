import { NextResponse, type NextRequest } from "next/server";

import { byggMarkdown, filnavn, type Nedlastbar } from "@/lib/rapportmarkdown";
import { hentIndeks, hentRapport } from "@/lib/rapportlager";
import { erRapportleser } from "@/lib/rapporttilgang";
import { hentBruker } from "@/lib/tilgang";

/**
 * Rapporten som nedlastbar Markdown-fil.
 *
 * Bestilt 28.09.2026: filen skal legges i Claude-prosjektet
 * «reflektor-marketing» som kontekst for videre markedsføringsarbeid. Se
 * `rapportmarkdown.ts` for hvorfor formatet er Markdown.
 *
 * ── GET, OG DET ER MED VILJE ──────────────────────────────────────────────
 *
 * Handlingsruta ved siden av er POST, fordi den endrer noe. Denne leser
 * bare. Det gjør at knappen kan være en vanlig `<a download>` uten en
 * eneste linje klientkode — ingen `fetch`, ingen blob-URL som må ryddes,
 * ingen tilstand som kan bli stående og snurre om nettet faller.
 *
 * ── UTEN PARAMETRE: ALT, UNNTATT TESTDATA ─────────────────────────────────
 *
 * En kontekstfil med oppdiktede tall er verre enn ingen kontekstfil: den
 * som leser den kan ikke se hvilke tall som var ekte. Testrapportene er
 * derfor ute av samlefilen.
 *
 * Med `type` og `id` lastes én rapport, og da følger testrapporter med —
 * har man klikket seg inn på en testrapport og trykket last ned, er det
 * den man ba om. Filen heter da `-TESTDATA.md` og sier det i førstelinja.
 *
 * ── ETT BLOB-KALL PER RAPPORT ─────────────────────────────────────────────
 *
 * Indeksen bærer bare sammendraget; hele rapporten ligger i hver sin fil.
 * Samlefilen henter dem derfor én og én. Det er greit for en manuell
 * nedlasting av en håndfull uker, men det er grunnen til at dette ikke er
 * noe som skal kalles ofte eller automatisk.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(foresporsel: NextRequest) {
  const bruker = await hentBruker();
  if (!erRapportleser(bruker)) {
    /*
     * 404 og ikke 403, som resten av rapportsenteret: en 403 bekrefter at
     * ruta finnes.
     *
     * Denne linja gjelder den INNLOGGEDE som ikke er rapportleser. Den som
     * ikke er logget inn i det hele tatt, stoppes av proxyen med 401 før
     * ruta kjører — se src/proxy.ts.
     */
    return new NextResponse("Not found", { status: 404 });
  }

  const sok = foresporsel.nextUrl.searchParams;
  const type = sok.get("type");
  const id = sok.get("id");

  const rapporter: Nedlastbar[] = [];

  if (type && id) {
    const l = await hentRapport(type, id);
    if (!l) return new NextResponse("Not found", { status: 404 });
    rapporter.push({ rapport: l.rapport, svar: l });
  } else {
    const indeks = (await hentIndeks()).filter((r) => !r.test);
    for (const rad of indeks) {
      const l = await hentRapport(rad.type, rad.id);
      if (l) rapporter.push({ rapport: l.rapport, svar: l });
    }
  }

  const naa = new Date();
  return new NextResponse(byggMarkdown(rapporter, naa), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${filnavn(rapporter, naa)}"`,
      /* Rapportene endrer seg når Pål krysser av. Ingen skal få en gammel. */
      "cache-control": "no-store",
    },
  });
}
