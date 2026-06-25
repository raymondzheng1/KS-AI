/**
 * Rewrite student-facing activity text from facilitator/classroom voice
 * ("your facilitator will…", "in your group…", "the class votes…") into
 * self-directed self-learning voice ("try this yourself…"). Facilitator-only
 * blocks (the gated `facilitator` arrays) are left untouched. Re-runnable.
 *
 * Usage: node scripts/reword-content.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GEN = "src/lib/content/generated";

/** hurdle → activity-name-substring → { intro?, steps? } overrides. */
const REWRITES = {
  d1: {
    "AI Myth Busters": {
      intro: ["For each myth below, guess TRUE or FALSE, then read what's really going on. How many can you bust? 🕵️"],
    },
  },
  d2: {
    "Human Sorting Game": {
      intro: ["You're about to become a machine learning model — by hand! Tap through the animation below, step by step, to sort a stack of animal cards the way an AI would."],
      steps: [
        "After the animation, think it through: what features would YOU use to tell cats from dogs? What would make it tricky?",
        "If you had to sort 10,000 cards by yourself, would you use the same method? What would you change?",
        "What if some of the labels were wrong? How would that change what you learn?",
        "If the AI only ever saw white and orange cats, what would happen the first time it met a black cat?",
      ],
    },
  },
  d3: {
    "Prompt Battle Championship": {
      intro: ["Prompt Battle! 🏆 Each round below is a challenge. Take a few minutes to craft the best prompt you can, send it to a free AI like Claude or ChatGPT, and see how good the answer is. Can you beat your last round?"],
    },
  },
  d4: {
    "Spot the AI": {
      intro: ["Become an AI detective! 🕵️ AI can now make fake photos, voices, and videos. Learn the tell-tale clues below, then test yourself — next time you see an image online, can you tell REAL from AI-made? (Use the verification tools at the end on anything you're unsure about.)"],
    },
    "Live AI Vision Demos": {
      intro: ["Try three real AI vision tools yourself — one at a time. Each one runs free in your browser, so go ahead and play!"],
      steps: [
        "Try it 1 — Quick, Draw! 🎨  Go to quickdraw.withgoogle.com, draw the object it names, and watch the AI guess as you draw. Notice: how does it know what you're drawing before you finish?",
        "Try it 2 — Train your own classifier 🤖  At teachablemachine.withgoogle.com → Image Project, train it to recognise 3 objects near you, then test it on something new. Did it recognise objects it never saw? Why or why not?",
        "Try it 3 — Make AI art ✨  At firefly.adobe.com (free), generate an image from a prompt, then try drawing the same scene yourself. What did the AI add that you wouldn't have? What did it get wrong?",
      ],
    },
  },
  d5: {
    "AI Ethics Court": {
      intro: ["You be the judge! ⚖️ For each AI case below, think through BOTH sides — why someone might allow it, and why someone might ban it — then give your own verdict."],
      steps: [
        "Read each case brief carefully (they're below).",
        "For each case, write the strongest argument FOR the AI, and the strongest argument AGAINST it.",
        "Imagine a tricky question someone might ask about your decision — how would you answer it?",
        "Give your verdict: Allow it / Ban it / Allow only with conditions.",
        "If you allow it, name the exact conditions that must apply.",
      ],
    },
  },
  d6: {
    "AI Creative Workshop": {
      intro: ["Two creative challenges to try yourself: make a song with Suno, and make art with Adobe Firefly. Start with AI, then add your own human touch."],
      steps: [
        "🎵 Make a song — go to suno.com (free tier available).",
        'Write a prompt for a song: pick a genre, mood, theme, and style. Example: "Upbeat pop song about discovering you can code, energetic, teenage perspective, with a catchy chorus."',
        "Generate the song and listen carefully. What do you like? What feels off?",
        "Now make it yours: write new lyrics for the chorus yourself. What feeling do YOUR lyrics add that the AI's didn't?",
        "Optional: generate the same theme in 3 different genres (pop, hip-hop, classical). How does the genre change the meaning?",
        "🎨 Make art — go to firefly.adobe.com (free to try).",
        'Generate an image of "the future of education." Use a detailed prompt with style, lighting, and mood.',
        "Generate 4 variations and pick the one you like best. Write a sentence on why.",
        "Now draw your own version of the same idea — freehand, 5 minutes. Don't copy the AI's.",
        "Put both side by side. What did you include that the AI didn't? What did the AI imagine that surprised you?",
        "Reflect: for each one, what did the AI do well, and what did you add that made it yours?",
      ],
    },
    "Human vs AI Creative Showdown": {
      intro: ["You vs the AI! 🎭 Pick a creative challenge, then do it twice — once with an AI's help, once all by yourself — and compare them."],
      steps: [
        'Pick ONE challenge: A) a haiku about loneliness (5-7-5 syllables) · B) a logo idea for a company called "Future Minds" · C) the opening sentence of a thriller set in Sydney in 2040 · D) a 4-line rhyming verse about why learning matters.',
        "Give yourself 5 minutes to make the AI version, and 5 minutes to make your own version.",
        "Put them side by side — without marking which is which.",
        "Could a friend guess which one is AI and which is yours? What gives it away?",
        "Decide: which did you like better — and what made the human one feel human?",
      ],
    },
  },
  d7: {
    "Problem Sprint": {
      steps: [
        "Brainstorm: list as many everyday problems as you can — from school, home, your community, or your hobbies. Don't filter, just list them all (give yourself 5 minutes).",
        "Star the 3 problems you care about most.",
        "Pick ONE to carry into your project.",
      ],
    },
  },
  d8: {
    "Daily Build Log": {
      steps: [
        "What did you get working today?",
        "What's the trickiest part right now?",
        "What's your #1 goal for tomorrow?",
        "One thing you're proud of:",
        "One thing you'd do differently:",
        "How's your teamwork going (if you're building with others)?",
        "What do you want to figure out or get help with next time?",
      ],
    },
  },
  d10: {
    "Project Showcase": {
      steps: [
        "Set up your project so it's ready to show.",
        "Give your 3-minute demo: the problem, your solution, how you used AI, and what you learned.",
        "Try the audience questions on your own first — could you answer them?",
        "Watch other projects and leave one kind, specific piece of feedback.",
        "Thank everyone who helped you and tried out your project.",
      ],
    },
    "Letter to My Future Self": {
      intro: ["Take 15 quiet minutes to write a letter to your future self. Seal it and set a reminder to open it in about 6 months — right in the middle of a new school year, a message from the you who just finished this adventure."],
    },
  },
};

let changed = 0;
for (const [hid, acts] of Object.entries(REWRITES)) {
  const path = join(GEN, `${hid}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  for (const a of data.activities ?? []) {
    for (const [namePart, fields] of Object.entries(acts)) {
      if (a.name.includes(namePart)) {
        if (fields.intro) a.intro = fields.intro;
        if (fields.steps) a.steps = fields.steps;
        changed += 1;
        console.log(`${hid}: reworded "${a.name}"`);
      }
    }
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}
console.log(`Done — reworded ${changed} activities.`);
