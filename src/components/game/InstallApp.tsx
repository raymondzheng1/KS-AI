"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/browser/useIsClient";

/**
 * Install nudge (Harness §19.2). Rendered by default with an adaptive CTA:
 * a one-tap Install once beforeinstallprompt has fired, else an iOS / browser-
 * menu hint. The × is session-scoped (sessionStorage) — only "installed" /
 * already-standalone hides it for good.
 */
interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

const DISMISS_KEY = "ksai:install-dismissed";

export function InstallApp() {
  const isClient = useIsClient();
  const [prompt, setPrompt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!isClient) return null;

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const sessionDismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
  if (installed || standalone || dismissed || sessionDismissed) return null;

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }

  return (
    <div className="mx-auto mt-4 max-w-2xl px-5">
      <div className="ks-card flex items-center gap-3 p-3 text-sm">
        <span className="text-2xl">📲</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ks-dark">Add KidSmart to your home screen</p>
          <p className="text-ks-ink-soft">
            {prompt
              ? "Install it like an app and jump straight back to your adventure."
              : isIos
                ? "Tap the Share button, then “Add to Home Screen”."
                : "Use your browser menu → “Install” / “Add to Home screen”."}
          </p>
        </div>
        {prompt && (
          <button onClick={install} className="ks-btn ks-btn-coral shrink-0">
            Install
          </button>
        )}
        <button
          onClick={() => {
            window.sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          aria-label="Dismiss"
          className="shrink-0 text-ks-ink-soft hover:text-ks-dark"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
