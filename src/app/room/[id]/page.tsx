import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/kidsmart_logo.png" alt="KidSmart" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="font-display font-extrabold text-ks-dark">KidSmart AI</span>
        </Link>
        <ContinueButton roomId={roomId} />
      </header>

      <section className="mb-6">
        <LeaderboardView roomId={roomId} />
      </section>

      <InviteCard roomId={roomId} />
    </main>
  );
}
