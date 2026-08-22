import Link from "next/link";
import { Container } from "@/components/Container";
import { site, tjenester } from "@/content/site";

export default function Forside() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-blekk-dempet text-pretty">
            {site.ingress}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/gratis-strategimote"
              className="rounded-full bg-aksent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
            >
              Book et gratis strategimøte
            </Link>
            <Link
              href="/arbeid"
              className="rounded-full border border-kant px-6 py-3 text-sm font-medium transition-colors hover:bg-flate-dempet"
            >
              Se arbeidet vårt
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-kant py-20">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">Hva vi gjør</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-kant bg-kant sm:grid-cols-2 lg:grid-cols-3">
            {tjenester.map((tjeneste) => (
              <li key={tjeneste.slug} className="bg-flate">
                <Link
                  href={`/tjenester/${tjeneste.slug}`}
                  className="block h-full p-8 transition-colors hover:bg-flate-dempet"
                >
                  <h3 className="font-medium">{tjeneste.navn}</h3>
                  <p className="mt-2 text-sm text-blekk-dempet text-pretty">
                    {tjeneste.ingress}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
