"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/browser/useIsClient";

/**
 * Invite-a-friend card: a shareable link + QR code that opens the room's join
 * page. Anyone in the room can invite others — this is the "generate a link /
 * QR code" feature.
 */
export function InviteCard({ roomId }: { roomId: string }) {
  const isClient = useIsClient();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  const url = isClient ? `${window.location.origin}/join/${roomId}` : "";
  const canShare = isClient && typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    if (!url) return;
    let alive = true;
    QRCode.toDataURL(url, {
      width: 220,
      margin: 1,
      color: { dark: "#2E6FA3", light: "#FFFFFF" },
    })
      .then((d) => {
        if (alive) setQr(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);

  if (!isClient) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the link is visible to copy manually */
    }
  }

  async function share() {
    try {
      await navigator.share({ title: "Join my KidSmart AI room!", url });
    } catch {
      /* user cancelled or unsupported */
    }
  }

  return (
    <div className="ks-card p-5">
      <h2 className="text-lg font-extrabold text-ks-orange">📨 Invite friends</h2>
      <p className="mt-1 text-sm text-ks-ink">
        Share this link or QR code. Friends pick a nickname and join your leaderboard!
      </p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        {qr && (
          // QR is a generated data: URL — next/image can't optimise it.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qr}
            alt="QR code to join the room"
            width={140}
            height={140}
            className="rounded-xl border-2 border-ks-dark/15 bg-white p-1"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="break-all rounded-lg bg-ks-cream px-3 py-2 font-mono text-sm text-ks-dark">{url}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={copy} className="ks-btn ks-btn-coral">
              {copied ? "Copied! ✓" : "Copy link"}
            </button>
            {canShare && (
              <button onClick={share} className="ks-chip">
                Share…
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ks-ink-soft">
            Room code: <span className="font-mono font-bold text-ks-dark">{roomId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
