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
 * `whitespace-nowrap`: «GODT FORBEREDT» er to ord og én lenke. Uten den
 * brakk den over linjeskiftet, og da så den ut som to understrekede
 * fragmenter i stedet for ett ord man kan trykke på.
 *
 * `decoration-[0.06em]` og ikke `underline-offset` alene: i versaler ligger
 * understreket tett på bokstavene uansett, og en tynn strek forsvinner i
 * serifene. Den tykner ved peker og fokus i stedet for å endre farge, slik
 * at forskjellen også syns for den som ikke ser farger.
 */
function Verdiord({ i }: { i: number }) {
  const v = VERDIENE[i];
  return (
    <Link
      href={`/rubrikk/${v.slug}`}
      aria-label={`${v.ord} — les «${v.rubrikk}»`}
      className="rounded-interaktiv whitespace-nowrap text-[#F08A70] underline decoration-[rgba(240,138,112,0.45)] decoration-[0.06em] underline-offset-[0.16em] transition-[text-decoration-color] hover:decoration-[#F08A70] focus-visible:decoration-[#F08A70] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F08A70] motion-reduce:transition-none"
    >
      {v.ord}
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
        Et mykt oransjeskjær i hjørnet. Dekor, derfor `aria-hidden` og uten
        egen plass i flyten — men det er forskjellen på en svart boks og en
        flate som ser ut som den er laget med vilje.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 -right-40 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(222,72,38,0.26),transparent_64%)]"
      />

      <h2 id="verdiene" className="sr-only">
        Slik jobber vi, og hva det skal føre til
      </h2>

      <div className={`relative ${INNE}`}>
        <p className="pt-8 text-[0.9375rem] text-[#A4968C] sm:pt-11">
          Hei, {navn}.
        </p>

        {/*
          MÅLET ER TRE TIL FIRE LINJER, ikke én lang. `max-w` i `ch` binder
          bredden til tegn og ikke til piksler, så linjelengden holder seg
          når skriftgraden vokser med vinduet.
        */}
        <p className="display mt-5 max-w-[30ch] text-[clamp(1.875rem,5.6vw,4.25rem)] leading-[1.06] tracking-[-0.02em] text-balance sm:mt-7">
          Vi er alltid <Verdiord i={0} />, <Verdiord i={1} /> og{" "}
          <Verdiord i={2} />.
        </p>

        <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-pretty text-[#C9BDB4] sm:mt-6 sm:text-[1.25rem]">
          Dette er det kundene skal si når de anbefaler oss videre.
        </p>

        <div className="h-9 sm:h-12" />
      </div>

      {/*
        MÅLFLATEN. Setningens siste ledd, på egen farge. Skiftet ligger der
        teksten selv snur: fra hva vi gjør, til hva det skal føre til.
      */}
      <div className="relative bg-[#932E17] text-white">
        <div className={`${INNE} pt-8 pb-9 sm:pt-10 sm:pb-11`}>
          {/*
            PILA GJØR ÅRSAKSFORHOLDET SYNLIG. Den peker ned fra den mørke
            flaten og inn i denne. Ett tegn sier det et avsnitt sa før, og
            det er `aria-hidden` fordi ordene ved siden av sier det samme.
          */}
          <p className="flex items-baseline gap-2.5 text-[1.0625rem] leading-relaxed text-[#FDF0EC] sm:text-[1.1875rem]">
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
          */}
          <ul className="mt-5 grid border-t border-[rgba(255,255,255,0.3)] sm:mt-6 sm:grid-cols-2">
            {MALENE.map((mal, i) => (
              <li
                key={mal}
                className={
                  "display py-6 text-[clamp(1.625rem,4vw,2.5rem)] leading-[1.08] tracking-[-0.025em] text-balance sm:py-8 " +
                  (i === 0
                    ? "sm:pr-10"
                    : "border-t border-[rgba(255,255,255,0.3)] sm:border-t-0 sm:border-l sm:border-l-[rgba(255,255,255,0.3)] sm:pl-10")
                }
              >
                {mal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
