"use client";

import Link from "next/link";
import { getRoomCode } from "@/lib/rooms/client-identity";
import { useIsClient } from "@/lib/browser/useIsClient";

/** Shows a "continue playing" CTA if this device already has a code in the room,
 *  otherwise a "join" CTA. */
export function ContinueButton({ roomId }: { roomId: string }) {
  const isClient = useIsClient();
  if (!isClient) return null; // avoids hydration mismatch + flash

  const code = getRoomCode(roomId);

  return code ? (
    <Link
      href={`/p/${code}`}
      className="inline-block min-h-11 rounded-pill bg-ks-coral px-7 py-2.5 text-lg font-extrabold text-white shadow-card"
      style={{ borderRadius: "var(--radius-pill)" }}
    >
      ▶ Continue your adventure
    </Link>
  ) : (
    <Link
      href={`/join/${roomId}`}
      className="inline-block min-h-11 rounded-pill bg-ks-green px-7 py-2.5 text-lg font-extrabold text-white shadow-card"
      style={{ borderRadius: "var(--radius-pill)" }}
    >
      Join this room →
    </Link>
  );
}
