/**
 * Remove specific non-playable videos (verified dead via check-videos.mjs)
 * from the committed hurdle JSON. Re-runnable; preserves 2-space formatting.
 *
 * Usage: node scripts/prune-videos.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEAD = new Set(["l3Ly51bqFIA", "PL1HXkjxTFY", "vAlHEIJGCQI"]);
const GEN = "src/lib/content/generated";

let removed = 0;
for (const f of readdirSync(GEN).filter((x) => /^d\d+\.json$/.test(x))) {
  const path = join(GEN, f);
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(data.videos)) continue;
  const before = data.videos.length;
  data.videos = data.videos.filter((v) => !DEAD.has(v.youtubeId));
  const diff = before - data.videos.length;
  if (diff) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
    removed += diff;
    console.log(`${f}: removed ${diff}, ${data.videos.length} left`);
  }
}
console.log(`Done — removed ${removed} dead video(s).`);
