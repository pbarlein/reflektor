import { TBD, type Seksjon } from "../sider/_slot.ts";

/**
 * Broen – samme mal på alle landingssider (brief 6.2, LÅST).
 *
 * Fire slots, alltid i denne rekkefølgen. Alltid nest siste seksjon, alltid
 * etter FAQ, aldri over folden. Visuelt skal broen skille seg fra resten av
 * siden – det er et skifte i samtale, ikke enda en seksjon.
 *
 * CTA-en er alltid sekundærstil og lenker til /. Primærstil er reservert
 * skjemaet på siden.
 */
export function lagBro(prefiks: string, nr: number): Seksjon {
  return {
    nr,
    navn: "Broen",
    jobb: "Koble engangsleveransen til det løpende behovet.",
    slots: {
      [`${prefiks}.bridge.h2`]: TBD({
        maksTegn: 60,
        jobb: "Still kundens neste spørsmål, ikke vårt.",
      }),
      [`${prefiks}.bridge.body`]: TBD({
        maksTegn: 320,
        jobb: "2–3 setninger som kobler engangsleveransen til abonnementet.",
      }),
      [`${prefiks}.bridge.facts`]: TBD({
        maksTegn: 240,
        jobb: "De fire tellbare punktene fra abonnementet, komprimert.",
      }),
      [`${prefiks}.bridge.cta`]: TBD({
        maksTegn: 24,
        jobb: "Sekundær CTA til /. Aldri primærstil.",
      }),
    },
  };
}
