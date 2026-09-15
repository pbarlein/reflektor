import { Container } from "./Container";
import { TbdMarkor } from "./Slot";

/**
 * Anmeldelsesvegg i stram form.
 *
 * Formvalget: Soul Cake-casen viser sitater i full bredde, ett om gangen. Det
 * gir ett bevis per skjermhøyde. Navngitte anmeldelser er det sterkeste
 * beviset Reflektor har, og styrken ligger i ANTALLET navngitte avsendere som
 * sier det samme — den effekten forsvinner når man ser ett av gangen.
 *
 * Derfor: kort sitat, navn, selskap, i et rutenett som lar flere stå i samme
 * blikk. Ingen kort med skygge, ingen avatarer, ingen stjernerad per sitat —
 * bare hårfine skiller. Sitatet skal leses, ikke innrammes.
 *
 * Navn og selskap er ikke pynt. Anonyme sitater («en fornøyd kunde») er det
 * svakeste sosiale beviset som finnes, og leses av mange som oppdiktet. Et
 * sitat uten avsender skal heller stå ut.
 *
 * Kilden er Googles anmeldelser av Reflektor. De lå bak Elfsight-widgeten på
 * Squarespace-siden, altså i JavaScript og aldri i HTML, så de finnes ikke i
 * noe crawl. Tekstene må hentes ut manuelt — de er ikke oppfunnet her.
 */
export type Anmeldelse = { id: string; verdi: string | null };

export function Anmeldelser({ anmeldelser }: { anmeldelser: Anmeldelse[] }) {
  return (
    <Container>
      <ul className="mt-10 grid gap-x-10 border-t border-kant sm:grid-cols-2 lg:grid-cols-3">
        {anmeldelser.map(({ id, verdi }) => {
          // Format: sitat | navn | selskap
          const delt = verdi?.split("|").map((d) => d.trim()) ?? null;
          return (
            <li key={id} className="border-b border-kant py-7">
              {delt ? (
                <>
                  <blockquote className="text-[0.975rem] leading-relaxed text-balance">
                    {delt[0]}
                  </blockquote>
                  <p className="mt-4 text-sm">
                    <span className="font-medium">{delt[1]}</span>
                    {delt[2] && (
                      <span className="text-blekk-dempet"> · {delt[2]}</span>
                    )}
                  </p>
                </>
              ) : (
                <TbdMarkor id={id} />
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
