import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * Header ligger på mørk flate, som på dagens side.
 *
 * «Pris» er første menypunkt og peker til /sosiale-medier-byra. Åpen pris er
 * Reflektors tydeligste differensiering – ikke bytt det mot «Tjenester».
 */
const lenker = [
  { href: "/sosiale-medier-byra", tekst: "Pris" },
  { href: "/vart-arbeid", tekst: "Vårt arbeid" },
  { href: "/om-oss", tekst: "Om oss" },
  { href: "/faq", tekst: "FAQ" },
  { href: "/blogg", tekst: "Blogg" },
];

export function Header() {
  return (
    <header className="bg-mork text-blekk-invers">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <Link href="/" aria-label="Reflektor – til forsiden">
            <Logo variant="merke" pa="mork" className="h-8 text-base" />
          </Link>
          <ul className="hidden items-center gap-8 text-sm md:flex">
            {lenker.map((lenke) => (
              <li key={lenke.href}>
                <Link
                  href={lenke.href}
                  className="text-blekk-invers/70 transition-colors hover:text-blekk-invers"
                >
                  {lenke.tekst}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/kontaktoss"
            className="knapp-skjev rounded-[5px] bg-aksent px-5 py-2 text-sm font-medium text-white hover:bg-aksent-mork"
          >
            Ta kontakt
          </Link>
        </nav>
      </Container>
    </header>
  );
}
