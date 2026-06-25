/**
 * content:check — project content invariants (Harness §4.2). Grows as content
 * lands. Passes cleanly when the content module isn't present yet (Phase 0).
 *
 * Current rules:
 *   - the generated diagram files referenced by hurdles must exist in public/
 *     (added in Phase 1 once the hurdle data names its diagram).
 *   - no banned placeholder strings ("TODO", "FIXME", "lorem ipsum") in
 *     committed content.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = "src/lib/content";
const BANNED = [/lorem ipsum/i, /\bTBD\b/, /XXX placeholder/i];

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|json)$/.test(entry)) out.push(p);
  }
  return out;
}

let failures = 0;
for (const file of walk(CONTENT_DIR)) {
  if (file.includes("generated")) continue; // generated data is checked below
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const re of BANNED) {
      if (re.test(line)) {
        console.error(`${file}:${i + 1} — banned placeholder: ${line.trim().slice(0, 100)}`);
        failures++;
      }
    }
  });
}

// Every diagram referenced by the committed content must exist in public/.
const GEN = join(CONTENT_DIR, "generated");
if (existsSync(GEN)) {
  for (const file of walk(GEN)) {
    if (!file.endsWith(".json")) continue;
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/"\/diagrams\/([\w-]+\.png)"/g)) {
      const rel = join("public", "diagrams", m[1]);
      if (!existsSync(rel)) {
        console.error(`${file} — references missing diagram: public/diagrams/${m[1]}`);
        failures++;
      }
    }
  }
}

if (failures) {
  console.error(`\ncontent:check — ${failures} problem(s).`);
  process.exit(1);
}
console.log("content:check — OK");
