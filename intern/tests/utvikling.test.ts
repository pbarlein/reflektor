import assert from "node:assert/strict";
import test from "node:test";

import { devInnloggingTillatt } from "../src/lib/utvikling.ts";

/**
 * Dev-innloggingen er den eneste veien inn uten Google. Den er gjerdet inne
 * av to uavhengige betingelser, og testen her er at BEGGE må holde.
 *
 * Den viktigste linja er den siste: i en Vercel-deploy er NODE_ENV alltid
 * «production» — også for preview. Døra skal da ikke finnes, uansett hva
 * noen har satt env-variabelen til.
 */
/*
 * `process.env` er ikke et vanlig objekt: Node avviser en
 * `defineProperty` som ikke er configurable, writable OG enumerable. Vanlig
 * tilordning virker derimot fint i kjøretiden — det er bare typene som
 * merker NODE_ENV som skrivebeskyttet. Castet er derfor til TypeScript,
 * ikke til Node.
 */
const env = process.env as Record<string, string | undefined>;

function sett(navn: string, verdi: string | undefined): void {
  if (verdi === undefined) delete env[navn];
  else env[navn] = verdi;
}

function med(nodeEnv: string | undefined, flagg: string | undefined): boolean {
  const forrigeEnv = env.NODE_ENV;
  const forrigeFlagg = env.INTERN_DEV_INNLOGGING;
  try {
    sett("NODE_ENV", nodeEnv);
    sett("INTERN_DEV_INNLOGGING", flagg);
    return devInnloggingTillatt();
  } finally {
    sett("NODE_ENV", forrigeEnv);
    sett("INTERN_DEV_INNLOGGING", forrigeFlagg);
  }
}

test("åpen kun når begge betingelsene holder", () => {
  assert.equal(med("development", "true"), true);
});

test("stengt i produksjon, uansett hva flagget står på", () => {
  assert.equal(med("production", "true"), false);
  assert.equal(med("production", undefined), false);
});

test("stengt uten flagget, også lokalt", () => {
  assert.equal(med("development", undefined), false);
  assert.equal(med("development", "false"), false);
  // Ingen løs sannhetsverdi: kun den eksakte strengen «true».
  assert.equal(med("development", "1"), false);
  assert.equal(med("development", "TRUE"), false);
});

test("stengt i test-miljø uten flagget", () => {
  assert.equal(med("test", undefined), false);
});
