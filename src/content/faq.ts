import { slotsISeksjon } from "@/components/Slot";
import { front } from "@/content/sider/front";

/**
 * De nitten spørsmålene fra /faq på dagens reflektor.no.
 *
 * ORDRETT MIGRERT 16.09.2026, hentet fra sidens egen FAQPage-JSON-LD. Ikke
 * omskrevet, ikke forkortet, ikke slått sammen. Dette er Reflektors egen,
 * publiserte tekst — copy-protokollen er derfor ikke i veien for å bruke
 * den, men den er i veien for å ENDRE den. Skal en formulering justeres,
 * går den tilbake til Pål.
 *
 * HVORFOR SIDEN MÅTTE BYGGES: `/faq` er den største siden på dagens
 * reflektor.no målt i visninger (2 330, se kontekst.md). På den nye siden
 * var den en stubb med en overskrift og en TODO. Se A41 i vedlegg-a.md.
 *
 * DISSE ER IKKE SLOTS. Samme behandling som anmeldelsene i anmeldelser.ts:
 * de er publisert tekst, ikke copy under utarbeidelse, og skal ikke
 * gjennom slot-systemets tegngrenser. Grensene der er satt for forsidens
 * rytme; svarene her er 460–900 tegn fordi de skal besvare spørsmålet helt.
 *
 * TO FORHOLD SOM MÅ AVKLARES MED PÅL — begge er notert i A41 og er IKKE
 * rettet her, fordi begge er innholdsbeslutninger:
 *
 * 1. STILLBILDER — AVKLART 16.09.2026. Spørsmål 1, 4 og 11 sa at
 *    leveransen inneholder stillbilder, mens `tilbud.inngar` ikke nevnte
 *    dem. Pål har avgjort: stillbilder dekkes VED BEHOV, ikke som fast
 *    leveranse, og det er nettopp derfor 8–10 videoer er et produksjonsmål
 *    og ikke en garanti. Forsiden sier nå det samme — se
 *    `tilbud.stillbilder` i site.ts. FAQ-teksten er ikke endret; den var
 *    ikke feil, den manglet forbeholdet som nå står på forsiden.
 *
 * 2. OPPSIGELSESFRIST — AVKLART 16.09.2026. Spørsmål 17 sto med «kun
 *    ordinær oppsigelsesfrist», uten tall. AGENTS.md krever at tre måneder
 *    står eksplisitt. Pål: «legg til 3 måneder i FAQ». Gjort to steder i
 *    svar 17; ingenting annet i teksten er rørt.
 *
 * REKKEFØLGEN ER BEHOLDT fra dagens side. Den går fra definisjon til
 * avgrensning til pris til innvendinger til praktisk — altså fra «hva er
 * dette» til «bør vi». Den rekkefølgen er ikke tilfeldig, og jeg har ikke
 * hatt grunnlag for å mene at en annen er bedre.
 */
/**
 * KATEGORIEN ER LAGT TIL 17.09.2026 og endrer ingen tekst.
 *
 * Nitten spørsmål i én flat liste er ikke en FAQ, det er et arkiv. Ingen
 * leser nitten — man leter etter sitt eget. Gruppene gjør at man finner
 * det, og de gjør dessuten rekkefølgen til et argument: hva du får, hva
 * det koster, hva du får igjen, hvordan det foregår.
 *
 * Kategoriene er STRUKTUR, ikke redaksjon. Spørsmål og svar er uendret og
 * står fortsatt ordrett slik de gjør på dagens side.
 */
export type Faqkategori = "tjenesten" | "pris" | "resultater" | "praktisk";

export type FaqPunkt = {
  sporsmal: string;
  svar: string;
  kategori?: Faqkategori;
};

/** Rekkefølgen på siden. Navnene er overskrifter, ikke etiketter. */
export const faqKategorier: { id: Faqkategori; tittel: string }[] = [
  { id: "tjenesten", tittel: "Hva dere får" },
  { id: "pris", tittel: "Pris og vilkår" },
  { id: "resultater", tittel: "Resultater og måling" },
  { id: "praktisk", tittel: "Slik foregår det" },
];

export const faqSporsmal: FaqPunkt[] = [
  {
    sporsmal: "Hva er et SoMe-byrå?",
    svar: "Et SoMe-byrå tar ansvar for en bedrifts tilstedeværelse i sosiale medier: research, strategi, produksjon av innhold og publisering. Forskjellen fra et markedsføringsbyrå er at arbeidet er løpende og ikke kampanjebasert — det handler om å være til stede hver uke, ikke å lage én film i året. Abonnementet er Reflektors eneste løpende tjeneste. Hver måned kommer vi til dere med kamera, lys og kjøreplan, produserer film og stillbilder, og publiserer to ganger i uka på Instagram med krysspublisering til Facebook. Vi jobber med sosiale medier for bedrifter i hele Norge og holder til i Oslo. Prisen er fast: 30 000 kroner i måneden.",
    kategori: "tjenesten",
  },
  {
    sporsmal: "Hva er forskjellen på dere og et markedsføringsbyrå?",
    svar: "Et markedsføringsbyrå dekker bredt: strategi, annonsering, nettsider, design, kampanjer. De er bygget for å løse mange ulike oppgaver, og prises som regel per prosjekt eller per time. Vi gjør én ting, hver uke, til fast pris. Vi lager ikke kampanjer — vi bygger et innholdsarkiv og en jevn tilstedeværelse som går året rundt. Hva som passer best avhenger av hva dere mangler. Skal dere lansere noe stort, trenger dere et kampanjebyrå. Er problemet at profilen står stille mellom kampanjene, og at innhold alltid taper mot mer akutte oppgaver, er det problemet vi er bygget for. Mange bruker begge deler. Innholdet vi produserer kan gjenbrukes fritt i kampanjer og annonser, og tilpasses de formatene det skal inn i. Vi har erfaringer fra TV-reklamer for Vitus Apotek og innhold til alle skjermene til Anton Sport, så du kan være trygg på at kvaliteten tåler eksponering på alle flater.",
    kategori: "tjenesten",
  },
  {
    sporsmal: "Hvordan vet dere hva vi skal lage?",
    svar: "Vi gjør research før vi filmer noe. Vi går gjennom det dere allerede har publisert og måler hva som faktisk har fungert — hvilke formater, lengder og motiver som får rekkevidde. Et typisk grunnlag er rundt hundre publiseringer over fire måneder, målt median mot median. Funnene styrer hva vi produserer, ikke antakelser om hva som pleier å virke. Vi ser like mye på hva dere allerede kan. Fagartikler dere har skrevet, spørsmål kundene stiller igjen og igjen, ansatte som kan noe andre lurer på. Det sterkeste innholdet er som regel kunnskap dere allerede sitter på — filmet i stedet for skrevet. Resultatet er navngitte innholdsserier med konkrete filmer, ikke en liste med løse ideer.",
    kategori: "tjenesten",
  },
  {
    sporsmal: "Kan vi bruke innholdet til annet enn sosiale medier?",
    svar: "Ja. Materialet er produsert med en kvalitet som tåler langt mer enn feeden, og for mange er det den delen som gjør prisen enkel å forsvare. Alt leveres ikke automatisk i alle utsnitt og oppløsninger — men alt kan tilpasses, og vi kan produsere spesielt til et konkret formål. Vet dere at noe skal på skjerm i butikk, i en annonse, på nettsiden eller på trykk, sier dere fra i planleggingen. Da filmer og fotograferer vi for det på produksjonsdagen. Alt er tatt opp med kamera og fargekorrigert i etterarbeid. Ekte produkter, ekte mennesker, ekte lokaler. Vi bruker ikke generert innhold. Det blir billigere for hvert år som går, men det blir ikke mer troverdig. Over et år bygger dere opp et arkiv på rundt hundre filmer som er deres å bruke fritt — og råmaterialet ligger der om dere senere trenger noe i et annet format.",
    kategori: "tjenesten",
  },
  {
    sporsmal:
      "Hvorfor bare Instagram og Facebook — ikke TikTok eller LinkedIn?",
    svar: "Fordi vi heller gjør to kanaler ordentlig enn fire halvveis. Instagram og Facebook når bredest i Norge og fungerer for de fleste bransjer. Innholdet kan brukes på begge uten omarbeiding, noe som gjør at én produksjonsdag rekker til fire ukers publisering. Skulle vi lagt til TikTok og LinkedIn, ville hver kanal krevd egne formater, egen tone og egen redigering — samme pris, tynnere resultat overalt. Materialet er ikke låst til disse kanalene. Velger dere å bruke det andre steder, er det ingenting i veien for det — og trengs det et annet utsnitt, tilpasser vi det. Er LinkedIn den viktigste kanalen for deres marked, tilpasser vi produksjonen til dette formålet.",
    kategori: "tjenesten",
  },
  {
    sporsmal: "Hva er ikke inkludert?",
    svar: "Vi produserer og publiserer. Vi drifter ikke kontoen utover det. Konkret betyr det at vi ikke svarer på kommentarer eller meldinger, ikke liker eller kommenterer på vegne av dere, og ikke publiserer stories. Vi kjøper heller ikke annonser eller styrer annonsebudsjetter. Kommentarfeltet og innboksen beholder dere selv. Det er som regel også best: svar fra dere treffer riktigere enn svar fra et byrå, og det tar sjelden mye tid når innholdet allerede ligger der. Vi sier dette tydelig fordi «SoMe-byrå» betyr ulike ting hos ulike leverandører. Hos oss betyr det research, produksjon og publisering — gjort ordentlig, hver uke.",
    kategori: "tjenesten",
  },
  {
    sporsmal: "Hva koster det?",
    svar: "30 000 kroner per måned. Alt er inkludert, og prisen er den samme hver eneste måned. Hver måned får dere: én produksjonsdag hos dere, hos oss eller ute på lokasjon, med produsent og utstyr, 8–10 ferdige filmer klippet og fargekorrigert, teksting, og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Skal noe brukes til andre formål — skjerm i butikk, annonse, nettside eller trykk — tilpasser vi det eller produserer for det. Si fra i planleggingen, så er det med i kjøreplanen. Ingen timepriser, ingen etterfakturering, ingen tillegg for ekstra runder. Du får aldri en faktura du ikke visste kom. Vi oppgir prisen åpent fordi de fleste byråer ikke gjør det. Et fast beløp er lettere å budsjettere enn et estimat, og det gjør det mulig å sammenligne oss med alternativene før dere tar kontakt.",
    kategori: "pris",
  },
  {
    sporsmal: "Er 30 000 kroner i måneden mye eller lite?",
    svar: "Det avhenger av hva dere sammenligner med. Mot en enkeltproduksjon er det mye: en reklamefilm kan koste det samme én gang. Mot et helt år med innhold er det lite. 360 000 kroner gir rundt hundre ferdige filmer, over hundre publiseringer, løpende strategi — og et arkiv dere eier og kan bygge videre på. Den mest relevante sammenligningen er ofte en ansettelse. En fulltids SoMe-ansvarlig koster vesentlig mer enn dette når arbeidsgiveravgift, pensjon og feriepenger er regnet med — og vedkommende må fortsatt leie inn noen til å filme. Vi konkurrerer om det samme budsjettet som andre markedsføringstjenester. Forskjellen er at dette er den posten der dere vet nøyaktig hva som kommer ut i den andre enden, og hvor materialet kan brukes videre i alle de andre postene.",
    kategori: "pris",
  },
  {
    sporsmal: "Bør vi heller ansette en SoMe-ansvarlig selv?",
    svar: "For noen er det riktig. Trenger dere noen som også svarer i kommentarfeltet, publiserer stories daglig og er til stede i kanalene gjennom dagen, er ansettelse et bedre valg enn oss. Trenger dere først og fremst at det produseres og publiseres godt innhold jevnt, er regnestykket et annet. En ansatt SoMe-ansvarlig skal som regel beherske strategi, foto, video, klipping, fargekorrigering, tekst og publisering alene. Det er flere fagfelt, og de færreste er sterke i alle — resultatet blir ofte mobilinnhold laget mellom andre oppgaver. Hos oss får dere et produksjonsteam med profesjonelt utstyr, og slipper rekruttering, opplæring, sykefravær og ferieavvikling. Mange kombinerer: vi lager innholdet, dere håndterer dialogen.",
    kategori: "pris",
  },
  {
    sporsmal: "Hva om vi heller bruker pengene på annonsering?",
    svar: "Annonsering virker, men den slutter å virke i det sekundet dere skrur den av. Innholdet blir liggende og fortsetter å bygge kjennskap. De to konkurrerer heller ikke — de forsterker hverandre. Annonser trenger noe å annonsere med, og et annonsebudsjett uten godt materiale er dyrt. Materialet vi produserer kan brukes i betalte kanaler, og tilpasses formatet annonsen krever. Det er også en praktisk fordel i rekkefølgen. Organisk markedsføring i sosiale medier viser hvilke budskap som treffer før dere betaler for å spre dem. Tallene fra de organiske postene er et bedre beslutningsgrunnlag enn en hypotese, og de koster ingenting å samle inn.",
    kategori: "pris",
  },
  {
    sporsmal: "Hvilke resultater kan vi forvente?",
    svar: "Vi lover ikke tall, og vi anbefaler skepsis mot byråer som gjør det. Resultatene avhenger av bransje, utgangspunkt, hva dere selger og hvor kjent dere er fra før — ingen kan garantere en prosentvis vekst uten å kjenne alt dette. Målet vårt er å øke engasjementet og bygge merkevare over tid. Det er bevisst ikke formulert som et tall. Setter man et prosentmål på merkevarebygging for en bedrift man ikke har jobbet med ennå, gjetter man — og et byrå som styrer etter et engasjementstall, ender med å lage innhold som jager tallet fremfor å bygge merkevaren. Det vi garanterer er leveransen: 8–10 ferdige filmer i måneden som produksjonsmål, stillbilder, og publisering to ganger i uka gjennom hele året. Det er den delen vi faktisk kontrollerer, og den holder vi. Merkevare bygges over år, ikke måneder. Er dere ute etter målbar effekt på kort sikt, er annonsering et riktigere verktøy enn oss.",
    kategori: "resultater",
  },
  {
    sporsmal: "Hvor lang tid tar det før vi ser noe?",
    svar: "Regn med et halvår før dere kan bedømme det ordentlig. De første to månedene handler om å finne formen: hva som fungerer for akkurat deres publikum, hvilke formater som treffer, hvilken tone som kler dere. I den perioden er tallene ustabile, og det er normalt. Fra måned tre begynner mønstrene å vise seg, og vi justerer innholdet etter faktiske data i stedet for antakelser. Etter et halvår har dere over 50 publiseringer bak dere og et datagrunnlag som faktisk sier noe.",
    kategori: "resultater",
  },
  {
    sporsmal: "Får vi rapportering underveis?",
    svar: "Dere eier kontoene, så alle tall ligger åpent tilgjengelig for dere hele tiden i Metas egne verktøy: rekkevidde, hvor stor andel som ikke følger dere fra før, og hvilke poster som presterte best. Ingenting ligger bak vår innlogging. Hvert kvartal tar vi en kort gjennomgang sammen — rundt tjue minutter. Vi viser hva vi har sett i tallene, hva som har fungert, hva som ikke har det, og hva vi endrer fremover. Vi legger ikke opp til fast månedsrapportering. Tallene svinger mye fra uke til uke, og en rapport hver måned blir lett støy fremfor innsikt — det som betyr noe for merkevarebygging viser seg over kvartaler. Trenger dere en skriftlig rapport til internt bruk, lager vi den. Si fra hva dere må kunne vise, så tilpasser vi oss det.",
    kategori: "resultater",
  },
  {
    sporsmal: "Hvor mye tid må vi sette av?",
    svar: "Én produksjonsdag i måneden, pluss litt tid til å godkjenne innhold underveis. Produksjonsdagen planlegger vi sammen i god tid, og dere får kjøreplanen på forhånd, så forberedelsene er små og tydelige: hvem som skal være med, hvor vi filmer, hva som eventuelt må klargjøres. Selve dagen tar vanligvis noen timer, ikke hele arbeidsdagen. Resten gjør vi. Dere skal ikke lage innholdskalender, skrive manus, klippe eller huske å poste. Det eneste som kommer tilbake til dere mellom produksjonsdagene, er innhold til godkjenning — det tar noen minutter i uka. Kommentarer og meldinger håndterer dere selv, men det er sjelden mye arbeid.",
    kategori: "praktisk",
  },
  {
    sporsmal: "Trenger vi eget kamera eller utstyr?",
    svar: "Nei. Vi stiller med alt: kamera, objektiver, lys, lyd, stativ og kjøreplan. Dere trenger ikke kjøpe noe, leie noe eller ha noen med filmkompetanse internt. Dere stiller med dere selv, og med det som skal vises — produktene, lokalene, menneskene. Er det noe som må klargjøres eller bestilles før vi kommer, står det i kjøreplanen dere får på forhånd. All produksjon skjer med profesjonelt kamerautstyr og profesjonelle produsenter, og alt fargekorrigeres i etterarbeid. Dette er ikke mobilfilm satt sammen i etterkant — det er samme håndverk som brukes i reklamefilm, tilpasset formatene som fungerer i sosiale medier.",
    kategori: "praktisk",
  },
  {
    sporsmal:
      "Publiserer dere i ferier — og hva om produksjonsdagen må flyttes?",
    svar: "Ja, vi publiserer gjennom sommer, jul, påske og alle andre høytider. Innholdet produseres på forhånd, så publiseringen ruller to ganger i uka, 52 uker i året. De fleste bedrifter som styrer dette selv får et hull hver gang det er ferie eller travelt, og algoritmene straffer opphold. Må produksjonsdagen flyttes, finner vi en ny så fort det passer. Dere mister aldri en produksjonsdag — den flyttes. Sykdom, hektiske perioder og vær som ikke samarbeider skjer jevnlig, og vi planlegger med nok margin til at publiseringen går videre mens vi finner ny dato. Prisen løper som normalt, siden leveransen er den samme over tid.",
    kategori: "praktisk",
  },
  {
    sporsmal: "Er det bindingstid — og kan vi prøve først?",
    svar: "Ingen bindingstid, kun ordinær oppsigelsesfrist på tre måneder. Vi mener dere skal bli fordi arbeidet virker, ikke fordi en kontrakt hindrer dere i å gå. Vi selger derimot ikke prøvepakker eller enkeltoppdrag. Samarbeidet er løpende, fordi det er konsistensen som gir resultater — ett innhold gir sjelden effekt uansett hvor godt det er. I praksis fungerer de første månedene som en prøveperiode uansett: dere ser hvordan produksjonsdagen går, hvordan innholdet blir og hvordan det presterer, og kan si opp med tre måneders frist. Vil dere se hvordan vi tenker før dere bestemmer dere, lager vi et komplett strategiforslag gratis — med research på deres egne kanaler og konkrete innholdsserier, uten forpliktelser.",
    kategori: "pris",
  },
  {
    sporsmal: "Hvem eier innholdet?",
    svar: "Dere får full bruksrett til alt vi produserer, på ubestemt tid. Det gjelder nettside, annonser, skjermer i butikk, plakater, trykk, salgspresentasjoner og internt bruk — ingen begrensninger på antall visninger, kanaler eller tidsrom. Trenger dere et annet utsnitt, en annen oppløsning eller en versjon tilpasset et bestemt format, ordner vi det. Si fra hva det skal brukes til, så leverer vi deretter — det er ikke en tilleggstjeneste dere må forhandle om. Skulle et konkret oppdrag ha andre vilkår — for eksempel ved innleide skuespillere, lisensiert musikk eller lokasjoner med egne regler — sier vi fra om det på forhånd. Det er unntaket, ikke regelen.",
    kategori: "pris",
  },
  {
    sporsmal: "Kan dere levere mer enn 8–10 videoer i måneden?",
    svar: "Ja. Leveransen skalerer med antall produksjonsdager. Én produksjonsdag i måneden gir 8–10 ferdige videoer til 30 000 kr/mnd. Trenger dere mer, legger vi til flere produksjonsdager til samme pris per dag, og publiseringsfrekvensen økes tilsvarende. Har dere flere lokasjoner eller avdelinger, kan produksjonsdagene fordeles på ulike steder. Trenger dere flere varianter av åpningen på en video til testing i annonsering, lager vi det når det er et konkret behov.",
    kategori: "tjenesten",
  },
];

/**
 * De fire spørsmålene fra denne lista som ALSO skal stå på forsiden.
 *
 * Forsiden har seks egne, kortere svar i front.ts. De er godkjent copy,
 * skrevet for posisjonen rett før skjemaet, og de dekker: hva om det ikke
 * virker, hva må vi gjøre selv, hva koster det, vi har lite å vise fram,
 * hva er Reflektor, hvor fort kommer vi i gang.
 *
 * Det de IKKE dekker, er de to reelle alternativene en kunde veier oss mot,
 * og de to spørsmålene som avgjør om prisen føles forsvarlig. Pål:
 * forsiden er «både merkevaresiden og tjenestesiden som skal hente inn
 * trafikk til konvertering», og da må de stå der.
 *
 * VALGT, MED BEGRUNNELSE:
 *
 * - «Bør vi heller ansette en SoMe-ansvarlig selv?» — det største
 *   konkurrerende alternativet. En kunde som ikke får svar på dette,
 *   utsetter beslutningen.
 * - «Hva om vi heller bruker pengene på annonsering?» — det nest største.
 * - «Er 30 000 kroner i måneden mye eller lite?» — forsvarer tallet som
 *   står med 176 px rett over.
 * - «Hvilke resultater kan vi forvente?» — begynner med at vi ikke lover
 *   tall. Det er det mest tillitsbyggende avsnittet Reflektor har, og det
 *   hører hjemme der beslutningen tas.
 *
 * REFERANSE OG IKKE KOPI. Teksten ligger bare ett sted. Kopierte vi den
 * inn i front.ts, ville de to stedene kunne gli fra hverandre uten at noen
 * sjekk fanget det.
 */
export const forsidensTillegg = [
  "Bør vi heller ansette en SoMe-ansvarlig selv?",
  "Hva om vi heller bruker pengene på annonsering?",
  "Er 30 000 kroner i måneden mye eller lite?",
  "Hvilke resultater kan vi forvente?",
] as const;

/**
 * Slår opp et spørsmål ved navn. Kaster hvis det ikke finnes — en stille
 * `undefined` ville blitt et tomt trekkspill på forsiden, og den feilen
 * ville ingen oppdaget før en kunde klikket på den.
 */
export function hentFaq(sporsmal: string): FaqPunkt {
  const treff = faqSporsmal.find((p) => p.sporsmal === sporsmal);
  if (!treff) throw new Error(`Ukjent FAQ-spørsmål: «${sporsmal}»`);
  return treff;
}

/**
 * Forsidens ti spørsmål: de seks godkjente slot-svarene fra front.ts, så de
 * fire som hentes herfra.
 *
 * ÉN KILDE, TO FORBRUKERE. Både FAQ-seksjonen på forsiden og FAQPage-
 * markeringen i JSON-LD leser denne. Før lå sammensetningen i page.tsx og
 * markeringen bygde sin egen liste fra bare de seks slotsene — altså sa
 * siden ti spørsmål og markeringen seks. Det er den typen avvik ingen
 * oppdager, fordi det ene er usynlig.
 *
 * REKKEFØLGEN ER IKKE TILFELDIG. De seks først er skrevet for posisjonen
 * rett før skjemaet og er korte. De fire fra /faq er 640–900 tegn og
 * besvarer alternativene — de hører hjemme etter, ikke foran, fordi den som
 * bare skummer skal møte de korte først.
 *
 * Et slot uten godkjent tekst faller ut i stedet for å rendres som et tomt
 * trekkspill. Det skjuler ingenting: seksjonens slots står fortsatt i
 * front.ts og fanges av content:check.
 */
export const forsidensSporsmal: FaqPunkt[] = [
  ...slotsISeksjon(front, 6).flatMap((slot) => {
    if (!slot.verdi) return [];
    const [sporsmal, ...resten] = slot.verdi.split("|");
    return [{ sporsmal: sporsmal.trim(), svar: resten.join("|").trim() }];
  }),
  ...forsidensTillegg.map(hentFaq),
];
