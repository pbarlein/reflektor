import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import nextConfig from "../next.config.ts";

/**
 * Redirect-kartet.
 *
 * Testene her dekker prosjektets mest gjentatte feil. AGENTS.md advarer mot
 * den to ganger, og fila selv dokumenterer tre tilfeller: A40 (redirect til
 * en side som ikke fantes), A54 (ni bloggslugs uten innhold) og
 * /gratis-strategimote (oppført som live lenge etter at den var slettet).
 * Alle tre har samme form — «et kart som var riktig da det ble tegnet».
 *
 * Feilen er usynlig i bygget: Next godtar en 301 til hva som helst, og
 * hverken lint, tester eller lenkesjekk har hittil sett på dette kartet.
 * Det første som merker den er betalt trafikk som lander på en 404.
 *
 * To ting kan verifiseres uten nett, og begge gjøres her:
 *   1. ingen live annonseside er kilde i en redirect (regel 1)
 *   2. hvert mål finnes faktisk som rute
 *
 * Det som IKKE kan verifiseres her er om en kilde faktisk er død på dagens
 * side. Det krever et oppslag mot reflektor.no, og det må gjøres for hånd.
 */

/** Sidene det annonseres mot. Flyttes aldri. AGENTS.md, «Fire ting». */
const LIVE_ANNONSESIDER = [
  // /sosiale-medier-byra er tatt ut 02.10.2026: unntaket ble utført ved
  // cutover, og adressen 301-es nå til /. Se docs/cutover.md.
  "/innholdsproduksjon",
  "/reklamefilm",
  "/kontaktoss",
];

/**
 * `/takk` er hellig, og nå vet vi presis hvorfor.
 *
 * Lest ut av den publiserte GTM-containeren 27.09.2026: både GA4-hendelsen
 * `generate_lead` og Ads-konverteringen (11026823614) fyrer på én betingelse,
 * og den er ikke en hendelse fra koden vår. Den er:
 *
 *   sidesti === "/takk"  OG  referrer ~ /^https?:\/\/(www\.)?reflektor\.no\/(?!takk)/i
 *
 * `takk_page_view`, som TakkHendelse.tsx sender, har INGEN utløser som lytter
 * på den i containeren. Den er et ufarlig, men for tiden virkningsløst krok-
 * punkt. Det som faktisk bærer de 107+ konverteringene er stien og
 * referreren.
 *
 * Derfor er dette den farligste redirecten som kan legges inn: en 301 fra
 * /takk ville flyttet stien, og konverteringen ville stilnet uten at noe
 * annet på siden så galt ut. Verifisert i nettleser at referreren overlever
 * skjemaets POST → 303: /kontaktoss → /api/skjema → /takk beholder
 * /kontaktoss som referrer.
 */
const HELLIG = "/takk";

function ruter(): Set<string> {
  const rot = path.join(import.meta.dirname, "..", "src", "app");
  const funnet = new Set<string>();

  const gå = (katalog: string, sti: string) => {
    for (const navn of readdirSync(katalog)) {
      const full = path.join(katalog, navn);
      if (statSync(full).isDirectory()) {
        // Gruppemapper (foo) er ikke del av URL-en.
        gå(full, navn.startsWith("(") ? sti : `${sti}/${navn}`);
      } else if (navn === "page.tsx" || navn === "route.ts") {
        /*
         * `route.ts` TELLER OGSÅ SOM RUTE. Lagt til 02.10.2026, da
         * /blogg/rss.xml kom.
         *
         * Uten den besto testen bare ved et uhell: `/blogg/[slug]` er en
         * dynamisk rute, og jokeren nedenfor matchet /blogg/rss.xml som om
         * det var en artikkel. En feilstavet filnavn ville dermed gått
         * gjennom.
         */
        funnet.add(sti === "" ? "/" : sti);
      }
    }
  };

  gå(rot, "");
  return funnet;
}

async function kart() {
  assert.ok(nextConfig.redirects, "next.config.ts mangler redirects");
  return await nextConfig.redirects();
}

test("ingen live annonseside er kilde i en redirect", async () => {
  for (const r of await kart()) {
    assert.ok(
      !LIVE_ANNONSESIDER.includes(r.source),
      `${r.source} er en live side det annonseres mot og skal ikke ` +
        `omdirigeres. Se AGENTS.md, regel 1. Unntaket for ` +
        `/sosiale-medier-byra gjelder først ved cutover, og settes inn ` +
        `da — ikke før. Se docs/cutover.md.`,
    );
  }
});

/**
 * ET MÅL UTENFOR SIDEN ER IKKE EN RUTE HOS OSS. Lagt til 06.10.2026, da
 * /booking kom.
 *
 * Testene under sjekker at et mål finnes i src/app. En HubSpot-adresse gjør
 * aldri det, og en test som krever det ville tvunget fram enten en falsk
 * rute eller et unntak uten begrunnelse. At den eksterne adressen faktisk
 * svarer, kan bare kontrolleres med nett — det gjøres for hånd, slik regel
 * 1 i AGENTS.md krever for alle redirects.
 */
const utenfor = (mål: string) => /^https?:\/\//.test(mål);

test("hvert redirect-mål finnes som rute", async () => {
  const finnes = ruter();

  for (const r of await kart()) {
    if (utenfor(r.destination)) continue;
    const mål = r.destination.split(/[?#]/)[0];
    const dynamisk = [...finnes].some((rute) =>
      new RegExp(`^${rute.replace(/\[[^\]]+\]/g, "[^/]+")}$`).test(mål),
    );

    assert.ok(
      dynamisk,
      `${r.source} → ${r.destination}, men ${mål} finnes ikke som rute. ` +
        `En 301 til en side som ikke finnes er verre enn ingen redirect: ` +
        `den lover en etterfølger og leverer 404. Se A40.`,
    );
  }
});

test("ingen redirect peker til seg selv eller videre til en annen redirect", async () => {
  const alle = await kart();

  /*
   * BETINGEDE REDIRECTS ER IKKE LEDD I EN KJEDE. Lagt til 02.10.2026.
   *
   * `/blogg` er kilde i én redirect, men bare med `has: format=rss`.
   * `/blogg` uten parametere treffes ikke, så de seks døde bloggslugene som
   * peker dit lander på oversikten — ingen kjede. En kjedetest som ikke
   * skiller på dette melder en feil som ikke finnes, og en test som roper
   * ulv blir slått av.
   *
   * Det er nettopp `has` som gjør den redirecten trygg: uten den ville
   * oversikten vært flyttet, og den er en live side med organisk trafikk.
   */
  const ubetinget = new Map(
    alle.filter((r) => !("has" in r)).map((r) => [r.source, r.destination]),
  );

  for (const r of alle) {
    assert.notEqual(r.source, r.destination, `${r.source} omdirigerer til seg selv`);
  }

  for (const [kilde, mål] of ubetinget) {
    assert.ok(
      !ubetinget.has(mål),
      `${kilde} → ${mål}, men ${mål} omdirigerer videre til ` +
        `${ubetinget.get(mål)}. En kjede taper lenkeverdi og er unødvendig ` +
        `— pek ${kilde} rett på sluttmålet.`,
    );
  }
});

test("ingen kilde er oppført to ganger", async () => {
  const sett = new Map<string, string>();

  for (const r of await kart()) {
    const før = sett.get(r.source);
    assert.equal(
      før,
      undefined,
      `${r.source} er oppført to ganger: → ${før} og → ${r.destination}. ` +
        `Next bruker den første, så den andre er død kode som ser ` +
        `virksom ut.`,
    );
    sett.set(r.source, r.destination);
  }
});

test("/takk er aldri kilde i en redirect", async () => {
  for (const r of await kart()) {
    assert.notEqual(
      r.source,
      HELLIG,
      `${HELLIG} er kilde i en redirect til ${r.destination}. Det slår ut ` +
        `både GA4-hendelsen og Ads-konverteringen: begge fyrer på at stien ` +
        `ER /takk. 107+ historiske konverteringer henger på den. Se ` +
        `AGENTS.md, «Fire ting», punkt 2.`,
    );
  }
});

test("/takk finnes som rute", async () => {
  assert.ok(
    ruter().has(HELLIG),
    `${HELLIG} finnes ikke som rute. Uten den er det ingen sidevisning å ` +
      `måle, og Reflektor mister sin eneste KPI.`,
  );
});

/**
 * UNNTAKET FRA 301-REGELEN, med begrunnelse. Lagt til 06.10.2026.
 *
 * /booking peker på en HubSpot-adresse vi ikke eier. Byttes bookingsiden,
 * skal adressen kunne peke et annet sted samme dag — og en 301 ligger i
 * nettleserens cache lenge etter at vi har ombestemt oss. Adressen har
 * ingen søkeverdi å verne: den står i e-poster og meldinger, ikke i Google.
 *
 * REGELEN ELLERS STÅR UENDRET. Alt som peker innenfor siden skal være 301.
 */
const MIDLERTIDIGE = new Map<string, number>([["/booking", 302]]);

test("hver redirect er en eksplisitt 301", async () => {
  for (const r of await kart()) {
    const ventet = MIDLERTIDIGE.get(r.source) ?? 301;
    assert.equal(
      "permanent" in r,
      false,
      `${r.source} bruker \`permanent\`. Next oversetter det til 308, ikke ` +
        `301. Google behandler de to likt, men dagens Squarespace svarer 301 ` +
        `og all dokumentasjonen vår sier 301 — et byrå som kjører en ` +
        `redirect-sjekk skal ikke måtte lure på avviket. Bruk ` +
        `\`statusCode: 301\`.`,
    );
    assert.equal(
      (r as { statusCode?: number }).statusCode,
      ventet,
      `${r.source} har statusCode ${(r as { statusCode?: number }).statusCode}, ` +
        `ventet ${ventet}. Kartet skal være 301 hele veien, med de unntakene ` +
        `som står i MIDLERTIDIGE og hvorfor. Bestemt 27.09.2026.`,
    );
  }
});

/**
 * 404-ENE FRA SEARCH CONSOLE ETTER CUTOVER. Lagt til 02.10.2026.
 *
 * Search Console rapporterte 18 404-er på den nye siden dagen etter
 * cutover. Seksten var dekket av kartet. De to under var ikke, og begge er
 * kontrollert mot live før de ble lagt inn — begge svarer 404 — slik regel
 * 1 i AGENTS.md krever: «Sjekk at en URL faktisk er død før du legger inn
 * en redirect.»
 *
 * De står her og ikke bare i kartet fordi det er det eneste stedet som
 * sier HVORFOR de finnes. Fjerner noen en av dem, melder testen med
 * begrunnelsen i hånden.
 */
const SEARCH_CONSOLE_404 = [
  ["/produktfoto", "/innholdsproduksjon"],
  ["/gratis-strategimote-kontaktskjema", "/kontaktoss"],
] as const;

test("404-ene fra Search Console er dekket", async () => {
  const kilder = new Map((await kart()).map((r) => [r.source, r.destination]));

  for (const [kilde, mål] of SEARCH_CONSOLE_404) {
    assert.equal(
      kilder.get(kilde),
      mål,
      `${kilde} var en 404 i Search Console 02.10.2026 og skal 301-es til ` +
        `${mål}. Se begrunnelsen i next.config.ts.`,
    );
  }
});

/**
 * RSS-FEEDEN. Lagt til 02.10.2026.
 *
 * Squarespace serverte feeden på `/blogg?format=rss`. Testen holder på de to
 * tingene som gjør gjenopprettingen trygg: at betingelsen faktisk står der,
 * og at feeden finnes som rute.
 */
test("/blogg?format=rss går til feeden, og bare med betingelsen", async () => {
  const treff = (await kart()).filter((r) => r.source === "/blogg");

  assert.equal(treff.length, 1, "/blogg skal være kilde i presis én redirect");
  assert.equal(treff[0].destination, "/blogg/rss.xml");
  assert.deepEqual(
    (treff[0] as { has?: unknown[] }).has,
    [{ type: "query", key: "format", value: "rss" }],
    `/blogg er en live side med organisk trafikk. Uten \`has\` ville ` +
      `redirecten flyttet hele bloggoversikten — presis det regel 1 i ` +
      `AGENTS.md forbyr.`,
  );
  assert.ok(
    ruter().has("/blogg/rss.xml"),
    "/blogg/rss.xml finnes ikke som rute. Redirecten ville sendt " +
      "abonnentene fra en feed til en 404.",
  );
});

/**
 * INGEN REDIRECT SKAL PEKE PÅ EN OVERSIKTSSIDE. Lagt til 02.10.2026.
 *
 * Fem døde bloggadresser gikk til /blogg, fordi det var det Squarespace
 * gjorde. En 301 til en oversiktsside behandler Google i praksis som en myk
 * 404: målet svarer ikke på det den gamle adressen svarte på, og
 * lenkeverdien går tapt i stedet for å flytte seg.
 *
 * Testen er med vilje streng. Finner en senere gjennomgang en adresse uten
 * nær slektning, er oversikten fortsatt bedre enn en 404 — og da skal
 * unntaket skrives inn her, med begrunnelse, ikke sniklegges inn i kartet.
 *
 * /vart-arbeid STÅR IKKE I LISTA, og det er ikke en forglemmelse.
 * `/vrt-arbeid` → `/vart-arbeid` er en skrivefeilrettelse: kilden ER
 * oversiktssiden, bare uten å-en. Der er oversikten riktig mål, ikke en
 * nødløsning. Regelen gjelder døde artikler som sendes til en liste over
 * andre artikler.
 */
const OVERSIKTSSIDER = ["/blogg"];

test("ingen redirect peker på en oversiktsside", async () => {
  for (const r of await kart()) {
    assert.ok(
      !OVERSIKTSSIDER.includes(r.destination),
      `${r.source} → ${r.destination}. En 301 til en oversiktsside er i ` +
        `praksis en myk 404 for Google: målet svarer ikke på det kilden ` +
        `het. Pek den på nærmeste side etter tema, eller skriv unntaket ` +
        `inn i OVERSIKTSSIDER med en begrunnelse.`,
    );
  }
});

/* ──────────── /booking: OUTBOUND-MØTENE (06.10.2026) ────────────────── */

/**
 * Egen bookingadresse for outbound, bestilt 06.10.2026.
 *
 * Impact Motion får betalt per booket møte fra outbound. Fakturagrunnlaget
 * er avtalene som har gått inn i «Møte booket» med kilde «Outbound – Impact
 * Motion», og det er bookingsiden som setter den kilden. Peker /booking
 * feil, teller vi feil møter — derfor står adressen her og ikke bare i
 * kartet.
 *
 * DE TO INBOUND-ADRESSENE /book OG /mote ER IKKE KODE. De er Bulk Redirects
 * i Vercel, og skal ikke flyttes hit: en regel to steder er en regel ingen
 * vet hvilken av er den gjeldende.
 */
const BOOKING_OUTBOUND = "https://meetings-eu1.hubspot.com/reflektor/outbound";

test("/booking går til outbound-bookingsiden", async () => {
  const treff = (await kart()).filter((r) => r.source === "/booking");

  assert.equal(treff.length, 1, "/booking skal være kilde i presis én regel");
  assert.equal(treff[0].destination, BOOKING_OUTBOUND);
  assert.equal(
    (treff[0] as { statusCode?: number }).statusCode,
    302,
    `/booking skal være 302. Målet er en adresse vi ikke eier, og en 301 ` +
      `kan ikke tas tilbake fra nettleserens cache.`,
  );
});

/**
 * SKRÅSTREKEN HAR INGEN EGEN REGEL, OG SKAL IKKE HA DET.
 *
 * Next normaliserer /booking/ til /booking med en 308 før kartet i det
 * hele tatt leses, så en regel for /booking/ ville aldri fyrt. Målt på
 * produksjonsbygget 06.10.2026: /booking/?utm_source=instantly ender på
 * bookingsiden etter to hopp, med parameteren i behold.
 */
test("/booking/ har ingen egen regel", async () => {
  const kilder = new Set((await kart()).map((r) => r.source));
  assert.ok(
    !kilder.has("/booking/"),
    "/booking/ er lagt inn som egen regel. Next normaliserer skråstreken " +
      "først, så regelen er død kode som ser virksom ut.",
  );
});

/**
 * INGEN REGEL FØR /booking MÅ FANGE DEN. Next bruker den første som
 * matcher, så en joker lenger oppe ville gjort regelen død uten at noe
 * sa fra.
 */
test("ingen tidligere regel fanger /booking", async () => {
  const alle = await kart();
  const vår = alle.findIndex((r) => r.source === "/booking");
  assert.ok(vår >= 0, "/booking finnes ikke i kartet");

  for (const r of alle.slice(0, vår)) {
    /* Joker-segmenter: /tjenester/:rest+ og lignende. */
    const mønster = new RegExp(
      `^${r.source.replace(/:[^/]+\+/g, ".+").replace(/:[^/]+\*/g, ".*").replace(/:[^/]+/g, "[^/]+")}$`,
    );
    assert.ok(
      !mønster.test("/booking") && !mønster.test("/booking/"),
      `${r.source} står før /booking og fanger den. Da er /booking død kode.`,
    );
  }
});

/**
 * /book OG /mote SKAL IKKE FINNES I KODEN. De er Bulk Redirects i Vercel
 * og peker på inbound-bookingsiden. Legges de inn her også, finnes samme
 * regel to steder — og den ene av dem er usynlig for den som leser den
 * andre.
 */
test("/book og /mote er fortsatt ikke i kartet", async () => {
  const kilder = new Set((await kart()).map((r) => r.source));

  for (const sti of ["/book", "/mote"]) {
    assert.ok(
      !kilder.has(sti),
      `${sti} er lagt inn i next.config.ts. Den styres av Vercel Bulk ` +
        `Redirects, og to regler for samme adresse er verre enn én.`,
    );
  }
});
