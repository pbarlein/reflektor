import type { Side } from "./_slot.ts";
import { produktfoto } from "./produktfoto.ts";
import { front } from "./front.ts";
import { home } from "./home.ts";
import { reklamefilm } from "./reklamefilm.ts";
import { videoproduksjon_oslo } from "./videoproduksjon-oslo.ts";
import { innholdsproduksjon } from "./innholdsproduksjon.ts";

/** Alle sider i innholdslaget. content:check itererer over denne. */
export const alleSider: Side[] = [
  home,
  front,
  reklamefilm,
  videoproduksjon_oslo,
  innholdsproduksjon,
  produktfoto,
];
