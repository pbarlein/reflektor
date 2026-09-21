/**
 * Rendrer en tekststreng og gjør TBD-markører synlige som markører.
 *
 * HVORFOR DETTE TRENGS. Copy som ikke er levert skrives som `TBD(...)` i
 * innholdsfilene. I slot-systemet håndteres det av `TbdMarkor`, men
 * tjenestesidene har TBD-er inne i løpende setninger — «Hva koster en
 * reklamefilm? TBD(reklamefilm.pris)» — og da finnes det ingen slot å
 * bytte ut.
 *
 * Uten dette rendres strengen som vanlig brødtekst, og «TBD(event.pris)»
 * ser ut som en setning noen mente å skrive. Det er nøyaktig feilen som ble
 * funnet på /personvern 19.09.2026, der tre TBD-er ble servert til
 * besøkende i produksjon fordi de lå i vanlige strenger.
 *
 * Prosjektets regel, fra Hero.tsx: «Preview er flaten Pål vurderer på — det
 * skal være umulig å tro at noe er ferdig når det ikke er det.»
 */
export function Tekst({ children }: { children: string }) {
  const deler = children.split(/(TBD\([^)]*\))/g);

  return (
    <>
      {deler.map((del, i) => {
        const treff = /^TBD\(([^)]*)\)$/.exec(del);
        if (!treff) return del;
        return (
          <mark
            key={i}
            className="inline-block rounded-xs bg-aksent/12 px-1.5 py-0.5 font-mono text-xs text-blekk ring-1 ring-aksent/40 ring-inset"
            title="Copy ikke levert. Blokkerer produksjon."
          >
            TBD · {treff[1]}
          </mark>
        );
      })}
    </>
  );
}
