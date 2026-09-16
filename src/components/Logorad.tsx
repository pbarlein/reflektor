import { Fragment } from "react";
import Image from "next/image";

import { kundelogoer } from "@/content/logoer";

/**
 * Logoraden. Én linje, full bredde, drifter mot venstre.
 *
 * HVORFOR DRIFT OG IKKE EN STILLESTÅENDE RAD: elleve logoer i sine riktige
 * proporsjoner måler 2 018 px. Det er bredere enn noen vanlig skjerm, så
 * raden MÅ bevege seg eller kunne dras i — ellers finnes det logoer ingen
 * ser. Dagens reflektor.no har åtte logoer som så vidt får plass på én
 * skjerm; med elleve går ikke det.
 *
 * TILGJENGELIGHET, tre ting som henger sammen:
 *
 * 1. Wrapperen har `overflow-x-auto`. Raden kan altså DRAS i, ikke bare
 *    ses på. Det er kravet på berøringsskjerm, og det er brukerens måte å
 *    ta kontroll over bevegelsen på.
 * 2. Driften stopper på hover og på focus-within. WCAG 2.2.2 krever at
 *    bevegelse som varer over fem sekunder kan settes på pause.
 * 3. `prefers-reduced-motion` slår driften helt av. Da står raden stille og
 *    er ren rulling — samme innhold, ingen bevegelse.
 *
 * SPORET GJENTAS FIRE GANGER. Animasjonen flytter -50 %, altså lengden av
 * to sett, og da står sporet nøyaktig der det startet når loopen slår om.
 *
 * FIRE OG IKKE TO — dette var en ekte feil, meldt av Pål: «logoraden
 * forsvinner når den har kjørt gjennom». Med to sett er perioden ETT sett,
 * og ved loopslutt vises vinduet [settbredde, settbredde + vindusbredde].
 * Er vinduet bredere enn settet, peker halen utenfor sporet og det blir
 * tomt til høyre. Målt: 0 px hull til og med 1 920, 558 px på 2 560,
 * 1 438 px på 3 440. Usynlig på en laptop, åpenbart på en stor skjerm.
 *
 * Med fire sett er perioden TO sett — 4 004 px — og kravet blir at vinduet
 * er smalere enn det. Det dekker alt opp til 4 004 px logiske piksler, og
 * Pro Display XDR er 3 008. Skal raden tåle mer, må SETT økes, ikke
 * animasjonen endres.
 *
 * Det koster ingenting på nettverket: 44 <img> peker på elleve unike
 * URL-er, så nettleseren henter fortsatt elleve filer. Bare DOM-noder.
 *
 * Bare det første settet har alt-tekst; de tre andre er `aria-hidden`, så
 * skjermleser hører hver kunde én gang.
 *
 * INGEN OVERSKRIFT. Se logoer.ts: en merkelapp over raden ville måttet si
 * hva forholdet er, og enhver formulering som antyder abonnement ville brutt
 * regelen i AGENTS.md. Raden viser; den påstår ikke.
 */
/**
 * Antall repetisjoner av logolista i sporet. Animasjonen flytter -50 %, så
 * perioden er SETT/2 sett. Raden er sømløs så lenge vinduet er smalere enn
 * perioden: 4 x 2 002 / 2 = 4 004 px.
 */
const SETT = 4;

export function Logorad() {
  const sett = (skjult: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
      aria-hidden={skjult || undefined}
    >
      {kundelogoer.map((l) => (
        <li key={l.id} className="shrink-0">
          <Image
            src={`/logoer/${l.id}.png`}
            alt={skjult ? "" : l.navn}
            width={l.bredde}
            height={l.hoyde}
            /*
              EAGER, IKKE LAZY. Målt på deployet lastet ni av elleve: Happis
              og Soul Cake ligger utenfor skjermen til høyre, og lat lasting
              utsatte dem. Med drift betyr det at de to hadde poppet inn
              mens raden beveget seg — og en IntersectionObserver på et
              element som flyttes av en CSS-animasjon inne i en
              rullecontainer er ikke noe å stole på.

              fetchPriority="low" er den andre halvdelen. Uten den ville 22
              bilder rett under folden kappes om båndbredden med
              heroklippet, som ER LCP-elementet. Lav prioritet setter dem
              bakerst i køen uten å gjøre dem late. Til sammen rundt 88 kB
              AVIF.

              `sizes` er ikke i bruk — bredden er fast, og filene ligger på
              2x visningsstørrelse. next/image serverer 256w til 1x og hele
              kilden til 2x; verifisert ved å hente begge kandidatene og
              måle dem (422x44 mot en visning på 211x22, altså nøyaktig 2x).
            */
            loading="eager"
            fetchPriority="low"
            className="h-auto w-auto max-w-none object-contain"
            style={{ width: l.bredde, height: l.hoyde }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      /*
        Maskene gjør at logoene toner ut mot kantene i stedet for å bli
        kuttet i en hard kant. Uten dem ser en logo som er halvveis ute av
        skjermen ut som en feil.
      */
      className="logorad-maske overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="logorad-spor flex w-max">
        {Array.from({ length: SETT }, (_, i) => (
          <Fragment key={i}>{sett(i > 0)}</Fragment>
        ))}
      </div>
    </div>
  );
}
