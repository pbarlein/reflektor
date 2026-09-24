import type { Mal } from "./maltype.ts";

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
export const MALER: readonly Mal[] = [
  {
    slug: "produksjonsplan",
    fase: "Før opptak",
    navn: "Produksjonsplan",
    kort: "Ensideren kunden får før produksjonsdagen. Tidsplan, hva vi trenger fra dem, og hva som leveres.",
    ansvarlig: "Produsent",
    naar: "Etter oppstartsmøtet, senest en uke før produksjonsdagen",
    skisse: ["topp", "fakta", "tabellOgBoks", "toKolonner", "kort3"],
    rubrikker: ["produksjonsdag-som-gir-8-10", "bransjen-bestemmer-alt"],
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
        etikett: "Kundeforhold",
        type: "valg",
        valg: ["Fast kunde på abonnement", "Prøveperiode", "Engangsoppdrag"],
        standard: "Fast kunde på abonnement",
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
        etikett: "Stillbilder i tillegg til video?",
        type: "valg",
        hjelp:
          "Stills deler kapasitet med video. Sier du ja, blir det færre videoer.",
        valg: ["Nei, bare video", "Ja, stills i tillegg"],
        standard: "Nei, bare video",
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
        etikett: "Logo på materiellet?",
        type: "valg",
        valg: ["Uten logo", "Med logo", "Avklares"],
        standard: "Uten logo",
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
    ],
    oppdrag:
      "En produksjonsplan på ÉN side som sendes til kunden før produksjonsdagen. Den skal kunne leses på en telefon i en trapp, og den skal gjøre det unødvendig for kunden å stille oppfølgingsspørsmål.",
    struktur: [
      "Topptekst: «REFLEKTOR × [KUNDE] [LOKASJON]», så overskriften «Produksjonsplan», så én linje som sier hvilken dag, hvor, og når materiellet publiseres.",
      "Faktarad med fire felt: Sted, Dato, Kontakt på stedet, Fra Reflektor.",
      "«Tidsplan for dagen» som en tabell med kolonnene Blokk, Hva vi filmer, Hvem. Bruk blokker som «Før åpning», «Kjøkkenet», «Ved åpning», «Formiddag», «Lunsjrush», «Pause», «Etter lunsj», «Ettermiddag» — tilpasset denne kunden. Siste blokk skal alltid være en åpen blokk: «Vi filmer det som dukker opp».",
      "«Hva vi trenger fra [lokasjon]»: én linje per rolle med tidsbruk, hva personen gjør, og til slutt en kort avsnitt om tilgang, samtykke og eventuelle forbud.",
      "«Leveranse»: først formatlinjen, så to kolonner — «Til sosiale medier · med lyd og tale» og, hvis skjermer er en bruksflate, «Til menyskjermer og innkastere · uten lyd og tekst». Nummerer leveransene fortløpende gjennom begge kolonnene. Merk hver med VIDEO, STILLS eller ÅPEN.",
      "Én linje om uttrykk under leveransene.",
      "«Rytmen videre» som tre korte kort, én per måned — bare hvis det er oppgitt.",
      "Bunntekst: én linje om rettigheter, og kontaktinfo til den som sender planen.",
    ],
    regler: [
      "Antall leveranser skal lande på 8–10 til sammen. Det er produksjonsmålet for en dag, og planen skal ikke love mer enn dagen kan holde.",
      "Grupper tidsplanen i tre til fem OPPSETT — steder eller lyssituasjoner — ikke i én blokk per video. Flere enn fem oppsett betyr at dagen er for spredt.",
      "Skal materiellet på skjermer i lokalet, må de klippene skytes rene fra start. Skriv det eksplisitt: det er ikke nok å fjerne lyden etterpå.",
      "Er det oppgitt noe som IKKE skal med, skal det stå i planen som en tydelig setning — ikke bare utelates.",
    ],
  },

  {
    slug: "opptaksliste",
    fase: "På opptak",
    navn: "Opptaksliste",
    kort: "Listen den som filmer har i hånda på dagen. Ett opptak per linje, sortert etter oppsett.",
    ansvarlig: "Produsent",
    naar: "Kvelden før opptaksdagen",
    skisse: ["topp", "fakta", "tabell", "liste"],
    rubrikker: [
      "produksjonsdag-som-gir-8-10",
      "lyd-kan-ikke-reddes",
      "de-forste-tre-sekundene",
    ],
    felt: [
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
      {
        id: "lokasjon",
        etikett: "Lokasjon",
        type: "tekst",
        plassholder: "Jordbærpikene Storo",
        paakrevd: true,
      },
      { id: "dato", etikett: "Opptaksdag", type: "dato" },
      {
        id: "oppsett",
        etikett: "Oppsettene",
        type: "lang",
        hjelp:
          "Ett per linje, i den rekkefølgen vi rigger dem. «1 Kjøkkenbenk · 2 Disken · 3 Gulvet i lokalet».",
        paakrevd: true,
      },
      {
        id: "leveranser",
        etikett: "Hva som skal leveres",
        type: "lang",
        hjelp:
          "De 8–10 leveransene fra produksjonsplanen. Listen bygges bakover fra dem.",
        paakrevd: true,
      },
      {
        id: "tale",
        etikett: "Er det tale på dagen",
        type: "valg",
        hjelp: "Avgjør om mikrofon og stille lokale må inn i planen.",
        valg: [
          "Nei, bare romlyd",
          "Ja, noen filmes mens de snakker",
          "Både og",
        ],
        standard: "Nei, bare romlyd",
      },
      {
        id: "spesielt",
        etikett: "Noe som gjelder spesielt",
        type: "lang",
        hjelp:
          "Et opptak som må tas før lokalet åpner, en detalj kunden har bedt om, noe som bare kan filmes én gang.",
      },
    ],
    oppdrag:
      "En intern opptaksliste. Testen er om en kollega som ikke var med i planleggingen kan filme dagen med listen i hånda. Den er et arbeidsdokument, ikke et dokument kunden ser.",
    struktur: [
      "Kunde, lokasjon og opptaksdag øverst, på én linje.",
      "Én tabell med alle opptakene, sortert etter oppsettnummer. Kolonnene er: nr, oppsett, bildeutsnitt, kamera i ro eller bevegelse, hvem eller hva er i bildet, lyd, lengde i sekunder.",
      "En kort liste nederst over det som må filmes før lokalet åpner, hvis noe må det.",
      "En siste linje om hva som kan droppes hvis dagen blir kort.",
    ],
    regler: [
      "Hvert opptak skal ha alle seks feltene: oppsett, bildeutsnitt, kamerabevegelse, motiv, lyd og lengde. Mangler ett, er listen ikke ferdig.",
      "Bildeutsnitt skrives med ett av fire ord: totalt, halvnært, nært, detalj. Ikke «fint utsnitt av maten».",
      "Lengde skrives i sekunder. «Kort» og «litt» er ikke lengder.",
      "Sorter etter oppsett, ikke etter historien. Den som filmer flytter rigg, ikke fortelling.",
      "Legg til en avkryssingskolonne helt til venstre. Listen skal krysses av underveis, ikke leses ferdig etterpå.",
      "Skal noe skytes rent til skjermer i lokalet — uten tale og uten tekst — skal de opptakene være merket i selve tabellen. Den som filmer leser linjen, ikke innledningen.",
      "Ikke skriv klippebeskrivelser eller musikkforslag. Det hører hjemme i redigeringen.",
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
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
      {
        id: "lokasjon",
        etikett: "Sted og dato for opptaket",
        type: "tekst",
        plassholder: "Jordbærpikene Storo, 24. september 2026",
        paakrevd: true,
      },
      {
        id: "hvem",
        etikett: "Hvem skal signere",
        type: "valg",
        hjelp: "Ansatte hos kunden og gjester i lokalet har ulike behov.",
        valg: [
          "Ansatt hos kunden",
          "Gjest eller kunde i lokalet",
          "Innleid medvirkende",
          "Mindreårig (under 18)",
        ],
        standard: "Ansatt hos kunden",
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
        standard: "Instagram",
        paakrevd: true,
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
      },
    ],
    oppdrag:
      "Et samtykkeskjema på norsk som den som filmes leser og signerer før opptaket. Det skal være kort nok til at folk faktisk leser det — én side, og helst under halvparten av den.",
    struktur: [
      "Overskrift og én linje om hva opptaket er og hvem som gjør det.",
      "Hva samtykket gjelder: hvilke opptak, hvor de publiseres, og hvor lenge.",
      "En kort punktliste med det personen har rett til: å si nei uten å oppgi grunn, å trekke samtykket tilbake, og hvem hen kontakter for å gjøre det.",
      "Signaturfelt: navn med blokkbokstaver, signatur, dato. For mindreårige også foresatt.",
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
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
      { id: "dato", etikett: "Opptaksdagen det gjelder", type: "dato" },
      {
        id: "hvor",
        etikett: "Hvor filene ligger",
        type: "tekst",
        hjelp: "Mappenavnet kunden får, ikke en beskrivelse av det.",
        paakrevd: true,
      },
      {
        id: "leveranser",
        etikett: "Hva som leveres",
        type: "lang",
        hjelp:
          "Ett per linje. Filnavn først, så én setning om hva klippet er. «02-burger-grill.mp4 — burgeren fra rå til ferdig, 18 sek».",
        paakrevd: true,
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
        paakrevd: true,
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
      },
    ],
    oppdrag:
      "En oversikt som følger materiellet når det overleveres. Den skal kunne leses på et halvt minutt og svare på: hva fikk vi, hvor ligger det, og mangler noe.",
    struktur: [
      "Kunde, opptaksdag og hvor filene ligger, øverst.",
      "Én tabell over leveransene: filnavn, hva klippet er, format, lengde, teksting.",
      "En kort bolk om hva som er skutt rent uten lyd og tekst, hvis noe er det, og hvorfor de filene ser annerledes ut.",
      "«Det som ikke er med» til slutt, med hva som skjer med det.",
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
    skisse: ["topp", "fakta", "liste", "avsnitt"],
    rubrikker: ["lyd-kan-ikke-reddes", "produksjonsdag-som-gir-8-10"],
    felt: [
      {
        id: "kunde",
        etikett: "Kunde og lokasjon",
        type: "tekst",
        paakrevd: true,
      },
      {
        id: "dato",
        etikett: "Dato for befaringen",
        type: "dato",
        paakrevd: true,
      },
      {
        id: "produksjonsdag",
        etikett: "Planlagt produksjonsdag",
        type: "dato",
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
      },
      {
        id: "folk",
        etikett: "Folk og tilgang",
        type: "lang",
        hjelp: "Hvem er på jobb den dagen, hvem har nøkkel, når åpner de.",
      },
      {
        id: "problemer",
        etikett: "Det som kan velte dagen",
        type: "lang",
        hjelp: "Alt du så som kan gå galt. Skriv det stygt heller enn pent.",
      },
    ],
    oppdrag:
      "Et internt befaringsnotat. Det leses av produsenten som planlegger dagen, og av den som står der hvis det ikke er samme person. Det skal være stikkordsmessig og fullstendig, ikke velskrevet.",
    struktur: [
      "Kunde, lokasjon, befaringsdato og planlagt produksjonsdag øverst.",
      "Lys — med klokkeslett der det er relevant.",
      "Lyd — hva som bråker, hva som kan slås av, og hvem som kan slå det av.",
      "Oppsettene, nummerert, med hva som er i bildet fra hvert.",
      "Strøm, plass og tilgang.",
      "«Det som kan velte dagen» til slutt, som en liste.",
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
    skisse: ["topp", "avsnitt", "liste", "fakta"],
    rubrikker: ["forberedt-til-kundemote", "proaktiv-kundekontakt"],
    felt: [
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
      {
        id: "deltakere",
        etikett: "Hvem var med",
        type: "tekst",
        plassholder: "Christian Heger (markedssjef), Pål og Henrik fra oss",
      },
      { id: "dato", etikett: "Møtedato", type: "dato", paakrevd: true },
      {
        id: "bestemt",
        etikett: "Hva som ble bestemt",
        type: "lang",
        hjelp:
          "Bare det som faktisk ble avgjort. Det som ble diskutert uten konklusjon hører ikke hjemme her.",
        paakrevd: true,
      },
      {
        id: "voresOppgaver",
        etikett: "Hva vi skal gjøre",
        type: "lang",
        hjelp: "Én linje per oppgave. Skriv hvem hos oss som eier den.",
        paakrevd: true,
      },
      {
        id: "deresOppgaver",
        etikett: "Hva kunden skal gjøre",
        type: "lang",
        hjelp: "Vær konkret på hvem og når. Dette er det som pleier å glippe.",
      },
      {
        id: "leveringsdato",
        etikett: "Leveringsdato",
        type: "dato",
        hjelp:
          "Én dato, valgt ut fra vår kapasitet. Ikke et tidsrom, og ikke kundens forslag.",
        paakrevd: true,
      },
      {
        id: "uavklart",
        etikett: "Det som fortsatt er uavklart",
        type: "lang",
        hjelp: "Og hvem som skal avklare det, innen når.",
      },
    ],
    oppdrag:
      "En kort e-post til kunden etter et møte. Den skal kunne leses på tjue sekunder og etterlate null tvil om hva som skjer videre.",
    struktur: [
      "Én takkelinje. Kort.",
      "Hva som ble bestemt, som en punktliste.",
      "Hva vi gjør — med navn på hvem hos oss.",
      "Hva dere gjør — med navn og frist.",
      "Leveringsdatoen, som en egen, tydelig linje.",
      "Eventuelt uavklarte punkter til slutt, med hvem som avklarer.",
    ],
    regler: [
      "Leveringsdatoen skal stå som en OPPLYSNING, ikke som et spørsmål. «Dere har materialet torsdag 9. oktober» — ikke «passer det at vi leverer rundt den 9.?».",
      "Én dato. Ikke «i løpet av uke 41», ikke «rundt månedsskiftet».",
      "Ikke gjenta hele møtet. Alt som ikke er en beslutning eller en oppgave, skal ut.",
    ],
  },

  {
    slug: "manedsrapport",
    fase: "Etter opptak",
    navn: "Månedsrapport til kunde",
    kort: "Hva vi ser i tallene, hva vi tror det betyr, og hva vi gjør med det neste måned.",
    ansvarlig: "Kundeansvarlig",
    naar: "Første uke i måneden, for måneden som gikk",
    skisse: ["topp", "fakta", "tabell", "avsnitt"],
    rubrikker: ["hva-tallene-betyr", "rytmen-to-i-uka"],
    felt: [
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
      {
        id: "maaned",
        etikett: "Hvilken måned",
        type: "tekst",
        plassholder: "September 2026",
        paakrevd: true,
      },
      {
        id: "publisert",
        etikett: "Hva som ble publisert",
        type: "lang",
        hjelp: "Antall poster, og kort hva de handlet om.",
        paakrevd: true,
      },
      {
        id: "tall",
        etikett: "Tallene",
        type: "lang",
        hjelp:
          "Lim inn det du har fra Instagram. Fullføring, lagringer, delinger og profilbesøk er mer verdt enn visninger.",
        paakrevd: true,
      },
      {
        id: "monster",
        etikett: "Mønsteret du ser",
        type: "lang",
        hjelp:
          "Hvilken TYPE innhold gjør det gjentatte ganger bedre enn snittet på kontoen? Én post er ikke et mønster.",
        paakrevd: true,
      },
      {
        id: "neste",
        etikett: "Hva vi gjør neste måned",
        type: "lang",
        hjelp: "Konkret konsekvens av mønsteret over.",
        paakrevd: true,
      },
    ],
    oppdrag:
      "En kort månedsrapport til kunden. Tre ting: hva vi ser, hva vi tror det betyr, og hva vi gjør med det. Ikke en tallrapport.",
    struktur: [
      "Én linje om hva som ble publisert i måneden.",
      "Tallene, som en liten tabell. Bare de tallene som sier noe.",
      "«Dette ser vi» — mønsteret, i to til tre setninger.",
      "«Dette gjør vi neste måned» — konkret.",
    ],
    regler: [
      "Visninger alene skal ikke stå som en prestasjon. Står det et visningstall, skal forholdet mellom visninger og respons stå ved siden av.",
      "Aldri lov et tall for neste måned. Vi har ingen kontroll over rekkevidde, og et løfte du ikke kan holde er det dyreste du kan si.",
      "Sammenlign kontoen med seg selv, aldri med en annen konto.",
      "Er datagrunnlaget under ti poster, skriv det. Én post er ikke et mønster.",
    ],
  },

  {
    slug: "publiseringsplan",
    fase: "Etter opptak",
    navn: "Publiseringsplan for en måned",
    kort: "Måneden fordelt på faste dager, med det tidsavhengige låst først.",
    ansvarlig: "Kundeansvarlig",
    naar: "Når materialet fra produksjonsdagen er redigert",
    skisse: ["topp", "fakta", "tabell"],
    rubrikker: ["rytmen-to-i-uka"],
    felt: [
      { id: "kunde", etikett: "Kunde", type: "tekst", paakrevd: true },
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
      },
      {
        id: "tidsavhengig",
        etikett: "Det som må ut på en bestemt dato",
        type: "lang",
        hjelp:
          "Kampanjer, sesong, åpninger. Dette låses først, resten flyttes rundt det.",
      },
      {
        id: "kanaler",
        etikett: "Kanaler",
        type: "tekst",
        standard: "Instagram, med krysspublisering til Facebook",
      },
    ],
    oppdrag:
      "En publiseringsplan for én måned, som en enkel tabell. Den brukes internt og kan sendes til kunden uten omskriving.",
    struktur: [
      "Kunde, måned og hvilke faste ukedager som gjelder.",
      "Tabell med kolonnene Dato, Ukedag, Hva som publiseres, Kanal.",
      "En kort linje til slutt om hvor mye forsprang køen har.",
    ],
    regler: [
      "To poster i uken. 2 × 52 = 104 i året, altså 8,7 i måneden — det er derfor produksjonsmålet er 8–10.",
      "Én video er én post. De går til Instagram og krysspubliseres til Facebook — ikke to på hver.",
      "Lås det tidsavhengige først. Resten fordeles rundt det, og det er den delen som redder rytmen når noe glipper.",
    ],
  },

] as const;

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

export function byggInstruks(
  mal: Mal,
  verdier: Readonly<Record<string, string>>,
): string {
  const utfylt = mal.felt
    .map((f) => [f, (verdier[f.id] ?? "").trim()] as const)
    .filter(([, v]) => v.length > 0)
    .map(([f, v]) => `- ${f.etikett}: ${f.type === "dato" ? norskDato(v) : v}`);

  const mangler = mal.felt
    .filter((f) => !(verdier[f.id] ?? "").trim())
    .map((f) => `- ${f.etikett}`);

  const deler = [
    "Du skriver et dokument for Reflektor AS, et norsk byrå som leverer foto og video til sosiale medier på månedlig abonnement. Alt skal være på norsk.",
    "",
    `OPPGAVEN\n${mal.oppdrag}`,
    "",
    `SLIK SKAL DOKUMENTET BYGGES\n${mal.struktur.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    "",
    `INFORMASJONEN\n${utfylt.length ? utfylt.join("\n") : "- (ingenting utfylt)"}`,
  ];

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
    "Ikke omtal en kunde som abonnent, fast kunde eller engangskunde med mindre det står i informasjonen over.",
    "Skriv fullstendige setninger. Ingen engelske uttrykk der det finnes norske.",
    "Konkret framfor generelt. «Kokken lager burgere mens vi filmer» er konkret. «Vi dokumenterer produksjonen» er det ikke.",
  ];

  deler.push(
    "",
    `REGLER\n${regler.map((r) => `- ${r}`).join("\n")}`,
    "",
    "Skriv dokumentet ferdig. Ikke still spørsmål først, og ikke forklar hva du har gjort etterpå.",
  );

  return deler.join("\n");
}
