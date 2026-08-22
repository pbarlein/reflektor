import Link from "next/link";
import { Container } from "./Container";
import { site } from "@/content/site";

const lenker = [
  { href: "/tjenester", tekst: "Tjenester" },
  { href: "/arbeid", tekst: "Arbeid" },
  { href: "/blogg", tekst: "Blogg" },
  { href: "/om-oss", tekst: "Om oss" },
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
            href="/kontakt"
            className="rounded-full bg-aksent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-aksent-mork"
          >
            Kontakt oss
          </Link>
        </nav>
      </Container>
    </header>
  );
}
