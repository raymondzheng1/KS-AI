/**
 * Server-only key/value store (Harness §2.0 Tier B, §6.4).
 *
 * One generic `KvLike` abstraction backs everything that needs shared state:
 *   progress:<code>          → JSON SyncedState
 *   profile:<code>           → JSON PlayerProfile  { nick, roomId, ... }
 *   room:<roomId>            → JSON Room           { name, hostCode, ... }
 *   room:<roomId>:members    → Set of player codes
 *
 * Production uses **Upstash Redis** (free tier, via the Vercel Marketplace
 * integration). Credentials arrive under one of two naming conventions:
 *   - Current Marketplace:  KV_REST_API_URL / KV_REST_API_TOKEN
 *   - Legacy direct Upstash: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * `readUpstashEnv()` accepts either; the rate limiter reads through the same
 * function so the two can't drift (a half-configured prod must fail closed).
 *
 * If neither pair is present:
 *   - In production we throw (no silent KV-less mode — sync is part of v1).
 *   - In dev / test we fall back to a process-local store so the app runs
 *     offline without an Upstash account. Tests inject their own via
 *     `__setKvForTests`.
 *
 * Importing this from a Client Component fails at build time — intentional.
 */
import "server-only";
import { Redis } from "@upstash/redis";

export function readUpstashEnv(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  return null;
}

/** The minimal store surface the app needs (JSON values + string sets). */
export interface KvLike {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(...keys: string[]): Promise<void>;
  /** Add members to a set; returns nothing. */
  sadd(key: string, ...members: string[]): Promise<void>;
  /** All members of a set (empty array if absent). */
  smembers(key: string): Promise<string[]>;
  /** Bulk get; preserves order, `null` for missing keys. */
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  /** Keys matching a glob pattern (e.g. `room:*`). For backups/admin only. */
  keys(pattern: string): Promise<string[]>;
}

/** Convert a Redis glob (only `*` used here) to a RegExp. */
function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

/* ---- Upstash-backed implementation ---- */
class UpstashKv implements KvLike {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get<unknown>(key);
    if (raw === null || raw === undefined) return null;
    // Upstash auto-decodes JSON; tolerate legacy string rows.
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
  }
  async set(key: string, value: unknown): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }
  async del(...keys: string[]): Promise<void> {
    if (keys.length) await this.redis.del(...keys);
  }
  async sadd(key: string, ...members: string[]): Promise<void> {
    if (members.length) await this.redis.sadd(key, members[0], ...members.slice(1));
  }
  async smembers(key: string): Promise<string[]> {
    return (await this.redis.smembers(key)) ?? [];
  }
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return [];
    const raw = await this.redis.mget<unknown[]>(...keys);
    return raw.map((v) =>
      v === null || v === undefined
        ? null
        : ((typeof v === "string" ? JSON.parse(v) : v) as T),
    );
  }
  async keys(pattern: string): Promise<string[]> {
    return (await this.redis.keys(pattern)) ?? [];
  }
}

/* ---- In-memory implementation (dev + tests) ---- */
export class MemoryKv implements KvLike {
  private readonly store = new Map<string, string>();
  private readonly sets = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const raw = this.store.get(key);
    return raw === undefined ? null : (JSON.parse(raw) as T);
  }
  async set(key: string, value: unknown): Promise<void> {
    this.store.set(key, JSON.stringify(value));
  }
  async del(...keys: string[]): Promise<void> {
    for (const k of keys) {
      this.store.delete(k);
      this.sets.delete(k);
    }
  }
  async sadd(key: string, ...members: string[]): Promise<void> {
    const set = this.sets.get(key) ?? new Set<string>();
    for (const m of members) set.add(m);
    this.sets.set(key, set);
  }
  async smembers(key: string): Promise<string[]> {
    return Array.from(this.sets.get(key) ?? []);
  }
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map((k) => this.get<T>(k)));
  }
  async keys(pattern: string): Promise<string[]> {
    const re = globToRegExp(pattern);
    const all = new Set([...this.store.keys(), ...this.sets.keys()]);
    return Array.from(all).filter((k) => re.test(k));
  }
}

/* ---- Lazy singleton ---- */
let instance: KvLike | null = null;

export function getKv(): KvLike {
  if (instance) return instance;
  const env = readUpstashEnv();
  if (env) {
    instance = new UpstashKv(new Redis(env));
    return instance;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Upstash KV not configured. Expected KV_REST_API_URL + KV_REST_API_TOKEN " +
        "(Vercel Marketplace) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN " +
        "(legacy). Connect Upstash via Vercel Storage → Marketplace (Production).",
    );
  }
  instance = new MemoryKv();
  return instance;
}

/* ---- Test helper ---- */
export function __setKvForTests(impl: KvLike | null): void {
  instance = impl;
}
