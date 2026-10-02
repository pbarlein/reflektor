# Omstokkingen av forsiden, 02.10.2026

Bestilt av Pål, ordrett:

> «litt for mye spacing over arbeid. er "slik jobber vi" egentlig nødvendig?
> slett om den ikke bringer verdi, eller finn en lur måte å fjerne den på
> uten å miste verdi. Kort ned seksjonen med masse medier. veldig fint å
> vide mye, så kanskje bare gjøre seksjonen mindre for kortere skrolling,
> men bevare antallet. da også kanskje formater på nytt om hver enkelt ikke
> trenge same oppløsning når de skal være mindre (for å spare lastetid).
> Hva tenker du om å skille "pris" og "dette inngår"? da kan vi sette
> prisseksjonen der "slik jobber vi" er i dag. "dette inngår" seksjonen vil
> jeg at du da redesigner og gjør mye mer sexy. kanskje legge til video fra
> russemerch. enten 1 eller flere. ta en vurdering og gjennomfør uten mitt
> samtykke»

## Hva som ble gjort

| Før | Etter |
|---|---|
| Hero, Logostripe, Anmeldelser, Arbeidet, **Slik jobber vi**, Rutenett, Utenom abonnementet, **Pris (med «Dette inngår»)**, Vegg, FAQ, Kontakt | Hero, Logostripe, Anmeldelser, Arbeidet, **Pris**, Rutenett, Utenom abonnementet, **Dette inngår (med de tre stegene)**, Vegg, FAQ, Kontakt |

`SlikFungererDet.tsx` er slettet. `DetteInngar.tsx` er ny.

## Svaret på «er Slik jobber vi egentlig nødvendig?»

Den brakte verdi, men sa det samme som «Dette inngår» én gang til:

| Steget | Punktet det gjentar |
|---|---|
| Vi planlegger | Produksjon av SoMe-strategi og produksjonsplaner |
| Vi filmer én dag | Én produksjonsdag per måned hos dere |
| Vi klipper og publiserer | 8–10 videoer ferdig redigert + publisering til Instagram 2 ganger i uken |

De sto 575 px fra hverandre på desktop, i hver sin mørke blokk, med
priskortet imellom. Leseren fikk opplysningen to ganger uten å få vite at
det var den samme.

Derfor er de slått sammen i stedet for slettet: stegene er fortellingen,
punktene er spesifikasjonen av den. **Ingen copy er fjernet, og ingen er
skrevet ny.**

## Målte høyder

Live (før) mot ny, samme skript, samme vindu:

| Seksjon | 390 px før | 390 px etter | 1440 px før | 1440 px etter |
|---|---|---|---|---|
| Anmeldelser | 1 715 | 1 683 | 1 400 | 1 368 |
| Slik jobber vi | 919 | — | 575 | — |
| Pris | 2 309 | 880 | 1 447 | 678 |
| Arbeidsrutenett | 723 | 599 | 1 048 | 880 |
| Dette inngår | — | 2 622 | — | 1 488 |
| **Hele forsiden** | **14 755** | **14 872** | **10 606** | **10 550** |

Desktop er 56 px kortere. Mobil er 117 px lengre, og hele forskjellen er
den nye filmen: den er 294 px høy i kvadratisk format på en 390 px skjerm.
Alt annet ble kortere.

**Den som vil ha forsiden vesentlig kortere på mobil, må se på «Utenom
abonnementet».** Den er 2 697 px — fire kort med kvadratisk medie stablet
oppå hverandre, og den største enkeltseksjonen på siden etter at dette er
gjort. Den er ikke rørt her, fordi den ikke var bestilt.

## Ny eksport av bildene var ikke nødvendig

Pål spurte om hver fil burde formateres om når cellene blir mindre. Nei:

- Cellene er like **brede** som før. Bare høyden på stablene er kortere, så
  `sizes="(max-width: 1024px) 50vw, 24vw"` er uendret riktig.
- `next/image` leverer uansett AVIF eller WebP i riktig bredde per skjerm
  fra én kildefil. En ny eksport ville ikke spart en byte.
- Klippene i rutenettet er 72–624 kB hver fra før.

Det eneste som trengte ny eksport var russemerch-filmen, som ikke fantes på
nett. Se `docs/media.md`.
