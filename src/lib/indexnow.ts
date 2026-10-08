/**
 * IndexNow: å si fra til Bing når en side har endret seg.
 *
 * HVORFOR DET ER VERDT NOE. ChatGPT-søk og Copilot henter fra Bings indeks.
 * Jo raskere Bing ser en endring, jo raskere kan et AI-svar bygge på den.
 * Google deltar ikke i IndexNow, så dette flytter ingenting der.
 *
 * NØKKELEN ER IKKE HEMMELIG. Den ligger åpent på nettstedet — det er hele
 * mekanismen: Bing henter `https://www.reflektor.no/<nøkkel>.txt` og
 * sammenligner innholdet med nøkkelen i forespørselen. Det den beviser, er
 * at den som sender inn URL-er, har skriveadgang til nettstedet. Den ligger
 * derfor i koden og ikke i en miljøvariabel, men ÉTT sted: her.
 *
 * FILA I public/ MÅ HETE NØYAKTIG DET SAMME. En test holder de to sammen —
 * en nøkkel som ikke stemmer med fila gir 403 fra IndexNow, og det er en
 * feil ingen merker før noen leter etter den.
 */

/** 32 heksadesimale tegn, laget 08.10.2026. */
export const INDEXNOW_NOKKEL = "112ad7a7fb0db495883f6cf5c77dbc3f";

/** Der nøkkelfila ligger. Sendes med i hver innsending. */
export const INDEXNOW_NOKKELFIL = `https://www.reflektor.no/${INDEXNOW_NOKKEL}.txt`;

/** Endepunktet. api.indexnow.org deler innsendingen med alle motorene. */
export const INDEXNOW_ENDEPUNKT = "https://api.indexnow.org/indexnow";

/** Verten vi sender inn for. Må stemme med URL-ene i lista. */
export const INDEXNOW_VERT = "www.reflektor.no";
