import { harSvarITrad, sendGmail, harGmail } from "./gmail";
import {
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
import { epost1, epost2, skalHaEpost1, skalHaEpost2 } from "./leadepost";

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

export async function sendEpost1(k: Leadkontakt): Promise<Utfall> {
  if (
    !skalHaEpost1({
      epost: k.epost,
      lifecycle: k.lifecycle,
      epost1Sendt: k.epost1Sendt,
      epost2Sendt: k.epost2Sendt,
      avbrutt: k.avbrutt,
      moteBooket: k.moteBooket,
      dealstadier: [],
      harSvart: null,
    })
  ) {
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
  return "sendt";
}

export async function sendEpost2(k: Leadkontakt, na: Date): Promise<Utfall> {
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
    !skalHaEpost2(
      {
        epost: k.epost,
        lifecycle: k.lifecycle,
        epost1Sendt: k.epost1Sendt,
        epost2Sendt: k.epost2Sendt,
        avbrutt: k.avbrutt,
        moteBooket: k.moteBooket,
        dealstadier: stadier,
        harSvart,
      },
      na,
    )
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
  return sendEpost1(k);
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

  const nye = (await nyeLeadsUtenEpost()) ?? [];
  for (const k of nye.slice(0, MAKS_PER_KJORING)) {
    svar.epost1[await sendEpost1(k)] += 1;
  }

  const venter = (await venterPaaPaaminnelse()) ?? [];
  for (const k of venter.slice(0, MAKS_PER_KJORING)) {
    svar.epost2[await sendEpost2(k, na)] += 1;
  }

  return svar;
}
