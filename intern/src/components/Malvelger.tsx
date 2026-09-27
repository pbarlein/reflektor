"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Fase } from "@/content/maltype";
import { treffer } from "@/lib/malsok";

/**
 * Malvelgeren.
 *
 * ── HVORFOR MINIATYRENE BLE FJERNET ───────────────────────────────────────
 *
 * Første utgave var et rutenett med tre kort i bredden, og øverst i hvert
 * kort en miniatyr av arket. Begrunnelsen den gang: «et navn alene svarer
 * ikke på om det er denne jeg skal ha — en miniatyr gjør det på et halvt
 * sekund».
 *
 * Den begrunnelsen holdt ikke. Miniatyrene tegnes av `skisse`, og sju av
 * åtte maler begynner med de samme delene: mørkt hode, faktalinje, tabell.
 * Resultatet var åtte bilder som i praksis var det samme bildet — grå
 * blokker under en svart stripe — og de sa ingenting om hvilken mal du så
 * på. De tok samtidig 180 piksler av høyden hver, og gjorde siden 2 529
 * piksler lang for åtte valg.
 *
 * Nielsen Norman Group har akkurat dette som kriterium: ta med en miniatyr
 * bare hvis bildet hjelper deg å velge, og la den være hvis bildene «ser
 * vesentlig like ut» i liten størrelse. Det gjorde de.
 * https://www.nngroup.com/articles/mobile-list-thumbnail/
 *
 * ── HVA DEN BLE I STEDET ──────────────────────────────────────────────────
 *
 * En tett liste. Shopify Polaris skiller mellom to formål: skal man
 * SAMMENLIGNE data, bruk tabell; skal man FINNE noe og handle på det, bruk
 * en resource list. Dette er det andre. Produsenten kommer ikke hit for å
 * bla — hen vet hva hen skal lage, og skal dit på færrest mulig sekunder.
 *
 * Derfor er alle åtte synlige på én skjerm, derfor er raden hele treffet,
 * og derfor kan hele greia styres fra tastaturet: skriv for å filtrere,
 * piltast for å flytte, enter for å gå. Det er mønsteret Linear og Raycast
 * bygger hele grensesnittet sitt på, og grunnen er den samme som her —
 * verktøy man bruker hver uke, belønner hastighet, ikke utstilling.
 *
 * Miniatyren finnes fortsatt, på malsiden. Der er den ÉN, den er stor, og
 * du har allerede valgt — da viser den formen på det du er i ferd med å
 * lage, i stedet for å konkurrere med sju like naboer.
 */

export type Malrad = {
  slug: string;
  navn: string;
  kort: string;
  ansvarlig: string;
  naar: string;
  fase: Fase;
};

export function Malvelger({
  maler,
  faser,
  children,
}: {
  maler: readonly Malrad[];
  faser: readonly Fase[];
  /**
   * Overskriften, sendt inn fra serversiden.
   *
   * Den ligger her og ikke over komponenten fordi søkefeltet skal stå PÅ
   * SAMME LINJE som tittelen. Sto de under hverandre, kostet toppen av
   * siden 363 piksler før første mal — på en 800 piksler høy laptopskjerm
   * er det nesten halve skjermen brukt på å si hva siden heter.
   *
   * Teksten eies fortsatt av siden. Det er bare plasseringen som bor her.
   */
  children: React.ReactNode;
}) {
  const [spørring, setSpørring] = useState("");
  const listeRef = useRef<HTMLDivElement>(null);
  const søkRef = useRef<HTMLInputElement>(null);

  const synlige = useMemo(
    () => maler.filter((m) => treffer(m, spørring)),
    [maler, spørring],
  );

  /*
   * ── «/» FOKUSERER SØKET, OG SIDEN AUTOFOKUSERER IKKE ──────────────────────
   *
   * Autofokus var det opplagte valget og det feile. På mobil spretter
   * tastaturet opp før du har sett siden, mellomrom og Page Down slutter å
   * rulle, og en skjermleser begynner midt i stedet for på toppen.
   *
   * «/» er det de fleste verktøy har landet på — GitHub, Linear, Slack — og
   * det koster ingenting for den som ikke kjenner det.
   */
  useEffect(() => {
    function påTastGlobalt(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = document.activeElement;
      /* Skriver du allerede et sted, er «/» en skråstrek. */
      if (
        i instanceof HTMLInputElement ||
        i instanceof HTMLTextAreaElement ||
        i instanceof HTMLSelectElement ||
        (i instanceof HTMLElement && i.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      søkRef.current?.focus();
      søkRef.current?.select();
    }
    window.addEventListener("keydown", påTastGlobalt);
    return () => window.removeEventListener("keydown", påTastGlobalt);
  }, []);

  /**
   * Piltastene flytter EKTE fokus mellom lenkene.
   *
   * Alternativet var en `aria-activedescendant`-konstruksjon med en egen
   * markering. Den hadde krevd at vi selv holdt orden på hva som er valgt,
   * hva skjermleseren skal si, og hva enter gjør — og alt det finnes
   * gratis når fokus ligger der brukeren tror det ligger.
   */
  function flytt(fra: HTMLElement | null, retning: 1 | -1) {
    const lenker = Array.from(
      listeRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-rad]") ??
        [],
    );
    if (!lenker.length) return;
    const nå = fra ? lenker.indexOf(fra as HTMLAnchorElement) : -1;
    const neste =
      nå < 0 ? (retning === 1 ? 0 : lenker.length - 1) : nå + retning;

    /* Opp fra første rad går tilbake til søkefeltet. Der begynte man. */
    if (neste < 0) {
      søkRef.current?.focus();
      søkRef.current?.select();
      return;
    }
    lenker[Math.min(neste, lenker.length - 1)]?.focus();
  }

  function påTast(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      flytt(
        document.activeElement instanceof HTMLAnchorElement
          ? document.activeElement
          : null,
        e.key === "ArrowDown" ? 1 : -1,
      );
    }
  }

  return (
    <div onKeyDown={påTast}>
      {/*
        SØKEFELTET ER LITE MED VILJE.
        Med åtte maler synlige samtidig er det ikke det man trenger for å
        finne fram — det er det man trenger for å slippe å ta hånda fra
        tastaturet. Da skal det ikke se ut som sidens hovedsak.
      */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">{children}</div>

        <div className="relative w-full shrink-0 sm:max-w-[19rem]">
          <input
            ref={søkRef}
            type="search"
            value={spørring}
            onChange={(e) => setSpørring(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && synlige.length) {
                e.preventDefault();
                listeRef.current
                  ?.querySelector<HTMLAnchorElement>("a[data-rad]")
                  ?.click();
              }
              if (e.key === "Escape") setSpørring("");
            }}
            placeholder="Søk i malene"
            aria-label="Søk i malene"
            aria-describedby="malsok-hjelp"
            className="w-full rounded-interaktiv border border-kant bg-kort py-2.5 pr-4 pl-10 text-[0.9375rem] text-blekk transition-colors placeholder:text-blekk-svak focus:border-kant-sterk focus:outline-none motion-reduce:transition-none"
          />
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-blekk-svak"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" strokeLinecap="round" />
          </svg>
          {/*
          Tasten står i feltet, ikke i en hjelpetekst under. Et hint man må
          lete etter, er ikke et hint. Den forsvinner så snart feltet er i
          bruk, for da har den gjort jobben sin.
        */}
          {!spørring && (
            <kbd
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-sm border border-kant px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none text-blekk-svak max-sm:hidden"
            >
              /
            </kbd>
          )}
          <p id="malsok-hjelp" className="sr-only">
            Skriv for å filtrere. Pil ned og pil opp flytter mellom malene,
            enter åpner den som er valgt. Skråstrek fokuserer dette feltet fra
            hvor som helst på siden.
          </p>
        </div>
      </div>

      <div ref={listeRef} className="mt-6 flex flex-col gap-6">
        {faser.map((fase) => {
          const iFasen = synlige.filter((m) => m.fase === fase);
          /* En tom fase under et søk er støy, ikke informasjon. */
          if (!iFasen.length) return null;

          return (
            <section key={fase}>
              <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-blekk-dempet uppercase">
                {fase}
                <span className="ml-2 tabular-nums text-blekk-svak">
                  {iFasen.length}
                </span>
              </h2>

              {/*
                Fasen er et panel, og radene ligger inni med hårstrek
                mellom. Grupperingen er domenets egen — står du foran
                opptaket, på det, eller etter det — og den er samtidig
                grensen for hva som får lages her i det hele tatt.
              */}
              <ul className="mt-2.5 overflow-hidden rounded-flate border border-kant bg-kort">
                {iFasen.map((m, i) => (
                  <li
                    key={m.slug}
                    className={i > 0 ? "border-t border-kant" : undefined}
                  >
                    <Link
                      href={`/dokument/${m.slug}`}
                      data-rad
                      className="group grid gap-x-6 gap-y-0.5 px-4 py-3 transition-colors hover:bg-dempet focus-visible:bg-dempet focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-aksent sm:grid-cols-[minmax(0,1fr)_9rem] sm:px-5"
                    >
                      <span className="min-w-0">
                        <span className="block text-[1.0625rem] font-medium tracking-[-0.01em] text-blekk transition-colors group-hover:text-aksent-tekst group-focus-visible:text-aksent-tekst motion-reduce:transition-none">
                          {m.navn}
                        </span>
                        <span className="mt-0.5 block text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
                          {m.kort}
                        </span>
                      </span>

                      {/*
                        ── «NÅR» STÅR IKKE HER, OG DET ER MED VILJE ────────
                        Først sto både rolle og tidspunkt i en høyrejustert
                        spalte. To problemer: «Etter oppstartsmøtet, senest
                        en uke før produksjonsdagen» er en setning og ikke en
                        tabellverdi, så høyrejustert brøt den i tre ujevne
                        linjer — og den gjorde HVER rad to linjer høy uansett
                        hvor kort malen ellers var.

                        Men det avgjørende er at den var overflødig nettopp
                        her. Bolken raden ligger i sier allerede når i løpet
                        du er; det er hele poenget med å gruppere på fase.
                        Det nøyaktige tidspunktet står på malsiden, der du
                        faktisk skal bruke det.

                        Igjen står rollen: ett ord, som svarer på om malen er
                        din i det hele tatt.
                      */}
                      <span className="text-[0.8125rem] leading-relaxed text-blekk-svak sm:pt-0.5">
                        {m.ansvarlig}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {!synlige.length && (
          <p className="rounded-flate border border-kant border-dashed px-4 py-6 text-center text-[0.9375rem] text-blekk-svak">
            Ingen maler heter noe som ligner «{spørring}».
          </p>
        )}
      </div>
    </div>
  );
}
