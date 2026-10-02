import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
import { Omtalevideo } from "@/components/Omtalevideo";
import { TbdMarkor, hentTekst, slotsISeksjon } from "@/components/Slot";
import { front } from "@/content/sider/front";
import { tilbud } from "@/content/site";

/**
 * Leveransen: hva vi gjør, i rekkefølge, og hva som ligger i den.
 *
 * SEKSJONEN ER NY 02.10.2026, men innholdet er ikke. Den er to gamle
 * seksjoner slått sammen, og sammenslåingen er svaret på et spørsmål Pål
 * stilte: «er Slik jobber vi egentlig nødvendig? slett om den ikke bringer
 * verdi, eller finn en lur måte å fjerne den på uten å miste verdi.»
 *
 * DEN BRAKTE VERDI, MEN SA DET SAMME TO GANGER. De tre stegene og de seks
 * punktene er samme leveranse i to registre:
 *
 *   «Vi planlegger»            ≈ «Produksjon av SoMe-strategi og
 *                                 produksjonsplaner»
 *   «Vi filmer én dag»         ≈ «Én produksjonsdag per måned hos dere»
 *   «Vi klipper og publiserer» ≈ «8–10 videoer ferdig redigert» +
 *                                «Publisering til Instagram 2 ganger i uken»
 *
 * Nå står de som én ting: stegene er fortellingen, punktene er
 * spesifikasjonen av den.
 *
 * KOMPRIMERT SAMME KVELD, andre bestilling fra Pål: «Gjør hele "slik jobber
 * vi"-seksjonen mye lavere. finn en smart måte å komprimere og forkorte
 * betydelig, slik at hva som inngår og hva som ikke inngår kommer frem med
 * mye mindre tekst. husk at det er viktig å ivareta SEO og AEO.»
 *
 * DE TO KRAVENE TREKKER HVER SIN VEI. Mindre tekst er færre ord på siden;
 * SEO og AEO lever av ord. Grepet som gir begge: **mennesker får den korte
 * utgaven, maskiner får den lange.**
 *
 * - De seks punktene vises fra `tilbud.inngarKort`, én linje hver.
 *   `tilbud.inngar` er uendret og ligger fortsatt i JSON-LD-en på forsiden
 *   som `hasOfferCatalog.itemListElement` — se Schema.tsx. Alt som er
 *   strøket visuelt («hos dere, hos oss eller ute på lokasjon», «med
 *   krysspublisering til Facebook», «annonser, nettsider, skjermer,
 *   presentasjoner») står ordrett i markeringen, som er nettopp det
 *   språkmodeller leser.
 * - De tre stegene er kortet i selve slotsene, og hvert ord som er strøket
 *   står et annet sted på samme side. Begrunnelsen punkt for punkt ligger i
 *   front.ts.
 * - Glasskassene rundt hvert punkt er borte. Seks kasser kostet 264 px i
 *   ren padding og mellomrom — mer enn teksten de rammet inn. Hårstrek og
 *   løpenummer gjør samme jobb for 0.
 *
 * DET SOM IKKE ER RØRT: Påls to merknader står i full lengde. `stillbilder`
 * bærer forbeholdet «8–10 et produksjonsmål og ikke en garanti», som
 * AGENTS.md sier ikke skal mykes opp, og `bruksrett` er setningen som
 * rettet opp at Google AI Mode leste leveransen som en begrensning. Begge
 * er korte nok fra før.
 *
 * FILMEN ER EN PRODUKSJONSDAG HOS RUSSEMERCH, og den er hele poenget med
 * høyrespalten. Steg to sier «vi kommer til dere og filmer alt på én dag».
 * Klippet viser det i stedet for å be om at det tros.
 *
 * DEN HAR LYDKNAPP OG IKKE STUM AUTOSPILL. Bestilt av Pål: «Videoen til
 * russemerch skal ha samme "skru på lyd"-knapp som soul cake sin video.»
 * Derfor `Omtalevideo` og ikke `Klipp` — se den komponenten for hvorfor
 * mellomløsningen er riktig for en film som har noe å si.
 *
 * KUNDEN ER NAVNGITT, OG DET ER NYTT. En tidligere utgave av denne fila
 * klippet bort den innbrente «REFLEKTOR X RUSSEMERCH»-plakaten, fordi en
 * navngitt kunde i abonnementets spesifikasjonsseksjon ville lest som at
 * kunden ER abonnent — forbudt i AGENTS.md for PRODUKSJONSKUNDER. Pål
 * bekreftet 02.10.2026 at Russemerch faktisk er abonnementskunde. Da er
 * påstanden sann, og hele filmen kan stå som den er levert.
 *
 * FLATEN ER `bg-dyp` OG IKKE `glassflate`. Priskortet har glassflaten med
 * de oransje radialene, og det skal være det ene stedet på forsiden som har
 * den.
 */

export function DetteInngar() {
  const steg = slotsISeksjon(front, 3).filter((s) => s.id.includes("steps"));

  return (
    <section id="inngar" className="scroll-mt-4 pb-20 sm:pb-28">
      <Container>
        {/*
          INGEN `overflow-hidden` PÅ KORTET. Det ser ut som en detalj og er
          det ikke: et <video> under to lag avrundet `overflow-hidden`
          slutter å tegne seg i WebKit mens lyden går videre. Det kostet tre
          forsøk å finne i anmeldelsesseksjonen 02.10.2026. Avspilleren har
          sin egen klipping; kortet skal ikke legge en til.
        */}
        <div className="rounded-medie bg-dyp px-6 py-10 text-pa-dyp sm:px-12 sm:py-12 lg:px-14">
          {/*
            FILMEN STÅR VED SIDEN AV FORTELLINGEN, ikke ved siden av
            spesifikasjonen. Venstre spalte — eyebrow, overskrift og tre
            steg — måler rundt 350 px på desktop, og et 4:5-klipp i en
            17 rem spalte er 340. De flukter, og dødplass kan ikke oppstå.

            Under lg ligger klippet UNDER stegene. Da leser mobilen
            overskrift → tre steg → film → spesifikasjon, og filmen blir
            pusten mellom fortellingen og listen i stedet for en blokk før
            første ord.
          */}
          <div className="lg:grid lg:grid-cols-[1fr_17rem] lg:items-start lg:gap-12">
            <div>
              <Eyebrow variant="dyp">
                {hentTekst(front, "front.how.eyebrow")}
              </Eyebrow>
              <h2 className="mt-4 max-w-xl text-[1.875rem] leading-[1.05] tracking-[-0.02em] text-balance sm:text-[2.5rem] lg:text-[2.75rem]">
                {hentTekst(front, "front.how.h2") ?? (
                  <TbdMarkor id="front.how.h2" />
                )}
              </h2>

              {/*
                TITTELEN LIGGER PÅ SAMME LINJE SOM TEKSTEN. Den sto som en
                egen <h3> over avsnittet og kostet en linje per steg uten å
                si noe linjen under ikke sier.

                <h3> ER BEHOLDT, bare satt `inline`. Et overskriftselement
                som flyter i teksten er fortsatt en overskrift for
                skjermleser og for søk — det er bare visningen som er
                endret. Å bytte den mot en <strong> ville spart like mye
                plass og kostet tre overskrifter i dokumentstrukturen.
              */}
              <ol className="mt-8 sm:mt-9">
                {steg.map((slot, i, alle) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  const sist = i === alle.length - 1;
                  return (
                    <li
                      key={slot.id}
                      className="relative pb-5 pl-11 last:pb-0 sm:pb-6"
                    >
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 flex size-7 items-center justify-center rounded-full border border-[color:var(--kant-pa-dyp)] font-[family-name:var(--font-display-serif)] text-[0.9375rem] leading-none text-aksent-pa-dyp"
                      >
                        {i + 1}
                      </span>
                      {/*
                        Streken stopper på siste steg. Den peker framover,
                        og etter det siste er det ingenting å peke på.
                      */}
                      {!sist && (
                        <span
                          aria-hidden
                          className="absolute top-9 bottom-1 left-[0.84375rem] w-px bg-[color:var(--kant-pa-dyp)]"
                        />
                      )}
                      {delt ? (
                        /*
                          <div> OG IKKE <p>. En <h3> inne i en <p> er
                          ugyldig HTML — nettleseren lukker avsnittet foran
                          overskriften og etterlater et tomt <p> — og det
                          er ikke synlig i React, bare i den parsede
                          DOM-en. Teksten flyter likt uansett.
                        */
                        <div className="text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
                          <h3 className="inline font-sans text-[0.9375rem] font-medium text-pa-dyp">
                            {delt[0].trim()}.
                          </h3>{" "}
                          {delt.slice(1).join("|").trim()}
                        </div>
                      ) : (
                        <TbdMarkor id={slot.id} />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/*
              `mt-8 lg:mt-0` og ingen egen ramme: Omtalevideo setter selv
              `aspect-[4/5]`, avrunding og flate.
            */}
            <figure className="mt-8 lg:mt-0">
              <Omtalevideo
                sti="/arbeid/russemerch/produksjonsdag"
                alt="Bak kulissene fra en produksjonsdag hos Russemerch"
              />
              {/*
                BILDETEKSTEN SIER AT KUNDEN ER ABONNENT, og det er bestilt:
                «russemerch er en kunde på abonnement, så ta med hele
                videoen, skriv gjerne metatekst som fremkommer under videoen
                at de er det.»

                Den gjør to ting på én linje. Den navngir en abonnent — det
                eneste stedet på forsiden hvor en kunde faktisk kan navngis
                som det — og den forklarer hva man ser, slik at filmen ikke
                bare er en flate med bevegelse.

                KORTET NED ETTER MÅLING: den første utgaven var fire linjer
                i en 17 rem spalte og gjorde høyrespalten 100 px høyere enn
                venstre. Da sto det et hull under siste steg. Tre linjer
                flukter.
              */}
              <figcaption className="mt-3 text-sm leading-relaxed text-pretty text-pa-dyp-dempet">
                Fra en produksjonsdag hos Russemerch, abonnementskunde.
              </figcaption>
            </figure>
          </div>

          {/*
            SPESIFIKASJONEN. To spalter fra sm: «Dette inngår» til venstre i
            dobbel bredde, «Inngår ikke» til høyre i enkel.

            FORHOLDET 2:1 ER IKKE TILFELDIG — se research-konvertering.md om
            blemishing-effekten: negativ informasjon løfter inntrykket bare
            når den er liten, perifer og kommer etter det positive. Den sto
            som en egen rad under hele listen før; ved siden av er den
            mindre, og man ser med én gang at kolonnen til venstre er
            dobbelt så lang.
          */}
          <div className="mt-9 border-t border-[color:var(--kant-pa-dyp)] pt-8 sm:mt-10 sm:pt-9">
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
              <div className="sm:col-span-2">
                <Merkelapp variant="dyp">Dette inngår</Merkelapp>
                {/*
                  HÅRSTREK OG LØPENUMMER, ikke seks glasskasser. Kassene kom
                  inn 27.09.2026 fordi en rad hårstreker på mørk flate ga
                  øyet ingen holdepunkter — riktig observasjon den gangen,
                  da punktene var tre linjer lange hver.

                  Nå er de én linje. Et løpenummer i aksentfarge til venstre
                  er holdepunkt nok, og kassene kostet 264 px i padding og
                  mellomrom — mer enn teksten de rammet inn.

                  Løpenummer og ikke hake: en hake sier «SaaS-prisplan», og
                  det var komponenten som utløste «AI-preget» i en tidligere
                  runde. Et nummer sier spesifikasjon.
                */}
                <ul className="mt-4">
                  {tilbud.inngarKort.map((punkt, i) => (
                    <li
                      key={punkt}
                      className="flex gap-3.5 border-b border-[color:var(--kant-pa-dyp)] py-2.5 last:border-0"
                    >
                      <span
                        aria-hidden
                        className="display shrink-0 pt-px text-[0.8125rem] tabular-nums text-aksent-pa-dyp"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.9375rem] leading-snug text-pretty">
                        {punkt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Merkelapp variant="dyp">Inngår ikke</Merkelapp>
                <ul className="mt-4">
                  {tilbud.inngarIkke.map((punkt) => (
                    <li
                      key={punkt}
                      className="border-b border-[color:var(--kant-pa-dyp)] py-2.5 text-[0.9375rem] leading-snug text-pretty text-pa-dyp-dempet last:border-0"
                    >
                      {punkt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/*
              PÅLS TO MERKNADER, i full lengde og uten ramme rundt.

              `stillbilder` står som merknad og ikke som et sjuende punkt:
              de seks er fast leveranse, stillbilder er «ved behov», og et
              likt punkt ville lest som et likt løfte. Setningen bærer
              dessuten forbeholdet «8–10 et produksjonsmål og ikke en
              garanti», som er hans eget og ikke skal mykes opp.

              `bruksrett` svarer på et spørsmål punktene reiser uten å
              besvare: punkt fire sier hvor VI publiserer, ikke hva kunden
              kan gjøre med filene. Google AI Mode leste det som en
              begrensning og strøk Reflektor fra svaret da en kjede spurte.

              GLASSKASSENE RUNDT DEM ER BORTE sammen med kassene over. En
              tynn strek over og 15 px tekst gjør samme jobb; rammene la 64
              px til en seksjon som skulle bli lavere.

              `max-w-3xl` er ikke pynt. Over hele kortets bredde måler
              merknaden 90 tegn per linje, og løpende tekst leses best
              mellom 45 og 75.
            */}
            <div className="mt-7 grid max-w-3xl gap-2 border-t border-[color:var(--kant-pa-dyp)] pt-6 text-[0.875rem] leading-relaxed text-pretty text-pa-dyp-dempet sm:mt-8">
              <p>{tilbud.stillbilder}</p>
              <p>{tilbud.bruksrett}</p>
              <p>
                {hentTekst(front, "front.price.note") ?? (
                  <TbdMarkor id="front.price.note" />
                )}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
