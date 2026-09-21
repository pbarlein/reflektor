import Link from "next/link";

import { Container } from "@/components/Container";

export default function IkkeFunnet() {
  return (
    <Container>
      <div className="py-24 sm:py-32">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-blekk-dempet uppercase">
          404
        </p>
        <h1 className="display mt-5 text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-blekk sm:text-[3.5rem]">
          Denne rubrikken finnes ikke
        </h1>
        <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-relaxed text-pretty text-blekk-dempet">
          Lenken kan være gammel, eller rubrikken kan ha byttet adresse.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-interaktiv bg-aksent px-6 py-3.5 font-medium text-[color:var(--text-on-accent)] transition-colors hover:brightness-95 motion-reduce:transition-none"
        >
          Til forsiden
        </Link>
      </div>
    </Container>
  );
}
