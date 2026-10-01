import { TAK, delforklaring, takFor, type Ark } from "./arktype.ts";
import type { Felt, Mal } from "./maltype.ts";

/**
 * De åtte malene. Se maltype.ts for hva feltene betyr og hvor formatet
 * kommer fra.
 *
 * ── BARE PRODUKSJON ───────────────────────────────────────────────────────
 *
 * Alle malene hører til en fase i produksjonen: før, på eller etter opptak.
 * Det er ikke en sorteringsidé, det er grensen. Kundeavtaler, tilbud,
 * oppdragsbekreftelser og honoraravtaler lages ikke her — de eies og
 * signeres av daglig leder, og vilkårene står i tjenesteavtalen.
 *
 * To maler er fjernet av den grunnen: «Avtale med medvirkende» og
 * «Oppdragsbekreftelse». Den første er erstattet av samtykkeskjemaet, som
 * dekker det produsenten faktisk trenger på en opptaksdag. Den andre har
 * ingen erstatning her, og skal ikke få en.
 *
 * REKKEFØLGEN ER BRUKSFREKVENS innenfor hver fase, ikke alfabet.
 * Produksjonsplanen lages hver måned for hver kunde; leveranseoversikten
 * følger hver leveranse.
 */
/**
 * Feltene som styrer hva Claude undersøker, ikke hva dokumentet sier.
 *
 * ── HVORFOR DE ER DE SAMME TRE OVERALT ────────────────────────────────────
 *
 * Bestilt 24.09.2026: «en produksjonsplan skal tross alt bestemme hva som
 * skal filmes. bruk mindre tid på nettet, og gjør kall i supermetrics for å
 * få oversikt over hva som faktisk publiseres av kunden, konkurrenter og
 * kartlegg virale virkemidler.»
 *
 * De ligger på de tre malene der spørsmålet er «hva skal vi lage»:
 * produksjonsplanen, publiseringsplanen og månedsrapporten. På en
 * samtykkeerklæring eller et befaringsnotat ville de vært tre felt til å
 * hoppe over.
 *
 * Ingen av dem er påkrevd. Et tomt felt gir en tynnere research, ikke en
 * stoppet produksjon — og strategilenken finner Claude som regel selv.
 */
const GRUNNLAGSFELT: readonly Felt[] = [
  {
    id: "instagram",
    etikett: "Kundens Instagram",
    type: "tekst",
    grunnlag: true,
    hjelp:
      "Brukernavnet. Claude henter hva de faktisk har publisert det siste året, og hvilke formater som gikk.",
    plassholder: "@brukernavn",
  },
  {
    id: "konkurrenter",
    etikett: "Konkurrenter på Instagram",
    type: "tekst",
    grunnlag: true,
    hjelp:
      "Inntil tre brukernavn, skilt med komma. Grunnlaget for hva som faktisk går i bransjen.",
    plassholder: "@konkurrent, @konkurrent",
  },
  {
    id: "somestrategi",
    etikett: "Lenke til SoMe-strategi i Canva",
    type: "tekst",
    grunnlag: true,
    hjelp:
      "Har du ikke lenken, lar du feltet stå tomt. Claude leter etter den i e-posten med kunden selv.",
    plassholder: "https://www.canva.com/design/...",
  },
];

export const MALER: readonly Mal[] = [
  /*
   * ── ÉN PLAN, ÉN LESER ─────────────────────────────────────────────────
   *
   * Bestilt 28.09.2026: «jeg er ikke enig i at vi trenger produksjonsplan
   * og opptaksliste. så lenge den er såpass konkret, strippet for
   * unødvendigheter og enkel å forstå, kan disse være ett dokument.»
   * Opptakslisten ble da en del av produksjonsplanen, og navnet består —
   * «Opptaksliste» og «Shotliste» er kallenavn i søket.
   *
   * De to var allerede det samme arbeidet gjort to ganger. Opptakslisten
   * ble bygget bakover fra planen: oppsettene var planens oppsett, og
   * «Hva som skal leveres» var planens 8–10 leveranser skrevet av. Å be
   * produsenten skrive dem inn på nytt var en anledning til at de to
   * dokumentene sa forskjellige ting om samme dag.
   *
   * ── OG SÅ BLE SAMMENSLÅINGEN FOR TUNG (01.10.2026) ────────────────────
   *
   * Sammenslåingen tok med seg formen. Dokumentet fikk sju deler og to
   * lesere: først kundens plan, så en åttekolonners opptaksliste merket
   * «intern». Taket måtte heves til 12 rader og 8 kolonner, og dermed var
   * det ikke lenger en ensider.
   *
   * Produksjonsplanen for Eger Skin Clinic ble satt opp for hånd med fem
   * deler og én leser, og bestillingen var å gjøre malen lik den: «mer
   * oversiktlig og presis, uten så mye greier».
   *
   * ── HVA SOM ERSTATTER RADENE ──────────────────────────────────────────
   *
   * Ikke ingenting. Opptakslisten er byttet mot en OPPSKRIFT: «Hver
   * behandling, 30 minutter — 1. talking head, 2. b-roll, 3. bilder,
   * liggende til nettsiden og stående til sosiale medier.»
   *
   * For en dag som består av noe som gjentar seg — seks behandlinger, ti
   * retter, fire avdelinger — sier fire linjer det samme som atten rader,
   * og de kan leses på dagen uten å bla. Består dagen av engangsoppsett,
   * sier regelen at spalten skal hete «Slik jobber vi» og beskrive dem.
   *
   * DET SOM FAKTISK ER TAPT, og som skal sies høyt: sekunder per opptak,
   * kamerabevegelse per opptak og avkryssingsrutene. Den som vil ha en
   * liste å hake av på settet, har den ikke lenger her.
   */
  {
    slug: "produksjonsplan",
    fase: "Før opptak",
    navn: "Produksjonsplan",
    kort: "Planen kunden får, og listen du filmer etter. Ett skjema, ett dokument.",
    ansvarlig: "Produsent",
    naar: "Etter oppstartsmøtet, senest en uke før produksjonsdagen",
    /*
     * ── OMLAGT 01.10.2026, ETTER EN PLAN SOM FAKTISK BLE SENDT ──────────
     *
     * Forrige oppsett hadde sju blokker: fakta, tidsplan med boks, to
     * spalter, tre kort, en åttekolonners opptaksliste og en liste til.
     * Alle andre maler i huset har fire eller fem.
     *
     * Produksjonsplanen for Eger Skin Clinic ble satt opp for hånd med
     * fem, og bestillingen var å gjøre malen lik den: «mer oversiktlig og
     * presis, uten så mye greier».
     *
     * Rekkefølgen svarer på spørsmålene i den rekkefølgen kunden stiller
     * dem: hva får vi, hva må vi stille med, når skjer det, hvordan gjør
     * dere det, og hva skjer etterpå.
     *
     * Nøkkelopplysningene ligger nå i `hode` og ikke i en `fakta`-rad —
     * se `Ark.hode` for hvorfor det både sparer en blokk og svarer «når og
     * hvor» før første setning.
     */
    skisse: ["topp", "toKolonner", "tabell", "toKolonner", "liste"],
    /*
     * Tidsplanen er tre kolonner og opptil ni rader — én rad per blokk i
     * dagen, pluss rigg og pause. Standarden på sju holdt ikke for en dag
     * fra 09 til 15.
     *
     * Taket var 12×8 for opptakslisten, som ikke lenger står her.
     */
    tak: { rader: 9, kolonner: 3 },
    kallenavn: ["Opptaksliste", "Kjøreplan", "Shotliste", "Produksjonsdagen"],
    rubrikker: [
      "produksjonsdag-som-gir-8-10",
      "bransjen-bestemmer-alt",
      "lyd-kan-ikke-reddes",
      "de-forste-tre-sekundene",
    ],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde",
        type: "tekst",
        plassholder: "Jordbærpikene",
        paakrevd: true,
      },
      {
        id: "lokasjon",
        etikett: "Lokasjon",
        type: "tekst",
        hjelp: "Avdelingen eller stedet vi faktisk står på.",
        plassholder: "Storo",
        paakrevd: true,
      },
      {
        id: "dato",
        etikett: "Produksjonsdag",
        type: "dato",
        paakrevd: true,
        eksempelDager: 14,
      },
      {
        id: "oppmote",
        etikett: "Når vi er på plass",
        type: "tekst",
        hjelp: "Klokkeslett vi rigger fra, ikke når opptaket starter.",
        plassholder: "08:30",
      },
      {
        id: "publiseres",
        etikett: "Når materiellet publiseres",
        type: "tekst",
        hjelp: "Ofte en annen måned enn opptaket. Det styrer hva vi filmer.",
        plassholder: "November",
        paakrevd: true,
      },
      {
        id: "kundetype",
        eksempel: "Vi filmer her jevnlig",
        /*
         * Feltet het «Kundeforhold», med «Fast kunde på abonnement» og
         * «Prøveperiode» som valg. Begge er avtaleforhold, ikke
         * produksjonsforhold — «prøveperiode» er til og med et punkt i
         * tjenesteavtalen — og produksjonskunder skal aldri omtales som
         * SoMe-abonnenter.
         *
         * Det produsenten faktisk trenger å vite, er hvor godt vi kjenner
         * stedet. Det avgjør hvor mye planen må forklare.
         */
        etikett: "Hvor godt kjenner vi stedet",
        type: "valg",
        hjelp: "Et sted vi filmer jevnlig trenger ikke en omvisning på papir.",
        valg: [
          "Vi filmer her jevnlig",
          "Vi har filmet her noen ganger",
          "Første gang vi filmer her",
        ],
      },
      {
        id: "kontakt",
        etikett: "Kontaktperson på stedet",
        type: "tekst",
        hjelp: "Navn og rolle. Den som slipper oss inn og svarer på dagen.",
        plassholder: "Vivian Hjelmseth, caféeier",
      },
      {
        id: "fraOss",
        etikett: "Fra Reflektor",
        type: "tekst",
        plassholder: "To personer med alt utstyr",
        standard: "To personer med alt utstyr",
      },
      {
        id: "fokus",
        etikett: "Hva som skal i fokus",
        type: "lang",
        hjelp:
          "Produkter, retter eller tjenester dagen skal handle om. Skriv hvorfor, hvis du vet det.",
        plassholder:
          "Burger, fordi november er burgerkampanje. Kald drikke synlig i burgerklippene — drikkefokus i samme periode.",
        paakrevd: true,
      },
      {
        id: "utenfor",
        etikett: "Hva som IKKE skal med",
        type: "lang",
        hjelp: "Det kunden har sagt nei til. Dette er like viktig som fokuset.",
        plassholder:
          "Ingen priser i tale eller bilde. Ikke cæsarsalat, pasta eller bakst denne gangen.",
      },
      {
        id: "bruksflater",
        etikett: "Hvor materiellet skal brukes",
        type: "flervalg",
        hjelp:
          "Skjermer i lokalet krever rene klipp uten lyd og teksting — det endrer opptaket.",
        valg: [
          "Sosiale medier",
          "Menyskjermer og innkastere i lokalet",
          "Nettside",
          "Annonser",
        ],
        standard: "Sosiale medier",
        eksempel: "Sosiale medier · Menyskjermer og innkastere i lokalet",
      },
      {
        id: "formater",
        etikett: "Formater",
        type: "tekst",
        plassholder: "1080×1920, 1920×1080, 4:5 og 1:1",
        standard: "1080×1920, 1920×1080, 4:5 og 1:1",
      },
      {
        id: "stills",
        etikett: "Stillbilder i tillegg til video",
        type: "valg",
        hjelp:
          "Stills deler kapasitet med video. Sier du ja, blir det færre videoer.",
        valg: ["Nei, bare video", "Ja, stills i tillegg"],
        eksempel: "Ja, stills i tillegg",
      },
      {
        id: "uttrykk",
        etikett: "Uttrykk og målgruppe",
        type: "lang",
        hjelp:
          "Kundens egne stikkord hvis du har dem, og hvem det skal treffe.",
        plassholder:
          "Fristende og juicy. Skal treffe menn bedre uten å miste hovedmålgruppen, som er kvinner 25–45.",
      },
      {
        id: "medvirkende",
        etikett: "Hvem vi trenger fra kunden",
        type: "lang",
        hjelp:
          "Rolle og omtrent hvor lenge. Dette er den vanligste grunnen til at en dag velter.",
        plassholder:
          "Kokk, ca. 2 timer før åpning. Caféeier, 30 min. Én eller to ansatte, 20 min hver.",
        paakrevd: true,
      },
      {
        id: "logo",
        etikett: "Logo på materiellet",
        type: "valg",
        valg: ["Uten logo", "Med logo", "Avklares"],
        standard: "Uten logo",
      },
      /*
       * ── HERFRA GJELDER FELTENE OPPTAKSDAGEN ───────────────────────────
       *
       * «Er det tale på dagen» hadde en gang «Nei, bare romlyd» som
       * forhåndsvalg. En produksjonsplan der noen snakker på film ga da en
       * opptaksliste uten mikrofon, fordi et utfylt felt gjelder foran
       * vedlegget. Feltet har ikke og skal ikke ha et standardvalg.
       */
      {
        id: "tale",
        etikett: "Er det tale på dagen",
        type: "valg",
        hjelp:
          "Avgjør om mikrofon og stille lokale må inn i planen. Lyd kan ikke reddes i etterkant.",
        valg: [
          "Nei, bare romlyd",
          "Ja, noen filmes mens de snakker",
          "Både og",
        ],
        eksempel: "Ja, noen filmes mens de snakker",
      },
      {
        id: "spesielt",
        etikett: "Noe som gjelder spesielt",
        type: "lang",
        hjelp:
          "Et opptak som må tas før lokalet åpner, en detalj kunden har bedt om, noe som bare kan filmes én gang.",
        plassholder:
          "Det tomme lokalet må filmes før de åpner klokka 10. Kokken har bare tid før åpning.",
      },
      {
        id: "videre",
        etikett: "Rytmen videre",
        type: "lang",
        hjelp:
          "Hva som skjer de neste månedene. Utelat hvis det ikke er avklart.",
        plassholder:
          "Oktober: ingen produksjon, Rosa sløyfe i avdelingene. November: én dag, disk og bestselgere. Desember: én dag, catering og varm drikke.",
      },
      ...GRUNNLAGSFELT,
    ],
    oppdrag:
      "Ensideren kunden får før produksjonsdagen. Én leser: kunden. Den skal kunne leses på tretti sekunder og svare på hva de får, hva de må stille med, og når det skjer. Merket øverst er «Reflektor × [Kunde]». Overskriften er «Produksjonsplan». Undertittelen er én setning om hva dagen skal gi — «Bilder og video til ny nettside. Første produksjonsdag.»" +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det." +
      "HODE: inntil fire korte linjer høyrestilt i det mørke feltet. Første linje er produksjonsdagen skrevet ut, «Mandag 28. september 2026». Deretter klokkeslettene fra Når vi er på plass til dagen er ferdig, så Lokasjon, så Fra Reflektor. Hver linje bærer sin egen etikett: «Kl. 09.00–15.00», «Sted: Storo», «Fra Reflektor: 2 personer». Står stedet ikke fast, skriv «Sted: bekreftes». Disse opplysningene skal ikke gjentas i delene under.",
    struktur: [
      "TOKOLONNER — venstre spalte «Dette lager vi»: hva kunden sitter igjen med, bygget av Hva som skal i fokus og Hvor materiellet skal brukes. Én kule per type leveranse, ikke én per video. Er Uttrykk og målgruppe oppgitt, står det som siste kule, slik at kunden kan si fra før vi filmer og ikke etterpå. Høyre spalte «Dette trenger vi fra [kunden]»: hva de må stille med, bygget av Hvem vi trenger fra kunden. Siste kule er alltid samtykke.",
      "TABELL — tidsplanen, med kolonnene Når, Hva og Hvem. Én rad per blokk i dagen, i klokkerekkefølge. Første rad er rigging, siste rad er nedrigg, og pausen står som sin egen rad. Kolonnen Hvem er hvem eller hva som må være på plass akkurat da — «Behandler og modell», «Ryddige rom» — ikke en gjentakelse av Hva.",
      "TOKOLONNER — venstre spalte er oppskriften som gjentar seg: «Hver [enhet], [antall] minutter», der enheten er det dagen består av: en behandling, en rett, en avdeling. Nummererte steg med hva vi tar opp hver gang — Stillbilder i tillegg til video avgjør om bilder er ett av stegene. Siste kule er leveransespesifikasjonen: Formater, og Logo på materiellet hvis det er avklart. Høyre spalte «Praktisk»: hva som må være i orden i lokalet, Noe som gjelder spesielt, hvem som slipper oss inn fra Kontaktperson på stedet, og til slutt Når materiellet publiseres som en leveranselinje, pluss eventuell godkjenning.",
      "LISTE — «Neste produksjonsdager». Hva som er planlagt etter denne dagen, bygget av Rytmen videre. Utelat hele delen hvis det ikke er avklart.",
    ],
    regler: [
      "Antall leveranser skal lande på 8–10 til sammen. Det er produksjonsmålet for en dag, og planen skal ikke love mer enn dagen kan holde.",
      "Tidsplanen er dagens eneste tabell, og den går i klokkerekkefølge fra rigg til nedrigg. Tre til ni rader. Flere enn ni betyr at dagen er delt opp finere enn noen kommer til å følge.",
      "Oppskriften i tredje del er det som erstatter en opptaksliste rad for rad. Den skal derfor være presis nok til å filme etter: hva som tas opp, i hvilken rekkefølge, og hvilket format det leveres i. «Talking head, b-roll, 1–3 bilder» er presist. «Vi filmer behandlingen» er det ikke.",
      "Består ikke dagen av noe som gjentar seg, skal venstre spalte i tredje del hete «Slik jobber vi» i stedet, og si hvordan hvert opptak settes opp. Samme presisjonskrav.",
      "Bildeutsnitt skrives med ett av fire ord når det nevnes: totalt, halvnært, nært, detalj. Ikke «fint utsnitt av maten».",
      "«Er det tale på dagen» styrer Praktisk-spalten: filmes noen mens de snakker, skal det stå at rommet må være stille under opptak. Lyd kan ikke reddes i etterkant.",
      "Skal materiellet på skjermer i lokalet, står det i «Dette lager vi» at de klippene skytes rene — uten lyd og tekst.",
      "Er det oppgitt noe under «Hva som IKKE skal med», skal det stå som en tydelig setning i «Dette lager vi» — ikke bare utelates.",
      "Et punkt som har en nøkkel, skriver nøkkelen først med kolon: «Klinikken: bilder uten folk». Arket setter det foran kolonet i halvfet, og da kan spalten skannes uten å leses.",
      "«Hvor godt kjenner vi stedet» styrer hvor mye planen forklarer, ikke hva den inneholder. Et sted vi filmer jevnlig trenger ingen omvisning; første gang tar Praktisk-spalten med tilgang og fremmøte i klartekst.",
      "Ikke skriv klippebeskrivelser eller musikkforslag. Det hører hjemme i redigeringen.",
      "Dette dokumentet går til kunden. Ingenting i det skal være formulert som en intern notis, et forbehold eller en arbeidsinstruks til oss selv.",
    ],
  },

  {
    slug: "samtykke-film-og-bilde",
    fase: "På opptak",
    navn: "Samtykke til film og bilde",
    kort: "Skjemaet den som filmes signerer. Hva som tas opp, hvor det publiseres, og hvor lenge.",
    ansvarlig: "Produsent",
    naar: "Før opptaket starter. Aldri etter.",
    skisse: ["topp", "avsnitt", "liste", "signatur"],
    rubrikker: ["filme-folk-som-ikke-vil"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde",
        type: "tekst",
        paakrevd: true,
        eksempel: "Jordbærpikene",
      },
      {
        id: "lokasjon",
        etikett: "Sted og dato for opptaket",
        type: "tekst",
        plassholder: "Jordbærpikene Storo, 24. september 2026",
        paakrevd: true,
      },
      {
        id: "hvem",
        eksempel: "Ansatt hos kunden",
        etikett: "Hvem skal signere",
        type: "valg",
        hjelp: "Ansatte hos kunden og gjester i lokalet har ulike behov.",
        valg: [
          "Ansatt hos kunden",
          "Gjest eller kunde i lokalet",
          "Innleid medvirkende",
          "Mindreårig (under 18)",
        ],
      },
      {
        id: "kanaler",
        etikett: "Hvor materiellet publiseres",
        type: "flervalg",
        valg: [
          "Instagram",
          "Facebook",
          "Menyskjermer i lokalet",
          "Kundens nettside",
          "Betalte annonser",
        ],
        paakrevd: true,
        eksempel: "Instagram · Facebook · Menyskjermer i lokalet",
      },
      {
        id: "varighet",
        etikett: "Hvor lenge materiellet kan brukes",
        type: "valg",
        valg: [
          "To år fra opptaksdato",
          "Fem år fra opptaksdato",
          "Uten tidsbegrensning",
        ],
        standard: "To år fra opptaksdato",
      },
      {
        id: "merknad",
        etikett: "Noe som gjelder spesielt her",
        type: "lang",
        hjelp:
          "For eksempel at personen ikke vil vises i ansikt, eller bare i bestemte kanaler.",
        eksempel:
          "Én av de ansatte vil ikke vises i ansikt. Hun kan filmes bakfra og på hendene.",
      },
    ],
    oppdrag:
      "Skjemaet den som filmes leser og signerer før opptaket. Det skal være kort nok til at folk faktisk leser det. Overskriften er «Samtykke til film og bilde». Undertittelen sier hvem som filmer, hvor og når." +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det. Overskriften er sakens navn, ikke dokumentets.",
    struktur: [
      "AVSNITT — hva samtykket gjelder: hvilket opptak (Sted og dato for opptaket), hvem som filmer, hvor det publiseres (Hvor materiellet publiseres) og hvor lenge (Hvor lenge materiellet kan brukes). Er det skrevet noe under «Noe som gjelder spesielt her», står det her.",
      "LISTE — hva personen har rett til: å si nei uten å oppgi grunn, å trekke samtykket tilbake når som helst, og hvem hen kontakter for å gjøre det.",
      "SIGNATUR — to felter: den som samtykker, og den som tar imot samtykket for Reflektor. Er «Hvem skal signere» satt til mindreårig, er det andre feltet foresatt.",
    ],
    regler: [
      "Datatilsynet skiller mellom portrettbilder, der bestemte personer er hovedmotivet, og situasjonsbilder der ingen er i fokus. Alt vi lager for en kunde er i praksis portrett. Skriv skjemaet deretter.",
      "Samtykket skal kunne trekkes tilbake. Si hvem personen kontakter, og at det ikke krever en begrunnelse.",
      "Ansvaret for samtykke ligger hos kunden som arbeidsgiver. Skjemaet skal si hvem som er behandlingsansvarlig.",
      "Ikke skriv juridisk stammespråk. «Du kan si nei, og det får ingen konsekvenser» er bedre enn «samtykket er frivillig og kan når som helst tilbakekalles».",
      "Kanalene og varigheten i dette skjemaet er omfanget av personens eget samtykke, og de SKAL stå. Et samtykke uten kanal og tid er ikke et samtykke. Dette er ikke et forretningsvilkår mellom Reflektor og kunden, og den regelen gjelder ikke her.",
      "Ikke skriv noe om honorar. Skal en medvirkende ha betalt, avtales det utenfor dette skjemaet.",
    ],
  },

  {
    slug: "leveranseoversikt",
    fase: "Etter opptak",
    navn: "Leveranseoversikt",
    kort: "Det som følger med når materiellet overleveres. Hva som ligger hvor, i hvilket format, og hva som eventuelt mangler.",
    ansvarlig: "Redigerer",
    naar: "Samtidig som materiellet sendes",
    skisse: ["topp", "fakta", "tabell", "avsnitt"],
    rubrikker: ["teksting-og-tekstplakater", "stolthet-og-standard"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde",
        type: "tekst",
        paakrevd: true,
        eksempel: "Jordbærpikene",
      },
      {
        id: "dato",
        etikett: "Opptaksdagen det gjelder",
        type: "dato",
        eksempelDager: -4,
      },
      {
        id: "hvor",
        etikett: "Hvor filene ligger",
        type: "tekst",
        hjelp: "Mappenavnet kunden får, ikke en beskrivelse av det.",
        paakrevd: true,
        eksempel: "Jordbaerpikene_Storo_oktober",
      },
      {
        id: "leveranser",
        etikett: "Hva som leveres",
        type: "lang",
        hjelp:
          "Ett per linje. Filnavn først, så én setning om hva klippet er. «02-burger-grill.mp4 — burgeren fra rå til ferdig, 18 sek».",
        paakrevd: true,
        eksempel:
          "01-lokalet-tomt.mp4 — lokalet før åpning, 12 sek\n02-burger-grill.mp4 — burgeren fra rå til ferdig, 18 sek\n03-kald-drikke.mp4 — is og helling i glass, 11 sek\n04-kokken-forteller.mp4 — om burgeren, til kamera, 24 sek",
      },
      {
        id: "formater",
        etikett: "Formater i leveransen",
        type: "flervalg",
        valg: [
          "9:16 til Reels og Stories",
          "1:1 til feed",
          "16:9 til menyskjermer",
          "Stillbilder",
        ],
        standard: "9:16 til Reels og Stories",
        /*
         * IKKE PÅKREVD, SELV OM FORMATET ALLTID MÅ STÅ.
         *
         * Feltet var merket påkrevd OG hadde standardverdi. De to kan ikke
         * gjelde samtidig: et felt som alltid har en verdi, blir aldri
         * savnet, så «Dokumentet trenger N felt til» nevnte det aldri.
         * Kravet var en påstand uten virkning.
         *
         * Standarden er Reflektors eget leveranseformat og skal bli
         * stående. Da er det kravet som må vike.
         */
        eksempel: "9:16 til Reels og Stories · 16:9 til menyskjermer",
      },
      {
        id: "teksting",
        etikett: "Teksting",
        type: "valg",
        valg: [
          "Tekstet, brent inn i bildet",
          "Tekstet, egen fil",
          "Uten tekst — skal stå på skjerm i lokalet",
          "Blandet, står per fil",
        ],
        standard: "Tekstet, brent inn i bildet",
      },
      {
        id: "mangler",
        etikett: "Det som ikke er med",
        type: "lang",
        hjelp:
          "Et opptak som ikke ble noe av, en leveranse som kommer senere, noe vi venter på fra kunden.",
        eksempel:
          "Stillbildene fra disken kommer mandag. Ett klipp fra lunsjrushet ble ubrukelig på grunn av lyd fra kjøledisken.",
      },
    ],
    oppdrag:
      "Oversikten som følger materiellet når det overleveres. Den skal kunne leses på et halvt minutt og svare på hva kunden fikk, hvor det ligger, og om noe mangler. Overskriften er kunde og opptaksdag." +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det. Overskriften er sakens navn, ikke dokumentets.",
    struktur: [
      "FAKTA — Opptaksdagen det gjelder, Hvor filene ligger, Formater i leveransen, og antall filer.",
      "TABELL — leveransene, med kolonnene Fil, Hva klippet viser, Format, Teksting. Én rad per linje i Hva som leveres.",
      "AVSNITT — først «Det som ikke er med» fra feltet med samme navn, og hva som skjer med det. Er noe skutt rent til skjermer i lokalet, står det i samme avsnitt at de filene mangler lyd og tekst med vilje.",
    ],
    regler: [
      "Filnavnet i tabellen skal være det faktiske filnavnet. En oversikt der navnene ikke stemmer, er verre enn ingen oversikt.",
      "Er noe skutt rent for skjermer i lokalet, skal det stå eksplisitt at de filene mangler lyd og tekst med vilje. Ellers ser det ut som en feil.",
      "«Det som ikke er med» skal stå selv om det bare er én ting. Kunden oppdager det uansett, og det er bedre at vi sier det først.",
      "Ikke skriv noe om bruksrett, eierskap, betaling eller hva som inngår i abonnementet. Det står i tjenesteavtalen, og den eies ikke her.",
    ],
  },

  {
    slug: "befaringsnotat",
    fase: "Før opptak",
    navn: "Befaringsnotat",
    kort: "Det du skriver ned på befaringen, så produksjonsdagen ikke møter noe uventet.",
    ansvarlig: "Produsent",
    naar: "Samme dag som befaringen, før du glemmer det",
    skisse: ["topp", "fakta", "toKolonner", "liste"],
    rubrikker: ["lyd-kan-ikke-reddes", "produksjonsdag-som-gir-8-10"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde og lokasjon",
        type: "tekst",
        paakrevd: true,
        eksempel: "Jordbærpikene Storo",
      },
      {
        id: "dato",
        etikett: "Dato for befaringen",
        type: "dato",
        paakrevd: true,
        eksempelDager: 2,
      },
      {
        id: "produksjonsdag",
        etikett: "Planlagt produksjonsdag",
        type: "dato",
        eksempelDager: 21,
      },
      {
        id: "lys",
        etikett: "Lys",
        type: "lang",
        hjelp:
          "Hvor kommer dagslyset fra, når på dagen, og hva slags kunstlys henger der.",
        plassholder:
          "Store vinduer mot sør, best lys før kl. 12. Varme spotter over disken, blander seg dårlig med dagslys.",
      },
      {
        id: "lyd",
        etikett: "Lyd",
        type: "lang",
        hjelp:
          "Ventilasjon, kjøledisk, musikkanlegg, trafikk. Hva kan slås av, og hvem kan slå det av?",
        plassholder:
          "Kjøledisk bak disken brummer hørbart. Musikkanlegg kan skrus av fra kassa. Ventilasjon går ikke å stoppe.",
        paakrevd: true,
      },
      {
        id: "oppsett",
        etikett: "Mulige oppsett",
        type: "lang",
        hjelp:
          "Tre til fem steder du faktisk kan stå. Beskriv hva som er i bildet fra hvert.",
        plassholder:
          "1) Kjøkkenbenken, tett på hendene. 2) Disken sett fra gjestesiden. 3) Vindusbordet med dagslys. 4) Inngangen utenfra.",
        paakrevd: true,
      },
      {
        id: "strom",
        etikett: "Strøm og plass",
        type: "lang",
        hjelp:
          "Uttak, hvor vi kan legge fra oss utstyr, om vi er i veien for driften.",
        eksempel:
          "To uttak ved kjøkkenbenken, ett ved disken. Utstyr kan settes i garderoben bak. Står vi ved disken etter åpning, er vi i veien for køen.",
      },
      {
        id: "folk",
        etikett: "Folk og tilgang",
        type: "lang",
        hjelp: "Hvem er på jobb den dagen, hvem har nøkkel, når åpner de.",
        eksempel:
          "Vivian låser opp klokka 07. Kokken er på jobb fra 08. Lokalet åpner for gjester klokka 10.",
      },
      {
        id: "problemer",
        etikett: "Det som kan velte dagen",
        type: "lang",
        hjelp: "Alt du så som kan gå galt. Skriv det stygt heller enn pent.",
        eksempel:
          "Kjøledisken bråker og tåler ikke å stå av mer enn 20 minutter. Vinduet mot gata gir hardt motlys etter klokka 13. Kaffemaskinen står i den eneste kontakten ved disken.",
      },
    ],
    oppdrag:
      "Det interne notatet fra befaringen. Det leses av den som planlegger dagen, og av den som står der hvis det ikke er samme person. Stikkordsmessig og fullstendig, ikke velskrevet. Overskriften er kunde og lokasjon." +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det. Overskriften er sakens navn, ikke dokumentets.",
    struktur: [
      "FAKTA — Kunde og lokasjon, Dato for befaringen, Planlagt produksjonsdag, og antall mulige oppsett.",
      "TOKOLONNER — venstre spalte «Lyd og lys» av feltene Lyd og Lys, i den rekkefølgen. Høyre spalte «Oppsettene» av feltet Mulige oppsett, nummerert, med hva som er i bildet fra hvert.",
      "LISTE — «Det som kan velte dagen», bygget av feltene Det som kan velte dagen, Strøm og plass og Folk og tilgang. Dette er notatets viktigste del.",
    ],
    regler: [
      "Lyd først, ikke lys. Dårlig lys kan løftes i etterarbeid; dårlig lyd kan ikke.",
      "Tre til fem oppsett. Finner du flere, er det fordi du ikke har valgt ennå — velg.",
      "Ikke skriv «bra lys» eller «grei lyd». Skriv hva du så og hørte.",
    ],
  },

  {
    slug: "oppsummering-kundemote",
    fase: "Før opptak",
    navn: "Oppsummering etter kundemøte",
    kort: "Meldingen du sender etter møtet. Hva som ble bestemt, hva vi gjør, og datoen som gjelder.",
    ansvarlig: "Kundeansvarlig",
    naar: "Samme dag som møtet",
    skisse: ["topp", "fakta", "avsnitt", "toKolonner", "liste"],
    rubrikker: ["forberedt-til-kundemote", "proaktiv-kundekontakt"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde",
        type: "tekst",
        paakrevd: true,
        eksempel: "Jordbærpikene",
      },
      {
        id: "deltakere",
        etikett: "Hvem var med",
        type: "tekst",
        plassholder: "Christian Heger (markedssjef), Pål og Henrik fra oss",
      },
      {
        id: "dato",
        etikett: "Møtedato",
        type: "dato",
        paakrevd: true,
        eksempelDager: 0,
      },
      {
        id: "bestemt",
        etikett: "Hva som ble bestemt",
        type: "lang",
        hjelp:
          "Bare det som faktisk ble avgjort. Det som ble diskutert uten konklusjon hører ikke hjemme her.",
        paakrevd: true,
        eksempel:
          "November blir burgerkampanje. Vi filmer på Storo, ikke på Majorstuen. Kald drikke skal være synlig i burgerklippene.",
      },
      {
        id: "voresOppgaver",
        etikett: "Hva vi skal gjøre",
        type: "lang",
        hjelp: "Én linje per oppgave. Skriv hvem hos oss som eier den.",
        paakrevd: true,
        eksempel:
          "Henrik lager produksjonsplanen og sender den senest en uke før opptaksdagen. Pål avtaler tilgang til lokalet med Vivian.",
      },
      {
        id: "deresOppgaver",
        etikett: "Hva kunden skal gjøre",
        type: "lang",
        hjelp: "Vær konkret på hvem og når. Dette er det som pleier å glippe.",
        eksempel:
          "Vivian bekrefter innen fredag at kokken kan settes av i to timer før åpning. Christian sender logofilen.",
      },
      {
        id: "leveringsdato",
        etikett: "Leveringsdato",
        type: "dato",
        hjelp:
          "Én dato, valgt ut fra vår kapasitet. Ikke et tidsrom, og ikke kundens forslag.",
        paakrevd: true,
        eksempelDager: 21,
      },
      {
        id: "uavklart",
        etikett: "Det som fortsatt er uavklart",
        type: "lang",
        hjelp: "Og hvem som skal avklare det, innen når.",
        eksempel:
          "Om bestselgerne fra disken skal med i november eller vente til desember. Vivian svarer innen tirsdag.",
      },
    ],
    oppdrag:
      "Oppsummeringen kunden får samme dag som møtet. Den skal kunne leses på tjue sekunder og etterlate null tvil om hva som skjer videre. Overskriften er kundens navn og hva møtet handlet om." +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det. Overskriften er sakens navn, ikke dokumentets.",
    struktur: [
      "FAKTA — Møtedato, Hvem var med, og Leveringsdato.",
      "AVSNITT — «Dette ble bestemt», av feltet Hva som ble bestemt. To til fire setninger, ingen innledning om hvor hyggelig møtet var.",
      "TOKOLONNER — venstre spalte «Vi gjør» av Hva vi skal gjøre, med navn på hvem hos oss. Høyre spalte «Dere gjør» av Hva kunden skal gjøre, med navn og frist.",
      "LISTE — «Fortsatt uavklart», av feltet Det som fortsatt er uavklart, med hvem som avklarer og innen når. Er feltet tomt, skal listen si at ingenting står uavklart.",
    ],
    regler: [
      "Leveringsdatoen skal stå som en OPPLYSNING, ikke som et spørsmål. «Dere har materialet torsdag 9. oktober» — ikke «passer det at vi leverer rundt den 9.?».",
      "Én dato. Ikke «i løpet av uke 41», ikke «rundt månedsskiftet».",
      "Ikke gjenta hele møtet. Alt som ikke er en beslutning eller en oppgave, skal ut.",
    ],
  },

  {
    slug: "publiseringsplan",
    fase: "Etter opptak",
    navn: "Publiseringsplan for en måned",
    kort: "Måneden fordelt på faste dager, med det tidsavhengige låst først.",
    ansvarlig: "Kundeansvarlig",
    naar: "Når materialet fra produksjonsdagen er redigert",
    skisse: ["topp", "fakta", "tabell", "avsnitt"],
    rubrikker: ["rytmen-to-i-uka"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde",
        type: "tekst",
        paakrevd: true,
        eksempel: "Jordbærpikene",
      },
      {
        id: "maaned",
        etikett: "Hvilken måned",
        type: "tekst",
        plassholder: "November 2026",
        paakrevd: true,
      },
      {
        id: "dager",
        etikett: "Faste publiseringsdager",
        type: "tekst",
        hjelp: "To dager i uken, de samme hver uke.",
        plassholder: "Tirsdag og torsdag",
        standard: "Tirsdag og torsdag",
      },
      {
        id: "innhold",
        etikett: "Videoene som skal ut",
        type: "lang",
        hjelp: "Én linje per video. Skriv hva den viser.",
        paakrevd: true,
        eksempel:
          "Burgeren bygges fra bunnbrød til lokk\nKald drikke helles i glass med is\nKokken forteller om burgeren\nLokalet i lunsjrushet\nNærbilde av burgeren som skjæres i to\nStillbilde: burger og drikke på bordet\nRent klipp til menyskjermene: burger på grillen\nRent klipp til menyskjermene: drikke med kondens",
      },
      {
        id: "tidsavhengig",
        etikett: "Det som må ut på en bestemt dato",
        type: "lang",
        hjelp:
          "Kampanjer, sesong, åpninger. Dette låses først, resten flyttes rundt det.",
        eksempel:
          "Burgerkampanjen starter 3. november og må ligge ute samme morgen.",
      },
      {
        id: "kanaler",
        eksempel: "Instagram, med krysspublisering til Facebook",
        etikett: "Kanaler",
        type: "tekst",
      },
      ...GRUNNLAGSFELT,
    ],
    oppdrag:
      "Publiseringsplanen for én måned: hva som går ut hvilken dag, i hvilken kanal. Overskriften er kunden og måneden." +
      "Arket har allerede dokumenttypen, Reflektor-merket, dagens dato og Reflektors kontaktopplysninger i hodet og bunnen. Ikke gjenta noe av det. Overskriften er sakens navn, ikke dokumentets.",
    struktur: [
      "FAKTA — Hvilken måned, Faste publiseringsdager, Kanaler, og antall publiseringer i måneden.",
      "TABELL — planen, med kolonnene Dato, Ukedag, Hva som publiseres, Kanal. Én rad per linje i Videoene som skal ut. Lås Det som må ut på en bestemt dato først, og fordel resten rundt.",
      "AVSNITT — hvor mye forsprang køen har, og hva som flyttes først hvis noe glipper.",
    ],
    regler: [
      "To poster i uken. En måned har fire eller fem publiseringsuker, altså åtte eller ti poster — det er derfor produksjonsmålet er 8–10, og derfor varierer antall rader mellom måneder.",
      "Én video er én post. De går til Instagram og krysspubliseres til Facebook — ikke to på hver.",
      "Lås det tidsavhengige først. Resten fordeles rundt det, og det er den delen som redder rytmen når noe glipper.",
    ],
  },
] as const;

/**
 * Adresser som ikke finnes lenger, og hvor de skal føre.
 *
 * Produksjonsplan og opptaksliste ble én mal 28.09.2026. Intranettet har
 * ingen lenker utenfra, men produsentene har bokmerker — og et bokmerke som
 * gir «siden finnes ikke» leses som at verktøyet er ødelagt, ikke som at
 * dokumentet har byttet navn.
 */
export const TIDLIGERE_SLUGGER: Readonly<Record<string, string>> = {
  opptaksliste: "produksjonsplan",
};

export function malFraSlug(slug: string): Mal | undefined {
  return MALER.find((m) => m.slug === slug);
}

/**
 * Setter sammen instruksen som gis til Claude.
 *
 * ALT PÅ ETT STED. Hver mal beskriver bare SITT dokument; huskereglene som
 * gjelder alle dokumenter står her, én gang. Da kan de ikke gli fra
 * hverandre mellom åtte maler.
 */
/**
 * Datofelt kommer fra nettleseren som 2026-09-24. Dokumentet skal si
 * «torsdag 24. september 2026» — ukedagen er en del av poenget når noen
 * skal møte opp. Instruksen skal derfor ikke be Claude om å regne om en
 * ISO-dato; den skal levere datoen ferdig.
 *
 * Er verdien ikke en gyldig dato, sendes den videre urørt. Feltet kan være
 * fylt ut for hånd, og da er brukerens ord bedre enn en tom streng.
 */
function norskDato(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * ── HVORFOR DENNE TEKSTEN ER SÅ FULL AV TALL ──────────────────────────────
 *
 * «Hold det kort» betyr ingenting for en modell som nettopp har lest en
 * detaljert brief. Den første utgaven ba om markdown og sa «én side»; den
 * leverte fire sider med utmerket innhold. Takhøyder i tall er det eneste
 * som virker, og de er de samme tallene som valideringen bruker.
 */
function ensiderregelen(mal: Mal): string {
  const t = takFor(mal);
  /*
   * ── EN MAL KAN BÆRE MER ENN ÉN SIDE ───────────────────────────────────
   *
   * Produksjonsplanen har to deler med ulik leser: planen kunden får, og
   * listen den som filmer holder. Å presse begge ned på én A4 ville gjort
   * nøyaktig det denne teksten advarer mot — kutte det leseren trenger.
   *
   * Sidetallet leses derfor av taket: en mal som tillater flere rader enn
   * standarden, er ikke en ensider, og skal ikke få beskjed om at den er
   * det. Resten av reglene gjelder likevel, for de handler om å velge bort
   * det ingen trenger, ikke om papir.
   */
  const ensider = t.rader <= TAK.rader;
  return [
    ensider
      ? "DETTE ER EN ENSIDER, OG DET ER IKKE FORHANDLINGSBART"
      : "DETTE DOKUMENTET HAR FÅ SIDER, OG HVER DEL SKAL VÆRE KOMPLETT",
    ensider
      ? "En produksjonsplan som krever to sider er ikke en lengre plan — det er en plan med for mange detaljer i. Kunden skal kunne lese den én gang og vite hva som skjer. Alt utover det skaper forvirring, ikke trygghet."
      : "Lengde er ikke problemet her — ufullstendighet er det. En tabellrad som mangler en kolonne, er en rad den som leser ikke kan handle på. Fyll hver rad helt, og kutt heller en hel rad enn å la alle stå halve.",
    "Ta med det som må være avklart FØR dagen, og det kunden må stille med. Ikke ta med det vi uansett avgjør på stedet, det som står i avtalen, eller det som bare beskriver hvor grundige vi er.",
    ensider
      ? "Alt skal få plass på én A4-side. Det som ikke får plass, blir klippet bort — da mister dokumentet den siste seksjonen sin, og ingen oppdager det før kunden gjør det."
      : "Overskrider du takene under, blir det som stikker over klippet bort uten varsel. Hold deg innenfor dem.",
    `- Maks ${t.rader} rader i en tabell, og maks ${t.kolonner} kolonner.`,
    `- Maks ${TAK.celle} tegn i en tabellcelle.`,
    `- Maks ${t.punkter} punkter i en liste, og maks ${TAK.punkt} tegn i hvert.`,
    `- Undertittelen: maks ${TAK.undertittel} tegn.`,
    "Må du velge, velg bort det leseren kan spørre om, og behold det hen må vite før hen står der. I tvil: ta det bort.",
    /*
     * ── DET SOM KUTTES, SKAL SIES HØYT ────────────────────────────────────
     *
     * Ensiderregelen har alltid virket. Problemet var at den virket i
     * stillhet: en produsent ba om voiceover per opptak, plassregelen spiste
     * den to runder senere, og hen oppdaget det ved å lese dokumentet på
     * nytt. Kuttet i seg selv var forsvarlig. At det ikke sto noe sted, var
     * det ikke.
     */
    "TOK DU NOE BORT FOR Å FÅ PLASS, SKAL DET STÅ I BESKJEDEN til produsenten — hva, og hvorfor akkurat det. Beskjeden er ikke en del av dokumentet og koster ingen plass på arket. Et kutt ingen får vite om, oppdages av kunden.",
    "Slå sammen heller enn å kutte: to like rader blir én rad med begge navnene.",
    "Bruk plassen du har, men ikke fyll den for å fylle den. Én tom tredjedel er bedre enn tre rader ingen trenger.",
  ].join("\n");
}

export function byggInstruks(
  mal: Mal,
  verdier: Readonly<Record<string, string>>,
  medVedlegg = false,
  research = "",
  /**
   * Feltene produsenten faktisk har tatt stilling til.
   *
   * ── HVORFOR ET FORHÅNDSVALG IKKE ER ET SVAR ───────────────────────────
   *
   * 27.09.2026 lastet en produsent opp en produksjonsplan der noen snakker
   * på film. Feltet «Er det tale på dagen» sto på «Nei, bare romlyd» —
   * ingen hadde valgt det, det var feltets standardverdi — og instruksen
   * sa at et utfylt felt gjelder foran vedlegget. Opptakslisten ble laget
   * uten mikrofon, og produsenten måtte oppdage det selv.
   *
   * Modellen gjorde nøyaktig som den fikk beskjed om. Beskjeden var feil,
   * fordi den ikke skilte mellom «produsenten har svart dette» og «feltet
   * åpnet med dette».
   *
   * Et felt regnes som ubekreftet når verdien fortsatt er standardverdien
   * OG den ikke står her. Utelates listen, regnes alt som står på en
   * standardverdi som ubekreftet — det er den trygge antakelsen, og den
   * gjør at en gammel klient ikke kan gjenskape feilen.
   */
  bekreftet?: readonly string[],
): string {
  /*
   * Grunnlagsfeltene holdes utenfor BEGGE listene. De er ikke innhold som
   * mangler, og de er ikke innhold som er fylt ut — de er noe Claude har
   * undersøkt med, og de har allerede gjort jobben sin før instruksen
   * bygges. Står de under IKKE OPPGITT, blir de til TBD(...) i dokumentet.
   */
  const innhold = mal.felt.filter((f) => !f.grunnlag);

  const linje = (f: (typeof innhold)[number], v: string) =>
    `- ${f.etikett}: ${f.type === "dato" ? norskDato(v) : v}`;

  /* Står feltet fortsatt på standardverdien, har ingen tatt stilling. */
  const ubekreftet = (f: (typeof innhold)[number], v: string) =>
    f.standard !== undefined &&
    v === f.standard &&
    !(bekreftet ?? []).includes(f.id);

  const fylte = innhold
    .map((f) => [f, (verdier[f.id] ?? "").trim()] as const)
    .filter(([, v]) => v.length > 0);

  const utfylt = fylte
    .filter(([f, v]) => !ubekreftet(f, v))
    .map(([f, v]) => linje(f, v));

  const forvalg = fylte
    .filter(([f, v]) => ubekreftet(f, v))
    .map(([f, v]) => linje(f, v));

  const mangler = innhold
    .filter((f) => !(verdier[f.id] ?? "").trim())
    .map((f) => `- ${f.etikett}`);

  const deler = [
    "Du skriver et dokument for Reflektor AS, et norsk byrå som leverer foto og video til sosiale medier på månedlig abonnement. Alt skal være på norsk.",
    "",
    `OPPGAVEN\n${mal.oppdrag}`,
    "",
    ...(research ? ["", research] : []),
    "",
    `HVA DOKUMENTET SKAL DEKKE\n${mal.struktur.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    "",
    `DELENE DU SKAL FYLLE UT\n${delforklaring(mal)}`,
    "",
    ensiderregelen(mal),
    "",
    `INFORMASJONEN\n${utfylt.length ? utfylt.join("\n") : "- (ingenting utfylt)"}`,
  ];

  /*
   * ── FORHÅNDSVALGENE STÅR FOR SEG, OG SVAKERE ──────────────────────────
   *
   * De er Reflektors vanlige svar, ikke produsentens. Står de i samme
   * liste som resten, er de umulige å skille fra noe noen har bestemt —
   * og da vinner de over et vedlegg som sier det motsatte.
   */
  if (forvalg.length) {
    deler.push(
      "",
      [
        "STANDARDVALG INGEN HAR BEKREFTET",
        "Disse feltene står på Reflektors vanlige svar. Produsenten har ikke tatt stilling til dem for akkurat denne jobben.",
        ...forvalg,
        "",
        "Bruk dem der ingenting annet sier noe. Sier et vedlegg, en e-post fra kunden eller researchen noe annet, gjelder DET — et forhåndsvalg er ikke et svar, og det skal aldri overstyre noe noen faktisk har skrevet.",
        "Er ett av dem avgjørende for dokumentet, og du ikke fant noe som bekrefter eller motsier det, spør om det under avklaringer. Da vet produsenten at du la det til grunn.",
      ].join("\n"),
    );
  }

  /*
   * ── VEDLEGGET ER GRUNNLAGET, IKKE ET TILLEGG ──────────────────────────
   *
   * Uten denne bolken leser modellen vedlegget som bakgrunnsstoff og
   * bygger dokumentet av de tomme feltene. Rekkefølgen må sies eksplisitt:
   * vedlegget først, skjemaet som korrigering.
   */
  if (medVedlegg) {
    deler.push(
      "",
      [
        "VEDLEGGET",
        "Det er lagt ved et dokument over. DET er datagrunnlaget ditt — les det først, og bygg dokumentet av innholdet i det.",
        "Feltene under INFORMASJONEN er utfylt av produsenten i tillegg. De gjelder foran vedlegget der de sier noe annet. Er et felt tomt, henter du svaret fra vedlegget.",
        "Det som står under STANDARDVALG INGEN HAR BEKREFTET, gjelder IKKE foran vedlegget. Sier vedlegget noe annet enn et forhåndsvalg, er det vedlegget som er riktig.",
        "Står noe verken i vedlegget eller i feltene, skriver du TBD(...). Du gjetter ikke, og du henter ikke noe fra andre kilder.",
      ].join("\n"),
    );
  }

  if (mangler.length) {
    deler.push(
      "",
      `IKKE OPPGITT\nDisse feltene sto tomme. Ikke finn på innhold i dem — la dem stå som TBD(...) i dokumentet, eller utelat seksjonen hvis den blir meningsløs uten:\n${mangler.join("\n")}`,
    );
  }

  const regler = [
    ...(mal.regler ?? []),
    "Ikke finn på tall, navn, priser, kundenavn eller resultater. Står det ikke i informasjonen over, skal det stå TBD(det som mangler).",
    /*
     * PRIS OG AVTALEVILKÅR SKAL IKKE FINNES HER I DET HELE TATT.
     *
     * Først sto det bare at «abonnementsprisen skrives 30 000 kr/mnd» — en
     * formatregel. Modellen leste den som en oppfordring og skrev prisen
     * inn i en produksjonsplan for en kunde ingen hadde sagt var abonnent.
     * Så ble regelen betinget. Det var fortsatt feil premiss.
     *
     * Malverket her er produksjonsdokumenter. Pris, honorar, oppsigelse,
     * bindingstid, bruksrett og eierskap står i tjenesteavtalen, som daglig
     * leder eier og signerer. En produsent som fyller ut et skjema mellom
     * to opptak skal ikke kunne produsere noe som ser ut som en avtale —
     * og et tall som er riktig i dag, er feil den dagen avtalen endres.
     *
     * Derfor står det ingen pris i denne filen. Ikke som eksempel heller.
     */
    "Dette er et produksjonsdokument. Forretningsvilkårene mellom Reflektor og kunden — pris, honorar, timesats, betaling, fakturering, oppsigelse, bindingstid, eierskap til materiellet og kundens bruksrett — skal ALDRI stå i det. Heller ikke som eksempel, og heller ikke hvis noen har skrevet det i et felt. Alt slikt er avtalt i tjenesteavtalen.",
    "Må dokumentet likevel vise til slike vilkår for å gi mening, skriv «se tjenesteavtalen» og ikke noe mer.",
    "Skriv aldri hva slags avtale kunden har med oss — abonnent, fast kunde, prøveperiode, engangsoppdrag. Det er et avtaleforhold, og det hører ikke hjemme i et produksjonsdokument, heller ikke når det går fram av informasjonen over.",
    /*
     * ── SPRÅKET ER ET TROVERDIGHETSSPØRSMÅL ───────────────────────────────
     *
     * Dette er dokumenter om praktisk gjennomføring. De leses av en kokk
     * som skal vite når hen må være på jobb, og av en markedssjef som skal
     * vite hva hen får. Byråspråk og AI-formuleringer gjør ikke slike
     * dokumenter mer overbevisende — de gjør at leseren begynner å lure på
     * om avsenderen faktisk har gjort dette før.
     *
     * Listen under er ikke smak. Hvert punkt er et mønster som har dukket
     * opp i ekte utdata og som gjorde dokumentet dårligere.
     */
    "Dette er et arbeidsdokument om praktisk gjennomføring, ikke et salgsdokument. Ingen setning skal overbevise leseren om at Reflektor er dyktige. Den skal fortelle hva som skjer, når, og hvem som gjør det.",
    "Skriv fullstendige setninger med subjekt og verb. Ikke stikkord med tankestrek der en setning hører hjemme.",
    "Ingen engelske uttrykk der det finnes norske. Ikke «shoot», «deliverables», «setup» eller «assets».",
    "Forbudte ord og vendinger: sømløs, skreddersydd, helhetlig, i tett dialog, løfte frem, ta det til neste nivå, fange essensen, autentisk historiefortelling, kvalitetssikre, levere på, i tråd med, det handler om, vi er opptatt av.",
    "Ikke skriv trippelkonstruksjoner av typen «ikke bare X, men også Y og Z». Ikke innled med «I en verden der» eller «Når det kommer til».",
    "Ingen adjektiver på vårt eget arbeid. Ikke «grundig planlagt», ikke «profesjonell gjennomføring». Det er leseren som avgjør det, ut fra om planen holder.",
    "Konkret framfor generelt. «Kokken lager burgere mens vi filmer» er konkret. «Vi dokumenterer produksjonen» er det ikke.",
    "Tall framfor mengdeord. «Ca. 2 timer», ikke «en god stund». «Fire oppsett», ikke «flere oppsett».",
    "Ett faktum per setning i tabellceller. Cellen er ikke et avsnitt.",
  ];

  deler.push(
    "",
    `REGLER\n${regler.map((r) => `- ${r}`).join("\n")}`,
    "",
    "Skriv dokumentet ferdig. Ikke still spørsmål først, og ikke forklar hva du har gjort etterpå.",
  );

  return deler.join("\n");
}

/**
 * Instruksen for en rettelse.
 *
 * ── HVORFOR HELE DOKUMENTET SENDES INN IGJEN, OG IKKE EN SAMTALE ──────────
 *
 * Alternativet var å holde på meldingshistorikken — instruks, svar,
 * rettelse, svar — og sende hele tråden hver gang. Den vokser, den koster
 * mer for hver runde, og den gir modellen fem utgaver av samme dokument å
 * bli forvirret av.
 *
 * Her er det alltid to ting: dokumentet som står nå, og det ene som skal
 * endres. Runde ti koster det samme som runde én, og modellen ser bare den
 * utgaven som faktisk gjelder.
 *
 * Prisen er at «gjør det forrige om igjen» ikke gir mening. Det er en pris
 * verdt å betale for et dokument som ikke driver av gårde.
 */
export function byggRettelse(
  mal: Mal,
  verdier: Readonly<Record<string, string>>,
  forrige: Ark,
  rettelse: string,
  medVedlegg = false,
  research = "",
  /**
   * Alle rettelsene produsenten har gitt før denne, eldste først.
   *
   * ── HVORFOR DE MÅ FØLGE MED ───────────────────────────────────────────
   *
   * 25.09.2026 ba en produsent om voiceover per opptak i runde tre. I runde
   * fem trykket hen «Kort ned så det får plass». I runde seks var
   * voiceoveren borte, og hen måtte spørre «nå er voice over borte?».
   *
   * Årsaken var ikke at modellen var uenig. Den var at runde fem bare så
   * dokumentet og ordene «kort ned» — ingenting fortalte den at
   * voiceover-seksjonen var noe produsenten uttrykkelig hadde bedt om, og
   * ikke noe malen hadde funnet på. Da er den det billigste å kutte: den
   * er lang, og den står ikke i strukturen.
   *
   * Med hele listen til stede er en tidligere rettelse en stående
   * instruks, ikke et spor i et dokument som kan viskes ut av den neste.
   */
  tidligere: readonly string[] = [],
  /** Feltene produsenten har tatt stilling til. Se `byggInstruks`. */
  bekreftet?: readonly string[],
): string {
  const staaende = tidligere.filter((t) => t.trim());
  return [
    byggInstruks(mal, verdier, medVedlegg, research, bekreftet),
    "",
    "── DOKUMENTET SLIK DET STÅR NÅ ──",
    JSON.stringify(forrige),
    "",
    staaende.length
      ? [
          "── STÅENDE INSTRUKSER FRA PRODUSENTEN ──",
          "Dette har produsenten bedt om tidligere i arbeidet med dette dokumentet. Alt sammen gjelder fortsatt.",
          ...staaende.map((t, i) => `${i + 1}. ${t}`),
          "",
          "DISSE KAN DU IKKE FJERNE FOR Å SPARE PLASS. Du kan formulere dem kortere, slå dem sammen, eller flytte dem — men det produsenten har bedt om, skal fortsatt være der. Trenger du plass, tar du det fra det ingen har bedt om.",
          "Kolliderer en ny rettelse med en stående instruks, gjelder den nye. Si i beskjeden at den erstattet den gamle, så produsenten vet det.",
          "Får du det umulig til å få plass til alt, tar du bort det minst viktige og SIER i beskjeden nøyaktig hva du tok bort og hvorfor. Aldri i stillhet.",
          "",
        ].join("\n")
      : "",
    "── ENDRINGEN SOM SKAL GJØRES ──",
    rettelse,
    "",
    "Gjør NØYAKTIG denne endringen, og ikke noe mer. Alt annet i dokumentet skal stå ordrett som det gjør nå — samme formuleringer, samme rekkefølge, samme rader. Lever hele dokumentet på nytt, også de delene du ikke rørte.",
    "Er endringen umulig uten å finne på noe som ikke står i informasjonen, skriv TBD(...) i stedet for å gjette.",
    /*
     * ── ET AVVIK ER ET AVVIK, IKKE EN NY RUTINE ───────────────────────────
     *
     * En produsent som ber om noe utenfor malen, har som regel en god grunn
     * akkurat denne gangen. Faren er at rettelsen drar dokumentet ut av
     * formen: én ekstra seksjon her, en annen rekkefølge der, og etter ti
     * kunder finnes det ti forskjellige produksjonsplaner.
     *
     * Malen er ikke bare et oppsett. Den er beslutninger som er tatt én
     * gang — 8–10 leveranser, tre til fem oppsett, rene klipp til skjerm.
     * De skal ikke kunne forhandles bort i en tekstboks.
     */
    "DETTE ER EN RETTELSE, IKKE EN NY MAL. Dokumentet beholder delene sine, rekkefølgen på dem, og standarden malen setter. Ber rettelsen om noe utenfor malen, gjør du det for dette ene dokumentet — men du endrer ikke oppsettet, du fjerner ikke en del, og du bryter ingen av reglene over.",
    "Kan rettelsen ikke gjøres uten å bryte en av reglene, gjør du så mye av den som lar seg gjøre, og sier i beskjeden til produsenten hva du ikke kunne gjøre og hvorfor. Ikke gjør det i stillhet.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Verdiene «Fyll inn eksempel» setter.
 *
 * ── HVORFOR KNAPPEN FINNES ────────────────────────────────────────────────
 *
 * Et skjema med sytten felt forteller deg hva feltene heter. Det forteller
 * deg ikke hvor mye som hører hjemme i hvert, og det er der nye produsenter
 * bommer: «Hvem vi trenger fra kunden» besvares med «kokken» i stedet for
 * «kokk, ca. 2 timer fra 08:30». Et utfylt eksempel viser mengden på ett
 * blikk, og det gjør det mulig å se hva malen faktisk gjør før man bruker
 * den på en ekte kunde.
 *
 * ── DATOER REGNES UT, DE STÅR IKKE ────────────────────────────────────────
 *
 * En fast dato i et eksempel er feil dato fra og med dagen etter. Hvert
 * datofelt sier i stedet hvor mange dager fram eksempelet ligger, så en
 * befaring er om to dager og produksjonsdagen tre uker fram — uansett når
 * noen trykker.
 */
export function eksempelverdier(mal: Mal): Record<string, string> {
  const ut: Record<string, string> = {};
  for (const f of mal.felt) {
    /*
     * GRUNNLAGSFELTENE FYLLES IKKE UT AV EKSEMPELET.
     *
     * De er oppslagsnøkler, ikke innhold. Et påfunnet brukernavn gir et
     * ekte oppslag mot en konto som ikke finnes, og produsenten får «Ikke
     * hentet: @konkurrent» i grunnlagspanelet uten å ha bedt om noe. Et
     * eksempel skal vise hvor mye som hører hjemme i et felt — her ville
     * det vist en feil.
     */
    if (f.grunnlag) continue;
    if (f.type === "dato") {
      const dag = new Date();
      dag.setUTCHours(12, 0, 0, 0);
      dag.setUTCDate(dag.getUTCDate() + (f.eksempelDager ?? 14));
      ut[f.id] = dag.toISOString().slice(0, 10);
      continue;
    }
    const v = f.eksempel ?? f.plassholder ?? f.standard;
    if (v) ut[f.id] = v;
  }
  return ut;
}
