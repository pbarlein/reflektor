import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Container } from "@/components/Container";
import { Knapp } from "@/components/Knapp";
import { signer } from "@/lib/avbrytsignatur";
import { harToken, hentPlanlagte } from "@/lib/hubspotcrm";
import {
  osloTekst,
  PAAMINNELSE_KAPSEL,
  paaminnelseTekst,
} from "@/lib/paaminnelse";

export const metadata: Metadata = {
  title: "Påminnelser",
  robots: { index: false, follow: false },
};

/** Listen skal være fersk hver gang den åpnes. */
export const dynamic = "force-dynamic";

/**
 * Oversikt over leads med en påminnelse på vei.
 *
 * HVORFOR DEN FINNES I TILLEGG TIL KNAPPEN I VARSELET. Leads fra Meta
 * kommer ikke gjennom nettsidens skjema, så Pål får ikke noe varsel med
 * knapp for dem. HubSpot varsler ham, og Cowork legger lenken hit inn i det
 * varselet.
 *
 * BESKYTTELSEN ER EN NØKKEL I EN INFORMASJONSKAPSEL, ikke innlogging. Siden
 * viser navn, bedrift og e-post på leads — det skal ikke ligge åpent — men
 * et påloggingssystem for én bruker er feil verktøy. Nøkkelen byttes mot
 * kapselen i middleware.ts.
 */
export default async function Paaminnelser() {
  const kapsel = (await cookies()).get(PAAMINNELSE_KAPSEL)?.value;
  const nokkel = process.env.PAAMINNELSE_NOKKEL;

  if (!nokkel || !kapsel || kapsel !== nokkel) {
    return (
      <section className="pt-14 pb-24 sm:pt-20">
        <Container>
          <h1 className="text-3xl text-balance sm:text-4xl">Ingen tilgang</h1>
        </Container>
      </section>
    );
  }

  // Listen er allerede renset for påminnelser som har gått, se hubspotcrm.ts.
  const venter = await hentPlanlagte();

  return (
    <section className="pt-14 pb-24 sm:pt-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl text-balance sm:text-4xl">Påminnelser</h1>
          <p className="mt-5 leading-relaxed text-blekk-dempet">
            Leads som får en automatisk påminnelse om å booke møte. Har du
            allerede avtalt med dem, avbryter du den her.
          </p>

          {!harToken() ? (
            <p className="mt-8 text-aksent">
              Ikke satt opp ennå. Tilgangsnøkkelen til HubSpot mangler.
            </p>
          ) : venter === null ? (
            <p className="mt-8 text-aksent">
              Fikk ikke kontakt med HubSpot. Prøv igjen om litt.
            </p>
          ) : venter.length === 0 ? (
            <p className="mt-8 text-blekk-dempet">
              Ingen påminnelser på vei akkurat nå.
            </p>
          ) : (
            <ul className="mt-10 grid gap-4">
              {venter.map((l) => (
                <li
                  key={l.epost}
                  className="rounded-flate border border-kant p-5 sm:p-6"
                >
                  <p className="display text-xl">{l.navn || l.epost}</p>
                  <p className="mt-1 text-blekk-dempet">
                    {[l.bedrift, l.kilde].filter(Boolean).join(" · ")}
                  </p>
                  {l.planlagtEpost1 ? (
                    <p className="mt-3 text-[0.9375rem] text-blekk-dempet">
                      Presentasjon sendes {osloTekst(l.planlagtEpost1)}
                    </p>
                  ) : null}
                  <p
                    className={`${l.planlagtEpost1 ? "mt-1" : "mt-3"} text-[0.9375rem] text-blekk-dempet`}
                  >
                    Påminnelse sendes {paaminnelseTekst(l.sendtInn)}
                  </p>
                  <form
                    method="post"
                    action="/api/paaminnelse/avbryt"
                    className="mt-5"
                  >
                    <input type="hidden" name="e" value={l.epost} readOnly />
                    <input
                      type="hidden"
                      name="s"
                      value={signer(l.epost) ?? ""}
                      readOnly
                    />
                    <input
                      type="hidden"
                      name="retur"
                      value="/paaminnelse"
                      readOnly
                    />
                    <Knapp type="submit" vekt="sekundar" storrelse="kompakt">
                      Avbryt påminnelse
                    </Knapp>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
