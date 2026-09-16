/**
 * Kundelogoer til logoraden over arbeidsseksjonen.
 *
 * UTVALGET ER PÅLS, 16.09.2026. Elleve navn, gitt i chat. To logoer som
 * ligger på dagens reflektor.no er UTELATT med vilje: ASKO og Orkla Foods
 * Norge. De sto ikke på lista, og Pål har tidligere sagt uttrykkelig at vi
 * ikke skal antyde at vi har abonnement med Orkla. Ikke legg dem inn igjen
 * uten at han ber om det.
 *
 * RADEN SIER INGENTING OM ABONNEMENT. Den har ingen overskrift og ingen
 * påstand — bare logoer. Det er med vilje: AGENTS.md sier at
 * produksjonskunder aldri navngis som SoMe-abonnenter, og en rad med
 * merkelapp «våre abonnenter» ville gjort nettopp det. Dagens side gjør det
 * samme: logostripen der står uten tekst.
 *
 * KILDER. Fem er hentet fra dagens reflektor.no (Squarespace-CDN), seks fra
 * kundemappene i Dropbox under /Reflektor/Assets/<kunde>/. Alle seks fra
 * Dropbox er innholdshash-verifisert mot Dropbox' egne blokk-hasher etter
 * nedlasting. Se docs/media.md for filsti per logo.
 *
 * STØRRELSENE ER REGNET UT, IKKE SATT PÅ ØYEMÅL. Logoer har vilt ulike
 * proporsjoner — Anton Sport er 9,6:1, The Well er 1,3:1. Skalerer man dem
 * til samme HØYDE, blir Anton Sport en plakat og The Well et frimerke.
 * Skalerer man til samme BREDDE, skjer det motsatte.
 *
 * Derfor er hver logo skalert til samme BLEKKAREAL: antall ugjennomsiktige
 * piksler er normalisert til 40 x 40 visningspiksler, med tak på 42 px høyde
 * og gulv på 16 px. Det er den nærmeste tilnærmingen til «like tung i
 * blikket» som lar seg regne ut. Tre logoer treffer taket (The Well, Egon,
 * Soul Cake) — alle tre er nesten kvadratiske merker.
 *
 * Bredde og høyde står her fordi de må inn i <Image> for å unngå layout
 * shift. Endrer du en logofil, må tallene regnes om.
 */
export type Kundelogo = {
  id: string;
  navn: string;
  bredde: number;
  hoyde: number;
};

/**
 * Rekkefølgen er ikke alfabetisk og ikke tilfeldig. De mest gjenkjennelige
 * navnene ligger først, fordi raden starter synlig og drifter mot venstre —
 * det som står først er det som rekker å bli lest.
 */
export const kundelogoer: Kundelogo[] = [
  { id: "anton-sport", navn: "Anton Sport", bredde: 211, hoyde: 22 },
  { id: "the-well", navn: "The Well", bredde: 54, hoyde: 42 },
  { id: "egon", navn: "Egon", bredde: 75, hoyde: 42 },
  { id: "peppes", navn: "Peppes Pizza", bredde: 144, hoyde: 38 },
  { id: "baker-brun", navn: "Baker Brun", bredde: 169, hoyde: 41 },
  { id: "idun-industri", navn: "Idun Industri", bredde: 53, hoyde: 35 },
  { id: "selvaag", navn: "Selvaag", bredde: 128, hoyde: 27 },
  { id: "retail24", navn: "Retail24", bredde: 142, hoyde: 24 },
  { id: "centropa", navn: "Centropa", bredde: 158, hoyde: 23 },
  { id: "happis", navn: "Happis", bredde: 92, hoyde: 36 },
  { id: "soul-cake", navn: "Soul Cake", bredde: 72, hoyde: 42 },
];
