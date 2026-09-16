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
 * SPORET ER DUPLISERT. Animasjonen flytter -50 %, og med to identiske sett
 * betyr det at sporet er nøyaktig tilbake der det startet når animasjonen
 * looper. Uten duplikatet ville det oppstått et tomrom før den hoppet.
 * Duplikatet er `aria-hidden`, så skjermleser hører hver kunde én gang.
 *
 * INGEN OVERSKRIFT. Se logoer.ts: en merkelapp over raden ville måttet si
 * hva forholdet er, og enhver formulering som antyder abonnement ville brutt
 * regelen i AGENTS.md. Raden viser; den påstår ikke.
 */
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
              Filene ligger på 2x av visningsstørrelsen, så `sizes` er ikke i
              bruk — bredden er fast. `unoptimized` ville vært feil her;
              next/image serverer dem som webp og halverer vekten.
            */
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
        {sett(false)}
        {sett(true)}
      </div>
    </div>
  );
}
