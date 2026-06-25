/**
 * Rate limiters (Harness §6.4 — fail-closed).
 *
 * Upstash sliding-window in production; in dev/test an in-memory limiter so
 * contributors don't need an Upstash account. In **production**, if the
 * Upstash env vars are missing the limiter refuses ALL requests — a
 * misconfigured prod must never become wide-open.
 */
import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { readUpstashEnv } from "./kv";

export interface RateLimiter {
  /** True = allowed. False = blocked. Bucket key is caller-supplied (e.g. IP). */
  limit(key: string): Promise<{ ok: boolean }>;
}

class UpstashRateLimiter implements RateLimiter {
  constructor(private readonly inner: Ratelimit) {}
  async limit(key: string): Promise<{ ok: boolean }> {
    const { success } = await this.inner.limit(key);
    return { ok: success };
  }
}

export class MemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();
  constructor(
    private readonly maxPerWindow: number,
    private readonly windowMs: number,
  ) {}
  async limit(key: string): Promise<{ ok: boolean }> {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    const arr = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (arr.length >= this.maxPerWindow) {
      this.hits.set(key, arr);
      return { ok: false };
    }
    arr.push(now);
    this.hits.set(key, arr);
    return { ok: true };
  }
}

/** Fail-closed: refuses every request. Used when prod is misconfigured. */
export class DenyAllLimiter implements RateLimiter {
  async limit(_key: string): Promise<{ ok: boolean }> {
    void _key;
    return { ok: false };
  }
}

interface LimiterSpec {
  /** Upstash key prefix (unique per endpoint). */
  prefix: string;
  /** Max requests per window. */
  max: number;
  /** Window in the Upstash duration format, e.g. "1 m" / "1 h". */
  window: `${number} ${"s" | "m" | "h"}`;
  /** Equivalent window in ms for the in-memory fallback. */
  windowMs: number;
}

/**
 * Production budgets, per IP:
 *   save      60 / min — generous for a player progressing, tight on spam
 *   codecheck 10 / min — chokes enumeration of custom-code namespace
 *   room      10 / min — create/join a room
 *   contact   10 / hour — bot defence on the contact form
 */
const SPECS = {
  save: { prefix: "rl:save", max: 60, window: "1 m", windowMs: 60_000 },
  codecheck: { prefix: "rl:codecheck", max: 10, window: "1 m", windowMs: 60_000 },
  room: { prefix: "rl:room", max: 10, window: "1 m", windowMs: 60_000 },
  contact: { prefix: "rl:contact", max: 10, window: "1 h", windowMs: 3_600_000 },
} as const satisfies Record<string, LimiterSpec>;

export type LimiterName = keyof typeof SPECS;

const cache = new Map<LimiterName, RateLimiter>();
const testOverrides = new Map<LimiterName, RateLimiter>();

function build(spec: LimiterSpec): RateLimiter {
  const env = readUpstashEnv();
  if (env) {
    return new UpstashRateLimiter(
      new Ratelimit({
        redis: new Redis(env),
        limiter: Ratelimit.slidingWindow(spec.max, spec.window),
        analytics: false,
        prefix: spec.prefix,
      }),
    );
  }
  if (process.env.NODE_ENV === "production") return new DenyAllLimiter();
  return new MemoryRateLimiter(spec.max, spec.windowMs);
}

/** Get (and memoise) the limiter for a named endpoint. */
export function getLimiter(name: LimiterName): RateLimiter {
  const override = testOverrides.get(name);
  if (override) return override;
  const existing = cache.get(name);
  if (existing) return existing;
  const built = build(SPECS[name]);
  cache.set(name, built);
  return built;
}

/* ---- Test helper ---- */
export function __setLimiterForTests(
  name: LimiterName,
  impl: RateLimiter | null,
): void {
  if (impl) testOverrides.set(name, impl);
  else testOverrides.delete(name);
  cache.delete(name);
}
