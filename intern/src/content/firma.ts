/**
 * Reflektors egne opplysninger.
 *
 * ── HVORFOR DE STÅR HER OG IKKE HENTES FRA SALGSSIDEN ─────────────────────
 *
 * Intranettet er et eget Next-prosjekt med `intern` som rot. Det kan ikke
 * importere fra `../src/content/site.ts` uten å dra hele salgssidens
 * innholdsfil med seg inn i denne byggen.
 *
 * Duplisering er en pris, og den betales bevisst: dette er fire linjer som
 * ikke har endret seg siden selskapet ble stiftet, mot en kobling mellom to
 * prosjekter som skal kunne deployes uavhengig av hverandre.
 *
 * KILDEN ER `src/content/site.ts` I SALGSSIDEN — feltet `kontakt`. Endres
 * noe der, skal det endres her. Det samme gjelder motsatt vei. NAP-en er et
 * entitetssignal, og den må være identisk overalt den står.
 *
 * Verifisert mot tjenesteavtalen med Retail24, signert 10.08.2026.
 */
export const FIRMA = {
  navn: "Reflektor AS",
  orgnr: "926 974 270",
  adresse: "Tvetenveien 162, 0671 Oslo",
  // Alltid pal@, aldri info@. Fastsatt av Marketing 15.09.2026.
  epost: "pal@reflektor.no",
} as const;

/** Linjen nederst på hvert utskriftsark. Samme rekkefølge som i avtalene. */
export const BUNNLINJE = `${FIRMA.navn} · org.nr. ${FIRMA.orgnr} · ${FIRMA.adresse} · ${FIRMA.epost}`;
