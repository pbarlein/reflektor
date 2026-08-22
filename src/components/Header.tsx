import Link from "next/link";
import { Container } from "./Container";
import { site } from "@/content/site";

/**
 * Navigasjonen speiler dagens side.
 *
 * Merk at «Pris» er første menypunkt og peker til /sosiale-medier-byra. Det er
 * et bevisst posisjoneringsvalg – åpen pris er Reflektors tydeligste
 * differensiering. Ikke bytt det mot et generisk «Tjenester».
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
    <header className="border-b border-kant">
      <Container>
        <nav className="flex items-center justify-between py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {site.navn}
          </Link>
          <ul className="hidden items-center gap-8 text-sm md:flex">
            {lenker.map((lenke) => (
              <li key={lenke.href}>
                <Link
                  href={lenke.href}
                  className="text-blekk-dempet transition-colors hover:text-blekk"
                >
                  {lenke.tekst}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/kontaktoss"
            className="rounded-full bg-aksent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
          >
            Ta kontakt
          </Link>
        </nav>
      </Container>
    </header>
  );
}
