import { Enkeltklipp } from "@/components/Arbeidsbilder";
import { Container } from "@/components/Container";
import { Eyebrow, Merkelapp } from "@/components/Eyebrow";
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
 * De sto 575 px fra hverandre på desktop, i hver sin mørke blokk, med
 * priskortet imellom. Leseren fikk den samme opplysningen to ganger uten å
 * få vite at det var den samme.
 *
 * NÅ STÅR DE SOM ÉN TING: stegene er fortellingen, punktene er
 * spesifikasjonen av den. Ingen copy er fjernet, ingen er skrevet ny.
 * Seksjonen «Slik jobber vi» finnes ikke lenger som egen seksjon, og
 * SlikFungererDet.tsx er slettet.
 *
 * FILMEN ER EN PRODUKSJONSDAG, og det er hele grunnen til at den står her.
 * Steg to sier «vi kommer til dere og filmer alt til 8–10 videoer på én
 * dag». Klippet viser nettopp det — fotograf med kamera, lokasjon, folk
 * som gjør jobben sin — i stedet for å be om at det tros.
 *
 * KLIPPET HAR INGEN KUNDEMERKING, og det er et valg og ikke en tilfeldighet.
 * Masteren åpner med en innbrent «REFLEKTOR X RUSSEMERCH»-plakat. Den er
 * klippet bort. En navngitt kunde i abonnementets spesifikasjonsseksjon
 * ville lest som at kunden ER abonnent, og det er uttrykkelig forbudt i
 * AGENTS.md. Det som står igjen er vårt eget team i arbeid, som ikke påstår
 * noe om noen.
 *
 * FLATEN ER `bg-dyp` OG IKKE `glassflate`. Priskortet har glassflaten med
 * de oransje radialene, og det skal være det ene stedet på forsiden som har
 * den. To glassflater med én bildeseksjon imellom hadde lest som at man var
 * tilbake i samme kort.
 */

/**
 * Et steg i rekkefølgen.
 *
 * TIDSLINJA GJELDER NÅ PÅ ALLE BREDDER. I den nedlagte seksjonen fantes den
 * bare under md; fra md overtok tre spalter med loddrette hårstreker. Tre
 * spalter krever full bredde, og den har ikke denne kolonnen — filmen står
 * i spalten ved siden av. Tidslinja var dessuten den beste av de to: den
 * viser rekkefølgen i stedet for å forklare den, og den koster ikke en
 * linje per steg til et nummer på egen linje.
 */
function Steg({
  nummer,
  tittel,
  tekst,
  sist,
}: {
  nummer: number;
  tittel: string;
  tekst: string;
  sist: boolean;
}) {
  return (
    <li className="relative pb-8 pl-14 last:pb-0 sm:pb-9">
      <span
        aria-hidden
        className="absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border border-[color:var(--kant-pa-dyp)] font-[family-name:var(--font-display-serif)] text-lg leading-none text-aksent-pa-dyp"
      >
        {nummer}
      </span>
      {/*
        Streken stopper på siste steg. Den peker framover, og etter det
        siste er det ingenting å peke på.
      */}
      {!sist && (
        <span
          aria-hidden
          className="absolute top-11 bottom-2 left-[1.125rem] w-px bg-[color:var(--kant-pa-dyp)]"
        />
      )}
      <h3 className="text-lg font-medium">{tittel}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet md:text-base">
        {tekst}
      </p>
    </li>
  );
}

export function DetteInngar() {
  const steg = slotsISeksjon(front, 3).filter((s) => s.id.includes("steps"));

  return (
    <section id="inngar" className="scroll-mt-4 pb-24 sm:pb-32">
      <Container>
        {/*
          INGEN `overflow-hidden` PÅ KORTET. Det ser ut som en detalj og er
          det ikke: et <video> under to lag avrundet `overflow-hidden`
          slutter å tegne seg i WebKit mens lyden går videre. Det kostet tre
          forsøk å finne i anmeldelsesseksjonen 02.10.2026. Klippet har sin
          egen klipping; kortet skal ikke legge en til.
        */}
        <div className="rounded-medie bg-dyp px-6 py-12 text-pa-dyp sm:px-12 sm:py-14 lg:px-14">
          {/*
            TO SPALTER, OG HØYDEN SETTES AV VENSTRE. Samme oppskrift som
            priskortet: eyebrow, overskrift og tre steg til sammen er rundt
            450 px på desktop, og et 9:16-klipp i en 18 rem spalte er 512.
            Klippet fyller med `lg:h-full` og lander av seg selv på
            formatet, så dødplass ikke kan oppstå uansett hvor lang copyen
            blir.

            Under lg ligger klippet UNDER stegene og ikke over. Da leser
            mobilen overskrift → tre steg → film → spesifikasjon, og filmen
            blir pusten mellom fortellingen og listen i stedet for en 500 px
            høy blokk før første ord.
          */}
          <div className="lg:grid lg:grid-cols-[1fr_18rem] lg:items-stretch lg:gap-14">
            <div>
              <Eyebrow variant="dyp">
                {hentTekst(front, "front.how.eyebrow")}
              </Eyebrow>
              {/*
                OVERSKRIFTEN ER SATT STØRRE ENN DEN VAR. Den sto som
                `text-3xl sm:text-4xl` i en seksjon som bare hadde den; her
                er den seksjonens eneste store element og bærer både stegene
                og listen under. `overstyringer.css` gir h2 display-serifen,
                så graden er alt som trengs.
              */}
              <h2 className="mt-5 max-w-xl text-[2.125rem] leading-[1.02] tracking-[-0.02em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
                {hentTekst(front, "front.how.h2") ?? (
                  <TbdMarkor id="front.how.h2" />
                )}
              </h2>

              <ol className="mt-8 sm:mt-10">
                {steg.map((slot, i, alle) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  if (!delt) {
                    return (
                      <li key={slot.id} className="pb-8 last:pb-0">
                        <TbdMarkor id={slot.id} />
                      </li>
                    );
                  }
                  return (
                    <Steg
                      key={slot.id}
                      nummer={i + 1}
                      tittel={delt[0].trim()}
                      tekst={delt.slice(1).join("|").trim()}
                      sist={i === alle.length - 1}
                    />
                  );
                })}
              </ol>
            </div>

            {/*
              TRE FORMATER, ETT KLIPP. Kilden er 9:16, og i full spaltebredde
              på en 390 px telefon ville den blitt 693 px høy — en og en halv
              skjerm film midt i en seksjon som skal forklare noe. Kvadratet
              gir 294 og beskjærer til midten, der motivet står hele veien.
              Fra sm er spalten bredere og 3:4 får plass. Fra lg slippes
              formatet helt: der er det venstre spalte som setter høyden, og
              klippet fyller den med `h-full` og lander av seg selv tett opp
              mot 9:16.

              Priskortet gjør det samme med Egon-klippet, med 16:9 og 21:9 på
              de to smaleste bredden. Her er kvadratet valgt i stedet fordi
              motivet er en person i helfigur, ikke et bord sett ovenfra.
            */}
            <Enkeltklipp
              sti="/arbeid"
              medie={{
                type: "video",
                fil: "russemerch",
                alt: "Klipp fra en produksjonsdag: fotograf i arbeid på lokasjon",
              }}
              className="relative mt-8 aspect-square overflow-hidden rounded-flate bg-[rgba(245,240,232,0.06)] sm:aspect-[3/4] lg:mt-0 lg:aspect-auto lg:h-full"
            />
          </div>

          {/*
            SPESIFIKASJONEN. Alt under hårstreken sto i priskortet til
            02.10.2026 og er flyttet hit ordrett — markup, klasser og
            begrunnelser. Det eneste som er endret er at den nå står under
            stegene i stedet for under prisen.
          */}
          <div className="mt-10 border-t border-[color:var(--kant-pa-dyp)] pt-8 sm:mt-12 sm:pt-10">
            <Merkelapp variant="dyp">Dette inngår</Merkelapp>
            {/*
              GLASSFLATER I STEDET FOR HÅRSTREKER, 27.09.2026. Pål: «oppfattes
              litt tungt å lese … kan vi ramme inn punktene i en glass-look
              som anmeldelsene».

              Han har rett i observasjonen. Seks like tunge linjer skilt av
              hårstreker på en mørk flate gir ingen holdepunkter — øyet finner
              ikke starten på neste punkt, og hele blokken leses som én masse.

              MEN LISTEN BESTÅR. Dette var kort én gang, og de ble gjort om
              til liste med vilje: kortene målte 1 264 px på desktop og 1 690
              på mobil, og «et kort per punkt sier dette er seks ting, en
              liste sier én leveranse med seks deler». Det argumentet står
              fortsatt — også nå som seksjonen er egen og har plass. Det var
              aldri et plassargument.

              Derfor glass på RADENE, ikke kort. Hvert punkt blir en egen
              flate å feste blikket på, men de ligger fortsatt tett i to
              spalter og leses som én leveranse. Samme oppskrift som
              anmeldelseskortene, så flatene hører hjemme i samme språk.

              To spalter fra sm, og rekkefølgen flyter NEDOVER spaltene og
              ikke bortover — den som leser en tospaltet liste nedover skal
              ikke få 1, 3, 5.
            */}
            <ul className="mt-5 grid gap-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-5">
              {tilbud.inngar.map((punkt, i) => (
                <li
                  key={punkt}
                  className="flex gap-4 rounded-flate border border-[rgba(245,240,232,0.14)] bg-[rgba(245,240,232,0.10)] px-5 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.06)]"
                >
                  {/*
                    Løpenummer og ikke hake. En hake sier «SaaS-prisplan» —
                    det var komponenten som utløste «AI-preget» i en
                    tidligere runde. Et nummer sier spesifikasjon, og gjør
                    omfanget tellbart.
                  */}
                  <span
                    aria-hidden
                    className="display shrink-0 text-[0.9375rem] tabular-nums text-aksent-pa-dyp"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-pretty">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>

            {/*
              Stillbilder står som egen merknad og ikke som et sjuende
              punkt. Forskjellen er ikke kosmetisk: de seks er fast
              leveranse, stillbilder er «ved behov», og et likt punkt ville
              lest som et likt løfte. Se `tilbud.stillbilder` i site.ts for
              Påls instruks ordrett.

              `max-w-3xl` er ikke pynt. Merknaden gikk over hele kortets
              bredde og målte 90 tegn per linje. Løpende tekst leses best
              mellom 45 og 75 tegn — over det mister øyet linjestarten på vei
              tilbake. 768 px gir 69 her.

              Samme glass som punktene, men med svakere fyll. Her sto en
              STIPLET ramme, og stiplet leser som «midlertidig» eller
              «plassholder» — den motsatte beskjeden av det merknaden gir.
              Et dusere glass sier «hører til, men er ikke et av de seks».
            */}
            <p className="mt-5 max-w-3xl rounded-flate border border-[rgba(245,240,232,0.10)] bg-[rgba(245,240,232,0.05)] px-5 py-4 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.03)]">
              {tilbud.stillbilder}
            </p>

            {/*
              ANDRE MERKNAD, LAGT TIL 29.09.2026. Den svarer på et spørsmål
              punktene over reiser uten å besvare: punkt fire sier hvor VI
              publiserer, og sier ingenting om hva kunden kan gjøre med
              filene.

              Google AI Mode leste det som en begrensning og strøk Reflektor
              fra svaret da en kjede spurte. Setningen retter ikke opp punkt
              fire — det står som det står, og er låst — den legger til det
              som manglet. Se `tilbud.bruksrett` i site.ts.
            */}
            <p className="mt-3 max-w-3xl rounded-flate border border-[rgba(245,240,232,0.10)] bg-[rgba(245,240,232,0.05)] px-5 py-4 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.03)]">
              {tilbud.bruksrett}
            </p>

            {/*
              «Inngår ikke» skal være en LITEN dose — se
              research-konvertering.md om blemishing-effekten: negativ
              informasjon løfter inntrykket bare når den er liten, perifer
              og kommer etter det positive. Derfor deler de to bredden 1:2.
            */}
            <div className="mt-8 grid gap-6 text-[0.9375rem] leading-relaxed sm:mt-9 lg:grid-cols-3 lg:gap-10">
              <p className="text-pa-dyp-dempet">
                <span className="mb-1 block font-sans text-xs font-medium tracking-[0.08em] uppercase">
                  Inngår ikke
                </span>
                {/*
                  Punktene er skrevet med stor forbokstav hver for seg, fordi
                  de tidligere sto etter en innledning. Nå danner de sin egen
                  setning, og da må alle ned bortsett fra den første.
                */}
                {((t) => t.charAt(0).toUpperCase() + t.slice(1))(
                  tilbud.inngarIkke.join(", ").toLowerCase(),
                )}
                .
              </p>
              <p className="text-pretty lg:col-span-2">
                <span className="mb-1 block font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                  Vilkår
                </span>
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
