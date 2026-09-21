import Link from "next/link";

/**
 * Forsidens hero: de tre verdiene, og målene som følger av dem.
 *
 * ── REKKEFØLGEN ER SELVE POENGET ──────────────────────────────────────────
 *
 * Første versjon hadde målene øverst og «hvordan» under. Det var feil vei.
 * Ingen kan gå på jobb og jobbe direkte mot «at faste kunder aldri sier
 * opp» — det er et utfall, ikke en handling. Det man kan gjøre noe med, er
 * å være proaktiv, forberedt og entusiastisk i dag.
 *
 * Derfor står verdiene øverst og målene under en sumstrek: det vi
 * bestemmer selv er årsaken, og målene er konsekvensen. Rekkefølgen sier
 * hva man skal gjøre i morgen tidlig.
 *
 * ── HVERT KORT ER EN LENKE ────────────────────────────────────────────────
 *
 * En verdi som bare står der, er en plakat. Hver av de tre peker på den
 * rubrikken som faktisk lærer den bort, og forklaringen under hvert ord er
 * hentet derfra — ikke skrevet på nytt her. Da er heroen et sted man
 * begynner, ikke et sted man ser forbi.
 *
 * ── MØRK FLATE, OG HVORFOR DEN TÅLER DET ──────────────────────────────────
 *
 * Resten av huben er lys, fordi det er et oppslagsverk man leser lange
 * tekster i. Heroen er det motsatte: fire linjer man ser, ikke leser. Én
 * mørk flate på en lys side blir et blikkfang uten å koste lesbarhet noe
 * sted.
 *
 * KONTRASTENE ER REGNET (WCAG 2.1, mot #1C1310):
 *
 *   #F6F4F1 bone            16,63  ✓ AAA
 *   #C9BDB4 dempet           9,93  ✓ AAA
 *   #F08A70 oransje-300      7,46  ✓ AAA — oransjen for småtekst her
 *   #DE4826 merkeoransje     4,40  ✓ kun i display-grad, aldri småtekst
 *
 * Merk at merkeoransjen bytter rolle på mørk flate: på lys er det
 * #C03A1C som kan bære småtekst, her er det #F08A70. Begge er i paletten.
 */

/**
 * De tre tingene vi faktisk bestemmer selv.
 *
 * Ordene er Påls, fra «Ved å alltid være proaktiv, godt forberedt og
 * entusiastisk». Forklaringene er hentet ordrett fra rubrikken hver av dem
 * lenker til, slik at heroen ikke kan si noe annet enn fagteksten.
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
    utdyp:
      "Kunden merker forberedelse på ett sekund, og fraværet av den på mindre.",
    slug: "forberedt-til-kundemote",
    rubrikk: "Godt forberedt til kundemøte",
  },
  {
    ord: "Entusiastisk",
    utdyp: "Forskjellen på godt nok og noe vi vil sette navnet vårt på.",
    slug: "stolthet-og-standard",
    rubrikk: "Stolthet og standard",
  },
] as const;

/** Konsekvensen. Ordrett fra Pål. */
const MALENE = [
  "Faste kunder sier ikke opp.",
  "Engangskunder kommer tilbake.",
] as const;

export function Maalet({ navn }: { navn: string }) {
  return (
    <section
      aria-labelledby="verdiene"
      className="relative overflow-hidden rounded-medie bg-[#1C1310] text-[#F6F4F1]"
    >
      {/*
        Et mykt oransjeskjær i hjørnet. Det er dekor, og derfor `aria-hidden`
        og uten egen plass i flyten — men det er forskjellen på en svart boks
        og en flate som ser ut som den er laget med vilje.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(222,72,38,0.22),transparent_62%)]"
      />

      <div className="relative px-6 py-9 sm:px-10 sm:py-11 lg:px-14 lg:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="font-sans text-xs font-medium tracking-[0.1em] text-[#F08A70] uppercase">
            Dette bestemmer vi selv
          </p>
          <p className="text-[0.9375rem] text-[#A4968C]">Hei, {navn}.</p>
        </div>

        {/*
          TRE KOLONNER MED SKILLELINJER, ikke tre kort. Verdiene hører
          sammen — de er én setning delt i tre — og bokser ville gjort dem
          til tre separate ting.
        */}
        <h2 id="verdiene" className="sr-only">
          Verdiene våre, og målene som følger av dem
        </h2>
        <ol className="mt-7 grid gap-x-10 gap-y-8 sm:mt-8 sm:grid-cols-3">
          {VERDIENE.map((v, i) => (
            <li
              key={v.ord}
              className="sm:border-l sm:border-[rgba(255,255,255,0.14)] sm:pl-7 sm:first:border-l-0 sm:first:pl-0"
            >
              {/*
                `h-full` og `mt-auto` på lenkelinjen. Uten dem starter
                rubrikklenken rett under forklaringen, og forklaringene er
                ulikt lange — da havnet de tre pilene i tre ulike høyder, og
                raden så ut som den hadde ramlet ned.
              */}
              <Link
                href={`/rubrikk/${v.slug}`}
                className="group flex h-full flex-col rounded-interaktiv focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F08A70]"
              >
                <span
                  aria-hidden
                  className="display block text-[1.125rem] leading-none tabular-nums text-aksent"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display mt-3 block text-[2.25rem] leading-[0.95] tracking-[-0.03em] text-balance sm:text-[2.5rem] lg:text-[2.75rem]">
                  {v.ord}
                </span>
                <span className="mt-3 block text-[0.9375rem] leading-relaxed text-pretty text-[#C9BDB4]">
                  {v.utdyp}
                </span>
                {/*
                  PILEN FLYTER MED TEKSTEN, den er ikke et flex-søsken.
                  Med `flex` ble den skjøvet ut til høyre kant så snart
                  rubrikknavnet brøt over to linjer — på telefon sto pilen
                  alene ute i margen, uten noe å peke på. `inline-block`
                  lar den henge etter siste ord og fortsatt animeres.
                */}
                <span className="mt-4 block pt-0.5 text-[0.8125rem] leading-snug font-medium text-[#F08A70] sm:mt-auto">
                  {v.rubrikk}{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/*
          SUMSTREKEN. Formen er lånt fra prisseksjonen på salgssiden:
          faktorer over en strek, svaret under. Den passer her fordi
          innholdet har nøyaktig samme form — tre ting vi gjør, og det som
          kommer ut av dem.
        */}
        <div className="mt-9 border-t border-[rgba(255,255,255,0.18)] pt-7 sm:mt-11 sm:pt-8">
          <p className="font-sans text-xs font-medium tracking-[0.1em] text-[#A4968C] uppercase">
            Og derfor
          </p>
          {/*
            TRE KOLONNER, SOM OVER STREKEN. De to målene legger seg under de
            to første verdiene, og forklaringen fyller den tredje. Første
            versjon hadde to kolonner og et avsnitt under, og da sto hele
            høyre halvdel av flaten tom.
          */}
          <div className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-3">
            {MALENE.map((mal) => (
              <p
                key={mal}
                className="display text-[1.5rem] leading-tight tracking-[-0.02em] text-balance sm:text-[1.75rem] lg:text-[2rem]"
              >
                {mal}
              </p>
            ))}
            <p className="text-[0.9375rem] leading-relaxed text-pretty text-[#A4968C] sm:border-l sm:border-[rgba(255,255,255,0.14)] sm:pl-7">
              Begge to er utfall. Ingen kan gå på jobb og jobbe rett mot dem. De
              tre over streken er det vi faktisk gjør noe med, og alt lenger
              nede på siden er hjelp til å gjøre dem bedre.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
