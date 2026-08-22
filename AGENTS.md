<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reflektor

Ny nettside for reflektor.no. Next.js (App Router) på Vercel, norsk språk.

**Les `docs/kontekst.md` før du gjør endringer.** Prosjektkontekst hører hjemme
der – ikke i en chat, som ingen ny sesjon kan arve.

## Eneste KPI: skjemaleads

Leads måles i GA4 (`takk_page_view` på `/takk`) og Google Ads. Ikke i Ahrefs.
Trafikk, rangeringer og synlighet er ikke mål i seg selv. Vurder enhver endring
mot om den gir flere utfylte skjemaer.

## Fire ting som er lett å ødelegge

1. **Live URL-er flyttes ikke.** Redirects skal kun rette opp faktiske 404-er.
   `/sosiale-medier-byra`, `/innholdsproduksjon`, `/reklamefilm` og
   `/kontaktoss` er live sider det annonseres mot. Første utkast redirigerte to
   av dem bort og ville sendt betalt trafikk i grøfta. Sjekk at en URL faktisk
   er død før du legger inn en redirect.
2. **`/takk` er hellig.** URL-en og GA4-hendelsen bærer 107+ historiske
   konverteringer. Endrer du dem, mister Reflektor målingen av sin eneste KPI.
3. **Bloggslugs i `src/content/site.ts` må ikke endres.** Bloggen beholdes for
   lenkeverdien – ~481 refererende domener. Men innholdet er ordbok- og
   skoleoppgavestoff som ikke konverterer: det skal ikke styre arkitekturen, og
   det skal ikke lages mer av den typen.
4. **Bloggtekstene er ikke migrert fra Squarespace.** Siden kan ikke lanseres
   før de er det.

## Ahrefs-data må leses med forbehold

Tallene er estimater og etterslepende, GSC er ikke koblet til, og alt som er
bygget i 2026 har ennå ingen tall. Fravær av data er ikke bevis på fravær av
verdi. Bruk Ahrefs til å finne URL-er med lenker som må redirigeres – ikke til
å avgjøre hva siden skal handle om.

## Praktisk

- Alt tekstinnhold bor i `src/content/site.ts`, ikke i komponentene. Felt merket
  UAVKLART er plassholdere som ikke er godkjent av kunden.
- Redirect-kartet ligger i `next.config.ts`.
- `docs/snapshot/` (HTML fra dagens side) må lages på en maskin med tilgang til
  reflektor.no – nettverkspolicyen her blokkerer domenet.
