import type { Metadata } from "next";
import { PlayRedirect } from "./PlayRedirect";

/**
 * Stable "resume" entry point. A bookmark or installed app icon points here
 * instead of a frozen /p/<code>, so it always opens the player's *latest* code
 * (resolved on the device at open time) rather than the one captured when the
 * shortcut was saved. Never indexed.
 */
export const metadata: Metadata = {
  title: "Resuming…",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return <PlayRedirect />;
}
