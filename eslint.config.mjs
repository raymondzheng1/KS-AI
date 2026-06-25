import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference materials + ported/generated content data are not part of the
    // hand-authored source tree and must not gate verify on stylistic warnings.
    "reference/**",
    "src/lib/content/generated/**",
  ]),
]);

export default eslintConfig;
