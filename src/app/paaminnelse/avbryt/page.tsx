import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Knapp } from "@/components/Knapp";
import { gyldigSignatur } from "@/lib/avbrytsignatur";
import { harToken } from "@/lib/hubspotcrm";

export const metadata: Metadata = {
  title: "Avbryt påminnelse",
  robots: { index: false, follow: false },
};

/**
 * «Avbryt påminnelse» — ett trykk fra Påls mobil.
 *
 * SITUASJONEN DEN ER LAGET FOR: han ringer et lead, avtaler møtet på
 * telefonen, og vil ikke at HubSpot skal sende en påminnelse om å booke dagen
 * etter. Uten denne siden måtte han ha logget inn i HubSpot, funnet
 * kontakten og krysset av i et felt. Med den trykker han på en knapp i
 * varselet han uansett har framme.
 *
 * SIDEN ENDRER INGENTING SELV. Den viser hvem det gjelder og en knapp som
 * sender en POST. Se api/paaminnelse/avbryt for hvorfor.
 */
export default async function Avbryt({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; s?: string; status?: string }>;
}) {
  const { e = "", s = "", status } = await searchParams;
  const gyldig = Boolean(e) && gyldigSignatur(e, s);

  return (
    <section className="pt-14 pb-24 sm:pt-20">
      <Container>
        <div className="max-w-xl">
          {!gyldig ? (
            <>
              <h1 className="text-3xl text-balance sm:text-4xl">Ugyldig lenke</h1>
              <p className="mt-5 leading-relaxed text-blekk-dempet">
                Denne lenken hører ikke til noen påminnelse. Åpne lenken fra
                lead-varselet på nytt.
              </p>
            </>
          ) : status === "ok" ? (
            <>
              <h1 className="text-3xl text-balance sm:text-4xl">
                Påminnelsen er avbrutt.
              </h1>
              <p className="mt-5 leading-relaxed text-blekk-dempet">
                {e} får ingen automatisk påminnelse om å booke møte.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl text-balance sm:text-4xl">
                Avbryte påminnelsen til {e}?
              </h1>
              <p className="mt-5 leading-relaxed text-blekk-dempet">
                Da sender HubSpot ingen påminnelse om å booke møte. E-posten med
                presentasjon og bookinglenke er allerede sendt og påvirkes ikke.
              </p>

              {status && status !== "ok" && (
                <p role="alert" className="mt-6 text-aksent">
                  {status === "ikke-funnet"
                    ? "Fant ikke kontakten i HubSpot ennå. Prøv igjen om et minutt."
                    : status === "ikke-satt-opp"
                      ? "Koblingen til HubSpot er ikke satt opp ennå."
                      : "Noe gikk galt mot HubSpot. Prøv igjen."}
                </p>
              )}

              {!harToken() && !status && (
                <p className="mt-6 text-aksent">
                  Koblingen til HubSpot er ikke satt opp ennå.
                </p>
              )}

              <form
                method="post"
                action="/api/paaminnelse/avbryt"
                className="mt-8"
              >
                <input type="hidden" name="e" value={e} readOnly />
                <input type="hidden" name="s" value={s} readOnly />
                <Knapp type="submit">Avbryt påminnelse</Knapp>
              </form>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
