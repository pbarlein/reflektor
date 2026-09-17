import Link from "next/link";

/**
 * Knappen. Én oppskrift, ikke fire kopier.
 *
 * SAMLET 17.09.2026. Den samme klasserekka — `rounded-interaktiv bg-aksent
 * px-7 py-3.5 font-medium text-[color:var(--text-on-accent)]
 * transition-colors hover:bg-aksent-hover` — lå skrevet ut tre steder: i
 * heroen, i kontaktskjemaet og i headeren. Headeren hadde dessuten `#0D0D0D`
 * hardkodet der de to andre bruker tokenet. Ingen ville sett forskjellen, og
 * det er nettopp problemet: en farge som ikke er et token, følger ikke med
 * når tokenet endres.
 *
 * `text-on-accent` ER MØRK, ikke hvit, og det er målt. Hvit på aksentoransje
 * gir 4,15:1 og stryker AA for brødtekstgrad. Nesten-sort gir 4,68:1. Se
 * kontrastabellen i docs/research-konvertering.md.
 *
 * STØRRELSE ER EN PROP, IKKE EN KLASSE UTENFRA. Headeren trenger en lavere
 * knapp enn heroen, og det er en reell forskjell — men bare to varianter av
 * den. Å slippe inn vilkårlige klasser ville gjenåpnet døra for de fire
 * kopiene.
 */

type Vekt = "primar" | "sekundar";
type Storrelse = "vanlig" | "kompakt";

const GRUNN =
  "inline-flex items-center justify-center rounded-interaktiv border font-medium transition-colors motion-reduce:transition-none";

const VEKT: Record<Vekt, string> = {
  primar:
    "border-transparent bg-aksent text-[color:var(--text-on-accent)] hover:bg-aksent-hover",
  /*
   * Sekundærknappen har ekte ramme i kantfargen og ingen flate. Den brukes
   * ved siden av en primærknapp, og da må forskjellen være flaten — ikke
   * størrelsen. To knapper i ulik størrelse leser som at den lille er et
   * unntak.
   */
  sekundar: "border-kant bg-transparent text-blekk hover:bg-flate-dempet",
};

const STORRELSE: Record<Storrelse, string> = {
  vanlig: "px-7 py-3.5",
  kompakt: "px-4 py-2.5 text-[0.9375rem] sm:px-5",
};

/**
 * Selve oppskriften, for de stedene elementet må være noe annet enn en
 * `<button>` eller en `<Link>`.
 *
 * Heroens CTA er en `<a href="#kontakt">` med vilje — en ren
 * ankernavigering på samme side — og headerens går gjennom `Menylenke`,
 * som lukker mobilmenyen når den klikkes. Å tvinge dem inn i komponentene
 * ville byttet ut et ekte behov med en pen import.
 *
 * Det som MÅ deles er oppskriften, ikke elementet. Med denne kan en farge
 * eller en polstring endres ett sted og slå gjennom alle fem.
 */
export function knappeklasser(
  vekt: Vekt = "primar",
  storrelse: Storrelse = "vanlig",
  ekstra?: string,
) {
  return klasser(vekt, storrelse, ekstra);
}

function klasser(vekt: Vekt, storrelse: Storrelse, ekstra?: string) {
  return `${GRUNN} ${VEKT[vekt]} ${STORRELSE[storrelse]}${ekstra ? ` ${ekstra}` : ""}`;
}

type Felles = {
  children: React.ReactNode;
  vekt?: Vekt;
  storrelse?: Storrelse;
  /** Kun posisjonering — `mt-8`, `justify-self-start`. Aldri farge eller polstring. */
  className?: string;
};

export function Knapp({
  children,
  vekt = "primar",
  storrelse = "vanlig",
  className,
  ...rest
}: Felles & React.ComponentProps<"button">) {
  return (
    <button className={klasser(vekt, storrelse, className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * Samme knapp som lenke.
 *
 * EGEN KOMPONENT OG IKKE EN `som`-PROP. En knapp og en lenke er ikke samme
 * element med ulik drakt: den ene utfører noe, den andre navigerer. Å la en
 * prop bestemme hvilken det er, gjør det lett å sende en bruker til en
 * `<div role="button">` ved et uhell. To eksporter koster én linje og gjør
 * valget eksplisitt.
 */
export function Knappelenke({
  children,
  vekt = "primar",
  storrelse = "vanlig",
  className,
  ...rest
}: Felles & React.ComponentProps<typeof Link>) {
  return (
    <Link className={klasser(vekt, storrelse, className)} {...rest}>
      {children}
    </Link>
  );
}
