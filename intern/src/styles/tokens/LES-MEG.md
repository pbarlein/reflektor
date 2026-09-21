# Tokens

Disse sju filene er **kopiert fra hovedsiden** (`../../../../src/styles/tokens/`)
og skal holdes identiske med den. De er merkevaren, ikke layouten — samme
regel som står i AGENTS.md for hovedprosjektet.

## Hvorfor kopi og ikke import

Intranettet er et eget Next-prosjekt med egen `node_modules` og egen
Vercel-deploy. En CSS-import som peker utenfor prosjektroten gjør filsporing
og deploy skjørt for å spare sju små filer. Kopien er billigere.

## Når hovedsiden endrer en token

Kjør fra `intern/`:

```bash
cp ../src/styles/tokens/*.css src/styles/tokens/
```

Så bort med denne filen igjen hvis `cp` tok den — den finnes bare her.

## Hva intranettet legger til

Ingenting i disse filene. Intranettets egne verdier — flatene for
kategorifargene og de to nye dybdenivåene på brunt — står i
`src/app/globals.css` under `@theme inline`, slik at en token-oppdatering
fra hovedsiden aldri overskriver dem.
