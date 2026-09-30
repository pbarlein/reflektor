import { kr, tilbud } from "./site";

/**
 * Bloggartiklene, migrert fra Squarespace 21.09.2026.
 *
 * ORDRETT. Teksten er Reflektors egen publiserte copy, hentet fra
 * www.reflektor.no og flyttet uten en eneste endring i formuleringene.
 * Regel 3 i AGENTS.md: bloggen beholdes for lenkeverdien — ~481
 * refererende domener — og innholdet skal ikke styre arkitekturen. Da skal
 * det heller ikke skrives om for å passe den.
 *
 * ÅTTE ARTIKLER, IKKE SYTTEN. `bloggSlugs` i site.ts lister 17 slugs.
 * Målt mot levende side 19.09.2026 var 8 ekte artikler, 3 aliaser som
 * 301-er til en av de åtte, og 6 døde som 301-er til /blogg. Squarespace
 * svarer 200 på en soft-404 — den serverer bloggoversikten med oversiktens
 * egen title — så en sjekk på statuskode alene melder alle 17 som friske.
 * Se A54 i docs/vedlegg-a.md.
 *
 * DET SOM ER LAGT TIL, og ikke fantes i Squarespace:
 *
 * `lesVidere` er broen fra bred bloggtrafikk til smal kommersiell side.
 * Bloggen rangerer på ordene folk søker på først («some» 3 300, «reklame»
 * 2 200); tjenestesidene er der kjøpet skjer. Uten en lenke mellom dem er
 * trafikken verdiløs. Ankerteksten sier hva den andre siden ER — ankertekst
 * er et av de sterkeste interne relevanssignalene som finnes, og «les mer»
 * bærer null.
 *
 * `publisert` er den faktiske datoen fra Squarespace. Den er ikke pyntet.
 * Ferskhet er en siteringsfaktor — 83 % av AI-siteringer på kommersielle
 * søk går til sider oppdatert siste 12 måneder — men en dato vi flytter for
 * å se ferskere ut, er en usann påstand. Skal en artikkel bli fersk, må den
 * faktisk oppdateres.
 */

/**
 * En lenke INNE i et avsnitt.
 *
 * LAGT TIL 27.09.2026. Bakgrunnen er et funn, ikke en idé: sju av de ni
 * migrerte artiklene slutter med setningen «Les mer om abonnementet.» — uten
 * lenke. Flere har «Se våre tjenester for en oversikt over alt vi tilbyr» og
 * «Se hvordan du setter i gang og utfører en innholdsproduksjon». Teksten
 * inviterer til et klikk som ikke finnes. Lenkene lå i Squarespace-utgaven og
 * forsvant i migreringen, fordi migreringen tok brødteksten og ikke
 * markeringen.
 *
 * DETTE ER IKKE NY COPY. `frase` må stå ORDRETT i avsnittet, og ingenting
 * skrives om — det legges bare en lenke rundt ord som allerede er der.
 * Regelen i hodet på denne fila står: teksten er Reflektors egen, flyttet
 * uten en eneste endring i formuleringene. En `<a>` rundt eksisterende ord
 * endrer ingen formulering.
 *
 * HVORFOR DET BETYR NOE: artiklene er de eneste sidene på nettstedet med
 * organisk trafikk, og lenkene til tjenestesidene lå alle i én boks helt
 * nederst. En lenke i setningen der temaet faktisk nevnes blir både klikket
 * og vektet tyngre, og ankerteksten blir ordet leseren leste — ikke en
 * knappetekst. «innholdsproduksjon» rangerer på plass 11–12 med 14 444
 * visninger, og det er bloggartikkelen som ligger foran tjenestesiden.
 * Eksakt ankertekst fra artikkelen til siden er det billigste grepet som
 * finnes mot nettopp det.
 */
export type Innlenke = {
  /** Ordene lenken skal legges rundt. Må stå ordrett og bare én gang. */
  frase: string;
  sti: string;
};

/**
 * Ett bilde eller én film inne i en artikkel.
 *
 * LAGT TIL 29.09.2026, bestilt av Pål: «vær nøye med å bruke gode, relevante
 * eksempler på bilder og videoer i blogginnleggene. alt skal være pent, on
 * brand og visuelt moderne og tilfredsstillende.»
 *
 * Før dette hadde en artikkel ett toppbilde og deretter to tusen ord ren
 * tekst. De nye artiklene handler om noe Reflektor faktisk gjør, og da er
 * arbeidet selv det sterkeste argumentet — en setning om at en film leveres
 * i flere formater er svakere enn de filmene ved siden av hverandre.
 *
 * `lyd` velger avspiller på samme måte som på tjenestesidene: uten lyd blir
 * det dempet autospill i løkke (riktig for korte, visuelle klipp), med lyd
 * blir det en ekte avspiller med kontroller (riktig for intervjuer og
 * profilfilmer, der poenget er det som blir SAGT). Se `Referansefilmer` i
 * Tjenestemedier.tsx for hele begrunnelsen.
 */
export type Bloggmedie = {
  slag: "foto" | "film";
  /** Sti uten filendelse. Film leser .mp4 og .jpg, foto leser .jpg. */
  sti: string;
  alt: string;
  format: "16/9" | "4/5" | "9/16";
  /** Film med kontroller og lyd i stedet for dempet autospill. */
  lyd?: boolean;
  /** `object-position` for foto som ikke skal beskjæres i midten. */
  fokus?: string;
};

export type Blokk =
  | { type: "avsnitt"; tekst: string; lenker?: Innlenke[] }
  | { type: "overskrift"; niva: 2 | 3; tekst: string }
  | { type: "liste"; punkter: string[] }
  /**
   * Kildehenvisning med utgående lenke.
   *
   * Lagt til 21.09.2026 for artikler som regner på noe. En påstand med
   * kilde er ikke bare mer redelig — den er mer siterbar. Researchen er
   * entydig: «Unsupported claims rarely get cited by AI engines. If you
   * state a claim without linking to data, answer engines cannot verify it
   * and will prefer a competitor who cites specific numbers.» Og innhold
   * som selv siterer autoritative kilder bygger det forskerne kaller «a
   * web of mutual verification».
   *
   * De migrerte Squarespace-artiklene har ingen av disse. Det er en av
   * grunnene til at de rangerer på ordbokord og ikke på kjøpsintensjon.
   */
  /**
   * `nofollow` LAGT TIL 30.09.2026, da prisartikkelen fikk lenker til seks
   * konkurrenter. En vanlig lenke er en anbefaling og gir lenkekraft
   * videre; det er riktig for en offentlig kilde som SSB eller Skatteetaten,
   * og feil for et byrå vi konkurrerer med om de samme søkene.
   *
   * Byråmatch er unntaket blant sammenligningstjenestene: Reflektor er selv
   * oppført der, så den lenken er gjensidig og skal være vanlig.
   */
  | { type: "kilde"; tekst: string; url: string; nofollow?: boolean }
  /** Tabell. Sammenligningstabeller er blant de mest siterte formatene. */
  | { type: "tabell"; kolonner: string[]; rader: string[][] }
  /**
   * Ett eller to medier med felles bildetekst.
   *
   * MAKS TO, OG SAMME FORMAT I BEGGE. Begrensningen er ikke vilkårlig.
   * To rammer med ulikt sideforhold i samme rad får ulik høyde, og da
   * henger bildeteksten i løse lufta ved siden av et bilde som fortsetter
   * nedenfor den — nøyaktig den feilen formatraden på /kjeder måtte løses
   * for. Tre stående klipp i bredden blir 117 px hver på en telefon, og da
   * ser man ikke hva de viser.
   *
   * `kontroller()` under håndhever begge deler i byggetid.
   */
  | { type: "medier"; elementer: Bloggmedie[]; bildetekst?: string };

export type Bilde = { fil: string; alt: string; fokus?: string };

export type Artikkel = {
  slug: string;
  /**
   * Toppbilde, hentet fra Reflektors eget arbeid i public/arbeid/.
   *
   * VALGT REDAKSJONELT. Motivet skal si noe om temaet — ansatte i arbeid
   * over en artikkel om employer branding, en foredragsholder over en om
   * historiefortelling.
   *
   * ALT-TEKSTENE NAVNGIR INGEN, og er de samme som i arbeid.ts. Det er med
   * vilje: et bilde av en navngitt kunde over en artikkel om et fagfelt
   * ville antydet at kunden har kjøpt akkurat det, og det er en påstand vi
   * ikke kan belegge. Samme regel som arbeidsrutenettet følger.
   */
  bilde: Bilde;
  tittel: string;
  /**
   * Kortere variant, kun for <title>. Faller tilbake på `tittel`.
   *
   * Finnes fordi `tittel` OGSÅ er H1, og de to har ulike krav. En H1 kan
   * være lang og forklarende; et <title> blir kuttet av Google forbi rundt
   * 60 tegn, og malen legger på « | Reflektor» (12 tegn) i tillegg. Å korte
   * ned `tittel` for å berge <title> ville gjort overskriften dårligere
   * for å berge et felt ingen leser på siden.
   */
  metaTittel?: string;
  beskrivelse: string;
  /** ISO-dato fra Squarespace. Ikke pyntet. */
  publisert: string;
  /**
   * ISO-dato for siste reelle innholdsoppdatering. Utelates når det ikke
   * har skjedd noen.
   *
   * LAGT TIL 30.09.2026, da prisartikkelen fikk en pristabell for 2026.
   *
   * DEN ER IKKE PYNT, OG DEN SKAL IKKE BLI DET. Ferskhet er en
   * siteringsfaktor — 83 % av AI-siteringer på kommersielle søk går til
   * sider oppdatert siste tolv måneder — og nettopp derfor er fristelsen
   * til å flytte datoen uten å endre noe reell. Samme regel som for
   * `publisert`: en dato vi flytter for å se ferskere ut er en usann
   * påstand. Sett den bare når innholdet faktisk er endret.
   *
   * Den vises på siden OG som `dateModified` i markeringen. Google
   * krever at de to stemmer overens.
   */
  oppdatert?: string;
  blokker: Blokk[];
  /** Tjenestesiden artikkelen naturlig leder til. */
  lesVidere: { sti: string; tekst: string }[];
  /**
   * Håndskrevet FAQ, i tillegg til den som utledes av artikkelens egne
   * spørsmålsoverskrifter.
   *
   * REGELEN SOM GJØR AT DEN IKKE KANNIBALISERER: spørsmålet må være ett
   * INGEN tjenesteside og ingen post i /faq allerede eier. Kontrollert mot
   * alle 65 unike spørsmål på nettstedet før hvert ble skrevet.
   *
   * Det utelukker det åpenbare — «hva koster X» og «hvordan foregår en
   * produksjon» eies av tjenestesidene, «bør vi ansette selv» av /faq.
   * Det som står igjen er spørsmålene en leser sitter med ETTER
   * artikkelen, og som ingen kjøpsside har grunn til å stille.
   *
   * Broen er ikke spørsmålet, den er svaret: et ærlig svar på «bør vi
   * starte med én stor film eller flere små» ender av seg selv ved to
   * tjenestesider, uten å selge.
   *
   * BARE FIRE ARTIKLER HAR DETTE. De med bare ett eller to utledede par,
   * der tillegget gir mest. Å skrive ni ville vært å fylle en kvote.
   *
   * SYNLIG PÅ SIDEN, ikke bare i markeringen. Google krever at
   * FAQ-markering gjenspeiler innhold brukeren faktisk ser.
   */
  tilleggsfaq?: {
    sporsmal: string;
    svar: string;
    lenker?: { sti: string; tekst: string }[];
  }[];
};

/**
 * Lesetid i minutter, regnet ut — ikke skrevet.
 *
 * 200 ord i minuttet er det vanlige anslaget for voksne som leser sakprosa
 * på morsmålet. Tallet er grovt, og det er greit: forskjellen på «6 min» og
 * «7 min» betyr ingenting. Det som betyr noe er at en artikkel på 2 300 ord
 * ikke ser ut som en på 500.
 *
 * Regnet ut fordi et tall som skrives for hånd blir feil. Se bloggoversikten,
 * der «Åtte artikler» sto mens det var ni.
 */
export function lesetid(a: Artikkel): number {
  const ord = a.blokker.reduce((sum, b) => {
    if (b.type === "liste")
      return sum + b.punkter.join(" ").split(/\s+/).length;
    if (b.type === "tabell")
      return sum + b.rader.flat().join(" ").split(/\s+/).length;
    /*
     * MEDIER TELLER IKKE SOM ORD. Bildeteksten er tre-fire ord og ville
     * bare støyet i anslaget. Å la den falle gjennom til `b.tekst` under
     * ville dessuten kastet — blokken har ikke feltet.
     */
    if (b.type === "medier") return sum;
    return sum + b.tekst.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(ord / 200));
}

export const artikler: Artikkel[] = [
  {
    slug: "hva-koster-et-some-byra",
    bilde: {
      fil: "pa-vei",
      alt: "Fotograf med stativ, kamera og utstyrskoffert på vei til oppdrag",
    },
    tittel: "Hva koster et SoMe-byrå i Norge? Priser og prismodeller",
    metaTittel: "Hva koster et SoMe-byrå i Norge?",
    beskrivelse:
      "Hva koster det å sette bort sosiale medier? Hva prisen består av, sju spørsmål du bør stille før du signerer, og hva vi selv tar: 30 000 kr/mnd.",
    publisert: "2026-08-13",
    oppdatert: "2026-09-30",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "De fleste byråer oppgir ikke pris før du har vært i et møte. Det gjør det vanskelig å vite om et tilbud er dyrt eller billig. Her er hva prisen består av, hva du bør spørre om før du signerer, og hva vi selv tar.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvorfor er det så vanskelig å finne en pris?",
      },
      {
        type: "avsnitt",
        tekst:
          "«Drift av sosiale medier» kan bety svært forskjellige ting. I den ene enden av skalaen ligger noen ferdige innlegg satt opp i et publiseringsverktøy, uten at noen har vært ute og filmet. I den andre enden ligger strategi, egen produksjonsdag med fotograf, redigering og publisering. Begge deler selges som «sosiale medier».",
      },
      {
        type: "avsnitt",
        tekst:
          "Derfor sier månedsprisen alene lite. To tilbud på 15 000 kr i måneden kan inneholde helt ulikt arbeid.",
      },
      /*
       * PRISTABELLEN, lagt inn 30.09.2026. Copyen er levert ferdig av
       * Claude Chat og erstatter to avsnitt som bare hadde Byråmatch.
       *
       * ALLE SEKS PRISENE ER KONTROLLERT MOT BYRÅENES EGNE SIDER samme dag,
       * ikke tatt på tro:
       *
       *   Nettpakke    Mini 4 999 (1 post/uke, 1 plattform), Standard 9 999
       *                (2 poster/uke, 2 plattformer), Pluss fra 13 999.
       *                «899,- for innholdsproduksjon / mnd» står som eget
       *                tillegg — derfor «koster ekstra» i tabellen.
       *   Elevera      «3 000–5 000 kr/mnd: Strategi og rådgivning. Du lager
       *                og poster innholdet selv.» Egen pris fra 7 900.
       *   Ramora       «Skreddersydde retainere: fra omtrent 6 000 til
       *                60 000 kroner per måned. Faste pakker: fra 14 500.»
       *   Snille Tips  Pakken «Dominans» 59 990 kr/mnd, med «Full SoMe-drift
       *                på alle plattformer» som én av mange poster.
       *   Serotonic    «alt fra 10 000 til godt over 150 000 kroner i
       *                måneden».
       *   Byråmatch    Tallene sto allerede i artikkelen fra før.
       *
       * INGEN AV DEM ER RUNDET ELLER OMSKREVET. Der Chats copy og kilden
       * spriker, ville kilden vunnet — det gjorde de ikke her.
       *
       * LENKENE LIGGER SOM KILDEBLOKKER UNDER TABELLEN, ikke inne i
       * cellene. Tabellceller er rene strenger i denne modellen, og en
       * lenke i en celle ville krevd en egen celletype for fem lenker.
       * Kildeblokk under er dessuten mønsteret videoprisguiden allerede
       * bruker, og det holder tabellen lesbar på telefon.
       *
       * FEM AV SEKS HAR `nofollow`. Byråmatch er unntaket: Reflektor er
       * oppført der, så den lenken er gjensidig.
       */
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster det i det norske markedet i 2026?",
      },
      {
        type: "avsnitt",
        tekst:
          "Sammenligningstjenesten Byråmatch oppgir at norske byråer har priser fra rundt 6 000 kr i måneden til 30 000 kr for mer omfattende løsninger med profesjonell innholdsproduksjon. Vi er selv oppført der.",
      },
      {
        type: "avsnitt",
        tekst:
          "Vi har gått gjennom prisene som norske byråer oppgir åpent på nettsidene sine. Spennet er stort, men det følger et tydelig mønster. Prisen stiger med hvor mye av jobben byrået gjør selv, og særlig med om noen kommer ut og filmer.",
      },
      {
        type: "tabell",
        kolonner: [
          "Nivå",
          "Typisk pris per måned",
          "Hva du vanligvis får",
          "Eksempler med åpne priser",
        ],
        rader: [
          [
            "1. Rådgivning",
            "3 000–5 000 kr",
            "Strategi og sparring. Dere lager og poster innholdet selv.",
            "Elevera oppgir dette nivået i sin prisguide.",
          ],
          [
            "2. Publisering",
            "5 000–10 000 kr",
            "Faste innlegg på én eller to plattformer, laget av bilder og materiale dere har fra før. Ingen opptak.",
            "Nettpakke: 4 999 kr for ett innlegg i uka på én plattform, og 9 999 kr for to innlegg i uka på to plattformer. Innholdsproduksjon koster ekstra.",
          ],
          [
            "3. Drift med enkel produksjon",
            "10 000–20 000 kr",
            "Flere innlegg i uka, laget innhold, ofte svar på meldinger. Fotografering og video er begrenset eller kommer i tillegg.",
            "Elevera fra 7 900 kr (tre innlegg i uka, laget innhold og svar på meldinger). Nettpakke Pluss fra 13 999 kr. Ramora har faste pakker fra 14 500 kr.",
          ],
          [
            "4. Fast produksjon med video",
            "20 000–40 000 kr",
            "Faste opptaksdager, ferdig redigert video hver måned, strategi og publisering.",
            `Reflektor: ${kr(tilbud.prisPerManed)} kr/mnd for én produksjonsdag, ${tilbud.videoerPerManed} ferdige videoer og publisering ${tilbud.posterPerUke} ganger i uka.`,
          ],
          [
            "5. Ekstern markedsavdeling",
            "40 000 kr og mer",
            "Byrået fungerer som en del av markedsavdelingen: flere kanaler, kampanjer, annonsering og løpende produksjon.",
            "Ramora har retainere opp mot 60 000 kr. Snille Tips har en pakke med full drift på alle plattformer til 59 990 kr, som del av en bredere markedsføringspakke. Serotonic oppgir at prisene kan gå over 150 000 kr.",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Prisene er hentet fra byråenes nettsider 30. september 2026 og oppgitt slik byråene viser dem. Pakkene inneholder ulike ting, så sammenlign alltid hva som leveres, ikke bare prisen.",
      },
      {
        type: "kilde",
        tekst:
          "Byråmatchs oversikt over SoMe-byråer i Norge, der flere leverandører står ved siden av hverandre.",
        url: "https://www.xn--byrmatch-c0a.no/byra/sosiale-medier",
      },
      {
        type: "kilde",
        tekst:
          "Elevera oppgir 3 000–5 000 kr/mnd for strategi og rådgivning der kunden lager og poster selv, og egen pris fra 7 900 kr/mnd for publisering tre ganger i uka med innhold og svar på meldinger.",
        url: "https://elevera.no/blogg/sosiale-medier-bedrift-pris",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Nettpakkes pakkepriser: Mini 4 999 kr/mnd, Standard 9 999 kr/mnd og Pluss fra 13 999 kr/mnd. Innholdsproduksjon er oppgitt som et eget tillegg.",
        url: "https://nettpakke.no/some/",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Ramora oppgir skreddersydde retainere fra omtrent 6 000 til 60 000 kr per måned, og faste pakker fra 14 500 kr per måned.",
        url: "https://www.ramora.no/artikler-markedsforing-marketing-sosiale-medier/hva-koster-some-byra-oslo",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Snille Tips oppgir pakken «Dominans» til 59 990 kr/mnd, der full drift av sosiale medier på alle plattformer er én av flere leveranser.",
        url: "https://snilletips.no/priser/",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Serotonic oppgir et spenn fra 10 000 til godt over 150 000 kroner i måneden.",
        url: "https://serotonic.no/blogg/hva-koster-et-sosiale-medier-byra-i-norge-i-2026",
        nofollow: true,
      },
      { type: "overskrift", niva: 2, tekst: "Slik leser du tabellen" },
      {
        type: "avsnitt",
        tekst:
          "Det store hoppet skjer mellom nivå 3 og 4. Under 20 000 kr i måneden er det sjelden at noen kommer ut og filmer hos dere hver måned. Da blir innholdet laget av det dere har fra før, eller av det dere filmer selv. Over den grensen er det vanlig med faste opptaksdager.",
      },
      {
        type: "avsnitt",
        tekst:
          "Lav pris betyr ofte mer jobb for dere. På nivå 1 og 2 må noen i bedriften fortsatt skaffe bilder og video. Det er den delen de fleste bedrifter ikke får tid til.",
      },
      {
        type: "avsnitt",
        tekst:
          "Sjekk hva som er inkludert, ikke pakkenavnet. To pakker til 15 000 kr kan inneholde helt ulikt arbeid. Bruk spørsmålene lenger ned i artikkelen for å gjøre tilbudene sammenlignbare.",
      },
      {
        type: "avsnitt",
        tekst:
          "Video koster mer enn bilder, og det skal det gjøre. Filming, klipp og teksting tar tid. Vil du vite hva en enkelt videoproduksjon koster, har vi skrevet en egen guide.",
        lenker: [
          { frase: "en egen guide", sti: "/blogg/hva-koster-videoproduksjon" },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Fem ting som avgjør prisen" },
      {
        type: "liste",
        punkter: [
          "Opptak. Kommer byrået ut og filmer, og hvor mange dager i måneden? Dette er den største enkeltposten.",
          "Hvem produserer. Egne fotografer og redigerere, eller innleide frilansere per oppdrag?",
          "Volum. Hvor mange ferdig redigerte videoer og innlegg leveres per måned?",
          "Publisering. Hvor ofte publiseres det, og hvem gjør det?",
          "Omfang. Er strategi, rapportering, annonsering og kommentarfelt inkludert, eller kommer det i tillegg?",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Sju spørsmål å stille før du signerer",
      },
      {
        type: "liste",
        punkter: [
          "Hvor mange opptaksdager i måneden er inkludert?",
          "Hvor mange ferdig redigerte videoer får vi levert?",
          "Hvor ofte publiseres det, og hvem publiserer?",
          "Er det egne ansatte som filmer og redigerer?",
          "Hva er ikke inkludert i prisen?",
          "Kommer annonsebudsjett i tillegg?",
          "Hvor lang er bindingstiden?",
        ],
      },
      {
        type: "avsnitt",
        tekst: "Be om svarene skriftlig. Da blir tilbudene sammenlignbare.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva koster det hos Reflektor?" },
      {
        type: "avsnitt",
        tekst:
          "30 000 kr/mnd. Fast pris. Vi bruker ikke timepriser, og det kommer ikke tillegg for redigering, publisering eller møter.",
        lenker: [{ frase: "30 000 kr/mnd", sti: "/#pris" }],
      },
      { type: "avsnitt", tekst: "Dette inngår:" },
      {
        type: "liste",
        punkter: [
          "Produksjon av SoMe-strategi og produksjonsplaner.",
          "Én produksjonsdag per måned hos dere, hos oss eller ute på lokasjon.",
          "Produksjonsmål: 8–10 videoer ferdig redigert per måned.",
          "Publisering til Instagram 2 ganger per uke med krysspublisering til Facebook.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Vi håndterer ikke kommentarfelt, stories eller betalt annonsering. Det holder prisen fast og leveransen forutsigbar. Mer om hva som inngår står på siden om vårt sosiale medier-byrå i Oslo.",
      },
      { type: "overskrift", niva: 2, tekst: "To ting å ta med i regnestykket" },
      {
        type: "avsnitt",
        tekst:
          "Annonsebudsjett kommer i tillegg hos de fleste byråer. Regn det som en egen post når du setter budsjettet.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og prisen alene sier lite uten leveransen ved siden av. Et tilbud på 8 000 kr uten opptaksdag og et tilbud på 30 000 kr med månedlig produksjon er ikke to priser på samme tjeneste.",
      },
    ],
    lesVidere: [{ sti: "/", tekst: "Reflektors pris, oppgitt åpent" }],
    tilleggsfaq: [
      {
        sporsmal: "Hvorfor finnes det SoMe-pakker under 5 000 kr i måneden?",
        svar: "Fordi de ikke inneholder opptak. Pakker i det prisområdet består som regel av rådgivning, eller av publisering av bilder og materiale bedriften har fra før. Det kan fungere hvis dere allerede har mye godt innhold, men dere må skaffe det selv.",
      },
      {
        sporsmal:
          "Hva er en vanlig månedspris for SoMe-drift med videoproduksjon?",
        svar: `Blant norske byråer som oppgir prisene åpent, ligger pakker med faste opptaksdager og ferdig redigert video hver måned typisk på 20 000–40 000 kr. Hos Reflektor koster det ${kr(tilbud.prisPerManed)} kr/mnd for én produksjonsdag, ${tilbud.videoerPerManed} ferdige videoer og publisering ${tilbud.posterPerUke} ganger i uka.`,
      },
      {
        sporsmal:
          "Er det dyrere å bruke et SoMe-byrå i Oslo enn andre steder i Norge?",
        svar: "I prisene vi har sammenlignet ser vi ingen tydelig forskjell. Ramora i Oslo har retainere fra rundt 6 000 kr, og Elevera i Ålesund har pakker fra 7 900 kr. Det som styrer prisen er leveransen, særlig om byrået filmer hos dere, ikke hvor byrået holder til.",
      },
    ],
  },
  {
    slug: "markedsforing-i-sosiale-medier-some",
    bilde: {
      fil: "peppes1-1600",
      alt: "Gjest med pizzastykke foran et neonskilt",
      fokus: "center 30%",
    },
    tittel: "Markedsføring i sosiale medier",
    beskrivelse:
      "SoMe-markedsføring kan være et virkningsfullt verktøy for å tiltrekke målgruppen din. Dette forutsetter godt innhold som engasjerer kunden.",
    publisert: "2025-02-12",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Markedsføring i sosiale medier er avgjørende for å engasjere målgruppen din og skape oppmerksomhet rundt et nytt produkt eller en tjeneste som du tilbyr. Når du gjør SoMe-markedsføring, handler det om å produsere godt innhold, som er skreddersydd etter din målgruppe og som gir en underholdningsverdi eller leverer en informativ gevinst. Da oppleves det genuint. I denne artikkelen utforsker vi hvilke hensyn du bør ta når du gjør markedsføring på sosiale medier.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Markedsføring i sosiale medier (SoMe)",
      },
      {
        type: "avsnitt",
        tekst:
          "Sosiale medier er blitt nesten uvurderlige kanaler for markedsføring, hvor bedrifter og enkeltpersoner kan spre budskap, engasjere kunder og målgrupper, og selge sine produkter. Derfor har det også blitt enda viktigere å legge målrettede strategier for markedsføring på sosiale medier, som skiller seg ut fra de tradisjonelle metodene man tar i bruk når man vil fremme et produkt, tjeneste eller en nyhet. Det handler i stor grad om å skape innhold som er tilpasset målgruppen din og spre dette på de riktige kanalene og på nettsiden din.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er SoMe?" },
      {
        type: "avsnitt",
        tekst:
          "SoMe er forkortelsen for sosiale medier, som er kanaler vi bruker for å skape og spre innhold på nett. Sosiale medier er også kjennetegnet for å utgjøre sosiale nettverk hvor man kommuniserer med både venner, kjente og ukjente.",
      },
      /*
       * «LES OGSÅ» GJORT TIL EKTE LENKER 29.09.2026, godkjent av Pål.
       *
       * Tre steder i bloggen sto «Les også: …» som ren tekst. Lenkene lå i
       * Squarespace-utgaven og forsvant i migreringen, akkurat som de sju
       * «Les mer om abonnementet» gjorde — se Innlenke i hodet på fila.
       * Teksten inviterte til et klikk som ikke fantes.
       *
       * Manglende mellomrom etter kolon er rettet samtidig.
       */
      {
        type: "avsnitt",
        tekst: "Les også: Hvordan lykkes med innholdsproduksjon",
        lenker: [
          {
            frase: "Hvordan lykkes med innholdsproduksjon",
            sti: "/blogg/hva-er-innholdsproduksjon",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Stor rekkevidde på sosiale medier",
      },
      /*
       * FAKTAFEIL RETTET 29.09.2026, godkjent av Pål.
       *
       * Her sto: «Så mange som ni av ti nordmenn bruker sosiale medier hver
       * eneste dag. Ifølge undersøkelsen …» — altså 90 prosent, tilskrevet
       * en undersøkelse som aldri ble nevnt. SSBs Norsk mediebarometer 2025
       * sier 82 prosent. Tallet var overdrevet med åtte prosentpoeng.
       *
       * Samme avsnitt trakk fram X (tidligere Twitter) som en kanal
       * nordmenn er storbrukere av, og påsto at kvinner mellom 55 og 64 år
       * hadde økt mest. SSB fører X på 8–15 prosent i de yngste gruppene,
       * bruker aldersbåndet 55–66 og ikke 55–64, og kjønnsfordelingen
       * finnes ikke i den publiserte tabellen. Påstandene er derfor tatt ut,
       * ikke omformulert — en påstand vi ikke kan belegge, skal bort.
       *
       * Det som står nå er hentet ordrett fra kilden under.
       */
      {
        type: "avsnitt",
        tekst:
          "82 prosent av befolkningen bruker sosiale medier i løpet av en gjennomsnittsdag, og vi bruker i snitt 1 time og 55 minutter på dem. Bruken øker, og den øker i alle aldersgrupper. Blant 13–19-åringer er Snapchat og TikTok størst, mens Facebook fortsatt er den mest brukte kanalen i gruppene over 45 år. Det vil si at potensialet for å tiltrekke sin målgruppe, uansett om den er ung eller gammel, er stort — men at hvilken kanal du skal være i, avhenger helt av hvem du snakker til.",
      },
      {
        type: "kilde",
        tekst:
          "Tallene er fra Norsk mediebarometer 2025, Statistisk sentralbyrå.",
        url: "https://www.ssb.no/kultur-og-fritid/tids-og-mediebruk/statistikk/norsk-mediebarometer/artikler/dette-er-de-mest-populaere-sosiale-mediene",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Ulike metoder i forskjellige SoMe-kanaler",
      },
      {
        type: "avsnitt",
        tekst:
          "For at markedsføring i sosiale medier skal være kostnadseffektivt og fungere etter ønsket formål, gjelder det å gjøre et grundig forarbeid. Dette betyr at du må vite hvilken målgruppe du vil tiltrekke, inkludert hvilken kjøpsreise de er på og hva som tiltrekker dem.",
      },
      {
        type: "avsnitt",
        tekst:
          "Samtidig er det avgjørende å velge de riktige SoMe-kanalene for ditt produkt eller din tjeneste, og anerkjenne hvilke fordeler og begrensninger disse har. Sist, men ikke minst, gjelder det å ha et øye på hva konkurrentene gjør og hvordan du kan skille deg ut i mengden.",
      },
      { type: "overskrift", niva: 3, tekst: "Din målgruppe" },
      {
        type: "avsnitt",
        tekst:
          "Hvem er din målgruppe og hvilke behov har du? Og hvordan kan du innfri disse behovene? Svarene på disse spørsmålene har stor betydning for hvilket innhold du produserer. Du bør for eksempel tenke over alder, kjønn, bosted og ikke minst hvilken plattform de er tilbøyelige til å bruke.",
      },
      {
        type: "avsnitt",
        tekst:
          "Tenk også på kundereisen din. Kundenes behov varierer nemlig avhengig av hvilken fase de befinner seg i. Noen vet hva de har bruk for, men ikke hvilken løsning som kan løse utfordringen de står i. Andre vet ikke engang at de har et problem og da er det din jobb å gjøre dem oppmerksom på det. Når du vet hvilken fase de befinner seg i, kan du tilpasse innholdet du skal produsere.",
      },
      { type: "overskrift", niva: 3, tekst: "Kanalene" },
      {
        type: "avsnitt",
        tekst:
          "Det finnes mange ulike kanaler å velge mellom, og du bør velge den eller de kanalene som egner seg best til din virksomhet, produkt eller tjeneste, og målgruppe. Det er for eksempel flere unge som bruker Snapchat og TikTok, mens du kan favne bredere på Instagram og Facebook.",
      },
      {
        type: "avsnitt",
        tekst:
          "Bruk gjerne flere kanaler for å fenge flere og forskjellige mennesker – men sørg for å ha en strategi på plass for hver kanal. Du kan med fordel bruke mye av det samme innholdet på flere kanaler.",
      },
      {
        type: "avsnitt",
        tekst:
          "Sørg også for å lage og bruke en plan for hvor, når og hvordan du publiserer innhold. Jo mer konsekvent du er i publiseringen, desto mer forutsigelig blir det for algoritmene i søkemotoren eller appen å registrere og lese innholdet ditt. Dette betyr at innholdet blir anerkjent som verdifullt eller viktig av algoritmene, og dermed blir det spredt til de rette mottakerne, nemlig din målgruppe som du har skreddersydd innholdet etter.",
      },
      { type: "overskrift", niva: 3, tekst: "Konkurransen" },
      {
        type: "avsnitt",
        tekst:
          "Hva gjør konkurrentene på markedet? Er de til stede på sosiale medier, og har de en stor skare av følgere? I så fall bør du vurdere hva de gjør godt og hvordan de skaper engasjement hos målgruppen dere har til felles. Dette er avgjørende informasjon, som du bruker for å kartlegge hvilket behov målgruppen har og ikke minst bruker for å skille deg ut blant flokken og tilby noe som konkurrentene ikke gjør.",
      },
      /*
       * PEKER PÅ DEN KANONISKE ARTIKKELEN, ikke på «inbound marketing».
       * `/blogg/hva-er-inbound-marketing` er en av de seks døde slugene og
       * 301-es til denne. En intern lenke til en adresse vi selv
       * omdirigerer, er et unødvendig hopp vi kan unngå ved å peke rett.
       */
      {
        type: "avsnitt",
        tekst: "Les også: Hva innebærer inbound marketing?",
        lenker: [
          {
            frase: "Hva innebærer inbound marketing?",
            sti: "/blogg/hva-er-innholdsmarkedsforing",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Regler for markedsføring på sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "Som du sikkert forstår nå, er det stort potensial for markedsføring av tjenester eller produkter på sosiale medier. Men det krever også at du etterlever de retningslinjer som finnes for reklame på SoMe-kanaler. Markedsføringsloven, som regulerer hvordan bedrifter markedsfører produkter og har til hensikt å beskytte forbrukernes interesser, legger disse retningslinjene sammen med kringkastingsloven. Dermed er det et klart regelverk for hvordan dette skal gjøres, slik at forbrukere ikke blir påvirket til å gjøre et lite gunstig kjøp eller får misvisende informasjon.",
      },
      { type: "overskrift", niva: 2, tekst: "Ingen skjult reklame i SoMe" },
      {
        type: "avsnitt",
        tekst:
          "Skjult reklame er ulovlig i sosiale medier. Her blir vi eksponert for mye informasjon, og det er derfor viktig at alle aktører er bevisste på hvordan de markedsfører produkter eller tjenester i SoMe. Loven tilsier at alle forbrukere har krav på å vite når de blir utsatt for reklame – og derfor er avgjørende å merke alle former for reklame i sosiale medier.",
      },
      /*
       * FIRE FORELDRELØSE BILDETEKSTER FJERNET 29.09.2026, godkjent av Pål.
       *
       * Squarespace-utgaven hadde bilder med tekst under. Migreringen tok
       * brødteksten, ikke bildene — og bildetekstene ble stående igjen som
       * løsrevne avsnitt midt i artikkelen. De leste som påstander uten
       * sammenheng, og én av dem («Dette er kun et eksempel …») viste til
       * et eksempel som ikke lenger fantes noe sted.
       *
       * De er fjernet og ikke erstattet: de sa ingenting teksten rundt ikke
       * allerede sier, og å skrive ny copy i deres sted ville brutt
       * copy-protokollen.
       */
      { type: "overskrift", niva: 2, tekst: "Merking av annonser" },
      {
        type: "avsnitt",
        tekst:
          "Forbrukertilsynet veileder hvordan man merker annonser og unngår å bli felt for skjult reklame.",
      },
      { type: "overskrift", niva: 3, tekst: "Hva skal merkes?" },
      {
        type: "avsnitt",
        tekst:
          "Alt innhold som kan være en form for betaling for positiv omtale, skal merkes. Dette gjelder for eksempel i følgende situasjoner:",
      },
      {
        type: "liste",
        punkter: [
          "En influenser eller blogger får betalt for å omtale produktet eller tjenesten",
          "Vedkommende får låne produktet eller tjenesten",
          "Vedkommende mottar et produkt eller tjeneste gratis",
          "Personen gjør egenreklame, altså fremmer en tjeneste eller et produkt som vedkommende eier eller driver",
        ],
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Hvordan merker man annonser på sosiale medier?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alt innhold som fremmer et salg av et produkt eller en tjeneste, må merkes som «reklame» eller «annonse». Dette må fremgå veldig tydelig og synlig.",
      },
      {
        type: "avsnitt",
        tekst: "Les også: Hva gjør en innholdsprodusent?",
        lenker: [
          {
            frase: "Hva gjør en innholdsprodusent?",
            sti: "/blogg/hva-gjr-en-innholdsprodusent",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Våre beste råd til SoMe-markedsføring",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Produsere innhold som fenger din målgruppe",
      },
      {
        type: "avsnitt",
        tekst:
          "Innhold er nøkkelen til å gjøre det godt på sosiale medier. Dette kan du ikke løpe fra. Derfor kan det lønne seg å jobbe sammen med innholdsprodusenter som vet hva godt innhold er. Og hva anses som godt innhold? Det er tekst, bilder og videoer som engasjerer målgruppen din. Skal du tiltrekke potensielle kunder, må du vekke deres entusiasme og sørge for at produktet eller tjenesten din bidrar til å innfri et av deres behov.",
        lenker: [{ frase: "innholdsprodusenter", sti: "/innholdsproduksjon" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Det er viktig at innholdet oppleves genuint, selv om du har kommersielle motiver og i bunn og grunn ønsker å selge noe til målgruppen din. Derfor er det viktig at innholdet har en høy underholdningsverdi eller leverer verdifull informasjon. Dermed opplever den potensielle kunden at den får noe verdifullt selv om den faktisk ikke har kjøpt noe. Og dette kan forhåpentligvis pushe personen til å faktisk kjøpe produktet ditt eller benytte seg av tjenesten din i siste ende.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Ha en helhetlig tilnærming til innholdet ditt",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdet du produserer på sosiale medier, bør være bærekraftig. Nei, det betyr ikke at det må være miljøvennlig, men gjerne at den kan gjenbrukes. La oss si at du lager en video for å promotere et nytt produkt. Kanskje har du fått hjelp av en profesjonell eventvideograf, og du sitter igjen med en engasjerende, kort video som informerer om produktlanseringen og viser engasjementet rundt det nye produktet. Dette er gull verdt – og bør derfor ikke forbeholdes til kun et innlegg på Instagram.",
      },
      {
        type: "avsnitt",
        tekst:
          "Push videoen i en betalt annonse på nettsiden din, spre den på LinkedIn og andre sosiale medier, og publiser den på dine viktigste landingssider. Å bruke SoMe-innhold på nettsiden din er kjempeviktig for å skape et oppdatert digitalt butikkvindu, der potensielle kunder kan oppdage din bedrift og dine produkter. Og ikke minst som du kan lenke til og fra dine sosiale medier. Da bygger du samtidig din organiske synlighet og åpner opp for å få høyere plasseringer i søkemotoren. Dermed får du hentet ut all verdi du kan få fra et stykke innhold.",
      },
      {
        type: "avsnitt",
        tekst:
          "Jobber du aktivt med innhold som er tilpasset målgruppen din, kan du lykkes med SoMe-markedsføring.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Kombinasjon av organisk og betalt markedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Som vi har vært inne på, gjelder det å bruke innholdet på flere kanaler, og dette gjelder også når du velger hvilke verktøy for å spre innholdet med. Vi anbefaler alltid at du har en oppdatert SEO-strategi, der du jobber aktivt med organisk innhold på nettsiden din, som sikrer høye plasseringer på Google og flere organiske besøk til nettsiden din.",
      },
      {
        type: "avsnitt",
        tekst:
          "Når det er sagt, kan det være fint å pushe en video fra en produktlansering som en betalt annonse også. Med en annonse på Instagram eller Facebook, blir du synlig for de riktige menneskene, på det riktige tidspunktet. Bruk gjerne innsikt fra annonsen til å vurdere hvor mye engasjement videoen får og deretter revidere hvordan du formidler kampanjen i både organisk og betalt innhold.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Være konsekvent med innholdsproduksjonen",
      },
      {
        type: "avsnitt",
        tekst:
          "Produser innhold støtt og stadig og engasjer målgruppen din på sosiale medier jevnlig. Et sentralt punkt i SoMe-markedsføring, er å bygge opp et fellesskap blant følgerne dine samtidig som du tiltrekker nye følgere. Dette oppnår du ved å produsere nytt innhold støtt og stadig, og lage innhold som engasjerer målgruppen din.",
      },
      {
        type: "avsnitt",
        tekst:
          /*
           * FAKTAFEIL RETTET 29.09.2026, godkjent av Pål.
           *
           * Her sto «for eksempel 4:5 som tilsvarer Reels på Instagram og
           * poster på TikTok». Begge var feil: Reels er 9:16 (1080 × 1920),
           * TikTok er 9:16, og 4:5 (1080 × 1350) er stående innlegg i
           * feeden. Kontrollert mot Figma, Adobe og Hootsuite 29.09.2026.
           *
           * Feilen var dyrere enn en vanlig faktafeil: Reflektors egne
           * tjenestesider sier «Videoene leveres stående i 9:16», så
           * bloggen motsa salgssiden på selskapets kjernekompetanse — og
           * formatspørsmål er nettopp det en kjøper bruker for å vurdere om
           * et byrå kan faget.
           */
          "Her er det dessuten viktig å lage videoer og bilder som er tilpasset smarttelefoner. Dette betyr blant annet at formatet på innholdet passer til skjermen på enheten: 9:16 for Reels på Instagram og for video på TikTok, og 4:5 for stående innlegg i Instagram-feeden. Tenk også på dette hvis du publiserer innhold på nettsiden din, da mange potensielle kunder bruker mobilen når de surfer på nettet.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Skap innhold som engasjerer på sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "Hos Reflektor kan du hente uvurderlig hjelp fra innholdsprodusenter med lang erfaring innen foto og video. Våre fotografer fanger de riktige salgsutløsende øyeblikkene, mens våre videografer produserer videoer som fanger hva bilder ikke gjør, nemlig det levende elementet ved din bedrift eller ditt produkt og tjeneste. Tilgangen på godt innhold er bare et klikk unna!",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    lesVidere: [{ sti: "/", tekst: "sosiale medier til fast månedspris" }],
  },
  {
    slug: "hva-er-innholdsproduksjon",
    bilde: {
      fil: "popup-arbeid-1800",
      alt: "To personer bak disken i en popup-butikk",
    },
    tittel: "Hva er innholdsproduksjon?",
    beskrivelse:
      "Innholdsproduksjon er å lage tekst, bilder og videoer som tiltrekker og engasjerer en målgruppe. Det kan være nøkkelen til suksess for flere bedrifter.",
    publisert: "2024-08-09",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Innholdsproduksjon er en strategisk tilnærming til markedsføring hvor man skaper relevante og verdifulle tekster, bilder og videoer. Den er rettet mot en bestemt målgruppe og distribueres i en rekke kanaler, men oftest på egen nettside og sosiale medier. Det er en sentral del av de fleste digitale markedsføringsstrategiene, der innholdet legger grunnlaget for at man kan tiltrekke og engasjere kunder. Derfor er det viktig å ha et overblikk over hva innholdsproduksjon faktisk innebærer i praksis – og det får du svar på her!",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er innholdsproduksjon?" },
      {
        type: "avsnitt",
        tekst:
          "Innholdsproduksjon er en strategisk innsats der man produserer relevant og engasjerende innhold til målgruppen sin. Det er et viktig ledd i innholdsmarkedsføring og handler om å lage og spre godt innhold som oppleves nyttig for målgruppen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Definisjon på innholdsproduksjon",
      },
      {
        type: "avsnitt",
        tekst:
          "Man kan definere innholdsproduksjon som en målrettet prosess der man skaper bilder, video, infografikk og tekst som man deler på forskjellige kanaler. Man bruker innholdet aktivt for å etablere en forbindelse med målgruppen sin. Innholdet legger dessuten grunnlaget for økt synlighet og engasjement. Følgelig er dette et svært viktig markedsføringsaspekt, og flere er interessert i sertifisering, kurs eller utdanning innen innholdsproduksjon for å nå bedre ut til sin målgruppe.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er godt innhold?" },
      {
        type: "avsnitt",
        tekst:
          "Godt innhold må skille seg ut, være unikt og gjerne etterlate et varig inntrykk hos publikum. Du lykkes med innholdsproduksjonen hvis innholdet er av høy kvalitet og det oppleves som hjelpsomt av den relevante målgruppen. For eksempel må produksjonen av blogginnlegg gi god innsikt i emnet eller bransjen, og videoen du deler på sosiale medier må ha høy underholdningsverdi. I tillegg til å inspirere, skal det også aktivere målgruppen, for eksempel ved at de blir bevisste om aktuell aksjon eller foretar et kjøp av et produkt eller tjeneste.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva er formålet bak innholdsproduksjonen?",
      },
      {
        type: "avsnitt",
        tekst:
          "Formålet med innholdsproduksjonen er å tiltrekke, engasjere og beholde publikum, i tillegg til å stadfeste tilstedeværelse på markedet. Bedrifter bruker innholdet strategisk til å innhente trafikk, øke sin digitale synlighet og bygge opp et stort publikum. Ofte brukes innholdet på sin egen nettside, hvor bedrifter velger å bygge opp et innholdsunivers. I innholdsuniverset publiserer man som regel blogginnlegg som går i dybden på ulike emner innenfor bransjen. Disse bruker man til å støtte opp om tjeneste- eller produktutvalget til bedriften, som samlet sett gir bedriften større troverdighet og autoritet.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Hvorfor avsetter bedrifter tid til innholdsproduksjon?",
      },
      {
        type: "avsnitt",
        tekst:
          "Bedrifter ser stort potensial i å bruke innholdsproduksjon som et ledd i sin digitale markedsføringsstrategi, der man kan bygge opp merkevaren og bygge tillitvekkende relasjoner til eksisterende og potensielle kunder gjennom innholdet man produserer. Godt innhold gjør det mulig for bedriften å stadfeste sin autoritet på markedet og formidle sin ekspertise innenfor feltet. Et innholdsunivers blir derfor en naturlig arena hvor man kan demonstrere sin faglighet gjennom ekspertuttalelser og erfaringer.",
        // EKSAKT ANKERTEKST, og det er hele poenget her. «innholdsproduksjon» har
        // 14 444 visninger på plass 11–12, og denne artikkelen ligger foran
        // tjenestesiden på ordet. Lenken peker autoriteten dit kjøpet skjer.
        lenker: [{ frase: "innholdsproduksjon", sti: "/innholdsproduksjon" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Dominerer du innenfor ditt felt, opptar du ikke bare store markedsandeler, men du signaliserer at du vet hva du snakker om. Dette øker kundelojaliteten, fordi du skiller deg ut i mengden og øker sannsynligheten for at potensielle kunder velger deg framfor en av konkurrentene dine. Innholdet fremstår troverdig og de besøkende stoler på deg, som øker sjansen for at de velger å kjøpe noe av deg.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva betyr det egentlig å produsere innhold?",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdsproduksjon er en ressurskrevende og omfattende prosess, fordi man er avhengig av å tilpasse innholdet etter målgruppen sin. Det er avgjørende at det rette publikummet opplever innholdet som verdifullt. De lar seg kun engasjere hvis innholdet oppfyller deres forutbestemte oppfatninger av hva de trenger. Innfrir du på deres ønsker, finner du også nøkkelen til hvordan innholdet gir forretningsutslag. Derfor sier man også at godt innhold er unikt, nyttig og interaktivt. Innhold som ikke er tilpasset målgruppen og deres ønsker og krav, er dårlig innhold og vil verken prestere eller innfri kundenes ønsker.",
      },
      {
        type: "avsnitt",
        tekst:
          "Husk! Det er også viktig at innholdet fremstår autentisk. Folk kan gjennomskue hvis innholdet er primært produsert for å promotere bedriften og deres produkter eller tjenester.",
      },
      { type: "overskrift", niva: 2, tekst: "Digital innholdsproduksjon" },
      {
        type: "avsnitt",
        tekst:
          "I dag foregår innholdsproduksjonen ofte digitalt. Man sprer budskapet sitt på digitale plattformer og engasjerer kunder og interessenter på sosiale medier. Det er en arena hvor folk har store krav, der det finnes en større tilgang på pålitelig informasjon og hvor forbrukere er smartere. Derfor handler digital innholdsproduksjon om å levere kvalitetsinnhold som oppfattes som hjelpsomt.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Bruksområder til digital innholdsproduksjon",
      },
      {
        type: "avsnitt",
        tekst:
          "Digitalt innhold kommer i forskjellige formater og kan brukes på ulike kanaler. Utforsk de ulike formene innholdet kan ta i listen nedenfor:",
      },
      { type: "overskrift", niva: 3, tekst: "Formater:" },
      {
        type: "liste",
        punkter: [
          "Blogginnlegg: Del den ekspertisen og erfaringen du har i blogginnlegg som du publiserer på egen nettside og kobler sammen med tjenestene eller produktet du selger.",
          "Innlegg i sosiale medier: Del nyheter, bilder og videoer av underholdningsverdi, og skap et fellesskap med følgerne og kundene dine.",
          "Infografikk: Grafiske fremstillinger er en presis måte å formidle et budskap, som du også kan bruke i blogginnlegg og sosiale medier.",
          "E-bøker, white papers og artikler: Alle disse formatene fremstår profesjonelle, i tillegg til at det er morsomt å jobbe med, fordi du kan dypdykke i emner og dele kunnskap. Kombiner skriftlig og visuelt innhold og del innholdet digitalt og fysisk.",
          "Video: Et ressurskrevende format som har stort potensial for å engasjere lesere.",
          "Podkast: Gå i dybden på samme måte som du gjør i en e-bok eller white paper, men del kunnskapen i podkast format og tiltrekk andre segmenter av målgruppen din.",
        ],
      },
      { type: "overskrift", niva: 3, tekst: "Kanaler:" },
      {
        type: "liste",
        punkter: [
          "Egen nettside: Benytt deg av metoder innenfor søkemotoroptimalisering (SEO) og produser evergreen content i form av blogginnlegg som gir langvarig verdi.",
          "Sosiale medier: Dette forutsetter aktualitet og underholdningsverdi, ettersom innholdet er kort, presist og enkelt å konsumere.",
          "E-post marketing: Del guider, gode tilbud eller bransjeinnsikt til potensielle kunder i nyhetsbrev som man sender på e-post. Bruk Call-to-Action-knapper i nyhetsbrevet og guide leserne til nettsiden din.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Innholdsproduksjon i praksis" },
      {
        type: "avsnitt",
        tekst:
          "Ofte handler innholdsproduksjonen om å lage innhold til egen nettside eller sosiale medier. Det dreier seg i all hovedsak om å skrive informative blogginnlegg, der man bruker bilder og videoer til å understøtte budskapet i teksten. Når det er sagt, fungerer bilder og videoer som selvstendig innhold på sosiale medier.",
      },
      { type: "overskrift", niva: 3, tekst: "Informative blogginnlegg" },
      {
        type: "avsnitt",
        tekst:
          "Man etablerer et bloggunivers på nettsiden for å skape en arena hvor man kan dele kunnskap og demonstrere sin ekspertise innenfor et felt. Bedrifter bruker blogginnlegg til å dele sin innsikt i bransjen og håndheve sin kompetanse på markedet. Å knytte blogginnlegg til transaksjonelle landingssider eller produktsider er dessuten et godt grep for å føre lesere videre på siden og omdanne dem til potensielle kunder. Derfor sier man at blogginnlegg er en måte for bedrifter å øke sitt konkurransefortrinn på markedet og ta over markedsandeler fra andre konkurrenter.",
      },
      { type: "overskrift", niva: 3, tekst: "Bilder som vekker følelser" },
      {
        type: "avsnitt",
        tekst:
          "Du har garantert hørt ordtaket «bilder sier mer enn 1000 ord», og ja, det er en klisjé, men det er en klisjé av en grunn. Publikum leser et bilde enda raskere enn de leser en tekst. Derfor kan du bruke bilder strategisk til å formidle et budskap. Foto er dessuten en selvsagt følgesvenn til tekst, der bildet bidrar til å forsterke budskapet du ønsker å formidle i teksten. Du er derfor avhengig av å samarbeide med kompetente fotografer, som har kreative evner og strategisk innsikt, og kan fange salgsutløsende øyeblikk.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Videoer som informerer og skaper engasjement",
      },
      {
        type: "avsnitt",
        tekst:
          "På samme måte som bilder bidrar til å forsterke budskapet, kan en video gjøre innholdet enda mer levende. Det er lettere å engasjere, spille på følelser og vekke oppsikt med videoklipp som er filmet og redigert utelukkende for å skape engasjement. Videografer jobber utelukkende for å dele den følelsen bilder og tekst ikke fanger på samme måte. Publikum er dessuten mer tilbøyelige til å dele videoer, enten på sosiale medier eller med venner og familie, sammenlignet med artikler og blogginnlegg. Dette øker visningene og påvirker synligheten til innholdet ditt.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Eksempel: Innholdsproduksjon til sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "En innholdsprodusent som produserer innhold til sosiale medier ønsker å øke den organiske rekkevidden til bedriften. Den bruker bilder og videoer proaktivt for å oppnå en viss rekkevidde uten å kjøpe annonser eller ty til andre knep. Derfor er det avgjørende at innholdet er unikt og engasjerer målgruppen. Dersom man innfrir målgruppens behov, øker sannsynligheten for at de ser og deler innleggene og dermed oppnår man en større organisk rekkevidde.",
      },
      { type: "overskrift", niva: 3, tekst: "Godt innhold på sosiale medier" },
      {
        type: "avsnitt",
        tekst:
          "Hvorvidt innholdet oppleves som godt, avhenger i stor grad av den planleggingen dere gjør i forkant av å produsere og publisere innholdet. Derfor er det viktig å tenke over hvilke temaer dere vil dekke, strukturere en tidseffektiv innholdsproduksjon og avklare hvem innholdsprodusentene er. Kanalen, formen, relevant utstyr og andre verktøy er også viktig å vurdere i denne planleggingsfasen.",
      },
      {
        type: "avsnitt",
        tekst: "Godt innhold er unikt, nyttig og engasjerende.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Betydningen av digital innholdsproduksjon",
      },
      {
        type: "avsnitt",
        tekst:
          "Lykkes du med innholdsproduksjon, engasjerer du målgruppen din samtidig som du tiltrekker nye, potensielle kunder til nettsiden din. Du opplever mer trafikk og bedriften din får flere henvendelser. Engasjementet på sosiale medier øker eller forsterkes, og du opplever generelt en større tillit til hvilke produkter, tjenester eller innsikter din bedrift tilbyr.",
      },
      { type: "overskrift", niva: 3, tekst: "Det øker engasjementet" },
      {
        type: "avsnitt",
        tekst:
          "Målrettet innhold som er tilpasset målgruppen din gir deg mulighet til å interagere med dem på et dypere nivå. Innhold som treffer deres behov kommer til å engasjere dem og automatisk knytte deres interesser sammen med din bedrift. Når du appellerer til dem, dannes det tillit mellom dere og potensialet for at du får lojale kunder, øker.",
      },
      { type: "overskrift", niva: 3, tekst: "Det gjør deg mer synlig" },
      {
        type: "avsnitt",
        tekst:
          "Innhold øker den digitale tilstedeværelsen din på markedet, i tillegg til tradisjonell synlighet. Merkevaren din blir synlig på tvers av kanaler – som sosiale medier og nettsider – og gir deg mulighet for å nå ut til nye kunder.",
      },
      { type: "overskrift", niva: 3, tekst: "Det bygger autoritet" },
      {
        type: "avsnitt",
        tekst:
          "Innhold gir deg muligheten til å dele den fagkunnskapen eller bransjeinnsikten du sitter på, som ikke alle har tilgang på heller. Ved at du deler denne innsikten på din nettside eller sosiale medier, bygger du en sterk faglig profil som gir deg økt troverdighet. Dette gjør deg til en autoritativ aktør på markedet, som atskiller deg fra konkurrenter og øker sannsynligheten for at kunder velger deg framfor andre. De vil stole på deg!",
      },
      { type: "overskrift", niva: 3, tekst: "Kunder forblir lojale" },
      {
        type: "avsnitt",
        tekst:
          "Verdifullt og hjelpsomt innhold som løpende blir oppdatert, publisert og delt bidrar til å understøtte de sterke relasjonene du har bygget med kundene dine. Når de stoler på deg og oppfatter deg som en legitim kilde til nyttig og verdifull informasjon, øker også tilbøyeligheten til å bli en lojal kunde. De foretar hyppige og gjentatte kjøp.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Det legger grunnlaget for din markedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Tilpass innholdet ditt etter ulike segmenter innenfor målgruppen din, og skreddersy innholdsproduksjonen etter hvilke formater og kanaler du jobber med. Jobber du med søkemotoroptimalisering (SEO) i din digitale markedsføringsstrategi, er innholdet selve hjørnesteinen i innsatsen din. Søkemotoren anerkjenner regelmessig innhold av høy kvalitet som gir en direkte verdi for brukerne.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Benytt deg av innholdsmarkedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Man produserer innholdet fordi man vil engasjere målgruppen sin. Dette forutsetter at man kjenner målgruppens behov og krav. Hvor er deres kunnskapshull? Hva trenger de hjelp med og hvilke interesser har de? Hvem er de og hvordan er de tilbøyelig til å la seg engasjere av tekst og bilder?",
      },
      {
        type: "avsnitt",
        tekst:
          "Svar på disse spørsmålene får du kun ved å gjøre analyser og jobbe strategisk med en innholdsplan. Du er derfor avhengig av å få en solid forståelse av målgruppen din, noe du får gjennom innholdsmarkedsføring.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Samarbeid med en innholdsprodusent",
      },
      {
        type: "avsnitt",
        tekst:
          "Hos Reflektor kan du hente uvurderlig hjelp fra innholdsprodusenter med lang erfaring innen foto og video. Våre fotografer fanger de riktige salgsutløsende øyeblikkene og tar bilder som vekker følelser hos din målgruppe. Våre videografer produserer videoer som fanger hva bilder ikke gjør, nemlig det levende elementet ved din bedrift eller ditt produkt og tjeneste. Vi tilbyr faglig tyngde innen bilde- og videoproduksjon og har en helhetlig tilnærming til innholdsproduksjon som kombinerer kreativitet med strategisk forretningsforståelse. Tilgangen på godt innhold er bare et klikk unna!",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    lesVidere: [
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
  },
  {
    slug: "hva-er-innholdsmarkedsforing",
    bilde: {
      fil: "kafe-hylle-1600",
      alt: "Rad med flasker i en butikkhylle",
    },
    tittel: "Hva er innholdsmarkedsføring?",
    beskrivelse:
      "Innholdsmarkedsføring (content marketing) er et strategisk middel for å tiltrekke og beholde kunder gjennom målrettet innhold. Få nyttige råd i vår guide.",
    publisert: "2024-08-08",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Innholdsmarkedsføring, også kjent som content marketing, er en strategisk innsats der man bruker innhold for å tiltrekke, engasjere og beholde kunder. Man produserer og distribuerer innhold som er tilpasset en målgruppe, hvor man har en langsiktig plan for hvordan man kan tilby kontinuerlig innhold til potensielle og eksisterende kunder. Kundene opplever nemlig innholdsproduksjonen som autentisk og derfor har det en tydelig forretningsverdi for bedrifter.",
      },
      {
        type: "avsnitt",
        tekst:
          "Nysgjerrig på hvordan man gjør innholdsmarkedsføring i praksis? I vår guide til innholdsmarkedsføring tar vi deg gjennom 5 trinn for å lykkes med strategien din.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva er innholdsmarkedsføring? Kort forklart:",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdsmarkedsføring er en strategi der man skaper og distribuerer innhold som oppfattes som verdifullt av målgruppen sin. Ved å produsere innhold som er skreddersydd etter hva målgruppen leter etter, kan man tiltrekke og engasjere brukere som har mulighet for å bli potensielle kunder. Det er dessuten en god strategisk beslutning hvis man vil beholde kunder og bygge langvarige relasjoner med dem.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvordan kan innhold gi en målbar forretningsverdi?",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdet man produserer og distribuerer ved innholdsmarkedsføring får en målbar forretningsverdi etter at man har identifisert hvordan målgruppen lar seg engasjere. Ved å utforme en detaljert innholdsplan og levere tilpasset innhold som besvarer deres behov og krav, bygger man opp tillit. Målgruppen begynner å stole på hva du formidler og dermed også hva du selger, som øker sjansen for at de gjennomfører et kjøp.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Innholdsmarkedsføring oppleves genuint",
      },
      {
        type: "avsnitt",
        tekst:
          "Forretningsverdien i å tilby verdifullt og nyttig innhold til potensielle og eksisterende kunder, ligger i den autentiske formidlingsmåten. Content marketing er nemlig ikke reklame eller PR, og heller ikke basert på forretningens behov. Den er kundeorientert og består av en plan for langsiktig innhold, hvor man kontinuerlig produserer innhold basert på hva målgruppen ønsker seg. I motsetning til kampanjemateriell, er innholdsmarkedsføring en langsiktig innsats, som er grunnen til at mange oppfatter innholdet som genuint. Det er ikke produsert for å posisjonere bedriften eller markedsføre et produkt, men det er laget med målgruppens behov og ønsker i mente.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Definisjon på innholdsmarkedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Det finnes ulike definisjoner på innholdsmarkedsføring, ettersom folk har forskjellige oppfatninger av hva innholdsmarkedsføring innebærer i praksis. Man har rett og slett forskjellige måter å jobbe med innholdsmarkedsføring på.",
      },
      {
        type: "avsnitt",
        tekst:
          "For eksempel vektlegger noen det strategiske hensynet bak å legge og utføre en plan for innholdsmarkedsføring, der man er opptatt av å tiltrekke nye og beholde eksisterende kunder. Andre har større fokus på hvordan man distribuerer innhold for å engasjere flere og besvare brukerens behov.",
      },
      {
        type: "avsnitt",
        tekst:
          "Overordnet kan man likevel trekke fram noen komponenter som utgjør en innholdsmarkedsføring definisjon:",
      },
      {
        type: "liste",
        punkter: [
          "Det er kundeorientert framfor forretningssentrisk.",
          "Det gjøres i medier og kanaler du eier, for eksempel din egen nettside.",
          "Det er en kontinuerlig og langsiktig innsats med definerte målsettinger.",
        ],
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Se noen utvalgte innholdsmarkedsføring definisjoner under:",
      },
      {
        type: "liste",
        punkter: [
          "Generell definisjon: Innholdsmarkedsføring er former for markedsføring som utnytter medieinnhold rettet mot målgrupper for å utvikle positive kunderelasjoner (Store norske leksikon).",
          "Formell definisjon: Det er en markedsstrategi for å skape og distribuere relevant og verdifullt innhold for å tiltrekke og engasjere en definert målgruppe (Content Marketing Institute)",
          "Uformell definisjon: Det handler om å eie – ikke leie – medieplattformer, der potensielle kunder kommer til deg, i stedet for at du må rekke ut til dem. En medieplattform er for eksempel nettsiden eller Instagram-profilen din.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Gjør innholdsmarkedsføring med både skriftlig og visuelt innhold.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Guide til innholdsmarkedsføring: Gjennomfør content marketing med 5 enkle trinn",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Trinn 1: Definer formålet med innholdet du produserer",
      },
      {
        type: "avsnitt",
        tekst:
          "Alt innhold som du produserer må ha en hensikt og et formål, både for målgruppen din og bedriften din. Den som leser og konsumerer innholdet ditt, engasjerer seg med innholdet av en bestemt grunn. Det ligger med andre ord en brukerintensjon bak hvorfor de er interessert i innholdet ditt. Samtidig er det viktig å betrakte hvor de er i kundereisen, ettersom dette har innvirkning på hvordan du bør tilpasse innholdet etter deres behov.",
      },
      {
        type: "avsnitt",
        tekst:
          "En kundereise består av tre faser. Forestill deg de tre fasene som en trakt eller en opp ned trekant med en topp, midt og bunn.",
      },
      {
        type: "liste",
        punkter: [
          "I toppen: Innholdet skal fange oppmerksomheten til potensielle kunder og tiltrekke folk som besøker nettsiden din for første gang.",
          "I midten: Innholdet skal være verdifullt og hjelpsomt for eksisterende og potensielle kunder, og gjøre engangsbesøkende til faste besøkende som kommer tilbake gang etter gang.",
          "I bunnen: Innholdet skal tilpasses alle typer kunder i din målgruppe og oppfordre dem til å kjøpe tjenesten eller produktet ditt eller foreta en annen handling som du definerer som en konvertering. En konvertering kan for eksempel være at de melder seg til et nyhetsbrev eller undertegner en underskriftskampanje.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Du jobber med innhold etter hvilke KPI-er og målsettinger bedriften din har definert. Innholdet har en direkte påvirkning på bedriftens suksess, altså at dere oppnår målsettingene, og derfor er det viktig å avklare hvordan dere måler suksess. Skal innholdet lede til flere besøk på nettsiden, økt engasjement på sosiale medier, eller at flere nye kunder melder seg interessert i tjeneste eller kjøper produktet deres? Når du vet dette, er det lettere å planlegge hvilken type innhold dere skal produsere.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst:
          "Trinn 2: Målgruppen din: Hvem skal se, lese eller lytte til innholdet?",
      },
      {
        type: "avsnitt",
        tekst:
          "Som det aller første du gjør, må du avklare hvem målgruppen din er, definere deres behov og hvilken verdi du ønsker at den skal få ved å lese eller konsumere innholdet. Det er avgjørende å tilpasse innholdet etter målgruppen din, og du må sørge for at innholdet besvarer og innfrir målgruppens spørsmål eller behov.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er ikke nok å tilpasse innholdet etter målgruppen, du må også bruke tid på å bygge en relasjon til dem. Potensielle kunder ønsker å bli kjent med deg før de gjør et kjøp eller konverterer. Innholdet du produserer til nettsiden eller sosiale medier, er en god metode for å bygge en tillitvekkende relasjon. Målgruppen din må kunne stole på innholdet ditt for å vende tilbake. Når de opplever tillit gjennom hjelpsomt og verdifullt innhold, er sannsynligheten større for at de gjennomfører et kjøp eller konverterer.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Trinn 3: Det finnes ulike formater å velge mellom",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdet du produserer kan ta mange former. Det kan være skriftlig og produseres som blogginnlegg på nettsiden eller som innlegg i sosiale medier. E-bøker og digitale hefter er annet skriftlig innhold som du kan dele på diverse kanaler. Slikt nedlastbart innhold passer veldig fint til distribusjon som kan nå bredere enn kun på digitale plattformer.",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdet kan også være audiovisuelt. Visuelt innhold som bilde, video og grafikk har gode sjanser for å engasjere målgruppen din, i tillegg til at det kan repostes og deles lettere enn skriftlig innhold. Podkast er et annet format der du kan spre ekspertisen din.",
      },
      {
        type: "liste",
        punkter: [
          "Blogginnlegg: Del den ekspertisen og erfaringen du har i blogginnlegg som du publiserer på egen nettside og kobler sammen med tjenestene eller produktet du selger.",
          "Innlegg i sosiale medier: Del nyheter, bilder og videoer av underholdningsverdi, og skap et fellesskap med følgerne og kundene dine.",
          "Infografikk: Grafiske fremstillinger er en presis måte å formidle et budskap, som du også kan bruke i blogginnlegg og sosiale medier.",
          "E-bøker, white papers og artikler: Alle disse formatene fremstår profesjonelle, i tillegg til at det er morsomt å jobbe med, fordi du kan dypdykke i emner og dele kunnskap. Kombiner skriftlig og visuelt innhold og del innholdet digitalt og fysisk.",
          "Video: Et ressurskrevende format som har stort potensial for å engasjere lesere.",
          "Podkast: Gå i dybden på samme måte som du gjør i en e-bok eller white paper, men del kunnskapen i podkastformat og tiltrekk andre segmenter av målgruppen din.",
        ],
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Trinn 4: Velg kanalene hvor du publiserer og deler innholdet",
      },
      {
        type: "avsnitt",
        tekst:
          "Den kanalen du velger, legger på mange måter føringen for hvilket innhold du kan produsere og hvordan du kan distribuere det. Det finnes mange forskjellige måter å publisere og dele innholdet du har produsert:",
      },
      {
        type: "liste",
        punkter: [
          "Egen nettside: Benytt deg av metoder innenfor søkemotoroptimalisering (SEO) og produser evergreen content i form av blogginnlegg som gir langvarig verdi.",
          "Sosiale medier: Dette forutsetter aktualitet og underholdningsverdi, ettersom innholdet er kort, presist og enkelt å konsumere.",
          "E-post marketing: Del guider, gode tilbud eller bransjeinnsikt til potensielle kunder i digitale nyhetsbrev, og bruk Call-to-Action-knapper for å lede dem til nettsiden din.",
        ],
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Trinn 5: Evaluering av innsatsen",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er veldig viktig i innholdsmarkedsføring, som i alle andre markedsføringsinnsatser, å evaluere hvordan prosessen har vært. Når du vet hva som fungerer etter hensikt og hva som ikke har gått etter planen, kan du lettere identifisere hva som må revideres eller endres. Dette steget av innholdsmarkedsføring handler i bunn og grunn om hvordan du kan forbedre tiltakene du har gjort til neste gang. Sannsynligheten for at du lykkes med fremtidig innhold øker, ettersom du har bedre forutsetninger for å planlegge en mer vellykket innholdsproduksjon.",
      },
      {
        type: "avsnitt",
        tekst:
          "Du bør vurdere innsatsen regelmessig og tilpasse strategien løpende. Benytt deg av salgsdata, trafikk, konverteringer, data på brukeratferd og andre definerte KPI-er til å vurdere hvor godt innsatsen deres har vært. Det er viktig å ha en prosess for evaluering på plass, som lar deg kontinuerlig endre, tilpasse og forbedre innholdsproduksjonen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Eksempler på innholdsmarkedsføring",
      },
      {
        type: "liste",
        punkter: [
          "Bedrift som distribuerer magasin: Et kosmetikkfirma skriver innhold til eget magasin hvor de produserer artikler og dekker emner innenfor skjønnhet. Magasinet er tilgjengelig i butikker og mulig å lese digitalt.",
        ],
      },
      {
        type: "liste",
        punkter: [
          "Interesseorganisasjon som bruker sosiale medier aktivt: Klimaorganisasjon produserte kort innhold med stor underholdningsverdi og nyhetsrelevans på Instagram. Engasjementet øker i takt med at flere ser og deler bildene og videoene organisasjonen produserer og deler.",
          "Bedrift som utvikler podkast konsept: En nisjebedrift lanserer podkast og inviterer bransjefolk til å snakke om nye tendenser på markedet. Kunnskap blir delt og gjort tilgjengelig for et snevert publikum.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Legg en omfattende innholdsplan og få suksess med innholdsmarkedsføring.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Suksess med innholdsmarkedsføring avhenger 100% av kvalitetsinnhold",
      },
      {
        type: "avsnitt",
        tekst:
          "Du kommer ikke til å lykkes med innholdsmarkedsføring hvis ikke innholdet er av høy kvalitet og besvarer den etterspørselen målgruppen din har. Derfor er det viktig å legge inn en solid innsats tidlig, som du gjør gjennom å etablere en robust innholdsstrategi og legge en dekkende innholdsplan. Dette legger grunnlaget for at innholdsproduksjonen fungerer, og at du får produsert innhold som engasjerer brukere og oppmuntrer til salg.",
      },
      { type: "overskrift", niva: 3, tekst: "Legg en innholdsstrategi" },
      {
        type: "avsnitt",
        tekst:
          "En innholdsstrategi er en konkret plan for hvilken retning innholdet skal ha. Formålet bak å produsere innholdet legges i innholdsstrategien, der man definerer en forventet output av å skrive teksten eller lage bildet.",
      },
      { type: "overskrift", niva: 3, tekst: "Utform en innholdsplan" },
      {
        type: "avsnitt",
        tekst:
          "En innholdsplan gir en oversikt over alt innhold som skal produseres og i hvilket format og på hvilken kanal det skal distribueres. Man kan derfor anse en innholdsplan for hvordan man implementerer innholdsmarkedsføring i praksis.",
      },
      {
        type: "liste",
        punkter: [
          "Avklare hvilke ressurser som kreves i innholdsproduksjonen, for eksempel tilgang på bilder, arbeidskraft og bruk av kanaler",
          "Hvilket innhold skal produseres?",
          "Hvilket format skal det jobbes med?",
          "Hvilke kanaler skal innhold publiseres i?",
          "Hvilke målsettinger har bedriften din?",
          "Hvilke kolleger er ansvarlig for hva i innholdsproduksjonen og -markedsføringen?",
          "Eventuelle deadlines",
        ],
      },
      { type: "overskrift", niva: 3, tekst: "Ha en jevn innholdsproduksjon" },
      {
        type: "avsnitt",
        tekst:
          "Jobb etter innholdsplanen i innholdsproduksjonen og sørg for å oppdatere innholdsplanen løpende, for eksempel ved bestemte tidsintervaller (hver annen måned eller kvartal) eller når det oppstår nye trender eller tendenser i bransjen eller på markedet). Sørg for at dere produserer og publiserer innhold jevnt og trutt. En stabil innholdsproduksjon er den beste forsikringen for å opprettholde engasjementet og tiltrekke og beholde kunder.",
      },
      {
        type: "avsnitt",
        tekst:
          "Ønsker du flere tips? Se hvordan du setter i gang og utfører en innholdsproduksjon på best mulig vis.",
        // Løftet er «slik gjør du det», og det er artikkelen — ikke salgssiden.
        lenker: [
          {
            frase:
              "Se hvordan du setter i gang og utfører en innholdsproduksjon på best mulig vis",
            sti: "/blogg/hva-er-innholdsproduksjon",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Få hjelp med bilder og video" },
      {
        type: "avsnitt",
        tekst:
          "Hos Reflektor kan du hente uvurderlig hjelp fra dyktige fotografer og videografer som fanger salgsutløsende øyeblikk. Våre fotografer har et øye for detaljer og tar bilder som vekker følelser hos din målgruppe. Våre videografer produserer videoer som fanger hva bilder ikke gjør, nemlig det levende elementet ved din bedrift eller ditt produkt og tjeneste. Vi tilbyr faglig tyngde innen bilde- og videoproduksjon og har en helhetlig tilnærming til innholdsproduksjon som kombinerer kreativitet med strategisk forretningsforståelse. Dermed vil vi hjelpe deg med å legge grunnlaget for en vellykket innholdsmarkedsføring.",
        lenker: [
          {
            frase: "bilde- og videoproduksjon",
            sti: "/videoproduksjon-i-oslo",
          },
          { frase: "innholdsproduksjon", sti: "/innholdsproduksjon" },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvor mye innhold skal til før det virker?",
        svar: "Abonnementet vårt er bygget rundt to publiseringer i uken, hele året. Det blir 104 innlegg. Jevnheten betyr mer enn antallet: innhold som kommer i rykk og napp ser ut som noe noen har glemt, og da hjelper det lite hvor bra det enkelte innlegget var.",
        lenker: [{ sti: "/", tekst: "løpende produksjon til fast månedspris" }],
      },
    ],
    lesVidere: [
      { sti: "/innholdsproduksjon", tekst: "innholdsproduksjon i praksis" },
    ],
  },
  {
    slug: "hva-er-videomarkedsfring",
    bilde: {
      fil: "goretex-sept-1800",
      alt: "Person i skalljakke i en togdør",
    },
    tittel: "Hva er videomarkedsføring?",
    beskrivelse:
      "Videomarkedsføring er et strategisk grep, ikke minst i sosiale medier. Vi forklarer hva det er og hvordan dere lykkes med det.",
    publisert: "2024-06-25",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Videomarkedsføring hjelper til med å engasjere og fange oppmerksomhet på en annen måte enn tekst og bilde.",
      },
      {
        type: "avsnitt",
        tekst:
          "Videomarkedsføring har de siste årene etablert seg som en viktig del av de aller fleste moderne markedsføringsstrategier. For eksempel kan vi se at videoer har økt i popularitet på sosiale medier, men også andre plattformer.",
      },
      {
        type: "avsnitt",
        tekst:
          "Ved å kaste seg på denne bølgen kan man som bedrift gripe en unik mulighet til å nå ut til publikum på en effektiv og engasjerende måte. I denne artikkelen skal vi se nærmere på hva videomarkedsføring er og hvordan man kan implementere en vellykket videomarkedsføringsstrategi.",
      },
      { type: "overskrift", niva: 2, tekst: "Dette er video­markedsføring" },
      {
        type: "avsnitt",
        tekst:
          "Slik som ordet tilsier, handler videomarkedsføring om bruk av video for å promotere og markedsføre produkter, tjenester eller merkevarer. Dette kan være alt fra produktdemoer og opplæringsvideoer til kundehistorier og live-streaming eventer. Videomarkedsføring går altså ut på å skape visuelt innhold som fanger oppmerksomheten til og fenger potensielle kunder, på en måte som er vanskelig å få til gjennom tradisjonelle tekst- og bildebaserte annonser",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "De mange fordelene med video­markedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Som nevnt har videomarkedsføring vist seg å være en av de mest effektive metodene for å nå ut til og engasjere et moderne publikum. Men hvorfor fungerer video så godt innen markedsføring? La oss se litt nærmere på hvilke konkrete fordeler videomarkedsføring fører med seg.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Forbedret SEO (Søkemotor­optimalisering)",
      },
      {
        type: "avsnitt",
        tekst:
          "Søkemotorer som Google tilpasser stadig algoritmene sine for å kunne engasjere brukerne og la dem finne fram til ønsket innhold og informasjon så enkelt som mulig. Derfor vil innhold av god kvalitet som raskt kan svare på søkerens intensjon og problemstilling bli prioritert på første siden av søkeresultatene. Siden videoformatet er engasjerende og gjør det enkelt å forklare komplekse temaer eller produkter på kort tid, vil dette ofte rangere godt.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Flere leads, konvertering og salg",
      },
      {
        type: "avsnitt",
        tekst:
          "Videoer har også vist seg å øke både leads, konverteringsrater og salg betydelig. Ifølge en studie fra Wyzowl, mener 90% av markedsførere at video gir en positiv ROI (Return On Investment), og 87% mener at videomarkedsføring har vært en direkte bidragsyter til økt salg. Dette er fordi video gir en visuell og auditiv opplevelse som kan formidle funksjoner, fordeler og salgsargumenter betraktelig mer effektivt enn tekst alene.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Økt engasjement på sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "Sosiale medieplattformer som Facebook, Instagram og Twitter favoriserer, på lik linje som søkemotorer, videoinnhold. Videoer har større sannsynlighet for å bli delt sammenlignet med andre typer innhold, noe som påvirker synlighet og rekkevidde for innholdet ditt i stor grad.",
      },
      { type: "overskrift", niva: 3, tekst: "Mobilvennlighet" },
      {
        type: "avsnitt",
        tekst:
          "Med den økende bruken av smarttelefoner konsumeres innhold oftere på mobile enheter. Videoformatet kan enkelt skaleres slik at du holder deg synlig på de plattformene folk bruker. For eksempel rapporterer Facebook at folk har 1,5 ganger større sannsynlighet å se videoer daglig på en smarttelefon enn på en datamaskin. Video er med andre et kraftig verktøy for å nå ut til et bredt publikum på farten!",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Styrke merkevarens tilstedeværelse",
      },
      {
        type: "avsnitt",
        tekst:
          "Mennesker husker visuelt innhold bedre enn tekst. I en video kan man ta i bruk virkemidler som vi vet fungerer svært godt når man ønsker å selge ikke bare et produkt, men et konsept. Her kan man bruke kombinasjonen av farger, lyd og andre visuelle elementer til virkelig å kommunisere en følelse. For deg som ønsker å bygge en visuell identitet og styrke merkevarens tilstedeværelse i markedet, er videomarkedsføring en god strategi. .",
      },
      {
        type: "avsnitt",
        tekst:
          "90% av markedsførere opplyser at videomarkedsføring gir positiv innvirkning på ROI.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Ulike formater for video­­markedsføring",
      },
      {
        type: "avsnitt",
        tekst:
          "Nå som vi har fått etablert de mange fordelene ved videomarkedsføring, har det kanskje dukket opp flere spørsmål. Som for eksempel hvilke videoformater som finnes, og hvilket som egner seg best til akkurat det du skal markedsføre. Det finnes nemlig mange ulike formater for implementering av videomarkedsføring, med hver sine fordeler og bruksområder. Her er noen av de vanligste og mest effektive formatene når man ønsker å ta i bruk video til markedsføring.",
      },
      { type: "overskrift", niva: 3, tekst: "Reklamefilmer" },
      {
        type: "avsnitt",
        tekst:
          "Tradisjonelle reklamefilmer brukes som regel for å promotere et produkt eller en tjeneste på lineær TV, via strømmetjenester og andre onlinetjenester. De er ofte korte og rett på sak, designet for å fange oppmerksomheten raskt og levere en klar melding. For eksempel har mange av oss sett de klassiske reklamene fra store merker, som bruker flere sterke visuelle elementer og fortellerteknikker for å formidle budskapet til seerne.",
        lenker: [{ frase: "reklamefilmer", sti: "/reklamefilm" }],
      },
      { type: "avsnitt", tekst: "Det kan for eksempel se sånn ut:" },
      { type: "overskrift", niva: 3, tekst: "Opplæringsvideoer og tutorials" },
      {
        type: "avsnitt",
        tekst:
          "Opplæringsvideoer gir steg-for-steg instruksjoner om hvordan man bruker et produkt eller utfører en bestemt oppgave. Disse er ofte svært populære på plattformer som YouTube, hvor folk søker etter læringsressurser. Mange har kanskje vært innom denne plattformen og sett en sminke-tutorial fra en influenser, eller et DIY-prosjekter.",
      },
      { type: "overskrift", niva: 3, tekst: "Kundehistorier og testimonials" },
      {
        type: "avsnitt",
        tekst:
          "Disse videoene viser fornøyde kunder som deler sine positive erfaringer med et produkt eller en tjeneste. Et slikt format er supert for å bygge troverdighet og tillit ved å vise ekte mennesker og ekte resultater. Derfor er dette også et fint format for deg som holder på med employer branding.",
      },
      { type: "overskrift", niva: 3, tekst: "Produktdemo" },
      {
        type: "avsnitt",
        tekst:
          "Disse videoene viser hvordan et produkt fungerer, og demonstrerer dets funksjoner og fordeler. De er spesielt nyttige for komplekse produkter hvor en visuell forklaring kan hjelpe potensielle kunder å forstå verdien bedre. Dette er spesielt gunstig for tekniske produkter, som kan dra nytte av detaljerte produktdemonstrasjoner som viser fram teknologien og brukeropplevelsen.",
      },
      { type: "overskrift", niva: 3, tekst: "Live-sendinger" },
      {
        type: "avsnitt",
        tekst:
          "Live-streaming har blitt et populært format de siste årene. Det er fordi disse gir en følelse av umiddelbarhet og engasjement, og lar avsenderen kommunisere direkte med publikum i sanntid. Plattformene Facebook Live, Instagram Live, og YouTube Live brukes ofte for lanseringer, Q&A-sessions, og spesielle begivenheter. Live-videoer kan derfor øke engasjementet og gi en mer personlig opplevelse for seerne.",
      },
      { type: "overskrift", niva: 3, tekst: "TikTok og Reels-format" },
      {
        type: "avsnitt",
        tekst:
          "Plattformene TikTok og Instagram har introdusert et nytt, kort format, som virkelig har tatt av. Disse videoene er vanligvis under ett minutt lange og er designet for rask konsumering. De kan være både morsomme og kreativt utformet, og går ofte viralt. Som bedrift kan man bruke disse plattformene for mer uformell videomarkedsføring, og innhold som ligner mer brukergenerert innhold.",
      },
      {
        type: "avsnitt",
        tekst:
          'Mange merkevarer har begynt å hente denne typen innhold fra UGC plattformer til betalte kampanjer og organiske innholdsstrategier, noe som gjør det mulig å samarbeide med skapere og produsere autentiske videoer med sterke "hooks".',
      },
      {
        type: "avsnitt",
        tekst:
          "Med tanke på at disse videoene utelukkende sees på en mobilskjerm, må de også være tilpasset denne størrelsen. Her ser du et eksempel på en ads-video for Reflektor i et slikt format:",
      },
      { type: "overskrift", niva: 3, tekst: "Animerte videoer" },
      {
        type: "avsnitt",
        tekst:
          "Til slutt er det også verdt å nevne animasjonsformatet. Animasjoner kan forklare komplekse konsepter på en lettvint måte. De kan brukes for å visualisere data, forklare tjenester, eller fortelle historier på en kreativ måte, som noen ganger kan være vanskeligere å formidle ved å ta opp vanlig film.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Hvordan kan man integrere video som en del av markedsførings­strategien?",
      },
      {
        type: "avsnitt",
        tekst:
          "For å utnytte videomarkedsførings store potensial til det fulle, er det viktig at man har en klar strategi og profesjonell produksjon. I Reflektor består vi av et team av dyktige produsenter som mestrer både foto- og videoproduksjon, og kan hjelpe deg med å integrere video sømløst i din markedsføringsstrategi. Her er noen av våre tips for deg som ønsker å begynne med videomarkedsføring.",
        lenker: [
          { frase: "foto- og videoproduksjon", sti: "/videoproduksjon-i-oslo" },
        ],
      },
      { type: "overskrift", niva: 3, tekst: "1. Definer målene dine" },
      {
        type: "avsnitt",
        tekst:
          "Første steg er å forstå hva du ønsker å oppnå med videomarkedsføringen. Dette kan være alt fra økt merkevarebevissthet og generering av leads, til engasjement på sosiale medier eller økt omsetning.",
      },
      { type: "overskrift", niva: 3, tekst: "2. Kjenn ditt publikum" },
      {
        type: "avsnitt",
        tekst:
          "For å produsere innhold som resonnerer med målgruppen din, må du forstå deres behov, interesser og hvor de tilbringer tiden sin online. I Reflektor kan vi hjelpe deg både med å analysere publikum og utvikle innhold som treffer blink.",
      },
      { type: "overskrift", niva: 3, tekst: "3. Velg riktig videoformat" },
      {
        type: "avsnitt",
        tekst:
          "Som vi allerede har vært inne på, har ulike videoformat ulike fordeler. Hva er det som er mest gunstig for deg og dine mål? Hvis du ønsker flere følgere og mer engasjement på sosiale medier er det for eksempel viktig at videoen er produsert på en måte som er tilpasset ønsket medie.",
      },
      { type: "overskrift", niva: 3, tekst: "4. Lag en innholdsplan" },
      {
        type: "avsnitt",
        tekst:
          "Planlegg videoene dine i detalj, dette sikrer at du ender opp med et godt resultat og ikke en helt annen video enn det du først hadde sett for deg. Her bør du inkludere hvilke emner som skal dekkes, hvilket format du har valgt, et produksjonsskjema og publiseringsdatoer. En innholdsplan hjelper deg med å holde orden og sikre at du publiserer jevnlig innhold. Her kan man for eksempel bruke verktøy som Trello eller Asana for å administrere innholdsplanen din.",
      },
      { type: "overskrift", niva: 3, tekst: "5. Produksjon og redigering" },
      {
        type: "avsnitt",
        tekst:
          "Vi anbefaler å ha et team av profesjonelle produsenter som sørger for høykvalitetsproduksjon med riktig utstyr og ekspertise. Det er kjedelig å bruke mye tid og ressurser på en video, og så bli sittende igjen med et kornete resultat i dårlig oppløsning. God belysning, klar lyd og stabil kameraføring er essensielle faktorer som vi i Reflektor håndterer med perfeksjon!",
      },
      {
        type: "avsnitt",
        tekst:
          "For best utnyttelse av et tett samarbeid med oss, anbefaler vi en rammeavtale med månedlig produksjon. Dette gir deg en fast produsent som kontinuerlig optimaliserer og tilpasser produksjonen etter dine behov.",
      },
      {
        type: "avsnitt",
        tekst:
          "En slik avtale sikrer jevnlig og høy kvalitetsinnhold som holder din markedsføringsstrategi både dynamisk og effektiv. I Reflektor tar vi selvsagt også enkeltstående oppdrag, slik at du kan få profesjonell hjelp uansett omfang!",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Video­markedsføring i praksis: Tips for å lykkes fra et av bransjens fremste produksjons­­selskap",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er viktig å forstå ikke bare strategien, men også de praktiske detaljene i produksjonen dersom du skal lykkes med videomarkedsføring. I Reflektor har vi lang erfaring og verdifull innsikt i hva som fungerer godt, slik at du kan differensiere deg og maksimere effekten av videoene dine. Her er noen av våre tips.",
      },
      { type: "overskrift", niva: 3, tekst: "Kreativ konseptutvikling" },
      {
        type: "avsnitt",
        tekst:
          "En engasjerende video starter med et godt konsept. Reflektors kreative team kan utvikle unike og minneverdige historier som formidler budskapet ditt effektivt. Vi tar oss alltid tid til å forstå oss på din merkevare og dens unike verdier for å skape innhold som er autentisk og relevant.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Profesjonell produksjon og unik teknologi",
      },
      {
        type: "avsnitt",
        tekst:
          "Med et erfarent team og toppmoderne utstyr, sørger vi i Reflektor for høy produksjonskvalitet. Vi håndterer alle aspekter av produksjonen, fra innspilling til redigering, og sikrer at videoene dine ser profesjonelle ut og fanger seernes oppmerksomhet i løpet av millisekunder. Vi bruker også de nyeste teknologiene innen videoproduksjon. Dette gir oss muligheten til å lage imponerende og visuelt slående videoer som skiller seg ut i mengden.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Bør vi starte med én stor film eller flere små?",
        svar: "Flere små, i de fleste tilfeller. Én stor film er et øyeblikk; flere små er en tilstedeværelse, og det er tilstedeværelsen folk husker deg for. Unntaket er når dere har noe konkret å lansere og skal betale for å få det vist — da er det én film som skal bære kampanjen.",
        lenker: [
          { sti: "/videoproduksjon-i-oslo", tekst: "film til egne flater" },
          { sti: "/reklamefilm", tekst: "reklamefilm for betalte flater" },
        ],
      },
    ],
    lesVidere: [
      { sti: "/videoproduksjon-i-oslo", tekst: "video til egne flater" },
      { sti: "/reklamefilm", tekst: "reklamefilm for betalte flater" },
    ],
  },
  {
    slug: "hva-er-employer-branding",
    bilde: {
      fil: "ansatte-produksjon-1600",
      alt: "Fire ansatte i arbeidstøy i et produksjonslokale",
    },
    tittel: "Hva er employer branding?",
    beskrivelse:
      "Er du nysgjerrig på employer branding og hvordan man lykkes med det? Vi har laget en guide som inneholder alt du trenger å vite!",
    publisert: "2024-06-12",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Employer branding: Mange forbinder kanskje merkevarebygging med et tradisjonelt Business-to-Consumer-forhold (B2C). Likevel omfatter en bedrifts interessenter mer enn bare kundene. Ønsker du deg for eksempel de mest kompetente arbeidstakerne og et sterkt team, er du avhengig av at disse kjenner til bedriften og ønsker å jobbe hos deg. Her kommer employer branding inn i bildet. Men hva er employer branding? Vi tar en nærmere titt på hva employer branding er, hvorfor det er viktig med en employer branding strategi og hvordan man lykkes med det.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er employer branding?" },
      {
        type: "avsnitt",
        tekst:
          "Employer branding, også kalt arbeidsgivermerkevarebygging på norsk, handler om å skape et godt bilde av din bedrift slik at du som arbeidsgiver blir ettertraktet hos dyktige kandidater. Dette gjør du ved å kommunisere hva som gjør din bedrift til et lukrativt og spennende sted å jobbe. Oppfattes bedriften som en god arbeidsplass hvor det er lett å trives, vil du også trekke til deg og holde på de beste talentene. En god employer branding strategi er likevel mer enn bare markedsføring. Nøkkelen er å bidra til å skape en autentisk bedriftskultur der de ansatte både trives og føler seg verdsatt. Dette fører nemlig med seg en rekke fordeler, blant annet lavere rekrutteringskostnader, høyere produktivitet, et bedre omdømme og økt lojalitet hos kundegruppen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvorfor er employer branding viktig? 4 fordeler",
      },
      {
        type: "avsnitt",
        tekst:
          "I et konkurransedyktig arbeidsmarked er det mange om beinet, og ofte rift om de aller dyktigste arbeidstakerne. Derfor er det både viktig og hensiktsmessig å prioritere ressurser på employer branding for å sikre seg stjernelaget som alle bedrifter ønsker seg. La oss se enda litt nærmere på fordelene med employer branding:",
      },
      {
        type: "liste",
        punkter: [
          "Etterspørsel hos de ansatte du ønsker degSterk employer branding kan være en stor bidragsyter til å gjøre bedriften din mer attraktiv for potensielle søkere og ansatte. Når folk vet at denne bedriften er et godt sted å jobbe, er det naturligvis høyere sannsynlighet for at de ønsker å søke på stillinger hos deg",
          "Reduserte rekrutteringskostnaderDet kan være dyrt å rekruttere nye ansatte, særlig om man må lete lenge. Med employer branding kan du redusere disse kostnadene ved å gjøre det enklere for de kvalifiserte kandidatene både å oppdage bedriften og sende inn søknad.",
          "Økt engasjement og bedre omdømmeAnsatte som er fornøyde med jobben sin og stolte av arbeidsplassen er mer engasjerte og produktive. I tillegg vil et godt omdømme ikke bare ha en positiv dominoeffekt på nye og eksisterende ansatte, men også andre interessenter som investorer og partnere.",
          "KundelojalitetDet er ingen hemmelighet at de aller fleste mennesker foretrekker å handle hos bedrifter de har et godt inntrykk av. En bedrift med sterk employer branding har derfor større sannsynlighet for å opparbeide seg en lojal kundegruppe",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Employer branding strategi - hvordan bygge et sterkt employer brand?",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Definere målgruppe, analysere markedet og legge strategi",
      },
      {
        type: "avsnitt",
        tekst:
          "Når man skal utarbeide en employer branding-strategi, er fremgangsmåten ofte lik andre markedsføringsaktiviteter:",
      },
      {
        type: "liste",
        punkter: [
          "Først må du identifisere målgruppen du ønsker å nå. Er det en spesiell type mennesker du vil appellere til, og hva kjennetegner denne gruppen?",
          "Videre er det smart å få et overblikk over markedet. Hvem er konkurrentene dine og hvordan jobber de med employer branding? Hva er det som differensierer deg som arbeidsgiver; hva er dine unike salgsargumenter (USP’er)?",
          "Etter at man har gjort dette forarbeidet, kan man legge en strategi. Hva er målet med din employer branding, hva slags innhold skal du bruke og i hvilke kanaler?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er noen av elementene som ofte går igjen for bedrifter som jobber aktivt med employer branding. Strategiene kan selvfølgelig variere ut ifra ressurser, bedriftens størrelse og interne prosesser.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Tips til hvordan lykkes med employer branding",
      },
      { type: "overskrift", niva: 3, tekst: "Lag innhold som engasjerer" },
      {
        type: "avsnitt",
        tekst:
          "I en verden hvor vi konstant blir eksponert for alle former for innhold, fra reklame til brukergenerert innhold, er det lurt å tenke over hva som kan skille seg ut i mengden. Vil det for eksempel være tilstrekkelig med innhold som består av kun tekst og bilder? Ofte kan videoinnhold være et hensiktsmessig valg, da video skiller seg mer ut. Hjernen vår behandler nemlig visuelt innhold raskere enn tekst, og folk husker derfor videoinnhold bedre. Samtidig gir videoinnhold mulighet til å kommunisere budskapet mer effektivt, siden videoformatet gjør det enklere å fange opp følelser og kroppsspråk for seeren. Å se ansiktsuttrykk og gester bidrar til å bygge tillit på en unik måte, noe som er avgjørende faktor i en god employer branding strategi.",
      },
      { type: "overskrift", niva: 3, tekst: "Valg av riktig kanal" },
      {
        type: "avsnitt",
        tekst:
          "Med framveksten av digitale plattformer, er det i dag helt nødvendig for de fleste bedrifter å være synlig med innholdsproduksjon i sosiale medier. En stor andel jobbsøkere sjekker nemlig ut bedriften på deres nettside eller SoMe-kontoer før de søker på en jobb. Ergo er det avgjørende å kommunisere employer branding online. For eksempel kan korte videoer på LinkedIn eller Facebook være gull verdt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Ønsker du hjelp til innholdsproduksjon som kan brukes til employer branding? I Reflektor kan vi hjelpe til med alt fra ansattbilder til videoproduksjon!",
        lenker: [
          {
            frase: "innholdsproduksjon som kan brukes til employer branding",
            sti: "/employer-branding-video-oslo",
          },
        ],
      },
      { type: "overskrift", niva: 3, tekst: "Løft fram bedriftens ansatte" },
      {
        type: "avsnitt",
        tekst:
          "Troverdighet er et nøkkelord når det kommer til merkevarebygging, også som arbeidsgiver. Og hvem er vel mer troverdige ambassadører for deg som arbeidsgiver enn dine egne ansatte? Bruk gjerne videosnutter til å vise fram dem som allerede jobber hos deg. For eksempel kan du produsere innhold som viser hvordan en typisk arbeidsdag i din bedrift ser ut. Her er dine ansatte de aller beste til å formidle arbeidskulturen. La dem gjerne dele sine erfaringer, kollegiale forhold og hva de liker best med jobben.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Omdømme, verdier og samfunnsansvar",
      },
      {
        type: "avsnitt",
        tekst:
          "For å lykkes med employer branding, er det lurt å ha et solid og godt omdømme i bunn. Dersom folk flest allerede har positive assosiasjoner til merkevaren din, har du altså et bedre utgangspunkt for å lykkes med employer branding. En helhetlig tilnærming til merkevarebygging og konsekvent markedsføring, er derfor alfa og omega. Det lønner seg å ha definerte verdier som bedriften kan stå inne for, og som er bærekraftige. Skal man etablere tillit, finnes det sjeldent snarveier og quick-fixes. Sørg for at verdiene som kommuniseres kan overholdes over tid, og styr unna tomme løfter. Ærlighet og transparens er høyt verdsatt fra et forbrukerperspektiv.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Hvordan kan Reflektor hjelpe deg som holder på med employer branding?",
      },
      {
        type: "avsnitt",
        tekst:
          "Som en utfordrer i bransjen av etablerte produksjonsselskaper, tilbyr Reflektor unike løsninger for deg som ønsker å jobbe med employer branding. Vi setter en ny standard for hva du kan forvente av pris og kvalitet, og hjelper deg med å skape engasjerende innhold som gjør det lettere å finne talentfulle ansatte til ditt team.",
      },
      {
        type: "avsnitt",
        tekst:
          "Våre dyktige produsenter har høy ekspertise innen både foto og videoproduksjon. I tillegg vil vi jobbe tett sammen med deg for å både forstå og kommunisere din bedrifts kjernevirksomhet, kultur og verdier.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    tilleggsfaq: [
      {
        sporsmal:
          "Hvor begynner man hvis man aldri har jobbet med employer branding før?",
        svar: "Med det dere allerede har. De fleste bedrifter har en arbeidsplass og folk som gjør noe andre ikke ser — det er råmaterialet. Begynn med å vise det, ikke med å formulere en verdiplattform. En kandidat tror på et bilde av lokalet før hun tror på en setning om kulturen.",
        lenker: [
          {
            sti: "/employer-branding-video-oslo",
            tekst: "film som viser arbeidsplassen",
          },
        ],
      },
    ],
    lesVidere: [
      {
        sti: "/employer-branding-video-oslo",
        tekst: "film som gjør folk til søkere",
      },
    ],
  },
  {
    slug: "hva-gjr-en-innholdsprodusent",
    bilde: {
      fil: "portrett-bat-1800",
      alt: "Person i oransje skjorte på en brygge ved sjøen",
    },
    tittel: "Hva gjør en innholdsprodusent?",
    beskrivelse:
      "Med innholdsmarkedsføring og hjelp av en innholdsprodusent kan du ta markedsføringen din til et nytt nivå. Men hva gjør en innholdsprodusent? Vi svarer!",
    publisert: "2024-06-28",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Med innhold i god kvalitet kan du svare på alt potensielle kunder lurer på, og differensiere deg fra konkurrentene.",
      },
      {
        type: "avsnitt",
        tekst:
          "De aller fleste av oss har, i likhet med majoriteten av forbrukere, beina godt plantet i det digitale landskapet. Her har vi tilgang til uendelig informasjon og innhold. Dette er både vel og bra fra et forbrukerperspektiv, men hvordan skal man kunne skille seg ut som bedrift og få innholdet sitt lagt merke til? Her kommer en innholdsprodusent som kan skape verdifullt innhold på en effektiv måte godt med. Ved å ha innhold av god kvalitet som svarer på alt det brukeren måtte lure på (og ikke visste at de lurte på) kan du differensiere deg og nå ut til riktig kundegruppe uten å være overdrevent salgsfokusert. I denne artikkelen går vi nærmere inn på hva en innholdsprodusent gjør, med særlig fokus på visuell innholdsproduksjon.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er en innholds­produsent?" },
      {
        type: "avsnitt",
        tekst:
          "Begrepet innholdsprodusent har blitt en stillingstittel man stadig støter på innen markedsføring. Men hva er egentlig en innholdsprodusent? Vi kan si at en innholdsprodusent er en som spesialiserer seg på å skape, administrere og distribuere digitalt innhold på tvers av ulike plattformer. Med andre ord er en innholdsprodusent en ressurs som kan jobbe veldig allsidig. Denne rollen har blitt helt avgjørende i den moderne digitale markedsføringsverdenen, hvor konkurransen om oppmerksomhet er høy og behovet for relevant og engasjerende innhold blir større og større. Innholdsprodusenter lønner seg derfor som ressurs til markedsføring.",
      },
      {
        type: "avsnitt",
        tekst:
          "En innholdsprodusent jobber med et bredt spekter av medier, inkludert tekst, bilder, video, lyd, og grafikk. De kan også spesialisere seg innenfor et eller flere av disse feltene, men uavhengig av feltet er en innholdsprodusents hovedoppgave å formidle et budskap som resonnerer med målgruppen og støtter bedriftens overordnede mål.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Fordelene med innholds­markedsføring og produksjon av innhold",
      },
      {
        type: "avsnitt",
        tekst:
          "Innholdsmarkedsføring har blitt en av de mest effektive strategiene for å kunne trekke til seg oppmerksomhet og engasjere målgrupper i dagens digitale landskap. Ved å produsere og distribuere relevant og verdifullt innhold jevnlig, kan bedriften din nyte godt av en rekke fordeler som styrker deres merkevare og driver forretningsvekst. Her har vi listet opp noen av de viktigste fordelene med innholdsmarkedsføring og produksjon av innhold:",
      },
      { type: "overskrift", niva: 3, tekst: "1. Økt synlighet og trafikk" },
      {
        type: "avsnitt",
        tekst:
          "En av de store og mest umiddelbare fordelene med innholdsmarkedsføring er økt synlighet på nettet. Ved å publisere innhold av god kvalitet som er optimalisert for søkemotorer (SEO), kan man gjøre seg synlig i søk på blant annet Google og dermed også bli funnet av potensielle kunder. Innhold som bloggartikler, videoer og infografikk gir også flere inngangsporter for søkemotorer å indeksere, noe som ytterligere påvirker søkerangeringene positivt.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "2. Bedre engasjement og kundelojalitet",
      },
      {
        type: "avsnitt",
        tekst:
          "Kvalitetsinnhold som treffer målgruppen kan også bidra til å styrke kunderelasjonen og bidra til økt lojalitet. Ved å tilby verdifull informasjon, underholdning eller en form for inspirasjon, kan du engasjere publikum på en helt unik måte som er vanskelig å få til uten godt innhold. Dette legger også grunnlag for en kommunikasjon som oppleves mer som dialog enn reklame.",
      },
      { type: "overskrift", niva: 3, tekst: "3. Økt konverterings­rate" },
      {
        type: "avsnitt",
        tekst:
          "Vi vet også at innholdsmarkedsføring kan ha en direkte positiv innvirkning på konverteringsraten. Informativt og nyttig innhold kan guide potensielle kunder gjennom kjøpsreisen ved å besvare eventuelle spørsmål og andre problemstillinger som gjør at de “sitter på gjerdet”. Dette kan innholdsprodusenten svare på ved å for eksempel demonstrere hvordan et produkt fungerer i en video, eller produsere en omfattende “How to”- guide. I tillegg kan godt innhold brukes til å lede brukeren videre til en mer transaksjonell side.",
      },
      { type: "overskrift", niva: 3, tekst: "4. Kostnads­­effektivitet" },
      {
        type: "avsnitt",
        tekst:
          "Sammenlignet med tradisjonelle markedsføringsmetoder, kan innholdsmarkedsføring ofte være mer kostnadseffektivt. Til tross for at det kan være tidkrevende å produsere høykvalitetsinnhold, har det som regel lang levetid samtidig som det kan brukes om igjen i mange ulike kanaler. For eksempel kan en velprodusert video fortsette å trekke til seg trafikk og generere leads i månedsvis, eller til og med årevis, etter at den ble publisert. Dette gir en bedre avkastning på investeringen (ROI) sammenlignet med å bruke hele markedsføringsbudsjettet på betalte annonser som slutter å virke så snart budsjettet er brukt opp.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "5. Hjelp til å oppnå langsiktige mål",
      },
      {
        type: "avsnitt",
        tekst:
          "Ved å produsere godt innhold jevnt og trutt, har du en markedsføringsinstans som genererer jevnlig avkastning. Velger du for eksempel å tegne en rammeavtale for produksjon av bilde- og videoinnhold med Reflektor, sikrer du kvalitet og kontinuitet i innholdsproduksjonen. Med et slikt partnerskap får du en helhetlig tilnærming hvor innholdet ikke bare dekker umiddelbare behov og kortvarige kampanjer, men også støtter bedriftens langsiktige mål.",
      },
      {
        type: "avsnitt",
        tekst:
          "Produserer du godt innhold jevnt og trutt, har du en markedsføringsinstans som genererer jevnlig avkastning.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva gjør en innholds­produsent i praksis?",
      },
      {
        type: "avsnitt",
        tekst:
          "En innholdsprodusent har en nøkkelrolle når det kommer til å skape og administrere innhold som effektivt engasjerer ulike målgrupper, og støtter bedriftens markedsføringsmål. I praksis omfatter dette en rekke oppgaver. Noen dominerende fokusområder er utvikling, strategi, gjennomføring og redigering av visuelt innhold som bilder og videoer. Innholdsprodusenten bistår gjerne i utviklingen av en omfattende innholdsstrategi som strekker seg fra alt fra identifisering av målgruppe og mål, til utarbeidelse av en innholdsplan for å sikre kontinuerlig publisering i riktige kanaler.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dersom det dreier seg om produksjon av visuelt innhold vil innholdsprodusenten som regel ta ansvar for fotografering og videografi, helt fra produksjonsfasen begynner. Dette innebærer planlegging av opptak, oppsett av lys og kamerautstyr, samt å sørge for at alt visuelt materiale er i tråd med bedriftens merkevareidentitet. Etter opptaket følger også gjerne en grundig redigeringsprosess, hvor innholdsprodusenten bruker avanserte redigeringsprogrammer for å få et optimalt resultat.",
      },
      {
        type: "avsnitt",
        tekst:
          "Videre innebærer innholdsproduksjonen å tilpasse innholdet til forskjellige plattformer og formater. Bilder og videoer må for eksempel optimaliseres i henhold til spesifikke krav for ulike sosiale medier som Instagram, Facebook og YouTube. Det samme gjelder dersom du ønsker å laste opp video på bedriftens egne nettside. Innholdsprodusenten sikrer også at alle visuelle elementer samsvarer med den eksisterende grafiske profilen, noe som styrker merkevaren og gir en helhetlig visuell identitet.",
      },
      {
        type: "avsnitt",
        tekst:
          "En innholdsprodusent kan ta seg av hele videoproduksjonen, fra strategisk planlegging til videografi og klipping.",
        lenker: [
          { frase: "videoproduksjonen", sti: "/videoproduksjon-i-oslo" },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Produksjon av bilde- og video­innhold",
      },
      {
        type: "avsnitt",
        tekst:
          "Vi har allerede etablert at produksjon av bilder og videoer av høy kvalitet er et eksepsjonelt godt virkemiddel for å nå ut til nye kunder og formidle et budskap. Dette arbeidet krever et bredt spekter av kompetanse i kombinasjon med en god forretningsforståelse. Et smidig samarbeid med en god forståelse av bedriftens langsiktige mål er helt alfa og omega. Derfor er det i de aller fleste tilfeller gunstig å inngå et partnerskap med en spesialisert leverandør for å sikre kvalitet, kontinuitet og optimert innhold med lang levetid.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvordan kan Reflektor hjelpe deg med innholds­produksjon?",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor kan bistå din bedrift med omfattende og skreddersydd innholdsproduksjon som ikke bare fanger oppmerksomhet hos publikum, men også engasjerer og konverterer den målgruppen du har satt deg. Våre innholdsprodusenter har et bredt spekter av kompetanse og faglig tyngde innen både bilde- og videoproduksjon, og tilbyr en helhetlig tilnærming til innholdsproduksjon som kombinerer kreativitet med strategisk forretningsforståelse. Gjennom et tett og smidig samarbeid, sikrer vi i Reflektor at produksjonen er i tråd med bedriftens mål fra A til Å. Samtidig kan du være trygg på at leveransen alltid er av høy kvalitet!",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    lesVidere: [
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
  },
  {
    slug: "hva-innebaerer-digital-historiefortelling",
    bilde: {
      fil: "scene-vegg",
      alt: "Foredragsholder foran en skjerm",
      fokus: "center 35%",
    },
    tittel: "Hva innebærer digital historiefortelling?",
    beskrivelse:
      "Med digital historieformidling kan du nå ut til riktig målgruppe og formidle budskap effektivt og virkningsfullt. Les mer om gode strategier her.",
    publisert: "2024-07-05",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Med digital historiefortelling kan du skape engasjement og vekke oppmerksomhet.",
      },
      {
        type: "avsnitt",
        tekst:
          "I dag er teknologien overalt, og preger en stor andel av all kommunikasjon og budskapsformidling. Uansett om du skal slappe av i sofaen en fredagskveld, jobbe på PC-en eller oppdaterer deg på vennegruppens bilder på Instagram, eksponeres du for digitalt innhold i alle former og fasonger.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dersom man holder på med markedsføring er det derfor helt essensielt å være til stede i det digitale landskapet. Men hva skal til for å skille seg ut i mengden av innhold? På vår blogg har vi samlet en rekke tips og nyttig innsikt om digital markedsføring. I denne artikkelen skal vi se nærmere på hva digital historiefortelling innebærer og hvordan man lykkes med digital fortelling!",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Digital historie­fortelling: Hva er det?",
      },
      {
        type: "avsnitt",
        tekst:
          "Digital historiefortelling omhandler kunsten å bruke digitale medier, som for eksempel bilde og video, for å formidle en historie. Dette kan være alt fra en enkel post på sosiale medier til en fullverdig dokumentarfilm. Kort forklart ligger selve kjernen i digital historiefortelling i evnen til å skape et narrativ som fenger og engasjerer publikum, og som formidler et budskap på en god og minneverdig måte.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Hvorfor digital historie­fortelling er effektivt innen reklame?",
      },
      {
        type: "avsnitt",
        tekst:
          "I en verden der det florerer av innhold på ulike flater, har digital historiefortelling blitt et uvurderlig verktøy for de som ønsker å formidle budskapet sitt effektivt og samtidig engasjere publikum. Gjennom foto, lyd og videoproduksjon kan vi ikke bare dokumentere informasjon, men også skape meningsfulle historier som berører publikum på et følelsesmessig nivå. Denne formen for historiefortelling er spesielt verdifull innen reklame, hvor konkurransen om brukerens oppmerksomhet stadig blir mer og mer intens.",
      },
      { type: "overskrift", niva: 3, tekst: "Historie møter teknologi" },
      {
        type: "avsnitt",
        tekst:
          "Historiefortelling er en gammel kunstform som har utviklet seg gjennom tidene. Mange ser kanskje for seg en liten gruppe mennesker som forteller sagn og eventyr rundt leirbålet når man hører begrepet historiefortelling. Andre tenker muligens på skriftlig dokumentasjon som romaner og noveller. Per i dag foregår imidlertid en stor del av all historiefortelling på digitale plattformer, og måten vi forteller historier på endret seg drastisk. Med digital historiefortelling kan vi dra nytte av dagens teknologi for å gjøre historiene både mer tilgjengelige og engasjerende, samtidig som dette formatet legger til rette for en mer interaktiv og dynamisk form for kommunikasjon.",
      },
      {
        type: "avsnitt",
        tekst:
          "Å appellere til publikums følelser er en viktig del av god historieformidling.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Grunnleggende elementer i historie­formidling",
      },
      {
        type: "avsnitt",
        tekst:
          "For å lykkes med digital fortelling, er det en god idé å gjøre seg kjent med de grunnleggende elementene som utgjør en god historie og hvordan dette kan tilpasses et digitalt format.",
      },
      { type: "overskrift", niva: 3, tekst: "Karakterer" },
      {
        type: "avsnitt",
        tekst:
          "Mennesker relaterer seg best til andre mennesker. Å introdusere karakterer i historien din, enten de er ekte eller fiktive, kan hjelpe til med å bygge en forbindelse med publikum. Det vil si; har du for eksempel med mennesker i reklamefilmen din som folk kan kjenne seg igjen i, vil dette kunne gjøre deg som avsender mer troverdig.",
      },
      { type: "overskrift", niva: 3, tekst: "Konflikt" },
      {
        type: "avsnitt",
        tekst:
          "En god historie inneholder som regel en form for konflikt eller utfordring som karakterene må overvinne. Dette skaper spenning og holder publikum engasjert. Det betyr ikke nødvendigvis at du behøver å iscenesette en slåsskamp hvis du planlegger å produsere en Instagram-Reel for å promotere et produkt. Det er likevel et godt dramaturgisk grep å presentere en underliggende problemstilling, både for å skape engasjement og videre kunne presentere en løsning på problemet.",
      },
      { type: "overskrift", niva: 3, tekst: "Løsning" },
      {
        type: "avsnitt",
        tekst:
          "Som et svar til punktet over, bør historien lede til en løsning som gir mening og tilfredsstillelse for publikum. Selger du et produkt, kan det være så enkelt som at nettopp dette produktet er løsningen. I en holdningskampanje kan dette for eksempel inkludere en oppfordring til handling (Call to Action) som inviterer publikum til å engasjere seg videre.",
      },
      { type: "overskrift", niva: 3, tekst: "Emosjonell kontakt" },
      {
        type: "avsnitt",
        tekst:
          "God historiefortelling berører både hjertet og sinnet. Ved å inkludere elementer som vekker følelser, kan du skape en dypere forbindelse med publikum. Dette prinsippet kjenner kanskje mange igjen fra retorikkens pathos, et virkemiddel som brukes flittig i alt fra politiske taler til storslåtte Hollywood-filmer. Innenfor denne kategorien finner vi imidlertid mange ulike måter å appellere til mottakerens følelser. Det kan for eksempler dreie seg om tårevåte filmsnutter, vittige kommentarer, spennende musikk eller strategisk fargebruk.",
      },
      { type: "overskrift", niva: 3, tekst: "Visuell og auditiv appell" },
      {
        type: "avsnitt",
        tekst:
          "Når det kommer til digital historiefortelling, er kvaliteten på bilder, video og lyd helt avgjørende. Dette kan nemlig forsterke budskapet ditt, mens lav kvalitet og dårlig oppløsning derimot kan svekke det. Visuelle og auditive elementer er altså viktig for å gjøre historien mer levende og engasjerende.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Markeds­føring og strategiske virkemidler",
      },
      {
        type: "avsnitt",
        tekst:
          "I markedsføring handler det om å skille seg ut og skape et varig inntrykk. Digital historiefortelling tilbyr en unik mulighet til å gjøre nettopp dette. Ved bruk av foto og video kan du styrke merkevarens identitet og tilknytningen til publikum.",
      },
      {
        type: "overskrift",
        niva: 3,
        tekst: "Implementering av digitale strategier for historie­formidling",
      },
      {
        type: "avsnitt",
        tekst:
          "En effektiv digital strategi er avgjørende for å utnytte digital historiefortelling i markedsføring. Dette omfatter blant annet:",
      },
      {
        type: "liste",
        punkter: [
          "Valg av plattform Velg de riktige plattformene for å nå ditt publikum. Hver plattform har sine unike fordeler og brukermønstre.",
          "Innholdsplanlegging Planlegg innholdet ditt nøye. Bestem hvilke historier som skal fortelles, og hvordan de skal distribueres.",
          "Engasjement Oppfordre til interaksjon og engasjement ved bruk av gode CTA’s (handlingsoppfordringer). Dette bidrar til å bygge en lojal følgerbase og øker rekkevidden av historien, altså innholdet ditt.",
        ],
      },
      { type: "overskrift", niva: 3, tekst: "Bruk av appellformer" },
      {
        type: "avsnitt",
        tekst:
          "For å engasjere publikum effektivt i din digitale fortelling, er det smart å være klar over og utnytte retorikkens ulike appellformer. Her er en kort forklaring av de tre appellformene:",
      },
      {
        type: "liste",
        punkter: [
          "Logos: Bruk av logiske argumenter og fakta for å overbevise publikum.",
          "Pathos: Apellér til følelser for å skape en sterkere emosjonell forbindelse.",
          "Ethos: Bygg troverdighet ved å utvise ekspertise og pålitelighet.",
        ],
      },
      { type: "overskrift", niva: 3, tekst: "Visuelle digitale virkemidler" },
      {
        type: "avsnitt",
        tekst:
          "Visuelle virkemidler spiller en sentral rolle i den digitale historiefortellingen. For eksempel er følgende noen av de mest effektive:",
      },
      {
        type: "liste",
        punkter: [
          "Bildespråk: Bruk bilder som forteller en historie i seg selv. Et godt bilde kan, som kjent, si mer enn tusen ord!",
          "Videografi: Videoer kan fange oppmerksomheten raskt og formidle komplekse budskap på en måte som er lettfordøyelig.",
          "Lyd: Musikk og lydeffekter kan forsterke den emosjonelle effekten av historien.",
          "Grafisk design: Bruk av grafiske elementer kan gjøre innholdet mer visuelt tiltalende og lett å forstå seg på.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst:
          "Tips for å lykkes med historie­fortelling på digitale plattformer",
      },
      {
        type: "avsnitt",
        tekst:
          "For å lykkes med å formidle historier digitalt er det først og fremst viktig å kjenne publikumet sitt. Du må forstå hvem de er, hva de bryr seg om, og hvordan de kommuniserer, slik at du kan tilpasse budskapet ditt for å møte deres interesser og verdier.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er også viktig å være konsekvent i kommunikasjonen. Sørg for at alle dine digitale historier er i tråd med merkevarens stemme og visuelle identitet for å bygge gjenkjennelighet og tillit.",
      },
      {
        type: "avsnitt",
        tekst:
          "Du bør også investere i kvalitetsinnhold, som høyoppløselige bilder og videoer, da godt innhold bidrar til at du skiller deg ut i mengden og etterlater et profesjonelt inntrykk.",
      },
      {
        type: "avsnitt",
        tekst:
          "I Reflektor mestrer vi fortellerkunsten gjennom foto og video. Vi kan hjelpe deg med å ikke bare fange publikums oppmerksomhet, men også skape varige forbindelser som styrker merkevaren din. Se våre tjenester for en oversikt over alt vi tilbyr!",
        lenker: [
          {
            frase: "Se våre tjenester for en oversikt over alt vi tilbyr",
            sti: "/innholdsproduksjon",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Trenger din bedrift en fotograf eller videograf?",
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter ønsker å bli sett av kundene sine. Sørg for at det de ser er noe du kan være stolt av - bilder og videoer du vet fører til salg. Vi setter oss godt inn i hva bedriften din står for, hvordan vi kan trigge publikumet ditt til å gjennomføre handel, booke bord, bestille time eller bli informert.",
      },
      {
        type: "avsnitt",
        tekst:
          "Reflektor er et SoMe-byrå i Oslo med fast pris. Abonnementet koster 30 000 kr/mnd og dekker strategi, én produksjonsdag i måneden, 8–10 videoer og publisering to ganger i uka på Instagram med krysspublisering til Facebook. Les mer om abonnementet.",
        // Setningen ba om et klikk som ikke fantes. Nå gjør den det.
        lenker: [{ frase: "Les mer om abonnementet", sti: "/#pris" }],
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva skiller en historie fra en vanlig produktvideo?",
        svar: "Hvem den handler om. En produktvideo handler om tingen. En historie handler om noen som gjorde noe, og produktet er med fordi det var der. Det siste er vanskeligere å lage og lettere å huske — og det krever at noen faktisk er til stede med kamera mens det skjer.",
        lenker: [
          { sti: "/videoproduksjon-i-oslo", tekst: "film til egne flater" },
        ],
      },
    ],
    lesVidere: [
      { sti: "/videoproduksjon-i-oslo", tekst: "film til nettside og skjerm" },
    ],
  },
  {
    slug: "some-ansvarlig-eller-byra",
    bilde: {
      fil: "stallen-team-1800",
      alt: "Restaurantteam som holder fram en Michelin-plakett",
    },
    tittel: "SoMe-ansvarlig eller byrå? Regnestykket med tall",
    beskrivelse:
      "Hva koster en ansatt SoMe-ansvarlig når arbeidsgiveravgift, feriepenger og pensjon er regnet med? Tallene fra Altinn og SSB mot et byråbudsjett.",
    publisert: "2026-09-21",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En ansatt koster 20–30 prosent mer enn lønnen. Det er tommelfingerregelen Altinn oppgir, og den er grunnen til at sammenligningen mellom å ansette og å sette bort sjelden går som folk tror. Her er regnestykket med tall fra offentlige kilder, og en ærlig gjennomgang av hva de to alternativene faktisk gir.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster en ansatt egentlig?",
      },
      {
        type: "avsnitt",
        tekst:
          "Lønnen er ikke kostnaden. Altinn regner et eksempel med 600 000 kroner i avtalt årslønn, og lander på 764 410 kroner i faktisk kostnad for arbeidsgiver. Differansen er 164 410 kroner, eller 27 prosent, og den består av fire poster som ikke er valgfrie.",
      },
      {
        type: "tabell",
        kolonner: ["Post", "Kroner"],
        rader: [
          ["Avtalt årslønn", "600 000"],
          ["Feriepenger, 12 %", "65 077"],
          ["Arbeidsgiveravgift, 14,1 %", "85 641"],
          ["Pensjon (OTP), 2 %", "12 000"],
          ["Arbeidsgiveravgift av pensjonen", "1 692"],
          ["Faktisk kostnad", "764 410"],
        ],
      },
      {
        type: "kilde",
        tekst:
          "Eksempelet og satsene er hentet fra Altinns oversikt «Hva koster en arbeidstaker». Arbeidsgiveravgiften varierer fra 0 prosent i deler av Troms og Finnmark til 14,1 prosent, som er satsen de fleste bedrifter betaler. Feriepengesatsen er 10,2 eller 12 prosent, avhengig av om ferien følger ferielovens minstekrav eller er avtalt til fem uker.",
        url: "https://info.altinn.no/starte-og-drive/arbeidsforhold/ansettelse/hva-koster-en-arbeidstaker/",
      },
      {
        type: "avsnitt",
        tekst:
          "764 410 kroner i året er 63 700 kroner i måneden. Og det er før utstyr, programvare, kontorplass, kursing og den tiden noen i bedriften bruker på å lede, følge opp og rekruttere.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Er 600 000 et realistisk lønnsnivå?",
      },
      {
        type: "avsnitt",
        tekst:
          "Det ligger under medianen. SSB oppgir en medianlønn i Norge på 55 800 kroner i måneden og et gjennomsnitt på 62 070 — altså 669 600 og 744 840 kroner i året for alle ansatte sett under ett. Eksempelet på 600 000 er lavere enn begge, og regnestykket er dermed konservativt: setter dere inn et høyere og mer realistisk lønnsnivå, blir forskjellen større, ikke mindre.",
      },
      {
        type: "kilde",
        tekst:
          "Lønnstallene er fra Statistisk sentralbyrå. Vi oppgir bevisst ikke et lønnsnivå for SoMe-ansvarlige spesifikt — stillingstittelen finnes ikke som egen kategori i SSBs statistikk, og tallene som sirkulerer for den rollen kommer fra kilder uten samme etterprøvbarhet.",
        url: "https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader/artikler/hva-er-vanlig-lonn-i-norge",
      },
      {
        type: "avsnitt",
        tekst:
          "Poenget er heller ikke det eksakte lønnsnivået. Poenget er påslaget: uansett hvilket tall dere setter inn, legger arbeidsgiveravgift, feriepenger og pensjon på rundt 27 prosent.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster et byrå?",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er et vanskeligere spørsmål å besvare, fordi de fleste byråer ikke oppgir pris. Reflektor gjør det: 30 000 kroner i måneden, altså 360 000 i året, for én produksjonsdag i måneden, 8–10 ferdige videoer og publisering to ganger i uken.",
        lenker: [{ frase: "30 000 kroner i måneden", sti: "/#pris" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Det er mindre enn halvparten av kostnaden i eksempelet over. Men de to leveransene er ikke like, og det er den viktigste delen av sammenligningen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva får dere — og hva får dere ikke?",
      },
      {
        type: "tabell",
        kolonner: ["Hva", "Ansatt", "Abonnement"],
        rader: [
          ["Til stede i kanalene hver dag", "ja", "nei"],
          ["Svarer i kommentarfelt og meldinger", "ja", "nei"],
          ["Stories og løpende publisering", "ja", "delvis"],
          ["Profesjonelt kamerautstyr", "må kjøpes", "inngår"],
          ["Flere fagfelt dekket", "én person", "team"],
          ["Sykefravær og ferie", "deres risiko", "vår risiko"],
          ["Bindingstid", "arbeidsavtale", "tre måneders oppsigelse"],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "En ansatt er til stede. Det er den reelle forskjellen, og den er ikke liten. Trenger dere noen som svarer i kommentarfeltet innen en time, legger ut stories fra en messe samme ettermiddag og kjenner bedriften innenfra, er ansettelse det riktige valget. Ingen leverandør kan erstatte det.",
      },
      {
        type: "avsnitt",
        tekst:
          "Men en ansatt SoMe-ansvarlig skal som regel beherske strategi, foto, video, klipping, fargekorrigering, tekst og publisering alene. Det er flere fagfelt, og de færreste er sterke i alle. Resultatet blir ofte mobilinnhold laget mellom andre oppgaver — og da er det ikke 764 410 kroner mot 360 000, men 764 410 kroner mot et bedre produkt til under halve prisen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Når er ansettelse riktig?",
      },
      {
        type: "liste",
        punkter: [
          "Dere trenger daglig tilstedeværelse i kanalene, ikke bare innhold",
          "Dialogen med kundene er en del av produktet, ikke et vedlegg",
          "Volumet er så høyt at en ekstern produksjonsdag i måneden ikke rekker",
          "Dere har allerede noen som kan filme og klippe, og trenger en som styrer",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Når er byrå riktig?",
      },
      {
        type: "liste",
        punkter: [
          "Problemet er at det ikke produseres nok godt innhold, jevnt nok",
          "Dere vil ha profesjonell kvalitet uten å kjøpe utstyr og kompetanse",
          "Budsjettet skal være forutsigbart, uten rekruttering og opplæring",
          "Dere vil kunne snu i løpet av tre måneder hvis det ikke fungerer",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Mange gjør begge deler",
      },
      {
        type: "avsnitt",
        tekst:
          "Den vanligste løsningen er ikke enten–eller. En markedsansvarlig som allerede jobber der, håndterer dialogen, kjenner kundene og legger strategien — og produksjonen settes bort. Da betaler dere for det som faktisk er vanskelig å gjøre selv, og beholder det som krever å være innenfor.",
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "Reflektors pris og leveranse, oppgitt åpent" },
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
  },
  /*
   * FØRSTE ARTIKKEL SKREVET FOR DEN NYE SIDEN, 29.09.2026.
   *
   * De ni andre er migrert ordrett fra Squarespace. Denne er ikke — den er
   * skrevet her, etter at bloggjennomgangen viste hva som mangler. Pål
   * godkjente temaet og oppga prisen: «ja. 40K.»
   *
   * HVORFOR AKKURAT DENNE FØRST. «hva koster videoproduksjon bedrift» har
   * 50 søk i måneden og ren kjøpsintensjon — det er søket som kommer rett
   * før en henvendelse. Og Reflektor oppgir prisen åpent, noe nesten ingen
   * andre norske byråer gjør. Det gir en artikkel som faktisk kan svare på
   * spørsmålet i stedet for å be leseren ta kontakt for å få vite.
   *
   * DEN KANNIBALISERER IKKE /videoproduksjon-i-oslo, som har det nesten
   * likelydende FAQ-spørsmålet «Hva koster videoproduksjon for bedrift?».
   * Arbeidsdelingen er den samme som mellom hva-koster-et-some-byra og
   * /sosiale-medier-byra: tjenestesiden svarer på hva det koster HOS OSS,
   * artikkelen på hva det koster I MARKEDET og hvordan man leser et tilbud.
   * Artikkelen lenker til siden; siden eier det kommersielle søket.
   *
   * ALLE TALL ER HENTET, IKKE HUSKET. De tre prisguidene er lest
   * 29.09.2026 og tallene sitert slik de står. At de er uenige er ikke en
   * svakhet ved kildene — det er hele poenget med tabellen, og det er den
   * eneste opplysningen i artikkelen en leser ikke får noe annet sted.
   *
   * REFLEKTORS EGNE TALL KOMMER FRA `tilbud` i site.ts og skrives ikke inn
   * for hånd. En pris som står i klartekst i en bloggartikkel er en pris
   * som blir stående når den endres.
   */
  {
    slug: "hva-koster-videoproduksjon",
    bilde: {
      fil: "drone-1600",
      alt: "Droneopptak over et hotellanlegg med utendørs basseng",
    },
    tittel: "Hva koster videoproduksjon for en bedrift?",
    beskrivelse:
      "Tre norske prisguider oppgir helt ulike tall. Her er hva de faktisk sier, hva som driver prisen, og hva vi selv tar: fra 40 000 kr per prosjekt.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst: `Kort svar: et enkelt videoprosjekt for en bedrift ligger som regel mellom 25 000 og 50 000 kroner. En reklamefilm med konsept, et profesjonelt team og flere leveranseformater koster oftest fra 50 000 til 200 000. Hos oss starter enkeltprosjekter på ${kr(tilbud.fraPrisProsjekt)} kr.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Det er det korte svaret. Det lange er mer nyttig, for tallene over er hentet fra prisguider som er uenige med hverandre — og uenigheten forteller deg mer om markedet enn noen av tallene gjør alene.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva de norske prisguidene faktisk oppgir",
      },
      {
        type: "avsnitt",
        tekst:
          "Tre norske aktører har publisert priser på videoproduksjon i 2026. Slik står tallene hos dem:",
      },
      {
        type: "tabell",
        kolonner: ["Kilde", "Enkel produksjon", "Standard", "Stor produksjon"],
        rader: [
          [
            "Artisan Film, prisguide 2026",
            "15 000–40 000 kr",
            "40 000–120 000 kr",
            "120 000–500 000 kr+",
          ],
          [
            "Ingstad Media, april 2026",
            "25 000–50 000 kr",
            "50 000–200 000 kr",
            "fra 200 000 kr",
          ],
          ["Byråmatch, mai 2026", "—", "50 000–150 000 kr", "flere millioner"],
        ],
      },
      {
        type: "kilde",
        tekst:
          "Artisan Film oppgir 15 000–40 000 kr for enkelt innhold til sosiale medier, 40 000–120 000 kr for standard reklame- eller bedriftsfilm med 1–2 opptaksdager, og 120 000–500 000 kr og oppover for større produksjoner.",
        url: "https://www.artisanfilm.no/prisguide-2026",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Ingstad Media oppgir 25 000–50 000 kr for én lokasjon med kort opptakstid og enkel etterproduksjon, 50 000–200 000 kr for konsept og profesjonelt team, og fra 200 000 kr for kampanjer med casting og studio.",
        url: "https://ingstadmedia.no/blogg/hva-koster-reklamefilm",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Byråmatch oppgir at en enkel produktvideo kan koste fra 50 000 til 150 000 kroner, og at mer omfattende reklamekampanjer med høy produksjonsverdi kan koste flere millioner.",
        url: "https://www.xn--byrmatch-c0a.no/fagbloggen/reklamefilm-produksjon-for-bedrifter",
      },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til hvor lite de er enige om. Den ene kaller 50 000 kroner en enkel produktvideo. Den andre kaller det en standard reklamefilm. Den tredje legger hele det enkle nivået under 40 000. Det er ikke fordi noen tar feil — det er fordi «videoproduksjon» ikke er én tjeneste, og et tall uten en leveranse ved siden av betyr ingenting.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den praktiske konsekvensen: to tilbud du har fått på samme film kan være riktig priset begge to, og likevel handle om helt forskjellig arbeid. Jobben din er ikke å finne den laveste prisen, men å finne ut hva de to tilbudene faktisk inneholder.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Fire poster som flytter prisen mest",
      },
      {
        type: "liste",
        punkter: [
          "Antall produksjonsdager. Én dag på lokasjon er den største enkeltposten i de fleste tilbud. To dager er sjelden dobbelt så dyrt, men det er alltid dyrere.",
          "Hvor mange som må være til stede. Én person med kamera koster én ting. Fotograf, lydtekniker, regissør og lyssetter koster noe annet — og noen filmer krever det.",
          "Lokasjon og medvirkende. Leid lokale, skuespillere og statister er poster som legges oppå produksjonen, og de kan fort bli de tyngste.",
          "Hvor mye etterarbeid filmen krever. Klipp og farge på en enkel film er timer. Animasjon, grafikk, voice-over og musikk som må klareres, er dager.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Kompleksitet i etterarbeidet er den posten folk undervurderer oftest. Selve opptaket er en dag du kan se; etterarbeidet er en uke du ikke ser.",
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/kjeder-peppes",
            format: "16/9",
            alt: "Stillbilde fra reklamefilmen: to personer spiser pizza i en sofa",
          },
          {
            slag: "film",
            sti: "/arbeid/kjeder-vitusapotek",
            format: "16/9",
            alt: "Stillbilde fra sponsorvignetten: to dansere på et parkettgulv",
          },
        ],
        bildetekst:
          "To ferdige reklamefilmer, 15 og 4 sekunder. Lengden sier lite om prisen — antall opptaksdager og mengden etterarbeid gjør.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Slik får dere prisen ned uten å kutte i kvaliteten",
      },
      {
        type: "avsnitt",
        tekst:
          "To av de fire postene over kan dere ta selv, og det er de to som ofte veier mest på en reklamefilm.",
      },
      {
        type: "liste",
        punkter: [
          "Hold lokasjonen selv. Egne lokaler, en butikk, et lager eller en kundes lokaler koster ingenting å leie.",
          "Still med egne folk. Ansatte foran kamera i stedet for skuespillere gjør filmen billigere — og som regel mer troverdig.",
          "Samle flere leveranser på samme dag. Er teamet først rigget, koster den femte filmen langt mindre enn den første.",
          "Bestem formatene på forhånd. Skal filmen brukes både på nettsiden, i annonser og på Instagram, er det billigere å planlegge for det enn å klippe om i etterkant.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Fem spørsmål som gjør tilbudene sammenlignbare",
      },
      {
        type: "liste",
        punkter: [
          "Hvor mange opptaksdager ligger inne i prisen?",
          "Hvor mange ferdige filmer får vi, og i hvilke formater?",
          "Hvem står på settet — egne ansatte eller innleide frilansere?",
          "Hvor mange runder med endringer er inkludert før det koster ekstra?",
          "Hvem eier det ferdige materialet, og hva kan vi bruke det til?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Spørsmål fire er det som oftest mangler i et tilbud, og det som oftest utløser en ekstraregning. Spør om det skriftlig.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva tar Reflektor for et videoprosjekt?",
      },
      {
        type: "avsnitt",
        tekst: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Hva et prosjekt faktisk lander på avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.`,
        lenker: [{ frase: "Enkeltprosjekter", sti: "/reklamefilm" }],
      },
      {
        type: "avsnitt",
        tekst: `Trenger dere innhold jevnlig og ikke én gang, er løpende samarbeid ${kr(tilbud.prisPerManed)} kr i måneden. Det er fast pris, med én produksjonsdag hver måned og et produksjonsmål på ${tilbud.videoerPerManed} ferdig redigerte videoer. Vi bruker ikke timepriser.`,
        lenker: [{ frase: "løpende samarbeid", sti: "/" }],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Én film eller løpende produksjon?",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er dette valget som avgjør regnestykket, ikke prisen på den enkelte filmen.",
      },
      {
        type: "tabell",
        kolonner: ["", "Enkeltprosjekt", "Løpende samarbeid"],
        rader: [
          [
            "Passer når",
            "Dere har én konkret film som skal lages",
            "Dere trenger nytt innhold hver måned",
          ],
          [
            "Pris",
            `fra ${kr(tilbud.fraPrisProsjekt)} kr`,
            `${kr(tilbud.prisPerManed)} kr/mnd`,
          ],
          [
            "Leveranse",
            "Avtalt omfang, én gang",
            `${tilbud.videoerPerManed} videoer i måneden`,
          ],
          ["Binding", "Ingen", "Tre måneders oppsigelse, ingen bindingstid"],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "En enkelt film dekker ett budskap på ett tidspunkt. Skal dere være synlige gjennom året, blir fire enkeltprosjekter dyrere enn tolv måneder med løpende produksjon — og det er som regel der regnestykket faktisk avgjøres.",
      },
    ],
    lesVidere: [
      { sti: "/reklamefilm", tekst: "hva en reklamefilm fra Reflektor koster" },
      {
        sti: "/videoproduksjon-i-oslo",
        tekst: "videoproduksjon i Oslo, med priser og leveranse",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvorfor spriker tilbudene så mye på den samme filmen?",
        svar: "Fordi «en film» ikke er en definert leveranse. Det ene tilbudet kan være én person med kamera i tre timer og en enkel klipp. Det andre kan være et team på fire, to opptaksdager, manus, farge, lyd og fem ferdige formater. Begge er reklamefilm. Be om antall opptaksdager, antall folk på settet og antall ferdige leveranser skriftlig — da blir prisene sammenlignbare med én gang.",
      },
      {
        sporsmal: "Kommer annonsebudsjett i tillegg til produksjonsprisen?",
        svar: "Ja, hos de aller fleste. Produksjonsprisen dekker å lage filmen. Skal den vises som annonse på Facebook, Instagram, YouTube eller TV, betaler dere visningene separat, og de pengene går til plattformen — ikke til produsenten. Regn det som en egen post når dere setter budsjettet, og avklar hvem som skal sette opp og følge annonsen.",
      },
    ],
  },
  /*
   * SKREVET 29.09.2026. Innlegg nummer 2 i lista i docs/blogg-gjennomgang.md.
   *
   * HVORFOR DEN IKKE BRYTER FORBUDET MOT «HVA ER X»-ARTIKLER. AGENTS.md
   * regel 3 forbyr flere ordbok- og skoleoppgavetekster — personas,
   * virkemidler i reklame, holdningskampanje. Dette er ikke et oppslagsord:
   * produksjonsdagen er enheten hele tilbudet og hele prisen er bygget på,
   * og den forklares ikke noe sted utenfor FAQ-svarene. En språkmodell som
   * ikke forstår enheten, kan heller ikke gjengi prisen riktig.
   *
   * ALLE FAKTA ER HENTET FRA GODKJENTE SVAR, ikke skrevet på nytt: FAQ-en i
   * faq.ts og tjenester.ts, og tallene i `tilbud`. Ingen ny påstand om hva
   * som skjer på en produksjonsdag er funnet på her.
   *
   * OVERSKRIFTENE ER MED VILJE IKKE DE SAMME som FAQ-spørsmålene på
   * tjenestesidene og /faq. «Hvor mye tid må vi sette av?» og «Trenger vi
   * eget kamera eller utstyr?» eies av /faq, og vakten i tests/faq.test.ts
   * feiler hvis en artikkeloverskrift gjentar dem.
   */
  {
    slug: "hva-er-en-produksjonsdag",
    bilde: {
      fil: "produksjonsdag-rigg-1600",
      alt: "Kamera montert på rigg over et bord med bakverk under en produksjonsdag",
    },
    tittel: "Hva er en produksjonsdag?",
    beskrivelse:
      "Én dag, ett team, en måned med innhold. Hva som skjer før, under og etter — og hva dere sitter igjen med når dagen er over.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst: `En produksjonsdag er én dag der et filmteam kommer til dere og produserer innholdet for en hel måned. Hos oss er produksjonsmålet ${tilbud.videoerPerManed} ferdig redigerte videoer fra den ene dagen, og selve dagen tar som regel noen timer — ikke hele arbeidsdagen.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Enheten er verdt å forstå, for det er den prisen er bygget på. Et tilbud på innhold som ikke sier hvor mange produksjonsdager som inngår, sier egentlig ingenting.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvorfor innhold produseres i dager og ikke i timer",
      },
      {
        type: "avsnitt",
        tekst:
          "Det meste av kostnaden ved en filmproduksjon ligger i å komme i gang. Teamet skal reise, utstyret skal rigges, lyset skal settes, og lokalet skal gjøres klart. Den jobben er den samme enten det skal lages én film eller ti.",
      },
      {
        type: "avsnitt",
        tekst:
          "Derfor er den femte filmen på en dag mye billigere enn den første. Og derfor er en dag den enheten som gir mest innhold per krone — forutsatt at dagen er planlagt for det.",
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/bts-baker-brun",
            format: "9/16",
            alt: "Stillbilde fra opptak: kamera på rigg over et bord med kaker",
          },
          {
            slag: "film",
            sti: "/arbeid/bts-anton-sport",
            format: "9/16",
            alt: "Stillbilde fra opptak: filmfotograf med kamera på gimbal ute om høsten",
          },
        ],
        bildetekst:
          "Bak kulissene fra to produksjonsdager: Baker Brun innendørs, Anton Sport på lokasjon.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva som skjer i forkant",
      },
      {
        type: "avsnitt",
        tekst:
          "Dagen er planlagt før noen slår på et kamera. Vi går gjennom det dere allerede har publisert og måler hva som faktisk har fungert — hvilke formater, lengder og motiver som får rekkevidde. Et typisk grunnlag er rundt hundre publiseringer over fire måneder.",
      },
      {
        type: "avsnitt",
        tekst:
          "Funnene blir til navngitte innholdsserier med konkrete filmer, og de blir til en kjøreplan dere får på forhånd. Kjøreplanen sier hvem som skal være med, hvor vi filmer, og hva som eventuelt må klargjøres før vi kommer.",
        lenker: [
          { frase: "navngitte innholdsserier", sti: "/innholdsproduksjon" },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva som skjer mens vi er der",
      },
      {
        type: "liste",
        punkter: [
          "Vi stiller med alt: kamera, objektiver, lys, lyd og stativ. Dere trenger ikke eget utstyr.",
          "Vi filmer som regel hos dere. Det er der folkene, produktene og lokalene er, og det er det som gjør innholdet gjenkjennelig.",
          "Vi filmer de som faktisk jobber der, og helst ikke bare ledelsen. Vi bruker ikke skuespillere.",
          "Vi rigger om mellom oppsettene etter kjøreplanen, slik at én dag dekker flere serier og ikke bare én.",
          "Stillbilder tas ved behov, ikke som en fast leveranse. Kapasiteten deles med video, og derfor er videotallet et produksjonsmål og ikke en garanti.",
        ],
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "foto",
            sti: "/arbeid/produksjonsdag-skjerm-1600",
            format: "16/9",
            alt: "Skjerm på settet som viser bildet som akkurat er tatt",
          },
        ],
        bildetekst:
          "Bildet går rett på skjerm mens det tas. Da ser alle det samme, og feil oppdages på settet og ikke i etterarbeidet.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva dagen gir",
      },
      {
        type: "avsnitt",
        tekst: `Alt klippes, fargekorrigeres og tekstes i etterarbeid. Vi leverer som regel innen to uker etter opptaksdagen. Haster deler av leveransen, sier dere fra i planleggingen, så legger vi opp dagen etter det.`,
      },
      {
        type: "tabell",
        kolonner: ["", "Én produksjonsdag", "Tolv produksjonsdager"],
        rader: [
          ["Ferdige videoer", `${tilbud.videoerPerManed}`, "rundt hundre"],
          [
            "Publiseringer",
            `${tilbud.posterPerUke} i uka i fire uker`,
            "over hundre",
          ],
          ["Tidsbruk hos dere", "noen timer", "én dag i måneden"],
          [
            "Pris",
            `${kr(tilbud.prisPerManed)} kr`,
            `${kr(tilbud.prisPerManed * 12)} kr`,
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Videoene leveres stående i 9:16. Skal noe brukes på skjerm i butikk, i en annonse, på nettsiden eller på trykk, tilpasser vi det eller produserer for det — si fra i planleggingen, så er det med i kjøreplanen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva dere må stille med",
      },
      {
        type: "avsnitt",
        tekst:
          "Dere selv, og det som skal vises: produktene, lokalene, menneskene. Ikke utstyr, ikke filmkompetanse internt, ikke manus. Står det noe dere må klargjøre eller bestille før vi kommer, står det i kjøreplanen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Når én dag i måneden ikke strekker til",
      },
      {
        type: "avsnitt",
        tekst: `Leveransen skalerer med antall produksjonsdager. Én dag i måneden gir ${tilbud.videoerPerManed} ferdige videoer til ${kr(tilbud.prisPerManed)} kr/mnd. Trenger dere mer, koster hver ekstra produksjonsdag ${kr(tilbud.ekstraProduksjonsdag)} kr, og publiseringsfrekvensen økes tilsvarende.`,
        lenker: [
          {
            frase: "Leveransen skalerer med antall produksjonsdager",
            sti: "/",
          },
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Har dere flere lokasjoner eller avdelinger, kan produksjonsdagene fordeles på ulike steder i stedet for å legges på samme adresse.",
        lenker: [
          { frase: "flere lokasjoner eller avdelinger", sti: "/kjeder" },
        ],
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "abonnementet produksjonsdagen inngår i" },
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Blir ikke alt likt når det filmes på samme dag?",
        svar: "Det er den vanligste innvendingen, og den er berettiget hvis dagen ikke er planlagt. Derfor rigger vi om mellom oppsettene: ulike lokasjoner i bygget, ulike personer, ulike motiver og ulike lengder. Kjøreplanen er bygget rundt flere innholdsserier, ikke én. Klær, lys og bakgrunn varierer med oppsettet, og materialet publiseres over fire uker — ikke samme uke.",
      },
      {
        sporsmal: "Må vi stenge mens dere filmer?",
        svar: "Nei. Vi filmer som regel mens driften går som normalt, og det er ofte det som gjør innholdet troverdig. Er det et oppsett som krever ro eller et tomt lokale, legger vi det til et tidspunkt som passer — før åpning, etter stengetid eller i en rolig time. Det avklares i kjøreplanen dere får på forhånd, slik at ingen blir overrasket på dagen.",
      },
    ],
  },
  /*
   * SKREVET 29.09.2026. Innlegg nummer 3 i lista i docs/blogg-gjennomgang.md.
   *
   * HVORFOR DEN FINNES. `some-ansvarlig-eller-byra` er den beste teksten på
   * nettstedet, men den stiller et spørsmål med to svar — og de fleste
   * vurderer tre. Frilanseren er alternativet som mangler, og det er som
   * regel det billigste på papiret.
   *
   * DEN GJENTAR IKKE REGNESTYKKET FOR EN ANSATT. Altinn-tallene, tabellen
   * over arbeidsgiveravgift og feriepenger, og «når er ansettelse riktig»
   * står i den andre artikkelen og skal bli stående der. Denne lenker dit i
   * brødteksten i stedet. To artikler som regner det samme regnestykket
   * konkurrerer med hverandre i søk, og da taper begge.
   *
   * TO OPPGITTE KILDER, BEGGE LEST 29.09.2026:
   * - Norsk Journalistlags minstesatser, oppdatert 17.04.2026. De er de
   *   eneste publiserte dagsatsene for norske film- og fotofrilansere som
   *   lar seg etterprøve. Forbeholdet om at de er minstesatser for
   *   journalistikk står i teksten — å presentere dem som markedspris for
   *   kommersiell produksjon ville vært feil.
   * - Skatteetaten om arbeidsgiveravgift. Dette er det punktet flest kjøpere
   *   ikke vet om, og det snur regnestykket for en frilanser uten
   *   næringsvirksomhet.
   */
  {
    slug: "some-byra-frilanser-eller-ansatt",
    bilde: {
      fil: "fotograf-pa-jobb-1600",
      alt: "Fotograf som kontrollerer bildet på kameraet under et opptak",
    },
    tittel: "SoMe-byrå, frilanser eller ansatt?",
    beskrivelse:
      "Dagsatser fra Norsk Journalistlag, en avgiftsfelle fra Skatteetaten, og hva som faktisk skiller de tre alternativene.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Frilanser er det billigste alternativet på papiret, og det stemmer så lenge oppgaven er én film. Skal det produseres innhold hver måned, året rundt, blir de tre alternativene overraskende like i pris — og da er det ikke prisen som avgjør, men hvor mye av jobben dere selv må holde i.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva de tre alternativene faktisk er",
      },
      {
        type: "liste",
        punkter: [
          "Ansatt: en person på lønn, til stede hver dag, som skal dekke strategi, foto, video, klipping, tekst og publisering alene.",
          "Frilanser: en person dere leier inn per oppdrag eller per dag. Dere kjøper timene, og beholder alt rundt dem selv.",
          "Byrå: et team med utstyr, på fast avtale. Dere kjøper en leveranse, ikke timer.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Regnestykket for en ansatt står i en egen artikkel, med tall fra Altinn og SSB. Den skal ikke gjentas her — under handler det om frilanseren, som er alternativet ingen har regnet på.",
        lenker: [
          {
            frase: "Regnestykket for en ansatt",
            sti: "/blogg/some-ansvarlig-eller-byra",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster en frilanser per dag?",
      },
      {
        type: "avsnitt",
        tekst:
          "Norsk Journalistlag publiserer minstesatser for frilansere, og de er det nærmeste Norge kommer en offentlig prisliste for film- og fotofrilansere. Satsene under gjelder fra april 2026 og regner en dag som 7,5 timer.",
      },
      {
        type: "tabell",
        kolonner: ["Fag", "Dagsats", "Lengre oppdrag, per dag"],
        rader: [
          ["Tekst og radio", "8 130 kr", "6 480 kr"],
          ["Foto", "8 830 kr", "7 070 kr"],
          ["TV og video", "9 220 kr", "7 810 kr"],
        ],
      },
      {
        type: "kilde",
        tekst:
          "Satsene er Norsk Journalistlags minstesatser for frilansere, oppdatert 17.04.2026. De gjelder journalistisk arbeid og er minstesatser, ikke markedspris — kommersiell produksjon ligger som regel høyere. NJ oppgir samtidig at driftskostnadene de er beregnet ut fra er rundt 200 000 kroner i året for fotografer og 300 000 for videojournalister, siden utstyret er dyrt.",
        url: "https://www.nj.no/nj-frilans/minstesatser-for-frilansere/",
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/profilfilm",
            format: "16/9",
            lyd: true,
            alt: "Stillbilde fra en profilfilm filmet i kontorlokaler",
          },
        ],
        bildetekst:
          "Profilfilm for et rådgivningsselskap. 39 sekunder — filmet på én dag, klippet over flere.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Én dag med filming er ikke én dag med arbeid",
      },
      {
        type: "avsnitt",
        tekst: `Det er her regnestykket for en frilanser sprekker for de fleste. Opptaksdagen er én dag. Å klippe, fargekorrigere og tekste ${tilbud.videoerPerManed} videoer fra den dagen er to til tre dager til.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Med satsene over betyr det rundt 25 000 til 33 000 kroner for én måneds produksjon — før planlegging, før research på hva som faktisk har fungert i kanalene deres, og før noen har publisert noe.",
      },
      {
        type: "avsnitt",
        tekst: `Til sammenligning koster et løpende samarbeid hos oss ${kr(tilbud.prisPerManed)} kr i måneden, og da inngår planlegging, én produksjonsdag, ${tilbud.videoerPerManed} ferdige videoer og publisering ${tilbud.posterPerUke} ganger i uka.`,
        lenker: [{ frase: "et løpende samarbeid hos oss", sti: "/" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Poenget er ikke at frilanseren er dyr. Poenget er at timeprisen bare dekker timene, og at alt annet blir liggende hos dere.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Avgiftsfellen de færreste kjenner",
      },
      {
        type: "avsnitt",
        tekst:
          "Leier dere inn en person som ikke driver egen næringsvirksomhet, er det dere som er ansvarlig for arbeidsgiveravgiften. Skatteetaten er tydelig: «Som arbeidsgiver plikter du å betale arbeidsgiveravgift av lønn og annen godtgjørelse for arbeid og oppdrag i og utenfor tjenesteforhold.»",
      },
      {
        type: "avsnitt",
        tekst:
          "Fritaket gjelder bare når arbeidet er utført som ledd i selvstendig næringsvirksomhet. Får dere en faktura fra et registrert foretak, er dere trygge. Betaler dere et honorar til en privatperson, kommer avgiften i tillegg til honoraret — og da er ikke frilanseren så mye billigere som tilbudet så ut til.",
      },
      {
        type: "kilde",
        tekst:
          "Formuleringene er Skatteetatens egne, fra siden om hvem som plikter å betale arbeidsgiveravgift. Fritaksregelen der lyder: «Du skal ikke betale arbeidsgiveravgift når arbeidet eller oppdraget er utført som ledd i selvstendig næringsvirksomhet.»",
        url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/arbeidsgiveravgift/plikter-jeg-a-betale-arbeidsgiveravgift/",
      },
      {
        type: "avsnitt",
        tekst:
          "Be om organisasjonsnummer før dere inngår avtalen. Det tar ett minutt og avgjør hvem som sitter med regningen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva som faktisk skiller de tre",
      },
      {
        type: "tabell",
        kolonner: ["", "Ansatt", "Frilanser", "Byrå"],
        rader: [
          ["Til stede hver dag", "ja", "nei", "nei"],
          ["Utstyr", "må kjøpes", "frilanserens eget", "inngår"],
          ["Flere fagfelt dekket", "én person", "én person", "team"],
          ["Planlegging og research", "deres", "deres", "inngår"],
          ["Publisering", "deres", "deres", "inngår"],
          [
            "Ved sykdom og ferie",
            "deres risiko",
            "oppdraget utsettes",
            "vår risiko",
          ],
          ["Forutsigbar kostnad", "lønn", "per oppdrag", "fast månedspris"],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til hvor «deres» står. Det er den egentlige forskjellen mellom en frilanser og et byrå: frilanseren løser oppgaven dere har definert, byrået definerer den også.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Når frilanser er riktig valg",
      },
      {
        type: "liste",
        punkter: [
          "Dere har én konkret leveranse, ikke et løpende behov.",
          "Noen hos dere har allerede ansvaret for plan, tekst og publisering, og mangler bare noen som filmer.",
          "Dere trenger en spesifikk kompetanse for ett oppdrag — drone, animasjon, en bestemt stil.",
          "Behovet svinger så mye at en fast avtale ville stått ubrukt halve året.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "En dyktig frilanser er ofte det beste kjøpet som finnes i denne bransjen. Forutsetningen er at noen hos dere gjør resten av jobben.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Når de to andre passer bedre",
      },
      {
        type: "avsnitt",
        tekst:
          "Trenger dere daglig tilstedeværelse i kanalene og noen som svarer kundene innen en time, er ansettelse riktig. Ingen leverandør erstatter det.",
      },
      {
        type: "avsnitt",
        tekst:
          "Er problemet derimot at det ikke blir produsert nok godt innhold jevnt nok, og at innhold alltid taper mot mer akutte oppgaver, er det problemet en fast avtale er bygget for å løse.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og den vanligste løsningen er ikke ett av tre. Mange har en markedsansvarlig som eier dialogen og strategien, og setter bort produksjonen.",
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "Reflektors pris og leveranse, oppgitt åpent" },
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Kan vi bruke frilanser og byrå om hverandre?",
        svar: "Ja, og mange gjør det. Den vanligste kombinasjonen er en fast avtale for det løpende innholdet og en frilanser inn på enkeltoppdrag som krever noe spesielt — drone, animasjon, en fotograf med en bestemt stil. Det som skaper trøbbel er ikke kombinasjonen, men at ingen eier helheten: to leverandører som leverer i hver sin stil, i hver sine formater, uten en felles plan, gir et arkiv som ikke henger sammen. Bestem hvem som eier planen før dere bestiller noe.",
      },
      {
        sporsmal: "Hvem eier materialet en frilanser har laget for oss?",
        svar: "Det avhenger av hva dere har avtalt, og det er verdt å avklare skriftlig før oppdraget starter. Åndsverkloven gir opphavsretten til den som har skapt verket, og en betaling for et oppdrag overfører ikke automatisk full bruksrett til alt, i alle kanaler, for all tid. Be om at avtalen sier konkret hva materialet kan brukes til: nettside, annonser, skjerm i butikk, trykk, og hvor lenge. Be også om råmaterialet hvis dere vil kunne klippe om senere — det følger sjelden med av seg selv.",
      },
    ],
  },
  /*
   * SKREVET 29.09.2026. Innlegg nummer 4 i lista i docs/blogg-gjennomgang.md.
   *
   * DEN STØTTER /kjeder, OG /kjeder FINNES PÅ GRUNN AV EN MÅLING. Pål
   * spurte Google AI Mode som markedssjef i en norsk interiørkjede, og
   * Reflektor kom ikke med i svaret — fordi kjedefakta ikke var skrevet med
   * ordene en kjede bruker. Tjenestesiden svarte på det. Artikkelen dekker
   * det søket som kommer før: hvordan løser en kjede innhold i det hele
   * tatt, uavhengig av leverandør.
   *
   * KUNDENE ER PRODUKSJONSKUNDER, IKKE SOME-ABONNENTER. Anton Sport, Egon,
   * Peppes og Vitusapotek er kunder på foto, video og reklamefilm. Ingen
   * setning her skal antyde noe annet — låst ramme i AGENTS.md. Formuleringene
   * er derfor hentet ordrett fra /kjeder, der de allerede er godkjent.
   *
   * INGEN NYE TALL. Alt som står her om antall restauranter, antall formater
   * og hvor lenge samarbeidene har vart, står allerede i tjenester.ts og
   * caser.ts.
   */
  {
    slug: "innhold-til-sosiale-medier-for-kjeder",
    bilde: {
      fil: "kafe1-1600",
      alt: "Rad med flasker i en butikkhylle foran en farget vegg",
      fokus: "center 32%",
    },
    tittel: "Innhold til sosiale medier for kjeder med flere lokasjoner",
    metaTittel: "Sosiale medier for kjeder med flere lokasjoner",
    beskrivelse:
      "Femti butikker, seks flater og én markedsavdeling. Hvordan kjeder løser innholdsproduksjon uten å sette i gang femti produksjoner.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En kjede har ikke det samme problemet som en enkeltbutikk. Utfordringen er sjelden å lage innhold — den er å lage innhold som fungerer for femti lokasjoner og et halvt dusin flater, uten å sette i gang femti produksjoner.",
      },
      {
        type: "avsnitt",
        tekst:
          "Løsningen de fleste kjeder lander på er den samme: produser sentralt, lever i mange formater, og la lokasjonene bruke materialet i stedet for å lage sitt eget.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Tre problemer en kjede har som en enkeltbutikk ikke har",
      },
      {
        type: "liste",
        punkter: [
          "Volum. Det som holder for én butikk i en måned, er tomt etter en uke når femti skal dele på det.",
          "Flater. Innholdet skal ikke bare i feeden. Det skal på skjerm i butikk, på skjerm i kjøpesenteret, i annonser, på nettsiden og i kampanjer — og hver flate har sitt format.",
          "Samme uttrykk overalt. Femti lokasjoner som lager sitt eget blir femti ulike merkevarer, og den kostnaden dukker ikke opp i noe budsjett.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det tredje er det dyreste, og det som oppdages sist. Et bildespråk som sprekker opp er vanskelig å samle igjen.",
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/kjeder-anton-sport",
            format: "16/9",
            alt: "Stillbilde fra filmen: to syklister på en grusvei i skogen",
          },
          {
            slag: "film",
            sti: "/arbeid/kjeder-egon",
            format: "16/9",
            alt: "Stillbilde fra filmen: en hånd heller saus over en rett",
          },
        ],
        bildetekst:
          "To kjeder, to bransjer, samme arbeidsmåte: Anton Sport og Egon. Begge filmene er fra én produksjonsdag.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Sentralt eller lokalt — hvem skal publisere?",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er valget som avgjør resten. Lar dere hver lokasjon styre sin egen konto, får dere nærhet og lokal tilstedeværelse — og et uttrykk som spriker, en kvalitet som varierer med hvem som er på jobb, og ingen som kan svare på hva kjeden faktisk publiserte forrige måned.",
      },
      {
        type: "avsnitt",
        tekst:
          "Styrer markedsavdelingen alt sentralt, får dere kontroll og konsistens — men innholdet mister det lokale, og butikksjefene mister et verktøy de faktisk har bruk for.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den vanligste mellomløsningen er at produksjonen er sentral og publiseringen lokal: ett arkiv alle henter fra, med føringer for hva som kan endres. Kjedene vi produserer for gjør det slik — markedsteamet hos kunden styrer kanalene selv, og vi leverer innholdet de bruker.",
        lenker: [{ frase: "Kjedene vi produserer for", sti: "/kjeder" }],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Én film, seks formater",
      },
      {
        type: "avsnitt",
        tekst:
          "Det som skiller kjedeproduksjon fra vanlig innholdsproduksjon er ikke motivet. Det er at hver film må ut i flere utsnitt fordi flatene er ulike — stående til sosiale medier, liggende til skjerm, kvadratisk til annonser, og egne oppløsninger til skjermene i butikk og kjøpesenter.",
      },
      {
        type: "avsnitt",
        tekst:
          "For Egon leverer vi seks formater per film. Det er ikke seks filmer, det er én film beskåret og tilpasset seks ganger — og det er en beslutning som må tas før opptaket, ikke etter. Filmes det uten at utsnittene er planlagt, finnes ikke bildet som skal til for det stående formatet.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er derfor formatene hører hjemme i kjøreplanen og ikke i etterarbeidet. På kjedesiden står den samme filmen i tre av de seks formatene ved siden av hverandre.",
        lenker: [
          {
            frase: "den samme filmen i tre av de seks formatene",
            sti: "/kjeder",
          },
        ],
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "foto",
            sti: "/arbeid/kjeder-foto-peppes",
            format: "4/5",
            alt: "To pizzaer og en dessert på et bord, fotografert for en restaurantkjede",
          },
          {
            slag: "foto",
            sti: "/arbeid/kjeder-foto-vitusapotek",
            format: "4/5",
            alt: "Sesongvarer lagt ut på grønt stoff, fotografert for en apotekkjede",
          },
        ],
        bildetekst:
          "Stillbilder fra to kjeder. Samme produksjonsdag gir både film og foto.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvordan volumet faktisk løses",
      },
      {
        type: "avsnitt",
        tekst:
          "Ikke ved å filme i hver butikk. For Egon produserer vi til nærmere 50 restauranter fra sør til nord, fra én fast produksjonsdag i måneden. Det som gjør det mulig er at maten, menyen og uttrykket er felles — det lokale ligger i hvem som publiserer, ikke i hvor kameraet sto.",
      },
      {
        type: "avsnitt",
        tekst: `Trenger kjeden materiale fra flere steder, fordeles produksjonsdagene på ulike lokasjoner i stedet for å legges på samme adresse. Og trengs det mer volum, legges det til dager: hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Det er den egentlige skalaen i modellen. Ikke flere leverandører, men flere dager med det samme teamet — slik at butikkinnhold og reklamefilm får samme bildespråk.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Seks spørsmål å avklare før dere ber om tilbud",
      },
      {
        type: "liste",
        punkter: [
          "Hvilke flater skal innholdet ut på, og i hvilke formater og oppløsninger?",
          "Hvem publiserer — markedsavdelingen, butikkene, eller begge?",
          "Hvor mange produksjonsdager i måneden trenger dere, og skal de ligge på samme sted?",
          "Skal reklamefilm og løpende innhold komme fra samme team?",
          "Hvem svarer på kommentarer og meldinger i kanalene?",
          "Hva skal skje med materialet etterpå — hvem eier det, og hvor lagres det?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Spørsmål én er det som oftest mangler i en brief, og det som oftest gjør at materialet må lages om. Ta det først.",
      },
    ],
    lesVidere: [
      { sti: "/kjeder", tekst: "Reflektors arbeid for kjeder og retail" },
      { sti: "/reklamefilm", tekst: "reklamefilm fra samme team" },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Må vi filme i hver eneste butikk?",
        svar: "Nei, og det er sjelden verdt det. Er produktene, menyen og uttrykket felles, kan innholdet produseres ett sted og brukes av alle. Det lokale ligger i hvem som publiserer og hva de skriver til bildet, ikke i hvor kameraet sto. Unntakene er når lokasjonen faktisk er poenget: en ny butikk som åpner, et lokale som skiller seg ut, eller ansatte som skal vises fram. Da legger vi en produksjonsdag dit i stedet for å legge alle på samme adresse.",
      },
      {
        sporsmal: "Hva gjør vi med butikker som allerede har egen konto?",
        svar: "La dem beholde den, men gi dem noe å publisere. Det vanligste problemet er ikke at butikkene har egne kontoer — det er at de ikke har materiale, og derfor lager sitt eget med mobilen. Et felles arkiv de kan hente fra løser mesteparten av det. Legg ved enkle føringer for hva som kan endres og hva som ikke kan det, så beholder dere uttrykket uten å ta fra butikkene verktøyet.",
      },
    ],
  },
  /*
   * SKREVET 29.09.2026. Innlegg nummer 5 i lista i docs/blogg-gjennomgang.md.
   *
   * FAREN VAR Å SKRIVE ENDA EN DEFINISJONSARTIKKEL. «Sosiale medier-strategi»
   * har 200 i volum og vanskelighetsgrad 0 nettopp fordi alle har skrevet
   * den samme læreboka. AGENTS.md forbyr flere tekster av den typen, og en
   * til ville ikke rangert uansett.
   *
   * DERFOR ER DEN EN MAL OG IKKE EN FORKLARING. Seks steg, i den rekkefølgen
   * de faktisk gjøres, med det som skal stå i hvert. Metoden er Reflektors
   * egen, hentet ordrett fra FAQ-svarene i faq.ts: research på hundre
   * publiseringer over fire måneder, median mot median, navngitte
   * innholdsserier, to kanaler gjort ordentlig, et halvår før noe kan
   * bedømmes.
   *
   * INGEN LOVEDE TALL. Svaret «Hvilke resultater kan vi forvente?» i faq.ts
   * sier rett ut at vi ikke lover prosenter og anbefaler skepsis mot byråer
   * som gjør det. Artikkelen holder samme linje — den ville vært lettere å
   * skrive med en garanti i, og verdiløs.
   */
  {
    slug: "sosiale-medier-strategi",
    bilde: {
      fil: "aktivering-vegg",
      alt: "Utendørs aktivering med stand og publikum",
    },
    tittel: "Sosiale medier-strategi: hva den faktisk må inneholde",
    metaTittel: "Sosiale medier-strategi: hva den må inneholde",
    beskrivelse:
      "Seks steg, i den rekkefølgen de gjøres. Malen vi selv bruker når vi legger en produksjonsplan — ikke en lærebok i hva sosiale medier er.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En strategi som ikke ender i en produksjonsplan er et dokument. Den skal svare på hva som skal lages, av hvem, hvor ofte, i hvilke formater, og hvordan dere vet om det virker. Klarer den ikke det, er den ikke en strategi — den er en presentasjon.",
      },
      {
        type: "avsnitt",
        tekst:
          "Under står de seks stegene i den rekkefølgen de faktisk gjøres, og hva som må stå i hvert enkelt.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 1: Mål det dere allerede har publisert",
      },
      {
        type: "avsnitt",
        tekst:
          "Nesten alle hopper over dette, og det er det eneste steget som gir svar i stedet for meninger. Dere har allerede publisert. Tallene ligger åpent i Metas egne verktøy, og de sier hvilke formater, lengder og motiver som faktisk fikk rekkevidde hos akkurat deres publikum.",
      },
      {
        type: "avsnitt",
        tekst:
          "Et brukbart grunnlag er rundt hundre publiseringer over fire måneder. Sammenlign median mot median, ikke snitt mot snitt — én post som gikk viralt trekker snittet så mye at resten forsvinner, og da måler dere flaksen i stedet for mønsteret.",
      },
      {
        type: "avsnitt",
        tekst:
          "Se like mye på hva dere allerede kan. Fagartikler dere har skrevet, spørsmål kundene stiller igjen og igjen, ansatte som kan noe andre lurer på. Det sterkeste innholdet er som regel kunnskap dere allerede sitter på — filmet i stedet for skrevet.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 2: Velg kanaler etter hva dere klarer å levere",
      },
      {
        type: "avsnitt",
        tekst:
          "Kanalvalget er en kapasitetsbeslutning, ikke en målgruppebeslutning. To kanaler gjort ordentlig slår fire gjort halvveis, hver eneste gang. Hver ny kanal krever egne formater, egen tone og egen redigering — og koster like mye som den forrige.",
      },
      {
        type: "avsnitt",
        tekst:
          "Velg ut fra hvor publikummet er OG hvor ofte dere realistisk klarer å publisere. En kanal som står stille kommuniserer noe den ikke skulle kommunisert.",
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "foto",
            sti: "/arbeid/kjeder-foto-anton-sport",
            format: "4/5",
            alt: "Sko i en bekk, fotografert for en sportskjede",
          },
          {
            slag: "foto",
            sti: "/arbeid/kjeder-foto-egon",
            format: "4/5",
            alt: "Tacos på et fat, fotografert for en restaurantkjede",
          },
        ],
        bildetekst:
          "4:5 er formatet som tar mest plass i Instagram-feeden. Det er også formatet flest glemmer å planlegge for.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 3: Gjør funnene om til navngitte serier",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er steget som skiller en strategi fra en idémyldring. En liste med løse ideer overlever ikke første travle uke. En navngitt serie gjør det, fordi den sier hva neste film er uten at noen må finne på noe.",
      },
      {
        type: "avsnitt",
        tekst:
          "En serie har et navn, et fast format, en fast lengde og en grunn til å finnes. «Kokken forklarer» er en serie. «Mer bak kulissene» er ikke.",
      },
      {
        type: "avsnitt",
        tekst:
          "Tre til fem serier er nok. Færre blir ensformig, flere blir umulig å holde i gang.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 4: Bestem formatene før opptaket",
      },
      {
        type: "avsnitt",
        tekst:
          "Skal en film både i feeden, på nettsiden og på en skjerm, må utsnittene planlegges før kameraet rigges. Filmes det bare liggende, finnes ikke bildet som skal til for det stående formatet — og motsatt.",
      },
      {
        type: "avsnitt",
        tekst:
          "Det er en beslutning som koster ingenting i planleggingen og svært mye i etterarbeidet. Har dere flere flater å fylle, er det her mesteparten av gjenbruket ligger.",
        lenker: [
          {
            frase: "flere flater å fylle",
            sti: "/blogg/innhold-til-sosiale-medier-for-kjeder",
          },
        ],
      },
      {
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/noods",
            format: "16/9",
            alt: "Stillbilde fra klipp: nudelretter fotografert ovenfra",
          },
          {
            slag: "film",
            sti: "/arbeid/servering",
            format: "16/9",
            alt: "Stillbilde fra klipp: et måltid serveres ved et bord",
          },
        ],
        bildetekst:
          "Liggende format går til nettside, skjerm og YouTube. Samme opptak, annet utsnitt.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 5: Legg en rytme dere klarer å holde hele året",
      },
      {
        type: "avsnitt",
        tekst: `Frekvensen betyr mindre enn jevnheten. ${tilbud.posterPerUke} ganger i uka, 52 uker i året, slår fem ganger i uka i tre måneder og så stille. Algoritmene straffer opphold, og de fleste hull oppstår i ferier og i travle perioder — altså akkurat når ingen har tid til å lage noe nytt.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Løsningen er å produsere i forkant, ikke å publisere oftere. Et arkiv som er fylt opp tåler en travel måned; en kalender som fylles fortløpende gjør det ikke.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 6: Bestem hva dere skal måle — og hva dere ikke skal måle",
      },
      {
        type: "avsnitt",
        tekst:
          "Sett mål på det dere kontrollerer: antall ferdige filmer, antall publiseringer, jevnheten. Ikke på prosentvis vekst i engasjement. Et byrå som styrer etter et engasjementstall, ender med å lage innhold som jager tallet i stedet for å bygge merkevaren.",
      },
      {
        type: "avsnitt",
        tekst:
          "Og gi det tid. De første to månedene handler om å finne formen, og tallene er ustabile i den perioden. Fra måned tre begynner mønstrene å vise seg. Regn med et halvår før dere kan bedømme det ordentlig.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Malen på én side",
      },
      {
        type: "tabell",
        kolonner: ["Steg", "Hva som skal stå der"],
        rader: [
          ["1. Måling", "Hva som faktisk fungerte, målt median mot median"],
          ["2. Kanaler", "Hvilke, og hvor ofte dere klarer å levere i dem"],
          ["3. Serier", "Tre til fem, med navn, format og lengde"],
          ["4. Formater", "Hvilke utsnitt hver film skal leveres i"],
          ["5. Rytme", "Antall publiseringer i uka, 52 uker i året"],
          ["6. Måltall", "Det dere kontrollerer, ikke det dere håper på"],
        ],
      },
      {
        type: "avsnitt",
        tekst: `Får dere dette ned på én side, har dere en strategi. Vil dere se hvordan vi ville gjort det for dere, lager vi et komplett forslag med research på deres egne kanaler innen ${tilbud.strategiforslagVirkedager} virkedager, uten forpliktelser.`,
        lenker: [{ frase: "et komplett forslag", sti: "/#kontakt" }],
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "Reflektors leveranse og pris, oppgitt åpent" },
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvor ofte bør strategien revideres?",
        svar: "Selve retningen tåler et år. Det som bør gjennomgås oftere er hvilke serier som virker — et kvartal er en passende rytme, fordi tallene svinger for mye fra uke til uke til å si noe om en måned alene. En gjennomgang på tjue minutter der dere ser på hva som har fungert og hva som ikke har det, er som regel nok. Å skrive strategien om fra bunnen hvert halvår er et tegn på at den var for detaljert til å begynne med.",
      },
      {
        sporsmal: "Trenger vi en strategi hvis vi bare skal publisere litt?",
        svar: "Ja, men den blir kort. Skal dere publisere én gang i uka, trenger dere fortsatt å vite hvilke to eller tre serier det skal være, hvilket format de har, og hvem som lager dem. Det tar en halv side. Det som ikke fungerer er å publisere litt uten å ha bestemt noe — da blir innholdet det noen rekker den dagen, og det er den varianten som koster mest tid per publisering og gir minst igjen.",
      },
    ],
  },
];

/**
 * Vakt på medieblokkene, kjørt ved import — ikke ved rendring.
 *
 * SAMME VALG SOM `delOppAvsnitt` OG `hentFaq`: den kaster. En medieblokk med
 * tre elementer eller med to ulike sideforhold er en innholdsfeil, og
 * alternativet er en rad som ser ødelagt ut på telefon uten at noe sier fra.
 * Da er det bedre at byggen stopper med navnet på artikkelen i feilmeldingen.
 *
 * Her og ikke i komponenten, fordi komponenten bare kjører for den artikkelen
 * noen faktisk åpner. Dette treffer alle ti ved første import.
 */
for (const a of artikler) {
  for (const b of a.blokker) {
    if (b.type !== "medier") continue;
    if (b.elementer.length < 1 || b.elementer.length > 2) {
      throw new Error(
        `${a.slug}: en medieblokk må ha ett eller to elementer, ikke ${b.elementer.length}`,
      );
    }
    const formater = new Set(b.elementer.map((m) => m.format));
    if (formater.size > 1) {
      throw new Error(
        `${a.slug}: medieblokken blander formatene ${[...formater].join(" og ")}. Begge må ha samme sideforhold, ellers får rammene ulik høyde.`,
      );
    }
  }
}

/** Slugene som faktisk har innhold. Undersett av bloggSlugs i site.ts. */
export const artikkelSlugs = artikler.map((a) => a.slug);

/**
 * Deler et avsnitt i tekstbiter og lenker, klart til å rendres.
 *
 * KASTER, og det er med vilje. En `frase` som ikke står i avsnittet, eller
 * som står der to ganger, er en innholdsfeil — og alternativet er en lenke
 * som stille forsvinner eller havner på feil forekomst. Da er det bedre at
 * byggen stopper. Samme valg som `hentFaq` i faq.ts gjør.
 *
 * Frasene sorteres etter posisjon, ikke etter rekkefølgen de er skrevet i.
 * Overlappende fraser avvises: to lenker som deler ord kan ikke rendres.
 */
export function delOppAvsnitt(
  tekst: string,
  lenker: Innlenke[] | undefined,
): (string | (Innlenke & { start: number }))[] {
  if (!lenker || lenker.length === 0) return [tekst];

  const funnet = lenker.map((l) => {
    const forste = tekst.indexOf(l.frase);
    if (forste === -1) {
      throw new Error(`Frasen «${l.frase}» står ikke i avsnittet: ${tekst}`);
    }
    if (tekst.indexOf(l.frase, forste + 1) !== -1) {
      throw new Error(`Frasen «${l.frase}» står flere ganger i avsnittet`);
    }
    return { ...l, start: forste };
  });

  funnet.sort((a, b) => a.start - b.start);

  const deler: (string | (Innlenke & { start: number }))[] = [];
  let i = 0;
  for (const f of funnet) {
    if (f.start < i) {
      throw new Error(`Frasen «${f.frase}» overlapper en annen lenke`);
    }
    if (f.start > i) deler.push(tekst.slice(i, f.start));
    deler.push(f);
    i = f.start + f.frase.length;
  }
  if (i < tekst.length) deler.push(tekst.slice(i));
  return deler;
}

/**
 * Spørsmålsoverskrift + første avsnitt under den = ett FAQ-par.
 *
 * Bare overskrifter som faktisk ender på spørsmålstegn. En påstand markert
 * opp som et spørsmål er feil markering, og feil markering forplanter seg
 * til det som siterer den.
 */
/**
 * Overskrifter som IKKE skal bli FAQ-markering.
 *
 * Squarespace-malen avsluttet hver artikkel med samme CTA-overskrift.
 * Migreringen tok den med, og utledningen gjorde den om til strukturerte
 * data på SEKS artikler samtidig — seks sider som hver påstår å være
 * svaret på det samme spørsmålet. Det er kannibalisering i markeringen,
 * og det var selvforskyldt.
 *
 * Lista er eksplisitt og ikke en heuristikk, fordi den skal være lett å
 * lese for den neste som lurer på hvorfor et spørsmål mangler.
 */
export const IKKE_FAQ = ["Trenger din bedrift en fotograf eller videograf?"];

/** Ord en ekte FAQ-overskrift begynner med. */
const SPØRREORD =
  /^(hva|hvorfor|hvordan|hvem|når|hvor|kan|bør|må|trenger|er|skal|finnes|går|koster|lønner)\b/i;

/**
 * Spørsmålsoverskrift + første avsnitt under den = ett FAQ-par.
 *
 * TRE FILTRE, alle lagt til 21.09.2026 etter at markeringen ble målt på
 * tvers av nettstedet. Før dette produserte utledningen 77 par, hvorav
 * ett sto på seks sider og flere ikke var spørsmål i det hele tatt.
 *
 * 1. MÅ ENDE PÅ SPØRSMÅLSTEGN. Sto fra før.
 *
 * 2. MÅ BEGYNNE MED ET SPØRREORD. «Trinn 2: Målgruppen din: Hvem skal se,
 *    lese eller lytte til innholdet?» er en stegoverskrift med et
 *    spørsmål inni. Som FAQ-oppføring er den uforståelig løsrevet, og en
 *    FAQ-oppføring som ikke gir mening alene er verdiløs — hele poenget
 *    er at den skal kunne siteres uten konteksten rundt.
 *
 * 3. MÅ IKKE STÅ PÅ SPERRELISTA. Se IKKE_FAQ over.
 *
 * Feil markering er verre enn ingen markering. Ingen markering er en
 * manglende opplysning; feil markering er en usann opplysning, og den
 * forplanter seg til alt som siterer den.
 *
 * FLYTTET HIT FRA BLOGGMALEN 29.09.2026. Den lå i `src/app/blogg/[slug]/`
 * og kunne derfor ikke testes. Vakten i `tests/faq.test.ts` antok i stedet
 * at utledede spørsmål er «per definisjon unike for artikkelen», og den
 * antakelsen holdt ikke: prisartikkelen og den nye videoprisartikkelen
 * fikk begge overskriften «Hva koster det hos Reflektor?», altså samme
 * FAQPage-spørsmål på to URL-er — nøyaktig det Google forbyr, og nøyaktig
 * det testen finnes for å stoppe. Nå leser testen den samme funksjonen
 * som malen rendrer.
 */
export function somFaq(blokker: Blokk[]) {
  const par: { sporsmal: string; svar: string }[] = [];
  blokker.forEach((b, i) => {
    if (b.type !== "overskrift") return;
    const q = b.tekst.replace(/\u00ad/g, "").trim();
    if (!q.endsWith("?")) return;
    if (!SPØRREORD.test(q)) return;
    if (IKKE_FAQ.includes(q)) return;
    const neste = blokker[i + 1];
    if (neste?.type !== "avsnitt") return;
    par.push({ sporsmal: b.tekst, svar: neste.tekst });
  });
  return par;
}

export function finnArtikkel(slug: string): Artikkel | undefined {
  return artikler.find((a) => a.slug === slug);
}
