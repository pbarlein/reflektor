import Link from "next/link";

/**
 * Forsidens toppdel: de tre verdiene, og målene som følger av dem.
 *
 * ── REKKEFØLGEN ER SELVE POENGET ──────────────────────────────────────────
 *
 * Første versjon hadde målene øverst og «hvordan» under. Det var feil vei.
 * Ingen kan gå på jobb og jobbe direkte mot «at faste kunder aldri sier
 * opp» — det er et utfall, ikke en handling. Det man kan gjøre noe med, er
 * å være proaktiv, forberedt og entusiastisk i dag.
 *
 * Derfor står verdiene øverst og målene under: det vi bestemmer selv er
 * årsaken, målene er konsekvensen.
 *
 * ── HVORFOR DETTE ER EN LISTE OG IKKE TRE KORT (omskrevet 22.09.2026) ─────
 *
 * Versjonen før denne satte de tre verdiene i tre like kolonner. Da ble
 * hvert ord like stort som en tredjedel av bredden — altså ikke stort. Med
 * forklaring, rubrikknavn og en avsluttende bunntekst inni samme flate
 * havnet ordene i konkurranse med sin egen brødtekst, og verdiene leste
 * som tre små kort blant mange andre kort lenger nede.
 *
 * Nå er de tre rader over hele bredden. Ett ord per rad får hele skjermen,
 * og skalerer med den (`clamp`). Prisen er høyde; gevinsten er at det er
 * umulig å bla forbi uten å ha lest dem. Radformen gir dessuten et
 * treffområde på hele bredden, som er merkbart bedre på telefon enn tre
 * smale kort ved siden av hverandre.
 *
 * Teksten er skåret til det som må stå: én etikett, ett ord og én linje per
 * verdi. Rubrikknavnet ligger i `aria-label`, så skjermleseren får vite
 * hvor lenken går uten at flaten må si det to ganger.
 *
 * ── FARGESKIFTET GJØR JOBBEN EN SETNING GJORDE FØR ────────────────────────
 *
 * Den gamle versjonen forklarte med ord at målene er utfall og ikke
 * oppgaver. Nå ligger de på en egen flate i en annen farge, under de tre
 * radene. Årsak på mørk flate, konsekvens på oransje. Det sier det samme
 * uten å be noen lese et avsnitt til.
 *
 * ── FULL BREDDE ───────────────────────────────────────────────────────────
 *
 * Seksjonen ligger utenfor `Container` og har sin egen indre bredde, på
 * samme måte som radene. Et avrundet kort inne i en marg ville gjort den
 * til nok et kort. Én flate fra kant til kant er det eneste elementet på
 * siden som ikke ser ut som innhold — og det er nettopp det den ikke er.
 *
 * ── KONTRASTENE ER REGNET (WCAG 2.1) ──────────────────────────────────────
 *
 * Mot #1C1310:
 *   #F6F4F1 bone            16,63  ✓ AAA
 *   #C9BDB4 dempet           9,93  ✓ AAA
 *   #F08A70 oransje-300      7,46  ✓ AAA — oransjen for småtekst her
 *   #A4968C                  6,36  ✓ AA
 *
 * Mot #932E17 (konsekvensflaten):
 *   #FFFFFF                  7,94  ✓ AAA
 *   #FDF0EC oransje-050      7,13  ✓ AAA
 *
 * Merk at merkeoransjen #DE4826 IKKE brukes som flate bak tekst: den gir
 * 4,40 mot nærsvart, altså under AA for brødtekstgrad. #932E17 er samme
 * farge lenger ned i paletten, og den bærer hvit tekst i alle grader.
 */

/**
 * De tre tingene vi faktisk bestemmer selv.
 *
 * Ordene er Påls, fra «Ved å alltid være proaktiv, godt forberedt og
 * entusiastisk». Linjen under hvert ord er hentet fra rubrikken det lenker
 * til, slik at toppdelen ikke kan si noe annet enn fagteksten.
 */
const VERDIENE = [
  {
    ord: "Proaktiv",
    utdyp: "Vi kommer med noe, i stedet for å spørre om noe.",
    slug: "proaktiv-kundekontakt",
    rubrikk: "Proaktiv kontakt mellom produksjonsdagene",
  },
  {
    ord: "Forberedt",
    utdyp: "Kunden merker det på ett sekund — og fraværet på mindre.",
    slug: "forberedt-til-kundemote",
    rubrikk: "Godt forberedt til kundemøte",
  },
  {
    ord: "Entusiastisk",
    utdyp: "Forskjellen på godt nok og noe vi står inne for.",
    slug: "stolthet-og-standard",
    rubrikk: "Stolthet og standard",
  },
] as const;

/** Konsekvensen. Ordrett fra Pål. */
const MALENE = [
  "Faste kunder sier ikke opp.",
  "Engangskunder kommer tilbake.",
] as const;

/** Samme indre bredde og polstring som radene lenger nede på siden. */
const INNE = "mx-auto w-full max-w-[88rem] px-5 sm:px-8";

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
        Verdiene våre, og målene som følger av dem
      </h2>

      <div className={`relative ${INNE}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-9 pb-7 sm:pt-12 sm:pb-9">
          <p className="font-sans text-xs font-medium tracking-[0.12em] text-[#F08A70] uppercase">
            Dette bestemmer vi selv
          </p>
          <p className="text-[0.9375rem] text-[#A4968C]">Hei, {navn}.</p>
        </div>

        <ol className="border-t border-[rgba(255,255,255,0.14)]">
          {VERDIENE.map((v, i) => (
            <li
              key={v.ord}
              className="border-b border-[rgba(255,255,255,0.14)]"
            >
              <Link
                href={`/rubrikk/${v.slug}`}
                aria-label={`${v.ord} — les «${v.rubrikk}»`}
                /*
                  Negativ marg + polstring: flatevasken ved peker skal dekke
                  litt MER enn teksten, ellers ser den ut som en ramme rundt
                  ordet i stedet for en rad som lyser opp.
                */
                className="group -mx-3 block rounded-interaktiv px-3 py-5 transition-colors hover:bg-[rgba(255,255,255,0.035)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F08A70] sm:-mx-4 sm:px-4 sm:py-7"
              >
                {/*
                  FASTE KOLONNER, IKKE `auto`. Med automatisk bredde ville
                  «Entusiastisk» skjøvet sin forklaring lenger ut enn
                  «Proaktiv» sin, og de tre linjene hadde startet på tre
                  ulike steder. Faste brøker gir én loddrett linje ned
                  gjennom ordene og én ned gjennom forklaringene.
                */}
                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 sm:grid-cols-[3rem_minmax(0,0.78fr)_minmax(0,1fr)_1.75rem] sm:gap-x-6">
                  <span
                    aria-hidden
                    className="font-sans text-[0.8125rem] leading-none font-medium tabular-nums text-[#F08A70]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="display block text-[clamp(2.5rem,8.5vw,5rem)] leading-[0.92] tracking-[-0.035em] transition-colors group-hover:text-[#F08A70]">
                    {v.ord}
                  </span>

                  {/*
                    `col-start-2` på mobil: forklaringen legger seg under
                    ordet og på linje med det, ikke under tallet. Uten det
                    får linjen fire tegn ekstra innrykk som ingenting annet
                    på siden har.
                  */}
                  {/*
                    PILA STÅR INLINE PÅ TELEFON, i egen kolonne fra sm.

                    Som egen rutecelle på telefon fikk den en linje helt for
                    seg selv under forklaringen — femti piksler per rad for å
                    vise en pil som ikke pekte på noe. Inline etter siste ord
                    koster null høyde og sier det samme.
                  */}
                  <span className="col-start-2 block text-[0.9375rem] leading-relaxed text-pretty text-[#C9BDB4] sm:col-start-3 sm:text-base">
                    {v.utdyp}{" "}
                    <span
                      aria-hidden
                      className="inline-block text-[#F08A70] transition-transform group-hover:translate-x-1 motion-reduce:transition-none sm:hidden"
                    >
                      →
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="hidden text-[1.25rem] leading-none text-[#F08A70] transition-transform group-hover:translate-x-1.5 motion-reduce:transition-none sm:col-start-4 sm:block sm:justify-self-end"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/*
        KONSEKVENSFLATEN. Egen farge, full bredde, rett under den siste
        hårstreken. Skiftet er hele argumentet: over streken står det vi
        gjør, under står det som kommer ut av det.
      */}
      <div className="relative bg-[#932E17] text-white">
        <div className={INNE}>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 pt-8 sm:pt-10">
            <p className="font-sans text-xs font-medium tracking-[0.12em] text-[#FDF0EC] uppercase">
              Derfor
            </p>
            <p className="text-[0.9375rem] text-[#FDF0EC]">
              Målene er utfall. De tre over er det vi gjør noe med.
            </p>
          </div>

          <ul className="grid gap-x-12 gap-y-4 pt-5 pb-9 sm:grid-cols-2 sm:pt-6 sm:pb-11">
            {MALENE.map((mal) => (
              <li
                key={mal}
                className="display text-[clamp(1.5rem,3.6vw,2.25rem)] leading-[1.08] tracking-[-0.025em] text-balance"
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
