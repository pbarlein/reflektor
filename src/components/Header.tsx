import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * Minimal header mens siden designes på nytt.
 *
 * Navigasjonen bevisst utelatt – den er et designvalg og bygges sammen med
 * resten. Logoen står fordi den er merkevare, ikke layout.
 */
export function Header() {
  return (
    <header className="border-b border-kant">
      <Container>
        <div className="py-5">
          <Link href="/" aria-label="Reflektor – til forsiden">
            <Logo variant="merke" className="h-8 text-base" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
