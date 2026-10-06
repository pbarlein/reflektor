/**
 * Levering av skjemaleads på e-post.
 *
 * Leads er den eneste KPI-en (brief 0.3). Derfor to prinsipper her:
 *
 * 1. Redirect til /takk skal ALLTID skje, også når e-posten feiler. Mister vi
 *    den sidevisningen, mister vi GA4-hendelsen og Google Ads-konverteringen –
 *    altså selve målingen. En lead som kommer fram men ikke telles er ille;
 *    en som verken kommer fram eller telles er verre.
 * 2. Feil logges tydelig. De er kun synlige i Vercel-loggen, så en testinnsending
 *    etter hver endring er ikke valgfritt.
 *
 * VARSELET ER NÅ DET ENESTE PÅL FÅR. Endret av Cowork 03.10.2026: HubSpots
 * egne skjemavarsler er slått av, og arbeidsflyten «Nytt lead – inbound»
 * varsler bare for Meta-leads. Det som før var ett av tre varsler, er nå det
 * eneste — og da er formatet ikke en smaksak lenger.
 *
 * Nøkkelen ligger i Vercel-miljøvariabler, aldri i repoet (brief 8.1.2).
 */

import { randomUUID } from "node:crypto";

import { avbrytLenke } from "./avbrytsignatur";
import { faarPaaminnelse, osloTekst, paaminnelseTekst } from "./paaminnelse";
import { planlagtSending, venterPaaVinduet } from "./sendevindu";
import { serUtSomEpost } from "./skjemavern";

export type Lead = {
  navn: string;
  epost: string;
  bedrift: string;
  telefon: string;
  melding: string;
  side: string;
  /** Normalisert nettside, `https://…`. Tom hvis ingen er oppgitt eller utledet. */
  nettside: string;
  /** Sant når nettsiden er utledet av e-postdomenet, ikke skrevet inn. */
  nettsideUtledet: boolean;
  /** Hvor besøkende kom fra. Se lib/kilde.ts. Tom hvis ukjent. */
  kilde: string;
};

const MOTTAKER = process.env.LEAD_MOTTAKER ?? "pal@reflektor.no";

/**
 * Avsender. `onboarding@resend.dev` fungerer uten å røre DNS, men kan kun
 * sende til adressen Resend-kontoen er registrert på. Skal leads gå til flere
 * mottakere, må et eget domene verifiseres i Resend – det krever DNS-oppføringer
 * for e-post, ikke for nettstedet, og flytter altså ikke reflektor.no.
 */
const AVSENDER =
  process.env.LEAD_AVSENDER ?? "Reflektor <onboarding@resend.dev>";

/**
 * Emnet på varselet. Fast streng, bestilt av Pål 03.10.2026.
 *
 * HER STO NAVN OG BEDRIFT. De er tatt ut fordi emnet nå skal være
 * gjenkjennelig på ett blikk og sorterbart i innboksen — hvem det er, står
 * på første linje i meldingen. Et emne som varierer kan ikke filtreres på.
 */
export const VARSEL_EMNE = "NYTT LEAD fra reflektor.no";

/**
 * Emnet på Meta-varselet.
 *
 * SAMME FORM SOM NETTSIDEVARSELET, med kilden i stedet for domenet, så de
 * to kan skilles på ett blikk og filtreres hver for seg. Teksten er den
 * HubSpot-arbeidsflyten brukte, beholdt med vilje: Pål har allerede regler
 * og vaner knyttet til den.
 */
export const META_VARSEL_EMNE = "NYTT LEAD fra Meta";

/**
 * Det som kan skille Meta-varselet fra nettsidevarselet.
 *
 * MALEN ER DEN SAMME, OG DET ER HELE POENGET. HubSpot-varselet for Meta
 * hadde fast tekst om «neste hverdag kl. 09:00», ingen avbryt-knapp og rå
 * verdier som «nei,_ikke_nå». Pål skal lese ett format, ikke to.
 */
export type Varselvalg = {
  /** Rader som legges inn etter Bedrift. Meta-svarene. */
  ekstraRader?: [string, string][];
  /**
   * Utelater Nettside-raden og Behov-blokken. Meta-skjemaet har ingen av
   * dem, og en rad som alltid står tom er en rad Pål må lese forbi.
   */
  utenNettsideOgBehov?: boolean;
  /**
   * Møtetidspunktet, når personen allerede har booket. Da erstatter én
   * linje hele oppfølgingsblokken: det er ikke sendt noen e-post, og det
   * finnes ingen påminnelse å avbryte.
   */
  moteBooket?: Date | null;
};

/**
 * Emnet, med leadet i det.
 *
 * GMAIL TRÅDET VARSLENE SAMMEN. Alle hadde samme emne, og da legger Gmail
 * dem i én samtale og skjuler linjene som er like forrige melding bak «…»
 * på mobil. Linjen om presentasjon og påminnelse — den Pål leser for å vite
 * hvor lang tid han har på å ringe — var nettopp en slik linje.
 *
 * PREFIKSET STÅR URØRT FØRST. Leadsjekken søker på det, og et emne som
 * begynner et annet sted ville gjort søket blindt.
 *
 * NAVN, SÅ BEDRIFT I PARENTES. Mangler bedriften, står navnet alene;
 * mangler navnet, står e-postadressen. Et emne som slutter med « – ()» ser
 * ødelagt ut, og et emne uten noe å skille på tråder igjen.
 */
export function varselEmne(prefiks: string, lead: Lead): string {
  const navn = lead.navn.trim() || lead.epost.trim();
  const bedrift = lead.bedrift.trim();
  if (!navn) return prefiks;
  return `${prefiks} – ${navn}${bedrift ? ` (${bedrift})` : ""}`;
}

/** Escaper de fire tegnene som kan bryte ut av HTML-en i e-posten. */
function esc(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TOM = "–";

/**
 * Varselet til Pål.
 *
 * REKKEFØLGEN OG ETIKETTENE ER PÅLS, ORDRETT, og de skal ikke pyntes på:
 *
 *   Avsender · Mobilnummer · E-post · Bedrift · Nettside · Behov
 *
 * Han ringer leads samme dag. Derfor står mobilnummeret på linje to, før
 * e-posten, og derfor er de tre kontaktveiene lenker: ett trykk på telefon
 * i stedet for merk, kopier, lim inn.
 *
 * INGEN KILDE, INGEN SIDE, INGEN TEKNISK INFORMASJON. Det sto her før og er
 * tatt ut med vilje. Alt det ligger i HubSpot, der det hører hjemme, og
 * hvert felt i denne e-posten er et felt Pål må lese forbi for å finne
 * telefonnummeret.
 *
 * BEHOVET STÅR TIL SLUTT og med linjeskiftene i behold. Det er det eneste
 * feltet som kan være langt, og `white-space: pre-wrap` er det som gjør at
 * avsnitt forblir avsnitt.
 */
export function varsel(
  lead: Lead,
  sendt: Date = new Date(),
  /**
   * Sant når innsendingen til HubSpot feilet, også etter forsøket uten
   * «website». Da er varselet det ENESTE stedet leadet finnes, og leadet
   * får heller ingen automatisk e-post med presentasjon og bookinglenke —
   * arbeidsflyten starter på en kontakt som aldri ble opprettet.
   */
  hubspotFeilet = false,
  valg: Varselvalg = {},
): { tekst: string; html: string } {
  const nettside = lead.nettside
    ? lead.nettside + (lead.nettsideUtledet ? " (fra e-post)" : "")
    : TOM;

  const rader: [string, string, string][] = [
    ["Avsender", lead.navn || TOM, esc(lead.navn || TOM)],
    [
      "Mobilnummer",
      lead.telefon || TOM,
      lead.telefon
        ? `<a href="tel:${esc(lead.telefon.replace(/[^\d+]/g, ""))}">${esc(lead.telefon)}</a>`
        : TOM,
    ],
    [
      "E-post",
      lead.epost || TOM,
      lead.epost
        ? `<a href="mailto:${esc(lead.epost)}">${esc(lead.epost)}</a>`
        : TOM,
    ],
    ["Bedrift", lead.bedrift || TOM, esc(lead.bedrift || TOM)],
    ...(valg.ekstraRader ?? []).map(
      ([navn, verdi]) =>
        [navn, verdi || TOM, esc(verdi || TOM)] as [string, string, string],
    ),
    ...(valg.utenNettsideOgBehov
      ? []
      : [
          [
            "Nettside",
            nettside,
            lead.nettside
              ? `<a href="${esc(lead.nettside)}">${esc(lead.nettside)}</a>${
                  lead.nettsideUtledet
                    ? ' <span style="color:#6b6258">(fra e-post)</span>'
                    : ""
                }`
              : TOM,
          ] as [string, string, string],
        ]),
  ];

  const behov = valg.utenNettsideOgBehov ? null : lead.melding || TOM;

  /*
    «SKRIV TIL <FORNAVN>», bestilt av Cowork 03.10.2026.

    E-postadressen står allerede som en mailto-lenke i feltlista. Denne
    knappen gjør to ting den ikke gjør: den fyller ut emnet, og den er stor
    nok til å treffes med tommelen. Pål svarer leads fra telefonen, og et
    emne han slipper å finne på selv er ett ledd mindre mellom henvendelsen
    og svaret.

    EMNET ER FAST og formulert fra leadets side — «Henvendelsen din til
    Reflektor» — så den som får svaret kjenner igjen hva det gjelder uten å
    åpne e-posten.

    FORNAVNET ER FØRSTE ORD, kappet og escapet, som i delNavn i hubspot.ts.
    Mangler navnet, står det «Skriv til leadet»: en knapp som sier «Skriv
    til » og ingenting mer, ser ødelagt ut.
  */
  const fornavn = lead.navn.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  const skriv = serUtSomEpost(lead.epost)
    ? {
        tekst: fornavn ? `Skriv til ${fornavn}` : "Skriv til leadet",
        lenke: `mailto:${lead.epost}?subject=${encodeURIComponent("Henvendelsen din til Reflektor")}`,
      }
    : null;

  /*
    OPPFØLGINGEN, LAGT TIL 04.10.2026.

    HubSpot sender nå selv en e-post med presentasjon og bookinglenke med én
    gang leadet kommer inn, og en påminnelse neste hverdag kl. 09:00. Pål
    skal se tidspunktet her, fordi det er fristen hans: rekker han å ringe
    før den går, booker han møtet selv i stedet for å la en automatisk
    e-post gjøre det.

    STÅR IKKE FOR INTERNE ADRESSER. Arbeidsflyten hopper over
    @reflektor.no, og et varsel som lover en påminnelse som aldri kommer, er
    verre enn ingen opplysning. Se lib/paaminnelse.ts.

    KNAPPEN KAN MANGLE. Den krever en signatur, og uten hemmeligheten i
    miljøet lages ingen lenke — se lib/avbrytsignatur.ts. Da står de to
    første linjene alene, og varselet er ellers som før.
  */
  const oppfolging = valg.moteBooket
    ? {
        /*
          HAR PERSONEN ALT BOOKET, er oppfølgingen ikke bare unødvendig —
          den er feil. Linjen sier hva som IKKE skjedde, slik at Pål ikke
          sitter og venter på en påminnelse som aldri kommer.
        */
        linje: `Har allerede booket møte ${osloTekst(valg.moteBooket)}. Ingen automatisk e-post sendt.`,
        ring: "Ring ASAP for å booke møte personlig.",
        lenke: null,
      }
    : !hubspotFeilet && faarPaaminnelse(lead.epost)
      ? {
          /*
            INGEN KONTAKT, INGEN OPPFØLGING. `!hubspotFeilet` kom til
            06.10.2026. Feilet innsendingen til HubSpot, finnes det ingen
            kontakt for arbeidsflyten å starte på — og da sto varselet og
            lovet «presentasjon og møtelink sendt» rett under advarselen om
            at leadet IKKE ble lagret. To motstridende påstander i samme
            e-post, der den ene er usann.

            LINJEN SIER HVA SOM FAKTISK SKJER, OGSÅ OM NATTEN. Fra
            04.10.2026 sendes e-posten bare mellom 07 og 21; kommer leadet
            utenom, ligger den i kø til neste morgen kl. 08:00. Da skal det
            ikke stå «sendt» her. Pål leser denne linjen for å vite hvor
            lang tid han har på å ringe først, og en linje som lover noe
            som ikke har skjedd, er verre enn ingen linje.

            PÅMINNELSEN REGNES FRA DEN FAKTISKE SENDETIDEN, ikke fra
            innsendingen. Et lead som kommer lørdag kl. 23 får e-posten
            søndag kl. 08, og påminnelsen mandag — ikke søndag.
          */
          linje: venterPaaVinduet(sendt)
            ? `Presentasjon og møtelink sendes ${osloTekst(planlagtSending(sendt))}. Påminnelse sendes ${paaminnelseTekst(planlagtSending(sendt))}.`
            : `Generisk Canva-presentasjon og møtelink sendt. Påminnelse sendes ${paaminnelseTekst(sendt)}.`,
          ring: "Ring ASAP for å booke møte personlig.",
          lenke: avbrytLenke(lead.epost),
        }
      : null;

  /*
    ADVARSELEN STÅR ØVERST, før navnet. Den er det eneste i e-posten som
    krever en handling av Pål utover å ringe: leadet må legges inn i HubSpot
    for hånd, ellers finnes det bare her.
  */
  const advarsel = hubspotFeilet
    ? "⚠ Leadet ble IKKE lagret i HubSpot. Legg det inn manuelt."
    : null;

  const tekst = [
    ...(advarsel ? [advarsel, ""] : []),
    ...rader.map(([navn, verdi]) => `${navn}: ${verdi}`),
    ...(behov === null ? [] : ["Behov:", behov]),
    ...(skriv
      ? [
          "",
          `${skriv.tekst}: ${lead.epost} (emne: Henvendelsen din til Reflektor)`,
        ]
      : []),
    ...(oppfolging
      ? [
          "",
          oppfolging.linje,
          "",
          oppfolging.ring,
          ...(oppfolging.lenke
            ? ["", `Avbryt påminnelse: ${oppfolging.lenke}`]
            : []),
        ]
      : []),
  ].join("\n");

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.6;color:#2a2521">',
    ...(advarsel
      ? [
          `<p style="margin:0 0 20px;padding:14px 16px;background:#fdece9;border-left:4px solid #d8441f;border-radius:4px"><strong>${esc(advarsel)}</strong></p>`,
        ]
      : []),
    '<table cellpadding="0" cellspacing="0" border="0" style="font-size:16px;line-height:1.6">',
    ...rader.map(
      ([navn, , verdi]) =>
        `<tr><td style="padding:0 16px 6px 0;color:#6b6258;white-space:nowrap">${navn}</td><td style="padding:0 0 6px">${verdi}</td></tr>`,
    ),
    "</table>",
    ...(behov === null
      ? []
      : [
          '<p style="margin:20px 0 4px;color:#6b6258">Behov:</p>',
          `<p style="white-space:pre-wrap;margin:0">${esc(behov)}</p>`,
        ]),
    ...(skriv
      ? [
          /*
            SEKUNDÆR KNAPP, med ramme og uten fyll. Den primære handlingen i
            denne e-posten er å RINGE — det står med fete typer lenger nede —
            og to like knapper ville sagt at de to er like viktige.
          */
          `<p style="margin:20px 0 0"><a href="${esc(skriv.lenke)}" style="display:inline-block;padding:13px 20px;border:1px solid #d6cfc6;border-radius:8px;color:#2a2521;text-decoration:none">${esc(skriv.tekst)}</a></p>`,
        ]
      : []),
    ...(oppfolging
      ? [
          `<p style="margin:24px 0 0">${esc(oppfolging.linje)}</p>`,
          `<p style="margin:16px 0 0"><strong>${esc(oppfolging.ring)}</strong></p>`,
          ...(oppfolging.lenke
            ? [
                /*
                  KNAPPEN ER EN LENKE SOM SER UT SOM EN KNAPP, og det er
                  ikke en forenkling: e-postklienter kjører ikke skript, og
                  en <button> i en e-post gjør ingenting. Padding og
                  bakgrunn på en <a> er den eneste knappen som finnes her.

                  MÅLET ER TOMMELEN PÅ EN TELEFON. 14 px loddrett padding
                  gir en flate på rundt 46 px, som er over Apples
                  anbefalte 44.
                */
                `<p style="margin:20px 0 0"><a href="${esc(oppfolging.lenke)}" style="display:inline-block;padding:14px 22px;background:#d8441f;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Avbryt påminnelse</a></p>`,
              ]
            : []),
        ]
      : []),
    "</div>",
  ].join("");

  return { tekst, html };
}

/** Hvor lenge vi venter før forsøk nummer to. */
const NYTT_FORSOK_MS = 2000;

/**
 * Selve utsendingen.
 *
 * ETT FORSØK TIL ETTER TO SEKUNDER, lagt til 04.10.2026. Resend svarer av
 * og til 429 eller 5xx i et øyeblikk, og et lead som forsvinner fordi
 * nettverket hikstet er et lead vi aldri får vite om at vi mistet. To
 * sekunder er nok til at et kortvarig avbrudd er over, og kort nok til at
 * `after()` ikke rekker å bli avbrutt.
 *
 * BARE ETT FORSØK TIL. Er Resend nede, er de nede — flere forsøk ville bare
 * holdt en serverinstans åpen uten å endre utfallet, og feilen skal fram i
 * loggen i stedet.
 */
async function send(opp: {
  til: string;
  emne: string;
  tekst: string;
  html: string;
  svarTil?: string;
}): Promise<void> {
  const nokkel = process.env.RESEND_API_KEY;

  if (!nokkel) {
    /*
     * INNHOLDET LOGGES IKKE. Her sto hele leadet som JSON — navn, e-post og
     * telefon i klartekst i Vercel-loggen. Loggen er tilgangsstyrt, men
     * personopplysninger skal ikke ligge der uansett.
     */
    console.error(
      `[lead] RESEND_API_KEY mangler – «${opp.emne}» ble IKKE sendt.`,
    );
    return;
  }

  /*
    EGEN MESSAGE-ID, OG INGEN In-Reply-To ELLER References.

    Varslene skal ALDRI havne i samme tråd. Emnet er nå unikt per lead, og
    det er hovedgrepet — men en egen Message-ID gjør det eksplisitt i stedet
    for å stole på at Resend setter en.

    HEADEREN DROPPES HVIS RESEND IKKE VIL HA DEN. Et varsel som ikke kommer
    fram er verre enn et varsel i feil tråd, så avviser Resend forsendelsen
    med en 4xx, prøves den på nytt uten egne headere. Se under.
  */
  const meldingsId = `<${randomUUID()}@reflektor.no>`;

  const forsok = (medHodet: boolean) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nokkel}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: AVSENDER,
        to: [opp.til],
        ...(medHodet
          ? {
              headers: {
                "Message-ID": meldingsId,
                /* Gmail bruker denne til å holde meldinger fra hverandre. */
                "X-Entity-Ref-ID": meldingsId,
              },
            }
          : {}),
        /*
         * `reply_to` utelates når adressen ikke ser ut som en adresse:
         * e-posten skal komme fram uansett, og en ugyldig verdi gir 422 fra
         * Resend og dermed ingen e-post i det hele tatt.
         */
        ...(opp.svarTil && serUtSomEpost(opp.svarTil)
          ? { reply_to: opp.svarTil }
          : {}),
        subject: opp.emne,
        text: opp.tekst,
        html: opp.html,
      }),
    });

  let avvisteHodet = false;
  try {
    const forste = await forsok(true);
    if (forste.ok) return;
    /*
      4xx BETYR AT RESEND IKKE LIKTE DET VI SENDTE, og det eneste nye her er
      headerne. Da er neste forsøk uten dem — og logglinjen sier det, så
      ingen leter etter en nettverksfeil som ikke finnes.
    */
    if (forste.status >= 400 && forste.status < 500) {
      avvisteHodet = true;
      console.error(
        `[lead] Resend avviste egne headere (${forste.status}). Prøver uten.`,
      );
    }
  } catch {
    // Nettverksfeil teller som et mislykket forsøk. Vi prøver igjen under.
  }

  await new Promise((r) => setTimeout(r, NYTT_FORSOK_MS));

  const andre = await forsok(!avvisteHodet);
  if (andre.ok) return;

  const detaljer = await andre.text().catch(() => "");
  throw new Error(`Resend svarte ${andre.status}: ${detaljer}`);
}

/**
 * Varselet til Pål.
 *
 * KASTER IKKE LENGER, endret 04.10.2026. Den logger i stedet — tydelig nok
 * til å finnes igjen i Vercel-loggen.
 *
 * NAVN OG E-POST STÅR I LOGGLINJEN, og det er et bevisst unntak fra regelen
 * om at personopplysninger ikke skal logges. Bestilt av Pål 04.10.2026.
 * Grunnen er at linjen BARE skrives når e-posten har feilet to ganger: da
 * er loggen det eneste stedet leadet finnes, og et lead ingen vet om er
 * verre enn en logglinje med et navn i.
 */
export async function sendLeadPaEpost(
  lead: Lead,
  opp: { hubspotFeilet?: boolean } = {},
): Promise<void> {
  const { tekst, html } = varsel(lead, new Date(), opp.hubspotFeilet ?? false);
  try {
    await send({
      til: MOTTAKER,
      emne: varselEmne(VARSEL_EMNE, lead),
      tekst,
      html,
      svarTil: lead.epost,
    });
  } catch (feil) {
    console.error("LEADVARSEL FEILET", {
      navn: lead.navn,
      epost: lead.epost,
      side: lead.side,
      feil,
    });
    throw feil;
  }
}

/**
 * Varselet for et Meta-lead.
 *
 * HVORFOR DET SENDES HERFRA OG IKKE FRA HUBSPOT. Arbeidsflyten «Nytt lead –
 * inbound» sendte sitt eget varsel med fast tekst om «neste hverdag kl.
 * 09:00», uten knapp for å avbryte påminnelsen, uten «Skriv til»-knapp, og
 * med Metas rå verdier («nei,_ikke_nå») rett i e-posten. Pål fikk altså to
 * ulike formater avhengig av hvor leadet kom fra. Nå er malen én.
 *
 * KASTER VIDERE. Den som kaller, bruker det til å la være å merke kontakten
 * som ferdig behandlet, slik at neste kjøring prøver igjen. Et Meta-lead
 * uten varsel er et lead Pål ikke vet om.
 */
export async function sendMetaVarsel(opp: {
  navn: string;
  epost: string;
  bedrift: string;
  telefon: string;
  /** Svarene fra Meta-skjemaet, allerede vasket for understreker. */
  metasvar: { etikett: string; verdi: string }[];
  /** Satt hvis personen allerede har booket møte. */
  moteBooket?: Date | null;
  sendt?: Date;
}): Promise<void> {
  const lead: Lead = {
    navn: opp.navn,
    epost: opp.epost,
    bedrift: opp.bedrift,
    telefon: opp.telefon,
    melding: "",
    side: "Meta",
    nettside: "",
    nettsideUtledet: false,
    kilde: "Meta",
  };

  const { tekst, html } = varsel(lead, opp.sendt ?? new Date(), false, {
    ekstraRader: opp.metasvar.map((m) => [m.etikett, m.verdi]),
    utenNettsideOgBehov: true,
    moteBooket: opp.moteBooket ?? null,
  });

  try {
    await send({
      til: MOTTAKER,
      emne: varselEmne(META_VARSEL_EMNE, lead),
      tekst,
      html,
      svarTil: opp.epost,
    });
  } catch (feil) {
    console.error("META-LEADVARSEL FEILET", {
      navn: opp.navn,
      epost: opp.epost,
      feil,
    });
    throw feil;
  }
}
