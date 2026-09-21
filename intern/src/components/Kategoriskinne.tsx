import { FASER, NYHETER, type KategoriId } from "@/content/kategorier";

/**
 * Kategorivelgeren.
 *
 * IDEEN: fem av de sju kategoriene er ikke sidestilte emner — de er STEG I
 * SAMME ARBEID, i fast rekkefølge. Den som leter etter noe, vet nesten
 * alltid hvilket steg hen står i. Derfor tegnes de som en skinne med
 * løpenummer og en strek imellom, ikke som sju like knapper.
 *
 * De to nyhetskategoriene står under, i en annen FORM — ikke bare på en
 * annen plass. De er ikke steg i noe, og skal ikke se ut som om de er det.
 *
 * FARGE SKILLER IKKE KATEGORIER, den markerer VALG. Sju hues ville brutt
 * merkevaredisiplinen i AGENTS.md og vært det tydeligste malsignalet som
 * finnes i et intranett. Oransje betyr én ting her: dette er valgt nå.
 *
 * TALLET UNDER HVER ETIKETT er antallet rubrikker. Det er ikke pynt — en
 * kategori med to rubrikker og en med ni skal ikke se like store ut når man
 * bestemmer seg for hvor man skal lete.
 */
export function Kategoriskinne({
  valgt,
  antall,
  velg,
}: {
  valgt: KategoriId | null;
  antall: Record<KategoriId, number>;
  velg: (id: KategoriId | null) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
          Produksjonsfasene
        </p>
        <button
          type="button"
          onClick={() => velg(null)}
          aria-pressed={valgt === null}
          className={`rounded-interaktiv px-3 py-1 text-[0.8125rem] font-medium transition-colors motion-reduce:transition-none ${
            valgt === null
              ? "bg-aksent text-[#1B0F0C]"
              : "text-pa-dyp-dempet hover:text-pa-dyp"
          }`}
        >
          Vis alle
        </button>
      </div>

      {/*
        SKINNA. Vannrett rulling under sm, med snap. Fem steg får ikke plass
        på en telefon, og å brekke dem i to rader ville ødelagt hele poenget:
        rekkefølgen ER informasjonen.

        STREKEN TEGNES PER STEG, ikke som én linje bak hele raden. Første
        versjon la den som ett absolutt posisjonert element over sporet —
        og da ble den STÅENDE mens skivene rullet under, fordi et absolutt
        barn av en rullecontainer måler seg mot den synlige bredden og ikke
        mot rulleinnholdet. På desktop så det riktig ut; på telefon gled
        tallene vekk fra sin egen skinne.

        Nå har hvert steg en halv strek til venstre og en til høyre, skjult
        i hver ende av raden. De følger skiven fordi de ER i den, og
        resultatet er identisk på alle bredder.
      */}
      <div className="relative mt-5">
        <ol className="relative flex snap-x snap-mandatory gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FASER.map((fase, i) => {
            const aktiv = valgt === fase.id;
            return (
              <li
                key={fase.id}
                className="min-w-[5.75rem] flex-1 snap-start sm:min-w-0"
              >
                <button
                  type="button"
                  onClick={() => velg(aktiv ? null : fase.id)}
                  aria-pressed={aktiv}
                  className="group flex w-full flex-col items-center gap-2 rounded-flate py-1 text-center"
                >
                  {/*
                    Skiven har sidens egen bakgrunnsfarge og ligger over
                    strekene — da ser det ut som om skinna går GJENNOM den,
                    uten at en strek krysser et tall.
                  */}
                  <span className="relative flex w-full justify-center">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 right-1/2 left-0 h-px bg-[color:var(--kant-pa-dyp)]"
                      />
                    )}
                    {i < FASER.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 right-0 left-1/2 h-px bg-[color:var(--kant-pa-dyp)]"
                      />
                    )}
                    <span
                      className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border font-sans text-[0.8125rem] font-medium tabular-nums transition-colors motion-reduce:transition-none ${
                        aktiv
                          ? "border-aksent bg-aksent text-[#1B0F0C]"
                          : "border-[color:var(--kant-pa-dyp)] bg-bunn text-pa-dyp-dempet group-hover:border-aksent/70 group-hover:text-pa-dyp"
                      }`}
                    >
                      {String(fase.nr).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`text-[0.8125rem] leading-tight font-medium transition-colors motion-reduce:transition-none ${
                      aktiv
                        ? "text-pa-dyp"
                        : "text-pa-dyp-dempet group-hover:text-pa-dyp"
                    }`}
                  >
                    {fase.kort}
                  </span>
                  <span className="text-[0.6875rem] tabular-nums text-pa-dyp-svak">
                    {antall[fase.id] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/*
        NYHETENE HAR EN ANNEN FORM. Ikke skive og nummer, men en brikke med
        prikk — samme språk som eyebrowen ellers i huset. Forskjellen i form
        er informasjonen: dette er ikke et steg i produksjonen.
      */}
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="font-sans text-xs font-medium tracking-[0.08em] text-pa-dyp-dempet uppercase">
          Nyheter
        </p>
        <div className="flex flex-wrap gap-2">
          {NYHETER.map((n) => {
            const aktiv = valgt === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => velg(aktiv ? null : n.id)}
                aria-pressed={aktiv}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors motion-reduce:transition-none ${
                  aktiv
                    ? "border-aksent bg-aksent text-[#1B0F0C]"
                    : "border-[color:var(--kant-pa-dyp)] text-pa-dyp-dempet hover:border-aksent/70 hover:text-pa-dyp"
                }`}
              >
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${
                    aktiv ? "bg-[#1B0F0C]" : "bg-aksent"
                  }`}
                />
                {n.navn}
                <span className="tabular-nums opacity-70">
                  {antall[n.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
