import type { Side, Slot } from "@/content/sider/_slot";

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
export function finnSlot(side: Side, id: string): Slot | undefined {
  for (const seksjon of side.seksjoner) {
    const treff = seksjon.slots[id];
    if (treff) return treff;
  }
  return undefined;
}

export function hentTekst(side: Side, id: string): string | null {
  return finnSlot(side, id)?.verdi ?? null;
}

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

/** Tekstslot med valgfritt innpakkingselement. */
export function SlotTekst({
  side,
  id,
  som: Som = "span",
  className,
}: {
  side: Side;
  id: string;
  som?: React.ElementType;
  className?: string;
}) {
  const verdi = hentTekst(side, id);
  return (
    <Som className={className}>{verdi ?? <TbdMarkor id={id} />}</Som>
  );
}

/** Alle slots i en seksjon, i rekkefølge. Til lister og rutenett. */
export function slotsISeksjon(side: Side, nr: number) {
  const seksjon = side.seksjoner.find((s) => s.nr === nr);
  if (!seksjon) return [];
  return Object.entries(seksjon.slots).map(([id, slot]) => ({ id, ...slot }));
}
