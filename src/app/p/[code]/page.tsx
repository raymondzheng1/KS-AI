import { notFound } from "next/navigation";
import { GameShell } from "@/components/game/GameShell";
import { normalizeCode } from "@/lib/progress/code";
import { isFacilitator } from "@/lib/server/facilitator";

/**
 * The player's private game. The code in the path is the credential (§18).
 * We validate its shape server-side; the GameShell hydrates + syncs client-side.
 * Facilitator-only content renders only when the passcode cookie is set.
 */
export default async function PlayerPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = normalizeCode(decodeURIComponent(raw));
  if (!code) notFound();
  const facilitatorMode = await isFacilitator();
  return <GameShell code={code} facilitatorMode={facilitatorMode} />;
}
