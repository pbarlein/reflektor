import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test, { after, before } from "node:test";

import {
  MAKS_MELDINGER,
  type Melding,
  hentSamtale,
  lagreSamtale,
  slettSamtale,
} from "../src/lib/samtalelager.ts";

/**
 * Samtalen om én rapport.
 *
 * Testene kjører mot disk-varianten, som er samme kodevei som Blob
 * bortsett fra selve lagringen. Se `leselager.test.ts` for samme grep.
 */

const HJEM = process.cwd();
let mappe: string;

before(async () => {
  assert.notEqual(process.env.NODE_ENV, "production");
  assert.ok(!process.env.BLOB_READ_WRITE_TOKEN);
  mappe = await mkdtemp(join(tmpdir(), "samtalelager-"));
  process.chdir(mappe);
});

after(async () => {
  process.chdir(HJEM);
  await rm(mappe, { recursive: true, force: true });
});

const bruker = (t: string): Melding => ({ role: "user", content: t });
const svar = (t: string): Melding => ({
  role: "assistant",
  content: [{ type: "text", text: t }],
});
const kall = (idn: string): Melding => ({
  role: "assistant",
  content: [{ type: "tool_use", id: idn, name: "kryss_av_steg", input: {} }],
});
const resultat = (idn: string): Melding => ({
  role: "user",
  content: [{ type: "tool_result", tool_use_id: idn, content: "ok" }],
});

test("en ulest samtale er tom", async () => {
  assert.deepEqual(await hentSamtale("m", "W1", "a@reflektor.no"), []);
});

test("det som lagres, leses tilbake", async () => {
  await lagreSamtale("m", "W2", "a@reflektor.no", [
    bruker("Hei"),
    svar("Hei."),
  ]);
  const ut = await hentSamtale("m", "W2", "a@reflektor.no");
  assert.equal(ut.length, 2);
  assert.equal(ut[0].content, "Hei");
});

test("to personer deler ikke samtale om samme rapport", async () => {
  await lagreSamtale("m", "W3", "a@reflektor.no", [bruker("Min")]);
  await lagreSamtale("m", "W3", "b@reflektor.no", [bruker("Din")]);
  assert.equal(
    (await hentSamtale("m", "W3", "a@reflektor.no"))[0].content,
    "Min",
  );
  assert.equal(
    (await hentSamtale("m", "W3", "b@reflektor.no"))[0].content,
    "Din",
  );
});

test("to rapporter deler ikke samtale", async () => {
  await lagreSamtale("m", "W4", "a@reflektor.no", [bruker("Uke 4")]);
  await lagreSamtale("m", "W5", "a@reflektor.no", [bruker("Uke 5")]);
  assert.equal(
    (await hentSamtale("m", "W4", "a@reflektor.no"))[0].content,
    "Uke 4",
  );
});

/**
 * Den viktigste testen her.
 *
 * En verktøyrunde er to meldinger: assistenten med `tool_use`, og en
 * brukermelding med `tool_result`. Kuttes historikken mellom dem, blir det
 * som står igjen en historikk som begynner med svar på et kall som ikke
 * finnes, og API-et svarer 400 på neste tur — altså er samtalen død til
 * noen trykker «Start på nytt».
 */
test("kuttingen begynner aldri midt i en verktøyrunde", async () => {
  /* Fyll opp forbi taket, og legg en verktøyrunde på slutten. */
  const mange: Melding[] = [];
  for (let i = 0; i < MAKS_MELDINGER; i++) {
    mange.push(bruker(`spm ${i}`), svar(`svar ${i}`));
  }
  mange.push(
    bruker("Kryss av steg 1"),
    kall("t1"),
    resultat("t1"),
    svar("Gjort."),
  );

  await lagreSamtale("m", "W6", "a@reflektor.no", mange);
  const ut = await hentSamtale("m", "W6", "a@reflektor.no");

  assert.ok(ut.length <= MAKS_MELDINGER, "taket må holde");
  assert.equal(ut[0].role, "user", "må begynne på en brukermelding");
  assert.equal(
    Array.isArray(ut[0].content) &&
      ut[0].content.some((b) => b.type === "tool_result"),
    false,
    "første melding er et verktøysvar uten kallet foran — det gir 400",
  );

  /* Hvert verktøysvar som står igjen, må ha kallet sitt foran seg. */
  for (const [i, m] of ut.entries()) {
    if (m.role !== "user" || typeof m.content === "string") continue;
    for (const b of m.content) {
      if (b.type !== "tool_result") continue;
      const foran = ut[i - 1];
      assert.ok(
        foran &&
          foran.role === "assistant" &&
          Array.isArray(foran.content) &&
          foran.content.some(
            (x) => x.type === "tool_use" && x.id === b.tool_use_id,
          ),
        `verktøysvaret i melding ${i} har ikke kallet sitt foran seg`,
      );
    }
  }
});

test("en samtale som bare er en halv verktøyrunde, lagres ikke", async () => {
  await lagreSamtale("m", "W7", "a@reflektor.no", [kall("t9"), resultat("t9")]);
  assert.deepEqual(
    await hentSamtale("m", "W7", "a@reflektor.no"),
    [],
    "bedre tomt enn noe API-et avviser",
  );
});

test("en kort samtale røres ikke", async () => {
  const inn = [bruker("A"), kall("t1"), resultat("t1"), svar("B")];
  await lagreSamtale("m", "W8", "a@reflektor.no", inn);
  assert.equal((await hentSamtale("m", "W8", "a@reflektor.no")).length, 4);
});

test("nullstilling tømmer, men bare for den ene personen", async () => {
  await lagreSamtale("m", "W9", "a@reflektor.no", [bruker("Min")]);
  await lagreSamtale("m", "W9", "b@reflektor.no", [bruker("Din")]);
  await slettSamtale("m", "W9", "a@reflektor.no");
  assert.deepEqual(await hentSamtale("m", "W9", "a@reflektor.no"), []);
  assert.equal((await hentSamtale("m", "W9", "b@reflektor.no")).length, 1);
});

/** E-posten former en filsti. Den kommer fra innloggingen, men likevel. */
test("hverken id eller e-post kan skrive utenfor lageret", async () => {
  await lagreSamtale("m", "../../rømt", "../../../rømt@reflektor.no", [
    bruker("Hei"),
  ]);
  /* Leses tilbake på det samme vaskede navnet — filen er ikke borte. */
  assert.equal(
    (await hentSamtale("m", "../../rømt", "../../../rømt@reflektor.no")).length,
    1,
  );

  /*
   * Det som betyr noe er ikke at tegnene «..» er borte — vaskingen gjør
   * dem til en del av navnet. Kravet er at hver eneste fil fortsatt ligger
   * INNE i lagerrota.
   */
  const { readdir } = await import("node:fs/promises");
  const rot = resolve(mappe, ".samtalelager");
  const koe = [rot];
  let funnet = 0;
  while (koe.length) {
    const her = koe.pop()!;
    for (const e of await readdir(her, { withFileTypes: true })) {
      const full = resolve(her, e.name);
      assert.equal(
        full.startsWith(rot + "/"),
        true,
        `${full} havnet utenfor lageret`,
      );
      if (e.isDirectory()) koe.push(full);
      else funnet++;
    }
  }
  assert.ok(funnet > 0, "fant ingen filer å sjekke");
});
