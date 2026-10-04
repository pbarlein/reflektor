import { kr, tilbud } from "./site";

/**
 * Bloggartiklene, migrert fra Squarespace 21.09.2026.
 *
 * INGEN STILLBILDER HENTET FRA VIDEO. Bestilt av Pål 30.09.2026: «sørg for
 * at ... du ikke tar screen shots fra videoer.» Et enkeltbilde klippet ut
 * av et filmklipp ser ut som det det er — uskarpt i bevegelse, tilfeldig i
 * komposisjonen, og med et utsnitt filmfotografen aldri valgte. Fire slike
 * lå på nettstedet, alle laget av meg, og alle er nå borte.
 *
 * ET PLAKATBILDE ER NOE ANNET. Filene som ligger ved siden av en `.mp4` og
 * bare vises til noen trykker play, er fortsatt uttrekk fra den samme
 * filmen — det MÅ de være, ellers viser plakaten et annet motiv enn
 * videoen. Regelen gjelder bilder som opptrer som fotografi.
 *
 * ARKIVET HAR NESTEN INGEN FOTOGRAFIER AV OSS SELV PÅ JOBB. Bak-kulissene-
 * materialet er film. Det er årsaken til at uttrekkene oppsto, og det er
 * verdt å vite neste gang en side trenger et bilde av en produksjonsdag:
 * svaret er å vise filmen, ikke å fryse den.
 *
 * ORDRETT. Teksten er Reflektors egen publiserte copy, hentet fra
 * www.reflektor.no og flyttet uten en eneste endring i formuleringene.
 * Regel 3 i AGENTS.md: bloggen beholdes for SØKESYNLIGHETEN — artiklene
 * rangerer på ord folk søker på — og innholdet skal ikke styre
 * arkitekturen. Da skal det heller ikke skrives om for å passe den.
 *
 * RETTET 02.10.2026: her sto «for lenkeverdien — ~481 refererende
 * domener». Tallet var domenets, ikke bloggens. Hele /blogg-stien har 3
 * levende refererende domener; de 589 domenet har, peker nesten alle på
 * forsiden. Begrunnelsen er rettet, regelen står.
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
  | { type: "medier"; elementer: Bloggmedie[]; bildetekst?: string }
  /**
   * GALLERI: ett hovedbilde og tre til fem miniatyrer under.
   *
   * HVORFOR EN EGEN BLOKK og ikke bare flere `medier`. `medier` krever at
   * alle elementene har samme sideforhold, fordi to rammer med ulik høyde
   * ved siden av hverandre gir skjev underkant. Et ekte galleri fra et
   * oppdrag har blandet format — fire liggende og ett stående i Retail24-
   * serien — og da må reglene være andre.
   *
   * MINIATYRENE BESKJÆRES KVADRATISK. Det er den eneste rammen som tar
   * både liggende og stående uten å skjære bort motivet i det ene eller
   * strekke det andre. Hovedbildet beholder sitt eget format og står i
   * full bredde over dem.
   *
   * ALT-TEKST PÅ HVERT BILDE, som ellers. `bildetekst` gjelder galleriet
   * som helhet.
   */
  | { type: "galleri"; elementer: Bloggmedie[]; bildetekst?: string };

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
    if (b.type === "medier" || b.type === "galleri") return sum;
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
    oppdatert: "2026-10-04",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "De fleste byråer oppgir ikke pris før du har vært i et møte. Det gjør det vanskelig å vite om et tilbud er dyrt eller billig. Her er hva prisen består av, hva du bør spørre om før du signerer, og hva vi selv tar som SoMe-byrå.",
        lenker: [{ frase: "SoMe-byrå", sti: "/" }],
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
    /*
     * SKREVET OM I SIN HELHET 02.10.2026. Teksten var migrert ordrett fra
     * Squarespace og var ordbokstoff: den forklarte begreper uten å svare
     * på det noen faktisk lurer på før de kjøper.
     *
     * TITTEL, H1 OG URL ER URØRT, og det er ikke en forglemmelse.
     * Artikkelen rangerer på plass 2 for «hva er some» og plass 1 for
     * «so me». Å bytte tittelen på en side som allerede står der, er å
     * kaste en posisjon for å vinne en formulering.
     *
     * H2-EN «Hva er SoMe?» STÅR TIDLIG OG ORDRETT av samme grunn: det er
     * den som bærer plasseringen.
     */
    bilde: {
      fil: "peppes1-1600",
      alt: "Gjest med pizzastykke foran et neonskilt",
      /* `fokus` beholdt fra før omskrivingen 02.10.2026 — motivet er
         uendret, og beskjæringen er satt ved å se på bildet. */
      fokus: "center 30%",
    },
    tittel: "Markedsføring i sosiale medier",
    beskrivelse:
      "Hva er SoMe, og hvordan markedsfører en bedrift seg i sosiale medier? Kanaler, innhold, organisk mot betalt, og hvordan dere holder det gående over tid.",
    publisert: "2025-02-12",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "SoMe er forkortelsen for sosiale medier. Markedsføring i sosiale medier betyr å bruke kanaler som Instagram, Facebook, LinkedIn og TikTok til å nå kunder, enten med vanlige innlegg (organisk) eller med betalte annonser. Det som avgjør resultatet, er sjelden enkeltinnlegg. Det avgjørende er om bedriften publiserer jevnt over tid.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva er SoMe?" },
      {
        type: "avsnitt",
        tekst:
          "SoMe er en norsk forkortelse for sosiale medier: tjenester der brukerne selv lager, deler og kommenterer innhold. For bedrifter er de to ting på én gang: en kanal der dere kan publisere gratis, og en annonseplattform der dere kan betale for å nå akkurat den målgruppen dere vil.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvor mange bruker sosiale medier?",
      },
      {
        type: "avsnitt",
        tekst:
          "82 prosent av befolkningen bruker sosiale medier i løpet av en gjennomsnittsdag, i snitt 1 time og 55 minutter. Blant 13–19-åringer er Snapchat og TikTok størst, mens Facebook fortsatt er mest brukt blant dem over 45 år.",
      },
      {
        type: "kilde",
        tekst:
          "Tallene er fra Norsk mediebarometer 2025, Statistisk sentralbyrå.",
        url: "https://www.ssb.no/kultur-og-fritid/tids-og-mediebruk/statistikk/norsk-mediebarometer/artikler/dette-er-de-mest-populaere-sosiale-mediene",
      },
      {
        type: "avsnitt",
        tekst:
          "Målgruppen deres er altså der. Spørsmålet er hvilken kanal den er i.",
      },
      { type: "overskrift", niva: 2, tekst: "Hvilke kanaler passer for hvem?" },
      {
        type: "tabell",
        kolonner: ["Kanal", "Passer best for", "Format som fungerer"],
        rader: [
          [
            "Instagram",
            "Forbrukerrettede bedrifter, restauranter, handel, merkevarer",
            "Reels (stående video), bilder, stories",
          ],
          [
            "Facebook",
            "Bred målgruppe, særlig over 45 år, lokale bedrifter",
            "Video, bilder, arrangementer",
          ],
          [
            "LinkedIn",
            "B2B, rekruttering, ledere og fagfolk",
            "Fagtekster, video med ansatte",
          ],
          [
            "TikTok",
            "Yngre målgrupper, underholdning",
            "Korte, uformelle videoer",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "De fleste bedrifter trenger ikke være overalt. Det er bedre å gjøre én eller to kanaler skikkelig enn fire halvveis. Samme video kan ofte brukes i flere kanaler hvis den er filmet stående.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Organisk og betalt – dere trenger begge",
      },
      {
        type: "liste",
        punkter: [
          "Organisk er innlegg på egen profil. Det er gratis, bygger gjenkjennelse og viser hvem dere er for den som sjekker dere ut.",
          "Betalt er annonser. Dere bestemmer hvem som ser innholdet, og kan nå folk som ikke følger dere.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det beste annonseinnholdet er ofte det som allerede har fungert organisk. Vi bruker organiske innlegg som en løpende test: det som får mest respons, er det dere bør bruke penger på å vise til flere.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Fem ting som avgjør om det fungerer",
      },
      {
        type: "liste",
        punkter: [
          "Jevn publisering. To innlegg i uka hele året slår ti innlegg i mars og ingenting i juni. Folk legger merke til en konto som er aktiv.",
          "Laget for mobil. Stående video (9:16) for Reels og TikTok, og 4:5 for bilder i Instagram-feeden.",
          "De første sekundene. Det avgjøres på et par sekunder om noen ser videre. Start med det mest interessante.",
          "Ekte folk og ekte steder. De ansatte, lokalet og kundene deres er mer troverdige enn bildebank.",
          "En plan. Vit hva som skal ut neste måned før måneden starter.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Hvordan vi legger en slik plan, står i artikkelen om sosiale medier-strategi.",
        lenker: [
          {
            frase: "sosiale medier-strategi",
            sti: "/blogg/sosiale-medier-strategi",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Regler for markedsføring i sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "Markedsføringsloven krever at reklame skal være lett å kjenne igjen som reklame. I sosiale medier betyr det at betalte samarbeid, for eksempel med influencere, skal merkes tydelig med «reklame» eller «annonse» helt i starten av innlegget.",
      },
      {
        type: "avsnitt",
        tekst: "Dette skal merkes:",
      },
      {
        type: "liste",
        punkter: [
          "når noen får betalt for å omtale et produkt eller en tjeneste",
          "når noen får låne eller beholde et produkt gratis",
          "når noen omtaler noe de selv eier eller driver",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Innlegg på bedriftens egen konto trenger ikke merkes. Det er tydelig hvem avsenderen er.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Gjøre det selv, ansette eller sette det bort?",
      },
      {
        type: "avsnitt",
        tekst:
          "Det finnes tre måter å få det gjort på: en ansatt SoMe-ansvarlig, en frilanser eller et byrå. Vi har regnet på hva hvert alternativ koster, både i regnestykket for SoMe-ansvarlig mot byrå og i oversikten over hva et SoMe-byrå koster.",
        lenker: [
          {
            frase: "regnestykket for SoMe-ansvarlig mot byrå",
            sti: "/blogg/some-ansvarlig-eller-byra",
          },
          {
            frase: "hva et SoMe-byrå koster",
            sti: "/blogg/hva-koster-et-some-byra",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Slik gjør vi det" },
      {
        type: "avsnitt",
        tekst: `Reflektor filmer hos dere én dag i måneden og lager ${tilbud.videoerPerManed} videoer av det. Vi publiserer to ganger i uka på Instagram og Facebook, hele året. Det koster ${kr(tilbud.prisPerManed)} kr/mnd, uten bindingstid.`,
        lenker: [{ frase: "uten bindingstid", sti: "/" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Soulcake har hatt en fast produksjonsdag hos oss hver måned siden 2022. I dag kommer over 80 prosent av foto og video på kontoen deres fra oss. Se hvordan.",
        lenker: [{ frase: "Se hvordan", sti: "/vart-arbeid/soulcake" }],
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "SoMe-abonnementet, med pris og vilkår" },
      {
        sti: "/blogg/sosiale-medier-strategi",
        tekst: "hva en sosiale medier-strategi må inneholde",
      },
      {
        sti: "/blogg/hva-koster-et-some-byra",
        tekst: "hva et SoMe-byrå koster i Norge",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva står SoMe for?",
        svar: "SoMe står for sosiale medier, som Instagram, Facebook, LinkedIn, TikTok og Snapchat.",
      },
      {
        sporsmal: "Hvor ofte bør en bedrift poste i sosiale medier?",
        svar: "Det viktigste er å holde et jevnt tempo over tid. To innlegg i uka er et realistisk nivå for de fleste bedrifter, og det er nok til at kontoen fremstår som aktiv.",
      },
      {
        sporsmal: "Må bedrifter merke egne innlegg som reklame?",
        svar: "Nei, ikke innlegg på egen konto, der det er tydelig hvem avsenderen er. Betalte samarbeid med andre, for eksempel influencere, skal merkes tydelig som reklame.",
      },
    ],
  },
  {
    slug: "hva-er-innholdsproduksjon",
    /*
     * SKREVET OM I SIN HELHET 02.10.2026, og den fikk ny `metaTittel`.
     * Artikkelen rangerer ikke i dag, så tittelen er fri — URL-en er det
     * ikke, og den står.
     *
     * KANNIBALISERING ER DET SOM STYRER OPPBYGNINGEN HER.
     * /innholdsproduksjon er den kommersielle siden og skal vinne på
     * kjøpsord. Denne svarer på «hva er», og lenker dit allerede i
     * ingressen, slik at de to ikke konkurrerer om samme søk.
     */
    bilde: {
      fil: "spa-opphold-1080",
      alt: "Tre gjester i badekåper med champagne på et spa",
    },
    tittel: "Hva er innholdsproduksjon?",
    metaTittel: "Hva er innholdsproduksjon? Typer og eksempler",
    beskrivelse:
      "Innholdsproduksjon er å lage tekst, foto og video som en bedrift bruker i markedsføringen. Hva det omfatter, hvem som gjør det, og hvordan dere kommer i gang.",
    publisert: "2024-08-09",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Innholdsproduksjon er arbeidet med å lage tekst, foto og video som en bedrift bruker i markedsføringen: på nettsiden, i sosiale medier, i annonser og i rekruttering. Det kan gjøres internt, av frilansere eller av et byrå, som enkeltprosjekter eller som løpende produksjon.",
        lenker: [{ frase: "løpende produksjon", sti: "/innholdsproduksjon" }],
      },
      { type: "overskrift", niva: 2, tekst: "Hva regnes som innhold?" },
      {
        type: "avsnitt",
        tekst: "Fire typer, og de fleste bedrifter trenger noe av hver:",
      },
      {
        type: "liste",
        punkter: [
          "Video: korte videoer til sosiale medier, reklamefilm, bedriftsfilm, rekrutteringsfilm og eventvideo.",
          "Foto: produktbilder, menybilder, portretter av ansatte, bilder av lokalet og fra arrangementer.",
          "Tekst: artikler på nettsiden, innleggstekster, nyhetsbrev og annonsetekster.",
          "Grafikk: illustrasjoner, infografikk og animasjon.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Den samme produksjonen kan gi mye av dette på én gang. En dag med opptak kan gi videoer til sosiale medier, bilder til nettsiden og en kortversjon til annonser.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva skal innholdet brukes til?",
      },
      {
        type: "tabell",
        kolonner: ["Bruk", "Typisk innhold"],
        rader: [
          ["Sosiale medier", "Korte, stående videoer og bilder, jevnlig"],
          [
            "Nettside",
            "Bilder av lokalet, ansatte og produkter, video på forsiden",
          ],
          ["Annonser", "Korte videoer i flere formater og lengder"],
          [
            "Rekruttering",
            "Film og bilder med ansatte, til stillingsannonser og karriereside",
          ],
          [
            "Skjermer og trykk",
            "Bilder og korte filmer til skjermer i butikk og plakater",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Bestem hvor innholdet skal brukes før dere filmer. Da kan det filmes i riktig format fra starten, i stedet for å klippes om etterpå.",
      },
      { type: "overskrift", niva: 2, tekst: "Tre måter å få det gjort på" },
      {
        type: "liste",
        punkter: [
          "Selv eller en ansatt. Billigst per innlegg, men det tar tid fra noe annet, og kvaliteten avhenger av hvem som gjør det.",
          "Frilanser. Fleksibelt og ofte godt for enkeltoppdrag. Dere må selv planlegge, koordinere og publisere.",
          "Byrå. Planlegging, produksjon og publisering samlet ett sted, til fast pris eller per prosjekt.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Vi har regnet på hva alternativene koster i sammenligningen av SoMe-byrå, frilanser og ansatt.",
        lenker: [
          {
            frase: "SoMe-byrå, frilanser og ansatt",
            sti: "/blogg/some-byra-frilanser-eller-ansatt",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Enkeltprosjekt eller løpende produksjon?",
      },
      {
        type: "liste",
        punkter: [
          "Enkeltprosjekt passer når behovet er én ting: en reklamefilm, en rekrutteringsfilm, bilder til ny nettside, eller dekning av et arrangement.",
          "Løpende produksjon passer når behovet er en kalender: sosiale medier som skal være aktive hele året.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Mange bedrifter starter med et enkeltprosjekt og ser at det de egentlig trenger, er jevn produksjon.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva skiller godt innhold fra dårlig?",
      },
      {
        type: "liste",
        punkter: [
          "Det er laget for kanalen. Stående video til Reels, liggende til nettsiden.",
          "Det viser noe ekte. Egne ansatte og egne lokaler slår bildebank.",
          "Det har én ting å si. Innhold som prøver å si alt, blir ikke husket.",
          "Det kommer jevnlig. Én god video i året gjør mindre enn en god video hver uke.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Innholdsproduksjon i praksis" },
      {
        type: "avsnitt",
        tekst:
          "Egon har nærmere 50 restauranter over hele landet. Vi har hatt en fast produksjonsdag med dem hver måned siden 2022. Én dag gir menybilder, reels, kampanjefilm og skjermreklame til alle restaurantene. Les casen.",
        lenker: [{ frase: "Les casen", sti: "/vart-arbeid/egon" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Vil dere vite hva en slik dag består av, står det i artikkelen om hva en produksjonsdag er.",
        lenker: [
          {
            frase: "hva en produksjonsdag er",
            sti: "/blogg/hva-er-en-produksjonsdag",
          },
        ],
      },
    ],
    lesVidere: [
      {
        sti: "/innholdsproduksjon",
        tekst: "innholdsproduksjon fra Reflektor",
      },
      {
        sti: "/blogg/hva-er-en-produksjonsdag",
        tekst: "hva en produksjonsdag er",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva gjør en innholdsprodusent?",
        svar: "En innholdsprodusent planlegger og lager foto, video og tekst til en bedrifts kanaler, fra idé og opptak til redigering og publisering.",
        lenker: [
          {
            sti: "/blogg/hva-gjr-en-innholdsprodusent",
            tekst: "Hva gjør en innholdsprodusent?",
          },
        ],
      },
      {
        sporsmal: "Hva koster innholdsproduksjon?",
        svar: "Det avhenger av omfang og om det er et enkeltprosjekt eller løpende. Hos Reflektor starter enkeltprosjekter på 40 000 kr, og løpende produksjon med publisering koster 30 000 kr/mnd.",
      },
    ],
  },
  {
    slug: "hva-er-innholdsmarkedsforing",
    /*
     * SKREVET OM I SIN HELHET 02.10.2026.
     *
     * TITTEL, H1 OG URL ER URØRT: artikkelen rangerer på plass 3–4 for
     * «innholdsmarkedsføring» og «innholdsmarkedsføring definisjon».
     * Definisjonsseksjonen står derfor tidlig, og SNL-definisjonen er
     * beholdt ordrett.
     *
     * SNL-LENKEN ER NY, og det er en rettelse. Copyen ba om å «lenke den
     * til snl.no som i dag» — men artikkelen SITERTE Store norske leksikon
     * uten å lenke dit. En definisjon vi låner fra en navngitt kilde skal
     * peke på kilden.
     */
    bilde: {
      fil: "kafe-hylle-1600",
      alt: "Rad med flasker i en butikkhylle",
    },
    tittel: "Hva er innholdsmarkedsføring?",
    beskrivelse:
      "Innholdsmarkedsføring (content marketing) er å tiltrekke kunder med nyttig innhold i stedet for rene salgsbudskap. Definisjon, eksempler og slik kommer dere i gang.",
    publisert: "2024-08-08",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Innholdsmarkedsføring, eller content marketing, er å tiltrekke og beholde kunder ved å publisere innhold som er nyttig eller interessant for dem, i stedet for rene salgsbudskap. Innholdsproduksjon er å lage innholdet. Innholdsmarkedsføring er strategien for hvordan det brukes.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Definisjon på innholdsmarkedsføring",
      },
      {
        type: "liste",
        punkter: [
          "Store norske leksikon: Innholdsmarkedsføring er former for markedsføring som utnytter medieinnhold rettet mot målgrupper for å utvikle positive kunderelasjoner.",
          "Content Marketing Institute: En strategi for å skape og distribuere relevant og verdifullt innhold for å tiltrekke og engasjere en definert målgruppe.",
          "Kort sagt: Folk kommer til dere fordi innholdet er verdt å se, ikke fordi dere har betalt for å stå i veien for dem.",
        ],
      },
      {
        type: "kilde",
        tekst:
          "Definisjonen er hentet fra Store norske leksikon, oppslagsordet innholdsmarkedsføring.",
        url: "https://snl.no/innholdsmarkedsføring",
      },
      {
        type: "avsnitt",
        tekst: "Tre kjennetegn går igjen:",
      },
      {
        type: "liste",
        punkter: [
          "Innholdet er laget for kunden, ikke for å fortelle hvor bra bedriften er.",
          "Det publiseres i kanaler dere eier: nettsiden, nyhetsbrevet, egne profiler i sosiale medier.",
          "Det er en løpende innsats, ikke en kampanje.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Innholdsmarkedsføring, innholdsproduksjon og reklame",
      },
      {
        type: "tabell",
        kolonner: ["Begrep", "Hva det er"],
        rader: [
          ["Innholdsproduksjon", "Å lage tekst, foto og video"],
          [
            "Innholdsmarkedsføring",
            "Strategien for hvilket innhold som lages, til hvem og hvor det publiseres",
          ],
          [
            "Reklame",
            "Betalt kommunikasjon der dere kjøper plass for budskapet",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Grensene er flytende. En video laget for egen Instagram-konto er innholdsmarkedsføring. Betaler dere for å vise den til flere, blir den en annonse. Les mer om hva innholdsproduksjon er og hva reklame er.",
        lenker: [
          {
            frase: "hva innholdsproduksjon er",
            sti: "/blogg/hva-er-innholdsproduksjon",
          },
          { frase: "hva reklame er", sti: "/blogg/hva-er-reklame" },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Hvorfor det lønner seg" },
      {
        type: "liste",
        punkter: [
          "Det bygger tillit før salget. Når noen har lært noe av dere, er det lettere å velge dere.",
          "Det varer. En god artikkel kan gi besøk i årevis. En annonse forsvinner når budsjettet er brukt.",
          "Det blir funnet av søkemotorer og AI. Google og AI-tjenester som ChatGPT henter svar fra nettsider som forklarer ting godt.",
          "Det gir annonsene bedre innhold. Det som fungerer organisk, er ofte det beste å betale for å vise.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Slik kommer dere i gang – fem steg",
      },
      {
        type: "liste",
        punkter: [
          "Bestem hva innholdet skal oppnå. Flere henvendelser, flere søkere til stillinger, eller at flere kjenner merkevaren? Ett hovedmål gjør det enklere å prioritere.",
          "Vit hvem det er for. Hvilke spørsmål stiller kundene før de kjøper? Svarene på dem er det beste innholdet dere kan lage.",
          "Velg formater dere klarer å holde ved like. Artikler på nettsiden, video i sosiale medier, et nyhetsbrev. Bedre to formater som holdes jevnt enn fem som dør etter en måned.",
          "Lag en plan. Hva publiseres når, hvor, og hvem lager det?",
          "Mål og juster. Se på hva som gir besøk, respons og henvendelser, og lag mer av det.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Hvordan en slik plan ser ut i praksis, står i artikkelen om sosiale medier-strategi.",
        lenker: [
          {
            frase: "sosiale medier-strategi",
            sti: "/blogg/sosiale-medier-strategi",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Eksempler" },
      {
        type: "liste",
        punkter: [
          "Pris- og sammenligningsartikler som svarer på det kundene lurer på før de tar kontakt.",
          "Korte videoer fra bak kulissene som viser hvordan produktet lages eller tjenesten utføres.",
          "Kundehistorier der kunden forteller med egne ord.",
          "Faste serier, for eksempel «månedens rett» eller «en dag med», som publikum lærer å kjenne igjen.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Vi skriver selv slike artikler, for eksempel om hva et SoMe-byrå koster i Norge.",
        lenker: [
          {
            frase: "hva et SoMe-byrå koster i Norge",
            sti: "/blogg/hva-koster-et-some-byra",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Det vanskeligste er å holde det gående",
      },
      {
        type: "avsnitt",
        tekst: `De fleste bedrifter vet hva de burde publisere. Det som stopper dem, er tid. Derfor har vi bygget hele tjenesten vår rundt rytme: én produksjonsdag i måneden hos dere, ${tilbud.videoerPerManed} videoer, og publisering to ganger i uka hele året, for ${kr(tilbud.prisPerManed)} kr/mnd.`,
        lenker: [{ frase: "hele tjenesten vår", sti: "/" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Trenger dere enkeltprosjekter i stedet, står det på siden om innholdsproduksjon.",
        lenker: [{ frase: "innholdsproduksjon", sti: "/innholdsproduksjon" }],
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "SoMe-abonnementet, med pris og vilkår" },
      {
        sti: "/blogg/hva-er-innholdsproduksjon",
        tekst: "hva innholdsproduksjon er",
      },
      { sti: "/blogg/hva-er-reklame", tekst: "hva reklame er" },
    ],
    tilleggsfaq: [
      {
        sporsmal:
          "Hva er forskjellen på innholdsmarkedsføring og innholdsproduksjon?",
        svar: "Innholdsproduksjon er å lage tekst, foto og video. Innholdsmarkedsføring er strategien for hvilket innhold som skal lages, for hvem og hvor det skal publiseres.",
      },
      {
        sporsmal: "Hva er content marketing på norsk?",
        svar: "Content marketing heter innholdsmarkedsføring på norsk. Det betyr å tiltrekke kunder med nyttig innhold i stedet for rene salgsbudskap.",
      },
      {
        sporsmal:
          "Hvor lang tid tar det før innholdsmarkedsføring gir resultater?",
        svar: "Det tar som regel flere måneder. Innhold bygger seg opp over tid, og effekten kommer av at dere publiserer jevnt.",
      },
    ],
  },
  {
    slug: "hva-er-videomarkedsfring",
    /*
     * SKREVET OM I SIN HELHET 02.10.2026, med ny `metaTittel`. URL-en har
     * en skrivefeil arvet fra Squarespace («videomarkedsfring»), og den
     * står: adressen er indeksert, og en retting ville kostet en redirect
     * for en bokstav ingen søker på.
     */
    bilde: {
      fil: "goretex-sept-1600",
      alt: "Person i skalljakke i en togdør",
    },
    tittel: "Hva er videomarkedsføring?",
    metaTittel: "Hva er videomarkedsføring? Formater og tips",
    beskrivelse:
      "Videomarkedsføring er å bruke video til å nå kunder: i sosiale medier, på nettsiden og i annonser. Formater, kanaler og hva som skal til for å lykkes.",
    publisert: "2024-06-25",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Videomarkedsføring er å bruke video i markedsføringen: korte videoer i sosiale medier, film på nettsiden, reklamefilm og videoannonser. Video gir mer plass enn tekst og bilde til å vise produktet, menneskene og stemningen. For de fleste bedrifter er det korte, stående videoer i sosiale medier som gir mest igjen.",
      },
      { type: "overskrift", niva: 2, tekst: "Formatene" },
      {
        type: "tabell",
        kolonner: ["Format", "Lengde", "Hvor", "Brukes til"],
        rader: [
          [
            "Korte videoer (Reels, TikTok, Shorts)",
            "10–60 sek",
            "Sosiale medier",
            "Synlighet, jevn tilstedeværelse",
          ],
          [
            "Reklamefilm",
            "6–30 sek",
            "TV, nett-TV, annonser",
            "Kampanjer, lanseringer",
          ],
          [
            "Bedriftsfilm",
            "1–3 min",
            "Nettside, presentasjoner",
            "Vise hvem dere er",
          ],
          [
            "Rekrutteringsfilm",
            "30 sek – 2 min",
            "Stillingsannonser, karriereside",
            "Få flere søkere",
          ],
          [
            "Eventvideo",
            "30 sek – 2 min",
            "Sosiale medier, nettside",
            "Dokumentere og invitere neste gang",
          ],
          ["Kundehistorie", "1–2 min", "Nettside, salg", "Bevis og tillit"],
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Hvorfor video?" },
      {
        type: "liste",
        punkter: [
          "Det viser i stedet for å påstå. Hvordan maten lages, hvordan produktet brukes, hvem som jobber der.",
          "Det passer kanalene folk bruker. Instagram, Facebook, TikTok og YouTube er bygget rundt video.",
          "Ett opptak gir mye. Samme dag kan gi korte videoer, en lengre film og stillbilder.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Fire ting som avgjør om videoen fungerer",
      },
      {
        type: "liste",
        punkter: [
          "De første sekundene. Start med det mest interessante, ikke med logoen.",
          "Riktig format. Stående (9:16) for sosiale medier, liggende (16:9) for nettside og TV.",
          "Teksting. Mange ser video uten lyd. Uten tekst forsvinner budskapet.",
          "Jevnlighet. Én stor film i året gjør mindre enn korte videoer hver uke. Folk må se dere ofte for å huske dere.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hvordan få video inn i markedsføringen",
      },
      {
        type: "liste",
        punkter: [
          "Bestem hva video skal gjøre. Synlighet, salg eller rekruttering krever ulike videoer.",
          "Planlegg i serier, ikke enkeltvideoer. Én produksjonsdag kan gi en måneds innhold hvis dere vet hva som skal filmes.",
          "Bruk det som fungerer organisk i annonser. Det publikum reagerer på gratis, er ofte det beste å betale for.",
          "Klipp flere versjoner. Samme opptak kan bli en 30-sekunders reklame, en 15-sekunders annonse og tre korte videoer.",
        ],
      },
      /*
        OVERSKRIFTEN ER GJORT MER SPESIFIKK. Copyen hadde «Hva koster
        det?», og den kolliderte: /faq har nøyaktig det spørsmålet, og
        begge ville blitt FAQPage-markert på hver sin URL. Google sier
        eksplisitt at samme spørsmål ikke skal merkes opp to steder.
        Fanget av tests/faq.test.ts.
      */
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster videomarkedsføring?",
      },
      {
        type: "avsnitt",
        tekst:
          "Det spenner fra noen tusenlapper for en enkel video til flere hundre tusen for en reklamefilm. Vi har sammenlignet norske prisguider for videoproduksjon og regnet på hele kostnaden for en reklamefilm.",
        lenker: [
          {
            frase: "norske prisguider for videoproduksjon",
            sti: "/blogg/hva-koster-videoproduksjon",
          },
          {
            frase: "hele kostnaden for en reklamefilm",
            sti: "/blogg/hva-koster-reklamefilm",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Slik jobber vi" },
      {
        type: "avsnitt",
        tekst:
          "Reflektor startet som produksjonsselskap og har laget video for blant andre Anton Sport, Egon, Peppes Pizza og Vitusapotek. Vi gjør begge deler:",
      },
      {
        type: "avsnitt",
        tekst: `Løpende: én produksjonsdag i måneden, ${tilbud.videoerPerManed} korte videoer og publisering to ganger i uka, for ${kr(tilbud.prisPerManed)} kr/mnd. Se reels-produksjon.`,
        lenker: [{ frase: "reels-produksjon", sti: "/reels-produksjon" }],
      },
      {
        type: "avsnitt",
        tekst: `Enkeltprosjekter: reklamefilm, bedriftsfilm og eventvideo fra ${kr(tilbud.fraPrisProsjekt)} kr. Se videoproduksjon i Oslo.`,
        lenker: [
          { frase: "videoproduksjon i Oslo", sti: "/videoproduksjon-i-oslo" },
        ],
      },
    ],
    lesVidere: [
      {
        sti: "/videoproduksjon-i-oslo",
        tekst: "videoproduksjon i Oslo fra Reflektor",
      },
      {
        sti: "/blogg/hva-koster-videoproduksjon",
        tekst: "hva videoproduksjon koster",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvor lang bør en video i sosiale medier være?",
        svar: "For Reels og TikTok fungerer 10–30 sekunder godt for de fleste bedrifter. Det viktigste er at de første sekundene fanger oppmerksomheten.",
      },
      {
        sporsmal: "Bør bedriftsvideoer tekstes?",
        svar: "Ja. Mange ser video i sosiale medier uten lyd, og teksting gjør at budskapet kommer frem likevel.",
      },
    ],
  },
  {
    slug: "hva-er-employer-branding",
    /* SKREVET OM I SIN HELHET 02.10.2026, med ny `metaTittel`. */
    bilde: {
      fil: "ansatte-produksjon-1600",
      alt: "Fire ansatte i arbeidstøy i et produksjonslokale",
    },
    tittel: "Hva er employer branding?",
    metaTittel: "Hva er employer branding? Slik bygger dere det",
    beskrivelse:
      "Employer branding er arbeidet med å bli en arbeidsplass folk vil søke seg til. Hva det er, hvorfor det lønner seg, og hvordan video kan brukes.",
    publisert: "2024-06-12",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Employer branding er hvordan en bedrift fremstår som arbeidsgiver, og arbeidet med å bli et sted folk vil jobbe. Det handler om hva nåværende og fremtidige ansatte vet og mener om bedriften. Det vises i stillingsannonser, på karrieresiden, i sosiale medier og gjennom de ansatte selv — ofte som en employer branding-video.",
        lenker: [
          {
            frase: "employer branding-video",
            sti: "/employer-branding-video-oslo",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Employer brand og employer branding",
      },
      {
        type: "liste",
        punkter: [
          "Employer brand er omdømmet dere har som arbeidsgiver, enten dere jobber med det eller ikke.",
          "Employer branding er arbeidet med å forme det bevisst.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Alle bedrifter har et employer brand. Spørsmålet er om det er det dere ønsker.",
      },
      { type: "overskrift", niva: 2, tekst: "Hvorfor det lønner seg" },
      {
        type: "liste",
        punkter: [
          "Flere og bedre søkere. Folk søker der de kan se seg selv jobbe.",
          "Enklere ansettelser. Søkerne vet mer om dere på forhånd og vet hva de søker på.",
          "Ansatte som blir. Det som gjør dere attraktive for nye, gjør at de som er der, blir værende.",
          "Sterkere merkevare. Kunder legger også merke til hvordan dere behandler folkene deres.",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Slik bygger dere et employer brand – fem steg",
      },
      {
        type: "liste",
        punkter: [
          "Finn ut hva som er sant. Spør de ansatte hvorfor de jobber der og hva de ville sagt til en venn. Svarene er grunnlaget.",
          "Velg det som skiller dere ut. Ikke «godt arbeidsmiljø», alle sier det. Hva er spesielt hos dere: faget, folkene, mulighetene, stedet?",
          "Vis det med ekte folk. De ansatte er mer troverdige enn noe annet. Folk vil se hvem de skal jobbe med.",
          "Vær der søkerne er. Stillingsannonser, karrieresiden, LinkedIn og Instagram. Samme budskap overalt.",
          "Hold det ved like. Én kampanje når dere har mange stillinger ute, er ikke nok. Jevn tilstedeværelse gjør at folk husker dere når de er klare for å bytte jobb.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Video i employer branding" },
      {
        type: "avsnitt",
        tekst:
          "Video er det formatet som best viser hvordan det er å jobbe et sted: lokalene, tempoet, folkene og humoren.",
      },
      {
        type: "liste",
        punkter: [
          "Kort film til stillingsannonsen (30–60 sek): hva jobben er, med en som har den.",
          "Film til karrieresiden (1–2 min): hvem dere er og hvorfor folk blir.",
          "Korte videoer i sosiale medier: en dag på jobb, nye ansatte, faglige øyeblikk.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det fungerer best når det er de ansatte dere faktisk har som er med, ikke skuespillere. Se employer branding-video.",
        lenker: [
          {
            frase: "employer branding-video",
            sti: "/employer-branding-video-oslo",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Vanlige feil" },
      {
        type: "liste",
        punkter: [
          "Generiske verdier. «Engasjert, åpen og ærlig» kunne stått hos hvem som helst.",
          "Bildebank. Søkere ser forskjell på ekte ansatte og modeller.",
          "Bare i rekrutteringsperioder. Da når dere bare dem som allerede leter.",
          "Et bilde som ikke stemmer. Lover dere noe som ikke er sant, slutter folk raskt.",
        ],
      },
      /*
        OVERSKRIFTEN ER OMFORMULERT. Copyen hadde «Hva koster en employer
        branding-video?», som er ordrett spørsmålet på
        /employer-branding-video-oslo. Tjenestesiden skal eie det
        spørsmålet — det er den som skal selge — så artikkelen stiller det
        litt annerledes. Fanget av tests/faq.test.ts.
      */
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster en film til employer branding?",
      },
      {
        type: "avsnitt",
        tekst: `Hos Reflektor starter enkeltprosjekter på ${kr(tilbud.fraPrisProsjekt)} kr. Vi filmer hos dere, med de ansatte dere har, og leverer filmen i formater til stillingsannonser, karriereside og sosiale medier. Les mer.`,
        lenker: [{ frase: "Les mer", sti: "/employer-branding-video-oslo" }],
      },
    ],
    lesVidere: [
      {
        sti: "/employer-branding-video-oslo",
        tekst: "employer branding-video fra Reflektor",
      },
      {
        sti: "/blogg/hva-er-videomarkedsfring",
        tekst: "hva videomarkedsføring er",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva er forskjellen på employer branding og rekruttering?",
        svar: "Rekruttering er å fylle en bestemt stilling. Employer branding er det langsiktige arbeidet med å bli en arbeidsplass folk vil søke seg til, slik at rekrutteringen blir enklere.",
      },
      {
        sporsmal: "Hvem har ansvaret for employer branding?",
        svar: "Som regel HR og markedsavdelingen sammen, med støtte fra ledelsen. De ansatte er likevel de viktigste budbringerne.",
      },
    ],
  },
  {
    slug: "hva-gjr-en-innholdsprodusent",
    /*
     * SKREVET OM I SIN HELHET 02.10.2026, med ny `metaTittel`. URL-en har
     * samme type skrivefeil fra Squarespace som videomarkedsføring-
     * artikkelen, og står av samme grunn.
     */
    bilde: {
      fil: "portrett-bat-1800",
      alt: "Person i oransje skjorte på en brygge ved sjøen",
    },
    tittel: "Hva gjør en innholdsprodusent?",
    metaTittel: "Hva gjør en innholdsprodusent? Rolle og pris",
    beskrivelse:
      "En innholdsprodusent planlegger og lager foto, video og tekst til en bedrifts kanaler. Hva rollen innebærer, og når det lønner seg å leie inn.",
    publisert: "2024-06-28",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En innholdsprodusent planlegger og lager innhold, oftest foto, video og tekst, til en bedrifts nettside, sosiale medier og annonser. Rollen kan være intern, frilans eller i et byrå. Den spenner fra idé og manus til opptak, redigering og publisering.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva en innholdsprodusent gjør i praksis",
      },
      {
        type: "liste",
        punkter: [
          "Planlegger: hva skal lages denne måneden, til hvilke kanaler og hvorfor.",
          "Skriver manus og idéer: hva som skal skje i hver video, og hva som skal sies.",
          "Filmer og fotograferer: hos kunden, i studio eller på arrangementer.",
          "Redigerer: klipp, lyd, farge og teksting, i formatene hver kanal trenger.",
          "Publiserer: tekster, tidspunkt og oppfølging av kommentarer.",
          "Følger opp: hva fungerte, og hva bør gjøres annerledes neste gang.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "I små bedrifter gjør én person alt dette. I byråer er det ofte delt mellom produsent, fotograf, videograf og klipper.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Innholdsprodusent, fotograf, videograf – hva er forskjellen?",
      },
      {
        type: "tabell",
        kolonner: ["Rolle", "Hovedjobb"],
        rader: [
          ["Fotograf", "Tar bilder"],
          ["Videograf", "Filmer og ofte klipper"],
          [
            "Innholdsprodusent",
            "Planlegger og lager innhold på tvers av formater, med kanalene i tankene",
          ],
          [
            "SoMe-ansvarlig",
            "Har ansvaret for kanalene: plan, publisering og dialog. Lager ofte noe av innholdet selv",
          ],
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva kjennetegner en god innholdsprodusent?",
      },
      {
        type: "liste",
        punkter: [
          "Tenker kanal før kamera. Vet om opptaket skal bli en Reel, en annonse eller et bilde på nettsiden, og filmer deretter.",
          "Får folk til å slappe av. Det meste av godt bedriftsinnhold handler om ansatte som ikke er vant til kamera.",
          "Jobber raskt. Får mye ut av én dag uten å gå på kompromiss med kvaliteten.",
          "Forstår merkevaren. Innholdet skal se ut som det kommer fra dere, ikke fra produsenten.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Ansette, frilanser eller byrå?" },
      {
        type: "liste",
        punkter: [
          "Ansatt: Alltid tilgjengelig og kjenner bedriften, men lønn, utstyr og ferie gjør det til den dyreste løsningen for de fleste.",
          "Frilanser: Fleksibelt og godt for enkeltoppdrag. Dere må selv planlegge og koordinere.",
          "Byrå: Et helt team og fast pris, men dere må bruke tid på å sette byrået inn i bedriften i starten.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Vi har regnet på de to første i regnestykket for SoMe-ansvarlig mot byrå, og sammenlignet alle tre med dagsatser i SoMe-byrå, frilanser eller ansatt.",
        lenker: [
          {
            frase: "regnestykket for SoMe-ansvarlig mot byrå",
            sti: "/blogg/some-ansvarlig-eller-byra",
          },
          {
            frase: "SoMe-byrå, frilanser eller ansatt",
            sti: "/blogg/some-byra-frilanser-eller-ansatt",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster en innholdsprodusent?",
      },
      {
        type: "liste",
        punkter: [
          "Ansatt: lønn pluss arbeidsgiveravgift, feriepenger, pensjon og utstyr.",
          "Frilanser: som regel dagpris eller pris per oppdrag.",
          "Byrå: fast månedspris eller pris per prosjekt.",
        ],
      },
      {
        type: "avsnitt",
        tekst: `Hos Reflektor koster løpende produksjon ${kr(tilbud.prisPerManed)} kr/mnd. Det inkluderer én produksjonsdag, ${tilbud.videoerPerManed} videoer og publisering to ganger i uka. Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Se også hva et SoMe-byrå koster i Norge.`,
        lenker: [
          {
            frase: "hva et SoMe-byrå koster i Norge",
            sti: "/blogg/hva-koster-et-some-byra",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Slik jobber produsentene våre" },
      {
        type: "avsnitt",
        tekst:
          "Produsentene i Reflektor har bakgrunn fra foto- og videoproduksjon for noen av Norges mest kjente merkevarer. Produsentene er også kundeansvarlige. Den som filmer hos dere, er altså den som kjenner bedriften, så dere slipper å forklare den på nytt hver gang. Møt teamet.",
        lenker: [{ frase: "Møt teamet", sti: "/om-oss" }],
      },
    ],
    lesVidere: [
      {
        sti: "/innholdsproduksjon",
        tekst: "innholdsproduksjon fra Reflektor",
      },
      {
        sti: "/blogg/some-byra-frilanser-eller-ansatt",
        tekst: "byrå, frilanser eller ansatt – med tall",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal:
          "Hva er forskjellen på en innholdsprodusent og en SoMe-ansvarlig?",
        svar: "En innholdsprodusent lager innholdet: foto, video og tekst. En SoMe-ansvarlig har ansvaret for kanalene: plan, publisering og dialog med følgerne. I mange bedrifter er det samme person.",
      },
      {
        sporsmal: "Trenger en innholdsprodusent utdanning?",
        svar: "Det finnes utdanninger i foto, film og medieproduksjon, men erfaring og en god portefølje betyr som regel mer enn papirene.",
      },
    ],
  },
  {
    slug: "hva-innebaerer-digital-historiefortelling",
    /*
     * SKREVET OM I SIN HELHET 02.10.2026.
     *
     * TITTEL, H1 OG URL ER URØRT: artikkelen rangerer på plass 1 for
     * «digital historiefortelling». Begrepet står ordrett i ingressen og i
     * første H2, som før.
     */
    bilde: {
      fil: "scene-vegg",
      alt: "Foredragsholder foran en skjerm",
      /* `fokus` beholdt fra før omskrivingen 02.10.2026 — motivet er
         uendret, og beskjæringen er satt ved å se på bildet. */
      fokus: "center 35%",
    },
    tittel: "Hva innebærer digital historiefortelling?",
    beskrivelse:
      "Digital historiefortelling er å formidle et budskap som en historie i digitale kanaler. Hva det er, hvorfor det virker, og eksempler for bedrifter.",
    publisert: "2024-07-05",
    oppdatert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Digital historiefortelling er å formidle et budskap som en historie i digitale kanaler som sosiale medier, nettsider og video. Historien har en person, et problem og en utvikling. For bedrifter betyr det å vise kunder, ansatte og prosesser i stedet for å liste opp egenskaper.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Digital historiefortelling – hva er det?",
      },
      {
        type: "avsnitt",
        tekst:
          "Historiefortelling er like gammelt som språket. Det digitale er bare formatet: en Reel på 30 sekunder, en kundefilm på to minutter, en serie bilder på Instagram eller en artikkel på nettsiden. Kjernen er den samme: noen vil noe, noe står i veien, og noe endrer seg.",
      },
      {
        type: "avsnitt",
        tekst:
          "Forskjellen fra vanlig reklame er at publikum følger en utvikling i stedet for å få en påstand. «Vi har Oslos beste bakst» er en påstand. En video som følger bakeren fra klokken fire om morgenen til første kunde går ut døra, er en historie.",
      },
      { type: "overskrift", niva: 2, tekst: "Hvorfor det virker" },
      {
        type: "liste",
        punkter: [
          "Folk husker historier bedre enn fakta. En historie gir informasjonen en rekkefølge og en grunn.",
          "Det bygger tillit. Når dere viser hvordan noe faktisk gjøres, trenger dere ikke påstå at det er bra.",
          "Det holder på oppmerksomheten. Spørsmålet «hva skjer nå?» får folk til å se videre, og i sosiale medier er det det som teller.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Fem elementer i en god historie" },
      {
        type: "liste",
        punkter: [
          "En person. Mennesker kjenner seg igjen i mennesker. Det kan være en kunde, en ansatt eller daglig leder.",
          "Et problem. Noe som står på spill: en frist, en utfordring, et behov. Det trenger ikke være dramatisk.",
          "En utvikling. Noe skjer underveis. Uten endring er det en beskrivelse, ikke en historie.",
          "En løsning. Historien lander. For en bedrift er løsningen ofte det dere selger, men den bør vises, ikke sies.",
          "Følelse. Humor, stolthet, lettelse eller nysgjerrighet. Det er det publikum husker.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Eksempler fra bedrifter" },
      {
        type: "liste",
        punkter: [
          "Restaurant: Fra råvaren kommer inn døra til retten står på bordet, på 30 sekunder.",
          "Kjede: Én ansatt per butikk forteller hva som er nytt denne måneden. Femti butikker, samme format.",
          "Rekruttering: En nyansatt viser første arbeidsdag, uten manus.",
          "Produkt: Problemet kunden hadde før, og hvordan det ser ut nå.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Mange av de beste historiene finnes allerede i bedriften. Jobben er å finne dem og filme dem.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Appellformene: ethos, patos og logos",
      },
      {
        type: "avsnitt",
        tekst: "Retorikkens tre appellformer er et nyttig verktøy:",
      },
      {
        type: "liste",
        punkter: [
          "Ethos – troverdighet: vis hvem dere er og hva dere kan.",
          "Patos – følelser: få publikum til å bry seg.",
          "Logos – fakta: gi dem tallene og argumentene som gjør valget enkelt.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "En god historie bruker alle tre. Patos fanger oppmerksomheten, ethos og logos gjør at folk handler.",
      },
      { type: "overskrift", niva: 2, tekst: "Slik kommer dere i gang" },
      {
        type: "liste",
        punkter: [
          "Velg én kanal og ett format, for eksempel korte videoer på Instagram.",
          "Lag en liste over ti historier dere har i bedriften: kunder, ansatte, prosesser, før og etter.",
          "Film flere av dem på én dag, slik at dere har innhold for flere uker.",
          "Publiser jevnt, og se hvilke historier publikum reagerer på.",
        ],
      },
      {
        type: "avsnitt",
        tekst: `Det er sånn vi jobber: én produksjonsdag i måneden hos dere, og ${tilbud.videoerPerManed} videoer ut av den. Les hva en produksjonsdag er, eller se hvordan vi driver reels-produksjon.`,
        lenker: [
          {
            frase: "hva en produksjonsdag er",
            sti: "/blogg/hva-er-en-produksjonsdag",
          },
          { frase: "reels-produksjon", sti: "/reels-produksjon" },
        ],
      },
    ],
    lesVidere: [
      { sti: "/reels-produksjon", tekst: "reels-produksjon fra Reflektor" },
      {
        sti: "/blogg/hva-er-en-produksjonsdag",
        tekst: "hva en produksjonsdag er",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal:
          "Hva er forskjellen på digital historiefortelling og vanlig reklame?",
        svar: "Vanlig reklame forteller hva et produkt er og kan. Digital historiefortelling viser en utvikling: en person, et problem og en løsning. Publikum trekker konklusjonen selv.",
      },
      {
        sporsmal: "Trenger digital historiefortelling å være lang?",
        svar: "Nei. En god historie kan fortelles på 15–30 sekunder i en kort video, så lenge den har en person, et problem og en utvikling.",
      },
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
          "Det ligger under medianen. SSB oppgir en medianlønn i Norge på 55 800 kroner i måneden og et gjennomsnitt på 62 070, altså 669 600 og 744 840 kroner i året for alle ansatte sett under ett. Eksempelet på 600 000 er lavere enn begge, og regnestykket er dermed konservativt: setter dere inn et høyere og mer realistisk lønnsnivå, blir forskjellen større, ikke mindre.",
      },
      {
        type: "kilde",
        tekst:
          "Lønnstallene er fra Statistisk sentralbyrå. Vi oppgir bevisst ikke et lønnsnivå for SoMe-ansvarlige spesifikt. Stillingstittelen finnes ikke som egen kategori i SSBs statistikk, og tallene som sirkulerer for den rollen kommer fra kilder uten samme etterprøvbarhet.",
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
        lenker: [
          {
            frase: "de fleste byråer ikke oppgir pris",
            sti: "/blogg/hva-koster-et-some-byra",
          },
          { frase: "30 000 kroner i måneden", sti: "/#pris" },
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det er mindre enn halvparten av kostnaden i eksempelet over. Men de to leveransene er ikke like, og det er den viktigste delen av sammenligningen.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva får dere, og hva får dere ikke?",
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
          "Men en ansatt SoMe-ansvarlig skal som regel beherske strategi, foto, video, klipping, fargekorrigering, tekst og publisering alene. Det er flere fagfelt, og de færreste er sterke i alle. Resultatet blir ofte mobilinnhold laget mellom andre oppgaver, og da er det ikke 764 410 kroner mot 360 000, men 764 410 kroner mot et bedre produkt til under halve prisen.",
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
          "Den vanligste løsningen er ikke enten–eller. En markedsansvarlig som allerede jobber der, håndterer dialogen, kjenner kundene og legger strategien, og produksjonen settes bort. Da betaler dere for det som faktisk er vanskelig å gjøre selv, og beholder det som krever å være innenfor.",
      },
    ],
    lesVidere: [
      { sti: "/", tekst: "Reflektors pris og leveranse, oppgitt åpent" },
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
      {
        sti: "/blogg/hva-koster-et-some-byra",
        tekst: "hva et SoMe-byrå koster i markedet",
      },
      {
        sti: "/blogg/some-byra-frilanser-eller-ansatt",
        tekst: "det samme regnestykket med frilanseren regnet inn",
      },
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
    oppdatert: "2026-10-04",
    blokker: [
      {
        type: "avsnitt",
        tekst: `Kort svar: et enkelt videoprosjekt for en bedrift ligger som regel mellom 25 000 og 50 000 kroner. En reklamefilm med konsept, et profesjonelt team og flere leveranseformater koster oftest fra 50 000 til 200 000. Hos oss starter enkeltprosjekter på ${kr(tilbud.fraPrisProsjekt)} kr.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Det er det korte svaret. Det lange er mer nyttig, for tallene over er hentet fra prisguider som er uenige med hverandre, og uenigheten forteller dere mer om markedet enn noen av tallene gjør alene. Skal dere rett til leveransen, ligger den på siden om videoproduksjon i Oslo.",
        lenker: [
          {
            frase: "videoproduksjon i Oslo",
            sti: "/videoproduksjon-i-oslo",
          },
        ],
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
          ["Byråmatch, mai 2026", "–", "50 000–150 000 kr", "flere millioner"],
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
          "Legg merke til hvor lite de er enige om. Den ene kaller 50 000 kroner en enkel produktvideo. Den andre kaller det en standard reklamefilm. Den tredje legger hele det enkle nivået under 40 000. Det er ikke fordi noen tar feil. Det er fordi «videoproduksjon» ikke er én tjeneste, og et tall uten en leveranse ved siden av betyr ingenting.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den praktiske konsekvensen: to tilbud dere har fått på samme film kan være riktig priset begge to, og likevel handle om helt forskjellig arbeid. Jobben deres er ikke å finne den laveste prisen, men å finne ut hva de to tilbudene faktisk inneholder.",
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
          "Hvor mange som må være til stede. Én person med kamera koster én ting. Fotograf, lydtekniker, regissør og lyssetter koster noe annet, og noen filmer krever det.",
          "Lokasjon og medvirkende. Leid lokale, skuespillere og statister er poster som legges oppå produksjonen, og de kan fort bli de tyngste.",
          "Hvor mye etterarbeid filmen krever. Klipp og farge på en enkel film er timer. Animasjon, grafikk, voice-over og musikk som må klareres, er dager.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Kompleksitet i etterarbeidet er den posten folk undervurderer oftest. Selve opptaket er en dag dere kan se. Etterarbeidet er en uke dere ikke ser.",
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
          "To ferdige reklamefilmer, 15 og 4 sekunder. Lengden sier lite om prisen. Antall opptaksdager og mengden etterarbeid gjør.",
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
          "Still med egne folk. Ansatte foran kamera i stedet for skuespillere gjør filmen billigere, og som regel mer troverdig.",
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
          "Hvem står på settet: egne ansatte eller innleide frilansere?",
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
        tekst: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Hva et prosjekt faktisk lander på, avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever.`,
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
          "En enkelt film dekker ett budskap på ett tidspunkt. Skal dere være synlige gjennom året, blir fire enkeltprosjekter dyrere enn tolv måneder med løpende produksjon, og det er som regel der regnestykket faktisk avgjøres.",
      },
    ],
    lesVidere: [
      /*
        LAGT TIL 02.10.2026. Denne artikkelen sammenligner prisguidene for
        selve produksjonen. Den nye svarer på det som kommer i tillegg —
        skuespillere, musikk og visning — og de to hører sammen.
      */
      {
        sti: "/blogg/hva-koster-reklamefilm",
        tekst: "hva en reklamefilm koster, med rettigheter og visning",
      },
      { sti: "/reklamefilm", tekst: "hva en reklamefilm fra Reflektor koster" },
      {
        sti: "/videoproduksjon-i-oslo",
        tekst: "videoproduksjon i Oslo, med priser og leveranse",
      },
      {
        sti: "/blogg/hva-koster-eventfotograf",
        tekst: "hva en eventfotograf koster i markedet",
      },
      {
        sti: "/blogg/hva-er-videomarkedsfring",
        tekst: "hva videomarkedsføring er, og når det lønner seg",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvorfor spriker tilbudene så mye på den samme filmen?",
        svar: "Fordi «en film» ikke er en definert leveranse. Det ene tilbudet kan være én person med kamera i tre timer og en enkel klipp. Det andre kan være et team på fire, to opptaksdager, manus, farge, lyd og fem ferdige formater. Begge er reklamefilm. Be om antall opptaksdager, antall folk på settet og antall ferdige leveranser skriftlig. Da blir prisene sammenlignbare med én gang.",
      },
      {
        sporsmal: "Kommer annonsebudsjett i tillegg til produksjonsprisen?",
        svar: "Ja, hos de aller fleste. Produksjonsprisen dekker å lage filmen. Skal den vises som annonse på Facebook, Instagram, YouTube eller TV, betaler dere visningene separat, og de pengene går til plattformen, ikke til produsenten. Regn det som en egen post når dere setter budsjettet, og avklar hvem som skal sette opp og følge annonsen.",
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
    /*
     * BILDET VAR ET UTTREKK FRA FILM, byttet 30.09.2026. Se kommentaren
     * øverst i fila om hvorfor ingen stillbilder skal hentes fra video.
     *
     * Erstatningen er et ekte fotografi fra et oppdrag: et kjøkken midt i
     * arbeidet. Det er nettopp der en produksjonsdag foregår — hos kunden,
     * mens folk jobber — og artikkelen har to ekte bak-kulissene-filmer
     * lenger nede som viser selve riggen.
     */
    bilde: {
      fil: "kjokken-servering-1080",
      alt: "Frityrstekt kylling løftes opp bak disken på et spisested",
    },
    tittel: "Hva er en produksjonsdag?",
    beskrivelse:
      "Én dag, ett team, en måned med innhold. Hva som skjer før, under og etter, og hva dere sitter igjen med når dagen er over.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst: `En produksjonsdag er én dag der et filmteam kommer til dere og produserer innholdet for en hel måned. Hos oss er produksjonsmålet ${tilbud.videoerPerManed} ferdig redigerte videoer fra den ene dagen, og selve dagen tar som regel noen timer, ikke hele arbeidsdagen.`,
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
          "Derfor er den femte filmen på en dag mye billigere enn den første. Og derfor er en dag den enheten som gir mest innhold per krone, forutsatt at dagen er planlagt for det.",
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
          "Dagen er planlagt før noen slår på et kamera. Vi går gjennom det dere allerede har publisert og måler hva som faktisk har fungert: hvilke formater, lengder og motiver som får rekkevidde. Et typisk grunnlag er rundt hundre publiseringer over fire måneder.",
      },
      {
        type: "avsnitt",
        tekst:
          "Funnene blir til navngitte innholdsserier med konkrete filmer, og de blir til en kjøreplan dere får på forhånd. Kjøreplanen sier hvem som skal være med, hvor vi filmer og hva som eventuelt må klargjøres før vi kommer.",
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
          "Vi filmer dem som faktisk jobber der, og helst ikke bare ledelsen. Vi bruker ikke skuespillere.",
          "Vi rigger om mellom oppsettene etter kjøreplanen, slik at én dag dekker flere serier og ikke bare én.",
          "Stillbilder tas ved behov, ikke som en fast leveranse. Kapasiteten deles med video, og derfor er videotallet et produksjonsmål og ikke en garanti.",
        ],
      },
      /*
       * HER LÅ ET BILDE AV EN SKJERM PÅ SETTET, fjernet 30.09.2026. Det var
       * et uttrekk fra film, og vi har ikke noe ekte fotografi av det samme.
       * Å bytte det mot et bilde som viser noe annet ville gjort
       * bildeteksten usann, så blokken er tatt ut i stedet. Artikkelen har
       * fortsatt to ekte bak-kulissene-filmer fra produksjonsdager.
       */
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
          "Videoene leveres stående i 9:16. Skal noe brukes på skjerm i butikk, i en annonse, på nettsiden eller på trykk, tilpasser vi det eller produserer for det. Si fra i planleggingen, så er det med i kjøreplanen.",
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
        svar: "Det er den vanligste innvendingen, og den er berettiget hvis dagen ikke er planlagt. Derfor rigger vi om mellom oppsettene: ulike lokasjoner i bygget, ulike personer, ulike motiver og ulike lengder. Kjøreplanen er bygget rundt flere innholdsserier, ikke én. Klær, lys og bakgrunn varierer med oppsettet, og materialet publiseres over fire uker, ikke samme uke.",
      },
      {
        sporsmal: "Må vi stenge mens dere filmer?",
        svar: "Nei. Vi filmer som regel mens driften går som normalt, og det er ofte det som gjør innholdet troverdig. Er det et oppsett som krever ro eller et tomt lokale, legger vi det til et tidspunkt som passer: før åpning, etter stengetid eller i en rolig time. Det avklares i kjøreplanen dere får på forhånd, slik at ingen blir overrasket på dagen.",
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
    /*
     * BILDET VAR ET UTTREKK FRA FILM, byttet 30.09.2026.
     *
     * Erstatningen er valgt etter hva artikkelen handler om: én person som
     * utøver faget sitt alene. Spørsmålet i teksten er hvem som skal gjøre
     * jobben — en ansatt, en frilanser eller et byrå — og et bilde av én
     * håndverker i arbeid stiller det spørsmålet uten å svare på det.
     */
    bilde: {
      fil: "kjokken-kokk-1080",
      alt: "Kokk som anretter en rett i et mørkt kjøkken",
      /*
        FOKUS OVER MIDTEN. Toppbildet er en 2,6:1-stripe, og et kvadratisk
        bilde beskåret i midten kuttet hodet av kokken — målt i nettleseren
        30.09.2026. Ved 20 % lå haken så vidt innenfor overkanten, så
        ansiktet ligger høyere i motivet enn antatt. Toppjustert viser
        stripen de øverste 38 % — hode, armer og anretningen.
      */
      fokus: "center top",
    },
    tittel: "SoMe-byrå, frilanser eller ansatt?",
    beskrivelse:
      "Dagsatser fra Norsk Journalistlag, en avgiftsfelle fra Skatteetaten, og hva som faktisk skiller de tre alternativene.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Frilanser er det billigste alternativet på papiret, og det stemmer så lenge oppgaven er én film. Skal det produseres innhold hver måned, året rundt, blir de tre alternativene overraskende like i pris, og da er det ikke prisen som avgjør, men hvor mye av jobben dere selv må holde i.",
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
          "Regnestykket for en ansatt står i en egen artikkel, med tall fra Altinn og SSB. Den skal ikke gjentas her. Under handler det om frilanseren, som er alternativet ingen har regnet på.",
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
          "Satsene er Norsk Journalistlags minstesatser for frilansere, oppdatert 17.04.2026. De gjelder journalistisk arbeid og er minstesatser, ikke markedspris. Kommersiell produksjon ligger som regel høyere. NJ oppgir samtidig at driftskostnadene de er beregnet ut fra er rundt 200 000 kroner i året for fotografer og 300 000 for videojournalister, siden utstyret er dyrt.",
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
          "Profilfilm for et rådgivningsselskap. 39 sekunder, filmet på én dag og klippet over flere.",
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
          "Med satsene over betyr det rundt 25 000 til 33 000 kroner for én måneds produksjon, før planlegging, før research på hva som faktisk har fungert i kanalene deres, og før noen har publisert noe.",
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
          "Fritaket gjelder bare når arbeidet er utført som ledd i selvstendig næringsvirksomhet. Får dere en faktura fra et registrert foretak, er dere trygge. Betaler dere et honorar til en privatperson, kommer avgiften i tillegg til honoraret, og da er ikke frilanseren så mye billigere som tilbudet så ut til.",
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
          "Dere trenger en spesifikk kompetanse for ett oppdrag: drone, animasjon, en bestemt stil.",
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
      {
        sti: "/blogg/hva-koster-et-some-byra",
        tekst: "hva et SoMe-byrå koster i markedet",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Kan vi bruke frilanser og byrå om hverandre?",
        svar: "Ja, og mange gjør det. Den vanligste kombinasjonen er en fast avtale for det løpende innholdet og en frilanser inn på enkeltoppdrag som krever noe spesielt: drone, animasjon, en fotograf med en bestemt stil. Det som skaper trøbbel, er ikke kombinasjonen, men at ingen eier helheten: to leverandører som leverer i hver sin stil, i hver sine formater, uten en felles plan, gir et arkiv som ikke henger sammen. Bestem hvem som eier planen før dere bestiller noe.",
      },
      {
        sporsmal: "Hvem eier materialet en frilanser har laget for oss?",
        svar: "Det avhenger av hva dere har avtalt, og det er verdt å avklare skriftlig før oppdraget starter. Åndsverkloven gir opphavsretten til den som har skapt verket, og en betaling for et oppdrag overfører ikke automatisk full bruksrett til alt, i alle kanaler, for all tid. Be om at avtalen sier konkret hva materialet kan brukes til: nettside, annonser, skjerm i butikk, trykk og hvor lenge. Be også om råmaterialet hvis dere vil kunne klippe om senere. Det følger sjelden med av seg selv.",
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
          "En kjede har ikke det samme problemet som en enkeltbutikk. Utfordringen er sjelden å lage innhold. Den er å lage innhold som fungerer for femti lokasjoner og et halvt dusin flater, uten å sette i gang femti produksjoner.",
      },
      {
        type: "avsnitt",
        tekst:
          "Løsningen de fleste kjeder lander på, er den samme: produser sentralt, lever i mange formater og la lokasjonene bruke materialet i stedet for å lage sitt eget.",
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
          "Flater. Innholdet skal ikke bare i feeden. Det skal på skjerm i butikk, på skjerm i kjøpesenteret, i annonser, på nettsiden og i kampanjer, og hver flate har sitt format.",
          "Samme uttrykk overalt. Femti lokasjoner som lager sitt eget, blir femti ulike merkevarer, og den kostnaden dukker ikke opp i noe budsjett.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det tredje er det dyreste, og det som oppdages sist. Et bildespråk som sprekker opp, er vanskelig å samle igjen.",
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
        tekst: "Sentralt eller lokalt: hvem skal publisere?",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette er valget som avgjør resten. Lar dere hver lokasjon styre sin egen konto, får dere nærhet og lokal tilstedeværelse, men også et uttrykk som spriker, en kvalitet som varierer med hvem som er på jobb, og ingen som kan svare på hva kjeden faktisk publiserte forrige måned.",
      },
      {
        type: "avsnitt",
        tekst:
          "Styrer markedsavdelingen alt sentralt, får dere kontroll og konsistens, men innholdet mister det lokale, og butikksjefene mister et verktøy de faktisk har bruk for.",
      },
      {
        type: "avsnitt",
        tekst:
          "Den vanligste mellomløsningen er at produksjonen er sentral og publiseringen lokal: ett arkiv alle henter fra, med føringer for hva som kan endres. Kjedene vi produserer for gjør det slik: markedsteamet hos kunden styrer kanalene selv, og vi leverer innholdet de bruker.",
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
          "Det som skiller kjedeproduksjon fra vanlig innholdsproduksjon, er ikke motivet. Det er at hver film må ut i flere utsnitt fordi flatene er ulike: stående til sosiale medier, liggende til skjerm, kvadratisk til annonser og egne oppløsninger til skjermene i butikk og kjøpesenter.",
      },
      {
        type: "avsnitt",
        tekst:
          "For Egon leverer vi seks formater per film. Det er ikke seks filmer, det er én film beskåret og tilpasset seks ganger, og det er en beslutning som må tas før opptaket, ikke etter. Filmes det uten at utsnittene er planlagt, finnes ikke bildet som skal til for det stående formatet.",
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
          "Ikke ved å filme i hver butikk. For Egon produserer vi til nærmere 50 restauranter fra sør til nord, fra én fast produksjonsdag i måneden. Det som gjør det mulig, er at maten, menyen og uttrykket er felles. Det lokale ligger i hvem som publiserer, ikke i hvor kameraet sto.",
      },
      {
        type: "avsnitt",
        tekst: `Trenger kjeden materiale fra flere steder, fordeles produksjonsdagene på ulike lokasjoner i stedet for å legges på samme adresse. Og trengs det mer volum, legges det til dager: hver ekstra produksjonsdag koster ${kr(tilbud.ekstraProduksjonsdag)} kr.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Det er den egentlige skalaen i modellen. Ikke flere leverandører, men flere dager med det samme teamet, slik at butikkinnhold og reklamefilm får samme bildespråk.",
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
          "Hvem publiserer: markedsavdelingen, butikkene eller begge?",
          "Hvor mange produksjonsdager i måneden trenger dere, og skal de ligge på samme sted?",
          "Skal reklamefilm og løpende innhold komme fra samme team?",
          "Hvem svarer på kommentarer og meldinger i kanalene?",
          "Hva skal skje med materialet etterpå, hvem eier det og hvor lagres det?",
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
        svar: "La dem beholde den, men gi dem noe å publisere. Det vanligste problemet er ikke at butikkene har egne kontoer. Det er at de ikke har materiale, og derfor lager sitt eget med mobilen. Et felles arkiv de kan hente fra løser mesteparten av det. Legg ved enkle føringer for hva som kan endres og hva som ikke kan det, så beholder dere uttrykket uten å ta fra butikkene verktøyet.",
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
      "Seks steg, i den rekkefølgen de gjøres. Malen vi selv bruker når vi legger en produksjonsplan, ikke en lærebok i hva sosiale medier er.",
    publisert: "2026-09-29",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En strategi som ikke ender i en produksjonsplan, er et dokument. Den skal svare på hva som skal lages, av hvem, hvor ofte, i hvilke formater og hvordan dere vet om det virker. Klarer den ikke det, er den ikke en strategi. Den er en presentasjon.",
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
          "Et brukbart grunnlag er rundt hundre publiseringer over fire måneder. Sammenlign median mot median, ikke snitt mot snitt. Én post som gikk viralt trekker snittet så mye at resten forsvinner, og da måler dere flaksen i stedet for mønsteret.",
      },
      {
        type: "avsnitt",
        tekst:
          "Se like mye på hva dere allerede kan. Fagartikler dere har skrevet, spørsmål kundene stiller igjen og igjen, ansatte som kan noe andre lurer på. Det sterkeste innholdet er som regel kunnskap dere allerede sitter på, filmet i stedet for skrevet.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 2: Velg kanaler etter hva dere klarer å levere",
      },
      {
        type: "avsnitt",
        tekst:
          "Kanalvalget er en kapasitetsbeslutning, ikke en målgruppebeslutning. To kanaler gjort ordentlig slår fire gjort halvveis, hver eneste gang. Hver ny kanal krever egne formater, egen tone og egen redigering, og den koster like mye som den forrige.",
      },
      {
        type: "avsnitt",
        tekst:
          "Velg ut fra hvor publikum er, og hvor ofte dere realistisk klarer å publisere. En kanal som står stille, kommuniserer noe den ikke skulle kommunisert.",
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
          "Skal en film både i feeden, på nettsiden og på en skjerm, må utsnittene planlegges før kameraet rigges. Filmes det bare liggende, finnes ikke bildet som skal til for det stående formatet, og omvendt.",
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
        tekst: `Frekvensen betyr mindre enn jevnheten. ${tilbud.posterPerUke} ganger i uka, 52 uker i året, slår fem ganger i uka i tre måneder og så stille. Algoritmene straffer opphold, og de fleste hull oppstår i ferier og i travle perioder, altså akkurat når ingen har tid til å lage noe nytt.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Løsningen er å produsere i forkant, ikke å publisere oftere. Et arkiv som er fylt opp, tåler en travel måned. En kalender som fylles fortløpende, gjør det ikke.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Steg 6: Bestem hva dere skal måle, og hva dere ikke skal måle",
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
      {
        sti: "/blogg/hva-koster-et-some-byra",
        tekst: "hva et SoMe-byrå koster i markedet",
      },
      {
        sti: "/blogg/markedsforing-i-sosiale-medier-some",
        tekst: "markedsføring i sosiale medier, fra grunnen av",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hvor ofte bør strategien revideres?",
        svar: "Selve retningen tåler et år. Det som bør gjennomgås oftere, er hvilke serier som virker. Et kvartal er en passende rytme, fordi tallene svinger for mye fra uke til uke til å si noe om en måned alene. En gjennomgang på tjue minutter der dere ser på hva som har fungert og hva som ikke har det, er som regel nok. Å skrive strategien om fra bunnen hvert halvår er et tegn på at den var for detaljert til å begynne med.",
      },
      {
        sporsmal: "Trenger vi en strategi hvis vi bare skal publisere litt?",
        svar: "Ja, men den blir kort. Skal dere publisere én gang i uka, trenger dere fortsatt å vite hvilke to eller tre serier det skal være, hvilket format de har, og hvem som lager dem. Det tar en halv side. Det som ikke fungerer, er å publisere litt uten å ha bestemt noe. Da blir innholdet det noen rekker den dagen, og det er den varianten som koster mest tid per publisering og gir minst igjen.",
      },
    ],
  },
  /*
   * «HVA KOSTER EN EVENTFOTOGRAF?» — tiltak 3a, lagt inn 30.09.2026.
   * Copyen er levert ferdig av Claude Chat og følger samme mal som
   * videoprisguiden: kort svar, kildetabell, hva som driver prisen,
   * spørsmål å stille, Reflektors egen pris og FAQ.
   *
   * ALLE FIRE PRISENE ER KONTROLLERT MOT FOTOGRAFENES EGNE SIDER samme
   * dag, før tabellen ble skrevet inn:
   *
   *   Sørensen Foto   «Eventfotografering 1 time, kr 3.450 + mva» og
   *                   «Eventfotografering 3 timer kr 6.300 + mva».
   *   Malin Westermann «Half day 6000 (eks MVA) and full day 10.000 ,-
   *                   (eks MVA)» og «a package between 40-70 high
   *                   resolution photos».
   *   Say Cheeze      Halvdagspakke «Inntil 4 timer», «100 beste ...
   *                   bilder», levering «i løpet av 3 virkedager»
   *                   (utvalg innen 24 timer), «Pris: 15 200,- (Ekskl.
   *                   MVA)».
   *   Tolustudio      Fire nivåer: 2 500–4 500 (1 t, 20–40 bilder),
   *                   5 000–9 000 (2–3 t, 60–120), 10 000–16 000
   *                   (4–5 t, 150–300), 18 000–35 000+ (6–10 t,
   *                   300–600).
   *
   * Hvert tall i copyen stemte med kilden. Ingen korrigeringer.
   *
   * ALLE FIRE LENKENE HAR `nofollow`. Det er konkurrenter, og regelen er
   * den samme som i SoMe-prisartikkelen. Byråmatch der er unntaket fordi
   * Reflektor selv står oppført; ingen av disse fire har en tilsvarende
   * gjensidighet.
   *
   * OVERLAPP MED VIDEOPRISGUIDEN er holdt unna med vilje: artikkelen tar
   * ikke priser på reklamefilm eller planlagt videoproduksjon, men lenker
   * dit. Det samme gjelder andre veien.
   */
  {
    slug: "hva-koster-eventfotograf",
    /*
     * TOPPBILDET ER FRA OPPDRAGET ARTIKKELEN SELV OMTALER. Retail24 i
     * Sandefjord, august 2026 — samme kveld som videoen og galleriet
     * lenger nede. Et ekte fotografi, ikke et uttrekk fra filmen; se
     * regelen øverst i fila.
     */
    bilde: {
      fil: "retail24-sandefjord-topp",
      alt: "Gjester i kø ved buffeten utenfor en murvilla under et firmaarrangement",
    },
    tittel: "Hva koster en eventfotograf i Oslo?",
    metaTittel: "Hva koster en eventfotograf i Oslo? Priser 2026",
    beskrivelse:
      "Fire Oslo-fotografer oppgir åpne priser på eventfoto. Her er tallene, hva som driver prisen, når video er verdt det, og hva vi selv tar.",
    publisert: "2026-09-30",
    oppdatert: "2026-10-04",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "En eventfotograf i Oslo koster som regel 2 500–9 000 kr for én til tre timer, 6 000–16 000 kr for en halv dag og 10 000–35 000 kr for en hel dag. Skal dere ha både foto og film fra arrangementet, blir det flere folk og mer etterarbeid, og prisen stiger deretter. Vår egen pakke for eventfotograf og eventvideo står på tjenestesiden.",
        lenker: [
          {
            frase: "eventfotograf og eventvideo",
            sti: "/eventfotograf-eventvideo",
          },
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva Oslo-fotografene faktisk oppgir",
      },
      {
        type: "avsnitt",
        tekst:
          "De fleste fotografer oppgir ikke pris før de vet hva arrangementet er. Disse fire gjør det, og tallene er hentet fra nettsidene deres 30. september 2026:",
      },
      {
        type: "tabell",
        kolonner: [
          "Fotograf",
          "Kort dekning",
          "Halv dag",
          "Hel dag",
          "Merknad",
        ],
        rader: [
          [
            "Sørensen Foto",
            "3 450 kr (1 time)",
            "6 300 kr (3 timer)",
            "–",
            "Eks. mva",
          ],
          [
            "Malin Westermann",
            "–",
            "6 000 kr",
            "10 000 kr",
            "Eks. mva, 40–70 bilder",
          ],
          [
            "Say Cheeze",
            "–",
            "15 200 kr (inntil 4 timer)",
            "–",
            "Eks. mva, 100 bilder, levering på 3 virkedager",
          ],
          [
            "Tolustudio",
            "2 500–4 500 kr (1 time)",
            "10 000–16 000 kr (4–5 timer)",
            "18 000–35 000 kr+ (6–10 timer)",
            "150–600 bilder etter omfang",
          ],
        ],
      },
      {
        type: "kilde",
        tekst:
          "Sørensen Foto oppgir 3 450 kr for én time og 6 300 kr for tre timer, begge eksklusive merverdiavgift.",
        url: "https://sorensenfoto.no/portrettfotograf-oslo/pressebilder-headshot/eventfotograf/",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Malin Westermann oppgir 6 000 kr for en halv dag og 10 000 kr for en hel dag, eksklusive merverdiavgift, og 40–70 ferdige bilder.",
        url: "https://www.malinwestermann.com/shop/p/events",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Say Cheeze oppgir en halvdagspakke på inntil fire timer til 15 200 kr eksklusive merverdiavgift, med 100 ferdige bilder levert innen tre virkedager og et utvalg innen 24 timer.",
        url: "https://www.saycheeze.no/eventfotograf/",
        nofollow: true,
      },
      {
        type: "kilde",
        tekst:
          "Tolustudio oppgir fire nivåer: 2 500–4 500 kr for én time med 20–40 bilder, 5 000–9 000 kr for to–tre timer med 60–120 bilder, 10 000–16 000 kr for fire–fem timer med 150–300 bilder, og 18 000–35 000 kr og oppover for seks–ti timer med 300–600 bilder.",
        url: "https://tolustudio.no/eventfotograf",
        nofollow: true,
      },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til at en halv dag koster 6 000 kr hos én og 15 200 kr hos en annen. Forskjellen ligger nesten alltid i tre ting: hvor mange bilder som leveres ferdig redigert, hvor raskt de leveres, og hvilken bruksrett dere får.",
      },
      { type: "overskrift", niva: 2, tekst: "Fire ting som flytter prisen" },
      {
        type: "liste",
        punkter: [
          "Timer på stedet. Den største posten. Få fotografer tar under én time, og mange priser i halve og hele dager.",
          "Antall ferdige bilder. 40 bilder og 300 bilder fra samme kveld er ikke samme jobb. Hvert bilde skal velges ut og redigeres.",
          "Leveringstid. Bilder samme kveld eller dagen etter krever at noen redigerer mens arrangementet pågår, eller rett etter. Det koster.",
          "Tidspunkt. Konferanser går på dagtid, mens firmafester og lanseringer ofte går om kvelden. Noen oppgir priser som gjelder hverdager, slik Sørensen Foto gjør, så spør om kveld og helg er med i prisen dere får.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Foto, film eller begge deler?" },
      {
        type: "avsnitt",
        tekst:
          "Bilder er raskest ut og enklest å bruke i mange kanaler. Film fanger stemningen og det taleren sa. Mange arrangementer trenger begge.",
      },
      {
        /*
         * OMSKREVET 30.09.2026 ETTER PÅLS KORREKSJON. Chats setning var:
         * «Én person kan ikke gjøre begge deler godt samtidig. Da går man
         * glipp av enten talen eller bildet.»
         *
         * Den beskriver Reflektors vanligste oppsett som en svakhet. Pål,
         * ordrett: «veldig ofte sender jeg én produsent til å gjøre begge
         * deler ... får de det til, og det burde ikke fremstå som om
         * kvaliteten da synker i våre tekster.»
         *
         * Setningen sier nå det samme om PRIS — flere folk koster mer —
         * uten å si noe om kvalitet. Det er prisdrivere artikkelen handler
         * om, og det er den ene av de to tingene som faktisk stemmer.
         */
        type: "avsnitt",
        tekst:
          "Hos oss dekker som regel én produsent begge deler på samme arrangement. Skal flere ting skje samtidig, som scene, mingling og intervjuer i parallell, setter vi på flere folk. Det er antallet på stedet som flytter prisen, ikke om leveransen er foto, film eller begge.",
      },
      {
        type: "avsnitt",
        tekst:
          "Få norske aktører oppgir faste priser på eventvideo. Årsaken er at prisen avhenger mer av etterarbeidet enn av tiden på stedet. Et klipp på 60 sekunder til sosiale medier og en full opptaksfilm av alle foredragene er to helt ulike jobber.",
      },
      { type: "overskrift", niva: 2, tekst: "Fem spørsmål før dere bestiller" },
      {
        type: "liste",
        punkter: [
          "Hvor mange timer er fotografen på stedet?",
          "Hvor mange ferdig redigerte bilder får vi?",
          "Når får vi bildene, og kan vi få et utvalg samme kveld?",
          "Hva kan vi bruke bildene til: sosiale medier, annonser, pressemeldinger?",
          "Hva koster det hvis arrangementet drar ut i tid?",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Spørsmål fire glemmes oftest. Noen fotografer gir bare bruksrett til sosiale medier og intern bruk. Skal bildene i annonser, bør det stå skriftlig.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva tar Reflektor for eventdekning?",
      },
      {
        type: "avsnitt",
        tekst: `Eventdekning hos oss starter på ${kr(tilbud.fraPrisProsjekt)} kr. Da filmer vi og tar bilder på samme arrangement. En typisk leveranse er:`,
      },
      {
        type: "liste",
        punkter: [
          "en eventvideo på 30–60 sekunder",
          "én eller flere kortere versjoner til sosiale medier",
          "50 bilder eller flere, ferdig redigert",
          "redigering og korrigeringer til dere er fornøyde",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Prisen dekker altså både fotografen og filmen i tabellen over, og etterarbeidet på begge. Se eventfoto og eventvideo fra Reflektor.",
        lenker: [
          {
            frase: "eventfoto og eventvideo fra Reflektor",
            sti: "/eventfotograf-eventvideo",
          },
        ],
      },
      {
        type: "avsnitt",
        tekst: `Hvor stor jobben blir, avhenger av arrangementet. Skal foredrag, seminarer eller debatter filmes i sin helhet i tillegg til eventvideo og bilder, blir jobben større, og prisen deretter. Enkeltoppdrag tar vi fra ${kr(tilbud.fraPrisProsjekt)} kr.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Materialet leveres som regel innen to uker. Trenger dere noe ut samme kveld eller dagen etter, legger vi opp dagen etter det. Alt er deres, med fri bruk, også i annonser.",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Arrangement som en del av abonnementet",
      },
      {
        type: "avsnitt",
        tekst: `Har dere noen arrangementer i året, trenger dere ikke bestille eventdekning for hvert av dem. I det løpende samarbeidet til ${kr(tilbud.prisPerManed)} kr/mnd kan produksjonsdagen legges til et arrangement. Da får dere bilder og video fra arrangementet som en del av månedens innhold, uten ekstra kostnad.`,
        lenker: [{ frase: "løpende samarbeidet", sti: "/" }],
      },
      {
        /*
         * RETAIL24 SOM ABONNEMENTSKUNDE ER BEKREFTET AV PÅL 30.09.2026.
         *
         * Spørsmålet ble stilt fordi AGENTS.md er kategorisk: produksjons-
         * kunder navngis aldri som SoMe-abonnenter. Retail24 står på
         * kundelista to steder på nettstedet uten at det står HVA de er
         * kunde på, og copyen her sier det rett ut. Da må noen svare, og
         * svaret var «det stemmer».
         *
         * Dette er den eneste kunden på nettstedet som er navngitt som
         * abonnent. Skal flere navngis slik, må hver enkelt bekreftes på
         * samme måte.
         */
        type: "avsnitt",
        tekst:
          "Eksempel: Retail24 i Sandefjord. Retail24 er abonnementskunde hos oss. I august 2026 brukte de månedens produksjonsdag på et arrangement i Sandefjord, og vi filmet og fotograferte hele kvelden. Leveransen ble én eventvideo, åtte intervjuer og rundt 190 ferdig redigerte bilder.",
      },
      {
        /*
         * EKTE AVSPILLER, IKKE DEMPET LØKKE. Filmen er 1 minutt og 43
         * sekunder med musikk og tale, og da er det lyden som bærer den.
         * Dempet autospill ville vist en fest uten stemning. Samme regel
         * som profilfilmene på employer branding-siden.
         *
         * Originalen er 3840×2160 og 630 MB. Her ligger den i 1280×720,
         * som er mer enn spalten på 42rem trenger, og på 17 MB. Den lastes
         * ikke før noen trykker play — `preload="none"` i komponenten.
         */
        type: "medier",
        elementer: [
          {
            slag: "film",
            sti: "/arbeid/retail24-sandefjord",
            format: "16/9",
            alt: "Eventvideo fra et firmaarrangement i Sandefjord",
            lyd: true,
          },
        ],
        bildetekst:
          "Eventvideoen fra kvelden. 1 minutt og 43 sekunder, filmet og klippet av Reflektor.",
      },
      {
        type: "galleri",
        elementer: [
          {
            slag: "foto",
            sti: "/arbeid/retail24-sandefjord-1",
            format: "16/9",
            alt: "Gjester samlet rundt buffeten i hagen under et firmaarrangement",
          },
          {
            slag: "foto",
            sti: "/arbeid/retail24-sandefjord-2",
            format: "16/9",
            alt: "Smilende gjester rundt et bord under arrangementet",
          },
          {
            slag: "foto",
            sti: "/arbeid/retail24-sandefjord-3",
            format: "16/9",
            alt: "Murbygning med rød løper og veteranbil foran inngangen",
          },
          {
            slag: "foto",
            sti: "/arbeid/retail24-sandefjord-4",
            format: "16/9",
            alt: "Servitør i et mørkt, panelkledd rom med tente lysestaker",
          },
          {
            slag: "foto",
            sti: "/arbeid/retail24-sandefjord-5",
            format: "9/16",
            alt: "Champagnetårn av glass på en antikk kommode",
          },
        ],
        bildetekst: "Fem av rundt 190 ferdig redigerte bilder fra samme kveld.",
      },
    ],
    lesVidere: [
      {
        sti: "/eventfotograf-eventvideo",
        tekst: "eventfoto og eventvideo fra Reflektor",
      },
      {
        sti: "/blogg/hva-koster-videoproduksjon",
        tekst: "hva en planlagt videoproduksjon koster",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva er vanlig timepris for en eventfotograf i Oslo?",
        svar: "Blant Oslo-fotografer som oppgir åpne priser, koster én time mellom 2 500 og 4 500 kr. Timeprisen synker når oppdraget blir lengre. Tre timer koster for eksempel 6 300 kr hos én av dem.",
      },
      {
        sporsmal: "Hvor mange bilder får vi fra et arrangement?",
        svar: "Det avhenger av tiden på stedet. Hos Tolustudio får dere for eksempel 20–40 bilder fra én time, 60–120 fra to–tre timer og 150–300 fra en halv dag. Spør alltid hvor mange ferdig redigerte bilder som er inkludert i prisen.",
      },
      {
        sporsmal: "Kan vi få bildene samme kveld?",
        svar: "Ofte, men det ligger gjerne i de dyreste pakkene. Say Cheeze leverer for eksempel et utvalg innen 24 timer. Det krever at noen redigerer under eller rett etter arrangementet. Si fra i planleggingen, så dagen kan legges opp etter det.",
      },
    ],
  },
  {
    slug: "hva-koster-reklamefilm",
    /*
     * TOPPBILDET ER DET ENESTE EKTE FOTOGRAFIET VI HAR AV ET OPPTAK I
     * GANG. Det står også på /reels-produksjon, og gjenbruken er et valg:
     * artikkelen handler om hva det koster å lage en film, og et bilde av
     * en produksjon er det eneste motivet som svarer på det. Alternativet
     * var et ferdig produktbilde, som illustrerer resultatet og ikke
     * kostnaden.
     */
    bilde: {
      fil: "popup-arbeid-1800",
      alt: "En kunde blir filmet bak disken i en popup-butikk",
    },
    tittel: "Hva koster en reklamefilm? Hele regnestykket",
    metaTittel: "Hva koster en reklamefilm? Hele regnestykket for 2026",
    beskrivelse:
      "Produksjonen er bare den første regningen. Her er hva skuespillere, musikk og visning koster i tillegg, med norske eksempler og tall.",
    publisert: "2026-10-02",
    oppdatert: "2026-10-04",
    blokker: [
      {
        type: "avsnitt",
        tekst: `Ifølge norske prisguider koster selve produksjonen av en reklamefilm oftest 50 000–200 000 kr. Hos oss starter enkeltprosjekter på ${kr(tilbud.fraPrisProsjekt)} kr. Men produksjonen er bare den første regningen. Skuespillere, musikk og visning kommer i tillegg, og visningen kan fort bli den største posten. Her er hva hver del koster.`,
      },
      { type: "overskrift", niva: 2, tekst: "Tre regninger, ikke én" },
      {
        type: "avsnitt",
        tekst:
          "En reklamefilm har tre kostnader som ofte kommer fra tre ulike steder. Vi produserer filmen; de to andre postene kommer fra andre enn oss:",
        lenker: [{ frase: "produserer filmen", sti: "/reklamefilm" }],
      },
      {
        type: "tabell",
        kolonner: ["Del", "Hva det dekker", "Hvem dere betaler"],
        rader: [
          [
            "Produksjon",
            "Idé, manus, opptak, klipp, lyd og farge",
            "Produksjonsselskapet",
          ],
          [
            "Rettigheter",
            "Skuespillere, musikk og eventuelle lokasjoner",
            "Skuespillere, rettighetshavere og utleiere",
          ],
          [
            "Visning",
            "Sendetid på TV, annonser på nett og i sosiale medier",
            "TV-kanalen, plattformen eller mediebyrået",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Mange tilbud dekker bare den første raden. Spør alltid om rettighetene er med.",
      },
      { type: "overskrift", niva: 2, tekst: "Produksjonen" },
      {
        type: "avsnitt",
        tekst:
          "Hva produksjonen koster, avhenger mest av antall opptaksdager, hvor mange som er på settet og hvor mye etterarbeid filmen krever. Vi har sammenlignet de norske prisguidene i en egen artikkel.",
        lenker: [
          {
            frase: "sammenlignet de norske prisguidene",
            sti: "/blogg/hva-koster-videoproduksjon",
          },
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Én ting gjelder særlig for reklamefilm: filmen skal nesten alltid klippes i flere lengder. En TV-reklame kjøpes i faste lengder, oftest 15 eller 30 sekunder. I sosiale medier trengs gjerne en kortere versjon og et stående format. Det er billigere å planlegge alle versjonene før opptak enn å klippe om etterpå.",
      },
      { type: "overskrift", niva: 2, tekst: "Skuespillere og bruksrett" },
      {
        type: "avsnitt",
        tekst:
          "Bruker dere skuespillere, betaler dere ikke bare for opptaksdagen. Dere betaler også for retten til å vise filmen, i en bestemt periode og i bestemte kanaler. Dette kalles buyout.",
      },
      {
        type: "avsnitt",
        tekst:
          "For å gi et konkret eksempel: en rolleutlysning for en reklamefilm i Oslo i 2023 oppga et honorar på 27 500 kr per skuespiller, inkludert to års bruksrett til film og foto. Skal filmen vises lenger eller i flere kanaler, stiger honoraret.",
      },
      {
        type: "kilde",
        tekst:
          "Rolleutlysning på StagePool for en reklamefilm i Oslo, med honorar på 27 500 kr per skuespiller inkludert to års bruksrett.",
        url: "https://no.stagepool.com/skuespiller/224201/skuespillere_20_45_ar_skes_til_reklamefilm",
        nofollow: true,
      },
      {
        type: "avsnitt",
        tekst:
          "Den enkleste måten å spare på er å bruke egne ansatte. Det gir ofte en mer troverdig film også. Husk å få skriftlig samtykke fra alle som er med.",
      },
      { type: "overskrift", niva: 2, tekst: "Musikk" },
      {
        type: "avsnitt",
        tekst:
          "Musikk kan ikke brukes i reklame uten tillatelse. Ifølge TONO må opphaveren samtykke når musikk brukes til å fremme et produkt eller en tjeneste. Innspillingen må klareres med plateselskapet, og synkroniseringen med opphaveren eller musikkforlaget.",
      },
      {
        type: "kilde",
        tekst:
          "TONO om hvem som lisensierer musikk til reklamefilm: innspillingen klareres med plateselskapet, synkroniseringen med opphaveren eller musikkforlaget.",
        url: "https://www.tono.no/faq-items/noen-vil-bruke-musikken-min-i-en-reklamefilm-hvem-lisensierer-dette/",
        nofollow: true,
      },
      {
        type: "avsnitt",
        tekst:
          "Kjent musikk kan derfor bli dyrt og ta tid å klarere. De fleste reklamefilmer for bedrifter bruker i stedet lisensiert produksjonsmusikk eller musikk som er laget til filmen. Spør hvem som klarerer musikken, og om det er med i prisen.",
      },
      { type: "overskrift", niva: 2, tekst: "Visning" },
      {
        type: "avsnitt",
        tekst: "Dette er posten mange glemmer når de budsjetterer.",
      },
      {
        type: "liste",
        punkter: [
          "TV. Sendetid på lineær TV kjøpes direkte fra kanalen eller via et mediebyrå. Prisen avhenger av hvor mange i målgruppen som ser på, og av tidspunktet, og avtales med kanalen eller mediebyrået.",
          "Nett-TV og strømming. Her finnes det listepriser. TV 2 oppgir for eksempel 390 kr per tusen visninger for en videoreklame på seks sekunder som ikke kan hoppes over, i sine priser for 2026. 100 000 visninger koster da 39 000 kr før eventuelle rabatter.",
          "Sosiale medier. Annonser på Instagram, Facebook og YouTube har ingen fast pris. Dere setter et budsjett, og prisen per visning avgjøres av konkurransen om målgruppen.",
        ],
      },
      {
        type: "kilde",
        tekst:
          "TV 2 oppgir 390 kr per tusen visninger for en seks sekunders videoreklame som ikke kan hoppes over, i prislista for digital annonsering 2026.",
        url: "https://annonsere.tv2.no/digital/priser",
        nofollow: true,
      },
      {
        type: "avsnitt",
        tekst:
          "Ingen av disse pengene går til produsenten. Et tilbud på reklamefilm dekker å lage filmen, ikke å vise den.",
      },
      { type: "overskrift", niva: 2, tekst: "Fem spørsmål før dere signerer" },
      {
        type: "liste",
        punkter: [
          "Hvor mange ferdige versjoner og lengder får vi?",
          "Er skuespillere og bruksrett med i prisen, og for hvor lang tid?",
          "Hvem klarerer musikken, og er det med i prisen?",
          "Hvem eier råmaterialet etter produksjonen?",
          "Hvem setter opp og følger annonsene når filmen skal vises?",
        ],
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva tar Reflektor for en reklamefilm?",
      },
      {
        type: "avsnitt",
        tekst: `Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr. Hva et prosjekt faktisk koster avhenger av omfanget, antall produksjonsdager og hvor mye etterarbeid filmen krever. Vi klipper som regel filmen i flere lengder, slik at samme opptak dekker flere flater.`,
      },
      {
        type: "avsnitt",
        tekst:
          "Vi har laget TV-reklame for Vitusapotek og Peppes Pizza. Vi produserer filmen, men vi kjøper ikke sendetid eller annonseplass. Den delen tar dere eller mediebyrået deres. Se reklamefilm fra Reflektor.",
        lenker: [{ frase: "reklamefilm fra Reflektor", sti: "/reklamefilm" }],
      },
      {
        type: "avsnitt",
        tekst:
          "Alt vi produserer er deres, med fri bruk, også råmaterialet som ikke kom med i den ferdige filmen.",
      },
    ],
    lesVidere: [
      { sti: "/reklamefilm", tekst: "reklamefilm fra Reflektor" },
      {
        sti: "/blogg/hva-koster-videoproduksjon",
        tekst: "hva videoproduksjon koster, guide for guide",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva koster det å vise en reklamefilm på TV?",
        svar: "Det finnes ingen fast pris for lineær TV. Sendetiden prises etter hvor mange i målgruppen som ser på, og når. På nett-TV finnes listepriser. TV 2 oppgir 390 kr per tusen visninger for en sekssekunders reklame som ikke kan hoppes over, i sine priser for 2026. Visningen kommer alltid i tillegg til produksjonen.",
      },
      {
        sporsmal: "Må vi betale skuespillere hver gang filmen vises?",
        svar: "Nei, men dere betaler for en avtalt bruksperiode. Honoraret dekker som regel opptaksdagen og retten til å vise filmen i bestemte kanaler i en bestemt periode. Skal filmen brukes lenger, må bruksretten forlenges.",
      },
      {
        sporsmal: "Kan vi bruke en kjent låt i reklamefilmen vår?",
        svar: "Bare med tillatelse fra både opphaveren og plateselskapet. Det kan bli dyrt og ta tid. De fleste bedrifter bruker derfor lisensiert produksjonsmusikk eller musikk som er laget til filmen.",
      },
    ],
  },
  {
    slug: "hva-er-reklame",
    /*
     * ADRESSEN ER GJENOPPTATT, IKKE NY. Den fantes på Squarespace, ble
     * 301-et til /blogg ved cutover, og den redirecten er fjernet nå.
     * Adressen har lenker fra to domener og rangerte på plass 19 for
     * «reklame» (2 200 søk i måneden).
     *
     * TOPPBILDET er produktfotografi — altså det reklame ser ut som — og
     * ikke et bilde av oss som jobber. Artikkelen forklarer et begrep, og
     * da skal motivet vise begrepet.
     */
    bilde: {
      fil: "goretex2-vegg",
      alt: "Nærbilde av hender som snører en fjellsko",
    },
    tittel: "Hva er reklame?",
    metaTittel: "Hva er reklame? Definisjon, typer og virkemidler",
    beskrivelse:
      "Reklame er betalt kommunikasjon som skal få noen til å kjøpe, velge eller mene noe. Typer, virkemidler, hva loven sier og hva god reklame har til felles.",
    publisert: "2026-10-02",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Reklame er betalt kommunikasjon som skal få noen til å kjøpe, velge eller mene noe. Avsenderen betaler for plassen eller produksjonen og bestemmer budskapet selv. Etter norsk lov må reklame være lett å kjenne igjen som reklame. Den finnes på TV, i sosiale medier, på nett, utendørs, i radio og på trykk.",
      },
      { type: "overskrift", niva: 2, tekst: "Reklame, markedsføring og PR" },
      {
        type: "avsnitt",
        tekst: "Ordene brukes om hverandre, men betyr ikke det samme:",
      },
      {
        type: "tabell",
        kolonner: ["Begrep", "Hva det er", "Hvem bestemmer budskapet"],
        rader: [
          [
            "Markedsføring",
            "Alt en bedrift gjør for å selge: produkt, pris, kanaler og kommunikasjon",
            "Bedriften",
          ],
          [
            "Reklame",
            "Den betalte delen av kommunikasjonen: annonser, reklamefilm, plakater",
            "Bedriften",
          ],
          [
            "PR",
            "Omtale i medier og andres kanaler som ikke er betalt",
            "Journalisten eller den som omtaler",
          ],
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Reklame er altså én del av markedsføringen. Et innlegg i bedriftens egen Instagram-konto er markedsføring. Det samme innlegget blir reklame i vanlig forstand når dere betaler for å vise det til flere.",
      },
      { type: "overskrift", niva: 2, tekst: "Typer reklame" },
      {
        type: "liste",
        punkter: [
          "TV og strømming. Reklamefilm i faste lengder, oftest 15 eller 30 sekunder, på lineær TV eller nett-TV.",
          "Video i sosiale medier. Korte, gjerne stående videoer som annonser på Instagram, Facebook, TikTok og YouTube.",
          "Søk og nett. Annonser i søkeresultater og bannere på nettsider.",
          "Utendørs og skjerm. Plakater, busskur og digitale skjermer, for eksempel i butikker og restauranter.",
          "Lyd. Radio, strømming og podkast.",
          "Trykk. Aviser, magasiner og direkte reklame i posten.",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "De fleste kampanjer i dag bruker flere av disse samtidig. Derfor lønner det seg å filme slik at det samme materialet kan klippes til flere formater.",
      },
      { type: "overskrift", niva: 2, tekst: "Virkemidler i reklame" },
      {
        type: "avsnitt",
        tekst:
          "Et virkemiddel er grepet som får reklamen til å bli lagt merke til og huske. De vanligste er:",
      },
      {
        type: "liste",
        punkter: [
          "Humor. Gjør reklamen hyggelig å se og lettere å dele.",
          "Følelser og historier. En person, et problem og en løsning huskes bedre enn en liste over egenskaper.",
          "Kjente ansikter. Kjendiser og influencere låner reklamen sin troverdighet og sitt publikum.",
          "Gjentakelse. Samme slagord, melodi eller farge over tid bygger gjenkjennelse.",
          "Sosialt bevis. Kundeuttalelser, anmeldelser og tall som viser at andre har valgt det.",
          "Demonstrasjon. Vis produktet i bruk i stedet for å beskrive det.",
          "Tilbud og knapphet. Begrenset tid eller antall gir en grunn til å handle nå.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Hva sier loven?" },
      {
        type: "avsnitt",
        tekst:
          "Markedsføringsloven sier at all markedsføring skal utformes og presenteres slik at den tydelig fremstår som markedsføring (§ 3). Forbrukertilsynet fører tilsyn med reglene.",
      },
      {
        type: "kilde",
        tekst:
          "Markedsføringsloven § 3: markedsføring skal utformes og presenteres slik at den tydelig framstår som markedsføring.",
        url: "https://lovdata.no/lov/2009-01-09-2/§3",
        nofollow: true,
      },
      {
        type: "avsnitt",
        tekst:
          "I sosiale medier betyr det at betalte samarbeid, for eksempel med influencere, må merkes tydelig som reklame. Det finnes også egne regler for reklame rettet mot barn, og reklame for alkohol er i hovedsak forbudt i Norge.",
      },
      { type: "overskrift", niva: 2, tekst: "Hva har god reklame til felles?" },
      {
        type: "avsnitt",
        tekst: "Fire ting går igjen, og ingen av dem handler om budsjett.",
      },
      {
        type: "liste",
        punkter: [
          "Ett budskap. Reklame som prøver å si alt, blir ikke husket for noe.",
          "De første sekundene. I sosiale medier avgjøres det på et par sekunder om noen ser videre.",
          "Laget for formatet. En TV-reklame klippet ned til en stående video fungerer sjelden like godt som en video som er planlagt for formatet.",
          "Over tid. Én kampanje gir et løft. Jevn tilstedeværelse gjør at folk husker dere når de trenger det dere selger.",
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Hva koster reklame?" },
      {
        type: "avsnitt",
        tekst:
          "Reklame har to kostnader: å lage den og å vise den. Vi har skrevet om begge, både hele regnestykket for en reklamefilm og hva videoproduksjon koster.",
        lenker: [
          {
            frase: "hele regnestykket for en reklamefilm",
            sti: "/blogg/hva-koster-reklamefilm",
          },
          {
            frase: "hva videoproduksjon koster",
            sti: "/blogg/hva-koster-videoproduksjon",
          },
        ],
      },
      { type: "overskrift", niva: 2, tekst: "Reklamefilm fra Reflektor" },
      {
        type: "avsnitt",
        tekst: `Vi produserer reklamefilm for TV, nett og sosiale medier, og har blant annet laget TV-reklame for Vitusapotek og Peppes Pizza. Enkeltprosjekter starter på ${kr(tilbud.fraPrisProsjekt)} kr.`,
        lenker: [{ frase: "reklamefilm", sti: "/reklamefilm" }],
      },
    ],
    lesVidere: [
      { sti: "/reklamefilm", tekst: "reklamefilm fra Reflektor" },
      {
        sti: "/blogg/hva-koster-reklamefilm",
        tekst: "hva en reklamefilm koster, hele regnestykket",
      },
    ],
    tilleggsfaq: [
      {
        sporsmal: "Hva er forskjellen på reklame og markedsføring?",
        svar: "Markedsføring er alt en bedrift gjør for å selge, også produkt, pris og egne kanaler. Reklame er den betalte delen av kommunikasjonen, som annonser, reklamefilm og plakater.",
      },
      {
        sporsmal: "Er innlegg fra influencere reklame?",
        svar: "Ja, hvis influenceren får betalt, gratis produkter eller andre fordeler for innlegget. Da skal det merkes tydelig som reklame, etter markedsføringsloven.",
      },
      {
        sporsmal: "Hva er et virkemiddel i reklame?",
        svar: "Et grep som gjør at reklamen blir lagt merke til og husket, for eksempel humor, en historie, et kjent ansikt, gjentakelse eller kundeuttalelser.",
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
    if (b.type === "galleri") {
      if (b.elementer.length < 4 || b.elementer.length > 6) {
        throw new Error(
          `${a.slug}: et galleri må ha fire til seks bilder, ikke ${b.elementer.length}`,
        );
      }
      if (b.elementer.some((m) => m.slag !== "foto")) {
        throw new Error(
          `${a.slug}: et galleri tar bare foto. Film hører hjemme i en medieblokk, der den får riktig avspiller.`,
        );
      }
      continue;
    }
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
export const IKKE_FAQ = ["Trenger bedriften din en fotograf eller videograf?"];

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
