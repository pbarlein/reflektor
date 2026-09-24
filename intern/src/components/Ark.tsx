import type { Ark as ArkData, Boks, Del } from "@/content/arktype";
import { BUNNLINJE } from "@/content/firma";

/**
 * Ensideren.
 *
 * ── ET ARK, IKKE EN SIDE SOM RULLER ───────────────────────────────────────
 *
 * Målene er A4 i millimeter, ikke piksler i prosent. Det er det samme arket
 * på skjerm og i PDF-en, og det er derfor det ser likt ut begge steder.
 *
 * Oppsettet kommer herfra, ikke fra Claude. Claude fyller ut delene; hvor
 * de havner og hvor mye plass de får, er bestemt her. Det er hele grunnen
 * til at dokumentet er én side.
 *
 * ── HODET ER MØRKT, OG DET ER ET BEVISST BRUDD ────────────────────────────
 *
 * Utskriftsversjonen som ble kastet hadde lyst hode, av hensyn til folk som
 * skriver ut på papir uten bakgrunnsgrafikk. Det var feil avveining: dette
 * dokumentet sendes som PDF og leses på skjerm, og produksjonsplanen
 * Reflektor faktisk har sendt ut har mørk topp. Malverket vinner over
 * blekksparing.
 */

const AKSENT = "#DE4826";
const MØRK = "#1C1310";

function Overskrift({ barn }: { barn: string }) {
  return (
    <h2
      className="font-sans text-[6.5pt] font-semibold tracking-[0.14em] uppercase"
      style={{ color: AKSENT }}
    >
      {barn}
    </h2>
  );
}

function Punkter({
  punkter,
  lys = false,
}: {
  punkter: string[];
  lys?: boolean;
}) {
  return (
    <ul className="mt-[2mm] flex flex-col gap-[1.6mm]">
      {punkter.map((p, i) => (
        <li key={i} className="flex gap-[2mm] text-[8pt] leading-[1.35]">
          <span
            aria-hidden
            className="mt-[1.1mm] h-[1.1mm] w-[1.1mm] shrink-0 rounded-full"
            style={{ background: lys ? AKSENT : AKSENT }}
          />
          <span style={{ color: lys ? "#E8E2DC" : "#3A302B" }}>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function Tabell({
  kolonner,
  rader,
}: {
  kolonner: string[];
  rader: string[][];
}) {
  return (
    <table className="mt-[2.5mm] w-full border-collapse">
      <thead>
        <tr>
          {kolonner.map((k, i) => (
            <th
              key={i}
              className="border-b pb-[1.4mm] pr-[3mm] text-left font-sans text-[6pt] font-semibold tracking-[0.1em] uppercase last:pr-0"
              style={{ borderColor: "#C9C2BB", color: "#6B625C" }}
            >
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rader.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                className="border-b py-[1.7mm] pr-[3mm] align-top text-[7.8pt] leading-[1.3] last:pr-0"
                style={{
                  borderColor: "#E4DFD9",
                  /* Første kolonne er nøkkelen man skanner etter. */
                  color: j === 0 ? MØRK : "#4A403A",
                  fontWeight: j === 0 ? 600 : 400,
                }}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MørkBoks({ boks }: { boks: Boks }) {
  return (
    <div
      className="rounded-[1.5mm] px-[5mm] py-[4.5mm]"
      style={{ background: MØRK }}
    >
      <h3
        className="font-sans text-[6.5pt] font-semibold tracking-[0.14em] uppercase"
        style={{ color: "#F0704F" }}
      >
        {boks.tittel}
      </h3>
      <Punkter punkter={boks.punkter} lys />
    </div>
  );
}

function Delen({ del }: { del: Del }) {
  switch (del.type) {
    case "fakta":
      return (
        <div
          className="grid gap-[4mm] border-b pb-[4mm]"
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, del.poster?.length ?? 1)}, minmax(0,1fr))`,
            borderColor: "#E4DFD9",
          }}
        >
          {(del.poster ?? []).map((p, i) => (
            <div key={i}>
              <p
                className="font-sans text-[5.8pt] font-semibold tracking-[0.12em] uppercase"
                style={{ color: "#8E8781" }}
              >
                {p.etikett}
              </p>
              <p
                className="mt-[1mm] text-[8.5pt] leading-[1.25]"
                style={{ color: MØRK }}
              >
                {p.verdi}
              </p>
            </div>
          ))}
        </div>
      );

    case "tabellOgBoks":
      return (
        <section>
          {del.tittel && <Overskrift barn={del.tittel} />}
          <div className="mt-[1mm] grid grid-cols-[1.75fr_1fr] gap-[5mm]">
            <Tabell kolonner={del.kolonner ?? []} rader={del.rader ?? []} />
            {del.boks && (
              <div className="mt-[2.5mm]">
                <MørkBoks boks={del.boks} />
              </div>
            )}
          </div>
        </section>
      );

    case "tabell":
      return (
        <section>
          {del.tittel && <Overskrift barn={del.tittel} />}
          <Tabell kolonner={del.kolonner ?? []} rader={del.rader ?? []} />
        </section>
      );

    case "toKolonner":
      return (
        <section className="grid grid-cols-2 gap-[6mm]">
          {(del.spalter ?? []).map((s, i) => (
            <div key={i}>
              <Overskrift barn={s.tittel} />
              <Punkter punkter={s.punkter} />
            </div>
          ))}
        </section>
      );

    case "kort3":
      return (
        <section className="grid grid-cols-3 gap-[3.5mm]">
          {(del.kort ?? []).map((k, i) => (
            <div
              key={i}
              className="rounded-[1.5mm] border px-[4mm] py-[3.5mm]"
              style={{ borderColor: "#DCD7D1", background: "#FBFAF8" }}
            >
              <p
                className="font-sans text-[6pt] font-semibold tracking-[0.12em] uppercase"
                style={{ color: AKSENT }}
              >
                {k.tittel}
              </p>
              <p
                className="mt-[1.5mm] text-[7.6pt] leading-[1.35]"
                style={{ color: "#4A403A" }}
              >
                {k.tekst}
              </p>
            </div>
          ))}
        </section>
      );

    case "avsnitt":
      return (
        <section>
          {del.tittel && <Overskrift barn={del.tittel} />}
          <p
            className="mt-[2mm] text-[8pt] leading-[1.45]"
            style={{ color: "#3A302B" }}
          >
            {del.tekst}
          </p>
        </section>
      );

    case "liste":
      return (
        <section>
          {del.tittel && <Overskrift barn={del.tittel} />}
          <Punkter punkter={del.punkter ?? []} />
        </section>
      );

    case "signatur":
      return (
        <section className="grid grid-cols-2 gap-[8mm] pt-[4mm]">
          {(del.felter ?? []).map((f, i) => (
            <div key={i}>
              <div
                className="h-[10mm] border-b"
                style={{ borderColor: "#8E8781" }}
              />
              <p
                className="mt-[1.5mm] font-sans text-[6.5pt] tracking-[0.06em]"
                style={{ color: "#6B625C" }}
              >
                {f.navn} · {f.rolle}
              </p>
            </div>
          ))}
        </section>
      );

    /* `topp` er hodet, ikke en del. Kommer den likevel, tegnes den ikke. */
    default:
      return null;
  }
}

export function Ark({
  ark,
  type,
  dato,
}: {
  ark: ArkData;
  type: string;
  dato: string;
}) {
  return (
    <div
      className="ark flex flex-col overflow-hidden bg-white"
      style={{ width: "210mm", height: "297mm" }}
    >
      <header
        className="shrink-0 px-[15mm] pt-[11mm] pb-[9mm]"
        style={{ background: MØRK }}
      >
        <div className="flex items-center gap-[3mm]">
          <span
            className="block h-[0.9mm] w-[11mm] rounded-full"
            style={{ background: AKSENT }}
          />
          <span
            className="font-sans text-[6pt] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "#B8AFA8" }}
          >
            {type}
          </span>
        </div>
        <h1
          className="display mt-[4mm] text-[21pt] leading-[1.1] tracking-[-0.015em]"
          style={{ color: "#FFFFFF" }}
        >
          {ark.overskrift}
        </h1>
        {ark.undertittel && (
          <p
            className="mt-[2.5mm] max-w-[150mm] text-[8.5pt] leading-[1.4]"
            style={{ color: "#C4BBB4" }}
          >
            {ark.undertittel}
          </p>
        )}
      </header>

      {/*
        `data-innhold` måles utenfra. Blir innholdet høyere enn arket, sier
        skjemaet fra i stedet for å klippe det i stillhet — og rettelsen
        ligger ett felt unna.
      */}
      <div
        data-innhold
        className="flex min-h-0 flex-1 flex-col gap-[5.5mm] px-[15mm] pt-[7mm] pb-[5mm]"
      >
        {ark.deler.map((d, i) => (
          <Delen key={`${d.type}-${i}`} del={d} />
        ))}
      </div>

      <footer
        className="flex shrink-0 items-center justify-between border-t px-[15mm] pt-[3mm] pb-[8mm] font-sans text-[5.8pt]"
        style={{ borderColor: "#E4DFD9", color: "#8E8781" }}
      >
        <span>{BUNNLINJE}</span>
        <span>{dato}</span>
      </footer>
    </div>
  );
}
