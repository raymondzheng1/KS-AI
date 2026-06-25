/**
 * Player capability-code generator + validator (Harness §18).
 *
 * A code is a bearer credential that lives in the URL (`/p/<code>`) — it IS
 * the player's identity. No login, no PII beyond a self-chosen nickname kept
 * in a separate profile row.
 *
 * Two valid formats:
 *
 *   1. **Canonical XXX-XXX (server-generated)** — `BKJ-7PQ`.
 *      6 chars over a 31-char unambiguous alphabet (no I/L/1, no O/0)
 *      = 31^6 ≈ 887 million codes, ≈ 29.7 bits of entropy.
 *
 *   2. **Custom (kid-chosen)** — `ROBORAY`, `NOVA42`, `MY-AI-CODE`.
 *      Length 3–20, characters A–Z + 0–9 + hyphen, hyphens cannot be
 *      leading/trailing or consecutive. Case-insensitive, normalised to
 *      upper-case before storage / lookup.
 *
 * For custom codes the bearer-credential weakening is at access time (a kid
 * choosing `NOVA` means anyone guessing `/p/NOVA` reads that progress). The
 * trade-off is recorded in docs/TECHNICAL_SPEC.md; /api/code/check provides
 * registration-time collision detection with an auto-suggested next variant.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 chars, no I L O 0 1
/** Strict canonical regex — only what `generateCode()` produces. */
const CANONICAL_CODE_RE =
  /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{3}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{3}$/;
/** Wider regex for kid-chosen custom codes (post-normalisation shape). */
const CUSTOM_CODE_RE = /^[A-Z0-9](?:[A-Z0-9-]{1,18}[A-Z0-9])?$/;

/** Fresh random index using Web Crypto when available, else Math.random. */
function randomIndex(rand: (() => number) | undefined): number {
  if (rand) return Math.floor(rand() * ALPHABET.length);
  const crypto = globalThis.crypto;
  if (crypto && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    // Reject-and-retry to avoid modulo bias against the top of the range.
    const limit = Math.floor(0x100000000 / ALPHABET.length) * ALPHABET.length;
    if (buf[0] < limit) return buf[0] % ALPHABET.length;
    return randomIndex(undefined);
  }
  return Math.floor(Math.random() * ALPHABET.length);
}

/**
 * Generate a fresh code in the canonical XXX-XXX form. Pass a seeded `rand`
 * (`() => number` in [0,1)) for reproducible tests; omit in production.
 */
export function generateCode(rand?: () => number): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomIndex(rand)];
  return s.slice(0, 3) + "-" + s.slice(3);
}

/** True iff `s` is a valid code in either format (canonical OR custom). */
export function isValidCode(s: unknown): s is string {
  if (typeof s !== "string") return false;
  if (CANONICAL_CODE_RE.test(s)) return true;
  if (s.includes("--")) return false; // no consecutive hyphens
  return CUSTOM_CODE_RE.test(s);
}

/** True iff `s` is specifically a canonical server-generated code. */
export function isCanonicalCode(s: unknown): s is string {
  return typeof s === "string" && CANONICAL_CODE_RE.test(s);
}

/**
 * Normalise raw user input into the stored/looked-up code form, or `null` if
 * it can't be coerced into a valid code:
 *   - trim, upper-case
 *   - collapse runs of spaces/underscores into a single hyphen
 *   - reject anything outside [A-Z0-9-], leading/trailing/consecutive hyphens
 *   - require length 3–20 after normalisation
 */
export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const collapsed = raw.trim().toUpperCase().replace(/[\s_]+/g, "-");
  if (collapsed.length < 3 || collapsed.length > 20) return null;
  if (!isValidCode(collapsed)) return null;
  return collapsed;
}

/**
 * Suggest the next variant when a requested code is taken.
 *   - trailing digit run → increment it (`NOVA7` → `NOVA8`, width preserved)
 *   - otherwise append `1` (`NOVA` → `NOVA1`)
 * Returns `null` if the suggestion would break length/format (stop iterating).
 */
export function nextSuggestion(code: string): string | null {
  const m = code.match(/^(.*?)(\d+)$/);
  let next: string;
  if (m) {
    const [, head, digits] = m;
    const incremented = String(Number(digits) + 1);
    const padded =
      incremented.length < digits.length
        ? incremented.padStart(digits.length, "0")
        : incremented;
    next = head + padded;
  } else {
    next = code + "1";
  }
  return isValidCode(next) ? next : null;
}

/** Total codes representable by the canonical format (telemetry). */
export const CODE_SPACE = ALPHABET.length ** 6;
