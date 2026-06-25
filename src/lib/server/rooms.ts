/**
 * Server-side room operations over the KV store. Rooms are the competition
 * unit: a player joins via an invite link, picks a nickname, and competes on
 * that room's XP leaderboard. The leaderboard itself is computed on read
 * (Harness §3.5) — nothing derived is stored.
 */
import "server-only";
import { generateCode } from "@/lib/progress/code";
import { emptySynced, SyncedStateSchema, type SyncedState } from "@/lib/progress/schema";
import { ProfileSchema, RoomSchema, type Profile, type Room } from "@/lib/rooms/schema";
import { rankLeaderboard, type LeaderboardRow } from "@/lib/rooms/rank";
import { scorePlayer } from "@/lib/scoring/xp";
import { getKv } from "./kv";

const ROOM_KEY = (id: string) => `room:${id}`;
const MEMBERS_KEY = (id: string) => `room:${id}:members`;
const PROFILE_KEY = (code: string) => `profile:${code}`;
const PROGRESS_KEY = (code: string) => `progress:${code}`;

export async function getRoom(roomId: string): Promise<Room | null> {
  const raw = await getKv().get<unknown>(ROOM_KEY(roomId));
  const parsed = RoomSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function getProfile(code: string): Promise<Profile | null> {
  const raw = await getKv().get<unknown>(PROFILE_KEY(code));
  const parsed = ProfileSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function getMembers(roomId: string): Promise<string[]> {
  return getKv().smembers(MEMBERS_KEY(roomId));
}

/** A unique room id (canonical code), retried a few times against collisions. */
async function freshRoomId(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const id = generateCode();
    if (!(await getRoom(id))) return id;
  }
  // Astronomically unlikely; fall back to a longer composite.
  return `${generateCode()}-${generateCode()}`;
}

/** Ensure a nickname is unique within the room (case-insensitive), suffixing
 *  2,3,… if needed (e.g. "Nova" → "Nova2"). */
async function uniqueNick(roomId: string, nick: string): Promise<string> {
  const members = await getMembers(roomId);
  if (members.length === 0) return nick;
  const profiles = await getKv().mget<Profile>(members.map(PROFILE_KEY));
  const taken = new Set(
    profiles.filter(Boolean).map((p) => (p as Profile).nick.toLowerCase()),
  );
  if (!taken.has(nick.toLowerCase())) return nick;
  for (let n = 2; n < 100; n++) {
    const candidate = `${nick}${n}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return `${nick}${Math.floor(Math.random() * 9000) + 1000}`;
}

export interface CreateRoomResult {
  roomId: string;
  code: string;
  nick: string;
}

export async function createRoom(args: {
  name: string;
  nick: string;
  avatar: string;
  now: string;
}): Promise<CreateRoomResult> {
  const kv = getKv();
  const roomId = await freshRoomId();
  const code = generateCode();
  const room: Room = { id: roomId, name: args.name, hostCode: code, createdAt: args.now };
  const profile: Profile = {
    code,
    nick: args.nick,
    roomId,
    avatar: args.avatar,
    joinedAt: args.now,
  };
  await kv.set(ROOM_KEY(roomId), room);
  await kv.set(PROFILE_KEY(code), profile);
  await kv.sadd(MEMBERS_KEY(roomId), code);
  return { roomId, code, nick: args.nick };
}

export interface JoinRoomResult {
  code: string;
  nick: string;
}

export async function joinRoom(args: {
  roomId: string;
  nick: string;
  avatar: string;
  now: string;
}): Promise<JoinRoomResult | { error: "no_room" }> {
  const room = await getRoom(args.roomId);
  if (!room) return { error: "no_room" };
  const kv = getKv();
  const nick = await uniqueNick(args.roomId, args.nick);
  const code = generateCode();
  const profile: Profile = {
    code,
    nick,
    roomId: args.roomId,
    avatar: args.avatar,
    joinedAt: args.now,
  };
  await kv.set(PROFILE_KEY(code), profile);
  await kv.sadd(MEMBERS_KEY(args.roomId), code);
  return { code, nick };
}

export interface RoomLeaderboard {
  room: Room;
  rows: LeaderboardRow[];
}

/** Compute a room's leaderboard: fan out over members, score each, rank. */
export async function getRoomLeaderboard(roomId: string): Promise<RoomLeaderboard | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  const members = await getMembers(roomId);
  if (members.length === 0) return { room, rows: [] };

  const kv = getKv();
  const [profiles, progresses] = await Promise.all([
    kv.mget<Profile>(members.map(PROFILE_KEY)),
    kv.mget<unknown>(members.map(PROGRESS_KEY)),
  ]);

  const entries = members.map((code, i) => {
    const profile = ProfileSchema.safeParse(profiles[i]);
    const parsedProgress = SyncedStateSchema.safeParse(progresses[i]);
    const state: SyncedState = parsedProgress.success ? parsedProgress.data : emptySynced();
    return {
      code,
      nick: profile.success ? profile.data.nick : "Explorer",
      avatar: profile.success ? profile.data.avatar : "🙂",
      score: scorePlayer(state),
    };
  });

  return { room, rows: rankLeaderboard(entries) };
}
