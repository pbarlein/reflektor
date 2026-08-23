# Designtokens

Levert av Claude Design. **Eneste kilde til sannhet for styling** (brief 8.1.1).
Filene er kopiert inn uendret – ikke rediger dem her. En verdi som mangler
skal legges til i skalaen, ikke skrives inn i en komponent.

## Ett bevisst avvik: font

`typography.css` og `fonts.css` setter **Figtree**, med denne begrunnelsen:

> the original Holum Studio wordmark + site typeface was not supplied as font
> binaries. Figtree (Google Fonts) is the closest open match.

Premisset er feil. Merkevaremanualen fra Holum Studio navngir **Poppins**
eksplisitt (kapittel 2.1, med Light/Regular/Medium/Bold/Black), dagens
reflektor.no kjører Poppins, og Poppins ligger fritt tilgjengelig på Google
Fonts. Det var altså ingen grunn til å substituere.

Prosjektet bruker derfor **Poppins**, lastet via `next/font/google`.
`fonts.css` er ikke importert. Ført opp som punkt i `docs/vedlegg-a.md`.

Resten av tokensettet – farger, rom, radius, bevegelse, elevasjon – brukes
uendret.
