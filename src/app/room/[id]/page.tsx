import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ContinueButton } from "@/components/room/ContinueButton";
import { InviteCard } from "@/components/room/InviteCard";
import { LeaderboardView } from "@/components/room/LeaderboardView";
import { normalizeCode } from "@/lib/progress/code";

export const metadata: Metadata = {
  title: "Room leaderboard",
  robots: { index: false, follow: false },
};

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const roomId = normalizeCode(decodeURIComponent(raw));
  if (!roomId) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-[max(1rem,env(safe-area-inset-top))] md:max-w-3xl">
      <SiteHeader action={<ContinueButton roomId={roomId} />} />

      <section className="mb-6 mt-2">
        <LeaderboardView roomId={roomId} />
      </section>

      <InviteCard roomId={roomId} />
    </main>
  );
}
