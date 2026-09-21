import type { Rubrikk } from "@/content/rubrikktype";

/** Intern nyhet — hvordan vi jobber, hva vi selger, hva vi er enige om. */
export const INTERNT: readonly Rubrikk[] = [
  /* ══════════════════════════════════════════════════════════════════════
     INTERNT — de tre eneste godkjente, fordi de er hentet og ikke skrevet
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: "malet",
    tittel: "Målet: at kunder blir, og at de kommer tilbake",
    sammendrag:
      "De to målene alle i Reflektor jobber mot, og den ene måten vi kommer dit på. Alt annet i denne huben er midler til dette.",
    kategori: "internt",
    medie: {
      type: "video",
      fil: "reels/produksjonsdag",
      alt: "Kamera rigget på stativ i en døråpning under en produksjonsdag",
    },
    oppdatert: "2026-09-21",
    lesetid: 1,
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde: "Påls egne ord, gjengitt ordrett. Ikke omskrevet.",
    prioritet: 100,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Alle ansatte i Reflektor har de samme to målene. De er verdt å kunne utenat, fordi de avgjør hvilken av to mulige handlinger som er riktig, omtrent hver dag.",
      },
      {
        type: "punkter",
        punkter: [
          "At faste kunder aldri sier opp",
          "At engangskunder kommer tilbake til oss",
        ],
      },
      {
        type: "avsnitt",
        tekst: "Hvordan?",
      },
      {
        type: "sitat",
        tekst:
          "Ved å alltid være proaktiv, godt forberedt og entusiastisk.",
        kilde: "Pål",
      },
      {
        type: "avsnitt",
        tekst:
          "Legg merke til at ingen av de tre handler om utstyr, teknikk eller talent. De handler om hvordan kunden opplever å jobbe med oss — før, under og etter produksjonsdagen. Det er den opplevelsen som avgjør om noen sier opp, og den er innenfor alles kontroll.",
      },
      {
        type: "merknad",
        tekst:
          "Står du fast i et valg og ingen rutine dekker det: spør hvilket alternativ som gjør det mest sannsynlig at kunden blir. Det svaret er nesten alltid riktig.",
      },
    ],
  },
  {
    slug: "hva-abonnementet-inneholder",
    tittel: "Hva abonnementet inneholder — og hva det ikke gjør",
    sammendrag:
      "Leveransen, prisen og vilkårene ordrett slik de står på nettsiden. Kunn dette før du snakker med en kunde om omfang.",
    kategori: "internt",
    medie: {
      type: "bilde",
      fil: "arbeid/pa-vei",
      alt: "Person med bagasje på vei gjennom en parkeringskjeller",
    },
    oppdatert: "2026-09-21",
    lesetid: 2,
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde:
      "Hentet fra src/content/site.ts i hovedprosjektet (objektet `tilbud`). Samme kilde som forsiden rendrer fra.",
    prioritet: 98,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Prisen er 30 000 kr/mnd. Én pris, alt inkludert, ingen binding. Vi har ingen timepriser, ingen etterfakturering og ingen tillegg for ekstra runder. Oppsigelsestiden er tre måneder; bindingstid utover den finnes ikke.",
      },
      {
        type: "punkter",
        punkter: [
          "Produksjon av SoMe-strategi og produksjonsplaner",
          "Én produksjonsdag per måned hos dere, hos oss eller ute på lokasjon",
          "Produksjonsmål: 8–10 videoer ferdig redigert per måned",
          "Publisering til Instagram 2 ganger per uke med krysspublisering til Facebook",
          "Teksting og fargekorrigering",
          "Fri bruk av alt innhold – annonser, nettsider, skjermer, presentasjoner",
        ],
      },
      {
        type: "merknad",
        tekst:
          "To publiseringer i uken betyr TO, ikke to på hver kanal. De går til Instagram og krysspubliseres til Facebook. 2 × 52 = 104 i året, altså 8,7 i måneden — som er derfor produksjonsmålet er 8–10.",
      },
      {
        type: "avsnitt",
        tekst:
          "Stillbilder leveres ved behov, ikke som fast leveranse: si fra i planleggingen, så dekkes det på samme produksjonsdag. Kapasiteten deles med video, og det er derfor 8–10 er et produksjonsmål og ikke en garanti.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dette inngår ikke: håndtering av kommentarfelt og meldinger, stories, og betalt annonsering med annonsebudsjetter.",
      },
      {
        type: "merknad",
        tekst:
          "Vi sier hva som IKKE inngår, tydelig og tidlig, fordi «SoMe-byrå» betyr ulike ting hos ulike leverandører. Ærligheten er salgsargumentet — ikke et forbehold vi helst skulle vært foruten.",
      },
    ],
  },
  {
    slug: "prisen-sier-vi-hoyt",
    tittel: "Prisen sier vi høyt",
    sammendrag:
      "Pristransparens er den ene posisjoneringen Reflektor faktisk eier. Slik skrives prisen, og hvorfor vi aldri er vage om den.",
    kategori: "internt",
    medie: {
      type: "bilde",
      fil: "arbeid/kontor",
      alt: "Nærbilde av en person i strikkegenser, filmet i dempet lys",
    },
    oppdatert: "2026-09-21",
    lesetid: 1,
    godkjent: true,
    ansvarlig: "Daglig leder",
    kilde:
      "Hentet fra AGENTS.md kapittel 0.3 og src/content/site.ts i hovedprosjektet.",
    prioritet: 80,
    innhold: [
      {
        type: "avsnitt",
        tekst:
          "Prisen skrives «30 000 kr/mnd». Aldri med mva-notasjon, aldri som «fra», aldri som «ta kontakt for pris». Den står åpent på nettsiden, og det er et bevisst posisjoneringsvalg: bransjen er full av byråer som ikke oppgir pris, og det er nettopp derfor vi gjør det.",
      },
      {
        type: "punkter",
        punkter: [
          "Ekstra produksjonsdag — reklamefilm, produktfoto og lignende — er 30 000 kr.",
          "Strategiforslag leveres innen tre virkedager.",
          "Tre måneders oppsigelse, ingen bindingstid. Begge deler sies eksplisitt.",
        ],
      },
      {
        type: "merknad",
        tekst:
          "Blir du usikker på et tall i et kundemøte: si at du sjekker og kommer tilbake samme dag. Et omtrentlig tall som viser seg å være feil, koster mer enn en times venting.",
      },
    ],
  },
  {
    slug: "proaktiv-kundekontakt",
    tittel: "Proaktiv kundekontakt mellom produksjonsdagene",
    sammendrag:
      "Utkast: kunder sier ikke opp fordi innholdet er dårlig. De sier opp fordi det ble stille. Forslag til kontaktrytme mellom dagene.",
    kategori: "internt",
    medie: {
      type: "bilde",
      fil: "arbeid/portrett-vegg",
      alt: "Portrett av en person utendørs i dagslys",
    },
    oppdatert: "2026-09-21",
    lesetid: 3,
    godkjent: false,
    ansvarlig: "Kundeansvarlig",
    prioritet: 76,
    innhold: [
      {
        type: "merknad",
        tekst:
          "«Proaktiv» er det første av de tre ordene i målet vårt. Dette utkastet forsøker å gjøre det til noe konkret, men rytmen under er et forslag — ikke noe Reflektor har bestemt.",
      },
      {
        type: "avsnitt",
        tekst:
          "En kunde på abonnement ser oss én dag i måneden. De resterende tjuetre virkedagene er det opp til oss om vi finnes. Blir vi tause mellom dagene, er det ikke kvaliteten på videoene som vurderes når fakturaen kommer — det er om det føltes som om noe skjedde.",
      },
      {
        type: "steg",
        steg: [
          {
            tittel: "Dagen etter produksjonsdagen",
            tekst:
              "Kort melding med ett bilde eller ett klipp fra dagen. Ikke en statusrapport — et tegn på at materialet er i hus og at noen jobber med det.",
          },
          {
            tittel: "Når første video er publisert",
            tekst:
              "Si fra at den er ute, og hvor. Kunden skal aldri oppdage sin egen publisering ved en tilfeldighet.",
          },
          {
            tittel: "Midt mellom to produksjonsdager",
            tekst:
              "Ett konkret forslag til neste dag, basert på noe du faktisk har sett — en rett de har lansert, en sesong som kommer, et lokale som er pusset opp. Et forslag er proaktivt. «Har dere noen ønsker?» er det motsatte.",
          },
          {
            tittel: "Uken før neste produksjonsdag",
            tekst:
              "Bekreft tid, sted og hvem som stiller. Dette er også siste frist for å få inn behov for stillbilder, siden de deler kapasitet med video.",
          },
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Det som gjør kontakten proaktiv, er ikke hyppigheten. Det er retningen: vi kommer med noe, i stedet for å svare på noe. Fire meldinger der alle fire spør kunden om noe, er reaktiv kontakt i fire porsjoner.",
      },
      {
        type: "merknad",
        tekst:
          "Å kvalitetssikre: er dette riktig rytme, og hvem eier kontakten mellom dagene — produsent eller kundeansvarlig?",
      },
    ],
  },
];