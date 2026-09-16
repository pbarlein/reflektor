"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { hovedmeny, hovedCta } from "@/content/navigasjon";

/**
 * Headeren.
 *
 * Fire lenker, én CTA, og en hamburger som bare finnes på mobil. Hva som er
 * med og hvorfor står i src/content/navigasjon.ts — her står hvordan.
 *
 * DELVIS VEDVARENDE, IKKE FAST OG IKKE STATISK. Headeren ligger klistret,
 * men skyves ut av veien når man ruller nedover og kommer tilbake med én
 * gang man ruller oppover. Det er NN/gs anbefaling (Laubheimer, 04.04.2021).
 *
 * Grunnen til at det ikke er en smakssak: forsiden er lang. En statisk
 * header betyr at både navigasjon og CTA er utilgjengelige fra og med andre
 * skjermhøyde — man må rulle helt til topps. En alltid synlig header koster
 * plass permanent, og på en iPhone med begge verktøylinjene framme er det
 * synlige vinduet rundt 660 px: 64 px header er nesten 10 % av det, på hver
 * eneste skjermhøyde. Delvis vedvarende koster ingenting mens man leser og
 * er der i samme øyeblikk man ser etter den.
 *
 * INGEN MÅLT EFFEKT FINNES. Et researchspor gikk gjennom litteraturen
 * 16.09.2026: ingen kontrollert måling av klistret mot statisk header i
 * noen retning. Det ofte siterte «22 % raskere» er én test fra 2012 med
 * 40 deltakere, kun desktop, uten signifikanstesting, aldri replikert.
 * Valget over er en designvurdering med oppgitt begrunnelse — ikke et funn.
 *
 * WCAG 2.4.11 Focus Not Obscured. En klistret header som dekker et felt som
 * nettopp fikk tastaturfokus, er et AA-brudd. Derfor `scroll-padding-top` i
 * globals.css, satt til headerhøyden pluss litt. Den løser samtidig at
 * `#pris` og `#kontakt` ellers ville landet under headeren.
 *
 * `prefers-reduced-motion` slår av hele skjulingen. Da står headeren i ro og
 * synlig — ingen bevegelse, og ingenting går tapt.
 *
 * MOBILPANELET ER EN DISCLOSURE, IKKE EN MODAL. W3Cs APG-mønster
 * «Disclosure Navigation Menu»: knapp med `aria-expanded` og `aria-controls`,
 * Escape lukker og setter fokus tilbake på knappen, Tab går naturlig inn i
 * panelet. Ingen fokusfelle — den hører til en modal, og dette er ikke en
 * modal. Panelet åpnes ved KLIKK, aldri ved hover: hover-intent er et
 * problem man slipper å løse hvis man ikke lager det, og klikk oppfører seg
 * likt på touch.
 *
 * CTA-EN LIGGER UTENFOR HAMBURGEREN. NN/g (Pernice & Budiu, 26.06.2016, 179
 * deltakere) målte tre betingelser: skjult, synlig og kombinert. Kombinert —
 * det viktigste synlig, resten i menyen — var best på alle mål: 86 % mot
 * 57 % navigasjonsbruk på mobil, og lavest opplevd vanskelighet. Det er
 * nøyaktig dette mønsteret.
 *
 * ÉN LISTE, IKKE TO. Lenkene står i samme `<ul>` på alle bredder — vannrett
 * rad fra lg, nedtrekkspanel under. Alternativet, et eget mobilpanel, ville
 * lagt hver lenke to ganger i HTML-en. De ligger dessuten i markupen selv
 * når panelet er lukket (`hidden`, ikke betinget rendring), og det er
 * poenget: AI-crawlerne kjører ikke JavaScript — Vercels måling på eget
 * nett, 17.12.2024, fant at ingen av de store gjør det. En meny som først
 * monteres ved interaksjon, finnes ikke for dem.
 */
function useSkjulVedNedrulling() {
  const [skjult, setSkjult] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let forrige = window.scrollY;
    let venter = false;

    const les = () => {
      const y = window.scrollY;
      // Terskelen på 8 px demper skjelving fra treghetsrulling på iOS.
      if (Math.abs(y - forrige) > 8) {
        // Under 240 px er headeren alltid synlig. Ellers ville den blinket
        // bort i det man så vidt dytter siden i gang.
        setSkjult(y > forrige && y > 240);
        forrige = y;
      }
      venter = false;
    };

    const ved = () => {
      if (venter) return;
      venter = true;
      requestAnimationFrame(les);
    };

    window.addEventListener("scroll", ved, { passive: true });
    return () => window.removeEventListener("scroll", ved);
  }, []);

  return skjult;
}

export function Header() {
  const sti = usePathname();
  const skjult = useSkjulVedNedrulling();
  const [apen, setApen] = useState(false);
  const panelId = useId();

  // Escape lukker og gir fokus tilbake til knappen. Krav i APG-mønsteret, og
  // det eneste som gjør panelet forlatbart uten mus.
  useEffect(() => {
    if (!apen) return;
    const ved = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setApen(false);
      document.getElementById(`${panelId}-knapp`)?.focus();
    };
    document.addEventListener("keydown", ved);
    return () => document.removeEventListener("keydown", ved);
  }, [apen, panelId]);

  // Lukk ved navigasjon. Uten dette blir panelet stående åpent over den nye
  // siden, fordi App Router ikke laster dokumentet på nytt.
  //
  // Avledet under render, ikke i en effekt. React-kompilatoren avviser
  // setState i en effekt, og den har rett her: en effekt ville rendret
  // panelet åpent én gang på den nye siden før den lukket det igjen.
  const [sistSti, setSistSti] = useState(sti);
  if (sti !== sistSti) {
    setSistSti(sti);
    setApen(false);
  }

  /**
   * CTA-en peker på kontaktseksjonen når vi allerede er på forsiden, og på
   * /kontaktoss ellers. Et anker sparer en sidelasting for den som er nær
   * skjemaet fra før; /kontaktoss er riktig overalt ellers, og det er
   * URL-en alle eksisterende CTA-er peker på.
   */
  const ctaSti = sti === "/" ? "/#kontakt" : hovedCta.sti;

  const aktiv = (l: string) =>
    l.startsWith("/#") ? undefined : sti === l || sti.startsWith(`${l}/`);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-kant bg-flate/90 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${
        skjult && !apen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Container>
        <nav
          aria-label="Hovedmeny"
          className="relative flex items-center justify-between gap-4 py-4 lg:py-5"
        >
          <Link href="/" aria-label="Reflektor – til forsiden" className="shrink-0">
            <Logo variant="merke" className="h-8 text-base" />
          </Link>

          {/*
            Én liste, to former. Under lg er den et panel som henger under
            headerlinjen; fra lg er den en vannrett rad midt i den. `hidden`
            Panelet strekkes ut av containerens luft med -mx-6-trikset, slik
            at kanten under det flukter med headerens egen kantlinje. Uten
            det ser panelet ut som en boks som har havnet litt feil.

            Lukket panel er `display: none` via klasse, ikke betinget
            rendring: lenkene står i HTML-en uansett — se kommentaren over om
            crawlere uten JavaScript. `hidden`-attributtet kan IKKE brukes
            her; det er en UA-regel, og enhver display-klasse fra Tailwind
            slår den, så panelet ville stått permanent åpent.
          */}
          <ul
            id={panelId}
            className={`
              absolute top-full -right-6 -left-6 z-10 flex-col gap-1
              border-b border-kant bg-flate px-2 py-3 shadow-sm
              lg:static lg:z-auto lg:flex lg:flex-row lg:items-center lg:gap-8
              lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none
              ${apen ? "flex" : "hidden"}
            `}
          >
            {hovedmeny.map((l) => (
              <li key={l.sti}>
                <Link
                  href={l.sti}
                  aria-current={aktiv(l.sti) ? "page" : undefined}
                  className="
                    block rounded-interaktiv px-4 py-2.5 text-[0.9375rem]
                    tracking-[0.01em] hover:bg-flate-dempet
                    aria-[current=page]:font-medium
                    lg:px-0 lg:py-1 lg:hover:bg-transparent
                    lg:aria-[current=page]:underline
                    lg:aria-[current=page]:decoration-aksent
                    lg:aria-[current=page]:decoration-2
                    lg:aria-[current=page]:underline-offset-8
                  "
                >
                  {l.navn}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={ctaSti}
              className="rounded-interaktiv bg-aksent px-4 py-2.5 text-[0.9375rem] font-medium text-[#0D0D0D] transition-colors hover:bg-aksent-hover sm:px-5"
            >
              {hovedCta.navn}
            </Link>

            {/*
              Knappen bærer tilstanden, ikke lenken. Utløseren MÅ være en
              `<button>` og ikke en `<a>`: den navigerer ikke, den åpner noe.
            */}
            <button
              type="button"
              id={`${panelId}-knapp`}
              aria-expanded={apen}
              aria-controls={panelId}
              onClick={() => setApen((v) => !v)}
              className="-mr-2 rounded-interaktiv p-2 lg:hidden"
            >
              <span className="sr-only">
                {apen ? "Lukk menyen" : "Åpne menyen"}
              </span>
              <svg
                viewBox="0 0 24 24"
                className="size-6 stroke-current"
                fill="none"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {apen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M3.5 7.5h17M3.5 16.5h17" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
