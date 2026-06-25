/** Room + player-profile schemas (KV value shapes), validated at every boundary. */
import { z } from "zod";
import { isValidCode } from "@/lib/progress/code";

/** Room id is a short shareable canonical code (XXX-XXX). */
export const RoomIdSchema = z.string().refine(isValidCode, "invalid room id");

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(60),
  /** The player code of whoever created the room. */
  hostCode: z.string(),
  createdAt: z.string(),
});
export type Room = z.infer<typeof RoomSchema>;

export const ProfileSchema = z.object({
  code: z.string(),
  nick: z.string(),
  roomId: z.string(),
  avatar: z.string().default("🙂"),
  joinedAt: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;
