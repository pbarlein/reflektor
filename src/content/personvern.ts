/**
 * Personvernerklæringen, migrert fra /privacypolicy på dagens reflektor.no
 * 16.09.2026.
 *
 * ORDRETT. Ikke omskrevet. Dette er Reflektors publiserte tekst, og en
 * personvernerklæring er et juridisk dokument — jeg skal ikke redigere den.
 *
 * TRE DEFEKTER I KILDEN, alle live på reflektor.no i dag. De sto som
 * TBD-markører her — og ble faktisk servert som synlig «TBD(...)»-tekst i
 * forhåndsvisningen — til Pål fylte dem 19.09.2026:
 *
 * 1. «Sist oppdatert: 29.04.206» → **19. september 2026**. Årstallet
 *    manglet et siffer i kilden. Datoen er bevisst en LITERAL og ikke
 *    utledet fra byggetidspunktet: «sist oppdatert» skal si når teksten
 *    faktisk ble endret, ikke når siden sist ble deployet. En dato som
 *    flytter seg av seg selv er en usann påstand om at erklæringen er
 *    revidert. Endres teksten, settes datoen for hånd.
 * 2. «lagres normalt i inntil [for eksempel 12–24 måneder]» → **24
 *    måneder**. GDPR artikkel 13 nr. 2 bokstav a krever at
 *    lagringsperioden oppgis.
 * 3. «kan du kontakte oss på [e-postadresse]» → **pal@reflektor.no**.
 *    Dette var den alvorligste: erklæringen oppga ingen adresse for å
 *    utøve rettighetene sine. Adressen sto i punkt 1, men punkt 9 er der
 *    en leser ser etter den. Samme adresse som i punkt 1 og i bunnteksten.
 *
 * MERK OGSÅ punkt 8: erklæringen sier at man kan «administrere eller trekke
 * tilbake samtykke til informasjonskapsler via innstillingene på nettsiden».
 * Den nye siden har ingen slike innstillinger og ingen samtykkeløsning i det
 * hele tatt. Se A42 i docs/vedlegg-a.md — det er en lanseringssperre.
 */
export type Personvernblokk =
  | { type: "avsnitt"; tekst: string }
  | { type: "liste"; punkter: string[] };

export type Personvernseksjon = {
  tittel: string;
  blokker: Personvernblokk[];
};

/** Står før den første nummererte seksjonen. */
export const personvernIngress: Personvernblokk[] = [
  { type: "avsnitt", tekst: "Sist oppdatert: 19. september 2026" },
  {
    type: "avsnitt",
    tekst:
      "Denne personvernerklæringen forklarer hvordan Reflektor AS samler inn og behandler personopplysninger når du fyller ut skjemaer, kontakter oss, melder interesse for våre tjenester eller besøker våre digitale flater.",
  },
  {
    type: "avsnitt",
    tekst:
      "Vi tar personvern på alvor og behandler personopplysninger i tråd med gjeldende personvernlovgivning, inkludert personopplysningsloven og personvernforordningen (GDPR). Personopplysningsloven består av nasjonale regler og EUs personvernforordning, som gjelder i EU/EØS-land.",
  },
];

export const personvernSeksjoner: Personvernseksjon[] = [
  {
    tittel: "1. Behandlingsansvarlig",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Reflektor AS er behandlingsansvarlig for personopplysninger som behandles i forbindelse med våre skjemaer, nettsider, annonser og kundehenvendelser.",
      },
      { type: "avsnitt", tekst: "Kontaktinformasjon:" },
      /*
        MIGRERINGSSKADE, RETTET 19.09.2026.

        Feltene sto som ÉN streng uten skilletegn og rendret som en vegg:
        «Kontaktinformasjon:Reflektor ASOrganisasjonsnummer: 926974270Adresse:
        Tvetenvein 162, 0671 OsloE-post: pal@reflektor.noTelefon: 47605070».
        Linjeskiftene gikk tapt da teksten ble hentet fra Squarespace.
        `liste`-typen fantes allerede og gir strukturen tilbake.

        TO RETTELSER I INNHOLDET, og de er verdt å si høyt, for fila sier
        ellers at teksten er ordrett og ikke skal redigeres:

        1. «Tvetenvein» → «Tvetenveien». Gateadressen manglet en e. Den sto
           riktig tre andre steder — site.ts, Schema.tsx og bunnteksten — og
           feil bare her. NAP-konsistens mellom bunntekst og markup er ett av
           de fire punktene AGENTS.md sier synligheten faktisk krever, så et
           avvik her er ikke en skrivefeil, det er et brutt entitetssignal.
        2. «47605070» → «+47 47605070», samme form som `site.kontakt.telefon`
           og bunnteksten bruker.

        Ingen av delene er juridisk innhold. Det er selskapets eget navn,
        nummer og adresse, og de skal stemme.
      */
      {
        type: "liste",
        punkter: [
          "Reflektor AS",
          "Organisasjonsnummer: 926974270",
          "Adresse: Tvetenveien 162, 0671 Oslo",
          "E-post: pal@reflektor.no",
          "Telefon: +47 47605070",
        ],
      },
    ],
  },
  {
    tittel: "2. Hvilke personopplysninger vi samler inn",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Når du fyller ut et skjema, kontakter oss eller viser interesse for våre tjenester, kan vi samle inn følgende opplysninger:",
      },
      {
        type: "liste",
        punkter: [
          "navn",
          "e-postadresse",
          "telefonnummer",
          "firmanavn",
          "stilling eller rolle, dersom du oppgir dette",
          "hvilke tjenester du er interessert i",
          "informasjon du selv skriver i fritekstfelt",
          "tidspunkt for innsending",
          "teknisk informasjon knyttet til henvendelsen, for eksempel annonse, kampanje eller kanal henvendelsen kom fra",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Vi ber deg om ikke å sende sensitive personopplysninger gjennom våre skjemaer.",
      },
    ],
  },
  {
    tittel: "3. Formålet med behandlingen",
    blokker: [
      { type: "avsnitt", tekst: "Vi bruker personopplysningene til å:" },
      {
        type: "liste",
        punkter: [
          "svare på henvendelser",
          "kontakte deg for å avtale møte eller følge opp interesse for våre tjenester",
          "gi deg informasjon om relevante tjenester innen foto, video, sosiale medier, annonsering og digital markedsføring",
          "kvalifisere og prioritere henvendelser",
          "forbedre våre annonser, nettsider, skjemaer og kommunikasjon",
          "dokumentere samtykke og henvendelser der det er nødvendig",
        ],
      },
    ],
  },
  {
    tittel: "4. Behandlingsgrunnlag",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Vi behandler personopplysninger når vi har et lovlig behandlingsgrunnlag.",
      },
      {
        type: "avsnitt",
        tekst:
          "Når du sender inn et kontaktskjema eller leadskjema, behandler vi opplysningene for å kunne følge opp henvendelsen din. Behandlingsgrunnlaget er normalt vårt berettigede interessegrunnlag i å kunne svare på henvendelser og tilby relevante tjenester, eller samtykke der skjemaet uttrykkelig ber om dette.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dersom du samtykker til å motta markedsføring, kan vi bruke kontaktinformasjonen din til å sende relevant informasjon. Du kan når som helst trekke samtykket tilbake. Datatilsynet beskriver at et gyldig samtykke blant annet må være frivillig, spesifikt, informert, utvetydig, dokumenterbart og mulig å trekke tilbake like lett som det ble gitt.",
      },
    ],
  },
  {
    tittel: "5. Bruk av Meta Lead Ads og andre annonseplattformer",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Dersom du fyller ut et skjema via Facebook, Instagram eller andre annonseplattformer, kan opplysningene du sender inn bli behandlet både av annonseplattformen og av oss.",
      },
      {
        type: "avsnitt",
        tekst:
          "Vi mottar opplysningene du har sendt inn, for eksempel navn, e-postadresse, telefonnummer, firmanavn og svar på spørsmål i skjemaet. Vi bruker disse opplysningene til å følge opp henvendelsen din.",
      },
      {
        type: "avsnitt",
        tekst:
          "Annonseplattformen kan også behandle opplysninger i henhold til sine egne vilkår og personvernerklæringer.",
      },
    ],
  },
  {
    tittel: "6. Deling av personopplysninger",
    blokker: [
      { type: "avsnitt", tekst: "Vi selger ikke personopplysningene dine." },
      {
        type: "avsnitt",
        tekst:
          "Vi kan dele personopplysninger med leverandører som hjelper oss med drift, markedsføring, CRM, e-post, analyse, annonsering, skjemaer og kommunikasjon. Slike leverandører behandler opplysninger på våre vegne og skal kun bruke opplysningene i tråd med våre instrukser.",
      },
      { type: "avsnitt", tekst: "Eksempler på leverandører kan være:" },
      {
        type: "liste",
        punkter: [
          "annonseplattformer",
          "CRM-systemer",
          "e-post- og kommunikasjonsverktøy",
          "analyseverktøy",
          "nettside- og skjemaleverandører",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Dersom personopplysninger overføres utenfor EU/EØS, sørger vi for at overføringen skjer i tråd med gjeldende personvernregler.",
      },
    ],
  },
  {
    tittel: "7. Hvor lenge vi lagrer opplysningene",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Vi lagrer personopplysninger så lenge det er nødvendig for formålene de ble samlet inn for.",
      },
      {
        type: "avsnitt",
        tekst:
          "Henvendelser og leads lagres normalt i inntil 24 måneder etter siste kontakt, med mindre det oppstår et kundeforhold eller vi har et annet lovlig grunnlag for videre lagring.",
      },
      {
        type: "avsnitt",
        tekst:
          "Dersom du blir kunde hos oss, kan vi lagre nødvendige opplysninger så lenge kundeforholdet varer og deretter i den perioden vi er pålagt eller har saklig behov for å oppbevare dokumentasjon.",
      },
    ],
  },
  {
    tittel: "8. Informasjonskapsler og sporing",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Vi kan bruke informasjonskapsler, piksler og lignende teknologi på våre nettsider og i våre digitale kampanjer for å:",
      },
      {
        type: "liste",
        punkter: [
          "analysere trafikk og bruk av nettsiden",
          "måle effekten av annonser",
          "vise relevante annonser",
          "forbedre brukeropplevelsen",
          "bygge målgrupper for markedsføring",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Du kan administrere eller trekke tilbake samtykke til informasjonskapsler via innstillingene på nettsiden, dersom dette er tilgjengelig.",
      },
    ],
  },
  {
    tittel: "9. Dine rettigheter",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Du har rettigheter etter personvernregelverket. Dette kan blant annet omfatte rett til:",
      },
      {
        type: "liste",
        punkter: [
          "informasjon om hvordan vi behandler personopplysninger",
          "innsyn i personopplysninger vi har om deg",
          "retting av uriktige eller ufullstendige opplysninger",
          "sletting av personopplysninger",
          "begrensning av behandling",
          "å protestere mot behandling",
          "dataportabilitet, der vilkårene for dette er oppfylt",
          "å trekke tilbake samtykke, dersom behandlingen bygger på samtykke",
        ],
      },
      {
        type: "avsnitt",
        tekst:
          "Datatilsynet har en oversikt over rettighetene enkeltpersoner har når personopplysninger samles inn og brukes, blant annet rett til informasjon, innsyn, retting, sletting, begrensning, protest og dataportabilitet.",
      },
      {
        type: "avsnitt",
        tekst:
          "For å utøve rettighetene dine kan du kontakte oss på pal@reflektor.no.",
      },
    ],
  },
  {
    tittel: "10. Sikkerhet",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Vi bruker tekniske og organisatoriske tiltak for å beskytte personopplysninger mot uautorisert tilgang, endring, sletting, tap eller misbruk.",
      },
      {
        type: "avsnitt",
        tekst:
          "Tilgangen til personopplysninger begrenses til personer og leverandører som trenger opplysningene for å utføre sine oppgaver.",
      },
    ],
  },
  {
    tittel: "11. Klage",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Dersom du mener at vi behandler personopplysninger i strid med regelverket, kan du kontakte oss slik at vi kan undersøke saken.",
      },
      {
        type: "avsnitt",
        tekst: "Du har også rett til å klage til Datatilsynet.",
      },
    ],
  },
  {
    tittel: "12. Endringer i personvernerklæringen",
    blokker: [
      {
        type: "avsnitt",
        tekst:
          "Vi kan oppdatere denne personvernerklæringen ved behov, for eksempel dersom vi endrer hvordan vi samler inn eller behandler personopplysninger.",
      },
      {
        type: "avsnitt",
        tekst: "Nyeste versjon vil alltid være tilgjengelig på denne siden.",
      },
    ],
  },
];
