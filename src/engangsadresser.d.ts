/**
 * Typeerklæring for `disposable-email-domains/index.js`.
 *
 * HVORFOR `/index.js` OG IKKE PAKKENAVNET: pakkas `main` peker rett på
 * `index.json`, og et `await import()` av en JSON-modul krever
 * `with { type: "json" }` i Node. Uten det kaster importen, og
 * engangslista ble et tomt sett uten at noe sa fra. Se lib/spamoppslag.ts.
 *
 * Pakka har ingen typer, og det finnes ingen @types-pakke for den.
 */
declare module "disposable-email-domains/index.js" {
  const domener: string[];
  export default domener;
}
