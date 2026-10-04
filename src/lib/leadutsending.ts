import { harSvarITrad, sendGmail, harGmail } from "./gmail";
import {
  AVBRUTT_FELT,
  booketNylig,
  dealstadier,
  EPOST_FELT,
  harToken,
  hentLeadkontakt,
  loggEpost,
  merkSendt,
  nyeLeadsUtenEpost,
  venterPaaPaaminnelse,
  type Leadkontakt,
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

export type Jobbsvar = {
  epost1: Record<Utfall, number>;
  epost2: Record<Utfall, number>;
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
    aktiv: aktiv(),
  };

  if (!harToken() || !harGmail()) {
    console.error(
      "[leadepost] Mangler HubSpot-token eller Google-nøkkel. Jobben gjorde ingenting.",
    );
    return svar;
  }

  const booket = await booketListe();

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
