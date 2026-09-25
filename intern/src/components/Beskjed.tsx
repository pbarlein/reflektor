import type { Svar } from "@/content/arktype";

/**
 * Det Claude sier til produsenten om denne utgaven.
 *
 * ── HVORFOR DEN STÅR UTENFOR ARKET ────────────────────────────────────────
 *
 * Bestilt 25.09.2026: «her tar den bort tekst for å passe på en side, men
 * den tar bort det jeg vil ha. tydeligvis behov for en liten seksjon der du
 * kan svare produsenten for å eliminere misforståelser og svare hvorfor
 * ting er som de er, eller be produsenten avklare ting direkte.»
 *
 * Dokumentet er en ensider som går til kunden. Kunden skal ikke lese om
 * våre avveininger, og hver linje begrunnelse på arket er en linje mindre
 * til det dagen faktisk handler om. Så begrunnelsen kan ikke ligge der.
 *
 * Men den må ligge et sted. Feilen som utløste dette var ikke at noe ble
 * kuttet — ensideren KREVER at noe kuttes — det var at det skjedde i
 * stillhet, og at produsenten oppdaget det to runder senere ved å lese
 * dokumentet på nytt.
 *
 * ── HVORFOR AVKLARINGENE HAR EGEN FARGE ───────────────────────────────────
 *
 * En beskjed er noe man leser. En avklaring er noe man må gjøre noe med,
 * og som blir stående i dokumentet som en gjetning til noen gjør det. De
 * to skal ikke se like ut.
 */
export function Beskjed({ svar }: { svar: Svar | null }) {
  if (!svar || (!svar.beskjed && !svar.avklaringer.length)) return null;

  return (
    <div className="rounded-flate border border-kant bg-dempet px-4 py-4">
      <h3 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-blekk-svak uppercase">
        Fra Claude
      </h3>

      {svar.beskjed && (
        <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-pretty text-blekk-dempet">
          {svar.beskjed}
        </p>
      )}

      {svar.avklaringer.length > 0 && (
        <div className="mt-3.5 rounded-interaktiv border border-[color:var(--varsel-kant)] bg-[color:var(--varsel-flate)] px-3.5 py-3">
          <h4 className="font-sans text-[0.75rem] font-medium tracking-[0.1em] text-varsel uppercase">
            Dette må du avklare
          </h4>
          <ul className="mt-2 flex flex-col gap-1.5">
            {svar.avklaringer.map((a, i) => (
              <li
                key={i}
                className="text-[0.9375rem] leading-relaxed text-pretty text-varsel"
              >
                {a}
              </li>
            ))}
          </ul>
          {/*
            Svaret gis i det samme feltet som rettelsene. Det er ikke en
            begrensning — det er poenget: en avklaring er en opplysning
            dokumentet manglet, og den skal inn i dokumentet på samme måte
            som alt annet produsenten sier.
          */}
          <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-pretty text-varsel">
            Svar i feltet under, så kommer det inn i neste utgave.
          </p>
        </div>
      )}
    </div>
  );
}
