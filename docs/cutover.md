# Cutover — handlinger som først skal skje når DNS peker hit

Ingenting i denne filen er utført. Alt her er bestilt, begrunnet og skal
gjøres **på cutover-dagen**, ikke før.

Grunnen til at det har en egen fil: hver av disse handlingene er trygg på
cutover-dagen og skadelig i dag.

---

## 1. `/sosiale-medier-byra` → `/` som 301

**Status: IKKE UTFØRT. Skal ikke utføres før cutover.**

Bestilt av Marketing 15.09.2026. Begrunnelse derfra: Google AI Mode siterer
vekselvis forsiden og `/sosiale-medier-byra` for samme prompt, fordi begge
bærer samme fakta. To sider med samme fakta deler signalene i to. Det AI
belønner er setningene, ikke URL-en — og setningene følger med i en 301.

Dette **opphever** brief 8.5 «vei A» fra v1.2; brief v1.0-tabellen gjelder
igjen.

### Dette står i direkte motstrid til regel 1 i AGENTS.md

AGENTS.md sier: «Live URL-er flyttes ikke … `/sosiale-medier-byra` … er live
sider det annonseres mot. Første utkast redirigerte to av dem bort og ville
sendt betalt trafikk i grøfta.»

Regelen ble skrevet fordi jeg gjorde nettopp den feilen én gang.

Motstriden er **reell, men løst** — forutsatt at rekkefølgen holdes:

1. Google Ads: endelig URL byttes til `/`
2. **Samme dag:** 301-en legges inn
3. Squarespace-forsiden og dagens `/sosiale-medier-byra` røres ikke før dette

Gjøres 301-en før Ads-URL-en byttes, lander betalt trafikk i en redirect. Det
er ikke katastrofalt — en 301 videresender — men det koster lastetid på hvert
klikk, og Ads kan flagge landingssiden.

Gjøres den i dag, mens Squarespace fortsatt serverer siden, gjør den
ingenting i det hele tatt: redirect-kartet i `next.config.ts` gjelder bare
den nye siden, som ingen besøker ennå.

**Pål må bekrefte at han kjenner denne motstriden før 301-en legges inn.**
Å oppheve en regel som ble skrevet etter en konkret feil, skal være et
bevisst valg — ikke noe som skjer fordi det sto i et vedlegg.

### Selve endringen, når den skal gjøres

```ts
// next.config.ts — legges til i redirects()
{
  source: "/sosiale-medier-byra",
  destination: "https://www.reflektor.no/",
  permanent: true,
}
```

Absolutt https-URL, ikke relativ sti — slik Marketing spesifiserte.

Merk at `/sosiale-medier-byra` i dag er **destinasjon** for to redirects i
`next.config.ts` (linje 35 og 40). De må peke på `/` samtidig, ellers blir
det en kjede: gammel URL → `/sosiale-medier-byra` → `/`. To hopp der ett
holder.

---

## 2. Indekseringssperren åpnes

`NEXT_PUBLIC_TILLAT_INDEKSERING=true` i Vercel. Se `src/lib/miljo.ts`.

Først når DNS peker hit. Ikke for å «teste at SEO virker».

---

## 3. Verifiser at `/takk` fortsatt teller

107+ historiske konverteringer henger på GA4-hendelsen `takk_page_view` i
GTM-N4KGSS93. Send ett testskjema etter cutover og bekreft i sanntidsrapporten
at hendelsen fyres — ikke bare at siden vises.

Dette er den eneste KPI-en. Alt annet på siden kan repareres i ettertid.
