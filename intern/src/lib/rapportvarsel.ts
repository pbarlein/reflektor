import type { Rapport } from "@/content/rapporttype";
import { iSendevindu } from "@/lib/rapportformat";
import { erSendt, merkSendt } from "@/lib/rapportlager";

export { iSendevindu };

/**
 * Påminnelsene om rapporter.
 *
 * ── HVA SOM IKKE STÅR I EN PÅMINNELSE ─────────────────────────────────────
 *
 * Ingen tall. Bestilt slik, og det er riktig av to grunner: e-post er ikke
 * innlogget, og annonseforbruk og kundenavn hører hjemme bak innloggingen.
 * Den andre er at en e-post med tallene i, gjør rapporten overflødig — og
 * da svarer ingen på beslutningen.
 *
 * Påminnelsen har derfor én jobb: si at det finnes noe, og hva det gjelder.
 *
 * ── SENDES BARE PÅ HVERDAGER 08–17, OSLO ──────────────────────────────────
 *
 * En purring klokka to om natta er ikke en purring, det er en forstyrrelse.
 * Vinduet gjelder alle påminnelser unntatt den første — den kommer når
 * rapporten kommer, og rapporten kommer mandag 07.46.
 */

const MOTTAKER = process.env.RAPPORT_MOTTAKER ?? "pal@reflektor.no";
const AVSENDER =
  process.env.LEAD_AVSENDER ?? "Reflektor <onboarding@resend.dev>";

function basisUrl(): string {
  const fra =
    process.env.INTRANETT_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  return fra.replace(/\/$/, "");
}

export function rapportUrl(type: string, id: string): string {
  return `${basisUrl()}/rapport/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
}

async function send(emne: string, linjer: string[]): Promise<boolean> {
  const nokkel = process.env.RESEND_API_KEY;
  if (!nokkel) {
    console.error("[rapport] RESEND_API_KEY mangler — ingen påminnelse sendt.");
    return false;
  }
  try {
    const svar = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nokkel}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: AVSENDER,
        to: [MOTTAKER],
        subject: emne.replace(/\s+/g, " ").trim().slice(0, 160),
        text: linjer.join("\n"),
      }),
    });
    if (!svar.ok) {
      console.error(
        `[rapport] Resend svarte ${svar.status}:`,
        await svar.text(),
      );
      return false;
    }
    /*
     * ── EN VELLYKKET SENDING SETTER OGSÅ SPOR ─────────────────────────
     *
     * 27.09.2026 kom rapporten fram, men e-posten uteble. Loggen var taus,
     * og tausheten kunne bety to ting: at sendingen gikk fint og e-posten
     * forsvant underveis, eller at den aldri ble forsøkt fordi nøkkelen
     * allerede sto som sendt. To helt ulike feil, samme stillhet.
     *
     * Resend gir en id per melding. Med den i loggen kan en uteblitt
     * e-post slås opp i Resend-dashbordet og avgjøres på et sekund.
     * Mottakeren skrives òg — det er vår egen adresse, ikke en kundes.
     */
    const svart = (await svar.json().catch(() => null)) as {
      id?: string;
    } | null;
    console.log(
      `[rapport] varsel sendt til ${MOTTAKER} · resend-id ${svart?.id ?? "ukjent"}`,
    );
    return true;
  } catch (e) {
    console.error("[rapport] klarte ikke sende påminnelse", e);
    return false;
  }
}

/** Testrapporter merkes i emnefeltet, aldri stille. */
function emne(r: Rapport, prefiks = ""): string {
  const merke = r.test ? "[TEST] " : "";
  return `${merke}${prefiks}${r.subject}`;
}

/**
 * Den første påminnelsen: en ny rapport er publisert.
 *
 * Sendes uavhengig av sendevinduet. Rapporten kommer mandag 07.46, og å
 * holde den igjen til 08.00 ville vært en regel uten hensikt.
 */
export async function varsleNyRapport(r: Rapport): Promise<boolean> {
  const nokkel = `${r.type}:${r.id}:ny`;
  if (await erSendt(nokkel)) {
    console.log(`[rapport] «${nokkel}» er alt sendt — hopper over.`);
    return false;
  }

  const linjer = [
    r.headline,
    "",
    ...(r.decision ? ["DIN BESLUTNING", r.decision.question, ""] : []),
    `Les rapporten: ${rapportUrl(r.type, r.id)}`,
    "",
    "Tallene ligger bak innloggingen.",
  ];

  const ok = await send(emne(r), linjer);
  if (ok) await merkSendt(nokkel);
  return ok;
}

/** Purring på en ubesvart beslutning. `runde` er 24 eller 72. */
export async function purrBeslutning(
  r: Rapport,
  runde: 24 | 72,
): Promise<boolean> {
  const nokkel = `${r.type}:${r.id}:beslutning-${runde}t`;
  if (await erSendt(nokkel)) {
    console.log(`[rapport] «${nokkel}» er alt sendt — hopper over.`);
    return false;
  }
  if (!r.decision) return false;

  const ok = await send(emne(r, `Påminnelse · `), [
    runde === 24
      ? "Beslutningen fra i går er ikke besvart."
      : "Beslutningen har stått ubesvart i tre døgn.",
    "",
    r.decision.question,
    "",
    `Gjør vi ingenting: ${r.decision.if_nothing}`,
    "",
    `Svar her: ${rapportUrl(r.type, r.id)}`,
  ]);
  if (ok) await merkSendt(nokkel);
  return ok;
}

/** Ett steg har passert fristen uten å være krysset av. */
export async function purrSteg(
  r: Rapport,
  indeks: number,
  tittel: string,
): Promise<boolean> {
  const nokkel = `${r.type}:${r.id}:steg-${indeks}`;
  if (await erSendt(nokkel)) {
    console.log(`[rapport] «${nokkel}» er alt sendt — hopper over.`);
    return false;
  }

  const ok = await send(`${r.test ? "[TEST] " : ""}Frist passert: ${tittel}`, [
    "Et steg fra ukerapporten har passert fristen uten å bli krysset av.",
    "",
    tittel,
    "",
    `Kryss av her: ${rapportUrl(r.type, r.id)}`,
  ]);
  if (ok) await merkSendt(nokkel);
  return ok;
}

/** Ingen rapport har kommet innen mandag klokka ti. */
export async function varsleManglendeRapport(
  type: string,
  merkelapp: string,
): Promise<boolean> {
  const nokkel = `${type}:mangler:${merkelapp}`;
  if (await erSendt(nokkel)) {
    console.log(`[rapport] «${nokkel}» er alt sendt — hopper over.`);
    return false;
  }

  const ok = await send("Ukerapporten mangler", [
    `Det har ikke kommet noen rapport av typen «${type}» denne uka.`,
    "",
    "Den planlagte oppgaven kjører mandag 07.46. Kom den ikke fram, er det",
    "enten oppgaven eller leveringen til intranettet som har stoppet.",
    "",
    `${basisUrl()}/rapport`,
  ]);
  if (ok) await merkSendt(nokkel);
  return ok;
}
