import assert from "node:assert/strict";
import test from "node:test";

import { artikler } from "@/content/artikler.ts";
import { tjenestesider } from "@/content/tjenester.ts";
import { hentTekst } from "@/content/sider/_slot.ts";
import { front } from "@/content/sider/front.ts";

/**
 * Søkeordkartet: én side eier ett søkeord.
 *
 * BAKGRUNNEN ER MÅLT, ikke antatt. «innholdsproduksjon» har 450 søk i
 * måneden i Norge, «employer branding» 400, «reklamefilm» 200 — og
 * vanskelighet under 20 på nesten alle. Sidene var gode å lese, men brukte
 * ikke ordene folk søker på.
 *
 * TESTENE HER VOKTER DEN ANDRE HALVPARTEN: at to sider ikke kjemper om det
 * samme ordet. Kannibalisering er den feilen som er lett å gjøre og umulig
 * å se — begge sidene ser riktige ut hver for seg.
 *
 * Kartet står i docs/sidearkitektur.md. Endres det, endres testene her.
 */

const frontTittel = hentTekst(front, "front.meta.title") ?? "";
const frontIngress = hentTekst(front, "front.hero.sub") ?? "";

/**
 * Overskriftene en side eier: tittel, H1 og seksjonsoverskriftene.
 *
 * DELBLOKKENES TITLER ER IKKE OVERSKRIFTER. De rendres som `<p>` med
 * halvfet vekt inne i et listepunkt — se Delblokk i Tjenestelayout.tsx. Et
 * listepunkt som heter «Reklamefilm» inne i en oversikt konkurrerer ikke
 * med /reklamefilm; en H2 ville gjort det. Første utgave av denne testen
 * tok dem med, og slo ut på en delblokk som har stått der siden 01.10.
 */
function overskrifter(side: (typeof tjenestesider)[number]): string[] {
  return [side.tittel, side.h1, ...side.seksjoner.map((s) => s.sporsmal)];
}

const side = (sti: string) => {
  const s = tjenestesider.find((t) => t.sti === sti);
  assert.ok(s, `fant ikke ${sti}`);
  return s;
};

/* ───────────────────── HOVEDSØKEORDET STÅR DER DET SKAL ──────────────── */

/**
 * Prinsippet: hovedsøkeordet skal stå i title, i meta description og i H1
 * eller første setning under H1.
 */
const EIERE: { sti: string; ord: string; ogsa?: string[] }[] = [
  {
    sti: "/innholdsproduksjon",
    ord: "innholdsproduksjon",
    ogsa: ["innholdsbyrå"],
  },
  { sti: "/reklamefilm", ord: "reklamefilm" },
  {
    sti: "/videoproduksjon-i-oslo",
    ord: "videoproduksjon",
    ogsa: ["bedriftsfilm", "filmproduksjon"],
  },
  {
    sti: "/eventfotograf-eventvideo",
    ord: "eventfotograf",
    ogsa: ["eventvideo"],
  },
  {
    sti: "/employer-branding-video-oslo",
    ord: "employer branding",
    ogsa: ["rekrutteringsfilm"],
  },
  { sti: "/reels-produksjon", ord: "reels" },
];

test("hovedsøkeordet står i tittel, meta og ingress", () => {
  for (const { sti, ord } of EIERE) {
    const s = side(sti);
    const i = ord.toLowerCase();
    assert.ok(s.tittel.toLowerCase().includes(i), `${sti}: tittel`);
    assert.ok(s.beskrivelse.toLowerCase().includes(i), `${sti}: meta`);
    assert.ok(
      `${s.h1} ${s.svar}`.toLowerCase().includes(i),
      `${sti}: H1 eller ingress`,
    );
  }
});

/**
 * ETT AV SIDENS EGNE ORD SKAL STÅ I EN SEKSJONSOVERSKRIFT, ikke bare i
 * tittelen. /videoproduksjon-i-oslo har «Bedriftsfilm» og «Filmproduksjon
 * for bedrifter i Oslo» — to av de fire ordene siden eier — og det er
 * poenget: overskriftene skal dekke ordene, ikke gjenta tittelen.
 */
test("et av sidens egne ord står i en seksjonsoverskrift", () => {
  for (const { sti, ord, ogsa } of EIERE) {
    const ordene = [ord, ...(ogsa ?? [])].map((o) => o.toLowerCase());
    const funnet = side(sti)
      .seksjoner.map((s) => s.sporsmal.toLowerCase())
      .some((h) => ordene.some((o) => h.includes(o)));
    assert.ok(funnet, `${sti} mangler ${JSON.stringify(ordene)} i en overskrift`);
  }
});

/**
 * STEDET SKAL STÅ. «innholdsproduksjon oslo» har 80 søk, «videoproduksjon
 * oslo» 150. Et byrå som ikke sier hvor det holder til, svarer ikke på
 * stedssøket.
 */
/**
 * /reels-produksjon ER UNNTAKET. Den selger et produkt til fast pris, ikke
 * et sted — «reels produksjon» har ingen Oslo-variant med volum. Stedet
 * står i FAQ-en på den siden i stedet.
 */
test("Oslo står i tittel eller ingress på tjenestesidene", () => {
  for (const { sti } of EIERE.filter((e) => e.sti !== "/reels-produksjon")) {
    const s = side(sti);
    assert.ok(
      `${s.tittel} ${s.beskrivelse} ${s.svar}`.toLowerCase().includes("oslo"),
      `${sti} nevner ikke Oslo`,
    );
  }
});

test("forsiden eier byrå-ordene, og sier dem", () => {
  assert.ok(frontTittel.toLowerCase().includes("some-byrå"), frontTittel);
  assert.ok(frontIngress.toLowerCase().includes("some-byrå"), frontIngress);
  assert.ok(frontTittel.toLowerCase().includes("oslo"));
});

/* ──────────────────────── INGEN KANNIBALISERING ──────────────────────── */

/**
 * «HVA KOSTER» ER BLOGGENS. En tjenesteside som stiller samme spørsmål som
 * artikkelen, tar oppmerksomhet fra den uten å kunne svare like fyldig.
 * Fire slike overskrifter sto på tjenestesidene til 04.10.2026.
 */
test("«hva koster» finnes ikke i en overskrift på en tjenesteside", () => {
  for (const s of tjenestesider) {
    for (const h of overskrifter(s)) {
      assert.ok(
        !h.toLowerCase().includes("hva koster"),
        `${s.sti}: «${h}»`,
      );
    }
  }
});

/** Byrå-ordene eies av forsiden alene. */
test("ingen tjenesteside har byrå-ordene i en overskrift", () => {
  for (const s of tjenestesider) {
    for (const h of overskrifter(s)) {
      const t = h.toLowerCase();
      assert.ok(!t.includes("some-byrå"), `${s.sti}: «${h}»`);
      assert.ok(!t.includes("sosiale medier byrå"), `${s.sti}: «${h}»`);
    }
  }
});

/** «innholdsbyrå» og «content byrå» eies av /innholdsproduksjon alene. */
test("innholdsbyrå nevnes bare på innholdsproduksjonssiden", () => {
  for (const s of tjenestesider) {
    const tekst = [
      s.tittel,
      s.beskrivelse,
      s.h1,
      s.svar,
      ...overskrifter(s),
    ]
      .join(" ")
      .toLowerCase();
    if (s.sti === "/innholdsproduksjon") {
      assert.ok(tekst.includes("innholdsbyrå"), "siden mangler ordet");
      continue;
    }
    assert.ok(!tekst.includes("innholdsbyrå"), `${s.sti}`);
    assert.ok(!tekst.includes("content byrå"), `${s.sti}`);
  }
});

/**
 * ETT EIERSKAP PER ORD. /kjeder er unntaket for «reklamefilm»: «reklamefilm
 * for kjeder» er et annet søk, og siden lenker til eieren.
 */
test("hvert søkeord har bare én eier blant overskriftene", () => {
  const unntak: Record<string, string[]> = {
    reklamefilm: ["/reklamefilm", "/kjeder"],
  };
  for (const ord of ["reklamefilm", "eventfotograf", "employer branding"]) {
    const eiere = tjenestesider
      .filter((s) =>
        overskrifter(s).some((h) => h.toLowerCase().includes(ord)),
      )
      .map((s) => s.sti);
    const tillatt = unntak[ord] ?? [
      EIERE.find((e) => e.ord === ord)?.sti ?? "",
    ];
    for (const e of eiere) {
      assert.ok(tillatt.includes(e), `«${ord}» står også i overskrift på ${e}`);
    }
  }
});

/* ───────────────────── TOVEIS LENKING MOT BLOGGEN ────────────────────── */

/** Artikkelen lenker til tjenestesiden, og tjenestesiden til artikkelen. */
const PAR: { artikkel: string; tjeneste: string }[] = [
  { artikkel: "hva-koster-reklamefilm", tjeneste: "/reklamefilm" },
  { artikkel: "hva-koster-videoproduksjon", tjeneste: "/videoproduksjon-i-oslo" },
  { artikkel: "hva-koster-eventfotograf", tjeneste: "/eventfotograf-eventvideo" },
  { artikkel: "hva-er-employer-branding", tjeneste: "/employer-branding-video-oslo" },
  { artikkel: "hva-er-innholdsproduksjon", tjeneste: "/innholdsproduksjon" },
  { artikkel: "hva-koster-et-some-byra", tjeneste: "/" },
];

test("artikkelen lenker til tjenestesiden tidlig i teksten", () => {
  for (const { artikkel, tjeneste } of PAR) {
    const a = artikler.find((x) => x.slug === artikkel);
    assert.ok(a, `fant ikke ${artikkel}`);
    /* De fem første blokkene: ingressen og de første avsnittene. */
    const tidlig = a.blokker
      .slice(0, 6)
      .flatMap((b) => ("lenker" in b ? (b.lenker ?? []) : []))
      .map((l) => l.sti);
    assert.ok(
      tidlig.includes(tjeneste),
      `${artikkel} lenker ikke til ${tjeneste} tidlig (fant ${JSON.stringify(tidlig)})`,
    );
  }
});

test("tjenestesiden lenker tilbake til artikkelen", () => {
  for (const { artikkel, tjeneste } of PAR) {
    if (tjeneste === "/") continue;
    const s = side(tjeneste);
    const stier = [
      ...s.seksjoner.flatMap((x) => x.lenker?.map((l) => l.sti) ?? []),
      ...s.faq.flatMap((f) => f.lenker?.map((l) => l.sti) ?? []),
      ...s.seksjoner.flatMap(
        (x) => x.delblokker?.map((d) => d.lenke?.sti ?? "") ?? [],
      ),
    ];
    assert.ok(
      stier.includes(`/blogg/${artikkel}`),
      `${tjeneste} lenker ikke til /blogg/${artikkel}`,
    );
  }
});

/* ───────────── TITTELKOLLISJONER PÅ HELE NETTSTEDET ────────────────── */

/**
 * ALLE TITLER, IKKE BARE TJENESTESIDENES.
 *
 * Første utgave av denne fila testet bare `tjenestesider`, og slapp
 * gjennom to kollisjoner: /faq het «Ofte stilte spørsmål – SoMe-byrå og
 * fast pris» og /om-oss het «Om oss – SoMe-byrået Reflektor i Oslo». Begge
 * konkurrerte med forsiden om ordet forsiden skal eie. De ble funnet først
 * da titlene ble lest ut av det ferdige bygget.
 *
 * Testen leser kilden, så den trenger ikke et bygg for å kjøre.
 */
const TITTELKILDER: { rute: string; fil: string }[] = [
  { rute: "/faq", fil: "src/app/faq/page.tsx" },
  { rute: "/om-oss", fil: "src/content/omoss.ts" },
  { rute: "/kontaktoss", fil: "src/app/kontaktoss/page.tsx" },
  { rute: "/vart-arbeid", fil: "src/app/vart-arbeid/page.tsx" },
  { rute: "/blogg", fil: "src/app/blogg/page.tsx" },
];

test("ingen annen side enn forsiden har byrå-ordene i tittelen", async () => {
  const { readFileSync } = await import("node:fs");
  for (const { rute, fil } of TITTELKILDER) {
    const kilde = readFileSync(fil, "utf8");
    const titler = [
      ...kilde.matchAll(/(?:title|metaTittel):\s*"([^"]+)"/g),
    ].map((m) => m[1]!.toLowerCase());
    for (const t of titler) {
      assert.ok(!t.includes("some-byrå"), `${rute}: «${t}»`);
      assert.ok(!t.includes("sosiale medier byrå"), `${rute}: «${t}»`);
    }
  }
});

/**
 * MALEN I layout.tsx LEGGER PÅ «| Reflektor». En tittel som har det selv,
 * blir «… | Reflektor | Reflektor». Det sto på /en til 04.10.2026.
 */
test("ingen tittel har suffikset malen legger på", async () => {
  const { readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");

  const filer: string[] = [];
  const gaa = (k: string) => {
    for (const n of readdirSync(k)) {
      const sti = join(k, n);
      if (statSync(sti).isDirectory()) {
        if (n !== "api") gaa(sti);
      } else if (n === "page.tsx" || n === "layout.tsx") {
        filer.push(sti);
      }
    }
  };
  gaa("src/app");

  for (const fil of filer) {
    const kilde = readFileSync(fil, "utf8");
    for (const m of kilde.matchAll(/title:\s*"([^"]+)"/g)) {
      assert.ok(
        !m[1]!.includes("| Reflektor"),
        `${fil}: «${m[1]}» har suffikset malen legger på`,
      );
    }
  }
});
