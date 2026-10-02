import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import type { Anmeldelse } from "@/content/anmeldelser";
import { googleProfil } from "@/content/anmeldelser";

/**
 * Anmeldelser på én rad.
 *
 * FORRIGE VERSJON TOK 1 500 PIKSLER. Et løftet sitat i 3,4 rem serif, og
 * under det åtte glasskort i tre rader. Til sammen rundt 1 500 tekstegn i én
 * seksjon. Den var ikke feil — den var bare så lang at den brøt rytmen i
 * siden, og leseren måtte ta stilling til ni anmeldelser på rad før hun kom
 * videre. Nå er den én rad høy.
 *
 * TALLET GJØR JOBBEN SITATENE GJORDE. Google publiserer selv 5,0 av 5 fra
 * elleve anmeldelser. Det er det komprimerte beviset: én linje sier det ni
 * sitater brukte en skjermhøyde på å si. Sitatene står fortsatt der — de
 * forklarer HVA som er bra — men de trenger ikke lenger å bære beviset alene.
 *
 * Se src/content/anmeldelser.ts for hvordan tallet er verifisert, hvorfor
 * stjernene nå er forsvarlige når de ikke var det før, og hvorfor de må
 * etterses.
 *
 * KORTBREDDEN FØLGER TEKSTLENGDEN. Ingen anmeldelse er kuttet for å passe i
 * en form. Sitatene er allerede utdrag, og utdraget kutter bare — det legger
 * aldri til et ord og fjerner aldri et forbehold, som Thomas Messels «selv i
 * et krevende marked». Å kutte dem hardere for å få like kort ville brutt
 * den regelen. I stedet får det lange sitatet et bredt kort og det korte et
 * smalt, og raden får en rytme uniforme kort ikke kan ha.
 *
 * INGEN FAST HØYDE. Kortene strekkes av det høyeste. Et tall her ville måttet
 * gjettes på nytt hver gang en anmeldelse endres.
 *
 * RADEN SKJULER NOE, OG DET ER ET VALG. Fra kort fem må man rulle. Det er
 * prisen for å ikke ta en skjermhøyde. Den er betalbar fordi: de to sterkeste
 * står først, ingenting er skjult for søk eller språkmodeller — alle ni
 * ligger i HTML-en — og raden roterer ikke av seg selv. Den er en rad man
 * drar i, ikke en karusell som flytter på seg mens man leser.
 *
 * DETTE ER NY SYNLIGHET, IKKE BEVART. Dagens reflektor.no viser anmeldelsene
 * gjennom en Elfsight-widget som henter dem med JavaScript etter at siden er
 * lastet. Tekstene finnes ikke i HTML-en, og AI-crawlerne kjører ikke
 * JavaScript (Vercels måling på eget nett, 17.12.2024: ingen av de store
 * gjør det). Her er de servergjengitt ren tekst. Det er hele
 * synlighetsgevinsten — og den kommer av hvor teksten ligger, ikke av
 * markup.
 *
 * MERK — ingen Review-objekter i schema. Ni anmeldelser i JSON-LD er den
 * mest åpenbart selvtjenende varianten, og de gir ingenting. En
 * `aggregateRating` ligger derimot på Organization; se Schema.tsx for
 * hvorfor, og A33 for rettelsen av påstanden om at slik markering er et
 * regelbrudd. Den er «ineligible», ikke forbudt.
 */
function Stjerner() {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="size-[1.125rem] fill-aksent-pa-dyp"
        >
          <path d="M12 2.5l2.9 6.05 6.6.88-4.82 4.6 1.2 6.57L12 17.5l-5.88 3.1 1.2-6.57L2.5 9.43l6.6-.88L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Bredden bøtteinndeles fra tegnlengden. Tre bøtter, ikke en glidende skala:
 * en beregnet bredde per kort ville gitt like mange bredder som kort, og
 * raden ville sett tilfeldig ut i stedet for satt.
 */
function bredde(tegn: number) {
  if (tegn > 200) return "w-[21rem] sm:w-[25rem]";
  if (tegn > 140) return "w-[19rem] sm:w-[21rem]";
  return "w-[16rem]";
}

export function Anmeldelsesrad({
  anmeldelser,
  overskrift,
  eyebrow,
  innslag,
}: {
  anmeldelser: Anmeldelse[];
  overskrift: React.ReactNode;
  eyebrow: React.ReactNode;
  /**
   * Noe som står mellom overskriften og anmeldelsesraden.
   *
   * LAGT TIL 01.10.2026 for omtalevideoen fra Soulcake. Den kunne ikke
   * vært en egen seksjon over: da hadde den fått sin egen overskrift, og
   * siden ville sagt «det kundene sier» to ganger på rad. Her hører den
   * under den overskriften som allerede står der — videoen er det sterkeste
   * kunden sier, og anmeldelsene er de elleve andre.
   */
  innslag?: React.ReactNode;
}) {
  return (
    /*
      INNFELT PANEL, IKKE EN HELBREDDS STRIPE. Endret 02.10.2026, bestilt av
      Pål: «gjør seksjonen med anmeldelser noe smalere i bakgrunnen og ikke
      dekk hele siden i bredden med mørke.»

      DETTE ER Å RETTE SEG ETTER SIDENS EGEN FORM, ikke å finne på en ny.
      Hver eneste andre mørke flate på nettstedet er allerede et innfelt
      panel med samme klasser — «Dere setter av én dag» rett under her,
      kontaktblokken, avslutningsblokken på hver tjeneste-, case- og
      bloggside. Anmeldelsene var den ENESTE mørke flaten som gikk fra kant
      til kant, og skilte seg ut uten at noe valg lå bak.

      `overflow-hidden` er ikke pynt: uten den ville anmeldelsesraden, som
      med vilje er bredere enn panelet, malt seg forbi de avrundede hjørnene.

      Luften over og under panelet ligger nå UTENFOR det, i seksjonen rundt
      (se forside/Anmeldelsesseksjon.tsx). Det er forskjellen fra før: i en
      helbredds stripe lå `py` inne i fargen og lagde ingen avstand til
      naboene i det hele tatt.
    */
    <Container>
      <div className="overflow-hidden rounded-flate bg-dyp px-6 py-12 text-pa-dyp sm:px-14 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <Eyebrow variant="dyp">{eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
              {overskrift}
            </h2>
          </div>

          {/*
            Tallet står som et tall, ikke som en påstand i en setning.
            «5,0» i display-grad ved siden av stjernene leses på et blikk;
            «vi har 5,0 i snitt på Google» må leses som språk og veier
            mindre. Kilden står under, slik at det ikke er Reflektor som
            sier det.
          */}
          <p className="flex shrink-0 items-center gap-5">
            <span
              className="font-[family-name:var(--font-display-serif)] text-[3.25rem] leading-none tracking-[-0.02em]"
              aria-hidden="true"
            >
              {googleProfil.snitt}
            </span>
            <span className="flex flex-col gap-2">
              <Stjerner />
              <span className="text-sm tracking-[0.02em] text-pa-dyp-dempet">
                {googleProfil.antall} anmeldelser på Google
              </span>
            </span>
            <span className="sr-only">
              {googleProfil.snitt} av 5 på Google, basert på{" "}
              {googleProfil.antall} anmeldelser.
            </span>
          </p>
        </div>
        {innslag}

        {/*
        Raden starter på panelets venstre innholdskant og fortsetter ut
        gjennom panelets høyre kant. Den avkuttede kanten ER rulle-
        anvisningen — en gradient eller en pil ville lagt til pynt for å si
        det samme.

        FORENKLET 02.10.2026, da flaten ble et innfelt panel. Her sto
        `pl-[max(1.5rem,calc(50%_-_34.5rem))]` med samme verdi på
        `scroll-padding-left`, og en lang forklaring av hvorfor: raden lå
        den gang utenfor enhver container og måtte regne seg fram til
        containerens venstrekant selv. Nå ligger den INNE i panelet, og
        panelets egen `px` er den kanten. Regnestykket er borte fordi
        behovet er borte.

        `-mr-6 sm:-mr-14` opphever panelets høyre luft, slik at raden når
        helt ut til kanten og blir klippet av `overflow-hidden` og hjørnene.
        `pr-` med samme verdi gir det siste kortet luft når man har rullet
        helt ut — uten den ville det klistret seg til kanten.

        `snap-start` innretter mot rullefeltets snapport. Uten
        `scroll-padding` er den nå lik innholdskanten, som er det vi vil ha.

        `tabIndex` fordi et rullbart felt uten fokuserbart innhold ikke kan
        rulles med tastatur i Chrome. Firefox gjør det av seg selv; Chrome
        gjør det ikke, og da er hele raden utilgjengelig uten mus.
      */}
        <ul
          tabIndex={0}
          aria-label="Anmeldelser hentet fra Google"
          className="
          mt-14 -mr-6 flex snap-x snap-mandatory items-stretch gap-4
          overflow-x-auto pr-6 pb-3 sm:-mr-14 sm:pr-14
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-4 focus-visible:outline-aksent-pa-dyp
        "
        >
          {anmeldelser.map((a) => (
            <li
              key={a.navn}
              className={`flex shrink-0 snap-start flex-col rounded-flate border border-[rgba(245,240,232,0.14)] bg-[rgba(245,240,232,0.10)] p-6 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.06)] ${bredde(a.sitat.length)}`}
            >
              {/*
              GLASSKORT. Fyll på 6 % bone over den brune flaten gir målt
              effektiv bakgrunn #3a2921: bone-tekst 12,19 og dempet tekst
              7,52, altså AAA på begge. `backdrop-blur` er det som gjør det
              til glass — uten uskarpheten er kortet bare en lysere firkant.
              Kanten på 14 % er det øyet leser som glasskant.

              `supports-[backdrop-filter]` senker fyllet der uskarphet
              STØTTES. Der den ikke gjør det, beholdes det kraftigere fyllet,
              slik at kortet fortsatt leser som et kort.
            */}
              <blockquote className="text-[0.9375rem] leading-[1.6] text-pretty">
                {a.sitat}
              </blockquote>
              {/* Attribusjonen skyves til bunnen, slik at navnene står på
                samme høyde i hele raden selv om sitatene er ulikt lange. */}
              <p className="mt-auto pt-6 text-sm tracking-[0.02em]">
                <span className="font-medium">{a.navn}</span>
                {a.selskap && (
                  <span className="block text-pa-dyp-dempet">{a.selskap}</span>
                )}
              </p>
            </li>
          ))}
        </ul>

        {/*
        Bare lenken. Her sto en setning om at ni av elleve har tekst og at
        anmeldelsene dekker både produksjonsoppdrag og månedsavtaler. Pål
        ba om å få den bort: raden skal leses, ikke forklares.

        MERK for den som rydder senere: den setningen var betingelsen Pål
        satte da Orkla-anmeldelsen ble klarert — ingenting skulle villede
        til å tro at Orkla er abonnent. Betingelsen er ikke glemt, den
        hviler nå på overskriften, som sier «fra dem som har hatt oss på
        besøk». Det er et produksjonsoppdrag, ikke et abonnement. Endres
        overskriften, må dette vurderes på nytt.
      */}
        <p className="mt-8 text-sm tracking-[0.02em]">
          <a
            href={googleProfil.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-6 items-center text-aksent-pa-dyp underline decoration-from-font underline-offset-4"
          >
            Se alle anmeldelsene på Google
          </a>
        </p>
      </div>
    </Container>
  );
}
