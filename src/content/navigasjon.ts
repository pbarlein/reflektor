/**
 * Navigasjonen. Ligger her og ikke i komponentene, som all annen tekst.
 *
 * FIRE PUNKTER PLUSS ÉN CTA I HEADEREN. Tallet er ikke hentet fra forskning
 * — den finnes ikke. Et researchspor gikk gjennom litteraturen 16.09.2026 og
 * fant INGEN kontrollert studie som måler konvertering mot antall
 * menypunkter, og ingen kontrollert test av header-CTA mot ingen header-CTA.
 * «7±2» er Miller 1956 om gjenkalling av enkle stimuli; Miller avviste selv
 * overføringen til menyer, og en meny er gjenkjenning, ikke gjenkalling.
 *
 * Begrunnelsen er derfor mekanisk, ikke empirisk: hvert punkt konkurrerer om
 * den samme vannrette plassen som CTA-en, og hvert punkt er en utgang bort
 * fra skjemaet på en side hvis eneste jobb er skjemaet. Fire punkter er det
 * som får CTA-en til å kunne se ut som en knapp.
 *
 * Til sammenlikning, hentet fra rå markup 16.09.2026: Stripe 5, Linear 6,
 * Bakken & Bæck 5, Trigger 6, dagens reflektor.no 5. Konvergensen på 5–6 er
 * reell som praksis, men den er ikke evidens for effekt.
 *
 * «PRIS» ER ET VALG, IKKE EN BEVARING. docs/kontekst.md sa at «Pris» er
 * første menypunkt på dagens side og at det skal beholdes. Det stemmer ikke:
 * jeg hentet HTML-en fra www.reflektor.no 16.09.2026, og første punkt heter
 * «Sosiale medier». Ordet «Pris» finnes ikke i headeren. Dokumentet er
 * rettet. Punktet heter likevel «Pris» her, fordi prisåpenhet er den ene
 * dokumenterte posisjoneringen Reflektor har — men da som et valg vi kan
 * forsvare, ikke som et arvestykke.
 *
 * OG DET PEKER IKKE PÅ /sosiale-medier-byra. Den URL-en skal 301-es til
 * forsiden ved cutover (docs/cutover.md). Et menypunkt dit ville blitt et
 * sidevis redirect-hopp på hver eneste side i det øyeblikket bryteren slås.
 * Det peker på prisseksjonen på forsiden.
 *
 * TJENESTESIDENE LIGGER I BUNNTEKSTEN, IKKE I HEADEREN. Tre grunner:
 *
 * 1. Interne lenker i header og bunntekst er boilerplate. John Mueller,
 *    30.01.2022: for kryping og kontekst spiller det ingen rolle hvor på
 *    siden lenken står; for å avgjøre hva en side handler om vektlegges
 *    hovedinnholdet framfor header, sidestolpe og bunntekst. Krypbarheten er
 *    uansett løst av sitemap.ts.
 * 2. Tre av dem — videoproduksjon-i-oslo, employer-branding-video-oslo,
 *    eventfotograf-eventvideo — er merket eldre landingssider i site.ts.
 *    De er beholdt for å unngå 404, ikke for å styre arkitekturen.
 * 3. Et nedtrekk på mobil gjør to trykk til skjemaet om til tre.
 *
 * BLOGGEN ER FLYTTET TIL BUNNTEKSTEN av samme grunn som AGENTS.md gir:
 * den beholdes for lenkeverdien, men den skal ikke styre arkitekturen.
 * Innholdet er ordbok- og skoleoppgavestoff som ikke konverterer.
 */

export type Lenke = { navn: string; sti: string };

/** Hovedmenyen. Rekkefølgen er prioritert, ikke alfabetisk. */
export const hovedmeny: Lenke[] = [
  { navn: "Pris", sti: "/#pris" },
  { navn: "Vårt arbeid", sti: "/vart-arbeid" },
  { navn: "Om oss", sti: "/om-oss" },
  { navn: "FAQ", sti: "/faq" },
];

/**
 * CTA-teksten er ikke funnet på. «Ta kontakt» er i bruk på dagens side og
 * står som godkjent variant i docs/kontekst.md. Vil dere ha et sterkere
 * løfte i headeren, er «Få et strategiforslag» den beste av de godkjente —
 * men den er lengre og presser layouten, og copy-protokollen gjelder:
 * den skal bestilles, ikke skrives her.
 */
export const hovedCta = { navn: "Ta kontakt", sti: "/kontaktoss" };

/**
 * Bunntekstens to spalter.
 *
 * `/sosiale-medier-byra` står IKKE her. Den er live og annonseres mot, men
 * den er også den ene URL-en som er bestilt 301-et til forsiden ved cutover.
 * En sidevis bunntekstlenke til en URL som skal dø, er en lenke som blir en
 * omdirigering på hver eneste side. Annonsene peker dit; det holder.
 */
export const bunnmeny: { tittel: string; lenker: Lenke[] }[] = [
  {
    tittel: "Tjenester",
    lenker: [
      { navn: "Innholdsproduksjon", sti: "/innholdsproduksjon" },
      { navn: "Reklamefilm", sti: "/reklamefilm" },
      { navn: "Videoproduksjon i Oslo", sti: "/videoproduksjon-i-oslo" },
      { navn: "Employer branding-video", sti: "/employer-branding-video-oslo" },
      { navn: "Eventfotograf og -videograf", sti: "/eventfotograf-eventvideo" },
    ],
  },
  {
    tittel: "Selskap",
    lenker: [
      { navn: "Vårt arbeid", sti: "/vart-arbeid" },
      { navn: "Om oss", sti: "/om-oss" },
      { navn: "FAQ", sti: "/faq" },
      { navn: "Blogg", sti: "/blogg" },
      { navn: "Ta kontakt", sti: "/kontaktoss" },
      { navn: "Personvern", sti: "/personvern" },
    ],
  },
];
