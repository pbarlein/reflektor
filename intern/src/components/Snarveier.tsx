import Link from "next/link";

import { type Merke, SNARVEIER } from "@/content/snarveier";

/**
 * De seks rutene rett under toppdelen.
 *
 * ── HVORFOR DE LIGGER ØVERST, FØR LESESTOFFET ─────────────────────────────
 *
 * Forsiden åpnet med framdrift, søk og ti rader fagtekst. Det gjorde
 * intranettet til et bibliotek med et verktøy gjemt i menyen. Men ingen
 * logger inn her for å lese — de logger inn for å lage en produksjonsplan
 * før de drar på lokasjon. Lesestoffet er verdifullt, og det står fortsatt
 * under; det er bare ikke det man kom for.
 *
 * ── HVORFOR KVADRATER, OG HVORFOR SEKS ────────────────────────────────────
 *
 * Bestilt som 1:1. Formen gjør mer enn å se ryddig ut: den gir hver rute
 * nøyaktig like mye vekt, og da slipper vi å rangere seks oppgaver som
 * ingen har rangert. Seks fyller 3×2 på skjerm og 2×3 på telefon uten en
 * halvtom siste rad — det er den eneste rutenettstørrelsen under åtte som
 * går opp begge veier.
 *
 * ── MERKET ER STORT FORDI KVADRATET ER STORT ──────────────────────────────
 *
 * Første utgave hadde bare et lite merke i ett hjørne og tittelen i et
 * annet. Mellom dem lå 300 piksler tomt. Et kvadrat er en krevende form:
 * den lover at det er noe der, og holder man ikke løftet, ser ruta ut som
 * den mangler noe — ikke som den er luftig.
 *
 * Merket fyller derfor det øvre feltet. Det er tegnet med strek og ikke
 * flate, det ligger på 10 % blekk, og det er `aria-hidden`: en produsent
 * som ser dem to ganger kjenner igjen ruta på formen før hen har lest
 * ordet, og en skjermleser skal ikke måtte høre «kalendersymbol».
 *
 * ── «KOMMER» ER EN LENKE, IKKE EN DØD RUTE ────────────────────────────────
 *
 * Fem av seks sidene finnes ikke ennå. Alternativet var å la dem være
 * uklikkbare, men da hadde vi vist seks ting og gitt én. Nå fører hver rute
 * til en side som sier hva den skal bli og at den ikke er bygget — og den
 * som trykker får et svar i stedet for ingenting. `aria-describedby` gjør at
 * en skjermleser får «Kommer» med i lenkenavnet, ikke bare synet.
 */

/** Samme indre bredde og polstring som toppdelen og radene lenger nede. */
const INNE = "mx-auto w-full max-w-[88rem] px-5 sm:px-8";

/**
 * Strekene hvert merke er tegnet av, på et 24-rutenett.
 *
 * Tegnet for hånd og ikke hentet fra et ikonbibliotek: seks ikoner er ikke
 * verdt en avhengighet, og et bibliotek ville dratt med seg en strekvekt og
 * en hjørneradius som ikke er husets.
 */
const STREKER: Record<Merke, React.ReactNode> = {
  ark: (
    <>
      <path d="M6 3.5h8.5L18 7v13.5H6z" />
      <path d="M14 3.5V7h4" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2.5" />
    </>
  ),
  lyn: <path d="M13.5 2.5 6 13.5h5l-.5 8L18 10.5h-5z" />,
  kalender: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v5M16 3v5" />
      <path d="M8 14h3v3H8z" />
    </>
  ),
  folk: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M18 14.9c2 .8 3.5 2.8 3.5 5.6" />
    </>
  ),
  konvolutt: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  film: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M7 4.5v15M17 4.5v15M2.5 12h4.5M17 12h4.5" />
      <path d="m10 9.5 4.5 2.5-4.5 2.5z" />
    </>
  ),
};

function Merket({ merke }: { merke: Merke }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      /*
        MERKET FØLGER RUTEN, OG RUTEN ER BLITT LITEN. Med seks på én linje er
        ruta rundt 220 px, ikke 340. Et merke på 96 px ville da tatt nesten
        halve høyden og presset tittelen ut under kanten — det skjedde
        allerede på telefon med 72 px. 40 til 48 px er nok: merket skal gjøre
        ruta gjenkjennelig på en halv omgang med øynene, ikke være motivet.
      */
      className="size-10 text-blekk/10 transition-colors duration-300 group-hover:text-aksent/50 group-focus-visible:text-aksent/50 motion-reduce:transition-none sm:size-12"
    >
      {STREKER[merke]}
    </svg>
  );
}

export function Snarveier() {
  return (
    <section aria-labelledby="snarveier" className={`${INNE} pt-10 sm:pt-14`}>
      <h2
        id="snarveier"
        className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase"
      >
        Hva skal du gjøre?
      </h2>

      {/*
        ── ALLE SEKS PÅ ÉN LINJE ─────────────────────────────────────────
        Bestilt 28.09.2026. Det er ikke bare tettere: seks ruter på én linje
        leses i ett blikk, mens 3×2 tvinger øyet ned og tilbake, og da blir
        de tre nederste «resten». Alle seks er likeverdige, og én linje er
        den eneste formen som viser det.

        Ruta blir rundt 220 px på 1440. Det er over dobbelt så stort som
        anbefalt minste treffområde, og under grensen der en kvadratisk
        flate begynner å kreve et motiv for ikke å se tom ut.

        Trinnene under er ikke pynt: 2 på telefon, 3 på liten skjerm, 6 fra
        stor. På mellomstore vinduer ville seks 1:1-ruter blitt 120 px, og
        da får ikke «Skriv on-boardingsmail» plass på to linjer engang.
      */}
      <ul className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {SNARVEIER.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              aria-describedby={s.kommer ? "snarvei-kommer" : undefined}
              className="group relative flex aspect-square flex-col overflow-hidden rounded-flate border border-kant bg-kort p-4 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-kant-sterk hover:shadow-[0_14px_34px_-20px_rgba(28,19,16,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksent motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
            >
              {/*
                Et oransjeskjær som vokser fram i hjørnet ved peker. Ren
                dekor — derfor `aria-hidden` og ingen plass i flyten.
              */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-[radial-gradient(circle,rgba(222,72,38,0.14),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              />

              <span className="relative flex items-start justify-between gap-2">
                {s.kommer ? (
                  <span className="rounded-sm border border-kant px-1.5 py-0.5 font-sans text-[0.625rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
                    Kommer
                  </span>
                ) : (
                  <span className="rounded-sm bg-[color:var(--varsel-flate)] px-1.5 py-0.5 font-sans text-[0.625rem] font-medium tracking-[0.1em] text-aksent-tekst uppercase">
                    Klar
                  </span>
                )}
                <span
                  aria-hidden
                  className="text-blekk-svak transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-aksent-tekst group-focus-visible:text-aksent-tekst motion-reduce:transition-none"
                >
                  →
                </span>
              </span>

              {/*
                MERKET TAR RESTEN AV DET ØVRE FELTET. `flex-1` og sentrering
                gjør at det ligger i tyngdepunktet av kvadratet uansett hvor
                mange linjer tittelen tar — to linjer på «Skriv
                on-boardingsmail», én på «Dine kunder».
              */}
              <span className="relative flex min-h-0 flex-1 items-center justify-center py-1">
                <Merket merke={s.merke} />
              </span>

              <span className="relative">
                <span className="display block text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-[1.18] tracking-[-0.02em] text-balance text-blekk transition-colors group-hover:text-aksent-tekst group-focus-visible:text-aksent-tekst motion-reduce:transition-none">
                  {s.tittel}
                </span>
                {s.naar && (
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-pretty text-blekk-dempet">
                    {s.naar}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p id="snarvei-kommer" className="sr-only">
        Kommer — siden er ikke bygget ennå.
      </p>
    </section>
  );
}
