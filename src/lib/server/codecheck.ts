/**
 * Custom-code availability check. A code is "taken" if it already backs a
 * progress row OR a profile row. When the requested code is taken we walk its
 * suggestion chain (NOVA → NOVA1 → NOVA2 …) and return the first free variant,
 * so a kid can still get a memorable code close to the one they wanted.
 */
import "server-only";
import { nextSuggestion } from "@/lib/progress/code";
import { getKv } from "./kv";

export type CodeCheckResult =
  | { status: "available"; code: string }
  | { status: "suggested"; code: string; requested: string }
  | { status: "exhausted"; requested: string };

/** How many variants past the requested code we'll try before giving up. */
const MAX_VARIANTS = 50;

/** Parallel "is this code in use?" check for a batch of candidate codes. */
async function takenFlags(codes: string[]): Promise<boolean[]> {
  const keys = codes.flatMap((c) => [`progress:${c}`, `profile:${c}`]);
  const vals = await getKv().mget<unknown>(keys);
  return codes.map((_, i) => vals[i * 2] != null || vals[i * 2 + 1] != null);
}

/** True iff `code` (already normalised) backs no progress or profile row yet.
 *  Used as the final guard when a player claims a custom code at mint time. */
export async function isCodeAvailable(code: string): Promise<boolean> {
  const [taken] = await takenFlags([code]);
  return !taken;
}

/**
 * Resolve an already-normalised requested code to the first free code in its
 * suggestion chain. One batched KV read regardless of how many variants we try.
 */
export async function findFreeCode(requested: string): Promise<CodeCheckResult> {
  const candidates: string[] = [requested];
  let cur = requested;
  for (let i = 0; i < MAX_VARIANTS; i++) {
    const nxt = nextSuggestion(cur);
    if (!nxt || candidates.includes(nxt)) break;
    candidates.push(nxt);
    cur = nxt;
  }

  const taken = await takenFlags(candidates);
  const freeIdx = taken.findIndex((t) => !t);
  if (freeIdx === -1) return { status: "exhausted", requested };

  const code = candidates[freeIdx];
  return freeIdx === 0
    ? { status: "available", code }
    : { status: "suggested", code, requested };
}
