/**
 * Luften mellom seksjonene på forsiden.
 *
 * ÉN VERDI, ETT STED. Hver seksjon betaler for luften UNDER seg, ingen har
 * luft over — regelen står utdypet i Arbeidet.tsx. Den regelen holdt, men
 * verdiene gjorde det ikke: seksjonene hadde pb-14, pb-16, pb-20, pb-24 og
 * pb-28, med fem forskjellige sm-varianter oppå. Resultatet var at luften
 * over priskortet var 144 px og luften under 80 — nesten dobbelt så mye på
 * oversiden som på undersiden av den samme blokken.
 *
 * SAMLET 04.10.2026, bestilt av Pål: «lag like kort avstand over som under
 * prisseksjonen. sørg for samme avstand på hele siden for å gjøre den
 * kortere.»
 *
 * 64 PX PÅ MOBIL, 96 PÅ SKJERM. Verdien er ikke ny og ikke valgt fritt:
 * det er den Pål godkjente for anmeldelsesseksjonen 02.10.2026, etter
 * «litt for mye spacing over arbeid». Nå gjelder den hele siden.
 *
 * Forsiden ble rundt 240 px kortere på mobil og 144 px på skjerm.
 *
 * LEGGER DU INN EN NY SEKSJON, bruk denne. Har seksjonen egen
 * bakgrunnsfarge, må den fargede flaten være innfelt og luften ligge
 * utenfor den — ellers blir avstanden dobbel der to flater møtes.
 */
export const SEKSJONSLUFT = "pb-16 sm:pb-24";
