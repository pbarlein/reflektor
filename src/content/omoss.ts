/**
 * /om-oss.
 *
 * TEKSTEN ER MIGRERT ORDRETT fra www.reflektor.no/om-oss, hentet 17.09.2026.
 * Den nye siden var en overskrift, ingressen fra site.ts og en TODO som sa
 * «avventer tekst fra Reflektor». Teksten ventet ikke — den sto publisert.
 *
 * ÉN ENESTE ENDRING er gjort i ordlyden: «30 000 kr/ mnd» er satt til
 * «30 000 kr/mnd». Mellomrommet er en skrivefeil, og AGENTS.md fastsetter
 * skrivemåten.
 *
 * HVA EN «OM OSS» FAKTISK GJØR PÅ EN SIDE SOM SELGER ET ABONNEMENT:
 * den svarer på «hvem står bak, og blir de her neste år». Det er derfor
 * folkene har navn og roller, og derfor historien om hvorfor selskapet ble
 * spisset står med — den forklarer hvorfor produktet ser ut som det gjør.
 * En verdiliste ville ikke gjort noen av delene.
 *
 * TEAMET ER FIRE NAVN MED ROLLER, og det er et entitetssignal like mye som
 * et tillitssignal: `Person` knyttet til `Organization` er noe en
 * språkmodell kan gjengi. Dagens personsider hadde alle tittelen
 * «Contact 1» — se kontekst.md — så her finnes det ingenting å migrere
 * utover navn og rolle.
 */

export type Ansatt = { navn: string; rolle: string };

export const omoss = {
  metaTittel: "Om oss – SoMe-byrået Reflektor i Oslo",
  metaBeskrivelse:
    "Reflektor er et SoMe-byrå i Oslo. Én produksjonsdag i måneden, publisering to ganger i uka på Instagram og Facebook – innhold som kan brukes på alle flater.",

  h1: "Folkene som sørger for at det faktisk blir produsert og postet.",
  ingress:
    "Reflektor er et SoMe-byrå i Oslo. Vi holder bedrifter synlige på Instagram og Facebook gjennom et fast månedlig samarbeid: én produksjonsdag, to poster i uka. Alt vi produserer er on-brand og med høy produksjonskvalitet – og kan derfor brukes på tvers av betalte og organiske kanaler, nettsider, skjermer og plakater.",

  prinsipper: {
    tittel: "Slik jobber vi",
    punkter: [
      {
        tittel: "Rytme slår skippertak",
        tekst:
          "Én produksjonsdag i måneden. Publisering to ganger i uka, 52 uker i året.",
      },
      {
        tittel: "Full åpenhet",
        tekst:
          "Fast pris – 30 000 kr/mnd. Ingen bindingstid utover oppsigelsesfrist. Fri bruk av alt innhold som leveres.",
      },
      {
        tittel: "Organisk som kompass",
        tekst:
          "Prestasjonen på organiske poster er en løpende A/B-test av hva som bør prioriteres i deres betalte kanaler.",
      },
    ],
  },

  historie: {
    tittel: "Hvorfor vi jobber slik",
    avsnitt: [
      "Reflektor startet som produksjonsselskap. Gjennom årene har vi levert foto, video og kampanjer for alt fra restauranter til sportskjeder – og lært én ting: det som gir resultater over tid er ikke enkeltproduksjoner, men jevnt, godt innhold som faktisk blir publisert.",
      "Derfor spisset vi hele selskapet rundt akkurat det. Med profesjonell produksjon har dere tilgang til on-brand videoer og bilder på løpende bånd.",
    ],
  },

  team: {
    tittel: "Team Reflektor",
    /*
     * REKKEFØLGEN ER DAGENS SIDES, ikke alfabetisk og ikke etter rang.
     * De tre produsentene står først og CEO sist. Det er et valg noen har
     * tatt, og det sier noe: dette er folkene kunden faktisk møter.
     */
    ansatte: [
      {
        navn: "Magne Finseth da Fonseca",
        rolle: "Produsent og kundeansvarlig",
      },
      { navn: "Henrik Holthe", rolle: "Produsent og kundeansvarlig" },
      { navn: "Viktor Norén", rolle: "Produsent og kundeansvarlig" },
      { navn: "Pål Barlein", rolle: "CEO" },
    ] satisfies Ansatt[],
  },

  cta: {
    tittel:
      "Vi lager komplett strategiforslag til SoMe i løpet av 3 virkedager",
    tekst:
      "Lyst til å møte oss? Book en uforpliktende prat – vi holder til i Oslo og jobber med bedrifter i hele Norge. Fortell oss om din bedrift, og vi lager et komplett strategiforslag til SoMe i løpet av 3 virkedager. Sammen planlegger vi første shoot og kommer i gang på kort tid!",
    knapp: "Få et strategiforslag",
  },
};
