import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // intern/ er et EGET PROSJEKT med egen package.json, egen tsconfig og
    // egen eslint-konfigurasjon. Det sjekkes av sin egen jobb i CI.
    //
    // Grensen må trekkes begge steder, og tsconfig var den som smalt først:
    // rotas "include" er alle .ts-filer med kun node_modules unntatt, så
    // `npx tsc --noEmit` dro inn hele intranettet og løste @/* mot rotas
    // egen src-mappe. Resultatet var ti «Cannot find module '@/lib/sesjon'»
    // for filer som kompilerer fint i sitt eget prosjekt.
    //
    // LINJEKOMMENTARER OG IKKE BLOKK: forrige versjon skrev glob-mønsteret
    // ut i en /* */-kommentar, og stjerne-skråstrek inni det mønsteret
    // lukket kommentaren midt i setningen. ESLint falt da med en
    // SyntaxError før den rakk å lese en eneste fil.
    "intern/**",
  ]),
]);

export default eslintConfig;
