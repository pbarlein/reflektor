import Link from "next/link";

/**
 * Forsidens toppdel: én setning folk skal kunne gjenta.
 *
 * ── HVORFOR DETTE ER ÉN SETNING OG IKKE TRE PUNKTER (omskrevet 22.09.2026) ─
 *
 * Versjonen før denne satte de tre verdiene som tre rader, hver med sin egen
 * forklaringslinje. Pål leste de tre linjene som «byråvåsete» — og han hadde
 * rett. «Forskjellen på godt nok og noe vi står inne for» er en setning ingen
 * sier høyt, og ingen husker.
 *
 * Teksten her er hans, ordrett. Den gjør tre ting punktlisten ikke gjorde:
 * den kan gjentas, den sier hvem som skal si det (kunden, når hen anbefaler
 * oss videre), og den binder verdiene til målene i samme åndedrag.
 *
 * DEN SKAL IKKE OMSKRIVES. Ikke «strammes», ikke «varieres». Copy kommer fra
 * Reflektor — se copy-protokollen i AGENTS.md. At «Dette er» står to ganger
 * er ikke en gjentakelse som skal fjernes; det er to like ledd som holder
 * setningen sammen.
 *
 * ── OMARBEIDET 28.09.2026: SAMME ORD, ANNEN FLATE ─────────────────────────
 *
 * Bestilt «mye mer sexy og moderne». Det er en bestilling på flaten, ikke på
 * teksten, og ikke ett ord er endret.
 *
 * Det som faktisk var galt: to helt flate rektangler stablet oppå hverandre.
 * Fargene var riktige og kontrastene regnet, men det fantes ikke dybde noe
 * sted — ingen lyskilde, ingen tekstur, ingen bevegelse. En slik flate ser
 * ikke billig ut fordi fargen er feil, men fordi ingenting i den antyder at
 * den er laget av noen.
 *
 * Fire grep, i rekkefølge etter hvor mye de gjør:
 *
 *   1. LYS. To blomstringer i stedet for én, den ene varm oppe til høyre og
 *      den andre dypere og kaldere nede til venstre. Sammen gir de flaten en
 *      retning: den er lysest der overskriften begynner.
 *   2. KORN. Et prikkeraster på 3 px med 2,5 % hvitt. Usynlig som mønster,
 *      men det bryter den digitale planheten i store mørke flater — samme
 *      grunn som trykksaker aldri er helt jevne.
 *   3. TYPOGRAFI. Overskriften er strammere sporet og går høyere opp i grad.
 *      Hilsenen er blitt en etikett med hårstrek, så toppen har en kant å
 *      begynne fra i stedet for å flyte.
 *   4. BEVEGELSE VED BERØRING. Understrekene under de tre ordene vokser fra
 *      venstre ved peker. Det er den eneste animasjonen, den varer 300 ms,
 *      og den er slått av under `prefers-reduced-motion`.
 *
 * Flatebyttet fra mørk til oransje er BEHOLDT, og det er ikke nostalgi: se
 * avsnittet under. Det er den ene tingen ved den gamle toppdelen som gjorde
 * en jobb.
 *
 * ── DE TRE ORDENE ER LENKER, INNE I SETNINGEN ─────────────────────────────
 *
 * Alternativet var en egen lenkerad under. Den ville sagt de tre ordene to
 * ganger på samme flate, og det er nøyaktig det «minimer tekst» handler om.
 *
 * Lenkene er merket med BÅDE farge og understrek. Farge alene er ikke nok
 * (WCAG 1.4.1) — og i en setning satt i versaler er understreket dessuten
 * det eneste som skiller «et ord som er uthevet» fra «et ord du kan trykke
 * på». `aria-label` sier hvor lenken går, siden ordet i setningen ikke
 * nevner rubrikken den fører til.
 *
 * Treffområdet er 39 px høyt på telefon, altså under de 44 px WCAG 2.5.5
 * ber om. Det er tillatt: 2.5.8 gjør uttrykkelig unntak for lenker inne i
 * en setning, der høyden er bundet av linjeavstanden til teksten rundt.
 * Setningen er poenget her, og den skal ikke luftes ut for å gi plass.
 *
 * ── FARGESKIFTET LIGGER DER SETNINGEN SNUR ────────────────────────────────
 *
 * Setningen bytter selv retning midtveis: først hva vi gjør, så hva det skal
 * føre til. Flatebyttet fra mørk til oransje ligger på nøyaktig det skiftet.
 * Da gjør typografien det samme som ordene, i stedet for å pynte på dem.
 *
 * Siste ledd er det eneste som er kortet ned fra Påls opprinnelige ordlyd,
 * med hans ja: «Dette er hva som skal til for å oppnå målene våre» ble til
 * «Da når vi målene våre». Grunnen er at «Dette er» ellers sto tre ganger på
 * samme flate, og at «Da» gjør årsaksforholdet i ett ord der den lange
 * varianten brukte syv. Selve målene er urørt.
 *
 * ── FULL BREDDE ───────────────────────────────────────────────────────────
 *
 * Seksjonen ligger utenfor `Container` og har sin egen indre bredde, som
 * radene lenger nede. Et avrundet kort inne i en marg ville gjort den til
 * nok et kort. Én flate fra kant til kant er det eneste elementet på siden
 * som ikke ser ut som innhold — og det er nettopp det den ikke er.
 *
 * ── KONTRASTENE ER REGNET (WCAG 2.1) ──────────────────────────────────────
 *
 * Mot #1C1310:
 *   #F6F4F1 bone            16,63  ✓ AAA
 *   #C9BDB4 dempet           9,93  ✓ AAA
 *   #F08A70 oransje-300      7,46  ✓ AAA — lenkefargen i setningen
 *   #A4968C                  6,36  ✓ AA
 *
 * Mot #932E17 (målflaten):
 *   #FFFFFF                  7,94  ✓ AAA
 *   #FDF0EC oransje-050      7,13  ✓ AAA
 *
 * Merkeoransjen #DE4826 brukes IKKE som flate bak tekst: den gir 4,40 mot
 * nærsvart, under AA for brødtekstgrad. #932E17 er samme farge lenger ned i
 * paletten, og den bærer hvit tekst i alle grader.
 *
 * Blomstringene og kornet endrer ikke regnestykkene: begge ligger over en
 * base som ER #1C1310, og de gjør flaten LYSERE der de treffer. Lysere
 * bakgrunn under lys tekst kan i prinsippet senke kontrasten — derfor er de
 * holdt på 26 % og 18 % og lagt i hjørner, ikke bak brødteksten.
 */

/**
 * De tre ordene i setningen som er lenker.
 *
 * `ord` er skrevet i versaler fordi det er slik Pål skrev setningen, ikke
 * som en typografisk effekt. Rekkefølgen er setningens — den kan ikke
 * sorteres om.
 */
const VERDIENE = [
  {
    ord: "PROAKTIVE",
    slug: "proaktiv-kundekontakt",
    rubrikk: "Proaktiv kontakt mellom produksjonsdagene",
  },
  {
    ord: "GODT FORBEREDT",
    slug: "forberedt-til-kundemote",
    rubrikk: "Godt forberedt til kundemøte",
  },
  {
    ord: "ENTUSIASTISKE",
    slug: "stolthet-og-standard",
    rubrikk: "Stolthet og standard",
  },
] as const;

/** Målene, som de står i setningens siste ledd. */
const MALENE = [
  "Faste kunder blir værende.",
  "Engangskunder kommer tilbake.",
] as const;

/** Samme indre bredde og polstring som radene lenger nede på siden. */
const INNE = "mx-auto w-full max-w-[88rem] px-5 sm:px-8";

/**
 * Ett av de tre ordene.
 *
 * ── UNDERSTREKET ER TEGNET, IKKE ARVET ────────────────────────────────────
 *
 * Før: `underline` med `decoration-color` som skiftet ved peker. Det virket,
 * men en tekstdekorasjon kan ikke animeres i bredden — den kan bare bytte
 * farge, og det leses som en tilstand, ikke som en bevegelse.
 *
 * Nå er streken et eget element med `scale-x` fra venstre. Den ER der hele
 * tiden i dempet form, så kravet om at lenken skal kjennes igjen uten farge
 * (WCAG 1.4.1) er oppfylt før noen tar på den; ved peker og fokus vokser den
 * til full styrke. `origin-left` er det som gjør at den skrives, i stedet for
 * å blåses opp fra midten.
 *
 * `whitespace-nowrap`: «GODT FORBEREDT» er to ord og én lenke. Uten den
 * brakk den over linjeskiftet, og da så den ut som to understrekede
 * fragmenter i stedet for ett ord man kan trykke på.
 */
function Verdiord({ i }: { i: number }) {
  const v = VERDIENE[i];
  return (
    <Link
      href={`/rubrikk/${v.slug}`}
      aria-label={`${v.ord} — les «${v.rubrikk}»`}
      className="group relative inline-block rounded-interaktiv whitespace-nowrap text-[#F08A70] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F08A70]"
    >
      {v.ord}
      <span
        aria-hidden
        className="absolute right-0 -bottom-[0.06em] left-0 h-[0.055em] origin-left scale-x-100 bg-[rgba(240,138,112,0.45)]"
      />
      <span
        aria-hidden
        className="absolute right-0 -bottom-[0.06em] left-0 h-[0.055em] origin-left scale-x-0 bg-[#F08A70] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
      />
    </Link>
  );
}

export function Maalet({ navn }: { navn: string }) {
  return (
    <section
      aria-labelledby="verdiene"
      className="relative isolate overflow-hidden bg-[#1C1310] text-[#F6F4F1]"
    >
      {/*
        LYSET. To blomstringer gir flaten en retning; én alene ga den bare et
        lyst hjørne. Den varme ligger der overskriften begynner, den dype
        nede til venstre så bunnen ikke faller i svart.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 -right-48 size-[52rem] rounded-full bg-[radial-gradient(circle,rgba(222,72,38,0.26),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-72 -left-56 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(147,46,23,0.18),transparent_66%)]"
      />
      {/*
        KORNET. 3 px raster, 2,5 % hvitt. Man ser det ikke som mønster — man
        ser at flaten ikke er helt jevn, og det er hele poenget. Rent CSS:
        ingen bildefil, ingen filter, ingenting å laste.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:3px_3px]"
      />

      <h2 id="verdiene" className="sr-only">
        Slik jobber vi, og hva det skal føre til
      </h2>

      <div className={`relative ${INNE}`}>
        {/*
          HILSENEN ER BLITT EN ETIKETT. Den sto som en løs linje i
          brødtekstgrad og fløt over overskriften uten å feste seg i noe.
          Med hårstrek og sperret versal er den en kant siden begynner fra.
        */}
        <div className="flex items-center gap-3.5 pt-8 sm:pt-11">
          <span className="font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-[#A4968C] uppercase">
            Hei, {navn}
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-[linear-gradient(to_right,rgba(164,150,140,0.35),transparent)]"
          />
        </div>

        {/*
          MÅLET ER TRE TIL FIRE LINJER, ikke én lang. `max-w` i `ch` binder
          bredden til tegn og ikke til piksler, så linjelengden holder seg
          når skriftgraden vokser med vinduet.
        */}
        <p className="display mt-6 max-w-[30ch] text-[clamp(2rem,5.9vw,4.75rem)] leading-[1.04] tracking-[-0.028em] text-balance sm:mt-8">
          Vi er alltid <Verdiord i={0} />, <Verdiord i={1} /> og{" "}
          <Verdiord i={2} />.
        </p>

        <p className="mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-pretty text-[#C9BDB4] sm:mt-7 sm:text-[1.25rem]">
          Dette er det kundene skal si når de anbefaler oss videre.
        </p>

        <div className="h-10 sm:h-14" />
      </div>

      {/*
        MÅLFLATEN. Setningens siste ledd, på egen farge. Skiftet ligger der
        teksten selv snur: fra hva vi gjør, til hva det skal føre til.

        Den tynne lyse linjen på toppen er ikke pynt: uten den møtes to
        mettede mørke flater i en kant som ser ut som en trykkfeil. Med den
        ser skiftet ut som en beslutning.
      */}
      <div className="relative border-t border-[rgba(255,255,255,0.14)] bg-[#932E17] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:3px_3px]"
        />
        <div className={`relative ${INNE} pt-8 pb-9 sm:pt-10 sm:pb-12`}>
          {/*
            PILA GJØR ÅRSAKSFORHOLDET SYNLIG. Den peker ned fra den mørke
            flaten og inn i denne. Ett tegn sier det et avsnitt sa før, og
            det er `aria-hidden` fordi ordene ved siden av sier det samme.
          */}
          <p className="flex items-baseline gap-2.5 font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-[#FDF0EC] uppercase">
            <span aria-hidden className="leading-none">
              ↓
            </span>
            Da når vi målene våre
          </p>

          {/*
            STREKEN OVER OG SKILLET MELLOM. To mål uten noe imellom leste som
            to løsrevne setninger med et tilfeldig mellomrom. En hårstrek over
            begge og én mellom dem gjør dem til ett par — og paret er poenget:
            de er de to eneste utfallene vi måler oss på.

            Loddrett skille fra sm, vannrett på telefon, fordi rutenettet
            legger dem under hverandre der.

            TALLENE er lagt til 28.09.2026. De sier ikke rekkefølge eller
            prioritet — de sier at det er nøyaktig to, og at listen er
            lukket. Derfor er de små og halvgjennomsiktige, og `aria-hidden`:
            en skjermleser leser allerede «1 av 2» fra listen selv.
          */}
          <ul className="mt-6 grid border-t border-[rgba(255,255,255,0.3)] sm:mt-7 sm:grid-cols-2">
            {MALENE.map((mal, i) => (
              <li
                key={mal}
                className={
                  "flex items-baseline gap-4 py-6 sm:py-9 " +
                  (i === 0
                    ? "sm:pr-10"
                    : "border-t border-[rgba(255,255,255,0.3)] sm:border-t-0 sm:border-l sm:border-l-[rgba(255,255,255,0.3)] sm:pt-6 sm:pl-10")
                }
              >
                <span
                  aria-hidden
                  className="font-sans text-[0.6875rem] font-medium tracking-[0.1em] text-[rgba(253,240,236,0.55)] tabular-nums"
                >
                  0{i + 1}
                </span>
                <span className="display text-[clamp(1.625rem,4vw,2.625rem)] leading-[1.06] tracking-[-0.028em] text-balance">
                  {mal}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
