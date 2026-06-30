"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CodePicker } from "@/components/CodePicker";
import { Sunny } from "@/components/Sunny";
import { useIsClient } from "@/lib/browser/useIsClient";
import { isCanonicalCode } from "@/lib/progress/code";

/**
 * "Save your key" panel. Shown once when a player first enters the game
 * (the sign-up reminder) and re-openable any time from the HUD 🔑 button.
 * Makes the code + private link easy to keep for rejoining later, and clearly
 * separates the display name (leaderboard only) from the code (the credential).
 * Solo players on a random code are offered a memorable custom code.
 */
export function CodeModal({
  code,
  nick,
  roomId,
  firstTime,
  onClose,
}: {
  code: string;
  nick?: string;
  roomId?: string;
  firstTime: boolean;
  onClose: () => void;
}) {
  const isClient = useIsClient();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [pickCustom, setPickCustom] = useState(false);

  const url = isClient ? `${window.location.origin}/p/${code}` : "";

  useEffect(() => {
    if (!url) return;
    let alive = true;
    QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: "#2E6FA3", light: "#FFFFFF" } })
      .then((d) => alive && setQr(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isClient) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — code is visible to copy by hand */
    }
  }

  // Only solo players (no room) on a server-generated code can safely switch —
  // changing a room member's code would orphan their leaderboard entry.
  const canCustomize = !roomId && isCanonicalCode(code);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ks-dark/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Your code"
      onClick={onClose}
    >
      <div
        className="ks-card relative max-h-[90dvh] w-full max-w-md overflow-hidden p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Always-visible close, so the panel can be dismissed without scrolling
            to the button on small screens. */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="ks-iconbtn absolute right-3 top-3 z-10"
        >
          ×
        </button>
        <div className="max-h-[90dvh] overflow-y-auto p-6 text-center">
        <div className="flex justify-center">
          <Sunny pose="poseWave" size={64} />
        </div>
        <h2 className="font-display text-2xl font-bold text-ks-dark">
          {firstTime ? "🔑 This is your key — save it!" : "🔑 Your key"}
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ks-ink">
          Your code is how you get back into your adventure — on this device or any other.
          Bookmark this page or copy your link.
        </p>

        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-ks-cream p-4">
          {qr && (
            // QR is a generated data: URL — next/image can't optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt="QR code to your private link"
              width={120}
              height={120}
              className="rounded-xl border-2 border-ks-dark/15 bg-white p-1"
            />
          )}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ks-slate">Your code</p>
            <p className="font-display text-2xl font-bold tracking-wide text-ks-dark">{code}</p>
          </div>
          <button onClick={copy} className="ks-btn ks-btn-coral ks-btn-sm" aria-live="polite">
            {copied ? "Copied! ✓" : "Copy my link"}
          </button>
        </div>

        <p className="mx-auto mt-3 max-w-sm text-xs text-ks-ink-soft">
          {nick ? (
            <>
              You show up as <b className="text-ks-dark">{nick}</b> on the leaderboard — that&apos;s
              just your display name. <b className="text-ks-dark">Your code above is your key.</b>
            </>
          ) : (
            <>
              Your nickname is only your display name on the leaderboard.{" "}
              <b className="text-ks-dark">Your code above is your key.</b>
            </>
          )}
        </p>

        {canCustomize && (
          <div className="mt-4 border-t border-ks-kraft/40 pt-4 text-left">
            {!pickCustom ? (
              <button
                onClick={() => setPickCustom(true)}
                className="text-sm font-semibold text-ks-dark"
              >
                ✏️ Want a code that&apos;s easier to remember?
              </button>
            ) : (
              <>
                <p className="mb-1 text-xs text-ks-ink-soft">
                  Pick a code you&apos;ll remember (3–20 letters or numbers) — you&apos;ll switch to
                  it now. Choose something only you&apos;d guess.
                </p>
                <CodePicker onUse={(c) => window.location.assign(`/p/${c}`)} cta="Switch to this" />
              </>
            )}
          </div>
        )}

        <button onClick={onClose} className="ks-btn ks-btn-green mt-5 w-full">
          {firstTime ? "Let's go →" : "Done"}
        </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
