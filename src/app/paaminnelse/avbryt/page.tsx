import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Knapp } from "@/components/Knapp";
import { gyldigSignatur } from "@/lib/avbrytsignatur";
import { harToken } from "@/lib/hubspotcrm";
import { avbrytBeskjed } from "@/lib/paaminnelse";

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
  const beskjed = avbrytBeskjed(status);

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
              {/*
                TO FEIL RETTET 06.10.2026.

                «HubSpot sender ingen påminnelse» var sant da siden ble
                skrevet. Fra 04.10 går både presentasjonen og påminnelsen
                fra Påls egen Gmail, gjennom jobben vår — se lib/gmail.ts.

                «E-posten er allerede sendt» var ikke alltid sant. Kommer
                leadet utenom sendevinduet 07–21, ligger presentasjonen i kø
                til kl. 08:00 neste morgen, og oversikten på /paaminnelse
                sier det selv med «Presentasjon sendes …». Setningen her
                påsto det motsatte.
              */}
              <p className="mt-5 leading-relaxed text-blekk-dempet">
                Da får {e} ingen påminnelse om å booke møte. Presentasjonen og
                bookinglenken er ikke berørt — er den ikke sendt ennå, går den
                som planlagt.
              </p>

              {beskjed?.feil && (
                <p role="alert" className="mt-6 text-aksent">
                  {beskjed.tekst}
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
