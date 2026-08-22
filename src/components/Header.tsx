import Link from "next/link";
import { Container } from "./Container";
import { site, landingssider } from "@/content/site";

export function Header() {
  return (
    <header className="border-b border-kant">
      <Container>
        <nav className="flex items-center justify-between py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {site.navn}
          </Link>
          <ul className="hidden items-center gap-8 text-sm md:flex">
            {/* Navigasjonen speiler annonsegruppene i Google Ads – de tre
                kommersielle landingssidene kommer først. */}
            {landingssider.map((side) => (
              <li key={side.slug}>
                <Link
                  href={`/${side.slug}`}
                  className="text-blekk-dempet transition-colors hover:text-blekk"
                >
                  {side.navn}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vart-arbeid"
                className="text-blekk-dempet transition-colors hover:text-blekk"
              >
                Vårt arbeid
              </Link>
            </li>
            <li>
              <Link
                href="/om-oss"
                className="text-blekk-dempet transition-colors hover:text-blekk"
              >
                Om oss
              </Link>
            </li>
          </ul>
          <Link
            href="/kontaktoss"
            className="rounded-full bg-aksent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
          >
            Kontakt oss
          </Link>
        </nav>
      </Container>
    </header>
  );
}
