# Vedlegg A · Åpne punkter og avvik

Ført av Claude Code etter brief 0.2: *«Er noe uavklart: bygg med tydelig
[TBD]-markør og før punktet opp i vedlegg A. Ikke gjett.»*

Punktene under er nye funn fra steg 0 – de kommer i tillegg til de tolv som
allerede står i briefens eget vedlegg A.

---

## A13 · Designsystemet setter feil font

**Status:** avviket er tatt, punktet trenger bekreftelse.

`tokens/fonts.css` og `typography.css` setter **Figtree**, med denne
begrunnelsen:

> the original Holum Studio wordmark + site typeface was not supplied as font
> binaries. Figtree (Google Fonts) is the closest open match.

Premisset er feil. Merkevaremanualen navngir **Poppins** eksplisitt i kapittel
2.1, med Light/Regular/Medium/Bold/Black. Dagens reflektor.no kjører Poppins.
Poppins ligger fritt på Google Fonts. Det var ingen grunn til å substituere.

Prosjektet bruker Poppins. `fonts.css` er ikke importert. Resten av
tokensettet brukes uendret.

Dette henger sammen med briefens eget punkt 5 – «Poppins beholdes i én vekt,
eller utvides?». Svaret på *hvilken* font er nå gitt; antall vekter er fortsatt
åpent.

---

## A14 · Absolutte 301-URL-er ville rammet preview

**Status:** avviket er tatt bevisst.

Brief 8.5 sier: *«Alle 301-er skrives som absolutte https-URL-er, ikke
relative stier.»*

Implementert som **relative** stier i `next.config.ts`. Absolutte URL-er mot
`https://www.reflektor.no/…` ville sendt all preview-trafikk ut av preview og
inn på den levende Squarespace-siden – redirecten ville truffet før man fikk
se noe som helst.

Regelen gir mening for migreringstabellen som dokument, og der skrives de
absolutt. I koden må de være relative for at preview skal fungere.

---

## A15 · Branchnavn avviker fra 8.1.2

Brief 8.1.2 sier fundamentarbeid på `setup/*`. Denne sesjonen er bundet til
`claude/reflektor-new-website-10fmt0` av miljøet den kjører i, og kan ikke
pushe til andre brancher. Konvensjonen bør følges fra neste branch.

---

## A16 · Search Console *er* koblet til Ahrefs

Korreksjonsnotatet fra 22.08 sa at GSC ikke var koblet til Ahrefs-prosjektet.
Det stemmer ikke lenger – `gsc-pages` returnerer data for prosjekt 10162201.

Det er gode nyheter: URL-inventaret for steg 0 er hentet med faktiske
visnings- og posisjonstall, ikke estimater.

---

## A17 · `/tjenester/produktfoto` var i ferd med å bli kastet bort

**Status:** rettet.

GSC viser **1 935 visninger, posisjon 15,8 på «produktfoto», 22 rangerende
søkeord** for `/tjenester/produktfoto`. Første versjon av redirect-kartet sendte
den til forsiden sammen med resten av det døde `/tjenester/`-treet.

Nå: 301 til `/produktfoto`. Samme gjelder
`/tjenester/eventfotograf-eventvideo` (1 466 visninger, 43 søkeord).

Dette er grunnen til at briefen krever fullt URL-inventar før migrering, og
ikke tillater at kartet skrives fra hukommelsen.

---

## A18 · `/produktfoto` finnes allerede

Siden er live med 155 visninger og 11 søkeord, posisjon 24,7. Den er altså
ikke en ny side som skal opprettes, men en eksisterende side som skal bygges
om. Slugen skal ikke røres.

---

## A19 · Overflatefarge: tokens sier hvitt, siden er beige

`--surface-page` er satt til `--rf-white`, mens dagens reflektor.no bruker
beige `#F7F3ED` som hovedflate. Tokensettet har fargen som `--rf-bone`
(`#F6F4F1`), men bruker den kun til `--surface-muted`.

Er hvit hovedflate et bevisst brudd med dagens uttrykk, eller en forglemmelse?
Bygget følger tokens inntil svar foreligger.

---

## A20 · Hjørneradius på knapper

Tokens sier `--radius-0: 0px  /* the default — the brand is square-cornered */`
og reserverer `--radius-pill` for knapper. Måling av dagens side ga ~5px på
CTA-knappene.

Tre ulike svar. Trenger ett.

---

## A21 · CI mangler lenkesjekk og Lighthouse

Brief 8.1.2 krever fire ting i CI. Tre kjører: typesjekk, `content:check`,
lint og bygg. Lenkesjekk og Lighthouse mot budsjettet i 8.7 gjenstår –
Lighthouse krever en deployet preview-URL som workflowen kan peke på.

---

## A22 · Sporing kan ikke verifiseres herfra

Steg 0 krever at sporingsoppsettet er *bekreftet i Google Ads-grensesnittet*.
GTM-containeren og `takk_page_view` er implementert i koden, men verifiseringen
krever innlogging i Google Ads og en reell skjemainnsending. Det er Påls
oppgave, og den kan ikke lukkes av Claude Code.

---

## A23 · Leads leveres på e-post — avklart

**Status:** avklart 23.08.2026. Leads går til `pal@reflektor.no`.

Implementert med Resend. `RESEND_API_KEY` må settes i Vercel før skjemaet
faktisk leverer – uten den logges leadet i Vercel-loggen og redirecten skjer
som normalt, men ingen e-post sendes. Se `docs/leads.md`.

Standardavsenderen krever ikke DNS-endring så lenge Pål er eneste mottaker.
Skal flere motta leads, må reflektor.no verifiseres som avsenderdomene – det
er e-post-DNS, ikke nettsted-DNS, men skal likevel avklares eksplisitt.

Erstatter det åpne punktet om mottaker i A22.

---

## Avklart 23.08.2026

Pål besvarte de åpne designpunktene. Oppdatert status:

**A19 · Overflatefarge — LØST.** Hovedflaten er **beige**. `--surface-page`
peker nå på `--rf-bone`. Overstyringen ligger i
`src/styles/tokens/overstyringer.css` så vendorfilene kan byttes ut ved neste
tokenleveranse uten å miste beslutningen.

**A20 · Hjørneradius — LØST.** Valget ble overlatt til Claude Code. Landet på
**4px** (`--radius-sm`): nærmest de ~5px som faktisk står i produksjon i dag,
og en verdi som allerede finnes i skalaen. Pill ville vært et tydelig brudd med
dagens uttrykk. Foto og video beholder 0 — «photography is never rounded»
gjelder fortsatt.

**A21 · CI — DELVIS LØST.** Lenkesjekk er på plass og verifisert i begge
retninger. Den leser ruter fra mappestrukturen og redirects fra
`next.config.ts`, så den fanger døde interne lenker før deploy. Lighthouse mot
budsjettet i 8.7 gjenstår — krever en deployet preview-URL workflowen kan peke
på.

**Typografi (briefens punkt 5) — LØST.** Poppins i **flere vekter**. Light 300,
Regular 400, Medium 500, Bold 700 og Black 900 lastes via `next/font`.

**Kundenavn (briefens punkt 3) — LØST.** Alle navn kan brukes: Idun, Orkla,
Anton Sport, Egon, Soul Cake, Selvaag, The Well, ASKO og Vitusapotek. De skal
fortsatt merkes som produksjonskunder, aldri som SoMe-abonnenter — det er en
låst ramme i 0.3.

---

## A24 · Hero-video komprimert

Kildefilen var 13,9 MB, 33,7 sekunder, 1486×618, uten lyd. Ytelsesbudsjettet i
8.7 setter 2,5 MB.

Resultat etter H.264-komprimering:

| Fil | Oppløsning | Størrelse |
|---|---|---|
| `hero.mp4` | 1280×532 | 1,93 MB |
| `hero-mobil.mp4` | 768×320 | 0,91 MB |
| `hero-poster.jpg` | 1280 | 0,07 MB |

Mobil får egen fil framfor å laste desktopversjonen og skalere den ned.
Posteren bærer førstevisningen, videoen har `preload="none"` og hentes etterpå
— det er slik både 2,5 MB-grensen for hero og 1,8 MB-grensen for totalvekt
kan holdes samtidig.

`prefers-reduced-motion` gir kun posteren; videofilen lastes aldri.

Neste steg for ytterligere kutt er VP9 eller AV1 som alternativ kilde. Ikke
gjort nå — H.264 alene holder budsjettet.

---

## A25 · API-nøkkelen ble delt i et skjermbilde

`RESEND_API_KEY` var synlig i klartekst i et skjermbilde delt i chatten.
Nøkkelen er ikke skrevet til repoet.

Anbefaling: roter den i Resend etter at den er satt i Vercel. En nøkkel som har
vært synlig utenfor en hemmelighetslagring bør behandles som kompromittert,
uavhengig av hvor kort tid det gjaldt.

---

## A26 · Pris på reklamefilm oppgitt

Briefens eget punkt 2 etterlyste fra-priser på engangstjenester. Reflektor
oppga 23.08.2026: **reklamefilm fra 40 000 kr**, eller 30 000 kr som del av en
fast avtale. Det siste stemmer med den kjente prisen for ekstra produksjonsdag.

Fortsatt åpent: fra-pris for videoproduksjonsdag og produktfotodag.

## A27 · To tegngrenser hevet

`home.clients.intro` fra 120 til 150, `home.services.items[*]` fra 80 til 90.

Begge var mine estimater, ikke krav fra briefen. Copyen som kom inn lå 17 og 5
tegn over, og designet har rom. Å be om omskriving for å treffe et tall jeg
selv fant på ville vært feil bruk av protokollen.

Grenser som stammer fra briefen — H1 under 8 ord, maks fire skjemafelt — står
uendret og skal ikke justeres på denne måten.
