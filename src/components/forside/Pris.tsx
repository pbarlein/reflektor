import { Enkeltklipp } from "@/components/Arbeidsbilder";
import { Merkelapp } from "@/components/Eyebrow";
import { Container } from "@/components/Container";

import { TbdMarkor, hentTekst } from "@/components/Slot";

import { front } from "@/content/sider/front";
import { tilbud } from "@/content/site";

/**
 * Prisen: spesifikasjonsark på beige, glasspanel under.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */

function Rad({
  merkelapp,
  children,
}: {
  merkelapp: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-x-10 gap-y-5 border-t border-kant py-9 sm:py-11 lg:grid-cols-[9rem_1fr]">
      <Merkelapp className="lg:pt-1.5">{merkelapp}</Merkelapp>
      <div>{children}</div>
    </div>
  );
}
export function Pris() {
  return (
    <>
      {/* id="pris" er målet for menypunktet «Pris». Se navigasjon.ts for
        hvorfor det peker hit og ikke på /sosiale-medier-byra. */}
      {/*
      4 · PRIS — bygget om 16.09.2026 fordi den leste som generert.

      DIAGNOSEN, MED TALL. Den gamle versjonen var 14 stablede blokker med
      8 ulike typografiske grader (3xl, 4xl, 5xl, 1,0625rem, 8,5rem, lg,
      sm, xs). Hver blokk hadde samme form: etikett, overskrift, innhold.
      To eyebrow-er i samme seksjon. Og en hakeliste, som er den mest
      maltypiske komponenten som finnes — jeg la den inn selv i forrige
      runde, og det var den som utløste reaksjonen.

      Det er ikke innholdet som leser som mal. Det er den JEVNE TRAPPEN av
      typografiske grader og de like rektanglene i stabel. Referansene jeg
      hentet ned og så på — Designjoy, Basecamp, Linear, Bakken & Bæck —
      har det motsatte: ekstrem kontrast mellom FÅ grader. Designjoy har i
      praksis to, en overskrift på rundt 100 px og brødtekst på 16.

      GREPET: seksjonen er ett spesifikasjonsark, ikke elleve moduler.

      En smal etikettskinne til venstre bærer alle merkelappene, og
      innholdet står i den brede spalten. Det er et redaksjonelt grep —
      datablad, kolofon, teknisk spesifikasjon — og det er ærlig mot
      innholdet, for dette ER en spesifikasjon. Tre ting følger av det:

      - Den gjentatte «eyebrow → h2 → innhold»-formen forsvinner, fordi
        merkelappene blir et system i stedet for en komponent som gjentas.
      - Asymmetrien blir ekte (9rem mot resten), ikke 50/50 eller 60/40.
      - Radskillene går tvers over begge spaltene, så seksjonen leser som
        ÉN ting.

      TYPOGRAFIEN. Jeg skrev først at den var kuttet «fra åtte grader til
      fire». Det holdt ikke da jeg målte det: seksjonen rendrer 176, 56,
      28, 20, 17, 15 og 13 px på 1440 — sju grader, ikke fire. Fire er
      antallet ROLLER (display, overskrift, brødtekst, merkelapp), og
      roller er ikke grader.

      Det som faktisk er endret, er AVSTANDEN mellom dem. Før gikk
      skalaen i jevne trinn; nå er spranget fra display til brødtekst
      10,4x (176/17) mot 8x før, og alt annet enn tallene ligger i et
      smalt bånd på 13-20 px. Tallet er gjort større, ikke mindre — når
      gradene er få og langt fra hverandre, leser skalaen som satt.

      HAKENE ER UTE. Hårstrek mellom punktene i stedet. En hake sier
      «SaaS-prisplan»; en hårstrek sier «spesifikasjon».

      «Tre måneders oppsigelse» sto BÅDE ved prisen og i vilkårslinja.
      Dublett fjernet — den står i vilkårsraden, der den hører hjemme.
    */}
      <section id="pris" className="scroll-mt-4 pb-28 sm:pb-36">
        <Container>
          <div className="border-b border-kant">
            {/*
            RAD 1 — PRIS. Tallet, løftet, omfanget og klippet i samme rad.

            Omfang var en egen rad. Den er slått sammen hit, og det løser et
            hull jeg selv laget: et stående klipp er alltid høyere enn to
            linjer tekst. Klippet er 330 px, tallet og overskriften 201, og
            de 129 px i forskjell sto tomme — først over tallet, som løsnet
            det fra hårstreken, siden under overskriften. Nå fyller
            nøkkeltallene dem, og venstrespalten møter klippet på 1 px.

            Sammenslåingen er også riktig lest: «30 000 kr/mnd» og «1 dag,
            8–10 videoer, 2 publiseringer» er det samme utsagnet. Delt i to
            rader måtte man holde tallet i hodet mens man leste hva det
            dekker.
          */}
            <Rad merkelapp="Pris">
              {/*
                BYGGET OM 19.09.2026. Pål: «prisen er uforholdsmessig stor i
                forhold til hva kunden får for prisen», og «det kunne vært
                noe mer struktur i presentasjonen av tallene». Begge deler
                stemte, og det første lot seg måle: tallet sto på 176 px,
                leveransetallene på 52. Prisen var 3,4x større enn det den
                kjøper, og det STØRSTE elementet i hele seksjonen.

                MÅLT MOT ANDRE, på prisens grad delt på sidens største:
                Linear 0,24 · Framer 0,33 · Tripletex 0,57 · Basecamp 0,60 ·
                Awesomic 0,80 · ManyPixels 0,86 · Fiken 1,00 · oss 1,00.
                Åtte sider, én gjorde som oss — og den ene er Fiken, som
                koster 219 kroner.

                Der er prinsippet: EN STOR PRIS ER EN PÅSTAND OM AT TALLET
                ER LITE. Fiken roper 219 fordi 219 er argumentet deres.
                30 000 er ikke vårt argument — forholdet mellom 30 000 og
                det som leveres er det. I 176 px forsterket vi sjokket i
                stedet for verdien. Se docs/research-arbeidsside.md.

                GREPET: PRISEN KOMMER ETTER VARENE, SOM EN SUM.

                Radene over er leveransen, oppstilt som poster med etikett
                til venstre og tall til høyre. Prisen er siste rad, med en
                tykkere strek over seg. Det er formen på en regning, og den
                gjør to ting ingen typografisk justering kunne gjort alene:
                tallet leses som et RESULTAT av det som står over, ikke som
                en inngangsbillett man møter først — og de fire tallene får
                en akse å flukte mot, som var det strukturen manglet.

                Løftet er nå seksjonens største typografi. Det er det
                Basecamp, ManyPixels og Linear gjør: overskriften bærer, og
                prisen er en opplysning i den.
              */}
              <div className="grid gap-10 lg:grid-cols-[1fr_16.5rem] lg:items-stretch lg:gap-12">
                <div>
                  <h2 className="display max-w-lg text-[2.5rem] leading-[1.02] sm:text-[3.5rem] lg:text-[4rem]">
                    {hentTekst(front, "front.price.h2") ?? (
                      <TbdMarkor id="front.price.h2" />
                    )}
                  </h2>

                  {/*
                    REGNSKAPSOPPSTILLINGEN.

                    <dl> og ikke <table>: dette er ikke data man
                    sammenligner på tvers av rader og kolonner, det er par
                    av post og verdi. En tabell ville lovet en akse til som
                    ikke finnes.

                    `tabular-nums` er nødvendig, ikke pynt. Uten den har
                    sifrene ulik bredde i Instrument Serif, og da flukter
                    ikke «1», «8–10», «2», «52» og «30 000» mot samme
                    høyrekant — som er hele poenget med oppstillingen.

                    Etiketten er brødtekst, tallet er display. Det er den
                    eneste kontrasten raden trenger; farge eller vekt i
                    tillegg ville gjort den til en prisplan.
                  */}
                  <dl className="mt-10 sm:mt-12">
                    {[
                      [
                        "Produksjonsdager i måneden",
                        tilbud.produksjonsdagerPerManed,
                      ],
                      ["Ferdige videoer hver måned", tilbud.videoerPerManed],
                      ["Publiseringer i uken", tilbud.posterPerUke],
                      /*
                        «52 uker i året» er ikke et nytt løfte. Det står
                        allerede i FAQ-svaret om ferier og i prinsippene på
                        /om-oss: «Publisering to ganger i uka, 52 uker i
                        året.» Her gjør det en jobb til — det er tallet som
                        gjør de tre over til et årsvolum i hodet på leseren,
                        uten at vi regner det ut for ham.
                      */
                      ["Uker i året", 52],
                    ].map(([post, verdi]) => (
                      <div
                        key={String(post)}
                        className="flex items-baseline justify-between gap-6 border-t border-kant py-4"
                      >
                        <dt className="text-[1.0625rem] leading-snug text-pretty text-blekk-dempet">
                          {post}
                        </dt>
                        <dd className="display shrink-0 text-[1.75rem] tabular-nums sm:text-[2.25rem]">
                          {verdi}
                        </dd>
                      </div>
                    ))}

                    {/*
                      SUMRADEN. Dobbel strek over, slik en sum settes.
                      `border-t-2` er forskjellen mellom «enda en post» og
                      «dette er totalen», og den koster én piksel.

                      Verdien leses fra `tilbud`, aldri skrevet inn her.
                      Prisen står flere steder på siden, og de skal ikke
                      kunne gli fra hverandre.
                    */}
                    <div className="flex items-baseline justify-between gap-6 border-t-2 border-blekk pt-5">
                      <dt className="font-medium text-[1.0625rem]">
                        Pris per måned
                      </dt>
                      <dd className="flex shrink-0 items-baseline gap-2.5">
                        <span className="display text-[2.75rem] tabular-nums sm:text-[3.25rem]">
                          {tilbud.prisPerManed.toLocaleString("nb-NO")}
                        </span>
                        <span className="font-sans text-base font-normal tracking-[0.02em] text-blekk-dempet">
                          kr/mnd
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/*
                  Klippet STREKKER seg over hele radhøyden fra lg, i stedet
                  for å ha et fast format. Med oppstillingen på rundt 540 px
                  og et 4:5-klipp på 330 endte høyrespalten 200 px før
                  venstre, og da så raden ut som om noe manglet. Nå møtes de
                  på samme underkant uansett hvor mange poster
                  oppstillingen får.

                  Under lg beholder det et fast format, for der ligger det
                  UNDER teksten og har ingen høyde å matche.

                  Det er nå den eneste bevegelsen i en seksjon som ellers er
                  tall og streker, og det er riktig balanse: oppstillingen
                  skal lese som et dokument, klippet minner om hva
                  dokumentet gjelder.
                */}
                <Enkeltklipp
                  sti="/reels"
                  medie={{
                    type: "video",
                    fil: "egon",
                    alt: "Klipp fra Reflektor x Egon: servering og gjester",
                  }}
                  className="relative aspect-[4/3] overflow-hidden rounded-medie bg-flate-dempet sm:aspect-[16/9] lg:aspect-auto lg:h-full"
                />
              </div>
            </Rad>
          </div>
        </Container>

        {/*
        GLASSPANELET — bygget 16.09.2026 på Påls bestilling: «seksjonere i
        bredden», «rammer på seksjonene», «gjennomsiktig glass bak
        teksten».

        HVA SOM VAR GALT. De tre radene under prisen var seks like
        tekstlinjer, så én, så tre — rundt 500 px sammenhengende sans i én
        smal spalte, med halve bredden tom ved siden av. Det er sidens
        eneste strekning uten bilde, bevegelse eller tall, og den ligger
        rett før anmeldelsene. Pål har kalt den kjedelig to ganger; han har
        rett begge gangene.

        HVORFOR GLASSET MÅTTE FÅ EN MØRK FLATE. Et glasskort på lys, flat
        bakgrunn er bare et lysere rektangel — `backdrop-blur` har
        ingenting å gjøre uskarpt. Det var lærdommen fra anmeldelsesraden,
        som ligger på mørk flate nettopp derfor. Strukturen her er to store
        radialer i merkevareoransje, se .glassflate i globals.css.

        HVORFOR IKKE ET KUNDEBILDE BAK. Det var førstevalget, og det er
        forkastet. Et gjenkjennelig bilde fra en produksjon bak
        spesifikasjonen av ABONNEMENTET leser som at den kunden er
        abonnent. AGENTS.md forbyr det uttrykkelig. Gradienten påstår
        ingenting.

        PANELET ER INNFELT, IKKE FULL BREDDE. Anmeldelsesseksjonen rett
        under er også mørk. Med beige luft rundt panelet og runde hjørner
        leser de to som hver sin ting; i full bredde ville de smeltet
        sammen til én lang mørk strekning.

        KONTRAST, målt og ikke antatt — se tallene i docs/.
      */}
        <Container>
          <div className="glassflate mt-16 rounded-medie px-6 py-12 text-pa-dyp sm:mt-20 sm:px-10 sm:py-16 lg:px-14">
            <Merkelapp variant="dyp">Dette inngår</Merkelapp>

            {/*
            SEKS KORT I BREDDEN. Tre spalter fra lg, to fra sm, én under.
            Rekkefølgen flyter nedover spaltene og ikke bortover — den som
            leser en tospaltet liste nedover skal ikke få 1, 3, 5.
          */}
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tilbud.inngar.map((punkt, i) => (
                <li
                  key={punkt}
                  /*
                  TO LAYOUTER. Fra sm står nummeret OVER teksten; under sm
                  står det ved siden av. Stablet på telefon ga hvert kort
                  en ekstra linjehøyde pluss et mellomrom, og med åtte kort
                  ble panelet 1 690 px — 711 px lengre enn de tre
                  tekstradene det erstattet. Sideveis er det 1 264 px.
                */
                  className="kort-inn flex gap-4 rounded-flate border border-kant-pa-dyp/70 bg-[rgba(245,240,232,0.10)] p-5 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.06)] sm:flex-col sm:p-6"
                >
                  {/*
                  Nummeret, ikke en hake. En hake sier «SaaS-prisplan» —
                  det var den komponenten som utløste «AI-preget» i forrige
                  runde. Et løpenummer sier «spesifikasjon», og det gjør
                  samtidig omfanget tellbart: seks punkter, ikke «flere».
                */}
                  <span
                    aria-hidden
                    className="shrink-0 font-[family-name:var(--font-display-serif)] text-[1.5rem] leading-none text-aksent-pa-dyp sm:text-[1.75rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] leading-relaxed text-pretty">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>

            {/*
            STILLBILDER — egen, bred merknad og ikke et sjuende kort.
            Forskjellen er ikke kosmetisk: de seks kortene er fast
            leveranse, stillbilder er «ved behov». Et likt kort ville lest
            som et likt løfte. Merknaden er derfor bredere, roligere og
            uten løpenummer, og den bærer betingelsen som knytter den til
            videotallet over. Se `tilbud.stillbilder` i site.ts for Påls
            instruks ordrett.
          */}
            <p className="mt-3 rounded-flate border border-dashed border-kant-pa-dyp/70 p-5 text-[1.0625rem] leading-relaxed text-pretty text-pa-dyp-dempet sm:p-6">
              {tilbud.stillbilder}
            </p>

            {/*
            De to siste kortene deler bredden 1:2. «Inngår ikke» skal være
            en LITEN dose — se research-konvertering.md om
            blemishing-effekten: negativ informasjon løfter inntrykket bare
            når den er liten, perifer og kommer etter det positive. Like
            stor som vilkårene ville gjort den til et argument.
          */}
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <div className="kort-inn rounded-flate border border-kant-pa-dyp/70 bg-[rgba(245,240,232,0.10)] p-5 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.06)] sm:p-6">
                <Merkelapp variant="dyp">Inngår ikke</Merkelapp>
                {/*
                Punktene i `inngarIkke` er skrevet med stor forbokstav hver
                for seg, fordi de tidligere sto etter en innledning
                («Inngår ikke: …»). Nå står merkelappen for seg, så de
                danner sin egen setning — og da må alle ned i små bokstaver
                bortsett fra den første. Uten dette sto det «… meldinger,
                Stories, Betalt annonsering».
              */}
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-pa-dyp-dempet">
                  {((t) => t.charAt(0).toUpperCase() + t.slice(1))(
                    tilbud.inngarIkke.join(", ").toLowerCase(),
                  )}
                  .
                </p>
              </div>

              <div className="kort-inn rounded-flate border border-kant-pa-dyp/70 bg-[rgba(245,240,232,0.10)] p-5 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(245,240,232,0.06)] sm:p-6 lg:col-span-2">
                <Merkelapp variant="dyp">Vilkår</Merkelapp>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-pretty">
                  {hentTekst(front, "front.price.note") ?? (
                    <TbdMarkor id="front.price.note" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
