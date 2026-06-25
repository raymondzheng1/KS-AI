"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Full-screen media viewer. Tap a diagram or video thumbnail to open it big
 * (fit to the screen width). Portaled to <body> so a sticky/backdrop-blur
 * ancestor can't pin it off-screen (Harness §15). Closes on ×, backdrop tap,
 * or Escape; locks body scroll while open.
 */
export function MediaLightbox({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="flex shrink-0 justify-end p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
        >
          ✕
        </button>
      </div>
      <div
        className="flex flex-1 items-center justify-center overflow-auto px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onClick={onClose}
      >
        <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
