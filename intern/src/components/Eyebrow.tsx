/**
 * Små etiketter i versaler. To former av samme typografi — hentet fra
 * hovedprosjektet, der begrunnelsen står i sin helhet.
 *
 * `Eyebrow`    oransje prikk + label. Innleder en seksjon.
 * `Merkelapp`  samme uten prikk. Navngir en rad eller et kort INNE i en
 *              seksjon, der prikken ville lest som at noe nytt begynner.
 *
 * `font-sans` STÅR EKSPLISITT, og er ikke overflødig: brukes komponenten som
 * <h2>, gir overstyringer.css den display-serifen. Uten klassen rendres en
 * 13 px versaletikett i Instrument Serif — riktig for en overskrift, feil
 * for en etikett.
 *
 * Versaler med åpen sporing (0,08em) er småtekstens halvdel av regelen om at
 * sporingen skal snu fortegn: negativ på display, positiv på små grader.
 */
const GRUNN = "font-sans text-xs font-medium uppercase tracking-[0.08em]";

export function Eyebrow({
  children,
  som: Som = "p",
  className = "",
}: {
  children: React.ReactNode;
  /**
   * `som="h2"` når eyebrowen ER seksjonens overskrift og ikke bare en
   * etikett over en. Utseendet er identisk; dette er semantikk. En
   * overskriftsrekke med hull er vanskelig å navigere med skjermleser.
   */
  som?: "p" | "h2" | "h3";
  /** Kun posisjonering. Aldri typografi. */
  className?: string;
}) {
  return (
    <Som
      className={`flex items-center gap-2.5 ${GRUNN} text-pa-dyp-dempet ${className}`.trimEnd()}
    >
      <span
        className="size-1.5 shrink-0 rounded-full bg-aksent"
        aria-hidden="true"
      />
      {children}
    </Som>
  );
}

export function Merkelapp({
  children,
  som: Som = "p",
  className = "",
}: {
  children: React.ReactNode;
  som?: "p" | "h2" | "h3" | "span";
  className?: string;
}) {
  return (
    <Som className={`${GRUNN} text-pa-dyp-dempet ${className}`.trimEnd()}>
      {children}
    </Som>
  );
}
