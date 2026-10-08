# Videodatoer (uploadDate)

Google gir **ingen** videoresultater for et `VideoObject` uten `uploadDate`.
Atten filmer på sju sider sto uten feltet til 08.10.2026, og Search Console
meldte sidene som «URL is on Google, but has issues».

Feltet er nå påkrevd i typen (`Referansefilm.publisert`, `Kundecase.klipp.publisert`
og `FilmSchema`), så en ny film ikke kan legges inn uten dato. I tillegg feiler
bygget hvis en ferdig side har en VideoObject uten feltet — se
`scripts/markeringssjekk.ts`, som kjører etter `next build` i CI.

## Regelen for å sette datoen

1. **Står måneden i teksten på siden, er det den som gjelder.** «Anton Sport,
   mai 2026» er en opplysning kunden og vi er enige om, og den er sannere enn
   noe teknisk tidspunkt. Bare måned kjent → den 1. kl. 12:00.
2. **Ellers: første commit der filmfilen kom inn i repoet**
   (`git log --diff-filter=A --follow -- public/<fil>.mp4`). Det er det
   tidligste tidspunktet filmen kunne vært tilgjengelig fra reflektor.no.
3. **Gjett aldri.** En dato uten kilde er verre enn ingen markering: den ser
   like troverdig ut og kan ikke etterprøves.

Alle datoer skrives i ISO 8601 med tidssone, i norsk lokaltid (`+02:00` om
sommeren). Commit-tidspunktene under er omregnet fra UTC til Oslo.

## Datoene, med kilde

| Film | Side | uploadDate | Kilde |
|---|---|---|---|
| `/arbeid/kjeder-vitusapotek` | /kjeder | 2025-09-01T12:00:00+02:00 | «Vitusapotek, september 2025» i bildeteksten |
| `/arbeid/kjeder-anton-sport` | /kjeder | 2026-05-01T12:00:00+02:00 | «Anton Sport, mai 2026» |
| `/arbeid/kjeder-egon` | /kjeder | 2026-08-01T12:00:00+02:00 | «Egon, august 2026» |
| `/arbeid/kjeder-peppes` | /kjeder | 2026-08-01T12:00:00+02:00 | «Peppes Pizza, august 2026» |
| `/reels/soulcake` | /vart-arbeid/soulcake | 2026-09-16T23:38:36+02:00 | første commit |
| `/reels/egon` | /vart-arbeid/egon | 2026-09-16T23:38:36+02:00 | første commit |
| `/reels/peppes-reklamefilm` | /reklamefilm | 2026-09-27T23:31:43+02:00 | første commit |
| `/arbeid/profilfilm` | /employer-branding-video-oslo | 2026-09-28T12:00:17+02:00 | første commit |
| `/arbeid/kundeomtale` | /employer-branding-video-oslo | 2026-09-28T12:00:17+02:00 | første commit |
| `/arbeid/kjeder-format-16x9` | /reels-produksjon, /kjeder | 2026-09-29T11:22:43+02:00 | første commit |
| `/arbeid/kjeder-format-4x5` | /reels-produksjon, /kjeder | 2026-09-29T11:22:43+02:00 | første commit |
| `/arbeid/kjeder-format-9x16` | /reels-produksjon, /kjeder | 2026-09-29T11:22:43+02:00 | første commit |
| `/arbeid/bts-baker-brun` | /reels-produksjon | 2026-09-29T14:22:50+02:00 | første commit |
| `/arbeid/bts-anton-sport` | /reels-produksjon | 2026-09-29T14:22:50+02:00 | første commit |
| `/arbeid/retail24-sandefjord` | /eventfotograf-eventvideo | 2026-09-30T23:51:06+02:00 | første commit |
| `/arbeid/soulcake/soulcake-omtale-ragnhild` | forsiden, /videoproduksjon-i-oslo, /vart-arbeid/soulcake | 2026-10-01 | sto riktig fra før |

**Et forbehold som er verdt å kjenne til:** de fire kjedefilmene har datoen
kunden publiserte dem, ikke datoen de kom på reflektor.no (02.10.2026, ved
cutover). Begge lesningene av «publisert første gang» er forsvarlige, og
teksten på siden er den vi kan vise til. De øvrige har commit-datoen, som
ligger noen dager før cutover av samme grunn.

## Pekere uten noe å peke på

Search Console meldte samtidig at `creator` hadde feil objekttype.
`{ "@id": ".../#organisasjon" }` er riktig JSON-LD bare når noden med den
id-en finnes i samme graf — og `OrganisasjonSchema` rendres bare på forsiden.
På alle andre sider så Google en tom Thing.

Den samme feilen lå i `provider`, `author`, `publisher`, `isPartOf`,
`itemReviewed`, `about`, `mainEntity` og `worksFor` — femten steder i tre
filer. Alle bruker nå `reflektorRef()` fra `src/lib/artikkelmarkering.ts`, som
beholder `@id` og legger til `@type`, navn og adresse. Markeringssjekken
feiler bygget hvis en bar `@id` uten node dukker opp igjen.

## Da dette ble gjort

To ting til ble funnet underveis:

- **To filmer på /reels-produksjon hadde tom `description`.** Seksjonen «Slik
  fungerer det» er en ren liste uten ledesetning, med vilje, og seksjonens svar
  er det VideoObject-et arver. Tomt felt faller nå tilbake på sidens eget svar.
- **Filmene teller 21, ikke 18.** De tre som allerede var riktige — omtale-
  videoen på forsiden, /videoproduksjon-i-oslo og /vart-arbeid/soulcake — er
  samme opptak på tre sider.
