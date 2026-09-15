import { Container } from "./Container";
import type { Anmeldelse } from "@/content/anmeldelser";

/**
 * Anmeldelsesvegg i stram form.
 *
 * Formvalget: Soul Cake-casen viser sitater i full bredde, ett om gangen. Det
 * gir ett bevis per skjermhøyde. Styrken i navngitte anmeldelser ligger i
 * ANTALLET navngitte avsendere som sier det samme, og den effekten forsvinner
 * når man ser ett av gangen.
 *
 * Derfor: kort sitat, navn, selskap, i et rutenett som lar flere stå i samme
 * blikk. Ingen kort med skygge, ingen avatarer, ingen stjernerad per sitat —
 * bare hårfine skiller. Sitatet skal leses, ikke innrammes. At alle er 5 av 5
 * sies én gang i overskriften, ikke ni ganger i rutenettet.
 *
 * Navn og selskap er ikke pynt. Anonyme sitater er det svakeste sosiale
 * beviset som finnes, og leses av mange som oppdiktet. Kildetroverdighets-
 * litteraturen er det nærmeste vi kommer hard evidens her.
 *
 * Tekstene er ordrette utdrag fra Google. Fulltekst ligger i samme fil, så
 * utdraget kan etterprøves — se src/content/anmeldelser.ts.
 */
export function Anmeldelser({ anmeldelser }: { anmeldelser: Anmeldelse[] }) {
  return (
    <Container>
      <ul className="mt-10 grid gap-x-10 border-t border-kant sm:grid-cols-2 lg:grid-cols-3">
        {anmeldelser.map((a) => (
          <li key={a.navn} className="border-b border-kant py-7">
            <blockquote className="text-[0.975rem] leading-relaxed text-pretty">
              {a.sitat}
            </blockquote>
            <p className="mt-4 text-sm">
              <span className="font-medium">{a.navn}</span>
              {a.selskap && (
                <span className="text-blekk-dempet"> · {a.selskap}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
