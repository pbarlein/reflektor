/**
 * Dev-innlogging: én vei inn uten Google, og den er gjerdet inne med to
 * uavhengige betingelser.
 *
 * Begrunnelsen er konkret: Google-oppsettet krever et Cloud-prosjekt, en
 * OAuth-klient og en registrert returadresse. Uten en vei rundt står hele
 * intranettet utilgjengelig til det er på plass — også for den som bare
 * skal se på designet.
 *
 * BEGGE BETINGELSENE MÅ HOLDE:
 *
 *   1. `NODE_ENV !== "production"`. En Vercel-deploy — også preview — bygger
 *      med NODE_ENV=production. Døra finnes altså ikke i noe som er
 *      deployet, uansett hva env-variabelen står på.
 *   2. `INTERN_DEV_INNLOGGING=true` må settes eksplisitt lokalt.
 *
 * Den første alene ville vært nok. Den andre er der fordi «nok» og «nok med
 * margin» er forskjellige ting når konsekvensen er en åpen dør.
 */
export function devInnloggingTillatt(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.INTERN_DEV_INNLOGGING === "true"
  );
}
