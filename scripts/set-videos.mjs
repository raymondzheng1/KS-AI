/**
 * Set the hand-verified, human-approved lesson videos (replacing the cleared
 * unverified set). Each ID was checked via scripts/qa-videos.mjs (real title +
 * channel) and approved by the product owner. Re-runnable; preserves formatting.
 *
 * Usage: node scripts/set-videos.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GEN = "src/lib/content/generated";

/** hurdle id → approved videos (title = real video title, source = channel). */
const VIDEOS = {
  d1: [
    { title: "How AI Works", source: "CodeAI", youtubeId: "Ok-xpKjKp2g", note: "A clear, friendly intro to what AI is and how it works." },
    { title: "Learn about Artificial Intelligence (AI)", source: "Code.org", youtubeId: "EsztapWz6c4", note: "Code.org's short explainer on artificial intelligence." },
  ],
  d2: [
    { title: "Teachable Machine 2.0: Making AI easier for everyone", source: "Google", youtubeId: "T2qQGqZxkD0", note: "See how you can train your own AI in the browser — no code." },
    { title: "The 7 Steps of Machine Learning", source: "Google Cloud Tech", youtubeId: "nKW8Ndu7Mjw", note: "The steps every machine-learning project follows." },
  ],
  d3: [
    { title: "What Is Prompt Engineering?", source: "GeeksforGeeks", youtubeId: "_O6osatxa5c", note: "Why the way you ask an AI changes what you get back." },
  ],
  d4: [
    { title: "What Is Computer Vision?", source: "Ozobot", youtubeId: "YEJBEQJuOiY", minutes: 2, note: "A 2-minute look at how AI “sees” images." },
    { title: "Deepfakes: How to Spot Them", source: "CBC Kids News", youtubeId: "IOyrbsNcXt8", note: "What deepfakes are and how to tell what's real." },
    { title: "Deepfakes Explained", source: "Behind the News", youtubeId: "NxSOG1aNeBo", note: "How deepfakes are made, how to spot them, and why they matter." },
  ],
  d5: [
    { title: "3 Types of Bias in AI", source: "Google", youtubeId: "59bMh59JQDo", note: "Where AI bias comes from, with simple examples." },
    { title: "Algorithmic Bias and Fairness (Crash Course AI #18)", source: "CrashCourse", youtubeId: "gV0_raKR2UQ", note: "Five common kinds of AI bias, and why fairness is hard." },
    { title: "Coded Bias — Trailer", source: "MIFF", youtubeId: "jZl55PsfZJQ", note: "Trailer for the documentary about bias in face-recognition AI." },
  ],
  d6: [
    { title: "AI Art, Explained", source: "Vox", youtubeId: "SVcsDDABEkM", note: "How text-to-image AI turns words into pictures." },
  ],
};

for (const [id, videos] of Object.entries(VIDEOS)) {
  const path = join(GEN, `${id}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  data.videos = videos;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`${id}: set ${videos.length} video(s)`);
}
console.log("Done.");
