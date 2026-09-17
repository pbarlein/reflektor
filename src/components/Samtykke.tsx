"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  COOKIE_LEVETID_SEK,
  COOKIE_NAVN,
  FULLT_SAMTYKKE,
  INGEN_SAMTYKKE,
  lesFraCookiestreng,
  serialiser,
  tilSignaler,
  type Samtykke as Valg,
} from "@/lib/samtykke";

/**
 * Samtykkebanneret.
 *
 * COPY-FORBEHOLD: teksten under er skrevet av meg, ikke av Pål. Den er
 * funksjonell og juridisk, ikke markedsføring, og et TBD-merke i et
 * samtykkebanner ville vært ubrukelig. Men den bør leses gjennom — og
 * særlig bør noen med juridisk ansvar bekrefte at kategoriene og
 * formuleringene dekker det som faktisk kjører.
 *
 * TRE KRAV STYRER UTFORMINGEN, og de er ikke smakssaker:
 *
 * 1. Å NEKTE SKAL VÆRE LIKE LETT SOM Å SAMTYKKE. «Godta alle» og «Bare
 *    nødvendige» er derfor to like store knapper, side om side, med samme
 *    vekt. En nedtonet «avvis»-lenke ved siden av en stor grønn knapp er
 *    det vanligste bruddet på dette, og det er bevisst design.
 * 2. SAMTYKKET SKAL KUNNE TREKKES TILBAKE. Bunnteksten har en lenke som
 *    åpner banneret igjen. Personvernerklæringens punkt 8 lover nettopp
 *    dette, og løftet sto udekket fram til nå.
 * 3. INGENTING FYRER FØR VALGET ER TATT. Consent Mode står på «denied» fra
 *    <head>, før GTM i det hele tatt lastes. Se samtykke.ts.
 *
 * BANNERET BLOKKERER IKKE SIDEN. Det er ikke en modal, det fanger ikke
 * fokus, og det kan ignoreres. Et samtykke som tvinges fram av at man ikke
 * kommer videre, er ikke fritt gitt — og en modal over en side man ikke har
 * sett ennå, er dessuten det mest effektive stedet å miste en besøkende.
 */

/**
 * Abonnerer på `data-samtykke` på <html>.
 *
 * DOM-ATTRIBUTTET ER SANNHETEN, ikke en React-tilstand. Det settes synkront
 * i <head> av skriptet i samtykke.ts, før noe React har kjørt, og det er
 * nettopp derfor banneret ikke blinker for den som allerede har svart.
 *
 * `useSyncExternalStore` er laget for akkurat dette: lese fra et system
 * utenfor React, med et eget svar for serverrendringen. Alternativet — å
 * sette tilstand i en effekt — avviser React-kompilatoren, og med god
 * grunn: det gir en ekstra rendring per sidelasting for noe som var kjent
 * før React startet.
 */
function abonner(varsle: () => void) {
  const iakt = new MutationObserver(varsle);
  iakt.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-samtykke"],
  });
  return () => iakt.disconnect();
}

function lesSvart(): boolean {
  return document.documentElement.getAttribute("data-samtykke") === "svart";
}

/**
 * På serveren later vi som om valget er tatt, så markeringen ikke inneholder
 * et banner. Klienten retter det opp i samme øyeblikk den vet bedre, og
 * `useSyncExternalStore` håndterer forskjellen uten hydreringsfeil.
 *
 * Retningen er med vilje: bedre at banneret kommer et øyeblikk for sent enn
 * at det står i HTML-en for alle og forsvinner for de fleste.
 */
function lesSvartPaServer(): boolean {
  return true;
}

function lagre(valg: Valg) {
  const sikker = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE_NAVN}=${encodeURIComponent(serialiser(valg))}` +
    `; Max-Age=${COOKIE_LEVETID_SEK}; Path=/; SameSite=Lax${sikker}`;
  document.documentElement.setAttribute("data-samtykke", "svart");
}

/**
 * Sender valget videre til Google og til GTM.
 *
 * TO KANALER, og begge trengs:
 *
 * `consent update` styrer Googles egne tagger direkte — GA4 og Ads leser
 * det uten at noen trenger å konfigurere noe.
 *
 * `samtykke_oppdatert` i dataLayer er for ALT ANNET. Meta-pikselen bryr seg
 * ikke om Googles samtykkesignaler i det hele tatt, og kan bare stanses av
 * en utløser inne i GTM-containeren. Den utløseren finnes ennå ikke — se
 * A42 — og hendelsen her er kroken den skal henge på.
 */
function meldFra(valg: Valg) {
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag?.("consent", "update", tilSignaler(valg));
  w.gtag?.("set", "ads_data_redaction", !valg.markedsforing);
  w.dataLayer.push({
    event: "samtykke_oppdatert",
    samtykke_analyse: valg.analyse ? "granted" : "denied",
    samtykke_markedsforing: valg.markedsforing ? "granted" : "denied",
  });
}

/**
 * Åpner banneret igjen. Bunnteksten kaller denne.
 *
 * En hendelse på `window` og ikke delt tilstand: lenken ligger i bunnteksten
 * og banneret i layoutet, og å binde dem sammen med en kontekst ville lagt
 * en leverandør rundt hele treet for én knapp.
 */
export const APNE_SAMTYKKE = "reflektor:apne-samtykke";

export function apneSamtykke() {
  window.dispatchEvent(new CustomEvent(APNE_SAMTYKKE));
}

export function Samtykkebanner() {
  const svart = useSyncExternalStore(abonner, lesSvart, lesSvartPaServer);
  const [tvungetApen, settTvungetApen] = useState(false);
  const [detaljer, settDetaljer] = useState(false);
  const [valg, settValg] = useState<Valg>(INGEN_SAMTYKKE);
  const forsteKnapp = useRef<HTMLButtonElement>(null);
  /* Hvem åpnet banneret, slik at Escape kan gi fokus tilbake dit. */
  const kaller = useRef<HTMLElement | null>(null);

  /*
   * Bare et abonnement. All tilstandsendring skjer inne i lytteren, altså i
   * en hendelse — ikke synkront i effektkroppen.
   */
  useEffect(() => {
    const apne = () => {
      kaller.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      settValg(lesFraCookiestreng(document.cookie) ?? INGEN_SAMTYKKE);
      settDetaljer(true);
      settTvungetApen(true);
    };
    window.addEventListener(APNE_SAMTYKKE, apne);
    return () => window.removeEventListener(APNE_SAMTYKKE, apne);
  }, []);

  /*
   * ESCAPE LUKKER, MEN BARE DET GJENÅPNEDE BANNERET.
   *
   * Et `role="dialog"` skal kunne lukkes med Escape — det står i ARIAs
   * mønsterbeskrivelse, og gjelder også de som ikke er modale. Her lukkes
   * det uten å endre noe: det lagrede valget står som det sto, og den som
   * angret på at hun åpnet innstillingene kommer ut igjen.
   *
   * FØRSTEGANGSVISNINGEN har ingen Escape. Da ville tasten fungert som et
   * svar uten å være et — banneret forsvant, ingenting ble lagret, og det
   * kom tilbake ved neste sidelasting. En bruker som ikke vil svare, kan
   * bare la det stå; det blokkerer ingenting.
   */
  useEffect(() => {
    if (!tvungetApen) return;
    const tast = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      settTvungetApen(false);
      settDetaljer(false);
      kaller.current?.focus();
    };
    document.addEventListener("keydown", tast);
    return () => document.removeEventListener("keydown", tast);
  }, [tvungetApen]);

  const synlig = tvungetApen || !svart;

  /*
   * Flytter fokus til banneret når det åpnes fra bunnteksten. Uten dette
   * ville en tastaturbruker klikket «Informasjonskapsler» og blitt stående
   * i bunnteksten mens noe dukket opp et helt annet sted.
   *
   * Ved FØRSTEGANGSVISNING flyttes fokus ikke: å rive fokus ut av siden før
   * brukeren har gjort noe, er sin egen form for tvang.
   */
  useEffect(() => {
    if (tvungetApen) forsteKnapp.current?.focus();
  }, [tvungetApen]);

  /*
   * RESERVERER PLASS UNDER BANNERET.
   *
   * Banneret er `fixed`, og lå derfor oppå det som tilfeldigvis var nederst
   * i vinduet. På telefon var det sendeknappen i kontaktskjemaet — 100 %
   * dekket, målt på deployet. Den som ikke svarte på banneret, kunne ikke
   * sende skjemaet. Det er den eneste KPI-en prosjektet har.
   *
   * ResizeObserver og ikke en fast verdi, fordi høyden avhenger av bredde,
   * skriftstørrelse og om valgene er utvidet. Et tall skrevet inn her ville
   * vært feil på den første telefonen som ikke lignet min.
   *
   * Ryddingen i opprydningsfunksjonen er ikke formalia: uten den ville
   * sidefoten beholdt et par hundre piksler dødplass etter at banneret var
   * besvart og borte.
   */
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panel.current;
    const rot = document.documentElement;
    if (!el) {
      rot.style.removeProperty("--samtykke-plass");
      return;
    }
    const iakt = new ResizeObserver(([post]) => {
      rot.style.setProperty(
        "--samtykke-plass",
        `${Math.ceil(post.target.getBoundingClientRect().height)}px`,
      );
    });
    iakt.observe(el);
    return () => {
      iakt.disconnect();
      rot.style.removeProperty("--samtykke-plass");
    };
    /* ResizeObserver fanger selv høydeendringer, så dette trenger bare kjøre
       når panelet kommer til eller forsvinner. */
  }, [synlig]);

  const svar = useCallback((v: Valg) => {
    lagre(v);
    meldFra(v);
    settValg(v);
    settTvungetApen(false);
    settDetaljer(false);
  }, []);

  if (!synlig) return null;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby="samtykke-tittel"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
    >
      {/*
        HØYDETAKET ER EN RETTELSE, ikke pynt. Med valgene utvidet ble panelet
        høyere enn en telefonskjerm, og et `fixed`-element som er høyere enn
        vinduet kan ikke rulles: overskriften og hele innledningen lå bak
        headeren, utenfor rekkevidde. Målt på iPhone 13 mot deployet.

        `dvh` og ikke `vh`, fordi det er nettopp på mobil dette gjelder, og
        `vh` regner med adresselinja som om den aldri er der.

        Taket er 80 % slik at panelet stopper godt under headeren — begge er
        `z-50`, og headeren ligger sist i DOM-en og vinner ved likhet.

        Rullingen ligger på teksten, ikke på hele panelet: knappene skal
        alltid være synlige. Det er dem seksjonen finnes for.
      */}
      <div className="mx-auto flex max-h-[80dvh] max-w-4xl flex-col rounded-medie border border-kant-pa-dyp/70 bg-dyp p-5 text-pa-dyp shadow-xl sm:p-7">
        {/*
          `-mx-1 px-1` gir fokusringen på avkrysningsboksene plass til å bli
          tegnet inne i rulleområdet i stedet for å bli klippet av det.
        */}
        <div className="-mx-1 min-h-0 overflow-y-auto px-1">
          <h2 id="samtykke-tittel" className="font-sans text-lg font-medium">
            Informasjonskapsler
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-pa-dyp-dempet">
            Vi bruker informasjonskapsler til måling og markedsføring. Ingenting
            settes før du har sagt ja.{" "}
            <Link href="/personvern" className="underline hover:text-pa-dyp">
              Les personvernerklæringen
            </Link>
            .
          </p>

          {detaljer && (
            <ul className="mt-5 space-y-3">
              {(
                [
                  [
                    "analyse",
                    "Analyse",
                    "Google Analytics. Hvilke sider som besøkes, og hvor besøkende kommer fra.",
                  ],
                  [
                    "markedsforing",
                    "Markedsføring",
                    "Google Ads og Meta. Måling av annonser, og målgrupper for markedsføring.",
                  ],
                ] as const
              ).map(([nokkel, tittel, beskrivelse]) => (
                <li
                  key={nokkel}
                  className="rounded-flate border border-kant-pa-dyp/70 p-4"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={valg[nokkel]}
                      onChange={(e) =>
                        settValg({ ...valg, [nokkel]: e.target.checked })
                      }
                      className="mt-1 size-4 shrink-0 accent-[color:var(--aksent-pa-dyp)]"
                    />
                    <span>
                      <span className="block font-medium">{tittel}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-pa-dyp-dempet">
                        {beskrivelse}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
              <li className="rounded-flate border border-dashed border-kant-pa-dyp/70 p-4 text-sm leading-relaxed text-pa-dyp-dempet">
                <span className="block font-medium text-pa-dyp">
                  Nødvendige
                </span>
                Kreves for at siden skal virke, og for å huske dette valget. Kan
                ikke slås av.
              </li>
            </ul>
          )}
        </div>

        {/*
          KNAPPENE HAR SAMME VEKT OG SAMME STØRRELSE. «Bare nødvendige» er
          ikke en nedtonet lenke ved siden av en stor knapp — det er det
          vanligste bruddet på kravet om at det skal være like lett å nekte
          som å samtykke.

          TO I BREDDEN PÅ MOBIL, ikke stablet. Stablet tok de tre knappene
          162 px av en telefonskjerm, og banneret som helhet 64 % av den.
          Google ber uttrykkelig om bannere «that take up only a small
          fraction of the screen», og et banner som spiser to tredjedeler av
          skjermen er dessuten en dårlig førstehåndsopplevelse uansett hva
          Google mener.

          Sideveis er også det som gjør likheten synlig: to like brede
          knapper ved siden av hverandre leses som et valg mellom likeverdige
          alternativer. Under hverandre leses den øverste som anbefalingen.
        */}
        <div className="mt-5 shrink-0">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              ref={forsteKnapp}
              type="button"
              onClick={() => svar(FULLT_SAMTYKKE)}
              className="rounded-interaktiv bg-aksent px-4 py-3 text-[0.9375rem] font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-aksent-hover motion-reduce:transition-none sm:px-5"
            >
              Godta alle
            </button>
            <button
              type="button"
              onClick={() => svar(INGEN_SAMTYKKE)}
              className="rounded-interaktiv border border-kant-pa-dyp bg-transparent px-4 py-3 text-[0.9375rem] font-medium text-pa-dyp transition-colors hover:bg-[rgba(245,240,232,0.08)] motion-reduce:transition-none sm:px-5"
            >
              Bare nødvendige
            </button>
            {detaljer && (
              <button
                type="button"
                onClick={() => svar(valg)}
                className="col-span-2 rounded-interaktiv border border-kant-pa-dyp bg-transparent px-4 py-3 text-[0.9375rem] font-medium text-pa-dyp transition-colors hover:bg-[rgba(245,240,232,0.08)] motion-reduce:transition-none sm:col-auto sm:px-5"
              >
                Lagre valget mitt
              </button>
            )}
          </div>
          {!detaljer && (
            /*
              «Velg selv» står UNDER og ikke i raden. Den er ikke et tredje
              likestilt svar — den åpner valgene. Å gi den samme vekt som de
              to svarene ville gjort valget uklarere, ikke friere.
            */
            <button
              type="button"
              onClick={() => settDetaljer(true)}
              className="mt-1 px-1 py-2 text-[0.9375rem] text-pa-dyp-dempet underline underline-offset-4 hover:text-pa-dyp"
            >
              Velg selv
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Lenka i bunnteksten som åpner banneret igjen.
 *
 * DENNE ER ET KRAV, IKKE EN BEKVEMMELIGHET. Et samtykke skal kunne trekkes
 * tilbake like lett som det ble gitt, og personvernerklæringens punkt 8
 * lover uttrykkelig at man kan «administrere eller trekke tilbake samtykke
 * til informasjonskapsler via innstillingene på nettsiden». Fram til nå
 * fantes ingen slike innstillinger — løftet sto udekket.
 *
 * `<button>` og ikke `<a>`. Den navigerer ikke; den åpner noe på samme side.
 * En lenke uten mål er en av de vanligste feilene i bunntekster, og den
 * koster en tastaturbruker et klikk som ikke gjør noe.
 */
export function Samtykkelenke() {
  return (
    <button
      type="button"
      onClick={apneSamtykke}
      className="text-left hover:text-aksent-tekst"
    >
      Informasjonskapsler
    </button>
  );
}
