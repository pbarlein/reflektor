# Video

Legg videofiler her. Kobles opp i komponentene derfra.

## Størrelsesgrensen som avgjør

GitHub avviser filer over **100 MB**, og advarer over 50 MB.

- **Under ~25 MB** → legg filen her. Enkelt, ingen ekstra verktøy.
- **Over det** → Vercel Blob:
  ```bash
  npx vercel blob put film.mp4
  ```
  Kommandoen gir en URL som limes inn i `src/content/`.

En web-optimalisert klipp på 15–30 sekunder i 1080p havner typisk på 5–15 MB
og passer fint her. En full kundefilm gjør det ikke.

## Format

- MP4, H.264, maks 1080p
- Bakgrunnsloop: uten lyd, kort, med `poster`-bilde
- Filnavn: små bokstaver med bindestrek, ingen æøå
