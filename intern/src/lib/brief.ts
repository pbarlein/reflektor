import type Anthropic from "@anthropic-ai/sdk";

import {
  BRIEFVERKTOY,
  briefInstruks,
  briefSkjema,
  lesBrief,
  type Brief,
} from "@/content/brieftype";
import type { Mal } from "@/content/maltype";
import type { Epost } from "@/lib/gmail";

/**
 * Trekker briefen ut av e-posten.
 *
 * Eget kall, og ikke en del av researchen, av to grunner. Researchen lagres
 * i tretti dager; e-posten er fersk hver gang, og en ny brief i går skal
 * ikke bli borte bak en research fra forrige måned. Og modellen gjør én ting
 * her — lese og trekke ut — mens researchen søker og vurderer. To kall som
 * hver gjør én ting, treffer bedre enn ett som gjør begge.
 */

const MODELL = "claude-opus-5";
const MAKS_TOKENS = 8_000;
/** Lesing er raskere enn søking, men åtte tråder er fortsatt mye tekst. */
const TIDSGRENSE_MS = 45_000;

export async function kjorBrief({
  klient,
  mal,
  kunde,
  poster,
  signal,
}: {
  klient: Anthropic;
  mal: Mal;
  kunde: string;
  poster: readonly Epost[];
  signal?: AbortSignal;
}): Promise<Brief | null> {
  if (!poster.length) return null;

  const klokke = new AbortController();
  const frist = setTimeout(() => klokke.abort(), TIDSGRENSE_MS);
  signal?.addEventListener("abort", () => klokke.abort(), { once: true });

  try {
    const strøm = klient.messages.stream(
      {
        model: MODELL,
        max_tokens: MAKS_TOKENS,
        thinking: { type: "adaptive" },
        system:
          "Du leser e-post på vegne av en produsent i et norsk innholdsbyrå, og trekker ut det som gjelder ett bestemt dokument. Du tolker ikke, og du fyller ikke ut hull. Finner du ingenting, sier du det.",
        tools: [
          {
            name: BRIEFVERKTOY,
            description: "Leverer det du fant. Kalles én gang.",
            input_schema: briefSkjema() as Anthropic.Tool["input_schema"],
          },
        ],
        tool_choice: { type: "tool", name: BRIEFVERKTOY },
        messages: [
          { role: "user", content: briefInstruks(mal, kunde, poster) },
        ],
      },
      { signal: klokke.signal },
    );

    const svar = await strøm.finalMessage();
    const bruk = svar.content.find(
      (b) => b.type === "tool_use" && b.name === BRIEFVERKTOY,
    );
    return bruk && bruk.type === "tool_use"
      ? lesBrief(bruk.input, poster)
      : null;
  } catch (e) {
    if (signal?.aborted) throw e;
    console.error("brief feilet, dokumentet lages uten", e);
    return null;
  } finally {
    clearTimeout(frist);
  }
}
