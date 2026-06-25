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
    <Link href={`/p/${code}`} className="ks-btn ks-btn-coral text-lg">
      ▶ Continue your adventure
    </Link>
  ) : (
    <Link href={`/join/${roomId}`} className="ks-btn ks-btn-coral text-lg">
      Join this room →
    </Link>
  );
}
