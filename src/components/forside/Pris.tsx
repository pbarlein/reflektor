import { Enkeltklipp } from "@/components/Arbeidsbilder";
import { Merkelapp } from "@/components/Eyebrow";
import { Container } from "@/components/Container";

import { TbdMarkor, hentTekst } from "@/components/Slot";

import { front } from "@/content/sider/front";
import { tilbud } from "@/content/site";

/**
 * Prisen: ett tilbudskort, og ett ord.
 *
 * BYGGET HELT OM 19.09.2026. Påls bestilling, ordrett: «jeg vil heller at
 * prisseksjonen skal designes helt om, men beholde tallene og videoen.
 * tellene kan stå på en linje. under kan det med stor font stå kontinuitet.
 * som om alle disse faktorene skaper kontinuitet på sosiale medier, hvilket
 * er hovedproblemet vi løser. ikke lag det så fysisk stort på siden. mindre
 * skrolling er bedre.»
 *
 * HVA SOM BLE FORKASTET, OG HVORFOR HAN HAR RETT.
 *
 * Forrige versjon endte med en graf som viste arkivet vokse til «rundt
 * hundre filmer» etter ett år. Pål: «jeg er usikker på om 100 videoer i et
 * arkiv er et godt salgsargument. det høres for mange ut som om man har
 * betalt for for mange videoer.»
 *
 * Det er en skarp observasjon. Stort volum er selgerens argument, ikke
 * kjøperens. Hundre filer i en mappe er en kostnad man har pådratt seg.
 * Det leseren vil ha, er at kontoen ikke står stille — og det er noe helt
 * annet enn å eie mye.
 *
 * GREPET: FAKTORENE ER ET REGNESTYKKE SOM GÅR OPP I ETT ORD.
 *
 * De fire tallene står på én linje. Under dem en strek. Under streken står
 * svaret, og svaret er verken en pris eller et arkiv — det er KONTINUITET.
 * Formen er en sum, men det som summeres er ikke kroner: det er problemet
 * abonnementet faktisk løser.
 *
 * Prisen står under igjen, i én rolig linje. Fortsatt tydelig —
 * prisåpenhet er Reflektors ene dokumenterte posisjonering — men ikke
 * lenger seksjonens største element. Måletallene står i
 * docs/research-arbeidsside.md.
 *
 * ALT I ÉN BLOKK, og det er kompaktheten. Tilbudet, ordet, prisen og hva
 * som inngår lå før i to store deler med luft imellom: 2 508 px på desktop,
 * 3 463 på mobil — en fjerdedel av hele forsiden for én seksjon. Nå er det
 * ett kort. Slik gjør Basecamp og Designjoy det også: pris og innhold i
 * samme blokk, ikke som to kapitler.
 *
 * GLASSFLATEN ER VALGT, ikke arvet. Den er merkevarens egen flate — se
 * .glassflate i globals.css — og gjør to ting her: gir det store ordet noe
 * å gløde mot, og samler seksjonen til én gjenstand i stedet for en stabel.
 */

/**
 * Faktorene som legges sammen. Verdiene leses fra `tilbud`, aldri skrevet
 * inn her — prisen og leveransen står flere steder og skal ikke gli fra
 * hverandre.
 *
 * «52 uker i året» er ikke et nytt løfte: det står i FAQ-svaret om ferier og
 * i prinsippene på /om-oss. Her er det faktoren som gjør de tre andre til
 * noe som varer.
 *
 * MYKE BINDESTREKER (U+00AD) i de to lange ordene. På en 390 px skjerm er
 * spalten 80 px og «produksjonsdag» måler 89. Delepunktene er
 * deterministiske; `hyphens: auto` krever en ordbok nettleseren ikke alltid
 * har, og de er usynlige når ordet får plass.
 */
const FAKTORER = [
  [tilbud.produksjonsdagerPerManed, "pro­duk­sjons­dag", "i måneden"],
  [tilbud.videoerPerManed, "videoer", "hver måned"],
  [tilbud.posterPerUke, "pu­bli­se­rin­ger", "i uken"],
  [52, "uker", "i året"],
] as const;

export function Pris() {
  return (
    /* id="pris" er målet for menypunktet «Pris». Se navigasjon.ts for
       hvorfor det peker hit og ikke på /sosiale-medier-byra. */
    <section id="pris" className="scroll-mt-4 pb-24 sm:pb-32">
      <Container>
        <div className="glassflate rounded-medie px-6 py-10 text-pa-dyp sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <Merkelapp variant="dyp" som="h2">
            {hentTekst(front, "front.price.eyebrow") ?? "Pris"}
          </Merkelapp>

          {/*
            KLIPPET SPENNER HELE TILBUDET, ikke bare båndet under streken.

            Et forsøk la det i raden under sumstreken. Et 9:16-klipp i en
            14 rem spalte er 394 px høyt, mens teksten ved siden av er rundt
            220 — og da sto 175 px tomt midt i kortet. Det er samme feil som
            kostet en runde i forrige versjon av seksjonen.

            Nå setter VENSTRE SPALTE høyden: faktorer, strek, svar og pris
            til sammen. Klippet fyller den med `h-full` og lander av seg
            selv tett opp mot 9:16. Dødplass kan ikke oppstå, uansett hvor
            lang copyen blir.
          */}
          <div className="lg:grid lg:grid-cols-[1fr_15rem] lg:items-stretch lg:gap-14">
            <div>
              {/* FAKTORENE PÅ ÉN LINJE. Fire på rad fra sm, to og to under. */}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:mt-10 sm:grid-cols-4 sm:gap-x-10">
                {FAKTORER.map(([tall, ord, nar]) => (
                  <div key={ord}>
                    <dt className="sr-only">{`${ord} ${nar}`}</dt>
                    <dd>
                      <span className="display block text-[2.5rem] leading-none tabular-nums sm:text-[3rem] lg:text-[3.5rem]">
                        {tall}
                      </span>
                      <span className="mt-2.5 block hyphens-auto text-[0.8125rem] leading-snug tracking-[0.02em] text-pa-dyp-dempet sm:text-sm">
                        {ord}
                        <br />
                        {nar}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              {/*
                STREKEN ER SUMSTREKEN. Alt over er faktorer, alt under er
                svaret. Vanlig hårstrek og ikke tykkere: en tykk strek ville
                lest som en seksjonsdeler i stedet for et regnetegn.
              */}
              <div className="mt-9 border-t border-[color:var(--kant-pa-dyp)] pt-9 sm:mt-10 sm:pt-10">
                {/*
                  SVARET. Ett ord, satt så stort som flaten tåler.

                  `leading-[0.85]` fordi Instrument Serif har rikelig luft
                  innebygd; i display-grad blir standard linjeavstand til et
                  hull over underteksten.

                  Gradene er valgt så ordet fyller spalten uten å brekke på
                  noen skjerm — målt på 320, 360, 390, 414 og 1440.
                */}
                <p className="display text-[2.75rem] leading-[0.85] tracking-[-0.035em] sm:text-[4.25rem] lg:text-[6.5rem]">
                  Kontinuitet
                </p>
                <p className="mt-3 text-[1.0625rem] text-pretty text-pa-dyp-dempet sm:mt-4 sm:text-xl">
                  i sosiale medier — hver uke, hele året.
                </p>

                {/*
                  PRISEN, i én rolig linje. Fortsatt tydelig: 30 000 står i
                  display-grad, og prisåpenhet er den ene posisjoneringen
                  Reflektor har dokumentert. Men den er ikke lenger
                  seksjonens største element, og det er hele rettelsen.
                */}
                <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[color:var(--kant-pa-dyp)] pt-6 sm:mt-10 sm:pt-7">
                  <span className="display text-[2rem] leading-none tabular-nums sm:text-[2.5rem]">
                    {tilbud.prisPerManed.toLocaleString("nb-NO")}
                  </span>
                  <span className="text-[0.9375rem] tracking-[0.02em] text-pa-dyp-dempet">
                    kr/mnd
                  </span>
                  <span
                    aria-hidden
                    className="px-1 text-pa-dyp-dempet/60 select-none"
                  >
                    ·
                  </span>
                  <span className="text-[1.0625rem] text-pretty">
                    {hentTekst(front, "front.price.h2") ?? (
                      <TbdMarkor id="front.price.h2" />
                    )}
                  </span>
                </p>
              </div>
            </div>

            {/*
              Klippet er beholdt etter bestilling, og står som et loddrett
              anker i høyrespalten gjennom hele tilbudet.

              Under lg ligger det OVER teksten i et bredt, roligere format.
              Der har det ingen høyde å matche, og et stående klipp ville
              dyttet ordet langt ned på skjermen.
            */}
            <Enkeltklipp
              sti="/reels"
              medie={{
                type: "video",
                fil: "egon",
                alt: "Klipp fra Reflektor x Egon: servering og gjester",
              }}
              className="relative order-first mt-8 aspect-[16/9] overflow-hidden rounded-flate bg-[rgba(245,240,232,0.06)] sm:aspect-[21/9] lg:order-none lg:mt-0 lg:aspect-auto lg:h-full"
            />
          </div>

          {/*
            DETTE INNGÅR — i samme kort, som en tett liste med hårstreker i
            stedet for åtte glasskort.

            Kortene var 1 264 px på desktop og 1 690 på mobil. Som liste er
            den under 300. Innholdet er uendret; det var formen som kostet.
            Et kort per punkt sier «dette er åtte ting»; en liste sier
            «dette er én leveranse med åtte deler», og det siste er sant.

            To spalter fra sm, og rekkefølgen flyter NEDOVER spaltene og
            ikke bortover — den som leser en tospaltet liste nedover skal
            ikke få 1, 3, 5.
          */}
          <div className="mt-10 border-t border-[color:var(--kant-pa-dyp)] pt-8 sm:mt-12 sm:pt-10">
            <Merkelapp variant="dyp">Dette inngår</Merkelapp>
            <ul className="mt-5 grid gap-x-12 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
              {tilbud.inngar.map((punkt, i) => (
                <li
                  key={punkt}
                  className="flex gap-4 border-b border-[color:var(--kant-pa-dyp)]/60 py-3.5 last:border-b-0 sm:[&:nth-child(3)]:border-b-0"
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
            */}
            <p className="mt-5 rounded-flate border border-dashed border-[color:var(--kant-pa-dyp)]/70 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
              {tilbud.stillbilder}
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
