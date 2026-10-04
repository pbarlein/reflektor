import assert from "node:assert/strict";
import test from "node:test";

import {
  META_VARSEL_EMNE,
  VARSEL_EMNE,
  varselEmne,
  sendLeadPaEpost,
  type Lead,
} from "@/lib/lead.ts";

/**
 * Emnet på varslene til Pål.
 *
 * GMAIL TRÅDET DEM SAMMEN. Alle varslene hadde samme emne, og da legger
 * Gmail dem i én samtale og skjuler linjene som er like forrige melding bak
 * «…» på mobil. Linjen om presentasjon og påminnelse — den Pål leser for å
 * vite hvor lang tid han har på å ringe — var nettopp en slik linje.
 *
 * PREFIKSET MÅ STÅ URØRT FØRST. Leadsjekken søker på det.
 */

const lead = (endringer: Partial<Lead> = {}): Lead => ({
  navn: "Kristine Haugland",
  epost: "kristine@haugland.no",
  bedrift: "Haugland Interiør AS",
  telefon: "+4791122334",
  melding: "Vi trenger film",
  side: "/kontaktoss",
  nettside: "",
  nettsideUtledet: false,
  kilde: "google",
  ...endringer,
});

test("emnet har navn og bedrift etter prefikset", () => {
  assert.equal(
    varselEmne(VARSEL_EMNE, lead()),
    "NYTT LEAD fra reflektor.no – Kristine Haugland (Haugland Interiør AS)",
  );
  assert.equal(
    varselEmne(META_VARSEL_EMNE, lead()),
    "NYTT LEAD fra Meta – Kristine Haugland (Haugland Interiør AS)",
  );
});

test("uten bedrift står navnet alene", () => {
  assert.equal(
    varselEmne(VARSEL_EMNE, lead({ bedrift: "" })),
    "NYTT LEAD fra reflektor.no – Kristine Haugland",
  );
  assert.equal(
    varselEmne(VARSEL_EMNE, lead({ bedrift: "   " })),
    "NYTT LEAD fra reflektor.no – Kristine Haugland",
  );
});

test("uten navn står e-postadressen", () => {
  assert.equal(
    varselEmne(VARSEL_EMNE, lead({ navn: "", bedrift: "" })),
    "NYTT LEAD fra reflektor.no – kristine@haugland.no",
  );
  assert.equal(
    varselEmne(VARSEL_EMNE, lead({ navn: "" })),
    "NYTT LEAD fra reflektor.no – kristine@haugland.no (Haugland Interiør AS)",
  );
});

/** Uten noe å skille på faller vi tilbake til prefikset alene. */
test("uten navn og e-post står prefikset alene", () => {
  assert.equal(
    varselEmne(VARSEL_EMNE, lead({ navn: "", epost: "" })),
    VARSEL_EMNE,
  );
});

test("prefikset står først og uendret, så leadsjekken finner det", () => {
  for (const prefiks of [VARSEL_EMNE, META_VARSEL_EMNE]) {
    for (const l of [
      lead(),
      lead({ bedrift: "" }),
      lead({ navn: "" }),
      lead({ navn: "", epost: "" }),
    ]) {
      assert.ok(varselEmne(prefiks, l).startsWith(prefiks));
    }
  }
  assert.equal(VARSEL_EMNE, "NYTT LEAD fra reflektor.no");
  assert.equal(META_VARSEL_EMNE, "NYTT LEAD fra Meta");
});

/* ───────────────── MESSAGE-ID OG INGEN TRÅDING ──────────────────────── */

/** Fanger forsendelsene til Resend. */
async function medResend(
  svar: () => Response,
  kjor: () => Promise<void>,
): Promise<Record<string, unknown>[]> {
  const opprinnelig = globalThis.fetch;
  const nokkel = process.env.RESEND_API_KEY;
  const feil = console.error;
  const sendt: Record<string, unknown>[] = [];

  process.env.RESEND_API_KEY = "test";
  console.error = () => {};
  globalThis.fetch = (async (inn: string | URL | Request, init?: RequestInit) => {
    const url = String(inn instanceof Request ? inn.url : inn);
    if (url.includes("api.resend.com")) {
      sendt.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return svar();
    }
    return Response.json({});
  }) as typeof globalThis.fetch;

  try {
    await kjor();
  } finally {
    globalThis.fetch = opprinnelig;
    console.error = feil;
    if (nokkel === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = nokkel;
  }
  return sendt;
}

test("hvert varsel får sin egen Message-ID, og ingen tråding", async () => {
  const sendt = await medResend(
    () => Response.json({ id: "1" }),
    async () => {
      await sendLeadPaEpost(lead());
      await sendLeadPaEpost(lead({ navn: "Henrik Dale" }));
    },
  );

  assert.equal(sendt.length, 2);
  const ider = sendt.map(
    (e) => (e.headers as Record<string, string> | undefined)?.["Message-ID"],
  );
  assert.ok(ider[0], "mangler Message-ID");
  assert.notEqual(ider[0], ider[1], "to varsler delte Message-ID");
  for (const id of ider) {
    assert.match(String(id), /^<[0-9a-f-]+@reflektor\.no>$/);
  }

  /* Ingenting som ber en klient om å tråde meldingene sammen. */
  for (const e of sendt) {
    const h = (e.headers ?? {}) as Record<string, string>;
    assert.equal(h["In-Reply-To"], undefined);
    assert.equal(h["References"], undefined);
    assert.equal(h["Thread-Index"], undefined);
  }

  /* Og emnene skiller seg, som er hovedgrepet. */
  assert.notEqual(sendt[0]!.subject, sendt[1]!.subject);
});

/**
 * ET VARSEL SOM IKKE KOMMER FRAM ER VERRE ENN ET VARSEL I FEIL TRÅD. Vil
 * ikke Resend ha egne headere, sendes varselet på nytt uten dem.
 */
test("avviser Resend headerne, går varselet likevel", async () => {
  let forsok = 0;
  const sendt = await medResend(
    () => {
      forsok += 1;
      return forsok === 1
        ? new Response("nei", { status: 422 })
        : Response.json({ id: "1" });
    },
    async () => {
      await sendLeadPaEpost(lead());
    },
  );

  assert.equal(sendt.length, 2);
  assert.ok(sendt[0]!.headers, "første forsøk skal ha headerne");
  assert.equal(sendt[1]!.headers, undefined, "andre forsøk skal være uten");
  /* Emnet er uendret: det er ikke headerne som gjør det unikt. */
  assert.equal(sendt[0]!.subject, sendt[1]!.subject);
});
