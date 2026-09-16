import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Logorad } from "@/components/Logorad";
import { ReelVegg } from "@/components/ReelVegg";
import { Anmeldelsesrad } from "@/components/Anmeldelser";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { hentTekst, slotsISeksjon, TbdMarkor } from "@/components/Slot";
import {
  OrganisasjonSchema,
  TjenesteSchema,
  FaqSchema,
} from "@/components/Schema";
import { front } from "@/content/sider/front";
import { klarerteAnmeldelser } from "@/content/anmeldelser";
import { reels } from "@/content/reels";
import { arbeidskolonner, veggrader } from "@/content/arbeid";
import {
  Arbeidskolonner,
  Arbeidsvegg,
  Enkeltklipp,
} from "@/components/Arbeidsbilder";
import { site, tilbud } from "@/content/site";

/**
 * Forsiden.
 *
 * Seksjonsrekkefølgen følger evidensen, ikke briefens kapittel 3.0.1:
 * tilbudet over folden → arbeidet → prosess → pris → bevis → innvendinger →
 * kontakt. Alle tre researchsporene fant den rekkefølgen uavhengig.
 *
 * Grep som er bevisst utelatt, med begrunnelse i
 * docs/research-konvertering.md: scroll-utløst innfading (skjuler innhold til
 * JS har kjørt, forverrer LCP), auto-roterende hero-karusell (skjult innhold,
 * flyttende klikkmål), bakgrunnsvideo i hero (dyrest sted å legge video).
 *
 * Sticky CTA er også utelatt, men etter kildekontrollen 15.09 er grunnen en
 * annen enn før: Talabat-replikasjonen som sto som bevis mot sticky CTA
 * hadde et sticky element i BEGGE grupper og målte innholdet i det, ikke om
 * det fantes. Det finnes altså ikke bevis mot sticky CTA – bare fravær av
 * bevis for. Vi utelater den fordi den koster skjermplass på mobil og prisen
 * allerede står i heroen. Det er en designvurdering, ikke et forskningsfunn.
 */
/**
 * Én rad i prisseksjonens spesifikasjonsark.
 *
 * Skinnen til venstre bærer merkelappen, innholdet står i den brede
 * spalten, og hårstreken går tvers over begge. Det er den hårstreken som
 * gjør at radene leser som ÉN tabell i stedet for som fem moduler stablet
 * oppå hverandre — og det var stablingen som fikk seksjonen til å virke
 * generert.
 *
 * 9rem på skinnen er bestemt av «Dette inngår», den lengste merkelappen:
 * den skal stå på én linje. Blir en merkelapp lengre, må tallet opp.
 *
 * Under lg legger merkelappen seg over innholdet. En skinne på 9rem ved
 * siden av en tekstspalte på en telefon ville gitt 40 % av bredden til noe
 * som er tre ord langt.
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

export const metadata: Metadata = {
  title: hentTekst(front, "front.meta.title") ?? undefined,
  description: hentTekst(front, "front.meta.description") ?? undefined,
  alternates: { canonical: "https://www.reflektor.no/" },
};

function Tbd({ id }: { id: string }) {
  return <TbdMarkor id={id} />;
}

export default function Forside() {
  // FAQ-schemaet skal være ORDRETT identisk med det som står på siden.
  // Avvik mellom synlig tekst og markup er et kjent kvalitetsproblem, og
  // her koster det ingenting å unngå: begge leses fra samme slot.
  const faq = slotsISeksjon(front, 6)
    .map((slot) => slot.verdi?.split("|") ?? null)
    .filter((d): d is string[] => d !== null && d.length >= 2)
    .map((d) => ({ sporsmal: d[0].trim(), svar: d.slice(1).join("|").trim() }));

  return (
    <>
      {/*
        Entiteten eies av forsiden. Organization + LocalBusiness ligger kun
        her, ikke i layout — se begrunnelsen i Schema.tsx.

        Ingen Review eller AggregateRating. Google regner anmeldelser av seg
        selv, på egen side, som self-serving: det gir null stjerner OG er et
        regelbrudd. Se A33.
      */}
      <OrganisasjonSchema />
      <TjenesteSchema
        navn="Sosiale medier til fast månedspris"
        beskrivelse={hentTekst(front, "front.meta.description") ?? ""}
        sti="/"
      />
      <FaqSchema qa={faq} />

      {/* 1 · HERO — posisjonering i øvre halvdel av første skjerm.
          Rytmen varierer bevisst mellom seksjonene: jevn vertikal padding
          overalt er et malsignal. Forholdet mellom største og minste
          seksjonsrytme her er omtrent 3:1. */}
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-36">
        <Container>
          {/*
            Tekst og klipp side om side, begge innenfor containeren, så
            venstre- og høyrekant flukter med arbeidsseksjonen under.

            `items-stretch` er poenget: figuren arver høyden fra tekstspalten,
            og klippet beskjæres med object-cover til den høyden. Da fyller
            det rammen uten at heroen vokser, og uten at et 9:16-format
            dikterer hvor høy førsteskjermen blir.

            7/5-delingen og ikke 6/6: teksten bærer posisjoneringen og skal
            ha mest plass. NN/g-tallene sier at 57 % av visningstiden ligger
            over folden, og over 65 % av den i øvre halvdel — det er teksten
            som må stå der, ikke bildet.
          */}
          <div className="grid items-stretch gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
            <div>
          <h1 className="max-w-4xl text-[2.75rem] leading-[1.04] sm:text-6xl sm:leading-[1.02] lg:text-[4.25rem] lg:leading-[1.0]">
            {/* Kursiv, ikke oransje. Instrument Serif har en ekte kursiv, og
                den er den naturlige uthevingen i et seriffsnitt. Det frigjør
                aksentfargen til CTA-en alene — oransje to steder i samme
                viewport svekker knappen, som er det ene stedet fargen skal
                bety «trykk her». */}
            Sosiale medier – <em>nesten</em> på autopilot.
          </h1>

          <p className="mt-7 max-w-xl text-lg text-blekk-dempet">
            {hentTekst(front, "front.hero.sub") ?? <Tbd id="front.hero.sub" />}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            {/*
              Knappen bytter utseende når teksten mangler. Grunnen er ikke
              kosmetisk: TBD-markøren er oransje på lys flate, og inne i en
              oransje knapp blir den usynlig. Da ser previewen ut som en
              ferdig knapp uten tekst, i stedet for som en manglende slot.
              Preview er flaten Pål vurderer på — det skal være umulig å tro
              at noe er ferdig når det ikke er det.
            */}
            {hentTekst(front, "front.hero.cta") ? (
              <a
                href="#kontakt"
                className="rounded-interaktiv bg-aksent px-7 py-3.5 font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-aksent-hover"
              >
                {hentTekst(front, "front.hero.cta")}
              </a>
            ) : (
              <span className="inline-block rounded-interaktiv border border-dashed border-aksent px-7 py-3.5">
                <Tbd id="front.hero.cta" />
              </span>
            )}
            {/* Prisen står allerede her. Selvkvalifisering, og AEO vekter det. */}
            <p className="tracking-[0.02em] text-blekk-dempet">
              {tilbud.prisPerManed.toLocaleString("nb-NO")} kr/mnd · ingen
              bindingstid
            </p>
          </div>

          {/*
            Beviset står som SETNING, ikke som logorekke. Den tidligere
            rekken med sju navn sto rett under denne linjen og sa nesten det
            samme — fem av navnene var de samme.

            Setningen er dessuten det tryggere av de to: «Produserer foto og
            video for …» sier eksplisitt hva kundeforholdet ER. En bar rekke
            med navn under et tilbud om månedsabonnement inviterer til å lese
            dem som abonnenter, og det ville vært en feilaktig referanse.
          */}
          <p className="mt-10 max-w-xl text-sm tracking-[0.02em] text-blekk-dempet">
            {hentTekst(front, "front.hero.proof") ?? (
              <Tbd id="front.hero.proof" />
            )}
          </p>
            </div>

            {/*
              Heroklippet er det ENESTE som spiller uten IntersectionObserver.
              Det er over folden fra første sekund, så det finnes ingen
              «kommer i synsfeltet»-hendelse å vente på. Derfor også
              preload="metadata" og ikke "none": her er ventetiden synlig.

              Fortsatt dekorativt — informasjonen ligger i teksten ved siden
              av, og klippet er uten lyd.

              VEKT: dette klippet er LCP-elementet, siden det maler før H1
              rekker det. Målt gikk LCP fra 996 ms (H1) til 1 232 ms da det
              kom inn, og førstelasten fra 0,99 til 2,72 MB. Derfor er det
              kodet hardere enn de andre — CRF 33 og åtte sekunder — etter at
              samme bilderute ved faktisk visningsstørrelse viste ingen
              synlig forskjell mot CRF 31. Endres dette klippet, må LCP
              måles på nytt.
            */}
            {/*
              Klippet ligger ABSOLUTT inne i figuren. Uten det bestemmer
              videoens eget 9:16-format hvor høy raden blir, og heroen vokser
              til nesten 1 400 px. Nå arver figuren høyden fra tekstspalten,
              og klippet beskjæres til den — som var hele poenget med å legge
              dem side om side.
            */}
            <figure className="relative h-[26rem] overflow-hidden rounded-flate bg-flate-dempet sm:h-[32rem] lg:h-auto">
              <video
                className="absolute inset-0 size-full object-cover"
                poster="/reels/antonburst.jpg"
                preload="metadata"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                tabIndex={-1}
                disablePictureInPicture
                controlsList="nodownload noremoteplayback nofullscreen"
              >
                <source src="/reels/antonburst.mp4" type="video/mp4" />
              </video>
            </figure>
          </div>
        </Container>
      </section>

      {/*
        LOGORADEN. Plassert mellom heroen og arbeidsseksjonen på Påls
        bestilling, og det er også riktig sted: heroens siste linje er
        navngitt bevis i TEKST, og raden er det samme beviset i BILDER.

        Full bredde, utenfor Container. En logostripe som stopper ved
        tekstbredden leser som en illustrasjon; en som går ut av skjermen
        leser som en liste det er mer av. Det siste er sant — elleve logoer
        i riktige proporsjoner måler 2 018 px.

        Se Logorad.tsx for drift, pause og tilgjengelighet, og logoer.ts for
        hvorfor raden ikke har overskrift.
      */}
      <section
        className="pb-24 sm:pb-32"
        aria-label="Kunder Reflektor har produsert foto og video for"
      >
        <Logorad />
      </section>

      {/* 2 · ARBEIDET — vis produktet før du forklarer det */}
      <section className="pb-28 sm:pb-36">
        <Container>
          <Eyebrow>{hentTekst(front, "front.work.eyebrow")}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
            {hentTekst(front, "front.work.h2") ?? <Tbd id="front.work.h2" />}
          </h2>
          <p className="mt-3 max-w-xl text-blekk-dempet">
            {hentTekst(front, "front.work.sub") ?? <Tbd id="front.work.sub" />}
          </p>
        </Container>
        <div className="mt-10">
          <ReelVegg reels={reels} />
        </div>

      </section>

      {/* 3 · SLIK FUNGERER DET — mørk blokk som kapittelskille */}
      <section className="pb-20">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <Eyebrow variant="dyp">
              {hentTekst(front, "front.how.eyebrow")}
            </Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
              {hentTekst(front, "front.how.h2") ?? <Tbd id="front.how.h2" />}
            </h2>

            {/*
              Loddrette hårstreker mellom stegene, i samme språk som
              prisbordet. --kant-pa-dyp er en egen verdi: den vanlige
              hårstreken er regnet mot beige og forsvinner helt på brunt.

              Skillene er strukturelle, ikke dekor — de sier at dette er tre
              trinn i rekkefølge, ikke tre likestilte påstander.
            */}
            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0">
              {slotsISeksjon(front, 3)
                .filter((s) => s.id.includes("steps"))
                .map((slot, i) => {
                  const delt = slot.verdi?.split("|") ?? null;
                  return (
                    <li
                      key={slot.id}
                      className={`sm:px-8 ${i === 0 ? "sm:pl-0" : ""} ${
                        i < 2 ? "sm:border-r sm:border-[color:var(--kant-pa-dyp)]" : "sm:pr-0"
                      }`}
                    >
                      <span className="font-mono text-sm text-aksent-pa-dyp">
                        {i + 1}
                      </span>
                      {delt ? (
                        <>
                          <h3 className="mt-3 text-lg font-medium">
                            {delt[0].trim()}
                          </h3>
                          <p className="mt-2 text-pa-dyp-dempet">
                            {delt.slice(1).join("|").trim()}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3">
                          <Tbd id={slot.id} />
                        </p>
                      )}
                    </li>
                  );
                })}
            </ol>
          </div>
        </Container>
      </section>

      {/*
        Stillbildene står nå som EGEN seksjon etter prosessblokken, ikke rett
        under klippene.

        Grunnen er rytme: reel-veggen og åtte store bilder rett etter
        hverandre ble en vegg av bildeflate uten pusterom, og leseren mistet
        argumentet mellom dem. Prosessblokken deler dem — video, tekst, foto —
        og fotonettet får da også fungere som bevis PÅ det blokken nettopp
        påsto, i stedet for som mer av det samme.

        Ingen egen overskrift, med vilje. Seksjonen er et visuelt pustehull i
        argumentet, ikke et nytt kapittel, og en overskrift ville gjort den
        til det siste.
      */}
      <section className="pb-28 sm:pb-36" aria-label="Arbeid fra produksjonsdager">
        <Arbeidskolonner kolonner={arbeidskolonner} />
      </section>

      {/*
        4 · PRIS

        Prisen er kvalifiseringsøyeblikket. Den var tidligere en venstrestilt
        tekstspalte, og leste som en prisliste i stedet for som et tilbud.

        Tre grep, alle basert på at seksjonen manglet visuelt uttrykk og ikke
        informasjon:

        1. TALLET I SERIFF, i display-grad. Det var satt i Poppins fordi det
           ligger i en <p>. Et seksifret beløp i høykontrast-seriff på 8rem er
           forskjellen på at prisen leses som en opplysning og at den leses
           som et løfte. Skalakontrast er det billigste wow-grepet som finnes,
           og det eneste som ikke er dekor.

        2. ET BILDE. Seksjonen solgte en produksjonsdag uten å vise en. Bildet
           viser nettopp opptak, og står i samme rad som tallet — det binder
           prisen til det man får for den.

        3. TALLRAD. De tre tellbare størrelsene — 1 produksjonsdag, 8–10
           videoer, 2 publiseringer i uken — lå begravet i kulepunkter. De er
           tall, og tall skal se ut som tall. Verdiene leses fra `tilbud`, og
           ordene er de samme som står i den godkjente copyen.

        Tallraden ligger i venstre spalte og ikke under begge, slik at bildet
        får fylle sin spalte i full høyde. Ellers oppstår et tomrom som gjør
        at seksjonen ser uferdig ut nettopp der den skal virke mest sikker.

        Det som inngår er beholdt som bord, men nedtonet: det er
        dokumentasjon, ikke argument.
      */}
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
                      <Tbd id="front.price.h2" />
                    )}
                  </h2>

                  {/*
                    TO LAYOUTER. Under sm står tallene i en stabel, med tallet
                    og ordet på samme linje. Tre spalter på 390 px gir
                    kolonner på rundt 100 px, og «produksjonsdag» er bredere
                    enn det — i første versjon rant ordet inn i nabospalten.
                    Fra sm er det tre spalter, som er der tallene gjør mest
                    nytte.
                  */}
                  <dl className="mt-10 flex flex-col gap-5 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-x-8">
                    {[
                      [tilbud.produksjonsdagerPerManed, "produksjonsdag", "i måneden"],
                      [tilbud.videoerPerManed, "ferdige videoer", "hver måned"],
                      [tilbud.posterPerUke, "publiseringer", "i uken"],
                    ].map(([tall, ord, nar]) => (
                      <div
                        key={ord}
                        className="flex items-baseline gap-4 sm:block"
                      >
                        <dt className="sr-only">{`${ord} ${nar}`}</dt>
                        <dd className="contents sm:block">
                          <span className="min-w-[5.25rem] font-[family-name:var(--font-display-serif)] text-[2.75rem] leading-none tracking-[-0.02em] sm:block sm:min-w-0 sm:text-[3.25rem]">
                            {tall}
                          </span>
                          <span className="text-sm leading-snug tracking-[0.02em] text-blekk-dempet sm:mt-3 sm:block">
                            {ord}{" "}
                            <br className="hidden sm:block" />
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
                    <Tbd id="front.price.note" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/*
        5 · ANMELDELSER

        Seksjonen har vært gjennom to omskrivinger. Først var den ren tekst
        på beige og leste som dokumentasjon. Så ble den et løftet sitat pluss
        åtte glasskort i tre rader — riktig i uttrykk, men 1 500 piksler høy,
        og den brøt rytmen i siden.

        Nå er den én rad: Googles egen vurdering som tall, og sitatene som en
        rad man kan dra i. Se Anmeldelser.tsx for hva som er byttet mot hva.

        Flaten forblir mørk. Ikke for variasjonens skyld — glasskortene
        trenger noe å bryte mot, og flatebyttet markerer at det er noen andre
        enn Reflektor som snakker.
      */}
      <section className="bg-dyp text-pa-dyp">
        <Anmeldelsesrad
          eyebrow={hentTekst(front, "front.reviews.eyebrow")}
          overskrift={
            hentTekst(front, "front.reviews.h2") ?? (
              <Tbd id="front.reviews.h2" />
            )
          }
          anmeldelser={klarerteAnmeldelser}
        />
      </section>

      {/*
        Veggen. Full bredde med vilje — en seksjon som stopper ved
        tekstbredden leser som en illustrasjon, en som går ut av skjermen
        leser som en strøm. Se arbeid.ts og globals.css.
      */}
      <section className="pb-14 sm:pb-20" aria-label="Utvalg fra arbeidet">
        <Arbeidsvegg rader={veggrader} />
      </section>

      {/* 6 · FAQ — native details, ingen JavaScript */}
      <section className="pb-24">
        <Container>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Det folk lurer på før de tar kontakt
          </h2>
          <div className="mt-10 max-w-2xl divide-y divide-kant border-y border-kant">
            {slotsISeksjon(front, 6).map((slot) => {
              const delt = slot.verdi?.split("|") ?? null;
              return (
                <details key={slot.id} className="group py-5">
                  <summary className="cursor-pointer font-medium">
                    {delt ? delt[0].trim() : <Tbd id={slot.id} />}
                  </summary>
                  {delt && (
                    <p className="mt-3 text-blekk-dempet">
                      {delt.slice(1).join("|").trim()}
                    </p>
                  )}
                </details>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 7 · KONTAKT */}
      {/*
        7 · KONTAKT

        DØDPLASSEN VAR PROBLEMET. Venstrespalten hadde overskrift, ingress og
        NAP — rundt 300 px — mot et skjema på nesten 700. Resten var tom
        brun flate, og den tomheten leste ikke som ro. Den leste som at vi
        gikk tom for ting å si akkurat der kunden skal bestemme seg.

        To klipp fyller den nå, og de fyller den NØYAKTIG: raden har
        `flex-1`, så den tar det skjemaet ikke bruker. Blir skjemaet
        høyere eller overskriften lengre, justerer klippene seg. Det kan
        ikke oppstå nytt tomrom.

        HVORFOR VIDEO OG IKKE MER TEKST: kolonnen svarer på «hvem er dette»,
        og dette er et selskap som lager film. Å bevise det med to filmer er
        mer direkte enn å skrive en setning til. Skjemaet står urørt på egen
        lys flate til høyre — argumentet og handlingen er fortsatt adskilt.

        JEG VURDERTE Å PAUSE KLIPPENE NÅR SKJEMAET FÅR FOKUS, for bevegelse
        ved siden av et skjema kan trekke blikket. Droppet: det finnes ingen
        måling som sier at det hjelper, det binder to komponenter sammen i
        delt tilstand, og to frosne bilder ved siden av et halvutfylt skjema
        har sin egen feilmodus. På mobil stables alt uansett, så klippene er
        over skjemaet og ute av syne mens man skriver.

        INGEN BILDETEKSTER. Klippene er fra Premium PT og Bjørvika, og
        ingen av dem står på den bekreftede kundelisten som brukes ellers
        på siden. Samme regel som i arbeidsrutenettet: et navn på siden
        skal komme fra en kilde, ikke fra at filene lå i samme mappe.
      */}
      <section id="kontakt" className="pb-24">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-20">
              <div className="flex flex-col">
                <h2 className="text-3xl sm:text-4xl">
                  {hentTekst(front, "front.contact.h2") ?? (
                    <Tbd id="front.contact.h2" />
                  )}
                </h2>
                <p className="mt-4 max-w-sm text-pa-dyp-dempet">
                  {hentTekst(front, "front.contact.sub") ?? (
                    <Tbd id="front.contact.sub" />
                  )}
                </p>

                <div className="mt-10 text-sm text-pa-dyp-dempet">
                  <p className="font-medium text-pa-dyp">
                    {site.kontakt.firma}
                  </p>
                  <p className="mt-1">{site.kontakt.adresse}</p>
                  <p className="mt-3">
                    <a
                      href={`mailto:${site.kontakt.epost}`}
                      className="hover:text-pa-dyp"
                    >
                      {site.kontakt.epost}
                    </a>
                  </p>
                </div>

                {/*
                  ETT BILDE, IKKE TO KLIPP.

                  Her sto to stående klipp side om side. De fylte plassen
                  fint, men de var det femte og sjette bevegelige elementet
                  på siden — etter heroklippet, reel-veggen,
                  arbeidsrutenettet, prisklippet og arbeidsveggen. Et
                  stillbilde akkurat her er et REGISTERSKIFTE, og det er
                  poenget: det er her man bestemmer seg, og en pause er
                  bedre enn mer bevegelse.

                  Det fjerner også den ene innvendingen jeg noterte da
                  klippene kom inn — bevegelse ved siden av et skjema kan
                  trekke blikket. Nå finnes ikke problemet.

                  HVORFOR AKKURAT DETTE BILDET: overskriften spør «se hva vi
                  ville filmet hos dere». Bildet svarer på hvem som dukker
                  opp — stativ på ryggen, kamera i hånda, koffert etter seg.
                  Det er hele leveransen i ett bilde.

                  De to montasjevideoene som også lå ved er ikke brukt. De
                  er 2,4:1, bygget for å være brede, og i denne rammen
                  (429x315) overlever bare to av fire paneler. Skulle de
                  brukes, måtte de hatt full kortbredde — og da oppstår
                  tomrommet i venstrespalten på nytt.

                  UTSNITTET ER VALGT, IKKE STANDARD. `object-position` på
                  12 % fra toppen: senter kutter hodet, topp gir for mye
                  tak. Bildet finnes i to formater i Dropbox; 1:1 er valgt
                  fordi 16:9-varianten allerede er beskåret så hodet er ute.

                  `flex-1` + `min-h-0` er det som gjør at rammen tar
                  NØYAKTIG resten av spalten. Uten `min-h-0` nekter en
                  flex-item å krympe under sitt eget innhold.
                */}
                <figure className="relative mt-8 aspect-[4/3] overflow-hidden rounded-medie bg-flate-dempet lg:mt-10 lg:aspect-auto lg:min-h-0 lg:flex-1">
                  <Image
                    src="/arbeid/pa-vei.jpg"
                    alt="Fotograf på vei inn til opptak med stativ, kamera og utstyrskoffert"
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-[center_12%]"
                  />
                </figure>
              </div>

              {/* Skjemaet på lys flate — kontrast mot den mørke blokken, og
                  feltene leser som felt. Selve skjemaet er urørt: det er
                  bygget på det som faktisk er dokumentert om skjemadesign,
                  og står beskrevet i Kontaktskjema.tsx. */}
              <div className="rounded-flate bg-flate p-6 text-blekk sm:p-8">
                <Kontaktskjema side="/" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/*
        LOGORADEN EN GANG TIL, mellom skjemaet og bunnteksten. Påls
        bestilling.

        Den nederste er DEKORATIV. Den viser nøyaktig de samme elleve
        kundene som raden over arbeidsseksjonen, så informasjonen er
        allerede lest opp én gang — uten `dekorativ` ville en
        skjermleserbruker hørt alle elleve navnene to ganger på samme side
        uten å få noe nytt. Derfor heller ingen aria-label her: en
        dekorativ gjentakelse skal ikke annonseres som et landemerke.

        Nettverket merker den ikke. De 44 bildene peker på de samme elleve
        URL-ene som raden over, og de er hentet for lengst.

        Plasseringen er etter skjemaet med vilje. Alt som står FØR skjemaet
        kan trekke blikket bort fra det; det som står etter, møter bare dem
        som allerede har rullet forbi.
      */}
      {/*
        Ingen egen bunnmarg. Kontaktseksjonen over har pb-24 og bunnteksten
        har mt-24, altså 96 px på hver side. La raden også ha padding under,
        og luften ble 96 over mot 192 under — raden ville lest som en hale
        på kontaktseksjonen i stedet for å stå mellom de to.
      */}
      <Logorad dekorativ />
    </>
  );
}
