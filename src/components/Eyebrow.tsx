/**
 * Seksjonsetikett: liten oransje prikk + kort label i versaler.
 *
 * Går igjen over hele siden. Billig, konsekvent og distinkt — og den bruker
 * aksentfargen på en måte som ikke konkurrerer med CTA-knappen, fordi prikken
 * er få piksler.
 *
 * Versaler med åpen sporing (0,08em) er småtekstens halvdel av regelen om at
 * sporingen skal snu fortegn: negativ på display, positiv på små grader.
 * Null sporing overalt er en av de tydeligste markørene for at typografien
 * ikke er satt.
 *
 * `variant="dyp"` fordi merkevareoransjen stryker AA på den brune flaten
 * (3,92). Prikken er dekorativ og kunne stått, men da ville de to eyebrow-ene
 * sett ulike ut — og den lysnede oransjen hører uansett hjemme der.
 */
export function Eyebrow({
  children,
  variant = "lys",
}: {
  children: React.ReactNode;
  variant?: "lys" | "dyp";
}) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] ${
        variant === "dyp" ? "text-pa-dyp-dempet" : "text-blekk-dempet"
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${
          variant === "dyp" ? "bg-aksent-pa-dyp" : "bg-aksent"
        }`}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
