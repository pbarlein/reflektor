import assert from "node:assert/strict";
import test from "node:test";

import {
  behovsvar,
  erPrivatEpost,
  erTittelfirma,
  filtrer,
  firmaErPersonnavn,
  navnelikhet,
  nettsideTreff,
  normaliserFirma,
  PRIVATDOMENER,
  utenNorskSpor,
  type Filterspor,
} from "@/lib/leadfilter.ts";

/**
 * Det harde filteret på Meta-leads, bestilt av Pål 12.10.2026.
 *
 * ALLE ÅTTE LEADENE 11.–12.10 VAR SPAM, og alle hadde ekte +47-nummer.
 * Tallene og navnene under er hentet fra HubSpot samme dag, ikke diktet
 * opp — det er de faktiske innsendingene filteret er bygget mot.
 */

const spor = (endringer: Partial<Filterspor> = {}): Filterspor => ({
  epost: "post@nordlysbakeriet.no",
  telefon: "+4791122334",
  firma: "Nordlysbakeriet AS",
  navn: "Ingrid Lie",
  behov: "Vi trenger jevnlig innhold til Instagram og Facebook",
  behovFinnes: true,
  harMx: true,
  brregTreff: true,
  domeneSvarer: null,
  ...endringer,
});

/* ───────────────────── REGEL 1: PRIVAT ADRESSE ──────────────────────── */

test("de åtte ekte spam-adressene kjennes igjen som private", () => {
  for (const e of [
    "golnaz.tandorost@gmail.com",
    "davidsraad@gmail.com",
    "fahim_ghias@hotmail.com",
    "tstuginskiy@mail.ru",
    "aluthe22@gmail.com",
    "glfjel@gmail.com",
    "mortengullikhansen3@gmail.com",
    "lolademunirat@yahoo.com",
  ]) {
    assert.equal(erPrivatEpost(e), true, e);
  }
});

/** De norske leverandøradressene er de lettest å glemme. */
test("norske privatadresser kjennes igjen", () => {
  for (const d of ["online.no", "lyse.net", "broadpark.no", "altiboxmail.no"]) {
    assert.equal(erPrivatEpost(`kari@${d}`), true, d);
  }
});

test("et mønster som slutter på punktum treffer alle toppdomener", () => {
  assert.equal(erPrivatEpost("a@hotmail.com"), true);
  assert.equal(erPrivatEpost("a@hotmail.co.uk"), true);
  assert.equal(erPrivatEpost("a@outlook.no"), true);
  assert.equal(erPrivatEpost("a@live.se"), true);
  /* «hotmail» uten toppdomene er ikke et domene. */
  assert.equal(erPrivatEpost("a@hotmail."), false);
});

/**
 * JOBBADRESSENE MÅ SLIPPE GJENNOM. Dette er den dyre feilen: en liste som
 * tar en kunde koster mer enn all spammen til sammen.
 */
test("jobbadresser er ikke private", () => {
  for (const e of [
    "post@nordlysbakeriet.no",
    "iver@lokk.no",
    "pal@reflektor.no",
    "pal+test@reflektor.no",
    "svein.nilsen@vkbb.no",
    /* Ligner, men er det ikke. */
    "noen@gmailagentur.no",
    "noen@livearrangement.no",
  ]) {
    assert.equal(erPrivatEpost(e), false, e);
  }
});

test("listen er én konstant, og alt i den er små bokstaver", () => {
  assert.ok(PRIVATDOMENER.length >= 40);
  for (const d of PRIVATDOMENER) assert.equal(d, d.toLowerCase(), d);
});

/* ───────────────────────── REGEL 3: BEHOVET ─────────────────────────── */

test("korte og innholdsløse svar faller", () => {
  for (const b of ["ja", "test", "ok", "-", ".", "", "   "]) {
    assert.notEqual(behovsvar(b), "ok", b);
  }
  assert.equal(behovsvar("123456789012345678"), "uten-bokstaver");
});

test("en ren gjentakelse av firmanavnet er ikke et behov", () => {
  assert.notEqual(behovsvar("Nordlysbakeriet AS", "Nordlysbakeriet"), "ok");
  /* Ett ord mer, og det er et svar. */
  assert.equal(
    behovsvar("Nordlysbakeriet trenger reels", "Nordlysbakeriet"),
    "ok",
  );
});

test("et beskrevet behov går gjennom", () => {
  assert.equal(
    behovsvar("Vi trenger reels til Instagram hver uke", "Nordlysbakeriet"),
    "ok",
  );
});

/* ───────────────────────── REGEL 4: FIRMAET ─────────────────────────── */

test("firmafeltet som bare er en tittel kjennes igjen", () => {
  /* Begge sto i firmafeltet på ekte leads 12.10. */
  assert.equal(erTittelfirma("Founder, Director, CEO"), true);
  assert.equal(erTittelfirma("Freelance"), true);
  assert.equal(erTittelfirma("Daglig leder"), true);
  assert.equal(erTittelfirma("privat"), true);
  assert.equal(erTittelfirma("Student"), true);
});

/**
 * ET EKTE FIRMANAVN SOM INNEHOLDER ET TITTELORD SKAL STÅ. «Leder» er et
 * tittelord, men «Leder Media AS» er et firma.
 */
test("firmanavn med et tittelord i er ikke en tittel", () => {
  assert.equal(erTittelfirma("Leder Media AS"), false);
  assert.equal(erTittelfirma("Eiendomssjefen AS"), false);
  assert.equal(erTittelfirma("Nordlysbakeriet AS"), false);
  assert.equal(erTittelfirma("La pantera records"), false);
});

test("firmafeltet som er personens eget navn kjennes igjen", () => {
  /* «Aluel» sto som både fornavn og firma på leadet 12.10 kl. 14:10. */
  assert.equal(firmaErPersonnavn("Aluel", "Aluel"), true);
  assert.equal(firmaErPersonnavn("Lie", "Ingrid Lie"), true);
  assert.equal(firmaErPersonnavn("Nordlysbakeriet", "Ingrid Lie"), false);
  /* «Morten g Hansen maskin» er ikke bare navnet. */
  assert.equal(
    firmaErPersonnavn("Morten g Hansen maskin", "Morten Gullik hansen"),
    false,
  );
});

/* ──────────────────────── REGEL 5: UTENLANDSK ───────────────────────── */

test("verken norsk nummer eller norsk domene", () => {
  assert.equal(utenNorskSpor("+1 646 555 0188", "a@smaqt.com"), true);
  /* Norsk nummer er nok. */
  assert.equal(utenNorskSpor("+4791122334", "a@smaqt.com"), false);
  /* .no-domene er nok. */
  assert.equal(utenNorskSpor("+1 646 555 0188", "a@lokk.no"), false);
  /* Tomt nummer skal ikke regnes som utenlandsk. */
  assert.equal(utenNorskSpor("", "a@example.com"), false);
});

/* ───────────────────── NAVNET MOT BRØNNØYSUND ───────────────────────── */

test("selskapsform og tegnsetting strippes før søk", () => {
  assert.equal(normaliserFirma("Lokk AS"), "lokk");
  assert.equal(normaliserFirma("La. MEXICANA As"), "la mexicana");
  assert.equal(normaliserFirma("Reflektor ASA"), "reflektor");
  /* Et navn som BARE er en selskapsform skal ikke bli tomt. */
  assert.equal(normaliserFirma("AS"), "as");
});

test("likheten tåler en skrivefeil, men ikke et annet firma", () => {
  assert.ok(navnelikhet("Lokk AS", "LOKK") >= 0.8);
  assert.ok(navnelikhet("Nordlysbakeriet", "Nordlysbakeriet AS") >= 0.8);
  assert.ok(navnelikhet("Lokk", "Norsk Bakeri") < 0.5);
  assert.equal(navnelikhet("", "Lokk"), 0);
});

/* ───────────────── UTFALLENE, SLIK BESTILLINGEN BER OM ──────────────── */

test("gmail, hotmail, live og online.no gir AVVIST", () => {
  for (const e of [
    "a@gmail.com",
    "a@hotmail.com",
    "a@live.no",
    "a@online.no",
  ]) {
    const d = filtrer(spor({ epost: e }));
    assert.equal(d.utfall, "avvist", e);
    assert.equal(d.avvist, "privat-epost");
  }
});

test("jobb-e-post med MX og treff i Brønnøysund gir GODKJENT", () => {
  const d = filtrer(spor({ brregTreff: true }));
  assert.equal(d.utfall, "godkjent");
  assert.match(d.grunn, /Brønnøysund/);
});

test("uten brreg-treff, men domenet svarer, gir GODKJENT", () => {
  const d = filtrer(spor({ brregTreff: false, domeneSvarer: true }));
  assert.equal(d.utfall, "godkjent");
  assert.match(d.grunn, /nettside/);
});

test("uten treff og uten svar fra domenet gir USIKKER", () => {
  const d = filtrer(spor({ brregTreff: false, domeneSvarer: false }));
  assert.equal(d.utfall, "usikker");
  assert.match(d.grunn, /ingen treff i Brønnøysund/);
});

test("behov «ja» gir AVVIST", () => {
  const d = filtrer(spor({ behov: "ja" }));
  assert.equal(d.utfall, "avvist");
  assert.equal(d.avvist, "behov");
});

test("firma «Daglig leder» gir AVVIST", () => {
  const d = filtrer(spor({ firma: "Daglig leder" }));
  assert.equal(d.utfall, "avvist");
  assert.equal(d.avvist, "firma-tittel");
});

test("tomt firmafelt gir AVVIST, med sin egen grunn", () => {
  const d = filtrer(spor({ firma: "" }));
  assert.equal(d.utfall, "avvist");
  assert.equal(d.avvist, "firma-mangler");
});

test("ingen MX gir AVVIST", () => {
  const d = filtrer(spor({ harMx: false }));
  assert.equal(d.utfall, "avvist");
  assert.equal(d.avvist, "ingen-mx");
});

/**
 * VÅR EGEN NEDETID SKAL IKKE KOSTE ET LEAD. Dette er den viktigste
 * testen i fila: et oppslag som ikke kommer fram skal gi «usikker», aldri
 * «avvist».
 */
test("Brønnøysund nede gir USIKKER, ikke AVVIST", () => {
  const d = filtrer(spor({ brregTreff: null, domeneSvarer: null }));
  assert.equal(d.utfall, "usikker");
  assert.match(d.grunn, /fikk ikke svar fra Brønnøysund/);
});

/**
 * ET V2-LEAD KAN IKKE AVVISES PÅ ET SPØRSMÅL SKJEMAET IKKE STILTE.
 * Kontrollert i HubSpot 12.10.2026: behovsfeltet er tomt på alle leadene
 * fra v2-skjemaet. v3 gjør feltet obligatorisk, og da gjelder regelen
 * fullt ut — se `behovFinnes` i lib/leadfilter.ts.
 */
test("et lead fra gammelt skjema avvises ikke for manglende behov", () => {
  const d = filtrer(spor({ behov: "", behovFinnes: false }));
  assert.notEqual(d.utfall, "avvist");
  assert.equal(d.utfall, "godkjent");

  /* Uten godkjenningstegn blir det usikker, og grunnen sier hvorfor. */
  const u = filtrer(
    spor({ behov: "", behovFinnes: false, brregTreff: false, domeneSvarer: false }),
  );
  assert.equal(u.utfall, "usikker");
  assert.match(u.grunn, /spør ikke om behovet/);
});

/** Påls egne testinnsendinger skal gå gjennom som før. */
test("reflektor.no er et jobbdomene", () => {
  for (const e of ["pal@reflektor.no", "pal+test@reflektor.no"]) {
    assert.equal(filtrer(spor({ epost: e })).utfall, "godkjent", e);
  }
});

/* ───────── NETTSIDESKJEMAET: FLAGG, IKKE AVVIS (valgt av Pål) ───────── */

/**
 * BEGGE DE EKTE SKJEMAHENVENDELSENE BRUKER GMAIL. Målt i HubSpot
 * 12.10.2026: Fling AS og La Mexicana AS er de to ekte leadene siden har
 * hatt, og en avvisning ville kastet dem. Pål valgte flagging.
 */
test("nettsideleads flagges på privat adresse, ikke avvises", () => {
  assert.deepEqual(
    nettsideTreff({
      epost: "flingjes@gmail.com",
      telefon: "+47 473 30 993",
      melding: "Vi trenger film til nettsiden og sosiale medier",
    }),
    ["privat-epost"],
  );
});

test("et kort behov flagges også på nettsiden", () => {
  const treff = nettsideTreff({
    epost: "post@lokk.no",
    telefon: "+4741172729",
    melding: "hei",
  });
  assert.deepEqual(treff, ["behov-for-kort"]);
});

test("et rent nettsidelead får ingen treff", () => {
  assert.deepEqual(
    nettsideTreff({
      epost: "iver@lokk.no",
      telefon: "+47 411 72 729",
      melding: "Some innhold. Mest mot custom hodeplagg og produkter",
    }),
    [],
  );
});

/* ────────── HELE VEIEN GJENNOM JOBBEN (bestilt 12.10.2026) ──────────── */

/**
 * DET SOM MÅLES ER HVA SOM FORLATER HUSET: en e-post til kunden (Google),
 * et varsel til Pål (Resend), og hva som ble skrevet på avtalen.
 *
 * STUBBEN SVARER PÅ ADRESSE, IKKE PÅ REKKEFØLGE. En stubb som teller kall
 * går i stykker så snart koden bytter om på to oppslag, og da feiler
 * testen for noe annet enn det den handler om.
 */
type Stubb = { brreg?: boolean; svarer?: boolean };

type Telt = {
  google: number;
  varsler: { emne: string; tekst: string }[];
  avtalenavn: string[];
  kontaktfelt: Record<string, string>[];
};

const AVTALENAVN = "Ingrid Lie – Nordlysbakeriet (Meta)";

async function gjennomJobben(
  kontakt: Record<string, unknown>,
  stubb: Stubb,
  kjor: (sendEpost1: (k: never, na: Date) => Promise<string>) => Promise<void>,
): Promise<Telt> {
  const forFetch = globalThis.fetch;
  const forMiljo = { ...process.env };
  const forInfo = console.info;
  const forAdvar = console.warn;
  const t: Telt = { google: 0, varsler: [], avtalenavn: [], kontaktfelt: [] };

  Object.assign(process.env, {
    LEAD_EPOST_AKTIV: "true",
    HUBSPOT_TOKEN: "test",
    RESEND_API_KEY: "test",
    PAAMINNELSE_HEMMELIGHET: "testhemmelighet-nok-lang",
    GOOGLE_OAUTH_CLIENT_ID: "id",
    GOOGLE_OAUTH_CLIENT_SECRET: "hemmelighet",
    GOOGLE_OAUTH_REFRESH_TOKEN: "fornying",
  });
  delete process.env.LEAD_EPOST_TEST_ADRESSE;
  console.info = () => {};
  console.warn = () => {};

  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    const metode = init?.method ?? "GET";

    if (url.includes("oauth2.googleapis.com")) {
      return Response.json({ access_token: "nøkkel" });
    }
    if (url.includes("gmail.googleapis.com")) {
      t.google += 1;
      return Response.json({ id: "m1", threadId: "t1" });
    }
    if (url.includes("api.resend.com")) {
      const k = JSON.parse(String(init?.body)) as {
        subject: string;
        text: string;
      };
      t.varsler.push({ emne: k.subject, tekst: k.text });
      return Response.json({ id: "1" });
    }
    if (url.includes("data.brreg.no")) {
      if (stubb.brreg === undefined) return new Response("", { status: 503 });
      return Response.json({
        _embedded: {
          enheter: stubb.brreg
            ? [{ navn: "NORDLYSBAKERIET AS" }]
            : [{ navn: "Et helt annet firma" }],
        },
      });
    }

    if (url.includes("api.hubapi.com")) {
      if (/\/objects\/contacts\/\d+\?/.test(url)) {
        return Response.json({ id: "1", properties: { email: "a@b.no" } });
      }
      if (metode === "PATCH" && url.includes("/objects/contacts/")) {
        t.kontaktfelt.push(
          (
            JSON.parse(String(init?.body)) as {
              properties: Record<string, string>;
            }
          ).properties,
        );
        return Response.json({ id: "1" });
      }
      if (url.includes("/associations/deals")) {
        return Response.json({ results: [{ toObjectId: "d1" }] });
      }
      if (url.includes("/objects/deals/batch/read")) {
        return Response.json({
          results: [
            {
              id: "d1",
              properties: {
                dealstage: "appointmentscheduled",
                dealname: AVTALENAVN,
                createdate: "2026-10-12T06:00:00Z",
              },
            },
          ],
        });
      }
      if (metode === "PATCH" && url.includes("/objects/deals/")) {
        const p = (
          JSON.parse(String(init?.body)) as {
            properties: Record<string, string>;
          }
        ).properties;
        if (p.dealname) t.avtalenavn.push(p.dealname);
        return Response.json({ id: "d1" });
      }
      return Response.json({ results: [] });
    }

    /* Nettsjekken av e-postdomenet. */
    return stubb.svarer ? new Response("", { status: 200 }) : Promise.reject(new Error("nede"));
  }) as typeof globalThis.fetch;

  try {
    const { sendEpost1 } = await import("@/lib/leadutsending.ts");
    await kjor(sendEpost1 as never);
    return t;
  } finally {
    globalThis.fetch = forFetch;
    console.info = forInfo;
    console.warn = forAdvar;
    process.env = forMiljo;
  }
}

const METALEAD = {
  id: "1",
  epost: "post@nordlysbakeriet.no",
  navn: "Ingrid Lie",
  bedrift: "Nordlysbakeriet AS",
  telefon: "+4791122334",
  lifecycle: "lead",
  hendelse:
    "Facebook Lead Ads: Reflektor SoMe-abonnement okt 2026 v3 – jobbmail + behov",
  forsteHendelse: "",
  bookingKilde: "",
  bookingMedium: "",
  analysekilde: "",
  konvertert: "2026-10-12T06:00:00Z",
  metasvar: [] as { etikett: string; verdi: string }[],
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "",
  behov: "Vi trenger reels til Instagram hver uke, og litt foto",
  nettside: "https://nordlysbakeriet.no",
};

/** E-post 1 går i sendevinduet, og mer enn tre minutter etter innsending. */
const ETTERPA = new Date("2026-10-12T10:00:00+02:00");

test("gmail-lead: AVVIST, ingen e-post, ingen varsel, avtalen merkes", async () => {
  const t = await gjennomJobben(
    { ...METALEAD, epost: "glfjel@gmail.com" },
    { brreg: true },
    async (sendEpost1) => {
      assert.equal(
        await sendEpost1({ ...METALEAD, epost: "glfjel@gmail.com" } as never, ETTERPA),
        "hoppet-over",
      );
    },
  );

  assert.equal(t.google, 0, "ingen e-post skal ha gått til leadet");
  assert.deepEqual(t.varsler, [], "et avvist lead skal ikke varsles");
  assert.deepEqual(t.avtalenavn, [`AVVIST – ${AVTALENAVN}`]);
  assert.ok(t.kontaktfelt.some((f) => f.paminnelse_avbrutt === "true"));
});

test("jobb-e-post med treff i Brønnøysund: GODKJENT, e-posten går", async () => {
  const t = await gjennomJobben(METALEAD, { brreg: true }, async (sendEpost1) => {
    assert.equal(await sendEpost1(METALEAD as never, ETTERPA), "sendt");
  });

  assert.equal(t.google, 1, "e-post 1 skulle gått ut");
  assert.equal(t.varsler.length, 1);
  assert.match(t.varsler[0]!.emne, /^NYTT LEAD fra Meta/);
  /* Behovet og nettsiden skal stå i varselet. Bestilt 12.10. */
  assert.match(t.varsler[0]!.tekst, /Behov:/);
  assert.match(t.varsler[0]!.tekst, /nordlysbakeriet\.no/);
  assert.deepEqual(t.avtalenavn, [], "en godkjent avtale skal ikke merkes");
});

test("uten brreg-treff, men domenet svarer: GODKJENT", async () => {
  const t = await gjennomJobben(
    METALEAD,
    { brreg: false, svarer: true },
    async (sendEpost1) => {
      assert.equal(await sendEpost1(METALEAD as never, ETTERPA), "sendt");
    },
  );
  assert.equal(t.google, 1);
});

test("uten treff og uten svar: USIKKER, varsel uten e-post", async () => {
  const t = await gjennomJobben(
    METALEAD,
    { brreg: false, svarer: false },
    async (sendEpost1) => {
      assert.equal(await sendEpost1(METALEAD as never, ETTERPA), "hoppet-over");
    },
  );

  assert.equal(t.google, 0, "et usikkert lead skal ikke få e-post");
  assert.equal(t.varsler.length, 1, "Pål skal få varselet");
  assert.match(t.varsler[0]!.emne, /^USIKKERT LEAD fra Meta/);
  assert.match(t.varsler[0]!.tekst, /⚠ Usikkert lead/);
  /* Ingen lovnad om noe som ikke kommer. */
  assert.ok(!t.varsler[0]!.tekst.includes("Påminnelse sendes"));
  assert.deepEqual(t.avtalenavn, [`USIKKER – ${AVTALENAVN}`]);
});

/** Vår egen nedetid skal gi usikker, ikke avvist. */
test("Brønnøysund nede: USIKKER, og leadet varsles", async () => {
  const t = await gjennomJobben(METALEAD, {}, async (sendEpost1) => {
    assert.equal(await sendEpost1(METALEAD as never, ETTERPA), "hoppet-over");
  });

  assert.equal(t.google, 0);
  assert.match(t.varsler[0]!.emne, /^USIKKERT LEAD fra Meta/);
  assert.deepEqual(t.avtalenavn, [`USIKKER – ${AVTALENAVN}`]);
});

test("behov «ja»: AVVIST, ingenting sendes", async () => {
  const lead = { ...METALEAD, behov: "ja" };
  const t = await gjennomJobben(lead, { brreg: true }, async (sendEpost1) => {
    assert.equal(await sendEpost1(lead as never, ETTERPA), "hoppet-over");
  });
  assert.equal(t.google, 0);
  assert.deepEqual(t.varsler, []);
});

test("firma «Daglig leder»: AVVIST", async () => {
  const lead = { ...METALEAD, bedrift: "Daglig leder" };
  const t = await gjennomJobben(lead, { brreg: true }, async (sendEpost1) => {
    assert.equal(await sendEpost1(lead as never, ETTERPA), "hoppet-over");
  });
  assert.equal(t.google, 0);
  assert.deepEqual(t.varsler, []);
});

/**
 * ET V2-LEAD UTEN BEHOVSFELT SKAL IKKE AVVISES FOR DET. Skjemaet stilte
 * ikke spørsmålet; da er «usikker» det ærlige svaret, og Pål får se leadet.
 */
test("v2-lead uten behov: ikke avvist, men usikker", async () => {
  const lead = {
    ...METALEAD,
    behov: "",
    nettside: "",
    hendelse:
      "Facebook Lead Ads: Reflektor SoMe-abonnement okt 2026 v2 – SMS + Higher intent",
  };
  const t = await gjennomJobben(
    lead,
    { brreg: false, svarer: false },
    async (sendEpost1) => {
      assert.equal(await sendEpost1(lead as never, ETTERPA), "hoppet-over");
    },
  );

  assert.equal(t.google, 0);
  assert.match(t.varsler[0]!.emne, /^USIKKERT LEAD fra Meta/);
  assert.match(t.varsler[0]!.tekst, /spør ikke om behovet/);
});

/** Nettsideleads skal ikke gjennom det harde filteret i jobben. */
test("et nettsidelead med gmail avvises ikke av jobben", async () => {
  const lead = {
    ...METALEAD,
    epost: "flingjes@gmail.com",
    hendelse: "/kontaktoss: reflektor.no – kontaktskjema",
  };
  const t = await gjennomJobben(lead, { brreg: true }, async (sendEpost1) => {
    assert.equal(await sendEpost1(lead as never, ETTERPA), "sendt");
  });
  assert.equal(t.google, 1, "nettsideleads flagges i skjemaruta, ikke her");
  assert.deepEqual(t.avtalenavn, []);
});
