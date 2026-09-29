/*
 * OPPSLAGSFUNKSJONENE BOR I _slot.ts, ikke her.
 *
 * De er rene funksjoner over innholdslaget og hadde ingen grunn til å ligge
 * i en .tsx — men `src/content/faq.ts` importerte `slotsISeksjon` herfra, og
 * dermed dro innholdslaget en React-komponent med seg. Det blokkerte
 * `node --test`: node kan strippe typer fra .ts, men ikke JSX fra .tsx, så
 * en test som importerte faq.ts stoppet på denne fila.
 *
 * Re-eksporten står slik at ingen av de sju andre importstedene må endres.
 */
export { finnSlot, hentTekst, slotsISeksjon } from "@/content/sider/_slot";

/**
 * Rendrer en copy-slot.
 *
 * Manglende tekst vises som en tydelig TBD-markør, ikke som tom plass eller
 * plassholdertekst (brief 0.2). Preview er flaten Pål vurderer på, så det skal
 * være umulig å tro at en side er ferdig når den ikke er det – og like enkelt
 * å se nøyaktig hvilken slot som mangler.
 *
 * content:check hindrer at markøren noen gang havner i produksjon: en side
 * merket ready: true med én eneste TBD feiler i CI.
 */
/**
 * KONTRASTEN ER RETTET 21.09.2026. Markøren hadde oransje tekst på en
 * 12 %-tone av samme oransje, og målte 3,23:1 mot AA-kravet på 4,5 for
 * 13 px. Feilen var usynlig fordi den bare vises når copy MANGLER, og
 * forsidens slots er fylt — den dukket først opp da tjenestesidene fikk
 * TBD-er og axe fant fire brudd.
 *
 * `--aksent-tekst-liten` var ikke nok: 4,23:1, fordi tonen i bakgrunnen
 * mørkner flaten. Mørk blekk gir 14,22:1, og fargesignalet bæres i stedet
 * av flaten og ringen. En markør som skriker «uferdig» hjelper ingen hvis
 * den ikke er lesbar.
 */
export function TbdMarkor({ id }: { id: string }) {
  const slot = { id };
  return (
    <mark
      className="inline-block rounded-xs bg-aksent/12 px-1.5 py-0.5 font-mono text-xs text-blekk ring-1 ring-aksent/40 ring-inset"
      title="Copy ikke levert. Blokkerer produksjon."
    >
      TBD · {slot.id}
    </mark>
  );
}

/*
 * `SlotTekst` ER FJERNET 29.09.2026, etter teknisk gjennomgang.
 *
 * Den pakket `hentTekst` og `TbdMarkor` i ett element med valgfri tag. Ingen
 * av de elleve stedene som bruker slots kalte den — alle gjør oppslaget selv
 * og rendrer markøren direkte, fordi de trenger egne klasser og eget
 * elementvalg uansett. Komponenten ble skrevet som et bekvemmelighetslag som
 * aldri passet noen av tilfellene.
 *
 * Den var også den eneste grunnen til at denne fila importerte `hentTekst` og
 * typen `Side`. Begge importene er borte med den.
 */
