/**
 * The KidSmart family of apps — the single source of truth for cross-linking
 * between sibling services in the footer.
 *
 * FUTURE-PROOF: to add a new KidSmart app, append one entry here. It appears
 * automatically in the "More from KidSmart" footer of every other app (each
 * app sets its own CURRENT_SERVICE_ID so it never links to itself). Use
 * `status: "coming-soon"` to tease an app before it launches.
 *
 * Keep this list identical across the sibling apps — only CURRENT_SERVICE_ID
 * differs per app. (Accents are literal hex so each sibling's brand colour
 * renders the same regardless of which app's theme is active.)
 */
export type KidsmartService = {
  /** Stable id; also used to skip the current app. */
  id: string;
  /** Short display name. */
  name: string;
  /** One-line description shown under the name. */
  tagline: string;
  /** Absolute https URL to the app. */
  url: string;
  /** Emoji badge. */
  icon: string;
  /** Accent colour (literal hex) for the card. */
  accent: string;
  /** "live" links out; "coming-soon" renders a muted, non-clickable teaser. */
  status: "live" | "coming-soon";
};

/** Which entry below is THIS app — so the footer can skip it. */
export const CURRENT_SERVICE_ID = "ai";

export const KIDSMART_SERVICES: KidsmartService[] = [
  {
    id: "ai",
    name: "AI Training",
    tagline: "Become an AI Explorer",
    url: "https://ai.kidsmart.au",
    icon: "🤖",
    accent: "#4B9FD4",
    status: "live",
  },
  {
    id: "ideas",
    name: "River of Ideas",
    tagline: "Philosophy for curious kids",
    url: "https://ideas.kidsmart.au",
    icon: "💡",
    accent: "#8E9BE0",
    status: "live",
  },
];

/** The sibling apps to advertise in this app's footer (everything but us). */
export const OTHER_KIDSMART_SERVICES = KIDSMART_SERVICES.filter(
  (s) => s.id !== CURRENT_SERVICE_ID,
);
