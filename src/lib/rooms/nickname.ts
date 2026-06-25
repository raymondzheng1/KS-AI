/**
 * Nickname normalisation + light moderation (pure, testable).
 *
 * A nickname is a self-chosen display handle — the one quasi-PII the app stores
 * (see docs/TECHNICAL_SPEC §PII). We keep it short, charset-limited, and run a
 * modest profanity filter. It is NOT real identity; we collect nothing else.
 */

/** 2–16 chars: letters (any script), digits, spaces, and - _ . */
const NICK_RE = /^[\p{L}\p{N} ._-]{2,16}$/u;

/** Common leetspeak substitutions, normalised before the profanity check. */
const LEET: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
};

/** Modest blocklist (substring match on the normalised form). Kept deliberately
 *  small — the goal is to stop obvious abuse, not to be exhaustive. */
const BLOCKLIST = [
  "fuck", "shit", "bitch", "cunt", "dick", "cock", "pussy", "asshole",
  "bastard", "slut", "whore", "nigger", "nigga", "faggot", "retard",
  "rape", "nazi", "porn", "sex", "penis", "vagina", "anus",
];

/** Normalise raw input: trim, collapse internal whitespace, cap length. */
export function normalizeNick(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (!NICK_RE.test(cleaned)) return null;
  return cleaned;
}

/** True if the nickname contains blocked content (after leet-normalisation). */
export function isProfane(nick: string): boolean {
  const folded = nick
    .toLowerCase()
    .split("")
    .map((c) => LEET[c] ?? c)
    .join("")
    .replace(/[^a-z]/g, "");
  return BLOCKLIST.some((w) => folded.includes(w));
}

export type NickResult =
  | { ok: true; nick: string }
  | { ok: false; reason: "format" | "blocked" };

/** Validate + moderate a nickname in one call. */
export function validateNick(raw: unknown): NickResult {
  const nick = normalizeNick(raw);
  if (!nick) return { ok: false, reason: "format" };
  if (isProfane(nick)) return { ok: false, reason: "blocked" };
  return { ok: true, nick };
}
