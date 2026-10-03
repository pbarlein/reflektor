# Påminnelsen, og knappen som avbryter den

Lagt til 04.10.2026, bestilt via Cowork.

## Hva HubSpot gjør selv

Arbeidsflyten «Lead-oppfølging – presentasjon og booking» (ID 5034704077,
slått på av Cowork 03.10.2026) sender to e-poster:

1. **Med én gang** et lead kommer inn fra nettskjemaet eller Meta-skjemaet:
   en e-post fra Pål med Canva-presentasjon og bookinglenke.
2. **Neste hverdag kl. 09:00**: en påminnelse.

Påminnelsen sendes ikke hvis leadet har booket møte, hvis en tilknyttet deal
står i Møte booket, Tilbud sendt, Vunnet, Hviler eller Tapt, eller hvis
kontaktegenskapen `paminnelse_avbrutt` er satt. Kunder (lifecycle Customer)
og @reflektor.no-adresser får ingen av e-postene.

## Hva nettsiden gjør

**Bekreftelsen til leadet er fjernet.** Nettsiden sendte selv en e-post
«Takk for henvendelsen – Reflektor» fra 04.10.2026 om morgenen. Den er tatt
ut samme dag: HubSpot sender nå en bedre en, med presentasjon og
bookinglenke, og to kvitteringer for samme skjema er en for mye.

**Varselet til Pål har fått tre linjer** etter feltene:

```
Generisk Canva-presentasjon og møtelink sendt. Påminnelse sendes mandag 12. oktober kl. 09:00.

Ring ASAP for å booke møte personlig.

[ Avbryt påminnelse ]
```

Tidspunktet regnes ut i `src/lib/paaminnelse.ts` etter samme regel som
arbeidsflyten: vent til første midnatt, så til nærmeste man–fre kl. 09:00.
Helligdager teller ikke — funksjonen skal si det samme som HubSpot gjør, ikke
det som hadde vært riktigst. Alt regnes i Europe/Oslo, uansett hvor serveren
står, og sommertid/vintertid er dekket av tester.

Linjene står ikke for @reflektor.no-adresser. Arbeidsflyten hopper over dem,
og et varsel som lover en påminnelse som aldri kommer, er verre enn ingenting.

## «Avbryt påminnelse»

**Knappen** i varselet går til `/paaminnelse/avbryt?e=<e-post>&s=<signatur>`.
Signaturen er en HMAC over e-postadressen med `PAAMINNELSE_HEMMELIGHET`.
Uten gyldig signatur: «Ugyldig lenke», og ingenting skjer.

**GET endrer aldri noe.** Siden viser bare hvem det gjelder og en knapp.
E-postklienter og sikkerhetsskannere åpner lenker på egen hånd; en GET som
endret noe, ville slått av påminnelser ingen hadde bestemt seg for.

**POST** setter `paminnelse_avbrutt = true` på kontakten i HubSpot, slått opp
på e-postadressen. 404 betyr at kontakten ikke har rukket å bli opprettet
ennå — innsendingen til HubSpot skjer etter at svaret til besøkende er sendt —
og siden svarer «Prøv igjen om et minutt».

**Oversiktssiden** `/paaminnelse` finnes for Meta-leads, som ikke gir noe
varsel fra nettsiden. Den viser leads med en påminnelse på vei, med samme
knapp. Beskyttet med en nøkkel: `?k=<nøkkel>` én gang setter en httpOnly-
kapsel som varer i et år, og nøkkelen forsvinner fra adressefeltet.
Byttet skjer i `src/proxy.ts` — en serverkomponent kan lese kapsler, men
ikke sette dem.

Begge sidene er `noindex` og står ikke i sitemapet.

## Miljøvariabler

| Variabel | Satt av | Uten den |
|---|---|---|
| `PAAMINNELSE_HEMMELIGHET` | Claude Code, 04.10.2026 | Varselet kommer som før, men uten knapp |
| `PAAMINNELSE_NOKKEL` | Claude Code, 04.10.2026 | Oversiktssiden sier «Ingen tilgang» til alle |
| `HUBSPOT_TOKEN` | Pål | Knappen og oversikten sier «Ikke satt opp ennå» |

`HUBSPOT_TOKEN` lages i HubSpot: Innstillinger → Integrasjoner → Private
apper → ny app med tilgangene `crm.objects.contacts.read` og
`crm.objects.contacts.write`.

**Ingenting annet avhenger av disse.** Varselet, skjemaet og innsendingen til
HubSpot virker uendret uten dem.
