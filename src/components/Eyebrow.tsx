/**
 * Små etiketter i versaler. To former av samme typografi.
 *
 * `Eyebrow` — oransje prikk + label. Innleder en seksjon.
 * `Merkelapp` — samme uten prikk. Navngir en rad eller et kort INNE i en
 * seksjon, der prikken ville lest som at noe nytt begynner.
 *
 * DE ER SLÅTT SAMMEN HIT 16.09.2026. Oppskriften — `text-xs font-medium
 * uppercase tracking-[0.08em]` pluss riktig dempet farge for flaten — lå
 * skrevet ut åtte steder: i Footer, i FAQ-skinna, og fem ganger i
 * prisseksjonen alene. Åtte kopier av en typografisk regel er åtte steder
 * å glemme den på.
 *
 * Versaler med åpen sporing (0,08em) er småtekstens halvdel av regelen om at
 * sporingen skal snu fortegn: negativ på display, positiv på små grader.
 * Null sporing overalt er en av de tydeligste markørene for at typografien
 * ikke er satt.
 *
 * `variant="dyp"` fordi merkevareoransjen stryker AA på den brune flaten
 * (3,92). Prikken er dekorativ og kunne stått, men da ville de to
 * eyebrow-ene sett ulike ut — og den lysnede oransjen hører uansett hjemme
 * der.
 */

type Flate = "lys" | "dyp";

/*
 * `font-sans` STÅR EKSPLISITT, og det er ikke overflødig. Bunnteksten bruker
 * Merkelapp som <h2> over spaltelistene sine, og `overstyringer.css` gir
 * h1/h2 display-serifen. Uten denne rendres en 13 px versaletikett i
 * Instrument Serif — riktig for en overskrift, feil for en etikett.
 *
 * Med den ser etiketten lik ut uansett hvilket element den er.
 */
const GRUNN = "font-sans text-xs font-medium uppercase tracking-[0.08em]";

const TEKST: Record<Flate, string> = {
  lys: "text-blekk-dempet",
  dyp: "text-pa-dyp-dempet",
};

const PRIKK: Record<Flate, string> = {
  lys: "bg-aksent",
  dyp: "bg-aksent-pa-dyp",
};

export function Eyebrow({
  children,
  variant = "lys",
  som: Som = "p",
}: {
  children: React.ReactNode;
  variant?: Flate;
  /**
   * `som="h2"` når eyebrowen ER seksjonens overskrift og ikke bare en
   * etikett over en. Lagt til 17.09.2026 fordi /om-oss hoppet fra h1 rett
   * til h3 — seksjonstittelen «Slik jobber vi» sto som <p>, og de tre
   * prinsippene under som <h3>. axe meldte det, og den hadde rett: en
   * overskriftsrekke med hull er vanskelig å navigere med skjermleser, og
   * den gir en dårligere dokumentstruktur til det som leser siden.
   *
   * Utseendet er identisk. Dette er semantikk, ikke typografi.
   */
  som?: "p" | "h2";
}) {
  return (
    <Som className={`flex items-center gap-2.5 ${GRUNN} ${TEKST[variant]}`}>
      <span
        className={`size-1.5 shrink-0 rounded-full ${PRIKK[variant]}`}
        aria-hidden="true"
      />
      {children}
    </Som>
  );
}

export function Merkelapp({
  children,
  variant = "lys",
  className = "",
  som: Som = "p",
}: {
  children: React.ReactNode;
  variant?: Flate;
  /** Kun for posisjonering — `lg:pt-3` og lignende. Aldri typografi. */
  className?: string;
  /**
   * Bunnteksten bruker merkelappene som overskrifter over sine spaltelister,
   * og da må elementet være en <h2>. Alle andre steder er de bare etiketter.
   */
  som?: "p" | "h2";
}) {
  return (
    <Som className={`${GRUNN} ${TEKST[variant]} ${className}`.trimEnd()}>
      {children}
    </Som>
  );
}
