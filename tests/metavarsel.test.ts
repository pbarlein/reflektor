import assert from "node:assert/strict";
import test from "node:test";

import {
  LINKEDIN_VARSEL_EMNE,
  META_VARSEL_EMNE,
  sendLinkedinVarsel,
  sendMetaVarsel,
  varsel,
} from "@/lib/lead.ts";

/**
 * Varselet til Pål for et Meta-lead.
 *
 * MALEN SKAL VÆRE DEN SAMME SOM FOR NETTSIDELEADS. Det er hele bestillingen
 * fra 04.10.2026: HubSpot-varselet hadde fast tekst om «neste hverdag kl.
 * 09:00», ingen avbryt-knapp, og Metas rå verdier («nei,_ikke_nå») rett i
 * e-posten. Pål skal lese ett format.
 *
 * VERDIENE I TESTENE ER DE FAKTISKE fra leadet 04.10.2026, fordi det er det
 * tilfellet som gikk galt.
 */

const META = {
  navn: "Bakst & Ro | Hjemmebakt i Asker",
  epost: "lolademunirat@yahoo.com",
  bedrift: "BAKST & RO",
  telefon: "+4797744426",
  metasvar: [
    { etikett: "Antall ansatte", verdi: "1–4" },
    { etikett: "Passer 30 000 kr/mnd", verdi: "kanskje, vi vil vite mer" },
    { etikett: "Oppstart", verdi: "innen 3 måneder" },
  ],
};

/** Fanger det som sendes til Resend. */
async function medResend(
  kjor: () => Promise<void>,
): Promise<Record<string, unknown>[]> {
  const opprinnelig = globalThis.fetch;
  const opprinneligNokkel = process.env.RESEND_API_KEY;
  const opprinneligHemmelighet = process.env.PAAMINNELSE_HEMMELIGHET;
  const sendt: Record<string, unknown>[] = [];

  process.env.RESEND_API_KEY = "test";
  /* Uten hemmeligheten lages ingen signert avbryt-lenke. */
  process.env.PAAMINNELSE_HEMMELIGHET = "testhemmelighet-nok-lang";
  globalThis.fetch = (async (
    inn: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("api.resend.com")) {
      sendt.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return Response.json({ id: "1" });
    }
    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    await kjor();
  } finally {
    globalThis.fetch = opprinnelig;
    if (opprinneligNokkel === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = opprinneligNokkel;
    if (opprinneligHemmelighet === undefined)
      delete process.env.PAAMINNELSE_HEMMELIGHET;
    else process.env.PAAMINNELSE_HEMMELIGHET = opprinneligHemmelighet;
  }
  return sendt;
}

test("Meta-varselet har samme felter og knapper som nettsidevarselet", async () => {
  const sendt = await medResend(async () => {
    await sendMetaVarsel({ ...META, sendt: new Date("2026-10-04T06:41:00Z") });
  });

  assert.equal(sendt.length, 1);
  const e = sendt[0]!;
  /*
    PREFIKSET STÅR URØRT FØRST — leadsjekken søker på det — og navnet og
    bedriften kommer etter, så Gmail ikke tråder varslene sammen.
  */
  assert.ok(String(e.subject).startsWith(META_VARSEL_EMNE));
  assert.equal(
    e.subject,
    "NYTT LEAD fra Meta – Bakst & Ro | Hjemmebakt i Asker (BAKST & RO)",
  );
  /* Svar går til leadet, ikke til Resend. */
  assert.equal(e.reply_to, "lolademunirat@yahoo.com");

  const tekst = String(e.text);
  for (const felt of [
    "Avsender:",
    "Mobilnummer:",
    "E-post:",
    "Bedrift:",
    "Antall ansatte:",
    "Passer 30 000 kr/mnd:",
    "Oppstart:",
  ]) {
    assert.ok(tekst.includes(felt), `mangler ${felt}`);
  }

  /* Verdiene skal være vasket, ikke Metas nøkler. */
  assert.ok(tekst.includes("kanskje, vi vil vite mer"));
  assert.ok(!tekst.includes("_vil_vite_"));

  /* Eksakt dato, ikke «neste hverdag kl. 09:00». */
  assert.ok(
    tekst.includes("Påminnelse sendes mandag 5. oktober kl. 09:00"),
    tekst,
  );
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));

  const html = String(e.html);
  assert.ok(html.includes("Skriv til Bakst"), "mangler skriv-knappen");
  assert.ok(html.includes("Avbryt påminnelse"), "mangler avbryt-knappen");

  /* Meta-skjemaet har verken nettside eller fritekst. */
  assert.ok(!tekst.includes("Nettside:"));
  assert.ok(!tekst.includes("Behov:"));
});

/**
 * HAR PERSONEN ALT BOOKET, skal varselet si det — og ikke love en
 * påminnelse som ikke kommer, eller en e-post som ikke ble sendt.
 */
test("har leadet booket, sier varselet det i stedet", async () => {
  const sendt = await medResend(async () => {
    await sendMetaVarsel({
      ...META,
      moteBooket: new Date("2026-10-16T09:00:00Z"),
    });
  });

  const tekst = String(sendt[0]!.text);
  assert.ok(
    tekst.includes(
      "Har allerede booket møte fredag 16. oktober kl. 11:00. Ingen automatisk e-post sendt.",
    ),
    tekst,
  );
  assert.ok(!tekst.includes("Påminnelse sendes"));
  assert.ok(!tekst.includes("Canva-presentasjon"));
  /* Det finnes ingen påminnelse å avbryte. */
  assert.ok(!String(sendt[0]!.html).includes("Avbryt påminnelse"));
  /*
   * «RING ASAP FOR Å BOOKE MØTE PERSONLIG» STÅR IKKE NÅR MØTET ER BOOKET.
   *
   * Her sto det motsatte, med kommentaren «Ringe skal han fortsatt». Den
   * var feil: linjen finnes for å slå den automatiske e-posten i tid —
   * rekker Pål å ringe først, booker han møtet selv — og det løpet er over
   * i det øyeblikket møtet står i kalenderen. Fanget av Pål 06.10.2026 på
   * møtevarselet, og den samme setningen sto her.
   */
  assert.ok(!tekst.includes("Ring ASAP"));
  assert.ok(!tekst.includes("booke møte personlig"));
});

/** Nettsidevarselet skal være uendret av at Meta fikk sin variant. */
test("nettsidevarselet har fortsatt nettside og behov", () => {
  const { tekst } = varsel({
    navn: "Henrik Dale",
    epost: "henrik@example.no",
    bedrift: "Nordvik",
    telefon: "+4791122334",
    melding: "Vi trenger film",
    side: "/kontaktoss",
    nettside: "https://nordvik.no",
    nettsideUtledet: false,
    kilde: "google",
  });
  assert.ok(tekst.includes("Nettside:"));
  assert.ok(tekst.includes("Behov:"));
  assert.ok(!tekst.includes("Antall ansatte:"));
});

/* ──────────────── BAKST & RO, HELE VEIEN (04.10.2026) ───────────────── */

/**
 * SCENARIET SOM GIKK GALT, kjørt gjennom hele jobben.
 *
 * 06:38 kom Meta-leadet på lolademunirat@yahoo.com. 06:39 booket samme
 * person møte via reflektor.no/book, med bakstogro@outlook.com, og HubSpot
 * laget en ny kontakt. 06:40 sendte jobben presentasjon og «book her» til
 * BEGGE. Testen krever at ingen av dem får e-post, og at varselet sier at
 * personen har booket.
 */

/*
 * ADRESSEN ER ET JOBBDOMENE, byttet 12.10.2026. Det ekte leadet fra 04.10
 * brukte `lolademunirat@yahoo.com`, og fra i dag avviser leadfilteret
 * yahoo — se lib/leadfilter.ts. Fiksturen ville blitt stoppet før testen
 * rakk å måle det den handler om, nemlig varselet og bookingen. At den
 * ekte adressen nå avvises, er testet for seg i tests/leadfilter.test.ts.
 *
 * DOMENET SLÅS IKKE OPP. Oppslagene sendes inn som stubb nedenfor, så
 * testen ikke avhenger av om noen andres domene tar imot e-post. Her sto
 * `bakstogro.no`, som ikke finnes lenger — og CI feilet på det samme dag.
 */
const METAKONTAKT = {
  id: "883323161813",
  epost: "post@bakstogro.no",
  navn: "Bakst & Ro | Hjemmebakt i Asker",
  bedrift: "BAKST & RO",
  telefon: "+4797744426",
  lifecycle: "lead",
  hendelse: "Facebook Lead Ads: Reflektor SoMe-abonnement Untitled form",
  konvertert: "2026-10-04T06:38:31Z",
  epost1Sendt: "",
  epost2Sendt: "",
  tradId: "",
  meldingsId: "",
  avbrutt: "",
  moteBooket: "",
  behov: "",
  nettside: "",
  metasvar: [
    { etikett: "Antall ansatte", verdi: "1–4" },
    { etikett: "Passer 30 000 kr/mnd", verdi: "kanskje, vi vil vite mer" },
    { etikett: "Oppstart", verdi: "innen 3 måneder" },
  ],
};

const BOOKINGKONTAKT = {
  ...METAKONTAKT,
  id: "882425783540",
  epost: "bakstogro@outlook.com",
  navn: "Munirat O Ajetunmobi Olabode",
  telefon: "",
  hendelse: "Meetings Link: paal-barlein/intro",
  konvertert: "2026-10-04T06:39:41Z",
  moteBooket: "2026-10-16T09:00:00Z",
  metasvar: [],
};

/**
 * Kjører med alle nøkler satt, og teller hvem som ble ringt opp: Gmail,
 * Resend eller HubSpot.
 */
/** Oppslagene filteret ellers gjør over nettet. Her: alt i orden. */
const OPPSLAG = {
  harMx: async () => true,
  brregTreff: async () => true,
  domeneSvarer: async () => true,
};

async function medAlt(
  kjor: (
    sendEpost1: (
      k: typeof METAKONTAKT,
      na?: Date,
      booket?: (typeof METAKONTAKT)[],
      oppslag?: typeof OPPSLAG,
    ) => Promise<string>,
  ) => Promise<void>,
): Promise<{
  gmail: number;
  resend: Record<string, unknown>[];
  hubspot: string[];
}> {
  const opprinnelig = globalThis.fetch;
  const for_ = { ...process.env };
  const logg = console.info;

  Object.assign(process.env, {
    LEAD_EPOST_AKTIV: "true",
    HUBSPOT_TOKEN: "test",
    RESEND_API_KEY: "test",
    PAAMINNELSE_HEMMELIGHET: "testhemmelighet-nok-lang",
    GOOGLE_OAUTH_CLIENT_ID: "id",
    GOOGLE_OAUTH_CLIENT_SECRET: "hemmelighet",
    GOOGLE_OAUTH_REFRESH_TOKEN: "fornying",
  });
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  delete process.env.LEAD_EPOST_TEST_ADRESSE;

  const telling = {
    gmail: 0,
    resend: [] as Record<string, unknown>[],
    hubspot: [] as string[],
  };

  console.info = () => {};
  globalThis.fetch = (async (
    inn: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("oauth2.googleapis.com")) {
      return Response.json({ access_token: "nøkkel" });
    }
    if (url.includes("gmail.googleapis.com")) {
      telling.gmail += 1;
      return Response.json({ threadId: "t1" });
    }
    if (url.includes("api.resend.com")) {
      telling.resend.push(
        JSON.parse(String(init?.body)) as Record<string, unknown>,
      );
      return Response.json({ id: "1" });
    }
    if (url.includes("api.hubapi.com")) {
      telling.hubspot.push(String(init?.body ?? ""));
      return Response.json({ results: [] });
    }
    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    const { sendEpost1 } = await import("@/lib/leadutsending.ts");
    await kjor(sendEpost1 as never);
  } finally {
    globalThis.fetch = opprinnelig;
    console.info = logg;
    process.env = for_;
  }
  return telling;
}

test("Meta-lead som booket ett minutt senere: ingen e-post til noen av dem", async () => {
  const booket = [BOOKINGKONTAKT];
  const t = await medAlt(async (sendEpost1) => {
    /* Meta-kontakten: bundet til bookingen av telefon og bedrift. */
    assert.equal(
      await sendEpost1(METAKONTAKT, new Date("2026-10-04T06:42:00Z"), booket),
      "hoppet-over",
    );
    /* Bookingkontakten selv: møtet står på henne. */
    assert.equal(
      await sendEpost1(
        BOOKINGKONTAKT,
        new Date("2026-10-04T06:42:00Z"),
        booket,
      ),
      "hoppet-over",
    );
  });

  assert.equal(t.gmail, 0, "ingen e-post skulle gått til kunden");

  /* Ett varsel, og det gjelder Meta-leadet. */
  assert.equal(t.resend.length, 1);
  const tekst = String(t.resend[0]!.text);
  assert.ok(
    tekst.includes("Har allerede booket møte fredag 16. oktober kl. 11:00."),
    tekst,
  );
  assert.ok(tekst.includes("Ingen automatisk e-post sendt."));
  assert.ok(!tekst.includes("Påminnelse sendes"));

  /* Begge kontaktene merkes, så neste kjøring ikke gjør det om igjen. */
  assert.equal(
    t.hubspot.filter((k) => k.includes("paminnelse_avbrutt")).length,
    2,
  );
});

/** Uten bookingen skal Meta-leadet få presentasjonen som normalt. */
test("Meta-lead uten booking får e-posten og varselet", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        METAKONTAKT,
        new Date("2026-10-04T06:42:00Z"),
        [],
        OPPSLAG,
      ),
      "sendt",
    );
  });

  assert.equal(t.gmail, 1);
  assert.equal(t.resend.length, 1);
  const tekst = String(t.resend[0]!.text);
  assert.ok(tekst.includes("Påminnelse sendes"), tekst);
  assert.ok(!tekst.includes("Har allerede booket"));
});

/** Ett minutt etter Meta-skjemaet skal jobben vente, ikke sende. */
test("Meta-lead som er under tre minutter gammelt venter", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(METAKONTAKT, new Date("2026-10-04T06:39:00Z"), []),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
  assert.equal(t.resend.length, 0);
});

/** En booking er ikke et skjemalead, og skal aldri utløse e-post 1. */
test("en kontakt opprettet av en booking får ingen e-post", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        { ...BOOKINGKONTAKT, moteBooket: "" },
        new Date("2026-10-04T06:45:00Z"),
        [],
      ),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
});

/* ───────────────── LINKEDIN-VARSELET (09.11.2026) ───────────────────── */

/**
 * Tredje kanal, samme mal. Bestilt av Pål 09.11.2026 da LinkedIn-kampanjen
 * med lead gen-skjema startet.
 *
 * DET SOM ER NYTT ER TO RADER OG ETT EMNE. Alt annet — knappene,
 * påminnelseslinja, «har allerede booket», Reply-To — skal være nøyaktig
 * det Meta-varselet har, og det er det testene her er til for: de spør om
 * de samme tingene som testen over, og de ville sagt fra hvis de to
 * malene glir fra hverandre.
 */

const LINKEDIN = {
  navn: "Ingrid Solheim",
  epost: "ingrid@soulcake.no",
  bedrift: "Soulcake AS",
  telefon: "+4790000001",
  stillingstittel: "Markedssjef",
  aktuelt: "Et abonnement (løpende innhold)",
};

test("LinkedIn-varselet har sitt eget emne og de to radene fra skjemaet", async () => {
  const sendt = await medResend(async () => {
    await sendLinkedinVarsel({
      ...LINKEDIN,
      sendt: new Date("2026-11-10T09:00:00Z"),
    });
  });

  assert.equal(sendt.length, 1);
  const e = sendt[0]!;
  assert.ok(String(e.subject).startsWith(LINKEDIN_VARSEL_EMNE));
  assert.equal(
    e.subject,
    "NYTT LEAD fra LinkedIn – Ingrid Solheim (Soulcake AS)",
  );
  assert.equal(e.reply_to, "ingrid@soulcake.no");

  const tekst = String(e.text);
  for (const felt of [
    "Avsender:",
    "Mobilnummer:",
    "E-post:",
    "Bedrift:",
    "Stillingstittel:",
    "Hva er mest aktuelt for dere?:",
  ]) {
    assert.ok(tekst.includes(felt), `mangler ${felt}`);
  }
  assert.ok(tekst.includes("Markedssjef"));
  assert.ok(tekst.includes("Et abonnement (løpende innhold)"));

  /* Samme knapper og samme oppfølgingslinje som Meta. */
  const html = String(e.html);
  assert.ok(html.includes("Skriv til Ingrid"), "mangler skriv-knappen");
  assert.ok(html.includes("Avbryt påminnelse"), "mangler avbryt-knappen");
  assert.ok(tekst.includes("Påminnelse sendes"), tekst);
  assert.ok(tekst.includes("Ring ASAP for å booke møte personlig."));

  /* LinkedIn-skjemaet har verken nettside eller fritekst. */
  assert.ok(!tekst.includes("Nettside:"));
  assert.ok(!tekst.includes("Behov:"));
});

/**
 * FELT UTEN VERDI VISES SOM «–», ordrett fra bestillingen. Meta-svarene
 * faller ut når de er tomme fordi de varierer fra skjema til skjema; disse
 * to spør LinkedIn-skjemaet om hver gang, og at de står tomme ER en
 * opplysning.
 */
test("LinkedIn-rader uten verdi står som tankestrek", async () => {
  const sendt = await medResend(async () => {
    await sendLinkedinVarsel({ ...LINKEDIN, stillingstittel: "", aktuelt: "" });
  });

  const tekst = String(sendt[0]!.text);
  assert.ok(tekst.includes("Stillingstittel: –"), tekst);
  assert.ok(tekst.includes("Hva er mest aktuelt for dere?: –"), tekst);
});

/**
 * «ET ENKELTPROSJEKT» ENDRER INGENTING I E-POSTEN TIL LEADET. Bestilt slik
 * 09.11.2026: e-post 1 selger abonnementet som før, og svaret står i
 * varselet så Pål ser det før han ringer.
 */
test("svarer leadet enkeltprosjekt, står det i varselet", async () => {
  const sendt = await medResend(async () => {
    await sendLinkedinVarsel({
      ...LINKEDIN,
      aktuelt: "Et enkeltprosjekt (film eller foto)",
    });
  });

  assert.ok(
    String(sendt[0]!.text).includes("Et enkeltprosjekt (film eller foto)"),
  );
  /* Emnet er det samme — dette er ikke et eget varsel. */
  assert.ok(String(sendt[0]!.subject).startsWith(LINKEDIN_VARSEL_EMNE));
});

test("har LinkedIn-leadet booket, sier varselet det i stedet", async () => {
  const sendt = await medResend(async () => {
    await sendLinkedinVarsel({
      ...LINKEDIN,
      moteBooket: new Date("2026-11-20T09:00:00Z"),
    });
  });

  const tekst = String(sendt[0]!.text);
  assert.ok(tekst.includes("Har allerede booket møte"), tekst);
  assert.ok(!tekst.includes("Påminnelse sendes"));
  assert.ok(!tekst.includes("Ring ASAP"));
  assert.ok(!String(sendt[0]!.html).includes("Avbryt påminnelse"));
});

/** Meta-varselet skal være uendret av at LinkedIn fikk sitt. */
test("Meta-varselet nevner ikke LinkedIn", async () => {
  const sendt = await medResend(async () => {
    await sendMetaVarsel({ ...META, sendt: new Date("2026-10-04T06:41:00Z") });
  });
  const e = sendt[0]!;
  assert.ok(!String(e.subject).includes("LinkedIn"));
  assert.ok(!String(e.text).includes("Stillingstittel"));
  assert.ok(!String(e.text).includes("Hva er mest aktuelt"));
});

/* ─────────── HELE VEIEN FOR ET LINKEDIN-LEAD (09.11.2026) ───────────── */

/**
 * Kontakten slik den vil se ut når HubSpot har synket den fra LinkedIn.
 *
 * FELTENE ER FRA SKJEMAET Cowork satte opp (Campaign Manager 509661654,
 * skjema 1028433440): navn, e-post, telefon, bedrift, stillingstittel og
 * ett flervalg. `annonsenettverk` er «linkedin» etter mønsteret fra de 45
 * Meta-leadene, som alle har «facebook» der.
 */
const LINKEDINKONTAKT = {
  ...METAKONTAKT,
  id: "900000000001",
  epost: "ingrid@soulcake.no",
  navn: "Ingrid Solheim",
  bedrift: "Soulcake AS",
  telefon: "+4790000001",
  hendelse:
    "LinkedIn Lead Ads: Forslag SoMe-abonnement – Soulcake-omtale – nov 2026",
  konvertert: "2026-11-10T09:00:00Z",
  annonsenettverk: "linkedin",
  stillingstittel: "Markedssjef",
  aktuelt: "Et abonnement (løpende innhold)",
  metasvar: [],
};

const TI_NOV = new Date("2026-11-10T09:05:00Z");

test("LinkedIn-lead får e-post 1, varsel og avtale", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(LINKEDINKONTAKT, TI_NOV, [], OPPSLAG),
      "sendt",
    );
  });

  assert.equal(t.gmail, 1, "leadet skulle fått e-post 1");

  assert.equal(t.resend.length, 1);
  const varselet = t.resend[0]!;
  assert.ok(String(varselet.subject).startsWith("NYTT LEAD fra LinkedIn"));
  assert.ok(String(varselet.text).includes("Stillingstittel: Markedssjef"));
  assert.ok(
    String(varselet.text).includes(
      "Hva er mest aktuelt for dere?: Et abonnement (løpende innhold)",
    ),
  );

  /*
    AVTALEN LAGES AV OSS, ikke av en arbeidsflyt. Meta-leads får sin fra
    HubSpot; for LinkedIn finnes ingen slik arbeidsflyt, og bestillingen
    sa at arbeidsflytene ikke skal røres.
  */
  const avtale = t.hubspot.find((b) => b.includes('"dealstage"'));
  assert.ok(avtale, "ingen avtale ble opprettet");
  assert.ok(avtale.includes('"kilde":"LinkedIn"'), avtale);
  assert.ok(avtale.includes('"dealstage":"appointmentscheduled"'), avtale);
  assert.ok(avtale.includes('"pipeline":"default"'), avtale);
  assert.ok(avtale.includes("Ingrid Solheim – Soulcake AS (LinkedIn)"), avtale);
});

/**
 * VENTETIDEN GJELDER OGSÅ HER. Samme tre minutter som Meta, bestilt
 * 09.11.2026 — og grunnen er den samme: bookingen må rekke å bli synlig.
 */
test("LinkedIn-lead under tre minutter gammelt venter", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        LINKEDINKONTAKT,
        new Date("2026-11-10T09:01:00Z"),
        [],
        OPPSLAG,
      ),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
  assert.equal(t.resend.length, 0);
});

/** Har LinkedIn-leadet booket, går varselet og ingen e-post. */
test("LinkedIn-lead som har booket får varsel, ikke e-post", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        { ...LINKEDINKONTAKT, moteBooket: "2026-11-20T09:00:00Z" },
        TI_NOV,
        [],
        OPPSLAG,
      ),
      "hoppet-over",
    );
  });

  assert.equal(t.gmail, 0);
  assert.equal(t.resend.length, 1);
  assert.ok(String(t.resend[0]!.subject).startsWith("NYTT LEAD fra LinkedIn"));
  assert.ok(String(t.resend[0]!.text).includes("Har allerede booket møte"));
  assert.ok(
    t.hubspot.some((k) => k.includes("paminnelse_avbrutt")),
    "kontakten skulle vært merket",
  );

  /*
    OG AVTALEN. Leadet har et møte i kalenderen; uten avtalen står det
    beste leadet i måneden ingen steder i pipelinen.
  */
  const avtale = t.hubspot.find((b) => b.includes('"dealstage"'));
  assert.ok(avtale, "den bookede skulle fått avtale");
  assert.ok(avtale.includes('"kilde":"LinkedIn"'), avtale);
});

/**
 * META- OG NETTSIDEFLYTEN SKAL VÆRE UENDRET. Det er den ene tingen denne
 * bestillingen ikke hadde råd til å ødelegge: Meta er kanalen som faktisk
 * leverer leads i dag.
 */
test("Meta-leadet går som før, og får ingen avtale fra oss", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        METAKONTAKT,
        new Date("2026-10-04T06:42:00Z"),
        [],
        OPPSLAG,
      ),
      "sendt",
    );
  });

  assert.equal(t.gmail, 1);
  assert.equal(t.resend.length, 1);
  assert.ok(String(t.resend[0]!.subject).startsWith("NYTT LEAD fra Meta"));
  assert.ok(
    !t.hubspot.some((b) => b.includes('"dealstage"')),
    "vi skal ikke opprette avtale for Meta — det gjør HubSpot",
  );
});

/**
 * EN BOOKING ER IKKE ET SKJEMALEAD, uansett nettverk. Nettverksfeltet er
 * siste utvei i gjenkjenningen, og det skal aldri gjøre en møtelenke om
 * til et lead som får presentasjonen.
 */
test("en LinkedIn-kontakt opprettet av en booking får ingen e-post", async () => {
  const t = await medAlt(async (sendEpost1) => {
    assert.equal(
      await sendEpost1(
        {
          ...LINKEDINKONTAKT,
          hendelse: "Meetings Link: paal-barlein/intro",
          moteBooket: "",
        },
        TI_NOV,
        [],
        OPPSLAG,
      ),
      "hoppet-over",
    );
  });
  assert.equal(t.gmail, 0);
  assert.equal(t.resend.length, 0);
});
