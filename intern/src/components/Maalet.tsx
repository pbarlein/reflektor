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
 * ── LYS FLATE, 28.09.2026 ─────────────────────────────────────────────────
 *
 * Toppdelen var mørkebrun med en oransje blokk under. Første forsøk på å
 * gjøre den «sexy» la på lys, korn og bevegelse — og den så fortsatt
 * gammeldags ut. Diagnosen var feil: problemet var aldri at den mørke
 * flaten manglet dybde, det var at den ER mørk. To mettede, mørke blokker
 * i full bredde er et grep fra 2014, og ingen mengde tekstur gjør det nytt.
 *
 * Resten av intranettet er lyst, og det er bestilt slik (se globals.css).
 * Toppdelen var det eneste stedet som brøt med det, og bruddet var det man
 * la merke til først. Nå er den lys som alt annet, og det som skiller den
 * er type og luft i stedet for en farget boks.
 *
 * Det som bærer den nå:
 *
 *   1. TYPEN ER HOVEDSAKEN. Overskriften går helt opp i 5,5 rem og har
 *      negativ sporing. På lys flate tåler stor grad langt mer enn på mørk,
 *      fordi bokstavene ikke blør ut i bakgrunnen.
 *   2. FARGEN KOMMER FRA ORDENE, ikke fra flaten. De tre verdiene står i
 *      merkeoransje og er det eneste mettede på hele siden. Da er det de
 *      man ser, og de er tilfeldigvis også det setningen handler om.
 *   3. LYSET ER ETT SKJÆR, ikke to. En stor, svært svak oransje blomstring
 *      øverst til høyre. På lys flate holder 8 % der mørk trengte 26 %.
 *   4. SKIFTET ER EN TONE, IKKE EN BLOKK. Målene ligger på den dempede
 *      flaten (#EFE9E0), ikke på oransje. Setningen snur fortsatt der
 *      fargen snur — men forskjellen er nå et halvt trinn, ikke et brøl.
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
 * ── SISTE LEDD ER KORTET NED, MED PÅLS JA ─────────────────────────────────
 *
 * «Dette er hva som skal til for å oppnå målene våre» ble til «Da når vi
 * målene våre». Grunnen er at «Dette er» ellers sto tre ganger på samme
 * flate, og at «Da» gjør årsaksforholdet i ett ord der den lange varianten
 * brukte syv. Selve målene er urørt.
 *
 * ── FULL BREDDE ───────────────────────────────────────────────────────────
 *
 * Seksjonen ligger utenfor `Container` og har sin egen indre bredde, som
 * radene lenger nede. Et avrundet kort inne i en marg ville gjort den til
 * nok et kort.
 *
 * ── KONTRASTENE ER REGNET PÅ NYTT FOR LYS FLATE (WCAG 2.1) ────────────────
 *
 * Mot #F6F4F1 (bone):
 *   #1C1310 blekk           16,63  ✓ AAA
 *   #6A5A50 dempet           5,99  ✓ AA
 *   #C03A1C aksenttekst      4,95  ✓ AA  — etiketter i småtekst
 *   #DE4826 merkeoransje     3,78  ✓ AA kun som STOR tekst (≥24 px)
 *
 * Mot #EFE9E0 (målflaten):
 *   #1C1310                 15,13  ✓ AAA
 *   #6A5A50                  5,45  ✓ AA
 *   #C03A1C                  4,50  ✓ AA
 *   #7A6A60 svak             4,29  ✗ — brukes IKKE her, se globals.css
 *
 * Merkeoransjen står bare på verdiordene, og de er aldri under 32 px. Alt
 * som er småtekst bruker #C03A1C. Det er den ene regelen som er lett å
 * bryte her uten å merke det.
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
 * En tekstdekorasjon kan ikke animeres i bredden — den kan bare bytte farge,
 * og det leses som en tilstand, ikke som en bevegelse. Streken er derfor et
 * eget element med `scale-x` fra venstre.
 *
 * Den ER der hele tiden i dempet form, så kravet om at lenken skal kjennes
 * igjen uten farge (WCAG 1.4.1) er oppfylt før noen tar på den. `origin-left`
 * er det som gjør at den skrives, i stedet for å blåses opp fra midten.
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
      className="group relative inline-block rounded-interaktiv whitespace-nowrap text-[#DE4826] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C03A1C]"
    >
      {v.ord}
      <span
        aria-hidden
        className="absolute right-0 -bottom-[0.05em] left-0 h-[0.05em] bg-[rgba(222,72,38,0.28)]"
      />
      <span
        aria-hidden
        className="absolute right-0 -bottom-[0.05em] left-0 h-[0.05em] origin-left scale-x-0 bg-[#DE4826] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
      />
    </Link>
  );
}

export function Maalet({ navn }: { navn: string }) {
  /*
   * `overflow-hidden` ER IKKE VALGFRITT. Lysskjæret stikker 8 rem ut til
   * høyre for å ha senteret sitt utenfor bildet. Uten klipping gir det 128
   * px vannrett rulling på ALLE bredder — målt, ikke antatt.
   */
  return (
    <section
      aria-labelledby="verdiene"
      className="relative isolate overflow-hidden"
    >
      {/*
        ETT SKJÆR, IKKE TO. På mørk flate måtte blomstringen ligge på 26 %
        for å synes i det hele tatt. På lys flate blir 26 % en oransje sky —
        8 % er nok til at hjørnet er varmere enn resten uten at man kan peke
        på hvor det begynner. Dekor, derfor `aria-hidden`.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 -z-10 size-[46rem] rounded-full bg-[radial-gradient(circle,rgba(222,72,38,0.08),transparent_66%)]"
      />

      <h2 id="verdiene" className="sr-only">
        Slik jobber vi, og hva det skal føre til
      </h2>

      <div className={`relative ${INNE}`}>
        <div className="flex items-center gap-3.5 pt-9 sm:pt-14">
          <span className="font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-aksent-tekst uppercase">
            Hei, {navn}
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-[linear-gradient(to_right,var(--border-rule),transparent)]"
          />
        </div>

        {/*
          MÅLET ER TRE TIL FIRE LINJER, ikke én lang. `max-w` i `ch` binder
          bredden til tegn og ikke til piksler, så linjelengden holder seg
          når skriftgraden vokser med vinduet.
        */}
        {/*
          ── TEGNSETTINGEN MÅ HENGE PÅ ORDET FORAN ─────────────────────────

          `whitespace-nowrap` på selve lenken hindrer at «GODT FORBEREDT»
          brekker i to. Den hindrer IKKE at linjen brytes mellom lenken og
          kommaet rett etter, for det er to naboer i teksten.

          Resultatet var en linje som begynte med «, GODT FORBEREDT». Derfor
          ligger hvert tegn inne i samme `nowrap`-gruppe som ordet det hører
          til. Gruppen er `inline` og ikke `inline-block`: sistnevnte ville
          gjort hvert ledd til en egen boks og slått ut `text-balance`.
        */}
        <p className="display mt-7 max-w-[28ch] text-[clamp(2.125rem,6.2vw,5.5rem)] leading-[1.02] tracking-[-0.032em] text-balance text-blekk sm:mt-9">
          Vi er alltid{" "}
          <span className="whitespace-nowrap">
            <Verdiord i={0} />,
          </span>{" "}
          <Verdiord i={1} /> og{" "}
          <span className="whitespace-nowrap">
            <Verdiord i={2} />.
          </span>
        </p>

        <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet sm:mt-8 sm:text-[1.1875rem]">
          Dette er det kundene skal si når de anbefaler oss videre.
        </p>

        <div className="h-10 sm:h-16" />
      </div>

      {/*
        MÅLFLATEN. Setningens siste ledd, på en tone som er et halvt trinn
        dypere enn siden. Skiftet ligger der teksten selv snur: fra hva vi
        gjør, til hva det skal føre til.

        Før var dette en mettet oransje blokk. Den ropte høyere enn
        overskriften over, og det er feil rangering — målene er følgen, ikke
        saken. En tone gjør samme jobb og lar typen være det man ser.
      */}
      <div className="relative border-y border-kant bg-dempet">
        <div className={`${INNE} pt-9 pb-10 sm:pt-11 sm:pb-14`}>
          {/*
            PILA GJØR ÅRSAKSFORHOLDET SYNLIG. Den peker ned fra flaten over
            og inn i denne. Ett tegn sier det et avsnitt sa før, og det er
            `aria-hidden` fordi ordene ved siden av sier det samme.
          */}
          <p className="flex items-baseline gap-2.5 font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-aksent-tekst uppercase">
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

            TALLENE sier ikke rekkefølge eller prioritet. De sier at det er
            nøyaktig to, og at listen er lukket. `aria-hidden`: en skjermleser
            leser allerede «1 av 2» fra listen selv.
          */}
          <ul className="mt-6 grid border-t border-kant-regel sm:mt-8 sm:grid-cols-2">
            {MALENE.map((mal, i) => (
              <li
                key={mal}
                className={
                  "flex items-baseline gap-4 py-6 sm:py-9 " +
                  (i === 0
                    ? "sm:pr-12"
                    : "border-t border-kant-regel sm:border-t-0 sm:border-l sm:border-l-kant-regel sm:pt-6 sm:pl-12")
                }
              >
                <span
                  aria-hidden
                  className="font-sans text-[0.6875rem] font-medium tracking-[0.1em] text-aksent-tekst tabular-nums"
                >
                  0{i + 1}
                </span>
                <span className="display text-[clamp(1.625rem,4.2vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-balance text-blekk">
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
