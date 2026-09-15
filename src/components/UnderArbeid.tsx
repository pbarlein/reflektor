import { Container } from "./Container";

/**
 * Midlertidig innhold mens siden designes på nytt.
 *
 * Rutene holdes i live med vilje. Redirect-kartet peker på dem, lenkesjekken
 * krever at de finnes, og /sosiale-medier-byra er Final URL i Google Ads.
 * En rute som forsvinner er en 404 vi må rydde opp i senere.
 *
 * Ingen design her. Siden er bevisst naken til den bygges på nytt.
 */
export function UnderArbeid({ sti }: { sti: string }) {
  return (
    <section className="py-24">
      <Container>
        <h1 className="text-2xl font-medium">Under arbeid</h1>
        <p className="mt-4 text-blekk-dempet">
          Denne siden bygges på nytt. Ruten <code>{sti}</code> er holdt i live
          så lenker og sporing fortsatt virker.
        </p>
      </Container>
    </section>
  );
}
