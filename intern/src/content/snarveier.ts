/**
 * De seks rutene på forsiden.
 *
 * ── HVORFOR DE LIGGER SOM DATA OG IKKE I KOMPONENTEN ──────────────────────
 *
 * Fem av seks er ikke bygget ennå. De skal gjennom én og én, og hver gang
 * en blir ferdig, er endringen å fjerne ett `kommer: true` — ikke å finne
 * fram i et rutenett av markup. Rekkefølgen er også et valg noen kommer til
 * å ville endre, og det skal kunne gjøres uten å røre layouten.
 *
 * ── HVORFOR RUTENE IKKE HAR EN FORKLARINGSLINJE ───────────────────────────
 *
 * Første utkast ga hver rute en setning under tittelen. For «Lag
 * produksjonsplan» kunne den skrives, fordi den siden finnes. For de fem
 * andre måtte den finnes på — og en oppdiktet setning om hva «Video-checker»
 * gjør, ville blitt lest som en beslutning ingen har tatt.
 *
 * Copy kommer fra Reflektor, ikke herfra. Se copy-protokollen i AGENTS.md.
 * Der vi vet noe sikkert, står det; ellers står tittelen alene, og «Kommer»
 * sier resten. En rute med ett tydelig ord på er dessuten lettere å treffe
 * enn en rute med tre linjer i.
 */

/** Tegnet på ruta. Se `Snarveier` for hvorfor det er så stort. */
export type Merke =
  | "ark"
  | "lyn"
  | "kalender"
  | "folk"
  | "konvolutt"
  | "film";

export type Snarvei = {
  /** Det som står stort på ruta. Brukerens egne ord. */
  tittel: string;
  href: string;
  /**
   * Én linje under tittelen. Utelates når vi ikke VET hva siden skal gjøre
   * — se kommentaren over.
   */
  naar?: string;
  merke: Merke;
  /** Siden finnes ikke ennå. Ruta merkes, og den lover ingenting. */
  kommer?: true;
};

export const SNARVEIER: readonly Snarvei[] = [
  {
    tittel: "Lag produksjonsplan",
    href: "/dokument/produksjonsplan",
    naar: "Etter oppstartsmøtet",
    merke: "ark",
  },
  { tittel: "Hva haster?", href: "/haster", merke: "lyn", kommer: true },
  {
    tittel: "Dine deadlines",
    href: "/deadlines",
    merke: "kalender",
    kommer: true,
  },
  { tittel: "Dine kunder", href: "/kunder", merke: "folk", kommer: true },
  {
    tittel: "Skriv on-boardingsmail",
    href: "/onboarding",
    merke: "konvolutt",
    kommer: true,
  },
  {
    tittel: "Video-checker",
    href: "/video-checker",
    merke: "film",
    kommer: true,
  },
];
