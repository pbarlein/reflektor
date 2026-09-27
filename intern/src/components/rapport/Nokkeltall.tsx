import type { Nokkeltall as Tall } from "@/content/rapporttype";
import { kr, prosent, tall } from "@/lib/rapportformat";

/**
 * De fire tallene.
 *
 * ── HVORFOR ETT AV DEM KAN VÆRE SVART ─────────────────────────────────────
 *
 * Pris per lead er det ene tallet dommen henger på. Er varselet aktivt,
 * snus kortet — mørk flate, tallet i varselfargen — slik at det ikke er
 * mulig å lese de fire uten å se hvilket som er problemet.
 *
 * De tre andre er alltid like. Framheving virker bare når den er sjelden.
 */

function Kort({
  verdi,
  etikett,
  under,
  framhevet = false,
}: {
  verdi: string;
  etikett: string;
  under?: string;
  framhevet?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between px-4 py-4 ${
        framhevet ? "bg-[color:var(--flate-dyp,#1C1310)]" : "bg-kort"
      }`}
    >
      <p
        className={`font-sans text-[1.75rem] leading-none font-semibold tabular-nums ${
          framhevet ? "text-[color:var(--aksent-pa-dyp)]" : "text-blekk"
        }`}
      >
        {verdi}
      </p>
      <p
        className={`mt-2 text-[0.8125rem] leading-snug ${
          framhevet ? "text-[#cfcac4]" : "text-blekk-dempet"
        }`}
      >
        {etikett}
        {under && (
          <>
            <br />
            <span className={framhevet ? "text-[#a8a29c]" : "text-blekk-svak"}>
              {under}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export function Nokkeltall({
  kpis,
  uke,
  varsel,
}: {
  kpis: Tall;
  uke: number;
  varsel: boolean;
}) {
  const c4 = kpis.cpl_4w;
  const c90 = kpis.customers_90d;
  const sw = kpis.spend_week;
  const lw = kpis.leads_week;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-flate border border-kant bg-[color:var(--kant)] sm:grid-cols-4">
      <Kort
        framhevet={varsel}
        verdi={c4.cpl === null ? "Ingen leads" : kr(c4.cpl)}
        etikett="Pris per lead, 4 uker"
        under={`${c4.leads} leads for ${kr(c4.spend)}${
          c4.change_pct !== null
            ? ` · ${prosent(c4.change_pct)} mot 4 uker før`
            : ""
        }`}
      />
      <Kort
        verdi={tall(lw.value)}
        etikett={`Leads uke ${uke}`}
        under={`Meta ${lw.meta} · Google ${lw.google}`}
      />
      <Kort
        verdi={tall(c90.count)}
        etikett="Kunder fra annonser, 90 dager"
        under={
          c90.cost_per_customer
            ? `${kr(c90.cost_per_customer)} per kunde`
            : "ingen ennå"
        }
      />
      <Kort
        verdi={kr(sw.value)}
        etikett={`Brukt uke ${uke}`}
        under={`Meta ${tall(sw.meta)} · Google ${tall(sw.google)}`}
      />
    </div>
  );
}
