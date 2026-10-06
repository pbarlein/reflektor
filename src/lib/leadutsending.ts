import { harSvarITrad, sendGmail, harGmail } from "./gmail";
import {
  arkiverAvtale,
  AVBRUTT_FELT,
  avtalerFor,
  booketNylig,
  dealstadier,
  flyttAvtale,
  harEgenAktivitet,
  hentStadiekart,
  knyttKontaktTilAvtale,
  erOutboundBooking,
  opprettAvtale,
  settAvtalekilde,
  OUTBOUND_KILDE,
  EPOST_FELT,
  harToken,
  hentLeadkontakt,
  loggEpost,
  merkSendt,
  mulighetsmakker,
  nyeLeadsUtenEpost,
  venterPaaPaaminnelse,
  type Avtale,
  type Leadkontakt,
  type Stadiekart,
} from "./hubspotcrm";
import { sendMetaVarsel } from "./lead";
import {
  epost1,
  epost2,
  leadkilde,
  sammePerson,
  skalHaEpost1,
  skalHaEpost2,
} from "./leadepost";

/**
 * Utsendingen av de to lead-e-postene: hvem, når, og med hvilke bremser.
 *
 * BRYTEREN STÅR AV TIL PÅL SLÅR DEN PÅ. `LEAD_EPOST_AKTIV` må være
 * «true». Er den det ikke, sendes INGENTING — jobben logger bare hva den
 * ville gjort. Det er med vilje: HubSpot sender de samme to e-postene i dag,
 * og i det korte vinduet der begge er påskrudd ville leadet fått alt i
 * dobbelt. Byttet skjer med ett grep: Pål slår av arbeidsflyten i HubSpot og
 * setter denne til «true» i samme omgang.
 *
 * `LEAD_EPOST_TEST_ADRESSE` ER UNNTAKET fra bryteren: står bryteren av, men
 * adressen stemmer, sendes e-posten likevel. Det er slik Cowork kan teste
 * hele veien uten at en eneste kunde får noe.
 */

/** Taket per kjøring. Vern mot en feil som ellers sender til hundrevis. */
const MAKS_PER_KJORING = 20;

type Utfall = "sendt" | "hoppet-over" | "ville-sendt" | "feilet";

function aktiv(): boolean {
  return process.env.LEAD_EPOST_AKTIV === "true";
}

function erTestadresse(epost: string): boolean {
  const t = process.env.LEAD_EPOST_TEST_ADRESSE?.trim().toLowerCase();
  return Boolean(t) && epost.trim().toLowerCase() === t;
}

/** Sant hvis vi faktisk får lov å sende til denne adressen nå. */
function faarSende(epost: string): boolean {
  return aktiv() || erTestadresse(epost);
}

/**
 * Kontaktene som har booket møte, hentet én gang per kjøring.
 *
 * ETT SØK, IKKE ETT PER LEAD. Jobben går over opptil tjue leads, og et
 * oppslag per lead ville vært tjue kall til HubSpot for å finne det samme
 * svaret. Null betyr at søket feilet; da lar vi dublettsjekken være blind
 * heller enn å stoppe all utsending.
 */
async function booketListe(): Promise<Leadkontakt[]> {
  return (await booketNylig()) ?? [];
}

/** Har samme person booket møte under en annen e-postadresse? */
function booketAnnetSted(
  k: Leadkontakt,
  booket: Leadkontakt[],
): Leadkontakt | null {
  return (
    booket.find((b) => b.moteBooket && sammePerson(k, b)) ?? null
  );
}

function somKandidat(
  k: Leadkontakt,
  opp: { dealstadier?: string[]; harSvart?: boolean | null; dublett?: boolean },
) {
  return {
    epost: k.epost,
    lifecycle: k.lifecycle,
    hendelse: k.hendelse,
    konvertert: k.konvertert,
    booketAnnetSted: opp.dublett ?? false,
    epost1Sendt: k.epost1Sendt,
    epost2Sendt: k.epost2Sendt,
    avbrutt: k.avbrutt,
    moteBooket: k.moteBooket,
    dealstadier: opp.dealstadier ?? [],
    harSvart: opp.harSvart ?? null,
  };
}

/** Datoen på et booket møte, eller null hvis feltet er tomt eller rart. */
function moteDato(verdi: string): Date | null {
  if (!verdi) return null;
  const d = new Date(verdi);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Varselet til Pål for et Meta-lead, og merkingen som hindrer gjentakelse.
 *
 * MERKINGEN SKJER ETTER VARSELET, aldri før. Feiler Resend, er kontakten
 * umerket og neste kjøring prøver igjen. Motsatt rekkefølge ville gitt et
 * Meta-lead Pål aldri fikk vite om.
 *
 * `paminnelse_avbrutt` ER MARKØREN NÅR INGEN E-POST SKAL SENDES. Feltet
 * finnes alt og betyr nøyaktig det vi mener: ingen automatisk oppfølging
 * for denne kontakten. Det er også feltet Cowork satte for hånd på de to
 * kontaktene 04.10.2026.
 */
async function metavarselForBooket(
  k: Leadkontakt,
  mote: Date,
): Promise<Utfall> {
  try {
    await sendMetaVarsel({
      navn: k.navn,
      epost: k.epost,
      bedrift: k.bedrift,
      telefon: k.telefon,
      metasvar: k.metasvar,
      moteBooket: mote,
    });
  } catch {
    /* Logget i lead.ts. Umerket kontakt betyr nytt forsøk om fem minutter. */
    return "feilet";
  }
  await merkSendt(k.id, { [AVBRUTT_FELT]: "true" });
  return "hoppet-over";
}

export async function sendEpost1(
  k: Leadkontakt,
  na = new Date(),
  booket: Leadkontakt[] = [],
): Promise<Utfall> {
  const dublett = booketAnnetSted(k, booket);
  const kilde = leadkilde(k.hendelse);

  /*
    HAR PERSONEN BOOKET, SKAL HUN IKKE FÅ «BOOK HER». Det skjedde 04.10.2026:
    Meta-lead 06:38, booking 06:39 fra en annen adresse, presentasjon til
    begge kontaktene 06:40. Varselet sier det i stedet, og kontakten merkes
    så ingen av de to e-postene går ut senere.
  */
  const mote = moteDato(k.moteBooket) ?? (dublett ? moteDato(dublett.moteBooket) : null);
  if (mote && !k.epost1Sendt && k.avbrutt !== "true") {
    console.info(
      `[leadepost] ${k.epost} har booket møte${dublett ? ` (som ${dublett.epost})` : ""}. Ingen e-post 1.`,
    );
    if (kilde === "meta") return metavarselForBooket(k, mote);
    await merkSendt(k.id, { [AVBRUTT_FELT]: "true" });
    return "hoppet-over";
  }

  if (!skalHaEpost1(somKandidat(k, { dublett: Boolean(dublett) }), na)) {
    return "hoppet-over";
  }

  const brev = epost1(k.navn, k.bedrift);

  if (!faarSende(k.epost)) {
    console.info(
      `[leadepost] AV: ville sendt e-post 1 til ${k.epost} («${brev.emne}»).`,
    );
    return "ville-sendt";
  }

  const sendt = await sendGmail({
    til: k.epost,
    emne: brev.emne,
    tekst: brev.tekst,
    html: brev.html,
  });

  if (!sendt) {
    console.error("LEAD-EPOST FEILET", { kontakt: k.id, steg: "e-post 1" });
    return "feilet";
  }

  /*
    MERKINGEN SKJER ETTER AT GMAIL HAR SVART OK, aldri før. Rekkefølgen er
    hele vernet mot dobbeltsending: krasjer vi mellom de to, sender neste
    kjøring e-posten på nytt — irriterende, men mye bedre enn at en kunde
    aldri får den fordi vi rakk å krysse av først.
  */
  await merkSendt(k.id, {
    [EPOST_FELT.en]: new Date().toISOString(),
    [EPOST_FELT.trad]: sendt.tradId,
    [EPOST_FELT.meldingsId]: sendt.meldingsId,
  });
  await loggEpost(k.id, brev.emne, brev.tekst);

  /*
    VARSELET TIL PÅL FOR META-LEADS, i samme kjøring som e-posten.
    Nettsideleads varsles fra skjemaruta med én gang; Meta-leads hadde bare
    HubSpots eget varsel, i et annet format. Nå er de like.

    ETTER MERKINGEN, OG DET ER MOTSATT AV DEN BOOKEDE. Her er e-posten
    allerede sendt til kunden, og den kan ikke sendes om igjen. Feiler
    varselet, skal ikke neste kjøring sende kunden e-posten på nytt for å
    få varselet ut.
  */
  if (leadkilde(k.hendelse) === "meta") {
    await sendMetaVarsel({
      navn: k.navn,
      epost: k.epost,
      bedrift: k.bedrift,
      telefon: k.telefon,
      metasvar: k.metasvar,
    }).catch(() => {
      /* Logget i lead.ts. E-posten til kunden er sendt uansett. */
    });
  }

  return "sendt";
}

export async function sendEpost2(
  k: Leadkontakt,
  na: Date,
  booket: Leadkontakt[] = [],
): Promise<Utfall> {
  /*
    DUBLETTSJEKKEN FØRST, FØR VI BRUKER KALL PÅ AVTALER OG GMAIL. Har samme
    person booket under en annen adresse, er resten av spørsmålene uten
    betydning.
  */
  if (booketAnnetSted(k, booket)) {
    console.info(
      `[leadepost] ${k.epost} har booket møte under en annen adresse. Ingen påminnelse.`,
    );
    await merkSendt(k.id, { [AVBRUTT_FELT]: "true" });
    return "hoppet-over";
  }

  const stadier = await dealstadier(k.id);

  /*
    SVARSJEKKEN GJØRES FØR ALT ANNET SOM KOSTER, men etter at vi vet at
    kontakten i det hele tatt er en kandidat. Vi leser tråden fra
    tidspunktet e-post 1 gikk ut: alt som er eldre, er en samtale Pål
    hadde med den samme adressen før dette leadet kom inn.
  */
  const epost1Tid = new Date(k.epost1Sendt);
  const harSvart = Number.isNaN(epost1Tid.getTime())
    ? null
    : await harSvarITrad(k.tradId, epost1Tid);

  if (harSvart === true) {
    console.info(
      `[leadepost] ${k.epost} har svart i tråden. Påminnelsen sendes ikke.`,
    );
  }

  if (
    !skalHaEpost2(somKandidat(k, { dealstadier: stadier, harSvart }), na)
  ) {
    return "hoppet-over";
  }

  const brev = epost2(k.navn, k.bedrift);

  if (!faarSende(k.epost)) {
    console.info(`[leadepost] AV: ville sendt påminnelse til ${k.epost}.`);
    return "ville-sendt";
  }

  const sendt = await sendGmail({
    til: k.epost,
    emne: brev.emne,
    tekst: brev.tekst,
    html: brev.html,
    tradId: k.tradId || undefined,
    svarPa: k.meldingsId || undefined,
  });

  if (!sendt) {
    console.error("LEAD-EPOST FEILET", { kontakt: k.id, steg: "påminnelse" });
    return "feilet";
  }

  await merkSendt(k.id, { [EPOST_FELT.to]: new Date().toISOString() });
  await loggEpost(k.id, brev.emne, brev.tekst);
  return "sendt";
}

/**
 * E-post 1 for et lead som nettopp kom inn fra nettsiden.
 *
 * KONTAKTEN KAN MANGLE DE FØRSTE SEKUNDENE. Innsendingen til HubSpot skjer
 * rett før dette, og HubSpot bruker av og til et øyeblikk på å opprette
 * kontakten. Finner vi den ikke, gjør vi ingenting: jobben som kjører hvert
 * femte minutt plukker den opp. Det er derfor den jobben også ser etter
 * leads uten `lead_epost1_sendt`, ikke bare Meta-leads.
 */
export async function sendEpost1TilNyttLead(epost: string): Promise<Utfall> {
  if (!harToken() || !harGmail()) return "hoppet-over";
  const k = await hentLeadkontakt(epost);
  if (!k) {
    console.info(
      "[leadepost] Kontakten fantes ikke ennå. Jobben tar den ved neste kjøring.",
    );
    return "hoppet-over";
  }
  return sendEpost1(k, new Date(), await booketListe());
}

/* ────────────── AVTALEN FLYTTES VED BOOKING (04.10.2026) ─────────────── */

export type Avtaletelling = {
  flyttet: number;
  /** Nye avtaler laget for et outbound-møte som ingen avtale fanget opp. */
  opprettet: number;
  arkivert: number;
  "hoppet-over": number;
  feilet: number;
};

/** Hvor gammel en auto-opprettet avtale får være for å kunne arkiveres. */
const ARKIVGRENSE_MS = 24 * 60 * 60 * 1000;

/**
 * Avtalene til kontakten, og til den som er samme person.
 *
 * ETT OPPSLAG PER KONTAKT, og makkeren finnes bare hvis den trengs.
 */
async function avtalebildet(k: Leadkontakt): Promise<{
  egne: Avtale[];
  makker: Leadkontakt | null;
  hennes: Avtale[];
}> {
  const egne = await avtalerFor(k.id);

  const makkere = (await mulighetsmakker(k)) ?? [];
  for (const m of makkere) {
    if (!sammePerson(k, m)) continue;
    const hennes = await avtalerFor(m.id);
    if (hennes.length) return { egne, makker: m, hennes };
  }

  return { egne, makker: null, hennes: [] };
}

/**
 * Kan denne avtalen arkiveres?
 *
 * TRE KRAV, OG ALLE TRE MÅ HOLDE: under 24 timer gammel, i Interessert
 * eller Møte booket, og ingen har gjort noe med den etter at den ble laget.
 * Da er den en avtale arbeidsflyten laget og ingen har tatt i.
 */
async function kanArkiveres(
  a: Avtale,
  kart: Stadiekart,
  na: Date,
): Promise<boolean> {
  const maalOrdre = kart.ordre.get(kart.maal) ?? 0;
  const ordre = kart.ordre.get(a.stadium);
  if (ordre === undefined || ordre > maalOrdre) return false;

  const laget = new Date(a.opprettet).getTime();
  if (Number.isNaN(laget) || na.getTime() - laget > ARKIVGRENSE_MS) return false;

  /* `null` betyr at vi ikke fikk sjekket. Da står avtalen. */
  return (await harEgenAktivitet(a.id, a.opprettet)) === false;
}

/**
 * Flytter avtalene til kontaktene som har booket møte, og rydder dubletten.
 *
 * HVORFOR DET MÅ GJØRES HER. HubSpot setter
 * `engagements_last_meeting_booked` når noen booker via møtelenken, men
 * flytter ikke avtalen. Pål måtte dra kortet selv, og et stadium som ikke
 * stemmer er et stadium han ikke kan styre etter.
 *
 * BARE FRAMOVER. Vi flytter en avtale bare hvis den står i et TIDLIGERE
 * stadium enn «Møte booket», målt på rekkefølgen pipelinen selv oppgir. Da
 * er Tilbud sendt, Vunnet, Hviler og Tapt trygge uten at noen liste må
 * holdes oppdatert.
 *
 * DUBLETTEN, LAGT TIL 04.10.2026. Booker noen med en annen e-postadresse,
 * lager HubSpot en ny kontakt, og arbeidsflyten lager en ny avtale på den.
 * Testen samme dag ga to avtaler på samme person: den opprinnelige sto
 * igjen i Interessert mens den nye ble flyttet til Møte booket. Nå flyttes
 * den OPPRINNELIGE, bookingkontakten knyttes til den, og den nye arkiveres
 * — hvis den er fersk, urørt og står tidlig nok.
 *
 * FINNES INGEN MAKKER, er det en helt ny person som booket direkte. Da er
 * avtalen arbeidsflyten laget den eneste som finnes, og den flyttes som før.
 */
export async function flyttAvtalerForBookede(
  booket: Leadkontakt[],
  na = new Date(),
): Promise<Avtaletelling> {
  const telling: Avtaletelling = {
    flyttet: 0,
    opprettet: 0,
    arkivert: 0,
    "hoppet-over": 0,
    feilet: 0,
  };
  if (!booket.length) return telling;

  const kart = await hentStadiekart();
  if (!kart) {
    console.error(
      "[avtale] Uten stadiekart flyttes ingen avtaler. Resten av jobben går som normalt.",
    );
    return telling;
  }

  const maalOrdre = kart.ordre.get(kart.maal) ?? 0;

  /** Flytter én avtale framover, hvis den står tidligere enn målet. */
  const flytt = async (a: Avtale, hvem: string, via: string) => {
    const ordre = kart.ordre.get(a.stadium);
    /*
      UKJENT STADIUM RØRES IKKE. Står avtalen i en annen pipeline, er den
      ikke vår å flytte.
    */
    if (ordre === undefined || ordre >= maalOrdre) {
      telling["hoppet-over"] += 1;
      return;
    }
    if (await flyttAvtale(a.id, kart.maal)) {
      telling.flyttet += 1;
      console.info(
        `[avtale] Flyttet avtale ${a.id} til «Møte booket» for ${hvem}${via}.`,
      );
    } else {
      telling.feilet += 1;
    }
  };

  /** Står avtalen i Interessert eller Møte booket? */
  const erAapen = (a: Avtale) => {
    const o = kart.ordre.get(a.stadium);
    return o !== undefined && o <= maalOrdre;
  };

  /*
    HVA SOM HINDRER AT VI LAGER EN NY AVTALE. Alt som ikke ligger død i
    «Hviler» eller «Tapt» — også en avtale i et stadium vi ikke kjenner,
    som betyr at den står i en annen pipeline. Da er saken noens, og en
    avtale nummer to er ikke vår å lage.
  */
  const blokkerer = (a: Avtale) => !kart.hvilende.has(a.stadium);

  /** Setter kilden på de åpne avtalene til et outbound-møte. */
  const merkOutbound = async (avtaler: Avtale[]) => {
    for (const a of avtaler) {
      if (!erAapen(a)) continue;
      if (await settAvtalekilde(a, OUTBOUND_KILDE)) {
        console.info(
          `[avtale] Avtale ${a.id} står som «${OUTBOUND_KILDE}». Fakturerbart møte.`,
        );
      }
    }
  };

  /*
    AVTALEN SOM MANGLET. Booker noen fra outbound uten å ha vært innom
    skjemaet, finnes det ingen kontakt arbeidsflyten har laget en avtale
    på — og da ville møtet vært booket uten at noe talte det.
  */
  const nyAvtale = async (k: Leadkontakt) => {
    const navn = `${k.bedrift.trim() || k.navn.trim() || k.epost} – outbound`;
    const id = await opprettAvtale({
      navn,
      stadium: kart.maal,
      pipeline: kart.pipeline,
      kilde: OUTBOUND_KILDE,
      kontaktId: k.id,
    });
    if (id) {
      telling.opprettet += 1;
      console.info(
        `[avtale] Opprettet avtale ${id} «${navn}» i «Møte booket» for ${k.epost}. Fakturerbart møte.`,
      );
    } else {
      telling.feilet += 1;
    }
  };

  /*
    OUTBOUND-LEADS SKAL IKKE HA INBOUND-E-POSTENE. Presentasjonen og
    påminnelsen er skrevet til noen som nettopp fylte ut skjemaet vårt.
    Den som er ringt opp av Impact Motion og har booket, har fått sin
    kontakt et helt annet sted.
  */
  const stoppOppfolging = async (k: Leadkontakt) => {
    if (k.avbrutt === "true") return;
    if (await merkSendt(k.id, { [AVBRUTT_FELT]: "true" })) {
      console.info(
        `[avtale] ${k.epost} booket via outbound. Oppfølgings-e-postene er slått av.`,
      );
    }
  };

  for (const k of booket) {
    if (!k.moteBooket) continue;

    const outbound = erOutboundBooking(k.hendelse);
    const { egne, makker, hennes } = await avtalebildet(k);

    if (outbound) await stoppOppfolging(k);

    if (!makker) {
      /* Ingen makker: avtalene på kontakten selv er de eneste som finnes. */
      for (const a of egne) await flytt(a, k.epost, "");

      if (outbound) {
        await merkOutbound(egne);
        if (!egne.some(blokkerer)) await nyAvtale(k);
      }
      continue;
    }

    /*
      MAKKEREN EIER DEN OPPRINNELIGE AVTALEN. Står alle hennes avtaler
      ETTER «Møte booket» — hun har alt fått tilbud, eller saken er lukket —
      rører vi ingenting. To avtaler er da en avgjørelse et menneske har
      tatt, ikke noe maskinen skal rydde i.
    */
    const aapne = hennes.filter((a) => {
      const o = kart.ordre.get(a.stadium);
      return o !== undefined && o <= maalOrdre;
    });

    if (!aapne.length) {
      /*
        LIGGER SAKEN DØD, ER ET NYTT MØTE EN NY SAK. «Hviler» og «Tapt» er
        ikke «for langt framme» — de er lagt bort. Booker hun på nytt via
        outbound, skal møtet telles, og da trengs en avtale å telle.
      */
      if (outbound && !hennes.some(blokkerer) && !egne.some(blokkerer)) {
        await nyAvtale(k);
        continue;
      }
      telling["hoppet-over"] += 1;
      console.info(
        `[avtale] ${k.epost} er samme person som ${makker.epost}, men avtalen hennes står for langt framme. Ingenting rørt.`,
      );
      continue;
    }

    const via = ` (avtalen hang på ${makker.epost})`;
    for (const a of aapne) await flytt(a, k.epost, via);

    if (outbound) await merkOutbound(aapne);

    /* Bookingen skal vises på avtalen som blir stående. */
    const beholdt = aapne[0]!;
    await knyttKontaktTilAvtale(beholdt.id, k.id);

    /*
      DUBLETTEN ARKIVERES TIL SLUTT, etter at den opprinnelige er flyttet og
      koblet. Feiler noe underveis, står begge avtalene igjen — det er til å
      leve med. Motsatt rekkefølge kunne slettet den nye før den gamle var
      på plass.
    */
    for (const a of egne) {
      if (a.id === beholdt.id) continue;
      if (!(await kanArkiveres(a, kart, na))) {
        telling["hoppet-over"] += 1;
        console.info(
          `[avtale] Avtale ${a.id} på ${k.epost} er en dublett, men er ikke fersk og urørt. Arkiveres ikke.`,
        );
        continue;
      }
      if (await arkiverAvtale(a.id)) {
        telling.arkivert += 1;
        console.info(
          `[avtale] Arkiverte dublettavtale ${a.id} på ${k.epost}. Den opprinnelige er ${beholdt.id}.`,
        );
      } else {
        telling.feilet += 1;
      }
    }
  }

  return telling;
}

export type Jobbsvar = {
  epost1: Record<Utfall, number>;
  epost2: Record<Utfall, number>;
  avtaler: Avtaletelling;
  aktiv: boolean;
};

const tomTeller = (): Record<Utfall, number> => ({
  sendt: 0,
  "hoppet-over": 0,
  "ville-sendt": 0,
  feilet: 0,
});

/** Hele jobben. Kjøres hvert femte minutt. */
export async function kjorLeadepostjobb(na = new Date()): Promise<Jobbsvar> {
  const svar: Jobbsvar = {
    epost1: tomTeller(),
    epost2: tomTeller(),
    avtaler: {
      flyttet: 0,
      opprettet: 0,
      arkivert: 0,
      "hoppet-over": 0,
      feilet: 0,
    },
    aktiv: aktiv(),
  };

  if (!harToken()) {
    console.error("[leadepost] Mangler HubSpot-token. Jobben gjorde ingenting.");
    return svar;
  }

  const booket = await booketListe();

  /*
    AVTALENE FLYTTES FØRST, OG UAVHENGIG AV BRYTEREN OG AV GMAIL. Det er en
    opprydding i CRM-et, ikke en e-post til en kunde — den skal gå selv om
    utsendingen står av. Feiler den, går resten av jobben som normalt.
  */
  svar.avtaler = await flyttAvtalerForBookede(booket, na);

  if (!harGmail()) {
    console.error(
      "[leadepost] Mangler Google-nøkkel. Ingen e-post, men avtalene er ryddet.",
    );
    return svar;
  }

  const nye = (await nyeLeadsUtenEpost()) ?? [];
  for (const k of nye.slice(0, MAKS_PER_KJORING)) {
    svar.epost1[await sendEpost1(k, na, booket)] += 1;
  }

  const venter = (await venterPaaPaaminnelse()) ?? [];
  for (const k of venter.slice(0, MAKS_PER_KJORING)) {
    svar.epost2[await sendEpost2(k, na, booket)] += 1;
  }

  return svar;
}
