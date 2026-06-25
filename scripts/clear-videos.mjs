/**
 * Child-safety measure: remove ALL lesson videos from the committed content.
 * The auto-generated YouTube IDs were unverified and at least two pointed to
 * unsuitable videos (see scripts/qa-videos.mjs). Videos will be re-added only
 * after a human verifies each one. Re-runnable; preserves 2-space formatting.
 *
 * Usage: node scripts/clear-videos.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GEN = "src/lib/content/generated";
let removed = 0;
for (const f of readdirSync(GEN).filter((x) => /^d\d+\.json$/.test(x))) {
  const path = join(GEN, f);
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (Array.isArray(data.videos) && data.videos.length) {
    removed += data.videos.length;
    data.videos = [];
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`${f}: cleared`);
  }
}
console.log(`Done — removed ${removed} unverified video(s). Re-add only verified ones.`);
