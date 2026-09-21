import { Container } from "@/components/Container";
import { Hub } from "@/components/Hub";
import { Maalet } from "@/components/Maalet";
import { RUBRIKKER } from "@/content/rubrikker";
import { fornavn, krevBruker } from "@/lib/tilgang";

/**
 * Forsiden: målet, og deretter alt innholdet.
 *
 * SERVERKOMPONENT. Rubrikkene sendes ned som props til <Hub>, som er den
 * eneste klientdelen. Innholdet går altså over ledningen som HTML, ikke som
 * JavaScript — se kommentaren i Hub.tsx.
 *
 * `krevBruker()` OG IKKE BARE PROXYEN. Next sier selv at proxy-laget er en
 * optimistisk sjekk, ikke en autorisasjonsløsning. Se src/lib/tilgang.ts.
 */
export default async function Forside() {
  const bruker = await krevBruker();

  return (
    <Container bred>
      <div className="py-10 sm:py-14">
        {/*
          HILSENEN ER LITEN OG STÅR FØRST. Den er ikke sidens overskrift —
          <h1> er svaret i Målet-seksjonen. En «Velkommen, Magne» i
          display-grad ville brukt sidens tyngste typografi på sidens minst
          viktige setning.
        */}
        <p className="text-[0.9375rem] text-pa-dyp-dempet">
          Hei, {fornavn(bruker)}.
        </p>

        <div className="mt-6 sm:mt-8">
          <Maalet />
        </div>

        <div className="mt-14 sm:mt-20">
          <Hub rubrikker={RUBRIKKER} />
        </div>
      </div>
    </Container>
  );
}
