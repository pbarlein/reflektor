import Link from "next/link";
import { Container } from "./Container";
import { site, tjenester } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-kant py-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{site.navn}</p>
            <p className="mt-2 text-sm text-blekk-dempet">{site.tagline}</p>
          </div>
          <nav aria-label="Tjenester">
            <p className="text-sm font-medium">Tjenester</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-dempet">
              {tjenester.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tjenester/${t.slug}`} className="hover:text-blekk">
                    {t.navn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Selskap">
            <p className="text-sm font-medium">Selskap</p>
            <ul className="mt-3 space-y-2 text-sm text-blekk-dempet">
              <li><Link href="/om-oss" className="hover:text-blekk">Om oss</Link></li>
              <li><Link href="/arbeid" className="hover:text-blekk">Kundecaser</Link></li>
              <li><Link href="/blogg" className="hover:text-blekk">Blogg</Link></li>
              <li><Link href="/kontakt" className="hover:text-blekk">Kontakt</Link></li>
              <li><Link href="/personvern" className="hover:text-blekk">Personvern</Link></li>
            </ul>
          </nav>
        </div>
        <p className="mt-10 text-sm text-blekk-dempet">
          © {new Date().getFullYear()} {site.navn}. {site.kontakt.sted}.
        </p>
      </Container>
    </footer>
  );
}
