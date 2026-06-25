/**
 * Verify candidate replacement videos: fetch each ID's REAL title + channel
 * from YouTube oEmbed so a human can confirm suitability. Throwaway QA tool.
 */
const CANDIDATES = [
  ["d1 What is AI", "Ok-xpKjKp2g"],
  ["d1 What is AI", "EsztapWz6c4"],
  ["d1 What is AI", "w7rJ003lqjk"],
  ["d2 ML / Teachable Machine", "3vsz8GOGfB8"],
  ["d2 ML / Teachable Machine", "T2qQGqZxkD0"],
  ["d2 ML / Teachable Machine", "nKW8Ndu7Mjw"],
  ["d3 Prompting", "_O6osatxa5c"],
  ["d3 Prompting", "nN-czQqWuE4"],
  ["d4 Computer vision", "puB-4LuRNys"],
  ["d4 Computer vision", "YEJBEQJuOiY"],
  ["d4 Deepfakes", "IOyrbsNcXt8"],
  ["d4 Deepfakes", "NxSOG1aNeBo"],
  ["d5 Bias", "gV0_raKR2UQ"],
  ["d5 Bias", "jZl55PsfZJQ"],
  ["d5 Bias", "59bMh59JQDo"],
  ["d6 AI art", "SVcsDDABEkM"],
  ["d6 AI art", "iv-5mZ_9CPY"],
];

for (const [topic, id] of CANDIDATES) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  let title = "";
  let channel = "";
  let status = 0;
  try {
    const res = await fetch(url);
    status = res.status;
    if (res.ok) {
      const j = await res.json();
      title = j.title ?? "";
      channel = j.author_name ?? "";
    }
  } catch {
    status = -1;
  }
  console.log(`${status === 200 ? "OK " : "XX "} [${topic}]`);
  console.log(`   "${title || "—"}"  — ${channel || "—"}`);
  console.log(`   https://www.youtube.com/watch?v=${id}\n`);
}
