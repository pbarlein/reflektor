import type Anthropic from "@anthropic-ai/sdk";

import type { Mal } from "@/content/maltype";
import {
  RESEARCHVERKTOY,
  lesResearch,
  researchInstruks,
  researchSkjema,
  type Research,
} from "@/content/researchtype";

/**
 * Researchfasen.
 *
 * ── HVORFOR DET ER TO KALL OG IKKE ETT ────────────────────────────────────
 *
 * Alternativet var å gi modellen både nettsøk og dokumentverktøyet i samme
 * kall, og be den undersøke først. Det ville vært billigere, og det ville
 * vært upålitelig: med begge verktøyene tilgjengelig kan den hoppe rett til
 * å skrive, og da har vi ingen research — bare håpet om en.
 *
 * To kall gir tre ting vi trenger. Researchen kan VISES til produsenten før
 * dokumentet lages, med kilder, slik at den kan overprøves. Fremdriften blir
 * ærlig: «undersøker» og «skriver» er to forskjellige ting, og de tar
 * forskjellig tid. Og researchen kan gjenbrukes — den om Jordbærpikene
 * endrer seg ikke mellom en produksjonsplan og en opptaksliste.
 *
 * ── NETTSØK ER ET SERVERVERKTØY ───────────────────────────────────────────
 *
 * Søkene kjører hos Anthropic, ikke her. Vi ser dem i strømmen som
 * `server_tool_use`, og sender søkeordene videre til fremdriftsvisningen —
 * det er den eneste framdriftslinjen i systemet som viser hva som faktisk
 * skjer, med modellens egne ord.
 */

const MODELL = "claude-opus-5";
/*
 * ── TALLENE ER JUSTERT ETTER FØRSTE EKTE KJØRING ──────────────────────────
 *
 * Med ti søk og 8 000 tokens brukte researchen over et minutt, og
 * produsenten satt og så på et grensesnitt som ikke beveget seg. Seks søk
 * er nok til å slå opp en norsk småbedrift fra flere vinkler; det syvende
 * er som regel en variasjon av det sjette.
 *
 * Takket er samtidig hevet. Søkeresultater er lange, og med 8 000 tokens
 * kunne svaret bli kuttet FØR verktøykallet — da fikk vi ingen research i
 * det hele tatt, etter å ha betalt for alle søkene.
 */
const MAKS_TOKENS = 16_000;
/*
 * ── TRE SØK, NED FRA SEKS ─────────────────────────────────────────────────
 *
 * Bestilt 24.09.2026: «bruk mindre tid på nettet». Med publiseringstallene
 * i instruksen er nettsøket ikke lenger hovedkilden — det er to spørsmål
 * tallene ikke svarer på: hvem de selger til, og hva som er ferskt. Tre søk
 * dekker begge med margin, og researchen ble samtidig tolv sekunder
 * raskere.
 */
const MAKS_SOK = 3;
/** `pause_turn` betyr at serververktøyet trenger en runde til. */
const MAKS_FORTSETTELSER = 2;
/*
 * ── HARD TIDSGRENSE ───────────────────────────────────────────────────────
 *
 * Researchen er et gode, ikke en forutsetning. Bruker den mer enn dette,
 * er dokumentet uten research bedre enn dokumentet som aldri kom.
 */
const TIDSGRENSE_MS = 75_000;

export async function kjorResearch({
  klient,
  mal,
  kunde,
  lokasjon,
  publisering = "",
  strategi = "",
  påSøk,
  signal,
}: {
  klient: Anthropic;
  mal: Mal;
  kunde: string;
  lokasjon: string;
  /** Målte publiseringstall, ferdig formatert. Tom streng når vi ikke har dem. */
  publisering?: string;
  /** Lenken til SoMe-strategien, hvis vi har den. */
  strategi?: string;
  påSøk: (spørring: string) => void;
  signal?: AbortSignal;
}): Promise<Research | null> {
  const meldinger: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: researchInstruks(mal, kunde, lokasjon, publisering, strategi),
    },
  ];

  /*
   * Egen klokke, koblet til brukerens avbrudd. Den stoppes i `finally` —
   * en timer som lever videre etter at researchen er ferdig, avbryter
   * neste fase.
   */
  const klokke = new AbortController();
  const frist = setTimeout(() => klokke.abort(), TIDSGRENSE_MS);
  signal?.addEventListener("abort", () => klokke.abort(), { once: true });

  try {
    for (let runde = 0; runde <= MAKS_FORTSETTELSER; runde++) {
      const strøm = klient.messages.stream(
        {
          model: MODELL,
          max_tokens: MAKS_TOKENS,
          thinking: { type: "adaptive" },
          system:
            "Du er researcher for et norsk innholdsbyrå, og du svarer på ett spørsmål: hva skal vi lage for denne kunden. Målte publiseringstall veier tyngre enn noe en bedrift skriver om seg selv. Du søker sparsomt, du oppgir kilde på alt du henter fra nettet, og du sier tydelig fra om det du ikke fant.",
          tools: [
            {
              type: "web_search_20260209",
              name: "web_search",
              max_uses: MAKS_SOK,
            },
            {
              name: RESEARCHVERKTOY,
              description:
                "Leverer det du fant ut. Kalles én gang, når du er ferdig med å søke.",
              input_schema: researchSkjema() as Anthropic.Tool["input_schema"],
            },
          ],
          messages: meldinger,
        },
        { signal },
      );

      /*
       * Søkeordene ligger i `input` på en `server_tool_use`-blokk, og de
       * kommer bit for bit. Vi samler dem per blokkindeks og leser dem når
       * blokken lukkes — det er først da JSON-et er helt.
       */
      const under: Record<number, { erSøk: boolean; rå: string }> = {};

      for await (const h of strøm) {
        if (h.type === "content_block_start") {
          under[h.index] = {
            erSøk:
              h.content_block.type === "server_tool_use" &&
              h.content_block.name === "web_search",
            rå: "",
          };
        } else if (
          h.type === "content_block_delta" &&
          h.delta.type === "input_json_delta"
        ) {
          const b = under[h.index];
          if (b?.erSøk) b.rå += h.delta.partial_json;
        } else if (h.type === "content_block_stop") {
          const b = under[h.index];
          if (b?.erSøk && b.rå) {
            try {
              const q = (JSON.parse(b.rå) as { query?: unknown }).query;
              if (typeof q === "string" && q.trim())
                påSøk(q.trim().slice(0, 120));
            } catch {
              /* Halvferdig JSON er ikke verdt en feilmelding. */
            }
          }
          delete under[h.index];
        }
      }

      const svar = await strøm.finalMessage();

      const bruk = svar.content.find(
        (b) => b.type === "tool_use" && b.name === RESEARCHVERKTOY,
      );
      if (bruk && bruk.type === "tool_use") {
        const r = lesResearch(bruk.input);
        return r ? { ...r, hentet: new Date().toISOString() } : null;
      }

      /*
       * `pause_turn` er serververktøyet som ber om mer tid. Vi sender svaret
       * tilbake uendret og lar den fortsette. Alt annet betyr at den ble
       * ferdig uten å levere, og da er det ingenting å vente på.
       */
      if (svar.stop_reason !== "pause_turn") return null;
      meldinger.push({ role: "assistant", content: svar.content });
    }

    return null;
  } catch (e) {
    /*
     * Tidsavbrudd og nettverksfeil skal ikke stoppe dokumentet. Brukerens
     * eget avbrudd derimot skal boble videre — da har hen lukket fanen.
     */
    if (signal?.aborted) throw e;
    console.error("research feilet, dokumentet lages uten", e);
    return null;
  } finally {
    clearTimeout(frist);
  }
}
