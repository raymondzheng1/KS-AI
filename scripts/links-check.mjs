/**
 * links:check — validates every external URL referenced in the committed
 * content data is well-formed HTTPS (child-safety: links shown to kids must be
 * deliberate). Fast + deterministic (no network) so it can gate every verify.
 *
 * Scans src/lib/content for `url:` / `href:` string literals and `https://…`
 * URLs. Passes cleanly when no content exists yet (Phase 0).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = "src/lib/content";
const URL_RE = /https?:\/\/[^\s"'`)]+/g;

/** Domains we never want to send kids to (placeholder/no-source markers). */
const FORBIDDEN_HOSTS = ["example.com", "example.org", "localhost", "127.0.0.1"];

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
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const matches = line.match(URL_RE);
    if (!matches) return;
    for (const raw of matches) {
      const url = raw.replace(/[.,;]+$/, "");
      let parsed;
      try {
        parsed = new URL(url);
      } catch {
        console.error(`${file}:${i + 1} — malformed URL: ${url}`);
        failures++;
        continue;
      }
      if (parsed.protocol !== "https:") {
        console.error(`${file}:${i + 1} — non-HTTPS link: ${url}`);
        failures++;
      }
      if (FORBIDDEN_HOSTS.some((h) => parsed.hostname.includes(h))) {
        console.error(`${file}:${i + 1} — placeholder/forbidden host: ${url}`);
        failures++;
      }
    }
  });
}

if (failures) {
  console.error(`\nlinks:check — ${failures} problem(s).`);
  process.exit(1);
}
console.log("links:check — OK");
