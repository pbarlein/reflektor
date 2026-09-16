import { Enkeltklipp } from "@/components/Arbeidsbilder";
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
      <p className="text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase lg:pt-1.5">
        {merkelapp}
      </p>
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
              <div className="grid gap-8 lg:grid-cols-[1fr_16.5rem] lg:items-start lg:gap-12">
                <div>
                  {/* Verdien leses fra tilbud, aldri skrevet inn her. Prisen
                    står flere steder på siden, og de skal ikke kunne gli
                    fra hverandre. */}
                  <p className="flex items-baseline gap-4 font-[family-name:var(--font-display-serif)] text-[5.5rem] leading-[0.8] tracking-[-0.03em] sm:text-[9rem] lg:text-[11rem]">
                    {tilbud.prisPerManed.toLocaleString("nb-NO")}
                    <span className="font-sans text-base font-normal tracking-[0.02em] text-blekk-dempet sm:text-lg">
                      kr/mnd
                    </span>
                  </p>
                  <h2 className="mt-7 max-w-md text-2xl text-balance sm:text-[1.75rem]">
                    {hentTekst(front, "front.price.h2") ?? (
                      <TbdMarkor id="front.price.h2" />
                    )}
                  </h2>

                  {/*
                  TRE SPALTER OGSÅ PÅ MOBIL — omgjort 16.09.2026.

                  Her sto tallene stablet under sm, med tallet og ordet på
                  samme linje. Grunnen var at tre spalter på 390 px gir
                  rundt 100 px hver, og «produksjonsdag» er bredere enn
                  det. Løsningen den gang var å legge ordet VED SIDEN av
                  tallet, med `min-w-[5.25rem]` på tallet så de tre
                  ordene flukter.

                  Det ga en 84 px tom kolonne etter et ettsifret tall, og
                  tre nesten tomme rader etter hverandre. Pål: prisseksjonen
                  «blir litt rart komprimert» på mobil. Det var dette.

                  Riktig grep var å krympe TYPOGRAFIEN, ikke å bytte
                  layout: tallet fra 2,75 til 2 rem og merkelappen fra 14
                  til 12 px. Da får ordet plass i en 100 px spalte, og
                  mobil og desktop har samme struktur — ett oppsett å
                  vedlikeholde i stedet for to.
                */}
                  <dl className="mt-10 grid grid-cols-3 gap-x-4 sm:mt-12 sm:gap-x-8">
                    {[
                      /*
                      MYKE BINDESTREKER (U+00AD) i «produksjonsdag» og
                      «publiseringer». Begge er lengre enn spalten på de
                      smaleste telefonene: på en iPhone SE er spalten 80 px
                      og ordene måler 89.

                      `hyphens: auto` alene holdt ikke — den krever at
                      nettleseren har en orddelingsordbok for språket, og
                      det kan vi ikke garantere i alle miljøer. Delepunkter
                      vi setter selv er deterministiske, og de er usynlige
                      når ordet får plass.

                      Delt på stavelser: pro-duk-sjons-dag,
                      pu-bli-se-rin-ger. Ett delepunkt var ikke nok — «pro-
                      duksjons-» er fortsatt 89 px.
                    */
                      [
                        tilbud.produksjonsdagerPerManed,
                        "pro\u00ADduk\u00ADsjons\u00ADdag",
                        "i måneden",
                      ],
                      [tilbud.videoerPerManed, "ferdige videoer", "hver måned"],
                      [
                        tilbud.posterPerUke,
                        "pu\u00ADbli\u00ADse\u00ADrin\u00ADger",
                        "i uken",
                      ],
                    ].map(([tall, ord, nar]) => (
                      <div key={ord}>
                        <dt className="sr-only">{`${ord} ${nar}`}</dt>
                        <dd>
                          <span className="block font-[family-name:var(--font-display-serif)] text-[2rem] leading-none tracking-[-0.02em] sm:text-[3.25rem]">
                            {tall}
                          </span>
                          {/*
                          `hyphens-auto` er nødvendig, ikke pynt.
                          «produksjonsdag» er 14 tegn og måler rundt 92 px
                          ved 12 px — bredere enn spalten på en iPhone SE,
                          der den er 80 px. Uten orddeling renner ordet ut
                          av spalten sin. Nettleseren deler på norsk fordi
                          <html lang="nb"> er satt.
                        */}
                          <span className="mt-2 block hyphens-auto text-xs leading-snug tracking-[0.02em] text-blekk-dempet sm:mt-3 sm:text-sm">
                            {ord} <br />
                            {nar}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/*
                Klippet toppstilles med tallet. Bunnstilt — som det var —
                presset de 129 px opp over «30 000», og da mistet tallet
                kontakten med både hårstreken og merkelappen sin.
              */}
                <Enkeltklipp
                  sti="/reels"
                  medie={{
                    type: "video",
                    fil: "egon",
                    alt: "Klipp fra Reflektor x Egon: servering og gjester",
                  }}
                  className="relative aspect-[4/3] overflow-hidden rounded-medie bg-flate-dempet sm:aspect-[16/9] lg:aspect-[4/5]"
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
            <p className="text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
              Dette inngår
            </p>

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
                <p className="text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                  Inngår ikke
                </p>
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
                <p className="text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
                  Vilkår
                </p>
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
