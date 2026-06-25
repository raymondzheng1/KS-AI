/**
 * Zod schemas for every API IO boundary (Harness §2.4). One definition per
 * shape, imported by both the route handler and its tests.
 */
import { z } from "zod";
import { SyncedStateSchema } from "@/lib/progress/schema";
import { isValidCode } from "@/lib/progress/code";

/* ---- Progress sync ---- */
export const SaveProgressInputSchema = z.object({
  code: z.string().refine(isValidCode, "invalid code"),
  state: SyncedStateSchema,
});
export type SaveProgressInput = z.infer<typeof SaveProgressInputSchema>;

/* ---- Facilitator mode ---- */
export const FacilitatorInputSchema = z.object({
  passcode: z.string().min(1).max(200),
});
export type FacilitatorInput = z.infer<typeof FacilitatorInputSchema>;

/* ---- Rooms ---- */
export const CreateRoomInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  nick: z.string().min(1).max(40),
  avatar: z.string().max(8).optional().default("🙂"),
  /** Optional player-chosen code; normalised + collision-checked server-side. */
  code: z.string().max(40).optional(),
});
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;

export const JoinRoomInputSchema = z.object({
  roomId: z.string().min(1).max(40),
  nick: z.string().min(1).max(40),
  avatar: z.string().max(8).optional().default("🙂"),
  /** Optional player-chosen code; normalised + collision-checked server-side. */
  code: z.string().max(40).optional(),
});
export type JoinRoomInput = z.infer<typeof JoinRoomInputSchema>;

/* ---- Contact form ---- */
export const ContactInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(4000),
  /** Hidden honeypot — must be empty (bots fill it). */
  website: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof ContactInputSchema>;
