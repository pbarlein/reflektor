/**
 * Hvor kom leadet fra? Lagt til 02.10.2026, skrevet om 03.10.2026.
 *
 * BAKGRUNN: Squarespace-siden hadde et skjult «Kilde»-felt i skjemaet som ble
 * fylt fra localStorage (`rfl_kilde`) med UTM-parametere, gclid/fbclid,
 * referrer og landingsside fra besøkendes FØRSTE sidevisning. Det fulgte hver
 * henvendelse, og var det eneste som sa hvilken annonse et lead kom fra.
 * Den nye siden manglet det ved cutover. Dette gjenoppretter det.
 *
 * HVA SOM BLE SKREVET OM 03.10.2026, OG HVORFOR.
 *
 * Et ekte lead ga denne teksten i e-posten og i HubSpot:
 *
 *   Kilde: source=ig | medium=social | content=link_in_bio |
 *   fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA8…(150+ tegn)
 *   || ref: https://l.instagram.com/ || landet paa: /
 *
 * Pål leser den på telefon. Han skal se hvor henvendelsen kom fra på under
 * et sekund, og i den teksten er svaret — Instagram, lenke i bio — begravd
 * mellom nøkkelnavn og en 150 tegn lang klikk-ID.
 *
 * To grep:
 *
 * 1. KLIKK-ID-ENE ER UTE. De er lange, de er maskinlesbare, og de sier
 *    ingenting til et menneske. `erMerket` kjenner dem fortsatt igjen, og
 *    etikettlogikken under bruker dem til å avgjøre at et besøk kom fra en
 *    annonse — de skrives bare ikke ut.
 *
 *    HVIS GCLID SKAL BRUKES SENERE, til offline konverteringsimport i Google
 *    Ads, må den lagres i et EGET felt i HubSpot. Den skal ikke tilbake inn
 *    i denne strengen: et felt et menneske leser og et felt en maskin leser
 *    er to forskjellige felt, og det var sammenblandingen som skapte
 *    problemet.
 *
 * 2. EN LESBAR ETIKETT STÅR FØRST. «Instagram (lenke i bio)», «Google Ads»,
 *    «Direkte». De rå verdiene følger etter, for den som vil ha dem.
 *
 * Resultatet for det samme leadet:
 *
 *   Instagram (lenke i bio) | source=ig | medium=social |
 *   content=link_in_bio | landet på: /
 *
 * Funksjonen er ren — ingen DOM, ingen lagring — så den kan testes uten
 * nettleser. Lagringen skjer i components/Kildefanger.tsx, og NØYAKTIG samme
 * streng går til både e-posten (lib/lead.ts) og `nettside_kilde` i HubSpot
 * (lib/hubspot.ts). Det er ett felt med én verdi, ikke to varianter som kan
 * gli fra hverandre.
 */

export const KILDE_NOKKEL = "rfl_kilde";

const UTM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/**
 * Klikk-ID-er fra annonseplattformene.
 *
 * De brukes til å KJENNE IGJEN et annonseklikk, og skrives aldri ut. Listen
 * er utvidet 03.10.2026 med ttclid (TikTok), li_fat_id (LinkedIn), igshid
 * (Instagram), _hsenc/_hsmi (HubSpot-e-post) og mc_eid (Mailchimp) — alle
 * dukker opp i lenker folk klikker på, alle er like uleselige.
 */
const KLIKK_ID = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "igshid",
  "_hsenc",
  "_hsmi",
  "mc_eid",
];

/** Klikk-ID-er som BARE finnes på et betalt Google-klikk. */
const GOOGLE_ADS_ID = ["gclid", "gbraid", "wbraid"];

/** Maks lengde per enkeltverdi. */
const MAKS_VERDI = 120;

function kort(verdi: string, maks = MAKS_VERDI): string {
  return verdi.length > maks ? `${verdi.slice(0, maks)}…` : verdi;
}

/** Har adressen et merke fra en kampanje eller et annonseklikk? */
export function erMerket(sok: string): boolean {
  const p = new URLSearchParams(sok);
  return [...UTM, ...KLIKK_ID].some((k) => p.get(k));
}

/**
 * Vertsnavnet i en referrer, uten `www.` og uten protokoll.
 *
 * Tåler søppel: en referrer er en streng fra nettleseren, og `new URL()`
 * kaster på alt som ikke er en adresse.
 */
function vertsnavnAv(referrer: string): string {
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Referreren uten spørrestreng, for visning.
 *
 * `https://l.instagram.com/?u=https%3A%2F%2F…&e=AT…` er 200 tegn der de 180
 * siste er sporing. Verten og stien er det som sier noe: «blogg.no/artikkel»
 * er nyttig, «?fbclid=…» er ikke.
 */
function refForVisning(referrer: string): string {
  try {
    const u = new URL(referrer);
    const sti = u.pathname === "/" ? "" : u.pathname;
    return kort(`${u.hostname.replace(/^www\./, "")}${sti}`, 80);
  } catch {
    return kort(referrer, 80);
  }
}

/** Betalt trafikk, slik plattformene selv merker den. */
const BETALT_MEDIUM = new Set([
  "cpc",
  "ppc",
  "paid",
  "paidsearch",
  "paid_search",
  "paid-search",
  "paidsocial",
  "paid_social",
  "paid-social",
  "cpm",
  "display",
  "retargeting",
]);

/**
 * Kjenner vi igjen kanalen? Hver oppføring har navnet Pål skal lese, hvilke
 * `utm_source`-verdier som peker på den, og hvilke vertsnavn.
 *
 * REKKEFØLGEN ER IKKE TILFELDIG. `l.instagram.com` inneholder «instagram»,
 * og `l.facebook.com` inneholder «facebook» — begge er omdirigeringsverter
 * plattformene sender klikk gjennom, og de treffer riktig oppføring fordi
 * sammenligningen er «slutter på».
 */
const KANALER: { navn: string; kilder: string[]; verter: string[] }[] = [
  {
    navn: "Instagram",
    kilder: ["ig", "instagram", "instagram.com"],
    verter: ["instagram.com", "l.instagram.com"],
  },
  {
    navn: "Facebook",
    kilder: ["fb", "facebook", "facebook.com", "meta"],
    verter: ["facebook.com", "m.facebook.com", "l.facebook.com", "fb.me"],
  },
  {
    navn: "LinkedIn",
    kilder: ["li", "linkedin", "linkedin.com"],
    verter: ["linkedin.com", "lnkd.in"],
  },
  {
    navn: "TikTok",
    kilder: ["tiktok", "tiktok.com"],
    verter: ["tiktok.com"],
  },
  {
    navn: "Google",
    kilder: ["google", "google.com"],
    verter: ["google.com", "google.no"],
  },
  {
    navn: "Bing",
    kilder: ["bing", "bing.com"],
    verter: ["bing.com"],
  },
];

function kanalFor(kilde: string, vert: string) {
  return KANALER.find(
    (k) =>
      (kilde && k.kilder.includes(kilde)) ||
      (vert && k.verter.some((v) => vert === v || vert.endsWith(`.${v}`))),
  );
}

/**
 * Etiketten, og hvilken kanal den kom fra.
 *
 * Kanalnavnet returneres ved siden av etiketten fordi den som setter sammen
 * strengen trenger å vite om referreren allerede er forklart. Står det
 * «Instagram» foran, er `ref: instagram.com` bare det samme en gang til.
 */
function etikettFor(
  p: URLSearchParams,
  vert: string,
): { etikett: string; kanal?: string } {
  const kilde = (p.get("utm_source") ?? "").trim().toLowerCase();
  const medium = (p.get("utm_medium") ?? "").trim().toLowerCase();
  const innhold = (p.get("utm_content") ?? "").trim().toLowerCase();
  const betalt = BETALT_MEDIUM.has(medium);
  const kanal = kanalFor(kilde, vert);

  /*
   * GOOGLE ADS FØRST. En gclid finnes bare på et betalt klikk, og den er
   * sikrere enn utm-merkingen: annonsøren kan skrive hva som helst i
   * `utm_source`, mens klikk-ID-en settes av Google selv.
   */
  if (
    GOOGLE_ADS_ID.some((k) => p.get(k)) ||
    (kanal?.navn === "Google" && betalt)
  ) {
    return { etikett: "Google Ads", kanal: "Google" };
  }

  /*
   * META-ANNONSE. En fbclid alene betyr bare at klikket kom fra Facebook
   * eller Instagram — organiske lenker i en bio har den også. Det er
   * kombinasjonen med et betalt medium som gjør den til en annonse.
   */
  if (medium.replace(/[-_]/g, "") === "paidsocial") {
    return { etikett: "Meta-annonse", kanal: kanal?.navn };
  }
  if (p.get("fbclid") && betalt) {
    return { etikett: "Meta-annonse", kanal: kanal?.navn };
  }
  if (p.get("msclkid")) {
    return { etikett: "Bing Ads", kanal: "Bing" };
  }

  if (kanal) {
    /*
     * SØK ELLER HENVISNING. Google og Bing uten betalt merking er et
     * organisk søketreff; de andre kanalene er sosiale, og der er «fra
     * Instagram» hele poenget.
     */
    if (kanal.navn === "Google" || kanal.navn === "Bing") {
      return { etikett: `${kanal.navn} søk`, kanal: kanal.navn };
    }
    /*
     * «lenke i bio» er den ene utm_content-verdien som forteller noe et
     * menneske bryr seg om: det er profilen, ikke et innlegg eller en
     * annonse. Den står i Reflektors egne lenker.
     */
    const bio = innhold === "link_in_bio" || innhold === "linkinbio";
    return {
      etikett: bio ? `${kanal.navn} (lenke i bio)` : kanal.navn,
      kanal: kanal.navn,
    };
  }

  const harUtm = UTM.some((k) => p.get(k));
  if (!harUtm && !vert) return { etikett: "Direkte" };

  /*
   * ALT ANNET. Kilden om den finnes, ellers verten det ble lenket fra.
   * «Annet:» uten noe etter er en etikett som ikke sier noe, og da er det
   * bedre å navngi nettstedet.
   */
  return { etikett: `Annet: ${kort(kilde || vert, 40)}` };
}

/**
 * Bygger kildestrengen.
 *
 *   Instagram (lenke i bio) | source=ig | medium=social | content=link_in_bio | landet på: /
 *
 * `vertsnavn` er vårt eget, og brukes til å skille en ekstern referrer fra
 * intern navigasjon.
 */
export function byggKilde(
  sok: string,
  referrer: string,
  vertsnavn: string,
  sti: string,
): string {
  const p = new URLSearchParams(sok);
  const ekstern = Boolean(referrer) && !referrer.includes(vertsnavn);
  const vert = ekstern ? vertsnavnAv(referrer) : "";

  const { etikett, kanal } = etikettFor(p, vert);

  const deler: string[] = [etikett];

  /*
   * DE RÅ UTM-VERDIENE, for den som vil etterprøve etiketten eller finne
   * igjen en bestemt kampanje. `utm_`-prefikset strippes — det står fem
   * ganger og sier ingenting.
   */
  for (const k of UTM) {
    const v = p.get(k);
    if (v) deler.push(`${k.replace("utm_", "")}=${kort(v)}`);
  }

  /*
   * REFERREREN BARE NÅR DEN SIER NOE NYTT. Står «Instagram» først, er
   * `ref: instagram.com` den samme opplysningen en gang til — og det var
   * nettopp gjentakelsene som gjorde den gamle strengen uleselig.
   */
  if (vert) {
    const vist = refForVisning(referrer);
    const forklart = kanal
      ? KANALER.find((k) => k.navn === kanal)?.verter.some(
          (v) => vert === v || vert.endsWith(`.${v}`),
        )
      : /*
         * «Annet: blogg.no» etterfulgt av «ref: blogg.no» er samme ord to
         * ganger. Står det en STI etter verten, sier referreren hvilken
         * artikkel som lenket — og det er noe nytt.
         */
        etikett === `Annet: ${kort(vert, 40)}` && vist === vert;
    if (!forklart) deler.push(`ref: ${vist}`);
  }

  deler.push(`landet på: ${kort(sti, 80)}`);

  return deler.join(" | ");
}

/**
 * Skal den nye kilden lagres? Ja hvis ingenting er lagret fra før, eller hvis
 * dette besøket kommer fra en kampanje eller et annonseklikk.
 */
export function skalLagres(lagret: string | null, sok: string): boolean {
  return !lagret || erMerket(sok);
}
