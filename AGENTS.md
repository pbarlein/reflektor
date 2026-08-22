<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reflektor

Ny nettside for reflektor.no. Next.js (App Router) på Vercel, norsk språk.

**Les `docs/kontekst.md` før du gjør endringer.** Der ligger analysen av dagens
side, SEO-situasjonen og begrunnelsen bak arkitekturen. Prosjektkontekst hører
hjemme i det dokumentet – ikke i en chat, som ingen ny sesjon kan arve.

Tre ting som er lett å ødelegge:

1. **Bloggslugs i `src/content/site.ts` må ikke endres.** Bloggen bærer all
   ikke-brandtrafikk til domenet. Endrer du en slug, mister siden rangeringen.
2. **Bloggtekstene er ikke migrert fra Squarespace.** Siden kan ikke lanseres
   før de er det – tomme sider på rangerende URL-er er verre enn dagens side.
3. **Alt tekstinnhold bor i `src/content/site.ts`**, ikke i komponentene.
   Felt merket UAVKLART er plassholdere som ikke er godkjent av kunden.

Redirect-kartet fra dagens Squarespace-URL-er ligger i `next.config.ts`.
