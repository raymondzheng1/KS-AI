/**
 * Verify every lesson video is a real, embeddable YouTube video via the oEmbed
 * endpoint (200 = public/embeddable; 401/404 = private/deleted/invalid).
 * Standalone maintenance tool (network) — not part of `verify`.
 *
 * Usage: node scripts/check-videos.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const GEN = "src/lib/content/generated";
const files = readdirSync(GEN).filter((f) => /^d\d+\.json$/.test(f));

const all = [];
for (const f of files) {
  const data = JSON.parse(readFileSync(join(GEN, f), "utf8"));
  for (const v of data.videos ?? []) {
    all.push({ hurdle: data.id, title: v.title, id: v.youtubeId });
  }
}

console.log(`Checking ${all.length} videos…\n`);
const dead = [];
for (const v of all) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`;
  let status = 0;
  try {
    const res = await fetch(url, { redirect: "follow" });
    status = res.status;
  } catch {
    status = -1;
  }
  const ok = status === 200;
  if (!ok) dead.push(v);
  console.log(`${ok ? "✓" : "✗"} ${status}  ${v.hurdle}  ${v.id}  ${v.title}`);
}

console.log(`\n${all.length - dead.length}/${all.length} playable.`);
if (dead.length) {
  console.log("\nDEAD (remove these):");
  for (const v of dead) console.log(`  ${v.hurdle}  ${v.id}  ${v.title}`);
}
