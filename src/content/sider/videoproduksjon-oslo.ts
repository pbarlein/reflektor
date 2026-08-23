import type { Side } from "./_slot.ts";

/**
 * Slot-inventaret hentes fra brief kapittel 6 når siden bygges.
 * Rekkefølgen for copy er låst i kapittel 9.1 – denne siden bygges ikke
 * før den foregående er ferdig etter definisjonen i 8.8.
 */
export const videoproduksjon_oslo: Side = {
  sti: "TBD",
  ready: false,
  seksjoner: [],
};
