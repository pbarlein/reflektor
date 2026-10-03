/**
 * Mengdebegrensning på kontaktskjemaet, lagt til 04.10.2026.
 *
 * TO LAG, OG DE GJØR IKKE DET SAMME.
 *
 * 1. `foroftigPaKanten` spør Vercels brannmur. Den teller PÅ KANTEN, altså
 *    felles for alle serverinstanser, og er den eneste som faktisk holder
 *    mot en flom fordelt over mange kall. Den krever en regel med id
 *    «skjema» i prosjektets brannmur.
 *
 * 2. `foroftig` i skjemavern.ts teller i minnet til én instans. Den stopper
 *    én maskin som sender om og om igjen. Den er gulvet.
 *
 * REGELEN FINNES IKKE ENNÅ. Vercels API svarer «Seawall Config not found»
 * for dette prosjektet, så den kan ikke opprettes herfra — den må lages én
 * gang i Vercels grensesnitt: Firewall → ny regel, id `skjema`, 5 per 600
 * sekunder per IP. I det øyeblikket den finnes, begynner koden under å
 * bruke den. Fram til da svarer kallet «ikke begrenset», og lag 2 står
 * alene.
 *
 * DEN SLIPPER ALLTID GJENNOM VED TVIL. Et kall som feiler, henger eller
 * svarer rart, skal ALDRI stoppe et lead: en henvendelse er verdt mer enn
 * en grense. Derfor er hele kallet pakket inn, og enhver feil leses som
 * «ikke begrenset».
 */

/** Id-en på brannmurregelen. Samme streng må stå i regelen i Vercel. */
const REGEL = "skjema";

export async function foroftigPaKanten(req: Request): Promise<boolean> {
  try {
    const { checkRateLimit } = await import("@vercel/firewall");
    const { rateLimited } = await checkRateLimit(REGEL, { request: req });
    return rateLimited === true;
  } catch {
    /*
      Ingen logging her. Uten regelen i brannmuren ville dette skrevet en
      linje for HVER innsending, og en logg som alltid sier det samme er en
      logg ingen leser.
    */
    return false;
  }
}
