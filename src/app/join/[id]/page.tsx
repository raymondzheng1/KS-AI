import type { Metadata } from "next";
import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";
import { Sunny } from "@/components/Sunny";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";
import { normalizeCode } from "@/lib/progress/code";
import { getRoom } from "@/lib/server/rooms";

export const metadata: Metadata = {
  title: "Join a room",
  robots: { index: false, follow: false },
};

export default async function JoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const roomId = normalizeCode(decodeURIComponent(raw));
  const room = roomId ? await getRoom(roomId).catch(() => null) : null;

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-center py-4">
        <BrandLockup />
      </header>

      {!room ? (
        <div className="ks-card mt-6 p-6 text-center">
          <div className="text-4xl">🤔</div>
          <h1 className="mt-2 text-xl font-extrabold text-ks-dark">Room not found</h1>
          <p className="mt-1 text-ks-ink">This invite link doesn&apos;t match a room. Check it and try again.</p>
          <Link href="/start" className="ks-chip mt-4 inline-flex">Start fresh</Link>
        </div>
      ) : (
        <>
          <div className="mt-2 text-center">
            <div className="flex justify-center">
              <Sunny pose="poseWave" size={104} bob />
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-ks-green">You&apos;re invited to</p>
            <h1 className="font-display text-2xl font-bold text-ks-dark">🏆 {room.name}</h1>
            <p className="mt-1 text-ks-ink">Pick a nickname and start clearing AI hurdles!</p>
          </div>
          <div className="mt-5">
            <JoinRoomForm fixedRoomId={room.id} />
          </div>
        </>
      )}
    </main>
  );
}
