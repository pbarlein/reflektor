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

export type Blokk =
  | { type: "avsnitt"; tekst: string }
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
  | { type: "kilde"; tekst: string; url: string }
  /** Tabell. Sammenligningstabeller er blant de mest siterte formatene. */
  | { type: "tabell"; kolonner: string[]; rader: string[][] };

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
  beskrivelse: string;
  /** ISO-dato fra Squarespace. Ikke pyntet. */
  publisert: string;
  blokker: Blokk[];
  /** Tjenestesiden artikkelen naturlig leder til. */
  lesVidere: { sti: string; tekst: string }[];
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
    return sum + b.tekst.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(ord / 200));
}

export const artikler: Artikkel[] = [
  {
    slug: "hva-koster-et-some-byra",
    bilde: {
      fil: "dag1-1600",
      alt: "Nærbilde av bakverk på brett",
      fokus: "center 40%",
    },
    tittel: "Hva koster et SoMe-byrå i Norge? Priser og prismodeller",
    beskrivelse:
      "Hva koster det å sette bort sosiale medier? Vi forklarer hva prisen består av, sju spørsmål du bør stille før du signerer, og hva vi selv tar: 30 000 kr/mnd fast pris.",
    publisert: "2026-08-13",
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
      {
        type: "overskrift",
        niva: 2,
        tekst: "Hva koster det i det norske markedet?",
      },
      {
        type: "avsnitt",
        tekst:
          "Sammenligningstjenesten Byråmatch oppgir at norske byråer viser eksempler fra rundt 6 000 kroner i måneden til 30 000 kroner for mer omfattende løsninger med profesjonell innholdsproduksjon. Du finner oversikten deres over SoMe-byråer i Norge der flere leverandører står ved siden av hverandre. Vi er selv oppført der.",
      },
      {
        type: "avsnitt",
        tekst:
          "Spennet forklares nesten alltid av én ting: om noen faktisk kommer ut og filmer, og hvor ofte.",
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
      {
        type: "avsnitt",
        tekst: "Les også:Hvordan lykkes med innholdsproduksjon",
      },
      {
        type: "overskrift",
        niva: 2,
        tekst: "Stor rekkevidde på sosiale medier",
      },
      {
        type: "avsnitt",
        tekst:
          "Så mange som ni av ti nordmenn bruker sosiale medier hver eneste dag. Ifølge undersøkelsen har denne tendensen vært økende de siste fem årene, og man ser økninger på tvers av aldersgrupper. Kanskje naturlig nok er unge mellom 16 og 34 år storbrukere av SoMe-kanaler som Instagram, Facebook og X (tidligere Twitter), men kvinner mellom 55 og 64 år er den andelen av brukere som har økt mest over de seneste årene. Det vil si at potensialet for å tiltrekke sin målgruppe, uansett om den er ung eller gammel, er stort.",
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
      { type: "avsnitt", tekst: "Les også: Hva innebærer inbound marketing?" },
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
      {
        type: "avsnitt",
        tekst:
          "Dette er kun et eksempel ment å illustrere hvordan man kan og bør merke en annonse i en Instagram-post.",
      },
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
      { type: "avsnitt", tekst: "Les også: Hva gjør en innholdsprodusent?" },
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
          "Push videoen i en betalt annonse på nettsiden din, spre den på LinkedIn og andre sosiale medier, og publiser den på dine viktigste landingssider. Å bruke SoMe-innhold på nettsiden din er kjempe viktig for å skape et oppdatert digitalt butikkvindu, der potensielle kunder kan oppdage din bedrift og dine produkter. Og ikke minst som du kan lenke til og fra dine sosiale medier. Da bygger du samtidig din organiske synlighet og åpner opp for å få høyere plasseringer i søkemotoren. Dermed får du hentet ut all verdi du kan få fra et stykke innhold.",
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
          "Her er det dessuten viktig å lage videoer og bilder som er tilpasset smarttelefoner. Dette betyr blant annet at formatet på innholdet passer til skjermen på enheten, for eksempel 4:5 som tilsvarer Reels på Instagram og poster på TikTok. Tenk også på dette hvis du publiserer innhold på nettsiden din, da mange potensielle kunder bruker mobilen når de surfer på nettet.",
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
      },
    ],
    lesVidere: [{ sti: "/", tekst: "sosiale medier til fast månedspris" }],
  },
  {
    slug: "hva-er-innholdsproduksjon",
    bilde: { fil: "dag4-vegg", alt: "Opptak med kamera under et arrangement" },
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
        type: "avsnitt",
        tekst:
          "Bruk tid på å formulere unikt og engasjerende skriftlig innhold.",
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
      {
        type: "avsnitt",
        tekst:
          "Sørg for at bildene dine er unike og engasjerende, og bruk gjerne tid på redigere dem før du publiserer dem.",
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
      {
        type: "avsnitt",
        tekst:
          "Samarbeid gjerne med profesjonelle videografer som hjelper deg med å lage videoer som gjør inntrykk på folk.",
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
          "Innhold gir deg muligheten til å dele den fagkunnskapen eller bransjeinnsikten du sitter på, som ikke alle har tilgang på heller. Ved at du deler denne innsikten på din nettside eller sosiale medier, bygger du en sterk faglig profil som gir deg økt troverdighet. Dette gjør deg til en autoritær spiller på markedet, som atskiller deg fra konkurrenter og øker sannsynligheten for at kunder velger deg framfor andre. De vil stole på deg!",
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
          "Hos Reflektor kan du hente uvurderlig hjelp fra innholdsproduksenter med lang erfaring innen foto og video. Våre fotografer fanger de riktige salgsutløsende øyeblikkene og tar bilder som vekker følelser hos din målgruppe. Våre videografer produserer videoer som fanger hva bilder ikke gjør, nemlig det levende elementet ved din bedrift eller ditt produkt og tjeneste. Vi tilbyr faglig tyngde innen bilde- og videoproduksjon og har en helhetlig tilnærming til innholdsproduksjon som kombinerer kreativitet med strategisk forretningsforståelse. Tilgangen på godt innhold er bare et klikk unna!",
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
      },
    ],
    lesVidere: [
      { sti: "/innholdsproduksjon", tekst: "hva Reflektor produserer" },
    ],
  },
  {
    slug: "hva-er-innholdsmarkedsforing",
    bilde: {
      fil: "kafe1-1600",
      alt: "Vegg av flasker i en butikkhylle",
      fokus: "center 35%",
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
      },
      { type: "overskrift", niva: 2, tekst: "Få hjelp med bilder og video" },
      {
        type: "avsnitt",
        tekst:
          "Hos Reflektor kan du hente uvurderlig hjelp fra dyktige fotografer og videografer som fanger salgsutløsende øyeblikk. Våre fotografer har et øye for detaljer og tar bilder som vekker følelser hos din målgruppe. Våre videografer produserer videoer som fanger hva bilder ikke gjør, nemlig det levende elementet ved din bedrift eller ditt produkt og tjeneste. Vi tilbyr faglig tyngde innen bilde- og videoproduksjon og har en helhetlig tilnærming til innholdsproduksjon som kombinerer kreativitet med strategisk forretningsforståelse. Dermed vil vi hjelpe deg med å legge grunnlaget for en vellykket innholdsmarkedsføring.",
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
      },
    ],
    lesVidere: [
      { sti: "/innholdsproduksjon", tekst: "innholdsproduksjon i praksis" },
    ],
  },
  {
    slug: "hva-er-videomarkedsfring",
    bilde: {
      fil: "dag6-vegg",
      alt: "Bakverk i en disk",
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
      fil: "fabrikk-vegg",
      alt: "Ansatte i arbeidstøy i et produksjonslokale",
      fokus: "center 30%",
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
      fil: "portrett-vegg",
      alt: "Portrett utendørs mot blå himmel",
      fokus: "center 25%",
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
      },
    ],
    lesVidere: [
      { sti: "/videoproduksjon-i-oslo", tekst: "film til nettside og skjerm" },
    ],
  },
  {
    slug: "some-ansvarlig-eller-byra",
    bilde: { fil: "mat1-1600", alt: "Ansatte i et produksjonslokale" },
    tittel: "SoMe-ansvarlig eller byrå? Regnestykket med tall",
    beskrivelse:
      "Hva koster en ansatt SoMe-ansvarlig egentlig, når arbeidsgiveravgift, feriepenger og pensjon er regnet med? Vi setter tallene fra Altinn og SSB mot et byråbudsjett.",
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
];

/** Slugene som faktisk har innhold. Undersett av bloggSlugs i site.ts. */
export const artikkelSlugs = artikler.map((a) => a.slug);

export function finnArtikkel(slug: string): Artikkel | undefined {
  return artikler.find((a) => a.slug === slug);
}
