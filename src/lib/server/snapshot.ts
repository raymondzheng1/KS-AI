/**
 * Full restorable snapshot of the KV (Harness §2.3 — Tier-B backup). Room
 * rosters + nicknames live only in KV and are irreplaceable, so we provide a
 * token-gated export (and a daily cron commits it off-store).
 */
import "server-only";
import { getKv } from "./kv";

export interface KvSnapshot {
  exportedAt: string;
  rooms: Record<string, unknown>;
  members: Record<string, string[]>;
  profiles: Record<string, unknown>;
  progress: Record<string, unknown>;
}

async function dump(
  kv: ReturnType<typeof getKv>,
  pattern: string,
): Promise<Record<string, unknown>> {
  const keys = await kv.keys(pattern);
  const values = await kv.mget<unknown>(keys);
  const out: Record<string, unknown> = {};
  keys.forEach((k, i) => {
    if (values[i] !== null) out[k] = values[i];
  });
  return out;
}

export async function buildSnapshot(now: string): Promise<KvSnapshot> {
  const kv = getKv();
  const roomKeys = await kv.keys("room:*");
  const memberKeys = roomKeys.filter((k) => k.endsWith(":members"));

  const members: Record<string, string[]> = {};
  await Promise.all(
    memberKeys.map(async (k) => {
      members[k] = await kv.smembers(k);
    }),
  );

  // Plain room rows (exclude the :members set keys handled above).
  const rooms: Record<string, unknown> = {};
  const plainRoomKeys = roomKeys.filter((k) => !k.endsWith(":members"));
  const roomVals = await kv.mget<unknown>(plainRoomKeys);
  plainRoomKeys.forEach((k, i) => {
    if (roomVals[i] !== null) rooms[k] = roomVals[i];
  });

  return {
    exportedAt: now,
    rooms,
    members,
    profiles: await dump(kv, "profile:*"),
    progress: await dump(kv, "progress:*"),
  };
}
