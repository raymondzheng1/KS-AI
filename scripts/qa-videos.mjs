/**
 * QA every lesson video: fetch the REAL title + channel from YouTube oEmbed and
 * compare against what our content claims, so a human can verify suitability.
 * (We can't watch the video — this surfaces what each ID actually points to.)
 *
 * Usage: node scripts/qa-videos.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const GEN = "src/lib/content/generated";

const all = [];
for (const f of readdirSync(GEN).filter((x) => /^d\d+\.json$/.test(x)).sort()) {
  const data = JSON.parse(readFileSync(join(GEN, f), "utf8"));
  for (const v of data.videos ?? []) {
    all.push({ hurdle: data.id, day: data.day, ourTitle: v.title, ourSource: v.source, id: v.youtubeId });
  }
}

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 3));
function overlap(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0) return 0;
  let n = 0;
  for (const t of ta) if (tb.has(t)) n++;
  return n / ta.size;
}

console.log(`QA-ing ${all.length} videos via YouTube oEmbed…\n`);
const rows = [];
for (const v of all) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`;
  let realTitle = "";
  let realChannel = "";
  let status = 0;
  try {
    const res = await fetch(url);
    status = res.status;
    if (res.ok) {
      const j = await res.json();
      realTitle = j.title ?? "";
      realChannel = j.author_name ?? "";
    }
  } catch {
    status = -1;
  }
  const titleMatch = status === 200 ? overlap(v.ourTitle, realTitle) : 0;
  const flag =
    status !== 200 ? "DEAD/PRIVATE" : titleMatch < 0.34 ? "MISMATCH?" : "ok";
  rows.push({ ...v, status, realTitle, realChannel, titleMatch, flag });
  console.log(
    `[${v.hurdle} d${v.day}] ${flag}\n` +
      `  our:    "${v.ourTitle}"  (${v.ourSource})\n` +
      `  actual: "${realTitle || "—"}"  — channel: ${realChannel || "—"}\n` +
      `  https://www.youtube.com/watch?v=${v.id}\n`,
  );
}

const bad = rows.filter((r) => r.flag !== "ok");
console.log(`\n=== SUMMARY ===`);
console.log(`${rows.length} videos · ${rows.filter((r) => r.flag === "ok").length} title-match · ${bad.length} need review`);
for (const r of bad) {
  console.log(`  ${r.hurdle}: ${r.flag} — claims "${r.ourTitle}" but is "${r.realTitle}" (${r.realChannel})`);
}
